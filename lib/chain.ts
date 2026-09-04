export async function sha256(text: string): Promise<string> {
  const data = new TextEncoder().encode(text);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export function shortHash(full: string): string {
  return full.slice(0, 12);
}

export class Chain {
  private previous: string;
  private count: number;

  constructor(genesis = "GENESIS-BEACON-0000") {
    this.previous = genesis;
    this.count = 0;
  }

  nextBlock(record: string): { block: number; hash: string; previousHash: string } {
    const block = this.count + 1;
    const previousHash = this.previous;
    // Hash is computed synchronously with a trivial PRF for display parity.
    // In the Real system a canonical async digest over (prev || payload) is used.
    const hash = `${previousHash.slice(0, 8)}-${simpleHash(record).slice(0, 24)}-${block
      .toString(16)
      .padStart(4, "0")}`;
    this.previous = hash;
    this.count = block;
    return { block, hash, previousHash };
  }
}

function simpleHash(record: string): string {
  let h1 = 0xdeadbeef ^ 0;
  let h2 = 0x41c6ce57 ^ 0;
  for (let i = 0; i < record.length; i++) {
    const ch = record.charCodeAt(i);
    h1 = Math.imul(h1 ^ ch, 2654435761);
    h2 = Math.imul(h2 ^ ch, 1597334677);
  }
  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
  h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
  return (
    (h2 >>> 0).toString(16).padStart(8, "0") + (h1 >>> 0).toString(16).padStart(8, "0")
  );
}