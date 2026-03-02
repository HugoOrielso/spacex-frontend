/* eslint-disable @typescript-eslint/no-explicit-any */
// src/__tests__/LaunchesFilters.test.tsx
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { LaunchesFilters } from "@/components/Launches/LaunchesFilter";
import { useLaunchesStore } from "@/store/useLaunches";

jest.mock("@/store/useLaunches");

const mockUseLaunchesStore = useLaunchesStore as jest.MockedFunction<typeof useLaunchesStore>;

const mockStore = {
  status: "all",
  year: "all",
  years: [2020, 2021, 2022, 2023, 2024],
  search: "",
  setStatus: jest.fn(),
  setYear: jest.fn(),
  setSearch: jest.fn(),
  resetFilters: jest.fn(),
};

describe("LaunchesFilters", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseLaunchesStore.mockImplementation((selector: any) => selector(mockStore));
  });

  it("renderiza los selects de status y year", () => {
    render(<LaunchesFilters />);
    const selects = screen.getAllByRole("combobox");
    expect(selects.length).toBeGreaterThanOrEqual(2);
  });

  it("renderiza el botón de reset", () => {
    render(<LaunchesFilters />);
    expect(screen.getByRole("button", { name: /reset/i })).toBeInTheDocument();
  });

  it("llama a setStatus al cambiar el select de status", () => {
    render(<LaunchesFilters />);
    const selects = screen.getAllByRole("combobox");
    fireEvent.change(selects[0], { target: { value: "success" } });
    expect(mockStore.setStatus).toHaveBeenCalledWith("success");
  });

  it("llama a setYear al cambiar el select de año", () => {
    render(<LaunchesFilters />);
    const selects = screen.getAllByRole("combobox");
    fireEvent.change(selects[1], { target: { value: "2023" } });
    expect(mockStore.setYear).toHaveBeenCalledWith(2023);
  });

  it("llama a resetFilters al hacer click en Reset", () => {
    render(<LaunchesFilters />);
    fireEvent.click(screen.getByRole("button", { name: /reset/i }));
    expect(mockStore.resetFilters).toHaveBeenCalled();
  });

  it("muestra los años disponibles en el select", () => {
    render(<LaunchesFilters />);
    expect(screen.getByText("2023")).toBeInTheDocument();
    expect(screen.getByText("2024")).toBeInTheDocument();
  });
});