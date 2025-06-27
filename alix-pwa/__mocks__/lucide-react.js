const React = require('react');

const BatteryIcon = () => React.createElement('div', { 'data-testid': 'BatteryIcon' });
const WifiOffIcon = () => React.createElement('div', { 'data-testid': 'WifiOffIcon' });
const BatteryFullIcon = () => React.createElement('div', { 'data-testid': 'BatteryFullIcon' });
const BatteryLowIcon = () => React.createElement('div', { 'data-testid': 'BatteryLowIcon' });
const BatteryMediumIcon = () => React.createElement('div', { 'data-testid': 'BatteryMediumIcon' });
const SunIcon = () => React.createElement('div', { 'data-testid': 'SunIcon' });
const CloudIcon = () => React.createElement('div', { 'data-testid': 'CloudIcon' });
const CloudRainIcon = () => React.createElement('div', { 'data-testid': 'CloudRainIcon' });
const WindIcon = () => React.createElement('div', { 'data-testid': 'WindIcon' });
const WifiHigh = () => React.createElement('div', { 'data-testid': 'WifiHigh' });

module.exports = {
  BatteryIcon,
  WifiOffIcon,
  BatteryFullIcon,
  BatteryLowIcon,
  BatteryMediumIcon,
  SunIcon,
  CloudIcon,
  CloudRainIcon,
  WindIcon,
  WifiHigh
};
