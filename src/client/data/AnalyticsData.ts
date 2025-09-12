import { collection, doc, getFirestore, getDoc, setDoc  } from "firebase/firestore";
import app from "../firebase";

let AnalyticsData :any[]= [];

const db = getFirestore(app);
const dbTest = getFirestore("test");

interface AnalyticsSettingType {
    googleGlobalTagSnippet: string;
    googleEventSnippet: string;
    tiktokPixelID: string;
    facebookMetaTag: string;
  }

  export const addAnalyticsSetting = async (setting: AnalyticsSettingType) => {
    try {
      const analyticsSettingDocRef = doc(db, "settings", "analytics_setting");
      await setDoc(analyticsSettingDocRef, setting);
      console.log("Analytics settings successfully added.");
    } catch (error) {
      console.error("Error adding analytics settings:", error);
      throw error;
    }
  };
  
  export const fetchAnalyticsSetting = async () => {
    try {
      const analyticsSettingDocRef = doc(db, "settings", "analytics_setting");
      const analyticsSettingSnap = await getDoc(analyticsSettingDocRef);
  
      if (analyticsSettingSnap.exists()) {
        return analyticsSettingSnap.data() as AnalyticsSettingType;
      } else {
        console.log("No analytics settings found.");
        return null;
      }
    } catch (error) {
      console.error("Error fetching analytics settings:", error);
      throw error;
    }
  };

  export default AnalyticsData;