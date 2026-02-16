import { renderHook, act } from "@testing-library/react";
import { beforeEach, describe, it, expect } from "vitest";
import { parseUri, parseUris } from './parser.js';

describe('uri parser',() => {
  const key0Secret = "OQYHAM3U"
  const topeteSecret = "ORSXG5A="

  beforeEach(() => {
    window.localStorage.clear();
  });

  it('parses a valid uri', () => {
    const uri = 
      { rawValue: `otpauth://totp/janwan?issuer=key0&secret=${key0Secret}`};

    const expectedSecret = {
      app: "key0",
      name: "janwan",
      code: key0Secret,
    }

    expect(parseUri(uri)).toEqual(expectedSecret);
  });

  it('parses a list of valid uris', () => {
    const uris = [
      { rawValue: `otpauth://totp/janwan?issuer=key0&secret=${key0Secret}` },
      { rawValue: `otpauth://totp/jantu?issuer=topete&secret=${topeteSecret}`},
    ];

    const expectedSecrets = [{
      app: "key0",
      name: "janwan",
      code: key0Secret,
    },
    {
      app: "topete",
      name: "jantu",
      code: topeteSecret,
    }];

    expect(parseUris(uris)).toEqual(expectedSecrets);
  });
});
