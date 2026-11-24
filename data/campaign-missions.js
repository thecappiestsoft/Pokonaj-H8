/* Misja: STOP HATE – pięć misji kampanii (PL / EN) */
window.PH8.data.campaign = {
  version: 1,
  intro: {
    pl: 'Wasza szkoła startuje z kampanią STOP HATE. Każda misja to inne zadanie – a za każdą zdobywacie jedno słowo wspólnego hasła.',
    en: 'Your school is launching the STOP HATE campaign. Each mission is a different task – and each one earns a word of your shared motto.'
  },
  missions: [
    {
      id: 'mission-01', gameType: 'classify', contentRef: 'hejtDetector.categories', maxXp: 200, time: '4–5',
      title: { pl: 'Rozpoznaj problem', en: 'Spot the problem' },
      description: { pl: 'Krótkie zadania klasyfikacyjne.', en: 'Short classification tasks.' },
      rules: { pl: 'Przypisz każdą wypowiedź do właściwej kategorii. 4 wypowiedzi, po 50 XP za każdą.', en: 'Assign each message to the right category. 4 messages, 50 XP each.' },
      completionRule: { type: 'finishAll' },
      reward: { pl: 'Szacunek', en: 'Respect' },
      takeaway: { pl: 'Nie każda przykra wypowiedź to hejt – ale każdą warto ocenić w kontekście.', en: 'Not every unkind message is hate – but each one deserves to be judged in context.' },
      content: {
        options: ['criticism', 'joke', 'conflict', 'hate', 'cyberbullying'],
        items: [
          { id: 'm1-1', prompt: { pl: '„Twoja analiza ma błąd w drugim kroku – sprawdź wzór.”', en: '“Your analysis has a mistake in step two – check the formula.”' }, correct: 'criticism', explanation: { pl: 'Dotyczy pracy i wskazuje, co poprawić.', en: 'It’s about the work and says what to fix.' } },
          { id: 'm1-2', prompt: { pl: 'Od miesiąca ktoś codziennie publikuje ośmieszające komentarze pod każdym zdjęciem jednej osoby.', en: 'For a month someone has posted mocking comments under every photo of one person, daily.' }, correct: 'cyberbullying', explanation: { pl: 'Powtarzalne, celowe krzywdzenie w sieci.', en: 'Repeated, deliberate harm online.' } },
          { id: 'm1-3', prompt: { pl: 'Dwie osoby ostro spierają się, kto ma prezentować projekt. Bez obelg.', en: 'Two people argue sharply about who should present the project. No insults.' }, correct: 'conflict', explanation: { pl: 'Spór równorzędnych stron o konkretną sprawę.', en: 'A dispute between equals about a specific issue.' } },
          { id: 'm1-4', prompt: { pl: '„Ludzie z twojej dzielnicy to sami nieudacznicy.”', en: '“People from your neighbourhood are all losers.”' }, correct: 'hate', explanation: { pl: 'Poniżanie ze względu na przynależność do grupy.', en: 'Degrading someone for belonging to a group.' } }
        ]
      }
    },
    {
      id: 'mission-02', gameType: 'traces', maxXp: 200, time: '4–6',
      title: { pl: 'Ślady w sieci', en: 'Online traces' },
      description: { pl: 'Analiza fikcyjnych wpisów i reakcji.', en: 'Analysing fictional posts and reactions.' },
      rules: { pl: 'Oceń każdy komentarz pod postem: pomaga czy pogarsza sytuację?', en: 'Rate each comment under the post: does it help or make things worse?' },
      completionRule: { type: 'finishAll' },
      reward: { pl: 'jest', en: 'is' },
      takeaway: { pl: 'Każdy komentarz zostawia ślad – i wpływa na to, co widzą inni.', en: 'Every comment leaves a trace – and shapes what others see.' },
      content: {
        post: { author: 'plotki.szkola', initials: 'PS', text: { pl: '📸 [zdjęcie] Zobaczcie, jak ktoś „tańczy” na apelu 😂', en: '📸 [photo] Look at someone’s “dancing” at the assembly 😂' } },
        comments: [
          { id: 'm2-1', author: 'ola_k', text: { pl: 'Usuńcie to, nie macie jego zgody.', en: 'Delete this, you don’t have his consent.' }, effect: 'helps', explanation: { pl: 'Spokojna reakcja odnosząca się do zasady zgody.', en: 'A calm response referring to consent.' } },
          { id: 'm2-2', author: 'bartek99', text: { pl: '😂😂😂 oznaczam całą klasę', en: '😂😂😂 tagging the whole class' }, effect: 'harms', explanation: { pl: 'Oznaczanie innych zwiększa zasięg krzywdzącej treści.', en: 'Tagging others increases the reach of hurtful content.' } },
          { id: 'm2-3', author: 'mila.art', text: { pl: 'Zgłosiłam ten post. Kto chce, niech też zgłosi.', en: 'I reported this post. Anyone can report it too.' }, effect: 'helps', explanation: { pl: 'Zgłoszenie to bezpieczne i skuteczne działanie.', en: 'Reporting is a safe and effective action.' } },
          { id: 'm2-4', author: 'anon_77', text: { pl: 'Autor tego profilu to frajer, znajdźmy go!', en: 'Whoever runs this page is a loser, let’s find them!' }, effect: 'harms', explanation: { pl: 'Nawoływanie do „polowania” na autora eskaluje konflikt.', en: 'Calling for a “hunt” for the author escalates the conflict.' } },
          { id: 'm2-5', author: 'tech_tomek', text: { pl: 'Napisałem do niego prywatnie, że jestem po jego stronie.', en: 'I messaged him privately to say I’m on his side.' }, effect: 'helps', explanation: { pl: 'Wsparcie osoby, której dotyczy wpis.', en: 'Supporting the person the post is about.' } }
        ]
      }
    },
    {
      id: 'mission-03', gameType: 'bystander', maxXp: 200, time: '3–5',
      title: { pl: 'Efekt widowni', en: 'The bystander effect' },
      description: { pl: 'Wybór działań świadka.', en: 'Choosing bystander actions.' },
      rules: { pl: 'Zaznacz wszystkie działania, które może bezpiecznie podjąć świadek.', en: 'Select all the actions a bystander can safely take.' },
      completionRule: { type: 'finishAll' },
      reward: { pl: 'naszą', en: 'our' },
      takeaway: { pl: 'Gdy wszyscy patrzą, każdy myśli, że zareaguje ktoś inny. Ty możesz być tą osobą – bezpiecznie.', en: 'When everyone is watching, each person thinks someone else will act. You can be that person – safely.' },
      content: {
        situation: { pl: 'Na przerwie grupa osób nagrywa telefonem, jak ktoś z klasy jest przedrzeźniany. Wokół stoi kilkanaście osób.', en: 'At break, a group is filming someone from the class being mimicked. A dozen people are standing around.' },
        actions: [
          { id: 'm3-1', good: true, label: { pl: 'Podejść do osoby i zaproponować, żeby poszła ze mną', en: 'Walk up to the person and invite them to come with me' }, explanation: { pl: 'Odciągnięcie z sytuacji, bez konfrontacji.', en: 'Removing them from the situation without confrontation.' } },
          { id: 'm3-2', good: false, label: { pl: 'Też nagrać – przyda się na później', en: 'Film it too – it might come in handy' }, explanation: { pl: 'Kolejne nagranie to kolejna widownia i ryzyko rozpowszechnienia.', en: 'Another recording means another audience and risk of spreading.' } },
          { id: 'm3-3', good: true, label: { pl: 'Pójść po nauczyciela dyżurującego', en: 'Go and get the teacher on duty' }, explanation: { pl: 'Dorosły może przerwać sytuację.', en: 'An adult can stop the situation.' } },
          { id: 'm3-4', good: false, label: { pl: 'Odejść – to nie moja sprawa', en: 'Walk away – not my business' }, explanation: { pl: 'Brak reakcji wzmacnia efekt widowni.', en: 'Doing nothing reinforces the bystander effect.' } },
          { id: 'm3-5', good: true, label: { pl: 'Poprosić znajomych, żeby przestali się przyglądać', en: 'Ask friends to stop watching' }, explanation: { pl: 'Mniej widowni = mniej „nagrody” dla przedrzeźniających.', en: 'Less audience = less “reward” for those mocking.' } },
          { id: 'm3-6', good: false, label: { pl: 'Wyśmiać głośno tych, którzy nagrywają', en: 'Loudly mock the people filming' }, explanation: { pl: 'Ośmieszanie w odpowiedzi eskaluje konflikt.', en: 'Mocking back escalates the conflict.' } }
        ]
      }
    },
    {
      id: 'mission-04', gameType: 'branch', maxXp: 200, time: '4–6',
      title: { pl: 'Trudne decyzje', en: 'Tough decisions' },
      description: { pl: 'Krótki scenariusz rozgałęziony.', en: 'A short branching scenario.' },
      rules: { pl: 'Podejmij dwie decyzje. Każda bezpieczna decyzja daje 100 XP.', en: 'Make two decisions. Each safe decision gives 100 XP.' },
      completionRule: { type: 'reachEnd' },
      reward: { pl: 'wspólną', en: 'shared' },
      takeaway: { pl: 'Bezpieczna reakcja to taka, która chroni osobę pokrzywdzoną i nie naraża ciebie.', en: 'A safe reaction protects the person being hurt and doesn’t put you at risk.' },
      content: {
        start: 'n1',
        nodes: {
          n1: {
            text: { pl: 'Kolega pokazuje ci w telefonie przerobione zdjęcie koleżanki i mówi: „Wyślij dalej, będzie beka”.', en: 'A classmate shows you an edited photo of a girl from class and says: “Send it on, it’ll be hilarious”.' },
            choices: [
              { label: { pl: 'Odmawiam i mówię, że to nie w porządku', en: 'I refuse and say it’s not okay' }, safe: true, next: 'n2', feedback: { pl: 'Odmowa zatrzymuje rozpowszechnianie.', en: 'Refusing stops it spreading.' } },
              { label: { pl: 'Wysyłam tylko jednej osobie', en: 'I send it to just one person' }, safe: false, next: 'n2', feedback: { pl: 'Nawet jedno udostępnienie może puścić treść w obieg.', en: 'Even one share can set the content circulating.' } }
            ]
          },
          n2: {
            text: { pl: 'Wieczorem zdjęcie i tak krąży po grupach. Koleżanka pisze, że nie wie, co robić.', en: 'By evening the photo is circulating in groups anyway. The girl writes that she doesn’t know what to do.' },
            choices: [
              { label: { pl: 'Radzę jej zachować dowody i proponuję wspólną rozmowę z wychowawcą', en: 'I advise her to keep evidence and offer to talk to the form tutor together' }, safe: true, next: 'END', feedback: { pl: 'Dowody i zaufany dorosły to najlepsza droga.', en: 'Evidence and a trusted adult are the best route.' } },
              { label: { pl: 'Radzę jej, żeby „odpowiedziała tym samym”', en: 'I advise her to “give them a taste of their own medicine”' }, safe: false, next: 'END', feedback: { pl: 'Odwet eskaluje sytuację i może jej zaszkodzić.', en: 'Retaliation escalates things and may harm her.' } }
            ]
          }
        }
      }
    },
    {
      id: 'mission-05', gameType: 'rules', maxXp: 200, time: '4–6',
      title: { pl: 'Zmień zasady gry', en: 'Change the rules of the game' },
      description: { pl: 'Wspólne opracowanie zasad bezpiecznej klasy.', en: 'Creating safe-class rules together.' },
      rules: { pl: 'Wybierzcie zasady do kodeksu klasy. Tylko te, które naprawdę budują bezpieczeństwo.', en: 'Choose rules for your class code. Only the ones that truly build safety.' },
      completionRule: { type: 'finishAll' },
      reward: { pl: 'zasadą.', en: 'rule.' },
      takeaway: { pl: 'Zasady działają, gdy tworzymy je razem i razem ich pilnujemy.', en: 'Rules work when we create them together and uphold them together.' },
      content: {
        rules: [
          { id: 'm5-1', good: true, label: { pl: 'Nie publikujemy zdjęć bez zgody', en: 'We don’t post photos without consent' } },
          { id: 'm5-2', good: true, label: { pl: 'Krytykujemy pomysły, nie osoby', en: 'We criticise ideas, not people' } },
          { id: 'm5-3', good: false, label: { pl: 'Każdy radzi sobie sam', en: 'Everyone deals with things alone' } },
          { id: 'm5-4', good: true, label: { pl: 'Zgłaszamy krzywdzące treści', en: 'We report hurtful content' } },
          { id: 'm5-5', good: false, label: { pl: 'Nie mówimy dorosłym, co się dzieje w klasie', en: 'We don’t tell adults what happens in class' } },
          { id: 'm5-6', good: true, label: { pl: 'Wspieramy osoby, którym dzieje się krzywda', en: 'We support people who are being hurt' } },
          { id: 'm5-7', good: true, label: { pl: 'Pytamy, zanim kogoś oznaczymy', en: 'We ask before tagging someone' } },
          { id: 'm5-8', good: false, label: { pl: 'Żart jest zawsze w porządku', en: 'A joke is always okay' } }
        ]
      }
    }
  ],
  finale: {
    title: { pl: 'Kampania zakończona!', en: 'Campaign complete!' },
    text: { pl: 'Wszystkie misje wykonane. Wasze wspólne hasło brzmi:', en: 'All missions accomplished. Your shared motto is:' }
  },
  summary: {
    pl: 'Rozpoznawanie problemu, analiza reakcji, działanie świadka, trudne decyzje i wspólne zasady – to razem tworzy klasę, w której hejt nie ma miejsca.',
    en: 'Spotting the problem, analysing reactions, acting as a bystander, tough decisions and shared rules – together they create a class with no room for hate.'
  },
  discussion: [
    { pl: 'Która misja była dla was najważniejsza i dlaczego?', en: 'Which mission mattered most to you, and why?' },
    { pl: 'Jak możemy wprowadzić nasz kodeks w życie?', en: 'How can we put our class code into practice?' },
    { pl: 'Co zrobić, gdy ktoś łamie wspólne zasady?', en: 'What should we do when someone breaks the shared rules?' }
  ]
};
