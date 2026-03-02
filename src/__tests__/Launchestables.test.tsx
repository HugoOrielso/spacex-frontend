/* eslint-disable @typescript-eslint/no-explicit-any */
// src/__tests__/LaunchesTable.test.tsx
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { LaunchesTable } from "@/components/Launches/LaunchesTable";
import { useLaunchesStore } from "@/store/useLaunches";

jest.mock("@/store/useLaunches");
jest.mock("framer-motion", () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}));

const mockUseLaunchesStore = useLaunchesStore as jest.MockedFunction<typeof useLaunchesStore>;

const sampleLaunch = {
  launch_id: "abc123",
  mission_name: "FalconSat",
  flight_number: 1,
  date_utc: "2006-03-24T22:30:00.000Z",
  date_local: "2006-03-25T10:30:00+12:00",
  status: "success",
  rocket_id: "rocket-1",
  launchpad_id: "pad-1",
  patch_small: null,
  patch_large: null,
  details: "Test mission details",
  article: "https://example.com/article",
  webcast: null,
  wikipedia: null,
  upcoming: false,
  success: true,
};

describe("LaunchesTable", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseLaunchesStore.mockImplementation((selector: any) =>
      selector({
        launches: [sampleLaunch],
        loading: false,
      })
    );
  });

  it("renderiza la tabla con los headers correctos", () => {
    render(<LaunchesTable />);
    expect(screen.getByText("Mission")).toBeInTheDocument();
    expect(screen.getByText("Date")).toBeInTheDocument();
    expect(screen.getByText("Status")).toBeInTheDocument();
    expect(screen.getByText("Rocket")).toBeInTheDocument();
  });

  it("renderiza el nombre de la misión", () => {
    render(<LaunchesTable />);
    expect(screen.getByText("FalconSat")).toBeInTheDocument();
  });

  it("muestra 'No launches found' cuando no hay datos", () => {
    mockUseLaunchesStore.mockImplementation((selector: any) =>
      selector({ launches: [], loading: false })
    );
    render(<LaunchesTable />);
    expect(screen.getByText(/no launches found/i)).toBeInTheDocument();
  });

  it("muestra 'Loading' cuando está cargando", () => {
    mockUseLaunchesStore.mockImplementation((selector: any) =>
      selector({ launches: [], loading: true })
    );
    render(<LaunchesTable />);
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it("abre el modal al hacer click en una fila", () => {
    render(<LaunchesTable />);
    fireEvent.click(screen.getByText("FalconSat"));
    expect(screen.getByText("Mission details")).toBeInTheDocument();
    expect(screen.getByText("Test mission details")).toBeInTheDocument();
  });

  it("cierra el modal al hacer click en el botón ✕", () => {
    render(<LaunchesTable />);
    fireEvent.click(screen.getByText("FalconSat"));
    fireEvent.click(screen.getByText("✕"));
    expect(screen.queryByText("Mission details")).not.toBeInTheDocument();
  });
});