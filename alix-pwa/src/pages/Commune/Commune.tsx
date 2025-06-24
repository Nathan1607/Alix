import Header from "../../components/header";
import YellowBar from "../../components/yellowBar";
import TabButton from "../../components/Commune/buttonCommune";
import { useEffect, useState } from "react";
import CardItem from "../../components/Commune/CardItem";
import { Articles } from "../../types/articles";
import { Workshops } from "../../types/workshop";
import { Events } from "../../types/events";
import { getArticles, getEvents, getWorkshops } from "../../api/api";
import { useNavigate } from "react-router-dom";

const Commune = () => {
  const tabs = ["Voir tout", "Actualités", "Événements", "Ateliers"];
  const [activeTab, setActiveTab] = useState("Voir tout");

  const [articles, setArticles] = useState<Articles[]>([]);
  const [workshops, setWorkshops] = useState<Workshops[]>([]);
  const [events, setEvents] = useState<Events[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const communeId = 72132;
  const navigate = useNavigate();


  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const [articlesData, eventsData, workshopsData] = await Promise.all([
          getArticles(communeId),
          getEvents(communeId),
          getWorkshops(communeId),
        ]);
  
        console.log("ID Commune", communeId);

        setArticles(articlesData);
        setEvents(eventsData);
        setWorkshops(workshopsData);
      } catch (err: any) {
        setError(err.message || "Erreur lors du chargement");
      } finally {
        setLoading(false);
      }
    };
  
    fetchAllData();
  }, []);

  const renderItems = () => {
    if (loading) return <p style={{ padding: 20 }}>Chargement...</p>;
    if (error)
      return <p style={{ padding: 20, color: "red" }}>Erreur : {error}</p>;

    const itemsToRender = [];

    if (activeTab === "Voir tout" || activeTab === "Actualités") {
      itemsToRender.push(
        ...articles.map((article) => (
          <CardItem
            key={`article-${article.id}`}
            imageUrl={
              article.img_1 ??
              ""
            }
            tag="Article"
            tagColor="#8B0000"
            title={article.title_1}
            description={article.text_1}
            buttonLabel="Lire l’article"
            onButtonClick={() => navigate('/detail', { state: { item: { ...article, type: 'article' } } })}
            />
        ))
      );
    }

    if (activeTab === "Voir tout" || activeTab === "Événements") {
      itemsToRender.push(
        ...events.map((event) => (
          <CardItem
            key={`event-${event.id}`}
            imageUrl={
              event.img_1 ??
              ""
            }
            tag="Événement"
            tagColor="#004B8D"
            title={event.title_1}
            description={event.text_1}
            buttonLabel="Voir l’événement"
            onButtonClick={() => navigate('/detail', { state: { item: { ...event, type: 'evenement' } } })}
            />
        ))
      );
    }

    if (activeTab === "Voir tout" || activeTab === "Ateliers") {
      itemsToRender.push(
        ...workshops.map((atelier) => (
          <CardItem
            key={`workshop-${atelier.id}`}
            imageUrl={
              atelier.img_1 ??
              ""
            }
            tag="Atelier"
            tagColor="#007B55"
            title={atelier.title_1}
            description={atelier.text_1}
            buttonLabel="Voir l’atelier"
            onButtonClick={() => navigate('/detail', { state: { item: { ...atelier, type: 'atelier' } } })}
            />
        ))
      );
    }

    return (
      <div
      style={{
        border: '5px solid #004B8D',
        borderRadius: '12px',
        padding: '20px',
        margin: '20px',
        marginTop: '0',
      }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "1.5rem",
          }}
        >
          {itemsToRender}
        </div>
      </div>
    );
  };

  return (
    <div>
      <Header />
      <YellowBar
        title="Ma commune"
        backtitle="Retour"
        showBack
        showLogo
        showSettings
      />
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "20px",
          justifyItems: "center",
          padding: "20px 20px 0px 20px",
          marginLeft: "1rem",
        }}
      >
        <div style={{ display: "flex", gap: ".5rem", padding: "20px 2Opx 0px 20px" }}>
          {tabs.map((tab) => (
            <TabButton
              key={tab}
              label={tab}
              active={activeTab === tab}
              onClick={() => setActiveTab(tab)}
            />
          ))}
        </div>
      </div>

      {renderItems()}
    </div>
  );
};

export default Commune;
