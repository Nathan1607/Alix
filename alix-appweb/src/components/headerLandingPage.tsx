import "../styles/headerLandingPage.css";
import logoAlix from "../assets/Alix-logo.svg";

export default function headerLandingPage() {
  return (
    <>
      <header>
    <nav className="container">
      <a href="" className="logoAlix"><img src={logoAlix} alt="Logo" className="logoAlix" /></a>
      <ul>
        <li><a href="">Accueil</a></li>
        <li><a href="">Le problème</a></li>
        <li><a href="">Notre solution</a></li>
        <li><a href="">Avantages</a></li>
        <li><a href="">Contact</a></li>
      </ul>
    </nav>
  </header>
    </>
  );
}

