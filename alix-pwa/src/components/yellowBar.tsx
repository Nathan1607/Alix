import React from 'react';
import { ArrowLeftIcon, SettingsIcon } from "lucide-react";
import '../styles/yellowBar.css';
import AlixHead from '../assets/alix-head.svg';

interface YellowBarProps {
  title: string;
  backtitle?: string;
  showBack?: boolean;
  showLogo?: boolean;
  showSettings?: boolean;
  onBackClick?: () => void | Promise<void>;
}

const YellowBar: React.FC<YellowBarProps> = ({
  title,
  backtitle,
  showBack = false,
  showLogo = false,
  showSettings = false,
  onBackClick = () => Promise.resolve(),
}) => {

  return (
    <div className="yellow-bar">
      <div className="left-section">
        {showBack && (
          <button className="back-button" onClick={onBackClick}>
            <ArrowLeftIcon className="icon" />
            <span>{backtitle}</span>
          </button>
        )}
      </div>

      <div className="center-section">
        {showLogo && <img src={AlixHead} alt="Logo" className="logo" />}
        <h1 className="page-title">{title}</h1>
      </div>

      <div className="right-section">
        {showSettings && (
          <button className="settings-button">
            <SettingsIcon className="icon" />
            <span className='text-param'>Paramètres</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default YellowBar;

