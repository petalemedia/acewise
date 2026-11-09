import "@testing-library/jest-dom";
import React from "react";

import App from "../src/components/App";
import { assertElementIsHidden, assertOutputIsEqualTo, pressButtons } from "./test-utils";
import { initialState } from "../src/calcSlice";
import { renderWithProviders } from "./test-utils";

describe("ALL CLEAR and CLEAR buttons", () => {

  beforeEach(() => {
    renderWithProviders(
      <App />, {
        preloadedState: {
          calc: initialState,
       }
      });
  });

  it.each([
    {inputs: ["AC"], expected: "0"},
    {inputs: ["5", "C"], expected: "0"},
    {inputs: ["5", "+", "5", "C", "6"], expected: "6"},
    {inputs: ["5", "+", "5", "C", "6", "="], expected: "11"},
    {inputs: ["5", "+", "5", "C", "AC"], expected: "0"},
  ])("clears memory: $inputs 🡢 $expected", ({inputs, expected}) => {
    pressButtons(inputs);
    assertOutputIsEqualTo(expected);
    assertElementIsHidden("operator-indicator");
    if (inputs[inputs.length - 1] !== "=") {
      assertElementIsHidden("equals-indicator");
    }
  });

  it.each([
    {inputs: ["5", "+", "C"]},
    {inputs: ["5", "÷", "5", "C", "AC"]}
  ])("clears operator indicators: $inputs 🡢 $expected", ({inputs}) => {
    pressButtons(inputs);
    assertElementIsHidden("operator-indicator");
  });

  it.each([
    {inputs: ["1", "+", "1", "=", "C"]},
    {inputs: ["5", "÷", "5", "=", "C", "AC"]}
  ])("clears equals indicators: $inputs 🡢 $expected", ({inputs}) => {
    pressButtons(inputs);
    assertElementIsHidden("equals-indicator");
  });
});
