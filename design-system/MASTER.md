# 11to11 Design System Master Specification
**Document**: `design-system/MASTER.md`  
**Brand**: 11to11 (Contemporary Indian Luxury & Ready-to-Wear Atelier)  
**Target Market**: Indian Metros & Contemporary Global Consumers  
**Aesthetic Profile**: Haute Editorial Minimalism, Swiss Typographic Discipline, Architectural Tailoring  
**Version**: 1.0.0 — Production Specification  

---

## 1. Brand Visual Language
11to11 embodies modern Indian sartorial excellence—an intersection of architectural silhouette, artisanal textile heritage (mulberry silk, wild tussar, double-faced cashmere, handwoven organza), and restrained contemporary luxury.

- **Tone of Voice**: Understated, confident, editorial, discerning, trustworthy.
- **Visual Tenets**:
  - **Imagery Primacy**: Generous aspect ratios (3:4 portrait editorial photography), uncropped textile texture, minimal UI chrome overlay.
  - **Architectural Restraint**: Zero bubbly pill shapes, zero gratuitous drop shadows, zero cartoonish gradients. Precision 0px–2px razor-edge geometry with hairline dividers (`1px solid #E8E3DA`).
  - **Editorial Typography**: High-contrast pairing of an authoritative serif (`Playfair Display` & `Cinzel`) with a pristine Swiss sans-serif (`Inter`) for micro-copy and data tables.
  - **Indian Contextual Dignity**: Cultured references to indigenous loom artistry, transparent INR (`₹`) pricing, GST inclusion, pincode delivery guarantees, and seamless UPI / card checkout.

---

## 2. Color Palette & Token Architecture
The palette adheres to the UI/UX Pro Max *Luxury E-Commerce & Minimalist Monochrome* profile: an anchor of rich onyx black, warm parchment surfaces, and understated metallic champagne gold.

```
       [Noir Onyx] #111111  ───  Primary Brand Depth
       [Warm Alabaster] #FAF9F5  ───  Store Canvas Background
       [Champagne Atelier] #D4AF37  ───  Privilege & Craft Accent
       [Editorial Taupe] #6E6862  ───  Secondary Hierarchy
       [Hairline Muted] #E8E3DA  ───  Architectural Boundary
```

### CSS Variables Definition (`globals.css` / Tailwind tokens)
```css
:root {
  /* Surface & Canvas */
  --color-canvas-bg: #FAF9F5;          /* Warm alabaster primary background */
  --color-canvas-surface: #FFFFFF;     /* Pristine white for cards & drawers */
  --color-canvas-subtle: #F3EFEA;      /* Warm secondary panel & table rows */
  --color-canvas-dark: #111111;        /* Deep onyx night canvas */
  --color-canvas-dark-surface: #1A1A1A;/* Elevated dark surface */

  /* Ink & Typography */
  --color-ink-primary: #111111;        /* 98% deep black for maximum contrast */
  --color-ink-secondary: #6E6862;      /* Editorial neutral body & details */
  --color-ink-muted: #9E968D;          /* Micro-copy, metadata, breadcrumbs */
  --color-ink-inverse: #FAF9F5;        /* Light text on dark surfaces */
  --color-ink-accent: #A16207;         /* High-contrast accessible gold ink */

  /* Accents & Privilege */
  --color-accent-gold: #D4AF37;        /* Champagne gold metallic accent */
  --color-accent-gold-light: #F3E5AB;  /* Subdued gold hover background */
  --color-accent-gold-dark: #9E8024;   /* Darkened gold for accessible text */

  /* Architectural Hairlines */
  --color-border-hairline: #E8E3DA;    /* Hairline border for light mode */
  --color-border-subtle: #D8D2C7;      /* Active / hover border line */
  --color-border-dark: #2A2A2A;        /* Hairline border for dark mode */

  /* Functional & Status Signals */
  --color-status-success: #15803D;     /* In-stock, order confirmed */
  --color-status-warning: #B45309;     /* Low stock alert (<3 items left) */
  --color-status-error: #B91C1C;       /* Validation failure, sold out */
  --color-status-info: #1D4ED8;        /* Shipping update & dispatch info */
}
```

---

## 3. Primary / Secondary / Accent Colors
- **Primary**: `#111111` (Noir) — used for primary navigation, headings, primary CTA buttons, active state toggles.
- **Secondary**: `#FAF9F5` (Alabaster) & `#F3EFEA` (Warm Stone) — provides breathing room, preventing the clinical coldness of harsh pure white `#FFFFFF` across expansive layouts.
- **Accent**: `#D4AF37` (Champagne Gold) — used with extreme restraint (announcement ticker bar, atelier signature badges, wishlist active star, checkout step highlights). Never used as a full-screen saturated background.

---

## 4. Background and Surface Colors
- **App Canvas**: `#FAF9F5`
- **Product Card Background**: `#FFFFFF` or neutral photo backdrop `#F2EFEB`
- **Sticky Header Background**: Solid `#FAF9F5` (Alabaster) with hairline bottom border `1px solid #E8E3DA` (no glassmorphism/blur); transparent when resting at top of hero.
- **Dark Editorial Sections**: `#111111` with text `#FAF9F5`

---

## 5. Text Colors & Contrast Ratios
Compliant with WCAG 2.1 AA and AAA thresholds:
- `#111111` on `#FAF9F5`: Contrast ratio **17.2:1** (Passes AAA)
- `#6E6862` on `#FAF9F5`: Contrast ratio **5.1:1** (Passes AA for body text)
- `#9E8024` (Dark Gold) on `#FFFFFF`: Contrast ratio **4.8:1** (Passes AA)
- `#FAF9F5` on `#111111`: Contrast ratio **17.2:1** (Passes AAA)

---

## 6. Border Colors & Line Weights
- **Hairline Border**: `1px solid #E8E3DA`
- **Active Focus Ring**: `1px solid #111111` with `outline: 2px solid rgba(17, 17, 17, 0.2)`
- **Separators**: `1px solid rgba(17, 17, 17, 0.08)`
- **Card Framing**: No thick borders; clean zero-width or 1px hairline divider.

---

## 7. Typography System
Pairing classical high-fashion serif with pristine geometric sans-serif:
- **Display & Headings**: `Playfair Display` (Serif) & `Cinzel` (Monogram & Brand Emblem)
- **Body & Controls**: `Inter` (Sans-Serif)
- **Monospace & Metadata**: `JetBrains Mono` or tabular `Inter` for order IDs, SKUs, pincodes.

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;600;700&family=Inter:wght@300;400;500;600;700&family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400;1,600&display=swap" rel="stylesheet">
```

---

## 8. Heading Hierarchy
| Level | Font Family | Size (Mobile) | Size (Desktop) | Weight | Line Height | Tracking | Transform |
|-------|-------------|---------------|----------------|--------|-------------|----------|-----------|
| **Display Hero** | Playfair Display | 36px | 64px | 400 | 1.05 | -0.02em | Normal / Italic accent |
| **H1 (Page Title)** | Playfair Display | 28px | 44px | 500 | 1.15 | -0.01em | Normal |
| **H2 (Section)** | Playfair Display | 22px | 32px | 500 | 1.25 | 0.02em | Normal |
| **H3 (Sub-Section)**| Inter / Playfair| 16px | 20px | 600 | 1.35 | 0.04em | Normal |
| **Kicker / Eyebrow**| Inter | 10px | 11px | 600 | 1.4 | 0.24em | UPPERCASE |

---

## 9. Body Typography
| Role | Size | Weight | Line Height | Tracking | Usage |
|------|------|--------|-------------|----------|-------|
| **Body Large** | 16px | 400 | 1.65 | 0em | Editorial stories, intro paragraphs |
| **Body Default** | 14px | 400 | 1.6 | 0em | Product descriptions, reviews, specifications |
| **Body Small** | 12px | 400 | 1.5 | 0.02em | Secondary notes, shipping estimates, terms |
| **Caption / Meta** | 11px | 500 | 1.4 | 0.08em | Timestamps, tags, SKU identifiers |
| **Button / Label** | 11px / 12px | 500 / 600 | 1.0 | 0.20em | UPPERCASE interactive CTAs |

---

## 10. Font Pairing Rules
- **Rule 1**: Headlines, product titles, and editorial quotes use `Playfair Display`.
- **Rule 2**: Brand mark uses `Cinzel` with ultra-tracking (`0.28em`).
- **Rule 3**: All navigation links, filter options, buttons, inputs, checkout forms, and prices use `Inter` with tabular numbers (`font-feature-settings: 'tnum'`) for monetary alignment.

---

## 11. Font Weights
- `300` (Light): Fine editorial citations and quote subtitles.
- `400` (Regular): Standard body copy and product descriptions.
- `500` (Medium): Interactive links, form inputs, button text.
- `600` (Semi-bold): Price figures, filter active states, section kickers.
- `700` (Bold): Sparingly on high-impact accents or brand emblem.

---

## 12. Spacing Scale (8dp Rhythm)
Strictly follow 4px/8px modular rhythm:
- `space-1`: 4px
- `space-2`: 8px
- `space-3`: 12px
- `space-4`: 16px
- `space-5`: 20px
- `space-6`: 24px
- `space-8`: 32px
- `space-10`: 40px
- `space-12`: 48px
- `space-16`: 64px
- `space-20`: 80px
- `space-24`: 96px
- `space-32`: 128px

---

## 13. Container Widths
- **Full Bleed Media**: `100vw` (Hero runways, editorial lookbooks)
- **Container Max**: `1440px` (Main store canvas)
- **Content Reading Width**: `720px` (Product story, size guide, policy)
- **Checkout Narrow Canvas**: `980px` (Distraction-free checkout container)
- **Horizontal Page Gutter**:
  - Mobile: `16px`
  - Tablet (640px–1024px): `32px`
  - Desktop (1024px+): `48px` to `64px`

---

## 14. Grid System
- **Product Listing Grid**:
  - Mobile (<640px): 2 columns, gap `12px`
  - Tablet (640px–1024px): 3 columns, gap `20px`
  - Desktop (1024px+): 4 columns, gap `28px`
- **PDP Layout**:
  - Desktop: 7-column gallery / 5-column sticky purchase rail
  - Mobile: Full-width swipeable gallery / stacked order drawer

---

## 15. Border Radius Rules
- **Rule**: Standard is **0px** (sharp architectural edge) or subtle **2px** for inputs/buttons.
- Absolutely **NO** generic bubbly 12px–24px rounded corners.
- Avatar / Color swatches: Clean circular `50%` or square with 1px border.

---

## 16. Shadows & Elevation
In haute fashion ecommerce, elevation is conveyed through white space, crisp layering, and hairlines rather than heavy drop shadows:
- **Base Surfaces**: No shadow (`box-shadow: none`).
- **Floating Header / Quick Action**: `0 4px 20px -2px rgba(17, 17, 17, 0.04)`
- **Drawer / Modal**: `0 24px 60px rgba(0, 0, 0, 0.16)`
- **Dropdown Menu**: `0 12px 32px -4px rgba(17, 17, 17, 0.08)` with `1px solid #E8E3DA`

---

## 17. Buttons
All buttons use uppercase typography with wide letter spacing (`0.18em` to `0.22em`):
1. **Primary Button (`btn-luxury-dark`)**:
   - Background: `#111111`
   - Color: `#FAF9F5`
   - Border: `1px solid #111111`
   - Hover: Background `#FAF9F5`, text `#111111`, border `#111111`
   - Padding: `16px 32px` (Min height 48px)
2. **Secondary Button (`btn-luxury-outline`)**:
   - Background: `transparent`
   - Color: `#111111`
   - Border: `1px solid #111111`
   - Hover: Background `#111111`, text `#FAF9F5`
3. **Gold Accent Button (`btn-luxury-gold`)**:
   - Background: `#D4AF37`
   - Color: `#111111`
   - Border: `1px solid #D4AF37`
   - Hover: Background `#111111`, text `#D4AF37`
4. **Text / Underline Link**:
   - Clean hairline underline offset `6px`, expanding on hover.

---

## 18. Inputs & Form Controls
- Understated architectural border: `1px solid #E8E3DA`
- Height: `48px` (comfortable 44pt+ touch target)
- Padding: `12px 16px`
- Background: `#FFFFFF`
- Focus State: `border-color: #111111`, outline none.
- Label: Floating or sticky uppercase `10px` tracking `0.18em` in `#6E6862`.
- Error State: `border-color: #B91C1C`, inline error message with warning icon.

---

## 19. Product Cards
- **Aspect Ratio**: `3:4` vertical portrait ratio.
- **Image Behavior**: Smooth cross-fade to hover image (350ms ease).
- **Badge**: Minimalist pill/strip at top-left (`Atelier Signature`, `Pure Silk`, `New Season`).
- **Wishlist Action**: Top-right floating button with subtle circular background, accessible icon toggle.
- **Content Area**:
  - Category / Collection eyebrow (`10px`, `#6E6862`, uppercase tracking `0.2em`)
  - Product Title (`Playfair Display`, `15px`, `#111111`)
  - Price block: `₹48,500` with optional compare-at strikethrough in `#9E968D`.
  - Color Swatches: Miniature 12px circles with hairline border.
  - Quick-Size Bar: Appears cleanly on hover on desktop, or tap on mobile.

---

## 20. Navigation
- Sticky top navigation: Transparent when over hero; transitions cleanly to solid Alabaster (`#FAF9F5`) with a 1px hairline border (`#E8E3DA`) on scroll.
- Hierarchy: Clean focused categories (e.g., *Collections, Women, Men, Outerwear, Silk Atelier*). Use streamlined dropdown menus; do not force complex mega-menus unless the catalog taxonomy expands to justify them.
- Secondary utility actions: Search trigger, Order Tracker / Account, Wishlist counter, Shopping Bag drawer trigger.

---

## 21. Header
- Top announcement bar (`#111111`, gold text `#D4AF37`, 10px tracking `0.24em`). Content configured dynamically.
- Desktop Header: Centered symmetrical monogram logo (`11 11 / Atelier Édition`), left-aligned category navigation, right-aligned utility icons.
- Mobile Header: Left hamburger menu, centered brand logo, right search + cart icons. High-contrast, no glass blur.

---

## 22. Footer
- Deep onyx `#111111` background or rich warm parchment `#F3EFEA`.
- Structured in 5 columns:
  1. Brand manifesto & Atelier craftsmanship credentials
  2. The Collections (Navigation links)
  3. Client Care (Shipping & Returns, Pincode Delivery, Care Guide, Size Matrix)
  4. Legal & Transparency (GST details, Luxury Authenticity Guarantee)
  5. The 11to11 Dispatch Newsletter (Exclusive collection drop invites)
- Bottom bar: Currency display (`INR - Indian Rupee ₹`), payment badges (UPI, RuPay, Visa, Mastercard, NetBanking), copyright.

---

## 23. Badges
- Ultra-subtle, uppercase `9px` or `10px` tracking `0.2em`:
  - `Signature`: Gold outline on cream background.
  - `Sale / Privilege`: Deep onyx with white text.
  - `Low Stock`: Warm amber text with subtle dot indicator.
  - `Sold Out`: Muted grey background with strikethrough notation.

---

## 24. Toasts & Feedback
- Position: Bottom-right (desktop) or top-center (mobile).
- Style: Solid black `#111111` with white text, 1px gold border.
- Duration: 3500ms with slide & fade-in (250ms).
- Provides immediate tactile confirmation ("Item added to Atelier Bag", "Wishlist updated").

---

## 25. Modals & Dialogs
- Backdrop: `rgba(17, 17, 17, 0.65)` with backdrop-blur.
- Container: Centered, max-width `540px` (Size Guide / Auth), razor 0px radius, 1px hairline border.
- Accessible focus trapping and escape key dismissal.

---

## 26. Drawers
- **Cart Bag Drawer**: Right-hand slide-out (`width: 440px` max, 100vw on mobile).
- **Filter Drawer**: Left-hand slide-out on mobile for category refinement.
- Animation: Smooth ease-out bezier `cubic-bezier(0.16, 1, 0.3, 1)` in 300ms.

---

## 27. Dropdowns & Selects
- Custom styled with pristine typography and checkmark indicators.
- Keyboard navigable (`ArrowDown`, `ArrowUp`, `Enter`, `Escape`).

---

## 28. Tabs
- Understated horizontal rail with 1px hairline bottom line.
- Active tab has a 2px black underline that transitions smoothly.

---

## 29. Breadcrumbs
- `Home / Collections / Ready-to-Wear / The Sovereign Silk Trench`
- Delimiter: Fine forward slash `/` with `#9E968D` text.

---

## 30. Loading States
- Minimalist hairline progress bar at top of screen during route navigation.
- Subtle opacity pulse (70% to 100%) on action buttons during submission.

---

## 31. Empty States
- Editorial and encouraging:
  - Empty Bag: "Your Atelier Bag is currently empty. Explore our Autumn / Winter Collection." with a primary CTA button.
  - Empty Wishlist: "Save your favorite runway pieces to curate your seasonal wardrobe."

---

## 32. Error States
- Clear, respectful, non-technical copy.
- Form inputs highlight with `#B91C1C` hairline border and inline helpful instruction.

---

## 33. Skeleton Loading
- Shimmer gradient matching warm alabaster tones (`#F3EFEA` to `#FAF9F5` to `#F3EFEA`).
- Maintains exact aspect ratios (3:4 for images) to prevent cumulative layout shift (CLS 0).

---

## 34. Mobile Navigation & Bottom Bar
- Sticky bottom action bar on Product Details Page:
  - Displays product title, price in INR, and sticky "Add to Atelier Bag" button.
- Clean mobile drawer navigation with high touch targets (min 48px height) and collapsible subcategories.

---

## 35. Accessibility Rules (WCAG 2.1 AA Compliant)
- Contrast ratio >= 4.5:1 for all regular body copy; >= 3.0:1 for large display titles.
- Touch targets >= 44x44px for all mobile interactive elements.
- Semantic HTML tags (`<header>`, `<nav>`, `<main>`, `<article>`, `<aside>`, `<footer>`).
- Form inputs have associated `<label>` or explicit `aria-label`.
- Product images have descriptive `alt` text detailing silhouette, fabric, and color.
- Fully keyboard operable with visible focus ring.

---

## 36. Responsive Breakpoints
- `sm`: 640px (Phones in landscape, small tablets)
- `md`: 768px (Tablets)
- `lg`: 1024px (Laptops & compact desktop)
- `xl`: 1280px (Standard desktop)
- `2xl`: 1440px (High-resolution editorial display)

---

## 37. Animation & Motion Rules
- Easing: Luxury smooth bezier `cubic-bezier(0.16, 1, 0.3, 1)`.
- Durations:
  - Micro-interactions (button hover, color swatch): `180ms`
  - Drawer / Modal transition: `300ms`
  - Image cross-fade & gallery slide: `350ms`
- Honors `prefers-reduced-motion: reduce` by degrading to instant transitions.

---

## 38. Interactive States Matrix
| Element | Default | Hover | Active / Pressed | Focus (Keyboard) | Disabled |
|---------|---------|-------|------------------|------------------|----------|
| **Primary Button** | `#111` bg, `#FAF9F5` text | `#FAF9F5` bg, `#111` text, 1px border | `#2A2A2A` bg | 2px black outline offset 2px | Opacity 0.4, cursor not-allowed |
| **Outline Button** | Transparent bg, 1px `#111` | `#111` bg, `#FAF9F5` text | `#2A2A2A` bg | 2px black outline offset 2px | Opacity 0.4, cursor not-allowed |
| **Product Card** | 3:4 portrait, neutral border | Image 2 cross-fade, subtle 2px y-lift | Quick view tap | Outline on focused link | N/A |
| **Input Field** | 1px `#E8E3DA`, white bg | 1px `#6E6862` | 1px `#111` | 1px `#111`, outline 2px `#11111122` | `#F3EFEA` bg, muted text |
| **Color Swatch** | 16px circle, 1px border | Scale 1.15, ring preview | Selected dot or outer ring | Focus ring | Strikethrough diagonal |
