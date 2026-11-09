import "@testing-library/jest-dom";
import React from "react";

import App from "../src/components/App";
import { FRAC, SEX, SHIFT, assertOutputIsEqualTo, pressButtons } from "./test-utils";
import { initialState } from "../src/calcSlice";
import { renderWithProviders } from "./test-utils";

describe("Brackets", () => {

  beforeEach(() => {
    renderWithProviders(
      <App />, {
        preloadedState: {
          calc: initialState,
       }
      });
  });
  
  it.each([
    {inputs: ["(", "3", "+", "1", ")"], expected: "4"},
    {inputs: ["1", "+", "(", "4", "+", "1", ")"], expected: "5"},
    {inputs: ["2", "×", "(", "6", "+", "2", SHIFT, "square", ")"], expected: "10"},
    {inputs: ["3", "÷", "(", "122", SEX, "5", SEX, "6", SEX, "+", "1", ")"], expected: "123.085"},
    {inputs: ["4", "+", "(", "2", FRAC, "4", ")"], expected: "1⨼2"},
  ])("evaluates a bracketed expression when the bracket is closed: $inputs 🡢 $expected", ({inputs, expected}) => {
    pressButtons(inputs);
    assertOutputIsEqualTo(expected);
  });

  it.each([
    {inputs: ["1", "+", "(", "1", "+", "(", "1", "+", "1", ")"], expected: "2"},
    {inputs: ["2", "-", "(", "2", "-", "(", "122", SEX, "5", SEX, "6", SEX, "+", "1", ")"], expected: "123.085"},
    {inputs: ["(", "1", "+", "(", "2", "×", "(", "1", "+", "1", ")"], expected: "2"},
    {inputs: ["(", "1", "+", "(", "2", "×", "(", "1", FRAC, "4", "+", "1", ")"], expected: "1.25"},
  ])("evaluates a nested bracketed expression when the bracket is closed: $inputs 🡢 $expected", ({inputs, expected}) => {
    pressButtons(inputs);
    assertOutputIsEqualTo(expected);
  });

  it.each([
    {inputs: ["(", "5", "×", "5", "+"], expected: "25"},
    {inputs: ["(", "123", SEX, "5", SEX, "6", SEX, "×", "2", "-"], expected: "246.17"},
    {inputs: ["1", "+", "(", "5", "÷", "5", "+"], expected: "1"},
    {inputs: ["2", "-", "(", "1", FRAC, "4", "÷", "2", "-"], expected: "0.125"},
  ])("evaluates an MDAS step inside a bracket: $inputs 🡢 $expected", ({inputs, expected}) => {
    pressButtons(inputs);
    assertOutputIsEqualTo(expected);
  });

  it.each([
    {inputs: ["1", "+", "(", "1", "+", "(", "5", "×", "5", "+"], expected: "25"},
    {inputs: ["2", "-", "(", "2", "-", "(", "5", "×", "5", "-"], expected: "25"},
    {inputs: ["3", "×", "(", "3", "×", "(", "123", SEX, "5", SEX, "6", SEX, "÷", "2", "+"], expected: "61.5425"},
    {inputs: ["4", "÷", "(", "4", "÷", "(", "1", FRAC, "4", "÷", "2", "-"], expected: "0.125"},
  ])("evaluates an MDAS step inside a nested bracket: $inputs 🡢 $expected", ({inputs, expected}) => {
    pressButtons(inputs);
    assertOutputIsEqualTo(expected);
  });

  it.each([
    {inputs: ["1", "+", "(", "1", "+", "1", ")", "="], expected: "3"},
    {inputs: ["2", "-", "(", "0.4", SHIFT, "square", ")", "="], expected: "1.84"},
    {inputs: ["3", "÷", "(", "1", SEX, "5", SEX, "6", SEX, "×", "2", ")", "="], expected: "1.382488479"},
    {inputs: ["4", "×", "(", "1", FRAC, "4", "×", "2", "+", "1", FRAC, "4", ")", "="], expected: "3⨼1"},
  ])("evaluates an arithmetic expression with one set of brackets: $inputs 🡢 $expected", ({inputs, expected}) => {
    pressButtons(inputs);
    assertOutputIsEqualTo(expected);
  });

  it.each([
    {inputs: ["(", "1.1", "+", "1.2", ")", "×", "(", "4", "-", "1", ")", "="], expected: "6.9"},
    {inputs: ["(", "2.1", "-", "0.1", ")", "×", "(", "144", "square root", ")", "="], expected: "24"},
    {inputs: ["(", "60", SEX, "5", SEX, "6", SEX, "×", "2", ")", "×", "(", "1", FRAC, "6", "+", "2", FRAC, "12", ")", "="], expected: "40⨼17⨼300"},
    {inputs: ["(", "1", FRAC, "6", "+", "2", FRAC, "12", ")", "÷", "(", "0.25", "+", "1", FRAC, "4", ")", "="], expected: "2⨼3"},
  ])("evaluates an arithmetic expression with multiple sets of brackets: $inputs 🡢 $expected", ({inputs, expected}) => {
    pressButtons(inputs);
    assertOutputIsEqualTo(expected);
  });

  it.each([
    {inputs: ["(", "(", "1", "+", "2", ")", "-", "3", ")", "+", "1", "="], expected: "1"},
    {inputs: ["(", "1", "+", "(", "1", "-", "0.5", ")", "×", "(", "8", "÷", "2", ")", ")", "-", "2", "="], expected: "1"},
    {inputs: ["10", "+", "(", "6", "×", "(", "1", "+", "1", ")", ")", "="], expected: "22"},
    {inputs: ["20", "-", "(", "(", "10", "÷", "5", "+", "3", ")", "+", "(", "(", "3", "×", "2", ")", "×", "(", "1", "+", "1", ")", ")", ")", "="], expected: "3"},
    {inputs: ["30", "×", "(", "2", SEX, "5", SEX, "6", SEX, "×", "2", "-", "(", "5", "÷", "5", "×", "2", ")", ")", "="], expected: "65.1"},
    {inputs: ["40", "-", "(", "2", "+", "(", "2", FRAC, "12", "×", "3", "+", "2", FRAC, "6", ")", ")", "="], expected: "37⨼1⨼6"},
  ])("evaluates an arithmetic expression with nested brackets: $inputs 🡢 $expected", ({inputs, expected}) => {
    pressButtons(inputs);
    assertOutputIsEqualTo(expected);
  });

  it.each([
    {inputs: ["(", "1", "+", "(", "2", "+", "(", "3", "+", "(", "4", "+", "5", ")", ")", ")", ")", "="], expected: "15"},
    {inputs: ["1", "+", "(", "2", "+", "(", "3", "+", "(", "2", SHIFT, "square", "+", "(", "5", "+", "5", ")", ")", ")", ")", "="], expected: "20"},
    {inputs: ["(", "10", "÷", "2", SEX, "5", SEX, "6", SEX, ")", "+", "(", "(", "3", "×", "2", ")", "×", "(", "1", "+", "1", ")", ")", "="], expected: "16.79616307"},
    {inputs: ["2", "+", "(", "2", SHIFT, "square", "+", "(", "3", FRAC, "4", FRAC, "5", "-", "(", "4", "÷", "(", "5", "×", "5", ")", ")", ")", ")", "="], expected: "9.64"},
  ])("evaluates an arithmetic expression with multiple nested brackets: $inputs 🡢 $expected", ({inputs, expected}) => {
    pressButtons(inputs);
    assertOutputIsEqualTo(expected);
  });
});
