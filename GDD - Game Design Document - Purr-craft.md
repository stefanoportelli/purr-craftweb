

[**1\. Executive Summary & Pitch Line	4**](#1.-executive-summary-&-pitch-line)

[Punti di Forza	4](#punti-di-forza)

[1.1 Panoramica del Progetto	4](#1.1-panoramica-del-progetto)

[1.2 Pilastri di Gameplay (Core Pillars)	4](#1.2-pilastri-di-gameplay-\(core-pillars\))

[1.3 Architettura Tecnica e Performance	5](#1.3-architettura-tecnica-e-performance)

[**2\. Core Gameplay Loop	6**](#2.-core-gameplay-loop)

[2.1 Meccanica Attiva — La Carica Felina (Puntatore Laser)	7](#2.1-meccanica-attiva-—-la-carica-felina-\(puntatore-laser\))

[**3: Catalogo e Meccaniche dei Gatti Genetici	8**](#3:-catalogo-e-meccaniche-dei-gatti-genetici)

[3.0 Regole Generali d'Ingaggio e Selezione Bersaglio (Targeting)	8](#3.0-regole-generali-d'ingaggio-e-selezione-bersaglio-\(targeting\))

[3.1 Il Gatto Base “Gatto Graffiatore” (0 DNA)	10](#3.1-il-gatto-base-“gatto-graffiatore”-\(0-dna\))

[3.2 Progressione di Stazza e Potenza (0 \- 4 DNA)	11](#3.2-progressione-di-stazza-e-potenza-\(0---4-dna\))

[3.3 Regola dei 2 Elementi e Profilo Bersaglio	12](#3.3-regola-dei-2-elementi-e-profilo-bersaglio)

[3.4 Forme Pure (1 Solo Elemento Dominante)	12](#3.4-forme-pure-\(1-solo-elemento-dominante\))

[🔴 Elemento Fuoco (Max: Gatto Vulcano)	12](#🔴-elemento-fuoco-\(max:-gatto-vulcano\))

[🔵 Elemento Acqua (Max: Gatto Ghiacciaio)	12](#🔵-elemento-acqua-\(max:-gatto-ghiacciaio\))

[🟡 Elemento Elettricità (Max: Gatto Cyborg)	13](#🟡-elemento-elettricità-\(max:-gatto-cyborg\))

[🟣 Elemento Ombra (Max: Gatto Fantasma)	14](#🟣-elemento-ombra-\(max:-gatto-fantasma\))

[3.5 Forme Ibride Bilanciate (2x Elemento A \+ 2x Elemento B)	15](#3.5-forme-ibride-bilanciate-\(2x-elemento-a-+-2x-elemento-b\))

[Tabella Riassuntiva Forme Ibride (2x2)	16](#tabella-riassuntiva-forme-ibride-\(2x2\))

[🔴🔵 Gatto Vapore (2x Fuoco \+ 2x Acqua)	17](#🔴🔵-gatto-vapore-\(2x-fuoco-+-2x-acqua\))

[🔴🟣 Gatto Infernale (2x Fuoco \+ 2x Ombra)	19](#🔴🟣-gatto-infernale-\(2x-fuoco-+-2x-ombra\))

[🔵🟡 Gatto Tempesta (2x Acqua \+ 2x Elettrico)	20](#🔵🟡-gatto-tempesta-\(2x-acqua-+-2x-elettrico\))

[🔵🟣 Gatto Abissale (2x Acqua \+ 2x Ombra)	22](#🔵🟣-gatto-abissale-\(2x-acqua-+-2x-ombra\))

[🟡🟣 Gatto Buco Nero (2x Elettrico \+ 2x Ombra)	23](#🟡🟣-gatto-buco-nero-\(2x-elettrico-+-2x-ombra\))

[3.6 Combinazioni Ibride Sbilanciate (3x1 — Dominanza Elementale)	25](#3.6-combinazioni-ibride-sbilanciate-\(3x1-—-dominanza-elementale\))

[1\. Regola sull'Ordine di Applicazione (Indipendenza dalla Sequenza)	25](#1.-regola-sull'ordine-di-applicazione-\(indipendenza-dalla-sequenza\))

[2\. Matrice Completa delle 12 Combinazioni 3x1	25](#2.-matrice-completa-delle-12-combinazioni-3x1)

[Ruolo Tattico del 3x1	27](#ruolo-tattico-del-3x1)

[3.7 Interazione sul Campo (Piazzamento, Mutazione e Scomposizione)	28](#3.7-interazione-sul-campo-\(piazzamento,-mutazione-e-scomposizione\))

[1\. Piazzamento	28](#1.-piazzamento)

[2\. Mutazione tramite Menu Radiale in Tempo Reale:	28](#2.-mutazione-tramite-menu-radiale-in-tempo-reale:)

[3\. Scomposizione DNA (Vendita Torretta):	28](#3.-scomposizione-dna-\(vendita-torretta\):)

[3.8 Costi di Mutazione e Progressività delle Fiale	28](#3.8-costi-di-mutazione-e-progressività-delle-fiale)

[3.9 Statistiche Base e Bilanciamento DPS (Capitolo 1\)	28](#3.9-statistiche-base-e-bilanciamento-dps-\(capitolo-1\))

[**4\. Mappa, Progressione e Stelle	30**](#4.-mappa,-progressione-e-stelle)

[4.0 Mappa dei Mondi (World Map) & Hub di Progressione	30](#4.0-mappa-dei-mondi-\(world-map\)-&-hub-di-progressione)

[1\. Layout Visivo e Struttura dei Mondi	30](#1.-layout-visivo-e-struttura-dei-mondi)

[2\. Tipologie di Nodi e Interazioni sulla Mappa	30](#2.-tipologie-di-nodi-e-interazioni-sulla-mappa)

[3\. Interfaccia dell'Hub (Dock & Risorse)	30](#3.-interfaccia-dell'hub-\(dock-&-risorse\))

[4\. Requisiti di Sblocco tra Capitoli	31](#4.-requisiti-di-sblocco-tra-capitoli)

[4.1. Sistema di Valutazione a 3 Stelle	32](#4.1.-sistema-di-valutazione-a-3-stelle)

[4.2. Sistema Achievement (Sfide Tattiche)	34](#4.2.-sistema-achievement-\(sfide-tattiche\))

[4.3. L’Albero dei Talenti Felino (Potenziamenti Passivi Permanenti)	35](#4.3.-l’albero-dei-talenti-felino-\(potenziamenti-passivi-permanenti\))

[4.3.1 Struttura Costi e Tier dell'Albero dei Talenti	35](#4.3.1-struttura-costi-e-tier-dell'albero-dei-talenti)

[4.3.2 Nodi dell'Albero dei Talenti (Esempi di Potenziamenti)	37](#4.3.2-nodi-dell'albero-dei-talenti-\(esempi-di-potenziamenti\))

[4.4 Guadagno dei Diamanti In-Game (Free-to-Play)	39](#4.4-guadagno-dei-diamanti-in-game-\(free-to-play\))

[4.5 Il Diamond Shop (Consumabili & Sblocchi)	41](#4.5-il-diamond-shop-\(consumabili-&-sblocchi\))

[A. Consumabili d'Emergenza (Usabili in Battaglia)	41](#a.-consumabili-d'emergenza-\(usabili-in-battaglia\))

[B. Sblocchi Permanenti & Cosmetici	44](#b.-sblocchi-permanenti-&-cosmetici)

[4.6 Microtransazioni IAP (Acquisto con Soldi Reali)	45](#4.6-microtransazioni-iap-\(acquisto-con-soldi-reali\))

[4.7 Modalità di Gioco Secondarie — Invasione Infinita (Endless / Survival)	46](#4.7-modalità-di-gioco-secondarie-—-invasione-infinita-\(endless-/-survival\))

[**5\. Ambienti e Sblocco Progressivo dei Mondi	49**](#5.-ambienti-e-sblocco-progressivo-dei-mondi)

[**6\. Stile Visivo e Direzione Artistica	50**](#6.-stile-visivo-e-direzione-artistica)

[6.1 Direzione Artistica e Stile Visivo	50](#6.1-direzione-artistica-e-stile-visivo)

[6.2 Audio & Sound Design	51](#6.2-audio-&-sound-design)

[**7\. Bestiario e Nemici — Capitolo 1: Il Laboratorio Segreto	52**](#7.-bestiario-e-nemici-—-capitolo-1:-il-laboratorio-segreto)

[7.1 Meccaniche Generali dei Nemici & Economia del DNA	52](#7.1-meccaniche-generali-dei-nemici-&-economia-del-dna)

[7.2 Tabella Bilanciamento Nemici (Capitolo 1\)	54](#7.2-tabella-bilanciamento-nemici-\(capitolo-1\))

[🟢 Polipetto di Melma (Sciame)	54](#🟢-polipetto-di-melma-\(sciame\))

[🪐 Abominio di Roccia (Tank)	54](#🪐-abominio-di-roccia-\(tank\))

[🦇 Tentacolo Alato (Aria)	55](#🦇-tentacolo-alato-\(aria\))

[🧠 Boss: Amalgama Infetta (Boss)	55](#🧠-boss:-amalgama-infetta-\(boss\))

[7.3 Progressioni e Curva d'Insegnamento nel Capitolo 1	57](#7.3-progressioni-e-curva-d'insegnamento-nel-capitolo-1)

[7.4 Struttura Livelli e Composizione Wave (Capitolo 1: Il Laboratorio Segreto)	58](#7.4-struttura-livelli-e-composizione-wave-\(capitolo-1:-il-laboratorio-segreto\))

[7.5 Layout Spaziale e Level Design delle Mappe (Capitolo 1\)	60](#7.5-layout-spaziale-e-level-design-delle-mappe-\(capitolo-1\))

[7.6 Flusso di Onboarding (Tutorial nei primi 60 secondi)	63](#7.6-flusso-di-onboarding-\(tutorial-nei-primi-60-secondi\))

[**8\. Interfaccia Utente e Layout Visivo (UI/UX)	64**](#8.-interfaccia-utente-e-layout-visivo-\(ui/ux\))

[8.1 Struttura dello Schermo (Wireframe Concettuale)	64](#8.1-struttura-dello-schermo-\(wireframe-concettuale\))

[8.2 Componenti dell'HUD e dell'Interfaccia	65](#8.2-componenti-dell'hud-e-dell'interfaccia)

[Come funziona lo Stack del Consumabile in Partita	65](#come-funziona-lo-stack-del-consumabile-in-partita)

[**9\. Specifiche Tecniche e Architettura Software	67**](#9.-specifiche-tecniche-e-architettura-software)

[9.1 Stack Tecnologico	67](#9.1-stack-tecnologico)

[9.2 Target Hardware e Performance Budget	67](#9.2-target-hardware-e-performance-budget)

[9.3 Architettura Software e Pattern di Sviluppo	68](#9.3-architettura-software-e-pattern-di-sviluppo)

[9.4 Approccio Data-Driven (Bilanciamento & Centralizzazione Parametri):	70](#9.4-approccio-data-driven-\(bilanciamento-&-centralizzazione-parametri\):)

[9.5 Gestione Dati e Sicurezza	70](#9.5-gestione-dati-e-sicurezza)

## 

# **1\. Executive Summary & Pitch Line** {#1.-executive-summary-&-pitch-line}

**Pitch:** In un mondo minacciato dall'invasione di abomini cosmici Lovecraftiani, l'unica linea di difesa dell'umanità sono i **Gatti Genetici**. Modifica il DNA dei tuoi gatti in tempo reale durante la battaglia, ingrandiscili e combina gli elementi per respingere le orde aliene\!

### **Punti di Forza** {#punti-di-forza}

* **Contrasto Comico/Narrativo:** Gatti buffi e carini contro mostri cosmici spaventosi.  
* **Mutazione Visiva in Tempo Reale:** Niente menu complessi. Trascina le fiale di DNA sui gatti durante la battaglia per modificarne la stazza e le abilità.  
* **Sistema Ibrido Naturale:** Fino a 2 elementi diversi per gatto per un totale di 4 slot DNA.  
* **Interazione Attiva:** Il giocatore interagisce direttamente col campo tramite il *Puntatore Laser*.

  ### **1.1 Panoramica del Progetto** {#1.1-panoramica-del-progetto}

* **Genere:** Tower Defense Mobile (Portrait / Orientamento Verticale).  
* **Target Audience:** Giocatori casual e mid-core su dispositivi iOS e Android.  
* **Stile Visivo & Narrativo:** Contrasto comico *Cartoon / Cell-Shaded* tra gatti morbidi e saturi e abomini Lovecraftiani scuri e vischiosi.  
* **Core Concept:** Il giocatore difende un laboratorio felino posizionando gatti mutanti e applicando fiale di DNA elementale (🔴 Fuoco, 🔵 Acqua, 🟡 Elettricità, 🟣 Ombra). Le fiale modificano la stazza (fino al *Chonker* Lv 4\) e creano forme ibride complesse (2x2 e 3x1).

  ### **1.2 Pilastri di Gameplay (Core Pillars)** {#1.2-pilastri-di-gameplay-(core-pillars)}

* **Mutazione Dinamica & Stacking:** Ogni torretta può ospitare fino a 4 fiale combinando un massimo di 2 elementi distinti. Scomposizione e rimborso DNA (50%-70%) per riadattare la difesa al volo.  
* **Interazione Diretta (Carica Felina):** Tocco sullo schermo per fissare un puntatore laser rosso statico per 5 secondi, evocando una calca felina travolgente sul campo di battaglia (20s di Cooldown).  
* **Doppia Economia Bilanciata:**  
  * *DNA (In-Game):* Risorsa tattica temporanea (+2/sec passivo \+ eliminazione nemici).  
  * *Stelle (★ Meta-Progressione):* Guadagnate completando livelli per potenziare l'Albero dei Talenti (Star Shop a 4 Tiers).  
  * *Diamanti (💎 Premium/Drop):* Utilizzati per acquistare consumabili d'emergenza con cooldown anti-spam.  
* **Progressione & Endgame:** Campagna a capitoli (5 Livelli con Boss per Capitolo) e modalità **Invasione Infinita (Endless)** con classifica globale e Mutatori Settimanali.

  ### **1.3 Architettura Tecnica e Performance** {#1.3-architettura-tecnica-e-performance}

* **Game Engine:** Godot Engine 4.x (Licenza MIT Open-Source) con sviluppo in C\# / GDScript.  
* **Performance Budget:** 60 FPS stabili, Peak RAM \< 200 MB, dimensione installazione (APK/IPA) \< 70 MB.  
* **Architettura Software:** *Signal Bus Pattern* per comunicazione disaccoppiata, *Custom Resources* (`.tres`) per i dati e *Node Pooling System* per la gestione fluida delle orde a schermo.


## 

# **2\. Core Gameplay Loop** {#2.-core-gameplay-loop}

```
 [ Seleziona Livello sulla Mappa ]
                │
                ▼
  [ Difendi il Laboratorio in Battaglia ]
  └─► Piazzi Gatti Base (Graffiatori)
  └─► Raccogli DNA dai mostri sconfitti
  └─► Trascini Fiale DNA sui Gatti (Aumenti Stazza / Crei Ibridi)
  └─► Usi il Puntatore Laser nei momenti critici
                │
                ▼
  [ Fine Partita: Valutazione 1-3 Stelle ] (in base alla Salute Base)
                │
                ▼
  [ Spendi le Stelle nello "Star Shop" ] ──► Sblocchi Potenziamenti Passivi Permanenti
```

## 

## 2.1 Meccanica Attiva — La Carica Felina (Puntatore Laser) {#2.1-meccanica-attiva-—-la-carica-felina-(puntatore-laser)}

Il Puntatore Laser è la principale abilità attiva d'emergenza del giocatore, basata sull'ossessione naturale dei gatti per il pallino rosso. Funziona come un attacco diretto ad area indipendente dalle torrette sul campo.

**Profilo Bersaglio:** 🌐 **ENTRAMBI** (Colpisce sia unità Terrestri che Volanti).

**Funzionamento & Attacco:**

* **Innesco & Area:** Il giocatore tocca un punto qualsiasi della mappa per far comparire il punto rosso luminoso, generando un'area d'effetto circolare fissa con un **raggio di 2.0 unità di griglia**.  
* **Feedback Visivo:** L'area d'azione viene evidenziata da un bagliore rosso traslucido sul terreno, mentre dai bordi dello schermo sbucano decine di gattini selvaggi che corrono e saltano verso il punto rosso.  
* **Interazione Unità Aeree:** I gattini eseguono balzi acrobatici per afferrare al volo anche le unità alate. Qualsiasi nemico presente nell'area subisce Danno Fisico Diretto da Graffio pari a **10 HP/sec** e un effetto di rallentamento della velocità di movimento.

**Durata & Cooldown:**

* **Autonomia (Batteria):** **5 secondi** di attività continua sul campo.  
* **Tempo di Ricarica (Cooldown):** **20 secondi** prima di poter riutilizzare l'abilità.

**UI & Feedback Visivo sul Cooldown:**

* **Icona sul Dock:** Tasto circolare dedicato sul lato dell'HUD con l'icona del laser.  
* **Indicatore di Ricarica:** Durante il cooldown, l'icona si oscura mostrando un riempimento radiale a 360° e un timer numerico in tempo reale (es. *20s... 19s... 18s*).  
* **Stato Pronto:** L'icona pulsa di rosso con un breve effetto di bagliore e un miagolio corale di carica quando il timer arriva a zero.

**Flusso Logico e Requisiti di Sistema (LaserAbilityComponent):**

* **Rilevamento Bersagli:** L'area circolare deve registrare ed elaborare contemporaneamente le collisioni di tutti i nemici presenti al suo interno, senza filtrare per tipo di unità (ingaggia sia Terrestri che Volanti).  
* **Applicazione Effetti & Tick Rate (0.5s):** Per tutta la durata dell'autonomia (5.0 secondi totali), l'abilità esegue un impulso di controllo ogni **0.5 secondi** (10 impulsi complessivi). Ad ogni impulso:  
  * Sottrae istantaneamente **5 HP** dalla salute corrente di ciascun nemico nell'area (pari a 10 HP/sec totali).  
  * Applica o rinnova l'effetto di rallentamento della velocità, che si dissolve non appena il nemico esce dall'area o allo spegnimento del laser.  
* **Calcolo Dinamico del Rallentamento (Integrazione Talento *Lente Focale*):** L'intensità del rallentamento viene determinata all'attivazione dell'abilità interrogando lo stato della meta-progressione:  
  * *Valore Base (Default):* Rallentamento del **25%** sulla velocità di movimento (moltiplicatore velocità \= 0.75).  
  * *Valore Potenziato (Talento Lente Focale Sbloccato):* Se il nodo Capstone *Lente Focale* (Sezione 4.3.2) risulta sbloccato nell'Albero dei Talenti, si applica un incremento addizionale del \+15%, portando il rallentamento complessivo al **40%** (moltiplicatore velocità \= 0.60).

# **3: Catalogo e Meccaniche dei Gatti Genetici** {#3:-catalogo-e-meccaniche-dei-gatti-genetici}

I gatti fungono da torrette difensive su mappe a percorso fisso. Vengono posizionati su piazzole predefinite e mutati in tempo reale durante la battaglia tramite le Fiale Mutagene di DNA.

## 3.0 Regole Generali d'Ingaggio e Selezione Bersaglio (Targeting)  {#3.0-regole-generali-d'ingaggio-e-selezione-bersaglio-(targeting)}

Tutte le torrette del gioco (dal Gatto Base alle forme mutate avanzate) condividono una logica di base comune per l'individuazione e l'ingaggio dei mostri sul campo.

**Regola di Priorità Predefinita (FIRST)** Ogni gatto ingaggia sempre il nemico valido più avanzato verso il Laboratorio presente all'interno del proprio raggio d'azione. La misurazione dell'avanzamento varia in base al tipo di movimento del bersaglio:

* **Nemici Terrestri e Volanti:** La priorità è definita dalla **distanza residua sul percorso** fino alla base (remaining\_path\_length). Ha priorità il valore inferiore.

**Regola di Spareggio in caso di Bivio / Parità di Distanza (Tie-Breaker):** Qualora due o più nemici validi presentino lo stesso identico valore di remaining\_path\_length (es. mostri su rami speculari di un bivio):

1. **Priorità di Prossimità:** Il sistema risolve la parità ingaggiando il nemico fisicamente più vicino alla posizione della torretta attaccante (distance\_to\_tower).  
2. **Caso Limite (Doppia Parità Perfetta):** Se anche la distanza dalla torretta risulta identica al millimetro, la torretta ingaggia il nemico generato da più tempo sulla mappa (selezionando il nodo con ID di istanza inferiore, get\_instance\_id()), garantendo un targeting stabile e senza oscillazioni.

**Filtro sui Profili d'Ingaggio**

* 🪨 **Solo TERRA:** La regola FIRST si applica esclusivamente ai mostri terrestri, ignorando del tutto le unità volanti.  
* 🦅 **Solo ARIA:** La regola FIRST si applica esclusivamente alle unità alate, ignorando i mostri a terra.  
* 🌐 **ENTRAMBI:** La regola FIRST aggancia la prima minaccia in testa all'ondata, confrontando sia unità terrestri che aeree tramite la metrica remaining\_path\_length.

**Regola di Sovrapposizione dei Rallentamenti (Calcolo Moltiplicativo):** Quando un nemico si trova contemporaneamente sotto l'effetto di più fonti di rallentamento (es. Gatto Acqua, Aura Abissale, Puntatore Laser), le percentuali di *Slow* non si sommano in modo additivo, ma si applicano in modo **moltiplicativo sulla velocità residua** del bersaglio.

* **Formula di Calcolo:**  
  VelocitàCorrente \= VelocitàBase x (1 \- Slow\_1) x (1 \- Slow\_2) x … x (1 \- Slow\_n)

* **Esempio Pratico:** Un mostro con Velocità Base 1.0 che entra nel cono d'Acqua Lv 3 (50% slow) ed è contemporaneamente puntato dal Laser (25% slow) avrà una velocità finale di:  
   1.0 x (1 \- 0.50) x (1 \- 0.25) \= 1.0 x 0.50 x 0.75 \= 0.375 (Rallentamento effettivo del 62.5 % )  
* **Eccezione Stun:** Lo *Stun* (Paralisi) ha sempre la priorità assoluta e sovrascrive temporaneamente il calcolo moltiplicativo, portando la velocità a 0.0 per tutta la sua durata.

**Gestione Temporale dei Debuff:** Ogni effetto di stato (Stun, Slow, DoT) possiede un proprio timer indipendente. Gli effetti scorrono in simultanea in background: lo Stun blocca il movimento, ma non "congela" la durata degli altri debuff attivi. Alla rimozione dello Stun, l'unità subisce gli eventuali rallentamenti ancora in corso per il tempo residuo dei rispettivi timer. 

**Classificazione dei Tipi di Attacco e Tempi di Volo (Projectile Rules)**

Per garantire la massima flessibilità data-driven, gli attacchi di tutte le torrette sono divisi in due macro-categorie gestite nei file di configurazione (.tres):

1. **Attacchi Istantanei / Incanalati (Hitscan & Beam):**  
   * **Tipologie:** Laser Singolo (Gatto Cyborg), Coni ad Area Incanalati (Gatto Acqua, Gatto Vapore), Fulmini a Catena (Gatto Tempesta) e Aree Passive (Gatto Abissale).  
   * **Comportamento:** Non generano proiettili in movimento. Il calcolo delle collisioni, l'erogazione del danno e l'applicazione dei debuff avvengono all'istante o ad ogni impulso del timer di tick rate direttamente sul bersaglio.  
2. **Attacchi con Proiettile Fisico (Physical Ballistic Projectiles):**  
   * **Tipologie:** Gomitolo Tattico, Danno ad Area/Splash (Gatto Fuoco), Proiettili Eterei (Gatto Ombra), Meteore (Gatto Infernale), Proiettili Pesanti (Gatto Plasma).  
   * **Comportamento:** Istanziano un nodo visivo con hitbox Area2D che viaggia dalla bocca/zampa della torretta verso il bersaglio. Il danno e gli effetti di stato scattano esclusivamente al momento dell'impatto collisione.  
   * **Velocità di Volo Predefinita (Global Default):** Tutti i proiettili fisici ereditano dal file di bilanciamento globale GameBalanceConfig.tres una velocità base standard pari a **10.0 unità di griglia/sec** (default\_projectile\_speed \= 10.0). Questo valore può essere sovrascritto per singola torretta (es. i 8.0 u/s del Gomitolo Tattico o velocità superiori per i proiettili di classe Plasma).

## 

## 3.1 Il Gatto Base “Gatto Graffiatore” (0 DNA) {#3.1-il-gatto-base-“gatto-graffiatore”-(0-dna)}

Tutti i gatti sul campo vengono inizialmente posizionati in una forma base non mutata.

* **Costo di Piazzamento:** 50 DNA.  
* **Ruolo:** Danno fisico economico e rapido per le prime battute o per gestire emergenze vicine alla base.  
* **Profilo Bersaglio:** 🪨 **Solo TERRA**.  
* **Tipo di Attacco:** Danno Fisico Diretto a Singolo Bersaglio (SingleTargetMelee / Graffio).  
* **AttackRange (Raggio d'Attacco):**  
  * **Lv 0 (0 DNA \- Base):** R \= 0.75 unità di griglia (Corto raggio / Attacco da contatto sulla casella adiacente).  
* **FireRate (Cadenza di Fuoco):**  
  * **Lv 0 (0 DNA \- Base):** 1.5 colpi/sec  
* **Danni:**  
  * **Lv 0 (0 DNA \- Base):** 10 HP .  
* **Durata:** 0.0s (Danno immediato ad ogni singolo colpo).  
* **Regola del Costo Invariato:** Salvo diverse indicazioni, l'attivazione e lo sblocco delle abilità ottenute dall'Albero dei Talenti (es. *Gomitolo Tattico*, *Sabbiera*) **mantengono inalterato a 50 DNA** il costo di piazzamento fisso del Gatto Base durante la partita. I potenziamenti passivi aumentano il valore tattico dell'unità senza penalizzarne l'accessibilità economica in-game. Unica eccezione attuale alla regola è l’abilità Genetista Base che riduce di 10 il costo in DNA.

Nota: Le capacità del Gatto Base possono essere espanse permanentemente (es. attacco a distanza, creazione ostacoli) tramite l'Albero dei Talenti. Vedi la **Sezione 4.3.2** per i dettagli. 

## 3.2 Progressione di Stazza e Potenza (0 \- 4 DNA) {#3.2-progressione-di-stazza-e-potenza-(0---4-dna)}

La dimensione fisica del gatto sulla mappa indica il numero di fiale di DNA applicate (da 0 a 4). L'aspetto visivo del gatto comunica immediatamente al giocatore il suo livello e la sua potenza complessiva senza bisogno di interfacce ingombranti.

| Slot DNA Applicati GDD \- Game Design Document | Stazza Visiva del Gatto GDD \- Game Design Document | Ruolo Visivo e Modificatore Gameplay GDD \- Game Design Document |
| :---- | :---- | :---- |
| **0 DNA (Base)** | **Gattino Piccolo** | Danno fisico a corto raggio (Graffio). Economico e rapido. |
| **1 DNA** | **Gatto Normale** | Inizia ad applicare le prime abilità elementali. |
| **2 DNA** | **Gatto Paffuto** | Danno e raggio d'attacco maggiorati. |
| **3 DNA** | **Gatto Grande** | Raggio d'attacco e cadenza di fuoco elevati. |
| **4 DNA (Max)** | **Gatto Gigante (Chonker)** | **Forma Finale:** Raggio massimo, effetti ad area o danno devastante. |

## 

## 3.3 Regola dei 2 Elementi e Profilo Bersaglio {#3.3-regola-dei-2-elementi-e-profilo-bersaglio}

Un gatto può accogliere fino a 4 fiale, ma con un massimo di **2 elementi distinti**.

## 3.4 Forme Pure (1 Solo Elemento Dominante) {#3.4-forme-pure-(1-solo-elemento-dominante)}

Lo *stacking* dello stesso elemento (applicando fiale dello stesso tipo fino a 4x) sblocca la versione "Pura" concentrata di quel singolo tipo:

### 🔴 Elemento Fuoco (Max: *Gatto Vulcano*) {#🔴-elemento-fuoco-(max:-gatto-vulcano)}

* **Ruolo:** Distruzione di massa contro gli sciami di nemici a terra. Inutile contro le unità volanti.  
* **Profilo Bersaglio:** 🪨 **Solo TERRA**.  
* **Tipo di Attacco:** Danno ad Area Radiale all'Impatto (RadialSplash)  
* **SplashRadius** (Raggio d'Esplosione Scalabile): Il raggio d'impatto cresce con la stazza del gatto (numero di fiale) per rinforzare visivamente la progressione:  
  * **Lv 1 (1x Fuoco):** R=1.0 unità di griglia (Colpisce la truppa primaria e i mostri adiacenti).  
  * **Lv 2 (2x Fuoco):** R=1.2 unità di griglia.  
  * **Lv 3 (3x Fuoco):** R=1.5 unità di griglia.  
  * **Lv 4 (Chonker \- Gatto Vulcano):** R=2.0 unità di griglia (Copre un'intera curva o un bivio della mappa).  
* **FireRate (Cadenza di Fuoco Scalabile):**  
  * **Lv 1 (1x Fuoco):** 1.5 colpi/sec  
  * **Lv 2 (2x Fuoco):** 2.0 colpi/sec  
  * **Lv 3 (3x Fuoco):** 2.5 colpi/sec  
  * **Lv 4 (Chonker \- Gatto Vulcano):** 3.5 colpi/sec  
* **AttackRange (Raggio d'Attacco e Aggancio Bersaglio):**  
  * **Lv 1 (1x Fuoco):** R \= 1.5 unità di griglia  
  * **Lv 2 (2x Fuoco):** R \= 2.0 unità di griglia  
  * **Lv 3 (3x Fuoco):** R \= 2.5 unità di griglia  
  * **Lv 4 (Chonker \- Gatto Vulcano):** R \= 3.0 unità di griglia  
* **Danni**:  
  * **Lv 1 (1x Fuoco):** 30 HP  
  * **Lv 2 (2x Fuoco):** 65 HP  
  * **Lv 3 (3x Fuoco):** 120 HP  
  * **Lv 4 (Chonker \- Gatto Vulcano):** 220 HP  
* **Durata**: 0.0s (Danno immediato all’impatto)

  ### 🔵 Elemento Acqua (Max: *Gatto Ghiacciaio*) {#🔵-elemento-acqua-(max:-gatto-ghiacciaio)}

* **Ruolo:** Controllo della folla (Crowd Control) e rallentamento costante per compattare le orde.  
* **Profilo Bersaglio:** 🌐 **ENTRAMBI**  
* **Tipo di Attacco:** Incanalato ad Area (ChanneledCone / PureSlow)   
* **FrostCone (Dimensioni del Cono di Gelo Scalabile):**  
  * **Lv 1 (1x Acqua):** R=1.5 unità di griglia, Angolo \=30  
  * **Lv 2 (2x Acqua):** R=2.0 unità di griglia, Angolo \=40  
  * **Lv 3 (3x Acqua):** R=2.5 unità di griglia, Angolo \=50  
  * **Lv 4 (Chonker \- Gatto Ghiacciaio):** R=3.0 unità di griglia, Angolo \=60  
* **SlowPercentage (Percentuale di Rallentamento Scalabile):**  
  * **Lv 1 (1x Acqua):** 25 % di rallentamento sui mostri nell'area.  
  * **Lv 2 (2x Acqua):** 35% di rallentamento sui mostri nell'area.  
  * **Lv 3 (3x Acqua):** 50% di rallentamento sui mostri nell'area.  
  * **Lv 4 (Chonker \- Gatto Ghiacciaio):** 65% di rallentamento  
* **Danni:** **0HP (0DPS — Unità Utility Pura)**  
* **Durata Soffio:** Incanalato (attivo finché sono presenti nemici nel cono).   
* **Persistenza Slow (LingerTime)**: 0.5s (quando un nemico esce dal cono, l'effetto di rallentamento svanisce dopo mezzo secondo).

  ### 🟡 Elemento Elettricità (Max: *Gatto Cyborg*) {#🟡-elemento-elettricità-(max:-gatto-cyborg)}

* **Ruolo:** Specialista contraerea pura ad alta frequenza per abbattere le minacce volanti. Ignora i nemici a terra  
* **Profilo Bersaglio:** 🦅 **Solo ARIA**  
* **Tipo di Attacco:** Attacco Singolo ad Alta Cadenza (`SingleTargetLaser`)  
* **AttackRange (Raggio d'Attacco Scalabile):**  
  * **Lv 1 (1x Elettricità):** R \= 2.5 unità di griglia  
  * **Lv 2 (2x Elettricità):** R \= 3.0 unità di griglia  
  * **Lv 3 (3x Elettricità):** R \= 3.5 unità di griglia  
  * **Lv 4 (Chonker \- Gatto Cyborg):** R \= 4.5 unità di griglia  
* **FireRate (Cadenza di Fuoco Scalabile):**  
  * **Lv 1 (1x Elettricità):** 1.5 colpi/sec  
  * **Lv 2 (2x Elettricità):** 2.0 colpi/sec  
  * **Lv 3 (3x Elettricità):** 2.5 colpi/sec  
  * **Lv 4 (Chonker \- Gatto Cyborg):** 3.5 colpi/sec  
* **Danni:**  
  * **Lv 1 (1x Elettricità):** 35 HP  
  * **Lv 2 (2x Elettricità):** 80 HP  
  * **Lv 3 (3x Elettricità):** 150 HP  
  * **Lv 4 (Chonker \- Gatto Cyborg):** 260 HP  
* **Durata:** 0.0s (Danno istantaneo ad ogni singolo colpo)

  ### 

  ### 🟣 Elemento Ombra (Max: *Gatto Fantasma*) {#🟣-elemento-ombra-(max:-gatto-fantasma)}

* **Profilo Bersaglio:** 🌐 **ENTRAMBI**.  
* **Ruolo:** Infetta i bersagli con proiettili eterei (Danno nel Tempo (DoT) ed erosione progressiva della salute dei mostri.); il danno continua a scendere anche quando il nemico esce dal raggio d'azione.  
* **Tipo di Attacco:** Danno nel Tempo con Maledizione Cosmica  (`DamageOverTime`)  
* **AttackRange (Raggio d'Attacco Scalabile):**  
  * **Lv 1 (1x Ombra):** R \= 2.0 unità di griglia  
  * **Lv 2 (2x Ombra):** R \= 2.5 unità di griglia  
  * **Lv 3 (3x Ombra):** R \= 3.0 unità di griglia  
  * **Lv 4 (Chonker \- Gatto Fantasma):** R \= 3.5 unità di griglia  
* **FireRate (Cadenza di Fuoco Scalabile):**  
  * **Lv 1 (1x Ombra): 1.0 colpo/sec**  
  * **Lv 2 (2x Ombra): 1.2 colpi/sec**  
  * **Lv 3 (3x Ombra): 1.5 colpi/sec**  
  * **Lv 4 (Chonker \- Gatto Fantasma): 2.0 colpi/sec**  
* **DoTDuration (Durata della Maledizione Scalabile):**  
  * **Lv 1 (1x Ombra):** Maledizione dura 3.0s (1 tick/sec)  
  * **Lv 2 (2x Ombra):** Maledizione dura 4.0s (1 tick/sec)  
  * **Lv 3 (3x Ombra):** Maledizione dura 5.0s (1 tick/sec)  
  * **Lv 4 (Chonker \- Gatto Fantasma):** Maledizione dura 6.0s (1 tick/sec; i danni continuano ad essere subito anche se il nemico esce dal raggio d'azione)  
* **Danni (DPS del DoT):**  
  * **Lv 1 (1x Ombra):** 25 HP / sec  
  * **Lv 2 (2x Ombra):** 55 HP / sec  
  * **Lv 3 (3x Ombra):** 100 HP / sec  
  * **Lv 4 (Chonker \- Gatto Fantasma):** 180 HP / sec  
* **Durata:** Persistente sul bersaglio infettato per tutta la durata del timer della maledizione.

**Regola di Ri-Applicazione Maledizione (`RefreshDuration`):** Quando un proiettile etereo colpisce un bersaglio già infetto, il timer della durata del DoT viene resettato al suo valore massimo (es. 6.0 secondi al Lv 4). I danni nel tempo non si sommano in modo cumulativo sullo stesso nemico, garantendo che i colpi in eccesso dello stesso gatto servano a mantenere attiva la maledizione o a infettare nuovi mostri che entrano nel raggio d'azione. 

## 

## 3.5 Forme Ibride Bilanciate (2x Elemento A \+ 2x Elemento B) {#3.5-forme-ibride-bilanciate-(2x-elemento-a-+-2x-elemento-b)}

Applicando una combinazione ibrida (2 fiale di un elemento e 2 di un altro) si sbloccano le forme "Ibride" che uniscono gli effetti di entrambi gli elementi.

ℹ️ **Nota per il Team di Sviluppo (Modularità & Placeholder):**

Le specifiche di codice dettagliate in questa sezione coprono le **5 Forme Ibride dotate di componenti software unici e dedicati** (ChanneledConeComponent, GroundHazardComponent, ChainTargetingComponent, PassiveAuraComponent, VortexComponent).

Per tutte le altre combinazioni (es. *Gatto Plasma* o la matrice delle forme 3x1 della Sezione 3.6):

* **Nessun codice aggiuntivo richiesto:** Utilizzano i componenti base già programmati (es. SingleTargetComponent, RadialSplashComponent) e vengono istanziati unicamente tramite parametrizzazione nei file di dati Custom Resource (.tres).  
* **Roadmap Post-Launch:** Eventuali bilanciamenti fini, effetti visivi dedicati o abilità uniche secondarie per le forme rimanenti verranno definiti nelle successive iterazioni del documento.

### 

### Tabella Riassuntiva Forme Ibride (2x2) {#tabella-riassuntiva-forme-ibride-(2x2)}

| Nome Gatto & Combinazione | Profilo Bersaglio | Danni (DPS) / Cadenza | Raggio / Area | Effetto Speciale & Meccanica |
| :---- | :---- | :---- | :---- | :---- |
| **Gatto Vapore**  🔴 2x Fuoco \+ 🔵 2x Acqua | 🪨 Solo TERRA | 160 DPS (80 / 0.5s) Flusso continuo | R \= 2.5 Cono 45° | Soffio a pressione ad area con accecamento e spinta a ritroso probabilistica. |
| **Gatto Plasma**  🔴 2x Fuoco \+ 🟡 2x Elettrico | 🦅 Solo ARIA | 240 DPS (480 istantanei) 0.5 colpi/sec | R \= 4.5 | Proiettile pesante ad altissimo danno per abbattere volanti corazzati. |
| **Gatto Infernale**  🔴 2x Fuoco \+ 🟣 2x Ombra | 🪨 Solo TERRA | 110 Danno Diretto \+ 80 DPS Scia (DoT) | R \= 3.0 Scia R \= 1.2 | Meteora che lascia una scia infuocata sul percorso per 4 secondi. |
| **Gatto Tempesta**  🔵 2x Acqua \+ 🟡 2x Elettrico | 🌐 ENTRAMBI | 150 DPS (100 per colpo) 1.5 colpi/sec | R \= 3.5 Rimbalzo R \= 2.0 | Fulmini a catena (4 bersagli) su pioggia conduttiva: Paralisi 1s \+ Slow 25%. |
| **Gatto Abissale**  🔵 2x Acqua \+ 🟣 2x Ombra | 🌐 ENTRAMBI | 140 DPS (70 / 0.5s) Aura Passiva | R \= 2.5 (Aura) | Aura cosmica: azzera armature, rimuove scudi e blocca la rigenerazione. |
| **Gatto Buco Nero**  🟡 2x Elettrico \+ 🟣 2x Ombra | 🦅 Solo ARIA | 210 DPS (105 / 0.5s) 0.4 colpi/sec | R \= 4.0 Vortice R \= 1.8 | Singolarità aerea: attrae vettorialmente i volanti al centro per 2.5s. |

### 🔴🔵 Gatto Vapore (2x Fuoco \+ 2x Acqua) {#🔴🔵-gatto-vapore-(2x-fuoco-+-2x-acqua)}

* **Ruolo:** Danno ad area ad ampio raggio e controllo del territorio tramite soffio a pressione. Emette un flusso continuo di vapore bollente che danneggia i nemici terrestri, li acceca riducendone i danni inflitti al Laboratorio e ha una probabilità ad ogni impulso di spingerli a ritroso lungo il tracciato.  
* **Profilo Bersaglio:** 🪨 **Solo TERRA**  
* **Tipo di Attacco:** Soffio a Cono ad Area (ConeVapor / ConeAoE)  
* **VaporCone (Dimensioni del Cono di Vapore):**  
  * **Gittata (R):** 2.5 unità di griglia  
  * **Angolo di Apertura:** 45°  
* **Cadenza / Tick Rate:** Flusso continuo incanalato (`ChanneledStream`). Non spara colpi singoli, ma applica danni ed effetti a tutti i nemici nel cono ogni **0.5 secondi** (80 HP a tick \= 160 DPS totali)   
* **Danni (DPS):** 160 HP / sec (Danno ad Area distribuito su tutti i nemici nel cono)  
* **Meccanica Spinta a Ritroso Probabilistica (KnockbackChance):**  
  * **Probabilità per Tick (ProcChance):** **25% di probabilità** ad ogni tick (0.5s) per ciascun nemico nel cono di venire spinto a ritroso.  
  * **Distanza Spinta (KnockbackDistance):** **0.5 unità di griglia** all'indietro lungo il tracciato.  
  * **Gestione Nemici Pesanti & Boss:**  
    * *Standard (Polipetti):* 25% probabilità (0.5 unità).  
    * *Tank (Abominio):* 10% probabilità (0.25 unità).  
    * *Boss (Amalgama):* **0% probabilità (Immune alla spinta)**; subisce solo il DPS ad area e il debuff.  
* **Effetto Accecamento (VaporBlind):** I nemici all'interno del cono subiscono uno status alterato (debuff accecante) della durata di 2.0s. Un nemico accecato vede ridotto del 50% l'output di *qualsiasi danno inflitto a bersagli alleati* (Laboratorio, Ostacoli di Sabbia o future entità destructible). 

**Specifiche di Codice (ChanneledConeComponent)**

* **Rilevamento Geometrico (ConeArea):** Il gatto attiva un settore circolare con raggio R=2.5 e angolo \=45 gradi orientato verso il bersaglio agganciato.  
* **Gestione Flusso & Timer (TickLoop):** Finché un nemico valido si trova all'interno del cono, un timer interno emette un impulso (tick) ogni **0.5 secondi**. Se l'area si svuota, l'incanalamento si interrompe immediatamente.  
* **Esecuzione Danni e Calcolo Spinta per Tick (OnTickProcess):** Ad ogni impulso di 0.5s, il sistema ottiene la lista dei nodi nemici sovrapposti all'area. Per rispettare il profilo d'ingaggio, **il componente applica un filtro rigoroso escludendo tutte le unità alate** (realizzabile impostando la `collision_mask` dell'Area2D esclusivamente sul layer fisico dei nemici terrestri, oppure tramite condizione codice `if enemy.ingame_type == GROUND`). Iterando esclusivamente sui nemici terrestri validi, il sistema esegue:  
  * **Applicazione Danno:** Sottrae **80 HP** direttamente alla salute corrente del mostro.  
  * **Roll della Spinta (KnockbackRoll):** Genera un valore casuale tra 0.0 e 1.0:  
    * *Standard (es. Polipetti):* Se \<= 0.25 (25% di probabilità), arretra il nemico di 0.5 unità sul tracciato con vincolo sullo spawn: `enemy.path_position = max(0.0, enemy.path_position - 0.5)`.  
    * *Tank (Abominio)*: Se \<= 0.10 (10% di probabilità), arretra il nemico di 0.25 unità sul tracciato con vincolo sullo spawn: `enemy.path_position = max(0.0, enemy.path_position - 0.25)`.  
    * *Boss (Amalgama):* Probabilità 0% (Moltiplicatore di spinta impostato a 0.0, chiamata di spostamento totalmente ignorata).  
  * **Gestione Limite Spawn:** La spinta all'indietro non può mai assumere valori negativi. Se il calcolo dell'arretramento porta il nemico oltre il punto di inizio del tracciato, la sua posizione viene bloccata esattamente al punto di spawn tramite il vincolo matematico già indicato.  
* **Applicazione Debuff Accecamento (`VaporBlindStatus`):** Applica o resetta un timer di **2.0 secondi** per il nodo di stato `VaporBlindStatus` sul nemico. Il calcolo del danno in uscita è delegato al nodo del nemico: ogniqualvolta il mostro attacca un'entità alleata di classe `DestructibleTarget` (che sia il Laboratorio o un nodo `SandObstacle` generato dal Gatto Base), moltiplica il danno base previsto per il modificatore di stato (0.5 se `VaporBlind` è attivo, 1.0 se inattivo). 

  ### 

  ### 🔴🟣 Gatto Infernale (2x Fuoco \+ 2x Ombra) {#🔴🟣-gatto-infernale-(2x-fuoco-+-2x-ombra)}

* **Ruolo:** Danno ibrido ad area (impatto istantaneo diretto \+ zona di combustione persistente). Lancia meteore oscure che infliggono un danno immediato sul punto d'atterraggio e lasciano sul percorso una scia di fuoco per 4 secondi, applicando un Danno nel Tempo (DoT) a qualunque nemico la attraversi.  
* **Profilo Bersaglio:** 🪨 **Solo TERRA**  
* **Tipo di Attacco:** Meteora Oscura con Generazione di Zona (`GroundHazardLauncher`)  
* **AttackRange (Gittata d'Attacco):** R \= 3.0 unità di griglia  
* **FireRate (Cadenza di Fuoco):** 1.0 colpo/sec  
* **Danni:**  
  * **Danno Diretto all'Impatto:** 110 HP (Istantaneo sul punto di atterraggio della meteora)  
  * **Danno Scia/Zona (DoT):** 80 HP / sec a tutti i nemici che attraversano la zona infuocata

**Specifiche di Codice (`GroundHazardComponent`)**

* **Istanziazione Entità (`HazardZone`):** All'impatto del proiettile, la torretta genera un nodo figlio temporaneo sulla griglia del tracciato.  
* **Raggio della Scia (`HazardRadius`):** R \= 1.2 unità di griglia (copre la mattonella d'impatto e parte di quelle adiacenti).  
* **Durata della Zona (`HazardDuration`):** **4.0 secondi** (il nodo `HazardZone` si autodistrugge allo scadere del timer).  
* **Frequenza Danno (Tick Rate):** 0.5 secondi (applica 40 HP di danno ogni mezzo secondo a chiunque entri nell'Area2D della scia).  
* **Regola di Sovrapposizione (`StackingRule`):** Se una nuova meteora cade su una zona già infuocata, il timer della durata si resetta a 4.0 secondi (`Refresh Duration`), ma i danni delle scie non si sommano per evitare exploit di DPS accumulato sullo stesso tassello.

  ### 

  ### 🔴🟡 Plasma (2x Fuoco \+ 2x Elettricità)

* **Profilo Bersaglio:** 🦅 **Solo ARIA**  
* **Tipo di Attacco:** Attacco Singolo Pesante a Bersaglio Singolo (SingleTargetComponent)  
* **Statistiche:** Danno per colpo: **480 HP istantanei** | Cadenza: **0.5 colpi/sec** (1 sparo ogni 2.0s) | Gittata: **R \= 4.5** | DPS: **240 HP/sec**  
* **Specifiche di Codice (GattoPlasma):**  
  * Non richiede componenti custom dedicati: istanzia ed esegue il componente base SingleTargetComponent già programmato.  
  * L'attacco aggancia unicamente la singola unità volante più avanzata sul percorso applicando la regola FIRST. All'impatto del proiettile pesante, eroga l'intero ammontare di **480 HP a bersaglio singolo senza generare danno ad area (Splash)**, garantendo il massimo burst di danno concentrato contro i volanti corazzati.

  ### 🔵🟡 Gatto Tempesta (2x Acqua \+ 2x Elettrico) {#🔵🟡-gatto-tempesta-(2x-acqua-+-2x-elettrico)}

* **Ruolo:** Controllo della folla ad ampio spettro. Evoca un temporale a micro-gocce che usa la pioggia come conduttore elettrico: le scariche elettriche viaggiano liberamente nell'aria e sul terreno, concatenando mostri terrestri e volanti nello stesso colpo per paralizzarli e rallentarli.  
* **Profilo Bersaglio:** 🌐 **ENTRAMBI**  
* **Tipo di Attacco:** Fulmine a Catena su Pioggia Conduttiva (ChainLightningStun)  
* **Gittata Primaria:** R \= 3.5 unità di griglia  
* **Gittata di Rimbalzo (BounceRange):** R \= 2.0 unità di griglia dal bersaglio precedente  
* **Numero Max Bersagli:** 4 nemici totali (1 primario \+ 3 rimbalzi a catena)  
* **Cadenza di Fuoco (FireRate):** 1.5 colpi/sec (1 sparo ogni 0.66 secondi)  
* **Danni:**  
  * **Tipo di Danno:** Danno Diretto Istantaneo (DirectBurstDamage)  
  * **Danno per Colpo (DamagePerHit):** 100 HP istantanei erogati a ciascun nemico della catena ad ogni singolo sparo  
  * **Valore di Bilanciamento (DPS):** 150 HP/sec (100HP1.5colpi/sec)

**Effetto Speciale e Meccanica ("Pioggia Conduttiva")**

1. **Ponte Misto Terra/Aria:** La presenza dell'acqua abbatte i limiti di ingaggio. Il fulmine può iniziare su un nemico di terra e saltare su un nemico volante (o viceversa) se si trova entro il raggio di rimbalzo.  
2. **Doppio Controllo (Stun \+ Slow):**  
   * **Paralisi (Stun 1.0s):** L'impatto elettrico blocca completamente il movimento di tutti i nemici colpiti per 1.0 secondi.  
   * **Bagnato (Slow 25% per 1.5s):** Allo scadere della paralisi, l'acqua residua rallenta la velocità di movimento del 25% per ulteriori 1.5 secondi.  
3. **Gestione Boss:** I Boss sono immuni alla paralisi (non interrompono la camminata), ma subiscono il danno completo e un rallentamento costante del 25% per 2.5 secondi.

**Specifiche di Codice (ChainTargetingComponent)**

* **Aggancio Primario (PrimaryLock):** La torretta individua il bersaglio primario T0 entro la gittata R \= 3.5 usando la regola di priorità predefinita (FIRST).  
* **Algoritmo di Ricerca Rimbalzi (ChainSearchAlgorithm):**  
  * Colpito T0, il componente lo aggiunge all'array hit\_targets.  
  * Esegue un controllo Area2D circolare di raggio Rbounce=2.0 centrato sulla posizione del bersaglio precedente.  
  * Seleziona il nemico più vicino (senza filtrare tra nodi terrestri o aerei) non ancora presente nell'array hit\_targets.  
  * Regola di Spareggio (Tie-Breaker): Qualora due o più bersagli validi si trovino alla medesima identica distanza fisica dal punto di origine del rimbalzo, il sistema risolve la parità applicando la regola FIRST (Sezione 3.0), selezionando il nemico più avanzato verso la base (remaining\_path\_length inferiore). In caso di ulteriore parità perfetta sul tracciato, seleziona il nodo con ID di istanza inferiore (get\_instance\_id()) per garantire un targeting deterministico.  
  * Ripete la ricerca per T\_1 \-\> T\_2 \-\> T\_3 fino a raggiungere 4 bersagli totali o fino all'assenza di ulteriori nemici nel raggio di rimbalzo.  
* **Rendering Visivo & Danni (LightningRayExecution):**  
  * Disegna istantaneamente una linea visiva elettrica bicolore (azzurro/giallo) tramite Line2D che unisce la torretta e i nodi $T\_0 \\to T\_1 \\to T\_2 \\to T\_3$.  
  * Sottrae istantaneamente 100 HP dal nodo di salute di ciascun nemico presente nell'array dei bersagli colpiti.  
* **Gestione Effetti di Stato (StatusEffectManager):**  
  * *Nemici Standard e Tank:* Applica un nodo StunStatus (durata 1.0s, azzera la velocità sul percorso). Alla distruzione di StunStatus, istanzia automaticamente un nodo SlowStatus (durata 1.5s, moltiplicatore velocità \= 0.75).  
  * *Boss (enemy.is\_boss \== true):* Salta la creazione di StunStatus e applica direttamente SlowStatus con durata estesa a 2.5s.

  ### 

  ### 🔵🟣 Gatto Abissale (2x Acqua \+ 2x Ombra) {#🔵🟣-gatto-abissale-(2x-acqua-+-2x-ombra)}

* **Ruolo:** Supporto e depotenziamento d'area (Utility / Debuff). Genera un'aura permanente di freddo cosmico attorno a sé: infligge danni continui e annulla le difese dei mostri, privandoli di scudi, armature e capacità di rigenerazione.  
* **Profilo Bersaglio:** 🌐 **ENTRAMBI** (Colpisce sia le unità terrestri che quelle volanti all'interno dell'area)  
* **Tipo di Attacco:** Aura Passiva Continuativa ad Area (`RadialAuraDebuff`)  
* **AttackRange (Raggio dell'Aura):** R \= 2.5 unità di griglia attorno alla torretta  
* **Cadenza / Tick Rate:** Flusso continuo passivo (applica danni ed effetti a tutti i nemici nell'area ogni 0.5 secondi)  
* **Danni:**  
  * **Tipo di Danno:** Danno nel Tempo Continuo ad Area (`AreaDamageOverTime`)  
  * **Danno per Tick:** 70 HP ad ogni impulso (ogni 0.5s) erogati a tutti i nemici presenti nell'area  
  * **Valore di Bilanciamento (DPS):** 140 HP/sec (70 HP x 2 tick/sec)

**Effetto Speciale e Meccanica ("Gelo Cosmico / Soppressione")**

1. **Annullamento Difese (`AuraNullification`):** Finché un nemico rimane all'interno dell'aura, la sua armatura/resistenza viene azzerata, eventuali scudi temporanei vengono infranti e la rigenerazione passiva della salute viene bloccata.  
2. **Rallentamento Abissale (`AbyssalSlow`):** Applica un rallentamento passivo costante del 20% alla velocità di movimento dei nemici nell'area.  
3. **Gestione Boss:** I Boss subiscono il danno DoT complete, il rallentamento del 20% e il blocco della rigenerazione HP, ma mantengono attive le proprie abilità di fase o attacco speciale.

**Specifiche di Codice (`PassiveAuraComponent`)**

* **Area di Rilevamento Permanente (`AuraArea`):** Il componente sfrutta un nodo `Area2D` circolare fisso di raggio R \= 2.5 centrato sulle coordinate della torretta. Non richiede orientamento visivo né rotazione verso i bersagli.  
* **Ciclo di Calcolo (`TickProcess`):** Un timer ciclico emette un impulso ogni **0.5 secondi**. Ad ogni impulso, il componente ottiene la lista dei nodi nemici sovrapposti tramite `Area2D.get_overlapping_bodies()`.  
* **Esecuzione Effetti sugli Entrati (`OnTickExecute`):** Ad ogni impulso di 0.5s, per ciascun nemico rilevato nell'area:  
  * Sottrae **70 HP** direttamente dalla salute corrente.  
  * Imposta temporaneamente i flag sul nodo dello stato nemico: `current_armor = 0`, `can_regenerate = false`.  
  * Applica o rinnova il nodo `SlowStatus` (moltiplicatore velocità \= 0.80).  
* **Ripristino all'Uscita dall'Aura (`OnExitAura`):** Quando un nemico esce dal raggio dell' `Area2D` (segnale `body_exited`), viene avviato un timer di persistenza (`LingerTimer`) di **1.0 secondo**. Allo scadere del timer, le statistiche originali del nemico (armatura e rigenerazione) vengono ripristinate e l'effetto di rallentamento svanisce.

  ### 🟡🟣 Gatto Buco Nero (2x Elettrico \+ 2x Ombra) {#🟡🟣-gatto-buco-nero-(2x-elettrico-+-2x-ombra)}

* **Ruolo:** Controllo della folla aereo e raggruppamento delle unità alate. Spara una singolarità gravitazionale nel cielo che attrae e risucchia tutti i mostri volanti nell'area verso il suo centro, immobilizzandoli e frantumandoli con scariche eteree ad alta frequenza.  
* **Profilo Bersaglio:** 🦅 **Solo ARIA** (Ignora completamente le unità a terra)  
* **Tipo di Attacco:** Singolarità Aerea sul Tracciato (Singularity1D / VortexComponent).  
* **Gittata Torretta:** R \= 4.0 unità di griglia  
* **Portata Vortice sul Tracciato (PathVortexRadius):** R \= 1.8 unità di griglia lungo il tracciato (cattura i volanti che si trovano entro 1.8 unità di percorso prima e dopo il punto d'impatto).  
* **Cadenza di Fuoco (FireRate):** 0.4 colpi/sec (1 singolarità generata ogni 2.5 secondi)  
* **Durata Vortice:** 2.5 secondi a schermo  
* **Danni:**  
  * **Tipo di Danno:** Danno ad Area nel Tempo Incanalato (VortexDoT)  
  * **Frequenza Danno (Tick Rate):** 0.5 secondi (5 tick totali per singolarità)  
  * **Danno per Tick:** 105 HP erogati a tutte le unità volanti intrappolate  
  * **Valore di Bilanciamento (DPS):** 210 HP/sec (105HP2tick/sec) — Danno totale cumulato per singolarità \= 525 HP

**Effetto Speciale e Meccanica ("Singolarità Gravitazionale")**

* **Risucchio sul Tracciato (PathPull):** Applica una forza di attrazione costante che fa scorrere i nemici volanti verso il punto esatto del percorso in cui si è generato il buco nero. I nemici che si trovano più avanti vengono tirati all'indietro, mentre quelli più indietro vengono accelerati in avanti, bloccando del tutto la loro normale avanzata verso la base.  
* **Compressione Sciame:** Raggruppa i volanti in un unico punto denso **lungo il percorso**, creando un ingorgo e una perfetta zona d'impatto coordinata con le altre torrette contraeree (es. Gatto Plasma).  
* **Gestione Boss Volanti:** I Boss volanti sono immuni allo spostamento (la loro velocità di avanzamento sul percorso non viene alterata dal risucchio), ma subiscono comunque l'intero danno del vortice.

**Specifiche di Codice (VortexComponent)**

* **Calcolo Fisica di Attrazione (PullProcess):** Ad ogni frame di fisica (`_physics_process`), il sistema itera sull'array globale dei nemici volanti attivi e controlla la loro distanza monodimensionale dal vortice lungo il tracciato: `var dist = vortex_path_pos - enemy.path_position`.  
  * **Rilevamento 1D & Override Movimento:** Se il valore assoluto della distanza (`abs(dist)`) è inferiore al raggio di efficacia del vortice (`max_pull_distance = 1.8`), il nemico viene considerato catturato.  
  * Invece di azzerare la velocità base, il Vortice imposta un flag prioritario sul nodo del nemico: `enemy.is_in_vortex = true`. Finché questo flag è attivo, lo script di movimento standard del nemico (`WALK`) viene disabilitato e salta i calcoli della velocità, delegando il posizionamento interamente al Vortice.  
  * **Gestione Indipendente degli Status (Risoluzione Conflitti):** Grazie al flag `is_in_vortex`, se il nemico intrappolato subisce uno `StunStatus` o uno `SlowStatus` da altre torrette, i timer di questi debuff continuano a scorrere in background in totale sicurezza. La fine di uno Stun non farà fuggire il nemico dal buco nero.  
  * **Risucchio:** Modifica la posizione del nemico spingendolo verso il centro del vortice facendolo scorrere sul tracciato: `enemy.path_position += sign(dist) * pull_speed * delta`.  
* **Ciclo Applicazione Danni (DamageTickLoop):** Un timer ciclico interno di 0.5s itera solo sui nemici che soddisfano il "Rilevamento 1D" e sottrae i danni a tick dal nodo salute di ciascuno.  
* **Distruzione del Nodo (DespawnTimer):** Un timer da 2.5s gestisce la durata del vortice e distrugge il nodo visivo. Alla distruzione, il Vortice reimposta `enemy.is_in_vortex = false` su tutti i sopravvissuti. I nemici riprenderanno a muoversi calcolando la loro normale velocità in base agli eventuali debuff residui (es. Slow) ancora attivi.

  ## 

### 

## 3.6 Combinazioni Ibride Sbilanciate (3x1 — Dominanza Elementale) {#3.6-combinazioni-ibride-sbilanciate-(3x1-—-dominanza-elementale)}

ℹ️ **Nota sui Valori degli Effetti Secondari (WIP / Data-Driven):** I valori numerici indicati con **X** (es. danni addizionali, raggio, tick-rate dei DoT, % di furto HP) nella tabella sottostante sono *placeholder*. Come specificato nella Sezione 3.5, le forme 3x1 non richiedono codice aggiuntivo: i parametri precisi di questi effetti secondari verranno definiti e iterati nei file di configurazione (`.tres`) durante le fasi di testing e bilanciamento Post-Launch. 

Quando un gatto riceve **3 Fiale dell'Elemento A** e **1 Fiala dell'Elemento B**, non si trasforma nell'Ibrido Epico 2x2, ma attiva la meccanica di **Dominanza Elementale**.

* **Modello Visivo & Attacco Principale:** Il gatto mantiene l'aspetto estetico, l'animazione d'attacco e il raggio della forma Dominante (3x).  
* **Profilo Bersaglio:** Conserva il profilo d'ingaggio dell'elemento 3x (es. 🪨 Solo Terra per il Fuoco, 🦅 Solo Aria per l'Elettricità).  
* **Effetto Passivo Secondario (Impronta 1x):** L'attacco principale riceve un effetto secondario ridotto (circa il 25% dell'efficacia) derivato dalla fiala singola applicata.

#### **1\. Regola sull'Ordine di Applicazione (Indipendenza dalla Sequenza)** {#1.-regola-sull'ordine-di-applicazione-(indipendenza-dalla-sequenza)}

L'ordine con cui vengono applicate le mutazioni dal Menu Radiale **NON influisce** sulla forma finale del gatto.

* *Esempio:* Applicare 1x Fuoco e poi 3x Acqua, oppure 2x Acqua  1x Fuoco  1x Acqua, produce in tutti i casi la forma finale **3x Acqua \+ 1x Fuoco**.  
* Il sistema valuta esclusivamente il totale dei 4 slot riempiti: l'elemento presente in quota 3x determina l'aspetto visivo, l'attacco principale e il profilo bersaglio, mentre l'elemento 1x applica un effetto secondario passivo (pari a circa il 25% della sua efficacia base).

#### **2\. Matrice Completa delle 12 Combinazioni 3x1** {#2.-matrice-completa-delle-12-combinazioni-3x1}

| Elemento Dominante (3x) | Elemento Secondario (1x) | Nome Profilo | Profilo Bersaglio | Effetto Principale \+ Effetto Passivo 1x |
| :---- | :---- | :---- | :---- | :---- |
| 🔴 **3x Fuoco** | 🔵 **1x Acqua** | **Vulcano Caldo** | 🪨 **Solo TERRA** | Danno ad area (Splash) \+ Rallentamento del 10% sui nemici colpiti per 1.5s. |
| 🔴 **3x Fuoco** | 🟡 **1x Elettrico** | **Magma Volt** | 🪨 **Solo TERRA** | Danno ad area (Splash) \+ 10% di probabilità di paralisi (Mini-Stun per X secondi, default 2\) all'impatto. |
| 🔴 **3x Fuoco** | 🟣 **1x Ombra** | **Cenere Maledetta** | 🪨 **Solo TERRA** | Danno ad area (Splash) \+ applica un leggero Danno nel Tempo (DoT) pari a X da bruciatura oscura (valore default iniziale X=5). |
| 🔵 **3x Acqua** | 🔴 **1x Fuoco** | **Geyser Fumante** | 🌐 **ENTRAMBI** | Cono di gelo incanalato (Rallentamento base) \+ ad ogni impulso di **0.5 secondi** (2 tick/sec), infligge **5 HP di danno da scotto continuativo** (10 DPS totali) a tutti i nemici presenti nel cono per tutta la loro permanenza.  |
| 🔵 **3x Acqua** | 🟡 **1x Elettrico** | **Tempesta Polare** | 🌐 **ENTRAMBI** | Cono di gelo incanalato (Rallentamento base) \+ ogni **1.0 secondo** di soffio continuo sul bersaglio primario, genera una scarica elettrica a catena verso fino a **2 bersagli adiacenti** (Gittata di Rimbalzo R \= 1.5), infliggendo **15 HP di danno istantaneo** a ciascun bersaglio della catena.  |
| 🔵 **3x Acqua** | 🟣 **1x Ombra** | **Tormenta Maledetta** | 🌐 **ENTRAMBI** | Cono di gelo (Rallentamento) \+ riduce del 15% la difesa/armatura dei mostri nel cono. |
| 🟡 **3x Elettrico** | 🔴 **1x Fuoco** | **Cyborg Pirotecnico** | 🦅 **Solo ARIA** | Raffica laser anti-aerea \+ applica un DoT da combustione alle unità volanti pari a X (valore default iniziale X=5) |
| 🟡 **3x Elettrico** | 🔵 **1x Acqua** | **Fulmine Umido** | 🦅 **Solo ARIA** | Raffica laser anti-aerea \+ rallenta del 15% la velocità di volo dei bersagli colpiti. |
| 🟡 **3x Elettrico** | 🟣 **1x Ombra** | **Laser Occulto** | 🦅 **Solo ARIA** | Raffica laser anti-aerea \+ ad ogni singolo colpo andato a segno su un'unità volante (on\_hit), ripristina istantaneamente **\+2 HP** alla salute del Laboratorio (valore default X \= 2 HP per colpo). Nota: la salute della base non potrà mai eccedere il valore massimo con cui ha iniziato il livello.  |
| 🟣 **3x Ombra** | 🔴 **1x Fuoco** | **Spettro Piroclastico** | 🌐 **ENTRAMBI** | Proiettili eterei (DoT) \+ generano una piccola esplosione ad area quando il DoT scade pari a X (valore default iniziale X=10) |
| 🟣 **3x Ombra** | 🔵 **1x Acqua** | **Nebbia Abissale** | 🌐 **ENTRAMBI** | Proiettili eterei (DoT) \+ applicano un rallentamento passivo durante tutta la durata del DoT pari al 10% della velocità dei mostri. |
| 🟣 **3x Ombra** | 🟡 **1x Elettrico** | **Fantasma Elettrizzante** | 🌐 **ENTRAMBI** | Proiettili eterei (DoT) \+ 15% di probabilità di interrompere le azioni del mostro (Mini-Stun) per X secondi (default X=2). |

**Specifiche Tecniche di Codice per l'Engine:**

* **Geyser Fumante (`GeyserFumanteComponent`):**  
  All'interno del `TickLoop` di 0.5s dell'area del cono incanalato, oltre ad applicare il modificatore di `SlowStatus`, il componente itera sui nodi nemici sovrapposti sottraendo direttamente 5 HP alla salute ad ogni impulso (`enemy.take_damage(5)`).  
* **Tempesta Polare (`TempestaPolareComponent`):**  
  Implementa un timer interno di 1.0s agganciato all'incanalamento del cono. Ad ogni ciclo del timer, parte un raggio d'attacco dal bersaglio primario `T0` che esegue un `Area2D` di raggio R \= 1.5 per individuare ed erogare 15 HP a `T1` e `T2` (risolvendo le parità con la regola `FIRST`).

#### **Ruolo Tattico del 3x1** {#ruolo-tattico-del-3x1}

Questa configurazione serve quando il giocatore vuole **massimizzare il danno puro o il raggio di un elemento principale** (3x), ma necessita di una piccola utilità di supporto (es. un minimo di rallentamento) senza dover sacrificare 2 slot per l'ibrido bilanciato.

## 3.7 Interazione sul Campo (Piazzamento, Mutazione e Scomposizione) {#3.7-interazione-sul-campo-(piazzamento,-mutazione-e-scomposizione)}

### 1\. Piazzamento {#1.-piazzamento}

* Tocco su uno slot vuoto della mappa  Conferma acquisto Gatto Base (50 DNA)\[cite: 1\].

  ### 2\. Mutazione tramite Menu Radiale in Tempo Reale: {#2.-mutazione-tramite-menu-radiale-in-tempo-reale:}

* Il giocatore tocca direttamente un gatto piazzato per aprire il suo **Menu Radiale**.  
* **Selezione Evoluzione:** Il menu mostra le icone delle opzioni elementali/mutazioni disponibili attorno al gatto con il relativo costo in DNA.  
* **Feedback Visivo:** I pulsanti delle evoluzioni non disponibili (DNA insufficiente o limite di 2 elementi raggiunto) appaiono disabilitati o grigiati.  
* **Esecuzione:** Il tap sull'opzione desiderata detrae i frammenti di DNA dal contatore e applica immediatamente l'evoluzione alla torretta.

  ### 3\. Scomposizione DNA (Vendita Torretta): {#3.-scomposizione-dna-(vendita-torretta):}

* **Interfaccia:** All'interno del Menu Radiale è presente il pulsante **"Scomponi DNA"**.   
* **Quota Rimborso:** (DNA Totale Investito Gatto Base \+ DNA Totale Investito Mutazioni) x (% di Rimborso).   
* **Percentuale di Rimborso Base:** Valore base pari al **50%**, incrementabile tramite l'Albero dei Talenti o fissato al 70% nella modalità *Invasione Infinita*.   
* **Regola di Arrotondamento (Floor):** Il calcolo applica l'arrotondamento matematico per difetto (troncamento dei decimali) sull'intero risultante, garantendo che il contatore gestisca esclusivamente numeri interi.   
  * *Esempio Pratico:* Con il talento *Riciclo Efficiente* al 55% di rimborso, la vendita di un Gatto Base (costo 50 DNA) genera: 50 x 0.55 \= 27.5, che con arrotondamento per difetto accredita **27 DNA** al saldo del giocatore.   
* **Flusso Logico e Requisiti di Sistema:**  
  * Recupera il valore totale di DNA investito sulla torretta (costo di piazzamento \+ somma del costo delle fiale applicate).  
  * Moltiplica il totale investito per la percentuale di rimborso corrente (es. 0.50 o 0.55).  
  * Applica l'operazione di troncamento/floor al valore decimale per ricavare il numero intero di DNA da restituire.  
  * Incrementa il contatore del DNA del giocatore del valore intero calcolato, rimuove la torretta e libera la piazzola sul campo.

## 3.8 Costi di Mutazione e Progressività delle Fiale {#3.8-costi-di-mutazione-e-progressività-delle-fiale}

L'applicazione delle fiale ha un costo in DNA crescente in base al numero di slot già occupati sul gatto:

* **Gatto Base (Piazzamento):** 50 DNA  
* **1ª Fiala (Lv 1):** 30 DNA  
* **2ª Fiala (Lv 2):** 50 DNA  
* **3ª Fiala (Lv 3):** 80 DNA  
* **4ª Fiala (Lv 4 \- Max):** 120 DNA

*Nota sul Bilanciamento:* Il costo progressivo spinge il giocatore a decidere se posizionare più Gatti di basso livello per coprire più punti della mappa o concentrare le risorse per creare un singolo Gatto Gigante devastante.

## 3.9 Statistiche Base e Bilanciamento DPS (Capitolo 1\) {#3.9-statistiche-base-e-bilanciamento-dps-(capitolo-1)}

TTK: Time To Kill

HTK: Hit to Kill

*Questa sezione definisce il "feeling" e il ritmo degli scontri. I valori numerici di Danno e Salute presenti nel GDD devono essere continuamente bilanciati per rispettare questi target comportamentali.*

* **Gatto Base (Lv 0\) vs Sciame:** *Target: Attrito Lento.* Non deve riuscire a fermare un'ondata da solo. Deve richiedere **molti colpi (4-5 HTK)** per abbattere un singolo Polipetto di Melma. Il tempo di eliminazione (TTK) deve aggirarsi tra i **2.5s e i 3.5s**, forzando il giocatore a piazzare più gatti o a mutarli in fretta.  
* **Gatto Fuoco (Lv 1\) vs Sciame:** *Target: Pulizia Istantanea (Burst).* La risposta definitiva contro la massa. Deve polverizzare i gruppi di Polipetti in **1-2 colpi al massimo**. Il TTK globale del gruppo deve rimanere **attorno a 1 secondo**.  
* **Gatto Fuoco (Lv 2\) vs Tank:** *Target: Logoramento.* Deve far percepire la corazza dell'Abominio di Roccia. Il mostro tank deve poter incassare numerosi colpi ad area, sopravvivendo abbastanza a lungo (TTK target: **\~2.5s \- 3.5s**) da proteggere i mostri che gli camminano dietro.  
* **Gatto Elettrico (Lv 1\) vs Aria:** *Target: Contraerea Rapida.* I nemici volanti sono veloci e non curano gli ostacoli, quindi il TTK deve essere medio-rapido (**circa 2.0s, con 3-4 colpi**). Il gatto deve abbattere il bersaglio comodamente prima che questo attraversi per intero il suo raggio d'azione.  
* **Focus sul Boss (Amalgama Infetta):** *Target: DPS Check Estremo.* Il Boss funge da esame finale. Considerando il suo avanzamento inesorabile, una difesa ottimizzata (es. 2x Gatti Giganti Lv 4 \+ uso perfetto del rallentamento Laser) deve essere calibrata per azzerare i suoi immensi HP in una strettissima finestra temporale di **pochi secondi di fuoco concentrato** prima che tocchi il Laboratorio.

## 

# **4\. Mappa, Progressione e Stelle** {#4.-mappa,-progressione-e-stelle}

## 4.0 Mappa dei Mondi (World Map) & Hub di Progressione {#4.0-mappa-dei-mondi-(world-map)-&-hub-di-progressione}

La **Mappa dei Mondi** rappresenta l'hub principale di navigazione tra le sessioni di gioco. Ha una vista panoramica illustrata a scorrimento (Scroll) che mostra visivamente l'avanzamento della spedizione felina attraverso i vari ambienti contaminati.

#### **1\. Layout Visivo e Struttura dei Mondi** {#1.-layout-visivo-e-struttura-dei-mondi}

La mappa è divisa in aree tematiche corrispondenti ai capitoli di gioco, collegate da un percorso a tappe:

* **Capitolo 1 — Il Laboratorio Segreto:** Ambiente indoor industriale con pavimenti in piastrelle, provette infrante e macchinari. Sblocca l'Elemento Fuoco (🔴).  
* **Capitolo 2 — L'Acquario Contaminato:** Ambienti allagati, vasche spaccate ed elementi organici viscosi. Sblocca l'Elemento Acqua (🔵).  
* **Capitolo 3 — La Centrale Elettrica:** Generatori a fusione, cavi ad alta tensione fluttuanti e scintille cosmiche. Sblocca l'Elemento Elettricità (🟡).  
* **Capitolo 4 — La Dimensione Oscura:** Distorsione spaziale, materia viola fluttuante e architetture aliene. Sblocca l'Elemento Ombra (🟣).

#### **2\. Tipologie di Nodi e Interazioni sulla Mappa** {#2.-tipologie-di-nodi-e-interazioni-sulla-mappa}

* **Nodi Livello Standard (es. 1-1, 1-2...):** Icone circolari lungo il percorso.  
  * **Visualizzazione Stelle:** Sopra ogni nodo completato sono mostrate da 0 a 3 Stelle dorate (★).  
  * **Stati del Nodo:** *Completato* (icona colorata con stelle), *Attivo* (nodo corrente con anello pulsante), *Bloccato* (lucchetto grigio).  
* **Nodo Boss Finale (es. 1-5):** Nodo di dimensioni maggiorate raffigurante l'icona del Boss (es. *Amalgama Infetta*). Toccando il nodo compare un'anteprima delle abilità del Boss e la ricompensa speciale della prima vittoria.  
* **Hub Portale "Invasione Infinita" ():** Un portale cosmico posizionato a fianco del Capitolo 1\.  
  * **Stato Bloccato:** Catene traslucide e fumetto: *"Batti il Boss 1-5 per sbloccare"*.  
  * **Stato Sbloccato:** Apertura della finestra Lobby Endless con record personale, classifica settimanale e mutatore attivo.

#### **3\. Interfaccia dell'Hub (Dock & Risorse)** {#3.-interfaccia-dell'hub-(dock-&-risorse)}

In qualsiasi momento sulla Mappa dei Mondi sono visibili gli indicatori di stato e i tasti di accesso rapido ai sistemi di meta-progressione:

* **HUD Superiore (Risorse Globali):**  
  * **Contatore Stelle Totali:** Mostra il totale accumulato sul massimo disponibile per capitolo (es. **12/15 ★** nel Capitolo 1).  
  * **Riserva Diamanti (💎):** Saldo totale dei diamanti utilizzabili nello shop.  
* **Dock Inferiore (Menu Principali):**  
  * 🌟 **Star Shop (Albero dei Talenti):** Apre l'albero delle competenze permanenti acquistabili con le Stelle.  
  * 💎 **Diamond Shop:** Accede al negozio per l'acquisto dei consumabili d'emergenza e pacchetti IAP.  
  * 📖 **Bestiario & Archivio:** Enciclopedia interattiva per consultare le schede dei nemici scoperti e la lista degli Ibridi Sbloccati.

#### **4\. Requisiti di Sblocco tra Capitoli** {#4.-requisiti-di-sblocco-tra-capitoli}

Per accedere al Capitolo successivo (es. dal Capitolo 1 al Capitolo 2\) il giocatore deve soddisfare contemporaneamente due condizioni:

1. **Vittoria sul Boss:** Sconfiggere il Boss finale dell'ultimo livello del capitolo corrente (es. Livello 1-5).  
2. **Soglia Stelle Minime:** Aver raccolto almeno il **70% delle Stelle totali** del capitolo (es. almeno **11 Stelle su 15** nel Capitolo 1). Questo requisito garantisce che il giocatore abbia accumulato abbastanza Stelle per potenziare i talenti base necessari ad affrontare la difficoltà del capitolo successivo.

## 

## 4.1. Sistema di Valutazione a 3 Stelle {#4.1.-sistema-di-valutazione-a-3-stelle}

Il Laboratorio ha una **Salute Base Iniziale pari a 100 HP**. La valutazione di fine livello dipende esclusivamente dalla percentuale di salute rimanente: 

* ⭐ **1 Stella (Vittoria):** Livello completato con Salute Base tra **1% e 79%**.  
* ⭐⭐ **2 Stelle (Ottima Difesa):** Livello completato con Salute Base tra **80% e 99%**.  
* ⭐⭐⭐ **3 Stelle (Perfect Run):** Livello completato con la salute della base al 100% della sua capacità massima.  
  * **Regola del Recovery (Cura della Base):** La valutazione calcola *esclusivamente* lo stato degli HP nell'esatto momento in cui il livello termina. Subire danni durante la partita **non** invalida la Perfect Run, a patto che il giocatore riesca a ripristinare completamente la salute della base prima della sconfitta dell'ultimo nemico (es. utilizzando il furto vitale del gatto *Laser Occulto*).  
  * **Calcolo su Base Potenziata:** Se il giocatore ha la base base a 100 HP, deve finire a 100/100 HP. Se ha sbloccato il talento "Vetri Rinforzati" portandola a 120 HP, deve concludere mantenendo 120/120 HP intatti.  
  * **Specifica per il Codice:** Al trigger `level_completed`, il sistema non deve verificare se la base ha subito danni storici, ma limitarsi al controllo matematico condizionale: `if current_hp == max_hp -> assegna 3 stelle`.

Le stelle ottenute per ogni livello indicano il miglior risultato (Best Score) mai raggiunto su quel nodo e non sono cumulabili rigiocando il livello. 

**Natura delle Stelle:** Le Stelle funzionano come **Valuta Spendibile** nel portafoglio del giocatore.

**Calcolo dell'Accredito (Delta Payout):** Rigiocare un livello eroga Stelle aggiuntive nel portafoglio solo se il giocatore supera il suo precedente record (Best Score) su quel nodo.

**Formula per il Codice:** StelleAccreditate \= max (0, StelleOttenute-RecordPrecedente).

**Esempi Operativi:**

* **Prima giocata (1★):** RecordPrecedente=0 Accredito: 1-0=+1 Stella.  
* **Replay senza miglioramento (1★):** RecordPrecedente=1 Accredito: 1-1=0 Stelle.  
* **Replay con miglioramento (2★):** RecordPrecedente=1 Accredito: 2-1=+1 Stella aggiuntiva.  
* **Replay perfetto da livello base (3★ da 1★ precedente):** RecordPrecedente=1 Accredito: 3-1=+2 Stelle aggiuntive.

## 

## 4.2. Sistema Achievement (Sfide Tattiche) {#4.2.-sistema-achievement-(sfide-tattiche)}

Gli obiettivi secondari di gameplay non danno stelle, ma contano come **Achievement del Laboratorio** (sbloccano skin, cosmetici per i gatti o diamanti):

* *Esempio:* "Crea un Gatto Gigante Ibrido", "Sconfiggi 30 nemici con il Puntatore Laser", "Usa solo Gatti d'Acqua".

## 

## 4.3. L’Albero dei Talenti Felino (Potenziamenti Passivi Permanenti) {#4.3.-l’albero-dei-talenti-felino-(potenziamenti-passivi-permanenti)}

Le Stelle accumulate completando i livelli fungono da **Punti Talento globali**. L'Albero dei Talenti si trova nel Menu Principale ed è diviso in **Rami di Specializzazione** (uno per ogni elemento/gatto) e un **Ramo di Struttura** (per il potenziamento generale del Laboratorio).

* **Progressione Inter-Capitolo:** I punti non si azzerano tra un capitolo e l'altro. Il gioco prevede un accumulo progressivo (fino a 60 Stelle totali nei 4 capitoli), rendendo i potenziamenti di Tier più alto obiettivi a lungo termine.  
* **Regola del Respec:** Il giocatore può resettare l'intero albero dei talenti e riassegnare i punti gratuitamente, illimitatamente e senza alcuna penale in qualsiasi momento prima di iniziare una battaglia.  
  * **Accredito Risorse (100% Refund):** L'azione di reset blocca nuovamente tutti i nodi acquistati e riaccredita immediatamente il **100% delle Stelle spese** nel portafoglio delle Stelle spendibili dell'utente. Nessuna risorsa viene trattenuta o convertita in commissione.  
  * **Specifiche di Codice (`TalentTreeManager.ResetTree()`):**  
    * Recupera la quota totale investita: `var refund_amount = total_spent_stars`  
    * Accredita al saldo: `available_stars += refund_amount`  
    * Azzera il contatore investimenti: `total_spent_stars = 0`  
    * Pulisce lo stato dei nodi: itera sul dizionario dei talenti ed imposta `is_unlocked = false` per ciascun nodo, emettendo il segnale `SignalBus.talents_refreshed` per aggiornare al volo l'interfaccia dello Star Shop (Sezione 4.0.3).  
* **Struttura Sequenziale:** Ogni ramo prevede una progressione lineare divisa in 4 Tier. Per sbloccare un nodo di un Tier superiore, è obbligatorio aver investito punti nel nodo del Tier immediatamente precedente all'interno dello stesso ramo. Qualora un Tier presenti un bivio (due opzioni), basterà sbloccarne una per procedere al Tier successivo.

  ### 4.3.1 Struttura Costi e Tier dell'Albero dei Talenti {#4.3.1-struttura-costi-e-tier-dell'albero-dei-talenti}

Il costo dei potenziamenti è progettato per forzare scelte strategiche. Considerando un ottenimento massimo di **15 Stelle per Capitolo. R**igiocare un livello già completato a punteggio pieno (3 Stelle) non genera alcun guadagno di risorse, impedendo il farming infinito di Stelle per sbloccare l'Albero dei Talenti. 

Il completamento di un intero ramo richiede l'investimento di stelle guadagnate nell'arco di più capitoli. A fine campagna (60 Stelle totali stimate), il giocatore avrà abbastanza risorse per completare al massimo due rami interi e investire i resti nei Tier base degli altri.

L'economia dello sblocco segue questi 4 Tier di costo:

* **Tier 1 (Base):** Costo **2 Stelle** (Es. *Riciclo Efficiente* o *Artigli Affilati*). Requisiti: Nessuno.  
* **Tier 2 (Intermedio):** Costo **5 Stelle**. Requisiti: Aver sbloccato il nodo Tier 1 dello stesso ramo.  
* **Tier 3 (Avanzato):** Costo **8 Stelle**. Requisiti: Aver sbloccato un nodo Tier 2 dello stesso ramo.  
* **Capstone (Maestria):** Costo **12 Stelle**. Requisiti: Aver sbloccato il nodo Tier 3 dello stesso ramo.

*(Costo totale per portare al massimo un singolo ramo in modo lineare: 27 Stelle).*

### 

### 4.3.2 Nodi dell'Albero dei Talenti (Esempi di Potenziamenti) {#4.3.2-nodi-dell'albero-dei-talenti-(esempi-di-potenziamenti)}

**🐾 Ramo Gatto Base (Graffiatore)**

Nota di Design: Gli upgrade sbloccati con le Stelle per il Gatto Base agiscono come potenziamenti passivi permanenti "gratuiti" sul campo: il costo di posizionamento della prima piazzola rimane sempre di **50 DNA** 

**TIER 1**

* *Artigli Affilati* (+10% Danno iniziale ai graffi).

**TIER 2 (Bivio, scelta singola o doppia):**

* *Zampa Veloce* (+15% Cadenza di attacco) OPPURE  
* *Gomitolo Tattico:*   
  * **Meccanica del Proiettile:** Converte l'attacco melee in un attacco a distanza a corto raggio (Gittata R \= 1.0) con profilo esteso a ENTRAMBI (Terra \+ Aria).   
  * **Tipo di Attacco:** Proiettile Fisico con Tempo di Volo (`PhysicalProjectileComponent`).   
  * **Velocità del Proiettile:** **8.0 unità di griglia/sec** (`projectile_speed = 8.0`).   
  * **Ambito di Efficacia di Gomitolo Tattico:** L'espansione del profilo d'ingaggio ad **ENTRAMBI (Terra \+ Aria)** garantita dal talento *Gomitolo Tattico* si applica **esclusivamente al Gatto Base nella sua forma non mutata (Lv 0 / 0 DNA)**.  
  * **Sovrascrittura da Mutazione Elementale:** Quando un Gatto Base riceve una o più fiale di DNA mutando in una Formazione Elementale (Pure Lv 1-4, Ibride 2x2 o 3x1), il Profilo Bersaglio della nuova forma (es. **Solo TERRA** per l'Elemento Fuoco o **Solo ARIA** per l'Elemento Elettricità) **sovrascrive con priorità assoluta** il profilo del Gatto Base.  
  * **Ripristino:** Qualora la torretta venga scomposata (venduta) facendola tornare allo stato base o liberando la piazzola, i futuri Gatti Base posizionati riassumeranno il profilo esteso **ENTRAMBI** se il talento è sbloccato nell'Albero.  
  * **Specifiche di Codice:** All'attacco, la torretta istanzia un nodo `YarnBallProjectile` diretto verso le coordinate del bersaglio agganciato. L'applicazione dei 10 HP di danno e il consumo del colpo avvengono esclusivamente al momento della collisione fisica (`Area2D.body_entered` / `on_impact`). Se il bersaglio muore durante il tempo di volo del proiettile, il gomitolo prosegue la sua traiettoria fino alla coordinata target originale e si dissolve (`queue_free()`). 

**TIER 3**

* ***Sabbiera Blocca-Orda*****:**   
  * **Descrizione Generale & Statistiche:** All'inizio di ogni ondata, ciascun Gatto Base posiziona sul percorso X ostacoli di sabbia (valore predefinito X \= 2\) con Y HP ciascuno (valore predefinito Y \= 20). I nemici terrestri sono costretti a fermarsi e attaccare i mucchietti di sabbia per distruggerli prima di poter proseguire verso il Laboratorio.   
  * **Tempismo di Creazione, Ripristino & Gestione Sovrapposizioni:**  
    * **Piazzamento Iniziale:** Gli ostacoli vengono generati al posizionamento del Gatto Base sulle coordinate target fisse P1 \= posizione\_gatto \+ 1.0 e P2 \= posizione\_gatto \+ 1.5 lungo il tracciato.  
    * **Regola di Sovrapposizione (Hard Cap 1 per Slot \+ Ripristino HP):** Su ciascuna coordinata di percorso può esistere un solo ostacolo. Se il piazzamento di una nuova torretta tenta di generare un mucchietto su una coordinata P dove esiste già un ostacolo attivo (es. generato da un altro gatto e rimasto con salute ridotta), la creazione del secondo nodo viene annullata, ma **l'ostacolo esistente viene immediatamente curato e riportato al massimo della sua salute (20 HP)**.  
    * **Ripristino Inizio Ondata (Esclusivo Gatto Base):** All'inizio di ogni nuova ondata, le sole torrette **Gatto Base** (non mutate) presenti sul campo rigenerano gli ostacoli distrutti a esse associati (verificando che lo slot target non sia stato occupato nel frattempo da un altro nodo attivo) e riportano a 20 HP la salute di quelli danneggiati.  
  * **Ingaggio e Collisione (Fronte del Mostro):**  
    * **Ostacolo Davanti (X \< P):** I nemici terrestri in stato di movimento (WALK) che avanzano verso l'ostacolo arrestano la corsa non appena la loro posizione tocca la zona di contatto dell'ostacolo (quando **X \>= P \- 0.25**, con P coordinata target dell'ostacolo) e passano allo stato d'attacco corpo a corpo (MELEE\_ATTACK), evitando compenetrazioni visive con il modello della sabbiera.  
    * **Mostro Oltre (X \>= P):** Se al momento dello spawn dell'ostacolo un nemico si trova già sulla coordinata P o l'ha superata, ignora l'ostacolo e prosegue la sua avanzata verso la base.  
  * **Regole di Distruzione & Disorientamento (HP \= 0 o Vendita):**  
    * L'ostacolo viene rimosso dal tracciato sia quando i suoi HP scendono a 0 sotto i colpi dei mostri, sia quando la torretta madre Gatto Base viene scomposta (venduta) dal Menu Radiale.  
    * **Effetto Disorientamento (Micro-Stun 0.5s):** In entrambi i casi di rimozione dell'ostacolo (distruzione per danno o scomposizione della torretta), tutti i nemici terrestri ingaggiati nello stato MELEE\_ATTACK contro quel determinato mucchietto subiscono un micro-stordimento da disorientamento di **0.5 secondi** (stato Stun). Allo scadere dei 0.5 secondi, la macchina a stati dei mostri esegue la transizione automatica allo stato WALK per riprendere la marcia lungo il percorso.   
  * **Flusso Logico e Requisiti di Sistema:**   
    * **Controllo Occupazione Tassello:** Prima di istanziare un nuovo nodo ostacolo sulla coordinata target P, il sistema interroga la griglia del percorso. Se la casella è occupata da un ostacolo attivo, invoca la funzione di ripristino salute al valore massimo sull'entità presente ed esce dal flusso senza creare un nuovo oggetto.  
    * **Filtro Evento Ondata:** Il gestore dell'evento di avvio ondata esegue il ripristino/rigenerazione degli ostacoli associati esclusivamente filtrando per le torrette attive appartenenti alla classe base (Gatto Base non mutato), ignorando qualsiasi torretta che abbia subito una mutazione elementale.  
    * **Gestione Distruzione e Notifica Nemici:** Alla rimozione dell'ostacolo dal gioco (invocata sia dall'azzeramento degli HP che dalla scomposizione della torretta madre), il sistema acquisisce l'elenco di tutti i nemici attualmente ingaggiati contro quell'ostacolo, applica su ciascuno un timer di stordimento di 0.5 secondi e programma la transizione di stato da MELEE\_ATTACK a WALK allo scadere del timer.

**TIER 4 (Capstone)**

* *Genetista Base* (-10 DNA costo di piazzamento Gatto Base).

🔴 Ramo Gatto Fuoco

* **Tier 1**  
  * *Piro-Pressione* (+10% Danno da esplosione Splash).  
* **Tier 2**  
  * *Portata Fiammante* (+10% Raggio d'azione del fuoco).

🔵 Ramo Gatto Acqua / Ghiaccio

* **Tier 1**  
  * **Zero Assoluto:** \+15% Durata del rallentamento sui mostri.  
* **Tier 2**  
  * **Tormenta Amplificata:** \+10% Ampiezza del cono di ghiaccio.

🟡 Ramo Gatto Elettrico

* **Tier 1**  
  * **Sovraccarico Anti-Aereo:** \+15% Danno inflitto contro le unità volanti.  
* **Tier 2**  
  * **Raggio Focale:** \+10% Frequenza dei fulmini.

🟣 Ramo Gatto Ombra

* **Tier 1**  
  * **Maledizione Cosmica:** \+15% Danno continuo nel tempo (DoT).  
* **Tier 2**  
  * **Ombra Espansiva:** \+10% Raggio d'azione.

🏢 Ramo Laboratorio Generale (Struttura)

* **Tier 1**  
  * **Riciclo Efficiente:** Aumenta la % di DNA restituita scomponendo un gatto (+5% per livello: dal 50% base fino al 70% max).  
* **Tier 2**  
  * **Efficienza Genetica (Siringhe Rapide):** Riduce del 10% il costo in DNA delle Fiale Mutagene.  
* **Tier 3**  
  * **Vetri Rinforzati:** \+20 HP Salute massima del Laboratorio.  
    Nota: le soglie percentuali per l'ottenimento delle 2 e 3 Stelle dovranno ricalcolarsi proporzionalmente sul nuovo totale  
* **Capstone**  
  * **Lente Focale:** Il Puntatore Laser del giocatore rallenta i nemici puntati di un ulteriore 15% (la percentuale di rallentamento totale sarà 40%).

## **4.4 Guadagno dei Diamanti In-Game (Free-to-Play)** {#4.4-guadagno-dei-diamanti-in-game-(free-to-play)}

I **Diamanti (💎)** rappresentano la valuta pregiata di gioco. Si accumulano gratuitamente durante il gameplay attraverso tre fonti:

1. **Drop Casual dai Mostri in Battaglia:**  
   * **Mostri Sciame / Veloci:** 0.5% di probabilità (1 ogni 200 eliminati).  
   * **Mostri Tank / Elitari:** 3% di probabilità.  
   * **Boss di Fine Capitolo:** **100% Garantito**.  
2. **Completamento Achievement del Laboratorio:**

   * Il completamento di obiettivi tattici (es. *"Vinci senza usare Fiale Fuoco"*) premia il giocatore con **3 \- 10 💎** in base alla difficoltà.  
3. **Prima Perfect Run (3 Stelle):**

   * Completare un livello per la prima volta al 100% di salute della base assegna un bonus una-tantum di **2 💎**.

## 

## **4.5 Il Diamond Shop (Consumabili & Sblocchi)** {#4.5-il-diamond-shop-(consumabili-&-sblocchi)}

I Diamanti vengono spesi nel **Diamond Shop** per ottenere aiuti d'emergenza o sblocchi strutturali:

### A. Consumabili d'Emergenza (Usabili in Battaglia) {#a.-consumabili-d'emergenza-(usabili-in-battaglia)}

Vengono equipaggiati nei rispettivi slot e compaiono a schermo durante la partita con un pulsante dedicato. 

**Flusso di Equipaggiamento (Schermata Pre-Partita)**

* **Accesso:** Toccando un qualsiasi nodo di livello sulla World Map (Sezione 4.0), compare la finestra pop-up **"Briefing di Battaglia"** prima dell'avvio della partita.  
* **Interfaccia Loadout:** Nella parte inferiore del pop-up sono ben visibili gli **Slot Consumabili Sbloccati** (da 1 a 3 in base agli sblocchi della Sezione 4.5.B).  
* **Assegnazione:** Toccando uno slot vuoto o già occupato si apre un menu radiale/a comparsa contenente la griglia delle cariche possedute nell'inventario globale (es. *Bomba Atomica x5*, *Campo di Forza x2*). Un tap sulla risorsa la assegna allo slot scelto.

**Comportamento e Persistenza (Quality of Life)**

* **Salvataggio Profilo:** L'HUD memorizza l'ultimo loadout utilizzato, riproponendolo automaticamente per le partite successive senza costringere il giocatore a ri-equipaggiare gli oggetti ogni volta.  
* **Gestione Scorte Esaurite:** Se le cariche di un consumabile scendono a zero durante una partita, al ritorno nel menu Pre-Partita lo slot mostrerà un badge **"+"** o **"Riacquista"**. Questo consente di comprare istantaneamente nuove cariche in Diamanti (💎) senza dover abbandonare la schermata di avvio livello per andare nel Diamond Shop principale.

**Specifiche di Codice (LoadoutManager & PreBattleUI)**

* **Struttura Dati:** Il sistema salva la configurazione attiva in un array di stringhe/ResourceID salvato nel profilo utente: user\_loadout \= \[Consumable\_ID\_1, Consumable\_ID\_2, Consumable\_ID\_3\].  
* **Inizializzazione HUD di Battaglia:** All'emissione del segnale start\_battle, la scena di combattimento legge user\_loadout. Se lo slot contiene un ID valido, istanzia il relativo pulsante d'azione nell'HUD (Sezione 8.1) legandolo al contatore della scorta corrente e applicando il rispettivo cooldown di utilizzo in-game.

**💣 Bomba Atomica Felina**

* **Costo:** 5 💎  
* **Cariche per Acquisto:** 1 Carica  
* **Cooldown in-game:** 30 sec  
* **Effetto Tattico:** Pulisce l'80% dello sciame standard più vicino al Laboratorio per spezzare gli assedi d'emergenza.   
* **Regole di Selezione & Calcolo:**  
  * **Priorità:** Ordina i nemici standard a schermo per distanza residua (remaining\_path\_length crescente).  
  * **Quota Eliminazioni:**  
    * **Se Nemici Standard \= 0:** **N \= 0** (Nessun nemico standard eliminato. Se è presente un Boss, subisce unicamente il danno fisso pari al 30% dei suoi HP massimi).  
    * **Se Nemici Standard \> 0:** **N \=** max(1, floor(NemiciStandard \* 0.80)).   
  * **Gestione Boss:** Immune all'esecuzione istantanea; viene escluso dal calcolo N e subisce un danno fisso pari a 0.30 \* MaxHP.  
  * **Regola Drop Risorse (Incenerimento Totale):** L'esplosione polverizza istantaneamente la materia organica senza lasciarne traccia. Tutti i nemici eliminati dalla Bomba Atomica **non erogano alcun rimborso in DNA** e saltano completamente il roll percentuale per il drop dei Diamanti.  
* **Flusso Logico e Requisiti di Sistema:**  
  * **Rilevamento ed Inquadramento:** All'attivazione del consumabile, il sistema acquisisce tutti i nemici presenti a schermo e li separa in due gruppi: nemici standard e Boss.  
  * **Ordinamento e Calcolo Quota:** Ordina i nemici standard in base alla distanza residua dal Laboratorio (priorità ai più vicini alla base) e determina la quota N di eliminazioni.  
  * **Esecuzione Eliminazioni e Blocco Drop:** Rimuove istantaneamente i primi N nemici standard selezionati. Per questi nodi disabilita l'emissione dei segnali di ricompensa, impedendo sia l'accredito di DNA che il roll percentuale per il rilascio dei Diamanti.  
  * **Gestione del Boss:** Se è presente un Boss, applica unicamente una riduzione diretta della sua salute pari al 30% dei suoi HP massimi.

**🛡️ Campo di Forza Rimbalzante**

* **Costo:** 4 💎  
* **Cariche per Acquisto:** 1 Carica  
* **Cooldown in-game:** 15 sec  
* **Effetto Tattico:** Genera un'onda d'urto attorno alla Base che allontana istantaneamente tutti i nemici presenti sul campo di **X unità di griglia** (valore di default X=5.0).   
* **Unificazione Spinta:** Sia i Nemici Terrestri che i Nemici Volanti vengono traslati all'indietro lungo il tracciato condiviso tramite il comando `move_on_path(-X)`.   
* **Gestione Immunità Boss:** L'immunità alla spinta fisica del Boss (definita nella Sezione 7.2) rimane valida. Quando il Campo di Forza viene attivato, i nemici Standard e Tank vengono traslati all'indietro di X unità; il Boss, essendo immune allo spostamento, non viene arretrato. L'energia dell'onda d'urto si converte invece in un **Rallentamento Estremo (90% Slow) per 3.0 secondi**. Il sistema applica un nodo `SlowStatus` ad alta intensità, permettendo al Boss di continuare la sua animazione di marcia, ma riducendone l'avanzata in modo drastico senza violarne l'immunità allo Stun.   
* **Gestione Limite Spawn:** Nessun nemico può essere spinto fuori dalla mappa. Se la spinta di X unità supera la distanza percorsa dal nemico, la sua coordinata viene vincolata al punto di inizio (Spawn) tramite la formula `max(0.0, path_position - X)`

**🧪 Iniezione di DNA**

* **Costo:** 3 💎  
* **Cariche per Acquisto:** 1 Carica  
* **Cooldown in-game:** 5 sec  
* **Effetto Tattico:** Aggiunge immediatamente \+150 DNA alla riserva utilizzabile durante la partita.

**🔋 Super Charge Laser**

* **Costo:** 2 💎  
* **Cariche per Acquisto:** 1 Carica  
* **Cooldown in-game:** 20 sec  
* **Effetto Tattico:** Resetta immediatamente il tempo di ricarica del Puntatore Laser e raddoppia i danni inflitti dalla sua attivazione successiva (da 10 HP/sec a 20 HP/sec).   
* **Regola di Condizione e Blocco Input:** Il consumabile può essere attivato **esclusivamente quando il Puntatore Laser è in fase di ricarica (cooldown)**. Se il Puntatore Laser è attualmente attivo sul campo (durante i suoi 5 secondi di autonomia), il pulsante del *Super Charge Laser* nell'HUD rimane **disabilitato e grigiato**, prevenendo tap accidentali o conflitti di stato fino al termine dell'abilità.  
* **Flusso Logico e Requisiti di Sistema:**   
  * **Stato dell'Interfaccia:** Durante la partita, il sistema controlla lo stato dell'abilità Carica Felina. Se il laser è attivo sul campo, il pulsante del consumabile viene disabilitato nell'interfaccia. Il pulsante diventa selezionabile solo quando il Puntatore Laser si trova in fase di ricarica (cooldown).  
  * **Innesco e Cooldown:** Alla pressione del pulsante durante la ricarica del laser, il sistema azzera il timer di cooldown dell'abilità Laser, imposta il flag di potenziamento per la carica successiva e avvia il tempo di ricarica di 20 secondi proprio del consumabile.  
  * **Erogazione Danno Potenziato:** Alla successiva attivazione del Puntatore Laser, l'abilità rileva il flag di potenziamento e raddoppia il danno inflitto ad ogni impulso (da 5 HP a 10 HP per impulso ogni 0.5s). Allo spegnimento del laser dopo i 5 secondi di autonomia, il flag di potenziamento si azzera.

**🩹 Defibrillatore (Revive)**

* **Costo:** 10 💎  
* **Cariche per Acquisto:** 1 Carica  
* **Cooldown in-game:** 10 sec  
* **Effetto Tattico & Meccanica "Last Stand":** Se la Salute del Laboratorio scende a 0 HP e il giocatore possiede il Defibrillatore equipaggiato con almeno 1 carica residua, si attiva la finestra d'emergenza di rianimazione.  
* **Comportamento Visivo e Temporale:**  
  * **Pausa d'Emergenza:** All'azzeramento degli HP, la simulazione di battaglia si congela immediatamente, la grafica dello schermo subisce una desaturazione in scala di grigi e viene riprodotto un feedback sonoro dedicato.  
  * **Finestra d'Input:** L'icona del Defibrillatore nell'HUD pulsa in modo evidenziato per un tempo limite di **3.0 secondi reali**.  
  * **Risoluzione Tap:** Se il giocatore tocca il pulsante entro i 3 secondi, consuma 1 carica, ripristina la salute del Laboratorio al **30% del valore massimo**, riattiva la simulazione di gioco e fa riprendere la battaglia.  
  * **Risoluzione Timeout:** Se i 3 secondi trascorrono senza alcun tocco, la finestra si chiude e viene avviata la normale schermata di Game Over.  
* **Impatto sul Sistema a Stelle (Hard Cap):** L'utilizzo del Defibrillatore salva la partita, ma invalida la *Perfect Run*. Il punteggio finale del livello sarà **limitato a un massimo di 2 Stelle**, anche qualora il giocatore riesca successivamente a ripristinare la salute della base al 100%.  
* **Flusso Logico e Requisiti di Sistema:**  
  * **Intercettazione Sconfitta:** All'azzeramento della salute del Laboratorio, il sistema intercetta la condizione di sconfitta e verifica se lo slot consumabili contiene almeno 1 carica di Defibrillatore.  
  * **Attivazione Finestra temporale:** Se la carica è presente, il sistema sospende il loop di aggiornamento della partita (pausa della simulazione), applica i filtri visivi/sonori e avvia un timer di 3.0 secondi reali.  
  * **Gestione Input:** Alla pressione del pulsante entro i 3.0 secondi reali, decrementa la scorta, imposta la salute corrente al 30% del massimo, registra nella sessione il flag di rianimazione avvenuta, riprende la simulazione e rimuove la pausa.  
  * **Timeout:** Allo scadere del timer senza input, chiude la finestra e reindirizza al flusso standard di Game Over.  
  * **Calcolo Finale Stelle:** Al completamento del livello, se il flag di rianimazione è attivo, il calcolatore impone il limite forzato di 2 Stelle max alla valutazione.

\----

**Gestione Acquisti e Scorta Inventario:** Ogni acquisto nel Diamond Shop accredita **1 singola carica** nell'inventario globale. 

**Gestione Cariche e Cooldown Consumabili:**

Gli slot consumabili nell'HUD di battaglia ospitano la *Tipologia* di aiuto d'emergenza prescelto e mostrano il numero di cariche disponibili (es. *Bomba Atomica x5*).

Per preservare la sfida tattica ed evitare lo spam sequenziale, ogni consumabile presenta un **Tempo di Ricarica (Cooldown) specifico tra un utilizzo e l'altro** all'interno della stessa partita.

### 

### B. Sblocchi Permanenti & Cosmetici {#b.-sblocchi-permanenti-&-cosmetici}

**Cap Massimo Slot:** L'HUD di battaglia è progettato per ospitare un **massimo assoluto di 3 Slot Consumabili** (1 Slot Base di default \+ fino a 2 Slot Aggiuntivi).

* **1° Slot:** Disponibile di default per tutti i giocatori (Gratuito).  
* **2° Slot:** Sblocco permanente per **20 💎**.  
* **3° Slot:** Sblocco permanente per **50 💎**.

**Skin Cosmetiche:** Cappellini, occhiali da sole o aure colorate per i gatti (pura estetica, zero impatto sulle statistiche) SEZIONE DA DEFINIRE POST LANCIO

* **Impatto Gameplay:** Le skin cosmetiche (accessori visuali, aure, emote) hanno valenza puramente estetica e non alterano in alcun modo le statistiche di gioco (zero bonus a Danni, HP, Cooldown o Velocità).  
* **Tipologie di Elementi Cosmetici (Esemplificativo):**  
  * **Skin & Accessori Gatti:** Cappellini, occhiali da sole, accessori tematici o aure visive colorate sovrapposte ai modelli dei gatti (applicabili alle forme base e alle mutazioni).  
  * **Emote Felini:** Micro-animazioni o fumetti espressivi che compaiono sopra la testa dei gatti al verificarsi di determinati eventi di gioco (es. eliminazione di un Boss, completamento Wave o attivazione della Carica Felina).  
* **Pianificazione Post-Launch:** Il catalogo completo, il sistema di equipaggiamento e lo shop dedicato sono confermati come contenuti della Roadmap Post-Launch. Nella versione 1.0, l'ottenimento di premi cosmetici tramite la classifica della Modalità Infinita (Sezione 4.7.4) si limita a registrare lo sblocco nel profilo utente come valuta/titolo identificativo.

## 

## **4.6 Microtransazioni IAP (Acquisto con Soldi Reali)** {#4.6-microtransazioni-iap-(acquisto-con-soldi-reali)}

I Diamanti possono essere acquistati direttamente tramite lo Store integrato (App Store / Google Play).

**Tabella Pacchetti Diamanti (Microtransazioni)**

| Pacchetto | Quantità Diamanti | Costo (€) | Valore / Bonus |
| :---- | :---- | :---- | :---- |
| **Siringa di Diamanti** | 50 💎 | € 0,99 | Pacchetto base. |
| **Cassa Mutagena** | 300 💎 | € 4,99 | \+10% 💎 omaggio inclusi. |
| **Cassaforte del Genetista** | 700 💎 | € 9,99 | \+20% 💎 omaggio inclusi. |
| **Riserva Infinita di DNA** | 1800 💎 | € 24,99 | **Miglior Valore** (+35% 💎 omaggio). |

**Pass del Genetista (Monthly Pass)**

* **Costo:** **€ 3,99 / mese**.  
* **Benefici:**  
  * **50 💎 istantanei** all'acquisto.  
  * **10 💎 al giorno** riscattabili ogni volta che si effettua l'accesso per 30 giorni (300 💎 totali).  
  * **1 Slot Consumabile Extra**: Il Pass del Genetista sblocca temporaneamente per 30 giorni solari il prossimo slot non ancora acquistato (es. porta gli slot attivi da 1 a 2, oppure da 2 a 3 senza spendere Diamanti).  
    **Caso Limite (Giocatore con 3/3 Slot già acquistati):** Se un giocatore possiede già tutti e 3 gli slot permanentemente tramite acquisto in Diamanti, il tetto massimo dell'HUD rimane fissato a 3\. In questo caso, la componente dello slot del Pass si converte automaticamente in una **ricompensa sostitutiva di \+50 💎 istantanei aggiuntivi** all'attivazione del Pass (portando la resa complessiva a 400 💎). 

## 4.7 Modalità di Gioco Secondarie — Invasione Infinita (Endless / Survival) {#4.7-modalità-di-gioco-secondarie-—-invasione-infinita-(endless-/-survival)}

La modalità **Invasione Infinita** è la componente principale di endgame e rigiocabilità a lungo termine, progettata per testare le difese del giocatore contro orde illimitate di abomini cosmici.

**4.7.1 Requisiti di Sblocco e Struttura**

* **Sblocco:** Si attiva automaticamente dopo aver sconfitto il Boss finale del Capitolo 1 (Livello 1-5: *Amalgama Infetta*).  
* **Ondate Illimitate:** Le Wave si succedono senza sosta con una pausa strategica di soli 5 secondi tra l'una e l'altra.  
* **Scalabilità della Difficoltà:** Ogni 5 Wave completate, gli HP e la velocità dei mostri aumentano del **10% calcolato in modo lineare sul valore base originale** (additivo per scaglione, non composto/cumulativo su ogni singola wave).   
  * **Formula di Calcolo:**  
    * `HP_Attuali = HP_Base * (1.0 + 0.10 * Scaglione)`  
    * `Velocità_Attuale = Velocità_Base * (1.0 + 0.10 * Scaglione)`  
    * Dove `Scaglione = floor((Wave_Corrente - 1) / 5)`  
  * **Progressione Operativa:**  
    * **Wave 1-5:** `Scaglione = 0` \-\> HP e Velocità al **100%** (valore base standard).  
    * **Wave 6-10:** `Scaglione = 1` \-\> HP e Velocità al **110%** (+10% rispetto al base).  
    * **Wave 11-15:** `Scaglione = 2` \-\> HP e Velocità al **120%** (+20% rispetto al base).  
    * **Wave 16-20:** `Scaglione = 3` \-\> HP e Velocità al **130%** (+30% rispetto al base).  
  * **Flusso Logico e Requisiti di Sistema:**   
    * **Determinazione dello Scaglione:** All'inizio di ciascuna Wave, il gestore delle ondate calcola lo scaglione di difficoltà corrente sottraendo 1 al numero della Wave, dividendo per 5 e applicando l'arrotondamento per difetto (floor).  
    * **Calcolo del Fattore di Scala:** Calcola il moltiplicatore addizionando un incremento del \+10% (0.10) per ciascun punto dello scaglione calcolato (es. Scaglione 0 \= x1.0, Scaglione 1 \= x1.10, Scaglione 2 \= x1.20).  
    * **Applicazione Statistiche allo Spawn:** Durante l'istanziazione di ogni nemico dell'ondata, il gestore legge le statistiche base dalla risorsa del mostro (HP base e velocità base) e le moltiplica per il fattore di scala prima di immettere l'unità sul percorso.

**4.7.2 Regole Tattiche e Gestione Risorse**

* **Pool Genetico Completo:** È possibile utilizzare tutte le Fiale Mutagene sbloccate nei capitoli della campagna completati.  
* **Riafflusso DNA Dinamico:** La rigenerazione passiva aumenta con il progredire delle Wave (+2 DNA/sec base, \+1 DNA/sec aggiuntivo ogni 10 Wave) per sostenere il mantenimento di più Gatti Giganti (Lv 4).  
* **Scomposizione Adattiva:** Scomporre un gatto sul campo garantisce il **70% fisso di DNA restituito**, permettendo di riorganizzare la linea difensiva quando la composizione delle ondate varia tra terra e aria.  
  *Gestione Conflitti (Talento "Riciclo Efficiente"):* Questa percentuale è un valore di base specifico della modalità Endless e **sovrascrive** il talento passivo "Riciclo Efficiente" (che non applicherà ulteriori bonus). Questo garantisce a tutti i giocatori le stesse condizioni di fluidità tattica in questa modalità, indipendentemente dal livello del loro Albero dei Talenti. 

**4.7.3 Accesso e Interfaccia (Lobby Endless)**

* **Accesso dalla World Map:** Rappresentata da un **Portale Cosmico ()** situato a fianco del Capitolo 1\.  
  * *Stato Bloccato:* Portale incatenato con il messaggio *"Sconfiggi il Boss del Capitolo 1 per sbloccare"*.  
  * *Stato Sbloccato:* Il portale si illumina di viola ed è cliccabile.  
* **Lobby Pop-up (Pre-Partita):** Toccando il portale si abre una scheda contenente:  
  * **Record Personale:** Maximum Wave raggiunta (es. *Miglior Risultato: Wave 32*).  
  * **Mutatore Attivo:** Indicazione chiara della regola speciale in vigore per la settimana corrente.  
  * **Prossimo Traguardo 💎:** Ricompensa in palio per la milestone successiva.  
  * **Tasto Classifica:** Accesso diretto alla *Leaderboard* globale.

**4.7.4 Ricompense e Classifica Globale (Leaderboard)**

* **Traguardi in Diamanti (💎):**  
  * **Wave 10:** \+5 💎  
  * **Wave 25:** \+15 💎  
  * **Wave 50:** \+30 💎  
* **Classifica Settimanale:** Posizionamento globale basato sul maggior numero di Wave sopravvissute. I primi 100 giocatori della settimana ottengono skin cosmetiche ed emote esclusive per i gatti. In caso di parità sarà considerato il tempo per cui si è resistito.

**4.7.5 Sistema dei Mutatori Settimanali**

Il Mutatore è una regola speciale temporanea che ruota automaticamente ogni settimana per modificare la meta di gioco, spingendo i giocatori a testare combinazioni di fiale che normalmente ignorerebbero.

| Nome Mutatore | Effetto sul Gameplay | Impatto Strategico |
| :---- | :---- | :---- |
| 🌋 **Lava Cosmica** | L'Elemento Fuoco (🔴) infligge il **\+30% di Danno**, ma le Fiale d'Acqua (🔵) costano **\+15 DNA**. | Favorisce build ad alto danno (Fuoco/Elettricità) penalizzando il controllo d'area dell'Acqua. |
| ⚡ **Circuito Inverso** | I Gatti Elettrici (🟡) attaccano il **25% più velocemente**, ma la Carica Felina ha **30s di Cooldown** (anziché 20s). | Incoraggia il piazzamento di torrette anti-aeree riducendo l'affidabilità dell'abilità d'emergenza. |
| 🧪 **Anarchia Genetica** | La Scomposizione restituisce il **100% del DNA**, ma le Ondate muovono il **15% più velocemente**. | Permette di riposizionare la difesa al volo tra le ondate, premiando la velocità di esecuzione. |
| 🌫️ **Eclissi Abissale** | L'Elemento Ombra (🟣) infligge Danno nel Tempo raddoppiato, ma i nemici Tank hanno il **\+20% di HP Base**. | Rende indispensabili le maledizioni e i DoT per sciogliere la salute dei nemici corazzati. |

**Gerarchia di Sovrascrittura dei Mutatori (Hard Override):** Le regole imposte dai Mutatori hanno la priorità assoluta su qualsiasi statistica, talento passivo o regola della modalità. Nel caso del Mutatore **Anarchia Genetica**, il rimborso viene fissato rigidamente al **100% esatto**. È matematicamente impossibile superare il 100% di rimborso DNA, prevenendo così qualsiasi exploit di farming infinito tramite piazzamento/scomposizione ripetuta. 

# **5\. Ambienti e Sblocco Progressivo dei Mondi** {#5.-ambienti-e-sblocco-progressivo-dei-mondi}

* **Capitolo 1: Il Laboratorio Segreto**  
  * *Elemento Sbloccato:* 🔴 **Fuoco**  
  * *Focus:* Insegna a piazzare i gatti e ad aumentare la stazza (Stacking dello stesso elemento).  
* **Capitolo 2: L'Acquario Abissale**  
  * *Elemento Sbloccato:* 🔵 **Acqua / Ghiaccio**  
  * *Focus:* Insegna il rallentamento dei nemici e le prime fusioni (Fuoco \+ Acqua \= Vapore).  
* **Capitolo 3: La Centrale Elettrica**  
  * *Elemento Sbloccato:* 🟡 **Elettricità**  
  * *Focus:* Attacchi a catena e gestione di sciami veloci.  
* **Capitolo 4: La Dimensione Oscura**  
  * *Elemento Sbloccato:* 🟣 **Ombra / Cosmico**  
  * *Focus:* Resistenze elementali avanzate sui mostri (es. mostri immuni al fuoco o all'elettricità) e combo complesse.

# 

# **6\. Stile Visivo e Direzione Artistica** {#6.-stile-visivo-e-direzione-artistica}

## 6.1 Direzione Artistica e Stile Visivo {#6.1-direzione-artistica-e-stile-visivo}

Lo stile visivo è fondato sul **contrasto netto tra comicità e orrore cosmico**. La direzione artistica adotta un approccio *Cartoon / Cell-Shaded* (2D pulito o 3D Low-Poly con contorni marcati) per garantire massima leggibilità anche sulle schermate ridotte degli smartphone.

* **Modelli dei Personaggi e Contrasto Cromatico:**  
  * **I Gatti:** Disegnati con forme tondeggianti, morbide e rassicuranti. Utilizzano una **palette di colori caldi e saturi** (arancione, bianco, rosa) accesa dai bagliori degli elementi applicati (🔴 Rosso Piro, 🔵 Blu Glaciale, 🟡 Giallo Neon, 🟣 Viola Cosmico).  
  * **I Mostri Lovecraftiani:** Abomini vischiosi con occhi multipli, tentacoli e bocche sproporzionate. Utilizzano una **palette scura e desaturata** (tonalità fango, nero abissale, verde acido, viola melma) per staccare nettamente rispetto ai gatti e al percorso.  
* **Comunicazione Visiva Integrata (Diagetica):**  
  * **Lettura della Potenza:** La stazza del gatto (dal *Gattino Piccolo* fino al *Chonker Gigante*) comunica al giocatore la potenza e il livello della torretta senza bisogno di numeri o barre sopra la testa.  
  * **Lettura degli Elementi:** Un gatto con 2 fiale di Fuoco ed Elettricità mostrerà un'aura bicolore (fiamme e scosse elettriche attorno alle zampe), permettendo di identificare la build con una sola occhiata al campo.  
* **Animazioni & FX (Squash and Stretch):**  
  * Animazioni esagerate in stile cartone animato: quando una fiala viene applicata, il gatto si "gonfia" come un palloncino prima di stabilizzarsi nella nuova forma.  
  * Gli attacchi sono altamente distintivi: esplosioni di lava a fumetto, gelate a cono con cubetti di ghiaccio fluttuanti, laser sottili ad alta brillantezza e artigliate fisiche con scie bianche.  
* **Direzione degli Ambienti:**  
  * Fondali stilizzati con prospettiva dall'alto (Top-down / Isometrica).  
  * Il contrasto fra la struttura umana (piastrelle pulite, macchinari da laboratorio) e le zone contaminate dalla melma aliena evidenzia il percorso su cui avanzano le ondate

## 6.2 Audio & Sound Design {#6.2-audio-&-sound-design}

La direzione sonora ruota attorno al contrasto comico centrale del gioco: atmosfere cupe e oppressive da horror cosmico contrapposte a effetti sonori felini volutamente buffi, acuti e soddisfacenti.

* **Colonna Sonora (BGM):**  
  * **Menu & Mappa:** Sintetizzatori misteriosi, toni ambient scuri e note arpeggiate che richiamano l'esplorazione del laboratorio e dell'ignoto.  
  * **In Battaglia:** Tracce orchestrali/synth con organo dissonante e percussioni incalzanti in stile Lovecraftian, intervallate da cadenze ritmiche vivaci per mantenere il ritmo di gioco veloce e mai ansiogeno.  
  * **Boss Fights:** BGM epica e drammatica che enfatizza l'imponenza del mostro, volutamente esagerata per contrastare visivamente con le reazioni dei gatti.  
* **Effetti Sonori (SFX) — I Gatti & Le Mutazioni:**  
  * **Gatto Base & Attacchi:** Zampate, miagolii acuti e fusa al piazzamento.  
  * **Evoluzione di Stazza (Lv 0-4):** Più il gatto aumenta di stazza (fino al *Chonker* Lv 4), più i versi diventano profondi, cavernosi o caricaturali (es. miagolio roco o ruggito felino) affiancati dai suoni elementali delle fiale (fiammate, scariche elettriche, venti polari).  
  * **La Carica Felina (Laser):** Suono del click del pulsante seguito da un miagolio corale d'attacco, tamburellare frenetico di decine di zampette sul terreno e graffi a raffica.  
* **Effetti Sonori (SFX) — Nemici & Impatto:**  
  * **Abomini Cosmici:** Rumori di melma fluida (squish), versi cavernosi e passi pesanti per le unità Tank.  
  * **Eliminazione:** Versi buffi di sconfitta ("pop", squittii o dissolvenze comiche) accompagnati dal suono fluido di assorbimento delle molecole di DNA.  
* **Feedback Interfaccia & UI:**  
  * **Drag & Drop Fiale:** Suono del tappo di una provetta stappato al trascinamento della fiala e uno "clack" di incastro genetico quando la mutazione va a buon fine.  
  * **Consumabili:** Esplosione a fumetto a frequenza molto bassa per la *Bomba Atomica* ed effetto "boing" elastico/energetico per il *Campo di Forza Rimbalzante*.

# **7\. Bestiario e Nemici — Capitolo 1: Il Laboratorio Segreto** {#7.-bestiario-e-nemici-—-capitolo-1:-il-laboratorio-segreto}

Nota: le schede mostri dei mondi successivi (Acquario, Centrale Elettrica, Dimensione Oscura) appartengono alla Roadmap Post-Launch.

## 7.1 Meccaniche Generali dei Nemici & Economia del DNA {#7.1-meccaniche-generali-dei-nemici-&-economia-del-dna}

I mostri emergono dai varchi e avanzano lungo i percorsi verso la Base. Eliminandoli si ottiene la risorsa principale in-game (DNA) e, in percentuale ridotta, la valuta pregiata (Diamanti 💎).

* **Tetto Massimo Riserva (Hard Cap 9999 DNA):** La riserva di DNA accumulabile in-game durante la partita presenta un limite massimo fisso di 9999 DNA.  
* **Gestione Saturazione:** Al raggiungimento di 9999 DNA, la rigenerazione passiva (+2 DNA/sec) e il bottino ottenuto dall'eliminazione dei mostri si interrompono temporaneamente. Le risorse riprendono ad accumularsi automaticamente non appena il contatore scende sotto la soglia a seguito di piazzamenti o mutazioni.  
* **Specifiche di Codice** (EconomyManager):  
  * L'incremento della riserva viene regolato dalla formula: current\_dna \= min(9999, current\_dna \+ added\_dna).  
* **Capitale Iniziale:** All'avvio di ogni livello (dopo la schermata di caricamento), il giocatore inizia la partita con una dotazione fissa di 100 DNA pre-caricata nel contatore. Questo permette il posizionamento immediato di un paio di Gatti Base (50x2) o di un Gatto Base con la sua prima mutazione elementale (50+30) prima dell'arrivo dell'orda.   
* **Rigenerazione Passiva DNA:** \+2 DNA al secondo continui per tutta la durata delle ondate.  
* **Profili d'Ingaggio:**   
  * 🪨 *Ground* (seguono strettamente il percorso terrestre)   
  * 🦅 *Flying* (seguono lo stesso identico percorso dei nemici terrestri, ma sorvolano e ignorano completamente gli ostacoli di sabbia piazzati sul tracciato ).  
* **Attacco agli Ostacoli di Terra:** Quando un nemico terrestre incontra un ostacolo sul percorso (es. Mucchietti di sabbia), interrompe lo stato di camminata (WALK) e passa allo stato di attacco (MELEE\_ATTACK).  
  * **Danno inflitto:** Pari al valore *Danni alla base* del mostro.  
  * **Cadenza d'attacco:** **1 colpo ogni 1.0 secondo** (fisso per tutti i nemici base).  
  * **Comportamento Sciame:** Tutti i nemici che impattano l'ostacolo si fermano e sommano il proprio danno ad ogni secondo finché gli HP dell'ostacolo non arrivano a 0\.  
* **Comportamento Nemici al Raggiungimento del Laboratorio (Assedio)**  
  * **Regola di Persistenza (No Despawn):** Nessun nemico (sia truppa standard che Boss) viene rimosso dal gioco o scompare quando raggiunge il Laboratorio. Tutti i mostri rimangono attivi sul campo finché i loro HP non vengono ridotti a 0\.  
  * **Transizione di Stato (ATTACK\_BASE):** Una volta arrivato a contatto con il Laboratorio, il nemico interrompe lo stato di movimento (WALK) e passa allo stato di attacco alla struttura (ATTACK\_BASE).  
  * **Frequenza d'Attacco:** Ogni nemico applica il proprio valore *Danni* alla base (dalla Tabella 7.2) ogni **1.0 secondo** (intervallo fisso attack\_interval \= 1.0s).  
  * **Accumulo del Danno (DPS Orda):** Più nemici raggiungono la base contemporaneamente, più i loro danni si sommano ad ogni secondo (es. 5 Polipetti alla base infliggono 5x5 \= 25  danni/sec).  
  * **Interazione con i Consumabili (4.5.A):**  
    * **Defibrillatore:** Rianima la base al 30% degli HP, ma non rimuove i nemici accumulati davanti ad essa.  
    * **Campo di Forza Rimbalzante:** Diventa la combinazione tattica naturale per il Defibrillatore, spingendo indietro l'orda accumulata sotto il Laboratorio e spezzando l'assedio.  
  * **Regola d'Attacco Strutture & Bersagli Distruttibili:** Quando un nemico interrompe la marcia (WALK) ed entra in uno stato d'attacco contro una struttura (sia esso un Ostacolo di Sabbia sul percorso o il Laboratorio a fine tracciato), applica il proprio danno alla salute dell'entità target a intervalli regolari di **1.0 secondo**.  
  * **Calcolo del Danno Applicato:** L'ammontare sottratto agli HP della struttura a ogni colpo (1.0s) corrisponde esattamente alla statistica **damage** definita nella risorsa di ciascun nemico:  
    * **Polipetto di Melma:** 5 HP / colpo (5 DPS).  
    * **Tentacolo Alato:** 10 HP / colpo (10 DPS, applicato unicamente al Laboratorio).  
    * **Abominio di Roccia:** 15 HP / colpo (15 DPS).  
    * **Amalgama Infetta (Boss):** 100 HP / colpo (100 DPS).  
  * 

## 7.2 Tabella Bilanciamento Nemici (Capitolo 1\) {#7.2-tabella-bilanciamento-nemici-(capitolo-1)}

Nota di bilanciamento: La Salute Base del Laboratorio è di 100 HP all'inizio del gioco.

### 🟢 Polipetto di Melma (Sciame) {#🟢-polipetto-di-melma-(sciame)}

* **Ruolo:** Unità base da sciame ad alta velocità. Avanza in folti gruppi numerosi per travolgere le difese a bersaglio singolo; debole contro il Danno ad Area (es. Gatto Fuoco).  
* **Profilo Bersaglio:** 🪨 **Solo TERRA**

* **Tipo di Attacco:** Danno Fisico Diretto Melee / Attacco Struttura (SingleTargetMelee)  
* **Statistiche Base:**  
  * **HP Base:** 50 HP  
  * **Velocità:** Veloce (1.2x sul percorso base)  
  * **Danni al Laboratorio / Ostacoli:** 5 HP / colpo (frequenza 1 colpo/sec)  
* **Economia & Bottino:**  
  * **Ricompensa DNA:** \+5 DNA  
  * **Drop Diamanti 💎:** 0.5% (1 ogni 200 eliminati)  
* **Resistenze & Modificatori Spinta:**  
  * **Interazione Knockback:** Standard (subisce la spinta completa di 0.5 unità di griglia con il 25% di probabilità per tick).  
* **Specifiche di Codice (EnemyData\_Polipetto.tres / EnemyNode)**  
  * **Parametri Configurazione:** ingame\_type \= GROUND, base\_hp \= 50, move\_speed\_multiplier \= 1.2, damage \= 5, dna\_reward \= 5, diamond\_drop\_chance \= 0.005.  
  * **Gestione Impatto:** Se incontra un ostacolo (SandObstacle), passa a MELEE\_ATTACK e infligge 5 danni al secondo fino alla distruzione della struttura o del mostro.

  ### 

  ### 🪐 Abominio di Roccia (Tank) {#🪐-abominio-di-roccia-(tank)}

* **Ruolo:** Unità corazzata ad alta salute e movimento lento. Assorbe i colpi diretti e protegge lo sciame che avanza dietro di sé.  
* **Profilo Bersaglio:** 🪨 **Solo TERRA**

* **Tipo di Attacco:** Danno Fisico Pesante Melee (SingleTargetMelee)  
* **Statistiche Base:**  
  * **HP Base:** 350 HP  
  * **Velocità:** Lento (0.6x sul percorso base)  
  * **Danni al Laboratorio / Ostacoli:** 15 HP / colpo (frequenza 1 colpo/sec)  
* **Economia & Bottino:**  
  * **Ricompensa DNA:** \+25 DNA  
  * **Drop Diamanti 💎:** 3.0%  
* **Resistenze & Modificatori Spinta:**  
  * **Interazione Knockback:** Pesante (probabilità di spinta ridotta al 10% per tick e distanza arretramento dimezzata a 0.25 unità di griglia).  
* **Specifiche di Codice (EnemyData\_Abominio.tres / EnemyNode)**  
  * **Parametri Configurazione:** ingame\_type \= GROUND, base\_hp \= 350, move\_speed\_multiplier \= 0.6, damage \= 15, dna\_reward \= 25, diamond\_drop\_chance \= 0.03.  
  * **Calcolo Arretramento:** Durante il roll di spinta delle torrette, verifica il flag is\_heavy\_unit: se valido, applica il moltiplicatore di resistenza knockback\_distance \= base\_knockback \* 0.5.

  ### 🦇 Tentacolo Alato (Aria) {#🦇-tentacolo-alato-(aria)}

* **Ruolo:** Unità volante ad alta mobilità. Avanza lungo lo stesso tracciato dei nemici terrestri ma sorvola e ignora completamente gli ostacoli di sabbia, aggirando le difese fisiche melee.  
* **Profilo Bersaglio:** 🦅 **Solo ARIA**

* **Tipo di Attacco:** Impatto Aereo Incanalato (SingleTargetAirAttack)  
* **Statistiche Base:**  
  * **HP Base:** 120 HP  
  * **Velocità:** Media (1.0x sul percorso base)  
  * **Danni al Laboratorio:** 10 HP / colpo (frequenza 1 colpo/sec)  
* **Economia & Bottino:**  
  * **Ricompensa DNA:** \+15 DNA  
  * **Drop Diamanti 💎:** 0.5%  
* **Resistenze & Immunità:**  
  * **Immunità Terrestre:** Totalmente immune agli attacchi con profilo Solo TERRA (es. Gatto Base e Gatto Fuoco).  
  * **Immunità Ostacoli:** Ignora la presenza dei nodi SandObstacle sul percorso e prosegue l'avanzata senza arrestarsi.  
* **Specifiche di Codice (EnemyData\_TentacoloAlato.tres / EnemyNode)**  
  * **Parametri Configurazione:** ingame\_type \= FLYING, base\_hp \= 120, move\_speed\_multiplier \= 1.0, damage \= 10, dna\_reward \= 15, ignores\_sand\_obstacles \= true.  
  * **Filtro Collisione:** Salta il rilevamento delle Area2D di classe SandObstacle mantenendo inalterato lo stato di movimento (WALK).

  ### 

  ### 🧠 Boss: Amalgama Infetta (Boss) {#🧠-boss:-amalgama-infetta-(boss)}

* **Ruolo:** Minaccia finale del Capitolo 1 ad altissima salute e avanzamento inesorabile. Un suo singolo colpo alla base infligge 100 HP, causando Game Over immediato se il Laboratorio non è potenziato.  
* **Profilo Bersaglio:** 🪨 **Solo TERRA**  
* **Tipo di Attacco:** Colpo Devastante alla Base / Distruzione Immediata (BossBaseAttack)  
* **Statistiche Base:**  
  * **HP Base:** 2.500 HP  
  * **Velocità:** Molto Lento (0.4x sul percorso base)  
  * **Danni al Laboratorio:** 100 HP / colpo (frequenza 1 colpo/sec)  
* **Economia & Bottino:**  
  * **Ricompensa DNA:** \+150 DNA  
  * **Drop Diamanti 💎:** 100% Garantito  
* **Immunità al Knockback & Interazione Consumabili:**  
  * **Immunità Fisica:** **100% Immune alla spinta e all'arretramento sul tracciato**. Qualsiasi effetto di spostamento generato da torrette (es. Gatto Vapore) viene completamente annullato (proc\_chance \= 0%).  
  * **Convertitore Campo di Forza:** Se colpita dal consumabile *Campo di Forza Rimbalzante*, l'immunità fisica annulla l'arretramento sul tracciato e converte l'energia in un **Rallentamento Estremo (90% Slow) per 3.0 secondi** (tramite nodo `SlowStatus`). Il Boss non subisce interruzioni di stato (nessun nodo Stun), rispettando la sua immunità passiva ai blocchi e continuando a infliggere danni se si trova già a contatto con il Laboratorio.   
* **Abilità Speciali:**  
  * **Muta d'Emergenza (Spawn Arretrare & Conteggio Nemici):** Alla morte, il Boss genera 4 Polipetti di Melma arretrati di 2.0 unità di griglia e storditi per 1.0 secondo.  
    * **Integrazione nel Trigger di Vittoria:** I 4 Polipetti appena generati vengono registrati a tutti gli effetti come nemici attivi appartenenti all'ondata corrente. Il segnale level\_completed **non scatta alla sola morte del Boss**, ma richiede l'eliminazione totale di tutte le unità superstiti a schermo, inclusi i 4 Polipetti emersi dalla Muta.  
    * **Impatto sulla Valutazione:** Qualora uno o più Polipetti riescano a raggiungere il Laboratorio prima di essere eliminati, applicheranno il proprio valore di danno alla base (5 HP/colpo), potendo degradare la Salute della Base e invalidare la *Perfect Run* a 3 Stelle.  
  * **Disattivazione Torretta (Disruption — Soft EMP):** Alla morte, il Boss emette un'onda d'interferenza che applica lo stato DisabledStatus per 3.0 secondi alla torretta attiva più vicina entro un raggio di 3.0 unità (scelta casuale in caso di parità di distanza).  
    * **Impatto sul Gameplay:** La torretta colpita smette di sparare (cadenza di fuoco azzerata) e disattiva temporaneamente qualsiasi aura o effetto continuativo d'area (es. Gatto Abissale o Gatto Vapore).  
    * **Gestione Interfaccia & UI:** Il Menu Radiale della torretta rimane **completamente accessibile** al giocatore. È possibile toccare il gatto per applicare nuove Fiale Mutagene (i cui effetti d'attacco si attiveranno al termine dei 3.0 secondi) oppure per eseguire la **Scomposizione DNA (Vendita)** immediata, permettendo di recuperare subito la riserva di risorse per riposizionare la difesa altrove.  
  * **Specifiche di Codice (EnemyData\_Amalgama.tres / BossComponent)**  
    * **Parametri Configurazione:** ingame\_type \= GROUND, is\_boss \= true, is\_knockback\_immune \= true, base\_hp \= 2500, move\_speed\_multiplier \= 0.4, damage \= 100, dna\_reward \= 150, guaranteed\_diamonds \= 1.  
    * **Esecuzione Muta d'Emergenza (OnDeathProcess):** All'emissione del segnale died, il componente istanzia 4 nodi Polipetto, imposta la coordinata path\_position \= max(0.0, boss\_death\_pos \- 2.0), applica il nodo StunStatus con timer di 1.0 secondo su ciascun minion e incrementa il contatore delle unità attive tramite WaveManager.active\_enemies \+= 4. Il LevelManager mantiene attivo il livello finché WaveManager.active\_enemies non torna a 0\.  
    * **Esecuzione Distruzione (DisruptionProcess):** Cerca le torrette nell'area circolare R=3.0 dal punto di morte, individua l'entità a distanza minore (o esegue array.pick\_random() in caso di parità) e applica il nodo DisabledStatus con un timer di 3.0 secondi. Il nodo DisabledStatus imposta temporaneamente a true il flag is\_disabled della torretta: lo script di attacco/ingaggio salta l'esecuzione dei tick di danno, ma non intercetta né blocca gli eventi di input UI (on\_tower\_clicked e decompose\_tower), garantendo la piena funzionalità del Menu Radiale.

 

## 

## 7.3 Progressioni e Curva d'Insegnamento nel Capitolo 1 {#7.3-progressioni-e-curva-d'insegnamento-nel-capitolo-1}

* **Introduzione del Danno ad Area (Livello 1-1):** Soli Polipetti di Melma per insegnare l'efficacia del Gatto Fuoco.  
* **Introduzione dei Volanti (Livello 1-3):** I Tentacoli Alati compaiono nella Wave 3, costringendo il giocatore a usare la Carica Felina.  
* **Resistenza del Boss (Livello 1-5):** L'Amalgama Infetta richiede l'uso combinato della trasformazione in Gatto Gigante (Lv 4\) per essere abbattuta prima che tocchi il Laboratorio.

## 7.4 Struttura Livelli e Composizione Wave (Capitolo 1: Il Laboratorio Segreto) {#7.4-struttura-livelli-e-composizione-wave-(capitolo-1:-il-laboratorio-segreto)}

Il primo capitolo funge da tutorial progressivo. Ogni livello introduce gradualmente una nuova meccanica e una composizione specifica delle ondate (Wave).

| Livello | Nome Livello | Wave Totali | Composizione e Tipologia Nemici per Wave | Focus Didattico & Tattico |
| :---- | :---- | :---- | :---- | :---- |
| **1-1** | **Prime Mutazioni** | **3 Wave** | • **W1:** 10x Polipetto di Melma• **W2:** 18x Polipetto di Melma• **W3:** 25x Polipetto di Melma (Sciame continuo) | Insegna il piazzamento dei Gatti Base e l'uso dell'elemento **Fuoco (🔴)** per il Danno ad Area. |
| **1-2** | **Pelle Dura** | **3 Wave** | • **W1:** 12x Polipetto di Melma• **W2:** 15x Polipetto \+ 2x Abominio di Roccia• **W3:** 20x Polipetto \+ 4x Abominio di Roccia | Introduzione delle unità **Tank**. Insegna ad aumentare la stazza del gatto (Stacking DNA fino a Lv 2-3) per superare l'armatura. |
| **1-3** | **Minaccia dall'Alto** | **4 Wave** | • **W1:** 15x Polipetto di Melma• **W2:** 6x Tentacolo Alato (Aria)• **W3:** 10x Polipetto \+ 8x Tentacolo Alato• **W4:** 12x Tentacolo Alato (Ondata Aerea) | Introduzione dei **Nemici Volanti**. Dimostra l'inefficacia del Gatto Fuoco contro l'aria e spinge all'uso dell'Elettricità o della Carica Felina (Laser). |
| **1-4** | **Caos Protoplasmatico** | **4 Wave** | • **W1:** 15x Polipetto \+ 2x Abominio• **W2:** 8x Tentacolo Alato• **W3:** 20x Polipetto \+ 6x Tentacolo Alato• **W4:** 30x Polipetto \+ 3x Abominio \+ 8x Tentacolo Alato | **Misto Terra/Aria.** Costringe il giocatore a distribuire le torrette o a creare le prime **Forme Ibride 2x2** (es. Gatto Vapore o Plasma) per coprire più bersagli. |
| **1-5** | **L'Amalgama Infetta** | **5 Wave** | • **W1:** 20x Polipetto di Melma• **W2:** 10x Tentacolo Alato• **W3:** 15x Polipetto \+ 4x Abominio• **W4:** 20x Polipetto \+ 10x Tentacolo Alato• **W5:** **BOSS: Amalgama Infetta \+** 10x Polipetto \+ 5x Tentacolo Alato | **Boss Fight finale.** Test completo delle meccaniche: gestione del DNA, scomposizione torrette, creazione di almeno un **Gatto Gigante (Lv 4\)** e uso strategico del Laser. |

## 7.5 Layout Spaziale e Level Design delle Mappe (Capitolo 1\) {#7.5-layout-spaziale-e-level-design-delle-mappe-(capitolo-1)}

Ogni livello del Capitolo 1 introduce una variante nella conformazione del percorso per forzare il giocatore a ripensare la disposizione delle torrette.

**Nota sul Tempo di Percorso:** Il tempo indicato è calcolato su un'unità con Velocità Standard (Moltiplicatore 1.0). I tempi reali dei mostri varieranno in base alla loro statistica di velocità (es. un mostro con velocità 1.5 impiegherà meno tempo, uno con 0.5 ne impiegherà il doppio). 

| Livello | Tipo Percorso | Punti di Spawn | Piazzole Torrette | Tempo di Percorso Base |
| :---- | :---- | :---- | :---- | :---- |
| **1-1** | **Rettilineo Semplice** | 1 Tana (Sinistra) | **4 Piazzole** (2 sopra, 2 sotto il percorso) | **15 secondi** (Percorso lungo per imparare le basi) |
| **1-2** | **Curva a "U"** | 1 Tana (In alto a sinistra) | **5 Piazzole** (3 interne alla curva, 2 esterne) | **12 secondi** (Favorisce l'area d'impatto del Fuoco al centro della curva) |
| **1-3** | **Doppia Curva a "S"** | 1 Tana (In alto) | **6 Piazzole** (Distribuite sui gomiti della S) | **14 secondi** (Insegna a coprire sia la zona aerea che terrestre lungo i rettilinei) |
| **1-4** | **Percorso a Bivio (2 Vie)** | 1 Tana  Si divide e si ricongiunge | **6 Piazzole** (2 sul percorso unico, 4 divise sui bivi) | **10 secondi per ramo** (Obbliga a dividere la potenza di fuoco o usare ibridi) |
| **1-5** | **Arena del Boss (Doppio Spawn)** | **2 Tane distinte** (Sinistra e Destra) | **7 Piazzole** (3 al centro, 2 per lato) | **15 secondi** (Ampio spazio di manovra per gestire l'Amalgama e la sua scorta) |

**Regola di Gestione Doppio Spawn (Livello 1-5 Arena del Boss)**

* **Ondate Standard (Wave 1 \- 4\) — Alternanza Intervallata:**  
  * **Ripartizione 50/50 & Gestione Totali Dispari:** Il conteggio di ogni tipologia di nemico prevista per la Wave viene diviso equamente tra le due tane. In caso di quantitativo dispari (es. 15 Polipetti o 5 Tentacoli Alati), la **Tana 1 (Sinistra)** riceve l'unità in eccesso via arrotondamento per eccesso, mentre la **Tana 2 (Destra)** riceve l'arrotondamento per difetto.  
    * *Esempio:* Su 15 Polipetti, Tana 1 ne genera 8 e Tana 2 ne genera 7\.  
  * **Alternanza Temporale:** Le unità nascono a gruppi alternati tra Tana Sinistra e Tana Destra con un ritardo sfalsato di 3.0 secondi tra un punto di origine e l'altro (es. Tana 1 avvia il proprio gruppo a 00:00 e Tana 2 avvia il suo a 00:03), impedendo la sovrapposizione immediata delle orde al centro.  
  * **Specifiche di Codice (DoubleSpawnManager):**  
    * Calcolo unità Tana 1: tana\_1\_count \= ceil(enemy\_count / 2.0)  
    * Calcolo unità Tana 2: tana\_2\_count \= floor(enemy\_count / 2.0)  
* **Ondata Finale (Wave 5 \- Boss Fight) — Separazione dei Ruoli:**  
  * Spawn del Boss: L'Amalgama Infetta si genera all'inizio della Wave (00:00) esclusivamente da Tana 1 (Sinistra).  
  * Spawn della Scorta: La truppa di supporto prevista per la Wave 5 nasce interamente da Tana 2 (Destra) con un ritardo di 5.0 secondi rispetto all'ingresso del Boss.  
  * *Scopo Tattico:* Pone il giocatore davanti a una doppia minaccia simultanea, costringendolo a gestire il Boss lento sul ramo sinistro e l'orda veloce sul ramo destro

**Adattamento Layout al Formato Portrait (Orientamento Verticale):**

* **Posizionamento Tane (Top-Left / Top-Right):** Le due tane sono collocate nella parte superiore dello schermo, rispettivamente In Alto a Sinistra e In Alto a Destra, per sfruttare l'altezza del display.  
* **Direzione del Flusso:** Entrambi i percorsi si sviluppano verso il basso (Top-to-Bottom), confluendo al centro verso il Laboratorio posizionato nella zona inferiore dello schermo.  
* **Margini di Safe Area:** I punti di spawn mantengono un margine laterale interno di almeno 1.0 unità di griglia dai bordi dello schermo, evitando che i nemici appena generati finiscano sotto elementi dell'HUD o nelle zone di taglio dei dispositivi mobile.

**Regole Generali di Posizionamento Mappa:**

* **Griglia Vincolata (Piazzole):** Le torrette si posizionano esclusivamente sulle **Piazzole circolari fisse** dislocate lungo la mappa, evitando la micro-gestione millimetrica.  
* **Zona d'Ombra (Laser):** Il puntatore della Carica Felina può essere posizionato su **qualsiasi punto** dello schermo (sia sul percorso che sulle piazzole).  
* **Distanza di Sicurezza:** La prima piazzola dista sempre almeno 3 secondi di camminata dalla tana di spawn per evitare che i mostri subiscano danno nell'esatto istante in cui compaiono.

## 7.6 Flusso di Onboarding (Tutorial nei primi 60 secondi) {#7.6-flusso-di-onboarding-(tutorial-nei-primi-60-secondi)}

L'introduzione al gioco avviene in-game durante il Livello 1-1 ("Prime Mutazioni") tramite un tutorial dinamico a fermo immagine (pauusato con spotlight sui comandi) che guida il giocatore passo-passo nei primi 60 secondi di partita.

**Fase 1: Piazzamento del Gatto Base (00:00 \- 00:15)**

* **Azione:** Il gioco si avvia in pausa strategica. Il contatore in basso a sinistra mostra chiaramente 100 DNA.Un cono di luce evidenzia una piazzola vuota al centro della mappa e compare il fumetto del Professore: *"Gli abomini stanno arrivando\! Piazza il tuo primo Gatto\!"*.  
* **Input Richiesto:** *Tap* sulla piazzola attiva  Conferma piazzamento del Gatto Base (50 DNA).

**Fase 2: La Prima Mutazione Elementale (00:15 \- 00:30)**

* **Azione:** Una freccia animata indica il gatto appena piazzato. Compare il fumetto del Professore: *"Tocca il gatto per evolverlo con i tuoi frammenti di DNA\!"*.  
* **Input Richiesto:** *Tap* sul gatto  Apertura del Menu Radiale  *Tap* sul pulsante Fuoco (🔴)  Il gatto consuma il DNA e si trasforma nel Gatto Fuoco di Livello 1\.

**Fase 3: Il Primo Scontro & Raccolta DNA (00:30 \- 00:45)**

* **Azione:** Il gioco riprende a velocità normale. Dalla tana spawnano 3 Polipetti di Melma. Il Gatto Fuoco li elimina rapidamente.  
* **Feedback:** Le icone di DNA rilasciate dai mostri sconfitti volano automaticamente verso il contatore nell'HUD, mostrando visivamente come si accumula la riserva per i successivi potenziamenti.

**Fase 4: Attivazione della Carica Felina (00:45 \- 00:60)**

* **Azione:** Arriva una mini-ondata di 8 Polipetti. Il gioco va in pausa breve ed evidenzia il pulsante del Puntatore Laser con il testo: *"I gatti adorano il pallino rosso\! Selezionalo e poi tocca un punto sullo schermo per evocare la Carica Felina\!"*.  
* **Input Richiesto:** Seleziona e clicca sullo schermo nel punto in cui avanzano i nemici  Decine di gattini selvaggi sbucano dai bordi Travolgendo la truppa nemica.

**Fase 5: Sblocco della Partita Libera**

* **Esito:** Il tutorial guidato si disattiva. L'HUD si sblocca completamente e il giocatore prosegue il Livello 1-1 in autonomia con i comandi di gioco appresi.

# **8\. Interfaccia Utente e Layout Visivo (UI/UX)** {#8.-interfaccia-utente-e-layout-visivo-(ui/ux)}

L'interfaccia di gioco è progettata per dispositivi mobile con orientamento verticale (Portrait), ottimizzata per il controllo ad una mano (punti di pressione raggiungibili con il pollice) e studiata per ridurre al minimo i menu ingombranti durante la partita.

## 8.1 Struttura dello Schermo (Wireframe Concettuale) {#8.1-struttura-dello-schermo-(wireframe-concettuale)}

```
┌───────────────────────────────────────────┐
│  [❤️ HP Base 100/100] [🌊 Wave 3/5]  [💎 12]│ ◄── HUD Superiore
├───────────────────────────────────────────┤
│                                           │
│               MAPPA DI GIOCO              │
│                                           │
│       [ [Gatto] ──► (Percorso Mostri) ]   │ ◄── Viewport Centrale
│                                           │
│               🔴 (Laser Attivo)           │
│                                           │
├───────────────────────────────────────────┤
│🧬 DNA: 240│ [LASER] [Consumabile 1]    │ ◄── Action Bar
└───────────────────────────────────────────┘
```

## 

## 8.2 Componenti dell'HUD e dell'Interfaccia {#8.2-componenti-dell'hud-e-dell'interfaccia}

**1\. HUD Superiore (Stato della Partita)**

* **Barra Salute Laboratorio:** Posizionata in alto a sinistra. Cambia colore dal verde al rosso in base ai danni subiti, indicando visivamente le soglie per il punteggio (100% per 3 Stelle, 80% per 2 Stelle).  
* **Contatore Wave:** Posizionato al centro in alto. Mostra l'ondata corrente e il totale del livello (es. *Wave 3/5*).  
* **Riserva Diamanti (💎):** Posizionata in alto a destra. Mostra i diamanti raccolti come drop durante la partita corrente.  
* **Pulsante Pausa / Impostazioni:** Icona a ingranaggio nell'angolo in alto a destra per mettere in pausa, riavviare o abbandonare il livello.

**2\. Viewport Centrale (Campo di Battaglia)**

* **Piazzole Torrette:** Indicatori circolari traslucidi ubicati lungo il percorso. Un tocco singolo apre la scelta di piazzamento immediato del Gatto Base (50 DNA).  
* **Menu Radiale Torretta:** Toccando un gatto piazzato compare un pop-up circolare sovrapposto con:   
  * **Opzioni Evoluzione:** Icone con i costi in DNA per applicare le mutazioni.  
  * **Scomponi DNA:** Pulsante per vendere la torretta indicando la cifra esatta restituita.  
* **Barre della Vita Dinamiche (Floating Health Bars):** Per mantenere la mappa pulita ed evitare il caos visivo durante gli assedi, i nemici base, tank e volanti non mostrano alcuna interfaccia visiva al loro ingresso in campo.  
  * **Innesco Danno:** Al primo punto di danno subito, sopra la testa del mostro compare una micro-barra della vita orizzontale.  
  * **Design Minimalista:** La barra non mostra indicatori numerici (i valori HP/MaxHP rimangono riservati ai test di debug e al protocollo Greybox), ma comunica la salute residua tramite il progressivo svuotamento cromatico della barra.  
  * **Dissolvenza (Fade-Out):** Se un nemico non subisce danni per **3.0 secondi continui**, la barra sfuma gradualmente fino a scomparire, riapparendo unicamente a un nuovo impatto.  
  * **Gestione Boss:** L'Amalgama Infetta costituisce l'unica eccezione: la sua salute non compare sopra il modello, ma viene proiettata come una grande barra fissa e permanente ancorata nell'HUD Superiore non appena fa il suo ingresso in battaglia.

**3\. Action Bar (Azioni e Risorse)**

* **Contatore DNA:**  Si aggiorna continuamente in tempo reale (+2 DNA/sec passivo \+ bottino dalle eliminazioni dei nemici).  
  * **Formattazione Numerica Dinamica (K-Notation):** Per mantenere l'HUD pulito, leggibile ad una mano e privo di sovrapposizioni visive nell'Action Bar, il contatore adotta la visualizzazione abbreviata al raggiungimento delle 4 cifre:   
    * **Da 0 a 999:** Visualizzazione del numero intero esatto (es. **0**, **240**, **999**).  
    * **Da 1000 a 9999:** Conversione automatica in notazione compatta con il valore diviso per 1000, troncato al primo decimale (floor ad un decimale) e seguito dalla lettera "K" (es. **1000** diventa **1.0K**, **1250** e **1290** diventano **1.2K**, **9999** diventa **9.9K**). Il troncamento per difetto garantisce che l'interfaccia non mostri mai risorse decimali arrotondate per eccesso che il giocatore non possiede ancora effettivamente.   
* **Pulsante Carica Felina (Laser):** Tasto circolare a destra della sezione DNA. Durante il cooldown di 20 secondi presenta un oscuramento radiale a 360° con timer numerico al centro (*20s... 19s...*). Quando è pronto, emette un bagliore rosso e un feedback sonoro.  
* **Slot Consumabili Diamanti:** Fino a 3 slot di scelta rapida posizionati a destra del laser per attivare istantaneamente gli aiuti d'emergenza acquistati nel Diamond Shop (es. *Bomba Atomica Felina*, *Campo di Forza Rimbalzante*).  
  Nota: gli slot consumabili nell'HUD mostrano l'ombra radiale di ricarica per il cooldown d'uso (es. i 30s della Bomba Atomica).

### **Come funziona lo Stack del Consumabile in Partita** {#come-funziona-lo-stack-del-consumabile-in-partita}

* **Equipaggiamento nello Slot:** Lo slot sbloccato nell'HUD ospita la **Tipologia** di consumabile (es. *Bomba Atomica Felina*). Nell'angolo dell'icona compare un piccolo numerino con la scorta disponibile per quella partita (es. **x5**) che rappresenta il numero di cariche disponibili.  
* **Consumo e Scorta:** Ogni tocco consuma **1 carica** dalla riserva complessiva del giocatore (passando da x5 a x4). Se il giocatore finisce le cariche durante la partita, lo slot si disattiva.

# **9\. Specifiche Tecniche e Architettura Software** {#9.-specifiche-tecniche-e-architettura-software}

La sezione tecnica definisce l'infrastruttura software, il motore di gioco scelto e le linee guida architetturali per garantire prestazioni stabili a 60 FPS su dispositivi mobile.

## 9.1 Stack Tecnologico {#9.1-stack-tecnologico}

* **Game Engine:** Godot Engine 4.x (Licenza MIT Open-Source) — Utilizzato per l'impronta di memoria ridotta, l'assenza di royalty e l'ottimizzazione nativa per grafica 2D e 3D Low-Poly.  
* **Linguaggio di Programmazione:** C\# (Godot .NET) per i sistemi di calcolo complessi (Game Loop, Danni, Pathfinding) e GDScript per la gestione rapida dell'Interfaccia Utente (UI).  
* **Backend Services:** Firebase / PlayFab via plugin dedicati (GDExtension/C\#):  
  * *Autenticazione:* Anonymous Auth con collegamento opzionale ad Apple ID / Google Play Games.  
  * *Cloud Save:* Firestore / PlayFab Data per il salvataggio dei progressi (Stelle, Diamanti, Albero dei Talenti).  
  * *Leaderboards:* Classifica globale per la Modalità Infinita.  
  * *Remote Config:* Aggiornamento remoto dei Mutatori Settimanali senza rilasciare nuove build.  
* **Monetizzazione & Analytics:** Plugin ufficiali/community per Google Play Billing, Apple In-App Purchase e Firebase Analytics.

## 9.2 Target Hardware e Performance Budget {#9.2-target-hardware-e-performance-budget}

* **Piattaforme Target:** iOS (iOS 15.0+) e Android (Android 9.0+ / API level 28+).  
* **Layout & Risoluzione:** Portrait (Verticale) con adattamento dinamico dell'aspect ratio (da 16:9 a 20:9) e gestione della Safe Area per notch e fotocamere frontali.  
* **Target Frame Rate:** 60 FPS stabili su dispositivi di fascia media; lock a 30 FPS su dispositivi di fascia bassa.  
* **Limiti di Memoria:** Peak RAM \< 200 MB; dimensione pacchetto finale di installazione (APK/IPA) \< 70 MB.

## 

## 9.3 Architettura Software e Pattern di Sviluppo {#9.3-architettura-software-e-pattern-di-sviluppo}

* **Signal Bus Pattern (Autoload):** Architettura disaccoppiata basata sul sistema di segnali nativo di Godot via Singleton (`SignalBus`). I sistemi comunicano tramite eventi globali (es. `enemy_killed`, `dna_updated`, `laser_activated`) senza dipendenze dirette tra scene.  
* **Custom Resources (`Resource`):**  
  * `EnemyData.tres`: HP base, velocità, tipo (Terra/Aria), resistenze e drop DNA.  
  * `CatMutationData.tres`: Matrice combinazioni fiale (2x2, 3x1), costi DNA e valori DPS.  
  * `LevelLayoutData.tres`: Coordinate piazzole, vettori del percorso (Waypoints) e composizione Wave.  
* **Node Pooling System:** Gestore personalizzato per istanziare, disattivare e riciclare i nodi dei nemici (fino a 50+ unità contemporanee) e lo sciame della Carica Felina, azzerando i drop di frame legati alla garbage collection.  
* **State Machine (FSM):** Gestione rigida degli stati di gioco (`Boot`, `MainMenu`, `WorldMap`, `BattleActive`, `BattlePaused`, `Victory`, `Defeat`).

**Protocollo di Prototipazione "Greybox First" (Sviluppo Art-Agnostic)**

Per consentire l'immediato testing del bilanciamento e del gameplay loop senza attendere gli asset grafici definitivi, la prima versione giocabile (Milestone Alpha) deve adottare un rendering geometrico minimale con etichette di debug integrate:

* **Rappresentazione Geometrica dei Nodi:**  
  * **Gatti (Torrette):** Rappresentati da **Cerchi** (il colore identifica l'Elemento dominante, il raggio esprime la Stazza/Livello da 0 a 4).  
  * **Mostri (Nemici):** Rappresentati da **Quadrati / Rettangoli** (Verde per Polipetto, Grigio Grande per Abominio, Azzurro per Tentacolo Alato, Rosso Occupante per il Boss).  
  * **Ostacoli di Sabbia:** Rappresentati da **Triangoli** posizionati sulla griglia del tracciato.  
* **Overlay di Debug Testuale (Label Integrata):**  
  * Ogni entità a schermo deve mostrare sopra la propria forma geometrica un testo UI dinamico sempre orientato al giocatore con la sintassi \[Nome | HP / MaxHP | Stato\] (es. \[Polipetto | 35/50 | WALK\] oppure \[Gatto Vapore | \- | ATTACK\]).  
* **Architettura Disaccoppiata (Render-Independent Logic):**  
  * La logica di gameplay (FSM, hitbox di collisione Area2D, calcolo danni e targeting) deve risiedere nei nodi padre della scena.  
  * I segnaposto geometrici saranno racchiusi in un nodo figlio dedicato (VisualContainer), progettato per essere sostituito in futuro dalle Sprite2D o dai Modelli 3D definitivi senza dover toccare alcuna riga del codice di gioco o dei bilanciamenti.

## 

## 9.4 Approccio Data-Driven (Bilanciamento & Centralizzazione Parametri): {#9.4-approccio-data-driven-(bilanciamento-&-centralizzazione-parametri):}

Tutti i valori numerici di gioco (HP, DPS, cooldown, distanze di contraccolpo X, costi DNA/Diamanti, percentuali di drop e valute) devono essere esternalizzati dal codice e organizzati in risorse di configurazione dedicate (file .tres o .json).

* **Inspector-Ready:** Le risorse espongono ogni variabile direttamente nell'interfaccia dell'engine per consentire modifiche istantanee durante i test in tempo reale.  
* **Disaccoppiamento:** Il codice di gioco legge unicamente i dati da queste risorse (GameBalanceConfig, EconomyData, TowerStats), impedendo l'inserimento di numeri fissi (*hardcoded*) negli script.  
* **Prontezza per Remote Config:** Questo assetto facilita l'integrazione con i servizi backend (Firebase/PlayFab) già citati nel documento, consentendo di ritoccare il bilanciamento lato server senza dover rilasciare nuove build sugli store.  
* **Architettura Data-Driven (CatMutationData.tres):** Il parametro TargetingRule \= FIRST deve essere impostato di default nel codice base della torretta e nei file di configurazione Godot. È predisposto per essere sovrascritto dall'Inspector dell'engine per eventuali mutazioni speciali che richiedano priorità differenti (es. STRONGEST per mirare ai nemici con più HP o CLUSTER\_DENSITY per i gruppi più fitti).

## 9.5 Gestione Dati e Sicurezza {#9.5-gestione-dati-e-sicurezza}

* **Salvataggio Locale:** File JSON crittografato (AES-256) salvato nella directory `user://` per garantire la giocabilità offline.  
* **Sincronizzazione Cloud:** Push/Pull automatico del salvataggio ad ogni avvio, completamento livello e chiusura dell'app.  
* **Anti-Cheat Baseline:** Validazione dei punteggi lato server prima dell'invio alle classifiche Endless e controllo di integrità tramite Hash Check per prevenire la modifica dei Diamanti nel salvataggio locale.

