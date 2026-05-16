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

    it('strips duplicate issuer from name when issuer param is present', () => {
      const uri =
        { rawValue: `otpauth://totp/Example:user@example.com?issuer=Example&secret=${key0Secret}` };

      expect(parse(uri)).toEqual({
        app: "Example",
        name: "user@example.com",
        code: key0Secret,
      });
    });

    it('uses label prefix as issuer when issuer param is missing', () => {
      const uri =
        { rawValue: `otpauth://totp/Example:user@example.com?secret=${key0Secret}` };

      expect(parse(uri)).toEqual({
        app: "Example",
        name: "user@example.com",
        code: key0Secret,
      });
    });

    it('parses uri with no colon in label and no issuer param', () => {
      const uri =
        { rawValue: `otpauth://totp/user@example.com?secret=${key0Secret}` };

      expect(parse(uri)).toEqual({
        app: null,
        name: "user@example.com",
        code: key0Secret,
      });
    });

    it('decodes percent-encoded characters in the label', () => {
      const uri =
        { rawValue: `otpauth://totp/user%40example.com?issuer=key0&secret=${key0Secret}` };

      expect(parse(uri)).toEqual({
        app: "key0",
        name: "user@example.com",
        code: key0Secret,
      });
    });

    it('decodes percent-encoded colon before issuer splitting', () => {
      const uri =
        { rawValue: `otpauth://totp/Example%3Auser%40example.com?issuer=Example&secret=${key0Secret}` };

      expect(parse(uri)).toEqual({
        app: "Example",
        name: "user@example.com",
        code: key0Secret,
      });
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
