import "@testing-library/jest-dom";
import React from "react";

import App from "../src/components/App";
import { SHIFT, assertOutputIsEqualTo, pressButtons } from "./test-utils";
import { initialState } from "../src/calcSlice";
import { renderWithProviders } from "./test-utils";

const cube = "cube";
const cubeRoot = "cube root";

describe("Cube and Cube Root", () => {

  beforeEach(() => {
    renderWithProviders(
      <App />, {
        preloadedState: {
          calc: initialState,
       }
      });
  });

  it.each([
    {inputs: ["0.2", SHIFT, cube], expected: "0.008"},
    {inputs: ["2", SHIFT, cube], expected: "8"},
    {inputs: ["20", SHIFT, cube], expected: "8000"},
    {inputs: ["100", "+", "2", SHIFT, cube, "="], expected: "108"},
  ])("performs cube calculations: $inputs 🡢 $expected", ({inputs, expected}) => {
    pressButtons(inputs);
    assertOutputIsEqualTo(expected);
  });

  it.each([
    {inputs: ["8", SHIFT, cubeRoot], expected: "2"},
    {inputs: ["64", SHIFT, cubeRoot], expected: "4"},
    {inputs: ["216", SHIFT, cubeRoot], expected: "6"},
    {inputs: ["1000", SHIFT, cubeRoot], expected: "10"},
    {inputs: ["1000000", SHIFT, cubeRoot], expected: "100"},
    {inputs: ["1000000000", SHIFT, cubeRoot], expected: "1000"},
    {inputs: ["100", "+", "216", SHIFT, cubeRoot, "="], expected: "106"},
  ])("performs cube root calculations: $inputs 🡢 $expected", ({inputs, expected}) => {
    pressButtons(inputs);
    assertOutputIsEqualTo(expected);
  });

  it.each([
    {inputs: ["2", SHIFT, cube, "=", "=", "="], expected: "134217728"},
    {inputs: ["1", "+", "4", SHIFT, cube, "=", "=", "="], expected: "193"},
    {inputs: ["1000000000", SHIFT, cubeRoot, "=", "=", "="], expected: "2.15443469"},
    {inputs: ["1", "+", "1000000000", SHIFT, cubeRoot, "=", "=", "="], expected: "3001"},
  ])(
    "repeats the last operation when the equals button is pressed consecutively: $inputs 🡢 $expected", 
    ({inputs, expected}) => {
      pressButtons(inputs);
      assertOutputIsEqualTo(expected);
    }
  );
});
