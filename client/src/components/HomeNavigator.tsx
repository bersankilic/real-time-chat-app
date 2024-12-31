import React, {ReactNode} from "react";
import {Navigate} from "react-router-dom";
import Cookies from "js-cookie";

interface HomeNavigatorProps {
  children: ReactNode;
}

const HomeNavigator: React.FC<HomeNavigatorProps> = ({ children }) => {
  const token = Cookies.get("jwt_token");

  if (token) {
    return <Navigate to="/home" />;
  } else {
    return <>{children}</>;
  }
};

export default HomeNavigator;
