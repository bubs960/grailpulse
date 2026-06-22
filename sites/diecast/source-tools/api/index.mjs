import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const dataPath = resolve(__dirname, "../export/grailpulse-diecast.json");

let cached;

const CONDITION_ALIASES = [
  { condition: "momc", patterns: ["momc", "mint on mint card", "mint card"] },
  { condition: "carded", patterns: ["carded", "new on card", "on card", "sealed"] },
  { condition: "damaged_card", patterns: ["damaged card", "soft corners", "creased card", "card damage"] },
  { condition: "mint_loose", patterns: ["mint loose", "near mint loose", "loose mint"] },
  { condition: "loose", patterns: ["loose", "opened"] }
];

const IMPORTANT_FIELDS = ["brand", "line", "segment", "casting", "color", "deco", "wheel_type", "chase_type", "series_number"];
const REGION_CODES = new Set(["us", "uk"]);

function loadData() {
  if (!cached) {
    cached = JSON.parse(readFileSync(dataPath, "utf8"));
    cached.byId = new Map(cached.records.map((record) => [record.diecast_id, record]));
  }
  return cached;
}

function norm(input) {
  return String(input ?? "")
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function tokens(input) {
  return new Set(norm(input).split(" ").filter(Boolean));
}

function unique(values) {
  return [...new Set(values.filter(Boolean))];
}

function includesPhrase(titleNorm, phrase) {
  const p = norm(phrase);
  return p.length > 1 && titleNorm.includes(p);
}

function describeFlags(flags) {
  const map = {
    seed_price: "seed price only",
    needs_adversarial_verify: "needs adversarial verify",
    image_or_color_required: "photo or color signal needed",
    chase_variant_not_confirmed: "chase status not confirmed",
    wheel_variant_unconfirmed: "wheel type not confirmed",
    card_region_unconfirmed: "card region not confirmed"
  };
  return [...new Set(flags)].map((flag) => map[flag] || flag);
}

function triagePromptForFlag(flag) {
  switch (flag) {
    case "image_or_color_required":
      return "Check body color, roof color, hood stripe, and tampo accents in the photo.";
    case "chase_variant_not_confirmed":
      return "Look for TH / STH / chase marks, flame logo, or special wheel treatment.";
    case "wheel_variant_unconfirmed":
      return "Zoom the wheels to confirm 10SP, Real Riders, or another wheel type.";
    case "card_region_unconfirmed":
      return "Read the card top/bottom print and importer text for US, UK, or another region.";
    case "needs_adversarial_verify":
      return "Compare against a second source before accepting the variant as verified.";
    case "seed_price":
      return "Treat price as a placeholder until a sold-comp source is connected.";
    default:
      return null;
  }
}

export function lookup(id) {
  return loadData().byId.get(id) || null;
}

export function detectCondition(title = "") {
  const titleNorm = norm(title);
  for (const entry of CONDITION_ALIASES) {
    if (entry.patterns.some((pattern) => titleNorm.includes(pattern))) {
      return entry.condition;
    }
  }
  return null;
}

export function price(id, condition = "carded") {
  const record = lookup(id);
  if (!record) return null;
  const value = record.condition_values?.[condition];
  if (typeof value !== "number") return null;
  return {
    diecast_id: id,
    condition,
    value,
    pricing_quality: record.pricing_quality,
    flags: record.flags || []
  };
}

export function match(title, options = {}) {
  const data = loadData();
  const titleNorm = norm(title);
  const titleTokens = tokens(title);
  const condition = options.condition || detectCondition(title) || "carded";

  const candidates = data.records.map((record) => {
    let score = 0;
    const matched = [];
    const missing = [];
    const family = data.records.filter((candidate) =>
      candidate.brand === record.brand &&
      candidate.line === record.line &&
      candidate.casting === record.casting
    );
    const familyRegions = new Set(family.map((candidate) => candidate.card_region));
    const mentionsRegion = REGION_CODES.has((record.card_region || "").toLowerCase()) &&
      titleTokens.has((record.card_region || "").toLowerCase());

    for (const field of IMPORTANT_FIELDS) {
      const value = record[field];
      if (!value || value === "none") continue;
      if (includesPhrase(titleNorm, value)) {
        score += field === "casting" ? 28 : field === "brand" ? 14 : 8;
        matched.push(field);
      } else if (["color", "wheel_type", "chase_type", "series_number"].includes(field)) {
        missing.push(field);
      }
    }

    for (const alias of record.aliases || []) {
      if (includesPhrase(titleNorm, alias)) {
        score += 18;
        matched.push("alias");
      }
    }

    for (const token of titleTokens) {
      if (record.searchable.some((text) => tokens(text).has(token))) {
        score += 1;
      }
    }

    const confidence = Math.max(0, Math.min(0.99, score / 90));
    const ambiguityFlags = [];
    if (missing.includes("color")) ambiguityFlags.push("image_or_color_required");
    if (record.chase_type !== "none" && !matched.includes("chase_type")) ambiguityFlags.push("chase_variant_not_confirmed");
    if (missing.includes("wheel_type")) ambiguityFlags.push("wheel_variant_unconfirmed");
    if (familyRegions.size > 1 && !mentionsRegion) ambiguityFlags.push("card_region_unconfirmed");

    return {
      diecast_id: record.diecast_id,
      title: record.title,
      brand: record.brand,
      casting: record.casting,
      condition,
      confidence: Number(confidence.toFixed(2)),
      matched: [...new Set(matched)],
      flags: [...new Set([...(record.flags || []), ...ambiguityFlags])]
    };
  })
    .filter((candidate) => candidate.confidence >= 0.18)
    .sort((a, b) => b.confidence - a.confidence)
    .slice(0, options.limit || 5);

  return {
    query: title,
    condition,
    exact: candidates[0]?.confidence >= 0.78 ? candidates[0] : null,
    candidates,
    triage: unique(
      candidates.flatMap((candidate) => candidate.flags.map(triagePromptForFlag))
    ).filter(Boolean),
    analysis: {
      needed_signals: unique(
        candidates.flatMap((candidate) => candidate.flags)
      ).filter((flag) => flag !== "seed_price" && flag !== "needs_adversarial_verify"),
      candidate_count: candidates.length,
      top_titles: candidates.slice(0, 3).map((candidate) => candidate.title),
      flag_descriptions: describeFlags(unique(candidates.flatMap((candidate) => candidate.flags)))
    }
  };
}

export function valuate(input) {
  const condition = input.condition || (input.title ? detectCondition(input.title) : null) || "carded";
  const record = input.id ? lookup(input.id) : match(input.title, { condition }).exact;
  if (!record) {
    const result = input.title ? match(input.title, { condition }) : null;
    return { ok: false, reason: "no_confident_match", match: result };
  }
  const id = record.diecast_id;
  return {
    ok: true,
    record: lookup(id),
    price: price(id, condition),
    match: input.title ? match(input.title, { condition }) : null
  };
}
