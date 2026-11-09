import "@testing-library/jest-dom";
import React from "react";
import { screen } from "@testing-library/react";

import App from "../src/components/App";
import { SHIFT, assertOutputIsEqualTo, pressButtons } from "./test-utils";
import { initialState } from "../src/calcSlice";
import { renderWithProviders } from "./test-utils";

describe("Exponential notation", () => {

  beforeEach(() => {
    renderWithProviders(
      <App />, {
        preloadedState: {
          calc: initialState,
       }
      });
  });

  it.each([
    {
      inputs: ["9999999999", "×", "9999999999", "="], 
      expectedCoefficient: 9.999999998, 
      expectedBase: 10,
      expectedExponent: 19,
    },
    {
      inputs: ["9999999999", SHIFT, "square", "=", "=", "=", "="], 
      expectedCoefficient: 9.999999984,
      expectedBase: 10,
      expectedExponent: 159,
    },
    {
      inputs: ["9999999999", "×", "9999999999", "="], 
      expectedCoefficient: 9.999999998,
      expectedBase: 10,
      expectedExponent: 19,
    },
    {
      inputs: ["6.25", "÷", "9999999999", "="],
      expectedCoefficient: 6.250000001,
      expectedBase: 10,
      expectedExponent: -10,
    },
    {
      inputs: ["0.5", "÷", "1111111111", "="],
      expectedCoefficient: 4.5,
      expectedBase: 10,
      expectedExponent: -10,
    }
  ])(
    "displays exponential correctly: $inputs 🡢 $expected", 
    ({inputs, expectedCoefficient, expectedBase, expectedExponent }) => {

      pressButtons(inputs);
      assertCoefficientIsDisplayed(expectedCoefficient);
      assertTimesBaseIsDisplayed(expectedBase);
      assertExponentIsDisplayed(expectedExponent);
    }
  );

  it.each([
    {inputs: ["0.000000001", "÷", "100", "×", "100", "="], expected: "0.000000001"},
    {inputs: ["0.000000001", "÷", "10", "×", "10", "="], expected: "0.000000001"},
  ])(
    "displays an exponential number result in fixed-point notation when exponent is 10 or less: $inputs 🡢 $expected", 
    ({inputs, expected}) => {

      pressButtons(inputs);
      assertOutputIsEqualTo(expected);
    }
  );

  const assertCoefficientIsDisplayed = (expectedCoefficient: number) => {
    const coefficientEl = screen.getByLabelText("coefficient");
    expect(coefficientEl).toBeInTheDocument();
    expect(coefficientEl.innerHTML).toEqual(`${expectedCoefficient}`);
  };

  const assertTimesBaseIsDisplayed = (expectedBase: number) => {
    const timeBaseEl = screen.getByLabelText("times base");
    expect(timeBaseEl).toBeInTheDocument();
    expect(timeBaseEl.innerHTML).toEqual(`x${expectedBase}`);
  };

  const assertExponentIsDisplayed = (expectedExponent: number) => {
    const assertExponentEl = screen.getByLabelText("exponent");
    expect(assertExponentEl).toBeInTheDocument();
    expect(assertExponentEl.innerHTML).toEqual(`${expectedExponent}`);
  };
});
