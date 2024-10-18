import React from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { MyContextProvider } from './context/index';
import 'semantic-ui-css/semantic.min.css'
import { Toaster } from 'react-hot-toast';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './page/auth/Login';
import SignUp from './page/auth/SignUp';
import PrivateRoute from './page/PrivateRoute';
import SoketTest from './page/SoketTest';
import NotFound from './page/NotFound';
import UserLayout from "./components/Layout";


createRoot(document.getElementById('root')!).render(
  <MyContextProvider>
    <Router>
      <Routes>
        <Route path="/login" element={<UserLayout><Login /></UserLayout>} />
        <Route path="/SignUp" element={<UserLayout><SignUp /></UserLayout>} />
        <Route path="/" element={<UserLayout><PrivateRoute><SoketTest /></PrivateRoute></UserLayout>} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Toaster />
    </Router>
  </MyContextProvider>
)



