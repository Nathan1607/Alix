import "../styles/headerLandingPage.css";
import logoAlix from "../assets/Alix-logo.svg";

export default function headerLandingPage() {
  return (
    <>
      <header>
        <div className="test">
        <img className="logoAlix" src={logoAlix} alt="Logo Alix" />
        <nav>
            <ul>
              <li>
                <a href="#accueil">Accueil</a>
              </li>
              <li>
                <a href="#probleme">Le problème</a>
              </li>
              <li>
                <a href="#solution">Notre solution</a>
              </li>
              <li>
                <a href="#avantages">Avantages</a>
              </li>
              <li>
                <a href="#contact">Contact</a>
              </li>
            </ul>
          </nav>
        </div>
      </header>
    </>
  );
}
