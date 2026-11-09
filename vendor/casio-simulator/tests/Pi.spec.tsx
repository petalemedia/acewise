import "@testing-library/jest-dom";
import React from "react";

import App from "../src/components/App";
import { PI, assertOutputIsEqualTo, pressButton, pressButtons } from "./test-utils";
import { initialState } from "../src/calcSlice";
import { renderWithProviders } from "./test-utils";

describe("PI constant", () => {

  beforeEach(() => {
    renderWithProviders(
      <App />, {
        preloadedState: {
          calc: initialState,
       }
      });
  });

  it("displays PI when the current operand is '0' and the EXP/PI button is pressed", () => {
    pressButton(PI);
    assertOutputIsEqualTo("3.141592654");
  });

  it.each([
    "+",
    "-",
    "×",
    "÷",
  ])("displays PI constant when the last input was the ${input} operator and the EXP/PI button is pressed", (operator) => {
    pressButtons(["1", operator, PI]);
    assertOutputIsEqualTo("3.141592654");
  });

  it.each([
    { inputs: ["1", "+", PI, "="], expected: "4.141592654" },
    { inputs: [PI, "-", "1", "="], expected: "2.141592654" },
    { inputs: ["5", "×", PI, "="], expected: "15.70796327" },
    { inputs: ["15.70796327", "÷", PI], expected: "3.141592654" },
  ])("performs arithmetric with PI constant", ({inputs, expected}) => {
    pressButtons(inputs);
    assertOutputIsEqualTo(expected);
  });
});
