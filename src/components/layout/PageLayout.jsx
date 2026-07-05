import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar from './Topbar';

const PageLayout = () => {
  return (
    <div className="page-layout">
      <Sidebar />
      <div className="main-content">
        <Topbar />
        <main className="content-container">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default PageLayout;
