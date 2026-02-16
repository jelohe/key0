import { useLocalStorage } from '@uidotdev/usehooks'

function secretExists(secret, vault = []) {
  const exists = vault.find(({ app, name }) =>
    app == secret.app && name === secret.name
  );

  return exists;
}

export default function useVault() {
  const [vault, setVault] = useLocalStorage('secrets', []);

  return {
    vault,

    store: function(secret) {
      const isValid =
        (secret.name && secret.app && secret.code)
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
