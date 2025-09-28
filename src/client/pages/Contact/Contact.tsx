import React from 'react'
import { BiSolidPhoneCall, BiLogoDiscordAlt } from "react-icons/bi"
import { MdEmail, MdLocationOn } from "react-icons/md"
import { BsTwitter, BsInstagram } from "react-icons/bs"
import styles from "./Contact.module.scss"
import images from "../../data/images1";

function Contact() {
  return (
    <div className={styles.parentContainer}>
        <div className={styles.container}>
            {/* Left Container */}
            <div className={styles.leftContainer} style={{ backgroundImage: `url(${images.contactBackgroundImage})`}}>
                <div className={styles.leftSubFirst}>
                    <h1 className={styles.mainHeading}>Informati de contact</h1>
                    <p className={styles.sloganText}>Say something to start a live chat!</p>
                </div>

                <div className={styles.leftSubFirst}>
                    <div className={styles.numberContainer}>
                        <BiSolidPhoneCall className={styles.icons} />
                        <p className={styles.callNumber}>+1012 3456 789</p>
                    </div>
                    <div className={styles.numberContainer}>
                        <MdEmail className={styles.iconsEmail} />
                        <p className={styles.callNumber}>demo@gmail.com</p>
                    </div>
                    <div className={styles.numberContainer}>
                        <MdLocationOn className={styles.icons} />
                        <p className={styles.callNumber}>
                            132 Dartmouth Street Boston, Massachusetts 02156 United States
                        </p>
                    </div>
                </div>

                <div className={styles.leftSubLast}>
                    <div className={styles.bottomIcon}>
                        <BsTwitter className={styles.bottomIconSelf} />
                    </div>
                    <div className={styles.bottomIcon}>
                        <BsInstagram />
                    </div>
                    <div className={styles.bottomIcon}>
                        <BiLogoDiscordAlt />
                    </div>
                </div>
            </div>
            
            {/* Right Container */}
            <div className={styles.rightContainer}>
                <div className={styles.nameInputContainer}>
                    <div className={styles.inputParent}>
                        <label htmlFor="prenume">Prenume </label>
                        <input type="text" name='Prenume' />
                    </div>
                    <div className={styles.inputParent}>
                        <label htmlFor="nume">Nume </label>
                        <input type="text" name='Nume' />
                    </div>
                </div>

                <div className={styles.nameInputContainer}>
                    <div className={styles.inputParent}>
                        <label htmlFor="prenume">Email </label>
                            <input type="email" name='Prenume' />
                    </div>
                    <div className={styles.inputParent}>
                        <label htmlFor="nume">Telefon </label>
                        <input type="text" name='Nume' className='nume' />
                    </div>
                </div>

                <div className={styles.nameInputContainer}>
                    <div className={styles.mesajInputParent}>
                        <label htmlFor="prenume">Mesaj </label>
                        <input type="text" name='mesaj' className='mesaj' />
                    </div>
                </div>

                <div className={styles.trimiteMesajButtonParent}>
                    <button className={styles.trimiteMesajButton}>
                        Trimite mesaj
                    </button>
                </div>

            </div>
        </div>
    </div>
  )
}

export default Contact;