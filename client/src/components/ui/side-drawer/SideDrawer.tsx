import {Drawer} from "@mantine/core";
import React from "react";
import MobileUsersList from "../../mobile/users/MobileUsersList";

interface ISideDrawerProps {
  drawerOpened: boolean;
  closeDrawer: () => void;
}

const SideDrawer: React.FC<ISideDrawerProps> = ({
  drawerOpened,
  closeDrawer,
}) => {
  const onCloseDrawer = () => {
    closeDrawer();
  };
  return (
    <Drawer
      opened={drawerOpened}
      onClose={onCloseDrawer}
      size="100%"
      padding="sm"
      title="Side Bar"
      zIndex={1000000}
    >
      <div onClick={closeDrawer}>
        <MobileUsersList />
      </div>
    </Drawer>
  );
};

export default SideDrawer;
