# M.A. Handyman Services — Site Redesign

**Date:** 2026-05-15
**Author:** Sheldon Pierce
**Status:** Approved design, ready for implementation plan

## Goal

Redesign the existing single-page Next.js site for M.A. Handyman Services so it works as a strong portfolio piece while remaining a believable local-service landing page. The site is no longer serving a live client, so design freedom is full; copy and imagery should still read as a real business.

## Constraints

- Stay on Next.js 14 with the existing `pages/` router.
- Keep the existing `/api/sendEmail` nodemailer route — only the form's calling code changes.
- Use the existing `/public/main.jpeg` as the only photographic asset. No new photos.
- Deploy via a feature branch + PR (Vercel will produce a preview URL). Do not push directly to `main`.

## Architectural Approach

**Drop Chakra UI; rebuild on Tailwind alone.**

The current code mixes Chakra components (`Box`, `Text`, `Button`, modals) with Tailwind utility classes on the same elements, which is the most visible code-quality issue for a portfolio reviewer. Removing Chakra also reduces the bundle and lets the new design system live cleanly in `tailwind.config.ts`.

- Remove dependencies: `@chakra-ui/react`, `@emotion/react`, `@emotion/styled`.
- Keep dependencies: `framer-motion` (subtle scroll entrances), `react-social-icons` (Facebook link), `nodemailer` (contact API).
- Keep TypeScript, Next.js `pages/` router, the existing `_app.tsx` / `_document.tsx` shells (Chakra `ChakraProvider` removed from `_app.tsx` if present).
- New folder: `components/` at the project root.

## Design System

**Palette** (added to `tailwind.config.ts` as theme extension):

| Token | Hex | Use |
|---|---|---|
| `cream` | `#FDF8EF` | Page background |
| `sand` | `#F5E6C8` | Section background (Services) |
| `ink` | `#1C1917` | Headlines, primary text, Contact section bg |
| `stone` | `#57534E` | Body text |
| `rust` | `#C2410C` | Primary CTA, accent labels |
| `amber` | `#FBBF24` | Accent on dark contact section |
| `white` | `#FFFFFF` | Card surfaces |

**Typography** (loaded via `next/font/google`):

- Display: **Fraunces** (serif, weight 500–700) — headlines, section titles, brand mark.
- UI: **Inter** (sans, weight 400–700) — body, buttons, form, nav, eyebrow labels.

**Motion:** Subtle. Use `framer-motion`'s `whileInView` for a single `opacity 0→1, y 16→0, duration 0.5` entrance per section. Hover transitions are CSS (`transition` utility classes). No parallax, no scroll-linked effects.

## Page Structure

```
<Layout>
  <Nav />        ← sticky, transparent over cream
  <Hero />       ← cream bg, headline + main.jpeg + dual CTA
  <Services />   ← sand bg, 6-tile grid with emoji icons
  <About />      ← cream bg, centered text-only
  <Contact />    ← ink bg, dark inline form + contact details
  <Footer />     ← cream bg, copyright + designer credit
</Layout>
```

Mobile: every grid collapses to one column. Nav becomes a hamburger that opens a slide-down menu (no full off-canvas).

## Components

Each component lives in `components/<name>.tsx`. All are small, focused, and presentational (the only stateful piece is `Contact` because of the form).

### `Layout.tsx`
Wraps page content with `<Nav>` and `<Footer>`. Sets `min-h-screen bg-cream font-sans text-stone`. Used in `pages/index.tsx`.

### `Nav.tsx`
- Brand mark (Fraunces, "M.A. Handyman") on the left.
- Right side: text links `Services`, `About`, `Contact` (smooth-scroll to anchors) + a primary `Get a quote` button (also scrolls to Contact).
- Mobile: links collapse into a hamburger; opens a simple dropdown panel.
- Sticky top with a subtle box-shadow that appears after 20px of scroll (detected via a scroll listener / IntersectionObserver).

### `Hero.tsx`
- Two-column grid on desktop; stacked on mobile.
- Left: eyebrow label "Serving Kirkland, WA" (uppercase, rust, tracked); headline "Your neighbor for honest home repairs." (Fraunces, large, ink, tight tracking); supporting paragraph (Inter, stone); two CTAs — primary rust "Request a quote" (scrolls to Contact), secondary outlined ink "See services" (scrolls to Services).
- Right: `next/image` of `/main.jpeg`, rounded `lg`, sized responsively.

### `Services.tsx`
- Eyebrow "What I do"; title "Repairs & installs for the whole home".
- 3-col grid (md), 2-col (sm), 1-col (xs). 6 tiles:
  1. **Carpentry** — Trim, doors, shelving, repairs to wood structures.
  2. **Painting** — Interior & exterior. Clean lines, careful prep.
  3. **Plumbing fixes** — Faucets, toilets, leaks, simple replacements.
  4. **Electrical** — Fixture swaps, outlets, light installs.
  5. **Assembly & mounts** — Furniture, TVs, shelving, anything boxed.
  6. **General repairs** — If something's broken and you don't know who to call.
- Each tile: white card, small rounded icon badge (emoji on cream background), Fraunces title, Inter description.
- Subtle hover: lift `translate-y-[-2px]`, ring transition.

### `About.tsx`
- Eyebrow "Meet Michael"; title "Local. Reliable. Particular about good work."
- Centered single column, max-width `prose`, on cream.
- Body copy (placeholder, swap freely):
  > Michael Aguilar has been doing home repair work in the Kirkland area for 8 years. He answers his own phone, shows up when he says he will, and treats every house like it's his own. Free quotes, no nonsense, and references on request.
- No portrait photo.

### `Contact.tsx`
- Ink background, cream text. Two columns on desktop; stacked on mobile.
- Left: eyebrow "Get a quote" (amber); headline "Let's talk about your project." (Fraunces); supporting paragraph; contact details list:
  - Phone: `(425) 555-0123` (placeholder — Kirkland area code, reserved-for-fiction range)
  - Email: `contact@mahandyman.com` (placeholder)
  - Location: "Kirkland, WA & nearby"
  - Facebook icon link (existing `react-social-icons` URL).
- Right: dark card containing the **inline form**. Same fields as the current modal: name, phone number, email, address, project description, three contact-method checkboxes (phone / email / text). Same `POST /api/sendEmail` call. Same success/error feedback — but render inline beneath the form (a small status banner), not as a Chakra modal.
- Replaces `formModal.tsx` and `alertModal.tsx`. Both files are deleted.

### `Footer.tsx`
- Updated from existing `pages/footer.tsx`.
- Copyright `© 2026 M.A. Handyman Services`, designer credit linking to LinkedIn, small Facebook icon.
- Tailwind classes only; no Chakra.

## Form Behavior (Contact section)

State and submission logic move from `pages/index.tsx` into `Contact.tsx`. The form data shape stays compatible with `/api/sendEmail`:

```ts
type InquiryForm = {
  name: string;
  number: string;
  email: string;
  address: string;
  serviceInfo: string;
  phone: boolean;
  emailCheck: boolean;
  text: boolean;
};
```

Submission states:
- `idle` — default; submit button reads "Send inquiry".
- `submitting` — button disabled with a spinner; reads "Sending…".
- `success` — form replaced with a thank-you message and a "Send another" link.
- `error` — small inline error banner above the submit button with a retry hint.

Validation: required fields are `name`, `email` (basic regex), and `serviceInfo`. Use the browser's native required + email validation; supplement with one custom check that at least one contact method checkbox is selected.

## File Plan

**Add:**
- `components/Layout.tsx`
- `components/Nav.tsx`
- `components/Hero.tsx`
- `components/Services.tsx`
- `components/About.tsx`
- `components/Contact.tsx`
- `components/Footer.tsx`

**Modify:**
- `pages/index.tsx` — slim to `<Layout><Hero/><Services/><About/><Contact/></Layout>`.
- `pages/_app.tsx` — remove Chakra `ChakraProvider`; load Fraunces + Inter via `next/font/google`.
- `pages/_document.tsx` — no change unless font loading requires it.
- `tailwind.config.ts` — extend theme with palette tokens, font families, container settings.
- `styles/globals.css` — remove Chakra-related leftovers; keep `@tailwind` directives.
- `package.json` — remove `@chakra-ui/react`, `@emotion/react`, `@emotion/styled`. Keep `framer-motion`, `react-social-icons`, `nodemailer`.

**Delete:**
- `pages/footer.tsx` → moved to `components/Footer.tsx`.
- `pages/formModal.tsx` → replaced by inline form in `Contact.tsx`.
- `pages/alertModal.tsx` → replaced by inline status banner.

**Unchanged:**
- `pages/api/sendEmail.ts`
- `pages/api/hello.ts`
- `public/main.jpeg`, `public/favicon.ico`

## Placeholder Values (Safe to Swap Later)

- Phone in Contact: `(425) 555-0123` — uses the Kirkland area code and the reserved-for-fiction `555-01xx` range, so it won't ring any real person.
- Email in Contact: `contact@mahandyman.com` — plausible but no real mailbox.
- The "8 years" stat in About is set per user direction.

## Out of Scope

- Multi-page routes (Gallery, Service Area, FAQ) — agreed to be cut to keep the page lean.
- Real photography beyond `main.jpeg`.
- Migration to the `app/` router.
- Test suite — site is small and presentational; manual browser testing is the verification path.
- Production deploy. Implementation ends at a feature branch + PR with a Vercel preview URL.

## Verification

After implementation:
1. `npm run dev` and browse every section on desktop and mobile widths.
2. Submit the inline form against the real `/api/sendEmail` (uses `.env.local` creds) — confirm success and error states render inline.
3. `npm run build` succeeds with no type or lint errors.
4. Lighthouse on the preview URL — flag any regression below 90 on Performance, Accessibility, Best Practices, SEO.
