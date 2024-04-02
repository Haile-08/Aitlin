import AppProvider from './Provider/appProvider';
import Routes from './routes/routes';

function App() {
  return (
    <AppProvider>
      <Routes/>
    </AppProvider>
  );
}

export default App;
