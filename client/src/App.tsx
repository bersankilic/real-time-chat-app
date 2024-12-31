import {lazy, Suspense} from "react";
import {Route, Routes} from "react-router-dom";
import {Loader, LoadingOverlay} from "@mantine/core";
import ProtectedRoute from "./components/ProtectedRoute";

import HomeNavigator from "./components/HomeNavigator";
import {isMobileDevice} from "./utils/agentUtils";
import PrimaryHeader from "./components/ui/headers/primary/PrimaryHeader";

const Login = lazy(() => import("./pages/auth/Login"));
const Register = lazy(() => import("./pages/auth/Register"));
const FirstLogin = lazy(() => import("./pages/first-login/FirstLogin"));
const Home = lazy(() => import("./pages/home/Home"));
const MobileHome = lazy(() => import("./pages/mobile/MobileHome"));
const NotFound = lazy(() => import("./pages/not-found/NotFound"));

function App() {
  const isMobile = isMobileDevice();

  return (
    <div>
      <PrimaryHeader />

      <Suspense
        fallback={
          <LoadingOverlay
            visible={true}
            loaderProps={{ children: <Loader color="blue" /> }}
          />
        }
      >
        <Routes>
          <Route
            path="/"
            element={
              <HomeNavigator>
                <Login />
              </HomeNavigator>
            }
          />
          <Route
            path="/register"
            element={
              <HomeNavigator>
                <Register />
              </HomeNavigator>
            }
          />
          <Route
            path="/first-login"
            element={
              <ProtectedRoute>
                <FirstLogin />
              </ProtectedRoute>
            }
          />

          <Route
            path="/home"
            element={
              <ProtectedRoute>
                {isMobile ? <MobileHome /> : <Home />}
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </div>
  );
}

export default App;
