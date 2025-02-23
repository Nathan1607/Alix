import '../styles/mentionLegale.css';

export default function MentionLegales() {
  return (
    <section className="mentions-legales">
      <div className="mentions-legales-container">
        <h1 className="mentions-legales-title">Mentions Légales</h1>
        <p>
          Conformément aux dispositions des articles 6-III et 19 de la Loi n° 2004-575 du 21 juin 2004
          pour la Confiance dans l'économie numérique, dite L.C.E.N., nous portons à la connaissance des
          utilisateurs et visiteurs du site les informations suivantes :
        </p>
        
        <h2>Éditeur du site</h2>
        <p><strong>Nom :</strong> Alix</p>
        <p><strong>Adresse :</strong> 12 Rue Georges Mandel, 49000 Angers</p>
        <p><strong>Email :</strong> solution.alix@gmail.com</p>
        
        <h2>Hébergement</h2>
        <p><strong>Hébergeur :</strong> o2switch</p>
        <p><strong>Adresse :</strong> 222 Boulevard Gustave Flaubert, 63000 Clermont-Ferrand, France</p>
        <p><strong>Site web :</strong> <a href="https://www.o2switch.fr" target="_blank" rel="noopener noreferrer">www.o2switch.fr</a></p>
                
        <h2>Propriété intellectuelle</h2>
        <p>
          Toute reproduction, représentation, modification, publication, adaptation de tout ou partie des
          éléments du site, quel que soit le moyen ou le procédé utilisé, est interdite, sauf autorisation écrite préalable.
        </p>
      </div>
    </section>
  );
}
