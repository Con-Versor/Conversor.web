import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/header/Header";
import Conversor from "./components/conversor/Conversor";
import ConsultaMoedas from "./components/consultaMoedas/ConsultaMoedas";
import DetalheMoeda from "./components/detalheMoeda/DetalheMoeda";
import GraficoCotacao from "./components/graficoCotacao/GraficoCotacao";
import RankingMoedas from "./components/rankingMoedas/RankingMoedas";
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
