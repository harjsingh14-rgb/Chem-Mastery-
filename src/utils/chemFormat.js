import React from "react";

export default function chemFormat(text) {
  if (!text || typeof text !== "string") return text;
  const sign = (s) => s.replace(/[–-]/g, "−");
  const re = /(\d)([spdf])(\d{1,2}?)(?=\d[spdf]|[\s,.;)\]}]|$)|(^|[\s(\[=>\/+\-−\d])([A-Z][a-z]?)(\d+)([+−–\-])(?=[\s,.\]);}?!:(\/→]|$)|\((g|l|s|aq)\)|([A-Z][a-z]?|\))(\d+)([+−–\-]?)(?=[\s,.\]);}?!:(\/→]|[A-Za-z(]|$)|(\s)(\d+)([+−–\-])(?=[\s,.\]);}?!:(\/→]|$)|([A-Za-z)\]}])([+−–\-])(?=[\s,.\]);}?!:(\/→]|$)|δ([+−–\-])/g;

  let lastIdx = 0, key = 0;
  const result = [];
  let m;
  while ((m = re.exec(text)) !== null) {
    if (m.index === re.lastIndex) { re.lastIndex++; continue; }
    if (m.index > lastIdx) result.push(text.slice(lastIdx, m.index));

    if (m[2] !== undefined) {
      result.push(<span key={key++}>{m[1]}{m[2]}<sup>{m[3]}</sup></span>);
    } else if (m[5] !== undefined && m[7] !== undefined) {
      result.push(<span key={key++}>{m[4]}{m[5]}<sup>{m[6]}{sign(m[7])}</sup></span>);
    } else if (m[8] !== undefined) {
      result.push(<sub key={key++}>({m[8]})</sub>);
    } else if (m[9] !== undefined && m[10] !== undefined) {
      result.push(<span key={key++}>{m[9]}<sub>{m[10]}</sub>{m[11] ? <sup>{sign(m[11])}</sup> : null}</span>);
    } else if (m[13] !== undefined && m[14] !== undefined) {
      result.push(<span key={key++}>{m[12]}<sup>{m[13]}{sign(m[14])}</sup></span>);
    } else if (m[15] !== undefined && m[16] !== undefined) {
      result.push(<span key={key++}>{m[15]}<sup>{sign(m[16])}</sup></span>);
    } else if (m[17] !== undefined) {
      result.push(<span key={key++}>δ<sup>{sign(m[17])}</sup></span>);
    }

    lastIdx = re.lastIndex;
  }
  if (lastIdx < text.length) result.push(text.slice(lastIdx));
  return result.length > 0 ? result : text;
}
