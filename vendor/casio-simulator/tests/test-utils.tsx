import React, { PropsWithChildren } from "react";
import { Provider } from "react-redux";
import { RenderOptions, fireEvent, render, screen } from "@testing-library/react";

import { setupStore, AppStore, RootState } from "../src/store";

export const BACK = "BACK";
export const DRG = "DRG▸";
export const FRAC = "FRAC";
export const HYP = "HYP";
export const PI = "PI";
export const SEX = "SEX";
export const SHIFT = "SHIFT";

interface ExtendedRenderOptions extends Omit<RenderOptions, "queries"> {
  preloadedState?: Partial<RootState>;
  store?: AppStore;
}

export const renderWithProviders = (
	ui: React.ReactElement,
	{
		preloadedState = {},
		store = setupStore(preloadedState),
		...renderOptions
	}: ExtendedRenderOptions = {}
) => {
	const Wrapper = ({ children }: PropsWithChildren<object>): JSX.Element => {
		return <Provider store={store}>{children}</Provider>;
	};

	return { store, ...render(ui, { wrapper: Wrapper, ...renderOptions }) };
};

export const pressButtons = (inputs: string[]) => {
  const rawInput = inputs.flatMap(input => 
      isNaN(Number(input))
      ? input
      : input.split("")
  );

  for (const input of rawInput) {
      pressButton(input);
  }
};

export const pressButton = (input: string) => {
  const ariaLabel = mapToAriaLabel(input);
  fireEvent.click(screen.getByRole("button", { name: ariaLabel }));
};

export const mapToAriaLabel = (input: string): string => {
  switch (input) {
    case SHIFT: return "shift";
    case BACK: return "backspace";
    case DRG: return "angle mode";
    case FRAC: return "fraction mode";
    case HYP: return "hyperbolic";
    case PI: return "exponent or pi constant";
    case SEX: return "sexagesimal to decimal";
    case "⇽": return "decimal to sexagesimal";
    case "+/-": return "invert sign";
    case "cbrt": return "cube root";
    case "(": return "open bracket";
    case ")": return "close bracket";
    case "+": return "plus";
    case "-": return "minus";
    case "×": return "multiply";
    case "÷": return "divide";
    case ".": return "decimal point";
    case "%": return "percent";
    case "sin": return "sine";
    case "cos": return "cosine";
    case "tan": return "tangent";
    case "asin": return "arc sine";
    case "acos": return "arc cosine";
    case "atan": return "arc tangent";
    case "sinh": return "hyperbolic sine";
    case "cosh": return "hyperbolic cosine";
    case "tanh": return "hyperbolic tangent";
    case "asinh": return "area hyperbolic sine";
    case "acosh": return "area hyperbolic cosine";
    case "atanh": return "area hyperbolic tangent";
    case "=": return "equals";
    default: return input;
  }
};

export const assertOutputIsEqualTo = (expected: string) => {
  const outputEl = screen.getByTestId("output");
  expect(outputEl).toHaveTextContent(expected);
};

export const assertElementIsHidden = (testId: string) => {
  const el = screen.queryByTestId(testId);
  expect(el).not.toBeInTheDocument();
};
