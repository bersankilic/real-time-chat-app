import {Menu, rem} from "@mantine/core";
import {IconDotsVertical, IconLogout, IconSettings,} from "@tabler/icons-react";
import {useAuth} from "../../../hooks/useAuth";
import {useSocket} from "../../../hooks/useSocket";
import classes from "./MobileDropMenu.module.css";
import {useNavigate} from "react-router-dom";
import {useDisplay} from "../../../hooks/useDisplay";
import {DisplayType} from "../../../models/DisplayType";

const MobileDropMenu = () => {
  const { logout } = useAuth();
  const { disconnectingSocket } = useSocket();
  const navigate = useNavigate();
  const { displayManager } = useDisplay();

  const onLogout = () => {
    logout();
    disconnectingSocket();
    navigate("/");
  };

  return (
    <div className={classes.mobileMenu}>
      <Menu width={200} trigger="click">
        <Menu.Target>
          <IconDotsVertical />
        </Menu.Target>
        <Menu.Dropdown className={classes.mobileDropDown}>
          <Menu.Label>Ayarlar</Menu.Label>
          <Menu.Item
            onClick={() => displayManager(DisplayType.SHOW_SETTINGS)}
            leftSection={
              <IconSettings
                style={{ width: rem(16), height: rem(16) }}
                stroke={1.5}
              />
            }
          >
            Hesap ayarları
          </Menu.Item>
          <Menu.Item
            onClick={onLogout}
            leftSection={
              <IconLogout
                color="red"
                style={{ width: rem(16), height: rem(16) }}
              />
            }
          >
            Çıkış
          </Menu.Item>

          <Menu.Divider />
        </Menu.Dropdown>
      </Menu>
    </div>
  );
};

export default MobileDropMenu;
