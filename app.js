    // ==========================================================================
    // Bootstrap and shared DOM references
    // ==========================================================================
    // Global bootstrap for the one-page landing:
    // - caches shared DOM references,
    // - owns language + analytics utilities,
    // - initializes each major section in isolation.
    document.getElementById("year").textContent = new Date().getFullYear();

    const header = document.querySelector(".header");
    const brand = document.querySelector(".brand");
    const navLogoSlot = document.querySelector(".nav-logo-slot");
    const mobileMenuButton = document.querySelector(".mobile-menu");
    const mobileNav = document.getElementById("mobile-nav");
    const heroSection = document.querySelector(".hero");
    const contactBot = document.querySelector("[data-contact-bot]");
    const contactBotToggle = contactBot?.querySelector(".contact-bot-toggle");
    const languageToggles = Array.from(document.querySelectorAll(".lang-pill"));
    let dockRecalcTimers = [];
    let lastHeaderScrollY = window.scrollY || 0;
    let currentLang = (() => {
      const saved = localStorage.getItem("pv_lang");
      if (saved === "pl" || saved === "en") return saved;
      return "pl";
    })();

    // ==========================================================================
    // Runtime i18n dictionaries
    // ==========================================================================
    // Runtime translation strings used mostly by JS-rendered UI states.
    const I18N_TEXT = {
      pl: {
        metaTitle: "Pan Viking | Dostawa posiłków do biur",
        metaDescription: "Pan Viking dowozi gotowe posiłki do biur i firm. Regularne dostawy, test day, szerokie menu i prosty start bez umowy.",
        ogLocale: "pl_PL",
        dateLocale: "pl-PL",
        langLabel: "PL",
        langAria: "Przełącz język strony",
        langSwitchTo: "Przełącz na język angielski",
        coverageCountLabel: "miast",
        menuFilterAll: "Wszystko",
        menuDetailsLink: "Szczegóły dania",
        menuDishFallbackName: "Pozycja menu",
        menuDishFallbackDescription: "Szczegóły dania w aktualnym menu tygodniowym.",
        menuDishFallbackAlt: "Danie Pan Viking",
        menuIngredientsOpen: "Pokaż skład",
        menuIngredientsClose: "Ukryj skład",
        menuIngredientsTitle: "Skład",
        menuIngredientsEmpty: "Skład w przygotowaniu",
        menuModalOpen: "Pokaż pełne szczegóły dania",
        menuModalClose: "Zamknij szczegóły dania",
        menuModalCardAria: "Otwórz szczegóły dania {name}",
        menuSyncLoading: "Aktualizacja: ładowanie...",
        menuSyncNoDate: "Aktualizacja: brak daty",
        menuSyncError: "Aktualizacja: błąd ładowania",
        menuEmptyLoading: "Ładujemy menu tygodnia...",
        menuEmptyNoData: "Brak pozycji w danych menu. Uzupełnij data/menu-week.json.",
        menuEmptyJsonError: "Nie można wczytać menu z lokalnego JSON. Sprawdź data/menu-week.json i uruchom stronę przez localhost.",
        leadSubmitBase: "Wyślij do handlowca",
        leadSubmitting: "Wysyłanie...",
        leadErrorRequired: "To pole jest wymagane.",
        leadErrorEmail: "Podaj poprawny adres e-mail.",
        leadErrorPhone: "Podaj poprawny numer telefonu.",
        leadErrorHeadcount: "Podaj pełną liczbę osób większą od zera.",
        leadErrorDate: "Wybierz dzisiejszą lub późniejszą datę.",
        leadStepInvalid: "Sprawdź pola oznaczone na czerwono.",
        leadWebhookMissing: "Brak adresu webhook. Ustaw data-lead-webhook-url w sekcji #kontakt lub tagu body.",
        leadWebhookUnavailable: "Formularz online nie jest jeszcze podłączony. Do czasu konfiguracji skorzystaj z telefonu lub e-maila pod formularzem.",
        leadSending: "Wysyłamy dane do handlowca...",
        leadSent: "Lead wysłany pomyślnie.",
        leadSendFailed: "Nie udało się wysłać formularza. Spróbuj ponownie albo zadzwoń.",
        botWebhookMissing: "Formularz online nie jest jeszcze podłączony. Twoje odpowiedzi są zapisane w tej rozmowie, a do czasu konfiguracji skorzystaj z telefonu lub e-maila w sekcji kontaktu.",
        botSendFailed: "Nie udało się wysłać zgłoszenia. Twoje odpowiedzi są zapisane. Spróbuj ponownie.",
        leadModalOpen: "Umów test day - otwórz formularz",
        leadModalClose: "Zamknij formularz test day",
        leadProgressStep: "Krok {step} z {total}",
        coverageLoading: "Ładujemy listę miast...",
        coverageDefault: "Kliknij województwo albo wpisz miasto. Pokażemy od razu właściwy region i kolejny krok.",
        coverageMatchExact: "Tak, dowozimy do miasta {city}.",
        coverageMatchMany: "Mamy {count} dopasowania dla frazy \"{query}\". Kliknij województwo albo wybierz miasto z listy regionu.",
        coverageRegionSelected: "{region}: pokazujemy wszystkie punkty w tym województwie.",
        coverageNoMatch: "Brak miasta \"{query}\" na liście. {note}",
        coverageEmpty: "Brak wyników dla podanej frazy.",
        coverageShowAll: "Pokaż wszystkie ({count})",
        coverageShowLess: "Pokaż mniej miast",
        coverageUpdatedPrefix: "Aktualizacja: ",
        coverageUpdatedMissing: "Aktualizacja: brak daty",
        coverageUpdatedError: "Aktualizacja: błąd ładowania",
        coverageExpansionNoteDefault: "Nie widzisz swojego miasta? Dodaj firmę do listy ekspansji przez formularz.",
        coverageResponseSlaDefault: "Kontakt zwrotny do 24h",
        coverageJsonError: "Nie można wczytać listy miast. Uruchom stronę przez localhost i sprawdź data/cities-coverage.json.",
        coverageMapNoPoint: "{city} jest w zasięgu. Pokazujemy województwo i listę miast w regionie.",
        coverageMapRegionHover: "Kliknij, aby wejść do województwa {region}.",
        coverageMapFocusHint: "Tryb regionu: {region}. Naciśnij Esc, aby wrócić do mapy Polski.",
      },
      en: {
        metaTitle: "Pan Viking | Office Meal Delivery",
        metaDescription: "Pan Viking delivers ready meals to offices. Tasty, reliable and easy to run.",
        ogLocale: "en_US",
        dateLocale: "en-US",
        langLabel: "EN",
        langAria: "Switch page language",
        langSwitchTo: "Switch to Polish",
        coverageCountLabel: "cities",
        menuFilterAll: "All",
        menuDetailsLink: "Meal details",
        menuDishFallbackName: "Menu item",
        menuDishFallbackDescription: "Meal details from the current weekly menu.",
        menuDishFallbackAlt: "Pan Viking meal",
        menuIngredientsOpen: "Show ingredients",
        menuIngredientsClose: "Hide ingredients",
        menuIngredientsTitle: "Ingredients",
        menuIngredientsEmpty: "Ingredients coming soon",
        menuModalOpen: "Show full meal details",
        menuModalClose: "Close meal details",
        menuModalCardAria: "Open meal details for {name}",
        menuSyncLoading: "Update: loading...",
        menuSyncNoDate: "Update: no date",
        menuSyncError: "Update: loading error",
        menuEmptyLoading: "Loading weekly menu...",
        menuEmptyNoData: "No menu items in data. Complete data/menu-week.json.",
        menuEmptyJsonError: "Cannot load menu from local JSON. Check data/menu-week.json and run the page via localhost.",
        leadSubmitBase: "Send to sales",
        leadSubmitting: "Sending...",
        leadErrorRequired: "This field is required.",
        leadErrorEmail: "Enter a valid email address.",
        leadErrorPhone: "Enter a valid phone number.",
        leadErrorHeadcount: "Enter a whole team size greater than zero.",
        leadErrorDate: "Choose today or a later date.",
        leadStepInvalid: "Please check fields marked in red.",
        leadWebhookMissing: "Webhook URL is missing. Set data-lead-webhook-url on #kontakt or body.",
        leadWebhookUnavailable: "The online form is not connected yet. Until it is configured, use the phone number or email below the form.",
        leadSending: "Sending data to sales...",
        leadSent: "Lead sent successfully.",
        leadSendFailed: "Could not send the form. Try again or call us.",
        botWebhookMissing: "The online form is not connected yet. Your answers are saved in this conversation; until it is configured, use the phone number or email in the contact section.",
        botSendFailed: "The request could not be sent. Your answers are saved. Please try again.",
        leadModalOpen: "Book test day - open the form",
        leadModalClose: "Close the test day form",
        leadProgressStep: "Step {step} of {total}",
        coverageLoading: "Loading city list...",
        coverageDefault: "Click a region or type a city. We will show the right area and the next step immediately.",
        coverageMatchExact: "Yes, we deliver to {city}.",
        coverageMatchMany: "We found {count} matches for \"{query}\". Click the voivodeship or choose a city from the region list.",
        coverageRegionSelected: "{region}: showing every point we serve in this voivodeship.",
        coverageNoMatch: "City \"{query}\" is not listed yet. {note}",
        coverageEmpty: "No matches for your phrase.",
        coverageShowAll: "Show all ({count})",
        coverageShowLess: "Show fewer cities",
        coverageUpdatedPrefix: "Updated: ",
        coverageUpdatedMissing: "Updated: no date",
        coverageUpdatedError: "Updated: loading error",
        coverageExpansionNoteDefault: "Your city is missing? Add your company to the expansion list via the form.",
        coverageResponseSlaDefault: "Response within 24h",
        coverageJsonError: "Cannot load city coverage list. Run via localhost and check data/cities-coverage.json.",
        coverageMapNoPoint: "{city} is covered. We show the region and the full city list in that area.",
        coverageMapRegionHover: "Click to zoom into {region}.",
        coverageMapFocusHint: "Region mode: {region}. Press Esc to go back to the map of Poland.",
      },
    };

    // Static copy injected into the existing HTML when the language changes.
    const I18N_STATIC = {
      pl: {
        documentTitle: "Pan Viking | Dostawa posiłków do biur",
        skipLink: "Przejdź do treści",
        desktopNav: ["Gdzie dowozimy", "Jak zamówić", "Menu", "FAQ"],
        mobileNav: ["Gdzie dowozimy", "Jak zamówić", "Menu", "FAQ"],
        navCta: "Umów test day",
        mobileMenuButton: "Menu",
        navPanelAria: "Panel nawigacyjny",
        desktopNavAria: "Nawigacja główna",
        navLogoSlotAria: "Wróć na górę strony",
        mobileNavAria: "Nawigacja mobilna",
        heroKickers: ["Dostawy B2B do firm", "Stały rytm dostaw", "Menu, które pracuje w biurze"],
        heroTitles: [
          "PAN VIKING <strong>WJEŻDŻA</strong> DO TWOJEGO BIURA",
          "DOSTAWA, KTÓREJ <strong>NIE PILNUJESZ</strong>",
          "CODZIENNIE INNY <strong>POWER LUNCH</strong>",
        ],
        heroCopy: [
          "Test day bez umowy, regularne dostawy i jeden kontakt po stronie handlowca. Sprawdzasz zasięg, umawiasz próbny dzień i dopiero potem decydujesz o stałej współpracy.",
          "Ustalamy godziny, punkt odbioru i sposób kontaktu. Potem dowozimy regularnie, bez dodatkowej opłaty za dostawę i bez codziennego pilnowania tematu.",
          "Klasyczne obiady, lżejsze opcje, vege i keto w jednym procesie dostaw. Zespół wybiera wygodnie, a administracja nie musi organizować lunchu od zera.",
        ],
        heroActionPrimary: ["Umów test day", "Umów test day", "Umów test day"],
        heroActionSecondary: ["Sprawdź zasięg", "Zobacz proces", "Zobacz start"],
        heroTrustAria: "Najważniejsze warunki współpracy",
        heroTrust: ["Bez umowy na start", "Dostawa bez opłat", "HACCP i chłodnia", "Kontakt do 24h"],
        heroStats: [
          "Dostawy przez cały tydzień",
          "miast z obsługą",
          "szybka reakcja zespołu",
          "ciąg chłodniczy i bezpieczeństwo",
          "dostawa bez dodatkowych opłat",
          "opiekun dla całej firmy",
          "zakres cen dań",
          "zróżnicowane opcje",
          "sprawdzacie jakość przed decyzją",
        ],
        officeStoryTitle: "Pan Viking to pyszne jedzenie do Twojego biura",
        officeStoryBody: "Codziennie dostarczamy świeże, gotowe posiłki prosto do Twojego miejsca pracy - biura, magazynu lub dowolnej lokalizacji. Handlowiec przyjeżdża o umówionej godzinie z szerokim wyborem dań dla całego zespołu - bez umowy i z darmową dostawą.",
        heroDotsAria: "Nawigacja slajdów",
        heroDotLabels: ["Slajd 1", "Slajd 2", "Slajd 3"],
        heroPrevAria: "Poprzedni slajd",
        heroNextAria: "Następny slajd",
        whyChip: "Dlaczego Pan Viking",
        whyTitle: "Dlaczego my? Tu rządzą zasady Vikinga",
        whyLead: "Nie obiecujemy wszystkiego. Dowozimy to, co realnie liczy się w firmie: powtarzalna jakość, przewidywalny rytm i konkretne jedzenie, które zespół chce zamawiać codziennie.",
        whyCards: [
          {
            tag: "Powered by Kuchnia Vikinga",
            title: "Moc produkcji",
            summary: "Posiłki powstają na zapleczu zespołu, który codziennie przygotowuje setki tysięcy gotowych dań.",
            detail: "Nasze posiłki tworzymy w oparciu o doświadczenie i zaplecze Kuchni Vikinga - największego producenta świeżych dań gotowych w kraju. Dzięki temu mamy pewność jakości, smaku i różnorodności, której trudno szukać gdzie indziej.",
          },
          {
            tag: "Dostawy 7 dni w tygodniu",
            title: "Rytm dostaw",
            summary: "Ustalamy godziny i trzymamy tempo. Twoje biuro działa stabilnie, bez codziennego pilnowania tematu.",
            detail: "Dostarczamy posiłki do firm 7 dni w tygodniu. Handlowiec przyjeżdża o umówionej godzinie i do ustalonego miejsca, a w razie zmian pozostaje w stałym kontakcie z klientami. Godziny dostaw ustalamy indywidualnie.",
          },
          {
            tag: "Klasyczne, vege i keto",
            title: "Różnorodność smaku",
            summary: "Menu jest szerokie i praktyczne. Każdy w zespole znajdzie swój wariant bez kompromisu na jakości.",
            detail: "W menu są pełnowartościowe obiady, lekkie sałatki i kanapki, a także sushi, szejki i świeżo wyciskane soki. Dostępne są też opcje vege, vegan i keto oznaczone ikonami, dzięki czemu zespół szybciej znajduje swój wariant.",
          },
          {
            tag: "HACCP i chłodnia",
            title: "Bezpieczna dostawa",
            summary: "Dbamy o ciąg chłodniczy od kuchni po biuro. Jedzenie jedzie w warunkach, które utrzymują świeżość.",
            detail: "Pan Viking dba o ciąg chłodniczy zgodny z wymogami HACCP. Posiłki jadą w termoboksach, a handlowcy przemieszczają się autami z chłodnią, co pomaga utrzymać świeżość i powtarzalny standard dostawy.",
          },
        ],
        whyActionLabel: "Zobacz szczegóły",
        whyActionCloseLabel: "Ukryj szczegóły",
        whyInsightKicker: "Aktywny filar",
        whyInsightPrimary: "Umów test dla firmy",
        whyInsightSecondary: "Jak działa współpraca",
        whyProgressPrefix: "Filar",
        proofChip: "Dowody zaufania",
        proofTitle: "Decyzja jest łatwiejsza, gdy zasady są konkretne",
        proofLead: "Zanim pokażemy podpisane referencje klientów, opieramy komunikację na faktach: zapleczu produkcyjnym, logistyce, warunkach startu i bezpieczeństwie dostaw.",
        proofKicker: "Oficjalne warunki + najczęstszy feedback po starcie",
        proofOverviewTitle: "Najpierw jasne zasady. Potem spokój, bo proces robi swoje.",
        proofOverviewCopy: "Na oficjalnej stronie powtarzają się te same przewagi: brak umowy na start, darmowa dostawa, stałe godziny i szeroki wybór dań. Karty niżej zbierają to, co firmy najczęściej doceniają po wdrożeniu.",
        proofPointsAria: "Najważniejsze warunki współpracy",
        proofPoints: [
          "Start bez umowy i bez dodatkowych kosztów dostawy.",
          "Dostawy 7 dni w tygodniu, w godzinach ustalanych indywidualnie z firmą.",
          "Szerokie menu z opcjami klasycznymi, vege, vegan i keto.",
        ],
        proofMetricLabels: ["Miast z aktywną obsługą", "Dostawy przez cały tydzień", "Dodatkowych kosztów dostawy"],
        proofVerifiedLabel: "Zweryfikowany fakt",
        proofVerifiedLabels: ["Zweryfikowany fakt", "Zweryfikowany fakt", "Warunek startu", "Bezpieczeństwo", "Aktywny zasięg", "Do podmiany po zgodzie"],
        proofModalOpen: "Otwórz pełny dowód zaufania",
        proofModalClose: "Zamknij pełny dowód zaufania",
        proofModalLabel: "Pełny dowód zaufania",
        proofSliderCaption: "Najczęstszy feedback po starcie",
        proofSliderHint: "Przesuń, kliknij kartę, kropkę albo użyj strzałek",
        proofSliderPrevAria: "Poprzednia opinia",
        proofSliderNextAria: "Następna opinia",
        proofSliderDotsAria: "Nawigacja opinii",
        proofSliderDotAria: "Opinia {index} z {total}",
        proofCardBadges: [
          ["produkcja", "Kuchnia Vikinga", "skala"],
          ["logistyka", "7 dni", "stały rytm"],
          ["test day", "bez umowy", "bez dostawy"],
          ["HACCP", "chłodnia", "termoboksy"],
          ["miasta", "mapa", "sprawdzenie"],
          ["logo klienta", "rola", "efekt"],
        ],
        proofQuotes: [
          "Posiłki powstają w oparciu o zaplecze Kuchni Vikinga, więc sprzedaż B2B nie zaczyna od obietnicy bez pokrycia, tylko od istniejącej produkcji i procesu.",
          "Dostawy można ustalać w stałych godzinach i punktach odbioru. To ważne dla administracji, HR i office managerów, którzy potrzebują przewidywalnego procesu.",
          "Firma może zacząć od dnia testowego, bez podpisywania długiej umowy na starcie. To obniża ryzyko decyzji i pozwala zebrać realny feedback zespołu.",
          "Komunikacja strony jasno pokazuje ciąg chłodniczy, termoboksy i standard HACCP. To konkret dla firm, które muszą myśleć o bezpieczeństwie żywności.",
          "Sekcja zasięgu pracuje jak narzędzie sprzedażowe: decydent wpisuje miasto, widzi region i od razu przechodzi do rozmowy o wdrożeniu.",
          "Miejsce na podpisaną referencję klienta: nazwa firmy, rola osoby, miasto lub typ lokalizacji, liczba pracowników i jeden konkretny efekt po test day.",
        ],
        proofAuthorRoles: [
          "Zaplecze produkcyjne",
          "Rytm dostaw",
          "Prosty start",
          "Standard dostawy",
          "Mapa dostaw",
          "Podpisana referencja",
        ],
        proofAuthorMeta: [
          "źródło: komunikacja marki Pan Viking",
          "dostawy przez cały tydzień",
          "test day jako pierwszy krok",
          "proces od kuchni do biura",
          "238 miast w lokalnych danych",
          "publikować dopiero po zgodzie klienta",
        ],
        coverageChip: "Gdzie dowozimy",
        coverageTitle: "Sprawdź, czy dowozimy do Twojego biura",
        coverageLead: "Mapa jest głównym panelem. Klikasz województwo, widzisz miasta w regionie i od razu przechodzisz do właściwego kroku.",
        coverageKicker: "Aktywny zasięg",
        coverageQuestion: "Wpisz miasto albo kliknij województwo",
        coveragePlaceholder: "np. Wrocław",
        coverageClearAria: "Wyczyść wyszukiwanie",
        coverageActionMissing: "Miasta nie ma? Dodaj firmę do ekspansji",
        coveragePrimaryCta: "Porozmawiaj o wdrożeniu",
        coveragePrimaryCtaMatched: "Umów test day w tym mieście",
        coverageExpansionCta: "Nie widzisz swojego miasta? Dodaj je",
        coverageStatusDefaultKicker: "Najpierw mapa",
        coverageStatusDefaultTitle: "Wejdź do województwa i zobacz wszystkie punkty",
        coverageStatusDefaultCopy: "Obsługujemy {count} miast. Kliknij region, żeby powiększyć mapę, sprawdzić miasta w województwie i przejść dalej bez zgadywania.",
        coverageStatusMatchKicker: "Dostawa aktywna",
        coverageStatusMatchTitle: "Tak, dowozimy do miasta {city}",
        coverageStatusMatchCopy: "{city} jest już w zasięgu w województwie {region}. Od razu przechodzisz do rozmowy o test day albo regularnych dostawach.",
        coverageStatusRegionKicker: "Aktywny region",
        coverageStatusRegionTitle: "{region}: wszystkie punkty w jednym widoku",
        coverageStatusRegionCopy: "W tym województwie obsługujemy {count} miast. Wybierz lokalizację z listy albo wpisz miasto, a od razu ustawisz kolejny krok.",
        coverageStatusMissingKicker: "Miasto poza aktualną siatką",
        coverageStatusMissingTitle: "Jeszcze nie dowozimy do miasta {city}",
        coverageStatusMissingCopy: "Zostaw firmę do ekspansji. Sprawdzimy potencjał wdrożenia i wrócimy z informacją o możliwym starcie.",
        coverageHighlightsAria: "Popularne miasta",
        coverageMapTitle: "Kliknij województwo i wejdź do środka",
        coverageMapHint: "Kliknij województwo, aby powiększyć region i zobaczyć wszystkie punkty dostaw.",
        coverageMapActiveLabel: "Aktywne miasto:",
        coverageMapActiveRegionLabel: "Województwo:",
        coverageMapActiveRegionDefault: "Polska",
        coverageMapActiveCityDefault: "Kliknij region",
        coverageMapViewRegionPoints: "Wszystkie punkty regionu",
        coverageMapBack: "Esc wraca do mapy Polski",
        coverageMapOrigin: "Białystok: stąd wystartował Pan Viking",
        coverageMapAria: "Mapa Polski z województwami i miastami dostaw Pan Viking",
        coverageRegionKicker: "Aktywny region",
        coverageRegionTitleDefault: "Wybierz województwo na mapie",
        coverageRegionCountLabel: "miast w zasięgu",
        processTitle: "Jak zamówić Pana Vikinga do swojej pracy?",
        processLead: "Z nami wszystko jest proste. Bez umów, bez zobowiązań, bez dodatkowych kosztów - wystarczy jeden dzień, aby przekonać się, że z Panem Vikingiem codzienność w pracy staje się smaczniejsza.",
        processBadges: ["Bez umów na start", "Bez zobowiązań", "Bez dodatkowych kosztów dostawy"],
        processBadgesAria: "Najważniejsze zasady współpracy",
        processSliderAria: "Pozioma ścieżka kroków zamówienia",
        processDragHint: "Przeciągnij trasę lub kliknij strzałki",
        processPrevAria: "Poprzedni krok",
        processNextAria: "Następny krok",
        processStepTitles: ["Formularz", "Ekspert", "Test day", "Dostawy"],
        processStepsData: [
          {
            kicker: "Krok 1",
            title: "Rozpocznij od wypełnienia krótkiego formularza",
            copy: "Zacznij od wypełnienia formularza na dole strony. To kilka prostych pytań, które pomogą nam dopasować usługę do Twojego miejsca pracy.",
            pill: "Start w 2 minuty",
            action: "Formularz kontaktowy",
          },
          {
            kicker: "Krok 2",
            title: "Skontaktuje się z Tobą nasz ekspert",
            copy: "Wkrótce skontaktuje się z Tobą nasz handlowiec, aby porozmawiać o potrzebach Twojego zespołu i doprecyzować szczegóły zamówienia.",
            pill: "Kontakt do 24h",
            action: "Porozmawiajmy",
          },
          {
            kicker: "Krok 3",
            title: "Sprawdźcie jakość w praktyce",
            copy: "Wybierzcie dzień testowy, w trakcie którego Wasz zespół spróbuje naszych posiłków i sprawdzi, czy współpraca spełnia Wasze oczekiwania.",
            pill: "Dzień próbny",
            action: "Umów test day",
          },
          {
            kicker: "Krok 4",
            title: "Przygotujcie się na regularne dostawy",
            copy: "Ustal dogodne terminy i lokalizacje dostaw, a my dopilnujemy reszty. Od tego momentu możecie oczekiwać Pana Vikinga dokładnie tam, gdzie go potrzebujecie - bez dodatkowych kosztów.",
            pill: "Bez kosztu dostawy",
            action: "Przejdź do formularza B2B",
          },
        ],
        menuChip: "Menu tygodnia",
        menuTitle: "Zobacz dania, które zespół realnie chce zamawiać",
        menuLead: "Sprawdź menu na konkretny dzień tygodnia. Podział na grupy, szybki podgląd dań i pełne szczegóły po kliknięciu.",
        menuToolbarTitle: "Sprawdź menu na wybrany dzień",
        menuToolbarSub: "Wybierz dzień tygodnia i grupę dań. Kliknij kartę albo ikonę +, aby otworzyć pełny opis, makro i skład.",
        menuCounters: ["Pozycji"],
        menuDaysAria: "Wybierz dzień tygodnia",
        menuFiltersAria: "Filtry menu",
        faqChip: "FAQ i decyzja",
        faqTitle: "Najczęstsze pytania przed startem",
        faqLead: "Pełne odpowiedzi na najczęstsze obiekcje managerów biura, HR i administracji.",
        faqToggleShow: "Pokaż",
        faqToggleHide: "Ukryj",
        faqItems: [
          {
            q: "Czy potrzebna jest umowa, aby zacząć?",
            a: "Nie. Możemy zacząć od test day i dopiero po jego ocenie ustalić stały model współpracy.",
          },
          {
            q: "Czy dostawa jest dodatkowo płatna?",
            a: "W standardowym modelu B2B dostawa jest bez dodatkowej opłaty. Finalnie potwierdzamy to przy ustalaniu punktu dostaw.",
          },
          {
            q: "Jak szybko można uruchomić test day?",
            a: "Najczęściej nawet w 72h od zebrania danych organizacyjnych: liczby osób, miasta i preferowanego okna dostawy.",
          },
          {
            q: "Jak wygląda rozliczenie i fakturowanie?",
            a: "Obsługujemy standardowe fakturowanie dla firm. Szczegóły (cykl i dane) ustalamy przy wdrożeniu.",
          },
          {
            q: "Czy można uwzględnić diety i preferencje zespołu?",
            a: "Tak. W menu są opcje klasyczne, fit, keto i vege. Dodatkowo w formularzu możesz od razu zaznaczyć preferencje zespołu.",
          },
          {
            q: "Co jeśli liczba zamówień zmienia się z dnia na dzień?",
            a: "Ustalamy prosty proces korekt. Zmiany liczby porcji i godzin zgłaszasz do opiekuna w uzgodnionym oknie czasowym.",
          },
          {
            q: "Czy dostaniemy oznaczenia makro i informacje o daniach?",
            a: "Tak. Menu pokazuje dania na wybrany dzień, a po kliknięciu karty lub ikony + otworzysz pełny opis, makro i skład.",
          },
          {
            q: "Co jeśli naszego miasta nie ma jeszcze w zasięgu?",
            a: "Nadal warto zostawić zgłoszenie. Dodamy firmę do listy ekspansji i wracamy z informacją, gdy uruchomimy obsługę lokalizacji.",
          },
          {
            q: "Jak wygląda kontakt po starcie współpracy?",
            a: "Masz jednego opiekuna i szybki kanał kontaktu do korekt, pytań i bieżącego dopasowania modelu dostaw.",
          },
        ],
        contactKicker: "Test day dla firm",
        contactTitle: "Najpierw sprawdzacie. Potem decydujecie.",
        contactIntro: "Zamiast wrzucać od razu pełny onboarding, dajemy Ci prostszy krok: umawiasz test day, zbierasz feedback zespołu i dopiero wtedy ustalamy stały model dostaw.",
        contactPoints: ["Bez umowy na start", "Kontakt handlowca do 24h", "Krótki brief zamiast długiego wdrożenia"],
        contactPointsAria: "Najważniejsze korzyści",
        contactCardKicker: "Następny krok",
        contactCardTitle: "Otwórz formularz i zaproponuj termin test day",
        contactCardCopy: "Formularz zbiera tylko dane potrzebne do kontaktu, logistyki i przygotowania pierwszego testu dla zespołu.",
        contactPrimaryCta: "Umów test day",
        contactSecondaryCta: "Zadzwoń teraz",
        leadModalKicker: "Formularz B2B",
        leadModalTitle: "Umów test day dla zespołu",
        leadModalIntro: "Dwa kroki i gotowe. Podaj dane firmy oraz preferencje dostawy. Handlowiec szybciej wraca z konkretnym terminem i modelem współpracy.",
        leadModalPoints: ["Bez umowy na start", "Dostawy 7 dni w tygodniu", "Szybki kontakt do 24h"],
        leadModalPointsAria: "Najważniejsze korzyści",
        leadStepChips: ["1. Dane firmy", "2. Dostawa i finał"],
        leadStepChipsAria: "Etapy formularza",
        leadFieldLabels: {
          companyName: "Nazwa firmy *",
          contactPerson: "Osoba kontaktowa *",
          email: "E-mail *",
          phone: "Telefon",
          city: "Miasto *",
          headcount: "Liczba osób w zespole *",
          deliveryAddress: "Adres dostawy, piętro",
          preferredHours: "Preferowane godziny",
          testDayDate: "Preferowana data test day",
          notes: "Uwagi dla handlowca",
        },
        leadPlaceholders: {
          phone: "+48 500 000 000",
          headcount: "np. 25",
          deliveryAddress: "Opcjonalnie, jeśli znasz już lokalizację",
          preferredHours: "np. 11:00-13:00",
          notes: "Np. dni testowe, lokalizacja odbioru, priorytety zespołu",
        },
        leadStepHint: "W kolejnym kroku dopniesz preferencje dostawy i wyślesz lead do handlowca.",
        leadNextButton: "Przejdź do dostawy",
        leadPreferencesLegend: "Preferencje zespołu (opcjonalnie)",
        leadPreferencesOptions: ["Klasyki", "Fit", "Vege", "Keto", "Bez wieprzowiny"],
        leadConsentPrefix: "Akceptuję",
        leadConsentConnector: "i",
        leadConsentTerms: "regulamin",
        leadConsentPrivacy: "politykę prywatności",
        leadPrevButton: "Wróć do danych firmy",
        leadSuccessKicker: "Lead wysłany",
        leadSuccessTitle: "Dzięki, zgłoszenie jest już u handlowca",
        leadSuccessCopy: "Sprawdzimy Twoje dane. Standardowo wracamy z kontaktem maksymalnie w ciągu 24h.",
        leadSuccessReset: "Wyślij kolejne zgłoszenie",
        leadSuccessCall: "Zadzwoń teraz",
        footerLinks: ["Oferta", "Gdzie dowozimy", "Jak zamówić", "Menu", "Kontakt", "Kariera", "Instagram"],
        footerCopyright: "Pan Viking. Wszelkie prawa zastrzeżone.",
        footerDesignerCredit: "Zaprojektował www.dajerdesign.pl",
        footerLegalPrivacy: "Polityka prywatności",
        footerLegalTerms: "Regulamin serwisu",
        botTitle: "Viking Bot",
        botCopy: "Masz pytania o dostawę, test day lub menu? Kliknij i porozmawiaj z nami.",
        botToggleAria: "Porozmawiaj z Vikingiem",
        botCallLabel: "Zadzwoń",
        botWriteLabel: "Napisz",
        botLauncherLabel: "Test day",
        botTeaserCopy: "Chcesz zorganizować dzień testowy w swojej firmie? Odpowiedz na kilka krótkich pytań.",
        botTeaserAction: "Umów test day",
        botTeaserDismissAria: "Zamknij dymek CTA",
        botPanelStatus: "Krótki brief test day",
        botSendingStatus: "Wysyłam zgłoszenie",
        botDoneStatus: "Zgłoszenie wysłane",
        botCloseAria: "Zamknij okno rozmowy",
        botStartMessage: "Cześć! Pomogę Ci umówić test day. Odpowiedz na kilka krótkich pytań.",
        botIntroLabel: "Start rozmowy",
        botConsentLabel: "Zgoda",
        botNext: "Wyślij",
        botSkip: "Pomiń",
        botSubmit: "Akceptuję i wysyłam",
        botRetry: "Spróbuj ponownie",
        botSendingMessage: "Dziękuję. Zapisałem odpowiedzi i wysyłam zgłoszenie do handlowca...",
        botSuccessMessage: "Gotowe! Zgłoszenie zostało wysłane. Handlowiec odezwie się w ciągu 24 godzin.",
        botConsentAccepted: "Akceptuję",
        botSkippedAnswer: "Pominięto",
        botFieldPlaceholders: {
          companyName: "np. Pan Viking Sp. z o.o.",
          contactPerson: "np. Anna Kowalska",
          email: "np. anna@firma.pl",
          city: "np. Wrocław",
          deliveryAddress: "np. ul. Legnicka 48, 5 piętro",
        },
        botQuestions: {
          companyName: "Jak nazywa się firma?",
          contactPerson: "Kto będzie osobą kontaktową po Waszej stronie?",
          email: "Na jaki e-mail mamy wrócić z terminem test day?",
          phone: "Jeśli chcesz, podaj też numer telefonu.",
          city: "W jakim mieście działa biuro lub punkt dostawy?",
          headcount: "Ile osób liczy zespół, dla którego planujecie test day?",
          deliveryAddress: "Jeśli znasz dokładny adres lub piętro, podaj je opcjonalnie.",
          preferredHours: "Jakie godziny dostawy są dla Was najwygodniejsze?",
          testDayDate: "Jeśli masz preferencje, podaj datę test day.",
          notes: "Czy są jeszcze uwagi dla handlowca?",
          consent: "Na koniec potrzebuję zgody na kontakt i przetwarzanie danych.",
        },
      },
      en: {
        documentTitle: "Pan Viking | Office Meal Delivery",
        skipLink: "Skip to content",
        desktopNav: ["Delivery area", "How to order", "Menu", "FAQ"],
        mobileNav: ["Delivery area", "How to order", "Menu", "FAQ"],
        navCta: "Book test day",
        mobileMenuButton: "Menu",
        navPanelAria: "Navigation panel",
        desktopNavAria: "Main navigation",
        navLogoSlotAria: "Back to top of page",
        mobileNavAria: "Mobile navigation",
        heroKickers: ["B2B office delivery", "Steady delivery rhythm", "A menu built for offices"],
        heroTitles: [
          "PAN VIKING <strong>ARRIVES</strong> AT YOUR OFFICE",
          "DELIVERY YOU <strong>DON'T HAVE TO CHASE</strong>",
          "A DIFFERENT <strong>POWER LUNCH</strong> EVERY DAY",
        ],
        heroCopy: [
          "A no-contract test day, regular deliveries and one sales contact. Check coverage, book a trial day and decide on regular cooperation only after the team tries it.",
          "We agree on delivery windows, drop-off point and contact flow. Then we deliver regularly, with no extra delivery fee and no daily chasing.",
          "Classic lunches, lighter meals, vege and keto options in one delivery process. The team chooses easily, while admin avoids organizing lunch from scratch.",
        ],
        heroActionPrimary: ["Book test day", "Book test day", "Book test day"],
        heroActionSecondary: ["Check coverage", "See process", "See the start"],
        heroTrustAria: "Key cooperation terms",
        heroTrust: ["No contract to start", "No delivery fee", "HACCP and cold chain", "Response within 24h"],
        heroStats: [
          "Deliveries all week",
          "served cities",
          "fast team response",
          "cold-chain safety",
          "no extra delivery fee",
          "one account manager",
          "meal price range",
          "diverse options",
          "quality check before rollout",
        ],
        officeStoryTitle: "Pan Viking brings delicious meals to your office",
        officeStoryBody: "Every day we deliver fresh, ready-to-eat meals straight to your workplace - office, warehouse or any other location. Our representative arrives at an agreed time with a wide selection of dishes for the whole team, no contract required and delivery always free.",
        heroDotsAria: "Slide navigation",
        heroDotLabels: ["Slide 1", "Slide 2", "Slide 3"],
        heroPrevAria: "Previous slide",
        heroNextAria: "Next slide",
        whyChip: "Why Pan Viking",
        whyTitle: "Why us? Viking rules run this process",
        whyLead: "We do not promise everything. We deliver what really matters for companies: consistent quality, predictable rhythm and meals teams actually want every day.",
        whyCards: [
          {
            tag: "Powered by Kuchnia Vikinga",
            title: "Production scale",
            summary: "Meals are prepared by a team that produces hundreds of thousands of ready meals every day.",
            detail: "We craft our meals using the know-how and facilities of Kuchnia Vikinga - Poland's leader in ready meals. That gives your company stronger confidence in quality, taste and variety from day one.",
          },
          {
            tag: "Deliveries 7 days a week",
            title: "Delivery rhythm",
            summary: "We set time windows and keep the pace. Your office stays stable without daily follow-up.",
            detail: "We deliver to offices 7 days a week. Our representative arrives at the agreed time and place, stays in touch when anything changes and adapts delivery hours individually to the company.",
          },
          {
            tag: "Classic, vege and keto",
            title: "Menu variety",
            summary: "The menu is wide and practical. Everyone in the team can find their option without quality compromises.",
            detail: "The menu includes hearty mains, light salads and sandwiches, plus sushi, shakes and fresh-pressed juices. Vege, vegan and keto options are clearly marked, so teams can choose faster.",
          },
          {
            tag: "HACCP and cold chain",
            title: "Safe delivery",
            summary: "We protect the cold chain from kitchen to office, keeping freshness intact.",
            detail: "Pan Viking protects the cold chain in line with HACCP standards. Meals travel in thermal boxes and refrigerated cars, helping preserve freshness and repeatable delivery quality.",
          },
        ],
        whyActionLabel: "See details",
        whyActionCloseLabel: "Hide details",
        whyInsightKicker: "Active pillar",
        whyInsightPrimary: "Book a test for your company",
        whyInsightSecondary: "How cooperation works",
        whyProgressPrefix: "Pillar",
        proofChip: "Client reviews",
        proofTitle: "The decision is easier when the rules are concrete",
        proofLead: "Until signed client references are available, the page builds trust on verified facts: production backing, logistics, start conditions and delivery safety.",
        proofKicker: "Official terms + recurring post-launch feedback",
        proofOverviewTitle: "Clear rules first. Then less friction because the process runs on its own.",
        proofOverviewCopy: "The official site keeps repeating the same advantages: no contract to start, free delivery, agreed delivery windows and broad menu choice. The cards below group the themes teams value most after launch.",
        proofPointsAria: "Key cooperation terms",
        proofPoints: [
          "Start with no contract and no extra delivery fees.",
          "Deliveries 7 days a week, with time windows agreed individually.",
          "Broad menu choice including classic, veggie, vegan and keto options.",
        ],
        proofMetricLabels: ["Cities with active coverage", "Deliveries all week", "Extra delivery fees"],
        proofVerifiedLabel: "Verified fact",
        proofVerifiedLabels: ["Verified fact", "Verified fact", "Start condition", "Safety", "Active coverage", "Replace after approval"],
        proofModalOpen: "Open full trust proof",
        proofModalClose: "Close full trust proof",
        proofModalLabel: "Full trust proof",
        proofSliderCaption: "Most common feedback after launch",
        proofSliderHint: "Swipe, click a card, tap a dot or use arrow keys",
        proofSliderPrevAria: "Previous review",
        proofSliderNextAria: "Next review",
        proofSliderDotsAria: "Reviews navigation",
        proofSliderDotAria: "Review {index} of {total}",
        proofCardBadges: [
          ["production", "Kuchnia Vikinga", "scale"],
          ["logistics", "7 days", "steady rhythm"],
          ["test day", "no contract", "no delivery fee"],
          ["HACCP", "cold chain", "thermoboxes"],
          ["cities", "map", "check"],
          ["client logo", "role", "effect"],
        ],
        proofQuotes: [
          "Meals are backed by Kuchnia Vikinga's existing production base, so the B2B offer starts from a real process rather than an unsupported promise.",
          "Delivery windows and drop-off points can be agreed up front. That matters for admin, HR and office managers who need predictable operations.",
          "A company can begin with a test day, without a long contract at the start. That lowers decision risk and creates room for real team feedback.",
          "The page clearly communicates cold chain, thermoboxes and HACCP standards. This gives companies a concrete answer on food safety.",
          "The coverage section works like a sales tool: the decision-maker types a city, sees the region and moves straight into a rollout conversation.",
          "Slot for a signed client reference: company name, person role, city or location type, team size and one concrete result after the test day.",
        ],
        proofAuthorRoles: [
          "Production backing",
          "Delivery rhythm",
          "Easy start",
          "Delivery standard",
          "Coverage map",
          "Signed reference",
        ],
        proofAuthorMeta: [
          "source: Pan Viking brand communication",
          "deliveries all week",
          "test day as the first step",
          "process from kitchen to office",
          "238 cities in local data",
          "publish only after client approval",
        ],
        coverageChip: "Delivery area",
        coverageTitle: "Check whether we deliver to your office",
        coverageLead: "The map is the main panel. Click a voivodeship, see the cities in that area and move straight into the right next step.",
        coverageKicker: "Active coverage",
        coverageQuestion: "Type a city or click a voivodeship",
        coveragePlaceholder: "e.g. Wroclaw",
        coverageClearAria: "Clear search",
        coverageActionMissing: "City missing? Add your company to expansion list",
        coveragePrimaryCta: "Talk about rollout",
        coveragePrimaryCtaMatched: "Book a test day in this city",
        coverageExpansionCta: "Cannot see your city? Add it",
        coverageStatusDefaultKicker: "Map first",
        coverageStatusDefaultTitle: "Zoom into a voivodeship and inspect every point",
        coverageStatusDefaultCopy: "We already serve {count} cities. Click a region to zoom in, inspect the served cities there and move ahead without guesswork.",
        coverageStatusMatchKicker: "Delivery active",
        coverageStatusMatchTitle: "Yes, we deliver to {city}",
        coverageStatusMatchCopy: "{city} is already covered in {region}. You can move straight into a test day or regular rollout conversation.",
        coverageStatusRegionKicker: "Active region",
        coverageStatusRegionTitle: "{region}: every point in one view",
        coverageStatusRegionCopy: "We currently serve {count} cities in this voivodeship. Pick one from the list or type a city and move straight into the next step.",
        coverageStatusMissingKicker: "City outside the current grid",
        coverageStatusMissingTitle: "We do not deliver to {city} yet",
        coverageStatusMissingCopy: "Leave the company for expansion. We will review rollout potential and come back with an update.",
        coverageHighlightsAria: "Popular cities",
        coverageMapTitle: "Click a voivodeship and step inside",
        coverageMapHint: "Click a voivodeship to zoom in and see every delivery point in that area.",
        coverageMapActiveLabel: "Active city:",
        coverageMapActiveRegionLabel: "Voivodeship:",
        coverageMapActiveRegionDefault: "Poland",
        coverageMapActiveCityDefault: "Click a region",
        coverageMapViewRegionPoints: "All region points",
        coverageMapBack: "Esc goes back to Poland",
        coverageMapOrigin: "Bialystok: where Pan Viking started",
        coverageMapAria: "Map of Poland with voivodeships and Pan Viking delivery cities",
        coverageRegionKicker: "Active region",
        coverageRegionTitleDefault: "Select a voivodeship on the map",
        coverageRegionCountLabel: "cities in coverage",
        processTitle: "How to bring Pan Viking to your workplace?",
        processLead: "Everything stays simple with us. No contracts, no commitments and no extra delivery costs - one day is enough to see how Pan Viking can make the workday taste better.",
        processBadges: ["No contract to start", "No commitments", "No extra delivery fees"],
        processBadgesAria: "Key cooperation rules",
        processSliderAria: "Horizontal order steps track",
        processDragHint: "Drag the route or use the arrows",
        processPrevAria: "Previous step",
        processNextAria: "Next step",
        processStepTitles: ["Form", "Expert", "Test day", "Delivery"],
        processStepsData: [
          {
            kicker: "Step 1",
            title: "Start by filling out a short form",
            copy: "Begin with the form at the bottom of the page. It is just a few simple questions that help us tailor the service to your workplace.",
            pill: "2-minute start",
            action: "Contact form",
          },
          {
            kicker: "Step 2",
            title: "Our expert will get in touch with you",
            copy: "A member of our team will contact you shortly to talk through your team's needs and finalize the order details.",
            pill: "Reply within 24h",
            action: "Let's talk",
          },
          {
            kicker: "Step 3",
            title: "Check the quality in practice",
            copy: "Choose a test day when your team can try our meals and confirm that the cooperation works in real office conditions.",
            pill: "Trial day",
            action: "Book a test day",
          },
          {
            kicker: "Step 4",
            title: "Get ready for regular deliveries",
            copy: "Set convenient delivery times and locations, and we will handle the rest. From that point on you can expect Pan Viking exactly where you need it, without extra costs.",
            pill: "No delivery fee",
            action: "Go to B2B form",
          },
        ],
        menuChip: "Weekly menu",
        menuTitle: "See meals your team will actually order",
        menuLead: "Check the menu for a specific weekday. Filter by group, scan the meals quickly and open the full details on click.",
        menuToolbarTitle: "Check the menu for a chosen day",
        menuToolbarSub: "Choose a weekday and meal group. Click a card or the + icon to open the full description, macros and ingredients.",
        menuCounters: ["Items"],
        menuDaysAria: "Choose day of week",
        menuFiltersAria: "Menu filters",
        faqChip: "FAQ & decision",
        faqTitle: "Most common questions before kickoff",
        faqLead: "Clear answers to key objections from office managers, HR and operations.",
        faqToggleShow: "Show",
        faqToggleHide: "Hide",
        faqItems: [
          {
            q: "Do we need a contract to start?",
            a: "No. We can start with a test day and agree on a regular cooperation model after evaluation.",
          },
          {
            q: "Is delivery charged separately?",
            a: "In the standard B2B model, delivery is included. Final details are confirmed during delivery setup.",
          },
          {
            q: "How fast can we launch a test day?",
            a: "Usually even within 72h after collecting operational details: team size, city and preferred time window.",
          },
          {
            q: "How do billing and invoicing work?",
            a: "We support standard company invoicing. Billing cycle and data are finalized during onboarding.",
          },
          {
            q: "Can we include diets and team preferences?",
            a: "Yes. The menu includes classic, fit, keto and vege options. You can also mark preferences directly in the form.",
          },
          {
            q: "What if order volume changes day by day?",
            a: "We agree on a simple correction process. Portion and time changes are sent to your account manager in an agreed time window.",
          },
          {
            q: "Will we get macros and meal information?",
            a: "Yes. The menu shows meals for the selected weekday, and clicking a card or the + icon opens the full description, macros and ingredients.",
          },
          {
            q: "What if our city is not yet covered?",
            a: "It is still worth sending a request. We add your company to our expansion list and come back when coverage is launched.",
          },
          {
            q: "What does communication look like after launch?",
            a: "You get one account manager and a fast channel for adjustments, questions and ongoing optimization.",
          },
        ],
        contactKicker: "Test day for companies",
        contactTitle: "First you test it. Then you decide.",
        contactIntro: "Instead of pushing a full onboarding right away, we start with a simpler step: you book a test day, collect team feedback and only then decide on the regular delivery model.",
        contactPoints: ["No contract to start", "Sales reply within 24h", "Short brief instead of long onboarding"],
        contactPointsAria: "Top benefits",
        contactCardKicker: "Next step",
        contactCardTitle: "Open the form and suggest a test day slot",
        contactCardCopy: "The form only collects the details needed for contact, logistics and the first team tasting.",
        contactPrimaryCta: "Book a test day",
        contactSecondaryCta: "Call now",
        leadModalKicker: "B2B form",
        leadModalTitle: "Book a test day for your team",
        leadModalIntro: "Two steps and done. Share company details and delivery preferences. Sales comes back faster with a concrete slot and cooperation model.",
        leadModalPoints: ["No contract to start", "Deliveries 7 days a week", "Reply within 24h"],
        leadModalPointsAria: "Top benefits",
        leadStepChips: ["1. Company details", "2. Delivery and final setup"],
        leadStepChipsAria: "Form steps",
        leadFieldLabels: {
          companyName: "Company name *",
          contactPerson: "Contact person *",
          email: "Email *",
          phone: "Phone",
          city: "City *",
          headcount: "Team size *",
          deliveryAddress: "Delivery address, floor",
          preferredHours: "Preferred hours",
          testDayDate: "Preferred test day date",
          notes: "Notes for sales",
        },
        leadPlaceholders: {
          phone: "+48 500 000 000",
          headcount: "e.g. 25",
          deliveryAddress: "Optional, if you already know the location",
          preferredHours: "e.g. 11:00-13:00",
          notes: "e.g. test day options, drop-off location, team priorities",
        },
        leadStepHint: "In the next step you finalize delivery preferences and send the lead to sales.",
        leadNextButton: "Go to delivery details",
        leadPreferencesLegend: "Team preferences (optional)",
        leadPreferencesOptions: ["Classics", "Fit", "Vege", "Keto", "No pork"],
        leadConsentPrefix: "I accept the",
        leadConsentConnector: "and",
        leadConsentTerms: "terms",
        leadConsentPrivacy: "privacy policy",
        leadPrevButton: "Back to company details",
        leadSuccessKicker: "Lead sent",
        leadSuccessTitle: "Thanks, your request is already with sales",
        leadSuccessCopy: "We will verify your details. Standard response time is up to 24h.",
        leadSuccessReset: "Send another request",
        leadSuccessCall: "Call now",
        footerLinks: ["Offer", "Delivery area", "How to order", "Menu", "Contact", "Careers", "Instagram"],
        footerCopyright: "Pan Viking. All rights reserved.",
        footerDesignerCredit: "Designed by www.dajerdesign.pl",
        footerLegalPrivacy: "Privacy policy",
        footerLegalTerms: "Terms of service",
        botTitle: "Viking Bot",
        botCopy: "Questions about delivery, test day or menu? Click and talk to us.",
        botToggleAria: "Talk to Viking team",
        botCallLabel: "Call",
        botWriteLabel: "Write",
        botLauncherLabel: "Test day",
        botTeaserCopy: "Want to arrange a test day for your team? Answer a few short questions.",
        botTeaserAction: "Book test day",
        botTeaserDismissAria: "Close CTA bubble",
        botPanelStatus: "Short test day brief",
        botSendingStatus: "Sending request",
        botDoneStatus: "Request sent",
        botCloseAria: "Close chat window",
        botStartMessage: "Hi! I will help you arrange a test day. Answer a few short questions.",
        botIntroLabel: "Conversation start",
        botConsentLabel: "Consent",
        botNext: "Send",
        botSkip: "Skip",
        botSubmit: "Accept and send",
        botRetry: "Try again",
        botSendingMessage: "Thank you. I saved your answers and I am sending the request to sales...",
        botSuccessMessage: "Done! Your request has been sent. Sales will contact you within 24 hours.",
        botConsentAccepted: "I accept",
        botSkippedAnswer: "Skipped",
        botFieldPlaceholders: {
          companyName: "e.g. Pan Viking Ltd.",
          contactPerson: "e.g. Anna Kowalska",
          email: "e.g. anna@company.com",
          city: "e.g. Wroclaw",
          deliveryAddress: "e.g. 48 Legnicka St., 5th floor",
        },
        botQuestions: {
          companyName: "What is the company name?",
          contactPerson: "Who will be the contact person on your side?",
          email: "Which email should we use to come back with a test day slot?",
          phone: "If you want, add a phone number too.",
          city: "Which city is the office or delivery point in?",
          headcount: "How many people are in the team you want to plan the test day for?",
          deliveryAddress: "If you know the exact address or floor, add it optionally.",
          preferredHours: "What delivery hours work best for you?",
          testDayDate: "If you have a preference, share the test day date.",
          notes: "Any extra notes for sales?",
          consent: "Finally, I need your consent for contact and data processing.",
        },
      },
    };

    // ==========================================================================
    // Shared helpers: i18n, analytics and DOM text updates
    // ==========================================================================
    /**
     * Replaces `{token}` placeholders inside translation strings.
     * Keeps the helper tiny so all sections can share one interpolation format.
     */
    const formatText = (template, values = {}) =>
      template.replace(/\{(\w+)\}/g, (_, key) => (values[key] ?? `{${key}}`).toString());

    /**
     * Returns a runtime translation for the active language with Polish fallback.
     */
    const t = (key, values = {}) => {
      const langPack = I18N_TEXT[currentLang] || I18N_TEXT.pl;
      const fallbackPack = I18N_TEXT.pl;
      const template = langPack[key] || fallbackPack[key] || key;
      return formatText(template, values);
    };

    const getLocalDateInputValue = (date = new Date()) => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    };

    const getStaticCopy = () => I18N_STATIC[currentLang] || I18N_STATIC.pl;

    /**
     * Normalized analytics metadata appended to every tracked interaction.
     */
    const getTrackingContext = () => ({
      language: document.documentElement.lang || currentLang,
      path: window.location.pathname,
      page: window.location.href,
    });

    /**
     * Sends analytics payloads to both `dataLayer` and a local custom event bus.
     * The custom event keeps section logic decoupled from the analytics sink.
     */
    const trackEvent = (eventName, detail = {}) => {
      if (!eventName) return;
      const payload = {
        event: eventName,
        timestamp: new Date().toISOString(),
        ...getTrackingContext(),
        ...detail,
      };

      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push(payload);
      document.dispatchEvent(new CustomEvent("pv:track", { detail: payload }));
    };

    window.PAN_VIKING_TRACK_EVENT = trackEvent;

    /**
     * Rebuilds JSON-LD after language changes so metadata, FAQ schema and canonical
     * service labels stay aligned with what the user currently sees.
     */
    const updateStructuredData = () => {
      const schemaNode = document.getElementById("schema-jsonld");
      if (!schemaNode) return;

      const isEn = currentLang === "en";
      const pageUrl = isEn ? "https://panviking.pl/en" : "https://panviking.pl/";
      const pageName = isEn ? "Pan Viking | Office Meal Delivery" : "Pan Viking | Dostawa posiłków do biur";
      const pageLang = isEn ? "en-US" : "pl-PL";
      const serviceName = isEn ? "Office meal delivery for companies" : "Dostawa posiłków do biur";
      const serviceType = isEn ? "Catering and regular meal delivery for companies" : "Catering i regularne dostawy posiłków do firm";
      const staticCopy = I18N_STATIC[currentLang] || I18N_STATIC.pl;
      const faqItems = Array.isArray(staticCopy.faqItems) ? staticCopy.faqItems : [];
      const schema = {
        "@context": "https://schema.org",
        "@graph": [
          {
            "@type": "Organization",
            "@id": "https://panviking.pl/#organization",
            name: "Pan Viking",
            url: "https://panviking.pl/",
            logo: "https://panviking.pl/logo.svg",
            email: "kontakt@panviking.pl",
            telephone: "+48 509 587 103",
            sameAs: ["https://www.instagram.com/panviking_pl/"],
          },
          {
            "@type": "WebSite",
            "@id": "https://panviking.pl/#website",
            url: "https://panviking.pl/",
            name: "Pan Viking",
            inLanguage: ["pl-PL", "en-US"],
            publisher: {
              "@id": "https://panviking.pl/#organization",
            },
          },
          {
            "@type": "WebPage",
            "@id": `${pageUrl}#webpage`,
            url: pageUrl,
            name: pageName,
            inLanguage: pageLang,
            isPartOf: {
              "@id": "https://panviking.pl/#website",
            },
            mainEntity: faqItems.length ? { "@id": `${pageUrl}#faq` } : undefined,
          },
          {
            "@type": "Service",
            "@id": "https://panviking.pl/#service",
            name: serviceName,
            description: t("metaDescription"),
            inLanguage: pageLang,
            provider: {
              "@id": "https://panviking.pl/#organization",
            },
            areaServed: "Poland",
            serviceType,
            availableChannel: {
              "@type": "ServiceChannel",
              servicePhone: "+48 509 587 103",
              serviceUrl: pageUrl,
              availableLanguage: ["pl-PL", "en-US"],
            },
          },
          ...(faqItems.length ? [
            {
              "@type": "FAQPage",
              "@id": `${pageUrl}#faq`,
              url: `${pageUrl}#faq`,
              name: isEn ? "Pan Viking FAQ" : "FAQ Pan Viking",
              inLanguage: pageLang,
              mainEntity: faqItems.map((item) => ({
                "@type": "Question",
                name: item.q,
                acceptedAnswer: {
                  "@type": "Answer",
                  text: item.a,
                },
              })),
            },
          ] : []),
        ],
      };

      schemaNode.textContent = JSON.stringify(schema, (_key, value) => value === undefined ? undefined : value, 2);
    };

    const translateDayLabel = (label, dayId) => {
      if (currentLang !== "en") return label;
      const map = {
        pon: "Monday",
        wt: "Tuesday",
        sr: "Wednesday",
        czw: "Thursday",
        pt: "Friday",
      };
      return map[dayId] || label;
    };

    const setTextContent = (selector, value, scope = document) => {
      const node = scope.querySelector(selector);
      if (node) {
        node.textContent = value;
      }
    };

    const setHtmlContent = (selector, value, scope = document) => {
      const node = scope.querySelector(selector);
      if (node) {
        node.innerHTML = value;
      }
    };

    const setNodeListText = (selector, values, scope = document) => {
      const nodes = Array.from(scope.querySelectorAll(selector));
      nodes.forEach((node, index) => {
        if (values[index] !== undefined) {
          node.textContent = values[index];
        }
      });
    };

    /**
     * Pushes the active language into already rendered DOM nodes, meta tags and
     * section labels that are not rebuilt from JSON.
     */
    const applyStaticTranslations = () => {
      const copy = I18N_STATIC[currentLang] || I18N_STATIC.pl;
      const nextLang = currentLang === "pl" ? "en" : "pl";

      document.title = copy.documentTitle;
      document.documentElement.lang = currentLang;
      const metaDescription = document.getElementById("meta-description");
      const metaOgTitle = document.getElementById("meta-og-title");
      const metaOgDescription = document.getElementById("meta-og-description");
      const metaOgLocale = document.getElementById("meta-og-locale");
      const metaOgUrl = document.getElementById("meta-og-url");
      const metaTwitterTitle = document.getElementById("meta-twitter-title");
      const metaTwitterDescription = document.getElementById("meta-twitter-description");
      const canonicalLink = document.getElementById("canonical-link");
      const activeUrl = currentLang === "en" ? "https://panviking.pl/en" : "https://panviking.pl/";
      if (metaDescription) metaDescription.setAttribute("content", t("metaDescription"));
      if (metaOgTitle) metaOgTitle.setAttribute("content", t("metaTitle"));
      if (metaOgDescription) metaOgDescription.setAttribute("content", t("metaDescription"));
      if (metaOgLocale) metaOgLocale.setAttribute("content", t("ogLocale"));
      if (metaOgUrl) metaOgUrl.setAttribute("content", activeUrl);
      if (metaTwitterTitle) metaTwitterTitle.setAttribute("content", t("metaTitle"));
      if (metaTwitterDescription) metaTwitterDescription.setAttribute("content", t("metaDescription"));
      if (canonicalLink) canonicalLink.setAttribute("href", activeUrl);
      updateStructuredData();

      setTextContent(".skip-link", copy.skipLink);
      setNodeListText(".desktop-nav .nav-link", copy.desktopNav);
      setNodeListText(".mobile-links a", copy.mobileNav);
      setNodeListText(".nav-cta", [copy.navCta, copy.navCta]);
      setTextContent(".mobile-menu", copy.mobileMenuButton);
      const navPanel = document.querySelector(".nav-panel");
      if (navPanel) navPanel.setAttribute("aria-label", copy.navPanelAria);
      const desktopNav = document.querySelector(".desktop-nav");
      if (desktopNav) desktopNav.setAttribute("aria-label", copy.desktopNavAria);
      if (navLogoSlot) navLogoSlot.setAttribute("aria-label", copy.navLogoSlotAria);
      const mobileLinksNav = document.querySelector(".mobile-links");
      if (mobileLinksNav) mobileLinksNav.setAttribute("aria-label", copy.mobileNavAria);
      if (brand) {
        brand.setAttribute("aria-label", currentLang === "en" ? "Pan Viking home page" : "Strona glowna Pan Viking");
      }

      setNodeListText(".hero-slide .hero-kicker", copy.heroKickers);
      setNodeListText(".hero-slide .hero-copyline", copy.heroCopy);
      setHtmlContent(".hero-slide--forge .hero-title", copy.heroTitles[0]);
      setHtmlContent(".hero-slide--fleet .hero-title", copy.heroTitles[1]);
      setHtmlContent(".hero-slide--taste .hero-title", copy.heroTitles[2]);
      setNodeListText(".hero-slide .hero-actions .btn-primary", copy.heroActionPrimary);
      setNodeListText(".hero-slide .hero-actions .btn-secondary", copy.heroActionSecondary);
      document.querySelectorAll(".hero-trust-strip").forEach((strip) => {
        strip.setAttribute("aria-label", copy.heroTrustAria);
        setNodeListText("li", copy.heroTrust, strip);
      });
      setNodeListText(".hero-slide .hero-stat span", copy.heroStats);
      const heroDotsWrap = document.querySelector(".hero-dots");
      if (heroDotsWrap) {
        heroDotsWrap.setAttribute("aria-label", copy.heroDotsAria);
      }
      const heroDots = Array.from(document.querySelectorAll("[data-hero-dot]"));
      heroDots.forEach((dot, index) => {
        dot.setAttribute("aria-label", copy.heroDotLabels[index] || `${copy.heroDotLabels[0]} ${index + 1}`);
      });
      const heroPrev = document.querySelector("[data-hero-prev]");
      const heroNext = document.querySelector("[data-hero-next]");
      if (heroPrev) heroPrev.setAttribute("aria-label", copy.heroPrevAria);
      if (heroNext) heroNext.setAttribute("aria-label", copy.heroNextAria);

      const officeStorySection = document.getElementById("biuro");
      if (officeStorySection) {
        setTextContent("[data-office-story-title]", copy.officeStoryTitle, officeStorySection);
        setTextContent("[data-office-story-body]", copy.officeStoryBody, officeStorySection);
      }

      const whySection = document.getElementById("oferta");
      if (whySection) {
        setTextContent(".chip", copy.whyChip, whySection);
        setTextContent(".section-title", copy.whyTitle, whySection);
        setTextContent(".section-lead", copy.whyLead, whySection);

        const whyCards = Array.from(whySection.querySelectorAll(".why-card[data-why-topic]"));
        whyCards.forEach((card, index) => {
          const cardCopy = copy.whyCards[index];
          if (!cardCopy) return;
          card.dataset.whyTitle = cardCopy.title;
          card.dataset.whyCopy = cardCopy.detail;
          card.dataset.whySummary = cardCopy.summary;
          setTextContent(".why-tag", cardCopy.tag, card);
          setTextContent("h3", cardCopy.title, card);
          setTextContent(".why-card-summary", cardCopy.summary, card);
          setTextContent("[data-why-detail]", cardCopy.detail, card);
          setTextContent("[data-why-action-label]", card.classList.contains("is-expanded") ? copy.whyActionCloseLabel : copy.whyActionLabel, card);
        });

        const insight = whySection.querySelector(".why-insight");
        if (insight) {
          setTextContent(".why-insight-kicker", copy.whyInsightKicker, insight);
          setTextContent("[data-why-progress-prefix]", copy.whyProgressPrefix, insight);
          const primaryAction = insight.querySelector(".why-insight-actions .btn-primary");
          const secondaryAction = insight.querySelector(".why-insight-actions .btn-secondary");
          if (primaryAction) primaryAction.textContent = copy.whyInsightPrimary;
          if (secondaryAction) secondaryAction.textContent = copy.whyInsightSecondary;
          const activeCard = whySection.querySelector(".why-card.is-active") || whyCards[0];
          if (activeCard) {
            setTextContent("[data-why-insight-title]", activeCard.dataset.whyTitle || "", insight);
            setTextContent("[data-why-insight-copy]", activeCard.dataset.whyCopy || "", insight);
          }
        }
      }

      const proofSection = document.getElementById("opinie");
      if (proofSection) {
        setTextContent(".chip", copy.proofChip, proofSection);
        setTextContent(".section-title", copy.proofTitle, proofSection);
        setTextContent(".section-lead", copy.proofLead, proofSection);
        const proofCards = Array.from(proofSection.querySelectorAll("[data-proof-card]"));
        proofCards.forEach((card, index) => {
          const quote = copy.proofQuotes?.[index] || "";
          const badgeCopy = copy.proofCardBadges?.[index] || [];
          const verified = card.querySelector("[data-proof-verified]");
          if (verified) verified.textContent = copy.proofVerifiedLabels?.[index] || copy.proofVerifiedLabel;
          const stars = card.querySelector(".proof-stars");
          if (stars) {
            stars.setAttribute("aria-label", copy.proofStarsAria);
            stars.setAttribute("title", copy.proofStarsAria);
          }
          Array.from(card.querySelectorAll("[data-proof-card-badge]")).forEach((badge, badgeIndex) => {
            badge.textContent = badgeCopy[badgeIndex] || "";
          });
          setTextContent(".proof-quote", quote, card);
          setTextContent("[data-proof-author-role]", copy.proofAuthorRoles?.[index] || "", card);
          setTextContent("[data-proof-author-meta]", copy.proofAuthorMeta?.[index] || "", card);
          const indexNode = card.querySelector("[data-proof-card-index]");
          if (indexNode) {
            indexNode.textContent = String(index + 1).padStart(2, "0");
          }
        });
      }

      const processSection = document.getElementById("proces");
      if (processSection) {
        setTextContent(".flow-title", copy.processTitle, processSection);
        setTextContent(".flow-lead", copy.processLead, processSection);
        setNodeListText(".flow-badges span", copy.processBadges, processSection);
        const flowBadges = processSection.querySelector(".flow-badges");
        if (flowBadges) flowBadges.setAttribute("aria-label", copy.processBadgesAria);
        const flowSlider = processSection.querySelector("[data-flow-slider]");
        if (flowSlider) flowSlider.setAttribute("aria-label", copy.processSliderAria);
        setTextContent("[data-flow-drag-hint]", copy.processDragHint, processSection);
        const flowPrev = processSection.querySelector("[data-flow-prev]");
        if (flowPrev) flowPrev.setAttribute("aria-label", copy.processPrevAria);
        const flowNext = processSection.querySelector("[data-flow-next]");
        if (flowNext) flowNext.setAttribute("aria-label", copy.processNextAria);
        const flowSteps = Array.from(processSection.querySelectorAll(".flow-slide[data-flow-step]"));
        flowSteps.forEach((step, index) => {
          const detailCopy = copy.processStepsData[index];
          if (!detailCopy) return;
          setTextContent("[data-flow-kicker]", detailCopy.kicker, step);
          setTextContent("[data-flow-title]", detailCopy.title, step);
          setTextContent("[data-flow-copy]", detailCopy.copy, step);
          setTextContent("[data-flow-pill]", detailCopy.pill, step);
          setTextContent("[data-flow-action]", detailCopy.action, step);
        });
      }

      const coverageSection = document.getElementById("dostawa");
      if (coverageSection) {
        setTextContent(".chip", copy.coverageChip, coverageSection);
        setTextContent(".section-title", copy.coverageTitle, coverageSection);
        setTextContent(".section-lead", copy.coverageLead, coverageSection);
        setTextContent(".coverage-kicker", copy.coverageKicker, coverageSection);
        setTextContent("[data-coverage-question]", copy.coverageQuestion, coverageSection);
        const coverageInput = coverageSection.querySelector("[data-coverage-search]");
        if (coverageInput) {
          coverageInput.setAttribute("placeholder", copy.coveragePlaceholder);
        }
        const clearButton = coverageSection.querySelector("[data-coverage-clear]");
        if (clearButton) clearButton.setAttribute("aria-label", copy.coverageClearAria);
        setTextContent("[data-coverage-count-label]", t("coverageCountLabel"), coverageSection);
        const primaryCta = coverageSection.querySelector("[data-coverage-primary-cta]");
        if (primaryCta) primaryCta.textContent = copy.coveragePrimaryCta;
        const expansionCta = coverageSection.querySelector("[data-coverage-expansion-cta]");
        if (expansionCta) expansionCta.textContent = copy.coverageExpansionCta;
        setTextContent("[data-coverage-status-kicker]", copy.coverageStatusDefaultKicker, coverageSection);
        setTextContent("[data-coverage-status-title]", copy.coverageStatusDefaultTitle, coverageSection);
        setTextContent("[data-coverage-map-title]", copy.coverageMapTitle, coverageSection);
        setTextContent("[data-coverage-map-hint]", copy.coverageMapHint, coverageSection);
        setTextContent("[data-coverage-map-active-label]", copy.coverageMapActiveLabel, coverageSection);
        setTextContent("[data-coverage-map-active-city]", copy.coverageMapActiveCityDefault, coverageSection);
        setTextContent("[data-coverage-map-active-region-label]", copy.coverageMapActiveRegionLabel, coverageSection);
        setTextContent("[data-coverage-map-active-region]", copy.coverageMapActiveRegionDefault, coverageSection);
        setTextContent("[data-coverage-map-back]", copy.coverageMapBack, coverageSection);
        setTextContent("[data-coverage-region-kicker]", copy.coverageRegionKicker, coverageSection);
        setTextContent("[data-coverage-region-title]", copy.coverageRegionTitleDefault, coverageSection);
        setTextContent("[data-coverage-region-count-label]", copy.coverageRegionCountLabel, coverageSection);
        const map = coverageSection.querySelector("[data-coverage-map]");
        if (map) map.setAttribute("aria-label", copy.coverageMapAria);
      }

      const menuSection = document.getElementById("menu");
      if (menuSection) {
        setTextContent(".chip", copy.menuChip, menuSection);
        setTextContent(".section-title", copy.menuTitle, menuSection);
        setTextContent(".section-lead", copy.menuLead, menuSection);
        setTextContent(".menu-toolbar-title", copy.menuToolbarTitle, menuSection);
        setTextContent(".menu-toolbar-sub", copy.menuToolbarSub, menuSection);
        setTextContent("[data-menu-counter-visible-label]", copy.menuCounters[0], menuSection);
        const allFilterButton = menuSection.querySelector('[data-menu-filter="all"]');
        if (allFilterButton) {
          allFilterButton.textContent = t("menuFilterAll");
        }
        const menuDays = menuSection.querySelector("[data-menu-days]");
        if (menuDays) menuDays.setAttribute("aria-label", copy.menuDaysAria);
      const menuFilters = menuSection.querySelector("[data-menu-filters]");
      if (menuFilters) menuFilters.setAttribute("aria-label", copy.menuFiltersAria);
      }

      const faqSection = document.getElementById("faq");
      if (faqSection) {
        setTextContent(".chip", copy.faqChip, faqSection);
        setTextContent(".section-title", copy.faqTitle, faqSection);
        setTextContent(".section-lead", copy.faqLead, faqSection);
        const faqToggle = faqSection.querySelector("[data-faq-toggle]");
        if (faqToggle) {
          const isExpanded = faqToggle.getAttribute("aria-expanded") === "true";
          faqToggle.textContent = isExpanded ? copy.faqToggleHide : copy.faqToggleShow;
        }
        const faqItems = Array.from(faqSection.querySelectorAll(".faq-item"));
        faqItems.forEach((item, index) => {
          const faqCopy = copy.faqItems[index];
          if (!faqCopy) return;
          setTextContent("summary span:first-child", faqCopy.q, item);
          setTextContent("p", faqCopy.a, item);
        });
      }

      const contactSection = document.getElementById("kontakt");
      if (contactSection) {
        setTextContent(".lead-kicker", copy.contactKicker, contactSection);
        setTextContent(".lead-intro h2", copy.contactTitle, contactSection);
        setTextContent(".lead-intro p:not(.lead-kicker)", copy.contactIntro, contactSection);
        setNodeListText("[data-contact-points] span", copy.contactPoints, contactSection);
        const leadPoints = contactSection.querySelector("[data-contact-points]");
        if (leadPoints) leadPoints.setAttribute("aria-label", copy.contactPointsAria);
        setTextContent("[data-contact-card-kicker]", copy.contactCardKicker, contactSection);
        setTextContent("[data-contact-card-title]", copy.contactCardTitle, contactSection);
        setTextContent("[data-contact-card-copy]", copy.contactCardCopy, contactSection);
        setTextContent("[data-contact-primary-cta]", copy.contactPrimaryCta, contactSection);
        setTextContent("[data-contact-secondary-cta]", copy.contactSecondaryCta, contactSection);
        setTextContent("[data-lead-modal-kicker]", copy.leadModalKicker, contactSection);
        setTextContent("[data-lead-modal-title]", copy.leadModalTitle, contactSection);
        setTextContent("[data-lead-modal-copy]", copy.leadModalIntro, contactSection);
        setNodeListText("[data-lead-modal-points] span", copy.leadModalPoints, contactSection);
        const modalPoints = contactSection.querySelector("[data-lead-modal-points]");
        if (modalPoints) modalPoints.setAttribute("aria-label", copy.leadModalPointsAria);
        setNodeListText("[data-lead-step-chip]", copy.leadStepChips, contactSection);
        const leadChips = contactSection.querySelector(".lead-step-chips");
        if (leadChips) leadChips.setAttribute("aria-label", copy.leadStepChipsAria);
        const leadModalTriggers = Array.from(contactSection.querySelectorAll("[data-open-lead-modal]"));
        leadModalTriggers.forEach((trigger) => {
          trigger.setAttribute("aria-label", t("leadModalOpen"));
          trigger.setAttribute("title", copy.contactPrimaryCta);
        });
        const leadModalCloseButtons = Array.from(contactSection.querySelectorAll("[data-lead-modal-close], .lead-modal-close"));
        leadModalCloseButtons.forEach((button) => {
          button.setAttribute("aria-label", t("leadModalClose"));
          button.setAttribute("title", t("leadModalClose"));
        });
        const leadForm = contactSection.querySelector("[data-lead-form]");
        if (leadForm instanceof HTMLFormElement) {
          const setFieldLabel = (fieldName, labelText) => {
            const field = leadForm.elements[fieldName];
            if (!(field instanceof HTMLElement)) return;
            const label = field.closest(".lead-field");
            if (!label) return;
            setTextContent("span", labelText, label);
          };
          setFieldLabel("companyName", copy.leadFieldLabels.companyName);
          setFieldLabel("contactPerson", copy.leadFieldLabels.contactPerson);
          setFieldLabel("email", copy.leadFieldLabels.email);
          setFieldLabel("phone", copy.leadFieldLabels.phone);
          setFieldLabel("city", copy.leadFieldLabels.city);
          setFieldLabel("headcount", copy.leadFieldLabels.headcount);
          setFieldLabel("deliveryAddress", copy.leadFieldLabels.deliveryAddress);
          setFieldLabel("preferredHours", copy.leadFieldLabels.preferredHours);
          setFieldLabel("testDayDate", copy.leadFieldLabels.testDayDate);
          setFieldLabel("notes", copy.leadFieldLabels.notes);

          const phoneField = leadForm.elements.phone;
          if (phoneField instanceof HTMLInputElement) phoneField.placeholder = copy.leadPlaceholders.phone;
          const headcountField = leadForm.elements.headcount;
          if (headcountField instanceof HTMLInputElement) headcountField.placeholder = copy.leadPlaceholders.headcount;
          const preferredHoursField = leadForm.elements.preferredHours;
          if (preferredHoursField instanceof HTMLInputElement) preferredHoursField.placeholder = copy.leadPlaceholders.preferredHours;
          const notesField = leadForm.elements.notes;
          if (notesField instanceof HTMLTextAreaElement) notesField.placeholder = copy.leadPlaceholders.notes;
        }
        setTextContent(".lead-step[data-lead-step='1'] .lead-step-foot p", copy.leadStepHint, contactSection);
        setTextContent("[data-lead-next]", copy.leadNextButton, contactSection);
        const consentCopy = contactSection.querySelector(".lead-consent span");
        if (consentCopy) {
          consentCopy.innerHTML = `${copy.leadConsentPrefix} <a href="https://panviking.pl/docs/regulamin_strony_Pan_Viking.pdf" target="_blank" rel="noreferrer">${copy.leadConsentTerms}</a> ${copy.leadConsentConnector} <a href="https://panviking.pl/polityka-prywatnosci" target="_blank" rel="noreferrer">${copy.leadConsentPrivacy}</a> *`;
        }
        setTextContent("[data-lead-prev]", copy.leadPrevButton, contactSection);
        setTextContent(".lead-success-kicker", copy.leadSuccessKicker, contactSection);
        setTextContent("[data-lead-success-title]", copy.leadSuccessTitle, contactSection);
        setTextContent("[data-lead-success-copy]", copy.leadSuccessCopy, contactSection);
        setTextContent("[data-lead-reset]", copy.leadSuccessReset, contactSection);
        const successCall = contactSection.querySelector(".lead-success-actions .btn-primary");
        if (successCall) successCall.textContent = copy.leadSuccessCall;
      }

      setNodeListText(".footer-links a", copy.footerLinks);
      setTextContent("[data-footer-copy-text]", copy.footerCopyright);
      setTextContent("[data-footer-designer-tooltip]", copy.footerDesignerCredit);
      const designerCredit = document.querySelector("[data-footer-designer-credit]");
      if (designerCredit) {
        designerCredit.setAttribute("aria-label", copy.footerDesignerCredit);
        designerCredit.setAttribute("title", copy.footerDesignerCredit);
      }
      const legalLinks = document.querySelectorAll(".footer-legal-links a");
      if (legalLinks[0]) legalLinks[0].textContent = copy.footerLegalPrivacy;
      if (legalLinks[1]) legalLinks[1].textContent = copy.footerLegalTerms;

      const nextLabel = I18N_TEXT[nextLang]?.langLabel || nextLang.toUpperCase();
      setNodeListText(".lang-pill", [nextLabel, nextLabel]);
      languageToggles.forEach((toggle) => {
        toggle.classList.toggle("is-active", true);
        toggle.setAttribute("aria-label", I18N_TEXT[currentLang].langSwitchTo);
        toggle.setAttribute("title", I18N_TEXT[currentLang].langSwitchTo);
        toggle.dataset.langTarget = nextLang;
      });

      if (contactBot) {
        setTextContent(".contact-bot-title", copy.botTitle, contactBot);
        setTextContent("[data-contact-bot-status]", copy.botPanelStatus, contactBot);
        setTextContent("[data-contact-bot-launcher-label]", copy.botLauncherLabel, contactBot);
        setTextContent("[data-contact-bot-teaser-copy]", copy.botTeaserCopy, contactBot);
        setTextContent("[data-contact-bot-open]", copy.botTeaserAction, contactBot);
        const teaserClose = contactBot.querySelector("[data-contact-bot-teaser-close]");
        if (teaserClose) teaserClose.setAttribute("aria-label", copy.botTeaserDismissAria);
        const botClose = contactBot.querySelector("[data-contact-bot-close]");
        if (botClose) botClose.setAttribute("aria-label", copy.botCloseAria);
      }
      if (contactBotToggle) {
        contactBotToggle.setAttribute("aria-label", copy.botToggleAria);
        contactBotToggle.setAttribute("title", copy.botToggleAria);
      }
    };

    /**
     * Central language switch.
     * Persists the choice, updates document/UI copy and notifies stateful modules.
     */
    const setLanguage = (lang) => {
      if (lang !== "pl" && lang !== "en") return;
      const wasLang = currentLang;
      currentLang = lang;
      localStorage.setItem("pv_lang", lang);
      document.body.classList.add("is-lang-shifting");
      applyStaticTranslations();
      if (wasLang !== currentLang) {
        trackEvent("lang_switch", { from: wasLang, to: currentLang });
        document.dispatchEvent(new CustomEvent("pv:language-change", { detail: { lang } }));
      }
      setTimeout(() => {
        document.body.classList.remove("is-lang-shifting");
      }, 220);
    };

    languageToggles.forEach((toggle) => {
      toggle.addEventListener("click", () => {
        setLanguage(currentLang === "pl" ? "en" : "pl");
      });
    });

    // ==========================================================================
    // Global one-page behavior: analytics, header docking and utility UI
    // ==========================================================================
    /**
     * Hooks shared CTA / anchor interactions into the analytics layer.
     * Section-specific modules can still emit their own richer events.
     */
    const initOnePageTracking = () => {
      document.addEventListener("click", (event) => {
        const target = event.target;
        if (!(target instanceof HTMLElement)) return;
        const link = target.closest("a[href]");
        if (!link) return;

        const label = link.textContent?.replace(/\s+/g, " ").trim() || link.getAttribute("aria-label") || "";
        const section = link.closest("section, header, footer, .contact-bot")?.id
          || link.closest("section, header, footer, .contact-bot")?.className
          || "page";

        if (link.matches(".btn, .nav-cta, .contact-bot-action, .contact-bot-teaser-action, .nav-link, .mobile-links a")) {
          trackEvent("cta_click", {
            label,
            href: link.getAttribute("href") || "",
            placement: section.toString(),
          });
        }
      });

      const menuSection = document.getElementById("menu");
      if (menuSection && "IntersectionObserver" in window) {
        let trackedMenuView = false;
        const menuObserver = new IntersectionObserver((entries, observer) => {
          entries.forEach((entry) => {
            if (trackedMenuView || !entry.isIntersecting) return;
            trackedMenuView = true;
            trackEvent("menu_view", { section: "menu" });
            observer.disconnect();
          });
        }, { threshold: 0.35 });
        menuObserver.observe(menuSection);
      }
    };

    // Header docking utilities keep the floating logo and scrolled nav in sync.
    const scheduleDockRecalc = () => {
      dockRecalcTimers.forEach((timerId) => clearTimeout(timerId));
      dockRecalcTimers = [];

      updateBrandDockShift(true);
      requestAnimationFrame(() => updateBrandDockShift(true));
      dockRecalcTimers.push(setTimeout(() => updateBrandDockShift(true), 140));
      dockRecalcTimers.push(setTimeout(() => updateBrandDockShift(true), 300));
    };

    /**
     * Measures where the floating brand should animate to when the scrolled
     * header reveals the compact logo slot.
     */
    const updateBrandDockShift = (shouldDock = brand?.classList.contains("is-docked")) => {
      if (!header || !brand || !navLogoSlot || window.innerWidth < 980 || !shouldDock) {
        if (brand) {
          brand.style.setProperty("--dock-shift-x", "0px");
        }
        return;
      }

      const brandRect = brand.getBoundingClientRect();
      const slotRect = navLogoSlot.getBoundingClientRect();
      if (slotRect.width < 8) {
        brand.style.setProperty("--dock-shift-x", "0px");
        return;
      }
      const brandCenterX = brandRect.left + brandRect.width / 2;
      const targetCenterX = slotRect.left + slotRect.width / 2;
      const shiftX = targetCenterX - brandCenterX;
      brand.style.setProperty("--dock-shift-x", `${shiftX}px`);
    };

    /**
     * Applies scroll-driven header states: hide/show, scrolled look and logo docking.
     */
    const syncDockedHeader = () => {
      if (!header || !brand) return;
      const currentScrollY = Math.max(window.scrollY || 0, 0);
      const scrollDelta = currentScrollY - lastHeaderScrollY;
      const isScrollingDown = scrollDelta > 6;
      const isScrollingUp = scrollDelta < -6;
      const shouldHideOnScroll = currentScrollY > 140 && isScrollingDown && !mobileNav?.classList.contains("is-open");

      if (window.innerWidth < 980) {
        header.classList.remove("is-hidden");
        header.classList.remove("is-scrolled");
        brand.classList.remove("is-docked");
        brand.style.setProperty("--dock-shift-x", "0px");
        lastHeaderScrollY = currentScrollY;
        return;
      }

      if (shouldHideOnScroll) {
        header.classList.add("is-hidden");
      } else if (isScrollingUp || currentScrollY <= 48) {
        header.classList.remove("is-hidden");
      }

      const shouldDock = currentScrollY > 64;
      const wasDocked = brand.classList.contains("is-docked");
      header.classList.toggle("is-scrolled", shouldDock);
      brand.classList.toggle("is-docked", shouldDock);

      if (shouldDock !== wasDocked) {
        if (shouldDock) {
          scheduleDockRecalc();
        } else {
          brand.style.setProperty("--dock-shift-x", "0px");
        }
      }

      lastHeaderScrollY = currentScrollY;
    };

    if (navLogoSlot) {
      navLogoSlot.addEventListener("click", () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
      });
    }

    if (mobileMenuButton && mobileNav) {
      const setMenuState = (open) => {
        mobileNav.classList.toggle("is-open", open);
        mobileMenuButton.classList.toggle("is-open", open);
        mobileMenuButton.setAttribute("aria-expanded", open ? "true" : "false");
        if (open) {
          header?.classList.remove("is-hidden");
          mobileNav.scrollTop = 0;
        }
      };

      setMenuState(false);

      mobileMenuButton.addEventListener("click", () => {
        setMenuState(!mobileNav.classList.contains("is-open"));
      });

      document.addEventListener("click", (event) => {
        if (!mobileNav.classList.contains("is-open")) return;
        const target = event.target;
        if (!(target instanceof Node)) return;
        if (mobileNav.contains(target) || mobileMenuButton.contains(target)) return;
        setMenuState(false);
      });

      document.addEventListener("keydown", (event) => {
        if (event.key === "Escape" && mobileNav.classList.contains("is-open")) {
          setMenuState(false);
          mobileMenuButton.focus({ preventScroll: true });
        }
      });

      mobileNav.querySelectorAll("a").forEach((link) => {
        link.addEventListener("click", () => setMenuState(false));
      });

      window.addEventListener("resize", () => {
        if (window.innerWidth >= 980) {
          setMenuState(false);
        }
      });
    }

    // ==========================================================================
    // Utility module: floating contact bot
    // ==========================================================================
    /**
     * Contact bot teaser + scripted lead flow for test day qualification.
     * Persists progress in sessionStorage, captures a transcript and submits
     * everything to the same webhook as the regular B2B form.
     */
    const initContactBot = () => {
      if (!contactBot || !contactBotToggle) return;

      const contactSection = document.getElementById("kontakt");
      const launcherStartSection = document.getElementById("biuro");
      const backdrop = contactBot.querySelector("[data-contact-bot-backdrop]");
      const teaser = contactBot.querySelector("[data-contact-bot-teaser]");
      const teaserCopy = contactBot.querySelector("[data-contact-bot-teaser-copy]");
      const teaserAction = contactBot.querySelector("[data-contact-bot-open]");
      const teaserClose = contactBot.querySelector("[data-contact-bot-teaser-close]");
      const panel = document.getElementById("contact-bot-panel");
      const panelTitle = contactBot.querySelector(".contact-bot-title");
      const panelStatus = contactBot.querySelector("[data-contact-bot-status]");
      const panelClose = contactBot.querySelector("[data-contact-bot-close]");
      const messagesNode = contactBot.querySelector("[data-contact-bot-messages]");
      const progressBar = contactBot.querySelector("[data-contact-bot-progress]");
      const form = contactBot.querySelector("[data-contact-bot-form]");
      const fieldSlot = contactBot.querySelector("[data-contact-bot-field]");
      const errorNode = contactBot.querySelector("[data-contact-bot-error]");
      const actionsWrap = contactBot.querySelector(".contact-bot-actions");
      const primaryButton = contactBot.querySelector("[data-contact-bot-primary]");
      const secondaryButton = contactBot.querySelector("[data-contact-bot-secondary]");

      if (
        !backdrop
        || !teaser
        || !teaserCopy
        || !teaserAction
        || !teaserClose
        || !panel
        || !panelTitle
        || !panelStatus
        || !panelClose
        || !messagesNode
        || !progressBar
        || !(form instanceof HTMLFormElement)
        || !fieldSlot
        || !errorNode
        || !actionsWrap
        || !(primaryButton instanceof HTMLButtonElement)
        || !(secondaryButton instanceof HTMLButtonElement)
      ) return;

      const BOT_TRIGGER_DELAY_MS = 120000;
      const BOT_ATTENTION_FIRST_DELAY_MS = 18000;
      const BOT_ATTENTION_INTERVAL_MS = 50000;
      const BOT_ATTENTION_DURATION_MS = 2200;
      const BOT_STORAGE_KEY = "pv_contact_bot_state_v2";
      const BOT_FLOW_ID = "test_day_qualifier_v1";
      const BOT_TRIGGER = "cta_delay_120s";
      const mobileSheetQuery = window.matchMedia("(max-width: 620px)");
      const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
      let teaserTimer = 0;
      let attentionTimer = 0;
      let attentionResetTimer = 0;
      let launcherVisibilityFrame = 0;
      let launcherAvailable = false;
      let isSubmitting = false;
      let submitStatus = "idle";
      let submitErrorKey = "";

      const stripRequiredMarker = (value = "") => value.replace(/\s*\*+\s*$/, "").trim();
      const createSessionId = () => window.crypto?.randomUUID?.() || `pvbot-${Date.now()}-${Math.random().toString(16).slice(2, 10)}`;
      const buildEmptyLead = () => ({
        companyName: "",
        contactPerson: "",
        email: "",
        phone: "",
        city: "",
        headcount: "",
        deliveryAddress: "",
        preferredHours: "",
        testDayDate: "",
        notes: "",
        consent: false,
      });

      const getLeadWebhookUrl = () =>
        (
          contactSection?.dataset?.leadWebhookUrl
          || contactSection?.querySelector("[data-lead-webhook-url]")?.dataset?.leadWebhookUrl
          || document.body?.dataset?.leadWebhookUrl
          || window.PAN_VIKING_WEBHOOK_URL
          || ""
        ).trim();

      const normalizeState = (rawState) => {
        const fallback = {
          sessionId: createSessionId(),
          teaserShown: false,
          teaserDismissed: false,
          teaserPending: false,
          teaserDueAt: Date.now() + BOT_TRIGGER_DELAY_MS,
          conversationStarted: false,
          conversationCompleted: false,
          startedAt: "",
          completedAt: "",
          activeStepIndex: 0,
          flowId: BOT_FLOW_ID,
          trigger: BOT_TRIGGER,
          entrypoint: "",
          dismissedBeforeSubmit: false,
          lead: buildEmptyLead(),
          transcript: [],
          drafts: {},
        };

        if (!rawState || typeof rawState !== "object") {
          return fallback;
        }

        const rawLead = rawState.lead && typeof rawState.lead === "object" ? rawState.lead : {};
        const rawTranscript = Array.isArray(rawState.transcript) ? rawState.transcript : [];
        const rawDrafts = rawState.drafts && typeof rawState.drafts === "object" ? rawState.drafts : {};

        return {
          ...fallback,
          ...rawState,
          sessionId: typeof rawState.sessionId === "string" && rawState.sessionId ? rawState.sessionId : fallback.sessionId,
          teaserShown: Boolean(rawState.teaserShown),
          teaserDismissed: Boolean(rawState.teaserDismissed),
          teaserPending: Boolean(rawState.teaserPending),
          teaserDueAt: Number.isFinite(Number(rawState.teaserDueAt)) && Number(rawState.teaserDueAt) > 0
            ? Number(rawState.teaserDueAt)
            : fallback.teaserDueAt,
          conversationStarted: Boolean(rawState.conversationStarted || rawTranscript.length),
          conversationCompleted: Boolean(rawState.conversationCompleted),
          startedAt: typeof rawState.startedAt === "string" ? rawState.startedAt : "",
          completedAt: typeof rawState.completedAt === "string" ? rawState.completedAt : "",
          activeStepIndex: Math.max(0, Math.min(
            Number.isFinite(Number(rawState.activeStepIndex)) ? Number(rawState.activeStepIndex) : 0,
            getSteps().length - 1,
          )),
          flowId: BOT_FLOW_ID,
          trigger: BOT_TRIGGER,
          entrypoint: typeof rawState.entrypoint === "string" ? rawState.entrypoint : "",
          dismissedBeforeSubmit: Boolean(rawState.dismissedBeforeSubmit),
          lead: {
            ...buildEmptyLead(),
            ...rawLead,
            consent: Boolean(rawLead.consent),
          },
          transcript: rawTranscript
            .filter((entry) => entry && typeof entry === "object")
            .map((entry) => ({
              role: entry.role === "user" ? "user" : "assistant",
              stepId: typeof entry.stepId === "string" ? entry.stepId : "",
              kind: typeof entry.kind === "string" ? entry.kind : "message",
              value: typeof entry.value === "boolean" ? entry.value : (entry.value ?? "").toString(),
              skipped: Boolean(entry.skipped),
              timestamp: typeof entry.timestamp === "string" ? entry.timestamp : new Date().toISOString(),
            })),
          drafts: Object.prototype.hasOwnProperty.call(rawDrafts, "consent")
            ? { ...rawDrafts, consent: Boolean(rawDrafts.consent) }
            : { ...rawDrafts },
        };
      };

      const loadState = () => {
        try {
          const raw = sessionStorage.getItem(BOT_STORAGE_KEY);
          return normalizeState(raw ? JSON.parse(raw) : null);
        } catch (error) {
          console.warn("Contact bot state restore failed:", error);
          return normalizeState(null);
        }
      };

      const saveState = () => {
        try {
          sessionStorage.setItem(BOT_STORAGE_KEY, JSON.stringify(state));
        } catch (error) {
          console.warn("Contact bot state persist failed:", error);
        }
      };

      const getConsentMarkup = (copy) => `${copy.leadConsentPrefix} <a href="https://panviking.pl/docs/regulamin_strony_Pan_Viking.pdf" target="_blank" rel="noreferrer">${copy.leadConsentTerms}</a> ${copy.leadConsentConnector} <a href="https://panviking.pl/polityka-prywatnosci" target="_blank" rel="noreferrer">${copy.leadConsentPrivacy}</a> *`;

      const getSteps = () => {
        const copy = getStaticCopy();

        return [
          {
            id: "companyName",
            type: "text",
            required: true,
            label: stripRequiredMarker(copy.leadFieldLabels.companyName),
            question: copy.botQuestions.companyName,
            placeholder: copy.botFieldPlaceholders.companyName,
            autocomplete: "organization",
          },
          {
            id: "contactPerson",
            type: "text",
            required: true,
            label: stripRequiredMarker(copy.leadFieldLabels.contactPerson),
            question: copy.botQuestions.contactPerson,
            placeholder: copy.botFieldPlaceholders.contactPerson,
            autocomplete: "name",
          },
          {
            id: "email",
            type: "email",
            required: true,
            label: stripRequiredMarker(copy.leadFieldLabels.email),
            question: copy.botQuestions.email,
            placeholder: copy.botFieldPlaceholders.email,
            autocomplete: "email",
            inputMode: "email",
          },
          {
            id: "phone",
            type: "tel",
            required: false,
            label: stripRequiredMarker(copy.leadFieldLabels.phone),
            question: copy.botQuestions.phone,
            placeholder: copy.leadPlaceholders.phone,
            autocomplete: "tel",
            inputMode: "tel",
          },
          {
            id: "city",
            type: "text",
            required: true,
            label: stripRequiredMarker(copy.leadFieldLabels.city),
            question: copy.botQuestions.city,
            placeholder: copy.botFieldPlaceholders.city,
            autocomplete: "address-level2",
          },
          {
            id: "headcount",
            type: "number",
            required: true,
            label: stripRequiredMarker(copy.leadFieldLabels.headcount),
            question: copy.botQuestions.headcount,
            placeholder: copy.leadPlaceholders.headcount,
            inputMode: "numeric",
            min: "1",
            step: "1",
          },
          {
            id: "deliveryAddress",
            type: "text",
            required: false,
            label: stripRequiredMarker(copy.leadFieldLabels.deliveryAddress),
            question: copy.botQuestions.deliveryAddress,
            placeholder: copy.botFieldPlaceholders.deliveryAddress,
            autocomplete: "street-address",
          },
          {
            id: "preferredHours",
            type: "text",
            required: false,
            label: stripRequiredMarker(copy.leadFieldLabels.preferredHours),
            question: copy.botQuestions.preferredHours,
            placeholder: copy.leadPlaceholders.preferredHours,
          },
          {
            id: "testDayDate",
            type: "date",
            required: false,
            label: stripRequiredMarker(copy.leadFieldLabels.testDayDate),
            question: copy.botQuestions.testDayDate,
          },
          {
            id: "notes",
            type: "textarea",
            required: false,
            label: stripRequiredMarker(copy.leadFieldLabels.notes),
            question: copy.botQuestions.notes,
            placeholder: copy.leadPlaceholders.notes,
          },
          {
            id: "consent",
            type: "consent",
            required: true,
            label: copy.botConsentLabel,
            question: copy.botQuestions.consent,
          },
        ];
      };

      const getStepById = (stepId) => getSteps().find((step) => step.id === stepId) || null;
      const getActiveStep = () => getSteps()[state.activeStepIndex] || null;

      const getCurrentStepValue = (step) => {
        if (!step) return "";
        if (step.id === "consent") {
          return Boolean(state.drafts.consent ?? state.lead.consent);
        }
        return (state.drafts[step.id] ?? state.lead[step.id] ?? "").toString();
      };

      const pushTranscriptEntry = ({ role, stepId = "", kind = "message", value = "", skipped = false }) => {
        state.transcript.push({
          role: role === "user" ? "user" : "assistant",
          stepId,
          kind,
          value: typeof value === "boolean" ? value : (value ?? "").toString(),
          skipped: Boolean(skipped),
          timestamp: new Date().toISOString(),
        });
      };

      const removeTranscriptAnswer = (stepId) => {
        state.transcript = state.transcript.filter((entry) => !(entry.role === "user" && entry.stepId === stepId));
      };

      const ensureConversationSeed = () => {
        if (!state.conversationStarted) return;

        if (!state.transcript.some((entry) => entry.role === "assistant" && entry.stepId === "intro")) {
          pushTranscriptEntry({ role: "assistant", stepId: "intro", kind: "intro" });
        }

        const activeStep = getActiveStep();
        if (!activeStep) return;
        const lastEntry = state.transcript[state.transcript.length - 1];
        if (!lastEntry || lastEntry.role !== "assistant" || lastEntry.stepId !== activeStep.id || lastEntry.kind !== "question") {
          pushTranscriptEntry({ role: "assistant", stepId: activeStep.id, kind: "question" });
        }
      };

      const syncVisibility = () => {
        const isOpen = contactBot.classList.contains("is-open");
        contactBot.classList.toggle("is-visible", launcherAvailable || isOpen);
        contactBotToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
        panel.setAttribute("aria-hidden", isOpen ? "false" : "true");
      };

      const setPanelOpen = (open) => {
        if (open) {
          clearAttentionTimers();
        }
        contactBot.classList.toggle("is-open", open);
        document.body.classList.toggle("is-contact-bot-open", open);
        contactBotToggle.setAttribute("aria-expanded", open ? "true" : "false");
        panel.setAttribute("aria-hidden", open ? "false" : "true");
        panel.setAttribute("aria-modal", open && mobileSheetQuery.matches ? "true" : "false");
        backdrop.setAttribute("aria-hidden", open ? "false" : "true");
        syncVisibility();
      };

      const getPanelFocusableElements = () =>
        Array.from(
          panel.querySelectorAll("a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex='-1'])")
        ).filter((element) => (
          element instanceof HTMLElement
          && !element.hidden
          && !element.closest("[hidden]")
          && element.getAttribute("tabindex") !== "-1"
        ));

      const setError = (message = "") => {
        errorNode.textContent = message;
      };

      const focusActiveControl = () => {
        const focusTarget = state.conversationCompleted
          ? panelClose
          : fieldSlot.querySelector("[data-contact-bot-input]") || primaryButton;

        if (focusTarget instanceof HTMLElement) {
          focusTarget.focus({ preventScroll: true });
        }
      };

      const formatBotDate = (value) => {
        if (!value) return "";
        const parsed = new Date(`${value}T00:00:00`);
        if (Number.isNaN(parsed.getTime())) return value;
        return new Intl.DateTimeFormat(t("dateLocale"), {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        }).format(parsed);
      };

      const formatUserEntryValue = (entry, copy) => {
        if (entry.skipped) return copy.botSkippedAnswer;
        if (entry.stepId === "consent") return copy.botConsentAccepted;
        if (entry.stepId === "testDayDate") return formatBotDate(entry.value);
        return entry.value?.toString().trim() || copy.botSkippedAnswer;
      };

      const serializeTranscript = () => {
        const copy = getStaticCopy();

        return state.transcript.map((entry) => {
          const step = getStepById(entry.stepId);
          const isIntro = entry.role === "assistant" && entry.stepId === "intro";
          const label = isIntro
            ? copy.botIntroLabel
            : step?.label || copy.botTitle;
          const value = entry.role === "assistant"
            ? isIntro
              ? copy.botStartMessage
              : step?.question || ""
            : formatUserEntryValue(entry, copy);

          return {
            role: entry.role,
            stepId: entry.stepId,
            label,
            value,
            timestamp: entry.timestamp,
          };
        });
      };

      const buildPayload = () => ({
        source: "PAN_VIKING_BOT",
        submittedAt: new Date().toISOString(),
        lead: {
          companyName: state.lead.companyName.toString().trim(),
          contactPerson: state.lead.contactPerson.toString().trim(),
          email: state.lead.email.toString().trim(),
          phone: state.lead.phone.toString().trim(),
          city: state.lead.city.toString().trim(),
          headcount: Number((state.lead.headcount || "0").toString()),
          deliveryAddress: state.lead.deliveryAddress.toString().trim(),
          preferredHours: state.lead.preferredHours.toString().trim(),
          testDayDate: state.lead.testDayDate.toString().trim(),
          notes: state.lead.notes.toString().trim(),
          consent: Boolean(state.lead.consent),
        },
        conversation: {
          flowId: BOT_FLOW_ID,
          trigger: BOT_TRIGGER,
          startedAt: state.startedAt,
          completedAt: state.completedAt,
          transcript: serializeTranscript(),
          dismissedBeforeSubmit: false,
        },
        meta: {
          page: window.location.href,
          referrer: document.referrer || "",
          userAgent: navigator.userAgent,
          language: document.documentElement.lang || navigator.language || "pl",
          sessionId: state.sessionId,
          entrypoint: "contact_bot",
          botEntrypoint: state.entrypoint || "launcher",
          leadSource: "PAN_VIKING_BOT",
          isBotLead: true,
        },
      });

      const renderMessages = () => {
        const copy = getStaticCopy();
        const fragment = document.createDocumentFragment();

        state.transcript.forEach((entry) => {
          const step = getStepById(entry.stepId);
          const message = document.createElement("article");
          message.className = `contact-bot-message contact-bot-message--${entry.role === "user" ? "user" : "assistant"}`;

          const value = document.createElement("p");
          value.className = "contact-bot-message-value";
          value.textContent = entry.role === "assistant"
            ? entry.stepId === "intro"
              ? copy.botStartMessage
              : step?.question || ""
            : formatUserEntryValue(entry, copy);

          message.appendChild(value);
          fragment.appendChild(message);
        });

        const appendStatusMessage = (text, modifier) => {
          const message = document.createElement("article");
          message.className = `contact-bot-message contact-bot-message--assistant contact-bot-message--${modifier}`;
          const value = document.createElement("p");
          value.className = "contact-bot-message-value";
          value.textContent = text;
          message.appendChild(value);
          fragment.appendChild(message);
        };

        if (isSubmitting) {
          appendStatusMessage(copy.botSendingMessage, "status");
        } else if (submitStatus === "error" && submitErrorKey) {
          appendStatusMessage(t(submitErrorKey), "error");
        } else if (state.conversationCompleted) {
          appendStatusMessage(copy.botSuccessMessage, "success");
        }

        messagesNode.replaceChildren(fragment);
      };

      const renderField = () => {
        const copy = getStaticCopy();
        const activeStep = getActiveStep();
        fieldSlot.innerHTML = "";
        if (!activeStep || submitStatus === "error") return;

        if (activeStep.type === "consent") {
          const consentWrap = document.createElement("div");
          consentWrap.className = "contact-bot-consent";

          const consentLabel = document.createElement("label");
          const checkbox = document.createElement("input");
          checkbox.type = "checkbox";
          checkbox.name = "consent";
          checkbox.checked = Boolean(getCurrentStepValue(activeStep));
          checkbox.dataset.contactBotInput = "true";
          checkbox.required = true;
          checkbox.setAttribute("aria-label", activeStep.label);

          const consentCopyNode = document.createElement("span");
          consentCopyNode.className = "contact-bot-consent-copy";
          consentCopyNode.innerHTML = getConsentMarkup(copy);

          consentLabel.append(checkbox, consentCopyNode);
          consentWrap.appendChild(consentLabel);
          fieldSlot.appendChild(consentWrap);
          return;
        }

        const control = activeStep.type === "textarea"
          ? document.createElement("textarea")
          : document.createElement("input");

        control.className = activeStep.type === "textarea" ? "contact-bot-textarea" : "contact-bot-input";
        control.dataset.contactBotInput = "true";
        control.name = activeStep.id;
        control.placeholder = activeStep.placeholder || activeStep.label;
        control.autocomplete = activeStep.autocomplete || "off";
        control.required = activeStep.required;
        control.setAttribute("aria-label", activeStep.label);
        if (activeStep.type === "textarea") {
          control.rows = 3;
          control.value = getCurrentStepValue(activeStep);
        } else {
          control.type = activeStep.type;
          control.value = getCurrentStepValue(activeStep);
          if (activeStep.inputMode) control.inputMode = activeStep.inputMode;
          if (activeStep.min) control.min = activeStep.min;
          if (activeStep.step) control.step = activeStep.step;
          if (activeStep.type === "date") {
            control.min = getLocalDateInputValue();
          }
        }

        fieldSlot.appendChild(control);
      };

      const renderActionButtons = () => {
        const copy = getStaticCopy();
        const activeStep = getActiveStep();
        const shouldShowSkip = Boolean(activeStep && !activeStep.required && activeStep.type !== "consent" && !isSubmitting);

        primaryButton.textContent = isSubmitting
          ? t("leadSubmitting")
          : submitStatus === "error" && activeStep?.id === "consent"
            ? copy.botRetry
            : activeStep?.id === "consent"
              ? copy.botSubmit
              : copy.botNext;
        primaryButton.disabled = isSubmitting;

        secondaryButton.hidden = !shouldShowSkip;
        secondaryButton.disabled = isSubmitting;
        secondaryButton.textContent = copy.botSkip;
        actionsWrap.classList.toggle("is-single", secondaryButton.hidden);
      };

      const renderTeaser = () => {
        const copy = getStaticCopy();
        const shouldShowTeaser = state.teaserShown
          && !state.teaserDismissed
          && !state.conversationStarted
          && !state.conversationCompleted;

        teaser.hidden = !shouldShowTeaser;
        teaserCopy.textContent = copy.botTeaserCopy;
        teaserAction.textContent = copy.botTeaserAction;
        teaserClose.setAttribute("aria-label", copy.botTeaserDismissAria);
      };

      const render = ({ focusInput = false } = {}) => {
        const copy = getStaticCopy();
        panelTitle.textContent = copy.botTitle;
        panelStatus.textContent = isSubmitting
          ? copy.botSendingStatus
          : state.conversationCompleted
            ? copy.botDoneStatus
            : copy.botPanelStatus;

        panelClose.setAttribute("aria-label", copy.botCloseAria);
        contactBotToggle.setAttribute("aria-label", copy.botToggleAria);
        contactBotToggle.setAttribute("title", copy.botToggleAria);
        const launcherLabel = contactBot.querySelector("[data-contact-bot-launcher-label]");
        if (launcherLabel) launcherLabel.textContent = copy.botLauncherLabel;
        const activeStep = getActiveStep();
        contactBot.dataset.stepType = submitStatus === "error" ? "retry" : activeStep?.type || "done";
        contactBot.classList.toggle("is-composer-hidden", state.conversationCompleted || isSubmitting);

        renderTeaser();
        renderMessages();
        syncVisibility();

        if (state.conversationCompleted) {
          form.hidden = true;
          progressBar.style.width = "100%";
        } else if (state.conversationStarted && !isSubmitting) {
          form.hidden = false;
          progressBar.style.width = `${((state.activeStepIndex + 1) / getSteps().length) * 100}%`;
          renderField();
          renderActionButtons();
        } else {
          form.hidden = true;
          progressBar.style.width = state.conversationStarted
            ? `${((state.activeStepIndex + 1) / getSteps().length) * 100}%`
            : "0%";
        }

        if (contactBot.classList.contains("is-open")) {
          requestAnimationFrame(() => {
            messagesNode.scrollTop = messagesNode.scrollHeight;
            if (focusInput) {
              focusActiveControl();
            }
          });
        }
      };

      const clearTeaserTimer = () => {
        window.clearTimeout(teaserTimer);
        teaserTimer = 0;
      };

      const clearAttentionTimers = () => {
        window.clearTimeout(attentionTimer);
        window.clearTimeout(attentionResetTimer);
        attentionTimer = 0;
        attentionResetTimer = 0;
        contactBot.classList.remove("is-attention-pulse");
      };

      const canShowAttentionPulse = () => (
        launcherAvailable
        && contactBot.classList.contains("is-visible")
        && !contactBot.classList.contains("is-open")
        && teaser.hidden
        && !state.conversationStarted
        && !state.conversationCompleted
        && !document.body.classList.contains("is-lead-modal-open")
        && document.visibilityState === "visible"
        && !reducedMotionQuery.matches
      );

      const scheduleAttentionPulse = (delay = BOT_ATTENTION_INTERVAL_MS) => {
        window.clearTimeout(attentionTimer);
        attentionTimer = 0;

        if (
          state.conversationStarted
          || state.conversationCompleted
          || reducedMotionQuery.matches
        ) return;

        attentionTimer = window.setTimeout(() => {
          attentionTimer = 0;

          if (canShowAttentionPulse()) {
            contactBot.classList.remove("is-attention-pulse");
            void contactBotToggle.offsetWidth;
            contactBot.classList.add("is-attention-pulse");

            window.clearTimeout(attentionResetTimer);
            attentionResetTimer = window.setTimeout(() => {
              attentionResetTimer = 0;
              contactBot.classList.remove("is-attention-pulse");
            }, BOT_ATTENTION_DURATION_MS);
          }

          scheduleAttentionPulse();
        }, delay);
      };

      const revealTeaser = ({ deferred = false, track = false } = {}) => {
        if (state.teaserDismissed || state.conversationStarted || state.conversationCompleted) return;
        if (!launcherAvailable || document.body.classList.contains("is-lead-modal-open")) {
          state.teaserPending = true;
          saveState();
          render();
          return;
        }
        clearAttentionTimers();
        state.teaserShown = true;
        state.teaserPending = false;
        saveState();
        render();
        if (track) {
          trackEvent("bot_teaser_shown", {
            trigger: BOT_TRIGGER,
            deferred,
          });
        }
      };

      const scheduleTeaser = () => {
        clearTeaserTimer();
        if (state.teaserShown || state.teaserDismissed || state.conversationStarted || state.conversationCompleted) {
          render();
          return;
        }

        saveState();
        const remainingDelay = Math.max(0, state.teaserDueAt - Date.now());
        teaserTimer = window.setTimeout(() => {
          if (state.teaserShown || state.teaserDismissed || state.conversationStarted || state.conversationCompleted) return;
          if (!launcherAvailable || document.body.classList.contains("is-lead-modal-open")) {
            state.teaserPending = true;
            saveState();
            return;
          }
          revealTeaser({ track: true });
        }, remainingDelay);
      };

      const isLauncherSectionReached = () => {
        if (!launcherStartSection) return true;
        const headerOffset = header?.getBoundingClientRect().height || 0;
        return launcherStartSection.getBoundingClientRect().top <= headerOffset;
      };

      const syncLauncherAvailability = () => {
        const wasAvailable = launcherAvailable;
        launcherAvailable = isLauncherSectionReached();
        syncVisibility();

        if (!launcherAvailable) {
          clearAttentionTimers();
        } else if (!wasAvailable) {
          scheduleAttentionPulse(BOT_ATTENTION_FIRST_DELAY_MS);
        }

        if (
          launcherAvailable
          && !wasAvailable
          && state.teaserPending
          && !state.teaserShown
          && !state.teaserDismissed
          && !state.conversationStarted
          && !state.conversationCompleted
          && !document.body.classList.contains("is-lead-modal-open")
        ) {
          revealTeaser({ deferred: true, track: true });
        }
      };

      const requestLauncherAvailabilitySync = () => {
        if (launcherVisibilityFrame) return;
        launcherVisibilityFrame = window.requestAnimationFrame(() => {
          launcherVisibilityFrame = 0;
          syncLauncherAvailability();
        });
      };

      const startConversation = (source = "launcher") => {
        if (state.conversationCompleted) return;
        clearTeaserTimer();
        clearAttentionTimers();
        if (!state.conversationStarted) {
          state.conversationStarted = true;
          state.startedAt = new Date().toISOString();
          state.teaserShown = true;
          state.teaserDismissed = true;
          state.entrypoint = source;
        }
        ensureConversationSeed();
        saveState();
      };

      const closePanel = ({ restoreFocus = false, reason = "manual" } = {}) => {
        if (!contactBot.classList.contains("is-open")) return;
        setPanelOpen(false);
        if (state.conversationStarted && !state.conversationCompleted) {
          state.dismissedBeforeSubmit = true;
          saveState();
        }
        trackEvent("bot_dismiss", {
          scope: "panel",
          reason,
          stepId: state.conversationCompleted ? "success" : getActiveStep()?.id || "intro",
        });
        if (restoreFocus) {
          contactBotToggle.focus({ preventScroll: true });
        }
      };

      const openPanel = ({ source = "launcher" } = {}) => {
        const hadAnswers = state.transcript.some((entry) => entry.role === "user");
        state.teaserShown = true;
        state.teaserDismissed = true;
        state.teaserPending = false;
        state.dismissedBeforeSubmit = false;
        if (!state.conversationCompleted) {
          startConversation(source);
        } else {
          saveState();
        }
        setPanelOpen(true);
        render({ focusInput: true });
        trackEvent("bot_open", {
          source,
          resumed: hadAnswers,
          completed: state.conversationCompleted,
        });
      };

      const validateAnswer = (step, rawValue, { skip = false } = {}) => {
        if (!step) {
          return { isValid: false, message: t("leadErrorRequired"), value: "", skipped: false };
        }

        if (step.type === "consent") {
          if (!rawValue) {
            return { isValid: false, message: t("leadErrorRequired"), value: false, skipped: false };
          }
          return { isValid: true, message: "", value: true, skipped: false };
        }

        const normalizedValue = (rawValue ?? "").toString().trim();
        const canSkip = !step.required;
        if ((skip || !normalizedValue) && canSkip) {
          return { isValid: true, message: "", value: "", skipped: true };
        }

        if (step.required && !normalizedValue) {
          return { isValid: false, message: t("leadErrorRequired"), value: "", skipped: false };
        }

        if (step.id === "email" && normalizedValue) {
          const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedValue);
          if (!isValidEmail) {
            return { isValid: false, message: t("leadErrorEmail"), value: normalizedValue, skipped: false };
          }
        }

        if (step.id === "phone" && normalizedValue) {
          const phoneDigits = normalizedValue.replace(/\D/g, "");
          if (phoneDigits.length < 7) {
            return { isValid: false, message: t("leadErrorPhone"), value: normalizedValue, skipped: false };
          }
        }

        if (step.id === "headcount" && normalizedValue) {
          const count = Number(normalizedValue);
          if (!Number.isInteger(count) || count < 1) {
            return { isValid: false, message: t("leadErrorHeadcount"), value: normalizedValue, skipped: false };
          }
          return { isValid: true, message: "", value: String(count), skipped: false };
        }

        if (step.id === "testDayDate" && normalizedValue && normalizedValue < getLocalDateInputValue()) {
          return { isValid: false, message: t("leadErrorDate"), value: normalizedValue, skipped: false };
        }

        return { isValid: true, message: "", value: normalizedValue, skipped: false };
      };

      const submitConversation = async () => {
        if (isSubmitting) return;

        const webhookUrl = getLeadWebhookUrl();
        if (!webhookUrl) {
          submitStatus = "error";
          submitErrorKey = "botWebhookMissing";
          setError("");
          trackEvent("bot_submit_error", { reason: "missing_webhook" });
          render({ focusInput: true });
          return;
        }

        isSubmitting = true;
        submitStatus = "idle";
        submitErrorKey = "";
        setError("");
        render();

        try {
          state.completedAt = new Date().toISOString();
          const payload = buildPayload();
          const response = await fetch(webhookUrl, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
          });

          if (!response.ok) {
            throw new Error(`Webhook status ${response.status}`);
          }

          state.conversationCompleted = true;
          state.dismissedBeforeSubmit = false;
          submitErrorKey = "";
          saveState();
          trackEvent("bot_submit_success", {
            city: payload.lead.city,
            headcount: payload.lead.headcount,
            hasTestDayDate: Boolean(payload.lead.testDayDate),
          });
        } catch (error) {
          console.error("Contact bot submit failed:", error);
          submitStatus = "error";
          submitErrorKey = "botSendFailed";
          setError("");
          trackEvent("bot_submit_error", {
            reason: error instanceof Error ? error.message : "unknown_error",
          });
        } finally {
          isSubmitting = false;
          render({ focusInput: state.conversationCompleted });
        }
      };

      const advanceConversation = async ({ skip = false } = {}) => {
        const activeStep = getActiveStep();
        if (!activeStep || isSubmitting) return;

        const input = fieldSlot.querySelector("[data-contact-bot-input]");
        const rawValue = activeStep.type === "consent"
          ? input instanceof HTMLInputElement && input.type === "checkbox"
            ? input.checked
            : Boolean(state.drafts.consent ?? state.lead.consent)
          : input instanceof HTMLInputElement || input instanceof HTMLTextAreaElement
            ? input.value
            : getCurrentStepValue(activeStep);

        const validation = validateAnswer(activeStep, rawValue, { skip });
        if (!validation.isValid) {
          setError(validation.message);
          if (input instanceof HTMLElement) {
            input.focus({ preventScroll: true });
          }
          return;
        }

        setError("");
        state.lead[activeStep.id] = validation.value;
        delete state.drafts[activeStep.id];

        removeTranscriptAnswer(activeStep.id);
        pushTranscriptEntry({
          role: "user",
          stepId: activeStep.id,
          kind: "answer",
          value: validation.value,
          skipped: validation.skipped,
        });

        trackEvent("bot_step_complete", {
          stepId: activeStep.id,
          index: state.activeStepIndex + 1,
          total: getSteps().length,
          skipped: validation.skipped,
        });

        if (activeStep.id === "consent") {
          saveState();
          render();
          await submitConversation();
          return;
        }

        state.activeStepIndex += 1;
        ensureConversationSeed();
        saveState();
        render({ focusInput: true });
      };

      let state = loadState();
      syncLauncherAvailability();
      render();
      scheduleTeaser();

      teaserAction.addEventListener("click", () => {
        openPanel({ source: "teaser" });
      });

      teaserClose.addEventListener("click", () => {
        state.teaserDismissed = true;
        state.teaserPending = false;
        saveState();
        render();
        scheduleAttentionPulse();
        trackEvent("bot_dismiss", {
          scope: "teaser",
          reason: "close",
        });
      });

      contactBotToggle.addEventListener("click", () => {
        if (contactBot.classList.contains("is-open")) {
          closePanel({ reason: "launcher_toggle" });
          return;
        }
        if (!launcherAvailable) return;
        openPanel({ source: "launcher" });
      });

      panelClose.addEventListener("click", () => {
        closePanel({ restoreFocus: true, reason: "close_button" });
      });

      backdrop.addEventListener("click", () => {
        closePanel({ restoreFocus: true, reason: "backdrop" });
      });

      secondaryButton.addEventListener("click", () => {
        advanceConversation({ skip: true });
      });

      form.addEventListener("submit", (event) => {
        event.preventDefault();
        advanceConversation();
      });

      form.addEventListener("input", (event) => {
        const target = event.target;
        const activeStep = getActiveStep();
        if (!(target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement) || !activeStep) return;

        if (activeStep.type === "consent" && target.type === "checkbox") {
          state.drafts.consent = target.checked;
        } else {
          state.drafts[activeStep.id] = target.value;
        }
        saveState();

        if (errorNode.textContent && submitStatus !== "error") {
          const validation = validateAnswer(
            activeStep,
            activeStep.type === "consent" ? target.checked : target.value,
          );
          if (validation.isValid) {
            setError("");
          }
        }
      });

      form.addEventListener("change", (event) => {
        const target = event.target;
        const activeStep = getActiveStep();
        if (!(target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement) || !activeStep) return;

        if (activeStep.type === "consent" && target.type === "checkbox") {
          state.drafts.consent = target.checked;
        } else {
          state.drafts[activeStep.id] = target.value;
        }
        saveState();
      });

      document.addEventListener("click", (event) => {
        if (!contactBot.classList.contains("is-open")) return;
        const target = event.target;
        if (!(target instanceof Node)) return;
        if (contactBot.contains(target)) return;
        closePanel({ reason: "outside_click" });
      });

      document.addEventListener("keydown", (event) => {
        if (!contactBot.classList.contains("is-open")) return;

        if (event.key === "Escape") {
          event.preventDefault();
          closePanel({ restoreFocus: true, reason: "escape" });
          return;
        }

        if (event.key !== "Tab" || !mobileSheetQuery.matches) return;
        const focusable = getPanelFocusableElements();
        if (!focusable.length) {
          event.preventDefault();
          panel.focus({ preventScroll: true });
          return;
        }

        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        const activeElement = document.activeElement;

        if (!(activeElement instanceof HTMLElement) || !panel.contains(activeElement)) {
          event.preventDefault();
          first.focus({ preventScroll: true });
        } else if (event.shiftKey && activeElement === first) {
          event.preventDefault();
          last.focus({ preventScroll: true });
        } else if (!event.shiftKey && activeElement === last) {
          event.preventDefault();
          first.focus({ preventScroll: true });
        }
      });

      document.addEventListener("pv:lead-modal-open", () => {
        clearAttentionTimers();
        if (contactBot.classList.contains("is-open")) {
          closePanel({ reason: "lead_modal_open" });
        }
      });

      document.addEventListener("pv:lead-modal-close", () => {
        if (
          launcherAvailable
          && state.teaserPending
          && !state.teaserShown
          && !state.teaserDismissed
          && !state.conversationStarted
        ) {
          revealTeaser({ deferred: true, track: true });
        } else {
          render();
          scheduleAttentionPulse();
        }
      });

      document.addEventListener("pv:language-change", () => {
        const shouldRefreshValidation = Boolean(errorNode.textContent) && submitStatus !== "error";
        render();
        if (shouldRefreshValidation) {
          const activeStep = getActiveStep();
          const input = fieldSlot.querySelector("[data-contact-bot-input]");
          if (activeStep && (input instanceof HTMLInputElement || input instanceof HTMLTextAreaElement)) {
            const rawValue = activeStep.type === "consent" && input instanceof HTMLInputElement
              ? input.checked
              : input.value;
            const validation = validateAnswer(activeStep, rawValue);
            setError(validation.isValid ? "" : validation.message);
          }
        }
      });

      mobileSheetQuery.addEventListener("change", () => {
        panel.setAttribute(
          "aria-modal",
          contactBot.classList.contains("is-open") && mobileSheetQuery.matches ? "true" : "false",
        );
        requestLauncherAvailabilitySync();
      });

      reducedMotionQuery.addEventListener("change", () => {
        if (reducedMotionQuery.matches) {
          clearAttentionTimers();
        } else {
          scheduleAttentionPulse(BOT_ATTENTION_FIRST_DELAY_MS);
        }
      });

      document.addEventListener("visibilitychange", () => {
        if (document.visibilityState === "hidden") {
          clearAttentionTimers();
        } else {
          scheduleAttentionPulse(BOT_ATTENTION_FIRST_DELAY_MS);
        }
      });

      window.addEventListener("scroll", requestLauncherAvailabilitySync, { passive: true });
      window.addEventListener("resize", requestLauncherAvailabilitySync);

      window.addEventListener("pagehide", () => {
        clearTeaserTimer();
        clearAttentionTimers();
        window.cancelAnimationFrame(launcherVisibilityFrame);
        document.body.classList.remove("is-contact-bot-open");
      });
    };

    // ==========================================================================
    // Section module: lead capture / contact form
    // ==========================================================================
    /**
     * Initializes the B2B lead form:
     * - multi-step flow,
     * - per-field validation,
     * - webhook submission,
     * - success/error feedback.
     */
    const initLeadCaptureSection = () => {
      const section = document.getElementById("kontakt");
      if (!section) return;

      const modal = section.querySelector("[data-lead-modal]");
      const modalDialog = section.querySelector("[data-lead-modal-dialog]");
      const formPane = section.querySelector(".lead-modal-form-pane");
      const modalCloseButtons = Array.from(section.querySelectorAll("[data-lead-modal-close], .lead-modal-close"));
      const modalTriggers = Array.from(section.querySelectorAll("[data-open-lead-modal]"));
      const form = section.querySelector("[data-lead-form]");
      const successPanel = section.querySelector("[data-lead-success]");
      const nextButton = section.querySelector("[data-lead-next]");
      const prevButton = section.querySelector("[data-lead-prev]");
      const submitButton = section.querySelector("[data-lead-submit]");
      const resetButton = section.querySelector("[data-lead-reset]");
      const feedback = section.querySelector("[data-lead-feedback]");
      const progressBar = section.querySelector("[data-lead-progress-bar]");
      const progressCopy = section.querySelector("[data-lead-progress-copy]");
      const stepPanels = Array.from(section.querySelectorAll("[data-lead-step]"));
      const stepChips = Array.from(section.querySelectorAll("[data-lead-step-chip]"));

      if (!form || !stepPanels.length || !progressBar || !nextButton || !submitButton || !successPanel || !modal || !modalDialog) return;

      const getLeadWebhookUrl = () =>
        (
          section.dataset.leadWebhookUrl
          || section.querySelector("[data-lead-webhook-url]")?.dataset?.leadWebhookUrl
          || document.body?.dataset?.leadWebhookUrl
          || window.PAN_VIKING_WEBHOOK_URL
          || ""
        ).trim();

      const testDayField = form.elements.testDayDate;
      if (testDayField instanceof HTMLInputElement && testDayField.type === "date") {
        testDayField.min = getLocalDateInputValue();
      }

      const totalSteps = stepPanels.length;
      const stepFieldMap = {
        1: ["companyName", "contactPerson", "email", "phone", "city", "headcount"],
        2: ["deliveryAddress", "preferredHours", "testDayDate", "notes", "consent"],
      };
      const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

      let activeStep = 1;
      let isSubmitting = false;
      let lastModalTrigger = null;
      let modalVisibilityTimer = 0;

      const getSubmitLabel = () => t("leadSubmitBase");
      const getModalAnimationDuration = () => (reducedMotionQuery.matches ? 0 : 320);

      const syncLeadModalTriggerState = (isOpen) => {
        modalTriggers.forEach((trigger) => {
          trigger.setAttribute("aria-expanded", isOpen ? "true" : "false");
        });
      };

      const setFeedback = (message = "", type = "") => {
        if (!feedback) return;
        feedback.textContent = message;
        feedback.classList.remove("is-error", "is-success");
        if (type === "error") {
          feedback.classList.add("is-error");
        }
        if (type === "success") {
          feedback.classList.add("is-success");
        }
      };

      const setSubmitting = (nextState) => {
        isSubmitting = nextState;
        submitButton.disabled = nextState;
        form.classList.toggle("is-submitting", nextState);
        submitButton.textContent = nextState ? t("leadSubmitting") : getSubmitLabel();
      };

      const getFieldErrorElement = (field) => {
        if (!field) return null;
        if (field.name === "consent") {
          return form.querySelector(".lead-field-error--consent");
        }
        return field.closest(".lead-field")?.querySelector(".lead-field-error") || null;
      };

      const markFieldState = (field, isInvalid, message = "") => {
        if (!field) return;
        const wrapper = field.name === "consent" ? field.closest(".lead-consent") : field.closest(".lead-field");
        const fieldHasValue = field.type === "checkbox"
          ? field.checked
          : Boolean(typeof field.value === "string" ? field.value.trim() : field.value);

        wrapper?.classList.toggle("is-invalid", isInvalid);
        wrapper?.classList.toggle("is-valid", !isInvalid && fieldHasValue);
        const errorEl = getFieldErrorElement(field);
        if (errorEl) {
          errorEl.textContent = isInvalid ? message : "";
        }
      };

      const validateField = (field) => {
        if (!field) return true;
        const name = field.name;
        const value = typeof field.value === "string" ? field.value.trim() : field.value;

        if (field.required) {
          if (field.type === "checkbox" && !field.checked) {
            markFieldState(field, true, t("leadErrorRequired"));
            return false;
          }
          if (field.type !== "checkbox" && !value) {
            markFieldState(field, true, t("leadErrorRequired"));
            return false;
          }
        }

        if (name === "email" && value) {
          const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
          if (!isValidEmail) {
            markFieldState(field, true, t("leadErrorEmail"));
            return false;
          }
        }

        if (name === "phone" && value) {
          const phoneDigits = value.replace(/\D/g, "");
          if (phoneDigits.length < 7) {
            markFieldState(field, true, t("leadErrorPhone"));
            return false;
          }
        }

        if (name === "headcount" && value) {
          const headcount = Number(value);
          if (!Number.isInteger(headcount) || headcount < 1) {
            markFieldState(field, true, t("leadErrorHeadcount"));
            return false;
          }
        }

        if (name === "testDayDate" && value && value < getLocalDateInputValue()) {
          markFieldState(field, true, t("leadErrorDate"));
          return false;
        }

        markFieldState(field, false, "");
        return true;
      };

      const validateStep = (step) => {
        const fieldNames = stepFieldMap[step] || [];
        let isValid = true;
        let firstInvalidField = null;

        fieldNames.forEach((fieldName) => {
          const field = form.elements[fieldName];
          if (field && !validateField(field)) {
            isValid = false;
            if (!firstInvalidField) {
              firstInvalidField = field;
            }
          }
        });

        if (!isValid) {
          setFeedback(t("leadStepInvalid"), "error");
          if (firstInvalidField instanceof HTMLElement) {
            firstInvalidField.focus({ preventScroll: true });
            firstInvalidField.scrollIntoView({ behavior: "smooth", block: "center" });
          }
        } else {
          setFeedback("", "");
        }

        return isValid;
      };

      const isFieldReadyForNext = (field) => {
        if (!field) return false;
        const value = typeof field.value === "string" ? field.value.trim() : field.value;

        if (field.required && field.type === "checkbox") {
          return field.checked;
        }
        if (field.required && !value) {
          return false;
        }
        if (field.name === "email" && value) {
          return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
        }
        if (field.name === "phone" && value) {
          return value.replace(/\D/g, "").length >= 7;
        }
        if (field.name === "headcount" && value) {
          const count = Number(value);
          return Number.isInteger(count) && count > 0;
        }
        return true;
      };

      const updateNextButtonState = () => {
        if (activeStep !== 1) return;
        const requiredStepOneFields = stepFieldMap[1].map((fieldName) => form.elements[fieldName]).filter(Boolean);
        const ready = requiredStepOneFields.every((field) => isFieldReadyForNext(field));
        nextButton.disabled = !ready;
      };

      const setStep = (stepNumber, { focus = true } = {}) => {
        const safeStep = Math.max(1, Math.min(stepNumber, totalSteps));
        activeStep = safeStep;

        stepPanels.forEach((panel) => {
          const panelStep = Number(panel.dataset.leadStep);
          panel.classList.toggle("is-active", panelStep === safeStep);
        });

        stepChips.forEach((chip) => {
          const chipStep = Number(chip.dataset.leadStepChip);
          const isActive = chipStep === safeStep;
          const isComplete = chipStep < safeStep;
          chip.classList.toggle("is-active", isActive);
          chip.classList.toggle("is-complete", isComplete);
          chip.setAttribute("aria-pressed", isActive ? "true" : "false");
        });

        const progressPercent = (safeStep / totalSteps) * 100;
        progressBar.style.width = `${progressPercent}%`;
        if (progressCopy) {
          progressCopy.textContent = t("leadProgressStep", { step: safeStep, total: totalSteps });
        }

        if (focus) {
          const firstInput = stepPanels
            .find((panel) => Number(panel.dataset.leadStep) === safeStep)
            ?.querySelector("input, textarea, button");
          if (firstInput instanceof HTMLElement) {
            firstInput.focus({ preventScroll: true });
          }
        }
      };

      const getModalFocusableElements = () =>
        Array.from(
          modal.querySelectorAll("a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]):not([type='hidden']), select:not([disabled]), [tabindex]:not([tabindex='-1'])")
        ).filter((element) => (
          element instanceof HTMLElement
          && !element.hidden
          && !element.closest("[hidden]")
          && element.getAttribute("tabindex") !== "-1"
        ));

      const focusLeadModalEntry = () => {
        const activePanel = stepPanels.find((panel) => Number(panel.dataset.leadStep) === activeStep);
        const initialFocus = successPanel.hidden
          ? activePanel?.querySelector("input, textarea, button")
          : resetButton || modalDialog.querySelector(".lead-modal-close");

        if (initialFocus instanceof HTMLElement) {
          initialFocus.focus({ preventScroll: true });
          return;
        }

        modalDialog.focus({ preventScroll: true });
      };

      const getLeadScrollContainer = () => {
        if (window.innerWidth >= 980 && formPane instanceof HTMLElement) {
          return formPane;
        }
        return modalDialog;
      };

      const focusLeadSuccessState = () => {
        const focusTarget = resetButton || successPanel.querySelector("h3") || modalDialog;
        if (focusTarget instanceof HTMLElement) {
          focusTarget.focus({ preventScroll: true });
        }
      };

      const openLeadModal = (trigger = null) => {
        if (!modal.hidden && modal.classList.contains("is-visible")) return;
        window.clearTimeout(modalVisibilityTimer);
        lastModalTrigger = trigger instanceof HTMLElement
          ? trigger
          : document.activeElement instanceof HTMLElement
            ? document.activeElement
            : null;
        modal.hidden = false;
        document.body.classList.add("is-lead-modal-open");
        syncLeadModalTriggerState(true);
        trackEvent("lead_modal_open", {
          source: trigger?.dataset?.leadModalSource || "contact_section",
        });
        if (!getLeadWebhookUrl()) {
          setFeedback(t("leadWebhookUnavailable"), "error");
          trackEvent("lead_webhook_missing", { surface: "lead_modal_open" });
        }
        document.dispatchEvent(new CustomEvent("pv:lead-modal-open"));

        requestAnimationFrame(() => {
          modal.classList.add("is-visible");
          focusLeadModalEntry();
        });
      };

      const closeLeadModal = ({ restoreFocus = true } = {}) => {
        if (modal.hidden || !modal.classList.contains("is-visible")) return;
        window.clearTimeout(modalVisibilityTimer);
        modal.classList.remove("is-visible");
        document.body.classList.remove("is-lead-modal-open");
        syncLeadModalTriggerState(false);
        trackEvent("lead_modal_close", {
          state: successPanel.hidden ? "form" : "success",
        });
        document.dispatchEvent(new CustomEvent("pv:lead-modal-close"));

        modalVisibilityTimer = window.setTimeout(() => {
          if (!modal.classList.contains("is-visible")) {
            modal.hidden = true;
          }
        }, getModalAnimationDuration());

        if (restoreFocus && lastModalTrigger instanceof HTMLElement && lastModalTrigger.isConnected) {
          lastModalTrigger.focus({ preventScroll: true });
        }

        lastModalTrigger = null;
      };

      const buildPayload = () => {
        const formData = new FormData(form);

        return {
          source: "PAN_VIKING_SITE",
          submittedAt: new Date().toISOString(),
          lead: {
            companyName: (formData.get("companyName") || "").toString().trim(),
            contactPerson: (formData.get("contactPerson") || "").toString().trim(),
            email: (formData.get("email") || "").toString().trim(),
            phone: (formData.get("phone") || "").toString().trim(),
            city: (formData.get("city") || "").toString().trim(),
            headcount: Number((formData.get("headcount") || "0").toString()),
            deliveryAddress: (formData.get("deliveryAddress") || "").toString().trim(),
            preferredHours: (formData.get("preferredHours") || "").toString().trim(),
            testDayDate: (formData.get("testDayDate") || "").toString().trim(),
            notes: (formData.get("notes") || "").toString().trim(),
            consent: Boolean(formData.get("consent")),
          },
          meta: {
            page: window.location.href,
            referrer: document.referrer || "",
            userAgent: navigator.userAgent,
            language: document.documentElement.lang || navigator.language || "pl",
          },
        };
      };

      const submitLead = async () => {
        if (isSubmitting) return;
        if (!validateStep(2)) return;

        const leadWebhookUrl = getLeadWebhookUrl();
        if (!leadWebhookUrl) {
          setFeedback(t("leadWebhookUnavailable"), "error");
          trackEvent("lead_submit_error", { reason: "missing_webhook" });
          return;
        }

        const payload = buildPayload();
        setSubmitting(true);
        setFeedback(t("leadSending"), "");

        try {
          const response = await fetch(leadWebhookUrl, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
          });

          if (!response.ok) {
            throw new Error(`Webhook status ${response.status}`);
          }

          setFeedback(t("leadSent"), "success");
          form.hidden = true;
          successPanel.hidden = false;
          trackEvent("lead_submit_success", {
            city: payload.lead.city,
            headcount: payload.lead.headcount,
            hasTestDayDate: Boolean(payload.lead.testDayDate),
          });
          const scrollContainer = getLeadScrollContainer();
          if (scrollContainer instanceof HTMLElement) {
            scrollContainer.scrollTo({
              top: 0,
              behavior: reducedMotionQuery.matches ? "auto" : "smooth",
            });
          }
          requestAnimationFrame(() => {
            focusLeadSuccessState();
          });
        } catch (error) {
          setFeedback(t("leadSendFailed"), "error");
          console.error("Lead submit failed:", error);
        } finally {
          setSubmitting(false);
        }
      };

      const resetLeadFlow = () => {
        form.reset();
        form.hidden = false;
        successPanel.hidden = true;
        setFeedback("", "");
        setStep(1, { focus: !modal.hidden });

        Array.from(form.elements).forEach((field) => {
          if (!(field instanceof HTMLInputElement || field instanceof HTMLTextAreaElement || field instanceof HTMLSelectElement)) return;
          markFieldState(field, false, "");
        });

        updateNextButtonState();
        const scrollContainer = getLeadScrollContainer();
        if (!modal.hidden && scrollContainer instanceof HTMLElement) {
          scrollContainer.scrollTo({
            top: 0,
            behavior: reducedMotionQuery.matches ? "auto" : "smooth",
          });
        }
      };

      modalTriggers.forEach((trigger) => {
        trigger.addEventListener("click", (event) => {
          event.preventDefault();
          openLeadModal(trigger);
        });
      });

      modalCloseButtons.forEach((button) => {
        button.addEventListener("click", () => {
          closeLeadModal();
        });
      });

      nextButton.addEventListener("click", () => {
        if (validateStep(1)) {
          trackEvent("lead_step_complete", { step: 1, nextStep: 2 });
          setStep(2);
        }
      });

      stepChips.forEach((chip) => {
        chip.addEventListener("click", () => {
          const targetStep = Number(chip.dataset.leadStepChip);
          if (!targetStep || targetStep === activeStep) return;
          if (targetStep > activeStep && !validateStep(activeStep)) return;
          setFeedback("", "");
          setStep(targetStep);
        });
      });

      prevButton?.addEventListener("click", () => {
        setFeedback("", "");
        setStep(1);
      });

      resetButton?.addEventListener("click", resetLeadFlow);

      form.addEventListener("submit", (event) => {
        event.preventDefault();
        submitLead();
      });

      form.addEventListener("input", (event) => {
        const target = event.target;
        if (target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement || target instanceof HTMLSelectElement) {
          validateField(target);
          updateNextButtonState();
        }
      });

      form.addEventListener("change", (event) => {
        const target = event.target;
        if (target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement || target instanceof HTMLSelectElement) {
          validateField(target);
          updateNextButtonState();
        }
      });

      form.addEventListener("keydown", (event) => {
        if (event.key !== "Enter" || activeStep !== 1) return;
        const target = event.target;
        if (!(target instanceof HTMLInputElement)) return;
        event.preventDefault();
        if (validateStep(1)) {
          setStep(2);
        }
      });

      document.addEventListener("pv:language-change", () => {
        if (!isSubmitting) {
          submitButton.textContent = getSubmitLabel();
        }
        if (progressCopy) {
          progressCopy.textContent = t("leadProgressStep", { step: activeStep, total: totalSteps });
        }
        Array.from(form.elements).forEach((field) => {
          if (!(field instanceof HTMLInputElement || field instanceof HTMLTextAreaElement || field instanceof HTMLSelectElement)) return;
          const wrapper = field.name === "consent" ? field.closest(".lead-consent") : field.closest(".lead-field");
          if (wrapper?.classList.contains("is-invalid")) {
            validateField(field);
          }
        });
      });

      document.addEventListener("keydown", (event) => {
        if (modal.hidden || !modal.classList.contains("is-visible")) return;

        if (event.key === "Escape") {
          event.preventDefault();
          closeLeadModal();
          return;
        }

        if (event.key !== "Tab") return;
        const focusable = getModalFocusableElements();
        if (!focusable.length) {
          event.preventDefault();
          modalDialog.focus({ preventScroll: true });
          return;
        }

        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        const activeElement = document.activeElement;

        if (!(activeElement instanceof HTMLElement) || !modal.contains(activeElement)) {
          event.preventDefault();
          first.focus({ preventScroll: true });
          return;
        }

        if (event.shiftKey && activeElement === first) {
          event.preventDefault();
          last.focus({ preventScroll: true });
        } else if (!event.shiftKey && activeElement === last) {
          event.preventDefault();
          first.focus({ preventScroll: true });
        }
      });

      syncLeadModalTriggerState(false);
      setStep(1, { focus: false });
      updateNextButtonState();
    };

    // ==========================================================================
    // Section module: process / how it works
    // ==========================================================================
    /**
     * Horizontal "how it works" carousel.
     * Keeps the active card centered and supports drag, arrows, keyboard and wheel stepping.
     */
    const initProcessSection = () => {
      const section = document.getElementById("proces");
      if (!section) return;

      const wrapper = section.querySelector(".flow-wrap");
      const stage = section.querySelector(".flow-stage");
      const sliderViewport = section.querySelector("[data-flow-slider]");
      const sliderTrack = section.querySelector("[data-flow-track]");
      const steps = Array.from(section.querySelectorAll(".flow-slide[data-flow-step]"));
      const progress = section.querySelector("[data-flow-progress]");
      const prevButton = section.querySelector("[data-flow-prev]");
      const nextButton = section.querySelector("[data-flow-next]");
      if (!sliderViewport || !sliderTrack || !steps.length || !progress) return;

      const totalSteps = steps.length;
      const formatStep = (value) => String(value).padStart(2, "0");
      const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
      const finePointerQuery = window.matchMedia("(pointer:fine)");
      let activeIndex = Math.max(0, steps.findIndex((step) => step.classList.contains("is-active")));
      if (activeIndex < 0) activeIndex = 0;
      let scrollFrame = 0;
      let isDragging = false;
      let dragMoved = false;
      let dragStartX = 0;
      let dragStartScrollLeft = 0;
      let wheelLocked = false;
      let hasUserInteracted = false;

      const markInteracted = () => {
        if (hasUserInteracted) return;
        hasUserInteracted = true;
        stage?.classList.add("is-user-engaged");
        nextButton?.classList.remove("is-prompting");
      };

      const syncProgress = () => {
        progress.textContent = `${formatStep(activeIndex + 1)} / ${formatStep(totalSteps)}`;
        if (prevButton) prevButton.disabled = activeIndex === 0;
        if (nextButton) nextButton.disabled = activeIndex === totalSteps - 1;
        if (nextButton) {
          const shouldPrompt = !hasUserInteracted && activeIndex < totalSteps - 1 && !reducedMotionQuery.matches;
          nextButton.classList.toggle("is-prompting", shouldPrompt);
        }
      };

      const syncEdgePadding = () => {
        const firstCard = steps[0];
        const lastCard = steps[steps.length - 1];
        if (!firstCard || !lastCard) return;
        const referenceWidth = Math.max(firstCard.offsetWidth, lastCard.offsetWidth);
        const edgePad = Math.max(20, (sliderViewport.clientWidth - referenceWidth) / 2);
        sliderTrack.style.setProperty("--flow-edge-pad", `${edgePad}px`);
      };

      const getStepCenterScrollLeft = (step) => {
        if (!step) return 0;
        const rawLeft = step.offsetLeft - ((sliderViewport.clientWidth - step.offsetWidth) / 2);
        const maxScroll = Math.max(0, sliderViewport.scrollWidth - sliderViewport.clientWidth);
        return Math.max(0, Math.min(maxScroll, rawLeft));
      };

      const getNearestIndex = () => {
        const viewportCenter = sliderViewport.scrollLeft + (sliderViewport.clientWidth / 2);
        let nearestIndex = 0;
        let nearestDistance = Number.POSITIVE_INFINITY;

        steps.forEach((step, index) => {
          const stepCenter = step.offsetLeft + (step.offsetWidth / 2);
          const distance = Math.abs(stepCenter - viewportCenter);
          if (distance < nearestDistance) {
            nearestDistance = distance;
            nearestIndex = index;
          }
        });

        return nearestIndex;
      };

      const setActiveStep = (nextIndex, options = {}) => {
        const normalizedIndex = Math.max(0, Math.min(totalSteps - 1, nextIndex));
        activeIndex = normalizedIndex;

        steps.forEach((step, index) => {
          const isActive = index === normalizedIndex;
          step.classList.toggle("is-active", isActive);
          step.classList.toggle("is-before", index < normalizedIndex);
          step.classList.toggle("is-after", index > normalizedIndex);
        });

        syncProgress();

        if (options.scroll !== false && steps[normalizedIndex]) {
          sliderViewport.scrollTo({
            left: getStepCenterScrollLeft(steps[normalizedIndex]),
            behavior: options.instant ? "auto" : "smooth",
          });
        }
      };

      const syncActiveFromScroll = () => {
        if (scrollFrame) return;
        scrollFrame = window.requestAnimationFrame(() => {
          scrollFrame = 0;
          const nextIndex = getNearestIndex();
          if (nextIndex !== activeIndex) {
            setActiveStep(nextIndex, { scroll: false });
          }
        });
      };

      const endDrag = () => {
        if (!isDragging) return;
        isDragging = false;
        sliderViewport.classList.remove("is-dragging");
        window.setTimeout(() => {
          dragMoved = false;
        }, 0);
        syncActiveFromScroll();
      };

      steps.forEach((step, index) => {
        step.addEventListener("click", (event) => {
          if (dragMoved) {
            event.preventDefault();
            return;
          }
          markInteracted();
          setActiveStep(index);
        });
        step.addEventListener("keydown", (event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            markInteracted();
            setActiveStep(index);
          }
        });
      });

      sliderViewport.addEventListener("scroll", syncActiveFromScroll, { passive: true });

      sliderViewport.addEventListener("keydown", (event) => {
        if (event.key === "ArrowRight") {
          event.preventDefault();
          markInteracted();
          setActiveStep(activeIndex + 1);
        }
        if (event.key === "ArrowLeft") {
          event.preventDefault();
          markInteracted();
          setActiveStep(activeIndex - 1);
        }
      });

      prevButton?.addEventListener("click", () => {
        markInteracted();
        setActiveStep(activeIndex - 1);
      });
      nextButton?.addEventListener("click", () => {
        markInteracted();
        setActiveStep(activeIndex + 1);
      });

      sliderViewport.addEventListener("pointerdown", (event) => {
        if (event.pointerType === "mouse" && event.button !== 0) return;
        isDragging = true;
        dragMoved = false;
        markInteracted();
        dragStartX = event.clientX;
        dragStartScrollLeft = sliderViewport.scrollLeft;
        sliderViewport.classList.add("is-dragging");
        if (typeof sliderViewport.setPointerCapture === "function") {
          sliderViewport.setPointerCapture(event.pointerId);
        }
      });

      sliderViewport.addEventListener("pointermove", (event) => {
        if (!isDragging) return;
        const deltaX = event.clientX - dragStartX;
        if (Math.abs(deltaX) > 6) {
          dragMoved = true;
        }
        sliderViewport.scrollLeft = dragStartScrollLeft - deltaX;
      });

      sliderViewport.addEventListener("pointerup", (event) => {
        if (typeof sliderViewport.releasePointerCapture === "function" && sliderViewport.hasPointerCapture?.(event.pointerId)) {
          sliderViewport.releasePointerCapture(event.pointerId);
        }
        endDrag();
      });

      sliderViewport.addEventListener("pointercancel", endDrag);
      sliderViewport.addEventListener("lostpointercapture", endDrag);

      stage?.addEventListener(
        "wheel",
        (event) => {
          if (!finePointerQuery.matches) return;
          if (isDragging) return;
          if (Math.abs(event.deltaY) <= Math.abs(event.deltaX) || Math.abs(event.deltaY) < 18) return;

          const rect = section.getBoundingClientRect();
          const viewportHeight = window.innerHeight || document.documentElement.clientHeight || 0;
          const isSectionFocused = rect.top < viewportHeight * 0.72 && rect.bottom > viewportHeight * 0.3;
          if (!isSectionFocused) return;

          const direction = event.deltaY > 0 ? 1 : -1;
          const nextIndex = activeIndex + direction;
          if (nextIndex < 0 || nextIndex > totalSteps - 1) return;

          event.preventDefault();
          if (wheelLocked) return;

          wheelLocked = true;
          markInteracted();
          setActiveStep(nextIndex);
          window.setTimeout(() => {
            wheelLocked = false;
          }, 620);
        },
        { passive: false }
      );

      window.addEventListener("resize", () => {
        syncEdgePadding();
        const nextIndex = getNearestIndex();
        setActiveStep(nextIndex, { scroll: true, instant: true });
      });

      syncEdgePadding();
      syncProgress();
      window.requestAnimationFrame(() => {
        const nextIndex = getNearestIndex();
        if (nextIndex !== activeIndex) {
          setActiveStep(nextIndex, { scroll: true, instant: true });
        } else {
          setActiveStep(activeIndex, { scroll: true, instant: true });
        }
      });

      if (reducedMotionQuery.matches) {
        sliderViewport.style.scrollBehavior = "auto";
      }

      if (wrapper) {
        if ("IntersectionObserver" in window && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
          const processRevealObserver = new IntersectionObserver(
            (entries, observer) => {
              entries.forEach((entry) => {
                if (!entry.isIntersecting) return;
                entry.target.classList.add("is-inview");
                observer.unobserve(entry.target);
              });
            },
            { threshold: 0.18, rootMargin: "0px 0px -10% 0px" }
          );
          processRevealObserver.observe(wrapper);
        } else {
          wrapper.classList.add("is-inview");
        }
      }

      if ("IntersectionObserver" in window) {
        const visibilityObserver = new IntersectionObserver(
          (entries) => {
            const [entry] = entries;
            if (!entry) return;
            if (entry.isIntersecting) {
              syncActiveFromScroll();
            }
          },
          { threshold: 0.4 }
        );
        visibilityObserver.observe(sliderViewport);
      }
    };

    // ==========================================================================
    // Section module: coverage map
    // ==========================================================================
    /**
     * Delivery coverage map.
     * Loads local city + region datasets, manages zoom-to-region interactions and
     * keeps the status/CTA panel synchronized with the active city or region.
     */
    const initCoverageSection = () => {
      const section = document.getElementById("dostawa");
      if (!section) return;

      const sourceUrl = section.dataset.citiesSource || "./data/cities-coverage.json";
      const regionsSourceUrl = section.dataset.regionsSource || "./data/polska-wojewodztwa.geojson";
      const countEls = Array.from(document.querySelectorAll("[data-coverage-count]"));
      const updatedLabel = section.querySelector("[data-coverage-updated]");
      const searchInput = section.querySelector("[data-coverage-search]");
      const clearButton = section.querySelector("[data-coverage-clear]");
      const feedback = section.querySelector("[data-coverage-feedback]");
      const statusCard = section.querySelector("[data-coverage-status]");
      const statusKicker = section.querySelector("[data-coverage-status-kicker]");
      const statusTitle = section.querySelector("[data-coverage-status-title]");
      const statusCopy = section.querySelector("[data-coverage-status-copy]");
      const primaryCta = section.querySelector("[data-coverage-primary-cta]");
      const expansionCta = section.querySelector("[data-coverage-expansion-cta]");
      const map = section.querySelector("[data-coverage-map]");
      const mapScene = section.querySelector("[data-coverage-map-scene]");
      const mapPointsLayer = section.querySelector("[data-coverage-map-points]");
      const mapRegionsLayer = section.querySelector("[data-coverage-map-regions]");
      const mapFallbackShape = section.querySelector("[data-coverage-map-fallback]");
      const mapBackButton = section.querySelector("[data-coverage-map-back]");
      const mapActiveCity = section.querySelector("[data-coverage-map-active-city]");
      const mapActiveRegion = section.querySelector("[data-coverage-map-active-region]");
      const mapHint = section.querySelector("[data-coverage-map-hint]");
      const regionTitle = section.querySelector("[data-coverage-region-title]");
      const regionCount = section.querySelector("[data-coverage-region-count]");
      const regionList = section.querySelector("[data-coverage-region-list]");
      if (!searchInput || !feedback || !updatedLabel || !mapActiveCity || !mapActiveRegion || !regionTitle || !regionCount || !regionList) return;

      const SVG_NS = "http://www.w3.org/2000/svg";
      const MAP_VIEWBOX_WIDTH = 700;
      const MAP_VIEWBOX_HEIGHT = 520;
      const MAP_PADDING = 18;
      const REGION_LABELS = {
        "dolnoslaskie": { pl: "Dolnośląskie", en: "Lower Silesian" },
        "kujawsko-pomorskie": { pl: "Kujawsko-Pomorskie", en: "Kuyavian-Pomeranian" },
        "lubelskie": { pl: "Lubelskie", en: "Lublin" },
        "lubuskie": { pl: "Lubuskie", en: "Lubusz" },
        "lodzkie": { pl: "Łódzkie", en: "Lodz" },
        "malopolskie": { pl: "Małopolskie", en: "Lesser Poland" },
        "mazowieckie": { pl: "Mazowieckie", en: "Masovian" },
        "opolskie": { pl: "Opolskie", en: "Opole" },
        "podkarpackie": { pl: "Podkarpackie", en: "Subcarpathian" },
        "podlaskie": { pl: "Podlaskie", en: "Podlaskie" },
        "pomorskie": { pl: "Pomorskie", en: "Pomeranian" },
        "slaskie": { pl: "Śląskie", en: "Silesian" },
        "swietokrzyskie": { pl: "Świętokrzyskie", en: "Holy Cross" },
        "warminsko-mazurskie": { pl: "Warmińsko-Mazurskie", en: "Warmian-Masurian" },
        "wielkopolskie": { pl: "Wielkopolskie", en: "Greater Poland" },
        "zachodniopomorskie": { pl: "Zachodniopomorskie", en: "West Pomeranian" },
      };

      const state = {
        cities: [],
        cityByKey: new Map(),
        aliasToCityKey: new Map(),
        citiesByRegion: new Map(),
        mapPoints: [],
        mapPointByCityKey: new Map(),
        mapRegions: [],
        mapProjection: null,
        highlights: [],
        updatedAt: null,
        regionFocusKey: "",
        cityPointPositions: new Map(),
        originCityKey: "",
        responseSlaBase: "",
        expansionNoteBase: "",
        responseSla: t("coverageResponseSlaDefault"),
        expansionNote: t("coverageExpansionNoteDefault"),
        mode: "default",
        activeCityKey: "",
        activeRegionKey: "",
        missingLabel: "",
        feedbackKey: "coverageLoading",
        feedbackParams: {},
        feedbackType: "",
        defaultCityKey: "",
        idleCityKey: "",
        idleRotationIndex: 0,
      };
      let coverageSearchTimer = 0;
      let idleRotationTimer = 0;

      // Data normalization + deterministic helpers used across search and fallback point placement.
      const normalize = (value) =>
        value
          .toString()
          .trim()
          .toLowerCase()
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "");

      const normalizeRegionKey = (value) =>
        normalize(value)
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-+|-+$/g, "");

      const hashString = (value) => {
        let hash = 2166136261;
        const input = String(value || "");
        for (let index = 0; index < input.length; index += 1) {
          hash ^= input.charCodeAt(index);
          hash = Math.imul(hash, 16777619);
        }
        return hash >>> 0;
      };

      const nextSeededValue = (seedState) => {
        seedState.value = (Math.imul(seedState.value, 1664525) + 1013904223) >>> 0;
        return seedState.value / 4294967296;
      };

      // Geometry helpers used to project GeoJSON and place markers inside real region shapes.
      const isPointInRing = (point, ring) => {
        let inside = false;
        for (let i = 0, j = ring.length - 1; i < ring.length; j = i, i += 1) {
          const xi = ring[i]?.[0];
          const yi = ring[i]?.[1];
          const xj = ring[j]?.[0];
          const yj = ring[j]?.[1];
          if (![xi, yi, xj, yj].every(Number.isFinite)) continue;
          const intersects = ((yi > point[1]) !== (yj > point[1]))
            && (point[0] < (((xj - xi) * (point[1] - yi)) / ((yj - yi) || Number.EPSILON)) + xi);
          if (intersects) inside = !inside;
        }
        return inside;
      };

      const isPointInPolygon = (point, polygon) => {
        if (!Array.isArray(polygon) || !polygon.length) return false;
        if (!isPointInRing(point, polygon[0])) return false;
        return !polygon.slice(1).some((ring) => isPointInRing(point, ring));
      };

      const isPointInPolygonSet = (point, polygonSet) =>
        Array.isArray(polygonSet) && polygonSet.some((polygon) => isPointInPolygon(point, polygon));

      const formatCopy = (template, params = {}) =>
        (template || "").replace(/\{(\w+)\}/g, (_, key) => `${params[key] ?? ""}`);

      const getStaticCopy = () => I18N_STATIC[currentLang] || I18N_STATIC.pl;

      const resolveRegionLabel = (regionValue) => {
        const key = normalizeRegionKey(regionValue || "");
        const labels = REGION_LABELS[key];
        if (labels) {
          return currentLang === "en" ? labels.en : labels.pl;
        }
        return (regionValue || "").toString().trim() || "-";
      };

      const sortCities = (items) =>
        [...items].sort((a, b) => a.name.localeCompare(b.name, currentLang === "en" ? "en" : "pl"));

      const setCoverageCount = (countValue) => {
        const value = String(countValue);
        countEls.forEach((el) => {
          el.textContent = value;
        });
      };

      const stopIdleRotation = ({ resetPreview = false } = {}) => {
        window.clearInterval(idleRotationTimer);
        idleRotationTimer = 0;
        if (resetPreview) {
          state.idleCityKey = "";
        }
      };

      const getIdleRotationPool = () => state.mapPoints.filter((point) => point.priority === "main");

      const syncIdlePreviewLabel = () => {
        if (state.mode !== "default" || state.regionFocusKey) return;
        const previewPoint = state.mapPoints.find((point) => point.key === state.idleCityKey)
          || getIdleRotationPool()[0]
          || state.mapPoints[0]
          || null;
        state.idleCityKey = previewPoint?.key || "";
        mapActiveCity.textContent = previewPoint?.city || getStaticCopy().coverageMapActiveCityDefault;
        mapActiveRegion.textContent = getStaticCopy().coverageMapActiveRegionDefault;
        renderMapPoints();
      };

      const startIdleRotation = () => {
        stopIdleRotation();
        if (state.mode !== "default" || state.regionFocusKey || searchInput.value.trim()) return;
        const pool = getIdleRotationPool();
        if (!pool.length) return;
        const initialIndex = Math.max(0, pool.findIndex((point) => point.key === state.defaultCityKey));
        state.idleRotationIndex = initialIndex;
        state.idleCityKey = pool[initialIndex]?.key || pool[0].key;
        syncIdlePreviewLabel();
        idleRotationTimer = window.setInterval(() => {
          if (state.mode !== "default" || state.regionFocusKey || searchInput.value.trim()) {
            stopIdleRotation();
            return;
          }
          state.idleRotationIndex = (state.idleRotationIndex + 1) % pool.length;
          state.idleCityKey = pool[state.idleRotationIndex]?.key || pool[0].key;
          syncIdlePreviewLabel();
        }, 2600);
      };

      const getCityRecord = (cityKey) => state.cityByKey.get(normalize(cityKey || "")) || null;

      const getPrimaryPointForRegion = (regionKey) =>
        state.mapPoints.find((point) => point.regionKey === regionKey && point.priority === "main")
        || state.mapPoints.find((point) => point.regionKey === regionKey)
        || null;

      const getRegionCities = (regionKey) => state.citiesByRegion.get(regionKey) || [];

      const getExactMatch = (query) => {
        const key = normalize(query || "");
        if (!key) return null;
        const direct = state.cityByKey.get(key);
        if (direct) return direct;
        const aliasKey = state.aliasToCityKey.get(key);
        return aliasKey ? state.cityByKey.get(aliasKey) || null : null;
      };

      const cityMatchesQuery = (city, query) => {
        const normalizedQuery = normalize(query || "");
        if (!normalizedQuery) return false;
        if (city.key.includes(normalizedQuery)) return true;
        return city.aliasKeys.some((alias) => alias.includes(normalizedQuery));
      };

      const projectGeoToPercent = (lon, lat) => {
        if (!state.mapProjection) return null;
        const numericLon = Number(lon);
        const numericLat = Number(lat);
        if (Number.isNaN(numericLon) || Number.isNaN(numericLat)) return null;
        const { minProjectedLon, maxLat, scale, offsetX, offsetY, cosLatitude } = state.mapProjection;
        const projectedLon = numericLon * cosLatitude;
        const x = offsetX + (projectedLon - minProjectedLon) * scale;
        const y = offsetY + (maxLat - numericLat) * scale;
        return {
          x: Math.min(98.2, Math.max(1.8, (x / MAP_VIEWBOX_WIDTH) * 100)),
          y: Math.min(98.2, Math.max(1.8, (y / MAP_VIEWBOX_HEIGHT) * 100)),
        };
      };

      const collectCoordinates = (node, result) => {
        if (!Array.isArray(node)) return;
        if (node.length >= 2 && typeof node[0] === "number" && typeof node[1] === "number") {
          result.push(node);
          return;
        }
        node.forEach((item) => collectCoordinates(item, result));
      };

      const buildRegionPaths = (features) => {
        const allCoords = [];
        state.mapProjection = null;
        features.forEach((feature) => {
          collectCoordinates(feature?.geometry?.coordinates, allCoords);
        });
        if (!allCoords.length) return [];

        const lons = allCoords.map((coord) => coord[0]);
        const lats = allCoords.map((coord) => coord[1]);
        const minLat = Math.min(...lats);
        const maxLat = Math.max(...lats);
        const meanLat = (minLat + maxLat) / 2;
        const cosLatitude = Math.cos((meanLat * Math.PI) / 180);
        const projectedLons = lons.map((lon) => lon * cosLatitude);
        const minProjectedLon = Math.min(...projectedLons);
        const maxProjectedLon = Math.max(...projectedLons);
        const lonSpan = maxProjectedLon - minProjectedLon;
        const latSpan = maxLat - minLat;
        if (lonSpan <= 0 || latSpan <= 0) return [];

        const innerWidth = MAP_VIEWBOX_WIDTH - MAP_PADDING * 2;
        const innerHeight = MAP_VIEWBOX_HEIGHT - MAP_PADDING * 2;
        const scale = Math.min(innerWidth / lonSpan, innerHeight / latSpan);
        const drawnWidth = lonSpan * scale;
        const drawnHeight = latSpan * scale;
        const offsetX = (MAP_VIEWBOX_WIDTH - drawnWidth) / 2;
        const offsetY = (MAP_VIEWBOX_HEIGHT - drawnHeight) / 2;

        state.mapProjection = {
          minProjectedLon,
          maxLat,
          scale,
          offsetX,
          offsetY,
          cosLatitude,
        };

        const projectPoint = (coord) => {
          if (!Array.isArray(coord) || coord.length < 2) return null;
          const lon = Number(coord[0]);
          const lat = Number(coord[1]);
          if (Number.isNaN(lon) || Number.isNaN(lat)) return null;
          const projectedLon = lon * cosLatitude;
          const x = offsetX + (projectedLon - minProjectedLon) * scale;
          const y = offsetY + (maxLat - lat) * scale;
          return [x, y];
        };

        const formatNum = (value) => Number(value.toFixed(2));
        const ringToPath = (ring) => {
          if (!Array.isArray(ring)) return "";
          const points = ring.map(projectPoint).filter(Boolean);
          if (points.length < 3) return "";
          return `${points
            .map((point, index) => `${index === 0 ? "M" : "L"}${formatNum(point[0])} ${formatNum(point[1])}`)
            .join(" ")} Z`;
        };
        const polygonToPath = (polygon) => (Array.isArray(polygon) ? polygon.map(ringToPath).filter(Boolean).join(" ") : "");
        const normalizeRing = (ring) =>
          (Array.isArray(ring) ? ring : [])
            .map((coord) => [Number(coord?.[0]), Number(coord?.[1])])
            .filter((pair) => Number.isFinite(pair[0]) && Number.isFinite(pair[1]));
        const normalizePolygon = (polygon) =>
          (Array.isArray(polygon) ? polygon : [])
            .map((ring) => normalizeRing(ring))
            .filter((ring) => ring.length >= 3);
        const getGeoBounds = (polygonSet) => {
          let minLon = Number.POSITIVE_INFINITY;
          let maxLon = Number.NEGATIVE_INFINITY;
          let minLat = Number.POSITIVE_INFINITY;
          let maxLat = Number.NEGATIVE_INFINITY;

          (Array.isArray(polygonSet) ? polygonSet : []).forEach((polygon) => {
            (Array.isArray(polygon) ? polygon : []).forEach((ring) => {
              (Array.isArray(ring) ? ring : []).forEach((coord) => {
                const lon = Number(coord?.[0]);
                const lat = Number(coord?.[1]);
                if (!Number.isFinite(lon) || !Number.isFinite(lat)) return;
                if (lon < minLon) minLon = lon;
                if (lon > maxLon) maxLon = lon;
                if (lat < minLat) minLat = lat;
                if (lat > maxLat) maxLat = lat;
              });
            });
          });

          if (![minLon, maxLon, minLat, maxLat].every(Number.isFinite)) return null;
          return { minLon, maxLon, minLat, maxLat };
        };

        return features
          .map((feature, index) => {
            const type = feature?.geometry?.type;
            const geometry = feature?.geometry?.coordinates;
            const rawName = (
              feature?.properties?.name
              || feature?.properties?.NAME_1
              || feature?.properties?.NAME_0
              || ""
            )
              .toString()
              .trim();
            let pathData = "";
            let polygonSet = [];

            if (type === "Polygon") {
              pathData = polygonToPath(geometry);
              const normalized = normalizePolygon(geometry);
              if (normalized.length) polygonSet = [normalized];
            } else if (type === "MultiPolygon" && Array.isArray(geometry)) {
              pathData = geometry.map((polygon) => polygonToPath(polygon)).filter(Boolean).join(" ");
              polygonSet = geometry
                .map((polygon) => normalizePolygon(polygon))
                .filter((polygon) => polygon.length);
            }

            if (!pathData) return null;
            return {
              key: normalizeRegionKey(rawName || `region-${index + 1}`),
              rawName: rawName || `Region ${index + 1}`,
              pathData,
              polygonSet,
              geoBounds: getGeoBounds(polygonSet),
            };
          })
          .filter(Boolean);
      };

      const getRegionMeta = (regionKey) =>
        state.mapRegions.find((region) => region.key === normalizeRegionKey(regionKey || "")) || null;

      const getFallbackGeoForCity = (city) => {
        const region = getRegionMeta(city?.regionKey || "");
        const representative = getPrimaryPointForRegion(city?.regionKey || "");
        const bounds = region?.geoBounds;
        if (!region || !bounds) {
          return representative ? { lon: representative.lon, lat: representative.lat } : null;
        }

        const seed = { value: hashString(`${city.regionKey}:${city.key}`) };
        for (let attempt = 0; attempt < 84; attempt += 1) {
          const lon = bounds.minLon + (bounds.maxLon - bounds.minLon) * nextSeededValue(seed);
          const lat = bounds.minLat + (bounds.maxLat - bounds.minLat) * nextSeededValue(seed);
          if (isPointInPolygonSet([lon, lat], region.polygonSet)) {
            return { lon, lat };
          }
        }

        if (representative) {
          return { lon: representative.lon, lat: representative.lat };
        }

        return {
          lon: (bounds.minLon + bounds.maxLon) / 2,
          lat: (bounds.minLat + bounds.maxLat) / 2,
        };
      };

      const getCityPointPosition = (city) => {
        if (!city) return null;
        const cached = state.cityPointPositions.get(city.key);
        if (cached) return cached;

        const representative = state.mapPointByCityKey.get(city.key) || null;
        const lonCandidate = Number(city.lon ?? representative?.lon);
        const latCandidate = Number(city.lat ?? representative?.lat);
        const hasNativeCoords = Number.isFinite(lonCandidate) && Number.isFinite(latCandidate);
        const geoPoint = hasNativeCoords
          ? { lon: lonCandidate, lat: latCandidate }
          : getFallbackGeoForCity(city);
        const projected = geoPoint ? projectGeoToPercent(geoPoint.lon, geoPoint.lat) : null;
        if (!projected) return null;

        const pointPosition = {
          lon: geoPoint.lon,
          lat: geoPoint.lat,
          x: projected.x,
          y: projected.y,
          generated: !hasNativeCoords,
        };
        state.cityPointPositions.set(city.key, pointPosition);
        return pointPosition;
      };

      const spreadPointPositions = (points, radius = 0.22) => {
        const overlappingGroups = new Map();
        points.forEach((point, index) => {
          const key = `${point.x.toFixed(3)}|${point.y.toFixed(3)}`;
          const bucket = overlappingGroups.get(key) || [];
          bucket.push(index);
          overlappingGroups.set(key, bucket);
        });

        return points.map((point, index) => {
          const group = overlappingGroups.get(`${point.x.toFixed(3)}|${point.y.toFixed(3)}`) || [];
          if (group.length <= 1) return { ...point, order: index };
          const ringIndex = group.indexOf(index);
          const angle = ((Math.PI * 2) / group.length) * ringIndex;
          return {
            ...point,
            order: index,
            x: Math.min(98.5, Math.max(1.5, point.x + Math.cos(angle) * radius)),
            y: Math.min(98.5, Math.max(1.5, point.y + Math.sin(angle) * radius)),
          };
        });
      };

      // UI render helpers for labels, status messaging and region-side panel content.
      const setMapHintDefault = () => {
        if (!mapHint) return;
        if (state.regionFocusKey) {
          mapHint.textContent = t("coverageMapFocusHint", {
            region: resolveRegionLabel(state.regionFocusKey),
          });
          return;
        }
        mapHint.textContent = getStaticCopy().coverageMapHint;
      };

      const setMapLabels = (cityLabel, regionKey) => {
        const copy = getStaticCopy();
        const idlePoint = state.mapPoints.find((point) => point.key === state.idleCityKey) || null;
        mapActiveCity.textContent = cityLabel
          || (state.regionFocusKey && regionKey
            ? copy.coverageMapViewRegionPoints
            : idlePoint?.city || copy.coverageMapActiveCityDefault);
        mapActiveRegion.textContent = regionKey ? resolveRegionLabel(regionKey) : copy.coverageMapActiveRegionDefault;
      };

      const updateMapRegionSelection = (regionKey) => {
        state.mapRegions.forEach((region) => {
          const isRegionActive = Boolean(regionKey) && region.key === regionKey;
          const isRegionFocus = Boolean(state.regionFocusKey) && region.key === state.regionFocusKey;
          region.element.classList.toggle("is-active", isRegionActive);
          region.element.classList.toggle("is-focus", isRegionFocus);
          region.element.classList.toggle("is-muted", Boolean(state.regionFocusKey) && region.key !== state.regionFocusKey);
        });
      };

      const applyMapFocus = () => {
        if (!map || !mapScene) return;

        const focusKey = state.regionFocusKey;
        updateMapRegionSelection(state.activeRegionKey);

        if (!focusKey) {
          map.classList.remove("is-region-focus");
          if (mapBackButton) mapBackButton.hidden = true;
          mapScene.style.setProperty("--map-scale", "1");
          mapScene.style.setProperty("--map-translate-x", "0px");
          mapScene.style.setProperty("--map-translate-y", "0px");
          setMapHintDefault();
          return;
        }

        const region = getRegionMeta(focusKey);
        const bbox = region?.element?.getBBox?.();
        if (!region || !bbox || !bbox.width || !bbox.height) {
          setMapHintDefault();
          return;
        }

        map.classList.add("is-region-focus");
        if (mapBackButton) mapBackButton.hidden = false;

        if (window.innerWidth <= 640) {
          mapScene.style.setProperty("--map-scale", "1");
          mapScene.style.setProperty("--map-translate-x", "0px");
          mapScene.style.setProperty("--map-translate-y", "0px");
          setMapHintDefault();
          return;
        }

        const padding = 54;
        const scale = Math.min(
          4.8,
          MAP_VIEWBOX_WIDTH / (bbox.width + padding),
          MAP_VIEWBOX_HEIGHT / (bbox.height + padding)
        );
        const translateX = (MAP_VIEWBOX_WIDTH / 2) - ((bbox.x + bbox.width / 2) * scale);
        const translateY = (MAP_VIEWBOX_HEIGHT / 2) - ((bbox.y + bbox.height / 2) * scale);

        mapScene.style.setProperty("--map-scale", scale.toFixed(3));
        mapScene.style.setProperty("--map-translate-x", `${translateX.toFixed(2)}px`);
        mapScene.style.setProperty("--map-translate-y", `${translateY.toFixed(2)}px`);
        setMapHintDefault();
      };

      const setFeedbackState = (key, params = {}, type = "") => {
        state.feedbackKey = key;
        state.feedbackParams = params;
        state.feedbackType = type;
        feedback.textContent = t(key, params);
        feedback.classList.remove("is-success", "is-warning");
        if (type === "success") feedback.classList.add("is-success");
        if (type === "warning") feedback.classList.add("is-warning");
      };

      const renderRegionPanel = () => {
        const copy = getStaticCopy();
        const regionKey = state.activeRegionKey;
        if (!regionKey) {
          regionTitle.textContent = copy.coverageRegionTitleDefault;
          regionCount.textContent = "0";
          regionList.innerHTML = `<li><p class="coverage-region-empty">${copy.coverageRegionTitleDefault}</p></li>`;
          return;
        }

        const cities = sortCities(getRegionCities(regionKey));
        regionTitle.textContent = resolveRegionLabel(regionKey);
        regionCount.textContent = String(cities.length);
        regionList.innerHTML = "";

        const fragment = document.createDocumentFragment();
        cities.forEach((city) => {
          const item = document.createElement("li");
          const button = document.createElement("button");
          button.type = "button";
          button.className = "coverage-region-city";
          button.dataset.cityKey = city.key;
          button.textContent = city.name;
          if (state.mode === "match" && state.activeCityKey === city.key) {
            button.classList.add("is-active");
          }
          item.appendChild(button);
          fragment.appendChild(item);
        });
        regionList.appendChild(fragment);
        const activeButton = regionList.querySelector(".coverage-region-city.is-active");
        activeButton?.scrollIntoView?.({ block: "nearest", inline: "nearest" });
      };

      const renderStatus = () => {
        const copy = getStaticCopy();
        const activeCity = getCityRecord(state.activeCityKey);
        const regionKey = state.activeRegionKey || activeCity?.regionKey || "";
        const regionLabel = regionKey ? resolveRegionLabel(regionKey) : copy.coverageRegionTitleDefault;
        const count = regionKey ? getRegionCities(regionKey).length : state.cities.length;

        if (!statusCard || !statusKicker || !statusTitle || !statusCopy || !primaryCta || !expansionCta) return;

        statusCard.dataset.state = state.mode === "missing" ? "miss" : state.mode === "match" ? "match" : "idle";
        primaryCta.hidden = false;
        expansionCta.hidden = false;
        expansionCta.textContent = copy.coverageExpansionCta;

        if (state.mode === "match" && activeCity) {
          statusKicker.textContent = copy.coverageStatusMatchKicker;
          statusTitle.textContent = formatCopy(copy.coverageStatusMatchTitle, { city: activeCity.name });
          statusCopy.textContent = formatCopy(copy.coverageStatusMatchCopy, { city: activeCity.name, region: regionLabel });
          primaryCta.textContent = copy.coveragePrimaryCtaMatched;
          return;
        }

        if (state.mode === "region" && regionKey) {
          statusKicker.textContent = copy.coverageStatusRegionKicker;
          statusTitle.textContent = formatCopy(copy.coverageStatusRegionTitle, { region: regionLabel });
          statusCopy.textContent = formatCopy(copy.coverageStatusRegionCopy, { region: regionLabel, count });
          primaryCta.textContent = copy.coveragePrimaryCta;
          return;
        }

        if (state.mode === "missing") {
          statusKicker.textContent = copy.coverageStatusMissingKicker;
          statusTitle.textContent = formatCopy(copy.coverageStatusMissingTitle, { city: state.missingLabel });
          statusCopy.textContent = formatCopy(copy.coverageStatusMissingCopy, { city: state.missingLabel });
          primaryCta.hidden = true;
          return;
        }

        statusKicker.textContent = copy.coverageStatusDefaultKicker;
        statusTitle.textContent = copy.coverageStatusDefaultTitle;
        statusCopy.textContent = formatCopy(copy.coverageStatusDefaultCopy, { count: state.cities.length });
        primaryCta.textContent = copy.coveragePrimaryCta;
      };

      const trackMatchSelect = (city, source) => {
        if (!city) return;
        trackEvent("coverage_match_select", {
          city: city.name,
          region: city.regionKey,
          source,
        });
      };

      // State transitions triggered by search, marker clicks and region zoom mode.
      const applyActiveState = ({ cityKey = "", regionKey = "", cityLabel = "" }) => {
        const point = cityKey ? state.mapPointByCityKey.get(cityKey) || null : getPrimaryPointForRegion(regionKey);
        setMapLabels(cityLabel || (state.regionFocusKey && regionKey ? "" : point?.city || ""), regionKey);
        renderRegionPanel();
        renderMapPoints();
        applyMapFocus();
      };

      const resetDefaultState = ({ clearInput = false } = {}) => {
        state.mode = "default";
        state.activeCityKey = "";
        state.activeRegionKey = "";
        state.regionFocusKey = "";
        state.missingLabel = "";
        if (clearInput) searchInput.value = "";
        if (clearButton) clearButton.hidden = !searchInput.value.trim();
        setFeedbackState("coverageDefault", { count: state.cities.length, sla: state.responseSla });
        renderStatus();
        applyActiveState({ cityKey: "", regionKey: "", cityLabel: "" });
        startIdleRotation();
        setMapHintDefault();
      };

      const selectCity = (city, {
        source = "direct",
        track = false,
        fillInput = true,
        focusRegion = true,
      } = {}) => {
        if (!city) return;
        stopIdleRotation({ resetPreview: true });
        state.mode = "match";
        state.activeCityKey = city.key;
        state.activeRegionKey = city.regionKey;
        state.regionFocusKey = focusRegion ? city.regionKey : "";
        state.missingLabel = "";
        if (fillInput) searchInput.value = city.name;
        if (clearButton) clearButton.hidden = !searchInput.value.trim();
        setFeedbackState("coverageMatchExact", { city: city.name }, "success");
        renderStatus();
        applyActiveState({
          cityKey: city.key,
          regionKey: city.regionKey,
          cityLabel: city.name,
        });
        setMapHintDefault();
        if (track) trackMatchSelect(city, source);
      };

      const selectRegion = (regionKey, { source = "map_region", focusRegion = true } = {}) => {
        if (!regionKey) {
          resetDefaultState({ clearInput: true });
          return;
        }
        stopIdleRotation({ resetPreview: true });
        state.mode = "region";
        state.activeCityKey = "";
        state.activeRegionKey = regionKey;
        state.regionFocusKey = focusRegion ? regionKey : "";
        state.missingLabel = "";
        searchInput.value = "";
        if (clearButton) clearButton.hidden = true;
        setFeedbackState("coverageRegionSelected", {
          region: resolveRegionLabel(regionKey),
          count: getRegionCities(regionKey).length,
        }, "success");
        renderStatus();
        applyActiveState({
          cityKey: "",
          regionKey,
          cityLabel: getPrimaryPointForRegion(regionKey)?.city || "",
        });
        setMapHintDefault();
      };

      const setMissingState = (rawLabel) => {
        stopIdleRotation({ resetPreview: true });
        state.mode = "missing";
        state.activeCityKey = "";
        state.activeRegionKey = "";
        state.regionFocusKey = "";
        state.missingLabel = rawLabel;
        if (clearButton) clearButton.hidden = !searchInput.value.trim();
        setFeedbackState("coverageNoMatch", { query: rawLabel, note: state.expansionNote }, "warning");
        renderStatus();
        applyActiveState({ cityKey: "", regionKey: "", cityLabel: rawLabel });
        setMapLabels(rawLabel, "");
        setMapHintDefault();
      };

      const previewQuery = (rawQuery) => {
        const query = rawQuery.trim();
        if (clearButton) clearButton.hidden = !query;
        if (!query) {
          resetDefaultState();
          return;
        }

        stopIdleRotation({ resetPreview: true });

        const exact = getExactMatch(query);
        if (exact) {
          selectCity(exact, { source: "input_exact", track: false, fillInput: false, focusRegion: false });
          return;
        }

        const matches = state.cities.filter((city) => cityMatchesQuery(city, query));
        if (matches.length) {
          const uniqueRegions = [...new Set(matches.map((city) => city.regionKey))];
          const resolvedRegion = uniqueRegions.length === 1 ? uniqueRegions[0] : "";
          const representativePoint = resolvedRegion ? getPrimaryPointForRegion(resolvedRegion) : null;
          state.mode = resolvedRegion ? "region" : "default";
          state.activeCityKey = "";
          state.activeRegionKey = resolvedRegion;
          state.regionFocusKey = "";
          state.missingLabel = "";
          setFeedbackState("coverageMatchMany", { count: matches.length, query }, "success");
          renderStatus();
          applyActiveState({
            cityKey: "",
            regionKey: resolvedRegion,
            cityLabel: representativePoint?.city || "",
          });
          setMapHintDefault();
          return;
        }

        setMissingState(query);
      };

      const renderMapPoints = () => {
        if (!mapPointsLayer || !state.mapProjection) return;
        mapPointsLayer.innerHTML = "";
        const nationalView = !state.regionFocusKey;
        const basePoints = nationalView
          ? state.mapPoints
            .map((point) => {
              const projected = projectGeoToPercent(point.lon, point.lat);
              if (!projected) return null;
              return {
                city: point.city,
                key: point.key,
                regionKey: point.regionKey,
                priority: point.priority,
                x: projected.x,
                y: projected.y,
                generated: false,
                isOrigin: point.key === state.originCityKey,
                isActive: state.mode === "default"
                  ? point.key === state.idleCityKey
                  : state.activeCityKey
                  ? point.key === state.activeCityKey
                    || (!state.mapPointByCityKey.has(state.activeCityKey) && point.regionKey === state.activeRegionKey && point.priority === "main")
                  : Boolean(state.activeRegionKey) && point.regionKey === state.activeRegionKey && point.priority === "main",
              };
            })
            .filter(Boolean)
          : sortCities(getRegionCities(state.regionFocusKey))
            .map((city) => {
              const position = getCityPointPosition(city);
              if (!position) return null;
              return {
                city: city.name,
                key: city.key,
                regionKey: city.regionKey,
                priority: "region",
                x: position.x,
                y: position.y,
                generated: position.generated,
                isOrigin: city.key === state.originCityKey,
                isActive: city.key === state.activeCityKey,
              };
            })
            .filter(Boolean);

        const finalPositions = spreadPointPositions(basePoints, nationalView ? 0.26 : 0.16);
        const fragment = document.createDocumentFragment();
        finalPositions.forEach((point, index) => {
          const button = document.createElement("button");
          button.type = "button";
          button.className = "coverage-map-point";
          if (!state.regionFocusKey) {
            button.classList.add(point.priority === "main" ? "is-main" : "is-secondary");
          } else {
            button.classList.add("is-region-city");
          }
          if (point.isOrigin) button.classList.add("is-origin");
          if (point.generated && state.regionFocusKey) button.classList.add("is-generated");
          if (point.isActive) button.classList.add("is-active");
          button.dataset.city = point.city;
          button.dataset.cityKey = point.key;
          button.dataset.region = point.regionKey;
          button.style.setProperty("--x", point.x);
          button.style.setProperty("--y", point.y);
          button.style.setProperty("--point-order", String(index));
          button.setAttribute("aria-label", point.isOrigin ? `${point.city} - ${getStaticCopy().coverageMapOrigin}` : point.city);
          if (point.isOrigin) {
            button.innerHTML = '<span class="coverage-map-point-heart" aria-hidden="true">&#10084;</span>';
          }
          fragment.appendChild(button);
        });
        mapPointsLayer.appendChild(fragment);
      };

      const renderMapRegions = (geoJson) => {
        if (!mapRegionsLayer) return;
        const features = Array.isArray(geoJson?.features) ? geoJson.features : [];
        const regions = buildRegionPaths(features);

        mapRegionsLayer.innerHTML = "";
        state.mapRegions = [];
        if (!regions.length) {
          if (mapFallbackShape) mapFallbackShape.classList.remove("is-hidden");
          return;
        }

        const fragment = document.createDocumentFragment();
        regions.forEach((region) => {
          const path = document.createElementNS(SVG_NS, "path");
          path.classList.add("coverage-map-region");
          path.setAttribute("d", region.pathData);
          path.dataset.region = region.key;
          path.dataset.regionName = region.rawName;
          path.setAttribute("tabindex", "0");
          path.setAttribute("role", "button");
          path.setAttribute("aria-label", resolveRegionLabel(region.key));
          fragment.appendChild(path);
          state.mapRegions.push({
            key: region.key,
            rawName: region.rawName,
            element: path,
            polygonSet: region.polygonSet,
            geoBounds: region.geoBounds,
          });
        });
        mapRegionsLayer.appendChild(fragment);
        if (mapFallbackShape) mapFallbackShape.classList.add("is-hidden");
        state.cityPointPositions.clear();
        renderMapPoints();
      };

      const hydrateFromPayload = (payload) => {
        const payloadCities = Array.isArray(payload?.cities) ? payload.cities : [];
        const parsedCities = payloadCities
          .map((entry) => {
            if (typeof entry === "string") return null;
            const name = (entry?.name || entry?.city || entry?.label || "").toString().trim();
            const regionKey = normalizeRegionKey(entry?.regionKey || entry?.region || entry?.voivodeship || "");
            if (!name || !regionKey) return null;
            const aliases = Array.isArray(entry?.aliases)
              ? entry.aliases.map((alias) => alias.toString().trim()).filter(Boolean)
              : [];
            const key = normalize(name);
            const lon = Number(entry?.lon ?? entry?.lng);
            const lat = Number(entry?.lat);
            return {
              name,
              key,
              regionKey,
              aliases,
              aliasKeys: aliases.map((alias) => normalize(alias)),
              lon: Number.isFinite(lon) ? lon : null,
              lat: Number.isFinite(lat) ? lat : null,
            };
          })
          .filter(Boolean);

        state.cities = sortCities(parsedCities);
        state.cityByKey.clear();
        state.aliasToCityKey.clear();
        state.citiesByRegion.clear();
        state.cityPointPositions.clear();

        state.cities.forEach((city) => {
          state.cityByKey.set(city.key, city);
          city.aliasKeys.forEach((alias) => state.aliasToCityKey.set(alias, city.key));
          const bucket = state.citiesByRegion.get(city.regionKey) || [];
          bucket.push(city);
          state.citiesByRegion.set(city.regionKey, bucket);
        });

        state.highlights = Array.isArray(payload?.highlights)
          ? payload.highlights.map((city) => city.toString().trim()).filter(Boolean)
          : state.cities.slice(0, 10).map((city) => city.name);
        state.mapPoints = (Array.isArray(payload?.mapPoints) ? payload.mapPoints : [])
          .map((entry) => {
            const city = (entry?.city || "").toString().trim();
            const record = getCityRecord(city);
            const regionKey = normalizeRegionKey(entry?.regionKey || record?.regionKey || "");
            const lon = Number(entry?.lon ?? entry?.lng);
            const lat = Number(entry?.lat);
            if (!record || !regionKey || !Number.isFinite(lon) || !Number.isFinite(lat)) return null;
            return {
              city: record.name,
              key: record.key,
              regionKey,
              lon,
              lat,
              priority: (entry?.priority || "").toString().trim().toLowerCase() === "main" ? "main" : "secondary",
            };
          })
          .filter(Boolean);
        state.mapPointByCityKey.clear();
        state.mapPoints.forEach((point) => {
          state.mapPointByCityKey.set(point.key, point);
        });

        state.defaultCityKey = getCityRecord("Warszawa")?.key
          || state.mapPoints.find((point) => point.priority === "main")?.key
          || state.cities[0]?.key
          || "";
        state.originCityKey = getCityRecord("Bialystok")?.key || getCityRecord("Bialystok")?.key || "";
        state.updatedAt = payload?.meta?.updatedAt ? new Date(payload.meta.updatedAt) : null;
        state.responseSlaBase = ((payload?.meta?.responseSla || "").toString().trim() || t("coverageResponseSlaDefault"));
        state.expansionNoteBase = ((payload?.meta?.expansionNote || "").toString().trim() || t("coverageExpansionNoteDefault"));
        state.responseSla = currentLang === "en"
          ? t("coverageResponseSlaDefault")
          : state.responseSlaBase;
        state.expansionNote = currentLang === "en"
          ? t("coverageExpansionNoteDefault")
          : state.expansionNoteBase;

        if (state.updatedAt && !Number.isNaN(state.updatedAt.getTime())) {
          updatedLabel.textContent = `${t("coverageUpdatedPrefix")}${state.updatedAt.toLocaleDateString(t("dateLocale"))}`;
        } else {
          updatedLabel.textContent = t("coverageUpdatedMissing");
        }

        setCoverageCount(state.cities.length);
      };

      // Bootstrap helpers: fetch local JSON payloads and hydrate runtime state.
      const loadJson = (url, cache = "no-store") =>
        fetch(url, { cache }).then((response) => {
          if (!response.ok) throw new Error(`HTTP ${response.status} for ${url}`);
          return response.json();
        });

      searchInput.addEventListener("input", () => {
        previewQuery(searchInput.value);
        window.clearTimeout(coverageSearchTimer);
        coverageSearchTimer = window.setTimeout(() => {
          const rawQuery = searchInput.value.trim();
          if (rawQuery.length < 2) return;
          const matches = state.cities.filter((city) => cityMatchesQuery(city, rawQuery));
          trackEvent("coverage_search", {
            query: rawQuery,
            resultCount: matches.length,
            hasExactMatch: Boolean(getExactMatch(rawQuery)),
          });
        }, 650);
      });

      searchInput.addEventListener("focus", () => {
        stopIdleRotation();
      });

      searchInput.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
          if (searchInput.value.trim()) {
            searchInput.value = "";
            resetDefaultState({ clearInput: true });
          } else if (state.regionFocusKey) {
            state.regionFocusKey = "";
            applyActiveState({
              cityKey: state.activeCityKey,
              regionKey: state.activeRegionKey,
              cityLabel: state.mode === "match" ? getCityRecord(state.activeCityKey)?.name || "" : "",
            });
          }
          return;
        }

        if (event.key === "Enter") {
          const exact = getExactMatch(searchInput.value.trim());
          if (exact) {
            event.preventDefault();
            selectCity(exact, { source: "keyboard_enter", track: true, fillInput: true });
          }
        }
      });

      clearButton?.addEventListener("click", () => {
        searchInput.value = "";
        resetDefaultState({ clearInput: true });
        searchInput.focus({ preventScroll: true });
      });

      regionList.addEventListener("click", (event) => {
        const target = event.target;
        if (!(target instanceof HTMLElement)) return;
        const button = target.closest(".coverage-region-city[data-city-key]");
        if (!button) return;
        const city = getCityRecord(button.dataset.cityKey || "");
        if (!city) return;
        selectCity(city, { source: "region_panel", track: true, fillInput: true });
      });

      mapPointsLayer?.addEventListener("click", (event) => {
        const target = event.target;
        if (!(target instanceof HTMLElement)) return;
        const point = target.closest(".coverage-map-point[data-city-key]");
        if (!point) return;
        const city = getCityRecord(point.dataset.cityKey || "");
        if (!city) return;
        selectCity(city, { source: "map_point", track: true, fillInput: true });
      });

      map?.addEventListener("pointerenter", () => {
        stopIdleRotation();
      });

      if (mapRegionsLayer) {
        const getRegionPath = (event) => {
          const target = event.target;
          if (!(target instanceof SVGElement)) return null;
          return target.closest(".coverage-map-region");
        };

        mapRegionsLayer.addEventListener("mouseover", (event) => {
          stopIdleRotation();
          const path = getRegionPath(event);
          if (!path || !mapHint) return;
          mapHint.textContent = t("coverageMapRegionHover", {
            region: resolveRegionLabel(path.dataset.region || path.dataset.regionName || ""),
          });
        });

        mapRegionsLayer.addEventListener("mouseleave", () => {
          setMapHintDefault();
        });

        mapRegionsLayer.addEventListener("focusin", (event) => {
          stopIdleRotation();
          const path = getRegionPath(event);
          if (!path || !mapHint) return;
          mapHint.textContent = t("coverageMapRegionHover", {
            region: resolveRegionLabel(path.dataset.region || path.dataset.regionName || ""),
          });
        });

        mapRegionsLayer.addEventListener("click", (event) => {
          const path = getRegionPath(event);
          if (!path) return;
          selectRegion(normalizeRegionKey(path.dataset.region || path.dataset.regionName || ""));
        });

        mapRegionsLayer.addEventListener("keydown", (event) => {
          const path = getRegionPath(event);
          if (!path) return;
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            selectRegion(normalizeRegionKey(path.dataset.region || path.dataset.regionName || ""));
          }
        });
      }

      mapBackButton?.addEventListener("click", () => {
        state.regionFocusKey = "";
        applyActiveState({
          cityKey: state.activeCityKey,
          regionKey: state.activeRegionKey,
          cityLabel: state.mode === "match" ? getCityRecord(state.activeCityKey)?.name || "" : "",
        });
      });

      expansionCta?.addEventListener("click", () => {
        trackEvent("coverage_expansion_cta_click", {
          query: state.missingLabel || searchInput.value.trim(),
        });
      });

      document.addEventListener("keydown", (event) => {
        if (event.key !== "Escape" || !state.regionFocusKey) return;
        const activeElement = document.activeElement;
        if (activeElement === searchInput && searchInput.value.trim()) return;
        state.regionFocusKey = "";
        applyActiveState({
          cityKey: state.activeCityKey,
          regionKey: state.activeRegionKey,
          cityLabel: state.mode === "match" ? getCityRecord(state.activeCityKey)?.name || "" : "",
        });
      });

      setFeedbackState("coverageLoading");
      Promise.allSettled([
        loadJson(sourceUrl, "no-store"),
        loadJson(regionsSourceUrl, "force-cache"),
      ])
        .then(([payloadResult, regionsResult]) => {
          if (payloadResult.status !== "fulfilled") {
            throw payloadResult.reason;
          }

          hydrateFromPayload(payloadResult.value);

          if (regionsResult.status === "fulfilled") {
            renderMapRegions(regionsResult.value);
          } else {
            console.error("Coverage regions load failed:", regionsResult.reason);
            if (mapFallbackShape) mapFallbackShape.classList.remove("is-hidden");
          }

          resetDefaultState({ clearInput: true });
        })
        .catch((error) => {
          console.error("Coverage data load failed:", error);
          updatedLabel.textContent = t("coverageUpdatedError");
          setCoverageCount(0);
          setFeedbackState("coverageJsonError", {}, "warning");
          if (mapPointsLayer) mapPointsLayer.innerHTML = "";
          if (regionList) {
            regionList.innerHTML = `<li><p class="coverage-region-empty">${t("coverageEmpty")}</p></li>`;
          }
          setMapLabels("", "");
        });

      document.addEventListener("pv:language-change", () => {
        state.responseSla = currentLang === "en"
          ? t("coverageResponseSlaDefault")
          : (state.responseSlaBase || t("coverageResponseSlaDefault"));
        state.expansionNote = currentLang === "en"
          ? t("coverageExpansionNoteDefault")
          : (state.expansionNoteBase || t("coverageExpansionNoteDefault"));
        if (state.updatedAt && !Number.isNaN(state.updatedAt.getTime())) {
          updatedLabel.textContent = `${t("coverageUpdatedPrefix")}${state.updatedAt.toLocaleDateString(t("dateLocale"))}`;
        } else {
          updatedLabel.textContent = t("coverageUpdatedMissing");
        }

        state.mapRegions.forEach((region) => {
          region.element.setAttribute("aria-label", resolveRegionLabel(region.key));
        });

        renderStatus();
        setFeedbackState(state.feedbackKey, state.feedbackParams, state.feedbackType);
        applyActiveState({
          cityKey: state.activeCityKey,
          regionKey: state.activeRegionKey,
          cityLabel: state.mode === "match" ? getCityRecord(state.activeCityKey)?.name || "" : state.missingLabel,
        });
      });
    };

    // ==========================================================================
    // Section module: FAQ
    // ==========================================================================
    /**
     * Compact FAQ accordion with a single master "show/hide" button for the whole block.
     */
    const initFaqSection = () => {
      const section = document.getElementById("faq");
      if (!section) return;

      const faqRoot = section.querySelector("[data-faq-root]");
      const toggleButton = section.querySelector("[data-faq-toggle]");
      if (!faqRoot || !toggleButton) return;

      const items = Array.from(faqRoot.querySelectorAll("details.faq-item"));
      const getToggleLabel = (expanded) => {
        const key = expanded ? "faqToggleHide" : "faqToggleShow";
        const localized = t(key);
        if (localized !== key) return localized;
        return expanded
          ? (currentLang === "en" ? "Hide" : "Ukryj")
          : (currentLang === "en" ? "Show" : "Pokaż");
      };
      const syncToggle = () => {
        const isExpanded = !faqRoot.hidden;
        toggleButton.setAttribute("aria-expanded", isExpanded ? "true" : "false");
        toggleButton.textContent = getToggleLabel(isExpanded);
      };

      items.forEach((item) => {
        item.addEventListener("toggle", () => {
          if (!item.open) return;
          items.forEach((other) => {
            if (other !== item) {
              other.open = false;
            }
          });
        });
      });

      toggleButton.addEventListener("click", () => {
        const shouldExpand = faqRoot.hidden;
        faqRoot.hidden = !shouldExpand;
        if (!shouldExpand) {
          items.forEach((item) => {
            item.open = false;
          });
        }
        syncToggle();
      });

      document.addEventListener("pv:language-change", syncToggle);
      syncToggle();
    };

    // ==========================================================================
    // Section module: weekly menu
    // ==========================================================================
    /**
     * Weekly menu preview:
     * - day switching,
     * - category filters,
     * - responsive card rendering,
     * - modal with full dish details.
     */
    const initMenuSection = () => {
      const section = document.getElementById("menu");
      if (!section) return;

      const sourceUrl = section.dataset.menuSource || "./data/menu-week.json";
      const grid = section.querySelector("[data-menu-grid]");
      const filtersWrap = section.querySelector("[data-menu-filters]");
      const daysWrap = section.querySelector("[data-menu-days]");
      const emptyState = section.querySelector("[data-menu-empty]");
      const visibleCount = section.querySelector("[data-menu-visible-count]");
      const syncLabel = section.querySelector("[data-menu-sync]");
      const modal = section.querySelector("[data-menu-modal]");
      const modalImage = section.querySelector("[data-menu-modal-image]");
      const modalTitle = section.querySelector("[data-menu-modal-title]");
      const modalBadges = section.querySelector("[data-menu-modal-badges]");
      const modalPrice = section.querySelector("[data-menu-modal-price]");
      const modalDescription = section.querySelector("[data-menu-modal-desc]");
      const modalMacros = section.querySelector("[data-menu-modal-macros]");
      const modalIngredientsTitle = section.querySelector("[data-menu-modal-ingredients-title]");
      const modalIngredients = section.querySelector("[data-menu-modal-ingredients]");
      const modalCloseButtons = Array.from(section.querySelectorAll("[data-menu-modal-close]"));
      if (!grid || !filtersWrap || !daysWrap || !emptyState || !modal || !modalImage || !modalTitle || !modalBadges || !modalPrice || !modalDescription || !modalMacros || !modalIngredientsTitle || !modalIngredients || !modalCloseButtons.length) return;

      const dayNamesFallback = {
        pon: { pl: "Poniedzialek", en: "Monday", plShort: "Pon", enShort: "Mon" },
        wt: { pl: "Wtorek", en: "Tuesday", plShort: "Wt", enShort: "Tue" },
        sr: { pl: "Sroda", en: "Wednesday", plShort: "Sr", enShort: "Wed" },
        czw: { pl: "Czwartek", en: "Thursday", plShort: "Czw", enShort: "Thu" },
        pt: { pl: "Piatek", en: "Friday", plShort: "Pt", enShort: "Fri" },
      };
      const dayOrderFallback = Object.keys(dayNamesFallback);
      let cards = [];
      let menuData = {
        meta: {},
        days: [],
        categories: [],
        dishes: [],
      };
      let dayOrder = [...dayOrderFallback];
      let activeDay = dayOrder[0];
      let activeFilter = "all";
      let menuLoadError = false;
      let activeModalDishKey = "";
      let lastModalTrigger = null;

      // Fallbacks + localization helpers keep the section resilient to partial JSON data.
      const safeArray = (value) => (Array.isArray(value) ? value : []);
      const normalizeDay = (token) => String(token || "").trim().toLowerCase();
      const getLocalizedFallbackDay = (dayId) => {
        const entry = dayNamesFallback[dayId];
        if (!entry) return dayId.toUpperCase();
        return currentLang === "en" ? entry.en : entry.pl;
      };
      const getLocalizedFallbackShortDay = (dayId) => {
        const entry = dayNamesFallback[dayId];
        if (!entry) return dayId.toUpperCase();
        return currentLang === "en" ? entry.enShort : entry.plShort;
      };

      const setMenuSync = (text) => {
        if (syncLabel) {
          syncLabel.textContent = text;
        }
      };

      const parseCurrency = () => {
        const currency = (menuData.meta?.currency || "zl").toString().trim();
        return currency || "zl";
      };

      const formatPrice = (price) => {
        const currency = parseCurrency();
        const numeric = Number(price);
        if (!Number.isFinite(numeric)) {
          return `-- ${currency}`;
        }
        const needsDecimals = Math.abs(numeric % 1) > 0.001;
        return `${needsDecimals ? numeric.toFixed(2) : String(Math.trunc(numeric))} ${currency}`;
      };

      const resolveCategoryLabel = (categoryId) => {
        const category = safeArray(menuData.categories).find((entry) => (entry?.id || "").toString().trim() === (categoryId || "").toString().trim());
        return (currentLang === "en" ? category?.labelEn : category?.label) || category?.label || category?.labelEn || "";
      };

      const getLocalizedDishData = (dish) => {
        const name = (currentLang === "en" ? dish?.nameEn : dish?.name) || dish?.name || dish?.nameEn || t("menuDishFallbackName");
        const description = (currentLang === "en" ? dish?.descriptionEn : dish?.description) || dish?.description || dish?.descriptionEn || t("menuDishFallbackDescription");
        const imageAlt = (currentLang === "en" ? dish?.imageAltEn : dish?.imageAlt) || dish?.imageAlt || dish?.imageAltEn || name || t("menuDishFallbackAlt");
        const ingredients = currentLang === "en"
          ? (safeArray(dish?.ingredientsEn).filter(Boolean).length ? safeArray(dish?.ingredientsEn).filter(Boolean) : safeArray(dish?.ingredients).filter(Boolean))
          : safeArray(dish?.ingredients).filter(Boolean);
        return {
          name: String(name),
          description: String(description),
          imageAlt: String(imageAlt),
          ingredients,
          ingredientsText: ingredients.length ? ingredients.join(", ") : t("menuIngredientsEmpty"),
          categoryLabel: resolveCategoryLabel(dish?.category),
        };
      };

      const resolveDaysWithDates = (dayIds) => {
        return dayIds.map((dayId) => {
          const dayInfo = safeArray(menuData.days).find((entry) => normalizeDay(entry.id) === dayId);
          const preferredLabel = currentLang === "en" ? dayInfo?.labelEn : dayInfo?.label;
          const fallbackLabel = dayInfo?.label || getLocalizedFallbackDay(dayId);
          const preferredShort = currentLang === "en" ? dayInfo?.shortLabelEn : dayInfo?.shortLabel;
          const fallbackShort = dayInfo?.shortLabel || getLocalizedFallbackShortDay(dayId);
          return {
            id: dayId,
            label: preferredLabel || fallbackLabel,
            shortLabel: preferredShort || fallbackShort,
          };
        });
      };

      const resolveTodayDayId = (days) => {
        const safeDays = days.length ? days : dayOrderFallback;
        const dayIndex = new Date().getDay();
        if (dayIndex >= 1 && dayIndex <= 5) {
          const mondayMapId = dayOrderFallback[dayIndex - 1];
          if (safeDays.includes(mondayMapId)) {
            return mondayMapId;
          }
          return safeDays[Math.min(dayIndex - 1, safeDays.length - 1)];
        }
        return safeDays[0];
      };

      const getCardDays = (card) =>
        (card.dataset.menuDay || "")
          .split(",")
          .map((token) => token.trim().toLowerCase())
          .filter(Boolean);

      const getVisibleCount = () => cards.reduce((sum, card) => sum + (card.classList.contains("is-hidden") ? 0 : 1), 0);

      const syncDayUi = () => {
        const dayButtons = Array.from(daysWrap.querySelectorAll(".menu-day[data-menu-day]"));
        dayButtons.forEach((button) => {
          const isActive = button.dataset.menuDay === activeDay;
          button.classList.toggle("is-active", isActive);
          button.setAttribute("aria-pressed", isActive ? "true" : "false");
        });
      };

      const syncCounters = () => {
        if (visibleCount) {
          visibleCount.textContent = String(getVisibleCount());
        }
      };

      const applyVisibility = () => {
        cards.forEach((card) => {
          const cardDays = getCardDays(card);
          const matchesDay = !cardDays.length || cardDays.includes(activeDay);
          const matchesFilter = activeFilter === "all" || card.dataset.menuCategory === activeFilter;
          const isVisible = matchesDay && matchesFilter;

          card.classList.toggle("is-hidden", !isVisible);
          card.setAttribute("aria-hidden", isVisible ? "false" : "true");
        });

        if (emptyState) {
          emptyState.hidden = getVisibleCount() > 0;
        }

        syncCounters();
      };

      const syncFilterUi = () => {
        const filterButtons = Array.from(filtersWrap.querySelectorAll(".menu-filter[data-menu-filter]"));
        filterButtons.forEach((button) => {
          const isActive = button.dataset.menuFilter === activeFilter;
          button.classList.toggle("is-active", isActive);
          button.setAttribute("aria-pressed", isActive ? "true" : "false");
        });
      };

      const setFilter = (filter) => {
        activeFilter = filter;
        syncFilterUi();
        applyVisibility();
      };

      const setDay = (dayId) => {
        if (!dayOrder.includes(dayId)) return;
        activeDay = dayId;
        syncDayUi();
        applyVisibility();
      };

      const buildBadge = (badgeData) => {
        const badge = document.createElement("span");
        badge.className = "menu-badge";
        badge.textContent = (currentLang === "en" ? badgeData?.labelEn : badgeData?.label) || badgeData?.label || badgeData?.labelEn || "";
        const tone = (badgeData?.tone || "").toString().toLowerCase();
        if (tone === "gold") {
          badge.classList.add("menu-badge--gold");
        } else if (tone === "dark") {
          badge.classList.add("menu-badge--dark");
        }
        return badge;
      };

      // Modal helpers render one selected dish without re-rendering the entire grid.
      const findDishByKey = (dishKey) =>
        safeArray(menuData.dishes).find((dish) => (dish?.key || "").toString() === (dishKey || "").toString()) || null;

      const renderModalMacros = (macros = {}) => {
        modalMacros.innerHTML = "";
        const items = [
          { value: `${Number(macros.kcal) || 0}`, label: "kcal" },
          { value: `${Number(macros.b) || 0}g`, label: "B" },
          { value: `${Number(macros.w) || 0}g`, label: "W" },
          { value: `${Number(macros.t) || 0}g`, label: "T" },
        ];

        items.forEach((item) => {
          const macro = document.createElement("div");
          macro.className = "menu-modal-macro";
          const value = document.createElement("strong");
          value.textContent = item.value;
          const label = document.createElement("span");
          label.textContent = item.label;
          macro.appendChild(value);
          macro.appendChild(label);
          modalMacros.appendChild(macro);
        });
      };

      const renderMenuModal = (dish) => {
        if (!dish) return;
        const localized = getLocalizedDishData(dish);
        modalImage.src = (dish.image || "").toString();
        modalImage.alt = localized.imageAlt;
        modalTitle.textContent = localized.name;
        modalPrice.textContent = formatPrice(dish.price);
        modalDescription.textContent = localized.description;
        modalIngredientsTitle.textContent = t("menuIngredientsTitle");
        modalIngredients.innerHTML = "";
        const ingredientsText = document.createElement("p");
        ingredientsText.textContent = localized.ingredientsText;
        modalIngredients.appendChild(ingredientsText);
        modalBadges.innerHTML = "";

        const categoryLabel = localized.categoryLabel;
        if (categoryLabel) {
          modalBadges.appendChild(buildBadge({
            label: categoryLabel,
            labelEn: categoryLabel,
            tone: "dark",
          }));
        }

        safeArray(dish.badges).filter((badge) => badge?.label).forEach((badgeData) => {
          modalBadges.appendChild(buildBadge(badgeData));
        });

        renderModalMacros(dish.macros || {});
      };

      const openMenuModal = (dish, trigger = null) => {
        if (!dish) return;
        activeModalDishKey = (dish.key || "").toString();
        lastModalTrigger = trigger instanceof HTMLElement ? trigger : document.activeElement instanceof HTMLElement ? document.activeElement : null;
        renderMenuModal(dish);
        modal.hidden = false;
        document.body.classList.add("is-menu-modal-open");
        const closeButton = modal.querySelector(".menu-modal-close");
        if (closeButton instanceof HTMLElement) {
          requestAnimationFrame(() => closeButton.focus({ preventScroll: true }));
        }
      };

      const closeMenuModal = ({ restoreFocus = true } = {}) => {
        if (modal.hidden) return;
        modal.hidden = true;
        document.body.classList.remove("is-menu-modal-open");
        if (restoreFocus && lastModalTrigger instanceof HTMLElement && lastModalTrigger.isConnected) {
          lastModalTrigger.focus({ preventScroll: true });
        }
        lastModalTrigger = null;
        activeModalDishKey = "";
      };

      // Card/list render helpers build the current menu view from JSON data.
      const buildDishCard = (dish, index) => {
        const localized = getLocalizedDishData(dish);
        const article = document.createElement("article");
        article.className = `menu-dish reveal${index % 4 === 1 ? " reveal-delay-1" : index % 4 === 2 ? " reveal-delay-2" : index % 4 === 3 ? " reveal-delay-3" : ""}`;
        article.dataset.menuCategory = (dish.category || "inne").toString();
        article.dataset.menuDay = safeArray(dish.days).map(normalizeDay).filter(Boolean).join(",");
        article.dataset.menuKey = (dish.key || `dish-${index + 1}`).toString();
        article.dataset.menuIndex = String(index + 1);
        article.tabIndex = 0;
        article.setAttribute("role", "button");
        article.setAttribute("aria-haspopup", "dialog");

        const figure = document.createElement("figure");
        figure.className = "menu-media";
        const image = document.createElement("img");
        image.src = (dish.image || "").toString();
        image.alt = localized.imageAlt;
        image.loading = "lazy";
        image.decoding = "async";
        image.width = 800;
        image.height = 800;
        figure.appendChild(image);

        const badges = safeArray(dish.badges).filter((badge) => badge?.label);
        if (badges.length) {
          const badgesWrap = document.createElement("div");
          badgesWrap.className = "menu-badges";
          badges.forEach((badgeData) => badgesWrap.appendChild(buildBadge(badgeData)));
          figure.appendChild(badgesWrap);
        }

        const body = document.createElement("div");
        body.className = "menu-body";
        const headline = document.createElement("div");
        headline.className = "menu-headline";
        const headCopy = document.createElement("div");
        headCopy.className = "menu-head-copy";
        const title = document.createElement("h3");
        title.textContent = localized.name;
        headCopy.appendChild(title);
        const headActions = document.createElement("div");
        headActions.className = "menu-head-actions";
        const price = document.createElement("span");
        price.className = "menu-price";
        price.textContent = formatPrice(dish.price);
        const ingredientsToggle = document.createElement("button");
        ingredientsToggle.className = "menu-ingredients-toggle";
        ingredientsToggle.type = "button";
        ingredientsToggle.dataset.menuModalTrigger = "";
        ingredientsToggle.setAttribute("aria-haspopup", "dialog");
        ingredientsToggle.setAttribute("aria-label", `+ - ${t("menuModalCardAria", { name: localized.name })}`);
        ingredientsToggle.setAttribute("title", t("menuModalOpen"));
        ingredientsToggle.textContent = "+";
        headActions.appendChild(price);
        headActions.appendChild(ingredientsToggle);
        headline.appendChild(headCopy);

        const floor = document.createElement("div");
        floor.className = "menu-floor";
        floor.appendChild(headActions);

        body.appendChild(headline);
        body.appendChild(floor);
        figure.appendChild(body);
        article.appendChild(figure);
        const visibleCardText = article.textContent?.replace(/\s+/g, " ").trim() || localized.name;
        article.setAttribute(
          "aria-label",
          `${visibleCardText}. ${t("menuModalCardAria", { name: localized.name })}`,
        );
        return article;
      };

      const renderDays = () => {
        daysWrap.innerHTML = "";
        const fragment = document.createDocumentFragment();
        resolveDaysWithDates(dayOrder).forEach((dayData) => {
          const button = document.createElement("button");
          button.className = "menu-day";
          button.type = "button";
          button.dataset.menuDay = dayData.id;
          button.setAttribute("aria-pressed", dayData.id === activeDay ? "true" : "false");
          button.textContent = dayData.label || dayData.shortLabel || dayData.id.toUpperCase();
          button.title = dayData.label || dayData.shortLabel || dayData.id.toUpperCase();
          if (dayData.id === activeDay) {
            button.classList.add("is-active");
          }
          fragment.appendChild(button);
        });
        daysWrap.appendChild(fragment);
      };

      const renderFilters = () => {
        filtersWrap.innerHTML = "";
        const allButton = document.createElement("button");
        allButton.className = "menu-filter is-active";
        allButton.type = "button";
        allButton.dataset.menuFilter = "all";
        allButton.setAttribute("aria-pressed", "true");
        allButton.textContent = t("menuFilterAll");
        filtersWrap.appendChild(allButton);

        safeArray(menuData.categories).forEach((category) => {
          const categoryId = (category.id || "").toString().trim();
          if (!categoryId) return;
          const button = document.createElement("button");
          button.className = "menu-filter";
          button.type = "button";
          button.dataset.menuFilter = categoryId;
          button.setAttribute("aria-pressed", "false");
          const categoryLabel = (currentLang === "en" ? category.labelEn : category.label) || category.label || category.labelEn || categoryId;
          button.textContent = String(categoryLabel);
          filtersWrap.appendChild(button);
        });
      };

      const renderMenuCards = () => {
        grid.innerHTML = "";
        const fragment = document.createDocumentFragment();
        safeArray(menuData.dishes).forEach((dish, index) => {
          fragment.appendChild(buildDishCard(dish, index));
        });
        grid.appendChild(fragment);
        cards = Array.from(grid.querySelectorAll(".menu-dish[data-menu-category]"));
      };

      // Data loading is isolated so the section can fail gracefully on static hosting issues.
      const loadMenuData = async () => {
        const response = await fetch(sourceUrl, { cache: "no-store" });
        if (!response.ok) {
          throw new Error(`Menu HTTP status ${response.status}`);
        }
        const payload = await response.json();
        menuData = {
          meta: payload?.meta || {},
          days: safeArray(payload?.days),
          categories: safeArray(payload?.categories),
          dishes: safeArray(payload?.dishes),
        };
        dayOrder = safeArray(menuData.days).map((entry) => normalizeDay(entry.id)).filter(Boolean);
        if (!dayOrder.length) {
          dayOrder = [...dayOrderFallback];
        }
        activeDay = resolveTodayDayId(dayOrder);
      };

      const initFromData = () => {
        renderDays();
        renderFilters();
        renderMenuCards();
        syncCounters();

        const updatedAtRaw = menuData.meta?.updatedAt ? new Date(menuData.meta.updatedAt) : null;
        if (updatedAtRaw && !Number.isNaN(updatedAtRaw.getTime())) {
          const locale = t("dateLocale");
          setMenuSync(`${t("coverageUpdatedPrefix")}${updatedAtRaw.toLocaleDateString(locale)} ${updatedAtRaw.toLocaleTimeString(locale, { hour: "2-digit", minute: "2-digit" })}`);
        } else {
          setMenuSync(t("menuSyncNoDate"));
        }

        setDay(activeDay);
        setFilter("all");
      };

      daysWrap.addEventListener("click", (event) => {
        const target = event.target;
        if (!(target instanceof HTMLElement)) return;
        const button = target.closest(".menu-day[data-menu-day]");
        if (!button) return;
        const dayId = button.dataset.menuDay || dayOrder[0];
        setDay(dayId);
      });

      daysWrap.addEventListener("keydown", (event) => {
        const keys = ["ArrowRight", "ArrowLeft", "Home", "End"];
        if (!keys.includes(event.key)) return;
        const buttons = Array.from(daysWrap.querySelectorAll(".menu-day[data-menu-day]"));
        if (!buttons.length) return;
        event.preventDefault();

        const focused = document.activeElement instanceof HTMLElement
          ? document.activeElement.closest(".menu-day[data-menu-day]")
          : null;
        const currentIndex = focused ? buttons.indexOf(focused) : buttons.findIndex((button) => button.dataset.menuDay === activeDay);
        let nextIndex = currentIndex >= 0 ? currentIndex : 0;

        if (event.key === "ArrowRight") {
          nextIndex = (nextIndex + 1) % buttons.length;
        } else if (event.key === "ArrowLeft") {
          nextIndex = (nextIndex - 1 + buttons.length) % buttons.length;
        } else if (event.key === "Home") {
          nextIndex = 0;
        } else if (event.key === "End") {
          nextIndex = buttons.length - 1;
        }

        const nextButton = buttons[nextIndex];
        if (!nextButton) return;
        setDay(nextButton.dataset.menuDay || activeDay);
        nextButton.focus({ preventScroll: true });
      });

      filtersWrap.addEventListener("click", (event) => {
        const target = event.target;
        if (!(target instanceof HTMLElement)) return;
        const button = target.closest(".menu-filter[data-menu-filter]");
        if (!button) return;
        setFilter(button.dataset.menuFilter || "all");
      });

      filtersWrap.addEventListener("keydown", (event) => {
        const keys = ["ArrowRight", "ArrowLeft", "Home", "End"];
        if (!keys.includes(event.key)) return;
        const buttons = Array.from(filtersWrap.querySelectorAll(".menu-filter[data-menu-filter]"));
        if (!buttons.length) return;
        event.preventDefault();

        const focused = document.activeElement instanceof HTMLElement
          ? document.activeElement.closest(".menu-filter[data-menu-filter]")
          : null;
        const currentIndex = focused ? buttons.indexOf(focused) : buttons.findIndex((button) => button.dataset.menuFilter === activeFilter);
        let nextIndex = currentIndex >= 0 ? currentIndex : 0;

        if (event.key === "ArrowRight") {
          nextIndex = (nextIndex + 1) % buttons.length;
        } else if (event.key === "ArrowLeft") {
          nextIndex = (nextIndex - 1 + buttons.length) % buttons.length;
        } else if (event.key === "Home") {
          nextIndex = 0;
        } else if (event.key === "End") {
          nextIndex = buttons.length - 1;
        }

        const nextButton = buttons[nextIndex];
        if (!nextButton) return;
        setFilter(nextButton.dataset.menuFilter || "all");
        nextButton.focus({ preventScroll: true });
      });

      grid.addEventListener("click", (event) => {
        const target = event.target;
        if (!(target instanceof HTMLElement)) return;
        const card = target.closest(".menu-dish");
        if (!card) return;
        const dish = findDishByKey(card.dataset.menuKey || "");
        if (!dish) return;
        const trigger = target.closest("[data-menu-modal-trigger]") || card;
        openMenuModal(dish, trigger);
      });

      grid.addEventListener("keydown", (event) => {
        const target = event.target;
        if (!(target instanceof HTMLElement)) return;
        if (!target.classList.contains("menu-dish")) return;
        if (event.key !== "Enter" && event.key !== " ") return;
        event.preventDefault();
        const dish = findDishByKey(target.dataset.menuKey || "");
        if (!dish) return;
        openMenuModal(dish, target);
      });

      modalCloseButtons.forEach((button) => {
        button.addEventListener("click", () => {
          closeMenuModal();
        });
      });

      document.addEventListener("keydown", (event) => {
        if (event.key !== "Escape" || modal.hidden) return;
        event.preventDefault();
        closeMenuModal();
      });

      setMenuSync(t("menuSyncLoading"));
      modalCloseButtons.forEach((button) => {
        button.setAttribute("aria-label", t("menuModalClose"));
        button.setAttribute("title", t("menuModalClose"));
      });
      modalIngredientsTitle.textContent = t("menuIngredientsTitle");
      emptyState.hidden = true;
      emptyState.textContent = t("menuEmptyLoading");
      loadMenuData()
        .then(() => {
          menuLoadError = false;
          initFromData();
          emptyState.hidden = getVisibleCount() > 0;
          if (!cards.length) {
            emptyState.hidden = false;
            emptyState.textContent = t("menuEmptyNoData");
          }
        })
        .catch((error) => {
          console.error("Menu data load failed:", error);
          menuLoadError = true;
          setMenuSync(t("menuSyncError"));
          emptyState.hidden = false;
          emptyState.textContent = t("menuEmptyJsonError");
          syncCounters();
        });

      document.addEventListener("pv:language-change", () => {
        if (menuLoadError) {
          setMenuSync(t("menuSyncError"));
          emptyState.hidden = false;
          emptyState.textContent = t("menuEmptyJsonError");
          return;
        }
        if (!safeArray(menuData.dishes).length) {
          emptyState.textContent = t("menuEmptyNoData");
          return;
        }
        renderDays();
        renderFilters();
        renderMenuCards();
        syncDayUi();
        syncFilterUi();
        applyVisibility();
        modalCloseButtons.forEach((button) => {
          button.setAttribute("aria-label", t("menuModalClose"));
          button.setAttribute("title", t("menuModalClose"));
        });
        modalIngredientsTitle.textContent = t("menuIngredientsTitle");
        if (!modal.hidden && activeModalDishKey) {
          const activeDish = findDishByKey(activeModalDishKey);
          if (activeDish) {
            renderMenuModal(activeDish);
          }
        }

        const updatedAtRaw = menuData.meta?.updatedAt ? new Date(menuData.meta.updatedAt) : null;
        if (updatedAtRaw && !Number.isNaN(updatedAtRaw.getTime())) {
          const locale = t("dateLocale");
          setMenuSync(`${t("coverageUpdatedPrefix")}${updatedAtRaw.toLocaleDateString(locale)} ${updatedAtRaw.toLocaleTimeString(locale, { hour: "2-digit", minute: "2-digit" })}`);
        } else {
          setMenuSync(t("menuSyncNoDate"));
        }
      });
    };

    // ==========================================================================
    // Section module: why us
    // ==========================================================================
    /**
     * "Why us" stack:
     * scroll-driven card choreography with one active card and an optional expanded detail state.
     */
    const initWhySection = () => {
      const section = document.querySelector(".why-section");
      if (!section) return;

      const grid = section.querySelector(".why-grid");
      const cards = Array.from(section.querySelectorAll(".why-card[data-why-topic]"));
      const shells = cards.map((card) => card.querySelector(".why-card-shell"));
      const detailButtons = cards.map((card) => card.querySelector(".why-card-action"));
      const insightPanel = section.querySelector(".why-insight");
      const insightTitle = section.querySelector("[data-why-insight-title]");
      const insightCopy = section.querySelector("[data-why-insight-copy]");
      const progressCopy = section.querySelector("[data-why-progress-copy]");
      const progressFill = section.querySelector("[data-why-progress-fill]");
      if (!grid || !cards.length || shells.some((shell) => !shell) || detailButtons.some((button) => !button)) return;

      let activeCard = null;
      let expandedCard = null;
      let insightSwapTimer = 0;
      let scrollTicking = false;
      let isSectionInRange = !("IntersectionObserver" in window);
      const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
      const finePointerQuery = window.matchMedia("(pointer: fine)");
      const hoverlessQuery = window.matchMedia("(hover: none)");
      const shouldUseStaticStack = () => reducedMotionQuery.matches || (hoverlessQuery.matches && window.innerWidth <= 900);
      const clamp = (value, min = 0, max = 1) => Math.min(max, Math.max(min, value));
      const lerp = (from, to, progress) => from + ((to - from) * progress);

      const getStickyTop = () => {
        const rawTop = window.getComputedStyle(cards[0]).top;
        const parsedTop = Number.parseFloat(rawTop);
        return Number.isFinite(parsedTop) ? parsedTop : Math.max(92, window.innerHeight * 0.14);
      };

      const getStackStep = () => {
        if (window.innerWidth <= 620) return 14;
        if (window.innerWidth <= 900) return 16;
        return 26;
      };

      const updateMetrics = () => {
        const stackStep = getStackStep();
        cards.forEach((card, index) => {
          card.style.setProperty("--card-stack-padding", `${index * stackStep}px`);
          card.style.setProperty("--card-scale", "1");
          card.style.setProperty("--card-shift", "0px");
          card.style.setProperty("--card-depth", "0px");
          card.style.setProperty("--card-rotate-x", "0deg");
          card.style.setProperty("--card-rotate-y", "0deg");
          card.style.setProperty("--card-rotate-z", "0deg");
          card.style.setProperty("--card-tilt-x", "0deg");
          card.style.setProperty("--card-tilt-y", "0deg");
          card.style.setProperty("--card-glow-opacity", "0");
          card.classList.remove("is-stacked", "is-waiting");
        });

        const shellHeight = Math.max(...shells.map((shell) => Math.ceil(shell.getBoundingClientRect().height)));
        grid.style.setProperty("--why-cards-count", String(cards.length));
        grid.style.setProperty("--why-card-height", `${shellHeight}px`);
      };

      const updateProgress = (card) => {
        if (!card) return;
        const index = Math.max(0, cards.indexOf(card));
        const total = cards.length;
        const current = index + 1;
        const progressPercent = (current / total) * 100;

        if (progressCopy) progressCopy.textContent = `${current} / ${total}`;
        if (progressFill) progressFill.style.width = `${progressPercent}%`;
      };

      const syncDetailButton = (card, isExpanded) => {
        if (!card) return;
        const button = card.querySelector(".why-card-action");
        const label = card.querySelector("[data-why-action-label]");
        const detail = card.querySelector(".why-card-detail");
        if (button) button.setAttribute("aria-expanded", isExpanded ? "true" : "false");
        if (detail) detail.setAttribute("aria-hidden", isExpanded ? "false" : "true");
        if (label) label.textContent = isExpanded ? t("whyActionCloseLabel") : t("whyActionLabel");
      };

      const refreshLayout = () => {
        window.requestAnimationFrame(() => {
          updateMetrics();
          scheduleActiveCardUpdate();
        });
        window.setTimeout(() => {
          updateMetrics();
          scheduleActiveCardUpdate();
        }, reducedMotionQuery.matches ? 0 : 420);
      };

      const setExpandedCard = (card, options = {}) => {
        const nextExpandedCard = card || null;
        if (expandedCard === nextExpandedCard && !options.force) return;
        expandedCard = nextExpandedCard;

        cards.forEach((item) => {
          const isExpanded = item === expandedCard;
          item.classList.toggle("is-expanded", isExpanded);
          syncDetailButton(item, isExpanded);
        });

        refreshLayout();
      };

      const setActiveCard = (card, options = {}) => {
        if (!card) return;
        if (activeCard === card && !options.force) {
          updateProgress(card);
          return;
        }
        activeCard = card;

        cards.forEach((item) => {
          const isActive = item === card;
          item.classList.toggle("is-active", isActive);
          item.classList.remove("is-dimmed");
          item.removeAttribute("aria-hidden");
          if (isActive) {
            item.setAttribute("aria-current", "step");
          } else {
            item.removeAttribute("aria-current");
          }
        });

        if (insightTitle) insightTitle.textContent = card.dataset.whyTitle || "";
        if (insightCopy) insightCopy.textContent = card.dataset.whyCopy || "";
        updateProgress(card);

        if (expandedCard && expandedCard !== card) {
          setExpandedCard(null);
        }

        if (insightPanel && !reducedMotionQuery.matches) {
          insightPanel.classList.remove("is-swapping");
          window.clearTimeout(insightSwapTimer);
          // Force reflow so animation can be replayed on each active-card swap.
          void insightPanel.offsetWidth;
          insightPanel.classList.add("is-swapping");
          insightSwapTimer = window.setTimeout(() => insightPanel.classList.remove("is-swapping"), 420);
        }
      };

      const scrollToCard = (card, focusAfterScroll = false) => {
        if (!card) return;
        if (shouldUseStaticStack()) {
          setActiveCard(card, { force: true });
        }
        const isSmallScreen = window.matchMedia("(max-width: 700px)").matches;
        card.scrollIntoView({
          behavior: reducedMotionQuery.matches ? "auto" : "smooth",
          block: isSmallScreen ? "start" : "center",
          inline: "nearest",
        });
        if (focusAfterScroll) {
          window.setTimeout(() => card.focus({ preventScroll: true }), reducedMotionQuery.matches ? 0 : 360);
        }
        window.setTimeout(scheduleActiveCardUpdate, reducedMotionQuery.matches ? 0 : 220);
      };

      const getAdjacentCard = (fromCard, direction) => {
        const fromIndex = Math.max(0, cards.indexOf(fromCard));
        const nextIndex = Math.min(cards.length - 1, Math.max(0, fromIndex + direction));
        return cards[nextIndex];
      };

      const getActiveCardFromScroll = () => {
        const stickyTop = getStickyTop();
        const referenceHeight = shells[0]?.getBoundingClientRect().height || 0;
        const activationLine = stickyTop + (referenceHeight * 0.22);
        return cards.reduce((candidate, card, index) => (
          shells[index].getBoundingClientRect().top <= activationLine ? card : candidate
        ), cards[0]);
      };

      const updateCardStack = (scrolledActiveCard = activeCard || cards[0]) => {
        const stickyTop = getStickyTop();
        const startLine = window.innerHeight * (window.innerWidth <= 620 ? 0.9 : 0.92);
        const stackStep = getStackStep();

        cards.forEach((card, index) => {
          const nextCard = cards[index + 1];
          let progress = 0;
          const isCurrentActive = card === scrolledActiveCard;

          if (nextCard && !reducedMotionQuery.matches) {
            const endLine = stickyTop + (index * stackStep);
            progress = clamp((startLine - nextCard.getBoundingClientRect().top) / Math.max(1, startLine - endLine));
          }

          const depth = cards.length - 1 - index;
          const isSmallScreen = window.innerWidth <= 620;
          const scaleDropPerStep = isSmallScreen ? 0.028 : 0.038;
          const targetScale = Math.max(0.88, 1 - (depth * scaleDropPerStep));
          const targetDepth = depth * (isSmallScreen ? -16 : -24);
          const targetRotateX = depth * (isSmallScreen ? 3.2 : 4.6);
          const targetRotateY = depth * (index % 2 === 0 ? -0.7 : 0.7);
          const targetRotateZ = depth * (index % 2 === 0 ? -0.75 : 0.75);
          const activeLift = isCurrentActive && !reducedMotionQuery.matches ? (isSmallScreen ? 8 : 14) : 0;
          const activePitch = isCurrentActive && !reducedMotionQuery.matches ? -1.2 : 0;
          const baseGlow = isCurrentActive ? 0.82 : 0.12;
          const scale = nextCard ? lerp(1, targetScale, progress) : 1;
          const shift = nextCard ? lerp(0, depth * (isSmallScreen ? 8 : 12), progress) : 0;
          const cardDepth = nextCard ? lerp(activeLift, targetDepth, progress) : activeLift;
          const rotateX = nextCard ? lerp(activePitch, targetRotateX, progress) : activePitch;
          const rotateY = nextCard ? lerp(0, targetRotateY, progress) : 0;
          const rotateZ = nextCard ? lerp(0, targetRotateZ, progress) : 0;
          const glowOpacity = nextCard ? lerp(baseGlow, 0.04, progress) : baseGlow;

          card.classList.toggle("is-stacked", progress > 0.04);
          card.classList.toggle("is-waiting", nextCard ? progress < 0.02 : false);
          card.style.setProperty("--card-scale", scale.toFixed(3));
          card.style.setProperty("--card-shift", `${shift.toFixed(2)}px`);
          card.style.setProperty("--card-depth", `${cardDepth.toFixed(2)}px`);
          card.style.setProperty("--card-rotate-x", `${rotateX.toFixed(2)}deg`);
          card.style.setProperty("--card-rotate-y", `${rotateY.toFixed(2)}deg`);
          card.style.setProperty("--card-rotate-z", `${rotateZ.toFixed(2)}deg`);
          card.style.setProperty("--card-glow-opacity", glowOpacity.toFixed(3));
        });
      };

      const renderStack = () => {
        const scrolledActiveCard = getActiveCardFromScroll();
        if (!shouldUseStaticStack()) {
          updateCardStack(scrolledActiveCard);
        }
        setActiveCard(scrolledActiveCard);
        scrollTicking = false;
      };

      const scheduleActiveCardUpdate = () => {
        if (shouldUseStaticStack()) return;
        if (!isSectionInRange) return;
        if (scrollTicking) return;
        scrollTicking = true;
        window.requestAnimationFrame(renderStack);
      };

      cards.forEach((card) => {
        const actionButton = card.querySelector(".why-card-action");
        let tiltFrame = 0;
        let tiltX = 0;
        let tiltY = 0;

        const resetTilt = () => {
          if (tiltFrame) {
            window.cancelAnimationFrame(tiltFrame);
            tiltFrame = 0;
          }
          card.style.removeProperty("--mx");
          card.style.removeProperty("--my");
          card.style.setProperty("--card-tilt-x", "0deg");
          card.style.setProperty("--card-tilt-y", "0deg");
        };

        const renderTilt = () => {
          tiltFrame = 0;
          const shell = card.querySelector(".why-card-shell");
          const rect = shell?.getBoundingClientRect() || card.getBoundingClientRect();
          const x = clamp(tiltX - rect.left, 0, rect.width);
          const y = clamp(tiltY - rect.top, 0, rect.height);
          const offsetX = clamp((x / rect.width), 0, 1) - 0.5;
          const offsetY = clamp((y / rect.height), 0, 1) - 0.5;
          card.style.setProperty("--mx", `${x}px`);
          card.style.setProperty("--my", `${y}px`);
          card.style.setProperty("--card-tilt-y", `${(offsetX * 5.2).toFixed(2)}deg`);
          card.style.setProperty("--card-tilt-x", `${(offsetY * -4.4).toFixed(2)}deg`);
        };

        card.addEventListener("click", () => {
          scrollToCard(card);
        });

        card.addEventListener("keydown", (event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            scrollToCard(card);
          }

          if (event.key === "ArrowRight" || event.key === "ArrowDown") {
            event.preventDefault();
            scrollToCard(getAdjacentCard(card, 1), true);
          }

          if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
            event.preventDefault();
            scrollToCard(getAdjacentCard(card, -1), true);
          }

          if (event.key === "Home") {
            event.preventDefault();
            scrollToCard(cards[0], true);
          }

          if (event.key === "End") {
            event.preventDefault();
            scrollToCard(cards[cards.length - 1], true);
          }
        });

        card.addEventListener("focus", () => setActiveCard(card));

        card.addEventListener("pointermove", (event) => {
          if (reducedMotionQuery.matches || !finePointerQuery.matches) return;
          tiltX = event.clientX;
          tiltY = event.clientY;
          if (!tiltFrame) {
            tiltFrame = window.requestAnimationFrame(renderTilt);
          }
        });

        card.addEventListener("pointerleave", resetTilt);

        actionButton?.addEventListener("click", (event) => {
          event.preventDefault();
          event.stopPropagation();
          if (activeCard !== card) {
            setActiveCard(card, { force: true });
          }
          setExpandedCard(expandedCard === card ? null : card);
        });

        actionButton?.addEventListener("keydown", (event) => {
          const blockedKeys = ["Enter", " ", "ArrowRight", "ArrowLeft", "ArrowDown", "ArrowUp", "Home", "End"];
          if (blockedKeys.includes(event.key)) {
            event.stopPropagation();
          }
        });
      });

      if ("IntersectionObserver" in window && !reducedMotionQuery.matches) {
        const revealNodes = Array.from(section.querySelectorAll(".reveal"));
        if (revealNodes.length) {
          section.classList.add("is-scroll-armed");
          revealNodes.forEach((node) => {
            let delay = 0;
            if (node.classList.contains("reveal-delay-1")) delay = 90;
            if (node.classList.contains("reveal-delay-2")) delay = 170;
            if (node.classList.contains("reveal-delay-3")) delay = 250;
            node.style.setProperty("--why-reveal-delay", `${delay}ms`);
          });

          const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach((entry) => {
              if (!entry.isIntersecting) return;
              entry.target.classList.add("is-inview");
              observer.unobserve(entry.target);
            });
          }, { threshold: 0.2, rootMargin: "0px 0px -12% 0px" });

          revealNodes.forEach((node) => revealObserver.observe(node));
        }
      }

      if ("IntersectionObserver" in window) {
        const rangeObserver = new IntersectionObserver((entries) => {
          const [entry] = entries;
          isSectionInRange = Boolean(entry?.isIntersecting);
          if (isSectionInRange) {
            scheduleActiveCardUpdate();
          }
        }, { threshold: 0, rootMargin: "45% 0px 45% 0px" });
        rangeObserver.observe(section);
      }

      updateMetrics();
      const initialCard = cards.find((card) => card.classList.contains("is-active")) || cards[0];
      setActiveCard(initialCard, { force: true });
      cards.forEach((card) => syncDetailButton(card, false));
      if (!shouldUseStaticStack()) {
        window.addEventListener("scroll", scheduleActiveCardUpdate, { passive: true });
      }
      window.addEventListener("resize", () => {
        updateMetrics();
        scheduleActiveCardUpdate();
      });
      window.addEventListener("load", () => {
        updateMetrics();
        scheduleActiveCardUpdate();
      });
      scheduleActiveCardUpdate();
      window.setTimeout(() => {
        updateMetrics();
        scheduleActiveCardUpdate();
      }, 180);
    };

    // ==========================================================================
    // Section module: social proof
    // ==========================================================================
    /**
     * Review wall / social proof.
     * Handles row reveal timing and subtle 3D drift based on scroll position.
     */
    const initProofSection = () => {
      const section = document.getElementById("opinie");
      if (!section) return;

      const shell = section.querySelector("[data-proof-shell]");
      const wall = section.querySelector(".proof-wall");
      const rows = Array.from(section.querySelectorAll("[data-proof-row]"));
      const cards = Array.from(section.querySelectorAll("[data-proof-card]"));
      const sheet = section.querySelector("[data-proof-sheet]");
      const sheetPanel = section.querySelector("[data-proof-sheet-panel]");
      const sheetAvatar = section.querySelector("[data-proof-sheet-avatar]");
      const sheetVerified = section.querySelector("[data-proof-sheet-verified]");
      const sheetIndex = section.querySelector("[data-proof-sheet-index]");
      const sheetBadges = section.querySelector("[data-proof-sheet-badges]");
      const sheetStars = section.querySelector("[data-proof-sheet-stars]");
      const sheetQuote = section.querySelector("[data-proof-sheet-quote]");
      const sheetRole = section.querySelector("[data-proof-sheet-role]");
      const sheetMetaText = section.querySelector("[data-proof-sheet-meta-text]");
      const sheetCloseButtons = Array.from(section.querySelectorAll("[data-proof-sheet-close]"));
      if (!shell || !wall || !rows.length || !cards.length) return;

      const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
      const hoverlessQuery = window.matchMedia("(hover: none)");
      let frameId = 0;
      let activeSheetCard = null;
      let lastSheetTrigger = null;
      let wallPointerId = null;
      let wallStartX = 0;
      let wallStartY = 0;
      let wallDragged = false;
      let isProofInRange = !("IntersectionObserver" in window);

      const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
      const lerp = (start, end, progress) => start + ((end - start) * progress);
      const smoothstep = (value) => value * value * (3 - (2 * value));
      const isMobileProofUi = () => window.innerWidth <= 620;
      const shouldUseStaticLayout = () => reducedMotionQuery.matches || (hoverlessQuery.matches && window.innerWidth <= 900);

      const syncCardA11y = () => {
        const isCompact = isMobileProofUi();
        const copy = getStaticCopy();
        cards.forEach((card) => {
          if (isCompact) {
            card.setAttribute("role", "button");
            card.setAttribute("aria-haspopup", "dialog");
            if (sheet?.id) card.setAttribute("aria-controls", sheet.id);
            const visibleCardText = card.textContent?.replace(/\s+/g, " ").trim() || "";
            card.setAttribute("aria-label", `${visibleCardText}. ${copy.proofModalOpen}`);
          } else {
            card.removeAttribute("role");
            card.removeAttribute("aria-haspopup");
            card.removeAttribute("aria-controls");
            card.removeAttribute("aria-label");
          }
        });

        const closeLabel = copy.proofModalClose;
        sheetCloseButtons.forEach((button) => {
          button.setAttribute("aria-label", closeLabel);
          button.setAttribute("title", closeLabel);
        });
        if (sheetPanel) {
          sheetPanel.setAttribute("aria-label", copy.proofModalLabel);
        }
      };

      cards.forEach((card, index) => {
        const indexNode = card.querySelector("[data-proof-card-index]");
        if (indexNode) {
          indexNode.textContent = String(index + 1).padStart(2, "0");
        }
      });

      const renderSheetFromCard = (card) => {
        if (!card || !sheetAvatar || !sheetVerified || !sheetIndex || !sheetBadges || !sheetQuote || !sheetRole || !sheetMetaText) return;
        const avatar = card.querySelector(".proof-avatar");
        const verified = card.querySelector("[data-proof-verified]");
        const indexNode = card.querySelector("[data-proof-card-index]");
        const stars = card.querySelector(".proof-stars");
        const quote = card.querySelector(".proof-quote");
        const role = card.querySelector("[data-proof-author-role]");
        const meta = card.querySelector("[data-proof-author-meta]");
        const badges = Array.from(card.querySelectorAll("[data-proof-card-badge]"));

        sheetAvatar.textContent = avatar?.textContent?.trim() || "";
        sheetVerified.textContent = verified?.textContent?.trim() || "";
        sheetIndex.textContent = indexNode?.textContent?.trim() || "";
        if (sheetStars) {
          sheetStars.textContent = stars?.textContent?.trim() || "";
        }
        if (sheetStars && stars?.getAttribute("aria-label")) {
          sheetStars.setAttribute("aria-label", stars.getAttribute("aria-label"));
          sheetStars.setAttribute("title", stars.getAttribute("aria-label"));
        }
        sheetQuote.textContent = quote?.textContent?.trim() || "";
        sheetRole.textContent = role?.textContent?.trim() || "";
        sheetMetaText.textContent = meta?.textContent?.trim() || "";
        sheetBadges.innerHTML = "";
        badges.forEach((badgeNode) => {
          const badge = document.createElement("span");
          badge.className = badgeNode.className;
          badge.textContent = badgeNode.textContent?.trim() || "";
          sheetBadges.appendChild(badge);
        });
      };

      const openSheet = (card) => {
        if (!sheet || !sheetPanel || !card) return;
        activeSheetCard = card;
        lastSheetTrigger = card;
        renderSheetFromCard(card);
        sheet.hidden = false;
        document.body.classList.add("is-proof-sheet-open");
        const closeButton = sheet.querySelector(".proof-sheet-close");
        if (closeButton instanceof HTMLElement) {
          requestAnimationFrame(() => closeButton.focus({ preventScroll: true }));
        }
      };

      const closeSheet = ({ restoreFocus = true } = {}) => {
        if (!sheet || sheet.hidden) return;
        sheet.hidden = true;
        document.body.classList.remove("is-proof-sheet-open");
        if (restoreFocus && lastSheetTrigger instanceof HTMLElement && lastSheetTrigger.isConnected) {
          lastSheetTrigger.focus({ preventScroll: true });
        }
        activeSheetCard = null;
        lastSheetTrigger = null;
      };

      syncCardA11y();

      wall.addEventListener("pointerdown", (event) => {
        if (!isMobileProofUi()) return;
        wallPointerId = event.pointerId;
        wallStartX = event.clientX;
        wallStartY = event.clientY;
        wallDragged = false;
      });

      wall.addEventListener("pointermove", (event) => {
        if (!isMobileProofUi() || wallPointerId !== event.pointerId) return;
        if (Math.abs(event.clientX - wallStartX) > 8 || Math.abs(event.clientY - wallStartY) > 8) {
          wallDragged = true;
        }
      });

      const endWallPointer = () => {
        wallPointerId = null;
        window.setTimeout(() => {
          wallDragged = false;
        }, 120);
      };

      wall.addEventListener("pointerup", endWallPointer);
      wall.addEventListener("pointercancel", endWallPointer);
      wall.addEventListener("lostpointercapture", endWallPointer);

      cards.forEach((card) => {
        card.addEventListener("click", (event) => {
          if (!isMobileProofUi() || wallDragged) return;
          event.preventDefault();
          openSheet(card);
        });

        card.addEventListener("keydown", (event) => {
          if (!isMobileProofUi()) return;
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            openSheet(card);
          }
        });
      });

      sheetCloseButtons.forEach((button) => {
        button.addEventListener("click", () => closeSheet());
      });

      document.addEventListener("keydown", (event) => {
        if (event.key !== "Escape" || !sheet || sheet.hidden) return;
        closeSheet();
      });

      document.addEventListener("pv:language-change", () => {
        syncCardA11y();
        if (activeSheetCard) {
          renderSheetFromCard(activeSheetCard);
        }
      });

      const applyStaticLayout = () => {
        rows.forEach((row) => {
          row.style.setProperty("--proof-row-shift", "0px");
          row.style.setProperty("--proof-row-depth", "0px");
          row.style.setProperty("--proof-row-opacity", "1");
        });

        cards.forEach((card) => {
          card.style.setProperty("--card-reveal-x", "0px");
          card.style.setProperty("--card-reveal-y", "0px");
          card.style.setProperty("--card-reveal-z", "0px");
          card.style.setProperty("--card-reveal-rotate-x", "0deg");
          card.style.setProperty("--card-reveal-opacity", "1");
        });
      };

      const updateRows = () => {
        frameId = 0;

        if (shouldUseStaticLayout() || reducedMotionQuery.matches || (hoverlessQuery.matches && window.innerWidth <= 900)) {
          applyStaticLayout();
          return;
        }

        const rect = section.getBoundingClientRect();
        const viewportHeight = window.innerHeight || 1;
        const progress = clamp((viewportHeight - rect.top) / (viewportHeight + rect.height), 0, 1);
        const isMobile = window.innerWidth <= 620;
        const maxShift = isMobile ? 0 : (window.innerWidth <= 900 ? 18 : window.innerWidth <= 1280 ? 34 : 52);

        rows.forEach((row, index) => {
          const direction = index % 2 === 0 ? 1 : -1;
          const reveal = smoothstep(clamp((progress - (index * 0.08)) / 0.52, 0, 1));
          const rowProgress = smoothstep(clamp((progress - (index * 0.06)) / 0.8, 0, 1));
          const travel = lerp(-maxShift, maxShift, rowProgress) * direction;
          const settling = isMobile ? 0 : (1 - reveal) * direction * 12;
          const depth = lerp(-32, 0, reveal);
          row.style.setProperty("--proof-row-shift", `${(travel + settling).toFixed(2)}px`);
          row.style.setProperty("--proof-row-depth", `${depth.toFixed(2)}px`);
          row.style.setProperty("--proof-row-opacity", (0.35 + (reveal * 0.65)).toFixed(3));
        });

        cards.forEach((card, index) => {
          const rowIndex = Math.floor(index / 4);
          const columnIndex = index % 4;
          const rowDirection = rowIndex % 2 === 0 ? 1 : -1;
          const revealStart = 0.1 + (rowIndex * 0.12) + (columnIndex * 0.035);
          const revealEnd = revealStart + (isMobile ? 0.28 : 0.22);
          const reveal = smoothstep(clamp((progress - revealStart) / (revealEnd - revealStart), 0, 1));
          const revealXStart = isMobile ? 0 : rowDirection * (20 - (columnIndex * 6));
          const revealYStart = isMobile ? 18 : 30 + ((columnIndex % 2) * 5);
          const revealZStart = isMobile ? -14 : -32;
          const revealRotateXStart = isMobile ? 3 : 7;
          card.style.setProperty("--card-reveal-x", `${lerp(revealXStart, 0, reveal).toFixed(2)}px`);
          card.style.setProperty("--card-reveal-y", `${lerp(revealYStart, 0, reveal).toFixed(2)}px`);
          card.style.setProperty("--card-reveal-z", `${lerp(revealZStart, 0, reveal).toFixed(2)}px`);
          card.style.setProperty("--card-reveal-rotate-x", `${lerp(revealRotateXStart, 0, reveal).toFixed(2)}deg`);
          card.style.setProperty("--card-reveal-opacity", reveal.toFixed(3));
        });
      };

      const scheduleUpdate = () => {
        if (!isProofInRange) return;
        if (frameId) return;
        frameId = window.requestAnimationFrame(updateRows);
      };

      const onResize = () => {
        syncCardA11y();
        if (!isMobileProofUi()) {
          closeSheet({ restoreFocus: false });
        }
        scheduleUpdate();
      };

      if (shouldUseStaticLayout()) {
        applyStaticLayout();
      }

      if (!shouldUseStaticLayout() && "IntersectionObserver" in window) {
        const observer = new IntersectionObserver((entries) => {
          entries.forEach((entry) => {
            isProofInRange = entry.isIntersecting;
            if (isProofInRange) {
              scheduleUpdate();
            }
          });
        }, {
          threshold: 0,
          rootMargin: "25% 0px 25% 0px",
        });

        observer.observe(shell);
      }

      if (!shouldUseStaticLayout()) {
        window.addEventListener("scroll", scheduleUpdate, { passive: true });
      }
      window.addEventListener("load", scheduleUpdate);
      updateRows();

      window.addEventListener("resize", onResize);
      reducedMotionQuery.addEventListener?.("change", () => {
        if (shouldUseStaticLayout()) {
          applyStaticLayout();
          return;
        }
        scheduleUpdate();
      });
      hoverlessQuery.addEventListener?.("change", () => {
        if (shouldUseStaticLayout()) {
          applyStaticLayout();
          return;
        }
        scheduleUpdate();
      });
    };

    // ==========================================================================
    // Section module: hero slider
    // ==========================================================================
    /**
     * Autoplay hero slider with progress indicator, keyboard navigation and reduced-motion fallback.
     */
    const initHeroSlider = () => {
      const slider = document.querySelector("[data-hero-slider]");
      if (!slider) return;

      const slides = Array.from(slider.querySelectorAll("[data-hero-slide]"));
      if (!slides.length) return;

      const dots = Array.from(slider.querySelectorAll("[data-hero-dot]"));
      const prevButton = slider.querySelector("[data-hero-prev]");
      const nextButton = slider.querySelector("[data-hero-next]");
      const progressFill = slider.querySelector(".hero-progress-fill");
      const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
      const autoplayMs = Math.max(4200, Number(slider.dataset.autoplayMs) || 6200);
      const slideMediaLoads = new WeakMap();

      let activeIndex = slides.findIndex((slide) => slide.classList.contains("is-active"));
      if (activeIndex < 0) {
        activeIndex = 0;
      }

      let progressValue = 0;
      let isPaused = false;
      let isHeroVisible = true;
      let rafId = 0;
      let lastTick = 0;

      const loadSlideMedia = (slide) => {
        if (!(slide instanceof HTMLElement)) return Promise.resolve();
        const mediaUrl = slide.dataset.heroBackground || "";
        if (!mediaUrl || slide.classList.contains("is-media-loaded")) return Promise.resolve();
        if (slideMediaLoads.has(slide)) return slideMediaLoads.get(slide);

        const mediaLoad = new Promise((resolve) => {
          const image = new Image();
          const finalize = () => {
            const safeUrl = mediaUrl.replace(/["\\]/g, "\\$&");
            slide.style.setProperty("--hero-slide-image", `url("${safeUrl}")`);
            slide.classList.add("is-media-loaded");
            resolve();
          };
          image.addEventListener("load", finalize, { once: true });
          image.addEventListener("error", resolve, { once: true });
          image.decoding = "async";
          image.src = mediaUrl;
        });

        slideMediaLoads.set(slide, mediaLoad);
        return mediaLoad;
      };

      let slideMediaWarmupTimer = 0;
      const queueNextSlideMedia = (delay = 6500) => {
        window.clearTimeout(slideMediaWarmupTimer);
        slideMediaWarmupTimer = window.setTimeout(() => {
          slideMediaWarmupTimer = 0;
          const enqueue = () => {
            const nextIndex = (activeIndex + 1) % slides.length;
            loadSlideMedia(slides[nextIndex]);
          };

          if ("requestIdleCallback" in window) {
            window.requestIdleCallback(enqueue, { timeout: 2500 });
          } else {
            enqueue();
          }
        }, delay);
      };

      const setProgress = (value) => {
        const normalizedValue = Math.min(Math.max(value, 0), 1);
        if (progressFill instanceof HTMLElement) {
          progressFill.style.transform = `scaleX(${normalizedValue.toFixed(4)})`;
          return;
        }
        slider.style.setProperty("--hero-progress", String(normalizedValue));
      };

      const render = () => {
        slides.forEach((slide, index) => {
          const isActive = index === activeIndex;
          slide.classList.toggle("is-active", isActive);
          slide.setAttribute("aria-hidden", isActive ? "false" : "true");
        });

        dots.forEach((dot, index) => {
          const isActive = index === activeIndex;
          dot.classList.toggle("is-active", isActive);
          dot.setAttribute("aria-pressed", isActive ? "true" : "false");
        });
      };

      const goToSlide = (index) => {
        const previousIndex = activeIndex;
        const nextIndex = (index + slides.length) % slides.length;

        if (nextIndex === previousIndex) {
          return;
        }

        const forwardDelta = (nextIndex - previousIndex + slides.length) % slides.length;
        const direction = forwardDelta <= slides.length / 2 ? "next" : "prev";
        slider.dataset.direction = direction;
        loadSlideMedia(slides[nextIndex]);

        activeIndex = nextIndex;
        progressValue = 0;
        setProgress(0);
        render();
        queueNextSlideMedia();
      };

      const setPaused = (paused) => {
        isPaused = paused;
        slider.classList.toggle("is-paused", isPaused);
      };

      const step = (timestamp) => {
        rafId = 0;
        if (!isHeroVisible || document.hidden || reducedMotionQuery.matches) {
          lastTick = 0;
          return;
        }

        if (!lastTick) {
          lastTick = timestamp;
        }

        const delta = timestamp - lastTick;
        lastTick = timestamp;

        if (!isPaused && !reducedMotionQuery.matches && slides.length > 1) {
          progressValue += delta / autoplayMs;
          if (progressValue >= 1) {
            slider.dataset.direction = "next";
            goToSlide(activeIndex + 1);
          } else {
            setProgress(progressValue);
          }
        }

        rafId = requestAnimationFrame(step);
      };

      const startTicker = () => {
        if (rafId || !isHeroVisible || document.hidden || reducedMotionQuery.matches) return;
        lastTick = 0;
        rafId = requestAnimationFrame(step);
      };

      const stopTicker = () => {
        if (rafId) {
          cancelAnimationFrame(rafId);
          rafId = 0;
        }
        lastTick = 0;
      };

      dots.forEach((dot, index) => {
        dot.addEventListener("click", () => goToSlide(index));
      });

      if (prevButton) {
        prevButton.addEventListener("click", () => {
          slider.dataset.direction = "prev";
          goToSlide(activeIndex - 1);
        });
      }

      if (nextButton) {
        nextButton.addEventListener("click", () => {
          slider.dataset.direction = "next";
          goToSlide(activeIndex + 1);
        });
      }

      slider.addEventListener("focusin", () => setPaused(true));
      slider.addEventListener("focusout", (event) => {
        if (!slider.contains(event.relatedTarget)) {
          setPaused(false);
        }
      });

      slider.addEventListener("keydown", (event) => {
        if (event.key === "ArrowLeft") {
          event.preventDefault();
          slider.dataset.direction = "prev";
          goToSlide(activeIndex - 1);
        }

        if (event.key === "ArrowRight") {
          event.preventDefault();
          slider.dataset.direction = "next";
          goToSlide(activeIndex + 1);
        }
      });

      const onMotionChange = () => {
        if (reducedMotionQuery.matches) {
          progressValue = 0;
          setProgress(0);
          stopTicker();
        } else {
          startTicker();
        }
      };

      if (typeof reducedMotionQuery.addEventListener === "function") {
        reducedMotionQuery.addEventListener("change", onMotionChange);
      } else if (typeof reducedMotionQuery.addListener === "function") {
        reducedMotionQuery.addListener(onMotionChange);
      }

      if ("IntersectionObserver" in window) {
        const heroVisibilityObserver = new IntersectionObserver((entries) => {
          const [entry] = entries;
          isHeroVisible = Boolean(entry?.isIntersecting);
          if (isHeroVisible) {
            startTicker();
          } else {
            stopTicker();
          }
        }, { threshold: 0.05 });
        heroVisibilityObserver.observe(slider);
      }

      document.addEventListener("visibilitychange", () => {
        if (document.hidden) {
          stopTicker();
        } else {
          startTicker();
        }
      });

      render();
      setProgress(0);
      startTicker();
      if (document.readyState === "complete") {
        queueNextSlideMedia();
      } else {
        window.addEventListener("load", () => queueNextSlideMedia(), { once: true });
      }
    };

    const initWhenNearSection = (sectionId, initializer, rootMargin = "900px 0px") => {
      const section = document.getElementById(sectionId);
      if (!section || typeof initializer !== "function") return;

      let initialized = false;
      let observer = null;

      const onAnchorClick = (event) => {
        const target = event.target;
        if (!(target instanceof Element)) return;
        const link = target.closest(`a[href="#${sectionId}"]`);
        if (link) run();
      };

      const run = () => {
        if (initialized) return;
        initialized = true;
        observer?.disconnect();
        document.removeEventListener("click", onAnchorClick);
        section.querySelectorAll("img[data-deferred-src]").forEach((image) => {
          if (!(image instanceof HTMLImageElement)) return;
          const source = image.dataset.deferredSrc || "";
          if (!source) return;
          image.src = source;
          image.removeAttribute("data-deferred-src");
        });
        initializer();
      };

      document.addEventListener("click", onAnchorClick);

      if (window.location.hash === `#${sectionId}` || !("IntersectionObserver" in window)) {
        run();
        return;
      }

      observer = new IntersectionObserver((entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          run();
        }
      }, { rootMargin, threshold: 0.01 });
      observer.observe(section);
    };

    const initStableAnchorNavigation = () => {
      const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
      const correctionDelays = [80, 240, 520, 980];

      const getLocalAnchorTarget = (link) => {
        if (!(link instanceof HTMLAnchorElement)) return null;
        const rawHref = link.getAttribute("href") || "";
        if (!rawHref.startsWith("#") || rawHref === "#") return null;
        const targetId = decodeURIComponent(rawHref.slice(1));
        if (!targetId) return null;
        return document.getElementById(targetId);
      };

      const scrollToAnchorTarget = (target, { smooth = true, updateHash = false } = {}) => {
        if (!(target instanceof HTMLElement)) return;
        const behavior = smooth && !reducedMotionQuery.matches ? "smooth" : "auto";
        target.scrollIntoView({ block: "start", inline: "nearest", behavior });

        correctionDelays.forEach((delay) => {
          window.setTimeout(() => {
            if (!target.isConnected) return;
            target.scrollIntoView({ block: "start", inline: "nearest", behavior: "auto" });
          }, delay);
        });

        if (updateHash && target.id) {
          window.history.pushState(null, "", `#${target.id}`);
        }
      };

      document.addEventListener("click", (event) => {
        const target = event.target;
        if (!(target instanceof Element)) return;
        const link = target.closest("a[href^='#']");
        const section = getLocalAnchorTarget(link);
        if (!section) return;
        event.preventDefault();
        scrollToAnchorTarget(section, { smooth: true, updateHash: true });
      });

      if (window.location.hash.length > 1) {
        const initialTarget = document.getElementById(decodeURIComponent(window.location.hash.slice(1)));
        if (initialTarget) {
          window.setTimeout(() => scrollToAnchorTarget(initialTarget, { smooth: false, updateHash: false }), 120);
        }
      }
    };

    // ==========================================================================
    // One-page navigation state
    // ==========================================================================
    // One-page nav helper: highlights the section closest to the current viewport marker.
    const sectionLinks = Array.from(document.querySelectorAll(".js-section-link[href^='#']"));
    const sections = Array.from(
      new Map(
        sectionLinks
          .map((link) => {
            const section = document.querySelector(link.getAttribute("href"));
            return section ? [section.id, section] : null;
          })
          .filter(Boolean)
      ).values()
    ).sort((a, b) => a.offsetTop - b.offsetTop);

    const setActiveLink = (id) => {
      sectionLinks.forEach((link) => {
        const isActive = link.getAttribute("href") === `#${id}`;
        link.classList.toggle("is-active", isActive);
        if (isActive) {
          link.setAttribute("aria-current", "page");
        } else {
          link.removeAttribute("aria-current");
        }
      });
    };

    if (sections.length) {
      let activeLinkFrame = 0;
      const updateActiveOnScroll = () => {
        const marker = window.scrollY + window.innerHeight * 0.35;
        let activeSectionId = sections[0].id;

        sections.forEach((section) => {
          if (section.offsetTop <= marker) {
            activeSectionId = section.id;
          }
        });

        setActiveLink(activeSectionId);
      };

      const scheduleActiveLinkUpdate = () => {
        if (activeLinkFrame) return;
        activeLinkFrame = window.requestAnimationFrame(() => {
          activeLinkFrame = 0;
          updateActiveOnScroll();
        });
      };

      updateActiveOnScroll();
      window.addEventListener("scroll", scheduleActiveLinkUpdate, { passive: true });
    }

    // ==========================================================================
    // App boot sequence
    // ==========================================================================
    // Boot sequence: shared state first, then section modules, then global scroll/resize sync.
    setLanguage(currentLang);
    initOnePageTracking();

    initLeadCaptureSection();
    initContactBot();
    initHeroSlider();
    initWhenNearSection("oferta", initWhySection, "400px 0px");
    initWhenNearSection("dostawa", initCoverageSection, "900px 0px");
    initWhenNearSection("proces", initProcessSection, "900px 0px");
    initWhenNearSection("menu", initMenuSection, "1000px 0px");
    initWhenNearSection("opinie", initProofSection, "900px 0px");
    initWhenNearSection("faq", initFaqSection, "700px 0px");
    initStableAnchorNavigation();
    updateBrandDockShift();
    syncDockedHeader();

    let headerSyncFrame = 0;
    const scheduleDockedHeaderSync = () => {
      if (headerSyncFrame) return;
      headerSyncFrame = window.requestAnimationFrame(() => {
        headerSyncFrame = 0;
        syncDockedHeader();
      });
    };

    window.addEventListener("scroll", scheduleDockedHeaderSync, { passive: true });
    window.addEventListener("resize", () => {
      updateBrandDockShift();
      syncDockedHeader();
    });
    window.addEventListener("load", () => {
      updateBrandDockShift();
      syncDockedHeader();
    });
