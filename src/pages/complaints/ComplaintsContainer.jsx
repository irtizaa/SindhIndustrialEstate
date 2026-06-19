import React from 'react';
import './ComplaintContainer.css';

import MetroFiberChartCard from '../dashboardComponents/charts/MetroFiberChartCard'
import CustomersChartCard from '../dashboardComponents/charts/CustomersChartCard'
import RegionFiberChartCard from '../dashboardComponents/charts/RegionFiberChartCard'

import MainLayout from '../../layouts/MainLayout';
import ComplaintsMap from './ComplaintsMap'
import TopOltChart from './ComplaintsChart';
import AreaWiseChart from './ComplaintAgingChart';
import OLTWiseComplaints from './ComplaintsPriorityChart'

export default function ComplaintsContainer() {
  return (
      <MainLayout>
    <div className="complaints-dashboard-container">
      {/* ----------------------------------------------------- */}
      {/* SECTION 1: Top Metrics and Primary Map View */}
      {/* ----------------------------------------------------- */}
      <div className="complaints-dashboard-row-top">
        
        {/* Column 1 & 2: Main Stats Grid */}
       

        {/* Column 3: Primary Map Area (Top-Right) */}
        <ComplaintsMap />
      </div>

      {/* ----------------------------------------------------- */}
      {/* SECTION 2: Bottom Charts and Analytics */}
      {/* ----------------------------------------------------- */}
      <div className="complaints-dashboard-row-bottom">
        
        {/* Chart Card 1 (Bottom-Left) */}    
         <OLTWiseComplaints/>       

        {/* Chart Card 2 (Bottom-Middle) */}                                
          <AreaWiseChart/>

        {/* Chart Card 3 (Bottom-Right - isLarge=true) */}
         <TopOltChart/>
      </div>
    </div>
    </MainLayout>
  );
}