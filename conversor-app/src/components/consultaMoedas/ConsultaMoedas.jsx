import React, { useState, useEffect } from 'react';
import './ConsultaMoedas.css';

const MOEDAS_DISPONIVEIS = ['BRL', 'USD', 'EUR', 'JPY', 'GBP', 'ARS', 'CAD', 'AUD', 'CHF', 'CNY'];
const API_KEY = '83119d68084d2c94b63f2161';
const API_URL = `https://v6.exchangerate-api.com/v6/${API_KEY}`;

function ConsultaMoedas() {
  const [moedaSelecionada, setMoedaSelecionada] = useState('USD');
  const [detalhesMoeda, setDetalhesMoeda] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [resumoMoeda, setResumoMoeda] = useState('');
  const [historicoCotacoes, setHistoricoCotacoes] = useState(() => {
    
    const historicoInicial = {};
    MOEDAS_DISPONIVEIS.forEach(base => {
      MOEDAS_DISPONIVEIS.forEach(target => {
        if (base !== target) {
          historicoInicial[`${base}${target}`] = [];
        }
      });
    });
    return historicoInicial;
  });

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
          if (MOEDAS_DISPONIVEIS.includes(moeda) && moeda !== moedaSelecionada) {
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
              historico: novoHistorico[key] 
            };
          }
        });

        setHistoricoCotacoes(novoHistorico);
        setDetalhesMoeda(cotacoesFormatadas);
        setResumoMoeda(obterResumoMoeda(moedaSelecionada));
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

  const obterResumoMoeda = (moeda) => {
    const resumos = {
      USD: "Moeda oficial dos Estados Unidos e a principal moeda de reserva internacional, amplamente utilizada em transações comerciais e financeiras em todo o mundo.",
      EUR: "Moeda oficial da Zona do Euro, adotada por 19 países da União Europeia e uma das principais moedas de reserva e negociação global.",
      BRL: "Moeda oficial do Brasil, emitida e regulada pelo Banco Central do Brasil. É a principal unidade monetária do país, utilizada em todas as transações financeiras domésticas. Real é a moeda corrente no Brasil, emitida pelo Banco Central do Brasil.",
      JPY: "Moeda oficial do Japão, emitida pelo Banco do Japão. Além de ser a terceira maior economia global, o iene é uma das principais moedas de reserva e amplamente negociada no mercado financeiro internacional.",
      GBP: "Moeda oficial do Reino Unido, emitida pelo Banco da Inglaterra. Considerada a mais antiga moeda ainda em circulação no mundo, a libra esterlina é uma das principais moedas de reserva global e uma das mais negociadas no mercado cambial.",
      ARS: "Moeda oficial da Argentina, emitida pelo Banco Central da República Argentina. Apesar de sua relevância regional, o peso argentino enfrenta histórica instabilidade econômica e elevada inflação, sendo frequentemente sujeito a controles cambiais pelo governo.",
      CAD: "Moeda oficial do Canadá, emitida pelo Banco do Canadá. Considerada uma das principais commodity currencies do mundo, o dólar canadense está fortemente vinculado aos preços das commodities, especialmente do petróleo, devido à relevância do setor de recursos naturais na economia do país. Além disso, é uma das moedas mais negociadas no mercado internacional e reconhecida por sua estabilidade econômica.",
      AUD: "Moeda oficial da Austrália e de alguns territórios insulares do Pacífico, emitida pelo Reserve Bank of Australia. Classificado como uma das principais commodity currencies, o dólar australiano tem forte correlação com a exportação de recursos minerais e agrícolas. É uma das moedas mais negociadas no mercado internacional, refletindo a solidez da economia australiana e seu status como economia desenvolvida estável.",
      CHF: "Moeda oficial da Suíça e do Liechtenstein, emitida pelo Banco Nacional Suíço. Reconhecido globalmente como um ativo refúgio, o franco suíço é valorizado por sua estabilidade em cenários de instabilidade econômica e política, além de ser respaldado pelas sólidas reservas financeiras e pelo sistema bancário suíço. Sua força e baixa inflação o tornam uma das moedas mais seguras e negociadas no mercado internacional.",
      CNY: "Moeda oficial da China, emitida pelo Banco Popular da China. Como divisa da segunda maior economia global, o yuan vem ganhando relevância internacional, impulsionado pela crescente abertura financeira chinesa e sua inclusão nos Direitos Especiais de Saque (SDR) do FMI. Apesar de ainda sujeito a controles governamentais, seu uso em transações internacionais tem se expandido, refletindo o peso geopolítico e comercial da China."
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
      <h1 className="titulo">Informações sobre Moedas</h1>

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
                    {info.pctChange.toFixed(2)}%
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