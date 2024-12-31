import {Flex, Text} from "@mantine/core";
import MobileDropMenu from "../../../mobile/dropmenu/MobileDropMenu";
import classes from "./PrimaryHeader.module.css";
import {useAuthContext} from "../../../../context/AuthContext";

const PrimaryHeader = () => {
  const { state } = useAuthContext();

  return (
    <nav className={classes.primaryHeader}>
      <Flex className={classes.textFlex}>
        <Text className={classes.textOne}>Gerçek-Zamanlı</Text>
        <Text className={classes.textTwo}>Mesajlaşma</Text>
      </Flex>
      {state.nickname && <MobileDropMenu />}
    </nav>
  );
};

export default PrimaryHeader;
