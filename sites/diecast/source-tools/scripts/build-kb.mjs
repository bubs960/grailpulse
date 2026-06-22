import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const root = resolve(__dirname, "..");
const sourcePath = resolve(root, "kb/source.catalog.json");
const generatedDir = resolve(root, "kb/generated");
const exportDir = resolve(root, "export");
const photoMapPath = resolve(root, "kb/photo-map.json");
const ownerPhotoMapPath = resolve(root, "kb/owner-photo-map.json");
const soldCompSummariesPath = resolve(root, "kb/sold-comp-summaries.json");
const POPULAR_FAMILY_COUNT = 100;

const POPULAR_FAMILY_TEMPLATES = [
  {
    brand: "Hot Wheels",
    year_release: 2025,
    line: "Mainline",
    segment: "HW J-Imports",
    casting: "Nissan Skyline GT-R R34",
    scale: "1:64",
    country: "Malaysia",
    card_regions: ["US", "UK"],
    colors: ["metallic blue", "red", "silver", "black", "spectraflame blue"],
    decos: ["white side stripe", "black hood stripe", "tampo graphic", "clean", "TH side mark"],
    wheel_type: "10SP",
    base: "plastic black",
    chase_type: "none",
    aliases: ["R34 Skyline", "Skyline GTR R34", "Nissan Skyline R34"],
    base_condition: 5.5
  },
  {
    brand: "Hot Wheels",
    year_release: 2025,
    line: "Car Culture",
    segment: "Ronin Run",
    casting: "Toyota Supra A80",
    scale: "1:64",
    country: "Thailand",
    card_regions: ["US", "UK"],
    colors: ["orange", "white", "red", "silver", "black"],
    decos: ["black race livery", "clean", "offset graphic", "tuner stripe", "premium deco"],
    wheel_type: "Real Riders",
    base: "metal",
    chase_type: "none",
    aliases: ["Supra A80", "Toyota Supra", "A80 Supra"],
    base_condition: 12
  },
  {
    brand: "Hot Wheels",
    year_release: 2025,
    line: "Mainline",
    segment: "HW J-Imports",
    casting: "Honda Civic Type R FL5",
    scale: "1:64",
    country: "Malaysia",
    card_regions: ["US", "UK"],
    colors: ["white", "blue", "red", "yellow", "gray"],
    decos: ["red Honda side stripe", "clean", "black hood accent", "rally stripe", "type-r graphic"],
    wheel_type: "10SP",
    base: "plastic black",
    chase_type: "none",
    aliases: ["Civic Type R", "FL5 Civic", "Honda FL5"],
    base_condition: 6.5
  },
  {
    brand: "Hot Wheels",
    year_release: 2025,
    line: "Mainline",
    segment: "HW J-Imports",
    casting: "Nissan Z",
    scale: "1:64",
    country: "Malaysia",
    card_regions: ["US", "UK"],
    colors: ["yellow", "blue", "red", "silver", "black"],
    decos: ["black hood accent", "clean", "side stripe", "track livery", "premium deco"],
    wheel_type: "10SP",
    base: "plastic black",
    chase_type: "none",
    aliases: ["Fairlady Z", "Nissan Z Proto", "RZ34"],
    base_condition: 6.25
  },
  {
    brand: "Hot Wheels",
    year_release: 2025,
    line: "Car Culture",
    segment: "Circuit Legends",
    casting: "Mazda RX-7 FD3S",
    scale: "1:64",
    country: "Thailand",
    card_regions: ["US", "UK"],
    colors: ["red", "white", "orange", "blue", "black"],
    decos: ["street tuner graphics", "clean", "bold stripe", "JDM livery", "track accent"],
    wheel_type: "Real Riders",
    base: "metal",
    chase_type: "none",
    aliases: ["RX-7 FD", "Mazda RX7", "FD3S"],
    base_condition: 10
  },
  {
    brand: "Hot Wheels",
    year_release: 2025,
    line: "Car Culture",
    segment: "Circuit Legends",
    casting: "Porsche 911 GT3 RS",
    scale: "1:64",
    country: "Thailand",
    card_regions: ["US", "UK"],
    colors: ["white", "red", "blue", "silver", "black"],
    decos: ["Mobil 1 race livery", "clean", "track stripe", "endurance accent", "porsche decal"],
    wheel_type: "Real Riders",
    base: "metal",
    chase_type: "none",
    aliases: ["911 GT3 RS", "Porsche GT3 RS", "GT3 RS"],
    base_condition: 13
  },
  {
    brand: "Hot Wheels",
    year_release: 2025,
    line: "Premium Boulevard",
    segment: "Boulevard",
    casting: "Mercedes-Benz 190E Evo II",
    scale: "1:64",
    country: "Thailand",
    card_regions: ["US", "UK"],
    colors: ["black", "silver", "red", "blue", "white"],
    decos: ["DTM inspired graphics", "clean", "side stripe", "touring car livery", "premium deco"],
    wheel_type: "Real Riders",
    base: "metal",
    chase_type: "none",
    aliases: ["Mercedes 190E", "190E Evo II", "Benz 190E"],
    base_condition: 14
  },
  {
    brand: "Matchbox",
    year_release: 2026,
    line: "Moving Parts",
    segment: "Moving Parts",
    casting: "Land Rover Defender 110",
    scale: "1:64",
    country: "Thailand",
    card_regions: ["US", "UK"],
    colors: ["orange", "green", "white", "blue", "gray"],
    decos: ["expedition side stripe", "clean utility", "plain utility", "off-road accent", "trail pack"],
    wheel_type: "realistic utility",
    base: "plastic black",
    chase_type: "none",
    aliases: ["Defender 110", "Land Rover 110", "Defender"],
    base_condition: 4.5
  },
  {
    brand: "Matchbox",
    year_release: 2026,
    line: "The Movie",
    segment: "The Movie",
    casting: "Volkswagen T2B Bus",
    scale: "1:64",
    country: "Thailand",
    card_regions: ["US", "UK"],
    colors: ["brilliant orange", "yellow", "white", "blue", "red"],
    decos: ["movie deco", "clean", "retro stripe", "poster art", "tour deco"],
    wheel_type: "basic black",
    base: "plastic black",
    chase_type: "none",
    aliases: ["VW T2B Bus", "Volkswagen Bus", "Matchbox movie bus"],
    base_condition: 7
  },
  {
    brand: "Matchbox",
    year_release: 2026,
    line: "Moving Parts",
    segment: "Moving Parts",
    casting: "Ram 1500 Rebel",
    scale: "1:64",
    country: "Thailand",
    card_regions: ["US", "UK"],
    colors: ["white", "black", "red", "blue", "silver"],
    decos: ["off-road side stripe", "clean", "trail graphic", "utility stripe", "desert pack"],
    wheel_type: "realistic utility",
    base: "plastic black",
    chase_type: "none",
    aliases: ["Ram Rebel", "Ram 1500", "Matchbox Ram"],
    base_condition: 7.25
  },
  {
    brand: "Hot Wheels",
    year_release: 2025,
    line: "Mainline",
    segment: "HW J-Imports",
    casting: "Honda S2000",
    scale: "1:64",
    country: "Malaysia",
    card_regions: ["US", "UK"],
    colors: ["yellow", "white", "red", "blue", "black"],
    decos: ["side stripe", "clean", "track graphic", "tuner livery", "hood accent"],
    wheel_type: "10SP",
    base: "plastic black",
    chase_type: "none",
    aliases: ["S2000", "Honda roadster", "HW S2000"],
    base_condition: 6.75
  },
  {
    brand: "Hot Wheels",
    year_release: 2025,
    line: "Mainline",
    segment: "HW J-Imports",
    casting: "Nissan Silvia S15",
    scale: "1:64",
    country: "Malaysia",
    card_regions: ["US", "UK"],
    colors: ["white", "blue", "silver", "red", "black"],
    decos: ["drift livery", "clean", "side stripe", "tuner graphic", "hood decal"],
    wheel_type: "10SP",
    base: "plastic black",
    chase_type: "none",
    aliases: ["Silvia S15", "Nissan S15", "S15 drift"],
    base_condition: 7.5
  },
  {
    brand: "Hot Wheels",
    year_release: 2025,
    line: "Mainline",
    segment: "HW J-Imports",
    casting: "Toyota AE86 Sprinter Trueno",
    scale: "1:64",
    country: "Malaysia",
    card_regions: ["US", "UK"],
    colors: ["white", "black", "red", "silver", "yellow"],
    decos: ["panda two-tone", "clean", "touge stripe", "side graphic", "hood accent"],
    wheel_type: "10SP",
    base: "plastic black",
    chase_type: "none",
    aliases: ["AE86", "Sprinter Trueno", "Toyota Trueno"],
    base_condition: 8.25
  },
  {
    brand: "Hot Wheels",
    year_release: 2025,
    line: "Premium Boulevard",
    segment: "Boulevard",
    casting: "Datsun 510 Wagon",
    scale: "1:64",
    country: "Thailand",
    card_regions: ["US", "UK"],
    colors: ["blue", "white", "green", "red", "black"],
    decos: ["BRE inspired livery", "clean", "retro stripe", "wagon side graphic", "premium deco"],
    wheel_type: "Real Riders",
    base: "metal",
    chase_type: "none",
    aliases: ["Datsun wagon", "510 wagon", "Bluebird wagon"],
    base_condition: 15
  },
  {
    brand: "Hot Wheels",
    year_release: 2025,
    line: "Car Culture",
    segment: "Exotic Envy",
    casting: "Lamborghini Huracan",
    scale: "1:64",
    country: "Thailand",
    card_regions: ["US", "UK"],
    colors: ["green", "orange", "white", "black", "yellow"],
    decos: ["race stripe", "clean", "track livery", "side accent", "premium deco"],
    wheel_type: "Real Riders",
    base: "metal",
    chase_type: "none",
    aliases: ["Huracan", "Lamborghini supercar", "Lambo Huracan"],
    base_condition: 13.5
  },
  {
    brand: "Hot Wheels",
    year_release: 2025,
    line: "Car Culture",
    segment: "Exotic Envy",
    casting: "McLaren F1",
    scale: "1:64",
    country: "Thailand",
    card_regions: ["US", "UK"],
    colors: ["silver", "orange", "black", "white", "blue"],
    decos: ["GTR livery", "clean", "track stripe", "side number", "premium deco"],
    wheel_type: "Real Riders",
    base: "metal",
    chase_type: "none",
    aliases: ["McLaren F1 GTR", "F1 supercar", "McLaren"],
    base_condition: 16
  },
  {
    brand: "Hot Wheels",
    year_release: 2025,
    line: "Mainline",
    segment: "HW Then and Now",
    casting: "Ford Mustang GT",
    scale: "1:64",
    country: "Malaysia",
    card_regions: ["US", "UK"],
    colors: ["red", "blue", "black", "white", "green"],
    decos: ["dual racing stripes", "clean", "side stripe", "muscle graphic", "track accent"],
    wheel_type: "5SP",
    base: "plastic black",
    chase_type: "none",
    aliases: ["Mustang GT", "Ford Mustang", "Mustang"],
    base_condition: 5.75
  },
  {
    brand: "Hot Wheels",
    year_release: 2025,
    line: "Mainline",
    segment: "HW Muscle Mania",
    casting: "Chevrolet Camaro SS",
    scale: "1:64",
    country: "Malaysia",
    card_regions: ["US", "UK"],
    colors: ["orange", "black", "yellow", "blue", "white"],
    decos: ["hood stripe", "clean", "side graphic", "muscle livery", "race number"],
    wheel_type: "5SP",
    base: "plastic black",
    chase_type: "none",
    aliases: ["Camaro SS", "Chevy Camaro", "Camaro"],
    base_condition: 5.5
  },
  {
    brand: "Hot Wheels",
    year_release: 2025,
    line: "Mainline",
    segment: "HW Green Speed",
    casting: "Tesla Cybertruck",
    scale: "1:64",
    country: "Malaysia",
    card_regions: ["US", "UK"],
    colors: ["silver", "matte gray", "black", "white", "blue"],
    decos: ["clean", "utility stripe", "cyber graphic", "side accent", "concept deco"],
    wheel_type: "AeroDisc",
    base: "plastic black",
    chase_type: "none",
    aliases: ["Cybertruck", "Tesla truck", "Tesla pickup"],
    base_condition: 6.25
  },
  {
    brand: "Hot Wheels",
    year_release: 2025,
    line: "Retro Entertainment",
    segment: "Screen Time",
    casting: "DeLorean DMC-12",
    scale: "1:64",
    country: "Thailand",
    card_regions: ["US", "UK"],
    colors: ["silver", "gray", "black", "white", "blue"],
    decos: ["movie deco", "clean", "time machine deco", "side stripe", "premium deco"],
    wheel_type: "Real Riders",
    base: "metal",
    chase_type: "none",
    aliases: ["DeLorean", "DMC-12", "time machine"],
    base_condition: 14
  },
  {
    brand: "Hot Wheels",
    year_release: 2025,
    line: "Premium Boulevard",
    segment: "Boulevard",
    casting: "Porsche 993 GT2",
    scale: "1:64",
    country: "Thailand",
    card_regions: ["US", "UK"],
    colors: ["yellow", "white", "red", "silver", "black"],
    decos: ["track stripe", "clean", "race livery", "side number", "premium deco"],
    wheel_type: "Real Riders",
    base: "metal",
    chase_type: "none",
    aliases: ["993 GT2", "Porsche GT2", "Porsche 911 GT2"],
    base_condition: 14.5
  },
  {
    brand: "Hot Wheels",
    year_release: 2025,
    line: "Car Culture",
    segment: "Euro Speed",
    casting: "BMW M3 E46",
    scale: "1:64",
    country: "Thailand",
    card_regions: ["US", "UK"],
    colors: ["blue", "silver", "white", "black", "red"],
    decos: ["M stripe", "clean", "touring livery", "side accent", "premium deco"],
    wheel_type: "Real Riders",
    base: "metal",
    chase_type: "none",
    aliases: ["E46 M3", "BMW E46", "M3"],
    base_condition: 13.75
  },
  {
    brand: "Hot Wheels",
    year_release: 2025,
    line: "Car Culture",
    segment: "Euro Speed",
    casting: "Audi RS2 Avant",
    scale: "1:64",
    country: "Thailand",
    card_regions: ["US", "UK"],
    colors: ["blue", "silver", "black", "white", "red"],
    decos: ["quattro stripe", "clean", "wagon side graphic", "track accent", "premium deco"],
    wheel_type: "Real Riders",
    base: "metal",
    chase_type: "none",
    aliases: ["RS2 Avant", "Audi wagon", "Audi RS2"],
    base_condition: 12.75
  },
  {
    brand: "Hot Wheels",
    year_release: 2025,
    line: "Mainline",
    segment: "HW J-Imports",
    casting: "Subaru WRX STI",
    scale: "1:64",
    country: "Malaysia",
    card_regions: ["US", "UK"],
    colors: ["blue", "white", "red", "silver", "black"],
    decos: ["rally livery", "clean", "side stripe", "hood graphic", "track number"],
    wheel_type: "10SP",
    base: "plastic black",
    chase_type: "none",
    aliases: ["WRX STI", "Subaru STI", "Impreza WRX"],
    base_condition: 7
  },
  {
    brand: "Hot Wheels",
    year_release: 2025,
    line: "Mainline",
    segment: "HW J-Imports",
    casting: "Mitsubishi Lancer Evolution",
    scale: "1:64",
    country: "Malaysia",
    card_regions: ["US", "UK"],
    colors: ["white", "red", "silver", "blue", "black"],
    decos: ["rally stripe", "clean", "side graphic", "hood accent", "track livery"],
    wheel_type: "10SP",
    base: "plastic black",
    chase_type: "none",
    aliases: ["Lancer Evo", "Mitsubishi Evo", "Evolution"],
    base_condition: 7.25
  },
  {
    brand: "Matchbox",
    year_release: 2026,
    line: "Moving Parts",
    segment: "Moving Parts",
    casting: "Toyota Land Cruiser",
    scale: "1:64",
    country: "Thailand",
    card_regions: ["US", "UK"],
    colors: ["tan", "white", "green", "blue", "red"],
    decos: ["adventure stripe", "clean utility", "trail graphic", "expedition deco", "rescue livery"],
    wheel_type: "realistic utility",
    base: "plastic black",
    chase_type: "none",
    aliases: ["Land Cruiser", "Toyota 4x4", "Matchbox Land Cruiser"],
    base_condition: 8
  },
  {
    brand: "Matchbox",
    year_release: 2026,
    line: "Moving Parts",
    segment: "Moving Parts",
    casting: "Chevrolet K1500",
    scale: "1:64",
    country: "Thailand",
    card_regions: ["US", "UK"],
    colors: ["red", "black", "white", "blue", "green"],
    decos: ["off-road stripe", "clean utility", "work truck deco", "trail graphic", "ranch livery"],
    wheel_type: "realistic utility",
    base: "plastic black",
    chase_type: "none",
    aliases: ["Chevy K1500", "K1500 pickup", "Chevrolet truck"],
    base_condition: 6.75
  },
  {
    brand: "Matchbox",
    year_release: 2026,
    line: "Basic",
    segment: "Electric Drivers",
    casting: "Tesla Model Y",
    scale: "1:64",
    country: "Thailand",
    card_regions: ["US", "UK"],
    colors: ["white", "red", "blue", "black", "silver"],
    decos: ["clean", "eco side stripe", "city graphic", "utility deco", "plain"],
    wheel_type: "basic black",
    base: "plastic black",
    chase_type: "none",
    aliases: ["Model Y", "Tesla SUV", "Tesla"],
    base_condition: 4.75
  },
  {
    brand: "Matchbox",
    year_release: 2026,
    line: "Basic",
    segment: "Electric Drivers",
    casting: "Rivian R1T",
    scale: "1:64",
    country: "Thailand",
    card_regions: ["US", "UK"],
    colors: ["green", "blue", "white", "silver", "orange"],
    decos: ["adventure stripe", "clean", "camp graphic", "utility stripe", "outdoor deco"],
    wheel_type: "realistic utility",
    base: "plastic black",
    chase_type: "none",
    aliases: ["R1T", "Rivian truck", "electric pickup"],
    base_condition: 5.75
  },
  {
    brand: "Matchbox",
    year_release: 2026,
    line: "Moving Parts",
    segment: "Moving Parts",
    casting: "Jeep Gladiator",
    scale: "1:64",
    country: "Thailand",
    card_regions: ["US", "UK"],
    colors: ["green", "red", "tan", "black", "white"],
    decos: ["trail stripe", "clean utility", "rubicon graphic", "rescue deco", "desert pack"],
    wheel_type: "realistic utility",
    base: "plastic black",
    chase_type: "none",
    aliases: ["Gladiator", "Jeep pickup", "Jeep truck"],
    base_condition: 6.25
  },
  {
    brand: "Matchbox",
    year_release: 2026,
    line: "Moving Parts",
    segment: "Moving Parts",
    casting: "Porsche 911 Rally",
    scale: "1:64",
    country: "Thailand",
    card_regions: ["US", "UK"],
    colors: ["white", "blue", "red", "silver", "black"],
    decos: ["rally stripe", "clean", "side number", "off-road accent", "heritage livery"],
    wheel_type: "realistic sport",
    base: "plastic black",
    chase_type: "none",
    aliases: ["911 Rally", "Porsche rally", "Porsche 911"],
    base_condition: 7
  },
  {
    brand: "Matchbox",
    year_release: 2026,
    line: "Moving Parts",
    segment: "Moving Parts",
    casting: "Mercedes-Benz G-Class",
    scale: "1:64",
    country: "Thailand",
    card_regions: ["US", "UK"],
    colors: ["black", "white", "silver", "green", "red"],
    decos: ["clean luxury", "side stripe", "trail graphic", "rescue livery", "urban deco"],
    wheel_type: "realistic utility",
    base: "plastic black",
    chase_type: "none",
    aliases: ["G-Class", "G Wagon", "Mercedes G-Wagon"],
    base_condition: 6.5
  },
  {
    brand: "Matchbox",
    year_release: 2026,
    line: "Basic",
    segment: "MBX Highway",
    casting: "Ford F-150 Lightning",
    scale: "1:64",
    country: "Thailand",
    card_regions: ["US", "UK"],
    colors: ["blue", "white", "silver", "black", "red"],
    decos: ["electric stripe", "clean", "utility graphic", "work truck deco", "side accent"],
    wheel_type: "realistic utility",
    base: "plastic black",
    chase_type: "none",
    aliases: ["F-150 Lightning", "Ford Lightning", "electric F150"],
    base_condition: 5.5
  },
  {
    brand: "Matchbox",
    year_release: 2026,
    line: "Basic",
    segment: "MBX Off Road",
    casting: "Toyota 4Runner",
    scale: "1:64",
    country: "Thailand",
    card_regions: ["US", "UK"],
    colors: ["white", "black", "green", "red", "blue"],
    decos: ["trail stripe", "clean utility", "off-road graphic", "rescue deco", "overland livery"],
    wheel_type: "realistic utility",
    base: "plastic black",
    chase_type: "none",
    aliases: ["4Runner", "Toyota SUV", "Toyota off road"],
    base_condition: 6
  },
  {
    brand: "Matchbox",
    year_release: 2026,
    line: "Basic",
    segment: "MBX City",
    casting: "Subaru Sambar",
    scale: "1:64",
    country: "Thailand",
    card_regions: ["US", "UK"],
    colors: ["white", "blue", "green", "yellow", "red"],
    decos: ["kei truck graphic", "clean", "delivery livery", "city service", "retro stripe"],
    wheel_type: "basic black",
    base: "plastic black",
    chase_type: "none",
    aliases: ["Sambar", "Subaru kei truck", "kei truck"],
    base_condition: 5.25
  },
  {
    brand: "Jada Toys",
    year_release: 2005,
    line: "WWE",
    segment: "WWE",
    casting: "Ford Mustang GT",
    scale: "1:64",
    country: "China",
    card_regions: ["US"],
    colors: ["red", "black", "white", "blue", "silver"],
    decos: ["RAW logo", "SmackDown logo", "superstar graphic", "championship deco", "flame graphic"],
    wheel_type: "chrome sport",
    base: "metal",
    chase_type: "none",
    aliases: ["Jada WWE Mustang", "WWE Mustang", "RAW Mustang"],
    base_condition: 18
  },
  {
    brand: "Racing Champions",
    year_release: 1999,
    line: "WCW Nitro Streetrods",
    segment: "Nitro Streetrods",
    casting: "Hollywood Hogan Street Rod",
    scale: "1:64",
    country: "China",
    card_regions: ["US"],
    colors: ["black", "red", "silver", "yellow", "white"],
    decos: ["nWo logo", "Hollywood Hogan graphic", "Nitro logo", "WCW wrestling livery", "championship deco"],
    wheel_type: "chrome sport",
    base: "metal",
    chase_type: "none",
    aliases: ["WCW Nitro Streetrods", "Hollywood Hogan diecast", "nWo street rod"],
    base_condition: 20
  },
  {
    brand: "Jada Toys",
    year_release: 2005,
    line: "WWE",
    segment: "WWE",
    casting: "Chevrolet Camaro",
    scale: "1:64",
    country: "China",
    card_regions: ["US"],
    colors: ["black", "red", "silver", "blue", "yellow"],
    decos: ["SmackDown logo", "RAW logo", "superstar graphic", "championship deco", "flame graphic"],
    wheel_type: "chrome sport",
    base: "metal",
    chase_type: "none",
    aliases: ["Jada WWE Camaro", "WWE Camaro", "SmackDown Camaro"],
    base_condition: 18.5
  },
  {
    brand: "Jada Toys",
    year_release: 2005,
    line: "WWE",
    segment: "WWE",
    casting: "Chevrolet Corvette",
    scale: "1:64",
    country: "China",
    card_regions: ["US"],
    colors: ["yellow", "red", "black", "blue", "silver"],
    decos: ["RAW logo", "SmackDown logo", "superstar graphic", "championship deco", "flame graphic"],
    wheel_type: "chrome sport",
    base: "metal",
    chase_type: "none",
    aliases: ["Jada WWE Corvette", "WWE Corvette", "RAW Corvette"],
    base_condition: 19
  },
  {
    brand: "Jada Toys",
    year_release: 2005,
    line: "WCW",
    segment: "WCW",
    casting: "Dodge Viper",
    scale: "1:64",
    country: "China",
    card_regions: ["US"],
    colors: ["blue", "black", "red", "silver", "white"],
    decos: ["nWo logo", "Nitro logo", "WCW championship deco", "wrestling livery", "flame graphic"],
    wheel_type: "chrome sport",
    base: "metal",
    chase_type: "none",
    aliases: ["Jada WCW Viper", "WCW Viper", "nWo Viper"],
    base_condition: 21
  },
  {
    brand: "Jada Toys",
    year_release: 2005,
    line: "WWE",
    segment: "WWE",
    casting: "Cadillac Escalade",
    scale: "1:64",
    country: "China",
    card_regions: ["US"],
    colors: ["black", "white", "silver", "red", "blue"],
    decos: ["SmackDown logo", "RAW logo", "superstar graphic", "championship deco", "flame graphic"],
    wheel_type: "chrome sport",
    base: "metal",
    chase_type: "none",
    aliases: ["Jada WWE Escalade", "WWE Escalade", "SmackDown Escalade"],
    base_condition: 22
  },
  {
    brand: "Hot Wheels",
    year_release: 2025,
    line: "Car Culture",
    segment: "Modern Classics",
    casting: "Nissan 300ZX Twin Turbo",
    scale: "1:64",
    country: "Thailand",
    card_regions: ["US", "UK"],
    colors: ["red", "white", "black", "silver", "blue"],
    decos: ["clean", "side stripe", "period graphic", "track livery", "premium deco"],
    wheel_type: "Real Riders",
    base: "metal",
    chase_type: "none",
    aliases: ["300ZX", "Nissan Z32", "Z32 Twin Turbo"],
    base_condition: 12.5
  },
  {
    brand: "Hot Wheels",
    year_release: 2025,
    line: "Premium Boulevard",
    segment: "Boulevard",
    casting: "Acura NSX",
    scale: "1:64",
    country: "Thailand",
    card_regions: ["US", "UK"],
    colors: ["red", "white", "black", "silver", "yellow"],
    decos: ["clean", "side stripe", "track accent", "JDM livery", "premium deco"],
    wheel_type: "Real Riders",
    base: "metal",
    chase_type: "none",
    aliases: ["Honda NSX", "NSX", "Acura supercar"],
    base_condition: 15
  },
  {
    brand: "Hot Wheels",
    year_release: 2025,
    line: "Car Culture",
    segment: "Mountain Drifters",
    casting: "Toyota Celica GT-Four",
    scale: "1:64",
    country: "Thailand",
    card_regions: ["US", "UK"],
    colors: ["white", "red", "black", "blue", "silver"],
    decos: ["rally livery", "clean", "side stripe", "mountain graphic", "premium deco"],
    wheel_type: "Real Riders",
    base: "metal",
    chase_type: "none",
    aliases: ["Celica GT-Four", "Toyota Celica", "GT4"],
    base_condition: 13.25
  },
  {
    brand: "Hot Wheels",
    year_release: 2025,
    line: "Mainline",
    segment: "HW J-Imports",
    casting: "Mazda MX-5 Miata",
    scale: "1:64",
    country: "Malaysia",
    card_regions: ["US", "UK"],
    colors: ["red", "blue", "white", "green", "black"],
    decos: ["clean", "roadster stripe", "side graphic", "club racing livery", "hood accent"],
    wheel_type: "10SP",
    base: "plastic black",
    chase_type: "none",
    aliases: ["MX-5", "Miata", "Mazda roadster"],
    base_condition: 6.5
  },
  {
    brand: "Hot Wheels",
    year_release: 2025,
    line: "Mainline",
    segment: "HW Modified",
    casting: "Volkswagen Golf MK2",
    scale: "1:64",
    country: "Malaysia",
    card_regions: ["US", "UK"],
    colors: ["red", "white", "black", "blue", "green"],
    decos: ["GTI stripe", "clean", "euro tuner graphic", "side accent", "track livery"],
    wheel_type: "10SP",
    base: "plastic black",
    chase_type: "none",
    aliases: ["Golf GTI", "VW Golf MK2", "Volkswagen GTI"],
    base_condition: 7
  },
  {
    brand: "Hot Wheels",
    year_release: 2025,
    line: "Premium Boulevard",
    segment: "Boulevard",
    casting: "Volkswagen Drag Bus",
    scale: "1:64",
    country: "Thailand",
    card_regions: ["US", "UK"],
    colors: ["yellow", "blue", "red", "black", "white"],
    decos: ["flame graphic", "retro stripe", "drag livery", "collector deco", "premium deco"],
    wheel_type: "Real Riders",
    base: "metal",
    chase_type: "none",
    aliases: ["VW Drag Bus", "Drag Bus", "Volkswagen bus"],
    base_condition: 18
  },
  {
    brand: "Hot Wheels",
    year_release: 2025,
    line: "Retro Entertainment",
    segment: "Screen Time",
    casting: "Batmobile",
    scale: "1:64",
    country: "Thailand",
    card_regions: ["US", "UK"],
    colors: ["black", "matte black", "blue", "silver", "gray"],
    decos: ["movie deco", "clean", "bat emblem", "premium deco", "screen livery"],
    wheel_type: "Real Riders",
    base: "metal",
    chase_type: "none",
    aliases: ["Batman car", "TV Batmobile", "movie Batmobile"],
    base_condition: 12
  },
  {
    brand: "Hot Wheels",
    year_release: 2025,
    line: "Retro Entertainment",
    segment: "Screen Time",
    casting: "K.I.T.T.",
    scale: "1:64",
    country: "Thailand",
    card_regions: ["US", "UK"],
    colors: ["black", "silver", "gray", "white", "red"],
    decos: ["scanner deco", "clean", "screen livery", "premium deco", "side accent"],
    wheel_type: "Real Riders",
    base: "metal",
    chase_type: "none",
    aliases: ["Knight Rider", "KITT", "Pontiac Trans Am"],
    base_condition: 13
  },
  {
    brand: "Hot Wheels",
    year_release: 2025,
    line: "Car Culture",
    segment: "American Scene",
    casting: "Dodge Charger Daytona",
    scale: "1:64",
    country: "Thailand",
    card_regions: ["US", "UK"],
    colors: ["orange", "yellow", "black", "red", "blue"],
    decos: ["wing car stripe", "clean", "muscle livery", "race number", "premium deco"],
    wheel_type: "Real Riders",
    base: "metal",
    chase_type: "none",
    aliases: ["Charger Daytona", "Dodge Daytona", "wing car"],
    base_condition: 12.75
  },
  {
    brand: "Hot Wheels",
    year_release: 2025,
    line: "Mainline",
    segment: "HW Muscle Mania",
    casting: "Plymouth Barracuda",
    scale: "1:64",
    country: "Malaysia",
    card_regions: ["US", "UK"],
    colors: ["purple", "green", "orange", "black", "white"],
    decos: ["hemi stripe", "clean", "muscle graphic", "race livery", "side accent"],
    wheel_type: "5SP",
    base: "plastic black",
    chase_type: "none",
    aliases: ["Cuda", "Plymouth Cuda", "Barracuda"],
    base_condition: 6.25
  },
  {
    brand: "Hot Wheels",
    year_release: 2025,
    line: "Mainline",
    segment: "HW Hot Trucks",
    casting: "Chevrolet C10",
    scale: "1:64",
    country: "Malaysia",
    card_regions: ["US", "UK"],
    colors: ["blue", "red", "white", "black", "green"],
    decos: ["shop truck graphic", "clean", "lowered livery", "side stripe", "flame graphic"],
    wheel_type: "5SP",
    base: "plastic black",
    chase_type: "none",
    aliases: ["Chevy C10", "C10 pickup", "Chevrolet pickup"],
    base_condition: 6.75
  },
  {
    brand: "Matchbox",
    year_release: 2026,
    line: "Moving Parts",
    segment: "Moving Parts",
    casting: "Nissan Patrol",
    scale: "1:64",
    country: "Thailand",
    card_regions: ["US", "UK"],
    colors: ["white", "tan", "green", "black", "blue"],
    decos: ["expedition stripe", "clean utility", "rescue graphic", "trail livery", "desert pack"],
    wheel_type: "realistic utility",
    base: "plastic black",
    chase_type: "none",
    aliases: ["Patrol", "Nissan 4x4", "Nissan SUV"],
    base_condition: 6.5
  },
  {
    brand: "Matchbox",
    year_release: 2026,
    line: "Moving Parts",
    segment: "Moving Parts",
    casting: "Range Rover Sport",
    scale: "1:64",
    country: "Thailand",
    card_regions: ["US", "UK"],
    colors: ["white", "black", "silver", "blue", "green"],
    decos: ["clean luxury", "urban stripe", "rescue livery", "trail graphic", "premium utility"],
    wheel_type: "realistic utility",
    base: "plastic black",
    chase_type: "none",
    aliases: ["Range Rover", "Range Rover Sport", "Land Rover SUV"],
    base_condition: 6.75
  },
  {
    brand: "Matchbox",
    year_release: 2026,
    line: "Moving Parts",
    segment: "Moving Parts",
    casting: "GMC Hummer EV",
    scale: "1:64",
    country: "Thailand",
    card_regions: ["US", "UK"],
    colors: ["white", "silver", "black", "green", "orange"],
    decos: ["electric stripe", "clean", "off-road graphic", "utility deco", "trail pack"],
    wheel_type: "realistic utility",
    base: "plastic black",
    chase_type: "none",
    aliases: ["Hummer EV", "GMC Hummer", "electric Hummer"],
    base_condition: 6.25
  },
  {
    brand: "Matchbox",
    year_release: 2026,
    line: "Basic",
    segment: "MBX City",
    casting: "Honda N600",
    scale: "1:64",
    country: "Thailand",
    card_regions: ["US", "UK"],
    colors: ["yellow", "white", "red", "blue", "green"],
    decos: ["clean", "retro stripe", "city graphic", "delivery deco", "classic livery"],
    wheel_type: "basic black",
    base: "plastic black",
    chase_type: "none",
    aliases: ["N600", "Honda micro car", "Honda classic"],
    base_condition: 5.5
  },
  {
    brand: "Matchbox",
    year_release: 2026,
    line: "Basic",
    segment: "MBX City",
    casting: "Fiat 500e",
    scale: "1:64",
    country: "Thailand",
    card_regions: ["US", "UK"],
    colors: ["white", "blue", "red", "green", "yellow"],
    decos: ["clean", "electric stripe", "city graphic", "retro accent", "eco livery"],
    wheel_type: "basic black",
    base: "plastic black",
    chase_type: "none",
    aliases: ["Fiat 500", "500e", "electric Fiat"],
    base_condition: 4.75
  },
  {
    brand: "Matchbox",
    year_release: 2026,
    line: "Basic",
    segment: "MBX Highway",
    casting: "Polestar 2",
    scale: "1:64",
    country: "Thailand",
    card_regions: ["US", "UK"],
    colors: ["white", "gray", "black", "blue", "silver"],
    decos: ["clean", "electric stripe", "city livery", "side accent", "plain"],
    wheel_type: "basic black",
    base: "plastic black",
    chase_type: "none",
    aliases: ["Polestar", "Polestar EV", "electric sedan"],
    base_condition: 5
  },
  {
    brand: "Matchbox",
    year_release: 2026,
    line: "Basic",
    segment: "MBX Rescue",
    casting: "Ford Police Interceptor Utility",
    scale: "1:64",
    country: "Thailand",
    card_regions: ["US", "UK"],
    colors: ["black", "white", "blue", "silver", "red"],
    decos: ["police livery", "sheriff livery", "clean", "city service", "rescue graphic"],
    wheel_type: "basic black",
    base: "plastic black",
    chase_type: "none",
    aliases: ["Police Interceptor", "Ford Explorer police", "Interceptor Utility"],
    base_condition: 5.25
  },
  {
    brand: "Matchbox",
    year_release: 2026,
    line: "Basic",
    segment: "MBX Rescue",
    casting: "Ambulance",
    scale: "1:64",
    country: "Thailand",
    card_regions: ["US", "UK"],
    colors: ["white", "red", "yellow", "blue", "green"],
    decos: ["paramedic livery", "rescue graphic", "clean", "city service", "emergency stripe"],
    wheel_type: "basic black",
    base: "plastic black",
    chase_type: "none",
    aliases: ["Matchbox ambulance", "EMS ambulance", "rescue truck"],
    base_condition: 4.5
  },
  {
    brand: "M2 Machines",
    year_release: 2025,
    line: "Auto-Thentics",
    segment: "Auto-Thentics",
    casting: "Chevrolet Bel Air",
    scale: "1:64",
    country: "China",
    card_regions: ["US"],
    colors: ["turquoise", "red", "black", "white", "yellow"],
    decos: ["two-tone", "clean", "flame graphic", "classic stripe", "chase deco"],
    wheel_type: "rubber tire",
    base: "metal",
    chase_type: "none",
    aliases: ["M2 Bel Air", "Chevy Bel Air", "1957 Bel Air"],
    base_condition: 14
  },
  {
    brand: "M2 Machines",
    year_release: 2025,
    line: "Auto-Drivers",
    segment: "Auto-Drivers",
    casting: "Ford Mustang Boss 302",
    scale: "1:64",
    country: "China",
    card_regions: ["US"],
    colors: ["yellow", "orange", "black", "blue", "white"],
    decos: ["boss stripe", "clean", "muscle livery", "chase deco", "side graphic"],
    wheel_type: "rubber tire",
    base: "metal",
    chase_type: "none",
    aliases: ["Boss 302", "M2 Mustang", "Ford Boss"],
    base_condition: 13
  },
  {
    brand: "M2 Machines",
    year_release: 2025,
    line: "Auto-Haulers",
    segment: "Auto-Haulers",
    casting: "Chevrolet Silverado 1500",
    scale: "1:64",
    country: "China",
    card_regions: ["US"],
    colors: ["black", "red", "white", "blue", "silver"],
    decos: ["shop truck livery", "clean", "race support", "chase deco", "side stripe"],
    wheel_type: "rubber tire",
    base: "metal",
    chase_type: "none",
    aliases: ["M2 Silverado", "Chevy Silverado", "Silverado 1500"],
    base_condition: 15
  },
  {
    brand: "GreenLight",
    year_release: 2025,
    line: "Hollywood",
    segment: "Hollywood",
    casting: "Ford Crown Victoria Police",
    scale: "1:64",
    country: "China",
    card_regions: ["US"],
    colors: ["black", "white", "blue", "silver", "green"],
    decos: ["police livery", "movie livery", "clean", "sheriff graphic", "screen deco"],
    wheel_type: "rubber tire",
    base: "metal",
    chase_type: "none",
    aliases: ["Crown Vic", "Ford police car", "GreenLight police"],
    base_condition: 12
  },
  {
    brand: "GreenLight",
    year_release: 2025,
    line: "Hitch & Tow",
    segment: "Hitch & Tow",
    casting: "Airstream Bambi",
    scale: "1:64",
    country: "China",
    card_regions: ["US"],
    colors: ["silver", "white", "blue", "red", "black"],
    decos: ["clean", "camping graphic", "retro stripe", "travel livery", "collector deco"],
    wheel_type: "rubber tire",
    base: "metal",
    chase_type: "none",
    aliases: ["Airstream", "Bambi trailer", "GreenLight trailer"],
    base_condition: 11
  },
  {
    brand: "Johnny Lightning",
    year_release: 2025,
    line: "Classic Gold",
    segment: "Classic Gold",
    casting: "Pontiac Firebird Trans Am",
    scale: "1:64",
    country: "China",
    card_regions: ["US"],
    colors: ["black", "white", "red", "blue", "gold"],
    decos: ["screaming chicken", "clean", "muscle stripe", "collector deco", "white lightning style"],
    wheel_type: "rubber tire",
    base: "metal",
    chase_type: "none",
    aliases: ["Firebird", "Trans Am", "Johnny Lightning Trans Am"],
    base_condition: 12.5
  },
  {
    brand: "Johnny Lightning",
    year_release: 2025,
    line: "Street Freaks",
    segment: "Street Freaks",
    casting: "Chevrolet El Camino",
    scale: "1:64",
    country: "China",
    card_regions: ["US"],
    colors: ["purple", "red", "black", "blue", "yellow"],
    decos: ["flame graphic", "clean", "street freak livery", "side stripe", "collector deco"],
    wheel_type: "rubber tire",
    base: "metal",
    chase_type: "none",
    aliases: ["El Camino", "Johnny Lightning El Camino", "Chevy El Camino"],
    base_condition: 11.75
  }
];

function expansionFamily({
  brand = "Hot Wheels",
  year_release = 2025,
  line,
  segment = line,
  casting,
  scale = "1:64",
  country = "Thailand",
  card_regions = ["US", "UK"],
  colors = ["red", "white", "black", "silver", "blue"],
  decos = ["clean", "side stripe", "track livery", "premium deco", "collector deco"],
  wheel_type = "Real Riders",
  base = "metal",
  chase_type = "none",
  aliases = [],
  base_condition = 10,
  culture_lane = "collector-demand",
  research_basis = "2026-06-08 expansion pass",
  seed_source = "popular-expansion-2026-06-08",
  allow_chase = true
}) {
  return {
    brand,
    year_release,
    line,
    segment,
    casting,
    scale,
    country,
    card_regions,
    colors,
    decos,
    wheel_type,
    base,
    chase_type,
    aliases,
    base_condition,
    culture_lane,
    research_basis,
    seed_source,
    allow_chase
  };
}

const EXPANSION_FAMILY_TEMPLATES = [
  expansionFamily({ line: "Fast & Furious Premium", segment: "Mix 1", casting: "'70 Chevelle SS", colors: ["blue", "black", "red", "white", "silver"], decos: ["movie street livery", "clean", "muscle stripe", "side number", "premium deco"], aliases: ["Chevelle SS", "1970 Chevelle", "Fast Furious Chevelle"], base_condition: 12.5, culture_lane: "movie-muscle", research_basis: "Orange Track 2025 Fast & Furious Premium Mix 1" }),
  expansionFamily({ line: "Fast & Furious Premium", segment: "Mix 1", casting: "'03 Dodge Viper SRT 10", colors: ["red", "black", "silver", "blue", "white"], decos: ["movie street livery", "clean", "side stripe", "race number", "premium deco"], aliases: ["Dodge Viper", "Viper SRT10", "Fast Furious Viper"], base_condition: 13.25, culture_lane: "movie-supercar", research_basis: "Orange Track 2025 Fast & Furious Premium Mix 1" }),
  expansionFamily({ line: "Fast & Furious Premium", segment: "Mix 1", casting: "Nissan 370Z", colors: ["yellow", "silver", "black", "blue", "white"], decos: ["movie street livery", "clean", "tuner stripe", "side graphic", "premium deco"], aliases: ["370Z", "Nissan Z34", "Fast Furious 370Z"], base_condition: 13.5, culture_lane: "movie-jdm", research_basis: "Orange Track 2025 Fast & Furious Premium Mix 1" }),
  expansionFamily({ line: "Fast & Furious Premium", segment: "Mix 1", casting: "McLaren Senna", colors: ["orange", "gray", "black", "white", "blue"], decos: ["movie street livery", "clean", "track stripe", "side accent", "premium deco"], aliases: ["Senna", "McLaren hypercar", "Fast Furious Senna"], base_condition: 15.5, culture_lane: "movie-supercar", research_basis: "Orange Track 2025 Fast & Furious Premium Mix 1" }),
  expansionFamily({ line: "Fast & Furious Premium", segment: "Mix 2", casting: "'95 Mazda RX-7", colors: ["orange", "red", "black", "white", "silver"], decos: ["movie street livery", "clean", "tuner graphic", "side stripe", "premium deco"], aliases: ["Mazda RX7", "FD RX-7", "Fast Furious RX-7"], base_condition: 15.75, culture_lane: "movie-jdm", research_basis: "Orange Track 2025 Fast & Furious Premium Mix 2" }),
  expansionFamily({ line: "Fast & Furious Premium", segment: "Mix 2", casting: "Nissan Skyline GT-R BNR32", colors: ["silver", "black", "white", "blue", "red"], decos: ["movie street livery", "clean", "HKS style stripe", "side graphic", "premium deco"], aliases: ["R32 Skyline", "Skyline BNR32", "Nissan GT-R R32"], base_condition: 17.5, culture_lane: "movie-jdm", research_basis: "Orange Track 2025 Fast & Furious Premium Mix 2" }),
  expansionFamily({ line: "Fast & Furious Premium", segment: "Mix 2", casting: "'20 Dodge Charger Hellcat", colors: ["black", "gray", "red", "white", "orange"], decos: ["movie street livery", "clean", "muscle stripe", "side accent", "premium deco"], aliases: ["Charger Hellcat", "Dodge Hellcat", "Fast Furious Charger"], base_condition: 14.25, culture_lane: "movie-muscle", research_basis: "Orange Track 2025 Fast & Furious Premium Mix 2" }),
  expansionFamily({ line: "Fast & Furious Premium", segment: "Mix 2", casting: "Alfa Romeo Giulia Sprint GTA", colors: ["red", "white", "green", "silver", "black"], decos: ["movie street livery", "clean", "italian stripe", "race number", "premium deco"], aliases: ["Giulia Sprint GTA", "Alfa GTA", "Alfa Romeo Giulia"], base_condition: 12.75, culture_lane: "euro-classic", research_basis: "Orange Track 2025 Fast & Furious Premium Mix 2" }),
  expansionFamily({ line: "Fast & Furious Premium", segment: "Mix 2", casting: "'66 Chevy Impala", colors: ["black", "blue", "red", "white", "gold"], decos: ["movie street livery", "clean", "lowrider stripe", "side graphic", "premium deco"], aliases: ["Chevy Impala", "1966 Impala", "Fast Furious Impala"], base_condition: 12.75, culture_lane: "movie-muscle", research_basis: "Orange Track 2025 Fast & Furious Premium Mix 2" }),
  expansionFamily({ line: "Fast & Furious Premium", segment: "Mix 3", casting: "Nissan 240SX S14", colors: ["white", "silver", "black", "red", "blue"], decos: ["movie street livery", "clean", "drift graphic", "side stripe", "premium deco"], aliases: ["240SX", "Nissan S14", "Silvia S14"], base_condition: 15, culture_lane: "movie-jdm", research_basis: "Orange Track 2025 Fast & Furious Premium Mix 3" }),
  expansionFamily({ line: "Fast & Furious Premium", segment: "Mix 3", casting: "Koenigsegg CCXR", colors: ["silver", "white", "black", "orange", "blue"], decos: ["movie street livery", "clean", "track stripe", "side accent", "premium deco"], aliases: ["CCXR", "Koenigsegg", "Swedish hypercar"], base_condition: 16, culture_lane: "movie-supercar", research_basis: "Orange Track 2025 Fast & Furious Premium Mix 3" }),
  expansionFamily({ line: "Fast & Furious Premium", segment: "Mix 3", casting: "'21 Toyota GR Supra", colors: ["yellow", "red", "white", "black", "silver"], decos: ["movie street livery", "clean", "tuner stripe", "side graphic", "premium deco"], aliases: ["GR Supra", "A90 Supra", "Toyota Supra 2021"], base_condition: 16.5, culture_lane: "movie-jdm", research_basis: "Orange Track 2025 Fast & Furious Premium Mix 3" }),
  expansionFamily({ line: "Fast & Furious Premium", segment: "Mix 4", casting: "'93 Honda Civic Coupe EX EJ1", colors: ["green", "white", "black", "red", "silver"], decos: ["movie street livery", "clean", "tuner graphic", "side stripe", "premium deco"], aliases: ["Civic EJ1", "Honda Civic Coupe", "Fast Furious Civic"], base_condition: 14.75, culture_lane: "movie-jdm", research_basis: "Orange Track 2025 Fast & Furious Premium Mix 4" }),
  expansionFamily({ line: "Fast & Furious Premium", segment: "Mix 4", casting: "Mitsubishi Lancer Evolution IX", colors: ["red", "white", "silver", "blue", "black"], decos: ["movie street livery", "clean", "rally stripe", "side graphic", "premium deco"], aliases: ["Evo IX", "Lancer Evo 9", "Mitsubishi Evo IX"], base_condition: 14.5, culture_lane: "movie-jdm", research_basis: "Orange Track 2025 Fast & Furious Premium Mix 4" }),
  expansionFamily({ line: "Fast & Furious Premium", segment: "Mix 4", casting: "Porsche 911 Carrera RS 3.8", colors: ["white", "silver", "red", "black", "blue"], decos: ["movie street livery", "clean", "Carrera stripe", "side number", "premium deco"], aliases: ["Carrera RS 3.8", "Porsche 964 RS", "911 RS"], base_condition: 16.75, culture_lane: "porsche-demand", research_basis: "Orange Track 2025 Fast & Furious Premium Mix 4" }),
  expansionFamily({ line: "Fast & Furious Premium", segment: "Mix 4", casting: "Toyota Chaser JZX100", colors: ["white", "silver", "black", "red", "blue"], decos: ["movie street livery", "clean", "drift stripe", "side graphic", "premium deco"], aliases: ["Toyota Chaser", "JZX100", "Chaser drift"], base_condition: 15.75, culture_lane: "movie-jdm", research_basis: "Orange Track 2025 Fast & Furious Premium Mix 4" }),
  expansionFamily({ line: "Fast & Furious Premium", segment: "Mix 4", casting: "Lamborghini Gallardo LP 570-4 Superleggera", colors: ["green", "orange", "black", "white", "yellow"], decos: ["movie street livery", "clean", "italian stripe", "side accent", "premium deco"], aliases: ["Gallardo Superleggera", "Lamborghini Gallardo", "Lambo Gallardo"], base_condition: 15.25, culture_lane: "movie-supercar", research_basis: "Orange Track 2025 Fast & Furious Premium Mix 4" }),
  expansionFamily({ line: "Silver-Label Premium", segment: "Brian O'Conner", casting: "'95 Mitsubishi Eclipse", colors: ["green", "black", "silver", "white", "blue"], decos: ["Brian movie livery", "clean", "street graphic", "side stripe", "premium deco"], aliases: ["Mitsubishi Eclipse", "Brian Eclipse", "Fast Furious Eclipse"], base_condition: 14.75, culture_lane: "movie-jdm", research_basis: "Orange Track 2025 Silver-Label Fast & Furious Brian O'Conner" }),
  expansionFamily({ line: "Silver-Label Premium", segment: "Brian O'Conner", casting: "'70 Ford Escort RS1600", colors: ["blue", "white", "red", "black", "silver"], decos: ["Brian movie livery", "clean", "rally stripe", "side number", "premium deco"], aliases: ["Ford Escort RS1600", "Escort RS", "Fast Furious Escort"], base_condition: 13.5, culture_lane: "movie-rally", research_basis: "Orange Track 2025 Silver-Label Fast & Furious Brian O'Conner" }),
  expansionFamily({ line: "Silver-Label Premium", segment: "Racing Course", casting: "Honda Civic EG", colors: ["red", "white", "black", "blue", "yellow"], decos: ["racing course livery", "clean", "tuner stripe", "side graphic", "premium deco"], aliases: ["Civic EG", "Honda EG", "EG hatch"], base_condition: 13.75, culture_lane: "jdm-tuner", research_basis: "Orange Track 2025 Silver-Label Fast & Furious Racing Course" }),
  expansionFamily({ line: "Silver-Label Premium", segment: "Racing Course", casting: "'96 Acura Integra GSR", colors: ["white", "yellow", "black", "red", "silver"], decos: ["racing course livery", "clean", "tuner stripe", "side graphic", "premium deco"], aliases: ["Integra GSR", "Acura Integra", "Honda Integra"], base_condition: 14.25, culture_lane: "jdm-tuner", research_basis: "Orange Track 2025 Silver-Label Fast & Furious Racing Course" }),
  expansionFamily({ line: "Silver-Label Premium", segment: "Racing Course", casting: "Datsun 240Z Custom", colors: ["orange", "white", "red", "blue", "black"], decos: ["racing course livery", "clean", "BRE style stripe", "side graphic", "premium deco"], aliases: ["Datsun 240Z", "S30 Z", "Nissan 240Z"], base_condition: 15.5, culture_lane: "jdm-classic", research_basis: "Orange Track 2025 Silver-Label Fast & Furious Racing Course" }),
  expansionFamily({ line: "Silver-Label Premium", segment: "Racing Course", casting: "Bugatti Veyron", colors: ["blue", "black", "white", "silver", "red"], decos: ["racing course livery", "clean", "two-tone", "side accent", "premium deco"], aliases: ["Veyron", "Bugatti", "Bugatti hypercar"], base_condition: 16, culture_lane: "supercar", research_basis: "Orange Track 2025 Silver-Label Fast & Furious Racing Course" }),
  expansionFamily({ line: "Silver-Label Premium", segment: "Graphic Remix", casting: "Volkswagen Jetta MK3", colors: ["white", "black", "red", "silver", "blue"], decos: ["graphic remix livery", "clean", "euro stripe", "side graphic", "premium deco"], aliases: ["Jetta MK3", "Volkswagen Jetta", "VW Jetta"], base_condition: 12.75, culture_lane: "movie-euro", research_basis: "Orange Track 2025 Silver-Label Fast & Furious Graphic Remix" }),
  expansionFamily({ line: "Silver-Label Premium", segment: "Graphic Remix", casting: "Custom Acura Integra Sedan GSR", colors: ["blue", "white", "black", "red", "silver"], decos: ["graphic remix livery", "clean", "tuner stripe", "side graphic", "premium deco"], aliases: ["Acura Integra Sedan", "Integra Sedan GSR", "Custom Integra"], base_condition: 13.75, culture_lane: "jdm-tuner", research_basis: "Orange Track 2025 Silver-Label Fast & Furious Graphic Remix" }),
  expansionFamily({ line: "Vintage Racing Club", segment: "National Icons", casting: "Ford GT-40", colors: ["blue", "white", "red", "black", "silver"], decos: ["national icon livery", "clean", "race number", "heritage stripe", "premium deco"], aliases: ["GT40", "Ford GT40", "Ford GT-40"], base_condition: 12.5, culture_lane: "vintage-racing", research_basis: "Orange Track 2025 Vintage Racing Club National Icons" }),
  expansionFamily({ line: "Vintage Racing Club", segment: "National Icons", casting: "Jaguar Lightweight E-Type", colors: ["green", "silver", "white", "red", "blue"], decos: ["national icon livery", "clean", "racing stripe", "side number", "premium deco"], aliases: ["Lightweight E-Type", "Jaguar E-Type", "Jaguar race car"], base_condition: 12, culture_lane: "vintage-racing", research_basis: "Orange Track 2025 Vintage Racing Club National Icons" }),
  expansionFamily({ line: "Vintage Racing Club", segment: "National Icons", casting: "'71 Nissan Skyline HT 2000 GT-R", colors: ["silver", "white", "red", "blue", "black"], decos: ["national icon livery", "clean", "hakosuka stripe", "side number", "premium deco"], aliases: ["Hakosuka Skyline", "Skyline 2000 GT-R", "KPGC10"], base_condition: 17.25, culture_lane: "jdm-classic", research_basis: "Orange Track 2025 Vintage Racing Club National Icons" }),
  expansionFamily({ line: "Vintage Racing Club", segment: "National Icons", casting: "'67 Porsche 911 R", colors: ["white", "red", "silver", "black", "blue"], decos: ["national icon livery", "clean", "racing stripe", "side number", "premium deco"], aliases: ["Porsche 911 R", "1967 Porsche", "911R"], base_condition: 16.25, culture_lane: "porsche-demand", research_basis: "Orange Track 2025 Vintage Racing Club National Icons" }),
  expansionFamily({ line: "Automotive", segment: "90s Street Scene", casting: "'96 Nissan 180SX Type X", colors: ["black", "white", "red", "silver", "blue"], decos: ["90s street livery", "clean", "drift stripe", "side graphic", "premium deco"], aliases: ["Nissan 180SX", "180SX Type X", "S13 hatch"], base_condition: 14.75, culture_lane: "jdm-tuner", research_basis: "Orange Track 2025 Automotive 90s Street Scene" }),
  expansionFamily({ line: "Automotive", segment: "90s Street Scene", casting: "Mitsubishi Lancer Evolution VI", colors: ["white", "red", "silver", "blue", "black"], decos: ["90s street livery", "clean", "rally stripe", "side graphic", "premium deco"], aliases: ["Evo VI", "Lancer Evo 6", "Mitsubishi Evo VI"], base_condition: 13.75, culture_lane: "jdm-rally", research_basis: "Orange Track 2025 Automotive 90s Street Scene" }),
  expansionFamily({ line: "Automotive", segment: "90s Street Scene", casting: "'95 Toyota Celica GT-Four", colors: ["white", "red", "black", "blue", "silver"], decos: ["90s street livery", "clean", "rally stripe", "side graphic", "premium deco"], aliases: ["Celica GT-Four", "Toyota Celica ST205", "Celica rally"], base_condition: 13.75, culture_lane: "jdm-rally", research_basis: "Orange Track 2025 Automotive 90s Street Scene" }),
  expansionFamily({ line: "Automotive", segment: "Tooned Gulf", casting: "Tooned '94 Toyota Supra", colors: ["blue", "orange", "white", "black", "red"], decos: ["Gulf inspired livery", "clean", "tooned graphic", "side stripe", "premium deco"], aliases: ["Tooned Supra", "Toyota Supra tooned", "Tooned 94 Supra"], base_condition: 10.75, culture_lane: "tooned-jdm", research_basis: "Orange Track 2025 Automotive Tooned Gulf" }),
  expansionFamily({ line: "Automotive", segment: "Toyota Trucks", casting: "'10 Toyota Tundra", colors: ["red", "white", "black", "blue", "silver"], decos: ["truck graphic", "clean", "off-road stripe", "side accent", "premium deco"], aliases: ["Toyota Tundra", "2010 Tundra", "Tundra truck"], base_condition: 11.75, culture_lane: "truck-overland", research_basis: "Orange Track 2025 Automotive Toyota Trucks" }),
  expansionFamily({ line: "Automotive", segment: "Toyota Trucks", casting: "'20 Toyota Tacoma", colors: ["blue", "white", "black", "red", "tan"], decos: ["truck graphic", "clean", "off-road stripe", "overland livery", "premium deco"], aliases: ["Toyota Tacoma", "Tacoma truck", "2020 Tacoma"], base_condition: 12.25, culture_lane: "truck-overland", research_basis: "Orange Track 2025 Automotive Toyota Trucks" }),
  expansionFamily({ line: "Automotive", segment: "Toyota Trucks", casting: "Toyota Land Cruiser 80", colors: ["white", "tan", "green", "black", "red"], decos: ["truck graphic", "clean", "expedition stripe", "overland livery", "premium deco"], aliases: ["Land Cruiser 80", "Toyota 80 Series", "80 Series Land Cruiser"], base_condition: 13.5, culture_lane: "truck-overland", research_basis: "Orange Track 2025 Automotive Toyota Trucks" }),
  expansionFamily({ line: "Automotive", segment: "Toyota Trucks", casting: "Toyota Off-Road Truck", colors: ["yellow", "white", "red", "black", "blue"], decos: ["truck graphic", "clean", "off-road stripe", "desert livery", "premium deco"], aliases: ["Toyota Off Road Truck", "Toyota pickup", "Toyota 4x4 truck"], base_condition: 12.75, culture_lane: "truck-overland", research_basis: "Orange Track 2025 Automotive Toyota Trucks" }),
  expansionFamily({ line: "Automotive", segment: "Hybrid Speed", casting: "'17 Acura NSX", colors: ["red", "white", "black", "silver", "blue"], decos: ["hybrid speed livery", "clean", "track stripe", "side accent", "premium deco"], aliases: ["Acura NSX 2017", "Honda NSX NC1", "modern NSX"], base_condition: 14.5, culture_lane: "jdm-supercar", research_basis: "Orange Track 2025 Automotive Hybrid Speed" }),
  expansionFamily({ line: "Celebrations", segment: "Mustang 60 Years", casting: "'84 Ford Mustang SVO", colors: ["silver", "red", "black", "white", "blue"], decos: ["anniversary livery", "clean", "SVO stripe", "side graphic", "collector deco"], aliases: ["Mustang SVO", "Ford SVO", "1984 Mustang"], base_condition: 9.5, culture_lane: "mustang-anniversary", research_basis: "Orange Track 2025 Celebrations Mustang 60 Years" }),
  expansionFamily({ line: "Celebrations", segment: "Mustang 60 Years", casting: "'69 Ford Mustang Boss 302", colors: ["yellow", "orange", "black", "blue", "white"], decos: ["anniversary livery", "boss stripe", "clean", "side graphic", "collector deco"], aliases: ["Boss 302", "Mustang Boss", "1969 Mustang"], base_condition: 10.5, culture_lane: "mustang-anniversary", research_basis: "Orange Track 2025 Celebrations Mustang 60 Years" }),
  expansionFamily({ line: "Celebrations", segment: "BMW M Series", casting: "BMW M1", colors: ["white", "blue", "red", "black", "silver"], decos: ["M stripe", "clean", "procar livery", "side number", "collector deco"], aliases: ["M1 Procar", "BMW M1", "BMW supercar"], base_condition: 12.75, culture_lane: "euro-performance", research_basis: "Orange Track 2025 Celebrations BMW M Series" }),
  expansionFamily({ line: "Celebrations", segment: "BMW M Series", casting: "'16 BMW M2", colors: ["blue", "white", "black", "silver", "red"], decos: ["M stripe", "clean", "track accent", "side graphic", "collector deco"], aliases: ["BMW M2", "M2 coupe", "F87 M2"], base_condition: 11.75, culture_lane: "euro-performance", research_basis: "Orange Track 2025 Celebrations BMW M Series" }),
  expansionFamily({ line: "Celebrations", segment: "BMW M Series", casting: "BMW M4", colors: ["blue", "white", "black", "silver", "yellow"], decos: ["M stripe", "clean", "track accent", "side graphic", "collector deco"], aliases: ["M4", "BMW coupe", "BMW M car"], base_condition: 11.75, culture_lane: "euro-performance", research_basis: "Orange Track 2025 Celebrations BMW M Series" }),
  expansionFamily({ line: "Neon Speeders", segment: "Mix 1", casting: "Nissan Silvia S13", country: "Malaysia", colors: ["green", "pink", "black", "blue", "white"], decos: ["neon livery", "clean", "drift graphic", "side stripe", "neon deco"], wheel_type: "10SP", base: "plastic black", aliases: ["Silvia S13", "Nissan S13", "S13 drift"], base_condition: 8.25, culture_lane: "jdm-tuner", research_basis: "Orange Track 2025 Neon Speeders Mix 1" }),
  expansionFamily({ line: "Retro", segment: "The Hot Ones", casting: "Porsche 917 LH", colors: ["white", "red", "silver", "black", "blue"], decos: ["hot ones livery", "clean", "endurance stripe", "side number", "retro deco"], aliases: ["Porsche 917", "917 LH", "Porsche long tail"], base_condition: 12.25, culture_lane: "vintage-racing", research_basis: "Orange Track 2025 Retro The Hot Ones" }),
  expansionFamily({ line: "Track Tested", segment: "Recent Speed Signals", casting: "Custom Corvette Stingray Coupe", colors: ["red", "blue", "white", "black", "silver"], decos: ["women of fast livery", "clean", "track stripe", "side number", "speed test deco"], aliases: ["Corvette Stingray Coupe", "Custom Corvette", "Women of Fast Corvette"], base_condition: 13.25, culture_lane: "race-interest", research_basis: "DiecastRacer recent-release 5-Star speed signal" }),
  expansionFamily({ line: "Track Tested", segment: "Recent Speed Signals", casting: "Hi-Roller II", country: "Malaysia", colors: ["green", "blue", "red", "black", "yellow"], decos: ["mainline livery", "clean", "speed graphic", "side stripe", "track deco"], wheel_type: "10SP", base: "plastic black", aliases: ["Hi Roller II", "Hi-Roller 2", "Hot Wheels Hi-Roller"], base_condition: 6.5, culture_lane: "race-interest", research_basis: "DiecastRacer recent-release mainline speed signal" }),
  expansionFamily({ line: "Premium 1:64", segment: "Kaido House", casting: "Datsun 510 Pro Street", brand: "MINI GT", country: "China", card_regions: ["US"], colors: ["red", "blue", "white", "black", "purple"], decos: ["kaido livery", "clean", "street tuner graphic", "side stripe", "limited deco"], aliases: ["Kaido House 510", "Datsun 510 Pro Street", "MINI GT Datsun"], base_condition: 18, culture_lane: "premium-jdm", research_basis: "premium 1:64 collector demand lane" }),
  expansionFamily({ line: "HOBBY64", segment: "Racing/Tuner", casting: "Toyota Supra A90", brand: "Tarmac Works", country: "China", card_regions: ["US"], colors: ["white", "red", "black", "yellow", "silver"], decos: ["racing livery", "clean", "tuner stripe", "side graphic", "display deco"], aliases: ["A90 Supra", "Tarmac Supra", "Toyota GR Supra"], base_condition: 17, culture_lane: "premium-jdm", research_basis: "premium 1:64 collector demand lane" }),
  expansionFamily({ line: "INNO64", segment: "JDM Tuners", casting: "Honda Civic EF9", brand: "INNO64", country: "China", card_regions: ["US"], colors: ["white", "red", "black", "yellow", "blue"], decos: ["racing livery", "clean", "kanjo stripe", "side graphic", "display deco"], aliases: ["Civic EF9", "Honda Civic EF", "INNO64 Civic"], base_condition: 18.5, culture_lane: "premium-jdm", research_basis: "premium 1:64 collector demand lane" })
];

if (EXPANSION_FAMILY_TEMPLATES.length !== 50) {
  throw new Error(`Expected 50 expansion families, found ${EXPANSION_FAMILY_TEMPLATES.length}`);
}

const REFERENCE_EXPANSION_SOURCE = "grailpulse-reference-expansion-2026-06-18";
const REFERENCE_EXPANSION_BASIS = "GrailPulse collector-category coverage; exact retail release requires verification";

const REFERENCE_FAMILY_TEMPLATES = [
  expansionFamily({ brand: "Matchbox", year_release: "Reference", line: "Collector Reference", segment: "Utility Realism", casting: "Mercedes-Benz Unimog U1300", country: "Thailand", colors: ["orange", "green", "white", "red", "blue"], decos: ["expedition utility", "clean", "rescue livery", "service stripe", "off-road graphic"], wheel_type: "realistic utility", base: "plastic black", aliases: ["Unimog U1300", "Mercedes Unimog", "Unimog utility truck"], base_condition: 8.5, culture_lane: "matchbox-utility", research_basis: REFERENCE_EXPANSION_BASIS, seed_source: REFERENCE_EXPANSION_SOURCE, allow_chase: false }),
  expansionFamily({ brand: "Matchbox", year_release: "Reference", line: "Collector Reference", segment: "Modern 4x4", casting: "Ford Bronco 4-Door", country: "Thailand", colors: ["area 51 blue", "orange", "white", "black", "red"], decos: ["trail graphic", "clean", "expedition stripe", "park service", "off-road accent"], wheel_type: "realistic utility", base: "plastic black", aliases: ["Ford Bronco", "Bronco 4 Door", "modern Bronco"], base_condition: 8, culture_lane: "matchbox-realism", research_basis: REFERENCE_EXPANSION_BASIS, seed_source: REFERENCE_EXPANSION_SOURCE, allow_chase: false }),
  expansionFamily({ year_release: "Reference", line: "Collector Reference", segment: "Kei Icons", casting: "Mazda Autozam AZ-1", country: "Malaysia", colors: ["red", "blue", "white", "silver", "black"], decos: ["clean", "kei sport stripe", "track graphic", "period accent", "collector deco"], wheel_type: "10SP", base: "plastic black", aliases: ["Autozam AZ-1", "Mazda AZ-1", "AZ1 kei car"], base_condition: 9.5, culture_lane: "jdm-kei", research_basis: REFERENCE_EXPANSION_BASIS, seed_source: REFERENCE_EXPANSION_SOURCE, allow_chase: false }),
  expansionFamily({ year_release: "Reference", line: "Collector Reference", segment: "JDM Wagons", casting: "Nissan Stagea RS Four V", colors: ["silver", "white", "black", "blue", "red"], decos: ["clean", "touring stripe", "wagon side graphic", "street livery", "collector deco"], aliases: ["Nissan Stagea", "Stagea RS Four", "WC34 Stagea"], base_condition: 12.5, culture_lane: "jdm-wagon", research_basis: REFERENCE_EXPANSION_BASIS, seed_source: REFERENCE_EXPANSION_SOURCE, allow_chase: false }),
  expansionFamily({ year_release: "Reference", line: "Collector Reference", segment: "Euro Classics", casting: "Porsche 944 Turbo", colors: ["red", "white", "black", "silver", "blue"], decos: ["clean", "turbo side script", "track stripe", "period racing graphic", "collector deco"], aliases: ["Porsche 944", "944 Turbo", "Porsche transaxle"], base_condition: 12, culture_lane: "porsche-classic", research_basis: REFERENCE_EXPANSION_BASIS, seed_source: REFERENCE_EXPANSION_SOURCE, allow_chase: false }),
  expansionFamily({ year_release: "Reference", line: "Collector Reference", segment: "Rally Icons", casting: "Ford Escort RS Cosworth", colors: ["blue", "white", "black", "red", "silver"], decos: ["rally livery", "clean", "heritage stripe", "side number", "collector deco"], aliases: ["Escort Cosworth", "Ford RS Cosworth", "Escort Cossie"], base_condition: 12.5, culture_lane: "euro-rally", research_basis: REFERENCE_EXPANSION_BASIS, seed_source: REFERENCE_EXPANSION_SOURCE, allow_chase: false }),
  expansionFamily({ year_release: "Reference", line: "Collector Reference", segment: "American Muscle", casting: "Chevrolet Monte Carlo SS", colors: ["black", "burgundy", "white", "blue", "silver"], decos: ["clean", "aero stripe", "stock-car graphic", "side accent", "collector deco"], aliases: ["Monte Carlo SS", "Chevy Monte Carlo", "G-body Monte Carlo"], base_condition: 9.5, culture_lane: "american-muscle", research_basis: REFERENCE_EXPANSION_BASIS, seed_source: REFERENCE_EXPANSION_SOURCE, allow_chase: false }),
  expansionFamily({ year_release: "Reference", line: "Collector Reference", segment: "4x4 Utility", casting: "Jeep Cherokee XJ", colors: ["green", "white", "red", "black", "tan"], decos: ["clean", "trail stripe", "forest service", "off-road graphic", "expedition deco"], aliases: ["Cherokee XJ", "Jeep XJ", "Jeep Cherokee"], base_condition: 9, culture_lane: "truck-overland", research_basis: REFERENCE_EXPANSION_BASIS, seed_source: REFERENCE_EXPANSION_SOURCE, allow_chase: false }),
  expansionFamily({ brand: "MINI GT", year_release: "Reference", line: "Premium Reference", segment: "JDM Icons", casting: "Nissan Skyline GT-R R33", country: "China", card_regions: ["US"], colors: ["midnight purple", "white", "silver", "blue", "black"], decos: ["clean", "Nismo stripe", "touring livery", "street tuner graphic", "display deco"], aliases: ["Skyline R33", "GT-R R33", "Nissan BNR33"], base_condition: 18, culture_lane: "premium-jdm", research_basis: REFERENCE_EXPANSION_BASIS, seed_source: REFERENCE_EXPANSION_SOURCE, allow_chase: false }),
  expansionFamily({ brand: "Tarmac Works", year_release: "Reference", line: "Premium Reference", segment: "GT Racing", casting: "Porsche 911 GT3 R", country: "China", card_regions: ["US"], colors: ["white", "red", "black", "silver", "blue"], decos: ["GT racing livery", "clean", "endurance stripe", "side number", "display deco"], aliases: ["911 GT3 R", "Porsche GT3 R", "GT3 race car"], base_condition: 19, culture_lane: "premium-motorsport", research_basis: REFERENCE_EXPANSION_BASIS, seed_source: REFERENCE_EXPANSION_SOURCE, allow_chase: false }),
  expansionFamily({ brand: "INNO64", year_release: "Reference", line: "Premium Reference", segment: "JDM Sedans", casting: "Toyota Chaser JZX100", country: "China", card_regions: ["US"], colors: ["white", "silver", "black", "red", "green"], decos: ["clean", "drift livery", "street stripe", "tuner graphic", "display deco"], aliases: ["Toyota Chaser", "JZX100 Chaser", "Chaser drift sedan"], base_condition: 18.5, culture_lane: "premium-jdm", research_basis: REFERENCE_EXPANSION_BASIS, seed_source: REFERENCE_EXPANSION_SOURCE, allow_chase: false }),
  expansionFamily({ brand: "Pop Race", year_release: "Reference", line: "Premium Reference", segment: "JDM Icons", casting: "Honda Civic Type R EK9", country: "China", card_regions: ["US"], colors: ["championship white", "yellow", "black", "red", "silver"], decos: ["clean", "Type R stripe", "kanjo livery", "track graphic", "display deco"], aliases: ["Civic EK9", "Honda EK9", "Civic Type R"], base_condition: 18, culture_lane: "premium-jdm", research_basis: REFERENCE_EXPANSION_BASIS, seed_source: REFERENCE_EXPANSION_SOURCE, allow_chase: false }),
  expansionFamily({ brand: "Auto World", year_release: "Reference", line: "Premium Reference", segment: "American Performance", casting: "Buick Grand National", country: "China", card_regions: ["US"], colors: ["black", "dark gray", "white", "burgundy", "silver"], decos: ["clean", "turbo-6 badge", "street stripe", "drag graphic", "display deco"], aliases: ["Grand National", "Buick GN", "G-body Buick"], base_condition: 16, culture_lane: "premium-american", research_basis: REFERENCE_EXPANSION_BASIS, seed_source: REFERENCE_EXPANSION_SOURCE, allow_chase: false })
];

if (REFERENCE_FAMILY_TEMPLATES.length !== 13) {
  throw new Error(`Expected 13 reference expansion families, found ${REFERENCE_FAMILY_TEMPLATES.length}`);
}

const KEY_FIELDS = [
  "brand",
  "year_release",
  "line",
  "segment",
  "mix",
  "series_number",
  "casting",
  "color",
  "deco",
  "wheel_type",
  "base",
  "country",
  "card_region",
  "chase_type"
];

function slugify(input) {
  return String(input ?? "")
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function tokenize(input) {
  return String(input ?? "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .split(/\s+/)
    .filter(Boolean);
}

function unique(values) {
  return [...new Set(values.filter(Boolean))];
}

function seriesNumber(index, total) {
  return `${String(index + 1).padStart(3, "0")}/${String(total).padStart(3, "0")}`;
}

function mixCode(index) {
  let n = index + 1;
  let out = "";
  while (n > 0) {
    n -= 1;
    out = String.fromCharCode(65 + (n % 26)) + out;
    n = Math.floor(n / 26);
  }
  return out;
}

function buildConditionValues(base, variantIndex, familyIndex) {
  const drift = (variantIndex % 5) * 0.35 + Math.floor(variantIndex / 10) * 0.25 + familyIndex * 0.1;
  const carded = Number((base + drift).toFixed(2));
  return {
    loose: Number((carded * 0.72).toFixed(2)),
    mint_loose: Number((carded * 0.86).toFixed(2)),
    carded,
    momc: Number((carded * 1.18).toFixed(2)),
    damaged_card: Number((carded * 0.9).toFixed(2))
  };
}

function expandPopularFamilies() {
  const generated = [];
  const familyTemplates = [...POPULAR_FAMILY_TEMPLATES, ...EXPANSION_FAMILY_TEMPLATES, ...REFERENCE_FAMILY_TEMPLATES];
  for (let familyIndex = 0; familyIndex < familyTemplates.length; familyIndex++) {
    const family = familyTemplates[familyIndex];
    const total = POPULAR_FAMILY_COUNT;
    for (let variantIndex = 0; variantIndex < total; variantIndex++) {
      const color = family.colors[variantIndex % family.colors.length];
      const deco = family.decos[Math.floor(variantIndex / family.colors.length) % family.decos.length];
      const card_region = family.card_regions[variantIndex % family.card_regions.length];
      const isChase = variantIndex === total - 1 && family.brand === "Hot Wheels" && family.allow_chase !== false;
      const chase_type = isChase ? "Super Treasure Hunt" : family.chase_type;
      const wheel_type = family.wheel_type;
      const base = family.base;
      const series_num = seriesNumber(variantIndex, total);
      const mix = mixCode(variantIndex);
      const year_release = family.year_release;
      const record = {
        brand: family.brand,
        year_release,
        line: family.line,
        segment: family.segment,
        mix,
        series_number: series_num,
        casting: family.casting,
        color: isChase ? "spectraflame " + color : color,
        deco: isChase ? "special chase deco" : deco,
        wheel_type: isChase ? "Real Riders" : wheel_type,
        base: isChase ? "metal" : base,
        country: family.country,
        card_region,
        scale: family.scale,
        chase_type,
        aliases: unique([
          ...family.aliases,
          `${family.casting} ${color}`,
          `${family.casting} ${card_region}`
        ]),
        condition_values: buildConditionValues(family.base_condition, variantIndex, familyIndex),
        pricing_quality: "seed",
        verify_status: "phase0_seed",
        seed_family: `${family.brand}::${family.line}::${family.casting}`,
        seed_source: family.seed_source || "popular-template",
        ...(family.culture_lane ? { culture_lane: family.culture_lane } : {}),
        ...(family.research_basis ? { research_basis: family.research_basis } : {})
      };
      generated.push(record);
    }
  }
  return generated;
}

function identityKey(row) {
  return KEY_FIELDS.map((field) => slugify(row[field] || "na")).join("_");
}

function titleFor(row) {
  return [
    row.year_release,
    row.brand,
    row.line,
    row.segment,
    row.casting,
    row.color,
    row.chase_type && row.chase_type !== "none" ? row.chase_type : "",
    row.card_region === "US" ? "" : row.card_region
  ].filter(Boolean).join(" ");
}

function build() {
  const source = JSON.parse(readFileSync(sourcePath, "utf8"));
  const photoMap = existsSync(photoMapPath) ? JSON.parse(readFileSync(photoMapPath, "utf8")) : {};
  const ownerPhotoMap = existsSync(ownerPhotoMapPath) ? JSON.parse(readFileSync(ownerPhotoMapPath, "utf8")) : {};
  const soldCompPayload = existsSync(soldCompSummariesPath)
    ? JSON.parse(readFileSync(soldCompSummariesPath, "utf8"))
    : { meta: {}, records: {} };
  const soldCompRecords = soldCompPayload.records || {};
  const minimumCompSample = Number(soldCompPayload.meta?.minimum_condition_sample || 3);
  const ids = new Set();
  let compBackedRecords = 0;
  let ownerPhotoRecords = 0;
  const records = [
    ...source.records,
    ...expandPopularFamilies()
  ].map((row) => {
    const diecast_id = identityKey(row);
    if (ids.has(diecast_id)) {
      throw new Error(`Duplicate diecast_id generated: ${diecast_id}`);
    }
    ids.add(diecast_id);
    const {
      seed_family: _seedFamily,
      seed_source: _seedSource,
      research_basis: _researchBasis,
      ...publicRow
    } = row;
    const marketplacePhotoMetadata = photoMap[diecast_id]
      ? {
          ...photoMap[diecast_id],
          ...(photoMap[diecast_id].photo_source === "mercari-scrape"
            ? { photo_source: "mercari-marketplace" }
            : {})
        }
      : {};
    const ownerPhotoMetadata = ownerPhotoMap[diecast_id] || {};
    if (ownerPhotoMetadata.photo_url) ownerPhotoRecords += 1;
    const photoMetadata = {
      ...marketplacePhotoMetadata,
      ...ownerPhotoMetadata
    };

    const soldCompSummary = soldCompRecords[diecast_id];
    const compConditions = soldCompSummary?.conditions || {};
    const compBackedConditions = Object.entries(compConditions)
      .filter(([, summary]) => Number(summary?.count || 0) >= minimumCompSample && Number.isFinite(Number(summary?.median_total)))
      .map(([condition]) => condition);
    const effectiveConditionValues = { ...(row.condition_values || {}) };
    for (const condition of compBackedConditions) {
      effectiveConditionValues[condition] = Number(compConditions[condition].median_total);
    }
    const effectivePricingQuality = compBackedConditions.length
      ? (compBackedConditions.length === Object.keys(effectiveConditionValues).length ? "sold_comps" : "sold_comps_partial")
      : row.pricing_quality;
    const effectiveVerifyStatus = compBackedConditions.length ? "comp_backed" : row.verify_status;
    if (compBackedConditions.length) compBackedRecords += 1;

    const searchable = unique([
      titleFor(row),
      row.casting,
      row.brand,
      row.line,
      row.segment,
      row.color,
      row.deco,
      row.wheel_type,
      row.chase_type,
      ...(row.aliases || [])
    ]);

    return {
      diecast_id,
      identity_key_fields: KEY_FIELDS,
      ...publicRow,
      condition_values: effectiveConditionValues,
      pricing_quality: effectivePricingQuality,
      verify_status: effectiveVerifyStatus,
      title: titleFor(row),
      ...photoMetadata,
      ...(compBackedConditions.length
        ? {
            sold_comp_summary: soldCompSummary,
            comp_backed_conditions: compBackedConditions
          }
        : {}),
      searchable,
      conditions: Object.keys(effectiveConditionValues),
      flags: unique([
        effectivePricingQuality === "seed" ? "seed_price" : "",
        effectivePricingQuality === "sold_comps_partial" ? "partial_comp_coverage" : "",
        effectivePricingQuality === "sold_comps" ? "sold_comp_backed" : "",
        effectiveVerifyStatus === "phase0_seed" ? "needs_adversarial_verify" : ""
      ])
    };
  });

  const token_index = {};
  for (const record of records) {
    const tokens = unique(tokenize([
      record.title,
      record.searchable.join(" "),
      record.series_number,
      record.country,
      record.card_region
    ].join(" ")));
    for (const token of tokens) {
      token_index[token] ||= [];
      token_index[token].push(record.diecast_id);
    }
  }

  for (const key of Object.keys(token_index)) {
    token_index[key] = unique(token_index[key]).sort();
  }

  const generated_at = new Date().toISOString();
  const payload = {
    meta: {
      name: "GrailPulse Die Cast KB",
      schema_version: source.meta.version,
      generated_at,
      total_records: records.length,
      identity_key_fields: KEY_FIELDS,
      pricing_mode: compBackedRecords ? "mixed_seed_and_sold_comps" : source.meta.pricing_mode,
      comp_backed_records: compBackedRecords,
      owner_photo_records: ownerPhotoRecords
    },
    records
  };

  const index = {
    meta: {
      generated_at,
      token_count: Object.keys(token_index).length
    },
    token_index
  };

  mkdirSync(generatedDir, { recursive: true });
  mkdirSync(exportDir, { recursive: true });
  writeFileSync(resolve(generatedDir, "kb-diecast.json"), JSON.stringify(payload, null, 2));
  writeFileSync(resolve(generatedDir, "kb-index.json"), JSON.stringify(index, null, 2));
  writeFileSync(resolve(exportDir, "grailpulse-diecast.json"), JSON.stringify({ ...payload, index }, null, 2));
  console.log(`Generated ${records.length} diecast records.`);
}

build();
