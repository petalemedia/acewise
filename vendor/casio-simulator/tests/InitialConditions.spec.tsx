import "@testing-library/jest-dom";
import React from "react";
import { screen } from "@testing-library/react";

import App from "../src/components/App";
import { initialState } from "../src/calcSlice";
import { assertElementIsHidden, renderWithProviders } from "./test-utils";


describe("Initial conditions", () => {

  beforeEach(() => {
    renderWithProviders(
      <App />, {
        preloadedState: {
          calc: initialState,
       }
      });
  });

  it("displays zero on start up", () => {
    expect(screen.getByTestId("output")).toHaveTextContent("0");
  });

  it("displays DEG mode on start up", () => {
    const el = screen.getByLabelText("angle mode indicator");
    expect(el).toBeInTheDocument();
  });

  it("does not display an operator indicator on start up", () => {
    assertElementIsHidden("operator-indicator");
  });

  it("does not display the equals indicator on start up", () => {
    assertElementIsHidden("equals");
  });
});
