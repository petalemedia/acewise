import "@testing-library/jest-dom"
import React from "react";

import App from "../../src/components/App";

import { 
  DRG,
  HYP,
  SHIFT,
  assertOutputIsEqualTo, 
  pressButtons, 
  renderWithProviders
} from "../test-utils";

import { initialState } from "../../src/calcSlice";

describe("area hyperbolic tangent operations", () => {

  beforeEach(() => {
    renderWithProviders(
      <App />, {
        preloadedState: {
          calc: initialState,
       }
    });
  });

  it.each([
    {inputs: ["0.25", HYP, SHIFT, "atanh"], expected: "14.63407615"},
    {inputs: ["0.25", HYP, SHIFT, "atanh", "="], expected: "14.63407615"},
    {inputs: ["0.25", HYP, SHIFT, "atanh", SHIFT, "square"], expected: "214.1561849"},
  ])("can perform an area hyperbolic tangentgent operation in DEG mode: $inputs 🡢 $expected", ({inputs, expected}) => {
    pressButtons(inputs);
    assertOutputIsEqualTo(expected);
  });

  it.each([
    {inputs: [DRG, "0.25", HYP, SHIFT, "atanh"], expected: "0.255412812"},
    {inputs: [DRG, "0.25", HYP, SHIFT, "atanh", "="], expected: "0.255412812"},
    {inputs: [DRG, "0.25", HYP, SHIFT, "atanh", SHIFT, "square"], expected: "0.065235704"},
  ])("can perform an area hyperbolic tangentgent operation in RAD mode: $inputs 🡢 $expected", ({inputs, expected}) => {
    pressButtons(inputs);
    assertOutputIsEqualTo(expected);
  });

  it.each([
    {inputs: [DRG, DRG, "0.25", HYP, SHIFT, "atanh"], expected: "16.26008462"},
    {inputs: [DRG, DRG, "0.25", HYP, SHIFT, "atanh", "="], expected: "16.26008462"},
    {inputs: [DRG, DRG, "0.25", HYP, SHIFT, "atanh", SHIFT, "square"], expected: "264.3903517"},
  ])("can perform an area hyperbolic tangentgent operation in GRAD mode: $inputs 🡢 $expected", ({inputs, expected}) => {
    pressButtons(inputs);
    assertOutputIsEqualTo(expected);
  });

  it.each([
    {inputs: ["0.25", HYP, SHIFT, "atanh", "=", "=", "=", "=" ], expected: "14.63407615"},
    {inputs: [DRG, "0.25", HYP, SHIFT, "atanh", "=", "=", "=", "=" ], expected: "0.255412812"},
    {inputs: [DRG, DRG, "0.25", HYP, SHIFT, "atanh", "=", "=", "=", "=" ], expected: "16.26008462"},
  ])(
    "does not repeat the last area hyperbolic tangentgent operation when the equals button is pressed consecutively: $inputs 🡢 $expected", 
    ({inputs, expected}) => {

      pressButtons(inputs);
      assertOutputIsEqualTo(expected);
    }
  );

  it.each([
    {inputs: ["1", "+", "0.25", HYP, SHIFT, "atanh", "=", "=", "=", "="], expected: "59.53630462"},
    {inputs: [DRG, "1", "+", "0.25", HYP, SHIFT, "atanh", "=", "=", "=", "="], expected: "2.021651248"},
    {inputs: [DRG, DRG, "1", "+", "0.25", HYP, SHIFT, "atanh", "=", "=", "=", "="], expected: "66.04033846"},
  ])(
    "repeats the last operation when the equals button is pressed consecutively: $inputs 🡢 $expected", 
    ({inputs, expected}) => {

      pressButtons(inputs);
      assertOutputIsEqualTo(expected);
    }
  );
});
