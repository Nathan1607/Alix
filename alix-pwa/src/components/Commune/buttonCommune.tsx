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
        border: active ? "2px solid #004B8D" : "2px solid transparent",
        backgroundColor: active ? color : 'transparent',
        color: active ? '#fff' : color,
        borderRadius: '8px 8px 0 0',
        fontWeight: 600,
        cursor: 'pointer',
        outline: 'none',
        fontSize: '1.3rem',
        width: '10rem',
      }}
    >
      {label}
    </button>
  );
};

export default TabButton;
