/* global WEB_COMPONENT_API_ENDPOINT */

import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import JavascriptTimeAgo from 'javascript-time-ago';
import en from 'javascript-time-ago/locale/en';
import fr from 'javascript-time-ago/locale/fr';
import de from 'javascript-time-ago/locale/de';
import it from 'javascript-time-ago/locale/it';
import es from 'javascript-time-ago/locale/es';
import App from './components/App';
import ScrollToTop from './lib/ScrollToTop';

window.HIDE_MODULE_SUPPORT = true;
window.WEB_COMPONENT_API_ENDPOINT = WEB_COMPONENT_API_ENDPOINT;

JavascriptTimeAgo.addLocale(en);
JavascriptTimeAgo.addLocale(fr);
JavascriptTimeAgo.addLocale(de);
JavascriptTimeAgo.addLocale(it);
JavascriptTimeAgo.addLocale(es);

ReactDOM.render(
  <React.StrictMode>
    <Router>
      <ScrollToTop />
      <App />
    </Router>
  </React.StrictMode>,
  document.getElementById('root'),
);
