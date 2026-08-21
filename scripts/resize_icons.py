from PIL import Image
from pathlib import Path

root = Path('/home/ubuntu/financas-android/assets/images')
source = root / 'icon.png'
image = Image.open(source).convert('RGBA')
for name, size in {
    'icon.png': 1024,
    'android-icon-foreground.png': 432,
    'splash-icon.png': 512,
    'favicon.png': 256,
}.items():
    target = root / name
    image.resize((size, size), Image.Resampling.LANCZOS).save(target, optimize=True)
