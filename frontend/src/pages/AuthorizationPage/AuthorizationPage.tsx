import { useEffect } from "react";
import LoginForm from "../../components/LoginForm/LoginForm";
import '../../styles/global.scss';
import styles from './AuthorizationPage.module.scss';
import logo from '../../images/logo.svg';
import { useNavigate } from "react-router-dom";

function AuthorizationPage() {

  // Проверка, авторизован ли пользователь
  const navigate = useNavigate();
  function getUserFromLocalStorage() {
    const user = localStorage.getItem("persist:root");
    return user ? JSON.parse(user) : null;
  }
  useEffect(() => {
    // Проверяем наличие пользователя в хранилище
    const user = getUserFromLocalStorage();
    console.log(user);
    
    if (user.id !== '0') {
      // Перенаправляем пользователя на нужную страницу
      navigate("/userPage");
    }
  }, [navigate]);

  return (
    <div className={styles.AuthBack}>
        <div className="container">
            <img className={styles.logo} src={logo} alt="Логотип"/>
            <h1 className={styles.auth_title}>Добрый день!</h1>
            <LoginForm/>
        </div>  
    </div>
  );
}

export default AuthorizationPage;
