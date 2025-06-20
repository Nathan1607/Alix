import Header from "../components/header";
import YellowBar from "../components/yellowBar";
import ButtonHome from "../components/buttonHome";
import {
  FiCalendar,
  FiHome,
  FiPlusSquare,
  FiRadio,
  FiUsers,
} from "react-icons/fi";
import { FaPuzzlePiece } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';

const Home = () => {

  const navigate = useNavigate();

  return (
    <div>
      <Header />
      <YellowBar
        title="Accueil"
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
        {" "}
        <ButtonHome
          icon={<FiUsers />}
          text="Mes proches"
          backgroundColor="#2E7D32"
        />
        <ButtonHome
          icon={<FiHome />}
          text="Ma commune"
          backgroundColor="#EF6C00"
          onClick={() => navigate('/commune')}
        />
        <ButtonHome
          icon={<FiCalendar />}
          text="Agenda"
          backgroundColor="#37474F"
        />
        <ButtonHome
          icon={<FiPlusSquare />}
          text="Santé"
          backgroundColor="#1565C0"
        />
        <ButtonHome icon={<FiRadio />} text="Radio" backgroundColor="#B71C1C" />
        <ButtonHome
          icon={<FaPuzzlePiece />}
          text="Jeux"
          backgroundColor="#6A1B9A"
        />
      </div>{" "}
    </div>
  );
};

export default Home;
