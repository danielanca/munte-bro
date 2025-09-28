import React, { useEffect, useRef, useState } from "react";
import { useInRouterContext, useLocation } from "react-router"; // v7: import from "react-router"
import { fetchAnalyticsSetting } from "../data/AnalyticsData";

// Small helpers
const isBrowser = () => typeof document !== "undefined" && typeof window !== "undefined";

const GENERAL_CONTAINER_ID = "analytics-general-snippets";
const EVENT_SCRIPT_ID = "analytics-event-snippet";

const AnalyticsSnippet: React.FC = () => {
  const inRouter = useInRouterContext();
  if (!inRouter || !isBrowser()) return null;

  const location = useLocation();

  const [settings, setSettings] = useState<any>(null);
  const generalLoadedRef = useRef(false);

  // 1) Fetch once
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const s = await fetchAnalyticsSetting();
        if (mounted) setSettings(s || {});
      } catch (e) {
        console.error("Error fetching analytics settings:", e);
      }
    })();
    return () => { mounted = false; };
  }, []);

  // 2) Inject general snippets (only once)
  useEffect(() => {
    if (!settings || generalLoadedRef.current || !isBrowser()) return;

    const { googleGlobalTagSnippet, tiktokPixelID, facebookMetaTag } = settings;

    const container =
      document.getElementById(GENERAL_CONTAINER_ID) ||
      Object.assign(document.createElement("div"), { id: GENERAL_CONTAINER_ID });

    let html = "";
    if (googleGlobalTagSnippet) html += String(googleGlobalTagSnippet);
    if (tiktokPixelID) html += String(tiktokPixelID); // assuming this is a snippet string
    if (facebookMetaTag) html += String(facebookMetaTag);

    if (html) {
      container.innerHTML = html;
      if (!container.isConnected) document.head.appendChild(container);
      generalLoadedRef.current = true;
    }
  }, [settings]);

  // 3) Inject/remove “event” snippet only on /thank-you
  useEffect(() => {
    if (!settings || !isBrowser()) return;

    const { googleEventSnippet } = settings;
    const onThankYou = location.pathname === "/thank-you";

    // Clean any prior event script
    const existing = document.getElementById(EVENT_SCRIPT_ID);
    if (existing) existing.remove();

    if (onThankYou && googleEventSnippet) {
      const s = document.createElement("script");
      s.id = EVENT_SCRIPT_ID;
      s.defer = true;
      // This assumes settings holds the snippet JS as a string
      s.innerHTML = String(googleEventSnippet);
      document.head.appendChild(s);
    }
  }, [location.pathname, settings]);

  return null;
};

export default AnalyticsSnippet;
