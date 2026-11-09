import "@testing-library/jest-dom"
import React from "react";

import App from "../../src/components/App";

import { 
  DRG,
  SHIFT,
  assertOutputIsEqualTo, 
  pressButtons, 
  renderWithProviders
} from "../test-utils";

import { initialState } from "../../src/calcSlice";

const cos = "cos";

describe("Cosine operations", () => {

  beforeEach(() => {
    renderWithProviders(
      <App />, {
        preloadedState: {
          calc: initialState,
       }
    });
  });

  it.each([
    {inputs: ["22.5", cos], expected: "0.923879533"},
    {inputs: ["22.5", cos, "="], expected: "0.923879533"},
    {inputs: ["22.5", cos, SHIFT, "square"], expected: "0.853553391"},
  ])("can perform a cosine operation in DEG mode: $inputs 🡢 $expected", ({inputs, expected}) => {
    pressButtons(inputs);
    assertOutputIsEqualTo(expected);
  });

  it.each([
    {inputs: [DRG, "22.5", cos], expected: "-0.87330464"},
    {inputs: [DRG, "22.5", cos, "="], expected: "-0.87330464"},
    {inputs: [DRG, "22.5", cos, SHIFT, "square"], expected: "0.762660994"},
  ])("can perform a cosine operation in RAD mode: $inputs 🡢 $expected", ({inputs, expected}) => {
    pressButtons(inputs);
    assertOutputIsEqualTo(expected);
  });

  it.each([
    {inputs: [DRG, DRG, "22.5", cos], expected: "0.938191336"},
    {inputs: [DRG, DRG, "22.5", cos, "="], expected: "0.938191336"},
    {inputs: [DRG, DRG, "22.5", cos, SHIFT, "square"], expected: "0.880202983"},
  ])("can perform a cosine operation in GRAD mode: $inputs 🡢 $expected", ({inputs, expected}) => {
    pressButtons(inputs);
    assertOutputIsEqualTo(expected);
  });

  it.each([
    {inputs: ["22.5", cos, "=", "=", "=", "=" ], expected: "0.923879533"},
    {inputs: [DRG, "22.5", cos, "=", "=", "=", "=" ], expected: "-0.87330464"},
    {inputs: [DRG, DRG, "22.5", cos, "=", "=", "=", "=" ], expected: "0.938191336"},
  ])(
    "does not repeat the last cosine operation when the equals button is pressed consecutively: $inputs 🡢 $expected", 
    ({inputs, expected}) => {

      pressButtons(inputs);
      assertOutputIsEqualTo(expected);
    }
  );

  it.each([
    {inputs: ["1", "+", "22.5", cos, "=", "=", "=", "="], expected: "4.69551813"},
    {inputs: [DRG, "1", "+", "22.5", cos, "=", "=", "=", "="], expected: "-2.49321856"},
    {inputs: [DRG, DRG, "1", "+", "22.5", cos, "=", "=", "=", "="], expected: "4.752765344"},
  ])(
    "repeats the last operation for an arithmetic operation when the equals button is pressed consecutively: $inputs 🡢 $expected", 
    ({inputs, expected}) => {

      pressButtons(inputs);
      assertOutputIsEqualTo(expected);
    }
  );
});
