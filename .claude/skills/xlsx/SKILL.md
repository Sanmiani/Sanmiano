---
name: xlsx
description: Use this skill any time a spreadsheet file is the primary input or output — opening, reading, editing, or creating .xlsx/.xlsm/.csv/.tsv files, adding formulas, formatting, charting, cleaning data, or converting between tabular formats.
license: MIT
---

# XLSX — Spreadsheet Creation, Editing, and Analysis

## Quick Reference

| Task | Tool |
|------|------|
| Data analysis, bulk ops | pandas |
| Formulas, formatting, Excel features | openpyxl |
| Formula recalculation | `scripts/recalc.py` |

## Critical Rule: Use Excel Formulas, Not Hardcoded Values

```python
# WRONG — calculating in Python and hardcoding
total = df['Sales'].sum()
sheet['B10'] = total  # hardcodes 5000

# CORRECT — let Excel calculate
sheet['B10'] = '=SUM(B2:B9)'
sheet['C5'] = '=(C4-C2)/C2'
sheet['D20'] = '=AVERAGE(D2:D19)'
```

## Reading and Analysis

```python
import pandas as pd

df = pd.read_excel('file.xlsx')
all_sheets = pd.read_excel('file.xlsx', sheet_name=None)  # dict of all sheets

df.head()
df.info()
df.describe()
df.to_excel('output.xlsx', index=False)
```

## Creating New Files

```python
from openpyxl import Workbook
from openpyxl.styles import Font, PatternFill, Alignment

wb = Workbook()
sheet = wb.active
sheet['A1'] = 'Header'
sheet['B1'] = 'Value'
sheet['B2'] = '=SUM(A1:A10)'

# Formatting
sheet['A1'].font = Font(bold=True)
sheet['A1'].fill = PatternFill('solid', start_color='FFFF00')
sheet.column_dimensions['A'].width = 20

wb.save('output.xlsx')
```

## Editing Existing Files

```python
from openpyxl import load_workbook

wb = load_workbook('existing.xlsx')
sheet = wb.active  # or wb['SheetName']

sheet['A1'] = 'New Value'
sheet.insert_rows(2)
sheet.delete_cols(3)

wb.save('modified.xlsx')
```

**Warning**: `data_only=True` reads calculated values but saves formulas as static — formulas are permanently lost if you save after using this flag.

## Recalculating Formulas (MANDATORY if using formulas)

```bash
python scripts/recalc.py output.xlsx
```

Output JSON:
```json
{
  "status": "success",
  "total_errors": 0,
  "total_formulas": 42,
  "error_summary": {}
}
```

If `status` is `errors_found`, fix issues and recalculate again.

Common errors: `#REF!` (invalid reference), `#DIV/0!` (divide by zero), `#VALUE!` (wrong type), `#NAME?` (unrecognized formula).

## Professional Standards

### Color Coding (Financial Models)

- **Blue text** (0,0,255): Hardcoded inputs
- **Black text** (0,0,0): All formulas and calculations
- **Green text** (0,128,0): Links from other worksheets
- **Red text** (255,0,0): External file links
- **Yellow background** (255,255,0): Key assumptions needing attention

### Number Formatting

- Years: Format as text strings ("2024" not "2,024")
- Currency: `$#,##0` with units in headers ("Revenue ($mm)")
- Zeros: Display as "-" using `$#,##0;($#,##0);-`
- Percentages: `0.0%` (one decimal)
- Negative numbers: Use parentheses (123) not minus -123

## Formula Quality Checklist

- [ ] Test 2-3 sample references before building full model
- [ ] Confirm Excel columns match (column 64 = BL)
- [ ] Remember Excel is 1-indexed (DataFrame row 5 = Excel row 6)
- [ ] Check denominators for division by zero
- [ ] Verify all cell references point to intended cells
- [ ] Cross-sheet references: use `Sheet1!A1` format

## When NOT to Use This Skill

Do not trigger when the deliverable is: a Word document, HTML report, standalone Python script, database pipeline, or Google Sheets API integration — even if tabular data is involved.
