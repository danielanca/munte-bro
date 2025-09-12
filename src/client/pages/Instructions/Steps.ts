// steps.ts
import { Step } from "./WizardTypes";
export const steps: Step[] = [
  {
    stepNumber: 1,
    title: "PASUL 1",
    description: "Umplerea galetii cu apa",
    contentHTML: `
      <p class="left-text">Golim galeata unde au fost introduse toate, si turnam apa pana la linia marcata in <span class="yellowhighlight">exteriorul galetii</span></p> 
      <img class="ilustration" src="https://i.pinimg.com/736x/30/8d/d0/308dd0a94f35f8bdc3de81ae8032ac67.jpg" />
      <p class="yellowhighlight">ATENTIE! Apa la temperatura camerei</p>
      <p class="left-text">Nu folositi apa prea calda sau prea rece, deoarece poate afecta pasta rezultata.</p>
    `,
  },
  {
    stepNumber: 2,
    title: "PASUL 2",
    description: "Adaugare continut punga A",
    contentHTML: `
      <p class="text left-text">Ne asiguram ca mixerul este in priza si pregatit de utilizare.</p>
      <p class="yellowhighlight">ATENTIE! Citit integral acest pas inainte de a incepe mixarea.</p>
      <p class="text left-text">Adaugam <span class="underline">JUMATATE</span> (1/2) din punga A si incepem sa amestecam cu mixerul.</p>
      <img class="ilustration" src="https://i.pinimg.com/736x/30/8d/d0/308dd0a94f35f8bdc3de81ae8032ac67.jpg" />
      <p class="text left-text top-margin">In timp ce amestecati, <span class="underline">miscati mixerul in sens de ceasornic</span>, pentru a spori realizarea amestecului cat mai repede.</p>
      <p class="text left-text">Adaugam si restul din PUNGA A, si continuam sa amestecam.</p>
      <span class="bottom-note">In urmatorul pas veti avea un cronometru. Acesta va va ajuta sa stiti cu <strong>aproximatie</strong> cat ar trebui sa dureze mixarea pungii A in apa.</span>
    `,
  },
  {
    stepNumber: 3,
    title: "PASUL 3",
    description: "Inceperea amestecului",
    contentHTML: `
      <p class="text left-text">Dupa actionarea butonului START CRONOMETRU, puteti incepe amestecul.</p>
      <p class="left-text yellowhighlight bigger">Dupa ce obtineti o consistenta cremoasa, opriti mixerul, introduceti mainile.</p>
    `,
  },
  {
    stepNumber: 4,
    title: "PASUL 4",
    description: "Mixare pudra A cu apa",
    contentHTML: `
      <p class="left-text">AMESTECAM</p>
      <img class="ilustration" src="https://i.pinimg.com/736x/30/8d/d0/308dd0a94f35f8bdc3de81ae8032ac67.jpg" />
      <p class="left-text yellowhighlight top-margin">Continuam sa amestecam pana avem o textura cremoasa!<br><br> Cand am terminat punem mixer-ul deoparte!</p>
    `,
  },
  {
    stepNumber: 5,
    title: "PASUL 5",
    description: "Introducerea mainilor in galeata",
    contentHTML: `
      <p class="left-text">Introducem mainile in galeata.</p>
      <img class="ilustration" src="https://i.pinimg.com/736x/30/8d/d0/308dd0a94f35f8bdc3de81ae8032ac67.jpg" />
      <p class="left-text yellowhighlight top-margin">Dupa ce am introdus mainile este important sa nu atingem cu degetele peretii galetii si sa nu miscam mainile dupa ce le-am introdus.</p>
    `,
  },
  {
    stepNumber: 6,
    title: "PASUL 6",
    description: "Asteptam, desigur!",
    contentHTML: `
      <p class="left-text">La fel ca painea la dospit, asteptam momentul dorit. Recomandam 3 minute cu mainile in galeata, pana se incheaga toata compozitia.</p>
      <p class="left-text">Dupa 3 minute, puteti apasa cu degetul (de la o mana libera) pentru a vedea daca s-a intarit compozitia. Daca este o compozitie asemanatoare cu a siliconului, putem scoate mainile usor, cate una.</p>
      <img class="ilustration" src="https://i.pinimg.com/736x/30/8d/d0/308dd0a94f35f8bdc3de81ae8032ac67.jpg" />
    `,
  },
  {
    stepNumber: 7,
    title: "PASUL 7",
    description: "Preparam ghips-ul din punga B",
    contentHTML: `
      <p class="left-text">Punem deoparte galeata, dupa ce am scos mainile afara si ne pregatim sa luam manusa.</p>
      <p class="left-text">Bolul de carton are o linie in interior. Umplem cu apa pana la acea linie neagra din interior.</p>
      <img class="ilustration" src="https://i.pinimg.com/736x/30/8d/d0/308dd0a94f35f8bdc3de81ae8032ac67.jpg" />
    `,
  },
  {
    stepNumber: 8,
    title: "PASUL 8",
    description: "Turnam pudra din punga B",
    contentHTML: `
      <p class="left-text">Turnam toata pudra din punga B si amestecam cu mana.</p>
      <img class="ilustration" src="https://i.pinimg.com/736x/30/8d/d0/308dd0a94f35f8bdc3de81ae8032ac67.jpg" />
      <p class="left-text yellowhighlight">Ne concentram sa nu ramana cocoloase. Zdrobim toate cocoloasele!</p>
    `,
  },
  {
    stepNumber: 9,
    title: "PASUL 9",
    description: "Turnam in galeata",
    contentHTML: `
      <p class="left-text">Turnam rezultatul obtinut in matrita ce tocmai am realizat-o.</p>
      <img class="ilustration" src="https://i.pinimg.com/736x/30/8d/d0/308dd0a94f35f8bdc3de81ae8032ac67.jpg" />
      <p class="left-text yellowhighlight">Recomandam sa turnati jumatate din bol prima data, si sa scuturati galeata, pentru ca materialul sa patrunda prin toate orificiile greu accesibile.</p>
    `,
  },
  {
    stepNumber: 10,
    title: "PASUL 10",
    description: "Asteptarea asta!",
    contentHTML: `
      <p class="left-text">Dupa ce am turnat pana sus, lasam galeata intr-un loc ferit de umiditate si frig.</p>
      <p class="left-text">Revenim inapoi pe aceasta pagina in 24 ore.</p>
      <p class="left-text yellowhighlight">Mai sunt niste sfaturi de oferit ca sa nu stricam mulajul obtinut inainte de a fi gata! Ne vedem maine!</p>
      <p class="left-text">Recomandam 24-48 ore deoarece este un interval bun pentru ca mulajul din interior sa nu fie prea sensibil.</p>
      <p class="left-text">Daca ati introdus un inel de logodna, va recomandam cel putin 30-40 ore, deoarece varful inelului poate fi afectat daca nu este suficienta priza (intarire).</p>
    `,
  },
  {
    stepNumber: 11,
    title: "PASUL 11",
    description: "Instrucțiuni video",
    contentHTML: `
      <p class="left-text">Urmăriți videoclipul de instrucțiuni pentru a vizualiza pașii detaliați.</p>
    `,
  }
  
];
