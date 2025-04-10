import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header/Header";
import Conversor from "./components/Conversor/Conversor";
import ConsultaMoedas from "./components/ConsultaMoedas/ConsultaMoedas";
import DetalheMoeda from "./components/DetalheMoeda/DetalheMoeda";
import GraficoCotacao from "./components/GraficoCotacao/GraficoCotacao";
import RankingMoedas from "./components/RankingMoedas/RankingMoedas";
import "./index.css";


function App() {
  return (
    <Router>
      <Header />
      <main style={{ padding: "2rem" }}>
        <Routes>
          <Route path="/" element={<Conversor />} />
          <Route path="/moedas" element={<ConsultaMoedas />} />
          <Route path="/moeda/:codigo" element={<DetalheMoeda />} />
          <Route path="/grafico" element={<GraficoCotacao />} />
          <Route path="/ranking" element={<RankingMoedas />} />
        </Routes>
      </main>
    </Router>
  );
}

export default App;
