---
name: structural-drawing-review
description: Use when asked to review, check, or audit structural drawings, structural engineering plans, or structural design documents — including foundation plans, framing plans, connection details, load schedules, or any structural set submitted for construction or permitting.
---

## Purpose

Systematically review structural engineering drawings for completeness, internal consistency, code compliance indicators, and constructability. Produce a structured review report with findings categorized by severity.

## When to use

- "Review these structural drawings"
- "Check this structural set for issues"
- "Audit the foundation plan"
- "Are these structural details complete?"
- "Pre-submission drawing review"

## Review Framework

Work through the drawing set in this order. Flag every finding with a severity tag.

**Severity tags:**
- `[CRITICAL]` — would cause rejection at permit, unsafe condition, or missing information that makes the drawing un-buildable
- `[MAJOR]` — inconsistency, missing detail, or code indicator that needs resolution before construction
- `[MINOR]` — coordination note, clarity improvement, or best-practice gap
- `[INFO]` — observation with no action required

---

## Step 1: Sheet Index and Cover Sheet

Check for:
- [ ] Sheet index present and matches actual sheets in set
- [ ] Project name, address, and jurisdiction on cover
- [ ] Engineer of record name, license number, seal, and signature block present
- [ ] Code edition(s) referenced (e.g., IBC 2021, ACI 318-19, AISC 360-22, NDS 2018)
- [ ] Design loads stated: dead, live, wind (speed + exposure), seismic (SDC, Ss, S1), snow if applicable
- [ ] Geotechnical report reference (date + report number) if foundation design is included
- [ ] General notes sheet present

---

## Step 2: General Notes and Specifications

Check for:
- [ ] Material specifications: concrete strength (f'c), rebar grade, structural steel grade, lumber species/grade, engineered wood products called out
- [ ] Weld inspection requirements stated (CJP vs fillet, special vs routine inspection)
- [ ] Bolting requirements: ASTM designation, pretension level (snug vs pretensioned vs slip-critical)
- [ ] Concrete cover requirements for each exposure condition
- [ ] Reinforcing placement tolerances referenced
- [ ] Shop drawing submittal requirements noted
- [ ] Special inspection schedule referenced or attached
- [ ] Abbreviation legend present if non-standard abbreviations used

---

## Step 3: Foundation Plan

Check for:
- [ ] North arrow and scale on every plan sheet
- [ ] All column grid lines labeled consistently (match architectural)
- [ ] Footing sizes, depths, and reinforcing called out for every condition
- [ ] Bearing pressure assumed on plan matches geotechnical recommendation
- [ ] Soil over-excavation / subgrade preparation note present
- [ ] Continuous footings: width, depth, top and bottom bar sizes, spacing
- [ ] Isolated spread footings: plan dimensions, depth, bar mats both ways, dowel sizes
- [ ] Pile or pier foundations: type, capacity, embedment, cap details referenced
- [ ] Foundation walls: thickness, horizontal and vertical rebar, waterproofing reference
- [ ] Slab-on-grade: thickness, subbase, vapor barrier, control joint spacing, reinforcing or fiber dosage
- [ ] Hold-down locations shown and referenced to detail
- [ ] Grade beams: section referenced if used
- [ ] Setback dimensions from property lines shown where required

---

## Step 4: Framing Plans (Floor and Roof)

Check for each level:
- [ ] Scale and north arrow
- [ ] All members sized (beams, girders, joists, columns) — no "by others" without a defined scope boundary
- [ ] Member marks consistent with schedule if schedule is used
- [ ] Span direction indicated for joists and decking
- [ ] Openings in floor/roof framing shown with headers or trimmer beams called out
- [ ] Lateral force-resisting elements identified (shear walls, braced frames, moment frames)
- [ ] Shear wall locations match plan and elevation
- [ ] Diaphragm chord and collector members identified
- [ ] Camber requirements noted for steel beams where applicable
- [ ] Deck gauge, type, and attachment pattern called out
- [ ] Cantilever conditions shown with back-span and reinforcing
- [ ] Equipment or concentrated loads shown with magnitudes

---

## Step 5: Elevations and Sections

Check for:
- [ ] Building sections show floor-to-floor and floor-to-roof heights
- [ ] Structural member sizes shown in section match framing plan
- [ ] Lateral system elevation (shear wall or braced frame) with panel lengths, height-to-width ratio check
- [ ] Moment frame elevation with member sizes, connection type callouts
- [ ] Grade and finished floor elevations shown
- [ ] Foundation depth relative to grade shown

---

## Step 6: Connection Details

Check for each detail:
- [ ] Detail reference bubble on plan or elevation matches detail number on detail sheet
- [ ] All connections that appear in the drawings have a corresponding detail (no orphan callouts)
- [ ] Beam-to-column connections: bolts or welds fully specified, cope dimensions if applicable
- [ ] Moment connections: continuity plates, doubler plates, access holes if applicable
- [ ] Shear tab / clip angle connections: bolt size, quantity, and grade
- [ ] Holdown details: product designation or custom design, anchor rod size and embedment
- [ ] Anchor bolt patterns: diameter, ASTM grade, embedment, edge distances, spacing (meet ACI 318 Ch. 17 or equivalent)
- [ ] Welded connections: weld symbol complete (size, length, type, process if non-standard)
- [ ] Drag strut / collector connections to shear wall shown
- [ ] Ledger connections to concrete or masonry: bolt size, spacing, embedment, and eccentricity addressed
- [ ] Wood-to-wood connections: hardware manufacturer callout or nail schedule
- [ ] All details have a scale or note "NTS" (not to scale — flag as MINOR if NTS on critical details)

---

## Step 7: Schedules

Check for:
- [ ] Column schedule: base plate size, anchor bolt pattern, cap plate if applicable, all columns listed
- [ ] Beam/girder schedule: all marks from plan appear in schedule with size and material grade
- [ ] Footing schedule: all footing marks from plan appear with dimensions and rebar
- [ ] Shear wall schedule: wall mark, length, height, sheathing or panel type, fastening pattern, hold-down designation
- [ ] Reinforcing bar schedule or bending diagrams if bars are complex

---

## Step 8: Lateral System Consistency Check

Cross-check across sheets:
- [ ] Shear wall locations on foundation plan, floor plan(s), and roof plan match
- [ ] Holdown locations on foundation match locations on framing plan
- [ ] Drag strut / collector path is continuous from diaphragm to shear wall on every level
- [ ] Shear wall lengths on plan match schedule lengths
- [ ] Overturning: holdown selection in schedule is consistent with shear wall height and unit shear demand (if design basis is shown)

---

## Step 9: Gravity Load Path Check

Verify load path from roof to foundation:
- [ ] Roof loads transfer to roof framing to walls/columns
- [ ] Floor loads transfer to floor framing to walls/columns
- [ ] Column loads stack to foundation (columns align vertically or transfer beam shown)
- [ ] No load is implicitly "floating" — every element has a support shown

---

## Step 10: Code Compliance Indicators

Note (not a full code check — flag items that commonly trigger corrections):
- [ ] Seismic design category stated; if SDC D/E/F, verify special inspections and detailing notes are present
- [ ] Wind exposure category and design wind speed stated; uplift connections noted for high-wind regions
- [ ] Concrete: cover, min reinforcing ratios, development lengths reference ACI 318 or equivalent
- [ ] Steel: slenderness, connection geometry reference AISC 360 or equivalent
- [ ] Wood: span tables reference NDS or equivalent; treatment required for wet service or ground contact is noted
- [ ] ADA / accessible route does not conflict with structural elements
- [ ] Fire-resistance rating of structural members noted where required (match architectural)

---

## Output: Review Report

After completing each step, produce the report in this format:

```
# Structural Drawing Review
**Project:** [name / address]
**Drawing Set:** [sheet list or revision date]
**Review Date:** [today]
**Reviewer:** [AI-assisted preliminary review — not a licensed engineer stamp]

---

## Summary

| Category | Critical | Major | Minor | Info |
|---|---|---|---|---|
| Cover / Index | | | | |
| General Notes | | | | |
| Foundation | | | | |
| Framing Plans | | | | |
| Sections / Elevations | | | | |
| Connection Details | | | | |
| Schedules | | | | |
| Lateral Consistency | | | | |
| Load Path | | | | |
| Code Indicators | | | | |
| **TOTAL** | | | | |

---

## Findings

### CRITICAL
[List each finding: Sheet / Detail reference → description of issue]

### MAJOR
[List each finding]

### MINOR
[List each finding]

### INFO
[List each finding]

---

## Recommended Next Steps

1. [Most urgent resolution]
2. [Second priority]
3. [Third priority]

---

*This review identifies completeness and consistency issues. It does not constitute a licensed engineering review and does not replace EOR responsibility.*
```

---

## Notes for use

- If drawings are provided as images or PDFs, work through each sheet systematically using the checklist above.
- If only partial drawings are available, note what sheets are missing and limit findings to what was reviewed — do not assume missing sheets are acceptable.
- Do not invent findings. If a checklist item cannot be verified (information not visible), mark it "Not verifiable from provided drawings" rather than pass or fail.
- When a finding references a code clause, cite the edition stated on the drawings — do not assume a code edition.
