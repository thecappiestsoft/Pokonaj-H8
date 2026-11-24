/* Social Media Challenge – fikcyjny scenariusz w serwisie „KlasaNet” (PL / EN). Wszystkie profile są fikcyjne. */
(function () {
  const YOU = { pl: 'Ty', en: 'You' };
  window.PH8.data.socialMedia = {
    version: 1,
    platform: { pl: 'KlasaNet', en: 'ClassNet' },
    summary: {
      pl: 'Każda reakcja – także milczenie – wpływa na to, jak rozwija się sytuacja w sieci. Wsparcie, zgłoszenie i rozmowa z dorosłym działają lepiej niż odwet.',
      en: 'Every reaction – including silence – shapes how an online situation develops. Support, reporting and talking to an adult work better than retaliation.'
    },
    discussion: [
      { pl: 'Które działanie najbardziej poprawiło bezpieczeństwo w scenariuszu? Dlaczego?', en: 'Which action improved safety the most in the scenario? Why?' },
      { pl: 'Dlaczego „reakcja 😂” pod krzywdzącym postem nie jest neutralna?', en: 'Why is a “😂 reaction” under a hurtful post not neutral?' },
      { pl: 'Jak można zareagować publicznie, nie atakując autora wpisu?', en: 'How can you respond publicly without attacking the author?' },
      { pl: 'Do kogo w naszej szkole można zwrócić się po pomoc?', en: 'Who in our school can we turn to for help?' }
    ],
    scenarios: [
      {
        id: 'social-01',
        title: { pl: 'Klasa na wspólnym czacie', en: 'The class group chat' },
        channel: { pl: '3TI-klasa', en: '3TI-class' },
        initialMetrics: { safety: 60, trust: 55, tension: 35 },
        initialPosts: [
          { author: 'mila.art', initials: 'MA', color: 'accent', time: '17:58', text: { pl: 'Kto ma notatki z informatyki? 🙏', en: 'Who has the IT class notes? 🙏' }, reactions: { like: 3 } },
          { author: 'tech_tomek', initials: 'TT', color: 'secondary', time: '18:01', kind: 'comment', text: { pl: 'Wrzucam na dysk klasy 👍', en: 'Uploading them to the class drive 👍' }, reactions: { heart: 4 } }
        ],
        turns: [
          {
            id: 'turn-01',
            posts: [
              { author: 'anon_3b', initials: '?', color: 'muted', time: '18:12', text: { pl: '📸 [zdjęcie] Nasz nowy śpioch w autobusie 😂😂 #sam_śpi', en: '📸 [photo] Our new sleepyhead on the bus 😂😂 #sam_sleeps' }, reactions: { laugh: 12 } }
            ],
            situation: { pl: 'Ktoś wrzucił bez zgody zdjęcie Sama – nowej osoby w klasie – śpiącego w autobusie. Pod postem przybywa śmiejących się reakcji.', en: 'Someone posted a photo of Sam – new to the class – asleep on the bus, without consent. Laughing reactions keep coming.' },
            actions: [
              {
                id: 'support', quality: 'safe', points: 100, flags: ['supporter'],
                label: { pl: 'Piszę prywatnie do Sama i pytam, jak się czuje', en: 'I message Sam privately and ask how he feels' },
                effects: { safety: 10, trust: 15, tension: -5 },
                consequence: { pl: 'Sam odpisuje, że jest mu głupio, ale cieszy się, że ktoś zapytał.', en: 'Sam replies that he feels embarrassed but is glad someone asked.' },
                comment: { pl: 'Prywatne wsparcie pokazuje osobie, że nie jest sama – to często najważniejszy pierwszy krok.', en: 'Private support shows the person they are not alone – often the most important first step.' },
                reply: { author: YOU, initials: 'TY', color: 'primary', kind: 'dm', time: '18:15', text: { pl: '[prywatnie do Sama] Hej, widziałem ten post. Wszystko ok? Jestem po twojej stronie.', en: '[private to Sam] Hey, I saw that post. Are you ok? I’m on your side.' } }
              },
              {
                id: 'ask-remove', quality: 'safe', points: 90, flags: ['spokeUp'],
                label: { pl: 'Piszę spokojnie na grupie: „Nie wrzucajmy zdjęć bez zgody, usuńcie proszę”', en: 'I calmly write in the group: “Let’s not post photos without consent, please delete it”' },
                effects: { safety: 10, trust: 5, tension: 5 },
                consequence: { pl: 'Dwie osoby popierają twój wpis. Ktoś pisze „wyluzuj”, ale reakcji 😂 przestaje przybywać.', en: 'Two people back your message. Someone writes “chill”, but the 😂 reactions stop growing.' },
                comment: { pl: 'Spokojna, publiczna reakcja odnosi się do zachowania, nie do osoby – i często zatrzymuje „efekt widowni”.', en: 'A calm public response targets behaviour, not the person – and often stops the “audience effect”.' },
                reply: { author: YOU, initials: 'TY', color: 'primary', kind: 'you', time: '18:14', text: { pl: 'Nie wrzucajmy zdjęć bez zgody. Usuńcie proszę.', en: 'Let’s not post photos without consent. Please delete it.' } },
                later: { text: { pl: 'Autor usunął zdjęcie z grupy klasowej.', en: 'The author removed the photo from the class group.' }, effects: { safety: 5, tension: -5 } }
              },
              {
                id: 'laugh', quality: 'risky', points: 0, flags: ['amplified'],
                label: { pl: 'Dodaję reakcję 😂 – przecież to tylko zdjęcie', en: 'I add a 😂 reaction – it’s just a photo' },
                effects: { safety: -10, trust: -10, tension: 10 },
                consequence: { pl: 'Post wskakuje wyżej w kanale. Więcej osób go widzi.', en: 'The post climbs higher in the feed. More people see it.' },
                comment: { pl: 'Każda reakcja zwiększa zasięg wpisu. Śmiech świadków bywa dla osoby wyśmiewanej równie bolesny jak sam post.', en: 'Every reaction increases a post’s reach. Bystanders laughing can hurt as much as the post itself.' }
              },
              {
                id: 'scroll', quality: 'neutral', points: 20, flags: ['silent'],
                label: { pl: 'Przewijam dalej i nic nie robię', en: 'I scroll on and do nothing' },
                effects: { safety: -5, trust: -5, tension: 5 },
                consequence: { pl: 'Pod postem pojawiają się kolejne komentarze. Nikt nie reaguje.', en: 'More comments appear under the post. Nobody responds.' },
                comment: { pl: 'Milczenie wielu świadków bywa odbierane jako przyzwolenie. Czasem wystarczy mały, bezpieczny krok.', en: 'Silence from many bystanders can look like approval. Sometimes a small, safe step is enough.' }
              }
            ]
          },
          {
            id: 'turn-02',
            posts: [
              { author: 'memy.szkolne', initials: 'MS', color: 'warn', time: '19:40', text: { pl: '🖼️ [mem] Zdjęcie Sama z podpisem „Tryb oszczędzania energii: ON” – udostępniono 34 razy', en: '🖼️ [meme] Sam’s photo captioned “Power saving mode: ON” – shared 34 times' }, reactions: { laugh: 41 } }
            ],
            conditionalPosts: [
              { flag: 'spokeUp', post: { author: { pl: 'System', en: 'System' }, initials: 'i', color: 'muted', kind: 'system', time: '19:41', text: { pl: 'Na grupie klasowej zdjęcia już nie ma – ale ktoś zdążył je skopiować.', en: 'The photo is gone from the class group – but someone had already copied it.' } } }
            ],
            situation: { pl: 'Zdjęcie trafiło na fikcyjny profil z memami. Mem krąży po innych grupach.', en: 'The photo ended up on a fictional meme page. The meme is spreading to other groups.' },
            actions: [
              {
                id: 'evidence-report', quality: 'safe', points: 100, flags: ['reported', 'savedEvidence'],
                label: { pl: 'Robię zrzut ekranu jako dowód (nie rozsyłam go) i zgłaszam mem moderatorom', en: 'I take a screenshot as evidence (not sharing it) and report the meme to moderators' },
                effects: { safety: 15, trust: 5, tension: -5 },
                consequence: { pl: 'Moderatorzy przyjmują zgłoszenie. Masz dowód, który możesz pokazać dorosłemu.', en: 'Moderators accept the report. You have evidence you can show an adult.' },
                comment: { pl: 'Zachowanie dowodu bez rozpowszechniania i zgłoszenie treści to bezpieczne, skuteczne działania.', en: 'Keeping evidence without spreading it, and reporting the content, are safe and effective actions.' },
                later: { text: { pl: 'Mem został usunięty z profilu po zgłoszeniu.', en: 'The meme was removed from the page after the report.' }, effects: { safety: 5, tension: -5 } }
              },
              {
                id: 'share', quality: 'risky', points: 0, flags: ['sharedContent'],
                label: { pl: 'Przekazuję mem dalej – i tak wszyscy już go widzieli', en: 'I forward the meme – everyone has seen it anyway' },
                effects: { safety: -20, trust: -15, tension: 20 },
                consequence: { pl: 'Mem trafia do kolejnej szkoły. Sam dostaje wiadomości od obcych osób.', en: 'The meme reaches another school. Sam gets messages from strangers.' },
                comment: { pl: '„Wszyscy już widzieli” to mit – każde udostępnienie dociera do nowych osób i przedłuża krzywdę.', en: '“Everyone has seen it” is a myth – every share reaches new people and prolongs the harm.' }
              },
              {
                id: 'attack-author', quality: 'risky', points: 0, flags: ['escalatedConflict'],
                label: { pl: 'Piszę obraźliwy komentarz o autorze mema', en: 'I write an insulting comment about the meme’s author' },
                effects: { safety: -10, trust: -5, tension: 20 },
                consequence: { pl: 'Autor odpowiada tym samym. Kłótnia rośnie, a Sam znów jest w centrum uwagi.', en: 'The author hits back. The argument grows and Sam is in the spotlight again.' },
                comment: { pl: 'Odwet zwykle eskaluje konflikt i zwiększa zasięg krzywdzącej treści. Lepiej zgłosić i wesprzeć.', en: 'Retaliation usually escalates the conflict and spreads the hurtful content. Better to report and support.' }
              },
              {
                id: 'ignore2', quality: 'neutral', points: 20, flags: ['silent'],
                label: { pl: 'Nic nie robię – to nie moja sprawa', en: 'I do nothing – it’s not my business' },
                effects: { safety: -5, tension: 5 },
                consequence: { pl: 'Mem dalej krąży.', en: 'The meme keeps spreading.' },
                comment: { pl: 'Nie musisz działać sam, ale możesz zrobić bezpieczny krok: zgłosić treść lub powiedzieć dorosłemu.', en: 'You don’t have to act alone, but you can take a safe step: report the content or tell an adult.' }
              }
            ]
          },
          {
            id: 'turn-03',
            posts: [
              { author: 'sam.nowy', initials: 'SN', color: 'secondary', kind: 'dm', time: '21:05', text: { pl: '[prywatnie] Nie chcę jutro iść do szkoły. Wszyscy to widzieli.', en: '[private] I don’t want to go to school tomorrow. Everyone saw it.' } }
            ],
            situation: { pl: 'Sam pisze do ciebie wieczorem. Widać, że jest mu bardzo przykro.', en: 'Sam messages you in the evening. He is clearly very upset.' },
            actions: [
              {
                id: 'adult', quality: 'safe', points: 100, flags: ['askedAdult', 'supporter'],
                label: { pl: 'Piszę, że to nie jego wina, i proponuję, że pójdę z nim jutro do wychowawcy lub pedagoga', en: 'I tell him it’s not his fault and offer to go with him to the form tutor or school counsellor tomorrow' },
                effects: { safety: 20, trust: 15, tension: -10 },
                consequence: { pl: 'Sam zgadza się. Rano idziecie razem do pedagoga szkolnego.', en: 'Sam agrees. In the morning you go together to the school counsellor.' },
                comment: { pl: 'Włączenie zaufanego dorosłego to najważniejszy krok, gdy sytuacja przerasta uczniów.', en: 'Involving a trusted adult is the most important step when a situation is too big for students.' },
                reply: { author: YOU, initials: 'TY', color: 'primary', kind: 'dm', time: '21:07', text: { pl: '[prywatnie] To nie twoja wina. Chcesz, żebyśmy jutro razem poszli do pedagoga?', en: '[private] It’s not your fault. Want us to go to the counsellor together tomorrow?' } }
              },
              {
                id: 'downplay', quality: 'neutral', points: 10, flags: ['dismissed'],
                label: { pl: 'Odpisuję: „Nie przejmuj się, to tylko żart”', en: 'I reply: “Don’t worry, it’s just a joke”' },
                effects: { safety: -5, trust: -10 },
                consequence: { pl: 'Sam odpisuje krótko „ok” i przestaje pisać.', en: 'Sam replies a short “ok” and stops writing.' },
                comment: { pl: 'Bagatelizowanie sprawia, że osoba czuje się niezrozumiana. Lepiej wysłuchać i zaproponować pomoc.', en: 'Downplaying makes the person feel misunderstood. Better to listen and offer help.' }
              },
              {
                id: 'revenge', quality: 'risky', points: 0, flags: ['escalatedConflict'],
                label: { pl: 'Obiecuję, że znajdę autora i publicznie go ośmieszę', en: 'I promise to find the author and humiliate them publicly' },
                effects: { safety: -10, trust: 5, tension: 20 },
                consequence: { pl: 'Sam się niepokoi – boi się, że będzie jeszcze gorzej.', en: 'Sam gets worried – he’s afraid it will get even worse.' },
                comment: { pl: 'Samodzielne „śledztwo” i publiczne piętnowanie zwiększają ryzyko. Ustalanie sprawców to zadanie dorosłych.', en: 'Your own “investigation” and public shaming increase the risk. Identifying who did it is a job for adults.' }
              }
            ]
          },
          {
            id: 'turn-04',
            posts: [
              { author: { pl: 'Wychowawczyni', en: 'Form tutor' }, initials: 'W', color: 'primary', time: '08:10', text: { pl: 'Kochani, porozmawiajmy dziś o zasadach na naszym czacie. Jakie macie pomysły?', en: 'Everyone, let’s talk today about rules for our chat. Any ideas?' }, reactions: { like: 9 } }
            ],
            situation: { pl: 'Klasa rozmawia o zasadach wspólnego czatu.', en: 'The class discusses rules for the group chat.' },
            actions: [
              {
                id: 'rules', quality: 'safe', points: 100, flags: ['proposedRules'],
                label: { pl: 'Proponuję zasady: zdjęcia tylko za zgodą, zgłaszamy krzywdzące treści, nie oznaczamy nikogo dla żartu', en: 'I propose rules: photos only with consent, we report hurtful content, no tagging people as a joke' },
                effects: { safety: 10, trust: 10, tension: -10 },
                consequence: { pl: 'Klasa przyjmuje zasady w głosowaniu. Moderatorami czatu zostają dwie osoby.', en: 'The class votes the rules in. Two people become chat moderators.' },
                comment: { pl: 'Wspólne zasady zmieniają normy grupy – to działa na przyszłość.', en: 'Shared rules change group norms – that works long-term.' }
              },
              {
                id: 'vote', quality: 'neutral', points: 50,
                label: { pl: 'Nie zabieram głosu, ale głosuję za zasadami', en: 'I don’t speak up but vote for the rules' },
                effects: { safety: 5 },
                consequence: { pl: 'Zasady przechodzą niewielką większością.', en: 'The rules pass by a small majority.' },
                comment: { pl: 'Cichy głos też się liczy. Następnym razem możesz dodać jeden pomysł.', en: 'A quiet vote counts too. Next time you could add one idea.' }
              },
              {
                id: 'mock-rules', quality: 'risky', points: 0,
                label: { pl: 'Piszę „Zasady na czacie? Serio? 🙄”', en: 'I write “Chat rules? Seriously? 🙄”' },
                effects: { safety: -5, tension: 10 },
                consequence: { pl: 'Część osób się śmieje i rozmowa się rozmywa.', en: 'Some people laugh and the discussion fizzles out.' },
                comment: { pl: 'Ośmieszanie pomysłów zniechęca innych do zabierania głosu.', en: 'Mocking ideas discourages others from speaking up.' }
              }
            ]
          },
          {
            id: 'turn-05',
            posts: [
              { author: 'anon_3b', initials: '?', color: 'muted', time: '15:22', text: { pl: 'Przesadzacie. To był tylko żart, nikt nie chciał nikogo urazić.', en: 'You’re overreacting. It was just a joke, nobody meant to hurt anyone.' }, reactions: { like: 2 } }
            ],
            situation: { pl: 'Autor zdjęcia pisze na grupie, że wszyscy przesadzają.', en: 'The person who posted the photo writes that everyone is overreacting.' },
            actions: [
              {
                id: 'calm', quality: 'safe', points: 100, flags: ['supporter'],
                label: { pl: 'Odpowiadam spokojnie: „Dla ciebie żart, ale Samowi było przykro. Szanujmy zasady i idźmy dalej.”', en: 'I reply calmly: “A joke to you, but Sam was hurt. Let’s respect the rules and move on.”' },
                effects: { safety: 10, trust: 10, tension: -10 },
                consequence: { pl: 'Autor po chwili pisze „ok, sorry Sam”. Napięcie opada.', en: 'After a moment the author writes “ok, sorry Sam”. Tension drops.' },
                comment: { pl: 'Komunikat „ja” i odniesienie do skutku – bez obrażania – daje szansę na zmianę zachowania.', en: 'Speaking about the impact – without insults – gives the other person a chance to change.' },
                reply: { author: YOU, initials: 'TY', color: 'primary', kind: 'you', time: '15:25', text: { pl: 'Dla ciebie żart, ale Samowi było przykro. Szanujmy zasady i idźmy dalej.', en: 'A joke to you, but Sam was hurt. Let’s respect the rules and move on.' } }
              },
              {
                id: 'insult', quality: 'risky', points: 0, flags: ['escalatedConflict'],
                label: { pl: 'Odpisuję obelgą', en: 'I reply with an insult' },
                effects: { safety: -10, tension: 20 },
                consequence: { pl: 'Wybucha kolejna kłótnia. Wychowawczyni musi zablokować czat.', en: 'Another argument breaks out. The form tutor has to lock the chat.' },
                comment: { pl: 'Obelga przeciw obeldze nie kończy problemu – tylko go przenosi.', en: 'Insult for insult doesn’t end the problem – it just moves it.' }
              },
              {
                id: 'leave', quality: 'neutral', points: 20,
                label: { pl: 'Nie odpowiadam – moderatorzy się tym zajmą', en: 'I don’t reply – moderators will handle it' },
                effects: { tension: -5 },
                consequence: { pl: 'Moderatorzy przypominają zasady. Temat cichnie.', en: 'The moderators remind everyone of the rules. The topic dies down.' },
                comment: { pl: 'Czasem nie trzeba odpowiadać – zwłaszcza gdy są zasady i osoby, które ich pilnują.', en: 'Sometimes you don’t need to reply – especially when there are rules and people who enforce them.' }
              }
            ]
          }
        ],
        endings: [
          {
            id: 'supportive',
            when: { safetyMin: 75, tensionMax: 40 },
            title: { pl: 'Bezpieczniejsza klasa', en: 'A safer class' },
            text: { pl: 'Dzięki wsparciu, zgłoszeniom i pomocy dorosłych sytuacja się uspokoiła. Sam wie, że ma po swojej stronie ludzi, a klasa ma wspólne zasady.', en: 'Thanks to support, reports and adult help, things calmed down. Sam knows people are on his side and the class has shared rules.' }
          },
          {
            id: 'escalated',
            when: { anyOf: [{ tensionMin: 65 }, { safetyMax: 35 }] },
            title: { pl: 'Spirala eskalacji', en: 'An escalating spiral' },
            text: { pl: 'Udostępnienia i odwet sprawiły, że sytuacja wymknęła się spod kontroli. Potrzebna jest interwencja dorosłych. Zobacz poniżej, które decyzje mogły to zmienić.', en: 'Shares and retaliation let the situation get out of hand. Adults now need to step in. See below which decisions could have changed this.' }
          },
          {
            id: 'neutral',
            title: { pl: 'Sytuacja zawieszona', en: 'An unresolved situation' },
            text: { pl: 'Część problemu udało się ograniczyć, ale wiele zależało od innych. Kilka aktywnych, bezpiecznych kroków mogło bardziej pomóc Samowi.', en: 'Part of the problem was contained, but much depended on others. A few active, safe steps could have helped Sam more.' }
          }
        ],
        defaultEnding: 'neutral'
      }
    ]
  };
})();
