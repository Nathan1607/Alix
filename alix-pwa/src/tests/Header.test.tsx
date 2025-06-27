import { render, screen, waitFor, act } from "@testing-library/react";
import Header from "../components/header";
import fetchMock from "jest-fetch-mock";

// Active le mock de fetch
fetchMock.enableMocks();

beforeAll(() => {
  // Mock geolocation
  Object.defineProperty(global.navigator, "geolocation", {
    value: {
      getCurrentPosition: jest.fn().mockImplementation((success) =>
        success({
          coords: {
            latitude: 48.8566,
            longitude: 2.3522,
          },
        })
      ),
    },
    configurable: true,
  });

  // Mock getBattery
  Object.defineProperty(global.navigator, "getBattery", {
    value: jest.fn().mockResolvedValue({
      level: 0.85,
      addEventListener: jest.fn(),
    }),
    configurable: true,
  });

  // Mock onLine
  Object.defineProperty(global.navigator, "onLine", {
    value: true,
    configurable: true,
  });
});

beforeEach(() => {
  fetchMock.resetMocks();
  jest.useFakeTimers().setSystemTime(new Date("2024-06-01T14:30:00"));
});

afterEach(() => {
  jest.clearAllTimers();
  jest.useRealTimers();
});

// Fonction utilitaire pour mocker la météo
const mockWeatherAPI = () => {
  fetchMock.mockResponseOnce(
    JSON.stringify({
      current_weather: {
        temperature: 23,
        weathercode: 0, // soleil
      },
    })
  );
};

test("affiche le composant header avec AIDES", async () => {
  mockWeatherAPI();
  await act(async () => {
    render(<Header />);
  });

  expect(screen.getByText(/aides/i)).toBeInTheDocument();
});

test("affiche la température depuis l'API météo", async () => {
  mockWeatherAPI();
  await act(async () => {
    render(<Header />);
  });

  expect(await screen.findByText("23°C")).toBeInTheDocument();
});

test("affiche l'icône météo appropriée", async () => {
  mockWeatherAPI();
  await act(async () => {
    render(<Header />);
  });

  // En l'absence de data-testid="weather-icon", on teste avec un fallback sur un des icônes rendus (ex: SunIcon)
  expect(await screen.findByTestId("SunIcon")).toBeInTheDocument();
});

test("affiche l'icône de batterie selon le niveau", async () => {
  mockWeatherAPI();
  await act(async () => {
    render(<Header />);
  });

  expect(await screen.findByTestId("BatteryFullIcon")).toBeInTheDocument();
});

test("affiche l'icône de wifi actif", async () => {
  mockWeatherAPI();
  await act(async () => {
    render(<Header />);
  });

  expect(await screen.findByTestId("WifiHigh")).toBeInTheDocument();
});
