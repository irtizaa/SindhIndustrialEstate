// import React, { useState } from "react";
// import { motion } from "framer-motion";
// import { useNavigate } from "react-router-dom"; // Removed BrowserRouter from imports

// // The API endpoint for sign-in
// // const SIGN_IN_API_URL = "https://geoapi.rainmaker.pk/api/auth/sign-in";
// const SIGN_IN_API_URL = "https://geoapi.rainmaker.pk/api/auth/sign-in";
// // const SIGN_IN_API_URL = "http://103.31.83.217:3000/api/auth/sign-in";


// /**
//  * Custom fetch implementation with exponential backoff for retrying
//  * in case of transient network errors or rate limiting (HTTP 429).
//  */
// const fetchWithRetry = async (url, options, maxRetries = 3) => {
//     let response = null;

//     for (let i = 0; i < maxRetries; i++) {
//         try {
//             response = await fetch(url, options);

//             // Handle rate limit (429) by waiting and retrying
//             if (response.status === 429 && i < maxRetries - 1) {
//                 const delay = Math.pow(2, i) * 1000;
//                 // No logging of retry attempts as per system instructions
//                 await new Promise(resolve => setTimeout(resolve, delay));
//                 continue; 
//             }

//             // If successful or if we cannot/should not retry, break the loop
//             return response;

//         } catch (error) {
//             // Handle network errors (e.g., DNS, CORS, or connection refused)
//             if (i < maxRetries - 1) {
//                 const delay = Math.pow(2, i) * 1000;
//                 await new Promise(resolve => setTimeout(resolve, delay));
//                 continue;
//             }
//             throw new Error(`Login attempt failed after ${maxRetries} retries.`);
//         }
//     }
//     return response; // Return final response (even if unsuccessful)
// };


// // Contains the core login logic and uses React Router hooks
// // This component is now the default export, relying on an outer Router context.
// export default function Login() {
//   // State changed to use 'email' to match API requirements
//   const [form, setForm] = useState({ email: "", password: "" }); 
//   const [isLoading, setIsLoading] = useState(false);
//   const [message, setMessage] = useState(null); // Used for displaying error/success messages
//   const navigate = useNavigate();

//   const handleChange = (e) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//     setMessage(null); // Clear message on input change
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setIsLoading(true);
//     setMessage(null);

//     const payload = {
//       email: form.email, 
//       password: form.password,
//     };

//     try {
//       const response = await fetchWithRetry(SIGN_IN_API_URL, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(payload),
//       });

//       // if (response && response.ok) {
//       //   const data = await response.json();

//       //   // --- Success Handling ---
//       //   console.log("Login successful. Token received:", data.user.token);

//       //   // Store the token for future authenticated requests
//       //   localStorage.setItem('userToken', data.user.token); 

//       //   setMessage(data.message || "Logged in successfully!");

//       //   // Navigate to dashboard after successful login
//       //   setTimeout(() => navigate("/dashboard"), 500); 

//       // } else {

//         if (response && response.ok) {
//   const data = await response.json();

//   // Check if user has Optix Portal access
//   const hasOptixPortalAccess = data?.user_access?.some(
//     (access) =>
//       access?.name &&
//       access.name.toLowerCase().includes("optix portal")
//   );

//   // If user does NOT have Optix Portal access
//   if (!hasOptixPortalAccess) {
//     localStorage.removeItem("userToken");

//     setMessage(
//       "Access denied. You do not have permission to access Optix Portal."
//     );

//     setIsLoading(false);
//     return;
//   }

//   // --- Success Handling ---
//   // console.log("Login successful. Token received:", data.user.token);
//   console.log("Login successful. Token received:");

//   // Store token
//   localStorage.setItem("userToken", data.user.token);

//   // Optional: store complete user data
//   localStorage.setItem("userData", JSON.stringify(data));

//   setMessage(data.message || "Logged in successfully!");

//   // Navigate to dashboard
//   setTimeout(() => navigate("/dashboard"), 500);

// } else {


//         // Handle API error response (4xx, 5xx)
//         let errorText = "Login failed. Please check your email and password.";
//         let status = response ? response.status : 'N/A'; // Get the status code

//         if (response) {
//             // Attempt to read error message from the body
//             const errorData = await response.json().catch(() => ({}));
//             errorText = errorData.message || errorText;
//         }

//         // 🛠️ REFINEMENT: Log the detailed error to the console
//         console.error(`Login API failed with status ${status}:`, errorText);

//         setMessage(errorText);
//       }
//     } catch (error) {
//       // Handle severe network/retry failure
//       console.error("Fatal login error:", error);
//       setMessage(error.message || "A critical network error occurred during sign-in.");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div
//       className="relative flex items-center justify-center h-screen overflow-hidden bg-cover bg-center font-sans"
//       style={{
//         backgroundImage: `url('/images/ChatGPT Image Oct 1, 2025, 05_50_57 PM.png')`,
//       }}
//     >
//       {/* Overlay to make text visible */}
//       <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

//       {/* Animated background circles */}
//       <motion.div
//         initial={{ scale: 0 }}
//         animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
//         transition={{ duration: 8, repeat: Infinity }}
//         className="absolute w-96 h-96 bg-pink-400 rounded-full blur-3xl opacity-40 -top-20 -left-20"
//       />
//       <motion.div
//         initial={{ scale: 0 }}
//         animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.5, 0.2] }}
//         transition={{ duration: 10, repeat: Infinity }}
//         className="absolute w-[28rem] h-[28rem] bg-indigo-500 rounded-full blur-3xl opacity-40 -bottom-32 -right-20"
//       />

//       {/* Glassmorphism card */}
//       <motion.div
//         initial={{ opacity: 0, y: 40 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.8 }}
//         className="relative z-10 w-full max-w-md p-8 bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20"
//       >
//         {/* Logo/Heading */}
//         <h1 className="text-4xl font-extrabold text-center text-white drop-shadow-lg">
//           GIS - Optix 
//         </h1>
//         <p className="mt-2 mb-6 text-center text-gray-200">
//           Welcome back! Please login to continue
//         </p>

//         {/* Message Display (Error/Success) */}
//         {message && (
//             <div 
//                 className={`p-3 mb-4 rounded-lg text-sm text-center font-medium ${
//                     message.includes("success") 
//                         ? "bg-green-600/70 text-white" 
//                         : "bg-red-600/70 text-white"
//                 }`}
//             >
//                 {message}
//             </div>
//         )}

//         {/* Login form */}
//         <form onSubmit={handleSubmit} className="space-y-6">
//           <motion.div whileFocus={{ scale: 1.05 }}>
//             <input
//               type="text" // Type changed from 'email' to 'text' for generic email
//               name="email"
//               value={form.email}
//               onChange={handleChange}
//               placeholder="email"
//               disabled={isLoading}
//               className="w-full px-4 py-3 text-white placeholder-gray-300 bg-white/20 border border-white/30 rounded-lg focus:ring-2 focus:ring-pink-400 outline-none backdrop-blur-sm transition duration-300 disabled:opacity-50"
//               required
//             />
//           </motion.div>

//           <motion.div whileFocus={{ scale: 1.05 }}>
//             <input
//               type="password"
//               name="password"
//               value={form.password}
//               onChange={handleChange}
//               placeholder="Password"
//               disabled={isLoading}
//               className="w-full px-4 py-3 text-white placeholder-gray-300 bg-white/20 border border-white/30 rounded-lg focus:ring-2 focus:ring-pink-400 outline-none backdrop-blur-sm transition duration-300 disabled:opacity-50"
//               required
//             />
//           </motion.div>

//           <motion.button
//             whileHover={{ scale: isLoading ? 1.0 : 1.05 }}
//             whileTap={{ scale: isLoading ? 1.0 : 0.95 }}
//             type="submit"
//             disabled={isLoading}
//             className="w-full px-4 py-3 font-semibold text-white bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 rounded-lg shadow-lg transition duration-300 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center"
//           >
//             {isLoading ? (
//                 <>
//                     <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                         <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                         <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                     </svg>
//                     Signing In...
//                 </>
//             ) : (
//                 "Login"
//             )}
//           </motion.button>
//         </form>
//       </motion.div>
//     </div>
//   );
// }

                                           
// code before redirect to dashboard, checks if user has access to "Optix Portal" and handles API errors with retry logic and user feedback.
// import React, { useState } from "react";
// import { motion } from "framer-motion";
// import { useNavigate } from "react-router-dom";

// const SIGN_IN_API_URL = "https://geoapi.rainmaker.pk/api/auth/sign-in";

// const fetchWithRetry = async (url, options, maxRetries = 3) => {
//     let response = null;
//     for (let i = 0; i < maxRetries; i++) {
//         try {
//             response = await fetch(url, options);
//             if (response.status === 429 && i < maxRetries - 1) {
//                 const delay = Math.pow(2, i) * 1000;
//                 await new Promise(resolve => setTimeout(resolve, delay));
//                 continue; 
//             }
//             return response;
//         } catch (error) {
//             if (i < maxRetries - 1) {
//                 const delay = Math.pow(2, i) * 1000;
//                 await new Promise(resolve => setTimeout(resolve, delay));
//                 continue;
//             }
//             throw new Error(`Login attempt failed after ${maxRetries} retries.`);
//         }
//     }
//     return response;
// };

// export default function Login() {
//   const [form, setForm] = useState({ email: "", password: "" }); 
//   const [isLoading, setIsLoading] = useState(false);
//   const [message, setMessage] = useState(null); 
//   const navigate = useNavigate();

//   const handleChange = (e) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//     setMessage(null); 
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setIsLoading(true);
//     setMessage(null);

//     const payload = {
//       email: form.email, 
//       password: form.password,
//     };

//     try {
//       const response = await fetchWithRetry(SIGN_IN_API_URL, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(payload),
//       });

//       if (response && response.ok) {
//         const data = await response.json();

//         const hasOptixPortalAccess = data?.user_access?.some(
//           (access) => access?.name && access.name.toLowerCase().trim() === "optix portal"
//         );

//         if (!hasOptixPortalAccess) {
//           localStorage.removeItem("userToken");
//           localStorage.removeItem("userAccess");
//           localStorage.removeItem("userData");

//           setMessage("Access denied. You do not have permission to access Optix Portal.");
//           setIsLoading(false);
//           return;
//         }

//         localStorage.setItem("userToken", data.user.token);
//         localStorage.setItem("userAccess", JSON.stringify(data.user_access || []));
//         localStorage.setItem("userData", JSON.stringify(data));

//         setMessage(data.message || "Logged in successfully!");
//         setTimeout(() => navigate("/dashboard"), 500);

//       } else {
//         let errorText = "Login failed. Please check your email and password.";
//         let status = response ? response.status : 'N/A';
//         if (response) {
//             const errorData = await response.json().catch(() => ({}));
//             errorText = errorData.message || errorText;
//         }
//         console.error(`Login API failed with status ${status}:`, errorText);
//         setMessage(errorText);
//       }
//     } catch (error) {
//       console.error("Fatal login error:", error);
//       setMessage(error.message || "A critical network error occurred during sign-in.");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div
//       className="relative flex items-center justify-center h-screen overflow-hidden bg-cover bg-center font-sans"
//       style={{ backgroundImage: `url('/images/ChatGPT Image Oct 1, 2025, 05_50_57 PM.png')` }}
//     >
//       <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
//       <motion.div
//         initial={{ scale: 0 }}
//         animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
//         transition={{ duration: 8, repeat: Infinity }}
//         className="absolute w-96 h-96 bg-pink-400 rounded-full blur-3xl opacity-40 -top-20 -left-20"
//       />
//       <motion.div
//         initial={{ scale: 0 }}
//         animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.5, 0.2] }}
//         transition={{ duration: 10, repeat: Infinity }}
//         className="absolute w-[28rem] h-[28rem] bg-indigo-500 rounded-full blur-3xl opacity-40 -bottom-32 -right-20"
//       />

//       <motion.div
//         initial={{ opacity: 0, y: 40 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.8 }}
//         className="relative z-10 w-full max-w-md p-8 bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20"
//       >
//         <h1 className="text-4xl font-extrabold text-center text-white drop-shadow-lg">GIS - Optix</h1>
//         <p className="mt-2 mb-6 text-center text-gray-200">Welcome back! Please login to continue</p>
        
//         {message && (
//             <div className={`p-3 mb-4 rounded-lg text-sm text-center font-medium ${message.includes("success") ? "bg-green-600/70 text-white" : "bg-red-600/70 text-white"}`}>
//                 {message}
//             </div>
//         )}

//         <form onSubmit={handleSubmit} className="space-y-6">
//           <motion.div whileFocus={{ scale: 1.05 }}>
//             <input
//               type="text"
//               name="email"
//               value={form.email}
//               onChange={handleChange}
//               placeholder="email"
//               disabled={isLoading}
//               className="w-full px-4 py-3 text-white placeholder-gray-300 bg-white/20 border border-white/30 rounded-lg focus:ring-2 focus:ring-pink-400 outline-none backdrop-blur-sm transition duration-300 disabled:opacity-50"
//               required
//             />
//           </motion.div>

//           <motion.div whileFocus={{ scale: 1.05 }}>
//             <input
//               type="password"
//               name="password"
//               value={form.password}
//               onChange={handleChange}
//               placeholder="Password"
//               disabled={isLoading}
//               className="w-full px-4 py-3 text-white placeholder-gray-300 bg-white/20 border border-white/30 rounded-lg focus:ring-2 focus:ring-pink-400 outline-none backdrop-blur-sm transition duration-300 disabled:opacity-50"
//               required
//             />
//           </motion.div>

//           <motion.button
//             whileHover={{ scale: isLoading ? 1.0 : 1.05 }}
//             whileTap={{ scale: isLoading ? 1.0 : 0.95 }}
//             type="submit"
//             disabled={isLoading}
//             className="w-full px-4 py-3 font-semibold text-white bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 rounded-lg shadow-lg transition duration-300 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center"
//           >
//             {isLoading ? "Signing In..." : "Login"}
//           </motion.button>
//         </form>
//       </motion.div>
//     </div>
//   );
// }


import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const SIGN_IN_API_URL = "https://geoapi.rainmaker.pk/api/auth/sign-in";

const fetchWithRetry = async (url, options, maxRetries = 3) => {
    let response = null;
    for (let i = 0; i < maxRetries; i++) {
        try {
            response = await fetch(url, options);
            if (response.status === 429 && i < maxRetries - 1) {
                const delay = Math.pow(2, i) * 1000;
                await new Promise(resolve => setTimeout(resolve, delay));
                continue; 
            }
            return response;
        } catch (error) {
            if (i < maxRetries - 1) {
                const delay = Math.pow(2, i) * 1000;
                await new Promise(resolve => setTimeout(resolve, delay));
                continue;
            }
            throw new Error(`Login attempt failed after ${maxRetries} retries.`);
        }
    }
    return response;
};

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" }); 
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState(null); 
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setMessage(null); 
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    const payload = {
      email: form.email, 
      password: form.password,
    };

    try {
      const response = await fetchWithRetry(SIGN_IN_API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (response && response.ok) {
        const data = await response.json();

        // Locate the Optix Portal access item configuration block safely
        const optixPortalModule = data?.user_access?.find(
          (access) => access?.name && access.name.toLowerCase().trim() === "optix portal"
        );

        if (!optixPortalModule) {
          localStorage.removeItem("userToken");
          localStorage.removeItem("userAccess");
          localStorage.removeItem("userData");

          setMessage("Access denied. You do not have permission to access Optix Portal.");
          setIsLoading(false);
          return;
        }

        // Commit profile tokens safely to physical browser storage engines
        localStorage.setItem("userToken", data.user.token);
        localStorage.setItem("userAccess", JSON.stringify(data.user_access || []));
        localStorage.setItem("userData", JSON.stringify(data));

        setMessage(data.message || "Logged in successfully!");

        // Dynamic Permissions Routing Engine Placement
        setTimeout(() => {
          const allowedFeatures = optixPortalModule.features 
            ? optixPortalModule.features.split(",").map(f => f.trim().toLowerCase()) 
            : [];

          // 1. If user has access to ALL features/tabs, route to main dashboard
          if (allowedFeatures.includes("all")) {
            navigate("/dashboard");
            return;
          }

          // 2. Map structural matching token definitions cleanly
          if (allowedFeatures.includes("karachi")) {
            navigate("/karachi");
          } else if (allowedFeatures.includes("analytics")) {
            navigate("/nationwide");
          } else if (allowedFeatures.includes("complaints")) {
            navigate("/complaints");
          } else if (allowedFeatures.includes("lahore")) {
            navigate("/lahore");
          } else if (allowedFeatures.includes("rawalpindi")) {
            navigate("/rawalpindi");
          } else if (allowedFeatures.includes("kharian")) {
            navigate("/kharian");
          } else if (allowedFeatures.includes("peshawar")) {
            navigate("/peshawar");
          } else if (allowedFeatures.includes("sialkot")) {
            navigate("/sialkot");
          } else {
            // Safe fallback route back home if explicit custom array values aren't parsed
            navigate("/dashboard");
          }
        }, 500);

      } else {
        let errorText = "Login failed. Please check your email and password.";
        let status = response ? response.status : 'N/A';
        if (response) {
            const errorData = await response.json().catch(() => ({}));
            errorText = errorData.message || errorText;
        }
        console.error(`Login API failed with status ${status}:`, errorText);
        setMessage(errorText);
      }
    } catch (error) {
      console.error("Fatal login error:", error);
      setMessage(error.message || "A critical network error occurred during sign-in.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="relative flex items-center justify-center h-screen overflow-hidden bg-cover bg-center font-sans"
      style={{ backgroundImage: `url('/images/ChatGPT Image Oct 1, 2025, 05_50_57 PM.png')` }}
    >
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 8, repeat: Infinity }}
        className="absolute w-96 h-96 bg-pink-400 rounded-full blur-3xl opacity-40 -top-20 -left-20"
      />
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.5, 0.2] }}
        transition={{ duration: 10, repeat: Infinity }}
        className="absolute w-[28rem] h-[28rem] bg-indigo-500 rounded-full blur-3xl opacity-40 -bottom-32 -right-20"
      />

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 w-full max-w-md p-8 bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20"
      >
        <h1 className="text-4xl font-extrabold text-center text-white drop-shadow-lg">GIS - Optix</h1>
        <p className="mt-2 mb-6 text-center text-gray-200">Welcome back! Please login to continue</p>
        
        {message && (
            <div className={`p-3 mb-4 rounded-lg text-sm text-center font-medium ${message.includes("success") ? "bg-green-600/70 text-white" : "bg-red-600/70 text-white"}`}>
                {message}
            </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <motion.div whileFocus={{ scale: 1.05 }}>
            <input
              type="text"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="email"
              disabled={isLoading}
              className="w-full px-4 py-3 text-white placeholder-gray-300 bg-white/20 border border-white/30 rounded-lg focus:ring-2 focus:ring-pink-400 outline-none backdrop-blur-sm transition duration-300 disabled:opacity-50"
              required
            />
          </motion.div>

          <motion.div whileFocus={{ scale: 1.05 }}>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Password"
              disabled={isLoading}
              className="w-full px-4 py-3 text-white placeholder-gray-300 bg-white/20 border border-white/30 rounded-lg focus:ring-2 focus:ring-pink-400 outline-none backdrop-blur-sm transition duration-300 disabled:opacity-50"
              required
            />
          </motion.div>

          <motion.button
            whileHover={{ scale: isLoading ? 1.0 : 1.05 }}
            whileTap={{ scale: isLoading ? 1.0 : 0.95 }}
            type="submit"
            disabled={isLoading}
            className="w-full px-4 py-3 font-semibold text-white bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 rounded-lg shadow-lg transition duration-300 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {isLoading ? "Signing In..." : "Login"}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
}