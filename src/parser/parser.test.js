import { renderHook, act } from "@testing-library/react";
import { beforeEach, describe, it, expect } from "vitest";
import { parse, validate } from './parser.js';

describe('uri parser',() => {
  const key0Secret = "OQYHAM3U"

  beforeEach(() => {
    window.localStorage.clear();
  });

  describe('parse', () => {
    it('parses a valid uri', () => {
      const uri = 
        { rawValue: `otpauth://totp/janwan?issuer=key0&secret=${key0Secret}`};

      const expectedSecret = {
        app: "key0",
        name: "janwan",
        code: key0Secret,
      }

      expect(parse(uri)).toEqual(expectedSecret);
    });
  });

  describe('validate', () => {
    it('returns true if the secret is valid', () => {
      const secret = {
        app: "key0",
        name: "janwan",
        code: key0Secret,
      };

      expect(validate(secret)).toEqual(true);
    });

    it('returns false if secret is missing app', () => {
      const secret = { name: "janwan", code: key0Secret };
      expect(validate(secret)).toEqual(false);
    });

    it('returns false if secret is missing name', () => {
      const secret = { app: "key0", code: key0Secret };
      expect(validate(secret)).toEqual(false);
    });

    it('returns false if secret is missing code', () => {
      const secret = { app: "key0", name: "janwan" };
      expect(validate(secret)).toEqual(false);
    });

    it('returns false if secret has only app', () => {
      const secret = { app: "key0" };
      expect(validate(secret)).toEqual(false);
    });

    it('returns false if secret has only name', () => {
      const secret = { name: "janwan" };
      expect(validate(secret)).toEqual(false);
    });

    it('returns false if secret has only code', () => {
      const secret = { code: key0Secret };
      expect(validate(secret)).toEqual(false);
    });

    it('returns false if secret is empty', () => {
      const secret = {};
      expect(validate(secret)).toEqual(false);
    });
  });
});
