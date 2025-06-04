import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { SidebarProvider} from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <SidebarProvider>
      <AppSidebar />
      <App />
    </SidebarProvider>
  </StrictMode>
);
