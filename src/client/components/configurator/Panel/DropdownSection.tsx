import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMoon, faImage, faCog, faTextHeight, faBox } from '@fortawesome/free-solid-svg-icons';
import styles from './DropdownSection.module.css';

interface DropdownSectionProps {
  title: string;
  children: React.ReactNode;
}

const DropdownSection: React.FC<DropdownSectionProps> = ({ title, children }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleOpen = () => {
    setIsOpen(!isOpen);
  };

  // Function to get the right icon based on the title
  const getIcon = (title: string) => {
    switch (title) {
      case 'Moon Styles':
        return faMoon;
      case 'Background Styles':
        return faImage;
      case 'Movement':
        return faCog;
      case 'Text':
        return faTextHeight;
      case 'Design':
        return faBox;
      default:
        return faMoon;
    }
  };

  return (
    <div className={styles.dropdownSection}>
      <div className={styles.header} onClick={toggleOpen}>
        <div className={styles.titleContainer}>
          {/* Mobile-specific icons */}
          <div className={styles.iconContainer}>
            <FontAwesomeIcon icon={getIcon(title)} className={styles.menuIcon} />
          </div>
          <span className={styles.title}>{title}</span>
          {/* Web-specific icons */}
          <div className={styles.icons}>
            <div className={styles.circle}></div>
            <div className={isOpen ? styles.arrowDown : styles.arrowRight}></div>
          </div>
        </div>
      </div>
      {isOpen && (
        <div className={styles.content}>
          {children}
        </div>
      )}
    </div>
  );
};

export default DropdownSection;
