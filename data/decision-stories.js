/* Twoja Decyzja – opowieść jako graf scen (PL / EN). Postacie i sytuacje są fikcyjne. */
window.PH8.data.decisionStories = {
  version: 1,
  stories: [
    {
      id: 'story-new-class',
      title: { pl: 'Nowa klasa', en: 'The new class' },
      intro: { pl: 'Jesteś w klasie, do której właśnie dołączyła Kaja. Twoje wybory zdecydują, jak potoczy się jej pierwszy miesiąc.', en: 'You are in a class that Kaja has just joined. Your choices will decide how her first month goes.' },
      startScene: 'scene-01',
      expectedLength: 5,
      scenes: {
        'scene-01': {
          short: { pl: 'Mem na czacie', en: 'Meme in the chat' },
          place: { pl: 'Klasowy czat, wieczór', en: 'Class chat, evening' },
          text: { pl: 'Pierwszy tydzień roku. Na klasowym czacie ktoś wrzuca przerobione zdjęcie Kai z podpisem „Kaja-kłopot”. Pod spodem pojawiają się emotki śmiechu.', en: 'The first week of term. Someone posts an edited photo of Kaja in the class chat, captioned “Kaja-trouble”. Laughing emojis start piling up.' },
          choices: [
            {
              id: 'share', quality: 'risky', points: 0, flags: ['sharedContent'], nextScene: 'scene-02',
              label: { pl: 'Udostępniam dalej – i tak wszyscy już widzieli', en: 'I share it on – everyone has seen it anyway' },
              feedback: {
                effect: { pl: 'Mem trafia do kolejnych osób spoza klasy.', en: 'The meme reaches more people outside the class.' },
                risk: { pl: 'Udostępniając, zwiększasz zasięg krzywdy i stajesz się częścią problemu.', en: 'By sharing you increase the harm’s reach and become part of the problem.' },
                alternative: { pl: 'Nie udostępniaj. Wesprzyj Kaję i zgłoś treść administratorowi grupy.', en: 'Don’t share. Support Kaja and report the content to the group admin.' }
              }
            },
            {
              id: 'support', quality: 'safe', points: 100, flags: ['offeredSupport', 'reported'], nextScene: 'scene-02',
              label: { pl: 'Piszę prywatnie do Kai i zgłaszam treść administratorowi grupy', en: 'I message Kaja privately and report the content to the group admin' },
              feedback: {
                effect: { pl: 'Kaja wie, że ktoś stoi po jej stronie. Administrator usuwa post.', en: 'Kaja knows someone is on her side. The admin removes the post.' },
                risk: { pl: 'Niewielkie – działasz spokojnie i bez konfrontacji.', en: 'Low – you act calmly and without confrontation.' },
                alternative: { pl: 'Możesz też poprosić o pomoc wychowawcę, jeśli sytuacja się powtórzy.', en: 'You can also ask the form tutor for help if it happens again.' }
              }
            },
            {
              id: 'ignore', quality: 'neutral', points: 30, flags: ['ignored'], nextScene: 'scene-02',
              label: { pl: 'Nie reaguję i przewijam dalej', en: 'I don’t react and scroll on' },
              feedback: {
                effect: { pl: 'Mem zostaje na czacie, a reakcji przybywa.', en: 'The meme stays in the chat and reactions keep coming.' },
                risk: { pl: 'Milczenie świadków bywa odbierane jako przyzwolenie.', en: 'Bystander silence can look like approval.' },
                alternative: { pl: 'Mały krok też pomaga: zgłoś post albo napisz do Kai.', en: 'A small step helps too: report the post or message Kaja.' }
              }
            }
          ]
        },
        'scene-02': {
          short: { pl: 'Śmiechy na przerwie', en: 'Laughter at break' },
          place: { pl: 'Korytarz, przerwa', en: 'Corridor, break time' },
          text: { pl: 'Następnego dnia kilka osób cytuje mem, gdy Kaja przechodzi obok szafek. Kaja udaje, że nie słyszy, i patrzy w telefon.', en: 'The next day a few people quote the meme as Kaja walks past the lockers. She pretends not to hear and stares at her phone.' },
          choices: [
            {
              id: 'invite', quality: 'safe', points: 100, flags: ['offeredSupport'], nextScene: 'scene-03',
              label: { pl: 'Podchodzę do Kai i zapraszam ją, żeby poszła z nami na stołówkę', en: 'I walk up to Kaja and invite her to come with us to the canteen' },
              feedback: {
                effect: { pl: 'Kaja odchodzi z grupą znajomych. Śmiechy cichną, bo „widownia” znika.', en: 'Kaja leaves with a group of friends. The laughter fades because the “audience” is gone.' },
                risk: { pl: 'Niskie – odciągasz osobę z trudnej sytuacji bez kłótni.', en: 'Low – you take the person out of a difficult moment without an argument.' },
                alternative: { pl: 'Później warto powiedzieć o sytuacji dorosłemu.', en: 'Later it is worth telling an adult about it.' }
              }
            },
            {
              id: 'shout', quality: 'risky', points: 20, flags: ['escalatedConflict'], nextScene: 'scene-03',
              label: { pl: 'Głośno krzyczę do śmiejących się, że są żałośni', en: 'I loudly shout at the people laughing that they are pathetic' },
              feedback: {
                effect: { pl: 'Grupa się obraża, robi się zbiegowisko, a uwaga znów skupia się na Kai.', en: 'The group takes offence, a crowd gathers, and the attention is on Kaja again.' },
                risk: { pl: 'Konfrontacja może zwiększyć napięcie i narazić także ciebie.', en: 'Confrontation can raise tension and put you at risk as well.' },
                alternative: { pl: 'Odciągnij Kaję z sytuacji, a o zdarzeniu powiedz dorosłemu.', en: 'Take Kaja out of the situation and tell an adult what happened.' }
              }
            },
            {
              id: 'laugh', quality: 'risky', points: 0, flags: ['joinedMocking'], nextScene: 'scene-03',
              label: { pl: 'Śmieję się razem z innymi, żeby nie wypaść z grupy', en: 'I laugh along so I don’t fall out with the group' },
              feedback: {
                effect: { pl: 'Kaja to widzi. Czuje się jeszcze bardziej samotna.', en: 'Kaja sees it. She feels even more alone.' },
                risk: { pl: 'Presja grupy jest realna, ale śmiech wzmacnia wyśmiewanie.', en: 'Peer pressure is real, but laughing reinforces the mockery.' },
                alternative: { pl: 'Nie musisz występować przeciw grupie – wystarczy się nie przyłączać i wesprzeć Kaję później.', en: 'You don’t have to stand up to the group – just don’t join in, and support Kaja later.' }
              }
            }
          ]
        },
        'scene-03': {
          short: { pl: 'Wiadomość od Kai', en: 'A message from Kaja' },
          place: { pl: 'Wiadomość prywatna, wieczór', en: 'Private message, evening' },
          speaker: { initials: 'K', name: { pl: 'Kaja', en: 'Kaja' }, role: { pl: 'nowa uczennica', en: 'new student' } },
          text: { pl: '„Mam dość. Chyba zmienię szkołę. Nikt tu mnie nie chce.”', en: '“I’ve had enough. I think I’ll change schools. Nobody wants me here.”' },
          choices: [
            {
              id: 'adult', quality: 'safe', points: 100, flags: ['askedAdult', 'offeredSupport'], nextScene: 'scene-04a',
              label: { pl: 'Piszę, że to nie jej wina, i proponuję, że pójdę z nią do wychowawcy lub pedagoga', en: 'I tell her it’s not her fault and offer to go with her to the form tutor or school counsellor' },
              feedback: {
                effect: { pl: 'Kaja się zgadza. Umawiacie się na rozmowę jutro rano.', en: 'Kaja agrees. You arrange to talk to someone tomorrow morning.' },
                risk: { pl: 'Brak – włączenie zaufanego dorosłego to najbezpieczniejszy krok.', en: 'None – involving a trusted adult is the safest step.' },
                alternative: { pl: 'To jest najlepsza alternatywa. Brawo za odwagę.', en: 'This is the best option. Well done for being brave.' }
              }
            },
            {
              id: 'secret', quality: 'neutral', points: 30, flags: ['keptSecret'], nextScene: 'scene-04b',
              label: { pl: 'Obiecuję, że nikomu nie powiem, i nic więcej nie robię', en: 'I promise not to tell anyone and do nothing else' },
              feedback: {
                effect: { pl: 'Kaja czuje ulgę, że ktoś ją wysłuchał, ale problem zostaje.', en: 'Kaja is relieved someone listened, but the problem remains.' },
                risk: { pl: 'Gdy ktoś cierpi, tajemnica może zaszkodzić. Powiedzenie dorosłemu to nie donoszenie, tylko szukanie pomocy.', en: 'When someone is suffering, secrecy can harm. Telling an adult isn’t snitching – it’s getting help.' },
                alternative: { pl: 'Zaproponuj wspólną rozmowę z wychowawcą lub pedagogiem.', en: 'Offer to talk to the form tutor or counsellor together.' }
              }
            },
            {
              id: 'dismiss', quality: 'risky', points: 0, flags: ['dismissed'], nextScene: 'scene-04b',
              label: { pl: 'Odpisuję: „Przesadzasz, każdy coś takiego przechodził”', en: 'I reply: “You’re overreacting, everyone goes through this”' },
              feedback: {
                effect: { pl: 'Kaja przestaje odpisywać.', en: 'Kaja stops replying.' },
                risk: { pl: 'Bagatelizowanie zamyka rozmowę i może pogłębić poczucie samotności.', en: 'Downplaying shuts the conversation down and can deepen loneliness.' },
                alternative: { pl: 'Wysłuchaj, powiedz, że to nie jej wina, i zaproponuj pomoc dorosłego.', en: 'Listen, say it’s not her fault and suggest getting help from an adult.' }
              }
            }
          ]
        },
        'scene-04a': {
          short: { pl: 'Rozmowa z pedagogiem', en: 'Talking to the counsellor' },
          place: { pl: 'Gabinet pedagoga szkolnego', en: 'School counsellor’s office' },
          speaker: { initials: 'P', name: { pl: 'Pedagog szkolny', en: 'School counsellor' }, role: { pl: 'zaufany dorosły', en: 'trusted adult' } },
          text: { pl: '„Dziękuję, że przyszliście. To ważne. Co możecie mi powiedzieć o tym, co się wydarzyło?”', en: '“Thank you for coming. This matters. What can you tell me about what happened?”' },
          choices: [
            {
              id: 'facts', quality: 'safe', points: 100, flags: ['savedEvidence'], nextScene: 'scene-05',
              label: { pl: 'Pokazuję zrzut ekranu zachowany jako dowód i opisuję fakty: kiedy i gdzie pojawił się mem', en: 'I show a screenshot kept as evidence and describe the facts: when and where the meme appeared' },
              feedback: {
                effect: { pl: 'Pedagog ma konkretne informacje i może zadziałać zgodnie z procedurami szkoły.', en: 'The counsellor has concrete information and can act according to school procedures.' },
                risk: { pl: 'Brak – fakty i dowody pomagają dorosłym działać skutecznie.', en: 'None – facts and evidence help adults act effectively.' },
                alternative: { pl: 'To najlepszy wybór.', en: 'This is the best choice.' }
              }
            },
            {
              id: 'rumor', quality: 'neutral', points: 30, flags: ['rumor'], nextScene: 'scene-05',
              label: { pl: 'Mówię, kto „na pewno” to zrobił, bo tak słyszałem', en: 'I say who “definitely” did it, because that’s what I heard' },
              feedback: {
                effect: { pl: 'Pedagog prosi o fakty – plotka nie wystarczy.', en: 'The counsellor asks for facts – a rumour isn’t enough.' },
                risk: { pl: 'Plotki mogą skrzywdzić niewinne osoby.', en: 'Rumours can hurt innocent people.' },
                alternative: { pl: 'Mów o tym, co widziałeś – ustalanie sprawców należy do dorosłych.', en: 'Talk about what you saw – identifying who did it is the adults’ job.' }
              }
            }
          ]
        },
        'scene-04b': {
          short: { pl: 'Mem wraca', en: 'The meme returns' },
          place: { pl: 'Kilka dni później', en: 'A few days later' },
          text: { pl: 'Mem pojawia się znowu – tym razem na grupie całej szkoły. Kaja nie przychodzi na lekcje.', en: 'The meme appears again – this time in a whole-school group. Kaja stops coming to class.' },
          choices: [
            {
              id: 'late-adult', quality: 'safe', points: 100, flags: ['askedAdult'], nextScene: 'scene-05',
              label: { pl: 'Mimo wszystko idę do pedagoga i opowiadam, co się dzieje', en: 'I go to the counsellor anyway and explain what’s happening' },
              feedback: {
                effect: { pl: 'Pedagog kontaktuje się z Kają i jej rodziną. Szkoła reaguje.', en: 'The counsellor contacts Kaja and her family. The school responds.' },
                risk: { pl: 'Brak – nigdy nie jest za późno, by poprosić o pomoc.', en: 'None – it’s never too late to ask for help.' },
                alternative: { pl: 'Świetna decyzja.', en: 'Great decision.' }
              }
            },
            {
              id: 'fake', quality: 'risky', points: 0, flags: ['escalatedConflict'], nextScene: 'scene-05',
              label: { pl: 'Zakładam fałszywe konto, żeby ośmieszyć autora mema', en: 'I create a fake account to ridicule the meme’s author' },
              feedback: {
                effect: { pl: 'Powstaje kolejna fala hejtu. Szkoła ma teraz dwa problemy.', en: 'A new wave of hate starts. The school now has two problems.' },
                risk: { pl: 'Odwet łamie zasady i może mieć poważne konsekwencje także dla ciebie.', en: 'Retaliation breaks the rules and can have serious consequences for you too.' },
                alternative: { pl: 'Zachowaj dowody i porozmawiaj z zaufanym dorosłym.', en: 'Keep evidence and talk to a trusted adult.' }
              }
            },
            {
              id: 'nothing', quality: 'neutral', points: 10, flags: ['ignored'], nextScene: 'scene-05',
              label: { pl: 'Dalej nic nie robię', en: 'I keep doing nothing' },
              feedback: {
                effect: { pl: 'Sytuacja trwa.', en: 'The situation continues.' },
                risk: { pl: 'Bez reakcji krzywda się utrwala.', en: 'Without a response, the harm becomes entrenched.' },
                alternative: { pl: 'Powiedz o wszystkim pedagogowi lub wychowawcy.', en: 'Tell the counsellor or form tutor everything.' }
              }
            }
          ]
        },
        'scene-05': {
          short: { pl: 'Tydzień później', en: 'A week later' },
          place: { pl: 'Tydzień później', en: 'A week later' },
          text: { pl: 'Mija tydzień. Czas zobaczyć, dokąd doprowadziły twoje decyzje.', en: 'A week passes. Time to see where your decisions have led.' },
          choices: [
            { id: 'see', quality: 'neutral', points: 0, noFeedback: true, nextScene: 'END', label: { pl: 'Zobacz zakończenie', en: 'See the ending' } }
          ]
        }
      },
      endings: [
        {
          id: 'ally',
          requires: { all: ['askedAdult', 'offeredSupport'], none: ['sharedContent', 'escalatedConflict', 'joinedMocking'] },
          title: { pl: 'Sojusznik w akcji', en: 'An ally in action' },
          text: { pl: 'Kaja została w szkole. Dzięki twojemu wsparciu i rozmowie z dorosłymi klasa ustaliła zasady czatu, a Kaja znalazła znajomych.', en: 'Kaja stayed at the school. Thanks to your support and the talk with adults, the class agreed chat rules and Kaja made friends.' }
        },
        {
          id: 'help',
          requires: { any: ['askedAdult'] },
          title: { pl: 'Pomoc w drodze', en: 'Help is on the way' },
          text: { pl: 'Do akcji włączyli się dorośli i sytuacja zaczyna się poprawiać. Niektóre wcześniejsze decyzje utrudniły jednak drogę – zobacz mapę decyzji.', en: 'Adults got involved and things are starting to improve. Some earlier decisions made the road harder, though – check the decision map.' }
        },
        {
          id: 'spiral',
          requires: { any: ['escalatedConflict', 'joinedMocking', 'sharedContent'] },
          title: { pl: 'Spirala konfliktu', en: 'A spiral of conflict' },
          text: { pl: 'Konflikt narasta, a Kaja czuje się coraz gorzej. Spróbuj jeszcze raz – sprawdź, które wybory mogą zatrzymać spiralę.', en: 'The conflict grows and Kaja feels worse and worse. Try again – find out which choices can stop the spiral.' }
        },
        {
          id: 'silent',
          title: { pl: 'Cisza, która boli', en: 'A silence that hurts' },
          text: { pl: 'Nikt nie zrobił nic złego wprost, ale nikt też nie pomógł. Kaja została z problemem sama. Czasem jeden mały krok zmienia wszystko.', en: 'Nobody did anything openly wrong, but nobody helped either. Kaja was left alone with the problem. Sometimes one small step changes everything.' }
        }
      ],
      defaultEnding: 'silent',
      summary: { pl: 'Reakcje mogą zależeć od sytuacji, ale najczęściej pomagają: wsparcie osoby, niewzmacnianie krzywdy i rozmowa z zaufanym dorosłym.', en: 'The right reaction depends on the situation, but what usually helps is supporting the person, not amplifying harm, and talking to a trusted adult.' },
      discussion: [
        { pl: 'Która decyzja w historii była najtrudniejsza? Dlaczego?', en: 'Which decision in the story was the hardest? Why?' },
        { pl: 'Czym różni się „donoszenie” od szukania pomocy?', en: 'What is the difference between “snitching” and seeking help?' },
        { pl: 'Jak można wesprzeć kogoś, nie narażając siebie?', en: 'How can you support someone without putting yourself at risk?' }
      ]
    }
  ]
};
