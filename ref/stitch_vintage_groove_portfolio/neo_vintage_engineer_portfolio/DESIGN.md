---
name: Neo-Vintage Engineer Portfolio
colors:
  surface: '#131313'
  surface-dim: '#131313'
  surface-bright: '#393939'
  surface-container-lowest: '#0e0e0e'
  surface-container-low: '#1c1b1b'
  surface-container: '#201f1f'
  surface-container-high: '#2a2a2a'
  surface-container-highest: '#353534'
  on-surface: '#e5e2e1'
  on-surface-variant: '#c6c5d4'
  inverse-surface: '#e5e2e1'
  inverse-on-surface: '#313030'
  outline: '#908f9d'
  outline-variant: '#454652'
  surface-tint: '#bdc2ff'
  primary: '#bdc2ff'
  on-primary: '#1b247f'
  primary-container: '#1a237e'
  on-primary-container: '#8690ee'
  inverse-primary: '#4c56af'
  secondary: '#ffd245'
  on-secondary: '#3d2f00'
  secondary-container: '#e4b600'
  on-secondary-container: '#5d4900'
  tertiary: '#ffb2b6'
  on-tertiary: '#65061c'
  tertiary-container: '#64051c'
  on-tertiary-container: '#ed707c'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#e0e0ff'
  primary-fixed-dim: '#bdc2ff'
  on-primary-fixed: '#000767'
  on-primary-fixed-variant: '#343d96'
  secondary-fixed: '#ffe08a'
  secondary-fixed-dim: '#f0c115'
  on-secondary-fixed: '#241a00'
  on-secondary-fixed-variant: '#574400'
  tertiary-fixed: '#ffdadb'
  tertiary-fixed-dim: '#ffb2b6'
  on-tertiary-fixed: '#40000d'
  on-tertiary-fixed-variant: '#842131'
  background: '#131313'
  on-background: '#e5e2e1'
  surface-variant: '#353534'
typography:
  h1:
    fontFamily: Newsreader
    fontSize: 4.5rem
    fontWeight: '700'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  h2:
    fontFamily: Newsreader
    fontSize: 3rem
    fontWeight: '600'
    lineHeight: '1.2'
  h3:
    fontFamily: Newsreader
    fontSize: 2rem
    fontWeight: '500'
    lineHeight: '1.3'
  body-lg:
    fontFamily: Space Grotesk
    fontSize: 1.125rem
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Space Grotesk
    fontSize: 1rem
    fontWeight: '400'
    lineHeight: '1.5'
  technical-label:
    fontFamily: Space Grotesk
    fontSize: 0.75rem
    fontWeight: '600'
    lineHeight: '1'
    letterSpacing: 0.1em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  unit: 4px
  gutter: 24px
  margin: 48px
  container-max: 1200px
---

## Brand & Style
This design system bridges the tactile world of high-quality craftsmanship—specifically vintage denim and vinyl records—with the precision of modern software engineering. The brand personality is "The Articulate Craftsman": professional but soulful, technical but grounded in analog history.

The visual style is **Tactile / Skeuomorphic** with a focus on high-fidelity textures. It utilizes physical metaphors like stitched seams, grooved surfaces, and heavy paper stock to evoke a sense of permanence and quality. The goal is to move away from the "disposable" feel of modern web design toward a UI that feels like a cherished physical object.

## Colors
The palette is rooted in mid-century workwear and analog media. **Vinyl Black** serves as the primary background color, offering a high-gloss, deep canvas. **Deep Indigo** is used for structural elements, mimicking heavy denim. **Aged Paper White** provides high-contrast legibility for body text, avoiding the harshness of pure white.

**Mustard Yellow** and **Rust Red** are utilized for high-priority interactive elements and status indicators, reminiscent of vintage garment labels and warning stickers on record players.

## Typography
This design system employs a sophisticated contrast between **Newsreader** and **Space Grotesk**. 

**Newsreader** (Bold/Extra Bold) is used for headers to provide a literary, vintage editorial feel. Its sharp serifs suggest the ink-bleed of old press machines. 
**Space Grotesk** serves as the technical counter-balance. Its geometric construction handles body copy and metadata, providing the "digital precision" aspect of the Neo-Vintage aesthetic. 

Use wide letter-spacing for labels to mimic the stamped text found on vinyl run-out grooves.

## Layout & Spacing
The layout follows a **Fixed Grid** model to ensure that textural elements like "seams" and "grooves" align perfectly across different viewports. The grid is 12 columns with generous gutters to allow the textures space to breathe.

Padding should be used to simulate "fabric margins." For example, content blocks should be inset from their borders by at least 32px to allow for visible stitching effects on the periphery.

## Elevation & Depth
Depth is created through **Tactile Layering** rather than traditional drop shadows.
1. **Base Layer:** Vinyl Black with a subtle circular "groove" SVG pattern.
2. **Mid Layer:** Deep Indigo "denim" panels with a 1px inner highlight to suggest thickness.
3. **Top Layer:** Aged Paper "labels" or "tags" that appear pinned or stitched to the Indigo layer.

Use **Bold Borders** (2px) in Rust Red or Mustard Yellow to define interactive zones. For vinyl-inspired elements, use concentric radial gradients to simulate the way light hits a spinning record.

## Shapes
The shape language is a dichotomy of **Perfect Circles** and **Rough Rectangles**. 
- Buttons and cards use a **Soft (0.25rem)** radius to mimic the slightly worn edges of heavy fabric.
- Interactive controls and profile imagery should be **Perfectly Circular** (rounded-full) to reference vinyl records and turntable knobs.
- **Stitching:** Use dashed border-styles for internal dividers to mimic denim construction.

## Components
### Buttons (The "Rivets")
Buttons should feel like copper rivets or brass snaps. Use a circular shape for icons and a soft-edged pill for text. Give them a metallic gradient and a high-contrast Mustard Yellow hover state.

### Cards (The "Patch")
Project cards should look like leather or denim patches stitched onto the background. Use a dashed 1px border in a lighter indigo color. Add a "tag" in the top corner (Rust Red) for technology labels.

### Pentagon Radar Chart (The "Spindle")
The radar chart for skills should be designed like a turntable spindle. The axes are "grooves" in the vinyl, and the data area is a semi-transparent Deep Indigo fill with a Rust Red stroke. The center point should be a brass-colored circle.

### Interactive "Spin" Elements
Loading states or skill-meters should utilize a rotating animation. A "Now Playing" component for the current project should feature a spinning record sleeve that reveals tech-stack details as it rotates.

### Inputs (The "Inlay")
Input fields should look like "fill-in-the-blank" lines on a vintage equipment manual. Use a simple bottom-border in Aged Paper White, with a Mustard Yellow focus state.