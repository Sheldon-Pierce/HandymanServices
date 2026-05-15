# Handyman Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild the single-page M.A. Handyman Services site with a warm cream/ink/rust design system on Tailwind alone (no Chakra), then ship via a feature-branch PR.

**Architecture:** Drop `@chakra-ui/react` + Emotion. Add a small set of focused presentational components under `components/`. Keep Next 14 `pages/` router and the `/api/sendEmail` nodemailer route untouched. State (form) lives only inside `Contact.tsx`.

**Tech Stack:** Next.js 14 (pages router), TypeScript, Tailwind CSS, framer-motion (subtle scroll entrances), nodemailer (existing API), react-social-icons (Facebook link), Fraunces + Inter via `next/font/google`.

**Verification approach:** This project has no test suite. Each task's verification is one of: a successful `npm run build`, a manual visual check at `npm run dev`, or a confirmed git state. The spec calls this out explicitly.

**Reference spec:** `docs/superpowers/specs/2026-05-15-handyman-redesign-design.md`

---

## Task 1: Create the feature branch

**Files:** none — git operation only.

- [ ] **Step 1: Confirm clean working tree (except the pre-existing formModal change)**

Run: `git status`
Expected: `main` branch, only `pages/formModal.tsx` modified (this is pre-existing, leave it alone).

- [ ] **Step 2: Create and switch to feature branch**

Run: `git checkout -b redesign-2026-05`
Expected: `Switched to a new branch 'redesign-2026-05'`

- [ ] **Step 3: Stash the pre-existing formModal change so it doesn't get caught up**

Run: `git stash push -m "pre-existing formModal change" pages/formModal.tsx`
Expected: `Saved working directory and index state On redesign-2026-05: pre-existing formModal change`

(We will not pop this stash. `formModal.tsx` is being deleted in this redesign; the stashed work is preserved if needed later.)

---

## Task 2: Extend Tailwind config with the design system

**Files:**
- Modify: `tailwind.config.ts`

- [ ] **Step 1: Replace `tailwind.config.ts` contents**

```ts
import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        cream: '#FDF8EF',
        sand:  '#F5E6C8',
        ink:   '#1C1917',
        rust:  '#C2410C',
      },
      fontFamily: {
        display: ['var(--font-display)', 'Georgia', 'serif'],
        sans:    ['var(--font-sans)', 'system-ui', '-apple-system', 'sans-serif'],
      },
      maxWidth: {
        container: '72rem',
      },
    },
  },
  plugins: [],
};
export default config;
```

Custom colors are kept minimal — body text uses Tailwind's built-in `stone-*` scale (e.g., `text-stone-600` on cream; `text-stone-300` on ink). Amber accent uses built-in `amber-400`.

- [ ] **Step 2: Sanity-check by running the type-checker**

Run: `npx tsc --noEmit`
Expected: no errors. (If `tsc` is missing flags, `npm run build` later will catch issues.)

- [ ] **Step 3: Commit**

```bash
git add tailwind.config.ts
git commit -m "feat(theme): extend Tailwind with cream/ink/rust palette + font vars"
```

---

## Task 3: Wire up Fraunces + Inter fonts, strip Chakra from `_app.tsx`

**Files:**
- Modify: `pages/_app.tsx`

- [ ] **Step 1: Replace `pages/_app.tsx` contents**

```tsx
import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { Fraunces, Inter } from 'next/font/google';

const fraunces = Fraunces({
  subsets: ['latin'],
  weight: ['500', '600', '700'],
  variable: '--font-display',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-sans',
  display: 'swap',
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <div className={`${fraunces.variable} ${inter.variable}`}>
      <Component {...pageProps} />
    </div>
  );
}
```

Notes: removed `reset.css` import (will be deleted in Task 4), removed `ChakraProvider`. The CSS variables are consumed by `tailwind.config.ts`.

- [ ] **Step 2: Commit**

```bash
git add pages/_app.tsx
git commit -m "feat(app): remove ChakraProvider, load Fraunces + Inter via next/font"
```

---

## Task 4: Clean up `globals.css` and delete `reset.css`

**Files:**
- Modify: `styles/globals.css`
- Delete: `styles/reset.css`

- [ ] **Step 1: Replace `styles/globals.css` contents**

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

html {
  scroll-behavior: smooth;
}

body {
  font-feature-settings: 'cv11', 'ss01';
}
```

Tailwind's `preflight` (included by `@tailwind base`) replaces the hand-written reset. The `font-feature-settings` toggle gives Inter slightly nicer letterforms.

- [ ] **Step 2: Delete the old reset file**

Run: `git rm styles/reset.css`
Expected: `rm 'styles/reset.css'`

- [ ] **Step 3: Commit**

```bash
git add styles/globals.css
git commit -m "feat(styles): rely on Tailwind preflight, drop reset.css"
```

---

## Task 5: Create `components/Footer.tsx`

**Files:**
- Create: `components/Footer.tsx`

- [ ] **Step 1: Write `components/Footer.tsx`**

```tsx
export default function Footer() {
  return (
    <footer className="border-t border-stone-200 bg-cream">
      <div className="mx-auto flex max-w-container flex-col items-center justify-between gap-2 px-6 py-6 text-xs text-stone-500 md:flex-row">
        <div>© 2026 M.A. Handyman Services. All rights reserved.</div>
        <div>
          Designed by{' '}
          <a
            href="https://www.linkedin.com/in/sheldon-pierce/"
            target="_blank"
            rel="noreferrer"
            className="font-medium text-ink underline-offset-4 hover:underline"
          >
            Sheldon Pierce
          </a>
        </div>
      </div>
    </footer>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add components/Footer.tsx
git commit -m "feat(components): add Footer"
```

---

## Task 6: Create `components/Nav.tsx`

**Files:**
- Create: `components/Nav.tsx`

- [ ] **Step 1: Write `components/Nav.tsx`**

```tsx
import { useEffect, useState } from 'react';

const links = [
  { href: '#services', label: 'Services' },
  { href: '#about', label: 'About' },
  { href: '#contact', label: 'Contact' },
];

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <nav
      className={`sticky top-0 z-40 bg-cream/95 backdrop-blur transition-shadow ${
        scrolled ? 'shadow-sm' : ''
      }`}
    >
      <div className="mx-auto flex max-w-container items-center justify-between px-6 py-4">
        <a href="#top" className="font-display text-lg font-semibold tracking-tight text-ink">
          M.A. Handyman
        </a>

        <div className="hidden items-center gap-7 md:flex">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-sm font-medium text-stone-600 transition-colors hover:text-ink"
            >
              {l.label}
            </a>
          ))}
          <a
            href="#contact"
            className="rounded-md bg-rust px-4 py-1.5 text-sm font-semibold text-white transition-colors hover:bg-rust/90"
          >
            Get a quote
          </a>
        </div>

        <button
          aria-label="Toggle menu"
          aria-expanded={open}
          className="flex flex-col gap-1.5 md:hidden"
          onClick={() => setOpen((v) => !v)}
        >
          <span className="block h-0.5 w-6 bg-ink" />
          <span className="block h-0.5 w-6 bg-ink" />
          <span className="block h-0.5 w-6 bg-ink" />
        </button>
      </div>

      {open && (
        <div className="border-t border-stone-200 bg-cream md:hidden">
          <div className="mx-auto flex max-w-container flex-col px-6 py-3">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="py-2 text-base text-stone-700"
              >
                {l.label}
              </a>
            ))}
            <a
              href="#contact"
              onClick={() => setOpen(false)}
              className="mt-2 rounded-md bg-rust px-4 py-2 text-center text-sm font-semibold text-white"
            >
              Get a quote
            </a>
          </div>
        </div>
      )}
    </nav>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add components/Nav.tsx
git commit -m "feat(components): add Nav with sticky shadow + mobile menu"
```

---

## Task 7: Create `components/Hero.tsx`

**Files:**
- Create: `components/Hero.tsx`

- [ ] **Step 1: Write `components/Hero.tsx`**

```tsx
import Image from 'next/image';
import { motion } from 'framer-motion';

export default function Hero() {
  return (
    <section id="top" className="bg-cream">
      <div className="mx-auto grid max-w-container items-center gap-12 px-6 py-16 md:grid-cols-[1.1fr_1fr] md:py-24">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-xs font-semibold uppercase tracking-[0.18em] text-rust">
            Serving Kirkland, WA
          </div>
          <h1 className="mt-4 font-display text-5xl font-semibold leading-[1.02] tracking-tight text-ink md:text-6xl">
            Your neighbor for honest home repairs.
          </h1>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-stone-600">
            Carpentry, painting, repairs, installs — done well, done on time, by one person who cares about the work.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <a
              href="#contact"
              className="rounded-lg bg-rust px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-rust/90"
            >
              Request a quote
            </a>
            <a
              href="#services"
              className="rounded-lg border border-ink px-6 py-3 text-sm font-medium text-ink transition-colors hover:bg-ink hover:text-cream"
            >
              See services
            </a>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="overflow-hidden rounded-xl"
        >
          <Image
            src="/main.jpeg"
            alt="Handyman at work"
            width={720}
            height={720}
            priority
            className="h-auto w-full object-cover"
          />
        </motion.div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add components/Hero.tsx
git commit -m "feat(components): add Hero section"
```

---

## Task 8: Create `components/Services.tsx`

**Files:**
- Create: `components/Services.tsx`

- [ ] **Step 1: Write `components/Services.tsx`**

```tsx
import { motion } from 'framer-motion';

const services = [
  { icon: '🔨', title: 'Carpentry',        body: 'Trim, doors, shelving, repairs to wood structures.' },
  { icon: '🎨', title: 'Painting',         body: 'Interior & exterior. Clean lines, careful prep.' },
  { icon: '🔧', title: 'Plumbing fixes',   body: 'Faucets, toilets, leaks, simple replacements.' },
  { icon: '💡', title: 'Electrical',       body: 'Fixture swaps, outlets, light installs.' },
  { icon: '📦', title: 'Assembly & mounts',body: 'Furniture, TVs, shelving, anything boxed.' },
  { icon: '🛠️', title: 'General repairs',  body: "If something's broken and you don't know who to call." },
];

export default function Services() {
  return (
    <section id="services" className="bg-sand">
      <div className="mx-auto max-w-container px-6 py-20 md:py-24">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-xs font-semibold uppercase tracking-[0.18em] text-rust">
            What I do
          </div>
          <h2 className="mt-2 max-w-2xl font-display text-4xl font-semibold tracking-tight text-ink md:text-5xl">
            Repairs &amp; installs for the whole home
          </h2>
        </motion.div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 md:grid-cols-3">
          {services.map((s, i) => (
            <motion.article
              key={s.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              className="rounded-xl bg-white p-6 transition-transform duration-300 hover:-translate-y-0.5"
            >
              <div
                className="flex h-10 w-10 items-center justify-center rounded-lg bg-cream text-xl"
                aria-hidden
              >
                {s.icon}
              </div>
              <h3 className="mt-4 font-display text-lg font-semibold text-ink">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-stone-600">{s.body}</p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add components/Services.tsx
git commit -m "feat(components): add Services grid (6 tiles)"
```

---

## Task 9: Create `components/About.tsx`

**Files:**
- Create: `components/About.tsx`

- [ ] **Step 1: Write `components/About.tsx`**

```tsx
import { motion } from 'framer-motion';

export default function About() {
  return (
    <section id="about" className="bg-cream">
      <div className="mx-auto max-w-3xl px-6 py-20 text-center md:py-24">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-xs font-semibold uppercase tracking-[0.18em] text-rust">
            Meet Michael
          </div>
          <h2 className="mt-2 font-display text-3xl font-semibold tracking-tight text-ink md:text-4xl">
            Local. Reliable. Particular about good work.
          </h2>
          <p className="mt-5 text-base leading-relaxed text-stone-600 md:text-lg">
            Michael Aguilar has been doing home repair work in the Kirkland area for 8 years. He answers his own phone, shows up when he says he will, and treats every house like it&apos;s his own. Free quotes, no nonsense, and references on request.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add components/About.tsx
git commit -m "feat(components): add About (text-only, Michael Aguilar, 8 years)"
```

---

## Task 10: Create `components/Contact.tsx` with inline form

**Files:**
- Create: `components/Contact.tsx`

This is the largest component. It owns all form state and the submit handler, replacing both `formModal.tsx` and `alertModal.tsx` from the old code.

- [ ] **Step 1: Write `components/Contact.tsx`**

```tsx
import { useState, FormEvent, ChangeEvent } from 'react';
import { motion } from 'framer-motion';
import { SocialIcon } from 'react-social-icons';

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

const initialForm: InquiryForm = {
  name: '',
  number: '',
  email: '',
  address: '',
  serviceInfo: '',
  phone: false,
  emailCheck: false,
  text: false,
};

type Status = 'idle' | 'submitting' | 'success' | 'error';

const inputCls =
  'w-full rounded-md border border-stone-700 bg-stone-950 px-3 py-2.5 text-sm text-cream placeholder:text-stone-500 focus:border-amber-400 focus:outline-none';

export default function Contact() {
  const [form, setForm] = useState<InquiryForm>(initialForm);
  const [status, setStatus] = useState<Status>('idle');
  const [errorMessage, setErrorMessage] = useState<string>('');

  const onChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const next = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
    setForm((prev) => ({ ...prev, [name]: next }));
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!form.phone && !form.emailCheck && !form.text) {
      setErrorMessage('Please select at least one preferred contact method.');
      setStatus('error');
      return;
    }
    setStatus('submitting');
    setErrorMessage('');
    try {
      const res = await fetch('/api/sendEmail', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error('send failed');
      setStatus('success');
      setForm(initialForm);
    } catch {
      setErrorMessage('Something went wrong sending the message. Please try again.');
      setStatus('error');
    }
  };

  return (
    <section id="contact" className="bg-ink text-cream">
      <div className="mx-auto grid max-w-container gap-12 px-6 py-20 md:grid-cols-[1fr_1.1fr] md:py-24">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-400">
            Get a quote
          </div>
          <h2 className="mt-2 font-display text-4xl font-semibold tracking-tight md:text-5xl">
            Let&apos;s talk about your project.
          </h2>
          <p className="mt-4 max-w-md text-base leading-relaxed text-stone-300">
            Tell me a bit about what you need. I&apos;ll usually reply within a day.
          </p>
          <ul className="mt-6 space-y-2 text-sm text-stone-300">
            <li>
              <span aria-hidden>📞 </span>(425) 555-0123
            </li>
            <li>
              <span aria-hidden>✉ </span>contact@mahandyman.com
            </li>
            <li>
              <span aria-hidden>📍 </span>Kirkland, WA &amp; nearby
            </li>
          </ul>
          <div className="mt-4">
            <SocialIcon
              url="https://facebook.com/Handyman.Aguilar"
              target="_blank"
              bgColor="#c2410c"
              fgColor="#fdf8ef"
              style={{ height: 36, width: 36 }}
            />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="rounded-xl bg-stone-900 p-6"
        >
          {status === 'success' ? (
            <div className="py-10 text-center">
              <h3 className="font-display text-2xl text-cream">Thanks — your message is in.</h3>
              <p className="mt-2 text-sm text-stone-300">I&apos;ll be in touch soon.</p>
              <button
                onClick={() => setStatus('idle')}
                className="mt-4 text-sm font-semibold text-amber-400 underline"
              >
                Send another
              </button>
            </div>
          ) : (
            <form onSubmit={onSubmit} className="space-y-3" noValidate>
              <div className="grid gap-3 sm:grid-cols-2">
                <input
                  required
                  name="name"
                  value={form.name}
                  onChange={onChange}
                  placeholder="Name"
                  className={inputCls}
                />
                <input
                  name="number"
                  value={form.number}
                  onChange={onChange}
                  placeholder="Phone"
                  className={inputCls}
                />
              </div>
              <input
                required
                type="email"
                name="email"
                value={form.email}
                onChange={onChange}
                placeholder="Email"
                className={inputCls}
              />
              <input
                name="address"
                value={form.address}
                onChange={onChange}
                placeholder="Address"
                className={inputCls}
              />
              <textarea
                required
                name="serviceInfo"
                value={form.serviceInfo}
                onChange={onChange}
                placeholder="Tell me about the project…"
                rows={4}
                className={inputCls}
              />
              <fieldset className="text-xs text-stone-300">
                <legend className="mb-2 uppercase tracking-wider">Preferred contact</legend>
                <div className="flex flex-wrap gap-4">
                  <label className="flex items-center gap-2">
                    <input type="checkbox" name="phone" checked={form.phone} onChange={onChange} />
                    Phone
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      name="emailCheck"
                      checked={form.emailCheck}
                      onChange={onChange}
                    />
                    Email
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" name="text" checked={form.text} onChange={onChange} />
                    Text
                  </label>
                </div>
              </fieldset>
              {status === 'error' && errorMessage && (
                <div className="rounded-md border border-rust/40 bg-rust/10 px-3 py-2 text-xs text-rust">
                  {errorMessage}
                </div>
              )}
              <button
                type="submit"
                disabled={status === 'submitting'}
                className="w-full rounded-lg bg-rust py-3 text-sm font-semibold text-white transition-colors hover:bg-rust/90 disabled:opacity-60"
              >
                {status === 'submitting' ? 'Sending…' : 'Send inquiry'}
              </button>
            </form>
          )}
        </motion.div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add components/Contact.tsx
git commit -m "feat(components): add Contact with inline form + status states"
```

---

## Task 11: Create `components/Layout.tsx`

**Files:**
- Create: `components/Layout.tsx`

- [ ] **Step 1: Write `components/Layout.tsx`**

```tsx
import { ReactNode } from 'react';
import Nav from './Nav';
import Footer from './Footer';

type LayoutProps = { children: ReactNode };

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-cream font-sans text-stone-600 antialiased">
      <Nav />
      <main>{children}</main>
      <Footer />
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add components/Layout.tsx
git commit -m "feat(components): add Layout wrapper"
```

---

## Task 12: Rewrite `pages/index.tsx`

**Files:**
- Modify: `pages/index.tsx`

- [ ] **Step 1: Replace `pages/index.tsx` contents**

```tsx
import Head from 'next/head';
import Layout from '@/components/Layout';
import Hero from '@/components/Hero';
import Services from '@/components/Services';
import About from '@/components/About';
import Contact from '@/components/Contact';

export default function Home() {
  return (
    <>
      <Head>
        <title>M.A. Handyman Services — Kirkland, WA</title>
        <meta
          name="description"
          content="Friendly, dependable handyman service for Kirkland homeowners. Carpentry, painting, repairs, installs, and more."
        />
      </Head>
      <Layout>
        <Hero />
        <Services />
        <About />
        <Contact />
      </Layout>
    </>
  );
}
```

- [ ] **Step 2: Verify the path alias `@/components` resolves**

`tsconfig.json` already contains `"paths": { "@/*": ["./*"] }`. Confirm with:

```bash
grep -n '"paths"' tsconfig.json
```

Expected: one match showing the paths line. No edit required.

- [ ] **Step 3: Commit**

```bash
git add pages/index.tsx
git commit -m "feat(pages): rewrite index to compose new section components"
```

---

## Task 13: Delete obsolete files

**Files:**
- Delete: `pages/footer.tsx`
- Delete: `pages/formModal.tsx`
- Delete: `pages/alertModal.tsx`

- [ ] **Step 1: Remove the three files**

```bash
git rm pages/footer.tsx pages/formModal.tsx pages/alertModal.tsx
```

Expected: three `rm '...'` lines.

- [ ] **Step 2: Confirm nothing else imports them**

```bash
grep -rn "from './footer'" pages components 2>/dev/null
grep -rn "from './formModal'" pages components 2>/dev/null
grep -rn "from './alertModal'" pages components 2>/dev/null
grep -rn "import Footer from" pages components 2>/dev/null
```

Expected: no results from the first three. The fourth should only appear in `components/Layout.tsx`, which imports from `./Footer`.

- [ ] **Step 3: Commit**

```bash
git commit -m "chore: remove old Chakra-based modal + footer files"
```

---

## Task 14: Remove Chakra dependencies

**Files:**
- Modify: `package.json` (via `npm uninstall`)
- Modify: `package-lock.json` (auto-updated)

- [ ] **Step 1: Uninstall Chakra and Emotion**

```bash
npm uninstall @chakra-ui/react @emotion/react @emotion/styled
```

Expected: three packages removed, `package-lock.json` updated, no errors. `framer-motion`, `nodemailer`, and `react-social-icons` remain.

- [ ] **Step 2: Verify nothing imports Chakra anymore**

```bash
grep -rn "@chakra-ui\|@emotion/" pages components styles 2>/dev/null
```

Expected: no matches.

- [ ] **Step 3: Commit**

```bash
git add package.json package-lock.json
git commit -m "chore(deps): remove @chakra-ui/react and @emotion/{react,styled}"
```

---

## Task 15: Build + dev-server smoke test

**Files:** none.

- [ ] **Step 1: Production build**

Run: `npm run build`
Expected: build completes; no TypeScript errors; no Next.js warnings about missing components or imports. Note the page sizes — index should be smaller than before.

If errors appear, fix the relevant component file and re-run. Do not commit until build is clean.

- [ ] **Step 2: Dev server smoke test**

Run: `npm run dev`
Open: `http://localhost:3000`

Visually verify:
- Nav sticks at top; shadow appears after scrolling 20px.
- Hero shows `main.jpeg` on the right, headline + buttons on the left.
- "Request a quote" scrolls to Contact; "See services" scrolls to Services.
- Services section: sand background, 6 white tiles in 3 columns (md), 2 (sm), 1 (xs).
- About: centered text on cream.
- Contact: dark ink section, form on the right.
- Resize to mobile width (~375px): everything stacks; hamburger menu opens/closes.

- [ ] **Step 3: Submit a test inquiry**

Fill the form with valid data, check at least one contact method, click Send inquiry.
Expected: button shows "Sending…", then form replaces with the thank-you panel. Check the inbox configured by `.env.local`'s `EMAIL_USER` for the email.

Try once with no contact-method checkbox: inline error should appear; nothing is sent.

- [ ] **Step 4: Stop dev server**

Press `Ctrl+C` in the dev-server terminal.

- [ ] **Step 5: No commit needed**

This task only verifies. Move on if everything passed.

---

## Task 16: Push branch and open PR

**Files:** none — git + GitHub operations.

- [ ] **Step 1: Push the feature branch**

```bash
git push -u origin redesign-2026-05
```

Expected: new remote branch created; Vercel will auto-build a preview deployment.

- [ ] **Step 2: Open PR via `gh`**

```bash
gh pr create --title "Redesign: warm Tailwind rebuild + inline contact form" --body "$(cat <<'EOF'
## Summary
- Rebuild the single-page site on Tailwind alone — drop Chakra UI and Emotion entirely.
- New warm cream / ink / rust palette; Fraunces (display) + Inter (UI) via `next/font`.
- Sections: Hero → Services (6 tiles) → About (Michael Aguilar, 8 years) → Contact (inline form).
- Inline contact form replaces the modal flow; same `/api/sendEmail` route.
- Subtle scroll-in animations via `framer-motion`.

## Test plan
- [ ] Vercel preview build succeeds.
- [ ] Hero, Services, About, Contact render at desktop and mobile widths.
- [ ] Nav links smooth-scroll to sections; hamburger menu works on mobile.
- [ ] Contact form sends successfully and shows the thank-you panel.
- [ ] Contact form shows the inline error when no contact method is selected.

🤖 Generated with [Claude Code](https://claude.com/claude-code)
EOF
)"
```

Expected: `gh` prints the PR URL. Capture it.

- [ ] **Step 3: Print the preview URL hint**

Tell the user the PR URL so they can review the Vercel preview before merge.

---

## Task 17: Merge PR to main (deploy gate)

**Files:** none — GitHub operation. **Requires explicit user authorization before running.**

- [ ] **Step 1: Confirm with user that the Vercel preview looks correct**

Do not proceed until the user has reviewed the preview URL and given a go-ahead. (The original instruction did pre-authorize "push to main", so the gate here is mostly a sanity check after they've seen the preview.)

- [ ] **Step 2: Merge the PR**

```bash
gh pr merge --merge --delete-branch
```

Expected: PR merges to `main`; remote branch is deleted; Vercel auto-builds production.

- [ ] **Step 3: Switch local back to main and pull**

```bash
git checkout main
git pull
```

Expected: local `main` includes the merged commits.

- [ ] **Step 4: Confirm Vercel production rebuild kicked off**

The user can verify in the Vercel dashboard, or just visit the production URL after a couple of minutes. No action needed from the agent.
