import {createTheme, MantineProvider} from "@mantine/core";
import {Notifications} from "@mantine/notifications";
import {AuthProvider} from "../context/AuthContext";
import {ModalsProvider} from "@mantine/modals";
import {SocketProvider} from "../context/SocketContext";
import {DisplayProvider} from "../context/DisplayContext";
import {FriendsProvider} from "../context/FriendsContext";
import {HashRouter} from "react-router-dom";

interface IProps {
  children: JSX.Element;
}

const theme = createTheme({
  fontFamily: "Open Sans, sans-serif",
  primaryColor: "cyan",
});

export const AppProviders = ({ children }: IProps) => {
  return (
    <MantineProvider theme={theme}>
      <HashRouter>
        <ModalsProvider>
          <AuthProvider>
            <DisplayProvider>
              <FriendsProvider>
                <SocketProvider>
                  <Notifications position="top-right" />
                  {children}
                </SocketProvider>
              </FriendsProvider>
            </DisplayProvider>
          </AuthProvider>
        </ModalsProvider>
      </HashRouter>
    </MantineProvider>
  );
};
