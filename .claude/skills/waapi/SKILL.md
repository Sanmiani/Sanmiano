---
name: waapi
description: Use when animating elements in HyperFrames compositions with the Web Animations API (WAAPI) — element.animate(), document.getAnimations(), fill:both, finite iterations, and seek-driven rules
---

# Web Animations API for HyperFrames

HyperFrames integrates with the Web Animations API through its `waapi` runtime adapter, enabling deterministic animation rendering without external dependencies.

## Contract

- Create animations synchronously during composition initialization using `element.animate()`.
- Use finite duration and iteration counts — no infinite loops.
- Set `fill: "both"` so seeked states persist before and after active motion.
- Pause animations after creation — do not let them run on their own clock.
- Avoid callbacks that mutate DOM based on wall-clock time, network state, or unseeded randomness.

The adapter calls `document.getAnimations()`, sets each animation's `currentTime` to HyperFrames time in milliseconds, then pauses playback.

## Basic Pattern

```js
const anim = element.animate(
  [
    { opacity: 0, transform: "translateY(30px)" },
    { opacity: 1, transform: "translateY(0)" },
  ],
  {
    duration: 600,
    easing: "ease-out",
    fill: "both",
    iterations: 1,
  }
);
anim.pause();
```

## Stagger Pattern

```js
const items = document.querySelectorAll(".item");
items.forEach((el, index) => {
  const anim = el.animate(
    [
      { opacity: 0, transform: "translateY(20px)" },
      { opacity: 1, transform: "translateY(0)" },
    ],
    {
      duration: 500,
      delay: index * 80,
      easing: "ease-out",
      fill: "both",
    }
  );
  anim.pause();
});
```

## Good Uses

- Lightweight DOM motion where CSS keyframes are too rigid and GSAP is unnecessary
- Simple entrances, fades, and slides on individual elements
- Reducing external dependencies in simple compositions

## Avoid

- Infinite iterations — compute a finite repeat count from the composition duration
- Depending on `animation.finished` for DOM mutations
- Running parallel timing systems with `requestAnimationFrame`
- Animating layout properties when transforms and opacity suffice
- Modeling clip-local start times automatically — use `delay` instead

## Validation

```bash
npx hyperframes lint
npx hyperframes validate
```
