import React from 'react'
import styles from "./../Products/FeaturedTextNew.module.scss";
import images from "../../../data/images1";

function FeaturedTextNew() {
  return (
    <div className={styles.featuredTextContainer}>
        <div className={styles.featuredTextSubcontainer}>
            {/* 1st Container */}
            <div className={styles.featuredFirstRow}>
                    <div className={styles.featuredFirstFirst}>
                        <div className={styles.featuredFirstFirst1}>
                            <div>
                                <div className={styles.SiropuriDinMunteLittleHeadingBorder}></div>
                                <div className={styles.SiropuriDinMunteLittleHeading}>Siropuri din munte</div>
                            </div>
                        </div>
                        <div className={styles.featuredFirstFirst2}>
                            <div className={styles.SiropuriDinMunteMainProductHeading}>siropurile din munte</div>
                            <div className={styles.SiropuriDinMunteMainProductDesc}>Produsele noastre sunt 100% naturale, nu contin coloranti sau aditivi sintetici si sunt notificate de Ministerul Sanatatii. Lasa-te cuprins de savoarea siropurilor presate la rece </div>
                        </div>
                        <div className={styles.featuredFirstFirst3}>
                            <div>
                                <div className={styles.SiropuriDinMunteLittleHeadingBorder}></div>
                                <div className={styles.SiropuriDinMunteLittleHeading}>Siropuri din munte</div>
                            </div>
                            <div className={styles.featuredFirstFirst32}>
                                <img className={styles.artificialFlower} src={images.artificialFlower} alt="" />
                            </div>
                        </div>
                    </div>
                    <div className={styles.imgContainer}>
                        <img className={styles.siropurileDinMunteMainImg} src={images.siropurileDinMunte} alt="" />
                    </div>
            </div>

            {/* 2nd Container */}
            <div className={styles.featuredFirstRow}>
                    <div className={styles.img2Container}>
                        <img className={styles.siropurileDinMunteMainImg} src={images.siropurileDinMunte2} alt="" />
                    </div>
                    <div className={styles.featuredSecondSecond}>
                        <div className={styles.featuredSecondSecond1}>
                            <img className={styles.featuredSecondSecond11} src={images.artificialFruit} alt="" />
                        </div>
                        <div className={styles.featuredFirstFirst2}>
                            <div className={styles.SiropuriDinMunteMain2ProductHeading}>Bombe de baie</div>
                            {/* <div className={styles.SiropuriDinMunteMainProductHeading}>siropurile din munte</div> */}
                            <div className={styles.SiropuriDinMunteMainProductDesc2}>Bombele de baie sunt mici obiecte sferice care sunt utilizate pentru a transforma baia într-un spa relaxant. Ele sunt realizate din ingrediente naturale, cum ar fi sare de mare, bicarbonat de sodiu, uleiuri esențiale și coloranți alimentari. Când sunt plasate în apă, bombele de baie eliberează arome plăcute și culori vibrante, transformând baia într-o experiență spa personalizată. Acestea sunt perfecte pentru a-ți face timpul petrecut în baie mai relaxant și mai plăcut.</div>
                            {/* <div>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Adipisci sunt eum odio in laboriosam aspernatur minima quae voluptas. Reiciendis enim beatae sunt eius aperiam, facilis quas quidem voluptate, architecto molestias, adipisci suscipit cumque odio?</div> */}
                        </div>
                        <div>
                            
                        </div>
                        {/* <div className={styles.featuredFirstFirst3}>
                            <div>
                                <div className={styles.SiropuriDinMunteLittleHeadingBorder}></div>
                                <div className={styles.SiropuriDinMunteLittleHeading}>Siropuri din munte</div>
                            </div>
                            <div className={styles.featuredFirstFirst32}>
                                <img className={styles.artificialFlower} src={images.artificialFlower} alt="" />
                            </div>
                        </div> */}
                    </div>
            </div>
        </div>

        {/* Featured Sub-SubContainer */}
        <div className={styles.featuredSubContainer2}>
            <div className={styles.featuredSubContainer2ImageContainer}>
                <img className={styles.featuredSubContainer2Image} src={images.FeaturedSubSubContainerImage} alt="" />
                <img className={styles.featuredSubContainer2TabletImage} src={images.FeaturedSubSubContainerTabletImage} alt="" />
            </div>
            <div className={styles.featuredSubSubContainer2TextContainer}>
                <div className={styles.featuredSubSubContainerHeading}>Descopera sarea <span className={styles.colons}>''</span> <br />  noastra de baie </div>
                <div className={styles.featuredSubSubContainerDesc}>Bombele de baie sunt mici obiecte sferice care sunt utilizate pentru a transforma baia într-un spa relaxant. Ele sunt realizate din ingrediente naturale, cum ar fi sare de mare, bicarbonat de sodiu, uleiuri esențiale și coloranți alimentari. Când sunt plasate în apă, bombele de baie eliberează arome plăcute și culori vibrante, transformând baia într-o experiență spa personalizată. Acestea sunt perfecte pentru a-ți face timpul petrecut în baie mai relaxant și mai plăcut.</div>
                <div className={styles.featuredSubSubContainerButton}>Afla mai mult</div>
                <div className={styles.artificialFlowerEndContainer}><img className={styles.artificialFlowerEnd} src={images.artificialFlower} alt="" /></div>
            </div>
        </div>
    </div>
  )
}

export default FeaturedTextNew