import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {  Providercss } from "./components/ui/provider.jsx"
import { Provider } from 'react-redux'
import App from './App.jsx'
import store from './services/store.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <Providercss>
        <App />
      </Providercss>
    </Provider>
  </StrictMode>,
)
