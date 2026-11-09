import "@testing-library/jest-dom";
import React from "react";

import App from "../src/components/App";
import { SHIFT, assertOutputIsEqualTo, pressButtons } from "./test-utils";
import { initialState } from "../src/calcSlice";
import { renderWithProviders } from "./test-utils";


describe("Input", () => {

  beforeEach(() => {
    renderWithProviders(
      <App />, {
        preloadedState: {
          calc: initialState,
       }
      });
  });

  it.each([
    {inputs: ["12345678901"], expected: "1234567890"},
    {inputs: ["0.1234567890"], expected: "0.123456789"},
    {inputs: ["0.1234567890", "+/-"], expected: "-0.123456789"},
    {inputs: ["0.123", "+/-", "4567890"], expected: "-0.123456789"}
  ])("limits the maximum length of an operand to 10 digits: $inputs 🡢 $expected", ({inputs, expected}) => {
    pressButtons(inputs);
    assertOutputIsEqualTo(expected);
  });

  it.each([
    {inputs: ["0"], expected: "0"},
    {inputs: ["00"], expected: "0"},
    {inputs: ["01"], expected: "1"},
    {inputs: ["123"], expected: "123"},
  ])("displays inputed integer operand: $inputs 🡢 $expected", ({inputs, expected}) => {
    pressButtons(inputs);
    assertOutputIsEqualTo(expected);
  });

  it.each([
    {inputs: ["0.0"], expected: "0.0"},
    {inputs: [".0"], expected: "0.0"},
    {inputs: ["0.00"], expected: "0.00"},
    {inputs: ["0.009"], expected: "0.009"},
    {inputs: ["12.0210"], expected: "12.0210"},
  ])("displays inputed decimal operand: $inputs 🡢 $expected", ({inputs, expected}) => {
    pressButtons(inputs);
    assertOutputIsEqualTo(expected);
  });

  it.each([
    {inputs: ["÷", "×", "+", "-", "+", "5", "="], expected: "5"},
    {inputs: ["÷", "×", "+", "-", "+", "-", "5", "="], expected: "-5"},
    {inputs: ["2", "÷", "×", "+", "-", "+", "×", "÷", "1", "="], expected: "2"},
    {inputs: ["1", "÷", "×", "+", "-", "+", "×", "2"], expected: "2"}
  ])("handles consecutive operation selections: $inputs 🡢 $expected", ({inputs, expected}) => {
    pressButtons(inputs);
    assertOutputIsEqualTo(expected);
  });

  it.each([
    {inputs: ["2", SHIFT, "square", "1", "2", "3"], expected: "123"},
    {inputs: ["144", "square root", "7", "7", "7"], expected: "777"},
  ])("replaces current operand after function with new digit", ({inputs, expected}) => {
    pressButtons(inputs);
    assertOutputIsEqualTo(expected);
  });
});
