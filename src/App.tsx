
import './scss/App.scss';
import { Suspense, useState, useEffect, FC } from 'react';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import {
  Routes,
  useLocation,
  Route,
} from "react-router-dom";
import { AppReadyMessageKey, BridgeConnected, KSuiteBridge, NavigateMessageKey } from '@infomaniak/ksuite-bridge';
import IkHeader from './components/Header/Header';
import Home from './components/Home/Home';
import Loader from './components/Loader/Loader';
import NewPaste from './pages/NewPaste/NewPaste';
import ShowPaste from './pages/ShowPaste/ShowPaste';
import { Background } from './types/background';


const App: FC = () => {
  const [background, setBackground] = useState<Background>({ image: '', link: '', author: '' });
  const [bridge, setBridge] = useState<KSuiteBridge | null>(null);
  const location = useLocation();
  const { t } = useTranslation();

  async function getBackground() {
    return fetch(`${import.meta.env.VITE_WEB_COMPONENT_API_ENDPOINT}/api/components/paste/promotion`, {
      method: 'GET',
      credentials: 'include',
    }).then((response) => (response.ok
      ? response.json()
      : Promise.reject(new Error(response.statusText))))
      .then((data) => {
        return data.data;
      });
  }

  useEffect(() => {
    getBackground().then(setBackground);
    if (!bridge) {
      const kSuiteBridge = new KSuiteBridge({ debugPrefix: 'kpaste' });
      kSuiteBridge.on(BridgeConnected, () => {
        void kSuiteBridge.sendMessage({ type: AppReadyMessageKey });
        setBridge(kSuiteBridge);
      })
    }
  }, []);

  useEffect(() => {
    if (bridge) {
      bridge.sendMessage({ type: NavigateMessageKey, path: location.pathname });
    }
  }, [bridge, location]);

  return (
    <HelmetProvider>
      <Suspense fallback={<Loader />}>
        <Helmet>
          <title>{t('meta.title')}</title>
          <meta property="og:title" content={t('meta.title') as string} />
          <meta property="og:image:alt" content={t('meta.title') as string} />
          <meta property="og:description" content={t('meta.description') as string} />
          <meta name="description" content={t('meta.description') as string} />
        </Helmet>
        <IkHeader bridge={bridge} />
        <Routes>
          <Route path="/new" element={
            <NewPaste
              background={background}
            />
          } />
          <Route path="/:id" element={
            <ShowPaste
              background={background}
            />
          } />
          <Route path="/" element={<Home background={background} />} />
        </Routes>
      </Suspense>
    </HelmetProvider>
  );
};

export default App;
