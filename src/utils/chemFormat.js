import React from "react";

// Turns plain chemistry text into React nodes with the right sub- and
// superscripts: H2O, Mg2+, Cr2O7^2-, e-, kJ mol-1, 1s2 2s2 2p6, ΔHf, 10^-4.
// Rules are tried in order at each position; the first that matches wins.
// No lookbehind is used so this runs in every browser the app supports.

const sign = (s) => s.replace(/[–-]/g, "−");
const AFTER = "(?=[\\s,.\\]);}?!:(\\/→^]|$)";

const RULES = [
  // ΔHf, ΔHlatt, ΔStotal, ΔG and so on: the label becomes a subscript
  { re: new RegExp("Δ([HSGU])(IE1|IE2|IE|EA1|EA2|EA|LE|latt|sol|hyd|neut|total|system|surroundings|sys|surr|vap|fus|diss|form|comb|at|f|c|r)(?![A-Za-z])", "y"),
    fn: (m) => <>Δ{m[1]}<sub>{m[2]}</sub></> },
  // Units with negative powers: mol-1, dm-3, cm-1, s-1, K-1, g-1
  { re: /(mol|dm|cm|kg|kJ|kPa|Pa|atm|nm|mm|g|s|K|m|J)-(\d)(?!\d)/y, prev: /^$|[^A-Za-z0-9]/,
    fn: (m) => <>{m[1]}<sup>−{m[2]}</sup></> },
  // Volume units: dm3, cm3, m3
  { re: /(dm|cm|m)([23])(?!\d)/y, prev: /^$|[^A-Za-z0-9]/, fn: (m) => <>{m[1]}<sup>{m[2]}</sup></> },
  // Equilibrium and acid constants and relative molecular mass: Kc, Kp, Ka, Kw, pKa, Mr
  { re: /K([acpw])(?![A-Za-z])/y, prev: /^$|[^A-Za-z]|^p$/, fn: (m) => <>K<sub>{m[1]}</sub></> },
  { re: /Mr(?![A-Za-z])/y, prev: /^$|[^A-Za-z]/, fn: () => <>M<sub>r</sub></> },
  // State symbols
  { re: /\((g|l|s|aq)\)/y, fn: (m) => <sub>({m[1]})</sub> },
  // Caret powers and charges: 10^-4, Cr2O7^2-, VO^2+, VO2^+
  { re: /\^([+−–-]?\d+[+−–-]?|[+−–-])/y, fn: (m) => <sup>{sign(m[1])}</sup> },
  // Electron configurations: 1s2 2s2 2p6 3s1
  { re: /(\d)([spdf])(\d{1,2}?)(?=\s*\d[spdf]|[\s,.;)\]}]|$)/y, prev: /^$|[\s(\[,:]/,
    fn: (m) => <>{m[1]}{m[2]}<sup>{m[3]}</sup></> },
  // Ion with a numbered charge straight after the symbol or bracket: Mg2+, Fe3+, O2-(g), [Cu(H2O)6]2+
  { re: new RegExp("([A-Z][a-z]?|\\])(\\d+)([+−–-])" + AFTER, "y"), prev: /^$|[\s(\[=>\/+\-−\d)]/,
    fn: (m) => <>{m[1]}<sup>{m[2]}{sign(m[3])}</sup></> },
  // Subscript count after a symbol or closing bracket: H2O, Cl2, (OH)2, C4H8
  { re: /([A-Z][a-z]?|\))(\d+)([+−–-]?)(?=[\s,.\]);}?!:(\/→^]|[A-Za-z(]|$)/y,
    fn: (m) => <>{m[1]}<sub>{m[2]}</sub>{m[3] ? <sup>{sign(m[3])}</sup> : null}</> },
  // A bare charge after a space: "gaseous 1+ ions", "the 2+ ion"
  { re: new RegExp("(\\d+)([+−–-])" + AFTER, "y"), prev: /\s/, fn: (m) => <sup>{m[1]}{sign(m[2])}</sup> },
  // Single charge on a letter or bracket: H+, Cl-, e-, OH-, [Cu(NH3)4]2+ is handled above
  { re: new RegExp("([A-Za-z)\\]}])([+−–-])" + AFTER, "y"), fn: (m) => <>{m[1]}<sup>{sign(m[2])}</sup></> },
  // Partial charges: δ+ δ-
  { re: /δ([+−–-])/y, fn: (m) => <>δ<sup>{sign(m[1])}</sup></> },
];

export default function chemFormat(text) {
  if (!text || typeof text !== "string") return text;
  const out = [];
  let buf = "", i = 0, key = 0;
  while (i < text.length) {
    let matched = false;
    for (const r of RULES) {
      r.re.lastIndex = i;
      const m = r.re.exec(text);
      if (!m || m.index !== i) continue;
      if (r.prev && !r.prev.test(i === 0 ? "" : text[i - 1])) continue;
      if (buf) { out.push(buf); buf = ""; }
      out.push(<React.Fragment key={key++}>{r.fn(m)}</React.Fragment>);
      i += m[0].length;
      matched = true;
      break;
    }
    if (!matched) { buf += text[i]; i++; }
  }
  if (buf) out.push(buf);
  return out.length === 1 && typeof out[0] === "string" ? text : out;
}
