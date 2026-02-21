// ImageGrid.tsx
import React from 'react';
import './ImageGrid.scss';

interface ImageItem {
  src: string;
  alt: string;
  name: string;
}

interface ImageGridProps {
  topRow: ImageItem[];
  bottomRow: ImageItem[];
}

const ImageGrid: React.FC<ImageGridProps> = ({ topRow, bottomRow }) => {
  return (
    <div className="image-grid">
      <div className="row row--two">
        {topRow.map((item, index) => (
          <div className="image-card" key={`top-${index}`}>
            <img src={item.src} alt={item.alt} loading="lazy" />
            <div className="overlay">
              <span className="overlay__text">{item.name}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="row row--three">
        {bottomRow.map((item, index) => (
          <div className="image-card" key={`bottom-${index}`}>
            <img src={item.src} alt={item.alt} loading="lazy" />
            <div className="overlay">
              <span className="overlay__text">{item.name}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImageGrid;