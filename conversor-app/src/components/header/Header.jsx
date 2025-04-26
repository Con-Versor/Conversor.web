import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Header.css';
import logo from '../../assets/logo.png';

function Header() {
  const [modalConteudo, setModalConteudo] = useState('');
  const [modalAberto, setModalAberto] = useState(false);

  function abrirModal(conteudo) {
    setModalConteudo(conteudo);
    setModalAberto(true);
  }

  function fecharModal() {
    setModalAberto(false);
    setModalConteudo('');
  }

  return (
    <header className="header">
      <div className="header-topo">
        <Link to="/" className="logo-link">
          <div className="logo">
            <img src={logo} alt="Logo" className="logo-imagem" />
            <span>CON-VERSOR</span>
          </div>
        </Link>

        <div className="ajuda">
          <button onClick={() => abrirModal('Você é fera, não precisa de ajuda!')}>
            Ajuda
          </button>
          <button onClick={() => abrirModal('Vai por mim, você não tem dúvidas!')}>
            Dúvidas
          </button>
        </div>
      </div>

      <nav className="header-menu">
        <Link to="/">Converter</Link>
        <Link to="/moedas">Consultar Moedas</Link>
        <Link to="/grafico">Gráfico de cotação</Link>
        <Link to="/ranking">Moedas mais negociadas</Link>
      </nav>

      {modalAberto && (
        <div className="modal-overlay" onClick={fecharModal}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <button className="fechar" onClick={fecharModal}>X</button>
            <p>{modalConteudo}</p>
          </div>
        </div>
      )}
    </header>
  );
}

export default Header;
