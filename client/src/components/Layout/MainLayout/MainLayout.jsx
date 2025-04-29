import React, { useState } from "react";
import { persistedStore, store } from "./Redux/store"; // Adjust the import path as necessary
import { ability, AbilityContext } from "./Utils/CAN/can"; // Adjust the import path as necessary
import i18n from "./Utils/i18Config/i18"; // Adjust the import path as necessary
import { StyledEngineProvider } from "@mui/material";
import { Toaster } from "react-hot-toast";
import { I18nextProvider } from "react-i18next";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import {
  createTheme,
  ThemeProvider as ThemeProviderMui,
} from "@mui/material/styles";

const MainLayout = ({ children }) => {
  const [persistAvailable, setPersistAvailable] = useState(false);

  const handlePersistAvailable = () => {
    setPersistAvailable(true);
  };

  const theme = createTheme({
    typography: {
      fontFamily: "Montserrat, sans-serif",
    },
  });

  return (
    <ThemeProviderMui theme={theme}>
      <StyledEngineProvider injectFirst>
        <Provider store={store}>
          <I18nextProvider i18n={i18n}>
            <Toaster
              toastOptions={{
                className: "hot-toast",
                duration: 5000,
                success: {
                  duration: 4000,
                  style: {
                    background: "green",
                    color: "white",
                  },
                },
                error: {
                  duration: 6000,
                  style: {
                    background: "red",
                    color: "white",
                  },
                },
              }}
            />
            <AbilityContext.Provider value={ability}>
              <PersistGate
                onBeforeLift={handlePersistAvailable}
                persistor={persistedStore}
              >
                {persistAvailable && children}
              </PersistGate>
            </AbilityContext.Provider>
          </I18nextProvider>
        </Provider>
      </StyledEngineProvider>
    </ThemeProviderMui>
  );
};

export default MainLayout;
