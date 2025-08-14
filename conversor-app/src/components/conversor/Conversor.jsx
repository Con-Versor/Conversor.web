import React, { useEffect, useState, useCallback } from 'react';
import { 
  ArrowPathIcon, 
  CurrencyDollarIcon,
  ClockIcon,
  ExclamationCircleIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';
import './Conversor.css';

const API_TOKEN = '4b1941d5f3aefc3b0a148a3a067833cbf3309cdbe62393409eb32a01d17adb47';
const DEBOUNCE_DELAY = 800;

const MOEDAS_DISPONIVEIS = [
  { code: 'BRL', name: 'Real Brasileiro', flag: '🇧🇷' },
  { code: 'USD', name: 'Dólar Americano', flag: '🇺🇸' },
  { code: 'EUR', name: 'Euro', flag: '🇪🇺' },
  { code: 'JPY', name: 'Iene Japonês', flag: '🇯🇵' },
  { code: 'GBP', name: 'Libra Esterlina', flag: '🇬🇧' },
  { code: 'ARS', name: 'Peso Argentino', flag: '🇦🇷' },
  { code: 'CAD', name: 'Dólar Canadense', flag: '🇨🇦' },
  { code: 'AUD', name: 'Dólar Australiano', flag: '🇦🇺' },
  { code: 'CHF', name: 'Franco Suíço', flag: '🇨🇭' },
  { code: 'CNY', name: 'Yuan Chinês', flag: '🇨🇳' }
];

function Conversor() {
  const [valor, setValor] = useState('1');
  const [moedaOrigem, setMoedaOrigem] = useState('BRL');
  const [moedaDestino, setMoedaDestino] = useState('USD');
  const [resultado, setResultado] = useState(null);
  const [taxa, setTaxa] = useState(null);
  const [horaCotacao, setHoraCotacao] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const formatarMoeda = useCallback((valor, moeda, locale = 'pt-BR') => {
    try {
      return Intl.NumberFormat(locale, { 
        style: 'currency', 
        currency: moeda 
      }).format(valor);
    } catch {
      return `${valor} ${moeda}`;
    }
  }, []);

  const converterMoeda = useCallback(async () => {
    if (!valor || !moedaOrigem || !moedaDestino) {
      setResultado(null);
      return;
    }

    const valorNumerico = parseFloat(valor.replace(/\./g, '').replace(',', '.')) || 0;
    if (valorNumerico <= 0) {
      setResultado(null);
      return;
    }

    if (moedaOrigem === moedaDestino) {
      setResultado(valorNumerico.toFixed(2));
      setTaxa('1.000000');
      setHoraCotacao(new Date().toLocaleString());
      setError(null);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 2000);
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const url = `https://economia.awesomeapi.com.br/json/last/${moedaOrigem}-${moedaDestino}?token=${API_TOKEN}`;
      const res = await fetch(url);

      if (!res.ok) {
        throw new Error(`Erro na API: ${res.status}`);
      }

      const data = await res.json();
      const key = `${moedaOrigem}${moedaDestino}`;

      if (!data[key]) {
        throw new Error('Cotação não encontrada');
      }

      const taxaConversao = parseFloat(data[key].bid);
      const resultadoFinal = (valorNumerico * taxaConversao).toFixed(2);

      setResultado(resultadoFinal);
      setTaxa(taxaConversao.toFixed(6));
      setHoraCotacao(new Date(data[key].create_date).toLocaleString('pt-BR'));
      setSuccess(true);
      setTimeout(() => setSuccess(false), 2000);
    } catch (err) {
      console.error('Erro na conversão:', err);
      setError('Não foi possível obter a cotação. Tente novamente.');
      setResultado(null);
    } finally {
      setLoading(false);
    }
  }, [valor, moedaOrigem, moedaDestino]);

  useEffect(() => {
    const timeoutId = setTimeout(converterMoeda, DEBOUNCE_DELAY);
    return () => clearTimeout(timeoutId);
  }, [converterMoeda]);

  const handleValorChange = (e) => {
    let inputValue = e.target.value.replace(/\D/g, '');
    inputValue = inputValue.replace(/^0+/, '');
    
    if (inputValue === '') {
      setValor('');
      return;
    }
    
    inputValue = parseInt(inputValue, 10).toLocaleString('pt-BR');
    setValor(inputValue);
  };

  const trocarMoedas = () => {
    setMoedaOrigem(moedaDestino);
    setMoedaDestino(moedaOrigem);
  };

  const getMoedaInfo = (code) => {
    return MOEDAS_DISPONIVEIS.find(moeda => moeda.code === code) || { name: code, flag: '💱' };
  };

  return (
    <div className="conversor-page">
      <div className="conversor-container">
        <div className="conversor-header">
          <div className="header-icon">
            <CurrencyDollarIcon className="icon" />
          </div>
          <h1 className="conversor-title">Conversor de Moedas</h1>
          <p className="conversor-subtitle">
            Converta moedas em tempo real com as cotações mais atualizadas
          </p>
        </div>

        <div className="conversor-card">
          <div className="conversion-section">
            <div className="input-group">
              <label className="input-label">
                <span>Valor</span>
                <span className="required">*</span>
              </label>
              <div className="currency-input-wrapper">
                <input
                  type="text"
                  value={valor}
                  onChange={handleValorChange}
                  placeholder="Digite o valor"
                  className="currency-input"
                />
                <div className="currency-select-wrapper">
                  <select
                    value={moedaOrigem}
                    onChange={(e) => setMoedaOrigem(e.target.value)}
                    className="currency-select"
                    aria-label="Moeda de origem"
                  >
                    {MOEDAS_DISPONIVEIS.map((moeda) => (
                      <option key={moeda.code} value={moeda.code}>
                        {moeda.flag} {moeda.code}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="currency-name">
                {getMoedaInfo(moedaOrigem).name}
              </div>
            </div>

            <div className="swap-section">
              <button 
                className={`swap-button ${loading ? 'loading' : ''}`}
                onClick={trocarMoedas}
                disabled={loading}
                aria-label="Trocar moedas"
              >
                <ArrowPathIcon className="swap-icon" />
              </button>
            </div>

            <div className="input-group">
              <label className="input-label">
                <span>Resultado</span>
                {success && <CheckCircleIcon className="success-icon" />}
              </label>
              <div className="currency-input-wrapper">
                <input 
                  type="text" 
                  value={resultado ? formatarMoeda(parseFloat(resultado), moedaDestino, 'pt-BR') : ''} 
                  readOnly 
                  placeholder="Resultado da conversão"
                  className="currency-input result-input"
                />
                <div className="currency-select-wrapper">
                  <select
                    value={moedaDestino}
                    onChange={(e) => setMoedaDestino(e.target.value)}
                    className="currency-select"
                    aria-label="Moeda de destino"
                  >
                    {MOEDAS_DISPONIVEIS.map((moeda) => (
                      <option key={moeda.code} value={moeda.code}>
                        {moeda.flag} {moeda.code}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="currency-name">
                {getMoedaInfo(moedaDestino).name}
              </div>
            </div>
          </div>

          {/* Status Messages */}
          {loading && (
            <div className="status-message loading-message">
              <div className="loading-spinner"></div>
              <span>Buscando cotação mais recente...</span>
            </div>
          )}

          {error && (
            <div className="status-message error-message">
              <ExclamationCircleIcon className="status-icon" />
              <span>{error}</span>
            </div>
          )}

          {/* Conversion Result */}
          {resultado && !error && !loading && (
            <div className="conversion-result">
              <div className="result-summary">
                <div className="conversion-equation">
                  <span className="amount">
                    {formatarMoeda(parseFloat(valor.replace(/\./g, '').replace(',', '.')), moedaOrigem)}
                  </span>
                  <span className="equals">=</span>
                  <span className="result">
                    {formatarMoeda(parseFloat(resultado), moedaDestino)}
                  </span>
                </div>
              </div>
              
              <div className="conversion-details">
                <div className="detail-item">
                  <span className="detail-label">Taxa de conversão:</span>
                  <span className="detail-value">
                    1 {moedaOrigem} = {taxa} {moedaDestino}
                  </span>
                </div>
                <div className="detail-item">
                  <ClockIcon className="detail-icon" />
                  <span className="detail-label">Atualizada em:</span>
                  <span className="detail-value">{horaCotacao}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="quick-actions">
          <h3 className="quick-actions-title">Conversões populares</h3>
          <div className="quick-buttons">
            {[
              { from: 'USD', to: 'BRL' },
              { from: 'EUR', to: 'BRL' },
              { from: 'BRL', to: 'USD' },
              { from: 'GBP', to: 'BRL' }
            ].map(({ from, to }) => (
              <button
                key={`${from}-${to}`}
                className="quick-button"
                onClick={() => {
                  setMoedaOrigem(from);
                  setMoedaDestino(to);
                }}
              >
                <span className="quick-from">{getMoedaInfo(from).flag} {from}</span>
                <ArrowPathIcon className="quick-arrow" />
                <span className="quick-to">{getMoedaInfo(to).flag} {to}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Conversor;
