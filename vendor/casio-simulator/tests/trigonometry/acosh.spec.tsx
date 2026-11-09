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

const acosh = "acosh";

describe("area hyperbolic cosine operations", () => {

  beforeEach(() => {
    renderWithProviders(
      <App />, {
        preloadedState: {
          calc: initialState,
       }
    });
  });

  it.each([
    {inputs: ["1.5", HYP, SHIFT, acosh], expected: "55.14281326"},
    {inputs: ["1.5", HYP, SHIFT, acosh, "="], expected: "55.14281326"},
    {inputs: ["3", HYP, SHIFT, acosh, SHIFT, "square"], expected: "10200.59064"},
  ])("can perform an area hyperbolic cosine operation in DEG mode: $inputs 🡢 $expected", ({inputs, expected}) => {
    pressButtons(inputs);
    assertOutputIsEqualTo(expected);
  });

  it.each([
    {inputs: [DRG, "1.5", HYP, SHIFT, acosh], expected: "0.96242365"},
    {inputs: [DRG, "1.5", HYP, SHIFT, acosh, "="], expected: "0.96242365"},
    {inputs: [DRG, "3", HYP, SHIFT, acosh, SHIFT, "square"], expected: "3.1072776"},
  ])("can perform an area hyperbolic cosine operation in RAD mode: $inputs 🡢 $expected", ({inputs, expected}) => {
    pressButtons(inputs);
    assertOutputIsEqualTo(expected);
  });

  it.each([
    {inputs: [DRG, DRG, "1.5", HYP, SHIFT, acosh], expected: "61.26979251"},
    {inputs: [DRG, DRG, "1.5", HYP, SHIFT, acosh, "="], expected: "61.26979251"},
    {inputs: [DRG, DRG, "3", HYP, SHIFT, acosh, SHIFT, "square"], expected: "12593.32177"},
  ])("can perform an area hyperbolic cosine operation in GRAD mode: $inputs 🡢 $expected", ({inputs, expected}) => {
    pressButtons(inputs);
    assertOutputIsEqualTo(expected);
  });

  it.each([
    {inputs: ["1.5", HYP, SHIFT, acosh, "=", "=", "=", "=" ], expected: "55.14281326"},
    {inputs: [DRG, "1.5", HYP, SHIFT, acosh, "=", "=", "=", "=" ], expected: "0.96242365"},
    {inputs: [DRG, DRG, "3", HYP, SHIFT, acosh, "=", "=", "=", "=" ], expected: "112.2199705"},
  ])(
    "does not repeat the last area hyperbolic cosine operation when the equals button is pressed consecutively: $inputs 🡢 $expected", 
    ({inputs, expected}) => {

      pressButtons(inputs);
      assertOutputIsEqualTo(expected);
    }
  );

  it.each([
    {inputs: ["1", "+", "1.5", HYP, SHIFT, acosh, "=", "=", "=", "="], expected: "221.571253"},
    {inputs: [DRG, "1", "+", "1.5", HYP, SHIFT, acosh, "=", "=", "=", "="], expected: "4.8496946"},
    {inputs: [DRG, DRG, "1", "+", "1.5", HYP, SHIFT, acosh, "=", "=", "=", "="], expected: "246.07917"},
  ])(
    "repeats the last operation when the equals button is pressed consecutively: $inputs 🡢 $expected", 
    ({inputs, expected}) => {

      pressButtons(inputs);
      assertOutputIsEqualTo(expected);
    }
  );
});
