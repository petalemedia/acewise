import "@testing-library/jest-dom";
import React from "react";

import App from "../src/components/App";
import { SHIFT, assertOutputIsEqualTo, pressButtons } from "./test-utils";
import { initialState } from "../src/calcSlice";
import { renderWithProviders } from "./test-utils";

describe("Percentage calculations", () => {

  beforeEach(() => {
    renderWithProviders(
      <App />, {
        preloadedState: {
          calc: initialState,
       }
      });
  });

  it.each([
    {inputs: ["5", "0", "0", SHIFT, "%"], expected: "5"},
    {inputs: ["5", "0", SHIFT, "%"], expected: "0.5"},
    {inputs: ["5", SHIFT, "%"], expected: "0.05"},
    {inputs: ["0", ".", "5", SHIFT, "%"], expected: "0.005"}
  ])("performs percentage calculations involving a single operand: $inputs 🡢 $expected", ({inputs, expected}) => {
    pressButtons(inputs);
    assertOutputIsEqualTo(expected);
  });

  it.each([
    {inputs: ["1500", "×", "12", SHIFT, "%"], expected: "180"},
    {inputs: ["660", "÷", "880", SHIFT, "%"], expected: "75"},
    {inputs: ["2500", "+", "15", SHIFT, "%"], expected: "2875"},
    {inputs: ["3500", "-", "25", SHIFT, "%"], expected: "2625"},
  ])("performs percentage calculations involving two operands: $inputs 🡢 $expected", ({inputs, expected}) => {
    pressButtons(inputs);
    assertOutputIsEqualTo(expected);
  });

  it.each([
    {inputs: ["1500", "×", "12", SHIFT, "%", "=", "=", "=", "="], expected: "0.31104"},
  ])(
    "repeats the last operation when the equals button is pressed consecutively: $inputs 🡢 $expected", 
    ({inputs, expected}) => {

      pressButtons(inputs);
      assertOutputIsEqualTo(expected);
    }
  );
});
