import React, { useEffect, useState } from 'react';
import './RankingMoedas.css';

const TOP_MOEDAS = [
  { code: 'USD', name: 'Dólar Americano', symbol: 'US$' },
  { code: 'EUR', name: 'Euro', symbol: '€' },
  { code: 'ARS', name: 'Peso Argentino', symbol: 'AR$' },
  { code: 'GBP', name: 'Libra Esterlina', symbol: '£' },
  { code: 'CAD', name: 'Dólar Canadense', symbol: 'C$' },
  { code: 'PYG', name: 'Guarani Paraguaio', symbol: '₲' },
  { code: 'CLP', name: 'Peso Chileno', symbol: 'CLP$' },
  { code: 'AUD', name: 'Dólar Australiano', symbol: 'A$' },
  { code: 'JPY', name: 'Iene Japonês', symbol: '¥' },
  { code: 'COP', name: 'Peso Colombiano', symbol: 'COL$' }
];

const API_TOKEN = '4b1941d5f3aefc3b0a148a3a067833cbf3309cdbe62393409eb32a01d17adb47';

function RankingMoedas() {
  const [cotacoes, setCotacoes] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState('');

  useEffect(() => {
    const fetchCotacoes = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const pares = TOP_MOEDAS
          .map(moeda => `${moeda.code}-BRL`)
          .join(',');

        const response = await fetch(
          `https://economia.awesomeapi.com.br/json/last/${pares}?token=${API_TOKEN}`
        );
        
        if (!response.ok) {
          throw new Error(`Erro na API: ${response.status}`);
        }

        const data = await response.json();
        setCotacoes(data);
        
        if (data[`${TOP_MOEDAS[0].code}BRL`]?.create_date) {
          setLastUpdated(new Date(data[`${TOP_MOEDAS[0].code}BRL`].create_date).toLocaleString('pt-BR'));
        }
      } catch (err) {
        console.error('Erro ao carregar cotações:', err);
        setError('Não foi possível carregar as cotações. Tente novamente mais tarde.');
      } finally {
        setLoading(false);
      }
    };

    fetchCotacoes();
    
    const interval = setInterval(fetchCotacoes, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  return (
    <div className="ranking-container">
      <header className="ranking-header">
        <h1 className="ranking-title">Moedas mais comercializadas Vs Real Brasileiro</h1>
        {lastUpdated && (
          <p className="ranking-update">Atualizado em: {lastUpdated}</p>
        )}
      </header>

      {loading ? (
        <div className="ranking-loading">
          <div className="loading-spinner"></div>
          <p>Carregando cotações...</p>
        </div>
      ) : error ? (
        <div className="ranking-error">
          <p>{error}</p>
          <button 
            className="ranking-retry"
            onClick={() => window.location.reload()}
          >
            Tentar novamente
          </button>
        </div>
      ) : (
        <div className="ranking-content">
          <table className="ranking-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Moeda</th>
                <th>Valor (BRL)</th>
                <th>Variação (24h)</th>
              </tr>
            </thead>
            <tbody>
              {TOP_MOEDAS.map((moeda, index) => {
                const cotacao = cotacoes[`${moeda.code}BRL`];
                const valor = cotacao ? parseFloat(cotacao.ask) : 0;
                const variacao = cotacao ? parseFloat(cotacao.pctChange) : 0;
                
                return (
                  <tr key={moeda.code} className="ranking-item">
                    <td className="ranking-position">{index + 1}</td>
                    <td className="ranking-currency">
                      <span className="currency-symbol">{moeda.symbol}</span>
                      <span className="currency-name">{moeda.name}</span>
                    </td>
                    <td className="ranking-value">
                      {cotacao ? formatCurrency(valor) : 'N/A'}
                    </td>
                    <td className={`ranking-change ${variacao >= 0 ? 'positive' : 'negative'}`}>
                      {cotacao ? (
                        <>
                          {variacao >= 0 ? '↑' : '↓'} {Math.abs(variacao).toFixed(2)}%
                        </>
                      ) : 'N/A'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          
          <div className="ranking-info">
            <p>Variação indica a mudança no valor da moeda em relação ao Real nas últimas 24 horas</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default RankingMoedas;