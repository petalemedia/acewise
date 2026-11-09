import "@testing-library/jest-dom"
import React from "react";

import App from "../../src/components/App";

import { 
  assertOutputIsEqualTo, 
  pressButtons, 
  renderWithProviders
} from "../test-utils";

import { initialState } from "../../src/calcSlice";

describe("Hyperbolic cosine operations", () => {

  beforeEach(() => {
    renderWithProviders(
      <App />, {
        preloadedState: {
          calc: initialState,
       }
    });
  });

  it.each([
    {inputs: ["0", "HYP", "cosh"], expected: "1"},
    {inputs: ["45", "HYP", "cosh", "="], expected: "1.324609089"},
    {inputs: ["90", "+/-", "HYP", "cosh", "+", "1", "="], expected: "3.509178479"},
  ])("can perform a hyperbolic cosine operation in DEG mode: $inputs 🡢 $expected", ({inputs, expected}) => {
    pressButtons(inputs);
    assertOutputIsEqualTo(expected);
  });

  it.each([
    {inputs: ["DRG▸", "0", "HYP", "cosh"], expected: "1"},
    {inputs: ["DRG▸", "0.785398163", "HYP", "cosh", "="], expected: "1.324609089"},
    {inputs: ["DRG▸", "1.570796327", "+/-", "HYP", "cosh", "+", "1", "="], expected: "3.509178479"},
  ])("can perform a hyperbolic cosine operation in RAD mode: $inputs 🡢 $expected", ({inputs, expected}) => {
    pressButtons(inputs);
    assertOutputIsEqualTo(expected);
  });

  it.each([
    {inputs: ["DRG▸", "DRG▸", "0", "HYP", "cosh"], expected: "1"},
    {inputs: ["DRG▸", "DRG▸", "50", "HYP", "cosh", "="], expected: "1.324609089"},
    {inputs: ["DRG▸", "DRG▸", "100", "+/-", "HYP", "cosh", "+", "1", "="], expected: "3.509178479"},
  ])("can perform a hyperbolic cosine operation in GRAD mode: $inputs 🡢 $expected", ({inputs, expected}) => {
    pressButtons(inputs);
    assertOutputIsEqualTo(expected);
  });

  it.each([
    {inputs: ["45", "HYP", "cosh", "=", "=", "=", "=" ], expected: "1.324609089"},
    {inputs: ["DRG▸", "0.785398163", "HYP", "cosh", "=", "=", "=", "=" ], expected: "1.324609089"},
    {inputs: ["DRG▸", "DRG▸", "50", "HYP", "cosh", "=", "=", "=", "=" ], expected: "1.324609089"},
  ])(
    "does not repeat the last hyperbolic cosine operation when the equals button is pressed consecutively: $inputs 🡢 $expected", 
    ({inputs, expected}) => {
      pressButtons(inputs);
      assertOutputIsEqualTo(expected);
    }
  );

  it.each([
    {inputs: ["1", "+", "45", "HYP", "cosh", "=", "=", "=", "="], expected: "6.298436357"},
    {inputs: ["DRG▸", "1", "+", "0.785398163", "HYP", "cosh", "=", "=", "=", "="], expected: "6.298436356"},
    {inputs: ["DRG▸", "DRG▸", "1", "+", "50", "HYP", "cosh", "=", "=", "=", "="], expected: "6.298436357"},
  ])(
    "repeats the last operation for an arithmetic operation when the equals button is pressed consecutively: $inputs 🡢 $expected", 
    ({inputs, expected}) => {
      pressButtons(inputs);
      assertOutputIsEqualTo(expected);
    }
  );
});
