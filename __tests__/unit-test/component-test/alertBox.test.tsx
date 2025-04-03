import React from "react";
import { render, screen, act } from "@testing-library/react";
import {AlertBox} from "@/components/index";

jest.useFakeTimers();

describe("AlertBox Component", () => {
  it("renders the AlertBox with the correct type and default values", () => {
    render(<AlertBox alertType="success" />);

    const title = screen.getByText("Success");
    const message = screen.getByText(
      "Your request has been processed successfully."
    );
    const icon = screen.getByAltText("alert icon");

    expect(title).toBeInTheDocument();
    expect(message).toBeInTheDocument();
    expect(icon).toHaveAttribute("src", "images/alert/success.avif");
  });

  it("renders with custom title and message", () => {
    render(
      <AlertBox
        alertType="error"
        title="Custom Error"
        message="Custom error message."
      />
    );

    const title = screen.getByText("Custom Error");
    const message = screen.getByText("Custom error message.");
    const icon = screen.getByAltText("alert icon");

    expect(title).toBeInTheDocument();
    expect(message).toBeInTheDocument();
    expect(icon).toHaveAttribute("src", "images/alert/error.avif");
  });

  it("disappears after 10 seconds", async () => {
    render(<AlertBox alertType="info" />);

    const alertBox = screen.getByText("Info");
    expect(alertBox).toBeInTheDocument();

    await act(async () => {
      jest.advanceTimersByTime(10000);
    });

    expect(alertBox).not.toBeInTheDocument();
  });

  it("does not render if visibility state is false", async () => {
    const { queryByText } = render(<AlertBox alertType="warning" />);

    await act(async () => {
      jest.advanceTimersByTime(10000);
    });

    expect(queryByText("Warning")).toBeNull();
  });
});
