import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

export default defineConfig({
  server: {
    host: "::",     
    port: 8080,  
     proxy: {
      '/api': {
        target: 'http://localhost:3000', // port where Express is running
        changeOrigin: true,              // needed for virtual hosts & CORS
        secure: false,                   // allow self-signed HTTPS in dev
      },
    },
  },
   
  plugins: [react()],  
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"), 
    },
  },
});
