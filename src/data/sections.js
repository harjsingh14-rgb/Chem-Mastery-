export const SECTIONS = [
  { id: "physical_as", label: "Physical Chemistry (AS)", sub: "3.1 Year 1", topics: ["3.1.1","3.1.2","3.1.3","3.1.4","3.1.5","3.1.6","3.1.7"] },
  { id: "physical_a2", label: "Physical Chemistry (A2)", sub: "3.1 Year 2", topics: ["3.1.8","3.1.9","3.1.10","3.1.11","3.1.12"] },
  { id: "inorganic_as", label: "Inorganic Chemistry (AS)", sub: "3.2 Year 1", topics: ["3.2.1","3.2.2","3.2.3"] },
  { id: "inorganic_a2", label: "Inorganic Chemistry (A2)", sub: "3.2 Year 2", topics: ["3.2.4","3.2.5","3.2.6"] },
  { id: "organic", label: "Organic Chemistry", sub: "3.3", topics: ["3.3.1","3.3.2","3.3.3","3.3.4","3.3.5","3.3.6","3.3.7"] },
  { id: "organic2", label: "Organic Chemistry (A2)", sub: "3.3 (A2)", topics: ["3.3.9","3.3.10","3.3.11","3.3.12","3.3.13","3.3.14","3.3.15","3.3.16"] },
  { id: "practicals_as", label: "Required Practicals (AS)", sub: "Activities 1-7 (Year 1)", topics: ["RP1a","RP1b","RP12","RP_A3","RP_A4","RP4","RP_A6","RP2","RP_A7b"] },
  { id: "practicals_a2", label: "Required Practicals (A2)", sub: "Activities 8-12 (Year 2)", topics: ["RP8","RP_A9","RP10a","RP6","RP_A11","RP5"] },
];

export const TOPIC_ORDER = SECTIONS.flatMap(s => s.topics);

export const OCR_SECTIONS = [
  { id: "ocr_mod2", label: "Module 2 – Foundations", sub: "Foundations in Chemistry", topics: ["ocr_2.1.1","ocr_2.1.2","ocr_2.1.3","ocr_2.1.4","ocr_2.2.1","ocr_2.2.2","ocr_2.2.3","ocr_2.3.1"] },
  { id: "ocr_mod3", label: "Module 3 – Periodic Table & Energy", sub: "Periodic Table and Energy", topics: ["ocr_3.1.1","ocr_3.1.2","ocr_3.1.3","ocr_3.1.4","ocr_3.2.1","ocr_3.2.2"] },
  { id: "ocr_mod4", label: "Module 4 – Core Organic", sub: "Core Organic Chemistry", topics: ["ocr_4.1.1","ocr_4.2.1","ocr_4.3.1","ocr_4.4.1"] },
  { id: "ocr_mod5", label: "Module 5 – Physical & Transition", sub: "Physical Chemistry and Transition Elements", topics: ["ocr_5.1.1","ocr_5.1.2","ocr_5.2.1","ocr_5.2.2","ocr_5.3.1","ocr_5.4.1"] },
  { id: "ocr_mod6", label: "Module 6 – Organic & Analysis", sub: "Organic Chemistry and Analysis", topics: ["ocr_6.1.1","ocr_6.1.2","ocr_6.2.1","ocr_6.2.2","ocr_6.3.1","ocr_6.4.1","ocr_6.5.1","ocr_6.5.2"] },
];
export const OCR_TOPIC_ORDER = OCR_SECTIONS.flatMap(s => s.topics);
