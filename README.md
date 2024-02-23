# Todo-list Applikation README

Denna applikation tillåter användare att skapa och hantera en lista med "todos" (att-göra-uppgifter) i webbläsaren.

## Översikt
Todo-applikationen tillåter användare att lägga till, ta bort, markera som klar eller obearbetad, redigera och söka efter todos. Den har även funktionalitet för att spara todos lokalt i webbläsarens lagring för att bevara dem mellan sessioner.

## Installation

1. Klona detta projekt till din dator med `git clone https://github.com/Luayasaadsson/todo-list`.
2. För att komma åt projektet, kör i terminalen `npm run dev` och klistra in url:en som visas i terminalen i din webbläsare.

## Användning

### Lägga till todo

Användare kan lägga till en ny todo genom att skriva in uppgiften i inmatningsfältet och trycka på "Lägg till" eller trycka på Enter-tangenten. Varje ny todo får en unik ID och skapas med information om dess text, skapad status, och tidpunkt då den skapades.

### Redigera todo

För att redigera en todo, klickar användaren på pennikonen bredvid den. Todo-texten blir redigerbar och användaren kan ändra den som de önskar. Efter redigeringen kan användaren spara ändringarna genom att klicka på samma pennikon igen.

### Markera som klar/obehandlad

Användare kan markera en todo som klar eller obearbetad genom att klicka på kryssrutan bredvid den. Tillståndet för varje todo (klar eller obearbetad) sparas och visas visuellt för användaren.

### Ta bort todo

Användare kan ta bort en todo genom att klicka på papperskorgsikonen bredvid den. Innan borttagning bekräftar en dialogruta användaren om de är säkra på att de vill ta bort den valda todo.

### Rensa todo-listan

Användare kan med en knapp rensa hela listan om man önskar det. Det är ett smidigt och effektivt sätt att ångra det man har lagt in. Innan borttagning bekräftar en dialogruta användare om de är säkra på att de vill radera hela lista.

### Bonus: Sökfunktion

Den inkluderade sökfunktionen gör det möjligt för användare att filtrera todos baserat på en sökterm. När användaren skriver in en sökterm uppdateras listan med todos för att endast visa de som innehåller söktermen i sin text. Sökningen är fall-och-sortsensitiv för att ge användarna exakta resultat.

### Bonus: Papperskorg

Förbättrad användarupplevelse med den inbyggda Papperskorgsfunktion. Den tillhandahåller en smidig och effektiv metod för att hantera borttagna todos. Med Papperskorgen kan användare enkelt återställa eller permanent radera borttagna todos enligt deras behov.

- **Återställa Todos**: Hitta och återställ tidigare borttagna todos till huvudlistan för att fortsätta arbetet med dem.

- **Permanent Radering**: Möjligheten att permanent radera borttagna todos ger användare kontroll över sin lista och hjälper till att hålla den organiserad.

För att ytterligare förbättra användarupplevelsen har en diskret vibrationsanimation lagts till på papperskorgen som en visuell indikation på att en todo har flyttats till papperskorgen. Denna visuella återkoppling ger användaren en omedelbar bekräftelse på att deras åtgärd har utförts framgångsrikt och bidrar till att förbättra den övergripande interaktionsupplevelsen.

## Resonemang

### Designbeslut

Jag valde en minimalistisk designapproach när jag utvecklade användargränssnittet för todo-applikationen. Mitt fokus låg på att centrera todo-listfönstret på sidan för att omedelbart fånga användarens uppmärksamhet.

Med användarvänlighet i åtanke har jag skapat knappar av lite större storlek för att göra dem mer lättåtkomliga och inbjudande för användaren. För att förbättra användarupplevelsen ännu mer har jag implementerat en färgändringseffekt när man hovrar över knapparna. Denna visuella indikator gör det tydligt för användaren att knappen är interaktiv och att en åtgärd kan utföras genom att klicka på den.

Denna designstrategi syftar till att göra det enkelt och intuitivt för användare att interagera med applikationen och utföra olika uppgifter med minimal inlärningskurva.

### Implementeringsval

Jag valde att använda localStorage för att spara todos lokalt eftersom det är enkelt att använda och ger en smidig användarupplevelse utan att behöva använda en server. Dessutom valde jag att använda Font Awesome-ikoner för att förbättra gränssnittet och ge användarna tydliga visuella ledtrådar för varje funktionalitet.

I koden har jag använt mig av ternary operatorer i stor utsträckning för att hantera olika tillstånd och villkor på ett kompakt sätt. Detta tillvägagångssätt förbättrar läsbarheten och minskar kodens komplexitet jämfört med traditionella if-else-satser. Ternary operatorer är särskilt användbara när man behöver tilldela värden eller utföra enkla operationer baserat på ett villkor, vilket hjälper till att hålla koden ren och koncis.

När det gäller kodstrukturen valde jag att organisera koden i separata funktioner för att hantera olika delar av applikationen, såsom att lägga till, ta bort och redigera todos. Detta gjorde koden mer läsbar, underhållbar och enkel att felsöka.

## Styrkor

- **Användarvänligt gränssnitt**: Gränssnittet är intuitivt och enkelt att använda för att hantera todos.
- **Lokal lagring**: Todos sparas i webbläsarens lokal lagring för att bevara dem mellan sessioner.
- **Sökfunktion**: En sökfunktion tillåter användare att filtrera todos baserat på en sökterm för att hitta specifika uppgifter snabbt.

## Brister

- **Användargränssnittets utseende**: Gränssnittet kan förbättras för att vara mer visuellt tilltalande och attraktivt.
- **Validering av inmatningsfält**: Även om en alert visas när användaren försöker lägga till en tom todo, kan det finnas andra situationer där mer omfattande validering behövs för att förbättra användarupplevelsen. Trots att den befintliga valideringen kan vara tillräcklig för nuvarande användning, kan det vara fördelaktigt att utforska ytterligare möjligheter för att säkerställa att användarna kan skapa och hantera sina todos effektivt och smidigt.
- **Felhantering**: Felhanteringen för att spara todos i lokal lagring är grundläggande och kan förbättras för att hantera fler scenarier.

## Teknologier

- HTML
- CSS
- JavaScript










