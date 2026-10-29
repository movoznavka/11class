#!/usr/bin/env python3
"""
Додає рядок <script src="memes.js"></script> перед </body> в усі файли ТЕСТІВ.

Як користуватись:
  1. Покладіть цей файл у папку з усіма .html (там, де index.html).
  2. Запустіть:  python3 add_memes_to_tests.py
Пропускає index.html та уроки (файли, що починаються з "urok-").
Файли, де рядок уже є, не чіпає. Нічого більше не змінює.
"""
import glob, os

LINE = '<script src="memes.js"></script>'
changed, skipped = 0, 0

for path in sorted(glob.glob("*.html")):
    name = os.path.basename(path)
    if name == "index.html" or name.startswith("urok-"):
        continue
    with open(path, encoding="utf-8") as f:
        text = f.read()
    if "memes.js" in text or "</body>" not in text:
        skipped += 1
        continue
    i = text.rindex("</body>")
    text = text[:i] + LINE + "\n" + text[i:]
    with open(path, "w", encoding="utf-8") as f:
        f.write(text)
    changed += 1
    print("додано:", name)

print(f"\nГотово. Змінено файлів: {changed}, пропущено: {skipped}")
