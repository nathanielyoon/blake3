import { assertEquals } from "@std/assert";
import fc from "fast-check";
import { blake3_derive, blake3_hash, blake3_keyed } from "../main.ts";
import vectors from "./vectors.json" with { type: "json" };

const hex = (string: string) =>
  Uint8Array.from(string.match(/../g) ?? [], (Z) => parseInt(Z, 16));
Deno.test(function blake3_reference() {
  const key = new TextEncoder().encode(vectors.key);
  const context = vectors.context_string;
  const fill = (length: number) =>
    Uint8Array.from({ length }, (_, index) => index % 251);
  for (let z = 0; z < vectors.cases.length; ++z) {
    const reference_case = vectors.cases[z];
    const input = fill(reference_case.input_len);
    const hash = hex(reference_case.hash);
    assertEquals(blake3_hash(input), hash.subarray(0, 32));
    assertEquals(blake3_hash(input, hash.length), hash);
    const keyed_hash = hex(reference_case.keyed_hash);
    assertEquals(blake3_keyed(key, input), keyed_hash.subarray(0, 32));
    assertEquals(blake3_keyed(key, input, keyed_hash.length), keyed_hash);
    const derive = hex(reference_case.derive_key);
    assertEquals(blake3_derive(context, input), derive.subarray(0, 32));
    assertEquals(blake3_derive(context, input, derive.length), derive);
  }
});
Deno.test(function seek_kdf() {
  fc.assert(fc.property(
    fc.string(),
    fc.uint8Array(),
    (context, key) => {
      // This holds all the 64-byte keys, concatenated. Seeking key-by-key
      // should get the same overall buffer.
      const keys = blake3_derive(context, key, 1024);
      const to = new Uint8Array(1024);
      for (let z = 0; z < 16; ++z) {
        to.set(blake3_derive(context, key, 64, z), z << 6);
      }
      assertEquals(keys, to);
    },
  ));
});
