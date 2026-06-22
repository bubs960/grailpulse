import { createHash } from "node:crypto";
import { copyFileSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, extname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { validateOwnerPhotoManifest } from "./validate-owner-photo-manifest.mjs";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const apply = process.argv.includes("--apply");
const siteRootIndex = process.argv.indexOf("--site-root");
const siteRoot = siteRootIndex >= 0 ? resolve(process.argv[siteRootIndex + 1]) : null;
const ownerMapPath = resolve(root, "kb/owner-photo-map.json");
const approvedDir = resolve(root, "owner-photos/approved");
const sitePhotoDir = siteRoot ? resolve(siteRoot, "public/owner-photos") : null;
const existing = JSON.parse(readFileSync(ownerMapPath, "utf8"));
const { entries } = validateOwnerPhotoManifest({ requireFiles: apply });
const output = { ...existing };

if (apply && !siteRoot) throw new Error("--site-root is required with --apply");
mkdirSync(approvedDir, { recursive: true });
if (sitePhotoDir) mkdirSync(sitePhotoDir, { recursive: true });

for (const entry of entries) {
  const sourcePath = resolve(root, entry.source_file);
  const bytes = readFileSync(sourcePath);
  const checksum = createHash("sha256").update(bytes).digest("hex");
  const extension = extname(entry.source_file).toLowerCase().replace(".jpeg", ".jpg");
  const fileName = `${createHash("sha256").update(entry.diecast_id).digest("hex").slice(0, 24)}${extension}`;

  if (apply) {
    copyFileSync(sourcePath, resolve(approvedDir, fileName));
    copyFileSync(sourcePath, resolve(sitePhotoDir, fileName));
  }

  output[entry.diecast_id] = {
    photo_url: `/owner-photos/${fileName}`,
    photo_source: entry.rights_basis === "fair_use_editorial" ? "fair-use-editorial" : "owner-submitted",
    photo_match_level: entry.photo_match_level || "variant_exact",
    photo_credit: entry.credit,
    photo_rights_basis: entry.rights_basis,
    photo_source_url: entry.source_url || null,
    photo_permission_reference: entry.permission_reference || null,
    photo_editorial_rationale: entry.editorial_rationale || null,
    photo_checksum_sha256: checksum,
    photo_approved_at: entry.approved_at || new Date().toISOString()
  };
}

if (apply) writeFileSync(ownerMapPath, `${JSON.stringify(output, null, 2)}\n`);
console.log(`${apply ? "Applied" : "Validated"} ${entries.length} owner photo entr${entries.length === 1 ? "y" : "ies"}.`);
