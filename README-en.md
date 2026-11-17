# Yuukun Portfolio

Engineer portfolio prototypes and design review artifacts.

## Adopted Design

On November 17, 2026, the Japanese [Issue #18 design](prototypes/issue-18-design-review.html), with its Rauno-inspired refinement, was approved. The initial layout uses a profile summary, three featured projects, and a horizontal integration project. The HTML includes its images, styles, and scripts and can be opened directly in a browser.

Previous proposals remain available from [the prototype index](index.html) and [the design history](prototypes/README.md). The approved design is implemented in Next.js. Profile and project content taken from the reference images remains a draft pending fact checking.

## Directory Structure

- `index.html`: prototype launcher
- `prototypes/issue-18-design-review.html`: adopted Japanese design
- `prototypes/issue-18-image-base.html`: earlier image-based design before the Rauno refinement
- `prototypes/issue-5-design-review.html`: seasonal proposals and the Rauno-inspired poster gallery
- `prototypes/issue-5-design-review-round1.html`: first three design proposals
- `prototypes/v1/`: first portfolio mock
- `prototypes/v2/`: archived prototype corresponding to the existing implementation
- `assets/images/`: shared image assets
- `references/`: imported reference UI, screenshots, and design notes
- `docs/requirements.md`: authoritative Japanese requirements and design decisions
- `README.md`: Japanese README

## Current Focus

Use `prototypes/issue-18-design-review.html` as the adopted visual reference. Keep previous proposals as design history.

Run `npm ci` and `npm run dev` to open the implementation. The homepage, searchable project archive at `/projects/`, and four project details at `/projects/[id]/` share the adopted design. The ten-axis experience matrix is available in the capabilities section. Run `npm test` (Node.js 22.18+), `npm run typecheck`, and `npm run build` to verify. Serve the static `out/` directory to inspect the production build. Do not run the development server and production build simultaneously.

Open `index.html` in a browser to choose the adopted HTML design or a previous proposal. Confirm the real profile, skills, experience, projects, and contact links before publication.
