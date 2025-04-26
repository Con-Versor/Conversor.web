import React, { useEffect, useState, useCallback } from 'react';
import './Conversor.css';

const API_TOKEN = '4b1941d5f3aefc3b0a148a3a067833cbf3309cdbe62393409eb32a01d17adb47';
const DEBOUNCE_DELAY = 1300;
const MOEDAS_DISPONIVEIS = ['BRL', 'USD', 'EUR', 'JPY', 'GBP', 'ARS', 'CAD', 'AUD', 'CHF', 'CNY'];

function Conversor() {
  const [valor, setValor] = useState('1');
  const [moedaOrigem, setMoedaOrigem] = useState('BRL');
  const [moedaDestino, setMoedaDestino] = useState('USD');
  const [resultado, setResultado] = useState(null);
  const [taxa, setTaxa] = useState(null);
  const [horaCotacao, setHoraCotacao] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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

    setLoading(true);
    setError(null);

    try {
      const url = `https://economia.awesomeapi.com.br/json/last/${moedaOrigem}-${moedaDestino}?token=${API_TOKEN}`;
      const res = await fetch(url);

      if (!res.ok) {
        throw new Error(`Erro na API: ${res.status}`);
      }

      const data = await res.json();
      const key = `${moedaOrigem}${moedaDestino}`;

      if (!data[key]) {
        throw new Error('Moeda não encontrada na resposta');
      }

      const taxaConversao = parseFloat(data[key].bid);
      const resultadoFinal = (valorNumerico * taxaConversao).toFixed(2);

      setResultado(resultadoFinal);
      setTaxa(taxaConversao.toFixed(6));
      setHoraCotacao(new Date(data[key].create_date).toLocaleString());
    } catch (err) {
      console.error('Erro na conversão:', err);
      setError('Não foi possível obter a cotação. Tente novamente mais tarde.');
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
    if (inputValue) {
      inputValue = parseInt(inputValue).toLocaleString('pt-BR');
    }
    setValor(inputValue);
  };

  const trocarMoedas = () => {
    setMoedaOrigem(moedaDestino);
    setMoedaDestino(moedaOrigem);
  };

  return (
    <div className="conversor-container">
      <h1 className="titulo">Conversor de Moedas</h1>

      <div className="bloco-conversao">
        <div className="campo">
          <label>Quantia</label>
          <input
            type="text"
            value={valor}
            onChange={handleValorChange}
            placeholder="Digite o valor"
          />
          <select
            value={moedaOrigem}
            onChange={(e) => setMoedaOrigem(e.target.value)}
            aria-label="Moeda de origem"
          >
            {MOEDAS_DISPONIVEIS.map((codigo) => (
              <option key={codigo} value={codigo}>
                {codigo} - {new Intl.DisplayNames(['pt'], { type: 'currency' }).of(codigo)}
              </option>
            ))}
          </select>
        </div>

        <button 
          className="botao-trocar" 
          onClick={trocarMoedas}
          aria-label="Trocar moedas"
        >
          ⇄
        </button>

        <div className="campo">
          <label>Resultado</label>
          <input 
            type="text" 
            value={resultado ? formatarMoeda(resultado, moedaDestino, 'en-US') : ''} 
            readOnly 
            placeholder="Resultado"
          />
          <select
            value={moedaDestino}
            onChange={(e) => setMoedaDestino(e.target.value)}
            aria-label="Moeda de destino"
          >
            {MOEDAS_DISPONIVEIS.map((codigo) => (
              <option key={codigo} value={codigo}>
                {codigo} - {new Intl.DisplayNames(['pt'], { type: 'currency' }).of(codigo)}
              </option>
            ))}
          </select>
        </div>
      </div>

      {loading && <div className="loading">Carregando cotações...</div>}
      {error && <div className="erro">{error}</div>}

      {resultado && !error && (
        <div className="info-cotacao">
          <p>
            {formatarMoeda(parseFloat(valor.replace(/\./g, '').replace(',', '.')), moedaOrigem)} ={' '}
            {formatarMoeda(resultado, moedaDestino, 'en-US')}
          </p>
          <p className="detalhes">
            <span>Taxa: 1 {moedaOrigem} = {taxa} {moedaDestino}</span>
            <span>Última atualização: {horaCotacao}</span>
          </p>
        </div>
      )}
    </div>
  );
}

export default Conversor;
