import Header from './components/header';
import YellowBar from './components/yellowBar';
import AppRoutes from './routes/AppRoutes';

function App() {
  return (
    <>
      <Header />
      <YellowBar title="Ma page" showLogo showSettings />
        <main style={{ paddingTop: '8rem' }}>
        <AppRoutes />
      </main>
    </>
  );
}

export default App;
