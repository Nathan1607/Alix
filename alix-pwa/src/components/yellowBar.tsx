import React from 'react';
import { ArrowLeftIcon, SettingsIcon } from "lucide-react";
import '../styles/yellowBar.css';

interface YellowBarProps {
  title: string;
  backtitle?: string;
  showBack?: boolean;
  showLogo?: boolean;
  showSettings?: boolean;
}

const YellowBar: React.FC<YellowBarProps> = ({
  title,
  backtitle,
  showBack = false,
  showLogo = false,
  showSettings = false,
}) => {
  return (
    <div className="yellow-bar">
      <div className="left-section">
        {showBack && (
          <button className="back-button">
            <ArrowLeftIcon className="icon" />
            <span>{backtitle}</span>
          </button>
        )}
      </div>

      <div className="center-section">
        {showLogo && <img src="/path/to/logo.png" alt="Logo" className="logo" />}
        <h1 className="page-title">{title}</h1>
      </div>

      <div className="right-section">
        {showSettings && (
          <button className="settings-button">
            <SettingsIcon className="icon" />
            <span>Paramètres</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default YellowBar;

/*
  - Ajout de la police d'écriture
  - Personnalisation du titre général
  - Ajout du logo (Attente du logo) -> Voir Whastapp
  - Application du style du bouton Paramètre
*/
