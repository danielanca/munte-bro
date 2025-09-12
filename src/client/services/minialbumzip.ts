import JSZip from "jszip";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage } from "../firebase";

export const miniAlbum_zipURL = async (firstName: string, lastName: string) => {
  const storedImages = JSON.parse(localStorage.getItem("minialbumImages") || "[]");

  if (storedImages.length === 0) {
    console.warn("No images. Proceed without zip file.");
    return ""; 
  }

  const zip = new JSZip();

  await Promise.all(
    storedImages.map(async (image: { url: string; name: string }) => {
      const response = await fetch(image.url);
      const blob = await response.blob();
      zip.file(image.name, blob);
    })
  );

  const zipBlob = await zip.generateAsync({ type: "blob" });
  const fileName = `${firstName}_${lastName}_${Date.now()}_minialbum.zip`;
  const storageRef = ref(storage, `minialbums/${fileName}`);

  return new Promise<string | null>((resolve, reject) => {
    const uploadTask = uploadBytesResumable(storageRef, zipBlob);

    uploadTask.on(
      "state_changed",
      snapshot => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log(`Uploaded ${progress}%`);
      },
      error => {
        console.error("Error uploading file:", error);
        reject(null);
      },
      async () => {
        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
        console.log("File available at:", downloadURL);
        localStorage.removeItem("minialbumImages");

        resolve(downloadURL);
      }
    );
  });
};
