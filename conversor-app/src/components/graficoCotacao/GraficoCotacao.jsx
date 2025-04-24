import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
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
  { code: 'BRL', name: 'Real Brasileiro' },
  { code: 'USD', name: 'Dólar Americano' },
  { code: 'EUR', name: 'Euro' },
  { code: 'GBP', name: 'Libra Esterlina' },
  { code: 'JPY', name: 'Iene Japonês' },
  { code: 'ARS', name: 'Peso Argentino' },
  { code: 'CAD', name: 'Dólar Canadense' },
  { code: 'AUD', name: 'Dólar Australiano' },
  { code: 'CHF', name: 'Franco Suíço' },
  { code: 'CNY', name: 'Yuan Chinês' }
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
  const [periodo, setPeriodo] = useState('7');

  const fetchHistoricalData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      if (moedaOrigem === moedaDestino) {
        throw new Error('Selecione moedas diferentes para comparação');
      }

      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(endDate.getDate() - parseInt(periodo));


      const formatDate = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}${month}${day}`;
      };

      const response = await fetch(
        `https://economia.awesomeapi.com.br/json/daily/${moedaOrigem}-${moedaDestino}` +
        `?start_date=${formatDate(startDate)}&end_date=${formatDate(endDate)}` +
        `&token=${API_TOKEN}`
      );
      
      if (!response.ok) {
        throw new Error('Erro ao carregar dados históricos');
      }
      
      const data = await response.json();

      if (!Array.isArray(data) || data.length === 0) {
        throw new Error('Dados não disponíveis para o período selecionado');
      }

      const processedData = data
        .map(item => ({
          date: new Date(Number(item.timestamp) * 1000),
          value: parseFloat(item.bid)
        }))
        .sort((a, b) => a.date - b.date);

      const labels = processedData.map(item => 
        item.date.toLocaleDateString('pt-BR', { 
          day: '2-digit', 
          month: '2-digit' 
        })
      );
      
      const values = processedData.map(item => item.value);
      
      setChartData({
        labels,
        datasets: [{
          label: `1 ${moedaOrigem} = ${moedaDestino}`,
          data: values,
          borderColor: '#4bc0c0',
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          borderWidth: 2,
          tension: 0.4,
          fill: true,
          pointBackgroundColor: '#4bc0c0',
          pointBorderColor: '#fff',
          pointRadius: 4,
          pointHoverRadius: 6,
          pointHitRadius: 10
        }]
      });
      
    } catch (err) {
      console.error('Erro ao buscar dados:', err);
      setError(err.message || 'Não foi possível carregar os dados. Tente novamente.');
      setChartData({
        labels: [],
        datasets: []
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistoricalData();
  }, [moedaOrigem, moedaDestino, periodo]);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          font: {
            size: 14
          }
        }
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            return ` ${context.dataset.label}: ${context.parsed.y.toFixed(4)}`;
          }
        },
        displayColors: true,
        backgroundColor: '#2c3e50',
        titleFont: {
          size: 14
        },
        bodyFont: {
          size: 12
        }
      }
    },
    scales: {
      y: {
        beginAtZero: false,
        ticks: {
          callback: (value) => {
            return new Intl.NumberFormat('pt-BR', {
              style: 'currency',
              currency: moedaDestino,
              minimumFractionDigits: 4,
              maximumFractionDigits: 4
            }).format(value);
          },
          font: {
            size: 12
          }
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.05)'
        }
      },
      x: {
        grid: {
          display: false
        },
        ticks: {
          font: {
            size: 12
          }
        }
      }
    },
    elements: {
      line: {
        tension: 0.4
      }
    }
  };

  const handleRetry = () => {
    fetchHistoricalData();
  };

  return (
    <div className="grafico-container">
      <div className="grafico-header">
        <h2 className="grafico-titulo">Histórico de Cotações</h2>
        
        <div className="grafico-controls">
          <div className="grafico-select-group">
            <label>De:</label>
            <select 
              value={moedaOrigem}
              onChange={(e) => setMoedaOrigem(e.target.value)}
              className="grafico-select"
              disabled={loading}
            >
              {MOEDAS_DISPONIVEIS.map(moeda => (
                <option key={`from-${moeda.code}`} value={moeda.code}>
                  {moeda.code} - {moeda.name}
                </option>
              ))}
            </select>
          </div>
          
          <div className="grafico-select-group">
            <label>Para:</label>
            <select 
              value={moedaDestino}
              onChange={(e) => setMoedaDestino(e.target.value)}
              className="grafico-select"
              disabled={loading}
            >
              {MOEDAS_DISPONIVEIS.map(moeda => (
                <option key={`to-${moeda.code}`} value={moeda.code}>
                  {moeda.code} - {moeda.name}
                </option>
              ))}
            </select>
          </div>
          
          <div className="grafico-select-group">
            <label>Período:</label>
            <select 
              value={periodo}
              onChange={(e) => setPeriodo(e.target.value)}
              className="grafico-select"
              disabled={loading}
            >
              <option value="7">7 dias</option>
              <option value="15">15 dias</option>
              <option value="30">30 dias</option>
              <option value="90">3 meses</option>
              <option value="180">6 meses</option>
            </select>
          </div>
        </div>
      </div>
      
      {error ? (
        <div className="grafico-error">
          <p>{error}</p>
          <button 
            className="grafico-retry"
            onClick={handleRetry}
            disabled={loading}
          >
            {loading ? 'Carregando...' : 'Tentar novamente'}
          </button>
        </div>
      ) : loading ? (
        <div className="grafico-loading">
          <div className="loading-spinner"></div>
          <p>Carregando dados...</p>
        </div>
      ) : (
        <div className="grafico-wrapper">
          <div className="grafico-canvas-container">
            <Line data={chartData} options={chartOptions} />
          </div>
        </div>
      )}
    </div>
  );
}

export default GraficoCotacao;