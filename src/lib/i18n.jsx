import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';

import translationDE from '../../locales/de/translation.json';
import translationEN from '../../locales/en/translation.json';
import translationES from '../../locales/es/translation.json';
import translationFR from '../../locales/fr/translation.json';
import translationIT from '../../locales/it/translation.json';

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
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    lng: 'fr',
    fallbackLng: 'fr',
    debug: false,
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
