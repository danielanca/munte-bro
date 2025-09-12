import React, { useState, useEffect } from "react";
import { addAnalyticsSetting, fetchAnalyticsSetting } from "../../data/AnalyticsData";
import { useNavigate } from "react-router-dom";
import "./AddProduct.css";

interface AnalyticsSettingType {
    googleGlobalTagSnippet: string;
    googleEventSnippet: string;
    tiktokPixelID: string;
    facebookMetaTag: string;
}

const Analytics: React.FC = () => {
    const [analyticsSetting, setAnalyticsSetting] = useState<AnalyticsSettingType>({
        googleGlobalTagSnippet: "",
        googleEventSnippet: "",
        tiktokPixelID: "",
        facebookMetaTag: "",
    });

    const navigate = useNavigate();

    useEffect(() => {
        const loadAnalyticsSettings = async () => {
            const fetchedSettings = await fetchAnalyticsSetting();
            if (fetchedSettings) {
                setAnalyticsSetting(fetchedSettings);
            }
        };

        loadAnalyticsSettings();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setAnalyticsSetting((prevSetting) => ({
            ...prevSetting,
            [name]: value,
        }));
    };


    const handleAddSetting = async () => {
        try {
            await addAnalyticsSetting(analyticsSetting);
            //console.log("Analytics settings saved successfully");
            alert('Saved Successfully');
            navigate("/admin/analytics");
        } catch (error) {
            console.error("Failed to save analytics settings:", error);
        }
    };

    return (
        <section className="addProductSection">
            <h2>Analytics Snippet</h2>
            <form>
                <div>
                    <label>Google Global Tag Snippet:</label>
                    <textarea
                        name="googleGlobalTagSnippet"
                        value={analyticsSetting.googleGlobalTagSnippet}
                        onChange={handleChange} />
                </div>
                <div>
                    <label>Google Event Snippet (Without script Tag):</label>
                    <textarea
                        name="googleEventSnippet"
                        value={analyticsSetting.googleEventSnippet}
                        onChange={handleChange}
                        placeholder="gtag('event','conversion',{'send_to':'AW-45345353/M0n-CPdgfdBEGdfgOAC'});"
                    />
                </div>
                <div>
                    <label>Tiktok Pixel Code:</label>
                    <textarea name="tiktokPixelID"
                        value={analyticsSetting.tiktokPixelID}
                        onChange={handleChange} />
                </div>
                <div>
                    <label>Facebook Meta Tag:</label>
                    <textarea name="facebookMetaTag"
                        value={analyticsSetting.facebookMetaTag}
                        onChange={handleChange} />
                </div>
                <button type="button" className="blueBtn" onClick={handleAddSetting}>
                    Save
                </button>
            </form>

        </section>
    );
};

export default Analytics;
