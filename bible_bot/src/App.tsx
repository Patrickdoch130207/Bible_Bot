import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import ChatPage from "./pages/ChatPage"; // La page unique qu'on va coder ensuite
import { getOrCreateUserId } from "./utils/auth";

const App = () => {
  useEffect(() => {
    // On s'assure que l'UUID est bien généré dès l'ouverture de l'app
    const id = getOrCreateUserId();
    console.log("Session utilisateur active :", id);
  }, []);

  return (
    <BrowserRouter>
      {/* Le MainLayout entoure les routes pour rester persistant */}
      <MainLayout>
        <Routes>
          {/* Route 1 : Accueil / Nouvelle discussion */}
          <Route path="/" element={<ChatPage />} />
          
          {/* Route 2 : Discussion existante avec ID */}
          <Route path="/chat/:conversationId" element={<ChatPage />} />
          
          {/* Optionnel : Redirection si la route n'existe pas */}
          <Route path="*" element={<ChatPage />} />
        </Routes>
      </MainLayout>
    </BrowserRouter>
  );
};

export default App;