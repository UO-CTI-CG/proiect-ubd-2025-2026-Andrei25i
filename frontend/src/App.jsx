import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import PageNavigationHandler from './components/layout/PageNavigationHandler';
import AppRouter from './routes/AppRouter';
import Navbar from './components/layout/Navbar';

function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-center" />
      <PageNavigationHandler />

      <Navbar />

      <main>
        <AppRouter />
      </main>
    </BrowserRouter>
  );
}

export default App;