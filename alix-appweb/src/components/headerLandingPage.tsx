import "../styles/headerLandingPage.css";
import logoAlix from "../assets/Alix-logo.svg";
import { useState } from "react";
import { Menu, X } from "lucide-react";

export default function headerLandingPage() {
  
  const [isOpen, setIsOpen] = useState(false);


  return (
    <>
      <header>
      <nav className="container">
        <a href="#" className="logoAlix">
          <img src={logoAlix} alt="Logo" className="logoAlix" />
        </a>
        <button className="menu-toggle" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
        <ul className={isOpen ? "active" : "hidden"}>
        <li><a href="#hero-banner">Accueil</a></li>
          <li><a href="#reassurance">Le problème</a></li>
          <li><a href="#solution">Notre solution</a></li>
          <li><a href="#avantages">Avantages</a></li>
          <li><a href="#contact">Contact</a></li>
        </ul>
      </nav>
    </header>
    </>
  );
}
