// // import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
// // import Dashboard from "./pages/Dashboard";
// // import Login from './pages/Login'
// // import KarachiPage from "./pages/cities/KarachiPage";
// // import LahorePage from "./pages/cities/LahorePage";
// // import PeshawarPage from "./pages/cities/PeshawarPage";
// // import KharianPage from "./pages/cities/KharianPage";
// // import RawalpindiPage from "./pages/cities/RawalpindiPage";
// // import SialkotPage from "./pages/cities/SialkotPage";
// // import KarachiMap from "./pages/KarachiMap";
// // import LahoreMap from "./pages/Lahore/LahoreMap";
// // import RawalpindiMap from "./pages/Rawalpindi/RawalpindiMap";


// // export default function App() {
// //   return (
// //     <Router>
// //       <Routes>
// //         {/* Default */}
// //         <Route path="/" element={<Navigate to="/login" replace />} />

// //         <Route path="/login" element={<Login />} />

// //         {/* Dashboard */}
// //         <Route path="/dashboard" element={<Dashboard />} />

// //         {/* City Pages */}                                                                                                    
// //         {/* <Route path="/karachiStats" element={<KarachiPage />} />
// //         <Route path="/lahore" element={<LahorePage />} />
// //         <Route path="/peshawar" element={<PeshawarPage />} />
// //         <Route path="/kharian" element={<KharianPage />} />
// //         <Route path="/rawalpindi" element={<RawalpindiPage />} />
// //         <Route path="/sialkot" element={<SialkotPage />} /> */}
// //         <Route path="/karachi" element={<KarachiMap />} />
// //         <Route path="/lahore" element={<LahoreMap />} />
// //         <Route path="/rawalpindi" element={<RawalpindiMap />} />
// //       </Routes>
// //     </Router>
// //   );
// // }


// import React from 'react';
// import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
// // Corrected import paths: assuming components are accessible via simple relative pathing
// import Dashboard from "./pages/Dashboard";
// import Login from './pages/Login'
// import KarachiPage from "./pages/cities/KarachiPage";
// import LahorePage from "./pages/cities/LahorePage";
// import PeshawarPage from "./pages/cities/PeshawarPage";
// import KharianPage from "./pages/cities/KharianPage";
// import RawalpindiPage from "./pages/cities/RawalpindiPage";
// import SialkotPage from "./pages/cities/SialkotPage";
// import KarachiMap from "./pages/KarachiMap";
// import LahoreMap from "./pages/Lahore/LahoreMap";
// import RawalpindiMap from "./pages/Rawalpindi/RawalpindiMap";
// import Peshawar from "./pages/Peshawar/PeshawarMap"

// import ComplaintsMap from './pages/complaints/ComplaintsMap';
// import ComplaintContainer from './pages/complaints/ComplaintsContainer'


// /**
//  * A wrapper component that checks if the user is authenticated (has a token).
//  * If authenticated, it renders the child components (the requested route).
//  * If not authenticated, it redirects the user to the login page.
//  */
// function RequireAuth({ children }) {
//   // Check for the token saved during successful login in the Login component
//   const token = localStorage.getItem('userToken'); 
//   const location = useLocation();

//   if (!token) {
//     // Redirect to the login page, passing the current location in state
//     // so the user can be redirected back after logging in.
//     return <Navigate to="/login" state={{ from: location }} replace />;
//   }

//   return children;
// }


// export default function App() {
//   return (
//     <Router>
//       <Routes>
//         {/* Default route redirects to login if the app loads without a path */}
//         <Route path="/" element={<Navigate to="/login" replace />} />

//         {/* Unprotected Route: Login Page */}
//         <Route path="/login" element={<Login />} />

//         {/* Protected Routes - All routes inside RequireAuth will require a userToken */}

//         {/* Dashboard */}
//         <Route 
//           path="/dashboard" 
//           element={
//             <RequireAuth>
//               <Dashboard />                                                                             
//             </RequireAuth>
//           } 
//         />

//           <Route 
//           path="/complaints" 
//           element={
//             <RequireAuth>
//               <ComplaintContainer/>
//             </RequireAuth>
//           } 
//         />

//         {/* Protected City Map Pages */}
//         <Route 
//           path="/karachi" 
//           element={
//             <RequireAuth>
//               <KarachiMap />
//             </RequireAuth>
//           } 
//         />
//         <Route 
//           path="/lahore" 
//           element={
//             <RequireAuth>
//               <LahoreMap />
//             </RequireAuth>
//           } 
//         />
//         <Route 
//           path="/rawalpindi" 
//           element={
//             <RequireAuth>
//               <RawalpindiMap />
//             </RequireAuth>
//           } 
//         />


//          <Route 
//           path="/peshawar" 
//           element={
//             <RequireAuth>
//               <Peshawar />
//             </RequireAuth>
//           } 
//         />



//       </Routes>
//     </Router>
//   );
// }


// App.js`````````````````````````````````````````````````````````````````````````````````````````````````````````````````````

// import React from 'react';

// import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";

// // Core Components
// import Dashboard from "./pages/Dashboard";
// import Login from './pages/Login'
// import KarachiMap from "./pages/KarachiMap";
// import LahoreMap from "./pages/Lahore/LahoreMap";
// import RawalpindiMap from "./pages/Rawalpindi/RawalpindiMap";
// import Peshawar from "./pages/Peshawar/PeshawarMap"
// import KharianMap from "./pages/Kharian/KharianMap"
// import SialkotMap from "./pages/Sialkot/SialkotMap"
// import CustomerDetail from "./pages/CustomerDetail";
// // Complaints Components
// import ComplaintsMap from './pages/complaints/ComplaintsMap'; // Imported but not used in routes below
// import ComplaintContainer from './pages/complaints/ComplaintsContainer'
// import NationwideMap from './pages/Nationwide/NationwideMap'

// /**
//  * A wrapper component that checks if the user is authenticated (has a token).
//  * If authenticated, it renders the child components (the requested route).
//  * If not authenticated, it redirects the user to the login page.
//  */
// function RequireAuth({ children }) {
//   // Check for the token saved during successful login in the Login component
//   const token = localStorage.getItem('userToken'); 
//   const location = useLocation();

//   if (!token) {
//     // Redirect to the login page, passing the current location in state
//     // so the user can be redirected back after logging in.
//     return <Navigate to="/login" state={{ from: location }} replace />;
//   }

//   return children;
// }


// export default function App() {
//   return (
//     <Router>
//       <Routes>
//         {/* Default route redirects to login if the app loads without a path */}
//         <Route path="/" element={<Navigate to="/login" replace />} />

//         {/* Unprotected Route: Login Page */}
//         <Route path="/login" element={<Login />} />

//         {/* Protected Routes - All routes inside RequireAuth will require a userToken */}

//         {/* Dashboard */}
//         <Route 
//           path="/dashboard" 
//           element={
//             <RequireAuth>
//               <Dashboard />                                                                             
//             </RequireAuth>
//           } 
//         />

//         {/* Customer Detail View (For Live Status & Polling) */}
//         <Route 
//           path="/customer/:customer_id" 
//           element={
//             <RequireAuth>
//               <CustomerDetail />
//             </RequireAuth>
//           } 
//         />


//         {/* Complaints */}
//         <Route 
//           path="/complaints" 
//           element={
//             <RequireAuth>
//               <ComplaintContainer/>
//             </RequireAuth>
//           } 
//         />

//             <Route 
//           path="/nationwide" 
//           element={
//             <RequireAuth>
//               <NationwideMap />
//             </RequireAuth>
//           } 
//         />


//         {/* Protected City Map Pages */}
//         <Route 
//           path="/karachi" 
//           element={
//             <RequireAuth>
//               <KarachiMap />
//             </RequireAuth>
//           } 
//         />
//         <Route 
//           path="/lahore" 
//           element={
//             <RequireAuth>
//               <LahoreMap />
//             </RequireAuth>
//           } 
//         />
//         <Route 
//           path="/rawalpindi" 
//           element={
//             <RequireAuth>
//               <RawalpindiMap />
//             </RequireAuth>
//           } 
//         />

//           <Route 
//           path="/kharian" 
//           element={
//             <RequireAuth>
//               <KharianMap />
//             </RequireAuth>
//           } 
//         />
//          <Route 
//           path="/peshawar" 
//           element={
//             <RequireAuth>
//               <Peshawar />
//             </RequireAuth>
//           } 
//         />

//             <Route 
//           path="/sialkot" 
//           element={
//             <RequireAuth>
//               <SialkotMap />
//             </RequireAuth>
//           } 
//         />
//       </Routes>
//     </Router>
//   );
// }

// code before check user permissions and module access rules, with toast notifications for access denial scenarios.                                                  
// import React from 'react';
// import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";

// // Core Components
// import Dashboard from "./pages/Dashboard";
// import Login from './pages/Login';
// import KarachiMap from "./pages/KarachiMap";
// import LahoreMap from "./pages/Lahore/LahoreMap";
// import RawalpindiMap from "./pages/Rawalpindi/RawalpindiMap";
// import Peshawar from "./pages/Peshawar/PeshawarMap";
// import KharianMap from "./pages/Kharian/KharianMap";
// import SialkotMap from "./pages/Sialkot/SialkotMap";
// import CustomerDetail from "./pages/CustomerDetail";
// import ComplaintContainer from './pages/complaints/ComplaintsContainer';
// import NationwideMap from './pages/Nationwide/NationwideMap';

// /**
//  * Route Guard checking user session token and authorization rules via module names.
//  */
// function RequireAuth({ children, requiredModuleName, requiredFeature }) {
//   const token = localStorage.getItem("userToken");
//   const location = useLocation();

//   const showAccessDeniedToast = (message) => {
//     const existing = document.getElementById("access-denied-toast");

//     if (existing) return;

//     const toast = document.createElement("div");
//     toast.id = "access-denied-toast";

//     toast.innerHTML = `
//       <span style="font-size:20px;">🔒</span>
//       <div>
//         <div style="font-size:14px;font-weight:700;">
//           Access Denied
//         </div>
//         <div style="font-size:13px;opacity:.9;">
//           ${message}
//         </div>
//       </div>
//     `;

//     Object.assign(toast.style, {
//       position: "fixed",
//       top: "20px",
//       right: "20px",
//       background: "linear-gradient(135deg, #dc2626, #ef4444)",
//       color: "#fff",
//       padding: "14px 18px",
//       borderRadius: "14px",
//       display: "flex",
//       gap: "12px",
//       alignItems: "center",
//       fontWeight: "500",
//       zIndex: "999999",
//       minWidth: "320px",
//       boxShadow: "0 15px 35px rgba(0,0,0,.25)",
//       transform: "translateX(400px)",
//       transition: "all .35s ease",
//       border: "1px solid rgba(255,255,255,.15)",
//       backdropFilter: "blur(10px)",
//     });

//     document.body.appendChild(toast);

//     requestAnimationFrame(() => {
//       toast.style.transform = "translateX(0)";
//     });

//     setTimeout(() => {
//       toast.style.transform = "translateX(400px)";
//       toast.style.opacity = "0";

//       setTimeout(() => {
//         toast.remove();
//       }, 350);
//     }, 2500);
//   };

//   if (!token) {
//     return <Navigate to="/login" state={{ from: location }} replace />;
//   }

//   if (requiredModuleName) {
//     const rawAccess = localStorage.getItem("userAccess");
//     const userAccess = rawAccess ? JSON.parse(rawAccess) : [];

//     const moduleMatch = userAccess.find(
//       (access) =>
//         access?.name &&
//         access.name.toLowerCase().trim() ===
//           requiredModuleName.toLowerCase().trim()
//     );

//     // Module access denied
//     if (!moduleMatch) {
//       showAccessDeniedToast(
//         `You don't have access to ${requiredModuleName}.`
//       );

//       return <Navigate to="/login" replace />;
//     }

//     // Feature access verification rule engine
//     if (requiredFeature) {
//       const allowedFeatures = moduleMatch.features
//         ? moduleMatch.features.split(",")
//         : [];

//       const hasFeatureAccess =
//         allowedFeatures.includes("ALL") ||
//         allowedFeatures.some(
//           (f) =>
//             f.trim().toLowerCase() ===
//             requiredFeature.toLowerCase()
//         );

//       if (!hasFeatureAccess) {
//         showAccessDeniedToast(
//           `You don't have permission to access ${requiredFeature}.`
//         );

//         return <Navigate to="/login" replace />;
//       }
//     }
//   }

//   return children;
// }

// export default function App() {
//   return (
//     <Router>
//       <Routes>
//         <Route path="/" element={<Navigate to="/login" replace />} />
//         <Route path="/login" element={<Login />} />

//         {/* Dashboard Home - Open access to logged-in user profile sessions */}
//         <Route path="/dashboard" element={
//             <RequireAuth requiredModuleName="OPTIX Portal" requiredFeature="Dashboard"><Dashboard /></RequireAuth>
//         } />

//         {/* CRM Module Routes - Secured by checking for "Complaints" inside features field */}
//         <Route path="/complaints" element={
//             <RequireAuth requiredModuleName="OPTIX Portal" requiredFeature="Complaints"><ComplaintContainer/></RequireAuth>
//         } />
//         <Route path="/customer/:customer_id" element={
//             <RequireAuth requiredModuleName="OPTIX CRM WEB"><CustomerDetail /></RequireAuth>
//         } />

//         {/* GIS Mapping Tabs - Secured with requiredModuleName and explicit requiredFeature strings */}
//         <Route path="/nationwide" element={
//             <RequireAuth requiredModuleName="Optix Portal" requiredFeature="Analytics"><NationwideMap /></RequireAuth>
//         } />
//         <Route path="/karachi" element={
//             <RequireAuth requiredModuleName="Optix Portal" requiredFeature="Karachi"><KarachiMap /></RequireAuth>
//         } />
//         <Route path="/lahore" element={
//             <RequireAuth requiredModuleName="Optix Portal" requiredFeature="Lahore"><LahoreMap /></RequireAuth>
//         } />
//         <Route path="/rawalpindi" element={
//             <RequireAuth requiredModuleName="Optix Portal" requiredFeature="Rawalpindi"><RawalpindiMap /></RequireAuth>
//         } />
//         <Route path="/kharian" element={
//             <RequireAuth requiredModuleName="Optix Portal" requiredFeature="Kharian"><KharianMap /></RequireAuth>
//         } />
//         <Route path="/peshawar" element={
//             <RequireAuth requiredModuleName="Optix Portal" requiredFeature="Peshawar"><Peshawar /></RequireAuth>
//         } />
//         <Route path="/sialkot" element={
//             <RequireAuth requiredModuleName="Optix Portal" requiredFeature="Sialkot"><SialkotMap /></RequireAuth>
//         } />

//         <Route path="*" element={<Navigate to="/dashboard" replace />} />
//       </Routes>
//     </Router>
//   );
// }


//code with added authorization rules and access denial toast notifications for unauthorized access attempts to modules and 
// features and redirect to same tab

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";

// Core Components
import Dashboard from "./pages/Dashboard";
import Login from './pages/Login';
import KarachiMap from "./pages/KarachiMap";
import LahoreMap from "./pages/Lahore/LahoreMap";
import RawalpindiMap from "./pages/Rawalpindi/RawalpindiMap";
import Peshawar from "./pages/Peshawar/PeshawarMap";
import KharianMap from "./pages/Kharian/KharianMap";
import SialkotMap from "./pages/Sialkot/SialkotMap";
import CustomerDetail from "./pages/CustomerDetail";
import ComplaintContainer from './pages/complaints/ComplaintsContainer';
import NationwideMap from './pages/Nationwide/NationwideMap';

/**
 * Route Guard checking user session token and authorization rules via module names.
 */
function RequireAuth({ children, requiredModuleName, requiredFeature }) {
  const token = localStorage.getItem("userToken");
  const location = useLocation();

  const showAccessDeniedToast = (message) => {
    const existing = document.getElementById("access-denied-toast");

    if (existing) return;

    const toast = document.createElement("div");
    toast.id = "access-denied-toast";

    toast.innerHTML = `
      <span style="font-size:20px;">🔒</span>
      <div>
        <div style="font-size:14px;font-weight:700;">
          Access Denied
        </div>
        <div style="font-size:13px;opacity:.9;">
          ${message}
        </div>
      </div>
    `;

    Object.assign(toast.style, {
      position: "fixed",
      top: "20px",
      right: "20px",
      background: "linear-gradient(135deg, #dc2626, #ef4444)",
      color: "#fff",
      padding: "14px 18px",
      borderRadius: "14px",
      display: "flex",
      gap: "12px",
      alignItems: "center",
      fontWeight: "500",
      zIndex: "999999",
      minWidth: "320px",
      boxShadow: "0 15px 35px rgba(0,0,0,.25)",
      transform: "translateX(400px)",
      transition: "all .35s ease",
      border: "1px solid rgba(255,255,255,.15)",
      backdropFilter: "blur(10px)",
    });

    document.body.appendChild(toast);

    requestAnimationFrame(() => {
      toast.style.transform = "translateX(0)";
    });

    setTimeout(() => {
      toast.style.transform = "translateX(400px)";
      toast.style.opacity = "0";

      setTimeout(() => {
        toast.remove();
      }, 350);
    }, 2500);
  };

  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requiredModuleName) {
    const rawAccess = localStorage.getItem("userAccess");
    const userAccess = rawAccess ? JSON.parse(rawAccess) : [];

    const moduleMatch = userAccess.find(
      (access) =>
        access?.name &&
        access.name.toLowerCase().trim() ===
        requiredModuleName.toLowerCase().trim()
    );

    // Module access denied
    if (!moduleMatch) {
      showAccessDeniedToast(`You don't have access to ${requiredModuleName}.`);
      return <Navigate to="/dashboard" replace />;
    }

    // Feature access verification rule engine
    if (requiredFeature) {
      const allowedFeatures = moduleMatch.features ? moduleMatch.features.split(",") : [];
      const hasFeatureAccess =
        allowedFeatures.includes("ALL") ||
        allowedFeatures.some(
          (f) => f.trim().toLowerCase() === requiredFeature.toLowerCase()
        );

      if (!hasFeatureAccess) {
        showAccessDeniedToast(`You don't have permission to access ${requiredFeature}.`);
        return <Navigate to="/dashboard" replace />;
      }
    }
  }

  return children;
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />

        {/* Dashboard Home - Open access to logged-in user profile sessions */}
        <Route path="/dashboard" element={
          <RequireAuth requiredModuleName="OPTIX Portal" requiredFeature="Dashboard"><Dashboard /></RequireAuth>
        } />

        {/* CRM Module Routes - Secured by checking for "Complaints" inside features field */}
        <Route path="/complaints" element={
          <RequireAuth requiredModuleName="OPTIX Portal" requiredFeature="Complaints"><ComplaintContainer /></RequireAuth>
        } />
        <Route path="/customer/:customer_id" element={
          <RequireAuth requiredModuleName="OPTIX CRM WEB"><CustomerDetail /></RequireAuth>
        } />

        {/* GIS Mapping Tabs - Secured with requiredModuleName and explicit requiredFeature strings */}
        <Route path="/nationwide" element={
          <RequireAuth requiredModuleName="Optix Portal" requiredFeature="Analytics"><NationwideMap /></RequireAuth>
        } />
        <Route path="/karachi" element={
          <RequireAuth requiredModuleName="Optix Portal" requiredFeature="Karachi"><KarachiMap /></RequireAuth>
        } />
        <Route path="/lahore" element={
          <RequireAuth requiredModuleName="Optix Portal" requiredFeature="Lahore"><LahoreMap /></RequireAuth>
        } />
        <Route path="/rawalpindi" element={
          <RequireAuth requiredModuleName="Optix Portal" requiredFeature="Rawalpindi"><RawalpindiMap /></RequireAuth>
        } />
        <Route path="/kharian" element={
          <RequireAuth requiredModuleName="Optix Portal" requiredFeature="Kharian"><KharianMap /></RequireAuth>
        } />
        <Route path="/peshawar" element={
          <RequireAuth requiredModuleName="Optix Portal" requiredFeature="Peshawar"><Peshawar /></RequireAuth>
        } />
        <Route path="/sialkot" element={
          <RequireAuth requiredModuleName="Optix Portal" requiredFeature="Sialkot"><SialkotMap /></RequireAuth>
        } />

        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Router>
  );
}