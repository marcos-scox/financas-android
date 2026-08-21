import re
from pathlib import Path

path = Path('/home/ubuntu/financas-android/financas-local.html')
text = path.read_text(encoding='utf-8')
patterns = [
    (r'gsk_[A-Za-z0-9_-]{20,}', 'REMOVED_API_KEY'),
    (r'sk-[A-Za-z0-9_-]{20,}', 'REMOVED_API_KEY'),
    (r'AIza[A-Za-z0-9_-]{20,}', 'REMOVED_API_KEY'),
]
for pattern, replacement in patterns:
    text = re.sub(pattern, replacement, text)
path.write_text(text, encoding='utf-8')
