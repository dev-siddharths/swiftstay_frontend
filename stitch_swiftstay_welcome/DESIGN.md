# Design System Document

## 1. Overview & Creative North Star: "The Modern Concierge"
The Creative North Star for this design system is **"The Modern Concierge."** We are moving away from the "grid-of-boxes" travel site cliché. Instead, we treat the digital interface as a high-end editorial magazine—spacious, authoritative, and tactfully curated. 

The system breaks the "template" look by using intentional white space (`spacing.20`), asymmetrical image clusters, and a dramatic contrast between the sharp, geometric **Manrope** display type and the functional **Inter** body face. We don't just show rooms; we frame experiences using layered surfaces and "ghost" elevations that feel like premium stationery.

---

## 2. Colors & Surface Architecture
Our palette transitions from the warmth of the sun (`primary`) to the grounded stability of earth tones (`outline`).

### The "No-Line" Rule
**Explicit Instruction:** Prohibit 1px solid borders for sectioning. Structural boundaries must be defined solely through background color shifts. For example, a search filtering bar (`surface-container-low`) should sit on the main page (`surface`) without a stroke.

### Surface Hierarchy & Nesting
Treat the UI as a series of physical layers. Depth is achieved by "stacking" the `surface-container` tiers:
*   **Base Layer:** `surface` (#fbf9f8) for the main canvas.
*   **Secondary Content:** `surface-container-low` (#f5f3f3) for subtle content grouping.
*   **Interactive Cards:** `surface-container-lowest` (#ffffff) to provide a "lifted" feel for clickable items.

### The Glass & Gradient Rule
To avoid a flat, "out-of-the-box" appearance:
*   **Signature Gradients:** Use a linear gradient from `primary` (#a93200) to `primary_container` (#d1430a) for primary CTAs. This provides a "soulful" depth that flat hex codes lack.
*   **Glassmorphism:** For floating headers or mobile navigation bars, use `surface` at 80% opacity with a `backdrop-blur` of 12px.

---

## 3. Typography: The Editorial Voice
We use typography to establish a hierarchy of trust.

*   **Display & Headlines (Manrope):** These are our "editorial" voices. Use `display-lg` for hero sections to create a sense of grandeur. The geometric nature of Manrope feels architectural and premium.
*   **Body & Titles (Inter):** Inter is our "functional" voice. It provides maximum legibility for room details and pricing. 
*   **The Contrast Rule:** Always pair a `headline-lg` (Manrope) with a `body-md` (Inter). The jump in scale and font-family creates an intentional, designer-led look rather than a generic template.

---

## 4. Elevation & Depth: Tonal Layering
We reject heavy, muddy shadows. Elevation is a whisper, not a shout.

*   **The Layering Principle:** Place a `surface-container-lowest` card on a `surface-container-low` section. The subtle difference in hex code creates a natural edge.
*   **Ambient Shadows:** If a floating element (like a "Book Now" sticky bar) requires a shadow, use a `12%` opacity version of `on-surface` (#1b1c1c) with a blur of `32px` and a Y-offset of `8px`. Avoid pure black shadows.
*   **The "Ghost Border" Fallback:** If accessibility requires a container edge, use `outline-variant` (#e2bfb4) at **15% opacity**. This creates a "breath" of a line rather than a hard wall.

---

## 5. Components

### Buttons
*   **Primary:** Gradient (`primary` to `primary_container`), `on-primary` text, `rounded-lg` (1rem).
*   **Secondary:** `secondary_container` background with `on-secondary_container` text. No border.
*   **States:** On hover, increase the gradient saturation. On press, scale the button to 0.98 for tactile feedback.

### Input Fields
*   **Structure:** Use `surface-container-low` as the background. 
*   **Focus State:** Shift background to `surface-container-lowest` and apply a 2px "Ghost Border" using `primary`.
*   **Labels:** Always use `label-md` in `on-surface-variant` positioned above the input.

### Cards & Property Lists
*   **The Rule:** Forbid divider lines.
*   **Separation:** Use `spacing.8` between cards. 
*   **Imagery:** Use `rounded-xl` (1.5rem) for property photos. Imagery should always be the focal point, bleed to the edges of the card, and use a subtle `surface-dim` inner glow to ensure "white-on-white" photos don't disappear.

### Date Pickers & Floating Modals
*   **Style:** Use the **Glassmorphism** rule. `surface` at 90% opacity, 20px blur, and a `surface-container-highest` subtle 1px "Ghost Border" (10% opacity).

---

## 6. Do’s and Don’ts

### Do:
*   **Use Asymmetry:** Place a `headline-lg` on the left with a `body-lg` description offset to the right to create editorial interest.
*   **Embrace the Orange:** Use the `primary` (#a93200) sparingly but impactfully—only for conversion points and brand-critical icons.
*   **Respect the Spacing:** When in doubt, add more space. Use `spacing.16` or `spacing.20` between major page sections.

### Don’t:
*   **No "Box-in-a-Box":** Avoid nesting a white card inside a grey box inside a white section. Use tonal shifts instead.
*   **No High-Contrast Dividers:** Never use a dark grey line to separate content. Use a `surface-container` background change or `spacing.12`.
*   **No Standard Shadows:** Never use the default "Drop Shadow" settings in design tools. Always tint the shadow with the brand’s `on-surface` color.

### Accessibility Note:
Ensure that `on-surface-variant` text on `surface` backgrounds maintains a 4.5:1 contrast ratio. When using the `primary` orange for text, ensure it is only used at `title-lg` sizes or larger to maintain legibility.