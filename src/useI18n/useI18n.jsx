import { useLocalStorage } from '@uidotdev/usehooks'
import en from './en';
import es from './es';

const DEFAULT_LANG = 'en';

export default function useI18n() {
  const [lang, setLang] = useLocalStorage('lang', DEFAULT_LANG);
  const translations = { en, es };

  return {
    lang,
    LangSelector,
    setLang,
    t: function(name) {
      return (
        translations[lang][name] ||
        translations[DEFAULT_LANG][name]
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
