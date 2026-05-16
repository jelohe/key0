import { useLocalStorage } from '@uidotdev/usehooks'
import { validate } from '@/parser';

function secretExists(secret, vault = []) {
  const exists = vault.find(({ app, name }) =>
    app === secret.app && name === secret.name
  );

  return exists || false;
}

export default function useVault() {
  const [vault, setVault] = useLocalStorage('secrets', []);

  return {
    vault,

    store: function(secret) {
      if (!validate(secret)) return;
      setVault(current => {
        if (secretExists(secret, current)) return current;
        return [...current, secret];
      });
    },

    remove: function({ name, app }) {
      if (!name || !app) return;
      setVault(current => {
        if (!secretExists({ name, app }, current)) return current;
        return current.filter(s => s.name !== name || s.app !== app);
      });
    },
  };
}
