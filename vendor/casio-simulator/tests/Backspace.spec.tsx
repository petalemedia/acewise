import "@testing-library/jest-dom";
import React from "react";

import App from "../src/components/App";
import { BACK, FRAC, SEX, SHIFT, assertOutputIsEqualTo, pressButtons } from "./test-utils";
import { initialState } from "../src/calcSlice";
import { renderWithProviders } from "./test-utils";

describe("Backspace", () => {

  beforeEach(() => {
    renderWithProviders(
      <App />, {
        preloadedState: {
          calc: initialState,
       }
      });
  });
  
  it.each([
    {inputs: [BACK], expected: "0"},
    {inputs: [BACK, BACK], expected: "0"},
    {inputs: ["1", BACK], expected: "0"},
    {inputs: ["12", BACK], expected: "1"},
    {inputs: ["123.4", BACK], expected: "123."},
    {inputs: ["123.4", BACK, BACK], expected: "123"},
    {inputs: ["123", BACK, BACK, BACK], expected: "0"},
    {inputs: ["123", "+/-", BACK, BACK, BACK], expected: "0"},
  ])("backspaces through a decimal input: $inputs 🡢 $expected", ({inputs, expected}) => {
    pressButtons(inputs);
    assertOutputIsEqualTo(expected);
  });

  it.each([
    { backspaces: 1, expected: "123⨼456⨼7"},
    { backspaces: 2, expected: "123⨼456⨼"},
    { backspaces: 3, expected: "123⨼456"},
    { backspaces: 4, expected: "123⨼45"},
    { backspaces: 5, expected: "123⨼4"},
    { backspaces: 6, expected: "123⨼"},
    { backspaces: 7, expected: "123"},
    { backspaces: 8, expected: "12"},
    { backspaces: 9, expected: "1"},
    { backspaces: 10, expected: "0"},
  ])("backspaces through a fraction input: $inputs 🡢 $expected", ({backspaces, expected}) => {
    const inputs = [
      "123",
      FRAC,
      "456",
      FRAC,
      "78",
      ...Array.from({ length: backspaces }, () => BACK),
    ];
    pressButtons(inputs);
    assertOutputIsEqualTo(expected);
  });

  it("preserves the negative sign when backspacing through a fraction input", () => {
    const inputs = [
      "3", 
      "+/-", 
      FRAC, 
      "1", 
      "+/-", 
      FRAC, 
      "16", 
      "+/-",
      ...Array.from({ length: 5 }, () => BACK),
    ];
    
    pressButtons(inputs);
    assertOutputIsEqualTo("-3");
  });

  it("does not break fraction input", () => {
    const inputs = [
      "5",  // 5
      FRAC, // 5⨼
      BACK, // 5
      FRAC, // 5⨼ 
      "12", // 5⨼12 
      BACK, // 5⨼1 
      FRAC, // 5⨼1⨼
      "3",  // 5⨼1⨼3
      BACK, // 5⨼1⨼
      BACK, // 5⨼1 
      FRAC, // 5⨼1⨼
      "4",  // 5⨼1⨼4
      "+",  // +
      "1",  // 1
      FRAC, // 1⨼
      "2",  // 1⨼2
      "="   // =
    ];
    pressButtons(inputs);
    assertOutputIsEqualTo("5⨼3⨼4");
  });

  it.each([
    {inputs: ["5", "×", "5", "+", BACK], expected: "25"},
    {inputs: ["5", "÷", "5", "+", BACK], expected: "1"},
  ])("does not backspace through an MDAS evaluation: $inputs 🡢 $expected", ({inputs, expected}) => {
    pressButtons(inputs);
    assertOutputIsEqualTo(expected);
  });

  it.each([
    {inputs: ["5", SHIFT, "square", BACK], expected: "25"},
    {inputs: ["123", SEX, "8", SEX, "6", SEX, BACK], expected: "123.135"},
  ])("does not backspace through a function evaluation: $inputs 🡢 $expected", ({inputs, expected}) => {
    pressButtons(inputs);
    assertOutputIsEqualTo(expected);
  });

  it.each([
    {inputs: ["5", "×", "5", "=", BACK], expected: "25"},
    {inputs: ["5", "÷", "5", "=", BACK], expected: "1"},
    {inputs: ["5", FRAC, "1", FRAC, "4", "+", "3", FRAC, "4", "=", BACK], expected: "6"},
  ])("does not backspace through a result: $inputs 🡢 $expected", ({inputs, expected}) => {
    pressButtons(inputs);
    assertOutputIsEqualTo(expected);
  });
});
