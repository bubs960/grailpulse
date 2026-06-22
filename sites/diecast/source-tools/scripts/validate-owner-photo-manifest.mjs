import { existsSync, readFileSync } from "node:fs";
import { dirname, extname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const manifestPath = resolve(root, "kb/owner-photo-manifest.json");
const generatedPath = resolve(root, "kb/generated/kb-diecast.json");
const allowedRights = new Set(["owner_created", "owner_permission", "fair_use_editorial"]);
const allowedExtensions = new Set([".jpg", ".jpeg", ".png", ".webp"]);

export function validateOwnerPhotoManifest({ requireFiles = false } = {}) {
  const manifest = JSON.parse(readFileSync(manifestPath, "utf8"));
  const entries = Array.isArray(manifest.entries) ? manifest.entries : [];
  const knownIds = existsSync(generatedPath)
    ? new Set(JSON.parse(readFileSync(generatedPath, "utf8")).records.map((record) => record.diecast_id))
    : null;
  const errors = [];
  const seenIds = new Set();

  for (const [index, entry] of entries.entries()) {
    const label = `entries[${index}]`;
    if (!entry.diecast_id) errors.push(`${label}: diecast_id is required`);
    if (entry.diecast_id && seenIds.has(entry.diecast_id)) errors.push(`${label}: duplicate diecast_id ${entry.diecast_id}`);
    seenIds.add(entry.diecast_id);
    if (knownIds && entry.diecast_id && !knownIds.has(entry.diecast_id)) errors.push(`${label}: unknown diecast_id ${entry.diecast_id}`);
    if (!entry.source_file) errors.push(`${label}: source_file is required`);
    if (entry.source_file && !allowedExtensions.has(extname(entry.source_file).toLowerCase())) errors.push(`${label}: unsupported image extension`);
    if (!entry.credit) errors.push(`${label}: credit is required`);
    if (!allowedRights.has(entry.rights_basis)) errors.push(`${label}: rights_basis must be owner_created, owner_permission, or fair_use_editorial`);
    if (entry.rights_basis === "owner_permission" && !entry.permission_reference) errors.push(`${label}: permission_reference is required`);
    if (entry.rights_basis === "fair_use_editorial" && (!entry.source_url || !entry.editorial_rationale)) {
      errors.push(`${label}: fair-use entries require source_url and editorial_rationale`);
    }
    if (requireFiles && entry.source_file && !existsSync(resolve(root, entry.source_file))) errors.push(`${label}: source file not found`);
  }

  if (errors.length) throw new Error(`Owner photo manifest failed:\n- ${errors.join("\n- ")}`);
  return { manifest, entries };
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const { entries } = validateOwnerPhotoManifest({ requireFiles: process.argv.includes("--require-files") });
  console.log(`Owner photo manifest passed: ${entries.length} approved entr${entries.length === 1 ? "y" : "ies"}.`);
}
