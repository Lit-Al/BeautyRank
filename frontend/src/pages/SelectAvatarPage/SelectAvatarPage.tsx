import { useEffect, useState } from "react";
import "../../styles/global.scss";
import styles from "./SelectAvatarPage.module.scss";
import logo from "../../images/logo.svg";
import AvatarForm from "../..//components/AvatarForm/AvatarForm";
import CheckMark from "../../components/Animations/CheckMark";
import { useNavigate } from "react-router-dom";


function SelectAvatarPage() {
  const [showCheckMark, setShowCheckMark] = useState(true);
  
  useEffect(() => {
    setTimeout(() => {
      setShowCheckMark(false);
    }, 2000);
  }, []);

  return (
    <div className={styles.AuthBack}>
      {showCheckMark && <CheckMark />}
      <div className="container">
        <img className={styles.logo} src={logo} alt="Логотип" />
        <h1 className={styles.auth_title}>Красота!</h1>
        <AvatarForm />
      </div>
    </div>
  );
}

export default SelectAvatarPage;
