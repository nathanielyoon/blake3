# blake3

Hash with [Blake3](https://github.com/BLAKE3-team/BLAKE3).

```ts
import { blake3_derive, blake3_hash, blake3_keyed } from "@nyoon/blake3";

const data = crypto.getRandomValues(new Uint8Array(32));
const digest = blake3_hash(data);
const keyed = blake3_keyed(crypto.getRandomValues(new Uint8Array(32)), data);
const deriver = blake3_derive(new TextEncoder().encode("context string"));
const key_1 = deriver(crypto.getRandomValues(new Uint8Array(32)));
const key_2 = deriver(crypto.getRandomValues(new Uint8Array(32)));
```
