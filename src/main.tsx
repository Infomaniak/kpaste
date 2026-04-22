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
import pt from 'javascript-time-ago/locale/pt';
import nl from 'javascript-time-ago/locale/nl';
import fi from 'javascript-time-ago/locale/fi';
import sv from 'javascript-time-ago/locale/sv';
import da from 'javascript-time-ago/locale/da';
import no from 'javascript-time-ago/locale/no';
import el from 'javascript-time-ago/locale/el';
import pl from 'javascript-time-ago/locale/pl';

JavascriptTimeAgo.addLocale(en);
JavascriptTimeAgo.addLocale(fr);
JavascriptTimeAgo.addLocale(de);
JavascriptTimeAgo.addLocale(it);
JavascriptTimeAgo.addLocale(es);
JavascriptTimeAgo.addLocale(pt);
JavascriptTimeAgo.addLocale(nl);
JavascriptTimeAgo.addLocale(fi);
JavascriptTimeAgo.addLocale(sv);
JavascriptTimeAgo.addLocale(da);
JavascriptTimeAgo.addLocale(no);
JavascriptTimeAgo.addLocale(el);
JavascriptTimeAgo.addLocale(pl);

const container = document.getElementById('root');
const root = createRoot(container!);
root.render(
  <React.StrictMode>
    <Router>
      <App />
    </Router>
  </React.StrictMode>
);
