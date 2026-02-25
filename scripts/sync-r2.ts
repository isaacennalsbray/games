#!/usr/bin/env tsx
/**
 * sync-r2.ts
 *
 * Uploads everything in r2-assets/ to your Cloudflare R2 bucket.
 *
 * Usage:
 *   pnpm sync-assets
 *
 * Required env vars (add to .env.local):
 *   R2_ACCOUNT_ID     - Cloudflare account ID
 *   R2_ACCESS_KEY_ID  - R2 access key ID
 *   R2_SECRET_ACCESS_KEY - R2 secret access key
 *   R2_BUCKET_NAME    - bucket name (e.g. "games-assets")
 */

import { S3Client, PutObjectCommand, ListObjectsV2Command } from "@aws-sdk/client-s3";
import { readdir, readFile, stat } from "fs/promises";
import { join, relative } from "path";
import { lookup as mimeLookup } from "mime-types";

// Load .env.local manually (tsx doesn't load it automatically)
import { config } from "dotenv";
config({ path: ".env.local" });

const {
  R2_ACCOUNT_ID,
  R2_ACCESS_KEY_ID,
  R2_SECRET_ACCESS_KEY,
  R2_BUCKET_NAME,
} = process.env;

if (!R2_ACCOUNT_ID || !R2_ACCESS_KEY_ID || !R2_SECRET_ACCESS_KEY || !R2_BUCKET_NAME) {
  console.error("Missing R2 env vars. Check .env.local — need R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_BUCKET_NAME");
  process.exit(1);
}

const client = new S3Client({
  region: "auto",
  endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: R2_ACCESS_KEY_ID,
    secretAccessKey: R2_SECRET_ACCESS_KEY,
  },
});

const ASSETS_DIR = join(process.cwd(), "r2-assets");

async function* walkDir(dir: string): AsyncGenerator<string> {
  const entries = await readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      yield* walkDir(full);
    } else {
      yield full;
    }
  }
}

async function main() {
  // List existing objects in bucket to detect deletions
  console.log(`\nSyncing r2-assets/ → R2 bucket "${R2_BUCKET_NAME}"...\n`);

  let uploaded = 0;
  let skipped = 0;

  for await (const filePath of walkDir(ASSETS_DIR)) {
    const key = relative(ASSETS_DIR, filePath).replace(/\\/g, "/");
    const body = await readFile(filePath);
    const contentType = mimeLookup(filePath) || "application/octet-stream";

    try {
      await client.send(
        new PutObjectCommand({
          Bucket: R2_BUCKET_NAME,
          Key: key,
          Body: body,
          ContentType: contentType,
        })
      );
      console.log(`  ✓ ${key}`);
      uploaded++;
    } catch (err) {
      console.error(`  ✗ ${key}`, err);
    }
  }

  console.log(`\nDone. ${uploaded} uploaded, ${skipped} skipped.\n`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
