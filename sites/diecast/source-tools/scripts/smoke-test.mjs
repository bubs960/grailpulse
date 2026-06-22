import { match, price, valuate } from "../api/index.mjs";

const exact = match("2025 Hot Wheels Nissan Skyline GT-R R34 spectraflame blue Super Treasure Hunt carded");
if (!exact.exact) throw new Error("Expected confident Super Treasure Hunt match.");

const ambiguous = match("Hot Wheels Nissan Skyline R34 carded");
if (ambiguous.exact) throw new Error("Ambiguous Skyline title should not resolve as exact.");
if (ambiguous.candidates.length < 2) throw new Error("Expected multiple Skyline candidates.");
if (!ambiguous.analysis?.needed_signals?.length) throw new Error("Expected ambiguity analysis to surface missing signals.");
if (!ambiguous.analysis.needed_signals.includes("card_region_unconfirmed") && !ambiguous.analysis.needed_signals.includes("image_or_color_required")) {
  throw new Error("Expected ambiguity analysis to mention a missing signal.");
}
if (!ambiguous.triage?.length) throw new Error("Expected photo triage prompts to be generated.");

const value = valuate({ title: "Matchbox Moving Parts Land Rover Defender 110 olive green MOMC" });
if (!value.ok) throw new Error("Expected Defender Moving Parts valuation.");

const priced = price(exact.exact.diecast_id, "momc");
if (!priced || priced.value <= 0) throw new Error("Expected positive MOMC price.");

console.log("Smoke tests passed.");
