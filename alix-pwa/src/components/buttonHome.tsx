import React from 'react';

interface ButtonHomeProps {
  icon: React.ReactNode;
  text: string;
  backgroundColor: string;
  onClick?: () => void;
}

const ButtonHome: React.FC<ButtonHomeProps> = ({ icon, text, backgroundColor, onClick }) => {
  return (
    <button
      onClick={onClick}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: '15rem',
        height: '15rem',
        border: 'none',
        borderRadius: '12px',
        backgroundColor,
        color: '#fff',
        fontSize: '2rem',
        fontWeight: 'bold',
        cursor: 'pointer',
        margin: '2rem',
      }}
    >
      <div style={{ fontSize: '5rem', marginBottom: '.5rem' }}>{icon}</div>
      <span>{text}</span>
    </button>
  );
};

export default ButtonHome;
