import { useLocation, useNavigate } from "react-router-dom";
import Header from "../../components/header";
import YellowBar from "../../components/yellowBar";
import { registerToContent } from "../../api/api";

type ContentItem = {
  id?: number;
  title_1?: string;
  title_2?: string;
  title_3?: string;
  text_1?: string;
  text_2?: string;
  text_3?: string;
  img_1?: string;
  img_2?: string;
  img_3?: string;
  type?: "atelier" | "evenement" | string;
  start_time?: string;
  end_time?: string;
};

const DetailItem = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const item = location.state?.item as ContentItem;

  if (!item) return <p style={{ padding: 20 }}>Aucun contenu à afficher.</p>;

  const images = [item.img_1, item.img_2, item.img_3].filter(Boolean);

  const userId = 1;

  const formatDate = (isoDate: string): string => {
    const date = new Date(isoDate);
    return new Intl.DateTimeFormat("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  return (
    <div>
      <Header />
      <YellowBar
        title="Détail"
        backtitle="Retour"
        showBack
        showLogo
        showSettings
        onBackClick={() => navigate(-1)}
      />

      <div style={{ padding: "20px", maxWidth: "90%", margin: "auto" }}>
        {/* TITRE PRINCIPAL */}
        {item.title_1 && (
          <h1
            style={{
              fontSize: "2.5rem",
              fontWeight: "bold",
              marginBottom: "3rem",
              textAlign: "center",
            }}
          >
            {item.title_1}
          </h1>
        )}

        {/* SOUS-TITRE + TEXTE + IMAGE */}
        <div
          style={{
            display: "flex",
            gap: "20px",
            alignItems: "flex-start",
            marginBottom: 30,
          }}
        >
          <div style={{ flex: 1 }}>
            {item.title_2 && (
              <h2
                style={{
                  fontSize: "2rem",
                  fontWeight: "bold",
                  marginBottom: 10,
                }}
              >
                {item.title_2}
              </h2>
            )}
            {item.text_1 && <p>{item.text_1}</p>}
          </div>
          {item.img_1 && (
            <div style={{ flexShrink: 0 }}>
              <img
                src={item.img_1}
                alt="illustration"
                style={{
                  width: "20rem",
                  maxHeight: "300px",
                  objectFit: "cover",
                  borderRadius: "10px",
                }}
              />
            </div>
          )}
        </div>

        {/* DEUXIÈME SECTION */}
        {(item.title_3 || item.text_2) && (
          <div style={{ marginBottom: 30 }}>
            {item.title_3 && (
              <h2
                style={{
                  fontSize: "2rem",
                  fontWeight: "bold",
                  marginBottom: 10,
                }}
              >
                {item.title_3}
              </h2>
            )}
            {item.text_2 && <p>{item.text_2}</p>}
          </div>
        )}

        {item.text_3 && (
          <div style={{ marginBottom: 30 }}>
            {item.title_3}
            {item.text_2 && <p>{item.text_2}</p>}
          </div>
        )}

        {/* + D'IMAGES */}
        {images.length > 1 && (
          <div>
            <h3 style={{ fontWeight: "bold", marginBottom: 10 }}>
              PLUS D’IMAGES
            </h3>
            <div style={{ display: "flex", gap: "10px" }}>
              {images.map((img, index) => (
                <img
                  key={index}
                  src={img}
                  alt={`img-${index}`}
                  style={{ width: "150px", borderRadius: "10px" }}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {(item.type === "atelier" || item.type === "evenement") && (
        <div
        style={{
          backgroundColor: "#FFE6CC",
          borderRadius: "12px",
          padding: "20px",
          marginTop: "2rem",
          boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
          width: "90%",
          margin: "auto",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center", // Centrage vertical
          flexWrap: "wrap", // Adaptabilité mobile
          gap: "1rem",
        }}
      >
        <div>
          <h3
            style={{
              fontSize: "1.5rem",
              fontWeight: "bold",
              marginBottom: "10px",
            }}
          >
            Participer à cet {item.type === "atelier" ? "atelier" : "événement"}
          </h3>
          <p style={{ marginBottom: "0" }}>
          {item.type === "atelier" ? "L'atelier" : "L'événement"} commencera le {item.start_time ? formatDate(item.start_time) : "Non spécifiée"} - 
             au {item.end_time ? formatDate(item.end_time) : "Non spécifiée"}
          </p>
        </div>
      
        <button
          style={{
            padding: "10px 20px",
            backgroundColor: "#1f48ad",
            color: "#fff",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            fontSize: "1rem",
            whiteSpace: "nowrap",
          }}
          onClick={async () => {
            try {
              const contentType = item.type === "atelier" ? "workshop" : "event";
          
              await registerToContent({
                userId: 1,
                contentType,
                contentId: Number(item.id),
              });
          
              alert("Inscription réussie !");
            } catch (error) {
              console.error(error);
              alert("Une erreur est survenue lors de l'inscription.");
            }
          }}
          >
          S'inscrire à {item.type === "atelier" ? "l'atelier" : "l'événement"}
        </button>
      </div>
      )}
    </div>
  );
};

export default DetailItem;
