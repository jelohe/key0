import { useLocalStorage } from '@uidotdev/usehooks'
import en from './en';
import es from './es';

const translations = { en, es };
const SUPPORTED_LANGS = Object.keys(translations);

function browserLang() {
  const lang = navigator.language?.slice(0, 2);
  return SUPPORTED_LANGS.includes(lang) ? lang : 'en';
}

export default function useI18n() {
  const [lang, setLang] = useLocalStorage('lang', browserLang());

  return {
    lang,
    LangSelector,
    setLang,
    t: function(name) {
      return (
        translations[lang][name] ||
        translations['en'][name]
      );
    },
  }
}

const LangSelector = function({ lang, setLang }) {
  return (
    <select
      value={lang}
      onChange={e => setLang(e.target.value)}
    >
      <option value="en">en</option>
      <option value="es">es</option>
    </select>
  );
}
