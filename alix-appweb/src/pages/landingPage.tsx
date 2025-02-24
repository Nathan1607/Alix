import HeaderLandingPage from "../components/headerLandingPage";
import "../styles/landingPage.css";
import '../assets/fonts/FFNort/stylesheet.css';
import '../assets/fonts/Aktinson_Hyperlegible/stylesheet.css';
import { ChevronDown } from "lucide-react";
import tabFamily from "../assets/tab_family.svg";
import tabHome from "../assets/tab_home-city.svg";
import tabCalendar from "../assets/tab_calendar-sharp.svg";
import logoAlix from "../assets/Alix-logo.svg";
import { FaFacebookF, FaInstagram, FaLinkedinIn } from "react-icons/fa";
import alixMockup from '../assets/alix-tab-mockup.png';

export default function LandingPage() {
  return (
    <>
      <HeaderLandingPage />

      <section id="hero-banner">
        <div className="container">
          <h1 className="title">
            <span className="text-Alix">Alix</span> met fin à l’exclusion
            numérique des ainés
          </h1>
          <p>
            Aidons nos seniors à reprendre une véritable place dans la société
          </p>
        </div>
        <a href="#reassurance" className="scroll-down">
          <ChevronDown size={32} />
        </a>
      </section>

      <section id="reassurance">
        <div className="container-col">
          <h2 className="title-2">
            Soyons là pour <span className="text-pink">eux</span>
          </h2>
          <div className="rea-list">
            <p>
              <span className="info-rea">49%</span> des personnes âgées disent
              se sentir seules
            </p>
            <p>
              <span className="info-rea">14%</span> des personnes de plus de 60
              ans vivant à domicile ne sont plus autonomes
            </p>
            <p>
              <span className="info-rea">4 millions</span> de français sont
              exclus du numérique
            </p>
          </div>
        </div>
      </section>

      <section id="solution">
        <div className="container">
          <h2 className="title-2">Notre solution</h2>
          <p className="text-solution">
            <span>Alix</span>, la plateforme numérique qui centralise tous les
            besoins des seniors
          </p>
          <img src={alixMockup} alt="Alix" className="solution-img" />
        </div>
      </section>

      <section id="avantages">
        <div className="container">
          <h2 className="title-2">Les avantages d’Alix</h2>
          <p className="text-avantages">
            Votre assistant numérique au quotidien
          </p>
          <div className="avantages-list">
            <div className="avantages-item">
              <img src={tabFamily} alt="icon" />
              <div>
                <h3>Un lien social constant</h3>
                <ul>
                  <li>Échanges faciles avec la famille et les amis</li>
                  <li>Évènements alentours, covoiturage et navettes</li>
                  <li>
                    Informations claires sur la vie sociétale et communale
                  </li>
                </ul>
              </div>
            </div>
            <div className="avantages-item">
              <img src={tabCalendar} alt="icon" />
              <div>
                <h3>Une aide au quotidien</h3>
                <ul>
                  <li>Agenda complet avec rendez-vous et évènements</li>
                  <li>
                    Assistance et ressources (administration, cuisine,
                    bien-être...)
                  </li>
                  <li>Contrôle de la domotique</li>
                </ul>
              </div>
            </div>
            <div className="avantages-item">
              <img src={tabHome} alt="icon" />
              <div>
                <h3>Gestion par les proches</h3>
                <ul>
                  <li>Une application tierce pour tous les appareils</li>
                  <li>
                    Partagez lui votre quotidien (photos, messages, agenda..)
                  </li>
                  <li>Vous êtes contactés en cas d’urgence</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="contact">
        <div className="container">
          <h2 className="title-2">Contactez-nous</h2>
          <p>
            Une question ou une demande d'information ? Envoyez-nous un e-mail !
          </p>
          <a href="mailto:gaulardnathan@mail.com" className="contact-button">
            Nous contacter
          </a>
        </div>
      </section>

      <footer>
        <div className="container">
          <a href="" className="logo">
            <img src={logoAlix} alt="Logo" />
          </a>

          <div className="social-links">
            <a
              href="http://facebook.com/profile.php?id=61568554250575"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaFacebookF size={24} />
            </a>
            <a
              href="https://www.instagram.com/solution.alix/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaInstagram size={24} />
            </a>
            <a
              href="https://www.linkedin.com/company/solution-alix/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaLinkedinIn size={24} />
            </a>
          </div>

          <div className="privacy">
          <a href="/mention-legale" className="privacy-policy">
            Mention legale
          </a>
          </div>
        </div>
      </footer>
    </>
  );
}
