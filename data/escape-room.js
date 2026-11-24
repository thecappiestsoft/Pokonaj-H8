/* Escape Room – Kod do Szacunku: pięć zagadek (PL / EN) */
window.PH8.data.escapeRoom = {
  version: 1,
  timeLimitMin: 30,
  intro: {
    pl: 'Centrum dowodzenia jest zamknięte. Każdy z pięciu zamków kryje zagadkę. Rozwiążcie je, zbierzcie cyfry i wpiszcie kod, aby otworzyć ostatnie drzwi.',
    en: 'The command centre is locked. Each of the five locks hides a puzzle. Solve them, collect the digits and enter the code to open the final door.'
  },
  stages: [
    {
      id: 'room-01', type: 'single-choice', reward: '4',
      title: { pl: 'Rozpoznaj komunikat', en: 'Recognise the message' },
      question: { pl: 'Który komunikat jest konstruktywną krytyką?', en: 'Which message is constructive criticism?' },
      options: [
        { pl: '„Twoja prezentacja była beznadziejna, jak zawsze.”', en: '“Your presentation was hopeless, as always.”' },
        { pl: '„Wykres był czytelny, ale zabrakło źródeł. Dodasz je?”', en: '“The chart was clear, but sources were missing. Will you add them?”' },
        { pl: '„Haha, kto ci to w ogóle pozwolił pokazać?”', en: '“Haha, who even let you show that?”' }
      ],
      solution: 1,
      hint: { pl: 'Szukaj wypowiedzi, która odnosi się do pracy, a nie do osoby – i coś proponuje.', en: 'Look for the message that is about the work, not the person – and suggests something.' },
      explanation: { pl: 'Konstruktywna krytyka docenia, wskazuje konkretny problem i proponuje poprawę.', en: 'Constructive criticism acknowledges, names a specific problem and suggests an improvement.' }
    },
    {
      id: 'room-02', type: 'true-false', reward: '7',
      title: { pl: 'Obal mity', en: 'Bust the myths' },
      question: { pl: 'Oceń każde zdanie: prawda czy fałsz?', en: 'Rate each statement: true or false?' },
      statements: [
        { text: { pl: 'Hejt w internecie nie ma realnych skutków – to tylko słowa na ekranie.', en: 'Online hate has no real effects – it’s just words on a screen.' }, answer: false },
        { text: { pl: 'Świadek, który zareaguje, może zatrzymać przemoc.', en: 'A bystander who reacts can stop abuse.' }, answer: true },
        { text: { pl: 'Udostępnienie krzywdzącego mema to też udział w sytuacji.', en: 'Sharing a hurtful meme is also taking part in the situation.' }, answer: true },
        { text: { pl: 'Jeśli ktoś się nie skarży, to znaczy, że wszystko jest w porządku.', en: 'If someone doesn’t complain, everything must be fine.' }, answer: false }
      ],
      hint: { pl: 'Pomyśl o tym, co czuje osoba po drugiej stronie ekranu – i o roli świadków.', en: 'Think about how the person on the other side of the screen feels – and about bystanders’ role.' },
      explanation: { pl: 'Słowa w sieci ranią naprawdę, a świadkowie mają realny wpływ – na dobre i na złe. Milczenie nie oznacza, że wszystko jest dobrze.', en: 'Online words really hurt, and bystanders have real influence – for better or worse. Silence doesn’t mean everything is fine.' }
    },
    {
      id: 'room-03', type: 'match', reward: '1',
      title: { pl: 'Do kogo po pomoc?', en: 'Who can help?' },
      question: { pl: 'Dopasuj sytuację do osoby lub miejsca, które mogą pomóc.', en: 'Match each situation with the person or place that can help.' },
      options: [
        { pl: 'Pedagog lub psycholog szkolny', en: 'School counsellor or psychologist' },
        { pl: 'Zgłoszenie do moderatora / administratora serwisu', en: 'Report to the platform moderator / admin' },
        { pl: 'Zaufany dorosły, a przy zagrożeniu – odpowiednie służby', en: 'A trusted adult and, if in danger, the emergency services' },
        { pl: 'Wychowawca klasy', en: 'Form tutor' }
      ],
      pairs: [
        { situation: { pl: 'Chcesz porozmawiać o tym, jak się czujesz po hejcie.', en: 'You want to talk about how you feel after online hate.' }, answer: 0 },
        { situation: { pl: 'Na stronie z memami wisi krzywdzący post o koledze.', en: 'A hurtful post about a classmate is on a meme page.' }, answer: 1 },
        { situation: { pl: 'Ktoś grozi ci w wiadomościach, że zrobi ci krzywdę.', en: 'Someone threatens in messages to hurt you.' }, answer: 2 },
        { situation: { pl: 'Na klasowym czacie ciągle ktoś kogoś wyśmiewa.', en: 'In the class chat someone keeps mocking another person.' }, answer: 3 }
      ],
      hint: { pl: 'Groźby to sytuacja zagrożenia – wymagają dorosłych i czasem służb. Emocje – rozmowy ze specjalistą.', en: 'Threats mean danger – they need adults and sometimes emergency services. Feelings – a talk with a specialist.' },
      explanation: { pl: 'Pomoc ma wiele adresów: specjaliści w szkole, wychowawca, moderatorzy serwisów, a w sytuacji zagrożenia – dorośli i służby.', en: 'Help has many addresses: school specialists, the form tutor, platform moderators and, in danger, adults and emergency services.' }
    },
    {
      id: 'room-04', type: 'multi-choice', reward: '2',
      title: { pl: 'Wybierz bezpieczne reakcje', en: 'Pick the safe reactions' },
      question: { pl: 'Widzisz, że ktoś jest wyśmiewany na czacie. Zaznacz WSZYSTKIE bezpieczne reakcje.', en: 'You see someone being mocked in a chat. Select ALL the safe reactions.' },
      options: [
        { pl: 'Wesprzeć tę osobę prywatną wiadomością', en: 'Support the person with a private message' },
        { pl: 'Dołączyć do żartów, żeby rozluźnić atmosferę', en: 'Join the jokes to lighten the mood' },
        { pl: 'Zgłosić treść moderatorowi', en: 'Report the content to a moderator' },
        { pl: 'Rozesłać zrzut ekranu znajomym', en: 'Send the screenshot around to friends' },
        { pl: 'Powiedzieć zaufanemu dorosłemu', en: 'Tell a trusted adult' },
        { pl: 'Zachować dowód bez rozsyłania', en: 'Keep evidence without sharing it' }
      ],
      solution: [0, 2, 4, 5],
      hint: { pl: 'Bezpieczne reakcje nie zwiększają zasięgu krzywdzącej treści. Są cztery.', en: 'Safe reactions don’t increase the reach of hurtful content. There are four.' },
      explanation: { pl: 'Wsparcie, zgłoszenie, rozmowa z dorosłym i zachowanie dowodu ograniczają krzywdę. Żarty i rozsyłanie ją powiększają.', en: 'Support, reporting, talking to an adult and keeping evidence limit the harm. Joking along and sharing make it bigger.' }
    },
    {
      id: 'room-05', type: 'build', reward: '5',
      title: { pl: 'Zasady wspierającej klasy', en: 'Rules of a supportive class' },
      question: { pl: 'Ułóżcie kodeks klasy: wybierzcie WSZYSTKIE zasady, które budują bezpieczną atmosferę.', en: 'Build the class code: select ALL the rules that create a safe atmosphere.' },
      options: [
        { pl: 'Publikujemy zdjęcia innych tylko za ich zgodą.', en: 'We post photos of others only with their consent.' },
        { pl: 'Kto się obraził, ten nie ma poczucia humoru.', en: 'Whoever gets offended has no sense of humour.' },
        { pl: 'Krytykujemy pomysły, nie ludzi.', en: 'We criticise ideas, not people.' },
        { pl: 'Reagujemy, gdy ktoś jest wyśmiewany – i szukamy pomocy.', en: 'We react when someone is mocked – and we look for help.' },
        { pl: 'Co dzieje się na czacie, zostaje na czacie – nawet gdy ktoś cierpi.', en: 'What happens in the chat stays in the chat – even if someone is suffering.' },
        { pl: 'Pytamy, zanim oznaczymy kogoś w poście.', en: 'We ask before tagging someone in a post.' },
        { pl: 'Odpowiadamy hejtem na hejt.', en: 'We answer hate with hate.' }
      ],
      solution: [0, 2, 3, 5],
      hint: { pl: 'Dobra zasada chroni każdą osobę w klasie – także tę, której dziś nie ma w grupie.', en: 'A good rule protects everyone in the class – including the person who isn’t in the group today.' },
      explanation: { pl: 'Zgoda, szacunek dla osób, reagowanie i pytanie o zgodę na oznaczenie to fundamenty bezpiecznej klasy.', en: 'Consent, respect for people, reacting and asking before tagging are the foundations of a safe class.' }
    }
  ],
  finalRules: [
    { pl: 'Szanujemy się – także w sieci.', en: 'We respect each other – online too.' },
    { pl: 'Nie udostępniamy krzywdzących treści.', en: 'We don’t share hurtful content.' },
    { pl: 'Wspieramy osoby, którym dzieje się krzywda.', en: 'We support people who are being hurt.' },
    { pl: 'Szukamy pomocy u zaufanych dorosłych.', en: 'We seek help from trusted adults.' }
  ],
  summary: {
    pl: 'Kod do szacunku to suma małych decyzji: rozpoznawania komunikatów, obalania mitów, wiedzy, gdzie szukać pomocy, i wspólnych zasad.',
    en: 'The respect code is the sum of small decisions: recognising messages, busting myths, knowing where to get help, and shared rules.'
  },
  discussion: [
    { pl: 'Która zagadka była najtrudniejsza i czego nas nauczyła?', en: 'Which puzzle was hardest and what did it teach us?' },
    { pl: 'Które zasady z kodeksu chcielibyście wprowadzić w naszej klasie?', en: 'Which rules from the code would you like to adopt in our class?' },
    { pl: 'Jak pracowało się wam w zespole?', en: 'How did working as a team go?' }
  ]
};
