import classes from "./Profile.module.scss";
import { useTranslation } from "react-i18next";

// Define the types for props
interface ProfileProps {
  userName: string; 
  avatar: string;  
}

function Profile({ userName, avatar }: ProfileProps) {
  const { t } = useTranslation();

  return (
    <div className={classes.profile}>
      <div className={classes.profile__avatar}>
        <img src={avatar} alt="avatar" />
      </div>
      <div className={classes.profile__info}>
        <p className={classes.profile__userName}>{t(userName)}</p>
        {/* <span className={classes.profile__role}>{t("admin")}</span> */}
      </div>
    </div>
  );
}

export default Profile;
