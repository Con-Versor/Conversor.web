import React, { useState, useEffect } from 'react';
import { 
  InformationCircleIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  ClockIcon,
  CurrencyDollarIcon
} from '@heroicons/react/24/outline';
import './ConsultaMoedas.css';

const MOEDAS_DISPONIVEIS = [
  { code: 'BRL', name: 'Real Brasileiro', flag: '🇧🇷', symbol: 'R$' },
  { code: 'USD', name: 'Dólar Americano', flag: '🇺🇸', symbol: '$' },
  { code: 'EUR', name: 'Euro', flag: '🇪🇺', symbol: '€' },
  { code: 'JPY', name: 'Iene Japonês', flag: '🇯🇵', symbol: '¥' },
  { code: 'GBP', name: 'Libra Esterlina', flag: '🇬🇧', symbol: '£' },
  { code: 'ARS', name: 'Peso Argentino', flag: '🇦🇷', symbol: '$' },
  { code: 'CAD', name: 'Dólar Canadense', flag: '🇨🇦', symbol: 'C$' },
  { code: 'AUD', name: 'Dólar Australiano', flag: '🇦🇺', symbol: 'A$' },
  { code: 'CHF', name: 'Franco Suíço', flag: '🇨🇭', symbol: 'CHF' },
  { code: 'CNY', name: 'Yuan Chinês', flag: '🇨🇳', symbol: '¥' }
];

const API_KEY = '83119d68084d2c94b63f2161';
const API_URL = `https://v6.exchangerate-api.com/v6/${API_KEY}`;

function ConsultaMoedas() {
  const [moedaSelecionada, setMoedaSelecionada] = useState('USD');
  const [detalhesMoeda, setDetalhesMoeda] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [historicoCotacoes, setHistoricoCotacoes] = useState(() => {
    const historicoInicial = {};
    MOEDAS_DISPONIVEIS.forEach(base => {
      MOEDAS_DISPONIVEIS.forEach(target => {
        if (base !== target) {
          historicoInicial[`${base.code}${target.code}`] = [];
        }
      });
    });
    return historicoInicial;
  });

  const obterResumoMoeda = (moeda) => {
    const resumos = {
      USD: "O Dólar Americano é a principal moeda de reserva internacional e a mais negociada no mundo. Emitido pelo Federal Reserve, é usado como referência em transações internacionais e como reserva de valor por bancos centrais globalmente.",
      EUR: "O Euro é a moeda oficial de 19 países da União Europeia, representando uma das maiores economias do mundo. Gerenciado pelo Banco Central Europeu, é a segunda moeda mais negociada internacionalmente.",
      BRL: "O Real Brasileiro é a moeda oficial do Brasil, a maior economia da América Latina. Controlado pelo Banco Central do Brasil, reflete a estabilidade econômica e as políticas monetárias do país.",
      JPY: "O Iene Japonês é a moeda da terceira maior economia mundial. Conhecido por sua estabilidade e baixas taxas de juros, é amplamente usado em operações carry trade e como moeda refúgio.",
      GBP: "A Libra Esterlina é uma das moedas mais antigas ainda em circulação. Apesar do Brexit, mantém-se como importante moeda de reserva e centro financeiro internacional em Londres.",
      ARS: "O Peso Argentino enfrenta histórica volatilidade devido a crises econômicas recorrentes. Sujeito a controles cambiais e alta inflação, reflete os desafios econômicos argentinos.",
      CAD: "O Dólar Canadense é considerado uma commodity currency, fortemente influenciado pelos preços do petróleo e recursos naturais. Beneficia-se da estabilidade política e econômica do Canadá.",
      AUD: "O Dólar Australiano é outra importante commodity currency, vinculado aos preços de minerais e produtos agrícolas. A economia australiana diversificada sustenta sua estabilidade.",
      CHF: "O Franco Suíço é reconhecido mundialmente como moeda refúgio devido à neutralidade suíça, estabilidade política e sistema financeiro robusto. Mantém baixa volatilidade mesmo em crises globais.",
      CNY: "O Yuan Chinês representa a segunda maior economia mundial. Embora controlado pelo governo, vem ganhando relevância internacional e foi incluído na cesta do FMI como moeda de reserva."
    };

    return resumos[moeda] || `Informações sobre ${moeda}`;
  };

  useEffect(() => {
    const fetchMoedaInfo = async () => {
      if (!moedaSelecionada) return;
      
      setLoading(true);
      setError(null);

      try {
        const url = `${API_URL}/latest/${moedaSelecionada}`;
        const res = await fetch(url);
        
        if (!res.ok) {
          throw new Error(`Erro na API: ${res.status}`);
        }

        const data = await res.json();
        
        if (data.result === 'error') {
          throw new Error(data['error-type']);
        }

        const cotacoesFormatadas = {};
        const novoHistorico = {...historicoCotacoes};
        const dataAtual = new Date(data.time_last_update_utc);

        Object.entries(data.conversion_rates).forEach(([moeda, valor]) => {
          const moedaInfo = MOEDAS_DISPONIVEIS.find(m => m.code === moeda);
          if (moedaInfo && moeda !== moedaSelecionada) {
            const key = `${moedaSelecionada}${moeda}`;
            
            let pctChange = 0;
            if (novoHistorico[key] && novoHistorico[key].length > 0) {
              const ultimoValor = novoHistorico[key][0].valor;
              pctChange = ((valor - ultimoValor) / ultimoValor) * 100;
            }

            const novoRegistro = {
              valor: valor,
              data: dataAtual
            };

            novoHistorico[key] = [
              novoRegistro,
              ...(novoHistorico[key] || []).slice(0, 4) 
            ];

            cotacoesFormatadas[key] = {
              bid: valor,
              pctChange: pctChange,
              create_date: data.time_last_update_utc,
              historico: novoHistorico[key],
              moedaInfo: moedaInfo
            };
          }
        });

        setHistoricoCotacoes(novoHistorico);
        setDetalhesMoeda(cotacoesFormatadas);
      } catch (err) {
        console.error('Erro ao buscar informações:', err);
        setError(`Não foi possível obter cotações: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    const timeoutId = setTimeout(fetchMoedaInfo, 500);
    return () => clearTimeout(timeoutId);
  }, [moedaSelecionada]);

  const formatarMoeda = (valor, moeda) => {
    try {
      const moedaInfo = MOEDAS_DISPONIVEIS.find(m => m.code === moeda);
      return new Intl.NumberFormat('pt-BR', { 
        style: 'currency', 
        currency: moeda,
        minimumFractionDigits: moeda === 'JPY' ? 0 : 2,
        maximumFractionDigits: moeda === 'JPY' ? 0 : 6
      }).format(valor);
    } catch {
      const moedaInfo = MOEDAS_DISPONIVEIS.find(m => m.code === moeda);
      return `${moedaInfo?.symbol || moeda} ${valor.toFixed(moeda === 'JPY' ? 0 : 4)}`;
    }
  };

  const formatarData = (timestamp) => {
    if (!timestamp) return 'N/A';
    return new Date(timestamp).toLocaleString('pt-BR');
  };

  const getMoedaInfo = (code) => {
    return MOEDAS_DISPONIVEIS.find(moeda => moeda.code === code);
  };

  const moedaSelecionadaInfo = getMoedaInfo(moedaSelecionada);

  return (
    <div className="consulta-page">
      <div className="consulta-container">
        <div className="consulta-header">
          <div className="header-icon">
            <InformationCircleIcon className="icon" />
          </div>
          <h1 className="consulta-title">Consulta de Moedas</h1>
          <p className="consulta-subtitle">
            Explore informações detalhadas sobre moedas e suas cotações em tempo real
          </p>
        </div>

        <div className="moeda-selector-card">
          <label className="selector-label">
            <CurrencyDollarIcon className="selector-icon" />
            Selecione a moeda base:
          </label>
          <select
            value={moedaSelecionada}
            onChange={(e) => setMoedaSelecionada(e.target.value)}
            className="moeda-selector"
            aria-label="Moeda base"
          >
            {MOEDAS_DISPONIVEIS.map((moeda) => (
              <option key={moeda.code} value={moeda.code}>
                {moeda.flag} {moeda.code} - {moeda.name}
              </option>
            ))}
          </select>
        </div>

        {loading && (
          <div className="loading-card">
            <div className="loading-spinner"></div>
            <span>Carregando informações da moeda...</span>
          </div>
        )}

        {error && (
          <div className="error-card">
            <span>{error}</span>
          </div>
        )}

        {detalhesMoeda && !loading && moedaSelecionadaInfo && (
          <div className="moeda-details">
            <div className="moeda-info-card">
              <div className="moeda-header">
                <div className="moeda-flag">{moedaSelecionadaInfo.flag}</div>
                <div className="moeda-title">
                  <h2>{moedaSelecionadaInfo.name}</h2>
                  <span className="moeda-code">{moedaSelecionada}</span>
                </div>
              </div>
              <p className="moeda-description">
                {obterResumoMoeda(moedaSelecionada)}
              </p>
            </div>

            <div className="cotacoes-section">
              <h3 className="section-title">
                Cotações Relativas
                <span className="cotacoes-count">
                  {Object.keys(detalhesMoeda).length} moedas
                </span>
              </h3>
              
              <div className="cotacoes-grid">
                {Object.entries(detalhesMoeda)
                  .sort(([,a], [,b]) => Math.abs(b.pctChange) - Math.abs(a.pctChange))
                  .map(([key, info]) => {
                    const targetCurrency = key.replace(moedaSelecionada, '');
                    const targetInfo = info.moedaInfo;
                    
                    return (
                      <div key={key} className="cotacao-card">
                        <div className="cotacao-header">
                          <div className="currency-info">
                            <span className="currency-flag">{targetInfo.flag}</span>
                            <div className="currency-details">
                              <span className="currency-code">{targetCurrency}</span>
                              <span className="currency-name">{targetInfo.name}</span>
                            </div>
                          </div>
                          <div className={`change-indicator ${info.pctChange >= 0 ? 'positive' : 'negative'}`}>
                            {info.pctChange >= 0 ? (
                              <ArrowTrendingUpIcon className="change-icon" />
                            ) : (
                              <ArrowTrendingDownIcon className="change-icon" />
                            )}
                            <span className="change-value">
                              {Math.abs(info.pctChange).toFixed(2)}%
                            </span>
                          </div>
                        </div>
                        
                        <div className="cotacao-value">
                          <span className="value-label">1 {moedaSelecionada} =</span>
                          <span className="value-amount">
                            {formatarMoeda(info.bid, targetCurrency)}
                          </span>
                        </div>
                        
                        <div className="cotacao-footer">
                          <ClockIcon className="time-icon" />
                          <span className="update-time">
                            {formatarData(info.create_date)}
                          </span>
                        </div>
                      </div>
                    );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ConsultaMoedas;