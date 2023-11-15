import "../../styles/global.scss";
import styles from "./UserPage.module.scss";
import ModelList from "../../components/ModelList/ModelList";
import { RootState } from "@/redux/store";
import { useSelector } from "react-redux";  

function UserPage() {
  const user = useSelector((state: RootState) => state.user);

  return (
    <div className={styles.UserBack}>
      <div className="container">
        {typeof user.image === 'string' && <img src={`http://192.168.24.52:8000/${user.image}`} className={styles.user_avatar} alt={`${user.first_name} ${user.last_name}`} />}
        <p className={styles.user_name}>
          {user.first_name} {user.last_name}
        </p>
        {user.is_staff ? (
        <>
            <h1 className={styles.user_role}>Судья</h1>
            <p className={styles.user_action}>Выберите модель для оценки работы</p>
        </>
        ) : (
            <>
            <h1 className={styles.user_role}>Мастер</h1>
            <p className={styles.user_action}>Выберите модель с которой работаете</p>
            <ModelList>
            </ModelList>
        </>
        )}
      </div>
    </div>
  );
}

export default UserPage;
