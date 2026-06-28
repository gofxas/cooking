# Kitchen Island Timer Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Redesign the Vue cooking timer into a warm kitchen-focused Animal Island inspired UI while preserving slide timer creation and swipe actions.

**Architecture:** Keep the existing Vue Options API components and timer data flow. Add shared design tokens in global CSS, then update the existing page and component templates/styles in place so persistence and gesture behavior remain compatible.

**Tech Stack:** Vue 3, Vite, Less, localStorage, Howler.

---

## File Structure

- Modify `src/style.css`: global design tokens, typography, app shell, reusable pattern backgrounds, base input/button behavior.
- Modify `src/Index.vue`: home shell, header, empty state, and list spacing.
- Modify `src/components/timer.vue`: timer card markup, progress calculation, swipe action styling, progress bar, confirmation state.
- Modify `src/components/creator.vue`: bottom kitchen slider styling, detail panel, tag chips, creation preview.
- Modify `src/components/slideItem.vue`: shared warm swipe row styling used by settings.
- Modify `src/Setting.vue`: warm page shell, section copy, row layout, inputs.
- Modify `src/components/timeover.vue`: warm modal overlay.
- Modify `src/About.vue`: first-run page styling.
- Modify `src/colors.js`: replace high-saturation timer colors with kitchen-friendly Animal Island palette.

## Tasks

### Task 1: Global Design Tokens

**Files:**
- Modify: `src/style.css`

- [ ] Add CSS variables for warm surfaces, brown text, mint primary, yellow focus, coral danger, radii, shadows, and creator height.
- [ ] Replace the dark global body shell with a warm parchment background and rounded font stack.
- [ ] Keep full-height app layout and touch-friendly user-select behavior.
- [ ] Run `npm run build` to catch CSS syntax errors.

### Task 2: Home Screen Layout

**Files:**
- Modify: `src/Index.vue`

- [ ] Add a header with title, subtitle, and active timer count.
- [ ] Add an empty state for zero timers.
- [ ] Keep the `TransitionGroup`, `Timer`, `Creator`, and `Timeover` data flow unchanged.
- [ ] Update scoped styles for mobile-first padding, scroll area, and fixed creator footprint.

### Task 3: Timer Card

**Files:**
- Modify: `src/components/timer.vue`

- [ ] Add semantic card markup for label, remaining time, status copy, and progress bar.
- [ ] Add a computed `progress` based on `timer.duration` and `timer.rest`.
- [ ] Preserve touch handlers and `delete`, `reload`, `timeend` events.
- [ ] Restyle swipe backgrounds so right swipe shows delete and left swipe shows restart with clear confirmation feedback.
- [ ] Run `npm run build`.

### Task 4: Creator Slider

**Files:**
- Modify: `src/components/creator.vue`

- [ ] Keep duration mapping and emit behavior unchanged.
- [ ] Restyle the detail panel as a warm floating kitchen panel.
- [ ] Restyle tag choices as rounded chips with the active chip using the selected timer color.
- [ ] Restyle the bottom slider as a tactile pill with visible create/settings action zones.
- [ ] Run `npm run build`.

### Task 5: Settings Swipe Rows

**Files:**
- Modify: `src/components/slideItem.vue`
- Modify: `src/Setting.vue`

- [ ] Restyle `SlideItem` to match the timer swipe language.
- [ ] Wrap settings content in a warm page shell with section headings and helper text.
- [ ] Keep all settings events and state mutations unchanged.
- [ ] Restyle inputs as pill fields with focus states.
- [ ] Run `npm run build`.

### Task 6: Overlay, About Page, Palette

**Files:**
- Modify: `src/components/timeover.vue`
- Modify: `src/About.vue`
- Modify: `src/colors.js`

- [ ] Replace timer-complete overlay with warm modal styling and tap-to-stop hint.
- [ ] Restyle first-run/about page to match the new design.
- [ ] Replace timer color palette with softer kitchen-friendly colors.
- [ ] Run `npm run build`.

### Task 7: Manual Verification

**Files:**
- No code changes expected.

- [ ] Start local dev server with `npm run dev`.
- [ ] Open the app and verify first-run/about, empty home, creator drag, card swipe restart/delete, settings rows, and time-over overlay.
- [ ] Fix any layout or build issues found during verification.
