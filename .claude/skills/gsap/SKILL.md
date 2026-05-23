---
name: gsap
description: Use when animating elements in HyperFrames compositions with GSAP — timeline creation, registration on window.__timelines, tween methods, easing, stagger, and performance rules
---

# GSAP for HyperFrames

HyperFrames manages GSAP animations through a synchronous timeline registry. Create a paused timeline synchronously, register it on `window.__timelines` with the exact `data-composition-id`, and let HyperFrames seek it.

## Core Contract

- Create timelines synchronously during composition initialization
- Set all timelines to `{ paused: true }` — never call `tl.play()`
- Register every timeline: `window.__timelines["<composition-id>"] = tl`
- Use finite durations and loop counts — never `repeat: -1`
- No `async/await` in timeline construction

## Basic Pattern

```html
<script>
  const tl = gsap.timeline({ paused: true });

  tl.from(".headline", { opacity: 0, y: 40, duration: 0.8, ease: "power3.out" })
    .from(".subtitle", { opacity: 0, y: 20, duration: 0.6, ease: "power2.out" }, "-=0.4");

  window.__timelines = window.__timelines || {};
  window.__timelines["my-composition"] = tl;
</script>
```

## Primary Tween Methods

| Method | Use |
|---|---|
| `gsap.to()` | Animate to a target state |
| `gsap.from()` | Entrance animations (start offscreen, end at natural position) |
| `gsap.fromTo()` | Explicit start and end states |
| `gsap.set()` | Immediate property application |

## Layout First, Animate From

Position every element at its final resting place in CSS first. Then use `gsap.from()` to animate *from* offscreen *to* that position:

```js
// Good — element is positioned in CSS, animation brings it in
tl.from(".card", { opacity: 0, x: -80, duration: 0.6 });

// Avoid — animating to an arbitrary position bypasses CSS layout
tl.to(".card", { x: 400, duration: 0.6 });
```

## Performance

- Use transform aliases: `x`, `y`, `scale`, `rotation` (not raw CSS transform strings)
- Prioritize CSS transforms and opacity over layout properties
- Use camelCase property names: `backgroundColor`, `rotationX`
- Use `gsap.quickTo()` for frequent updates

## Stagger

```js
tl.from(".item", {
  opacity: 0,
  y: 30,
  duration: 0.5,
  stagger: 0.1,
  ease: "power2.out"
});
```

## Timeline Position Parameter

```js
tl.from(".a", { opacity: 0, duration: 0.6 })          // after previous
  .from(".b", { opacity: 0, duration: 0.6 }, "-=0.3") // overlap
  .from(".c", { opacity: 0, duration: 0.6 }, "2.0")   // absolute time
  .from(".d", { opacity: 0, duration: 0.6 }, "label"); // at label
```

## Common Eases

| Effect | Ease |
|---|---|
| Smooth entrance | `"power3.out"` |
| Snappy | `"back.out(1.7)"` |
| Elastic | `"elastic.out(1, 0.3)"` |
| Immediate | `"none"` |

## Rules

- Never call `tl.play()` for render-critical motion
- Never use `repeat: -1`
- Never use wall-clock time (`Date.now()`, `performance.now()`)
- Build timelines synchronously — no promises or async loads
- Exit animations only on the final scene
