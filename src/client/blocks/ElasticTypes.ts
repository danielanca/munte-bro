interface GalleryType {
  name: string;
  link: string;
  image: string;
  text: string;
}
export interface GalleryProps {
  [name: string]: GalleryType;
}
