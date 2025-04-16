import React, { useState, useEffect } from 'react';
import './ConsultaMoedas.css';

function ConsultaMoedas() {
  const [moedaSelecionada, setMoedaSelecionada] = useState(null);
  const [moedas, setMoedas] = useState([]);
  const [detalhesMoeda, setDetalhesMoeda] = useState(null);
  const [erro, setErro] = useState('');
  const [resumoMoeda, setResumoMoeda] = useState('');

  const API_TOKEN = '4b1941d5f3aefc3b0a148a3a067833cbf3309cdbe62393409eb32a01d17adb47';

  // Pegar lista de moedas quando o componente carregar
  useEffect(() => {
    async function carregarMoedas() {
      try {
        const resposta = await fetch(`https://economia.awesomeapi.com.br/json/all?token=${API_TOKEN}`);
        const dados = await resposta.json();
        setMoedas(Object.keys(dados)); // Guardando apenas as chaves das moedas
      } catch (error) {
        setErro('Erro ao carregar as moedas');
      }
    }

    carregarMoedas();
  }, []);

  // Buscar detalhes da moeda selecionada
  useEffect(() => {
    async function carregarDetalhes() {
      if (!moedaSelecionada) return;

      try {
        const resposta = await fetch(`https://economia.awesomeapi.com.br/json/last/${moedaSelecionada}-BRL?token=${API_TOKEN}`);
        const dados = await resposta.json();
        setDetalhesMoeda(dados[`${moedaSelecionada}BRL`]);

        // Definir o resumo com base na moeda selecionada
        const resumo = obterResumoMoeda(moedaSelecionada);
        setResumoMoeda(resumo);
      } catch (error) {
        setErro('Erro ao carregar os detalhes da moeda');
      }
    }

    carregarDetalhes();
  }, [moedaSelecionada]);

  // Função para obter resumo da moeda
  function obterResumoMoeda(moeda) {
    const resumos = {
      USD: "O Dólar Americano (USD) é a moeda oficial dos Estados Unidos e uma das mais utilizadas em transações financeiras no mundo.",
      EUR: "O Euro (EUR) é a moeda oficial de 19 dos 27 países da União Europeia e é uma das principais moedas do mercado global.",
      BRL: "O Real (BRL) é a moeda oficial do Brasil, país da América do Sul.",
      JPY: "O Iene (JPY) é a moeda oficial do Japão, uma das principais economias do mundo.",
      GBP: "A Libra Esterlina (GBP) é a moeda oficial do Reino Unido e é uma das mais antigas ainda em uso.",
      // Adicione mais resumos para outras moedas conforme necessário
    };

    return resumos[moeda] || "Resumo não disponível para esta moeda.";
  }

  return (
    <div className="consulta-moedas-container">
      <h1 className="titulo">Consultar Moedas</h1>

      <div className="campo">
        <label>Escolha uma moeda:</label>
        <select
          value={moedaSelecionada || ''}
          onChange={(e) => setMoedaSelecionada(e.target.value)}
        >
          <option value="" disabled>Selecione a moeda</option>
          {moedas.map((moeda) => (
            <option key={moeda} value={moeda}>
              {moeda}
            </option>
          ))}
        </select>
      </div>

      {erro && <p className="erro">{erro}</p>}

      {detalhesMoeda && (
        <div className="detalhes-moeda">
          <div className="informacoes-moeda">
            <h2>{moedaSelecionada}</h2>
            <p><strong>Código:</strong> {detalhesMoeda.code}</p>
            <p><strong>Bid (valor de compra):</strong> {detalhesMoeda.bid}</p>
            <p><strong>Ask (valor de venda):</strong> {detalhesMoeda.ask}</p>
            <p><strong>Nome:</strong> {detalhesMoeda.name}</p>
            <p><strong>Data da cotação:</strong> {detalhesMoeda.create_date}</p>
          </div>

          <h3>Resumo</h3>
          <p>{resumoMoeda}</p> {/* Exibindo o resumo da moeda */}

          <h3>Taxas de Câmbio</h3>
          <div className="taxas">
            <p><strong>De {moedaSelecionada}:</strong> {detalhesMoeda.bid}</p>
            <p><strong>Para {moedaSelecionada}:</strong> {detalhesMoeda.ask}</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default ConsultaMoedas;
