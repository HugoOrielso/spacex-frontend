/* eslint-disable @typescript-eslint/no-explicit-any */
// src/__tests__/SummaryCards.test.tsx
import React from "react";
import { render, screen } from "@testing-library/react";
import SummaryCards from "@/components/main/SummaryCards";
import { useLaunchesStore } from "@/store/useLaunches";

jest.mock("@/store/useLaunches");

const mockUseLaunchesStore = useLaunchesStore as jest.MockedFunction<typeof useLaunchesStore>;

describe("SummaryCards", () => {
  beforeEach(() => {
    mockUseLaunchesStore.mockImplementation((selector: any) =>
      selector({
        globalSummary: { total: 200, success: 150, failed: 30, upcoming: 15, unknown: 5 },
        loadingSummary: false,
      })
    );
  });

  it("renderiza las 4 tarjetas", () => {
    render(<SummaryCards />);
    expect(screen.getByText("Successful")).toBeInTheDocument();
    expect(screen.getByText("Failed")).toBeInTheDocument();
    expect(screen.getByText("Upcoming")).toBeInTheDocument();
    expect(screen.getByText("Unknown")).toBeInTheDocument();
  });

  it("muestra los valores correctos del summary", () => {
    render(<SummaryCards />);
    expect(screen.getByText("150")).toBeInTheDocument();
    expect(screen.getByText("30")).toBeInTheDocument();
    expect(screen.getByText("15")).toBeInTheDocument();
    expect(screen.getByText("5")).toBeInTheDocument();
  });

  it("muestra '…' cuando está cargando", () => {
    mockUseLaunchesStore.mockImplementation((selector: any) =>
      selector({
        globalSummary: null,
        loadingSummary: true,
      })
    );
    render(<SummaryCards />);
    const dots = screen.getAllByText("…");
    expect(dots.length).toBe(4);
  });

  it("muestra el porcentaje de cada categoría", () => {
    render(<SummaryCards />);
    expect(screen.getByText("75.0%")).toBeInTheDocument(); // success
    expect(screen.getByText("15.0%")).toBeInTheDocument(); // failed
  });
});