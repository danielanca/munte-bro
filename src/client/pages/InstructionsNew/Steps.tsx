import React from 'react';
import Timer from './Timer';
import HolderImage from '/assets/images/instructions/holder.png';
import hearticon from '/assets/images/instructions/heart.png';
import openbox from '/assets/images/instructions/openbox.png';
import bucket from '/assets/images/instructions/bucket.png';
import bulb from '/assets/images/instructions/bulb.png';
import plug from '/assets/images/instructions/plug.png';
import artistpalette from '/assets/images/instructions/artist-palette.png';
import castle from '/assets/images/instructions/castle.png';
import filmprojector from '/assets/images/instructions/film-projector.png';
import glowingstar from '/assets/images/instructions/glowing-star.png';
import magicwand from '/assets/images/instructions/magic-wand.png';
import milk from '/assets/images/instructions/milk.png';
import musicnotes from '/assets/images/instructions/musicnotes.png';
import partypopper from '/assets/images/instructions/party-popper.png';
import sparklingheart from '/assets/images/instructions/sparkling-heart.png';
import timer from '/assets/images/instructions/timer.png';
import timerclock from '/assets/images/instructions/timer-clock.png';
import tophat from '/assets/images/instructions/top-hat.png';
import womanfairy from '/assets/images/instructions/woman-fairy.png';
import uncheck from '/assets/images/instructions/uncheck.png';
import check from '/assets/images/instructions/check.png';
import exclamationmark from '/assets/images/instructions/attention.png';


export const steps = [
  {
    stepNumber: 0,
    content: (
      <>
        <h3>
          Bine ai venit în <span className="red">lumea magică a creației!</span>
          <img
            src={hearticon}
            className="title-icon"
            alt="Heart Icon"
          />
        </h3>
        <p>
          Ești pe cale să creezi o <span>amintire unică,</span> ce va purta{" "}
          <span>amprenta</span> ta și/sau a celor dragi ție. Fiecare pas din
          acest proces va transforma momentele speciale în{" "}
          <span>obiecte pline de semnificație</span>.
        </p>
        <p>
          <span>Respectă pașii</span> simpli care urmează și lasă{" "}
          <span>magia</span> să se întâmple! Suntem aici pentru a te ghida în
          fiecare etapă.
        </p>
        <div className="instrct text-center">
          <img
            src={HolderImage}
            alt="Instruction Holder"
          />
        </div>
      </>
    ),
  },
  {
    stepNumber: 1,
    content: (
      <>
        <h4>Instrucțiuni</h4>
        <h3>
          Ce<span className="red"> ai nevoie</span> pentru a începe?
          <img
            src={openbox}
            className="title-icon"
            alt="Open Box Icon"
          />
        </h3>
        <p>
          Înainte să începi magia, asigură-te că pe lângă kit-ul primit, ai tot
          ce îți trebuie:
        </p>
        <ul>
          <li>
            <span>Mixer de bucătărie</span> (cu o singură paletă);
          </li>
          <li>
            <span>Apă</span> (la temperatura camerei);
          </li>
          <li>
            Un <span>telefon</span> (pentru a urmări instrucțiunile și a filma
            procesul).
          </li>
        </ul>
        <div className="instrct text-center">
          <img
            src={HolderImage}
            alt="Instruction Holder"
          />
        </div>
      </>
    ),
  },
  {
    stepNumber: 2,
    content: (
      <>
        <h4>Instrucțiuni</h4>
        <h3>
          <span className="red">Pasul 1:</span> Pregătește apa și găleata magică
          <img
            src={bucket}
            className="title-icon"
            alt="Bucket Icon"
          />
        </h3>
        <ul>
          <li>Golește găleata din kit;</li>
          <li>
            Umple-o cu apă până la <span>linia gradată</span> marcată pe
            exterior.
          </li>
        </ul>
        <p>
          <img
            src={bulb}
            className="title-icon"
            alt="Bulb Icon"
          />
          <span className="phead">Sfat: </span>Apa trebuie să fie la{" "}
          <span>temperatura camerei</span> - nici prea rece, nici prea caldă.
          Gândește-te la un ceai perfect, tocmai bun de băut!
        </p>
        <div className="instrct text-center">
          <img
            src={HolderImage}
            alt="Instruction Holder"
          />
        </div>
      </>
    ),
  },
  {
    stepNumber: 3,
    content: (
      <>
        <h4>Instrucțiuni</h4>
        <h3>
          <span className="red">Pasul 2:</span> Pregătește mixerul de bucătărie
          <img
            src={plug}
            className="title-icon"
            alt="Plug Icon"
          />
        </h3>
        <ul>
          <li>
            <span>Conectează mixerul</span> la priză;
          </li>
          <li>
            Atașează <span>o singură paletă</span> - magia începe aici!
          </li>
        </ul>
        <div className="instrct text-center">
          <img
            src={HolderImage}
            alt="Instruction Holder"
          />
        </div>
      </>
    ),
  },
  {
    stepNumber: 4,
    content: (
      <>
        <h4>Instrucțiuni</h4>
        <h3>
          Secretul din spatele magiei:<span className="red"> Ghid video</span>
          <img
            src={filmprojector}
            className="title-icon"
            alt="Plug Icon"
          />
        </h3>
        <ul>
          <li>
            Înainte să începi, urmărește video-ul pentru a învăța{" "}
            <span>cum să amesteci</span> praful fermecat din{" "}
            <span>punga A,</span> astfel încât să obții un rezultat de poveste!
          </li>
          <li>
            La pașii următori, vei găsi{" "}
            <span>instrucțiunile scrise</span> și{" "}
            <span>un cronometru</span> magic pentru o experiență facilă și de
            neuitat!
          </li>
        </ul>
        <div className="video-container">
          <video id="customVideo" controls poster="poster.jpg">
            <source
              src="http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4"
              type="video/mp4"
            />
            Your browser does not support the video tag.
          </video>
        </div>
        <div className="icon-text-container">
          <img
            src={check}
            alt="Check Icon"
            className="icon"
          />
          <div className="text-content">
            <p>
              Am vizionat video-ul și am înțeles cum să amestec în mod corect.
            </p>
          </div>
        </div>
      </>
    ),
  },
  {
    stepNumber: 5,
    content: (
      <>
        <h4>Instrucțiuni</h4>
        <h3>
          <span className="red">Pasul 3:</span> mixarea prafului fermecat
          (punga A)
          <img
            src={magicwand}
            className="title-icon"
            alt="Plug Icon"
          />
        </h3>
        <ul>
          <li>
            Toarnă <span>jumătate</span> din cantitatea de praf din{" "}
            <span>punga A (alginatul)</span> în apă;
          </li>
          <li>
            Pornește mixerul și amestecă{" "}
            <span>rapid, în sensul acelor de ceasornic,</span> ca un adevărat
            barista, timp de <span>15 secunde!</span>
          </li>
          <li>
            Apoi, adaugă <span>restul prafului</span> și continuă să mixezi
            pentru încă <span>1 minut.</span>
          </li>
        </ul>
        <p>
          <img src={exclamationmark} className="title-icon" alt="attention" />
          <span className="phead">Atenție:</span> În pasul următor, vei avea{" "}
          <span>un cronometru</span> pentru a te ajuta să respecți timpul{" "}
          <span>estimat</span> pentru mixarea pungii A în apă.
        </p>
        <div className="instrct text-center">
          <img
            src={HolderImage}
            alt="Instruction Holder"
          />
        </div>
      </>
    ),
  },
  {
    stepNumber: 6,
    content: (
      <>
        <h4>Instrucțiuni</h4>
        <h3>
          <span className="red">Cronometrul</span> este zâna ta cea bună
          <img
            src={womanfairy}
            className="title-icon"
            alt="Plug Icon"
          />
        </h3>
        <ul>
          <li>
            După ce apeși butonul <span>START CRONOMETRU</span> poți începe
            amestecul;
          </li>
          <li>
            Continuă să mixezi până obții o{" "}
            <span>textură cremoasă și fină,</span> ca smântâna;
          </li>
          <li>
            Când este perfect, <span>oprește mixerul</span> și pregătește-te
            pentru următorul pas.
          </li>
        </ul>
        <Timer />
      </>
    ),
  },
  {
    stepNumber: 7,
    content: (
      <>
        <h4>Instrucțiuni</h4>
        <h3>
          <span className="red">Pasul 4:</span> Momentul magic
          <img
            src={artistpalette}
            className="title-icon"
            alt="Plug Icon" />
        </h3>
        <ul>
          <li>
            <span>Introdu-ți mâinile</span> în amestecul din găleată și <span>poziționează-le</span> exact așa cum îți dorești pentru mulaj;
          </li>
          <li>
            Ține-le <span>nemișcate 2-3 minute</span> (vei mai avea un <span>cronometru</span> la pasul următor), până când materialul <span>se întărește.</span>
          </li>
          <li>
            Când este perfect, <span>oprește mixerul</span> și pregătește-te pentru următorul pas.
          </li>
        </ul>
        <p>
          <img src={exclamationmark} className="title-icon" alt="attention" />
          <span className="phead">Atenție:</span>
          După ce îți introduci mâinile, asigură-te că <span>nu atingi pereții</span> găleții cu
          degetele și că îți menții mâinile <span>nemișcate.</span>
        </p>
        <div className="instrct text-center">
          <img
            src={HolderImage}
            alt="Holder Icon" />
        </div>
      </>
    ),
  },
  {
    stepNumber: 8,
    content: (
      <>
        <h4>Instrucțiuni</h4>
        <h3>
          <span className="red">zâna:</span> cea bună s-a întors
          <img
            src={timer}
            className="title-icon"
            alt="Plug Icon" />
        </h3>
        <ul>
          <li>
            Acum e momentul să <span>rămâi nemișcat!</span> Cronometrul te va ghida pentru a ști exact
            <span> cât să aștepți</span> până când alginatul capătă consistența dorită;
          </li>
          <li>
            Poți <span>verifica cu degetul</span> de la cealaltă mână dacă <span>materialul s-a întărit.</span>
            Fii răbdător, magia se petrece acum!
          </li>
        </ul>
        <Timer />
      </>
    ),
  },

  {
    stepNumber: 9,
    content: (
      <>
        <div>
          <h4>Instrucțiuni</h4>
          <h3>
            <span className="red">Pasul 5:</span> Eliberează capodopera în devenire
            <img
              src={glowingstar}
              className="title-icon"
              alt="Plug Icon" />
          </h3>
          <ul>
            <li>
              Scoate mâinile câte una, <span>pe rând, încet și cu grijă, balansându-le</span> ușor stânga-dreapta - imaginează-ți
              că scoți o operă de artă!
            </li>
          </ul>
          <p>
            <img src={bulb} className="title-icon" alt="Bulb Icon" />
            <span className="phead">Sfat:</span> Fii <span>delicat</span>! Dacă te grăbești, poți pierde detalii importante.
          </p>
          <p>
            <img src={exclamationmark} className="title-icon" alt="attention" />
            <span className="phead">Atenție:</span> <span>Nu trage brusc,</span> pentru a evita deteriorarea matriței!
          </p>
          <div className="instrct text-center">
            <img
              src={HolderImage}
              alt="Holder Icon"
            />
          </div>
        </div>
      </>
    ),
  },
  {
    stepNumber: 10,
    content: (
      <>
        <div>
          <h4>Instrucțiuni</h4>
          <h3>
            <span className="red">Pasul 6:</span> Piatra de temelie a poveștii tale (punga B)
            <img
              src={castle}
              className="title-icon"
              alt="Plug Icon" />
          </h3>
          <ul>
            <li>Umple bolul de carton din kit cu apă până la linia neagră, marcată în interior;</li>
            <li>
              Adaugă <span>treptat</span> praful din <span>punga B (gipsul)</span> și amestecă-l <span>continuu</span> cu{' '}
              <span>mâna acoperită de mănușă.</span>
            </li>
          </ul>
          <p>
            <img src={bulb} className="title-icon" alt="Bulb Icon" />
            <span className="phead">Sfat:</span> <span>Sfărâmă orice cocoloașe</span> pentru o textură perfect uniformă. Astfel,
            amestecul tău va fi <span>neted și fin,</span> ca nisipul ud de pe plajă!
          </p>
          <div className="instrct text-center">
            <img
              src={HolderImage}
              alt="Holder Icon"
            />
          </div>
        </div>
      </>
    ),
  },
  {
    stepNumber: 11,
    content: (
      <>
        <div>
          <h4>Instrucțiuni</h4>
          <h3>
            <span className="red">Pasul 7:</span> turnarea gipsului - opera ta prinde formă
            <img
              src={musicnotes}
              className="title-icon"
              alt="Plug Icon" />
          </h3>
          <ul>
            <li>
              Toarnă <span>încet</span> gipsul în matriță, <span>strat cu strat</span> (aprox. <span>1/4</span> din cantitate);
            </li>
            <li>
              După fiecare strat, <span>scutură ușor găleata,</span> stânga-dreapta, pentru a <span>elimina bulele de aer</span> -
              astfel mulajul va fi perfect!
            </li>
          </ul>
          <p>
            <img src={bulb} className="title-icon" alt="Bulb Icon" />
            <span className="phead">Sfat:</span> Dacă gipsul <span>începe să se îngroașe,</span> adăugă <span>câteva picături</span>{' '}
            de apă și <span>amestecă</span> din nou.
          </p>
          <div className="instrct text-center">
            <img
              src={HolderImage}
              alt="Holder Icon"
            />
          </div>
        </div>
      </>
    ),
  },
  {
    stepNumber: 12,
    content: (
      <>
        <div>
          <h4>Instrucțiuni</h4>
          <h3>
            <span className="red">Pasul 8:</span> Așteptarea dulce-amară
            <img
              src={timerclock}
              className="title-icon"
              alt="Plug Icon" />
          </h3>
          <ul>
            <li>
              Așează găleata într-un <span>loc uscat,</span> ferit de frig și umiditate (ex.: lângă <span>calorifer</span>);
            </li>
            <li>
              Lasă mulajul <span>să se întărească</span> timp de 24-48 de ore - nu-ți face griji pentru timp, vei avea un{' '}
              <span>cronometru</span> la pasul următor, ca să te poți relaxa în voie!
            </li>
          </ul>
          <p>
            <img src={bulb} className="title-icon" alt="Bulb Icon" />
            <span className="phead">Sfat:</span> Dacă ai introdus un <span>inel de logodnă,</span> te sfătuim să aștepți cel
            puțin <span>30-40 de ore</span> pentru o întărire completă.
          </p>
          <div className="instrct text-center">
            <img
              src={HolderImage}
              alt="Holder Icon"
            />
          </div>
        </div>
      </>
    ),
  },

  {
    stepNumber: 13,
    content: (
      <>
        <h4>Instrucțiuni</h4>
        <h3>
          Știm că <span className="red">așteptarea</span> poate fi provocatoare!
          <img
            src={sparklingheart}
            className="title-icon"
            alt="Plug Icon" />
        </h3>
        <ul>
          <li>
            <span>Felicitări!</span> Ai făcut o treabă grozavă până acum! Cea mai dificilă parte e în urmă - acum e <span>momentul tău de relaxare!</span>
          </li>
          <li>
            <span>Pornește cronometrul</span> și lasă restul pe seama noastră. Ne revedem când <span>timpul s-a scurs și magia s-a întâmplat!</span>
          </li>
        </ul>
        <Timer />
      </>
    ),
  },

  {
    stepNumber: 14,
    content: (
      <>
        <h4>Instrucțiuni</h4>
        <h3>
          <span className="red">Pasul 9:</span> Dezvăluirea operei de artă!
          <img
            src={tophat}
            className="title-icon"
            alt="Plug Icon" />
        </h3>
        <ul>
          <li>
            Întoarce găleata <span>cu capul în jos</span> și <span>lovește ușor</span> fundul acesteia– e ca și cum ai scoate un iepure din joben!
          </li>
          <li>
            Dacă matrița nu iese ușor, <span>taie</span> cu grijă fundul și marginile găleții cu un <span>cuțit;</span>
          </li>
          <li>
            Folosește-te de <span>degete</span> pentru a îndepărta cu grijă matrița, pornind de la <span>marginea superioară;</span>
          </li>
          <li>
            Curăță <span>resturile</span> cu <span>scobitoarea din kit</span> pentru un rezultat perfect!
          </li>
        </ul>
        <div className="instrct text-center">
          <img
            src={HolderImage}
            alt="Holder Icon"
          />
        </div>
      </>
    ),
  },
  {
    stepNumber: 15,
    content: (
      <>
        <h4>Instrucțiuni</h4>
        <h3>
          <span className="red">Pasul 10:</span> rețeta secretă pentru un alb de poveste
          <img
            src={milk}
            className="title-icon"
            alt="Plug Icon" />
        </h3>
        <ul>
          <li>
            Dacă <span>la început</span> mulajul are o <span>nuanță gri</span>, nu te îngrijora! <span>Lasă-l câteva zile</span> să se usuce complet - și voilà! Mulajul tău va fi <span>perfect alb!</span>
          </li>
        </ul>
        <p>
          <img src={bulb} className="title-icon" alt="Bulb Icon" />
          <span className="phead">Sfat:</span>
          Este important <span>să nu îl acoperi</span> cu nimic până atunci, pentru <span>a se usca așa cum trebuie</span> și a străluci în toată splendoarea lui!
        </p>
        <div className="instrct text-center">
          <img
            src={HolderImage}
            alt="Holder Icon"
          />
        </div>
      </>
    ),
  },
  {
    stepNumber: 16,
    content: (
      <>
        <h4>Instrucțiuni</h4>
        <h3>
          Felicitări, <span className="red">ai reușit!</span>
          <img
            src={partypopper}
            className="title-icon"
            alt="Plug Icon" />
        </h3>
        <p>
          Ai creat <span>un mulaj perfect</span> și acum ai o <span>amintire unică</span> în mâinile tale.
          Nu uita să îți păstrezi capodopera <span>cu drag!</span>
        </p>
        <p>
          <span>Îți mulțumim că ai ales kit-ul nostru! Sperăm că ai avut o experiență minunată!</span>
        </p>
        <div className="instrct text-center">
          <img
            src={HolderImage}
            alt="Holder Icon"
          />
        </div>
      </>
    ),
  },
];
