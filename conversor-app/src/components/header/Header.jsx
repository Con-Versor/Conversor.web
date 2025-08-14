import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Bars3Icon, 
  XMarkIcon, 
  CurrencyDollarIcon,
  ChartBarIcon,
  InformationCircleIcon,
  TrophyIcon,
  QuestionMarkCircleIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import './Header.css';
import logo from '../../assets/logo.png';

function Header() {
  const [modalConteudo, setModalConteudo] = useState('');
  const [modalAberto, setModalAberto] = useState(false);
  const [menuMobileAberto, setMenuMobileAberto] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  const menuItems = [
    { path: '/', label: 'Converter', icon: CurrencyDollarIcon },
    { path: '/moedas', label: 'Consultar Moedas', icon: InformationCircleIcon },
    { path: '/grafico', label: 'Gráficos', icon: ChartBarIcon },
    { path: '/ranking', label: 'Ranking', icon: TrophyIcon }
  ];

  const helpContent = {
    ajuda: {
      title: 'Como usar o Conversor',
      content: `
        <div class="help-content">
          <h3>🔄 Converter Moedas</h3>
          <p>Digite um valor, selecione as moedas de origem e destino, e veja a conversão em tempo real!</p>
          
          <h3>📊 Consultar Moedas</h3>
          <p>Explore informações detalhadas sobre diferentes moedas e suas cotações.</p>
          
          <h3>📈 Gráficos</h3>
          <p>Visualize o histórico de cotações com gráficos interativos de diferentes períodos.</p>
          
          <h3>🏆 Ranking</h3>
          <p>Veja as moedas mais negociadas e suas variações em tempo real.</p>
        </div>
      `
    },
    duvidas: {
      title: 'Perguntas Frequentes',
      content: `
        <div class="help-content">
          <h3>❓ As cotações são em tempo real?</h3>
          <p>Sim! Utilizamos APIs confiáveis para fornecer cotações atualizadas.</p>
          
          <h3>❓ Quais moedas estão disponíveis?</h3>
          <p>Oferecemos as principais moedas globais: USD, EUR, BRL, JPY, GBP, ARS, CAD, AUD, CHF, CNY.</p>
          
          <h3>❓ Como funcionam os gráficos?</h3>
          <p>Os gráficos mostram histórico de variação das cotações em diferentes períodos.</p>
          
          <h3>❓ O site é seguro?</h3>
          <p>Sim! Utilizamos apenas APIs públicas e não coletamos dados pessoais.</p>
        </div>
      `
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMenuMobileAberto(false);
  }, [location]);

  function abrirModal(tipo) {
    setModalConteudo(helpContent[tipo]);
    setModalAberto(true);
  }

  function fecharModal() {
    setModalAberto(false);
    setModalConteudo('');
  }

  function toggleMenuMobile() {
    setMenuMobileAberto(!menuMobileAberto);
  }

  return (
    <>
      <header className={`header ${scrolled ? 'scrolled' : ''}`}>
        <div className="header-container">
          <div className="header-content">
            <Link to="/" className="logo-link">
              <div className="logo">
                <img src={logo} alt="Con-Versor Logo" className="logo-imagem" />
                <span className="logo-text">CON-VERSOR</span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="desktop-nav">
              {menuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`nav-link ${location.pathname === item.path ? 'active' : ''}`}
                  >
                    <Icon className="nav-icon" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>

            {/* Desktop Help Buttons */}
            <div className="help-buttons desktop-help">
              <button 
                onClick={() => abrirModal('ajuda')}
                className="help-btn"
                aria-label="Ajuda"
              >
                <QuestionMarkCircleIcon className="help-icon" />
                <span>Ajuda</span>
              </button>
              <button 
                onClick={() => abrirModal('duvidas')}
                className="help-btn"
                aria-label="Dúvidas"
              >
                <ExclamationTriangleIcon className="help-icon" />
                <span>FAQ</span>
              </button>
            </div>

            {/* Mobile Menu Toggle */}
            <button 
              className="mobile-menu-toggle"
              onClick={toggleMenuMobile}
              aria-label={menuMobileAberto ? 'Fechar menu' : 'Abrir menu'}
            >
              {menuMobileAberto ? (
                <XMarkIcon className="menu-icon" />
              ) : (
                <Bars3Icon className="menu-icon" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className={`mobile-nav ${menuMobileAberto ? 'open' : ''}`}>
          <div className="mobile-nav-content">
            <nav className="mobile-navigation">
              {menuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`mobile-nav-link ${location.pathname === item.path ? 'active' : ''}`}
                  >
                    <Icon className="mobile-nav-icon" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>
            
            <div className="mobile-help">
              <button 
                onClick={() => abrirModal('ajuda')}
                className="mobile-help-btn"
              >
                <QuestionMarkCircleIcon className="help-icon" />
                <span>Ajuda</span>
              </button>
              <button 
                onClick={() => abrirModal('duvidas')}
                className="mobile-help-btn"
              >
                <ExclamationTriangleIcon className="help-icon" />
                <span>Perguntas Frequentes</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Modal */}
      {modalAberto && (
        <div className="modal-overlay" onClick={fecharModal}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">{modalConteudo.title}</h2>
              <button 
                className="modal-close" 
                onClick={fecharModal}
                aria-label="Fechar modal"
              >
                <XMarkIcon className="close-icon" />
              </button>
            </div>
            <div 
              className="modal-body"
              dangerouslySetInnerHTML={{ __html: modalConteudo.content }}
            />
          </div>
        </div>
      )}

      {/* Overlay para menu mobile */}
      {menuMobileAberto && (
        <div 
          className="mobile-overlay" 
          onClick={() => setMenuMobileAberto(false)}
        />
      )}
    </>
  );
}

export default Header;
