/* Detektywi Internetu – fikcyjna sprawa, karty dowodów, pytania i kroki raportu (PL / EN) */
window.PH8.data.detectiveCases = {
  version: 1,
  categories: [
    { id: 'fact', icon: 'check', label: { pl: 'Fakt', en: 'Fact' }, desc: { pl: 'Da się to sprawdzić.', en: 'Can be verified.' } },
    { id: 'opinion', icon: 'message', label: { pl: 'Opinia', en: 'Opinion' }, desc: { pl: 'Czyjaś ocena lub odczucie.', en: 'Someone’s judgement or feeling.' } },
    { id: 'assumption', icon: 'help', label: { pl: 'Przypuszczenie', en: 'Assumption' }, desc: { pl: 'Domysł bez dowodu.', en: 'A guess without proof.' } },
    { id: 'witness', icon: 'eye', label: { pl: 'Reakcja świadka', en: 'Bystander reaction' }, desc: { pl: 'Co zrobił ktoś, kto to widział.', en: 'What someone who saw it did.' } },
    { id: 'support', icon: 'heart', label: { pl: 'Działanie wspierające', en: 'Supportive action' }, desc: { pl: 'Pomaga osobie lub zatrzymuje krzywdę.', en: 'Helps the person or stops the harm.' } }
  ],
  cases: [
    {
      id: 'case-01',
      title: { pl: 'Sprawa przerobionego zdjęcia', en: 'The case of the edited photo' },
      intro: {
        pl: 'Po wycieczce klasowej na anonimowym profilu „@plotki_3B” pojawiło się przerobione zdjęcie jednej z uczennic z ośmieszającym podpisem. Kilka osób je skomentowało. Wychowawczyni prosi klasę o pomoc w zrozumieniu sytuacji – nie o szukanie winnego.',
        en: 'After a class trip, an edited photo of a student with a mocking caption appeared on the anonymous profile “@gossip_3B”. Several people commented. The form tutor asks the class to help understand the situation – not to hunt for a culprit.'
      },
      task: {
        pl: 'Twoje zadanie: oddzielić fakty od opinii i domysłów oraz wskazać bezpieczne działania. Wszystkie materiały są fikcyjne.',
        en: 'Your task: separate facts from opinions and guesses, and point out safe actions. All materials are fictional.'
      },
      timeline: [
        { time: { pl: 'Pt 21:14', en: 'Fri 9:14 pm' }, text: { pl: 'Publikacja zdjęcia na profilu @plotki_3B', en: 'Photo posted on @gossip_3B' } },
        { time: { pl: 'Pt 21:30', en: 'Fri 9:30 pm' }, text: { pl: 'Pierwsze komentarze i polubienia', en: 'First comments and likes' } },
        { time: { pl: 'Sob 9:00', en: 'Sat 9:00 am' }, text: { pl: '40 polubień, 15 komentarzy', en: '40 likes, 15 comments' } },
        { time: { pl: 'Pn 8:00', en: 'Mon 8:00 am' }, text: { pl: 'Uczeń pokazuje zrzut ekranu wychowawczyni', en: 'A student shows the screenshot to the form tutor' } }
      ],
      cards: [
        { id: 'c1', type: 'chat', title: { pl: 'Zrzut ekranu', en: 'Screenshot' }, description: { pl: 'Na zrzucie widać, że profil opublikował zdjęcie w piątek o 21:14.', en: 'The screenshot shows the profile posted the photo on Friday at 9:14 pm.' }, category: 'fact', explanation: { pl: 'Data i godzina są widoczne na zrzucie – można je sprawdzić.', en: 'The date and time are visible on the screenshot – they can be checked.' } },
        { id: 'c2', type: 'witness', title: { pl: 'Relacja ucznia', en: 'Student statement' }, description: { pl: '„Myślę, że to na pewno ktoś z drugiej ławki, oni zawsze się śmieją.”', en: '“I think it’s definitely someone from the second row, they’re always laughing.”' }, category: 'assumption', explanation: { pl: 'To domysł oparty na skojarzeniu, a nie na dowodach. Nie wolno na jego podstawie nikogo oskarżać.', en: 'It’s a guess based on an association, not evidence. Nobody should be accused on that basis.' } },
        { id: 'c3', type: 'chat', title: { pl: 'Komentarz pod postem', en: 'Comment under the post' }, description: { pl: '„To zdjęcie jest żenujące, a ten profil jest najgorszy w szkole.”', en: '“That photo is embarrassing and this profile is the worst in school.”' }, category: 'opinion', explanation: { pl: 'To ocena – wyraża czyjeś odczucia, nie fakt.', en: 'It’s a judgement – it expresses feelings, not a fact.' } },
        { id: 'c4', type: 'witness', title: { pl: 'Relacja uczennicy', en: 'Student statement' }, description: { pl: '„Kiedy zobaczyłam post, napisałam do koleżanki ze zdjęcia, czy wszystko w porządku.”', en: '“When I saw the post, I messaged the girl in the photo to ask if she was okay.”' }, category: 'support', explanation: { pl: 'Kontakt z osobą pokrzywdzoną to działanie wspierające.', en: 'Reaching out to the person affected is a supportive action.' } },
        { id: 'c5', type: 'timeline', title: { pl: 'Statystyki posta', en: 'Post statistics' }, description: { pl: 'W sobotę rano post miał 40 polubień i 15 komentarzy.', en: 'By Saturday morning the post had 40 likes and 15 comments.' }, category: 'fact', explanation: { pl: 'Liczby są widoczne pod postem – to sprawdzalny fakt.', en: 'The numbers are visible under the post – a verifiable fact.' } },
        { id: 'c6', type: 'witness', title: { pl: 'Relacja ucznia', en: 'Student statement' }, description: { pl: '„Widziałem post i dałem »lubię to«, bo wszyscy dawali.”', en: '“I saw the post and liked it because everyone was doing it.”' }, category: 'witness', explanation: { pl: 'To reakcja świadka – niestety zwiększająca zasięg krzywdzącej treści.', en: 'It’s a bystander reaction – unfortunately one that increases the reach of hurtful content.' } },
        { id: 'c7', type: 'witness', title: { pl: 'Zasłyszana informacja', en: 'Something overheard' }, description: { pl: '„Ktoś mówił, że autor ma też drugi profil, ale nie wiem kto.”', en: '“Someone said the author also has a second profile, but I don’t know who.”' }, category: 'assumption', explanation: { pl: 'Informacja z drugiej ręki, bez źródła – to przypuszczenie.', en: 'Second-hand information without a source – an assumption.' } },
        { id: 'c8', type: 'witness', title: { pl: 'Relacja ucznia', en: 'Student statement' }, description: { pl: '„Zrobiłem zrzut ekranu jako dowód i pokazałem go wychowawczyni. Nikomu innemu go nie wysyłałem.”', en: '“I took a screenshot as evidence and showed it to the form tutor. I didn’t send it to anyone else.”' }, category: 'support', explanation: { pl: 'Zachowanie dowodu bez rozpowszechniania i powiadomienie dorosłego to bardzo dobre działanie.', en: 'Keeping evidence without spreading it and telling an adult is a very good action.' } },
        { id: 'c9', type: 'chat', title: { pl: 'Komentarz', en: 'Comment' }, description: { pl: '„Moim zdaniem to był tylko głupi żart.”', en: '“In my opinion it was just a stupid joke.”' }, category: 'opinion', explanation: { pl: '„Moim zdaniem” – to opinia. Intencja autora nie zmienia skutku dla osoby ze zdjęcia.', en: '“In my opinion” – it’s an opinion. The author’s intent doesn’t change the impact on the person in the photo.' } },
        { id: 'c10', type: 'witness', title: { pl: 'Relacja ucznia', en: 'Student statement' }, description: { pl: '„Przewinąłem dalej i nic nie zrobiłem.”', en: '“I scrolled past and did nothing.”' }, category: 'witness', explanation: { pl: 'Reakcja świadka – bierna. Nie pogorszyła sytuacji, ale też nie pomogła.', en: 'A passive bystander reaction. It didn’t make things worse, but it didn’t help either.' } }
      ],
      questions: [
        {
          id: 'dq1',
          question: { pl: 'Czy na podstawie kart można wskazać autora profilu?', en: 'Can the cards tell us who runs the profile?' },
          options: [
            { pl: 'Tak – to ktoś z drugiej ławki.', en: 'Yes – it’s someone from the second row.' },
            { pl: 'Nie – mamy tylko przypuszczenia. Ustalenie tego należy do dorosłych.', en: 'No – we only have assumptions. Finding out is the adults’ job.' },
            { pl: 'Tak – wystarczy znaleźć jego drugi profil.', en: 'Yes – we just need to find their second profile.' }
          ],
          correctOption: 1,
          explanation: { pl: 'Karty o autorze to domysły. Gracz nie prowadzi śledztwa – rozpoznaje sytuację i wskazuje bezpieczną ścieżkę pomocy.', en: 'The cards about the author are guesses. The player doesn’t investigate – they recognise the situation and point to a safe way to get help.' }
        },
        {
          id: 'dq2',
          question: { pl: 'Co najbardziej przyczyniło się do szybkiego rozprzestrzenienia posta?', en: 'What contributed most to the post spreading quickly?' },
          options: [
            { pl: 'Polubienia i komentarze świadków zwiększały jego zasięg.', en: 'Likes and comments from bystanders increased its reach.' },
            { pl: 'Pora publikacji.', en: 'The time it was posted.' },
            { pl: 'Dobra jakość zdjęcia.', en: 'The good quality of the photo.' }
          ],
          correctOption: 0,
          explanation: { pl: 'Algorytmy pokazują częściej treści z dużą liczbą reakcji – każda reakcja świadka „podbija” post.', en: 'Algorithms show content with many reactions more often – every bystander reaction “boosts” the post.' }
        },
        {
          id: 'dq3',
          question: { pl: 'Która karta pokazuje najbezpieczniejszą reakcję świadka?', en: 'Which card shows the safest bystander reaction?' },
          options: [
            { pl: '„Dałem »lubię to«, bo wszyscy dawali.”', en: '“I liked it because everyone was doing it.”' },
            { pl: '„Zrobiłem zrzut ekranu jako dowód i pokazałem go wychowawczyni.”', en: '“I took a screenshot as evidence and showed it to the form tutor.”' },
            { pl: '„Myślę, że to na pewno ktoś z drugiej ławki.”', en: '“I think it’s definitely someone from the second row.”' }
          ],
          correctOption: 1,
          explanation: { pl: 'Zachowanie dowodu bez rozsyłania i zwrócenie się do zaufanego dorosłego to wzorcowa reakcja.', en: 'Keeping evidence without sharing it and turning to a trusted adult is a model reaction.' }
        }
      ],
      steps: [
        { id: 's1', safe: true, label: { pl: 'Zachować dowód (zrzut ekranu) bez rozsyłania go dalej', en: 'Keep evidence (a screenshot) without sharing it further' }, explanation: { pl: 'Dowód pomaga dorosłym działać, a nierozsyłanie nie zwiększa krzywdy.', en: 'Evidence helps adults act, and not sharing it avoids more harm.' } },
        { id: 's2', safe: true, label: { pl: 'Zgłosić post w serwisie', en: 'Report the post on the platform' }, explanation: { pl: 'Zgłoszenie może doprowadzić do usunięcia treści.', en: 'A report can lead to the content being removed.' } },
        { id: 's3', safe: true, label: { pl: 'Wesprzeć osobę ze zdjęcia', en: 'Support the person in the photo' }, explanation: { pl: 'Osoba pokrzywdzona potrzebuje sygnału, że nie jest sama.', en: 'The person affected needs to know they’re not alone.' } },
        { id: 's4', safe: true, label: { pl: 'Powiadomić wychowawcę lub pedagoga', en: 'Tell the form tutor or school counsellor' }, explanation: { pl: 'Dorośli mogą zadziałać zgodnie z procedurami szkoły.', en: 'Adults can act according to school procedures.' } },
        { id: 's5', safe: false, label: { pl: 'Opublikować imię osoby, którą podejrzewamy', en: 'Post the name of the person we suspect' }, explanation: { pl: 'Publiczne oskarżanie bez dowodów może skrzywdzić niewinną osobę i eskalować konflikt.', en: 'Publicly accusing someone without evidence can harm an innocent person and escalate the conflict.' } },
        { id: 's6', safe: false, label: { pl: 'Na własną rękę ustalać, kto prowadzi profil', en: 'Try to find out on our own who runs the profile' }, explanation: { pl: 'To zadanie dla dorosłych i odpowiednich instytucji – nie dla uczniów.', en: 'That is a job for adults and the right institutions – not for students.' } },
        { id: 's7', safe: false, label: { pl: 'Napisać obraźliwy komentarz pod postem', en: 'Write an insulting comment under the post' }, explanation: { pl: 'Odpowiadanie hejtem zwiększa zasięg posta i napięcie.', en: 'Replying with hate increases the post’s reach and the tension.' } }
      ]
    }
  ],
  summary: {
    pl: 'Rzetelna ocena sytuacji zaczyna się od odróżnienia faktów od opinii i domysłów. Rolą świadka nie jest śledztwo, lecz odpowiedzialne zgłoszenie i wsparcie.',
    en: 'A fair assessment starts with telling facts from opinions and guesses. A bystander’s role is not to investigate but to report responsibly and offer support.'
  },
  discussion: [
    { pl: 'Dlaczego nie powinniśmy oskarżać nikogo na podstawie przypuszczeń?', en: 'Why shouldn’t we accuse anyone based on assumptions?' },
    { pl: 'Jak „lubię to” pod krzywdzącym postem wpływa na sytuację?', en: 'How does a “like” under a hurtful post affect the situation?' },
    { pl: 'Komu w szkole można pokazać zachowany dowód?', en: 'Who at school can you show the saved evidence to?' }
  ]
};
