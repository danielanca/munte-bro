import React, { useState, useEffect } from "react";
import { fetchAnalyticsSetting } from "../data/AnalyticsData";
import { useLocation } from "react-router-dom";

const AnalyticsSnippet: React.FC = () => {
  const [generalSnippetsLoaded, setGeneralSnippetsLoaded] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const loadGeneralAnalyticsScripts = async () => {
      try {
        const analyticsSettings = await fetchAnalyticsSetting();

        if (analyticsSettings) {
          let generalSnippets = "";
          
          if (analyticsSettings.googleGlobalTagSnippet) {
            generalSnippets += analyticsSettings.googleGlobalTagSnippet;
          }
          
          if (analyticsSettings.tiktokPixelID) {
            generalSnippets += analyticsSettings.tiktokPixelID;
          }
          
          if (analyticsSettings.facebookMetaTag) {
            generalSnippets += analyticsSettings.facebookMetaTag;
          }

          if (generalSnippets) {
            document.head.insertAdjacentHTML("beforeend", generalSnippets);
            setGeneralSnippetsLoaded(true);
          }
        }
      } catch (error) {
        console.error("Error loading general analytics:", error);
      }
    };

    if (!generalSnippetsLoaded) {
      loadGeneralAnalyticsScripts();
    }
  }, [generalSnippetsLoaded]);

  useEffect(() => {
    let eventSnippetElement: HTMLScriptElement | null = null;

    const loadEventSnippet = async () => {
      try {
        const analyticsSettings = await fetchAnalyticsSetting();

        if (analyticsSettings && analyticsSettings.googleEventSnippet) {
          eventSnippetElement = document.createElement("script");
          eventSnippetElement.innerHTML = analyticsSettings.googleEventSnippet;
          document.head.appendChild(eventSnippetElement);
        }
      } catch (error) {
        console.error("Error loading event analytics:", error);
      }
    };

    if (location.pathname === "/thank-you") {
      loadEventSnippet();
    } else if (eventSnippetElement) {
      document.head.removeChild(eventSnippetElement);
    }

    return () => {
      if (eventSnippetElement) {
        document.head.removeChild(eventSnippetElement);
      }
    };
  }, [location.pathname]);

  return null;
};

export default AnalyticsSnippet;
