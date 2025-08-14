import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/header/Header";
import Conversor from "./components/conversor/Conversor";
import ConsultaMoedas from "./components/consultaMoedas/ConsultaMoedas";
import GraficoCotacao from "./components/graficoCotacao/GraficoCotacao";
import RankingMoedas from "./components/rankingMoedas/RankingMoedas";
import "./index.css";

function App() {
  return (
    <Router>
      <div className="app">
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<Conversor />} />
            <Route path="/moedas" element={<ConsultaMoedas />} />
            <Route path="/grafico" element={<GraficoCotacao />} />
            <Route path="/ranking" element={<RankingMoedas />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
