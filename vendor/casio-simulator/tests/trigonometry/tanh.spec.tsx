import "@testing-library/jest-dom"
import React from "react";

import App from "../../src/components/App";

import { 
  assertOutputIsEqualTo, 
  pressButtons, 
  renderWithProviders
} from "../test-utils";

import { initialState } from "../../src/calcSlice";

describe("Hyperbolic tangent operations", () => {

  beforeEach(() => {
    renderWithProviders(
      <App />, {
        preloadedState: {
          calc: initialState,
       }
    });
  });

  it.each([
    {inputs: ["0", "HYP", "tanh"], expected: "1"},
    {inputs: ["45", "HYP", "tanh", "="], expected: "0.655794203"},
    {inputs: ["90", "+/-", "HYP", "tanh", "+", "1", "="], expected: "0.082847664"},
  ])("can perform a hyperbolic tangent operation in DEG mode: $inputs 🡢 $expected", ({inputs, expected}) => {
    pressButtons(inputs);
    assertOutputIsEqualTo(expected);
  });

  it.each([
    {inputs: ["DRG▸", "0", "HYP", "tanh"], expected: "1"},
    {inputs: ["DRG▸", "0.785398163", "HYP", "tanh", "="], expected: "0.655794202"},
    {inputs: ["DRG▸", "1.570796327", "+/-", "HYP", "tanh", "+", "1", "="], expected: "0.082847664"},
  ])("can perform a hyperbolic tangent operation in RAD mode: $inputs 🡢 $expected", ({inputs, expected}) => {
    pressButtons(inputs);
    assertOutputIsEqualTo(expected);
  });

  it.each([
    {inputs: ["DRG▸", "DRG▸", "0", "HYP", "tanh"], expected: "1"},
    {inputs: ["DRG▸", "DRG▸", "50", "HYP", "tanh", "="], expected: "0.655794203"},
    {inputs: ["DRG▸", "DRG▸", "100", "+/-", "HYP", "tanh", "+", "1", "="], expected: "0.082847664"},
  ])("can perform a hyperbolic tangent operation in GRAD mode: $inputs 🡢 $expected", ({inputs, expected}) => {
    pressButtons(inputs);
    assertOutputIsEqualTo(expected);
  });

  it.each([
    {inputs: ["45", "HYP", "tanh", "=", "=", "=", "=" ], expected: "0.655794203"},
    {inputs: ["DRG▸", "0.785398163", "HYP", "tanh", "=", "=", "=", "=" ], expected: "0.655794202"},
    {inputs: ["DRG▸", "DRG▸", "50", "HYP", "tanh", "=", "=", "=", "=" ], expected: "0.655794203"},
  ])(
    "does not repeat the last hyperbolic tangent operation when the equals button is pressed consecutively: $inputs 🡢 $expected", 
    ({inputs, expected}) => {
      pressButtons(inputs);
      assertOutputIsEqualTo(expected);
    }
  );

  it.each([
    {inputs: ["1", "+", "45", "HYP", "tanh", "=", "=", "=", "="], expected: "3.623176811"},
    {inputs: ["DRG▸", "1", "+", "0.785398163", "HYP", "tanh", "=", "=", "=", "="], expected: "3.62317681"},
    {inputs: ["DRG▸", "DRG▸", "1", "+", "50", "HYP", "tanh", "=", "=", "=", "="], expected: "3.623176811"},
  ])(
    "repeats the last operation for an arithmetic operation when the equals button is pressed consecutively: $inputs 🡢 $expected", 
    ({inputs, expected}) => {
      pressButtons(inputs);
      assertOutputIsEqualTo(expected);
    }
  );
});
