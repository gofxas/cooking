# Kitchen Island Timer UI Redesign

Date: 2026-06-28

## Goal

Redesign the current Vue/Vite cooking timer into a warmer, more kitchen-focused experience inspired by `animal-island-ui`, while preserving the core slide timer interactions.

## Scope

- Redesign the home timer list, timer cards, bottom creator slider, settings page, onboarding/about page, and time-over overlay.
- Keep the existing timer creation model: drag the bottom creator to the right to choose duration and release to create.
- Keep existing timer card gestures: right swipe deletes; left swipe restarts.
- Keep settings gestures based on `SlideItem`.
- Keep localStorage data shape and sound behavior compatible with the existing app.
- Avoid adding new runtime dependencies unless implementation reveals a strong need.

## Visual Direction

The UI should feel like a playful kitchen island:

- Warm parchment page background, based on `animal-island-ui` tokens.
- Warm brown text instead of white-on-dark.
- Mint teal as the primary action color.
- Sunshine yellow for focus and positive emphasis.
- Red/coral for destructive actions.
- Rounded 20px cards, 50px pill controls, and thick tactile shadows on primary interactive surfaces.
- Pastel kitchen timer cards with subtle dot/grid wallpaper patterns.
- Friendly rounded typography using Nunito and Noto Sans SC, with local fallbacks.

Primary tokens:

- Background: `#f8f8f0`
- Surface: `rgb(247, 243, 223)`
- Text: `#725d42`
- Heading: `#794f27`
- Muted: `#9f927d`
- Primary mint: `#19c8b9`
- Focus yellow: `#ffcc00`
- Error: `#e05a5a`
- Button shadow: `#bdaea0`

## Home Screen

The home screen remains mobile-first and centered, but no longer uses a dark full-screen shell.

Structure:

- A compact header with app name and active timer count.
- A scrollable timer list with comfortable padding.
- An empty state when no timers exist, explaining the bottom drag affordance briefly.
- A fixed bottom creator area that visually reads as the main control.

Timer cards:

- Rounded card with pastel background chosen from the timer color.
- Card content includes label, remaining time, and a small progress bar.
- Time uses tabular, bold digits for scanning while cooking.
- Swipe backgrounds remain visible: right side for delete, left side for restart.
- Swipe threshold feedback should show a stronger confirmation state once release will trigger the action.

## Creator Slider

The creator slider is the signature interaction and must stay central.

Behavior:

- Right drag maps distance to duration using the existing logic unless a bug is discovered.
- Left drag opens settings.
- During right drag, a detail panel appears above the slider with the selected duration, selected cooking tag, and tag chips.
- Releasing after selecting a duration starts the existing short countdown before creating the timer.

Visual treatment:

- Bottom bar becomes a large rounded pill with a tactile shadow.
- Background action zones show `松开创建` on the left and `设置` on the right.
- Drag preview uses mint/yellow accents and kitchen-themed copy.
- Tag chips use rounded, bordered pill styling.

## Settings Screen

The settings page should reuse the same warm shell and swipe list language.

Sections:

- Tags: edit/delete common cooking tags.
- New tag: left swipe to create.
- Sound: switch/preview sound via swipe.
- Home: left swipe back.

Each setting row uses the shared swipe item styling: rounded surface, warm text, clear colored action backgrounds, and consistent input styling.

## Time-Over Overlay

Replace the plain full-screen message with a soft modal-like overlay:

- Warm translucent backdrop.
- Rounded or organic surface.
- Large "时间到了" message.
- Secondary hint to tap to stop.
- Keep the existing click-to-close and sound-stop behavior.

## Implementation Notes

- Preserve current Vue Options API style unless a localized Composition API change is clearly smaller.
- Prefer updating existing components over introducing a design-system abstraction.
- Use CSS variables in `src/style.css` for shared tokens.
- Keep all swipe logic in `timer.vue`, `slideItem.vue`, and `creator.vue` unless extracting a helper clearly reduces duplication without expanding scope.
- Ensure the app remains usable in a desktop browser even though the main flow is touch-first.

## Verification

Minimum verification:

- `npm run build`
- Manual browser check of:
  - first-run/about page
  - home with no timers
  - create timer by dragging creator
  - card swipe restart/delete
  - time-over overlay
  - settings page tag edit/create/delete and navigation back

## Out Of Scope

- Replacing the app with the actual `animal-island-ui` React library.
- Changing persistence format.
- Adding account sync, recipe features, or notification permissions.
- Rewriting the app architecture.
