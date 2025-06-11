import { s16_b } from "jsr:@nyoon/base@^1.0.5/16";
import { assertEquals } from "jsr:@std/assert@^1.0.13";
import { blake3_derive, blake3_hash, blake3_keyed } from "./mod.ts";

Deno.test("reference vectors", () =>
  fetch(
    "https://raw.githubusercontent.com/BLAKE3-team/BLAKE3/ae3e8e6b3a5ae3190ca5d62820789b17886a0038/test_vectors/test_vectors.json",
  ).then(($) => $.text()).then(($) => {
    const { key, context_string, cases } = JSON.parse($);
    const a = new TextEncoder().encode(key);
    const b = new TextEncoder().encode(context_string);
    cases.forEach(($: Record<string, string>) => {
      const c = Uint8Array.from({ length: +$.input_len }, (_, z) => z % 251);
      assertEquals(blake3_hash(c, $.hash.length >> 1), s16_b($.hash));
      assertEquals(
        blake3_keyed(a, c, $.keyed_hash.length >> 1),
        s16_b($.keyed_hash),
      );
      assertEquals(
        blake3_derive(b)(c, $.derive_key.length >> 1),
        s16_b($.derive_key),
      );
    });
  }));
