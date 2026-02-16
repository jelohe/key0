import { renderHook, act } from "@testing-library/react";
import { beforeEach, describe, it, expect } from "vitest";
import useVault from './useVault.js';

const key0Secret = "OQYHAM3U"

function createSecret() {
  const secret = {
    app: 'key0',
    name: 'janwan',
    code: key0Secret,
  };
  const vault = JSON.stringify([secret]);
  window.localStorage.setItem('secrets', vault);

  return secret;
}

describe('vault storage',() => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  describe('store', () => {
    it('stores a new secret in an empty vault', () => {
      const { result } = renderHook(useVault);
      const secret = {
        app: 'key0',
        name: 'janwan',
        code: key0Secret,
      };

      act(() => {
        result.current.store(secret);
      });

      expect(result.current.vault).toEqual([secret]);
    });

    it('does not store a duplicate secret', () => {
      const secret = createSecret();
      const { result } = renderHook(useVault);

      act(() => {
        result.current.store(secret);
      });

      expect(result.current.vault).toEqual([secret]);
    });

    it('does nothing if the secret is invalid', () => {
      const secret = {
        prop: 'wront',
      };
      const { result } = renderHook(useVault);

      act(() => {
        result.current.store(secret);
      });

      expect(result.current.vault).toEqual([]);
    });
  });

  describe('remove', () => {
    it('removes a secret by app and name', () => {
      createSecret();
      const toRemove = {
        app: 'key0',
        name: 'janwan',
      }
      const { result } = renderHook(useVault);

      act(() => {
        result.current.remove(toRemove);
      });

      expect(result.current.vault).toEqual([]);
    });

    it('does nothing if app & name arent provided', () => {
      const secret = createSecret();
      const toRemoveOne = {
        name: 'janwan',
      }
      const toRemoveTwo = {
        app: 'key0',
      }
      const { result } = renderHook(useVault);

      act(() => {
        result.current.remove(toRemoveOne);
        result.current.remove(toRemoveTwo);
      });

      expect(result.current.vault).toEqual([secret]);
    });

    it('does nothing if the secret does not exist', () => {
      const secret = createSecret();
      const toRemove = {
        app: 'wadus',
        name: 'wat',
      }
      const { result } = renderHook(useVault);

      act(() => {
        result.current.remove(toRemove);
      });

      expect(result.current.vault).toEqual([secret]);
    });
  });
});
