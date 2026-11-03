/* SERE PIXEL — eszközök adatai: gyors útmutatók, prioritások, S-T-O-P, kit, checklisták */
window.SERE_DATA = {
  guides: [
    {
      id: 'tuz', title: 'Tűzgyújtás', en: 'FIRE CRAFT', icon: 'fire', ch: '2',
      steps: [
        { t: 'Gyűjts', icon: 'tree', x: ['Éleszték: nyírkéreg, száraz fű, tapló', 'Gyújtós: ceruzavastag száraz gallyak', 'Tűzifa: csuklóvastagtól felfelé', 'A becsültnél 3× többet!'], tag: ['warn', 'Kerüld a zöld és a nedves fát'] },
        { t: 'Rakd', icon: 'shelter', x: ['Tisztítsd meg a helyet (kb. 1 m)', 'Gúla: éleszték középen', 'Gyújtós köré, ferdén', 'Nyílás a szél felőli oldalon'], tag: ['tip', 'A levegő a tűz fele'] },
        { t: 'Gyújts', icon: 'lighter', x: ['Háttal a szélnek, görnyedve', 'Az élesztéket gyújtsd alulról', 'Fokozatosan add hozzá a gyújtóst', 'Majd a tűzifát'], tag: ['tip', 'Egy gyufa, egy tűz'] },
        { t: 'Felügyeld', icon: 'warn', x: ['Kis tűz: kevesebb fa, jobb kontroll', 'Soha ne hagyd felügyelet nélkül', 'Tűzőr csoportban kötelező', 'Oltás: vízzel, földdel, kavarva'], tag: ['warn', 'Víz vagy föld legyen kéznél'] }
      ],
      safety: ['Fenyő gyökere felett ne: napokig parázslik', 'Nedves vagy üreges kő robbanhat', 'Zárt térben szén-monoxid!', 'Tőzeges talajon platform kell']
    },
    {
      id: 'menedek', title: 'Menedék', en: 'SHELTER', icon: 'shelter', ch: '3',
      steps: [
        { t: 'Helyszín', icon: 'eye', x: ['Vízmosástól, mederből el', 'Nincs „özvegycsináló” ág', 'Nem völgyaljon (hideglevegő-teknő)', 'Víz, tüzelő a közelben'], tag: ['warn', 'Sötétedés előtt 1–2 órával kezdd'] },
        { t: 'Keret', icon: 'axe', x: ['Erős, a havat is bírja', 'Dőlésszög 45–60°', 'Csonkok, élek eltávolítva', 'Bejárat 90°-ban a szélre'], tag: ['tip', '60° = optimális vízelvezetés'] },
        { t: 'Burkolat', icon: 'poncho', x: ['Ponyva feszesen, ráncmentesen', 'Természetes anyag: zsindelyesen', 'Alulról felfelé, átfedéssel', 'Ne érintsd belülről esőben'], tag: ['tip', 'Ne lehessen belülről átlátni'] },
        { t: 'Szigetelés', icon: 'blanket', x: ['Derékalj: a talaj a fő hőelvonó', 'Száraz avar, fenyőág, polifoam', 'Légréteg kell, ne nyomódjon össze', 'Hálózsák szárazon, felrázva'], tag: ['warn', 'Szigetelés nélkül 0 °C-on is fázol'] }
      ],
      safety: ['Tűz és menedék: kb. 90–100 cm', 'Szellőzés tűz esetén mindig', 'Roncs mellett nincs tűz', 'Ellenséges területen: nyomok eltüntetése']
    },
    {
      id: 'viz', title: 'Víz', en: 'WATER', icon: 'water', ch: '4',
      steps: [
        { t: 'Keress', icon: 'eye', x: ['Forrás > folyóvíz > állóvíz', 'Zöld növényzet, állatcsapás lejtőn', 'Eső, harmat, párologtató zacskó', 'Havat olvaszd, ne edd!'], tag: ['warn', 'Tengervíz, vizelet: SOHA'] },
        { t: 'Szűrj', icon: 'canteen', x: ['Ülepítsd, öntsd le a tetejét', 'Textil → homok → faszén → kavics', 'A szűrés NEM fertőtlenít', 'Utána mindig tisztíts'], tag: ['tip', 'Faszén: íz és szag ellen'] },
        { t: 'Tisztíts', icon: 'fire', x: ['Forralás: 1 perc lobogva', '2000 m felett 3 perc', 'Tabletta: min. 30 perc', 'Hideg/zavaros: akár 4 óra'], tag: ['ok', 'A forralás a legbiztosabb'] },
        { t: 'Igyál okosan', icon: 'tablet', x: ['0,5–0,8 liter/óra terhelés alatt', 'Víz + elektrolit együtt', 'Túlélő oldat: ½ tk só / 1 l', 'Vizelet: világos szalmasárga'], tag: ['warn', 'Túl sok víz: hiponatrémia!'] }
      ],
      safety: ['Kulacs menetét is fertőtlenítsd', 'C-vitaminos port csak tisztítás után', 'Tisztított és nyers vizet ne keverj', 'Melegben árnyékban pihenj, éjjel mozogj']
    },
    {
      id: 'jelzes', title: 'Jelzés', en: 'SIGNALING', icon: 'signal', ch: '8',
      steps: [
        { t: 'Felkészülés', icon: 'pack', x: ['Jelzőtükör, síp, stroboszkóp', 'Fáklya, füstjelző, panel', 'Rádió, tartalék elem', 'Mind a testen, nem a zsákban'], tag: ['tip', 'Kettő az egy, egy a semmi'] },
        { t: 'Hely', icon: 'map', x: ['Nyílt terület, jól látható', 'Kontrasztos háttér', 'Rejtett közelség a jelzőhelyhez', 'Ellenséges területen: csak utasításra'], tag: ['warn', 'Az ellenség is lát!'] },
        { t: 'Jelezz', icon: 'mirror', x: ['Tükör: célozz a két ujjad közt', 'Síp: 3 rövid = vészjel', 'Tűz: 3 tűz háromszögben', 'Nappal füst, éjjel fény'], tag: ['ok', 'A hármas jel nemzetközi vészjel'] },
        { t: 'Földi jelek', icon: 'star', x: ['V = segítség kell', 'X = orvosi segítség kell', '→ = erre haladok', 'Min. 3 m hosszú, 1 m széles jelek'], tag: ['tip', 'Kontraszt: hóban sötét, füvön világos'] }
      ],
      safety: ['Jelzés előtt mérd fel a fenyegetést', 'Fáklyát széllel háttal, kartávolságra', 'Tükörrel ne vakítsd a pilótát tartósan', 'Jelzés után: rejtőzz, kövesd az utasítást']
    },
    {
      id: 'navigacio', title: 'Navigáció', en: 'LAND NAV', icon: 'compass', ch: '6',
      steps: [
        { t: 'Tájold', icon: 'map', x: ['Térkép északra tájolva', 'Tájoló az északi hálóvonalon', 'Vagy tereptárgyak alapján', 'Deklináció figyelembe véve'], tag: ['tip', 'Rácsvonal = 1 km (1:50 000)'] },
        { t: 'Mérj', icon: 'compass', x: ['Arc-tájoló fogás, hüvelyk a hurokban', 'Célt az irányzószálra', 'Számlap megnyugszik → olvasd', 'Ismételd meg'], tag: ['warn', 'Fém, jármű, fegyver elhangol'] },
        { t: 'Haladj', icon: 'pack', x: ['Bezel: 1 kattanás = 3°', 'Köztes tereppont az irányban', 'Lépéspár-számolás (kb. 65/100 m)', 'Rendszeres ellenőrzés'], tag: ['tip', 'Éjjel: kattanás + világító pont'] },
        { t: 'Határozd meg', icon: 'pin', x: ['Oldalmetszés: ismert vonalon', 'Hátrametszés: 2–3 tereppont', 'Hátrairány = azimut ± 180°', 'Koordináta: jobbra, aztán fel'], tag: ['ok', 'Metszéspont = a helyed'] }
      ],
      safety: ['Nap: árnyékbot – nyugat → kelet', 'Sarkcsillag: Göncöl hátsó csillagai ×5', 'Moha, évgyűrű: megbízhatatlan', 'Tévedés esetén: S-T-O-P']
    },
    {
      id: 'elsosegely', title: 'Elsősegély', en: 'FIRST AID', icon: 'medic', ch: '8',
      steps: [
        { t: 'Biztonság', icon: 'warn', x: ['Fedezék, fenyegetés megszüntetése', 'Saját biztonságod először', 'Sérült kimentése tűz alól', 'Mérd fel a sérüléseket'], tag: ['warn', 'Halott mentő nem segít'] },
        { t: 'M – Vérzés', icon: 'medic', x: ['Életveszélyes végtagvérzés: érszorító', 'Magasan, szorosan, idő felírva', 'Törzsön: tamponálás + nyomókötés', 'Nyomás, nyomás, nyomás'], tag: ['ok', 'Masszív vérzés az első'] },
        { t: 'A–R–C', icon: 'check', x: ['A: légút – áll emelés, oldalfekvés', 'R: légzés – mellkasi seb zárása', 'C: keringés – sokk jelei, lábak fel', 'Folyamatos ellenőrzés'], tag: ['tip', 'MARCH sorrend'] },
        { t: 'H – Kihűlés', icon: 'blanket', x: ['Szigetelés alul és felül', 'Izolációs fólia, száraz ruha', 'Szélvédelem, meleg ital ha eszméleténél', 'Kihűlés sérülten gyorsabb'], tag: ['warn', 'A hideg a vérzést is rontja'] }
      ],
      safety: ['Kesztyű, ha van', 'Égési sebre ne zsírt', 'Törésnél: rögzítés két ízület között', 'Víz és elektrolit pótlása']
    }
  ],

  /* A felhasználó koncepciója szerinti SERE prioritás-lánc */
  priorities: [
    { k: 'S', t: 'Signaling – Jelzés', icon: 'signal', x: 'Jelentsd az eseményt, készítsd elő a jelzőeszközöket. A mentés a jelzéssel kezdődik (Report → Locate).', g: 'jelzes' },
    { k: 'P', t: 'Protection – Védelem', icon: 'shelter', x: 'Elsősegély, menedék, ruházat, tűz – védelem az időjárás és az ellenség ellen.', g: 'menedek' },
    { k: 'H', t: 'Health – Egészség', icon: 'medic', x: 'Sérülések ellátása, higiénia, alvás, morál. A túlélési akarat a legfontosabb felszerelés.', g: 'elsosegely' },
    { k: 'T', t: 'Travel – Helyváltoztatás', icon: 'compass', x: 'Csak megfelelő okkal és tervvel: maradj a mentésre várva, vagy szivárogj vissza.', g: 'navigacio' },
    { k: 'S', t: 'Sustenance – Ellátás', icon: 'water', x: 'Víz előbb, élelem utána. 3 nap víz nélkül, 3 hét étel nélkül.', g: 'viz' }
  ],

  stop: [
    { k: 'S', t: 'Stop – Állj meg', x: ['Állj meg, rejtőzz el', 'Lélegezz mélyen, nyugodj meg', 'Ne fuss, ne kapkodj'] },
    { k: 'T', t: 'Think – Gondolkodj', x: ['Mi történt? Ki van velem?', 'Milyen sérülések vannak?', 'Milyen veszély fenyeget most?'] },
    { k: 'O', t: 'Observe – Figyelj', x: ['Környezet: terep, időjárás, napszak', 'Ellenség, lakosság jelei', 'Mi van nálam? (felszerelés leltár)'] },
    { k: 'P', t: 'Plan – Tervezz', x: ['Prioritások sorrendje', 'Maradok vagy mozgok?', 'Jelentés, jelzés, menedék, víz'] }
  ],

  /* Kit-builder elemek: r = ritkaság (rare/imp/com), c = kategória (sus/nav/util/sig/med) */
  kit: [
    { id: 'kes', n: 'Kés', icon: 'knife', r: 'rare', c: 'util', g: 150 },
    { id: 'gyujto', n: 'Gyújtóeszközök (2–3)', icon: 'lighter', r: 'imp', c: 'util', g: 80 },
    { id: 'kulacs', n: 'Kulacs + pohár', icon: 'canteen', r: 'com', c: 'sus', g: 350 },
    { id: 'tabletta', n: 'Víztisztító tabletta', icon: 'tablet', r: 'imp', c: 'sus', g: 20 },
    { id: 'elsosegely', n: 'Egyéni elsősegély (IFAK)', icon: 'medic', r: 'imp', c: 'med', g: 400 },
    { id: 'kotel', n: 'Paracord 5–6 m', icon: 'rope', r: 'com', c: 'util', g: 60 },
    { id: 'tajolo', n: 'Tájoló (Cammenga)', icon: 'compass', r: 'rare', c: 'nav', g: 200 },
    { id: 'terkep', n: 'Térkép + koordinátamérő', icon: 'map', r: 'rare', c: 'nav', g: 120 },
    { id: 'ponyva', n: 'Ponyva / poncsó', icon: 'poncho', r: 'imp', c: 'util', g: 700 },
    { id: 'folia', n: 'Izolációs fólia', icon: 'blanket', r: 'com', c: 'util', g: 60 },
    { id: 'tukor', n: 'Jelzőtükör', icon: 'mirror', r: 'imp', c: 'sig', g: 40 },
    { id: 'sip', n: 'Síp', icon: 'whistle', r: 'com', c: 'sig', g: 15 },
    { id: 'faklya', n: 'Jelzőfény / fáklya', icon: 'signal', r: 'rare', c: 'sig', g: 150 },
    { id: 'elektrolit', n: 'Elektrolit + sótabletta', icon: 'tablet', r: 'imp', c: 'sus', g: 50 },
    { id: 'elelem', n: 'Energiaszelet, aszalt', icon: 'berries', r: 'com', c: 'sus', g: 300 },
    { id: 'fejsze', n: 'Fejsze / fűrész', icon: 'axe', r: 'rare', c: 'util', g: 900 }
  ],
  kitEssential: ['kes', 'gyujto', 'kulacs', 'tabletta', 'elsosegely', 'tajolo', 'tukor', 'sip'],


  /* Vészhelyzeti forgatókönyvek: „most kell a SERE tudás” */
  scenarios: [
    { id: 'eltevedtem', t: 'Eltévedtem', sub: 'nem tudom, hol vagyok', icon: 'compass', c: 'var(--acc)',
      steps: [
        ['ÁLLJ MEG. Ne menj tovább vaktában – minden lépés rontja a helyzetet.', 'stop'],
        ['Nyugodj meg: üld le, igyál egy kortyot, lélegezz mélyeket (S-T-O-P).', null],
        ['Gondold végig: honnan jöttél, mikor láttál utoljára ismert pontot?', null],
        ['Nézd meg a pozíciódat: GPS-koordináta / MGRS a térkép-jelölőben.', 'map'],
        ['Tájékozódj: iránytű, nap, tereptárgyak (gerinc, patak, út).', 'compass'],
        ['Ha van térerő: jelents (ki, hol, állapot). Ha nincs: maradj egy helyben, ha várnak rád.', null],
        ['Ha mozogni kell: egy irányt tarts, jelölj köztes pontokat, lefelé patak → út → település.', 'navigacio'],
        ['Sötétedés előtt 1–2 órával: menedék és tűz, ne a menetelés.', 'menedek']
      ] },
    { id: 'ejszaka', t: 'Itt kell éjszakáznom', sub: 'menedék + tűz', icon: 'shelter', c: 'var(--khaki)',
      steps: [
        ['Most kezdd – sötétedés előtt legalább 1–2 órával.', null],
        ['Hely: nem mederben, nem völgy alján, nincs feletted elhalt ág.', 'menedek'],
        ['Szigetelés a talaj ellen: avar, fenyőág, polifoam – ez fontosabb a tetőnél.', 'menedek'],
        ['Tető: ponyva/poncsó 45–60°-ban, bejárat 90°-ban a szélre.', 'menedek'],
        ['Tűz: éleszték, gyújtós, tűzifa 3× annyi, mint gondolod.', 'tuz'],
        ['Tűz és fekhely távolsága kb. 1 m; tűzőr, oltóanyag kéznél.', 'tuz'],
        ['Száraz ruha éjszakára, vizes ruhát szárítsd. Egyél, igyál lefekvés előtt.', null]
      ] },
    { id: 'viz', t: 'Nincs vizem', sub: 'keresés + tisztítás', icon: 'water', c: 'var(--blue)',
      steps: [
        ['Ne pazarolj: árnyék, pihenés a melegben, keveset beszélj, orron át lélegezz.', null],
        ['Keress: völgy alja, zöld növényzet, állatcsapás lefelé, madarak hajnalban.', 'viz'],
        ['Gyűjts: eső ponyván, harmat ruhával, párologtató zacskó élő ágon.', 'viz'],
        ['Szűrd: textil → homok → faszén → kavics. A szűrés NEM fertőtlenít!', 'viz'],
        ['Tisztítsd: forralás 1 perc, vagy tabletta + 30 perc (hidegben 4 óra).', 'viz'],
        ['Igyál mértékkel, sóval/elektrolittal: 0,5–0,8 l/óra terhelésnél.', 'viz'],
        ['Tengervizet, vizeletet, alkoholt SOHA.', null]
      ] },
    { id: 'serult', t: 'Megsérültem', sub: 'elsősegély', icon: 'medic', c: 'var(--warn)',
      steps: [
        ['Biztonság: fedezék, a veszély megszüntetése.', null],
        ['Masszív vérzés: érszorító magasan és szorosan, idő felírva; törzsön tamponálás + nyomás.', 'elsosegely'],
        ['Légút és légzés: áll emelés, oldalfekvés, mellkasi seb zárása.', 'elsosegely'],
        ['Sokk: fektesd, lábak fel, takard be.', 'elsosegely'],
        ['Kihűlés ellen: szigetelés alul és felül, izolációs fólia, szélvédelem.', 'elsosegely'],
        ['Jelents/jelezz, amint lehet. Sérülten a mozgás csak végső eset.', 'jelzes']
      ] },
    { id: 'ellenseg', t: 'Ellenség közelében', sub: 'elkerülés', icon: 'eye', c: 'var(--purple)',
      steps: [
        ['Azonnal hagyd el a földet érés / elszakadás helyét – ott keresnek először.', null],
        ['Rejtőzz: alacsony, szabálytalan, a terepbe olvadó hely – ne a nyilvánvaló bokor.', null],
        ['Fény-, hang- és tűzfegyelem. Telefon kijelző, GPS: csak ha muszáj.', null],
        ['Figyelj: mozgás, alak, árnyék, csillogás, sziluett árul el.', null],
        ['Mozogj: hajnalban, alkonyatkor, éjjel; ne úton, ne gerincen, ne nyílt terepen.', null],
        ['Nyomok: ne hagyj hulladékot, letört ágat; kemény talajon lépj.', null],
        ['Cél: kijelölt kiemelési pont / gyülekezési pont / saját erők.', 'navigacio']
      ], ch: '5' },
    { id: 'mentes', t: 'Mentésre várok', sub: 'jelzés + link-up', icon: 'heli', c: 'var(--ok)',
      steps: [
        ['Jelzőeszközök elő: tükör, síp, stroboszkóp, fáklya, panel.', 'jelzes'],
        ['Hely: nyílt, akadálymentes terület a közelben, rejtett várakozással.', 'jelzes'],
        ['Jelezz csak utasításra vagy a mentő közeledésekor.', 'jelzes'],
        ['Fegyver biztosítva, kezek láthatók, ne fuss a mentő felé.', null],
        ['Azonosítás: ISOPREP kérdések, napi kód.', null],
        ['Tűrd az átkutatást, kövesd pontosan az utasításokat.', null]
      ], ch: '7' }
  ],

  checklists: [
    { id: 'bevetes', t: 'Bevetés előtt', icon: 'pack', items: ['ISOPREP kitöltve, frissítve', 'Elkerülési terv (EPA) ismert', 'Kommunikációs terv: frekvencia, hívójel, időablak', 'Túlélőkészlet a testen', 'Jelzőeszközök ellenőrizve', 'Térkép: kiemelési helyek, gyülekezési pontok', 'Víz, elektrolit, víztisztító', 'Iránytű ellenőrizve'] },
    { id: 'menedek', t: 'Menedék – megfontolások', icon: 'shelter', items: ['Szükséges egyáltalán?', 'Van elég energiám?', 'Mivel rendelkezem?', 'Mennyi időre építem?', 'Védett a környezeti hatásoktól?', 'Kell álcázni?', 'Fenyegeti objektív veszély?', 'Kell fűtés?', 'Biztosított a szellőzés?'] },
    { id: 'tuz', t: 'Tűz – előkészítés', icon: 'fire', items: ['Hely megtisztítva (vízszintesen és függőlegesen)', 'Szélirány felmérve', 'Éleszték száraz, elegendő', 'Gyújtós méret szerint válogatva', 'Tűzifa 3× a becsültnél', 'Gyújtóeszköz kéznél', 'Oltóanyag (víz/föld) kéznél', 'Tűzőr kijelölve (csoportban)'] },
    { id: 'linkup', t: 'Link-up előtt', icon: 'heli', items: ['Kijelölt helyszín elérve, környezet figyelve', 'Jelentkezés csak utasításra', 'Jelzőeszközök előkészítve', 'Fegyver biztosítva, kezek láthatók', 'ISOPREP válaszok fejben', 'Leszállóhely akadálymentes', 'Utasítások pontos követése'] }
  ],

  markTypes: [
    { id: 'menedek', n: 'Menedék', icon: 'shelter' },
    { id: 'viz', n: 'Víz', icon: 'water' },
    { id: 'rp', n: 'Gyülekezési pont', icon: 'star' },
    { id: 'kiemeles', n: 'Kiemelés', icon: 'heli' },
    { id: 'veszely', n: 'Veszély', icon: 'skull' },
    { id: 'egyeb', n: 'Egyéb', icon: 'pin' }
  ]
};
