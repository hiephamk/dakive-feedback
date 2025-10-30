import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {  Providercss } from "./components/ui/provider.jsx"
import { Provider } from 'react-redux'
import store from './services/store.jsx'
import { I18nextProvider } from "react-i18next";
import i18n from "./i18n";
import App from "./App";

const container = document.getElementById("root");
const root = createRoot(container);

root.render(
  <I18nextProvider i18n={i18n}>
    <StrictMode>
      <Provider store={store}>
        <Providercss>
            <App />
        </Providercss>
      </Provider>
    </StrictMode>
  </I18nextProvider>
);