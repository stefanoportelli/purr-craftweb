# Cinderwatch

**Cinderwatch** è un tower defense 3D isometrico auto-giocante (*self-playing*), realizzato originariamente come applicazione web *single-file* e scomposto in moduli funzionali per facilitarne la lettura, la manutenzione e le modifiche.

Non richiede build tool, server locale o dipendenze esterne: tutte le geometrie, le texture, i font pixel-art e gli effetti sonori sono generati proceduralmente via codice.

---

## Avvio rapido

Apri direttamente **`Cinderwatch.html`** con un doppio clic in qualsiasi browser moderno con supporto a **WebGL 2**.

> **Nota architetturale:** gli script vengono caricati in ordine tramite tag `<script src="...">` standard (invece di ES Modules) per garantire il funzionamento offline tramite protocollo `file://` senza errori CORS.

---

## Struttura del progetto

```text
cinderwatch/
├── Cinderwatch.html          # Entry point HTML e ordine di caricamento degli script
├── README.md                 # Questa documentazione
├── assets/
│   └── favicon.svg           # Icona SVG della fiamma
├── styles/
│   └── main.css              # Layout fullscreen, gestione safe-area mobile e splash screen
├── vendor/
│   └── three.min.js          # Motore 3D Three.js r170 (libreria di terze parti)
└── src/
    ├── utils.js              # Matematica, RNG deterministico, rumore procedurale e colori
    ├── graphics/
    │   ├── geometry.js       # Texture procedurali, shader materiali, mesh builder (Soup) e palette
    │   ├── renderer.js       # Pipeline WebGL e post-processing (AO, nebbia, DoF, bloom, dithering)
    │   └── fx.js             # Luci dinamiche, ombre, particelle (fiamme, esplosioni, fulmini) e meteo
    ├── world/
    │   ├── biomes.js         # Definizione dei 5 biomi (palette, illuminazione, meteo, nemici)
    │   ├── board.js          # Generatore procedurale di mappa, strada, fiume, piazzole e terreno
    │   └── props.js          # Costruzione di ponte, fortezza/faro, caverna e oggetti di scena
    ├── entities/
    │   └── models.js         # Mesh instanziate di unità/oggetti, rig di animazione e fisica detriti
    ├── game/
    │   ├── towers.js         # Statistiche, costruzione animata e logica di fuoco di torri e proiettili
    │   ├── units.js          # Statistiche, AI di movimento e combattimento di mostri, boss e guardie
    │   └── waves.js          # Generazione ondate, comandante IA auto-giocante e transizioni tra mappe
    ├── ui/
    │   └── hud.js            # Font e icone pixel-art su canvas 2D, menu contestuali e input
    ├── audio/
    │   └── audio.js          # Sintetizzatore procedurale Web Audio (effetti sonori, ambiente, musica)
    └── core/
        └── main.js           # Telecamera isometrica, game loop principale, scaling adattivo e boot
```

---

## Descrizione dei moduli (`src/`)

### Base e Grafica
* **`src/utils.js`**: funzioni matematiche (`clamp`, `lerp`, `damp`, easing), generatore di numeri pseudo-casuali con seed (`makeRng`), rumore procedurale 2D (`vnoise`, `fbm`, `pfbm`) e helper per manipolare i colori.
* **`src/graphics/geometry.js`**: genera la *DataArrayTexture* procedurale per i vari materiali (terra, roccia, muratura, legno, metallo, ecc.), personalizza gli shader standard di Three.js (`litMaterial`), definisce la classe `Soup` per assemblare geometrie 3D complesse e la palette base `COL`.
* **`src/graphics/renderer.js`**: gestisce il `WebGLRenderer`, i render target a risoluzione ridotta (stile pixel-art) e la catena di shader fullscreen: ambient occlusion e nebbia volumetrica (`atmo`), profondità di campo (`dof`), `bloom`, tone mapping filmico con dithering Bayer (`comp`) e upscaling nitido (`up`).
* **`src/graphics/fx.js`**: coordina le luci dinamiche (`LT`, tra cui luna, faro, torri, torce e flash), il sistema particellare instanziato (`FX` per fiamme, fumo, scintille, fulmini, decalcomanie a terra e camera shake) e il sistema meteo GPU (`WX`: neve, cenere, lucciole, sabbia).

### Mondo di Gioco
* **`src/world/biomes.js`**: configura i 5 biomi ciclici (**Ashen Pass**, **Frostfall**, **Mirefen**, **Emberscar**, **Duskmesa**), ognuno con i propri colori, illuminazione, acqua/lava, meteo, flora e nemici prevalenti.
* **`src/world/board.js`**: genera proceduralmente ogni isola/passo: calcola il percorso curvo della strada (`tryRoad`), il corso d'acqua (`tryStream`), posiziona le piazzole delle torri (`choosePads`), scolpisce il terreno in chunk 3D e crea la cascata sul bordo.
* **`src/world/props.js`**: modella le strutture fisse (ponte ad arco, fortezza con torre del faro, caverna di spawn) e distribuisce gli elementi scenografici e la vegetazione specifica di ciascun bioma (`PROP`, `BIOME_DRESS`).

### Entità e Logica di Gioco
* **`src/entities/models.js`**: costruisce i batch instanziati (`PartBatch`, `KIT`) per tutti i personaggi, mostri, armi e proiettili; contiene i sistemi di animazione procedurale (`rigHuman`, `rigSpider`, `rigWolf`, ecc.) e la fisica dei detriti/monete (`DEB`, `shatter`).
* **`src/game/towers.js`**: definisce i 4 tipi di torre (`archer`, `bombard`, `spire`, `guard`) con 3 livelli ciascuno, l'animazione di costruzione con impalcature, il puntamento e la fisica di frecce e proiettili d'artiglieria.
* **`src/game/units.js`**: contiene il bestiario completo (`MON`) con abilità speciali (volo, armatura, sdoppiamento, evocazione, invisibilità, rigenerazione, boss), la simulazione del movimento su corsie e i duelli corpo a corpo con i fanti delle caserme.
* **`src/game/waves.js`**: gestisce il ritmo delle ondate (`ROSTER`, `buildWave`), il comandante IA (`aiThink`) che costruisce e potenzia in autonomia finché il giocatore non interviene, e le fasi di fine partita o cambio mappa (`clear`, `defeat`, `crumble`, `rise`).

### Interfaccia, Audio e Motore
* **`src/ui/hud.js`**: implementa un motore di testo e icone pixel-art (`PX`) disegnato sul canvas `#hud`, i menu di costruzione/potenziamento, le barre vita, i suggerimenti sui nuovi nemici e la gestione completa di mouse, touch, tastiera e gamepad.
* **`src/audio/audio.js`**: motore audio procedurale basato su Web Audio API (`AU`). Sintetizza in tempo reale effetti sonori posizionali (archi, cannoni, fulmini, spade, ruggiti, corni, UI), rumori ambientali (vento, crepitio del fuoco) e accompagnamento musicale dinamico.
* **`src/core/main.js`**: controlla la telecamera ortografica isometrica (`CAM`, sia in modalità inseguimento automatico dell'azione sia manuale), esegue il loop di simulazione (`step`, `frame`), regola dinamicamente la qualità grafica in base agli FPS ed espone l'oggetto di debug `window.__cw`.

---

## Controlli principali

Il gioco parte in modalità **AI commander**: puoi osservarlo oppure prendere il controllo in qualsiasi momento interagendo con una piazzola.

| Input | Azione |
| :--- | :--- |
| **Click / Tap su piazzola** | Apri menu di costruzione o potenziamento (attiva il controllo manuale) |
| **`1` – `4`** | Seleziona rapidamente tipo di torre (Archers, Bombard, Spire, Guards) |
| **`U`** | Potenzia la torre selezionata o sotto il cursore |
| **`X` / `Canc`** | Vendi la torre selezionata (premi due volte per confermare) |
| **`Spazio` / `Invio`** | Chiama in anticipo l'ondata successiva (bonus oro) |
| **`C`** | Alterna tra controllo manuale e comandante IA |
| **`P`** | Pausa / Riprendi |
| **`Tab`** | Cambia velocità di gioco (`1x`, `2x`, `3x`) |
| **`M`** | Attiva / Disattiva audio |
| **Trascinamento / `WASD` / Frecce** | Muovi la telecamera |
| **Rotellina / Pinch / `+` `-` / Doppio tap** | Zoom avanti / indietro |
| **`0` / `F` / `Home`** | Ripristina l'inseguimento automatico della telecamera |

---

## Parametri URL (Debug e Personalizzazione)

Puoi aggiungere parametri dopo `#` nell'URL del browser (combinandoli con `&`, es. `Cinderwatch.html#biome=frost&fps`):

* `#fps` — Mostra contatore FPS, risoluzione interna, draw call e numero di mostri.
* `#seed=1234` — Genera una mappa deterministica a partire dal seed indicato.
* `#biome=ashen|frost|fen|ember|dunes` — Forza il bioma iniziale.
* `#level=N` — Parte dal livello di difficoltà `N`.
* `#nodof` — Disattiva l'effetto profondità di campo (*Depth of Field*).
* `#noscale` — Disattiva il ridimensionamento automatico della qualità grafica.

---

## Dipendenze e Licenze

* **Three.js r170** (`vendor/three.min.js`) — Licenza MIT (Copyright 2010-2024 Three.js Authors).