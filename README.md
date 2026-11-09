# SERE PIXEL — túlélési kézikönyv

Retro pixel art, **offline működő** PWA túlélési kézikönyv és eszköztár a SERE „A” szintű tananyag alapján.
A dizájn a repülőgépes safety cardok, a katonai field manualok és a 90-es évek survival játékainak keveréke.

**Megnyitás / telepítés:** https://strattila90-hue.github.io/SERE/ (a QR-kód a `?qr=1` címre visz, ami telepítő képernyőt mutat)

![QR](qr.svg)

## Funkciók
- **Kézikönyv**: 8 fejezet, tartalomjegyzék, keresés, olvasottság-jelölés
  - `TANANYAG`: a SERE „A” e-learning diák összefoglalója (bevezetés, tűzgyújtás, menedéképítés, víz)
  - `KIEGÉSZÍTVE`: a tartalomjegyzék alapján nyilvános forrásokból (elkerülés, tereptan, kiemelés, kimentendő személy)
- **Gyors útmutatók** safety card stílusban: tűz, menedék, víz, jelzés, navigáció, elsősegély
- **SERE prioritások** (Signaling → Protection → Health → Travel → Sustenance) és **S-T-O-P** checklist
- **Kit-builder**: inventory grid ritkasággal, kategóriákkal, súllyal, „PREPARED” állapottal
- **Checklisták**: bevetés előtt, menedék, tűz, link-up
- **Pixel iránytű**: telefon szenzor, fok / vonás / Cammenga kattanás, célirány
- **Térkép-jelölő**: GPS-pontok offline, távolság + irány, MGRS koordináta
- **Nappal / éjszaka** téma (automatikus vagy kézi)

## Nyomtatható tananyag (PDF, A4)
A teljes tananyag nyomtatható változata magyarul, angolul és szlovákul: [`pdf/`](pdf/) mappa (az appban: Menü → Nyomtatható PDF).
Újragenerálás a tartalom módosítása után:

```
pip install playwright pypdf && python3 -m playwright install chromium
python3 tools/pdf/make_pdf.py
```

## Telepítés telefonra
- **Android (Chrome):** nyisd meg a linket → „Telepítés most” vagy ⋮ → *Alkalmazás telepítése*
- **iPhone (Safari):** Megosztás → *Főképernyőhöz adás*

Az első megnyitás után minden fájl a készüléken tárolódik, repülő módban is működik.

## Tartalom szerkesztése
A szöveg a `tools/src/c*.md` fájlokban van. Módosítás után:

```
python3 tools/build.py tools/src js/content.js
```

és emeld a verziót a `sw.js` `VERSION` értékében, hogy a telefonok frissítsenek.

Jelölések a forrásban: `- ` felsorolás, `1. ` lépés, `! ` figyelmeztetés (piros), `+ ` tipp (zöld), `> ` kiemelés, `## id | cím | web` = kiegészített szakasz.

## Megjegyzés
Gyakorló segédlet — nem helyettesíti a hivatalos kiképzést és a hatályos HVKF szakutasítást.
Betűtípusok: VT323, Pixelify Sans, Silkscreen (SIL Open Font License, `fonts/`).

Strasszer szkv. · STRASZI

## Android-alkalmazás (APK)
**Letöltés:** https://github.com/strattila90-hue/SERE/releases/download/apk/sere-pixel.apk

Önálló alkalmazás: minden fájl az APK-ban van, első indításkor is internet nélkül fut. Letöltés után koppints a fájlra, engedélyezd az „ismeretlen forrásból” telepítést, és telepítsd. Az új verzió a régire rátelepíthető, az adatok megmaradnak (állandó aláíró kulcs: `android/app.keystore`, ne cseréld le).

- Építés: `.github/workflows/apk.yml` minden main ágra kerülő feltöltéskor (GitHub Actions), a kiadás címkéje mindig `apk`.
- Beállítások: `android/app.properties` (név, azonosító, tájolás, mely fájlok kerülnek bele – új fájlt/mappát ide is fel kell venni).
- `android/prep.py` másolja a fájlokat, a Google-betűtípusokat helyben csomagolja, és beilleszti a `native.js`-t, ami a WebView-ból hiányzó felolvasást (`speechSynthesis`), megosztást és kilépést pótolja.
- Az alkalmazásban nincs service worker: a fájlok eleve a telefonon vannak, frissítés = új APK.
- **Automatikus frissítés:** induláskor (és visszatéréskor legfeljebb 6 óránként) az alkalmazás megnézi a kiadás `apk.json` fájlját; ha újabb az APK, a háttérben letölti, és felajánlja a telepítést (egy koppintás, az adatok megmaradnak). Az első alkalommal az Android engedélyt kér a telepítéshez.
