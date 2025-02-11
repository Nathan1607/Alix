import Header from '../components/header';
import YellowBar from '../components/yellowBar';

const Home = () => {
    return (
      <div>
        <Header />
        <YellowBar title="Accueil" backtitle='Retour' showBack showLogo showSettings />
        </div>
    );
  };
  
  export default Home;
  