import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { persistor, store } from './redux/store.js';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { I18nextProvider } from 'react-i18next';
import i18n from './i18n.js';
import './main.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { ApiProvider } from './ApiContext.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <ApiProvider>
    <I18nextProvider i18n={i18n}>
      <Provider store={store}>
        <PersistGate persistor={persistor} loading={null}>
          <App />
        </PersistGate>
      </Provider>
    </I18nextProvider>
  </ApiProvider>
);
