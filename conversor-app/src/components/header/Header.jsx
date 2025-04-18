import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css';
import logo from '../../assets/logo.png';

function Header() {
  return (
    <header className="header">
      <div className="header-topo">
        <div className="logo">
          <img src={logo} alt="Logo" className="logo-imagem" />
          <span>CON-VERSOR</span>
        </div>
        <div className="ajuda">
          <a href="#">Ajuda</a>  <a href="#">Dúvidas</a>
        </div>
      </div>
      <nav className="header-menu">
        <Link to="/">Converter</Link>
        <Link to="/moedas">Consultar Moedas</Link>
        <Link to="/grafico">Gráfico de cotação</Link>
        <Link to="/ranking">Moedas mais valorizadas</Link>
      </nav>
    </header>
  );
}

export default Header;
