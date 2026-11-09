import "@testing-library/jest-dom";
import React from "react";

import App from "../src/components/App";
import { assertOutputIsEqualTo, pressButtons } from "./test-utils";
import { initialState } from "../src/calcSlice";
import { renderWithProviders } from "./test-utils";

describe("Arithmetic", () => {

  beforeEach(() => {
    renderWithProviders(
      <App />, {
        preloadedState: {
          calc: initialState,
       }
      });
  });

  it.each([
    {inputs: ["1", "+", "1", "="], expected: "2"},
    {inputs: ["0.1", "+", "0.1", "="], expected: "0.2"},
    {inputs: [".01", "+", "0.01", "="], expected: "0.02"},
    {inputs: ["32768.1638", "+", "16384.0819", "="], expected: "49152.2457"},
    {inputs: ["99", "+", "1", "="], expected: "100"},
    {inputs: ["1", "-", "1", "="], expected: "0"},
    {inputs: [".01", "-", ".001", "="], expected: "0.009"},
    {inputs: ["100", "-", "99", "="], expected: "1"},
    {inputs: ["1", "×", "0", "="], expected: "0"},
    {inputs: ["10", "×", "0.1", "="], expected: "1"},
    {inputs: ["10.1", "×", "0.1", "="], expected: "1.01"},
    {inputs: ["10", "×", "10", "="], expected: "100"},
    {inputs: ["1", "÷", "0", "="], expected: "Error"},
    {inputs: ["1", "÷", "1", "="], expected: "1"},
    {inputs: ["10", "÷", "5", "="], expected: "2"},
    {inputs: ["100", "÷", "0.5", "="], expected: "200"},
  ])("performs arithmetic: $inputs 🡢 $expected", ({inputs, expected}) => {
    pressButtons(inputs);
    assertOutputIsEqualTo(expected);
  });

  it.each([
    {inputs: ["1", "+", "="], expected: "2"},
    {inputs: ["2", "-", "="], expected: "0"},
    {inputs: ["3", "×", "="], expected: "9"},
    {inputs: ["4", "÷", "="], expected: "1"},
  ])("infers missing operand: $inputs 🡢 $expected", ({inputs, expected}) => {
    pressButtons(inputs);
    assertOutputIsEqualTo(expected);
  });

  it.each([
    {inputs: ["5", "+", "5", "+"], expected: "10"},
    {inputs: ["5", "+", "5", "-"], expected: "10"},
    {inputs: ["5", "×", "5", "×"], expected: "25"},
    {inputs: ["5", "÷", "5", "÷"], expected: "1"},
    {inputs: ["5", "×", "5", "÷"], expected: "25"},
    {inputs: ["5", "÷", "5", "×"], expected: "1"},
    {inputs: ["5", "×", "5", "+"], expected: "25"},
    {inputs: ["5", "×", "5", "-"], expected: "25"},
    {inputs: ["5", "÷", "5", "+"], expected: "1"},
    {inputs: ["5", "÷", "5", "-"], expected: "1"},
    {inputs: ["5", "+", "5", "×"], expected: "5"},
    {inputs: ["5", "+", "5", "÷"], expected: "5"},
    {inputs: ["5", "-", "5", "×"], expected: "5"},
    {inputs: ["5", "-", "5", "÷"], expected: "5"},
    {inputs: ["5", "+", "5", "×", "5", "×"], expected: "25"},
    {inputs: ["5", "-", "5", "×", "5", "×"], expected: "25"},
    {inputs: ["5", "+", "5", "÷", "5", "×"], expected: "1"},
    {inputs: ["5", "-", "5", "÷", "5", "×"], expected: "1"},
    {inputs: ["300", "×", "2", "×"], expected: "600"},
    {inputs: ["300", "×", "100", "÷"], expected: "30000"},
    {inputs: ["300", "÷", "2", "÷"], expected: "150"},
    {inputs: ["300", "÷", "100", "×"], expected: "3"},
  ])("displays interim MDAS evaluation steps: $inputs 🡢 $expected", ({inputs, expected}) => {
    pressButtons(inputs);
    assertOutputIsEqualTo(expected);
  });

  it.each([
    {inputs: ["10", "+/-"], expected: "-10"},
    {inputs: ["0.1", "×", "10", "+/-", "="], expected: "-1"},
    {inputs: ["10", "+/-", "+/-"], expected: "10"},
    {inputs: ["10", "+/-", "+", "10", "="], expected: "0"},
    {inputs: ["10", "+/-", "+", "10", "+/-", "="], expected: "-20"},
    {inputs: ["10", "+/-", "+/-", "+", "10", "+/-", "="], expected: "0"},
    {inputs: ["10", "+/-", "+", "10", "+/-", "=", "+/-"], expected: "20"},
    {
      inputs: ["10", "+/-", "+", "10", "+/-", "=", "+/-", "-", "10", "=", "+/-", "÷", "2", "=", "+/-", "×", "3", "+/-", "="],
      expected: "-15"
    },
    {inputs: ["1", "÷", "0", "=", "+/-"], expected: "Error"},
  ])("inverts the sign of a number when the 'invert sign' function button is pressed: $inputs 🡢 $expected", ({inputs, expected}) => {
    pressButtons(inputs);
    assertOutputIsEqualTo(expected);
  });

  it.each([
    {inputs: ["4","+", "4", "=", "=", "=", "="], expected: "20"},
    {inputs: ["20","-", "4", "=", "=", "=", "="], expected: "4"},
    {inputs: ["4", "×", "2", "=", "=", "=", "="], expected: "64"},
    {inputs: ["64", "÷", "2", "=", "=", "=", "="], expected: "4"},
    {inputs: ["5", "+", "5", "=", "=", "=", "÷", "4", "="], expected: "5"},
    {inputs: ["5", "+", "=", "=", "=", "="], expected: "25"},
  ])(
    "repeats the last operation when the equals button is pressed consecutively: $inputs 🡢 $expected", 
    ({inputs, expected}) => {

      pressButtons(inputs);
      assertOutputIsEqualTo(expected);
    }
  );
});
