import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';

import translationDE from '../../../locales/de/translation.json';
import translationEN from '../../../locales/en/translation.json';
import translationES from '../../../locales/es/translation.json';
import translationFR from '../../../locales/fr/translation.json';
import translationIT from '../../../locales/it/translation.json';
import translationPT from '../../../locales/pt/translation.json';
import translationNL from '../../../locales/nl/translation.json';
import translationFI from '../../../locales/fi/translation.json';
import translationSV from '../../../locales/sv/translation.json';
import translationDA from '../../../locales/da/translation.json';
import translationNO from '../../../locales/no/translation.json';
import translationEL from '../../../locales/el/translation.json';
import translationPL from '../../../locales/pl/translation.json';

const resources = {
  de: {
    translation: translationDE,
  },
  en: {
    translation: translationEN,
  },
  es: {
    translation: translationES,
  },
  fr: {
    translation: translationFR,
  },
  it: {
    translation: translationIT,
  },
  pt: {
    translation: translationPT,
  },
  nl: {
    translation: translationNL,
  },
  fi: {
    translation: translationFI,
  },
  sv: {
    translation: translationSV,
  },
  da: {
    translation: translationDA,
  },
  no: {
    translation: translationNO,
  },
  el: {
    translation: translationEL,
  },
  pl: {
    translation: translationPL,
  },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'fr',
    debug: false,
    interpolation: {
      escapeValue: false,
    },
  }, () => {
    window.CONST_LANG = i18n.language.substring(0, 2);
  });

export default i18n;
