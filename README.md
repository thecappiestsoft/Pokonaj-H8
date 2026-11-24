# Pokonaj H8 – struktura projektu

Aplikacja działa bez serwera i bez kroku budowania: wystarczy otworzyć `index.html`
w przeglądarce (również z `file://`). Nie używa modułów ES – wszystkie pliki JS
rejestrują się w globalnej przestrzeni nazw `window.PH8` (patrz `js/core/namespace.js`).

> **Kolejność `<script>` w `index.html` ma znaczenie.** Nowy plik dodaj w odpowiedniej
> sekcji (dane → usługi → komponenty → aplikacja → gry), a `js/app.js` zostaw na końcu.

## Gdzie co poprawiać

| Chcę zmienić… | Plik(i) |
|---|---|
| Szkielet strony (nagłówek, stopka, kontenery) | `index.html` |
| Kolory, fonty, odstępy (zmienne CSS, motyw jasny/ciemny) | `css/variables.css` |
| Reset przeglądarki | `css/reset.css` |
| Układ aplikacji (body, header, kolumny) | `css/layout.css` |
| Przyciski, karty, modale, toasty, ikony | `css/components.css` |
| Wygląd ekranów i poszczególnych gier | `css/screens.css` |
| Widok mobilny / tablet | `css/responsive.css` |
| Skórki „komunikatora” (desktop / phone / retro) | `css/skins.css` |
| Ikona karty przeglądarki | `assets/favicon.svg` |
| **Teksty interfejsu (PL/EN)** | `data/ui-strings.js` |
| Opisy, zasady i czasy 7 trybów gry | `data/games.js` |
| Poziomy XP i odznaki | `data/achievements.js` |
| Treści konkretnych gier (wypowiedzi, scenariusze, zagadki…) | `data/<gra>.js` |
| Ikony SVG używane w UI | `js/components/Icons.js` |
| Zapis w LocalStorage | `js/core/StorageManager.js` |
| Ustawienia (motyw, język, dźwięk, kontrast) | `js/core/SettingsManager.js` |
| Dźwięki (Web Audio) | `js/core/AudioManager.js` |
| Punktacja i XP | `js/core/ScoreManager.js` |
| Postęp i ukończone tryby | `js/core/ProgressManager.js` |
| Warunki zdobywania odznak | `js/core/AchievementManager.js` |
| Tłumaczenia – mechanizm | `js/core/I18n.js` |
| Cykl życia gry (start, pauza, wyniki) | `js/core/GameManager.js` |
| Ekrany poza grą (start, menu, instrukcja, ustawienia, pomoc) | `js/core/Views.js` |
| Routing widoków, nagłówek z przełącznikami | `js/core/AppController.js` |
| Tryb nauczyciela | `js/teacher/TeacherMode.js` |
| Logika konkretnej gry | `js/games/<gra>/<gra>.js` |
| Punkt startowy aplikacji | `js/app.js` |

## Gry: logika ↔ treść

| Gra | Logika | Treść |
|---|---|---|
| Hejt Detector | `js/games/hejt-detector/` | `data/hejt-detector.js` |
| Social Media Challenge | `js/games/social-media-challenge/` | `data/social-media-scenarios.js` |
| Twoja Decyzja | `js/games/twoja-decyzja/` | `data/decision-stories.js` |
| Detektywi Internetu | `js/games/detektywi-internetu/` | `data/detective-cases.js` |
| Escape Room | `js/games/escape-room/` | `data/escape-room.js` |
| Misja: STOP HATE | `js/games/misja-stop-hate/` | `data/campaign-missions.js` |
| Bitwa na Argumenty | `js/games/bitwa-na-argumenty/` | `data/debate-topics.js` |

Kod jest 1:1 z wersji jednoplikowej `pokonaj-h8-single.html` – zmieniono tylko sposób
dołączania plików (`<link>` / `<script src>` zamiast kodu inline).
