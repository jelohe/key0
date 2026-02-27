import { useLocalStorage } from '@uidotdev/usehooks'
import { validate } from '@/parser';

function secretExists(secret, vault = []) {
  const exists = vault.find(({ app, name }) =>
    app == secret.app && name === secret.name
  );

  return exists || false;
}

export default function useVault() {
  const [vault, setVault] = useLocalStorage('secrets', []);

  return {
    vault,

    store: function(secret) {
      const isValid = validate(secret);
      const exists = secretExists(secret, vault);

      if (isValid && !exists)
        setVault([ ...vault, secret ]);
    },

    remove: function({ name, app }) {
      const isValid = name && app;
      const exists = secretExists({ name, app }, vault);
      const newVault = vault.filter(s => (s.name !== name || s.app !== app));

      if (isValid && exists) setVault(newVault);
    },
  };
}
