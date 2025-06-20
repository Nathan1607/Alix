import React from 'react';

interface TabButtonProps {
  label: string;
  active: boolean;
  onClick: () => void;
  color?: string;
}

const TabButton: React.FC<TabButtonProps> = ({ label, active, onClick, color = '#004BA0' }) => {
  return (
    <button
      onClick={onClick}
      style={{
        padding: '.5rem 1.6rem',
        border: `2px solid ${color}`,
        backgroundColor: active ? color : 'transparent',
        color: active ? '#fff' : color,
        borderRadius: '8px 8px 0 0',
        fontWeight: 600,
        cursor: 'pointer',
        outline: 'none',
      }}
    >
      {label}
    </button>
  );
};

export default TabButton;
