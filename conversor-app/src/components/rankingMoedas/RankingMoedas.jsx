import React, { useEffect, useState } from 'react';
import { 
  TrophyIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  ClockIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';
import './RankingMoedas.css';

const TOP_MOEDAS = [
  { code: 'USD', name: 'Dólar Americano', flag: '🇺🇸', symbol: '$' },
  { code: 'EUR', name: 'Euro', flag: '🇪🇺', symbol: '€' },
  { code: 'ARS', name: 'Peso Argentino', flag: '🇦🇷', symbol: '$' },
  { code: 'GBP', name: 'Libra Esterlina', flag: '🇬🇧', symbol: '£' },
  { code: 'CAD', name: 'Dólar Canadense', flag: '🇨🇦', symbol: 'C$' },
  { code: 'PYG', name: 'Guarani Paraguaio', flag: '🇵🇾', symbol: '₲' },
  { code: 'CLP', name: 'Peso Chileno', flag: '🇨🇱', symbol: '$' },
  { code: 'AUD', name: 'Dólar Australiano', flag: '🇦🇺', symbol: 'A$' },
  { code: 'JPY', name: 'Iene Japonês', flag: '🇯🇵', symbol: '¥' },
  { code: 'COP', name: 'Peso Colombiano', flag: '🇨🇴', symbol: '$' }
];

const API_TOKEN = '4b1941d5f3aefc3b0a148a3a067833cbf3309cdbe62393409eb32a01d17adb47';

function RankingMoedas() {
  const [cotacoes, setCotacoes] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState('');
  const [sortBy, setSortBy] = useState('variation');
  const [refreshing, setRefreshing] = useState(false);

  const fetchCotacoes = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
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
      setError('Não foi possível carregar as cotações. Tente novamente.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchCotacoes();
    
    const interval = setInterval(() => fetchCotacoes(true), 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const getRankingPosition = (index, variation) => {
    if (index === 0) return '🥇';
    if (index === 1) return '🥈';
    if (index === 2) return '🥉';
    return index + 1;
  };

  const getSortedMoedas = () => {
    let sortedMoedas = [...TOP_MOEDAS];
    
    if (sortBy === 'variation') {
      sortedMoedas.sort((a, b) => {
        const cotacaoA = cotacoes[`${a.code}BRL`];
        const cotacaoB = cotacoes[`${b.code}BRL`];
        const variacaoA = cotacaoA ? parseFloat(cotacaoA.pctChange) : 0;
        const variacaoB = cotacaoB ? parseFloat(cotacaoB.pctChange) : 0;
        return Math.abs(variacaoB) - Math.abs(variacaoA);
      });
    } else if (sortBy === 'value') {
      sortedMoedas.sort((a, b) => {
        const cotacaoA = cotacoes[`${a.code}BRL`];
        const cotacaoB = cotacoes[`${b.code}BRL`];
        const valorA = cotacaoA ? parseFloat(cotacaoA.ask) : 0;
        const valorB = cotacaoB ? parseFloat(cotacaoB.ask) : 0;
        return valorB - valorA;
      });
    }
    
    return sortedMoedas;
  };

  const handleRefresh = () => {
    fetchCotacoes(true);
  };

  return (
    <div className="ranking-page">
      <div className="ranking-container">
        <div className="ranking-header">
          <div className="header-icon">
            <TrophyIcon className="icon" />
          </div>
          <h1 className="ranking-title">Ranking de Moedas</h1>
          <p className="ranking-subtitle">
            Acompanhe as moedas mais negociadas contra o Real Brasileiro
          </p>
          
          {lastUpdated && (
            <div className="last-updated">
              <ClockIcon className="clock-icon" />
              <span>Atualizado em: {lastUpdated}</span>
              <button 
                className={`refresh-button ${refreshing ? 'refreshing' : ''}`}
                onClick={handleRefresh}
                disabled={refreshing}
                aria-label="Atualizar cotações"
              >
                <ArrowPathIcon className="refresh-icon" />
                {refreshing ? 'Atualizando...' : 'Atualizar'}
              </button>
            </div>
          )}
        </div>

        <div className="ranking-controls">
          <label className="sort-label">Ordenar por:</label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="sort-select"
          >
            <option value="variation">Maior Variação</option>
            <option value="value">Maior Valor</option>
            <option value="default">Ordem Padrão</option>
          </select>
        </div>

        {loading && !refreshing && (
          <div className="ranking-loading">
            <div className="loading-spinner"></div>
            <p>Carregando cotações...</p>
          </div>
        )}

        {error && (
          <div className="ranking-error">
            <p>{error}</p>
            <button 
              className="retry-button"
              onClick={() => fetchCotacoes()}
            >
              Tentar novamente
            </button>
          </div>
        )}

        {!loading && !error && (
          <div className="ranking-content">
            <div className="ranking-grid">
              {getSortedMoedas().map((moeda, index) => {
                const cotacao = cotacoes[`${moeda.code}BRL`];
                const valor = cotacao ? parseFloat(cotacao.ask) : 0;
                const variacao = cotacao ? parseFloat(cotacao.pctChange) : 0;
                
                return (
                  <div key={moeda.code} className={`ranking-card ${index < 3 ? 'podium' : ''}`}>
                    <div className="ranking-position">
                      <span className="position-badge">
                        {getRankingPosition(index, variacao)}
                      </span>
                    </div>
                    
                    <div className="currency-header">
                      <div className="currency-flag">{moeda.flag}</div>
                      <div className="currency-info">
                        <span className="currency-code">{moeda.code}</span>
                        <span className="currency-name">{moeda.name}</span>
                      </div>
                    </div>
                    
                    <div className="currency-value">
                      <span className="value-label">1 {moeda.code} =</span>
                      <span className="value-amount">
                        {cotacao ? formatCurrency(valor) : 'N/A'}
                      </span>
                    </div>
                    
                    <div className="currency-variation">
                      <div className={`variation-badge ${variacao >= 0 ? 'positive' : 'negative'}`}>
                        {variacao >= 0 ? (
                          <ArrowTrendingUpIcon className="variation-icon" />
                        ) : (
                          <ArrowTrendingDownIcon className="variation-icon" />
                        )}
                        <span className="variation-value">
                          {cotacao ? `${Math.abs(variacao).toFixed(2)}%` : 'N/A'}
                        </span>
                      </div>
                    </div>
                    
                    {index < 3 && (
                      <div className="podium-highlight"></div>
                    )}
                  </div>
                );
              })}
            </div>
            
            <div className="ranking-info">
              <div className="info-card">
                <h3>📊 Como interpretar o ranking</h3>
                <ul>
                  <li><strong>Variação (24h):</strong> Mudança percentual nas últimas 24 horas</li>
                  <li><strong>🥇🥈🥉:</strong> Top 3 posições baseadas no critério selecionado</li>
                  <li><strong>Valor:</strong> Cotação atual da moeda em relação ao Real</li>
                  <li><strong>Atualização:</strong> Dados atualizados automaticamente a cada 5 minutos</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default RankingMoedas;