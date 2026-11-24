/* Hejt Detector – kategorie i pula fikcyjnych wypowiedzi (PL / EN) */
window.PH8.data.hejtDetector = {
  version: 1,
  categories: [
    { id: 'criticism', icon: 'messages', label: { pl: 'Konstruktywna krytyka', en: 'Constructive criticism' }, short: { pl: 'Dotyczy działania lub pomysłu, z uzasadnieniem i bez atakowania osoby.', en: 'About an action or idea, with reasons, without attacking the person.' } },
    { id: 'joke', icon: 'smile', label: { pl: 'Żart', en: 'Joke' }, short: { pl: 'Obie strony traktują to jako zabawę; nikt nie czuje się zraniony.', en: 'Both sides treat it as fun; nobody feels hurt.' } },
    { id: 'conflict', icon: 'zap', label: { pl: 'Konflikt', en: 'Conflict' }, short: { pl: 'Spór o konkretną sprawę między stronami o podobnej pozycji.', en: 'A dispute about a specific issue between people on equal footing.' } },
    { id: 'hate', icon: 'flame', label: { pl: 'Hejt', en: 'Hate' }, short: { pl: 'Obraźliwy, poniżający atak na osobę lub grupę – często w sieci.', en: 'An insulting, degrading attack on a person or group – often online.' } },
    { id: 'cyberbullying', icon: 'alert', label: { pl: 'Cyberprzemoc', en: 'Cyberbullying' }, short: { pl: 'Celowe, powtarzalne krzywdzenie z użyciem technologii, często z przewagą sprawcy.', en: 'Deliberate, repeated harm using technology, often with an imbalance of power.' } },
    { id: 'context', icon: 'help', label: { pl: 'Potrzebny kontekst', en: 'Context needed' }, short: { pl: 'Za mało informacji, by rzetelnie ocenić sytuację.', en: 'Not enough information to judge the situation fairly.' } }
  ],
  summary: {
    pl: 'Ta sama wypowiedź może znaczyć coś innego w różnych sytuacjach. Zwracaj uwagę na kontekst, powtarzalność, intencję i skutek.',
    en: 'The same words can mean different things in different situations. Look at context, repetition, intent and impact.'
  },
  discussion: [
    { pl: 'Po czym poznać, że żart przestał być zabawny dla drugiej osoby?', en: 'How can you tell a joke has stopped being funny for the other person?' },
    { pl: 'Czym różni się jednorazowy hejt od cyberprzemocy?', en: 'What is the difference between a one-off hateful comment and cyberbullying?' },
    { pl: 'Jakich informacji brakowało w pytaniach „Potrzebny kontekst”?', en: 'What information was missing in the “Context needed” questions?' },
    { pl: 'Jak można skrytykować pomysł, nie raniąc osoby?', en: 'How can you criticise an idea without hurting the person?' }
  ],
  questions: [
    {
      id: 'hd-001', difficulty: 'easy', online: false, tags: ['krytyka', 'szkoła'],
      prompt: { pl: 'Nie zgadzam się z twoim rozwiązaniem, bo pomija koszt materiałów. Może sprawdzimy tańszą opcję?', en: 'I disagree with your solution because it ignores the cost of materials. Shall we check a cheaper option?' },
      context: { pl: 'Uczeń komentuje pomysł kolegi podczas pracy projektowej.', en: 'A student comments on a classmate’s idea during project work.' },
      correctOption: 'criticism',
      explanation: { pl: 'Wypowiedź odnosi się do pomysłu, podaje powód i proponuje rozwiązanie. Nie atakuje osoby.', en: 'The message is about the idea, gives a reason and proposes a solution. It does not attack the person.' },
      hint: { pl: 'Czy wypowiedź dotyczy osoby, czy jej pomysłu?', en: 'Is the message about the person or about their idea?' }
    },
    {
      id: 'hd-002', difficulty: 'easy', online: true, tags: ['żart', 'przyjaźń'],
      prompt: { pl: '„Znowu spóźniona? Chyba twój budzik też potrzebuje budzika 😄” – „Haha, kupię mu nowego!”', en: '“Late again? I think your alarm clock needs an alarm clock 😄” – “Haha, I’ll buy it a new one!”' },
      context: { pl: 'Prywatna rozmowa dwóch przyjaciółek. Obie odpowiadają emotkami śmiechu.', en: 'A private chat between two close friends. Both reply with laughing emojis.' },
      relation: { pl: 'Bliskie przyjaciółki, rozmowa w cztery oczy.', en: 'Close friends, a one-to-one conversation.' },
      correctOption: 'joke',
      explanation: { pl: 'To żart w relacji, w której obie strony dobrze się bawią. Żart przestaje nim być, gdy ktoś prosi, by przestać, albo czuje się zraniony.', en: 'It is a joke within a relationship where both sides enjoy it. A joke stops being one when someone asks to stop or feels hurt.' },
      hint: { pl: 'Jak reaguje osoba, do której skierowano żart?', en: 'How does the person the joke is aimed at react?' }
    },
    {
      id: 'hd-003', difficulty: 'easy', online: false, tags: ['konflikt', 'projekt'],
      prompt: { pl: '„Zawsze zostawiasz mi najgorszą robotę!” – „Bo ty nic nie oddajesz na czas!”', en: '“You always leave me the worst work!” – “Because you never hand anything in on time!”' },
      context: { pl: 'Dwoje uczniów kłóci się o podział zadań w projekcie.', en: 'Two students argue about how to split tasks in a project.' },
      correctOption: 'conflict',
      explanation: { pl: 'To wzajemny spór o konkretną sprawę między osobami o podobnej pozycji. Emocje są duże, ale to konflikt – warto go rozwiązać rozmową lub z pomocą mediatora.', en: 'It is a mutual dispute about a specific issue between people on equal footing. Emotions are high, but it is a conflict – best solved by talking or with a mediator.' },
      hint: { pl: 'Czy obie strony mają podobną „siłę” w tej rozmowie?', en: 'Do both sides have similar “power” in this exchange?' }
    },
    {
      id: 'hd-004', difficulty: 'easy', online: true, tags: ['hejt', 'pochodzenie'],
      prompt: { pl: '„Wracaj tam, skąd przyjechałeś. Tacy jak ty tu nie pasują.”', en: '“Go back where you came from. People like you don’t belong here.”' },
      context: { pl: 'Komentarz pod filmikiem ucznia, który niedawno przeprowadził się z innego kraju.', en: 'A comment under a video by a student who recently moved from another country.' },
      correctOption: 'hate',
      explanation: { pl: 'To atak na osobę ze względu na jej pochodzenie – cechę grupy, a nie zachowanie. Poniża i wyklucza, nie odnosi się do treści filmiku. To hejt o charakterze mowy nienawiści.', en: 'This attacks a person because of their origin – a group trait, not behaviour. It degrades and excludes and ignores the video’s content. It is hate with the features of hate speech.' },
      hint: { pl: 'Czy komentarz dotyczy filmiku, czy tego, kim jest autor?', en: 'Is the comment about the video or about who the author is?' }
    },
    {
      id: 'hd-005', difficulty: 'medium', online: true, tags: ['cyberprzemoc', 'fałszywe konta'],
      prompt: { pl: 'Od tygodnia ktoś zakłada kolejne konta i wysyła jednej uczennicy wiadomości ośmieszające jej wygląd – mimo że je blokuje.', en: 'For a week someone has been creating new accounts and sending one student messages mocking her looks – even though she blocks them.' },
      context: { pl: 'Uczennica nie wie, kto pisze. Wiadomości przychodzą codziennie.', en: 'The student does not know who is writing. Messages arrive every day.' },
      correctOption: 'cyberbullying',
      explanation: { pl: 'Powtarzalność, celowość, przewaga sprawcy (anonimowość) i krzywda to cechy cyberprzemocy. Warto zachować dowody i powiedzieć zaufanemu dorosłemu.', en: 'Repetition, intent, the perpetrator’s advantage (anonymity) and harm are signs of cyberbullying. It is worth keeping evidence and telling a trusted adult.' },
      hint: { pl: 'Ile razy to się powtarza i czy ofiara może to zatrzymać?', en: 'How often does it happen, and can the target stop it?' }
    },
    {
      id: 'hd-006', difficulty: 'hard', online: true, tags: ['niejednoznaczne', 'ironia'],
      prompt: { pl: '„Ale z ciebie geniusz 🙃”', en: '“Wow, what a genius 🙃”' },
      context: { pl: 'Odpowiedź na klasowym czacie pod wiadomością kolegi z pytaniem o termin sprawdzianu.', en: 'A reply in the class chat under a classmate’s question about the test date.' },
      relation: { pl: 'Nie wiadomo, jakie relacje łączą te osoby ani jak zareagował adresat.', en: 'We don’t know the relationship between them or how the recipient reacted.' },
      correctOption: 'context',
      explanation: { pl: 'Ten sam tekst może być przyjacielskim żartem, ironią albo docinkiem. Brakuje informacji o relacji, tonie, powtarzalności i reakcji adresata.', en: 'The same words could be a friendly joke, irony or a jab. We lack information about the relationship, tone, repetition and the recipient’s reaction.' },
      hint: { pl: 'Czego musisz się dowiedzieć, by ocenić tę wypowiedź?', en: 'What would you need to know to judge this message?' }
    },
    {
      id: 'hd-007', difficulty: 'easy', online: false, tags: ['krytyka', 'prezentacja'],
      prompt: { pl: '„Slajdy były czytelne, ale miały za dużo tekstu. Następnym razem dodaj więcej wykresów.”', en: '“The slides were clear but had too much text. Next time, add more charts.”' },
      context: { pl: 'Informacja zwrotna po prezentacji na lekcji.', en: 'Feedback after a class presentation.' },
      correctOption: 'criticism',
      explanation: { pl: 'Docenia mocną stronę, wskazuje konkretny problem i podpowiada, co poprawić. Wzorcowa konstruktywna krytyka.', en: 'It recognises a strength, points to a specific problem and suggests an improvement. Textbook constructive criticism.' }
    },
    {
      id: 'hd-008', difficulty: 'medium', online: true, tags: ['hejt', 'stereotyp'],
      prompt: { pl: '„Dziewczyny nie powinny grać w e-sport, bo i tak są do niczego.”', en: '“Girls shouldn’t play e-sports, they’re useless anyway.”' },
      context: { pl: 'Komentarz pod relacją ze szkolnego turnieju, w którym wygrała drużyna mieszana.', en: 'A comment under a report from a school tournament won by a mixed team.' },
      correctOption: 'hate',
      explanation: { pl: 'Wypowiedź poniża całą grupę ze względu na płeć i opiera się na stereotypie. Nie jest krytyką gry, tylko atakiem na ludzi.', en: 'It degrades a whole group because of gender and relies on a stereotype. It is not criticism of the game but an attack on people.' }
    },
    {
      id: 'hd-009', difficulty: 'medium', online: true, tags: ['cyberprzemoc', 'mem'],
      prompt: { pl: 'Ktoś przerobił zdjęcie kolegi na mem i rozsyła je na kolejne grupy, choć kolega prosił o usunięcie.', en: 'Someone turned a classmate’s photo into a meme and keeps sharing it to more groups, although the classmate asked for it to be removed.' },
      context: { pl: 'Mem krąży od kilku dni, a liczba udostępnień rośnie.', en: 'The meme has been circulating for days and shares keep growing.' },
      correctOption: 'cyberbullying',
      explanation: { pl: 'Publikacja wizerunku bez zgody, powtarzane rozsyłanie i zignorowana prośba o usunięcie to cyberprzemoc. Każde udostępnienie zwiększa krzywdę.', en: 'Publishing someone’s image without consent, sharing it repeatedly and ignoring a request to remove it is cyberbullying. Every share adds to the harm.' }
    },
    {
      id: 'hd-010', difficulty: 'easy', online: false, tags: ['konflikt', 'sport'],
      prompt: { pl: 'Na boisku dwie drużyny głośno spierają się, czy piłka była na aucie. Nikt nikogo nie obraża.', en: 'On the pitch, two teams loudly argue whether the ball was out. Nobody insults anyone.' },
      context: { pl: 'Mecz na lekcji WF-u.', en: 'A match during PE class.' },
      correctOption: 'conflict',
      explanation: { pl: 'Spór dotyczy konkretnej sytuacji, a strony są równorzędne. To konflikt – może być burzliwy, ale nie jest hejtem.', en: 'The dispute is about a specific situation and the sides are equal. It is a conflict – it can be heated, but it is not hate.' }
    },
    {
      id: 'hd-011', difficulty: 'hard', online: false, tags: ['niejednoznaczne', 'przezwisko'],
      prompt: { pl: '„Ty to jesteś ofiara losu” – mówi uczeń do kolegi na przerwie. Obaj się śmieją.', en: '“You’re such a loser” – says a student to a classmate at break. Both laugh.' },
      context: { pl: 'Nie wiadomo, czy to jednorazowa sytuacja, czy kolega słyszy to codziennie.', en: 'We don’t know if this is a one-off or if the classmate hears it every day.' },
      correctOption: 'context',
      explanation: { pl: 'Śmiech nie zawsze oznacza, że komuś jest dobrze – czasem to sposób na ukrycie przykrości. Potrzebujemy informacji o powtarzalności i o tym, jak czuje się adresat.', en: 'Laughing doesn’t always mean someone is fine – sometimes it hides hurt. We need to know about repetition and how the recipient feels.' },
      hint: { pl: 'Czy śmiech zawsze oznacza zgodę?', en: 'Does laughing always mean agreement?' }
    },
    {
      id: 'hd-012', difficulty: 'medium', online: true, tags: ['hejt', 'zdjęcie'],
      prompt: { pl: '„Same brzydale, aż oczy bolą. Usuńcie to.”', en: '“What a bunch of uglies, it hurts to look. Delete this.”' },
      context: { pl: 'Jednorazowy komentarz anonimowego konta pod zdjęciem klasy z wycieczki.', en: 'A one-time comment from an anonymous account under a class trip photo.' },
      correctOption: 'hate',
      explanation: { pl: 'To obraźliwy, poniżający komentarz – hejt. Jest jednorazowy, więc nie spełnia jeszcze cech cyberprzemocy, ale warto go zgłosić i nie odpowiadać tym samym.', en: 'This is an insulting, degrading comment – hate. It is a one-off, so it is not yet cyberbullying, but it is worth reporting and not replying in kind.' }
    },
    {
      id: 'hd-013', difficulty: 'easy', online: true, tags: ['krytyka', 'programowanie'],
      prompt: { pl: '„Twój kod działa, ale nazwy zmiennych są niejasne i trudno go poprawiać. Mogę pokazać, jak je uporządkować.”', en: '“Your code works, but the variable names are unclear and it’s hard to maintain. I can show you how to tidy them.”' },
      context: { pl: 'Komentarz w szkolnym repozytorium projektu.', en: 'A comment in a school project repository.' },
      correctOption: 'criticism',
      explanation: { pl: 'Krytyka dotyczy kodu, jest konkretna i zawiera propozycję pomocy.', en: 'The criticism is about the code, it is specific and offers help.' }
    },
    {
      id: 'hd-014', difficulty: 'medium', online: true, tags: ['cyberprzemoc', 'wykluczanie'],
      prompt: { pl: 'Grupa uczniów założyła czat „bez Kuby” i regularnie wrzuca tam zrzuty jego wiadomości, żeby się z nich śmiać.', en: 'A group of students made a chat “without Kuba” and regularly posts screenshots of his messages there to laugh at them.' },
      context: { pl: 'Kuba dowiedział się o czacie od kolegi.', en: 'Kuba found out about the chat from a friend.' },
      correctOption: 'cyberbullying',
      explanation: { pl: 'Celowe wykluczanie połączone z powtarzalnym ośmieszaniem to cyberprzemoc – nawet jeśli odbywa się „za plecami” osoby.', en: 'Deliberate exclusion combined with repeated mockery is cyberbullying – even when it happens “behind someone’s back”.' }
    },
    {
      id: 'hd-015', difficulty: 'easy', online: true, tags: ['żart', 'autoironia'],
      prompt: { pl: '„Wygląda jak wulkan! 😂”', en: '“It looks like a volcano! 😂”' },
      context: { pl: 'Uczeń sam opublikował zdjęcie nieudanego ciasta z podpisem „Mistrz cukiernictwa”. Odpisuje znajomym kolejnymi emotkami śmiechu.', en: 'A student posted a photo of his failed cake with the caption “Master baker”. He replies to friends with more laughing emojis.' },
      correctOption: 'joke',
      explanation: { pl: 'Autor sam zaprosił do żartu i dobrze się bawi. Komentarz dotyczy ciasta, nie osoby.', en: 'The author invited the joke himself and is enjoying it. The comment is about the cake, not the person.' }
    },
    {
      id: 'hd-016', difficulty: 'medium', online: true, tags: ['konflikt', 'online'],
      prompt: { pl: '„Nie masz racji, ten sędzia był stronniczy!” – „Ty się po prostu nie znasz na zasadach.”', en: '“You’re wrong, that referee was biased!” – “You just don’t know the rules.”' },
      context: { pl: 'Dwie osoby ostro dyskutują w komentarzach o wyniku meczu. Bez wyzwisk.', en: 'Two people argue sharply in the comments about a match result. No name-calling.' },
      correctOption: 'conflict',
      explanation: { pl: 'To ostra wymiana zdań o konkretnej sprawie, bez poniżania. Konflikt – choć łatwo może przerodzić się w hejt, jeśli pojawią się obelgi.', en: 'A sharp exchange about a specific issue, without degrading anyone. A conflict – although it can easily turn into hate if insults appear.' }
    }
  ]
};
