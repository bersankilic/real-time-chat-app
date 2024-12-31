import classes from "./FirstLogin.module.css";
import {Paper, Text} from "@mantine/core";
import SetProfilePic from "../../components/ui/user_settings/SetProfilePic";
import {useAuthContext} from "../../context/AuthContext";
import {Navigate} from "react-router-dom";

const FirstLogin = () => {
  const { state } = useAuthContext();
  const { isFirstLogin } = state;

  return (
    <div className={classes.firstContainer}>
      {isFirstLogin ? (
        <Paper>
          <Text ta="center" size="xl" fw={500} mt="md" className={classes.text}>
            Henüz profil resmi seçmediniz. Şimdi seçmek ister misiniz ?
          </Text>
          <SetProfilePic />
        </Paper>
      ) : (
        <Navigate to="/home" />
      )}
    </div>
  );
};

export default FirstLogin;
