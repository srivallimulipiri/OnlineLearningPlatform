import React from 'react';
import Navbar from './Navbar';
import { useAuth } from '../../hooks/useAuth';
import './MainLayout.css'; // Make sure to create this CSS file

const MainLayout = ({ children, showSidebar = true }) => {
  const { user } = useAuth();

  return (
    <div className="main-layout">
      <Navbar />

      <div className="layout-content">
        

        <main className="main-area">
          <div className="main-inner">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
