import React from 'react';

interface CardItemProps {
  imageUrl?: string;
  tag: string;
  tagColor?: string;
  title: string;
  description: string;
  buttonLabel: string;
  onButtonClick: () => void;
}

const CardItem: React.FC<CardItemProps> = ({
  imageUrl,
  tag,
  tagColor = '#8B0000',
  title,
  description,
  buttonLabel,
  onButtonClick,
}) => {
  const fallbackImage = 'https://via.placeholder.com/200x200?text=Image+non+disponible';

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#fff',
        borderRadius: '16px',
        padding: '1rem',
        minWidth: '280px', // Fixe la largeur
        scrollSnapAlign: 'start',
        flexShrink: 0,
        boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
      }}
    >
      <img
        src={imageUrl || fallbackImage}
        alt={title}
        style={{
          width: '100%',
          height: '200px',
          objectFit: 'cover',
          backgroundColor: '#f0f0f0',
        }}
      />

      <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
        <span
          style={{
            backgroundColor: tagColor,
            color: '#fff',
            fontWeight: 600,
            fontSize: '14px',
            padding: '4px 10px',
            borderRadius: '4px',
            alignSelf: 'flex-start',
            marginBottom: '12px',
          }}
        >
          {tag.toUpperCase()}
        </span>

        <h3 style={{ fontSize: '20px', margin: '0 0 8px 0', color: '#111' }}>{title}</h3>
        <p style={{ fontSize: '16px', color: '#555', marginBottom: 'auto' }}>{description}</p>

        <button
          onClick={onButtonClick}
          style={{
            marginTop: '16px',
            alignSelf: 'flex-start',
            backgroundColor: '#004BA0',
            color: '#fff',
            border: 'none',
            padding: '10px 14px',
            borderRadius: '6px',
            cursor: 'pointer',
            fontWeight: 600,
            fontSize: '16px',
          }}
        >
          {buttonLabel}
        </button>
      </div>
    </div>
  );
};

export default CardItem;
