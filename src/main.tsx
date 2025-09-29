import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import RoutesAPP from "./routes/index.tsx";
import { AuthProvider } from "./contexts/AuthContext.tsx";
import "./index.css";
import { registerSW } from 'virtual:pwa-register';


registerSW({
  onNeedRefresh() {
  },
  onOfflineReady() {
  },
});

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <AuthProvider>
            <RoutesAPP />
        </AuthProvider>
    </StrictMode>
);
