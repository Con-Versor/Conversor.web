import React, { useEffect, useState } from 'react';
import './Conversor.css';

function Conversor() {
  const [valor, setValor] = useState(1);
  const [moedaOrigem, setMoedaOrigem] = useState('BRL');
  const [moedaDestino, setMoedaDestino] = useState('USD');
  const [resultado, setResultado] = useState(null);
  const [taxa, setTaxa] = useState(null);
  const [horaCotacao, setHoraCotacao] = useState(null);
  const [moedasDisponiveis, setMoedasDisponiveis] = useState([]);
  const [loading, setLoading] = useState(false);

  const API_TOKEN = '4b1941d5f3aefc3b0a148a3a067833cbf3309cdbe62393409eb32a01d17adb47';

  const DEBOUNCE_DELAY = 500;

  useEffect(() => {
    async function carregarMoedas() {
      const moedas = [
        'BRL', 'USD', 'EUR', 'JPY', 'GBP', 'ARS', 'CAD', 'AUD', 'CHF', 'CNY'
      ];
      setMoedasDisponiveis(moedas);
    }

    carregarMoedas();
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(async () => {
      if (!valor || !moedaOrigem || !moedaDestino) return;
      
      setLoading(true); 

      try {
        const url = `https://economia.awesomeapi.com.br/json/last/${moedaOrigem}-${moedaDestino}?token=${API_TOKEN}`;
        const res = await fetch(url);
        const data = await res.json();

        const key = `${moedaOrigem}${moedaDestino}`; 
        const taxa = parseFloat(data[key].bid);

        const resultadoFinal = (valor * taxa).toFixed(2);

        setResultado(resultadoFinal);
        setTaxa(taxa.toFixed(4));
        setHoraCotacao(data[key].create_date);
      } catch (error) {
        console.error('Erro ao converter moeda:', error);
      }

      setLoading(false); 
    }, DEBOUNCE_DELAY);

    return () => clearTimeout(timeoutId);
  }, [valor, moedaOrigem, moedaDestino]); 

  return (
    <div className="conversor-container">
      <h1 className="titulo">CONVERTER</h1>

      <div className="bloco-conversao">
        <div className="campo">
          <label>Quantia</label>
          <input
            type="number"
            value={valor}
            onChange={(e) => setValor(e.target.value)}
          />
          <select
            value={moedaOrigem}
            onChange={(e) => setMoedaOrigem(e.target.value)}
          >
            {moedasDisponiveis.map((codigo) => (
              <option key={codigo} value={codigo}>
                {codigo}
              </option>
            ))}
          </select>
        </div>

        <span className="seta">→</span>

        <div className="campo">
          <label>Converter para</label>
          <input type="text" value={resultado || ''} readOnly />
          <select
            value={moedaDestino}
            onChange={(e) => setMoedaDestino(e.target.value)}
          >
            {moedasDisponiveis.map((codigo) => (
              <option key={codigo} value={codigo}>
                {codigo}
              </option>
            ))}
          </select>
        </div>
      </div>

      {loading && <p>Carregando...</p>}

      {resultado && (
        <p className="info-cotacao">
          {Intl.NumberFormat('pt-BR', { style: 'currency', currency: moedaOrigem }).format(valor)}{' '}
          ={' '}
          {Intl.NumberFormat('en-US', { style: 'currency', currency: moedaDestino }).format(resultado)}<br />
          <small>Câmbio: {taxa} — Cotação: {horaCotacao}</small>
        </p>
      )}
    </div>
  );
}

export default Conversor;
