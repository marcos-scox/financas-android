import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useMemo, useState } from "react";
import {
  Alert,
  FlatList,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";

const STORAGE_KEY = "finai-local-state-v1";
type Expense = { id: string; title: string; category: string; value: number };
type Goal = { id: string; title: string; target: number; saved: number };
type Account = { id: string; title: string; kind: string; balance: number };
type AppState = { income: number; expenses: Expense[]; goals: Goal[]; accounts: Account[] };

const initialState: AppState = {
  income: 6500,
  expenses: [
    { id: "1", title: "Aluguel", category: "Moradia", value: 1800 },
    { id: "2", title: "Mercado", category: "Alimentação", value: 620 },
    { id: "3", title: "Transporte", category: "Mobilidade", value: 280 },
  ],
  goals: [{ id: "g1", title: "Reserva de emergência", target: 12000, saved: 7200 }],
  accounts: [{ id: "a1", title: "Conta principal", kind: "Banco", balance: 3800 }],
};

const money = (value: number) => `R$ ${value.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`;
const tabs = ["Resumo", "Despesas", "Contas", "Metas", "Investimentos"];

export default function HomeScreen() {
  const colors = useColors();
  const [state, setState] = useState<AppState>(initialState);
  const [tab, setTab] = useState("Resumo");
  const [modal, setModal] = useState<"expense" | "goal" | "account" | null>(null);
  const [title, setTitle] = useState("");
  const [value, setValue] = useState("");
  const [category, setCategory] = useState("");

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((raw) => raw && setState(JSON.parse(raw)));
  }, []);
  useEffect(() => {
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const totalExpenses = useMemo(() => state.expenses.reduce((sum, item) => sum + item.value, 0), [state.expenses]);
  const balance = state.income - totalExpenses;
  const openModal = (kind: "expense" | "goal" | "account") => { setTitle(""); setValue(""); setCategory(""); setModal(kind); };
  const saveModal = () => {
    const numeric = Number(value.replace(",", "."));
    if (!title.trim() || !numeric || numeric < 0) { Alert.alert("Confira os dados", "Informe um nome e um valor válido."); return; }
    if (modal === "expense") setState((s) => ({ ...s, expenses: [...s.expenses, { id: Date.now().toString(), title: title.trim(), category: category.trim() || "Outros", value: numeric }] }));
    if (modal === "goal") setState((s) => ({ ...s, goals: [...s.goals, { id: Date.now().toString(), title: title.trim(), target: numeric, saved: 0 }] }));
    if (modal === "account") setState((s) => ({ ...s, accounts: [...s.accounts, { id: Date.now().toString(), title: title.trim(), kind: category.trim() || "Conta", balance: numeric }] }));
    setModal(null);
  };
  const removeExpense = (id: string) => setState((s) => ({ ...s, expenses: s.expenses.filter((item) => item.id !== id) }));
  const addAporte = (goal: Goal) => { const amount = Number(value.replace(",", ".")); if (!amount) return; setState((s) => ({ ...s, goals: s.goals.map((g) => g.id === goal.id ? { ...g, saved: Math.min(g.target, g.saved + amount) } : g) })); setValue(""); };

  const renderSummary = () => (
    <>
      <View style={styles.hero}><Text style={styles.eyebrow}>VISÃO DO MÊS</Text><Text style={styles.heading}>Suas finanças, com clareza.</Text><Text style={styles.muted}>Tudo salvo neste dispositivo.</Text></View>
      <View style={[styles.card, styles.featured]}><Text style={styles.label}>SALDO DISPONÍVEL</Text><Text style={styles.big}>{money(balance)}</Text><View style={styles.row}><Text style={styles.muted}>Entradas {money(state.income)}</Text><Text style={styles.positive}>+ {Math.round((balance / state.income) * 100)}% livre</Text></View></View>
      <View style={styles.grid}><View style={styles.smallCard}><Text style={styles.label}>DESPESAS</Text><Text style={styles.medium}>{money(totalExpenses)}</Text><Text style={styles.muted}>{state.expenses.length} lançamentos</Text></View><View style={styles.smallCard}><Text style={styles.label}>ECONOMIA</Text><Text style={[styles.medium, styles.positive]}>{money(Math.max(balance, 0))}</Text><Text style={styles.muted}>neste mês</Text></View></View>
      <View style={styles.card}><View style={styles.row}><Text style={styles.sectionTitle}>Metas em andamento</Text><Pressable onPress={() => setTab("Metas")}><Text style={styles.link}>Ver todas</Text></Pressable></View>{state.goals.map((goal) => <View key={goal.id} style={styles.goalLine}><View style={styles.row}><Text style={styles.itemTitle}>{goal.title}</Text><Text style={styles.muted}>{Math.round((goal.saved / goal.target) * 100)}%</Text></View><View style={styles.track}><View style={[styles.fill, { width: `${Math.min(100, goal.saved / goal.target * 100)}%`, backgroundColor: colors.primary }]} /></View><Text style={styles.muted}>{money(goal.saved)} de {money(goal.target)}</Text></View>)}</View>
      <View style={styles.card}><Text style={styles.sectionTitle}>Últimas despesas</Text>{state.expenses.slice(-3).reverse().map((item) => <View key={item.id} style={styles.listRow}><View><Text style={styles.itemTitle}>{item.title}</Text><Text style={styles.muted}>{item.category}</Text></View><Text style={styles.negative}>− {money(item.value)}</Text></View>)}</View>
      <Pressable style={styles.primaryButton} onPress={() => setModal("expense")}><Text style={styles.buttonText}>+ Novo lançamento</Text></Pressable>
    </>
  );

  const renderList = () => {
    if (tab === "Despesas") return <View style={styles.card}><View style={styles.row}><Text style={styles.sectionTitle}>Despesas</Text><Pressable style={styles.addButton} onPress={() => openModal("expense")}><Text style={styles.addText}>+ Adicionar</Text></Pressable></View>{state.expenses.map((item) => <View key={item.id} style={styles.listRow}><View><Text style={styles.itemTitle}>{item.title}</Text><Text style={styles.muted}>{item.category}</Text></View><View style={styles.row}><Text style={styles.negative}>− {money(item.value)}</Text><Pressable onPress={() => removeExpense(item.id)}><Text style={styles.delete}>×</Text></Pressable></View></View>)}</View>;
    if (tab === "Contas") return <View style={styles.card}><View style={styles.row}><Text style={styles.sectionTitle}>Contas e carteiras</Text><Pressable style={styles.addButton} onPress={() => openModal("account")}><Text style={styles.addText}>+ Adicionar</Text></Pressable></View>{state.accounts.map((item) => <View key={item.id} style={styles.listRow}><View><Text style={styles.itemTitle}>{item.title}</Text><Text style={styles.muted}>{item.kind}</Text></View><Text style={styles.positive}>{money(item.balance)}</Text></View>)}</View>;
    if (tab === "Metas") return <View style={styles.card}><View style={styles.row}><Text style={styles.sectionTitle}>Metas financeiras</Text><Pressable style={styles.addButton} onPress={() => openModal("goal")}><Text style={styles.addText}>+ Nova meta</Text></Pressable></View>{state.goals.map((goal) => <View key={goal.id} style={styles.goalBox}><Text style={styles.itemTitle}>{goal.title}</Text><View style={styles.track}><View style={[styles.fill, { width: `${Math.min(100, goal.saved / goal.target * 100)}%`, backgroundColor: "#8B5CF6" }]} /></View><View style={styles.row}><Text style={styles.muted}>{money(goal.saved)} de {money(goal.target)}</Text><TextInput value={value} onChangeText={setValue} keyboardType="decimal-pad" placeholder="Aporte" placeholderTextColor={colors.muted} style={styles.aporteInput} /><Pressable onPress={() => addAporte(goal)}><Text style={styles.link}>Aportar</Text></Pressable></View></View>)}</View>;
    return <View style={styles.card}><Text style={styles.sectionTitle}>{tab}</Text><Text style={styles.muted}>Este espaço está pronto para organizar seus {tab.toLowerCase()} localmente.</Text><View style={styles.empty}><Text style={styles.emptyIcon}>↗</Text><Text style={styles.itemTitle}>Em construção</Text><Text style={styles.muted}>Adicione seus dados quando quiser.</Text></View></View>;
  };

  return <ScreenContainer containerClassName="bg-background" className="px-4 pt-5"><KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === "ios" ? "padding" : undefined}><View style={styles.topbar}><View><Text style={styles.brand}>FinAI</Text><Text style={styles.brandSub}>FINANÇAS PESSOAIS</Text></View><Text style={styles.avatar}>FA</Text></View><FlatList data={[{ key: "content" }]} renderItem={() => tab === "Resumo" ? renderSummary() : renderList()} keyExtractor={(item) => item.key} showsVerticalScrollIndicator={false} contentContainerStyle={styles.content} /><View style={styles.tabs}>{tabs.map((item) => <Pressable key={item} onPress={() => setTab(item)} style={styles.tab}><Text style={[styles.tabText, tab === item && { color: colors.primary }]}>{item}</Text></Pressable>)}</View></KeyboardAvoidingView><Modal visible={modal !== null} transparent animationType="slide" onRequestClose={() => setModal(null)}><View style={styles.modalShade}><View style={styles.modal}><View style={styles.row}><Text style={styles.sectionTitle}>{modal === "expense" ? "Nova despesa" : modal === "goal" ? "Nova meta" : "Nova conta"}</Text><Pressable onPress={() => setModal(null)}><Text style={styles.close}>×</Text></Pressable></View><TextInput value={title} onChangeText={setTitle} placeholder="Nome" placeholderTextColor={colors.muted} style={styles.input} /><TextInput value={value} onChangeText={setValue} placeholder={modal === "goal" ? "Valor da meta" : "Valor"} keyboardType="decimal-pad" placeholderTextColor={colors.muted} style={styles.input} />{modal !== "goal" && <TextInput value={category} onChangeText={setCategory} placeholder={modal === "expense" ? "Categoria" : "Tipo de conta"} placeholderTextColor={colors.muted} style={styles.input} />}<Pressable style={styles.primaryButton} onPress={saveModal}><Text style={styles.buttonText}>Salvar</Text></Pressable></View></View></Modal></ScreenContainer>;
}

const styles = StyleSheet.create({ flex: { flex: 1 }, hero: { marginBottom: 18 }, topbar: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }, brand: { color: "#E2E8F0", fontSize: 22, fontWeight: "700" }, brandSub: { color: "#64748B", fontSize: 9, letterSpacing: 1.5, marginTop: 2 }, avatar: { color: "#BFDBFE", backgroundColor: "#1E3A8A", borderRadius: 18, padding: 9, fontSize: 12, fontWeight: "700" }, content: { paddingBottom: 84, gap: 14 }, eyebrow: { color: "#64748B", fontSize: 10, letterSpacing: 2, fontWeight: "600" }, heading: { color: "#E2E8F0", fontSize: 26, fontWeight: "700", marginTop: 5 }, muted: { color: "#94A3B8", fontSize: 12, lineHeight: 18 }, label: { color: "#64748B", fontSize: 10, letterSpacing: 1.2, fontWeight: "600" }, big: { color: "#E2E8F0", fontSize: 32, fontWeight: "700", marginVertical: 9 }, medium: { color: "#E2E8F0", fontSize: 18, fontWeight: "700", marginVertical: 7 }, card: { backgroundColor: "#111C33", borderColor: "rgba(148,163,184,0.16)", borderWidth: 1, borderRadius: 18, padding: 17, gap: 12 }, featured: { borderColor: "rgba(59,130,246,0.34)" }, smallCard: { flex: 1, backgroundColor: "#111C33", borderColor: "rgba(148,163,184,0.16)", borderWidth: 1, borderRadius: 16, padding: 15 }, grid: { flexDirection: "row", gap: 12 }, row: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", gap: 8 }, positive: { color: "#10B981", fontSize: 12, fontWeight: "600" }, negative: { color: "#F43F5E", fontSize: 12, fontWeight: "600" }, sectionTitle: { color: "#E2E8F0", fontSize: 16, fontWeight: "700" }, link: { color: "#60A5FA", fontSize: 12, fontWeight: "600" }, goalLine: { gap: 5 }, track: { height: 7, backgroundColor: "rgba(148,163,184,0.12)", borderRadius: 8, overflow: "hidden", marginTop: 6 }, fill: { height: "100%", borderRadius: 8 }, itemTitle: { color: "#E2E8F0", fontSize: 14, fontWeight: "600" }, listRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingVertical: 11, borderBottomColor: "rgba(148,163,184,0.09)", borderBottomWidth: 1, gap: 8 }, primaryButton: { backgroundColor: "#3B82F6", borderRadius: 12, alignItems: "center", paddingVertical: 13, marginTop: 2 }, buttonText: { color: "#fff", fontSize: 13, fontWeight: "700" }, tabs: { position: "absolute", bottom: 0, left: 0, right: 0, flexDirection: "row", backgroundColor: "#0B1120", borderTopColor: "rgba(148,163,184,0.16)", borderTopWidth: 1, paddingVertical: 12 }, tab: { flex: 1, alignItems: "center" }, tabText: { color: "#64748B", fontSize: 10, fontWeight: "600" }, addButton: { backgroundColor: "rgba(59,130,246,0.15)", paddingHorizontal: 10, paddingVertical: 7, borderRadius: 8 }, addText: { color: "#93C5FD", fontSize: 11, fontWeight: "700" }, delete: { color: "#F43F5E", fontSize: 22, paddingLeft: 8 }, goalBox: { gap: 8, paddingBottom: 12, borderBottomColor: "rgba(148,163,184,0.09)", borderBottomWidth: 1 }, aporteInput: { width: 78, height: 34, paddingHorizontal: 8, borderRadius: 8, color: "#E2E8F0", borderColor: "rgba(148,163,184,0.16)", borderWidth: 1, backgroundColor: "#0F172A", fontSize: 11 }, empty: { alignItems: "center", paddingVertical: 40, gap: 6 }, emptyIcon: { color: "#8B5CF6", fontSize: 36 }, modalShade: { flex: 1, justifyContent: "flex-end", backgroundColor: "rgba(2,6,23,0.72)" }, modal: { backgroundColor: "#111C33", borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 22, gap: 12, paddingBottom: 32 }, close: { color: "#94A3B8", fontSize: 28 }, input: { backgroundColor: "#0F172A", borderColor: "rgba(148,163,184,0.2)", borderWidth: 1, borderRadius: 10, color: "#E2E8F0", paddingHorizontal: 12, paddingVertical: 12, fontSize: 14 } });
