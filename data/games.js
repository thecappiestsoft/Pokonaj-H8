/* Metadane siedmiu trybów gry: nazwa, opis, czas, cel, zasady, sterowanie (PL / EN) */
window.PH8.data.games = {
  'hejt-detector': {
    num: 1,
    time: '10–15',
    name: { pl: 'Hejt Detector', en: 'Hate Detector' },
    desc: {
      pl: 'Rozpoznaj, czy to krytyka, żart, konflikt, hejt czy cyberprzemoc. Liczy się kontekst!',
      en: 'Tell criticism, jokes, conflict, hate and cyberbullying apart. Context matters!'
    },
    goal: {
      pl: 'Rozpoznawanie różnicy między krytyką, żartem, konfliktem, hejtem i cyberprzemocą z uwzględnieniem kontekstu.',
      en: 'Learn to tell criticism, jokes, conflict, hate and cyberbullying apart – always taking context into account.'
    },
    rules: [
      { pl: 'Przeczytaj fikcyjną wypowiedź i opis sytuacji.', en: 'Read the fictional message and the description of the situation.' },
      { pl: 'Wybierz jedną kategorię. Gdy informacji jest za mało – wybierz „Potrzebny kontekst”.', en: 'Choose one category. If there is not enough information – choose “Context needed”.' },
      { pl: 'Po każdej odpowiedzi zobaczysz krótkie wyjaśnienie.', en: 'After each answer you will see a short explanation.' },
      { pl: '100 pkt za poprawną odpowiedź. Przy włączonym timerze – do 20 pkt bonusu za szybkość.', en: '100 points for a correct answer. With the timer on – up to 20 bonus points for speed.' },
      { pl: 'Możesz pominąć pytanie – wróci na koniec kolejki. Wynik nigdy nie jest ujemny.', en: 'You can skip a question – it returns at the end of the queue. The score is never negative.' }
    ],
    controls: {
      pl: 'Klikaj duże przyciski kategorii lub użyj klawiatury (Tab + Enter). W trybie drużynowym drużyny odpowiadają po kolei.',
      en: 'Click the large category buttons or use the keyboard (Tab + Enter). In team mode, teams answer in turns.'
    },
    timerNote: { pl: '30 sekund na pytanie', en: '30 seconds per question' }
  },
  'social-media-challenge': {
    num: 2,
    time: '15–25',
    name: { pl: 'Social Media Challenge', en: 'Social Media Challenge' },
    desc: {
      pl: 'Wejdź do fikcyjnego serwisu KlasaNet i zobacz, jak reakcje i milczenie świadków zmieniają sytuację.',
      en: 'Step into the fictional ClassNet feed and see how reactions and bystander silence shape what happens.'
    },
    goal: {
      pl: 'Pokazanie, jak reakcje użytkowników, udostępnienia i milczenie świadków wpływają na rozwój sytuacji w cyfrowym środowisku.',
      en: 'Show how user reactions, shares and bystander silence influence how a situation develops online.'
    },
    rules: [
      { pl: 'Przeglądasz fikcyjny kanał klasy: posty, komentarze i wiadomości.', en: 'You browse a fictional class channel: posts, comments and messages.' },
      { pl: 'W 5 turach wybierasz działanie: wesprzeć, zgłosić, zareagować, porozmawiać, zachować dowód lub poprosić o pomoc.', en: 'In 5 turns you choose an action: support, report, respond, talk, keep evidence or ask for help.' },
      { pl: 'Każda decyzja zmienia wskaźniki: bezpieczeństwo, zaufanie i napięcie (0–100). Nie wszystkie skutki są natychmiastowe.', en: 'Each decision changes the meters: safety, trust and tension (0–100). Not all effects are immediate.' },
      { pl: 'Punkty zdobywasz za działania wspierające i szukanie pomocy – nie za „karanie” postaci. Maksymalnie 500 XP.', en: 'You earn points for supportive actions and seeking help – not for “punishing” characters. Up to 500 XP.' }
    ],
    controls: {
      pl: 'Wybierz jedno z działań w panelu decyzji, przeczytaj konsekwencję i przejdź dalej.',
      en: 'Pick one of the actions in the decision panel, read the consequence and continue.'
    }
  },
  'twoja-decyzja': {
    num: 3,
    time: '15–25',
    name: { pl: 'Twoja Decyzja', en: 'Your Decision' },
    desc: {
      pl: 'Interaktywna opowieść o nowej klasie. Twoje wybory prowadzą do różnych zakończeń.',
      en: 'An interactive story about a new class. Your choices lead to different endings.'
    },
    goal: {
      pl: 'Rozwijanie umiejętności przewidywania konsekwencji i wyboru bezpiecznej reakcji w sytuacjach szkolnych.',
      en: 'Practise predicting consequences and choosing a safe reaction in school situations.'
    },
    rules: [
      { pl: 'Historia składa się ze scen – w każdej wybierasz jedną reakcję.', en: 'The story is made of scenes – in each one you choose one reaction.' },
      { pl: 'Po wyborze zobaczysz możliwy skutek, ryzyko i bezpieczniejszą alternatywę.', en: 'After choosing you will see the possible effect, the risk and a safer alternative.' },
      { pl: 'Zakończenie zależy od kilku decyzji, a nie tylko od jednej.', en: 'The ending depends on several decisions, not just one.' },
      { pl: 'Możesz przejść historię ponownie i odkryć inne zakończenia.', en: 'You can replay the story and discover other endings.' },
      { pl: 'W każdej chwili możesz przerwać i przejść do informacji o szukaniu pomocy.', en: 'At any moment you can stop and go to information about getting help.' }
    ],
    controls: {
      pl: 'Klikaj przyciski wyborów. Przycisk „Potrzebuję przerwy” przenosi do ekranu pomocy.',
      en: 'Click the choice buttons. The “I need a break” button takes you to the help screen.'
    }
  },
  'detektywi-internetu': {
    num: 4,
    time: '20–30',
    name: { pl: 'Detektywi Internetu', en: 'Internet Detectives' },
    desc: {
      pl: 'Przeanalizuj fikcyjną sprawę: oddziel fakty od opinii i domysłów, a potem wskaż bezpieczne kroki.',
      en: 'Analyse a fictional case: separate facts from opinions and guesses, then point out safe steps.'
    },
    goal: {
      pl: 'Analizowanie fikcyjnych materiałów i rozpoznawanie ról uczestników zdarzenia – bez zachęcania do samodzielnego śledztwa wobec prawdziwych osób.',
      en: 'Analyse fictional materials and recognise the roles of people involved – without encouraging anyone to investigate real people.'
    },
    rules: [
      { pl: 'Odkrywaj karty dowodów: fragmenty czatu, relacje świadków, chronologię.', en: 'Reveal evidence cards: chat excerpts, witness statements, the timeline.' },
      { pl: 'Przypisz każdą kartę do kategorii: fakt, opinia, przypuszczenie, reakcja świadka, działanie wspierające.', en: 'Assign each card to a category: fact, opinion, assumption, bystander reaction, supportive action.' },
      { pl: 'Odpowiedz na pytania i złóż raport: co wiemy, czego nie wiemy, co należy zrobić.', en: 'Answer questions and file a report: what we know, what we don’t know, what should be done.' },
      { pl: 'Celem nie jest wskazanie winnego, tylko odróżnienie faktów od domysłów.', en: 'The goal is not to name a culprit but to tell facts from guesses.' }
    ],
    controls: {
      pl: 'Przeciągnij kartę do kategorii albo kliknij kartę, a potem kategorię (działa też dotykiem i klawiaturą). Kartę zawsze można przenieść ponownie.',
      en: 'Drag a card onto a category, or click a card and then a category (works with touch and keyboard too). You can always move a card again.'
    },
    timerNote: { pl: 'nie dotyczy tej gry', en: 'not used in this game' }
  },
  'escape-room': {
    num: 5,
    time: '25–35',
    name: { pl: 'Escape Room – Kod do Szacunku', en: 'Escape Room – The Respect Code' },
    desc: {
      pl: 'Rozwiążcie pięć zagadek, zbierzcie cyfry kodu i otwórzcie ostatnie drzwi.',
      en: 'Solve five puzzles, collect the code digits and open the final door.'
    },
    goal: {
      pl: 'Utrwalanie wiedzy przez rozwiązywanie zagadek i współpracę.',
      en: 'Consolidate knowledge by solving puzzles and working together.'
    },
    rules: [
      { pl: 'Pięć zamków – każdy kryje zagadkę. Rozwiązanie daje cyfrę kodu i otwiera kolejny zamek.', en: 'Five locks – each hides a puzzle. Solving it gives a code digit and opens the next lock.' },
      { pl: 'Każdy etap: do 100 XP. Podpowiedź kosztuje 30 pkt, ale nigdy nie blokuje gry.', en: 'Each stage: up to 100 XP. A hint costs 30 points but never blocks the game.' },
      { pl: 'Błędna odpowiedź lub kod nie resetuje postępu – spróbujcie ponownie.', en: 'A wrong answer or code does not reset progress – just try again.' },
      { pl: 'Prowadzący ma przycisk awaryjnego przejścia.', en: 'The facilitator has an emergency pass button.' }
    ],
    controls: {
      pl: 'Wszystkie zagadki działają myszą, dotykiem i klawiaturą. Kod wpisz w polu i zatwierdź Enterem.',
      en: 'All puzzles work with mouse, touch and keyboard. Type the code in the field and press Enter.'
    },
    timerNote: { pl: 'opcjonalne 30 minut, bez kar', en: 'optional 30 minutes, no penalties' }
  },
  'misja-stop-hate': {
    num: 6,
    time: '20–30',
    name: { pl: 'Misja: STOP HATE', en: 'Mission: STOP HATE' },
    desc: {
      pl: 'Kampania pięciu krótkich misji – każda z inną mechaniką i elementem wspólnego hasła.',
      en: 'A campaign of five short missions – each with a different mechanic and a piece of a shared motto.'
    },
    goal: {
      pl: 'Połączenie kilku umiejętności w fabularną kampanię złożoną z misji.',
      en: 'Combine several skills in a story-driven campaign made of missions.'
    },
    rules: [
      { pl: 'Mapa kampanii ma pięć misji. Kolejne odblokowują się po ukończeniu poprzedniej.', en: 'The campaign map has five missions. Each unlocks after the previous one is completed.' },
      { pl: 'Tryb swobodny pozwala uruchomić dowolną misję.', en: 'Free mode lets you start any mission.' },
      { pl: 'Każda misja daje do 200 XP i jedno słowo wspólnego hasła.', en: 'Each mission gives up to 200 XP and one word of the shared motto.' },
      { pl: 'Każda misja kończy się jednym wnioskiem do zapamiętania.', en: 'Each mission ends with one key takeaway.' }
    ],
    controls: {
      pl: 'Wybierz misję na mapie, przeczytaj kartę misji i kliknij „Rozpocznij misję”.',
      en: 'Pick a mission on the map, read the mission card and click “Start mission”.'
    },
    timerNote: { pl: 'nie dotyczy tej gry', en: 'not used in this game' }
  },
  'bitwa-na-argumenty': {
    num: 7,
    time: '20–30',
    name: { pl: 'Bitwa na Argumenty', en: 'Battle of Arguments' },
    desc: {
      pl: 'Drużyny przedstawiają argumenty, a moderator ocenia je według jawnej rubryki – z szacunkiem.',
      en: 'Teams present arguments and the moderator scores them with an open rubric – respectfully.'
    },
    goal: {
      pl: 'Ćwiczenie krytycznego myślenia, argumentowania i prowadzenia rozmowy bez obrażania innych.',
      en: 'Practise critical thinking, argumentation and having a conversation without insulting others.'
    },
    rules: [
      { pl: 'Moderator wybiera tezę. Drużyny mają czas na przygotowanie i wypowiedź.', en: 'The moderator picks a statement. Teams get time to prepare and to speak.' },
      { pl: 'Każda drużyna przedstawia stanowisko, argument i propozycję rozwiązania.', en: 'Each team presents a position, an argument and a proposed solution.' },
      { pl: 'Ocena 0–5 za każde z 5 kryteriów (maks. 25 pkt na rundę). Punkty można poprawić przed zatwierdzeniem.', en: 'Scores 0–5 for each of 5 criteria (max 25 per round). Scores can be corrected before confirming.' },
      { pl: 'Nie punktujemy agresji, szybkości riposty ani ośmieszania. Można być obserwatorem lub notującym.', en: 'We do not reward aggression, quick comebacks or ridicule. You can be an observer or note-taker.' }
    ],
    controls: {
      pl: 'Aplikację obsługuje moderator: wybór tezy, timery, rubryka ocen i tablica wyników.',
      en: 'The moderator operates the app: topic selection, timers, scoring rubric and scoreboard.'
    },
    timerNote: { pl: 'przygotowanie 2:00, wypowiedź 1:00', en: 'preparation 2:00, speech 1:00' }
  }
};
