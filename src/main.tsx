import React from 'react';
import App from './App';
import { createRoot } from 'react-dom/client';

import { BrowserRouter as Router } from 'react-router-dom';

import JavascriptTimeAgo from 'javascript-time-ago';
import en from 'javascript-time-ago/locale/en';
import fr from 'javascript-time-ago/locale/fr';
import de from 'javascript-time-ago/locale/de';
import it from 'javascript-time-ago/locale/it';
import es from 'javascript-time-ago/locale/es';

JavascriptTimeAgo.addLocale(en);
JavascriptTimeAgo.addLocale(fr);
JavascriptTimeAgo.addLocale(de);
JavascriptTimeAgo.addLocale(it);
JavascriptTimeAgo.addLocale(es);

const container = document.getElementById('root');
const root = createRoot(container!);
root.render(
  <React.StrictMode>
    <Router>
      <App />
    </Router>
  </React.StrictMode>
);
