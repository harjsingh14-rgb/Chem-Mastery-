// Facts about the MCQ bank that the first screen shows without loading the
// bank itself (src/mcq-data.json is about 1 MB and now loads with the MCQ tab).
// Keep in step with the bank: python3 -c "import json;print(len(json.load(open('src/mcq-data.json'))['questions']))"
export const MCQ_COUNT = 1907;
