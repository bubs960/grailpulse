/**
 * coin-history.ts — historical context library for coin pages
 *
 * Three layers:
 *   1. ERAS — broad historical periods (Pittman Act, WWII silver removal, etc.)
 *      Written once, referenced by many series.
 *   2. SERIES_CONTEXT — per-series facts (designer, years, significance)
 *      One entry per series, covers all coins in it.
 *   3. COIN_NOTES — specific notes for individual coins (key dates, errors)
 *      Optional; only the most notable coins get entries.
 *
 * Coverage is intentionally incomplete — the page falls back to a clean
 * "research in progress" placeholder for series we haven't written yet.
 * Adding context to a series only requires appending to the relevant map.
 */

export interface Era {
  id: string
  label: string
  range: string
  copy: string
}

export interface SeriesContext {
  designer?: string
  yearsStruck?: string
  significance: string
  eras?: string[]    // era ids
}

export interface CoinNote {
  note: string
}

// ── ERAS ─────────────────────────────────────────────────────────────────────

export const ERAS: Record<string, Era> = {
  'pittman-act': {
    id: 'pittman-act',
    label: 'The Pittman Act Revival',
    range: '1918–1921',
    copy: '1921 marked the end of an era. The Morgan Dollar program, dormant since 1904, was briefly revived under the Pittman Act — a Congressional mandate to recoin 270 million melted silver dollars. December 1921 brought the Peace Dollar. The Morgan was done.',
  },
  'silver-removal-1965': {
    id: 'silver-removal-1965',
    label: 'The Silver Coinage Act',
    range: '1964–1965',
    copy: 'The Coinage Act of 1965 stripped silver from the dime and quarter entirely and reduced the half dollar to 40% silver. Skyrocketing silver prices and the strain on US silver reserves forced the change. 1964 was the last full-silver year for circulating US coinage — collectors mark the year as the modern silver cutoff.',
  },
  'wwii-composition': {
    id: 'wwii-composition',
    label: 'Wartime Composition Changes',
    range: '1942–1946',
    copy: 'WWII forced metal substitutions. The nickel was rebalanced as 35% silver to free up nickel for armor (1942–1945). The cent went to zinc-coated steel in 1943, then shell-case brass 1944–1946 as recycled artillery brass came back from Europe. Each year tells a piece of the war effort.',
  },
  'peace-dollar-era': {
    id: 'peace-dollar-era',
    label: 'Post-WWI Peace',
    range: '1921–1935',
    copy: 'Authorized to commemorate peace after the First World War, the Peace Dollar replaced the Morgan in late 1921. Anthony de Francisci\'s design depicts Liberty in profile with a softer, more modern aesthetic than the Victorian Morgan. Struck intermittently through 1935, then dormant until a one-year 2021 centennial revival.',
  },
  'jfk-memorial': {
    id: 'jfk-memorial',
    label: 'The Kennedy Memorial',
    range: '1964–present',
    copy: 'Authorized just weeks after the assassination, the Kennedy Half Dollar entered circulation in March 1964. Public demand was so intense that mintage was unlimited that first year — every Kennedy half struck in 1964 is 90% silver. Hoarding pulled most from circulation within months. The denomination has barely circulated since.',
  },
  'lincoln-centennial': {
    id: 'lincoln-centennial',
    label: 'Lincoln Centennial',
    range: '1909',
    copy: 'The Lincoln cent was the first US coin to feature a real historical figure, struck for the centennial of Lincoln\'s birth. Designer Victor David Brenner placed his initials (V.D.B.) prominently on the reverse — the public uproar over the placement led to their removal mid-year 1909, then quiet reinstatement on the obverse in 1918.',
  },
  'classic-commemoratives': {
    id: 'classic-commemoratives',
    label: 'The Classic Commemorative Era',
    range: '1892–1954',
    copy: 'The first US commemorative coin — the 1892 Columbian Half — set a template Congress used for half a century. Cities, anniversaries, expositions, and historical figures all received their own coin. The program ended in 1954 amid mintage abuses, but resumed in modern form in 1982.',
  },
  'silver-eagle-bullion': {
    id: 'silver-eagle-bullion',
    label: 'The Modern Bullion Program',
    range: '1986–present',
    copy: 'The American Silver Eagle launched in 1986 under the Liberty Coin Act, partly to draw down the Defense National Stockpile of silver. Adolph Weinman\'s Walking Liberty design from 1916 was reused for the obverse — making it the most-struck reuse of a classic American design. The series shifted to a new reverse (Type 2) mid-2021.',
  },
  'mercury-end': {
    id: 'mercury-end',
    label: 'End of the Mercury Dime',
    range: '1945–1946',
    copy: 'Adolph Weinman\'s Mercury Dime (technically Winged Liberty) closed in 1945 after a 29-year run. The Roosevelt Dime replaced it in 1946 as a memorial after FDR\'s death — a direct successor decision driven by Roosevelt\'s March of Dimes polio campaign.',
  },
}

// ── SERIES CONTEXT ───────────────────────────────────────────────────────────

export const SERIES_CONTEXT: Record<string, SeriesContext> = {
  'morgan': {
    designer: 'George T. Morgan',
    yearsStruck: '1878–1904, 1921',
    significance: 'The Morgan Dollar is the iconic American silver dollar — struck by every active mint of the era (Philadelphia, New Orleans, Carson City, San Francisco, Denver in 1921 only). George Morgan\'s Liberty design, modeled after Anna Willess Williams, became the visual shorthand for "silver dollar" in American culture.',
    eras: ['pittman-act'],
  },
  'peace-dollar': {
    designer: 'Anthony de Francisci',
    yearsStruck: '1921–1928, 1934–1935',
    significance: 'Authorized to commemorate the end of the First World War, the Peace Dollar succeeded the Morgan. The 1921 first-year strike used a high-relief die that was lowered in 1922 for production durability. The series ended in 1935; a controversial 1964-D run was struck but never released and almost certainly all melted.',
    eras: ['peace-dollar-era'],
  },
  'lincoln-wheat': {
    designer: 'Victor David Brenner',
    yearsStruck: '1909–1958',
    significance: 'The first US circulating coin to depict a real person. Brenner\'s portrait of Lincoln has been continuously used since 1909 — the longest-running coin design in US history. The "wheat" reverse ran from 1909 through 1958 before being replaced by the Lincoln Memorial reverse in 1959.',
    eras: ['lincoln-centennial', 'wwii-composition'],
  },
  'lincoln-memorial': {
    designer: 'Frank Gasparro (reverse), Victor David Brenner (obverse)',
    yearsStruck: '1959–2008',
    significance: 'The Lincoln Memorial reverse replaced the Wheat reverse in 1959 to mark Lincoln\'s 150th birth anniversary. The composition switched from 95% copper to copper-plated zinc in 1982 — the famous "small date / large date" varieties of 1982 mark the transition. Replaced by four bicentennial designs in 2009.',
  },
  'mercury-dime': {
    designer: 'Adolph A. Weinman',
    yearsStruck: '1916–1945',
    significance: 'Properly the "Winged Liberty Head Dime" — the wings on Liberty\'s cap symbolize freedom of thought, not the Roman god Mercury. Weinman also designed the Walking Liberty Half of the same era. The 1916-D is one of the most coveted key dates in 20th-century US numismatics with a mintage of just 264,000.',
    eras: ['mercury-end', 'wwii-composition'],
  },
  'roosevelt-dime': {
    designer: 'John R. Sinnock',
    yearsStruck: '1946–present',
    significance: 'Struck within a year of FDR\'s death and timed for his birthday, January 30, 1946 — chosen because of Roosevelt\'s March of Dimes polio fundraising work. The composition went from 90% silver to copper-nickel clad in 1965, then resumed silver striking for proof sets from 1992 onward.',
    eras: ['silver-removal-1965'],
  },
  'kennedy-half': {
    designer: 'Gilroy Roberts (obverse), Frank Gasparro (reverse)',
    yearsStruck: '1964–present',
    significance: 'The fastest design-to-strike turnaround in modern US coinage — authorized December 1963, in circulation by March 1964 to memorialize JFK. Public hoarding of the 90% silver 1964 issue removed it from circulation almost immediately. Silver content dropped to 40% (1965–1970), then to clad copper-nickel (1971–present).',
    eras: ['jfk-memorial', 'silver-removal-1965'],
  },
  'walking-liberty-half': {
    designer: 'Adolph A. Weinman',
    yearsStruck: '1916–1947',
    significance: 'Widely considered one of the most beautiful US coin designs. Weinman\'s full-figure Liberty striding toward the dawn, draped in the American flag, became iconic enough that the US Mint resurrected the obverse for the American Silver Eagle in 1986. Replaced by the Franklin Half in 1948.',
  },
  'franklin-half': {
    designer: 'John R. Sinnock',
    yearsStruck: '1948–1963',
    significance: 'The only US circulating coin to depict Benjamin Franklin. Short run — replaced by the Kennedy Half after JFK\'s assassination. The "full bell lines" designation on the reverse Liberty Bell is the key collectible variable for high-grade examples.',
  },
  'buffalo-nickel': {
    designer: 'James Earle Fraser',
    yearsStruck: '1913–1938',
    significance: 'The Native American obverse and American Bison reverse made this one of the most distinctly American coin designs ever struck. Fraser used three different Native American men as composite models. The Type 1 of 1913 placed the buffalo on a raised mound; revised mid-year to a flat plain for better die durability.',
  },
  'jefferson-nickel': {
    designer: 'Felix Schlag',
    yearsStruck: '1938–present',
    significance: 'Won a public design competition with prize money of $1,000 — one of few US coin designs chosen by open competition. The wartime alloy (35% silver, 1942–1945) marked the silver content with a large mintmark above Monticello — the first time the Philadelphia Mint used a P mintmark.',
    eras: ['wwii-composition'],
  },
  'barber-dime': {
    designer: 'Charles E. Barber',
    yearsStruck: '1892–1916',
    significance: 'Designed by Mint Chief Engraver Charles Barber after public dissatisfaction with the previous Seated Liberty design. The 1894-S Barber Dime is one of the most famous American rarities — only 24 were struck, and roughly 9 are known to survive. Series ended in 1916 with the introduction of the Mercury Dime.',
  },
  'barber-quarter': {
    designer: 'Charles E. Barber',
    yearsStruck: '1892–1916',
    significance: 'Companion to the Barber Dime and Half Dollar. Quarter-specific key date is the 1901-S, with a mintage of just 72,664 — among the lowest of any 20th-century US coin. Replaced by the Standing Liberty Quarter in 1916.',
  },
  'barber-half': {
    designer: 'Charles E. Barber',
    yearsStruck: '1892–1915',
    significance: 'Largest of the three Barber coins. Heavily worn in circulation — collectors find that high-grade examples are scarce relative to mintage figures because the coin saw heavy commercial use. Replaced by the Walking Liberty Half in 1916.',
  },
  'indian-head-cent': {
    designer: 'James B. Longacre',
    yearsStruck: '1859–1909',
    significance: 'Despite the name, Longacre\'s portrait depicts Liberty wearing a Native American headdress — a Victorian artistic convention, not a portrait of an Indigenous person. The 1877 issue, with a mintage of just 852,500, is the major key date. Replaced by the Lincoln Cent for Lincoln\'s 1909 centennial.',
  },
  'american-silver-eagle': {
    designer: 'Adolph A. Weinman (obverse), John Mercanti (Type 1 reverse), Emily Damstra (Type 2 reverse)',
    yearsStruck: '1986–present',
    significance: 'The official silver bullion coin of the United States. One troy ounce of .999 fine silver, struck at multiple mints since 1986. The reverse changed mid-2021 from Mercanti\'s heraldic eagle to Damstra\'s landing eagle — creating "Type 1" and "Type 2" sub-categories with their own collectible dynamics.',
    eras: ['silver-eagle-bullion'],
  },
  'american-gold-eagle': {
    designer: 'Augustus Saint-Gaudens (obverse), Miley Busiek (Type 1 reverse), Jennie Norris (Type 2 reverse)',
    yearsStruck: '1986–present',
    significance: 'The US Mint\'s flagship gold bullion program, struck in four sizes (1, 1/2, 1/4, 1/10 troy oz). Uses Saint-Gaudens\' 1907 Double Eagle obverse — considered the most beautiful US coin design ever. Reverse redesigned in 2021, creating Type 1 and Type 2 collecting splits.',
    eras: ['silver-eagle-bullion'],
  },
  'saint-gaudens-double-eagle': {
    designer: 'Augustus Saint-Gaudens',
    yearsStruck: '1907–1933',
    significance: 'Commissioned by Theodore Roosevelt as part of his beautification of US coinage. The 1907 Ultra High Relief is one of the most coveted American coins ever struck — only ~20 known. The 1933 Double Eagle was struck but never officially released; a single legally-owned example sold for $18.9 million in 2021, the highest price ever paid for any coin.',
  },
  'standing-liberty-quarter': {
    designer: 'Hermon A. MacNeil',
    yearsStruck: '1916–1930',
    significance: 'Liberty was originally depicted bare-breasted (1916–early 1917) — modified to wear a chain-mail vest mid-1917 amid Victorian-era objections. The Type 1 variants are scarce and command significant premiums. Replaced by the Washington Quarter for the 1932 Washington bicentennial.',
  },
  'washington-quarter': {
    designer: 'John Flanagan',
    yearsStruck: '1932–present',
    significance: 'Originally a one-year commemorative for Washington\'s 200th birthday — Congress kept it permanently. Silver through 1964, clad 1965–present. The classic "no mintmark = Philadelphia" rule was broken in 1980 when the P mintmark was added to circulating quarters for the first time.',
    eras: ['silver-removal-1965'],
  },
  'state-quarter': {
    designer: 'Multiple (50 reverses)',
    yearsStruck: '1999–2008',
    significance: 'The most successful coin program in US history. Each state received a coin in the order they joined the Union, struck for 10 weeks each. Drove an estimated 147 million Americans to collect state quarters at the program\'s peak. Followed by DC + Territories (2009) and America the Beautiful (2010–2021).',
  },
  'kennedy-half-classic': {
    designer: 'Gilroy Roberts (obverse), Frank Gasparro (reverse)',
    yearsStruck: '1964–1970',
    significance: 'The silver Kennedy era — 90% silver in 1964, dropped to 40% silver-clad 1965–1970. After 1970, all circulating Kennedy halves are copper-nickel clad. The 1970-D was struck only for collectors\' mint sets and never released into circulation.',
  },
}

// ── COIN-SPECIFIC NOTES ──────────────────────────────────────────────────────
// Only the most notable individual coins get an entry. Most coins fall back
// to series-level context.

export const COIN_NOTES: Record<string, CoinNote> = {
  'cs_us_dime_mercury-dime_1916_d_none': {
    note: 'The 1916-D is the key date of the entire Mercury Dime series. Just 264,000 were struck at the Denver Mint — by far the lowest mintage of any business-strike Mercury. Counterfeits are common; authentic examples should always be third-party graded before purchase.',
  },
  'cs_us_dime_mercury-dime_1942_p_none': {
    note: 'The 1942 over 1941 overdate (where a 1942 die was struck over a 1941 die) is one of the most famous US coin errors. Visible doubling on the date confirms authenticity — the overdate variety commands a substantial premium over the regular 1942.',
  },
  'cs_us_dime_barber-dime_1894_s_none': {
    note: 'One of the most famous American rarities. Only 24 were struck — accounts differ on why (the most colorful story: Mint Superintendent John Daggett struck them as a favor to his daughter Hallie). Approximately 9 are known to survive. Most recent sale exceeded $1 million.',
  },
  'cs_us_one-cent_lincoln-wheat_1909_s_vdb': {
    note: 'The "1909-S VDB" — designer Victor David Brenner\'s initials on the reverse caused public uproar over their prominence. The Mint removed them mid-year, making the San Francisco issues with VDB a true rarity at 484,000 mintage. The single most famous Lincoln cent.',
  },
  'cs_us_one-cent_lincoln-wheat_1914_d_none': {
    note: 'Key date of the early Lincoln series. Mintage of 1,193,000 was modest but worn examples are common — high-grade survivors are genuinely scarce. Beware: many altered 1944-D cents have been passed as 1914-D — examine the digit shapes carefully.',
  },
  'cs_us_one-cent_lincoln-wheat_1922_d_none': {
    note: 'The 1922 was struck only at Denver — Philadelphia struck no cents that year. Worn dies produced the famous "1922 No D" variety, where the mintmark disappeared entirely. The strong-reverse No-D variety is a major rarity worth thousands; weak-D versions are common.',
  },
  'cs_us_one-cent_lincoln-wheat_1943_p_none': {
    note: 'The "steel cent" — zinc-coated steel due to wartime copper conservation. Roughly one billion struck across all three mints. The famous 1943 bronze cent error (a handful struck on leftover 1942 bronze planchets) is one of the most valuable US error coins, with confirmed examples selling for $200,000+.',
  },
  'cs_us_one-cent_lincoln-wheat_1955_p_none': {
    note: 'Home of the famous 1955 Doubled Die Obverse — among the most dramatic and best-known doubled die varieties in US numismatics. Strong doubling visible on LIBERTY and the date with the naked eye. The regular 1955-P is common; the DDO commands four-figure premiums even in circulated grades.',
  },
  'cs_us_dollar_morgan_1893_s_none': {
    note: 'The undisputed king of Morgan Dollars. Mintage of just 100,000 — the lowest of any business-strike Morgan. Always third-party graded for authenticity; counterfeits and altered dates (1898-S → 1893-S) are common.',
  },
  'cs_us_dollar_morgan_1889_cc_none': {
    note: 'The key Carson City Morgan. Mintage of 350,000, of which most circulated and were lost to attrition. High-grade examples are exceptionally rare — among the most valuable common-date Morgans in MS condition.',
  },
  'cs_us_dollar_morgan_1895_p_none': {
    note: 'The "King of Morgans" — no business-strike issues are known to exist, only 880 proof-only strikes were made. Every authenticated example traces back to that proof run. Even worn proof examples sell for five figures.',
  },
  'cs_us_dollar_morgan_1921_d_none': {
    note: 'The only year the Denver Mint ever struck a Morgan Dollar. The mintmark D on the reverse is the entire reason this issue exists as a distinct collectible. Common as common-dates go, but historically significant as the only D-mint Morgan.',
  },
  'cs_us_dime_roosevelt-dime_1996_w_none': {
    note: 'Struck at West Point as a special 50th-anniversary collectible — never released into general circulation, only distributed in 1996 mint sets. The only Roosevelt Dime ever to carry the W mintmark.',
  },
  'cs_us_one-cent_indian-head-cent_1877_p_none': {
    note: 'Key date of the Indian Head Cent series. Mintage of just 852,500 — by far the lowest of the regular issues. Counterfeits and altered dates (1878 → 1877) are extensive; certification is essential for any meaningful purchase.',
  },
  'cs_us_quarter_barber-quarter_1901_s_none': {
    note: 'Key date of the Barber Quarter series. Mintage of 72,664 — one of the lowest of any 20th-century US coin. High-grade examples are exceptionally rare; even circulated specimens command significant premiums.',
  },
}

// ── Lookup helpers ───────────────────────────────────────────────────────────

export function getSeriesContext(series: string): SeriesContext | null {
  return SERIES_CONTEXT[series] ?? null
}

export function getCoinNote(coinId: string): CoinNote | null {
  return COIN_NOTES[coinId] ?? null
}

export function getErasForSeries(series: string): Era[] {
  const ctx = SERIES_CONTEXT[series]
  if (!ctx?.eras) return []
  return ctx.eras.map(id => ERAS[id]).filter((e): e is Era => e !== undefined)
}
