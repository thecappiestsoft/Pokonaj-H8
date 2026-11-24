/* Bitwa na Argumenty – tezy, pytania pomocnicze i rubryka (PL / EN) */
window.PH8.data.debate = {
  version: 1,
  prepSeconds: 120,
  speechSeconds: 60,
  xpPerRound: 50,
  rubric: [
    { id: 'relevance', label: { pl: 'Trafność argumentu', en: 'Relevance of the argument' },
      strength: { pl: 'Trafne, celne argumenty.', en: 'Relevant, on-point arguments.' },
      tip: { pl: 'Zastanówcie się, który argument najmocniej wspiera wasze stanowisko.', en: 'Think about which argument best supports your position.' } },
    { id: 'justification', label: { pl: 'Uzasadnienie', en: 'Justification' },
      strength: { pl: 'Dobre uzasadnienie i przykłady.', en: 'Good reasoning and examples.' },
      tip: { pl: 'Dodajcie przykład lub wyjaśnienie „dlaczego”.', en: 'Add an example or explain “why”.' } },
    { id: 'topic', label: { pl: 'Odniesienie do tematu', en: 'Staying on topic' },
      strength: { pl: 'Wypowiedź trzymała się tematu.', en: 'The speech stayed on topic.' },
      tip: { pl: 'Wracajcie do tezy – sprawdźcie, czy każdy argument jej dotyczy.', en: 'Come back to the statement – check that each argument relates to it.' } },
    { id: 'respect', label: { pl: 'Szacunek w wypowiedzi', en: 'Respectful tone' },
      strength: { pl: 'Pełen szacunku sposób mówienia.', en: 'A respectful way of speaking.' },
      tip: { pl: 'Odnoście się do argumentów, nie do osób z drugiej drużyny.', en: 'Respond to arguments, not to people on the other team.' } },
    { id: 'solution', label: { pl: 'Propozycja rozwiązania', en: 'Proposed solution' },
      strength: { pl: 'Konkretna propozycja rozwiązania.', en: 'A concrete proposed solution.' },
      tip: { pl: 'Zaproponujcie jeden konkretny krok, który można wprowadzić w klasie.', en: 'Propose one concrete step the class could take.' } }
  ],
  topics: [
    {
      id: 'deb-01',
      statement: { pl: 'Brak reakcji na hejt może wzmacniać problem.', en: 'Not reacting to hate can make the problem worse.' },
      prompts: [
        { pl: 'Jak milczenie świadków odbiera osoba atakowana?', en: 'How does the targeted person perceive bystanders’ silence?' },
        { pl: 'Czy zawsze trzeba reagować publicznie?', en: 'Do you always have to react publicly?' },
        { pl: 'Jakie są bezpieczne formy reakcji?', en: 'What are safe ways to react?' }
      ],
      moderatorHint: { pl: 'Zwróć uwagę, czy drużyny odróżniają reakcję publiczną od prywatnego wsparcia i zgłoszenia.', en: 'Notice whether teams distinguish public reactions from private support and reporting.' }
    },
    {
      id: 'deb-02',
      statement: { pl: 'Żart przestaje być zabawny, gdy krzywdzi.', en: 'A joke stops being funny when it hurts.' },
      prompts: [
        { pl: 'Kto decyduje, czy żart jest zabawny?', en: 'Who decides whether a joke is funny?' },
        { pl: 'Po czym poznać, że ktoś poczuł się urażony?', en: 'How can you tell someone feels hurt?' },
        { pl: 'Co zrobić, gdy niechcący kogoś zranisz?', en: 'What should you do if you hurt someone by accident?' }
      ],
      moderatorHint: { pl: 'Pilnuj, by nie przytaczać realnych żartów o osobach z klasy.', en: 'Make sure nobody quotes real jokes about people in the class.' }
    },
    {
      id: 'deb-03',
      statement: { pl: 'Świadek może pomóc, nie narażając się na bezpośrednią konfrontację.', en: 'A bystander can help without risking direct confrontation.' },
      prompts: [
        { pl: 'Jakie działania „z drugiego planu” są skuteczne?', en: 'Which “behind the scenes” actions are effective?' },
        { pl: 'Kiedy warto poprosić o pomoc dorosłego?', en: 'When is it worth asking an adult for help?' },
        { pl: 'Jak wesprzeć osobę po zdarzeniu?', en: 'How can you support the person afterwards?' }
      ],
      moderatorHint: { pl: 'Doceniaj konkretne, bezpieczne propozycje (zgłoszenie, wsparcie, dorosły).', en: 'Reward concrete, safe proposals (reporting, support, an adult).' }
    },
    {
      id: 'deb-04',
      statement: { pl: 'Anonimowość w sieci sprzyja hejtowi.', en: 'Online anonymity encourages hate.' },
      prompts: [
        { pl: 'Dlaczego ludzie piszą w sieci rzeczy, których nie powiedzieliby w twarz?', en: 'Why do people write things online they wouldn’t say face to face?' },
        { pl: 'Czy anonimowość ma też dobre strony?', en: 'Does anonymity also have upsides?' },
        { pl: 'Co mogą zrobić serwisy i użytkownicy?', en: 'What can platforms and users do?' }
      ],
      moderatorHint: { pl: 'Dobre wypowiedzi pokazują obie strony – anonimowość chroni też np. osoby szukające pomocy.', en: 'Good answers show both sides – anonymity also protects, e.g., people seeking help.' }
    },
    {
      id: 'deb-05',
      statement: { pl: 'Szkoła powinna mieć wspólny kodeks zachowania w sieci.', en: 'A school should have a shared code of online conduct.' },
      prompts: [
        { pl: 'Kto powinien tworzyć taki kodeks?', en: 'Who should create such a code?' },
        { pl: 'Jak sprawić, by zasady były przestrzegane?', en: 'How do you make sure the rules are followed?' },
        { pl: 'Jakie trzy zasady byłyby najważniejsze?', en: 'Which three rules would matter most?' }
      ],
      moderatorHint: { pl: 'Zachęcaj do konkretnych propozycji zasad i sposobu ich wprowadzenia.', en: 'Encourage concrete rule proposals and ways to introduce them.' }
    },
    {
      id: 'deb-06',
      statement: { pl: 'Udostępnienie krzywdzącej treści jest tak samo szkodliwe jak jej opublikowanie.', en: 'Sharing hurtful content is as harmful as posting it.' },
      prompts: [
        { pl: 'Jak udostępnienia wpływają na zasięg?', en: 'How do shares affect reach?' },
        { pl: 'Czy intencja udostępniającego ma znaczenie?', en: 'Does the sharer’s intention matter?' },
        { pl: 'Co zrobić zamiast udostępniania?', en: 'What can you do instead of sharing?' }
      ],
      moderatorHint: { pl: 'Doceniaj rozróżnienie: zachowanie dowodu bez rozsyłania ≠ udostępnienie.', en: 'Reward the distinction: keeping evidence without sending it on ≠ sharing.' }
    }
  ],
  summary: {
    pl: 'Dobra dyskusja to argumenty, uzasadnienie i szacunek – nie siła głosu ani ośmieszanie. Ostateczna ocena należy do prowadzącego.',
    en: 'A good discussion is about arguments, reasoning and respect – not volume or ridicule. The final assessment belongs to the facilitator.'
  },
  discussion: [
    { pl: 'Który argument drugiej drużyny was przekonał?', en: 'Which argument from another team convinced you?' },
    { pl: 'Jak rozmawiać, gdy się z kimś nie zgadzamy, nie obrażając go?', en: 'How can we talk when we disagree without insulting each other?' },
    { pl: 'Czego nauczyliście się od obserwatorów i notujących?', en: 'What did you learn from the observers and note-takers?' }
  ]
};
