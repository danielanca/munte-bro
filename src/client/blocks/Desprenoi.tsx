import React from "react";
import styles from "./Desprenoi.module.scss";

const Desprenoi: React.FC = () => {
  return (
    <div className={styles.page}>
      <section className={styles.card}>
        <h1 className={styles.title}>Despre noi</h1>
        <div className={styles.text}>
          <p>
            Bine ați venit la DinMunte — locul unde frumusețea și relaxarea se
            întâlnesc într-o explozie de arome și prospețime. Suntem o echipă
            pasionată de produse de îngrijire personală și ne-am dedicat misiunii
            de a vă aduce cele mai naturale și benefice produse pentru baie.
          </p>
          <p>
            Cu sediul nostru în inima frumoasei Românii, ne mândrim cu faptul că
            aducem în casele dumneavoastră o selecție minunată de săpunuri
            artizanale și săruri de baie. Credem în puterea ingredientelor
            naturale și în beneficiile lor pentru piele. Fiecare produs este
            creat cu grijă și pasiune pentru o experiență de baie unică.
          </p>
          <p>
            Misiunea noastră este să vă ajutăm să vă răsfățați, să vă relaxați și
            să vă revitalizați. Produsele noastre sunt bogate în minerale,
            uleiuri esențiale și ingrediente organice de cea mai înaltă calitate.
          </p>
          <p>
            De la săpunurile noastre delicate și parfumate, la sărurile hrănitoare
            de baie, aducem o parte din luxul spa-urilor în confortul casei.
          </p>
          <p>
            Suntem aici pentru a vă inspira să aveți grijă de voi, să vă oferim
            produse de înaltă calitate și să vă ajutăm să vă bucurați de momente
            de răsfăț personal. Cu DinMunte, fiecare baie devine o experiență de
            neuitat.
          </p>
          <p>
            Vă mulțumim că ați ales să descoperiți lumea noastră de arome și
            prospețime. Sperăm că veți găsi produsele noastre la fel de minunate
            precum le-am creat pentru dumneavoastră.
          </p>
          <p>Cu dragoste și pasiune pentru îngrijirea dumneavoastră,</p>
        </div>
      </section>
    </div>
  );
};

export default Desprenoi;
