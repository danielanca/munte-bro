import { CSSProperties } from 'react';
import image2 from '../images/frame2.png';
import image3 from '../images/fram3.png';
import image4 from '../images/frame3.jpg';
import image5 from '../images/fram4.png';

export const getFrameStyles = (selectedFrameStyle: string): CSSProperties => {
  switch (selectedFrameStyle) {
    case image2:
      return {
        width: '110%',
        height: '100%',
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%) scale(1.3)',
      };
    case image3:
      return {
        width: '120%',
        height: '120%',
      };
    case image4:
      return {
        border: '7px double #228b22',
        boxShadow: '0 0 10px rgba(34, 139, 34, 0.5)',
        borderRadius: '10px',
        width: '120%',
        height: '120%',
        transform: 'scale(1.1)',
      };
    case image5:
      return {
        width: '120%',
        height: '120%',
      };
    default:
      return {
        width: '100%',
        height: '100%',
      };
  }
};
