import { Routes, Route } from 'react-router-dom';

import Home from '../pages/Home';
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';
import ForgotPassword from '../pages/auth/ForgotPassword';
import ResetPassword from '../pages/auth/ResetPassword';
import NotFound from '../pages/not-found/NotFound';
import Categories from '../pages/categories/Categories';
import Favorites from '../pages/favorites/Favorites';
import CategoryPage from '../pages/categories/CategoryPage';

const AppRouter = () => {
  return (
    <Routes>
      {/* Home */}
      <Route path="/" element={<Home />} />

      {/* Categories */}
      <Route path='/categories' element={<Categories />} />
      <Route path='/categories/:id' element={<CategoryPage />} />

      {/* Favorites */}
      <Route path='/favorites' element={<Favorites />}/>
      
      {/* Auth */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />

      {/* 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRouter;