import React from 'react'
import styles from "./PoliticaDeConfidentialitate.module.scss"

function PoliticaDeConfidentialitate() {
  return (
    <div className={styles.MainParentContainer}>
        <div className={styles.MainContainer}>
            <h1 className={styles.MainHeading}>Politica de Confidentialitate</h1>
            <span className={styles.textContainer}>
                <p>Confidentialitatea datelor dumneavoastra cu caracter personal reprezinta una dintre preocuparile principale ale ELYS MOMOANE s.r.lJudet Cluj-Napoca,Localitatea Turda Strada Fragariste Nr 28 cod postal 401169 in calitate de operator de date.</p>
                <p>Acest document are rolul de a va informa cu privire la prelucrarea datelor dumneavoastra cu caracter personal, in contextul utilizarii paginii de internet https://www.dinmunte.ro, la care ne vom referi in continuare cu denumirea "site-ul".</p>
                <p>Cuprins</p>
                <p>
                    <ol>
                        <li>Categoriile de date cu caracter personal prelucrate</li>
                        <li>Scopurile si temeiurile prelucrarii</li>
                        <li>Durata pentru care va prelucram datele</li>
                        <li>Dezvaluirea datelor cu caracter personal</li>
                        <li>Transferul datelor cu caracter personal</li>
                        <li>Drepturile de care beneficiati</li>
                        <li>Confidentialitatea minorilor</li>
                        <li>Modificari in politica de confidentialitate</li>
                    </ol>
                </p>
                {/* <p> */}
                    <ol type='1'>
                        <li>Categoriile de date cu caracter personal prelucrate</li>
                        <ol type='A'>
                            <li>Daca sunteti client al site-ului, va prelucra datele dumneavoastra cu caracter personal, cum ar fi:</li>
                            <ul style={{ listStyleType: 'disc'}}>
                                <li>Nume si prenume</li>
                                <li>Numar de telefon</li>
                                <li>Adresa de e-mail</li>
                                <li>Adresa de facturare</li>
                                <li>Adresa de livrare</li>
                                <li>Date referitoare la modul in care utilizati site-ul (de exemplu, comportamentul /preferintele /obisnuintele dumneavoastra in cadrul domains</li>
                                <li>Precum si orice alte categorii de date pe care le furnizati in mod direct in contextul crearii contului de utilizator, in contextul plasarii unei comenzi prin intermediul site-ului sau in orice alt mod care rezulta din utilizarea site-ului.</li>
                                <p>Daca pentru a va crea cont de utilizator pe site, utilizati contul dumneavoastra de Facebook sau Google, va prelucra urmatoarele date publice de profil afisate de aplicatiile respective: nume utilizator, adresa de e-mail.</p>
                            </ul>
                        </ol>
                    </ol>
                {/* </p> */}
                <p>OUG nr. 34/2014 privind drepturile consumatorilor in cadrul contractelor incheiate cu profesionistii</p>
                <p>Legea nr. 363/2007 privind combaterea practicilor incorecte ale comerciantilor in relatia cu consumatorii si armonizarea reglementarilor cu legislatia europeana privind protectia consumatorilor</p>
                <p>Legea 365/2002 privind comertul electronic</p>
                <p>ELYS MOMOANE s.r.lgaranteaza utilizatorului acces limitat, in interes personal (efectuarea de comenzi online, informare), pe site-ul www.dinmunte.ro si nu ii confera dreptul de a descarca sau de a modifica partial sau integral site-ul, de a reproduce partial sau integral site-ul, de a copia, de a vinde/revinde sau de a exploata site-ul in orice alta maniera, in scopuri comerciale sau fara acordul prealabil scris al acesteia.</p>
                <p>Intregul continut al site-ului www.dinmunte.ro - imagini, texte, grafice, simboluri, elemente de grafica web, email-uri, scripturi, programe si alte date - este proprietatea ELYS MOMOANE s.r.l si a furnizorilor sai si este aparat de Legea pentru protectia drepturilor de autor (legea nr. 8/1996) si de legile privind</p>
                <p>proprietatea intelectuala si industriala. Folosirea fara acordul propietaruluiELYS MOMOANE s.r.l a oricaror elemente enumerate mai sus se pedepseste conform legislatiei in vigoare.</p>
                <p>Domeniul www.dinmunte.ro este detinut de catre ELYS MOMOANE s.r.l Utilizarea acestei marci, a domeniului sau a numelor de comercializare, siglelor si emblemelor, in forma directa sau "ascunsa" (de tipul, dar nu limitat la, meta taguri sau alte tehnici de indexare, cautare web) fara permisiunea prealabila scrisa este interzisa si se pedepseste conform legii.</p>
                <p>Produsele prezentate pe www.dinmunte.ro sunt si comercializare de ELYS MOMOANE s.r.l Preturile produselor pot fi schimbate oricand. Verificati pretul final de vanzare inainte de a achizitiona un produs.</p>
            </span>
        </div>
    </div>
  )
}

export default PoliticaDeConfidentialitate