import React, { useEffect, useState } from "react";
import { WifiIcon, BatteryChargingIcon, ThermometerIcon, ClockIcon, BatteryIcon, BatteryFull, Battery } from "lucide-react";

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
  const [location, setLocation] = useState<{ lat: number; lon: number } | null>(
    null
  );
  const [wifiStatus, setWifiStatus] = useState<boolean | null>(null);

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
            year: "numeric",
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
      // Récupération de la température via une API météo avec localisation
      fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${location.lat}&longitude=${location.lon}&current_weather=true`
      )
        .then((res) => res.json())
        .then((data) => setTemperature(data.current_weather.temperature))
        .catch(console.error);
    }
  }, [location]);

  useEffect(() => {
    // Vérification du statut du WiFi
    const checkWifi = () => {
      if (navigator.onLine) {
        setWifiStatus(true);
      } else {
        setWifiStatus(false);
      }
    };

    checkWifi();
    window.addEventListener("online", checkWifi);
    window.addEventListener("offline", checkWifi);

    return () => {
      window.removeEventListener("online", checkWifi);
      window.removeEventListener("offline", checkWifi);
    };
  }, []);

  return (
    <header className="status-header">
      <div className="status-item">
        <span>{dateTime}</span>
      </div>
      <div className="status-item">
        <BatteryFull className="status-icon" />
        <span>{batteryLevel !== null ? `${batteryLevel}%` : "N/A"}</span>
      </div>
      <div className="status-item">
        <span>{temperature !== null ? `${temperature}°C` : "N/A"}</span>
        <ThermometerIcon className="status-icon" />
      </div>
      <div className="status-item">
        <WifiIcon className="status-icon" />
        <span>{wifiStatus !== null ? (wifiStatus ? "Connecté" : "Déconnecté") : "N/A"}</span>
      </div>
    </header>
  );
};

export default Header;
