import React, { useEffect, useState, useCallback } from 'react';
import { Line } from 'react-chartjs-2';
import { 
  ChartBarIcon,
  ArrowPathIcon,
  CalendarIcon,
  CurrencyDollarIcon 
} from '@heroicons/react/24/outline';
import './GraficoCotacao.css'; 
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, 
  Title, 
  Tooltip, 
  Legend,
  Filler
} from 'chart.js';

ChartJS.register(
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, 
  Title, 
  Tooltip, 
  Legend,
  Filler
);

const MOEDAS_DISPONIVEIS = [
  { code: 'BRL', name: 'Real Brasileiro', flag: '🇧🇷' },
  { code: 'USD', name: 'Dólar Americano', flag: '🇺🇸' },
  { code: 'EUR', name: 'Euro', flag: '🇪🇺' },
  { code: 'GBP', name: 'Libra Esterlina', flag: '🇬🇧' },
  { code: 'JPY', name: 'Iene Japonês', flag: '🇯🇵' },
  { code: 'ARS', name: 'Peso Argentino', flag: '🇦🇷' },
  { code: 'CAD', name: 'Dólar Canadense', flag: '🇨🇦' },
  { code: 'AUD', name: 'Dólar Australiano', flag: '🇦🇺' },
  { code: 'CHF', name: 'Franco Suíço', flag: '🇨🇭' },
  { code: 'CNY', name: 'Yuan Chinês', flag: '🇨🇳' }
];

const PERIODOS = [
  { value: '7', label: '7 dias', description: 'Última semana' },
  { value: '15', label: '15 dias', description: 'Últimas 2 semanas' },
  { value: '30', label: '30 dias', description: 'Último mês' },
  { value: '90', label: '90 dias', description: 'Últimos 3 meses' },
  { value: '180', label: '180 dias', description: 'Últimos 6 meses' }
];

const API_TOKEN = '4b1941d5f3aefc3b0a148a3a067833cbf3309cdbe62393409eb32a01d17adb47';

function GraficoCotacao() {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: []
  });
  const [moedaOrigem, setMoedaOrigem] = useState('BRL');
  const [moedaDestino, setMoedaDestino] = useState('USD');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [periodo, setPeriodo] = useState('15');
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);

  const getChartColors = () => {
    const colors = [
      { border: '#3b82f6', background: 'rgba(59, 130, 246, 0.1)' },
      { border: '#ef4444', background: 'rgba(239, 68, 68, 0.1)' },
      { border: '#10b981', background: 'rgba(16, 185, 129, 0.1)' },
      { border: '#f59e0b', background: 'rgba(245, 158, 11, 0.1)' },
      { border: '#8b5cf6', background: 'rgba(139, 92, 246, 0.1)' }
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  const fetchHistoricalData = useCallback(async (isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }
    setError(null);
    
    try {
      if (moedaOrigem === moedaDestino) {
        throw new Error('Selecione moedas diferentes para comparação');
      }

      const response = await fetch(
        `https://economia.awesomeapi.com.br/json/daily/${moedaOrigem}-${moedaDestino}/${periodo}?token=${API_TOKEN}`
      );
      
      if (!response.ok) {
        throw new Error(`Erro na API: Status ${response.status}`);
      }
      
      const data = await response.json();

      if (!Array.isArray(data) || data.length === 0) {
        throw new Error('Nenhum dado disponível para o período selecionado');
      }

      const processedData = data
        .map(item => ({
          date: new Date(parseInt(item.timestamp) * 1000),
          value: parseFloat(item.bid)
        }))
        .sort((a, b) => a.date - b.date);

      const labels = processedData.map(item => 
        item.date.toLocaleDateString('pt-BR', { 
          day: '2-digit', 
          month: '2-digit',
          year: processedData.length > 30 ? '2-digit' : undefined
        })
      );
      
      const colors = getChartColors();
      
      setChartData({
        labels,
        datasets: [{
          label: `1 ${moedaOrigem} = ${moedaDestino}`,
          data: processedData.map(item => item.value),
          borderColor: colors.border,
          backgroundColor: colors.background,
          borderWidth: 3,
          tension: 0.4,
          fill: true,
          pointBackgroundColor: colors.border,
          pointBorderColor: '#ffffff',
          pointBorderWidth: 2,
          pointRadius: 4,
          pointHoverRadius: 8,
          pointHoverBorderWidth: 3
        }]
      });
      
      setLastUpdated(new Date());
      
    } catch (err) {
      console.error('Erro ao buscar dados:', err);
      setError(err.message);
      setChartData({
        labels: [],
        datasets: []
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [moedaOrigem, moedaDestino, periodo]);

  useEffect(() => {
    fetchHistoricalData();
  }, [fetchHistoricalData]);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index',
      intersect: false,
    },
    plugins: {
      legend: {
        position: 'top',
        align: 'center',
        labels: {
          font: {
            size: 14,
            weight: '600'
          },
          color: '#111827', // Cor mais escura para melhor contraste
          usePointStyle: true,
          pointStyle: 'circle',
          padding: 20
        }
      },
      tooltip: {
        backgroundColor: '#1f2937',
        titleColor: '#f9fafb',
        bodyColor: '#f9fafb',
        borderColor: '#374151',
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: true,
        callbacks: {
          label: (context) => {
            const value = context.parsed.y.toFixed(6);
            return `${context.dataset.label}: ${value}`;
          }
        },
        titleFont: {
          size: 14,
          weight: '600'
        },
        bodyFont: {
          size: 13
        }
      }
    },
    scales: {
      y: {
        beginAtZero: false,
        grace: '5%',
        ticks: {
          callback: (value) => {
            return new Intl.NumberFormat('pt-BR', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 6
            }).format(value);
          },
          font: {
            size: 12
          },
          color: '#374151' // Cor mais escura para melhor legibilidade
        },
        grid: {
          color: '#e5e7eb', // Cor mais escura para as linhas de grade
          drawBorder: false,
        },
        border: {
          display: false
        },
        title: {
          display: true,
          text: 'Cotação',
          color: '#111827',
          font: {
            size: 14,
            weight: '600'
          }
        }
      },
      x: {
        grid: {
          display: false
        },
        ticks: {
          font: {
            size: 12
          },
          color: '#374151', // Cor mais escura para melhor legibilidade
          maxTicksLimit: 10
        },
        border: {
          display: false
        },
        title: {
          display: true,
          text: 'Data',
          color: '#111827',
          font: {
            size: 14,
            weight: '600'
          }
        }
      }
    },
    elements: {
      point: {
        hoverBackgroundColor: '#ffffff'
      }
    }
  };

  const handleRefresh = () => {
    fetchHistoricalData(true);
  };

  const swapCurrencies = () => {
    setMoedaOrigem(moedaDestino);
    setMoedaDestino(moedaOrigem);
  };

  const getMoedaInfo = (code) => {
    return MOEDAS_DISPONIVEIS.find(m => m.code === code);
  };

  const getPeriodoInfo = (value) => {
    return PERIODOS.find(p => p.value === value);
  };

  return (
    <div className="grafico-page">
      <div className="grafico-container">
        <div className="grafico-header">
          <div className="header-icon">
            <ChartBarIcon className="icon" />
          </div>
          <h1 className="grafico-title">Gráficos de Cotação</h1>
          <p className="grafico-subtitle">
            Visualize o histórico de variação das cotações entre diferentes moedas
          </p>
        </div>
        
        <div className="grafico-controls-card">
          <div className="controls-grid">
            <div className="control-group">
              <label className="control-label">
                <CurrencyDollarIcon className="label-icon" />
                Moeda de origem:
              </label>
              <select 
                value={moedaOrigem}
                onChange={(e) => setMoedaOrigem(e.target.value)}
                disabled={loading}
                className="control-select"
              >
                {MOEDAS_DISPONIVEIS.map(moeda => (
                  <option key={`from-${moeda.code}`} value={moeda.code}>
                    {moeda.flag} {moeda.code} - {moeda.name}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="swap-controls">
              <button
                onClick={swapCurrencies}
                disabled={loading}
                className="swap-button"
                title="Trocar moedas"
              >
                <ArrowPathIcon className="swap-icon" />
              </button>
            </div>
            
            <div className="control-group">
              <label className="control-label">
                <CurrencyDollarIcon className="label-icon" />
                Moeda de destino:
              </label>
              <select 
                value={moedaDestino}
                onChange={(e) => setMoedaDestino(e.target.value)}
                disabled={loading}
                className="control-select"
              >
                {MOEDAS_DISPONIVEIS.map(moeda => (
                  <option key={`to-${moeda.code}`} value={moeda.code}>
                    {moeda.flag} {moeda.code} - {moeda.name}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="control-group">
              <label className="control-label">
                <CalendarIcon className="label-icon" />
                Período:
              </label>
              <select 
                value={periodo}
                onChange={(e) => setPeriodo(e.target.value)}
                disabled={loading}
                className="control-select"
              >
                {PERIODOS.map(periodo => (
                  <option key={periodo.value} value={periodo.value}>
                    {periodo.label} - {periodo.description}
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="controls-footer">
            <div className="current-selection">
              <span className="selection-text">
                {getMoedaInfo(moedaOrigem)?.flag} {moedaOrigem} → {getMoedaInfo(moedaDestino)?.flag} {moedaDestino}
                <span className="period-info">({getPeriodoInfo(periodo)?.description})</span>
              </span>
            </div>
            <button 
              onClick={handleRefresh}
              disabled={loading || refreshing}
              className={`refresh-btn ${refreshing ? 'refreshing' : ''}`}
            >
              <ArrowPathIcon className="refresh-icon" />
              {refreshing ? 'Atualizando...' : 'Atualizar'}
            </button>
          </div>
        </div>
        
        <div className="chart-section">
          {error ? (
            <div className="chart-error">
              <div className="error-icon">⚠️</div>
              <h3>Oops! Algo deu errado</h3>
              <p>{error}</p>
              <button 
                onClick={() => fetchHistoricalData()}
                disabled={loading}
                className="retry-button"
              >
                {loading ? 'Carregando...' : 'Tentar novamente'}
              </button>
            </div>
          ) : loading ? (
            <div className="chart-loading">
              <div className="loading-spinner"></div>
              <h3>Carregando dados históricos...</h3>
              <p>Buscando cotações do período selecionado</p>
            </div>
          ) : (
            <>
              <div className="chart-header">
                <h3 className="chart-title">
                  Histórico: {getMoedaInfo(moedaOrigem)?.name} → {getMoedaInfo(moedaDestino)?.name}
                </h3>
                {lastUpdated && (
                  <div className="chart-updated">
                    Atualizado em: {lastUpdated.toLocaleString('pt-BR')}
                  </div>
                )}
              </div>
              <div className="chart-wrapper">
                <Line data={chartData} options={chartOptions} />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default GraficoCotacao;