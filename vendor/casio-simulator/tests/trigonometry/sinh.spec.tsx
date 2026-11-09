import "@testing-library/jest-dom"
import React from "react";

import App from "../../src/components/App";

import { 
  assertOutputIsEqualTo, 
  pressButtons, 
  renderWithProviders
} from "../test-utils";

import { initialState } from "../../src/calcSlice";

describe("Hyperbolic sine operations", () => {

  beforeEach(() => {
    renderWithProviders(
      <App />, {
        preloadedState: {
          calc: initialState,
       }
    });
  });

  it.each([
    {inputs: ["0", "HYP", "sinh"], expected: "0"},
    {inputs: ["45", "HYP", "sinh", "="], expected: "0.868670961"},
    {inputs: ["90", "+/-", "HYP", "sinh", "+", "1", "="], expected: "-1.301298902"},
  ])("can perform a hyperbolic sine operation in DEG mode: $inputs 🡢 $expected", ({inputs, expected}) => {
    pressButtons(inputs);
    assertOutputIsEqualTo(expected);
  });

  it.each([
    {inputs: ["DRG▸", "0", "HYP", "sinh"], expected: "0"},
    {inputs: ["DRG▸", "0.785398163", "HYP", "sinh", "="], expected: "0.868670961"},
    {inputs: ["DRG▸", "1.570796327", "+/-", "HYP", "sinh", "+", "1", "="], expected: "-1.301298903"},
  ])("can perform a hyperbolic sine operation in RAD mode: $inputs 🡢 $expected", ({inputs, expected}) => {
    pressButtons(inputs);
    assertOutputIsEqualTo(expected);
  });

  it.each([
    {inputs: ["DRG▸", "DRG▸", "0", "HYP", "sinh"], expected: "0"},
    {inputs: ["DRG▸", "DRG▸", "50", "HYP", "sinh", "="], expected: "0.868670961"},
    {inputs: ["DRG▸", "DRG▸", "100", "+/-", "HYP", "sinh", "+", "1", "="], expected: "-1.301298902"},
  ])("can perform a hyperbolic sine operation in GRAD mode: $inputs 🡢 $expected", ({inputs, expected}) => {
    pressButtons(inputs);
    assertOutputIsEqualTo(expected);
  });

  it.each([
    {inputs: ["45", "HYP", "sinh", "=", "=", "=", "=" ], expected: "0.868670961"},
    {inputs: ["DRG▸", "0.785398163", "HYP", "sinh", "=", "=", "=", "=" ], expected: "0.868670961"},
    {inputs: ["DRG▸", "DRG▸", "50", "HYP", "sinh", "=", "=", "=", "=" ], expected: "0.868670961"},
  ])(
    "does not repeat the last sine operation when the equals button is pressed consecutively: $inputs 🡢 $expected", 
    ({inputs, expected}) => {

      pressButtons(inputs);
      assertOutputIsEqualTo(expected);
    }
  );

  it.each([
    {inputs: ["1", "+", "45", "HYP", "sinh", "=", "=", "=", "="], expected: "4.474683846"},
    {inputs: ["DRG▸", "1", "+", "0.785398163", "HYP", "sinh", "=", "=", "=", "="], expected: "4.474683844"},
    {inputs: ["DRG▸", "DRG▸", "1", "+", "50", "HYP", "sinh", "=", "=", "=", "="], expected: "4.474683846"},
  ])(
    "repeats the last operation for an arithmetic operation when the equals button is pressed consecutively: $inputs 🡢 $expected", 
    ({inputs, expected}) => {

      pressButtons(inputs);
      assertOutputIsEqualTo(expected);
    }
  );
});
