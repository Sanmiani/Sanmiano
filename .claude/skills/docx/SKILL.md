---
name: docx
description: Use this skill for all Word document (.docx) work — creating new documents, editing existing ones, reading content, tracked changes, comments, tables, images, hyperlinks, headers/footers, and TOC generation.
license: MIT
---

# DOCX Creation, Editing, and Analysis

## Quick Reference

| Task | Approach |
|------|----------|
| Read/analyze content | `pandoc` or unpack for raw XML |
| Create new document | Use `docx-js` (npm install -g docx) |
| Edit existing document | Unpack → edit XML → repack |

### Converting .doc to .docx

```bash
python scripts/office/soffice.py --headless --convert-to docx document.doc
```

### Reading Content

```bash
pandoc --track-changes=all document.docx -o output.md
python scripts/office/unpack.py document.docx unpacked/
```

---

## Creating New Documents

```javascript
const { Document, Packer, Paragraph, TextRun } = require('docx');

const doc = new Document({ sections: [{ children: [/* content */] }] });
Packer.toBuffer(doc).then(buffer => fs.writeFileSync("doc.docx", buffer));
```

### Page Size — Always Set Explicitly

```javascript
// docx-js defaults to A4 — always set explicitly for US Letter
sections: [{
  properties: {
    page: {
      size: { width: 12240, height: 15840 }, // 8.5 x 11 inches in DXA
      margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 }
    }
  },
  children: []
}]
```

### Lists — Never Use Unicode Bullets

```javascript
// WRONG
new Paragraph({ children: [new TextRun("• Item")] })

// CORRECT
const doc = new Document({
  numbering: {
    config: [
      { reference: "bullets",
        levels: [{ level: 0, format: LevelFormat.BULLET, text: "•", alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] }
    ]
  },
  sections: [{ children: [
    new Paragraph({ numbering: { reference: "bullets", level: 0 },
      children: [new TextRun("Bullet item")] })
  ]}]
});
```

### Tables — Critical Rules

```javascript
// Always set both table width AND cell width
// Use ShadingType.CLEAR (never SOLID) to prevent black backgrounds
// Always use WidthType.DXA (never WidthType.PERCENTAGE — breaks in Google Docs)

const border = { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" };
new Table({
  width: { size: 9360, type: WidthType.DXA },
  columnWidths: [4680, 4680],
  rows: [new TableRow({ children: [
    new TableCell({
      borders: { top: border, bottom: border, left: border, right: border },
      width: { size: 4680, type: WidthType.DXA },
      shading: { fill: "D5E8F0", type: ShadingType.CLEAR },
      margins: { top: 80, bottom: 80, left: 120, right: 120 },
      children: [new Paragraph({ children: [new TextRun("Cell")] })]
    })
  ]})]
})
```

### Critical Rules

- Set page size explicitly — never leave as A4 default for US documents
- Never use `\n` — use separate Paragraph elements
- Never use unicode bullets — use LevelFormat.BULLET with numbering config
- PageBreak must be inside a Paragraph
- ImageRun requires `type` parameter (png/jpg/etc)
- Tables need dual widths — columnWidths array AND cell width
- Always add cell margins for readable padding
- Use `ShadingType.CLEAR` for shading, never SOLID
- TOC requires HeadingLevel only — no custom styles on heading paragraphs

---

## Editing Existing Documents

### Step 1: Unpack
```bash
python scripts/office/unpack.py document.docx unpacked/
```

### Step 2: Edit XML
- Use the Edit tool directly for string replacement
- Use "Claude" as the author for tracked changes and comments
- Use smart quotes: `&#x2019;` (apostrophe), `&#x201C;/&#x201D;` (double quotes)

**Tracked Changes:**
```xml
<w:ins w:id="1" w:author="Claude" w:date="2025-01-01T00:00:00Z">
  <w:r><w:t>inserted text</w:t></w:r>
</w:ins>

<w:del w:id="2" w:author="Claude" w:date="2025-01-01T00:00:00Z">
  <w:r><w:delText>deleted text</w:delText></w:r>
</w:del>
```

### Step 3: Pack
```bash
python scripts/office/pack.py unpacked/ output.docx --original document.docx
```

## Validation
```bash
python scripts/office/validate.py doc.docx
```

## Dependencies

- pandoc: Text extraction
- docx: `npm install -g docx` (new documents)
- LibreOffice: PDF/format conversion
