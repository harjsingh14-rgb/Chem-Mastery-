# Exam resources index

Where every spec, paper, mark scheme and examiner report lives. Nothing in
this folder is loaded by the app; it is reference material for writing
questions, hints and mark schemes.

## Specifications
- `resources/specs/AQA-7405-specification.pdf` (v1.2, July 2026)
- `resources/specs/OCR-H432-specification.pdf` (v3.1, May 2026)
- `resources/specs/Edexcel-9CH0-specification.pdf` (Issue 3)

## AQA 7405 (A-level)
- Question papers: `paper-analysis/papers/` (P1 at top level, P2 and P3 in subfolders). Jun 17, 18, 19, Nov 20, Nov 21, Jun 22, 23, 24, 25; specimen for P2 and P3.
- Mark schemes: `resources/aqa/mark-schemes/AQA-7405{1,2,3}-MS-{JUN17..JUN25,SPEC}.pdf` (30 files). No Nov 20 or Nov 21 mark schemes.
- Examiner reports: `paper-analysis/examiner-reports/` (P1 top level, P2 and P3 in subfolders). Jun 17 to Jun 24 plus Nov 20, Nov 21.
- PMT topic question packs: `mcq-bank/AQA/{AS,A2}/<spec section>/QPn.pdf, MSn.pdf` (33 of 34 topics; some are single-page screenshots).
- Save My Exams samples: `resources/sme/aqa/` (atomic structure, rate equations; MCQ and structured).
- AS 7404: `resources/aqa/as/mark-schemes/` (P1 Jun 16, Jun 19 only).

## OCR A H432
- Paper 1: QPs `Paper-analysis-OCR A- Physical /Papers/`; MSs `OCR Ms/` (also holds P2); ERs `Paper-analysis-OCR A- Physical /Reports/`.
- Paper 2: QPs and ERs `paper-analysis/OCR Paper 2 Papers and ERs/`; MSs `OCR Ms/`.
- Paper 3: `paper-analysis/OCR Paper 3 Papers and ERs/{question-papers,mark-schemes,examiner-reports,extracted-text}/`.
- All three papers: Jun 17 to Jun 25 QPs and MSs, Jun 17 to Jun 24 ERs.
- AS H032: `resources/ocr/as/mark-schemes/` (P2 Jun 18 only).

## Edexcel 9CH0
- Question papers: `resources/edexcel/question-papers/9CH0-{1,2,3}-QP-{SPEC,JUN17..JUN26}.pdf`. Missing: P2 Jun 24, P1 Jun 25.
- Mark schemes: `resources/edexcel/mark-schemes/` same coverage. Missing: P2 Jun 24, P1 Jun 25.
- Examiner reports: `resources/edexcel/examiner-reports/9CH0-{1,2,3}-ER-*.pdf`. Jun 17, 18, 19, 22, 23, 24, 25; `SER20` and `SER21` are the Dec 2020 and Dec 2021 reports.
- AS 8CH0: `resources/edexcel/as/` (QPs Jun 18 and Jun 26, MSs Jun 26, ERs Jun 25).

## Reading PDFs
`pymupdf` (import fitz) is installed and extracts text from all of these.
