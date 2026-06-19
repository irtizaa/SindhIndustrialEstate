// // vite.config.js

// import { defineConfig, loadEnv } from 'vite'; // 🛑 Make sure both are imported
// import react from '@vitejs/plugin-react';

// export default defineConfig(({ mode }) => {
//     const env = loadEnv(mode, process.cwd(), '');

//     return {
//         plugins: [react()],
//         server: {
//             proxy: {
//                 // This is the key that starts the proxy object
//                 '/data': { 
//                     target: env.VITE_GIS_API_BASE_URL,
//                     changeOrigin: true,
//                     // The rewrite property must be correctly assigned a function
//                     rewrite: (path) => { 
//                         // The logic provided in the previous step
//                         if (path === '/data/e1') return '/r_handhole';
//                         if (path === '/data/e2') return '/r_joints';
//                         if (path === '/data/e3') return '/r_nodes';
//                         if (path === '/data/e4') return '/r_metroFiber';
//                         if (path === '/data/e5') return '/r_customers';
                        
//                         return path.replace(/^\/data/, '');
//                     },
//                 },
//                 // If you had another proxy block, it would go here, separated by a comma
//             },
//         },
//     };
// });


// vite.config.js

import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, process.cwd(), '');

    return {
        plugins: [react()],
        server: {
            watch: {
                usePolling: true,
                interval: 100,
            },
            proxy: {
                '/data': {
                    target: env.VITE_GIS_API_BASE_URL,
                    changeOrigin: true,
                    rewrite: (path) => {
                        if (path === '/data/e1') return '/r_handhole';
                        if (path === '/data/e2') return '/r_joints';
                        if (path === '/data/e3') return '/r_nodes';
                        if (path === '/data/e4') return '/r_metroFiber';
                        if (path === '/data/e5') return '/r_customers';

                        return path.replace(/^\/data/, '');
                    },
                },
            },
        },
    };
});