import {IconLogout} from "@tabler/icons-react";

import classes from "../SideBar.module.css";

interface ILogoutLabelProps {
  onLogout: () => void;
}
const LogoutLabel = (props: ILogoutLabelProps) => {
  return (
    <div
      className={classes.link}
      onClick={props.onLogout}
      onMouseEnter={(event) => {
        event.currentTarget.style.cursor = "pointer";
      }}
      onMouseLeave={(event) => {
        event.currentTarget.style.cursor = "auto";
      }}
    >
      <IconLogout color="red" className={classes.linkIcon} stroke={1.5} />
      <span>Çıkış</span>
    </div>
  );
};

export default LogoutLabel;
