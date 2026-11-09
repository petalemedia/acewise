import "@testing-library/jest-dom";
import React from "react";
import { screen } from "@testing-library/react";

import App from "../src/components/App";
import { FRAC, SHIFT, pressButtons, renderWithProviders } from "./test-utils";
import { initialState } from "../src/calcSlice";

describe("Fraction calculations", () => {

  beforeEach(() => {
    renderWithProviders(
      <App />, {
        preloadedState: {
          calc: initialState,
       }
    });
  });

  it.each([
    { inputs: ["1", FRAC, "2"], expected: "1⨼2" },
    { inputs: ["11", FRAC, "22"], expected: "11⨼22" },
  ])("allows the input of a proper fraction: $inputs 🡢 $expected", ({inputs, expected}) => {
    pressButtons(inputs);
    expect(screen.getByTestId("output")).toHaveTextContent(expected);
  });

  it.each([
    { inputs: ["2", FRAC, "1"], expected: "2⨼1" },
    { inputs: ["22", FRAC, "1111111"], expected: "22⨼1111111" },
  ])("allows the input of a improper fraction: $inputs 🡢 $expected", ({inputs, expected}) => {
    pressButtons(inputs);
    expect(screen.getByTestId("output")).toHaveTextContent(expected);
  });

  it.each([
    { inputs: ["1", FRAC, "2", FRAC, "3"], expected: "1⨼2⨼3" },
    { inputs: ["11", FRAC, "2", FRAC, "33333"], expected: "11⨼2⨼33333" },
  ])("allows the input of a mixed fraction: $inputs 🡢 $expected", ({inputs, expected}) => {
    pressButtons(inputs);
    expect(screen.getByTestId("output")).toHaveTextContent(expected);
  });

  it.each([
    { inputs: ["1", "+/-", FRAC, "2"], expected: "-1⨼2" },
    { inputs: ["1", FRAC, "+/-", "2"], expected: "-1⨼2" },
    { inputs: ["1", FRAC, "2", "+/-"], expected: "-1⨼2" },
    { inputs: ["1", FRAC, "2", FRAC, "3", "+/-"], expected: "-1⨼2⨼3" },
    { inputs: ["1", "+/-", FRAC, "2", "+/-", FRAC, "3", "+/-"], expected: "-1⨼2⨼3" },
  ])("allows the input of a negative fraction: $inputs 🡢 $expected", ({inputs, expected}) => {
    pressButtons(inputs);
    expect(screen.getByTestId("output")).toHaveTextContent(expected);
  });

  it.each([
    { inputs: ["1", "+/-", FRAC, "2", "+/-"], expected: "1⨼2" },
    { inputs: ["1", FRAC, "2", "+/-", FRAC, "3", "+/-"], expected: "1⨼2⨼3" },
  ])("toggles the sign back to positive when 'invert sign' is used twice: $inputs 🡢 $expected", ({inputs, expected}) => {
    pressButtons(inputs);
    expect(screen.getByTestId("output")).toHaveTextContent(expected);
  });

  it.each([
    { inputs: ["0", FRAC], expected: "0" },
    { inputs: ["0.1", FRAC], expected: "0.1" },
    { inputs: ["1.012345", FRAC], expected: "1.012345" },
  ])("prevents an invalid entry: $inputs 🡢 $expected", ({inputs, expected}) => {
    pressButtons(inputs);
    expect(screen.getByTestId("output")).toHaveTextContent(expected);
  });

  it.each([
    { inputs: ["123", FRAC, "567", FRAC, "901" ], expected: "123⨼567⨼90" },
    { inputs: ["1", FRAC, "3", FRAC, "5678901", FRAC, ], expected: "1⨼3⨼567890" },
  ])("restricts the length of a fraction, including its bars, to a maximum of 10 digits: $inputs 🡢 $expected", ({inputs, expected}) => {
    pressButtons(inputs);
    expect(screen.getByTestId("output")).toHaveTextContent(expected);
  });

  it.each([
    { inputs: ["1", FRAC, "1", "="], expected: "1⨼1" },
    { inputs: ["20", FRAC, "10", "="], expected: "2⨼1" },
    { inputs: ["300", FRAC, "1000", "="], expected: "3⨼1" },
  ])("displays integer results in fractional form: $inputs 🡢 $expected", ({inputs, expected}) => {
    pressButtons(inputs);
    expect(screen.getByTestId("output")).toHaveTextContent(expected);
  });

  it.each([
    { inputs: ["2", FRAC, "4", "="], expected: "1⨼2" },
    { inputs: ["2", FRAC, "8", "="], expected: "1⨼4" },
    { inputs: ["2", FRAC, "8", "+/-", "="], expected: "-1⨼4" },
  ])("reduces a fraction to its simplest form: $inputs 🡢 $expected", ({inputs, expected}) => {
    pressButtons(inputs);
    expect(screen.getByTestId("output")).toHaveTextContent(expected);
  });

  it.each([
    { inputs: ["2", FRAC, "3", "+", "4", FRAC, "5", "="], expected: "1⨼7⨼15" },
    { inputs: ["1", FRAC, "2", "+", "1", FRAC, "2", "="], expected: "1⨼1" },
  ])("handles arithmetic with proper fractions: $inputs 🡢 $expected", ({inputs, expected}) => {
    pressButtons(inputs);
    expect(screen.getByTestId("output")).toHaveTextContent(expected);
  });

  it.each([
    { inputs: ["13", FRAC, "4", "+", "5", FRAC, "3", "="], expected: "4⨼11⨼12" },
    { inputs: ["4", FRAC, "2", "+", "2", FRAC, "1", "="], expected: "4" },
  ])("handles arithmetic with improper fractions: $inputs 🡢 $expected", ({inputs, expected}) => {
    pressButtons(inputs);
    expect(screen.getByTestId("output")).toHaveTextContent(expected);
  });

  it.each([
    { inputs: ["3", FRAC, "1", FRAC, "4", "+", "2", FRAC, "1", FRAC, "3", "="], expected: "5⨼7⨼12" },
    { inputs: ["12", FRAC, "20", FRAC, "10", "+", "2", FRAC, "40", FRAC, "10", "="], expected: "20" },
  ])("handles arithmetic with mixed fractions: $inputs 🡢 $expected", ({inputs, expected}) => {
    pressButtons(inputs);
    expect(screen.getByTestId("output")).toHaveTextContent(expected);
  });

  it.each([
    { inputs: ["2", FRAC, "3", "+", "12", FRAC, "3", "-", "3", FRAC, "1", FRAC, "4", "="], expected: "1⨼5⨼12" },
    { inputs: ["1", FRAC, "3", "×", "16", FRAC, "5", "÷", "1", FRAC, "222", FRAC, "444", "="], expected: "32⨼45" },
  ])("handles arithmetic including proper, improper and mixed fractions: $inputs 🡢 $expected", ({inputs, expected}) => {
    pressButtons(inputs);
    expect(screen.getByTestId("output")).toHaveTextContent(expected);
  });

  it.each([
    { inputs: ["1", FRAC, "2", "+", "1.6", "="], expected: "2.1" },
    { inputs: ["1", FRAC, "2", "-", "0.25", "="], expected: "0.25" },
  ])("displays the result in decimal format when the second operand is a decimal number: $inputs 🡢 $expected", ({inputs, expected}) => {
    pressButtons(inputs);
    expect(screen.getByTestId("output")).toHaveTextContent(expected);
  });

  it.each([
    { inputs: ["1", FRAC, "2", "=", FRAC], expected: "0.5" },
    { inputs: ["1.6", "+", "1", FRAC, "2", "=", FRAC], expected: "2.1" },
    { inputs: ["0.75", "-", "2", FRAC, "4", "=", FRAC], expected: "0.25" },
  ])("can convert a fractional result into its corresponding decimal representation: $inputs 🡢 $expected", ({inputs, expected}) => {
    pressButtons(inputs);
    expect(screen.getByTestId("output")).toHaveTextContent(expected);
  });

  it.each([
    { inputs: ["1", FRAC, "2", "=", FRAC, FRAC], expected: "1⨼2" },
    { inputs: ["1.6", "+", "1", FRAC, "2", "=", FRAC, FRAC], expected: "2⨼1⨼10" },
    { inputs: ["0.75", "-", "2", FRAC, "4", "=", FRAC, FRAC], expected: "1⨼4" },
  ])("can restore the result into its fractional representation: $inputs 🡢 $expected", ({inputs, expected}) => {
    pressButtons(inputs);
    expect(screen.getByTestId("output")).toHaveTextContent(expected);
  });

  it.each([
    { inputs: ["1", FRAC, "8", "+", "1", FRAC, "16", "=", "="], expected: "1⨼4" },
    { inputs: ["0.125", "+", "1", FRAC, "16", "=", "="], expected: "1⨼4" },
    { inputs: ["1", FRAC, "4", "-", "1", FRAC, "4", "=", "="], expected: "1⨼4" },
    { inputs: ["0.25", "-", "1", FRAC, "4", "=", "="], expected: "1⨼4" },
    { inputs: ["1", FRAC, "2", "×", "1", FRAC, "6", "=", "="], expected: "1⨼72" },
    { inputs: ["0.5", "×", "1", FRAC, "6", "=", "="], expected: "1⨼72" },
    { inputs: ["1", FRAC, "5", "÷", "1", FRAC, "2", "=", "="], expected: "4⨼5" },
    { inputs: ["0.2", "÷", "1", FRAC, "2", "=", "="], expected: "4⨼5" },
  ])("can repeat the last operation on the result : $inputs 🡢 $expected", ({inputs, expected}) => {
    pressButtons(inputs);
    expect(screen.getByTestId("output")).toHaveTextContent(expected);
  });

  it.each([
    { inputs: ["3", FRAC, "1", FRAC, "4", SHIFT, "toggle fraction"], expected: "13⨼4" },
    { inputs: ["3", FRAC, "1", FRAC, "4", "=", SHIFT, "toggle fraction"], expected: "13⨼4" },
    { inputs: ["13", FRAC, "4", SHIFT, "toggle fraction"], expected: "3⨼1⨼4" },
    { inputs: ["3", FRAC, "1", FRAC, "4", SHIFT, "toggle fraction", SHIFT, "toggle fraction"], expected: "3⨼1⨼4" },
    { inputs: ["13", FRAC, "4", SHIFT, "toggle fraction", SHIFT, "toggle fraction"], expected: "13⨼4" },
  ])("can toggle between mixed and improper fraction formats: $inputs 🡢 $expected", ({inputs, expected}) => {
    pressButtons(inputs);
    expect(screen.getByTestId("output")).toHaveTextContent(expected);
  });
});
