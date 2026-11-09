import "@testing-library/jest-dom";
import React from "react";
import { screen } from "@testing-library/react";
import { ANGLE_MODES } from "../src/constants";

import App from "../src/components/App";
import { SHIFT, assertElementIsHidden, pressButton, pressButtons } from "./test-utils";
import { initialState } from "../src/calcSlice";
import { renderWithProviders } from "./test-utils";

describe("Display indicators", () => {

  beforeEach(() => {
    renderWithProviders(
      <App />, {
        preloadedState: {
          calc: initialState,
       }
      });
  });

  it("can cycle through all three DRG▸s", () => {
    const drgModeEl = screen.getByLabelText("angle mode indicator");
    const modeCount = ANGLE_MODES.length;
    for (let i = 0; i < modeCount; i++) {
      const expectedCurrentMode = ANGLE_MODES[i % modeCount];
      const expectedNewMode = ANGLE_MODES[(i + 1) % modeCount];
      expect(drgModeEl).toHaveTextContent(expectedCurrentMode);
      pressButton("DRG▸");
      expect(drgModeEl).toHaveTextContent(expectedNewMode);
    }
  });

  it.each([
    {inputs: [SHIFT]},
    {inputs: ["5", "+", "10", SHIFT]},
  ])("displays the shift indicator when shift key is pressed", ({inputs}) => {
    pressButtons(inputs);
    assertShiftIndicatorIsDisplayed();
  });

  it.each([
    {inputs: [SHIFT, SHIFT]},
    {inputs: ["5", "+", SHIFT, "10", SHIFT]},
  ])("toggles the shift indicator off", ({inputs}) => {
    pressButtons(inputs);
    assertShiftIndicatorIsNotDisplayed();
  });

  it.each([
    {inputs: ["5", "+", "10", SHIFT, "%"]},
  ])("hides the shift indicator when a function is selected", ({inputs}) => {
    pressButtons(inputs);
    assertShiftIndicatorIsNotDisplayed();
  });

  it("hides the shift indicator when the 'All Clear' button is pressed", () => {
    pressButtons([SHIFT, "AC"]);
    assertShiftIndicatorIsNotDisplayed();
  });

  it("hides the shift indicator when the 'Clear' button is pressed", () => {
    pressButtons([SHIFT, "C"]);
    assertShiftIndicatorIsNotDisplayed();
  });

  it.each([
    {inputs: ["+"], expected: "plus indicator"},
    {inputs: ["-"], expected: "minus indicator"},
    {inputs: ["×"], expected: "multiply indicator"},
    {inputs: ["÷"], expected: "divide indicator"},
  ])("displays the correct operator indicator when an operator is pressed", ({inputs, expected}) => {
    pressButtons(inputs);
    assertOperatorIndicatorIsDisplayed(expected);
  });

  it.each([
    {inputs: ["+", "3"]},
    {inputs: ["-", "3"]},
    {inputs: ["×", "3"]},
    {inputs: ["÷", "3"]},
  ])("hides operator indicator when an operand is pressed", ({inputs}) => {
    pressButtons(inputs);
    const indicatorEl = screen.queryByTestId("operator-indicator");
    expect(indicatorEl).not.toBeInTheDocument();
  });

  it.each([
    {inputs: ["HYP"]},
    {inputs: ["5", "+", "10", "HYP"]},
  ])("displays the hyperbolic indicator when 'hyp' key is pressed", ({inputs}) => {
    pressButtons(inputs);
    assertHyperbolicIndicatorIsDisplayed();
  });

  it("toggles the hyperbolic indicator off", () => {
    pressButtons(["HYP", "HYP"]);
    assertShiftIndicatorIsNotDisplayed();
  });

  it.each([
    {inputs: ["HYP", SHIFT]},
  ])("does not hide the hyperbolic indicator when the SHIFT key is pressed", ({inputs}) => {
    pressButtons(inputs);
    assertHyperbolicIndicatorIsDisplayed();
  });

  it.each([
    {inputs: ["HYP", "5"]},
    {inputs: ["5", "+", "HYP", "1"]},
    {inputs: ["5", "+", "10", "HYP", SHIFT, "%"]},
    {inputs: ["5", "HYP", SHIFT, "square"]},
  ])("hides the hyperbolic indicator when a non-related button is pressed", ({inputs}) => {
    pressButtons(inputs);
    assertHyperbolicIndicatorIsNotDisplayed();
  });

  it("hides the hyperbolic indicator when the 'All Clear' button is pressed", () => {
    pressButtons(["HYP", "AC"]);
    assertHyperbolicIndicatorIsNotDisplayed();
  });

  it("hides the hyperbolic indicator when the 'Clear' button is pressed", () => {
    pressButtons(["HYP", "C"]);
    assertHyperbolicIndicatorIsNotDisplayed();
  });

  it("displays the equals indicator when the equals button is pressed", () => {
    pressButtons(["1", "+", "1", "="]);
    const indicatorEl = screen.queryByLabelText("equals indicator");
    expect(indicatorEl).toBeInTheDocument();
  });

  it("hides the equals indicator when an operand pressed", () => {
    pressButtons(["=", "3"]);
    assertElementIsHidden("equals-operator");
  });

  it("displays the bracket indicator when the open bracket button is pressed", () => {
    pressButtons(["("]);
    const indicatorEl = screen.queryByLabelText("bracket indicator");
    expect(indicatorEl).toBeInTheDocument();
  });

  it("hides the bracket indicator when an close bracket button is pressed", () => {
    pressButtons(["(", ")"]);
    assertElementIsHidden("bracket indicator");
  });

  const assertShiftIndicatorIsDisplayed = () => {
    const indicatorEl = screen.getByLabelText("shift indicator");
    expect(indicatorEl).toBeInTheDocument();
  };

  const assertShiftIndicatorIsNotDisplayed = () => {
    const indicatorEl = screen.queryByLabelText("shift indicator");
    expect(indicatorEl).not.toBeInTheDocument();
  };

  const assertHyperbolicIndicatorIsDisplayed = () => {
    const indicatorEl = screen.getByLabelText("hyperbolic indicator");
    expect(indicatorEl).toBeInTheDocument();
  };
  
  const assertHyperbolicIndicatorIsNotDisplayed = () => {
    const indicatorEl = screen.queryByLabelText("hyperbolic indicator");
    expect(indicatorEl).not.toBeInTheDocument();
  };

  const assertOperatorIndicatorIsDisplayed = (expectedAriaLabel: string) => {
    const indicatorEl = screen.getByTestId("operator-indicator");
    expect(indicatorEl).toHaveAccessibleName(expectedAriaLabel);
  };
});
