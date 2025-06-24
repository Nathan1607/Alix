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
  const fallbackImage = '';

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'row',
        backgroundColor: '#fff',
        borderRadius: '16px',
        padding: '1rem',
        width: '100%',
        maxWidth: '100%',
        boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
        gap: '1rem',
        alignItems: 'flex-start',
      }}
    >
      {/* IMAGE */}
      <img
        src={imageUrl || fallbackImage}
        alt={title}
        style={{
          width: '160px',
          height: '160px',
          objectFit: 'cover',
          borderRadius: '12px',
        }}
      />

      {/* CONTENU (colonne texte + bouton) */}
      <div style={{ display: 'flex', flex: 1, justifyContent: 'space-between' }}>
        {/* Texte à gauche */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
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
          <p style={{ fontSize: '16px', color: '#555' }}>{description}</p>
        </div>

        {/* Bouton à droite */}
        <div style={{ display: 'flex', alignItems: 'flex-end' }}>
          <button
            onClick={onButtonClick}
            style={{
              backgroundColor: '#004BA0',
              color: '#fff',
              border: 'none',
              padding: '10px 14px',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: '16px',
              whiteSpace: 'nowrap',
              marginLeft: '2rem',
              marginTop: '8px',
            }}
          >
            {buttonLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CardItem;
