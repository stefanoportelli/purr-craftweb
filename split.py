import os
import re
import shutil

SRC_FILE = os.path.join("src", "game.js")
HTML_FILE = "Cinderwatch.html"

# (percorso file, riga di inizio del blocco successivo)
BLOCKS = [
    ("src/utils.js", None),
    ("src/graphics/geometry.js", "const L_DIRT = 0, L_ROCK = 1"),
    ("src/graphics/renderer.js", "const R = {"),
    ("src/world/biomes.js", "const COL0 = Object.assign({}, COL);"),
    ("src/world/board.js", "const BH = 18, CHUNK = 6, NCH = 6"),
    ("src/world/props.js", "const _segq = new THREE.Quaternion()"),
    ("src/graphics/fx.js", "const LT = {"),
    ("src/entities/models.js", "let RIG_CAPTURE = null;"),
    ("src/game/towers.js", "const G = {"),
    ("src/game/units.js", "const MON = {"),
    ("src/game/waves.js", "Object.assign(G, {"),
    ("src/ui/hud.js", "const PX = (() => {"),
    ("src/audio/audio.js", "const AU = (function () {"),
]

with open(SRC_FILE, "r", encoding="utf-8") as f:
    code = f.read().replace("\r\n", "\n")

# Rimuove la funzione involucro esterna (function(){ 'use strict'; ... })();
code = re.sub(r"^\s*\(function\s*\(\)\s*\{\s*", "", code, count=1)
code = re.sub(r"^\s*['\"]use strict['\"];?\s*", "", code, count=1)
code = re.sub(r"\s*\}\)\(\);?\s*$", "", code, count=1)

# Trova le posizioni di taglio in ordine sequenziale
cuts = [0]
pos = 0
for path, marker in BLOCKS[1:]:
    idx = code.find(marker, pos)
    if idx == -1:
        raise RuntimeError(f"Marcatore non trovato per {path}: {marker}")
    cuts.append(idx)
    pos = idx

# Separa la chiusura di AU dal loop principale (src/core/main.js)
au_end = code.find("\n})();", cuts[-1])
files = [b[0] for b in BLOCKS]
if au_end != -1:
    split_main = au_end + len("\n})();")
    if code[split_main:].strip():
        cuts.append(split_main)
        files.append("src/core/main.js")
cuts.append(len(code))

# Scrive tutti i moduli
for i, path in enumerate(files):
    chunk = code[cuts[i]:cuts[i + 1]].strip()
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, "w", encoding="utf-8") as out:
        out.write("'use strict';\n\n" + chunk + "\n")
    print(f"Creato: {path} ({chunk.count(chr(10)) + 1} righe)")

# Aggiorna Cinderwatch.html
script_tags = "\n".join(f'<script src="{p}"></script>' for p in files)
if os.path.exists(HTML_FILE):
    shutil.copy2(HTML_FILE, HTML_FILE + ".bak")
    with open(HTML_FILE, "r", encoding="utf-8") as f:
        html = f.read()
    target = '<script src="src/game.js"></script>'
    if target in html:
        html = html.replace(target, script_tags, 1)
        with open(HTML_FILE, "w", encoding="utf-8") as f:
            f.write(html)
        print(f"\nAggiornato {HTML_FILE} (backup salvato in {HTML_FILE}.bak)")
    else:
        print(f"\nTag {target} non trovato in {HTML_FILE}. Inserisci manualmente:\n{script_tags}")