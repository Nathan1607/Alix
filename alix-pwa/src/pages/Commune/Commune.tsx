import Header from "../../components/header";
import YellowBar from "../../components/yellowBar";
import TabButton from "../../components/Commune/buttonCommune";
import { useEffect, useState } from "react";
import CardItem from "../../components/Commune/CardItem";
import { Articles } from "../../types/articles";
import { Workshops } from "../../types/workshop";
import { Events } from "../../types/events";
import { getArticles, getEvents, getWorkshops } from "../../api/api";

const Commune = () => {
  const tabs = ["Voir tout", "Actualités", "Événements", "Ateliers"];
  const [activeTab, setActiveTab] = useState("Voir tout");

  const [articles, setArticles] = useState<Articles[]>([]);
  const [workshops, setWorkshops] = useState<Workshops[]>([]);
  const [events, setEvents] = useState<Events[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const [articlesData, eventsData, workshopsData] = await Promise.all([
          getArticles(),
          getEvents(),
          getWorkshops(),
        ]);

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
              "https://via.placeholder.com/300x200?text=Image+non+disponible"
            }
            tag="Article"
            tagColor="#8B0000"
            title={article.title_1}
            description={article.text_1}
            buttonLabel="Lire l’article"
            onButtonClick={() => console.log("Article ID:", article.id)}
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
              "https://via.placeholder.com/300x200?text=Image+non+disponible"
            }
            tag="Événement"
            tagColor="#004B8D"
            title={event.title_1}
            description={event.text_1}
            buttonLabel="Voir l’événement"
            onButtonClick={() => console.log("Event ID:", event.id)}
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
              "https://via.placeholder.com/300x200?text=Image+non+disponible"
            }
            tag="Atelier"
            tagColor="#007B55"
            title={atelier.title_1}
            description={atelier.text_1}
            buttonLabel="Voir l’atelier"
            onButtonClick={() => console.log("Atelier ID:", atelier.id)}
          />
        ))
      );
    }

    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "1.5rem",
          padding: "1rem 20px",
        }}
      >
        {itemsToRender}
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
          padding: "20px",
        }}
      >
        <div style={{ display: "flex", gap: ".5rem", padding: "10px 20px" }}>
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
