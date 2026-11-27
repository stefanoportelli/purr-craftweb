# Purr-craft

**Purr-craft** è un tower defense 3D isometrico ambientato in un **Laboratorio Segreto**, evoluto a partire dall'architettura modulare WebGL di *Cinderwatch*. Al posto delle classiche torrette fisse, il giocatore schiera **Gatti Base** e li fa mutare in tempo reale iniettando fino a **4 fiale di DNA elementale** (Fuoco ed Elettrico/Laser), sbloccando evoluzioni pure e forme ibride avanzate.

Non richiede build tool, bundler o dipendenze esterne oltre a Three.js: tutte le geometrie 3D, le texture, le icone pixel-art, la musica e gli effetti sonori sono sintetizzati proceduralmente via codice.

---

## Avvio rapido

Apri direttamente **`index.html`** (o `Cinderwatch.html` se non ancora rinominato) in qualsiasi browser moderno con supporto a **WebGL 2**, oppure servilo tramite un server statico locale / GitHub Pages.

> **Nota architetturale:** gli script vengono caricati in ordine tramite tag `<script src="...">` standard (invece di ES Modules) per garantire la massima compatibilità anche offline tramite protocollo `file://` senza errori CORS.

---

## Struttura del progetto

```text
purr-craftweb/
├── index.html                # Entry point HTML e ordine di caricamento degli script
├── README.md                 # Questa documentazione
├── assets/
│   └── favicon.svg           # Icona SVG del progetto
├── styles/
│   └── main.css              # Layout fullscreen, gestione safe-area mobile e splash screen
├── spike/                    # Showroom 3D e banchi prova audio interattivi standalone
├── vendor/
│   └── three.min.js          # Motore 3D Three.js r170 (libreria di terze parti)
└── src/
    ├── utils.js              # Matematica, RNG deterministico, rumore procedurale e colori
    ├── graphics/
    │   ├── geometry.js       # Texture procedurali, shader materiali, mesh builder (Soup) e palette
    │   ├── renderer.js       # Pipeline WebGL e post-processing (AO, nebbia, DoF, bloom, dithering)
    │   └── fx.js             # Luci dinamiche, ombre, particelle (fiamme, esplosioni, laser) e meteo
    ├── world/
    │   ├── biomes.js         # Definizione dei biomi/ambientazioni, palette e illuminazione
    │   ├── board.js          # Generatore procedurale di mappa, percorso, piazzole e terreno
    │   └── props.js          # Costruzione di strutture scenografiche, portali di spawn e oggetti lab
    ├── entities/
    │   └── models.js         # Modelli 3D instanziati di Gatti e Mostri mutanti, rig e fisica detriti
    ├── game/
    │   ├── towers.js         # Sistema DNA (0-4 slot), profili evolutivi dei Gatti, laser e palle di fuoco
    │   ├── units.js          # Statistiche, abilità e movimento del bestiario mutante e Boss
    │   └── waves.js          # Gestione ondate, pausa tattica iniziale, economia DNA e IA di supporto
    ├── ui/
    │   └── hud.js            # Font e icone pixel-art su canvas 2D, menu mutazione DNA e controlli
    ├── audio/
    │   └── audio.js          # Sintetizzatore Web Audio (ambiente Laboratorio, SFX evolutivi, Debug Mixer)
    └── core/
        └── main.js           # Telecamera isometrica, game loop principale, scaling adattivo e boot
```

---

## Sistema di Gioco: Gatti & Mutazioni DNA

Ogni piazzola libera permette di schierare un **Gatto Graffiatore (0 DNA)** al costo di `50 DNA`. Selezionando un gatto in campo è possibile iniettare fino a **4 fiale di DNA** (`30 / 50 / 80 / 120 DNA`), combinando liberamente gli elementi disponibili:

* **0 DNA — Gatto Graffiatore (`TERRA`):** attacco rapido corpo a corpo con zampata estensibile su passerella meccanica.
* **Linea Pura Fuoco (`1-4 DNA Fuoco` · `TERRA`):** equipaggia zaino e lanciafiamme in stile *Ghostbusters* (singolo ugello ai Lv 1-2, doppio ugello ai Lv 3-4) sparando palle di fuoco balistiche con danno ad area (*Splash*), fino alla forma finale **Gatto Vulcano**.
* **Linea Pura Elettrica (`1-4 DNA Laser` · `ARIA`):** equipaggia **monocolo bionico olografico** con mirino rotante che abbatte i nemici volanti con raggi laser istantanei, fino al **Gatto Cyborg** (dotato di aura energetica azzurra e particelle ascendenti al Lv 4).
* **Forme Ibride Speciali (4 DNA):**
  * **Gatto Plasma (`2 Fuoco + 2 Elettrico` · `ARIA`):** scarica pesante ad alto danno singolo (`480 HP`) contro bersagli aerei corazzati.
  * **Magma Volt (`3 Fuoco + 1 Elettrico` · `TERRA`):** esplosioni ad area elettrificate con probabilità di micro-stordimento (*mini-stun*).
  * **Cyborg Pirotecnico (`3 Elettrico + 1 Fuoco` · `ARIA`):** raggio laser ad alta cadenza potenziato termicamente.
* **Scomposizione (Vendita):** ogni gatto può essere scomposto recuperando il **50%** del DNA totale investito.

---

## Descrizione dei moduli (`src/`)

### Base e Grafica
* **`src/utils.js`**: funzioni matematiche (`clamp`, `lerp`, `damp`, easing), generatore pseudo-casuale con seed (`makeRng`), rumore procedurale 2D (`vnoise`, `fbm`, `pfbm`) e gestione colori.
* **`src/graphics/geometry.js`**: genera la *DataArrayTexture* procedurale per i materiali, personalizza gli shader standard di Three.js (`litMaterial`) e definisce la classe `Soup` per assemblare geometrie 3D low-poly.
* **`src/graphics/renderer.js`**: gestisce il `WebGLRenderer`, i render target a risoluzione ridotta (estetica pixel-art) e il post-processing: ambient occlusion, nebbia (`atmo`), profondità di campo *tilt-shift* (`dof`), `bloom`, tone mapping con dithering Bayer (`comp`) e upscaling nitido (`up`).
* **`src/graphics/fx.js`**: coordina le luci dinamiche (`LT`), il sistema particellare instanziato (`FX` per esplosioni, fasci laser, scintille, fumo, decalcomanie e camera shake) e gli effetti atmosferici GPU (`WX`).

### Mondo di Gioco
* **`src/world/biomes.js`**: configura palette cromatiche, illuminazione, liquidi e atmosfera delle arene.
* **`src/world/board.js`**: genera proceduralmente la mappa di gioco, il tracciato dei nemici, la disposizione strategica delle piazzole e i chunk 3D del terreno.
* **`src/world/props.js`**: costruisce il nucleo da difendere, il varco d'ingresso dei mostri e gli elementi scenografici di contorno.

### Entità e Logica di Gioco
* **`src/entities/models.js`**: costruisce i batch instanziati (`PartBatch`, `KIT`) e le animazioni procedurali per tutte le evoluzioni dei Gatti (`rigGattoGraffiatore`, `rigGattoFuoco`, `rigGattoElettrico`, `makeHoloMonocle`, `makeCyberAura`) e per il bestiario di Purr-craft: **Polipetto di Melma** (sciame), **Abominio di Roccia** (tank), **Tentacolo Alato** (volante) e il Boss **Amalgama Infetta**.
* **`src/game/towers.js`**: gestisce la tabella costi DNA, il calcolo dinamico delle forme pure e ibride (`catProfile`), i plinti meccanici con passerella retraibile, i proiettili esplosivi e i raggi laser istantanei.
* **`src/game/units.js`**: regola movimento su corsie, punti vita, resistenze, stati alterati (rallentamento/stun) e abilità dei mostri mutanti.
* **`src/game/waves.js`**: scandisce le ondate di nemici e l'arrivo del Boss alla Wave 5, avvia la partita in **Pausa tattica** per consentire il piazzamento iniziale, gestisce l'economia del DNA e include il comandante IA opzionale (`aiThink`) capace di mutare i gatti in Fuoco o Laser in base alle minacce.

### Interfaccia, Audio e Motore
* **`src/ui/hud.js`**: motore di rendering pixel-art su canvas 2D (`PX`) con icone dedicate per gatti e slot DNA (`slotFire`, `slotElec`, `slotEmpty`), piazzamento rapido su piazzola libera, menu contestuale di mutazione con chiusura immediata alla selezione e anteprima live del raggio d'azione e della forma successiva.
* **`src/audio/audio.js`**: sintetizzatore Web Audio API (`AU`) progettato su misura per Purr-craft:
  * **Sottofondo Laboratorio Segreto** privo di fruscio continuo, composto da ronzio armonico caldo (`55 Hz / 110 Hz`), gocciolii riverberati, micro-scariche elettriche, bolle nelle vasche mutagene, accordi dark/piano e timpani dinamici legati alla tensione della battaglia.
  * **Effetti sonori stratificati per livello DNA (`Lv 1 -> 4`)** per Fuoco, Laser, forme ibride e iniezione fiale, con sistema anti-accumulo (*auto-ducking*) sulle raffiche del Gatto Vulcano Lv 4.
  * **Mixer Audio Debug In-Game** integrato con salvataggio automatico in `localStorage` ed esportazione JSON.
* **`src/core/main.js`**: controlla la telecamera ortografica isometrica (`CAM`), il loop di simulazione (`step`, `frame`), lo scaling adattivo degli FPS ed espone l'oggetto `window.__cw`.

---

## Controlli principali

La partita si avvia in **controllo manuale** e in **Pausa (`Paused`)**, così puoi studiare la mappa, piazzare i primi gatti e avviare l'azione quando sei pronto.

| Input | Azione |
| :--- | :--- |
| **Click / Tap su piazzola vuota** | Apre il pannello per piazzare un **Gatto Base** (`50 DNA`) |
| **Click / Tap su un Gatto** | Apre il menu di mutazione DNA (Fuoco / Laser / Vendi) |
| **`1`** | Inietta fiala **Fuoco** sul gatto selezionato (o arma il Gatto Base) |
| **`2` / `E`** | Inietta fiala **Laser (Elettrico)** sul gatto selezionato |
| **`X` / `Canc` / `Backspace`** | Vendi / Scomponi il gatto selezionato (premi due volte per confermare) |
| **`P`** | Pausa / Riprendi la partita |
| **`Spazio` / `Invio`** | Chiama in anticipo l'ondata successiva (bonus DNA) |
| **`Tab`** | Cambia velocità di gioco (`1x`, `2x`, `3x`) |
| **`C`** | Alterna tra controllo giocatore (`You command`) e IA (`AI commander`) |
| **`M`** | Attiva / Disattiva audio |
| **Trascinamento / `WASD` / Frecce** | Muovi la telecamera |
| **Rotellina / Pinch / `+` `-` / Doppio tap** | Zoom avanti / indietro |
| **`0` / `F` / `Home`** | Ripristina l'inseguimento automatico della telecamera |
| **`F9` / `Alt + A`** | Apre / Chiude il **Mixer Audio Debug** in-game |

---

## Modalità Debug e Parametri URL

### Mixer Audio Debug In-Game (`F9` / `#debug`)
Premendo **`F9`** (oppure **`Alt + A`**, o aprendo l'URL con `#debug` / `#audio`) compare in alto a destra il pannello interattivo **Audio Debug**:
* Regola in tempo reale i volumi di **Sottofondo Laboratorio** (*Master*, *Musica*, *Dettagli Lab*, *Ronzio 55Hz*, *Tensione Base*, *Vento*) e dei singoli gruppi **SFX Gatti & Mostri** (*Graffio*, *Fuoco Lv 1-3*, *Vulcano Lv 4*, *Laser*, *Ibridi 4 DNA*, *Fiala DNA*, *Mostri*).
* Include pulsanti di **Test Rapido** (attivi anche a gioco in pausa, inclusa la simulazione *Raffica Lv 4*).
* Salva automaticamente le preferenze in `localStorage` (`purrcraft.audioCfg`), permette il **Reset Default** e dispone del pulsante **Copia Config** per copiare negli appunti il JSON pronto da incollare nei `DEFAULTS` del codice.

### Parametri Hash URL
Puoi combinare più flag dopo `#` nell'URL del browser (es. `index.html#debug&nodof&fps`):

* `#debug` oppure `#audio` — Apre automaticamente all'avvio il **Mixer Audio Debug**.
* `#nodof` — Disattiva la sfocatura di profondità di campo (*Depth of Field / Tilt-Shift*), rendendo nitido anche lo sfondo lontano.
* `#fps` — Mostra contatore FPS, risoluzione interna, draw call e numero di mostri attivi.
* `#seed=1234` — Genera una mappa deterministica a partire dal seed indicato.
* `#biome=ashen|frost|fen|ember|dunes` — Forza la variante visiva della mappa iniziale.
* `#level=N` — Parte dal livello di difficoltà `N`.
* `#noscale` — Disattiva il ridimensionamento dinamico della risoluzione interna.

---

## Dipendenze e Licenze

* **Three.js r170** (`vendor/three.min.js`) — Licenza MIT (Copyright 2010-2024 Three.js Authors).