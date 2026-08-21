# Design do FinAI — Finanças pessoais

## Direção do produto

O FinAI será um aplicativo de finanças pessoais para uso local, pensado para consulta rápida e lançamentos com uma mão em orientação portrait 9:16. A interface preserva a identidade visual do arquivo original: fundo azul-marinho profundo, cartões translúcidos, acentos azul, violeta, mint e rosa, tipografia de leitura rápida e valores numéricos monoespaçados.

## Lista de telas

| Tela | Conteúdo principal | Funcionalidade |
|---|---|---|
| **Resumo** | Saldo, entradas, despesas, distribuição mensal, gráfico de evolução e alertas | Consultar a situação financeira, navegar para lançamentos e abrir o cálculo de balanço |
| **Despesas** | Lista de despesas por categoria, valor, recorrência e documentos | Adicionar, editar, remover e ajustar valores de despesas |
| **Contas** | Contas bancárias e carteiras com saldo e tipo | Adicionar, editar e excluir contas locais |
| **Investimentos** | Posições, variação e sugestões | Registrar investimentos e visualizar evolução resumida |
| **Metas** | Cartões de objetivos com progresso e aporte | Criar metas, editar valores e registrar aportes |
| **Análise** | Notas financeiras e recomendações | Registrar observações e consultar uma análise local baseada nos dados disponíveis |
| **Balanço** | Modal ou folha inferior com receitas, despesas, saldo e notas | Conferir o fechamento do período e retornar ao resumo |
| **Formulários** | Folhas inferiores para novo lançamento, conta, investimento e meta | Entrada de dados com campos grandes, teclado adequado e confirmação clara |

## Navegação

A navegação primária será uma barra inferior com cinco destinos: Resumo, Despesas, Contas, Investimentos e Metas. A tela de Análise será acessada a partir do resumo ou de um item de navegação secundária. Em telas estreitas, ações contextuais ficam no topo ou em botão flutuante discreto, evitando menus laterais e reduzindo deslocamento do polegar.

## Fluxos principais

1. **Consultar o mês:** o usuário abre o Resumo, vê saldo e distribuição, toca em uma categoria e navega para a lista filtrada de Despesas.
2. **Adicionar uma despesa:** o usuário toca no botão de adicionar em Despesas, preenche descrição, categoria e valor, confirma, recebe feedback visual e retorna à lista atualizada.
3. **Ajustar uma despesa:** o usuário toca em um item, altera o valor ou usa os controles de incremento/decremento, salva e visualiza o impacto no saldo.
4. **Criar uma meta:** o usuário abre Metas, toca em adicionar, informa nome, valor-alvo e prazo, confirma e acompanha o progresso com um cartão dedicado.
5. **Registrar aporte:** o usuário abre uma meta, informa o valor do aporte, confirma e vê o progresso atualizado.
6. **Revisar balanço:** o usuário toca em Balanço no Resumo, consulta o detalhamento de receitas, despesas e saldo, fecha a folha inferior e retorna ao ponto anterior.
7. **Instalar no Android:** o usuário abre a versão publicada, usa o QR code para testar no Expo Go ou instala o APK/EAS Build quando o artefato estiver disponível; na versão web, usa “Adicionar à tela inicial” no navegador Android.

## Princípios de interação

Todos os botões terão feedback de pressão e estados de sucesso, erro ou carregamento. Formulários utilizarão `KeyboardAvoidingView`, campos com área de toque confortável e teclado numérico para valores. A persistência será local, sem exigir conta ou servidor para o funcionamento básico. Listas utilizarão componentes nativos eficientes e serão acessíveis por leitores de tela.

## Cores da marca

| Token | Cor | Uso |
|---|---|---|
| `background` | `#0F172A` | Fundo principal |
| `surface` | `rgba(148,163,184,0.075)` / `#111C33` | Cartões e folhas |
| `foreground` | `#E2E8F0` | Texto principal |
| `muted` | `#94A3B8` | Texto secundário |
| `primary` | `#3B82F6` | Ações principais e navegação ativa |
| `violet` | `#8B5CF6` | Gráficos e metas |
| `success` | `#10B981` | Entradas, progresso e estados positivos |
| `error` | `#F43F5E` | Despesas críticas, exclusões e alertas |
| `border` | `rgba(148,163,184,0.16)` | Divisores e contornos |

## Identidade

O ícone será quadrado, sem cantos arredondados desenhados, preenchendo a área inteira com um símbolo financeiro simples e reconhecível, combinando uma carteira ou gráfico ascendente com os acentos azul e violeta sobre o fundo azul-marinho.
