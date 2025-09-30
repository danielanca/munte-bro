import { useNavigation } from "react-router-dom";
import styles from "./RouteSpinner.module.css";

export default function RouteSpinner() {
  const nav = useNavigation();
  const active = nav.state === "loading" || nav.state === "submitting";
  return <div className={`${styles.bar} ${active ? styles.active : ""}`} />;
}
