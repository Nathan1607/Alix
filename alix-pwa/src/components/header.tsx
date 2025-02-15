import { useEffect, useState } from "react";
import {
  BatteryIcon,
  WifiOffIcon,
  BatteryFullIcon,
  BatteryLowIcon,
  BatteryMediumIcon,
  SunIcon,
  CloudIcon,
  CloudRainIcon,
  WindIcon,
  WifiHigh,
} from "lucide-react";
import "../styles/header.css";
import AlixHead from '../assets/alix-head.svg';

declare global {
  interface Navigator {
    getBattery?: () => Promise<BatteryManager>;
  }

  interface BatteryManager {
    level: number;
    addEventListener: (type: "levelchange", listener: () => void) => void;
  }
}

const Header = () => {
  const [batteryLevel, setBatteryLevel] = useState<number | null>(null);
  const [dateTime, setDateTime] = useState<string>("");
  const [temperature, setTemperature] = useState<number | null>(null);
  const [location, setLocation] = useState<{ lat: number; lon: number } | null>(null);
  const [wifiStatus, setWifiStatus] = useState<boolean | null>(null);
  const [weatherCode, setWeatherCode] = useState<number | null>(null);

  useEffect(() => {
    // Récupération du niveau de batterie
    navigator.getBattery?.().then((battery) => {
      setBatteryLevel(Math.round(battery.level * 100));
      battery.addEventListener("levelchange", () =>
        setBatteryLevel(Math.round(battery.level * 100))
      );
    });
  }, []);

  useEffect(() => {
    // Mettre à jour la date et l'heure toutes les secondes
    const interval = setInterval(() => {
      const now = new Date();
      setDateTime(
        now.toLocaleTimeString("fr-FR", {
          hour: "2-digit",
          minute: "2-digit",
        }) +
          " - " +
          now.toLocaleDateString("fr-FR", {
            weekday: "long",
            day: "numeric",
            month: "long",
          })
      );
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Demande de localisation
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setLocation({ lat: latitude, lon: longitude });
      },
      (error) => console.error("Erreur de localisation", error),
      { enableHighAccuracy: true }
    );
  }, []);

  useEffect(() => {
    if (location) {
      fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${location.lat}&longitude=${location.lon}&current_weather=true`
      )
        .then((res) => res.json())
        .then((data) => {
          setTemperature(data.current_weather.temperature);
          setWeatherCode(data.current_weather.weathercode);
        })
        .catch(console.error);
    }
  }, [location]);

  useEffect(() => {
    const checkWifi = () => setWifiStatus(navigator.onLine);
    checkWifi();
    window.addEventListener("online", checkWifi);
    window.addEventListener("offline", checkWifi);
    return () => {
      window.removeEventListener("online", checkWifi);
      window.removeEventListener("offline", checkWifi);
    };
  }, []);

  const getBatteryIcon = () => {
    if (batteryLevel !== null) {
      if (batteryLevel >= 80) return <BatteryFullIcon className="status-icon" />;
      if (batteryLevel >= 30 && batteryLevel < 80)
        return <BatteryMediumIcon className="status-icon" />;
      if (batteryLevel < 30) return <BatteryLowIcon className="status-icon" />;
    }
    return <BatteryIcon className="status-icon" />;
  };

  const getWeatherIcon = () => {
    if (weatherCode === null) return null;
    if (weatherCode < 3) return <SunIcon className="status-icon" />;
    if (weatherCode < 50) return <CloudIcon className="status-icon" />;
    if (weatherCode < 80) return <CloudRainIcon className="status-icon" />;
    return <WindIcon className="status-icon" />;
  };

  return (
    <header className="status-header">
      <div className="group-item">
        <div className="status-item">
          <span>{temperature !== null ? `${temperature}°C` : "N/A"}</span>
          {getWeatherIcon()}
          </div>
        <div className="status-item">
          <span>{dateTime}</span>
        </div>
      </div>

      <div className="group-item">
        <div className="status-item help">
          <img src={AlixHead} alt="Alix" className="alix-head" />
          <p>AIDES</p>
        </div>
        <div className="status-item wifi">
          {wifiStatus ? (
            <WifiHigh className="status-icon" />
          ) : (
            <WifiOffIcon className="status-icon" />
          )}
        </div>
        <div className="status-item">{getBatteryIcon()}</div>
      </div>
    </header>
  );
};

export default Header;