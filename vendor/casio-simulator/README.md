# Locally hosted fx-82 simulator

Adapted from Simon Cragg's MIT-licensed Casio-inspired scientific calculator:
https://github.com/simoncragg/scientific-calculator (revision 0ae021d).
The original copyright and full licence are preserved in LICENSE.

Build the iframe assets from the repository root:

```sh
npm --prefix vendor/casio-simulator ci --ignore-scripts
npm run build:calculator
```

The output is checked into public/calculator so the main app needs no calculator
runtime dependencies or external embed. It loads only when Calculator is opened.

Changes include keyboard input, viewport scaling, local math labels, session
restoration, memory/Ans keys, a power operator and defensive error handling.
The device is a Casio-inspired simulation, not licensed Casio firmware.

Run upstream calculation tests and local integration cases:

```sh
npm --prefix vendor/casio-simulator run test:no-watch
```
