import React from 'react';
import './Dashboard.css';

// Import the new components
import StatCard from './dashboardComponents/StatCard';
import MapSection from './dashboardComponents/MapSection';                                  
import ChartCard from './dashboardComponents/ChartCard';
import MetroFiberChartCard from './dashboardComponents/charts/MetroFiberChartCard'
import CustomersChartCard from './dashboardComponents/charts/CustomersChartCard'
import RegionFiberChartCard from './dashboardComponents/charts/RegionFiberChartCard'

import FDTCountCard from './dashboardComponents/JointsCountCard';
import MetroFiberCount from './dashboardComponents/MetroFiberCount'
import CustomersCountCard from './dashboardComponents/CustomersCountCard';
import OLTCountCard from './dashboardComponents/NodesCountCard';
import FatCountCard from './dashboardComponents/FatCountCard';
import HHCountCard from './dashboardComponents/HHCountCard';
import CustomersChartByFDTs from './dashboardComponents/charts/CustomersChartByFDTs';

export default function Dashboard() {
  return (
    <div className="dark-dashboard-container">
      {/* ----------------------------------------------------- */}
      {/* SECTION 1: Top Metrics and Primary Map View */}
      {/* ----------------------------------------------------- */}
      <div className="dark-dashboard-row-top">
        
        {/* Column 1 & 2: Main Stats Grid */}
        <div className="dark-dashboard-stats-grid">
          
          {/* Main Stat Card 1 (Top-Left-Top) */}
         
          <MetroFiberCount/>
          
          {/* Small Stat Card 1 (Top-Middle-Top) */}      
          <CustomersCountCard/>
          {/* Main Stat Card 2 (Top-Left-Bottom) */}      

         <OLTCountCard/>

       <FDTCountCard/>
       <FatCountCard/>
       <HHCountCard/>
          
          {/* Small Stat Card 2 (Top-Middle-Bottom) */}       
           

           
        </div>

        {/* Column 3: Primary Map Area (Top-Right) */}
        <MapSection />
      </div>

      {/* ----------------------------------------------------- */}
      {/* SECTION 2: Bottom Charts and Analytics */}
      {/* ----------------------------------------------------- */}
      <div className="dark-dashboard-row-bottom">
        
        {/* Chart Card 1 (Bottom-Left) */}    
         <RegionFiberChartCard/>       

        {/* Chart Card 2 (Bottom-Middle) */}
          <CustomersChartCard/>

        {/* Chart Card 3 (Bottom-Right - isLarge=true) */}
         <MetroFiberChartCard/>

 {/* Chart Card 4 (Bottom-Left) */}
            <CustomersChartByFDTs/>
      </div>
    </div>
  );
}