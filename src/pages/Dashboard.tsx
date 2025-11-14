import React from 'react';
import DashboardNavbar from '../components/DashboardNavbar';
import OrderStatusSection from '../components/sections/OrderStatusSection';
import OffersSection from '../components/sections/OffersSection';
import ServicesSection from '../components/sections/ServicesSection';
import './Dashboard.css';

const Dashboard: React.FC = () => {
  return (
    <div className="dashboard-page">
      <DashboardNavbar />
      <main className="dashboard-content">
        <OrderStatusSection />
        <OffersSection />
        <ServicesSection />
      </main>
    </div>
  );
};

export default Dashboard;

