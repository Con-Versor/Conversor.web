import React, { useState, useEffect } from 'react';
import './ConsultaMoedas.css';

// Mesmo conjunto de moedas usado no conversor
const MOEDAS_DISPONIVEIS = ['BRL', 'USD', 'EUR', 'JPY', 'GBP', 'ARS', 'CAD', 'AUD', 'CHF', 'CNY'];
const API_TOKEN = '4b1941d5f3aefc3b0a148a3a067833cbf3309cdbe62393409eb32a01d17adb47';

function ConsultaMoedas() {
  const [moedaSelecionada, setMoedaSelecionada] = useState('USD');
  const [detalhesMoeda, setDetalhesMoeda] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [resumoMoeda, setResumoMoeda] = useState('');

  useEffect(() => {
    const fetchMoedaInfo = async () => {
      if (!moedaSelecionada) return;
      
      setLoading(true);
      setError(null);

      try {
        // Busca informações para todas as moedas disponíveis em relação à selecionada
        const pares = MOEDAS_DISPONIVEIS
          .filter(moeda => moeda !== moedaSelecionada)
          .map(moeda => `${moedaSelecionada}-${moeda}`)
          .join(',');

        const url = `https://economia.awesomeapi.com.br/json/last/${pares}?token=${API_TOKEN}`;
        const res = await fetch(url);
        
        if (!res.ok) {
          throw new Error(`Erro na API: ${res.status}`);
        }

        const data = await res.json();
        setDetalhesMoeda(data);
        setResumoMoeda(obterResumoMoeda(moedaSelecionada));
      } catch (err) {
        console.error('Erro ao buscar informações:', err);
        setError('Não foi possível obter as cotações. Tente novamente mais tarde.');
      } finally {
        setLoading(false);
      }
    };

    const timeoutId = setTimeout(fetchMoedaInfo, 500);
    return () => clearTimeout(timeoutId);
  }, [moedaSelecionada]);

  const obterResumoMoeda = (moeda) => {
    const resumos = {
      USD: "O Dólar Americano é a moeda oficial dos Estados Unidos e a principal moeda de reserva global.",
      EUR: "O Euro é a moeda oficial da Zona Euro, utilizada por 19 dos 27 países da União Europeia.",
      BRL: "O Real é a moeda corrente no Brasil, emitida pelo Banco Central do Brasil.",
      JPY: "O Iene é a moeda oficial do Japão, terceira maior economia do mundo.",
      GBP: "A Libra Esterlina é a moeda do Reino Unido e a mais antiga ainda em circulação.",
      ARS: "O Peso Argentino é a moeda oficial da Argentina, país da América do Sul.",
      CAD: "O Dólar Canadense é a moeda oficial do Canadá, uma das principais commodities currencies.",
      AUD: "O Dólar Australiano é a moeda oficial da Austrália e ilhas do Pacífico.",
      CHF: "O Franco Suíço é a moeda da Suíça e Liechtenstein, considerada um porto seguro.",
      CNY: "O Yuan Renminbi é a moeda oficial da China, segunda maior economia do mundo."
    };

    return resumos[moeda] || `Informações sobre ${moeda}`;
  };

  const formatarMoeda = (valor, moeda, locale = 'pt-BR') => {
    try {
      return Intl.NumberFormat(locale, { 
        style: 'currency', 
        currency: moeda 
      }).format(valor);
    } catch {
      return `${valor} ${moeda}`;
    }
  };

  const formatarData = (timestamp) => {
    if (!timestamp) return 'N/A';
    return new Date(timestamp).toLocaleString('pt-BR');
  };

  return (
    <div className="consulta-moedas-container">
      <h1 className="titulo">INFORMAÇÕES DE MOEDAS</h1>

      <div className="campo">
        <label>Selecione a moeda base:</label>
        <select
          value={moedaSelecionada}
          onChange={(e) => setMoedaSelecionada(e.target.value)}
          aria-label="Moeda base"
        >
          {MOEDAS_DISPONIVEIS.map((codigo) => (
            <option key={codigo} value={codigo}>
              {codigo} - {new Intl.DisplayNames(['pt'], { type: 'currency' }).of(codigo)}
            </option>
          ))}
        </select>
      </div>

      {loading && <div className="loading">Carregando informações...</div>}
      {error && <div className="erro">{error}</div>}

      {detalhesMoeda && !loading && (
        <div className="detalhes-moeda">
          <div className="card-moeda">
            <h2>
              {moedaSelecionada} - {new Intl.DisplayNames(['pt'], { type: 'currency' }).of(moedaSelecionada)}
            </h2>
            <p className="resumo">{resumoMoeda}</p>
          </div>

          <h3>Cotações Relativas</h3>
          <div className="tabela-cotacoes">
            <div className="cabecalho-tabela">
              <span>Moeda</span>
              <span>Valor</span>
              <span>Variação</span>
              <span>Atualizado em</span>
            </div>
            
            {MOEDAS_DISPONIVEIS.filter(moeda => moeda !== moedaSelecionada).map((moeda) => {
              const key = `${moedaSelecionada}${moeda}`;
              const info = detalhesMoeda[key];
              
              if (!info) return null;

              return (
                <div key={key} className="linha-cotacao">
                  <span className="nome-moeda">
                    {moeda} - {new Intl.DisplayNames(['pt'], { type: 'currency' }).of(moeda)}
                  </span>
                  <span>{formatarMoeda(info.bid, moeda)}</span>
                  <span className={info.pctChange >= 0 ? 'positivo' : 'negativo'}>
                    {info.pctChange}%
                  </span>
                  <span>{formatarData(info.create_date)}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export default ConsultaMoedas;