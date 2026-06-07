# ROADMAP wdrozenia PAN VIKING SITE

## Cel dokumentu
Ten dokument jest centralnym trackerem wdrozenia strony `PAN VIKING SITE`.  
Jest jedynym zrodlem prawdy dla kolejnosci prac, statusow etapow i formalnego zamykania etapow.

## Jak korzystac
1. Pracujemy etapami i utrzymujemy tylko jeden etap w statusie `In Progress`.
2. Aktualizujemy statusy i checklisty minimum raz dziennie w dni robocze.
3. Kazdy wpis `Blocked` musi miec opis blokera oraz ownera odblokowania.
4. Etap mozna zamknac tylko po spelnieniu calego `Definition of Done` i akceptacji `Product Ownera`.
5. Po zamknieciu etapu kolejny etap automatycznie przechodzi z `Backlog` do `In Progress`.

## Definicja statusow
Staly enum statusow: `Backlog | In Progress | Blocked | Done`.

- `Backlog`: etap zaplanowany, nieuruchomiony.
- `In Progress`: etap aktywnie realizowany.
- `Blocked`: etap zatrzymany przez blocker wymagajacy odblokowania.
- `Done`: etap zamkniety po spelnieniu DoD i akceptacji PO.

## Dashboard etapow
| Etap | Owner | Termin | Status | % | Blokery | Data zamkniecia | Akceptacja PO |
|---|---|---|---|---:|---|---|---|
| Etap 1: Lead engine | Frontend | 25-31 maja 2026 | Blocked | 85% | Docelowy URL webhook + test e2e | - | - |
| Etap 2: Aktualne menu | Frontend + Content | 1-7 czerwca 2026 | Blocked | 98% | Akceptacja PO po final QA desktop/mobile | - | - |
| Etap 3: Sekcje domykajace B2B | Frontend + Content | 8-14 czerwca 2026 | Blocked | 95% | Finalny QA copy + akceptacja PO | - | - |
| Etap 4: EN + trust + SEO | Frontend + Content/SEO | 15-21 czerwca 2026 | Blocked | 100% | Akceptacja PO + zatwierdzenie tresci opinii | - | - |
| Etap 5: UX/UI premium + zaufanie | Frontend + Product + Content | 22-28 czerwca 2026 | In Progress | 84% | Formalne domkniecie Etapow 1-4 + final QA PO/copy | - | - |
| Etap 6: Mobile UX + performance | Frontend + QA | 29 czerwca-5 lipca 2026 | Backlog | 0% | Start po zamknieciu Etapu 5 | - | - |
| Etap 7: SEO one-page + dostepnosc | Frontend + Content/SEO | 6-12 lipca 2026 | Backlog | 0% | Start po zamknieciu Etapu 6 | - | - |
| Etap 8: Content QA + launch governance | Frontend + Content + PO | 13-19 lipca 2026 | Backlog | 0% | Start po zamknieciu Etapu 7 | - | - |

**Nota priorytetowa:** Etapy 1-4 pozostaja do formalnego domkniecia PO przed startem brand/mobile/SEO polish.

## Interfejs etapu (szablon)
Kazdy etap musi miec ponizszy, identyczny uklad:

- `Cel etapu`
- `Zakres`
- `Checklista zadan`
- `Definition of Done`
- `Ryzyka/Blokery`
- `Akceptacja` (data + Product Owner)

---

## Plan domkniecia Etapow 1-4 (priorytet)
1. Etap 1: podpiac docelowy URL webhook i wykonac test e2e na realnym endpointzie.
2. Etap 2: wykonac finalny sign-off PO po QA desktop/mobile.
3. Etap 3: wykonac finalny QA copy/UX i zamknac akceptacja PO.
4. Etap 4: zatwierdzic tresci opinii i uzyskac formalna akceptacje PO.
5. Po zamknieciu Etapu 4 ustawic Etap 5 z `Backlog` na `In Progress`.

### Kontekst audytu strony i oryginalu
- Oryginal `panviking.pl` jest punktem odniesienia dla prostoty oferty, procesu kontaktu, formularza firmowego i FAQ odpowiadajacego na podstawowe obiekcje: ceny, dostawa, platnosci, diety, regularnosc i brak umowy.
- Obecna lokalna wersja ma wiecej funkcji niz oryginal: hero slider, sekcje przewag, opinie, proces, mape dostaw, menu z JSON, shortliste, formularz 2-etapowy, `PL/EN`, SEO meta i JSON-LD.
- Roadmapa od Etapu 5 ma priorytet jakosciowy: wizerunek premium, uzytecznosc dla klienta B2B, mobile UX i SEO one-page. Nie dokladamy ciezkich funkcji, jesli nie wzmacniaja wiarygodnosci i klarownosci strony.

---

## Etap 1 (25-31 maja 2026) - Lead engine
**Owner:** `Frontend`  
**Status:** `Blocked`

### Cel etapu
Uruchomic formularz B2B 2-etapowy z kwalifikacja leada oraz integracja shortlisty z leadem.

### Zakres
- Formularz B2B 2-etapowy.
- Pola: `firma`, `osoba`, `email`, `telefon`, `miasto`, `liczba osob`.
- Pola doprecyzowujace: `adres`, `godziny`, `uwagi`, `preferencje`, `zgoda`.
- Wysylka danych do `Webhook`.
- Integracja shortlisty z payloadem leada.

### Checklista zadan
- [x] Zaprojektowac i wdrozyc UX formularza 2-etapowego.
- [x] Dodac walidacje klienta dla pol wymaganych i formatu email.
- [x] Dodac stany bledow i komunikaty dla uzytkownika.
- [x] Dodac wysylke payloadu do webhooka (konfigurowalny URL).
- [x] Dolaczyc shortlista dan do payloadu formularza.
- [x] Dodac potwierdzenie poprawnej wysylki.
- [ ] Podpiac docelowy URL webhooka i wykonac test e2e na realnym endpointzie.

### Definition of Done
- [x] Walidacja pol dziala zgodnie z wymaganiami.
- [x] Obsluga bledow i komunikaty sa czytelne.
- [x] Payload zawiera dane formularza i shortlisty.
- [x] Po sukcesie wyswietla sie potwierdzenie wysylki.

### Ryzyka/Blokery
- [ ] Brak endpointu webhook lub brak specyfikacji payloadu. Owner odblokowania: `PO/Backend`.
- [x] Niespelnione wymagania prawne dla zgody i danych. (Dodano wymagana zgode i linki legal)

### Akceptacja
- Data zamkniecia: `____-__-__`
- Product Owner: `________________`

---

## Etap 2 (1-7 czerwca 2026) - Aktualne menu
**Owner:** `Frontend + Content`  
**Status:** `Blocked`

### Cel etapu
Przejsc z twardego linku PDF na aktualizowane dane menu z lokalnego JSON.

### Zakres
- Zrodlo danych menu: `lokalny JSON`.
- Widok `menu na dzis`.
- Tagi i makra dla pozycji.
- Eksport shortlisty.

### Checklista zadan
- [x] Zaprojektowac strukture danych menu w JSON.
- [x] Podlaczyc renderowanie menu do lokalnego JSON.
- [x] Dodac mechanizm pokazywania aktualnego dnia.
- [x] Dodac tagi i makra do kart dan.
- [x] Dodac eksport shortlisty (kopiowanie + pobranie JSON + czyszczenie shortlisty).
- [x] Wykonac finalny QA UX na docelowym flow (desktop + mobile) i przygotowac zamkniecie do akceptacji PO.

### Definition of Done
- [x] Aktualizacja danych menu nie wymaga edycji HTML.
- [x] Filtrowanie kategorii i dni dziala poprawnie.
- [x] Aktualny dzien jest poprawnie widoczny i oznaczony.
- [x] Shortlista da sie wyeksportowac.

### Ryzyka/Blokery
- [ ] Niekompletne lub niespojne dane menu od Content.
- [x] Brak ustalonego formatu eksportu shortlisty. (Ustalono: kopiowanie tekstu + plik JSON)
- [ ] Akceptacja PO po finalnym QA desktop/mobile.

### Akceptacja
- Data zamkniecia: `____-__-__`
- Product Owner: `________________`

---

## Etap 3 (8-14 czerwca 2026) - Sekcje domykajace decyzje B2B
**Owner:** `Frontend + Content`  
**Status:** `Blocked`

### Cel etapu
Dodac sekcje, ktore zmniejszaja niepewnosc klienta i domykaja decyzje zakupowa B2B.

### Zakres
- Sekcja `Gdzie dowozimy` oparta o `lokalny JSON` miast.
- Sekcja `Jak zamowic` (4 kroki).
- Rozszerzone FAQ (pelny zestaw obiekcji).

### Checklista zadan
- [x] Dodac dane miast i licznik zasiegu z lokalnego JSON.
- [x] Wdrozyc sekcje `Jak zamowic` w 4 krokach.
- [x] Rozszerzyc FAQ do pelnego zakresu pytan obiekcyjnych.
- [x] Powiazac CTA z formularzem i flow zamowienia.
- [ ] Wykonac finalny QA copy/UX (desktop + mobile) i zamknac akceptacja PO.

### Definition of Done
- [x] Licznik i lista miast dzialaja na danych.
- [x] 4 kroki zamowienia sa widoczne i zrozumiale.
- [x] FAQ odpowiada na kluczowe obiekcje klienta B2B.
- [x] Flow od sekcji informacyjnych do formularza jest spojny.

### Ryzyka/Blokery
- [ ] Brak finalnej listy miast. (Owner odblokowania: `Content`)
- [ ] Niespojne copy miedzy sekcjami. (Owner odblokowania: `PO + Content`)

### Akceptacja
- Data zamkniecia: `____-__-__`
- Product Owner: `________________`

---

## Etap 4 (15-21 czerwca 2026) - EN + zaufanie + SEO
**Owner:** `Frontend + Content/SEO`  
**Status:** `Blocked`

### Cel etapu
Uruchomic pelna wersje EN oraz wzmocnic trust i SEO techniczne.

### Zakres
- `PL/EN` na jednej stronie (i18n JS).
- Sekcja opinii klientow i social proof.
- Klikalne linki legal (`polityka`, `regulamin`).
- Podstawowe SEO techniczne (`OG`, `schema`, `alternates`).

### Checklista zadan
- [x] Wdrozyc warstwe i18n JS i przelacznik PL/EN.
- [x] Dodac i podlaczyc tlumaczenia dla kluczowych sekcji.
- [x] Dodac sekcje opinii i elementy social proof.
- [x] Dodac klikalne linki legal.
- [x] Uzupelnic meta OG, schema i linki alternate.
- [x] Wykonac finalny QA EN (desktop + mobile) i przygotowac etap do akceptacji PO.

### Definition of Done
- [x] Przelacznik jezyka dziala globalnie.
- [x] Sekcje trust i legal sa kompletne i klikalne.
- [x] Meta i schema sa obecne i poprawne technicznie.
- [x] Wersja EN jest spojna tresciowo z PL.

### Ryzyka/Blokery
- [ ] Zatwierdzenie tresci opinii do publikacji. Owner odblokowania: `PO + Content`.
- [ ] Formalna akceptacja etapu przez Product Ownera. Owner odblokowania: `PO`.

### Akceptacja
- Data zamkniecia: `____-__-__`
- Product Owner: `________________`

---

## Etap 5 (22-28 czerwca 2026) - UX/UI premium + zaufanie
**Owner:** `Frontend + Product + Content`  
**Status:** `In Progress`

### Cel etapu
Sprawic, aby strona wygladala bardziej wiarygodnie, klarownie i premium niz oryginal, bez komplikowania sciezki klienta B2B.

### Zakres
- Hierarchia pierwszego ekranu: usluga, marka, obietnica, CTA.
- Czytelniejsze CTA w hero, menu, procesie i formularzu.
- Mocniejsze sekcje proof/trust bez przecladowania strony.
- Konsekwentne copy PL/EN z jednym tonem marki.
- Uproszczenie miejsc o wysokim obciazeniu wizualnym.
- Sprawdzenie, czy sekcje nie konkuruja ze soba o uwage.

### Checklista zadan
- [x] Przejrzec pierwszy ekran pod test 5 sekund: co robimy, dla kogo, dlaczego warto, co kliknac.
- [x] Uporzadkowac priorytet CTA: glowne CTA do formularza, pomocnicze CTA do menu/procesu.
- [x] Wzmocnic trust: opinie, social proof, zwiazek z Kuchnia Vikinga, SLA kontaktu, legal.
- [x] Skrocic lub przeformatowac copy tam, gdzie spowalnia skanowanie strony.
- [x] Sprawdzic spojnosc PL/EN w sekcjach hero, oferta, proces, menu, FAQ, kontakt.
- [x] Przemodelowac sekcje przewag na scroll-story z pojedynczymi filarami i animacja przejscia.
- [x] Przeniesc `Gdzie dowozimy` nad `Opinie klientow`, aby flow bylo: przewagi -> dostepnosc -> social proof.
- [x] Przebudowac mape dostaw na narzedzie konwersyjne: licznik, autocomplete miasta, status wyniku, CTA i panel regionu.
- [x] Zsynchronizowac `data/cities-coverage.json` z oficjalna lista `238` miast oraz ograniczyc mape do reprezentacyjnych punktow regionalnych.
- [ ] Wykonac QA wizualny desktop/mobile i przygotowac etap do akceptacji PO.

### Definition of Done
- [ ] Klient w 5 sekund rozumie usluge, widzi marke i ma jasne CTA.
- [ ] Najwazniejsze sekcje wspieraja decyzje B2B zamiast konkurowac ze soba wizualnie.
- [ ] Proof/trust wyglada wiarygodnie i nie opiera sie na pustych haslach.
- [ ] Sekcja zasiegu pozwala szybko sprawdzic miasto, region i kolejny krok bez szukania informacji w kilku miejscach.
- [ ] PL i EN maja spojny ton, bez brakujacych lub niespojnych tlumaczen.

### Ryzyka/Blokery
- [ ] Brak zatwierdzonego tonu marki premium. Owner odblokowania: `PO + Content`.
- [ ] Brak zatwierdzonych tresci opinii lub social proof. Owner odblokowania: `PO + Content`.
- [ ] Konflikt miedzy efektem wizualnym a szybkoscia/mobile UX. Owner odblokowania: `Frontend + Product`.

### Akceptacja
- Data zamkniecia: `____-__-__`
- Product Owner: `________________`

---

## Etap 6 (29 czerwca-5 lipca 2026) - Mobile UX + performance
**Owner:** `Frontend + QA`  
**Status:** `Backlog`

### Cel etapu
Zapewnic bardzo dobre skalowanie strony na telefonach i tabletach oraz ograniczyc ryzyka performance, LCP i CLS.

### Zakres
- Hero `100svh` i zachowanie pierwszego ekranu na mobile.
- Nawigacja mobilna, CTA i contact bot.
- Menu, filtry, dni, shortlista i eksport na ekranach dotykowych.
- Mapa dostaw, wyszukiwarka miast i lista lokalizacji.
- Formularz 2-etapowy, walidacja i zgody.
- Tap targety minimum 44 px, brak poziomego scrolla i brak overlapow.
- Optymalizacja obrazow ponizej pierwszego ekranu i stabilne wymiary mediow.

### Checklista zadan
- [ ] Przetestowac layouty: `360x740`, `390x844`, `430x932`, `768x1024`, `1024x768`, `1440x900`.
- [x] Sprawdzic hero, nav, CTA i contact bot pod zaslanianie tresci oraz ergonomie kciukiem.
- [ ] Zweryfikowac menu: scroll-snap, filtry, przyciski shortlisty, eksport i puste stany.
- [ ] Zweryfikowac mape: autocomplete, klawiature, punkty reprezentacyjne, regiony, panel miast, fallback i reduced motion.
- [ ] Zweryfikowac formularz: focus, walidacja, komunikaty bledow, zgoda i sukces.
- [ ] Zoptymalizowac obrazy oraz lazy loading tam, gdzie nie dotyczy LCP.
- [ ] Wykonac pass Lighthouse mobile/desktop i zapisac wyniki w logu etapu.

### Definition of Done
- [ ] Brak poziomego scrolla, overlapow i ucietych tekstow na docelowych viewportach.
- [ ] Menu i formularz sa wygodne w obsludze dotykowej.
- [ ] Sekcja zasiegu pozostaje czytelna i klikalna na mobile bez zaleznosci od hover.
- [ ] Contact bot i fixed header nie zaslaniaja krytycznych akcji.
- [ ] Obrazy nie psuja LCP/CLS, a elementy mediow maja stabilne wymiary.
- [ ] `prefers-reduced-motion` ogranicza animacje bez utraty funkcjonalnosci.

### Ryzyka/Blokery
- [ ] Ciezkie assety hero/menu moga pogorszyc LCP na mobile. Owner odblokowania: `Frontend`.
- [ ] Animacje i fixed elementy moga generowac overlap na malych ekranach. Owner odblokowania: `Frontend + QA`.
- [ ] Brak decyzji, ktore obrazy sa krytyczne dla first viewport. Owner odblokowania: `Product + Content`.

### Akceptacja
- Data zamkniecia: `____-__-__`
- Product Owner: `________________`

---

## Etap 7 (6-12 lipca 2026) - SEO one-page + dostepnosc
**Owner:** `Frontend + Content/SEO`  
**Status:** `Backlog`

### Cel etapu
Uzyskac maksymalnie dobre SEO i dostepnosc dla jednej strony `PL/EN`, bez osobnych landing pages miast i bez bloga.

### Zakres
- Title i description z poprawnymi polskimi znakami w tresci produkcyjnej.
- Jedna logiczna struktura `H1/H2/H3`.
- `canonical`, `hreflang`, `OG`, `Twitter` dla PL/EN.
- JSON-LD: `Organization`, `WebSite`, `WebPage`, `Service`, opcjonalnie `FAQPage`.
- `sitemap.xml` i `robots.txt` dla strategii one-page.
- Alt text dla znaczacych obrazow i puste alty dla dekoracji.
- Widoczny focus, sensowne aria-labels, obsluga klawiatury i live regions.

### Checklista zadan
- [ ] Zweryfikowac meta title/description i ich wersje jezykowe.
- [ ] Zweryfikowac `canonical` i `hreflang` bez duplikacji kanonicznej miedzy PL/EN.
- [ ] Przejrzec naglowki i usunac nielogiczne przeskoki hierarchii.
- [ ] Zweryfikowac JSON-LD w validatorze danych strukturalnych.
- [ ] Dodac lub potwierdzic `sitemap.xml` i `robots.txt`.
- [ ] Przejrzec alt texty, focus states, role, aria i obsluge klawiatury.
- [ ] Wykonac Lighthouse SEO/accessibility pass i zapisac wynik w logu etapu.

### Definition of Done
- [ ] Lighthouse SEO pass bez krytycznych bledow.
- [ ] Dane strukturalne sa poprawne technicznie i zgodne z aktywnym jezykiem.
- [ ] Strona ma jedna logiczna strukture naglowkow.
- [ ] FAQ jest mozliwe do indeksacji i opcjonalnie opisane przez `FAQPage`.
- [ ] Nie istnieja osobne city landing pages, blog ani content hub w zakresie tej roadmapy.

### Ryzyka/Blokery
- [ ] Strategia one-page ogranicza potencjalny ruch lokalny z fraz miejskich. Owner swiadomej decyzji: `PO`.
- [ ] Dynamiczna zmiana jezyka moze powodowac dryf meta/schema. Owner odblokowania: `Frontend + SEO`.
- [ ] Brak finalnych tekstow PL/EN moze blokowac finalny SEO QA. Owner odblokowania: `Content`.

### Akceptacja
- Data zamkniecia: `____-__-__`
- Product Owner: `________________`

---

## Etap 8 (13-19 lipca 2026) - Content QA + launch governance
**Owner:** `Frontend + Content + PO`  
**Status:** `Backlog`

### Cel etapu
Zapewnic, ze strona pozostaje aktualna, wiarygodna i latwa do utrzymania po wdrozeniu.

### Zakres
- Procedura aktualizacji `data/menu-week.json`.
- Procedura aktualizacji `data/cities-coverage.json`.
- Lista kontrolna publikacji opinii i social proof.
- QA tlumaczen `PL/EN`.
- Finalne podpiecie webhooka.
- Podstawowy tracking jakosciowy dla przyszlych decyzji.

### Checklista zadan
- [ ] Spisac ownerow aktualizacji menu, miast, FAQ, opinii i legal.
- [ ] Dodac checklisty aktualizacji `menu-week.json` i `cities-coverage.json`.
- [ ] Dodac checklisty QA tlumaczen i akceptacji tresci opinii.
- [ ] Podpiac docelowy webhook i wykonac test e2e formularza na realnym endpointzie.
- [ ] Ustalic minimalny standard eventow: `cta_click`, `menu_view`, `shortlist_add`, `lead_step_complete`, `lead_submit_success`, `lang_switch`, `coverage_search`, `coverage_match_select`, `coverage_expansion_cta_click`.
- [ ] Przygotowac launch checklist: mobile, SEO, legal, tracking, webhook, backup danych.
- [ ] Po publikacji zebrac pierwszy raport jakosciowy: mobile UX, klikniecia CTA, wyslania formularza.

### Definition of Done
- [ ] Aktualizacja tresci moze byc wykonana bez edycji HTML tam, gdzie dane sa w JSON.
- [ ] Ownerzy aktualizacji sa wskazani w roadmapie lub w powiazanym dokumencie operacyjnym.
- [ ] Webhook jest podlaczony i przetestowany e2e.
- [ ] Po publikacji mozna ocenic mobile UX, klikniecia CTA i wyslania formularza.
- [ ] Istnieje jasna lista warunkow dopuszczenia strony do publikacji.

### Ryzyka/Blokery
- [ ] Brak docelowego webhooka. Owner odblokowania: `PO/Backend`.
- [ ] Brak wlasciciela aktualizacji tresci. Owner odblokowania: `PO`.
- [ ] Brak decyzji, gdzie raportowac eventy po starcie. Owner odblokowania: `PO + Tech`.

### Akceptacja
- Data zamkniecia: `____-__-__`
- Product Owner: `________________`

---

## Parking Lot / Later
Pomysly z dawnego Etapu 5 nie sa usuwane, ale sa poza zakresem aktualnego priorytetu wizerunkowego `one-page premium`.

- `Lead scoring` i priorytetyzacja leadow po wysylce formularza.
- Kalkulator kosztu miesiecznego (`liczba osob x dni x model zamowien`).
- Udostepnianie shortlisty zespolowi przez Slack/Teams lub inne narzedzia.
- Mini panel operacyjny do edycji `lokalnego JSON`.
- Mechanizm odzysku porzuconych formularzy.
- Rozbudowane raportowanie KPI, jesli po starcie bedzie potrzebny etap growth/conversion.

---

## Public Interfaces / Types
1. Obowiazuje staly enum statusow: `Backlog | In Progress | Blocked | Done`.
2. Kazdy etap musi trzymac identyczny schemat sekcji (kontrakt pracy zespolu).
3. Jawnie zadeklarowane zrodla danych:
   - Menu: `data/menu-week.json`
   - Miasta/mapa: `data/cities-coverage.json`
   - Leady: `data-lead-webhook-url` albo `window.PAN_VIKING_WEBHOOK_URL`
   - Jezyki: jedna strona z runtime `PL/EN`
4. Strategia SEO jest `one-page`; nie wprowadzamy city landing pages, bloga ani content hubu w tej roadmapie.
5. Minimalny przyszly kontrakt eventow:
   - `cta_click`
   - `menu_view`
   - `shortlist_add`
   - `lead_step_complete`
   - `lead_submit_success`
   - `lang_switch`
   - `coverage_search`
   - `coverage_match_select`
   - `coverage_expansion_cta_click`

## Rytm zarzadzania etapami
- Aktualizacja statusow minimum 1x dziennie roboczo.
- `Blocked` wymaga opisu blokera i ownera odblokowania.
- Zamkniecie etapu tylko po odhaczeniu calego DoD i akceptacji PO.
- Po zamknieciu etapu kolejny etap przechodzi z `Backlog` do `In Progress`.

## Decision Log
| Data | Decyzja | Powod | Wplyw |
|---|---|---|---|
| 2026-05-21 | Centralny tracker w `ROADMAP.md` | Jeden punkt prawdy dla zespolu | Spojne prowadzenie etapow i statusow |
| 2026-05-21 | Leady przez `Webhook` | Szybkie uruchomienie bez budowy panelu | Krotszy time-to-market |
| 2026-05-21 | Menu i miasta z `lokalnego JSON` | Latwiejsza kontrola danych | Niska zlozonosc integracji |
| 2026-05-21 | EN przez i18n JS na jednej stronie | Brak duplikacji layoutu | Latwiejsze utrzymanie |
| 2026-05-22 | Tlumaczenia menu przez pola `*En` w JSON | Zachowanie jednego kodu UI i pelnej wersji EN | Spojnosc tresci PL/EN bez duplikowania sekcji |
| 2026-05-22 | SEO i schema sterowane jezykiem w runtime | Spojnosc danych metadata/JSON-LD z aktywnym PL/EN | Lepsza jakosc indeksacji i mniejszy dryf tresci |
| 2026-05-23 | Zaproponowano Etap 5 jako warstwe przewagi funkcjonalnej | Potrzeba przewagi nad oryginalem i lepszej jakosci leadow | Pomysly przeniesione pozniej do `Parking Lot / Later` |
| 2026-05-30 | Roadmapa przestawiona na `one-page premium` | Priorytet biznesowy: wizerunek, UX/UI, mobile i SEO bez rozbudowy content hubu | Etapy 5-8 obejmuja polish, mobile, SEO one-page i governance |
| 2026-06-05 | Mapa dostaw przeniesiona nad `Opinie klientow` i uproszczona do modelu search + region panel | Szybsze sprawdzenie dostepnosci oraz lepszy flow: przewagi -> zasieg -> social proof | Lokalny JSON pozostaje zrodlem prawdy, ale dane zostaly zsynchronizowane z oficjalna lista `238` miast |

## Progress Log
- 2026-05-21: Utworzono roadmape, zdefiniowano statusy, dashboard i prefill etapow.
- 2026-05-21: Ustawiono startowo Etap 1 jako `In Progress`, pozostale etapy jako `Backlog`.
- 2026-05-21: Wdrozono formularz B2B 2-etapowy z walidacja, stanami bledow/sukcesu, integracja shortlisty i payloadem webhook.
- 2026-05-21: Etap 2 uruchomiony. Menu przepiete na `data/menu-week.json`, dodano `menu na dzis`, tagi i makra oraz eksport shortlisty.
- 2026-05-21: Etap 3 uruchomiony. Dodano `Gdzie dowozimy` z `data/cities-coverage.json`, rozbudowano `Jak zamowic` o interaktywne kroki i wdrozono pelne FAQ akordeonowe.
- 2026-05-22: Etap 2 final QA pass (desktop/mobile) wykonany. Wdrozone szybkie poprawki UX: wieksze tap-targety, scroll-snap dla list dni/filtrow, lepsze zachowanie przyciskow eksportu na mobile oraz nawigacja klawiaturowa strzalkami po dniach i filtrach.
- 2026-05-22: Etap 4 uruchomiony. Dodano warstwe i18n `PL/EN`, sekcje social proof, klikalne linki legal oraz techniczne SEO (`OG`, `canonical`, `alternates`, `schema`).
- 2026-05-22: Zaktualizowano `data/menu-week.json` o pola `*En` (dni, kategorie, dania, tagi, badge), aby wersja EN obejmowala rowniez tresc menu.
- 2026-05-22: Etap 4 final polish + QA pass: domknieto tlumaczenia a11y (aria), przelaczanie etykiet bota kontaktowego `PL/EN` oraz dynamiczne JSON-LD zalezne od aktywnego jezyka. Etap gotowy do formalnej akceptacji PO.
- 2026-05-23: Rozszerzono roadmape o plan domkniecia Etapow 1-4 oraz prefill `Etapu 5: Funkcje przewagi` z zakresem, DoD i KPI.
- 2026-05-30: Zaktualizowano roadmape pod cel `one-page premium`: zachowano Etapy 1-4, zastapiono dawny Etap 5 etapem UX/UI premium oraz dodano Etapy 6-8 dla mobile, SEO i launch governance.
- 2026-05-30: Rozpoczeto wdrozenie Etapu 5 w kodzie: dodano trust strip w hero, preload obrazu hero, lazy/decoding dla obrazow poza pierwszym ekranem, FAQPage JSON-LD, `robots.txt`, `sitemap.xml` oraz minimalny kontrakt eventow.
- 2026-05-30: Druga paczka wdrozenia: ujednolicono glowne CTA na `Umow/Book test day`, skrocono copy formularza, zmieniono oznaczenia opinii z Google/verified na neutralny feedback B2B, poprawiono hero na mobile/tablet oraz wykonano zrzuty kontrolne dla 6 viewportow w `.tmp-mobile-audit/`.
- 2026-05-30: Poprawka mobile po QA: logo hero na telefonie/tablecie przesuniete poza przycisk menu, a slajd z autem dostal osobne skalowanie tla SVG, zeby nie zostawial pustych pasow w kadrze.
- 2026-05-30: Dopracowano hamburger menu: usunieto limit `320px`, dodano responsywny drawer z wlasnym przewijaniem, pelnoszerokim CTA/lang na telefonie, zamykaniem po kliknieciu poza menu i obsluga `Escape`.
- 2026-05-30: Przemodelowano sekcje `Dlaczego Pan Viking` na sticky scroll-story: filary podmieniaja sie pojedynczo podczas scrollowania, chipy dzialaja jako nawigacja do filarow, a aktywny element ma animacje dojazdu dostawy.
- 2026-06-05: Sekcja `Gdzie dowozimy` zostala przeniesiona nad `Opinie klientow` i przebudowana na konwersyjny modul z autocomplete, aktywnym regionem, lista miast i uproszczona mapa wojewodztw.
- 2026-06-05: `data/cities-coverage.json` zsynchronizowano z oficjalnym zasiegiem `238` miast, dodano `mapPoints` jako warstwe reprezentacyjna oraz eventy `coverage_match_select` i `coverage_expansion_cta_click`.
- 2026-06-05: Wykonano wstepny pass pod `Etap 6`: hero i drawer mobilny dostaly `100dvh`, sekcje ponizej folda odroczony render (`content-visibility`), duze ilustracje stabilne wymiary `width/height`, uproszczono motion na `pointer: coarse`, oczyszczono mape z martwego dropdownu podpowiedzi i poprawiono safe-area dla `contact bot`.
- 2026-05-30: Dopracowano przejscia scroll-story: karty dostaly scroll-driven efekt spadania, osiadania w stosie i krotki impact po aktywacji filaru.
- 2026-05-30: Zmieniono kierunek animacji filarow: przyszle karty nie wjezdzaja z dolu, tylko sa ukryte do progu sticky i po aktywacji spadaja z gory jak kartony na stos.
- 2026-05-30: Sekcja przewag zostala przebudowana na efekt blizszy referencji `stacked sticky cards`: outer sticky + inner shell, progresywne skalowanie i przyciemnianie poprzednich kart oraz centrowanie aktywnego filtra na mobile.

## Test Plan (operacyjny)
1. Scenariusz `start etapu`: ustawic Etap 1 na `In Progress`, pozostale jako `Backlog`.
2. Scenariusz `blokada`: oznaczyc zadanie jako `Blocked` i dodac wpis blokera tego samego dnia.
3. Scenariusz `zamkniecie`: odhaczyc cale DoD, wpisac date i akceptacje PO, zmienic status etapu na `Done`.
4. Scenariusz `przejscie dalej`: po zamknieciu etapu podniesc kolejny etap do `In Progress`.
5. Scenariusz `audyt postepu`: na podstawie Dashboardu i Progress Logu odtworzyc co zrobiono, co blokuje i co jest nastepne.
6. Scenariusz `mobile QA`: sprawdzic viewporty `360x740`, `390x844`, `430x932`, `768x1024`, `1024x768`, `1440x900`.
7. Scenariusz `flow QA`: przejsc hero -> CTA, menu filtering, shortlist add/copy/download/clear, formularz krok 1/2, walidacje, sukces webhooka, brak webhooka i powrot z formularza do menu.
8. Scenariusz `UX/UI QA`: potwierdzic brak nakladania tekstu, brak poziomego scrolla, tap targety minimum 44 px, widoczny focus, logiczne CTA i spojne sekcje trust/proof.
9. Scenariusz `SEO QA`: zweryfikowac title/meta/OG/Twitter, canonical/hreflang PL/EN, JSON-LD validator, sitemap/robots, jedna strukture H1, indeksowalnosc FAQ i alt text.
10. Scenariusz `performance QA`: wykonac Lighthouse mobile/desktop, sprawdzic LCP hero, lazy loading ponizej folda, brak duzych layout shiftow i dzialanie `prefers-reduced-motion`.

## Assumptions
1. `ROADMAP.md` jest jedynym zrodlem prawdy dla kolejnosci prac na stronie `PAN VIKING SITE`.
2. Ownerzy sa wpisani rolami (`Frontend`, `Content`, `Content/SEO`, `PO`) i moga byc podmienieni na osoby.
3. Terminy etapow sa tygodniowe i jawne: 25 maja 2026, 1 czerwca 2026, 8 czerwca 2026, 15 czerwca 2026, 22 czerwca 2026, 29 czerwca 2026, 6 lipca 2026, 13 lipca 2026.
4. Akceptujacym zamkniecie etapu jest `Product Owner`.
5. Priorytet biznesowy po Etapie 4 to `Wizerunek`, nie maksymalizacja leadow ani rozbudowany content SEO.
6. Strategia SEO pozostaje `one-page PL/EN`; nie tworzymy osobnych landing pages miast ani bloga.
7. W tej turze roadmapa zaklada aktualizacje planu prac, a nie zmiany w kodzie strony.
