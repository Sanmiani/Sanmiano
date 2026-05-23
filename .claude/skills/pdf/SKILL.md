---
name: pdf
description: Use this skill whenever the user wants to do anything with PDF files — reading, extracting text/tables, combining, splitting, rotating, watermarking, creating new PDFs, filling forms, encrypting, extracting images, or OCR on scanned PDFs.
license: MIT
---

# PDF Processing Skill

## Python Libraries

| Library | Best For |
|---------|----------|
| `pypdf` | Reading, merging, splitting, rotating, encrypting PDFs |
| `pdfplumber` | Extracting text and tables with layout precision |
| `reportlab` | Creating new PDFs from scratch |

## Quick Start

```python
# Reading with pypdf
from pypdf import PdfReader

reader = PdfReader("document.pdf")
for page in reader.pages:
    print(page.extract_text())

# Extracting tables with pdfplumber
import pdfplumber

with pdfplumber.open("document.pdf") as pdf:
    for page in pdf.pages:
        tables = page.extract_tables()

# Creating with reportlab
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import letter

c = canvas.Canvas("output.pdf", pagesize=letter)
c.drawString(72, 720, "Hello, World!")
c.save()
```

## Command-Line Tools

```bash
# Text extraction
pdftotext document.pdf output.txt

# Repair and operations
qpdf --decrypt input.pdf output.pdf
pdftk input.pdf burst output page_%04d.pdf
```

## Common Tasks

### Merge PDFs
```python
from pypdf import PdfWriter

writer = PdfWriter()
for filename in ["doc1.pdf", "doc2.pdf"]:
    reader = PdfReader(filename)
    for page in reader.pages:
        writer.add_page(page)
with open("merged.pdf", "wb") as f:
    writer.write(f)
```

### Split PDF
```python
from pypdf import PdfReader, PdfWriter

reader = PdfReader("document.pdf")
for i, page in enumerate(reader.pages):
    writer = PdfWriter()
    writer.add_page(page)
    with open(f"page_{i+1}.pdf", "wb") as f:
        writer.write(f)
```

### Add Watermark
```python
from pypdf import PdfReader, PdfWriter

watermark = PdfReader("watermark.pdf").pages[0]
reader = PdfReader("document.pdf")
writer = PdfWriter()
for page in reader.pages:
    page.merge_page(watermark)
    writer.add_page(page)
with open("watermarked.pdf", "wb") as f:
    writer.write(f)
```

## Critical Rule for ReportLab

**Never use Unicode subscript/superscript characters** (e.g., ² ³ ₁) in ReportLab PDFs — they render as black boxes. Instead use XML markup tags:

```python
# WRONG
c.drawString(72, 720, "H₂O")

# CORRECT — use Paragraph with XML markup
from reportlab.platypus import Paragraph
from reportlab.lib.styles import getSampleStyleSheet
styles = getSampleStyleSheet()
p = Paragraph("H<sub>2</sub>O and CO<super>2</super>", styles['Normal'])
```

## Dependencies

```bash
pip install pypdf pdfplumber reportlab
# Command-line: poppler-utils (pdftotext), qpdf, pdftk
```
