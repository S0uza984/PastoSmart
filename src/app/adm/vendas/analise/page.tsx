'use client';

import React, { useState } from 'react';
import GraficoVendas from './components/GraficoVendas';
import TabelaVendas from './components/TabelaVendas';

export type TipoGrafico = 'linha' | 'barra' | 'pizza' | 'area';
export type MetricaVendas = 'valor' | 'quantidade' | 'lucro' | 'margem';
export type AgrupadoPor = 'data' | 'lote' | 'mes' | 'semana';

export interface FiltrosAnalise {
  dataInicio?: string;
  dataFim?: string;
  tipoGrafico: TipoGrafico;
  metricas: MetricaVendas[];
  agrupadoPor: AgrupadoPor;
  mostrarTabela: boolean;
}

export default function AnaliseVendasPage() {
  const [filtros, setFiltros] = useState<FiltrosAnalise>({
    tipoGrafico: 'linha',
    metricas: ['valor'],
    agrupadoPor: 'data',
    mostrarTabela: true
  });

  const [analiseGerada, setAnaliseGerada] = useState(false);
  const [carregando, setCarregando] = useState(false);
  const [dados, setDados] = useState<any>(null);
  const [erro, setErro] = useState<string | null>(null);

  const handleFiltroChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as any;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      const metrica = name as MetricaVendas;
      
      setFiltros(prev => ({
        ...prev,
        metricas: checked
          ? [...prev.metricas, metrica]
          : prev.metricas.filter(m => m !== metrica)
      }));
    } else {
      setFiltros(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleCheckboxTabela = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFiltros(prev => ({
      ...prev,
      mostrarTabela: e.target.checked
    }));
  };

  const gerarAnalise = async () => {
    if (filtros.metricas.length === 0) {
      setErro('Selecione pelo menos uma métrica para analisar');
      return;
    }

    setCarregando(true);
    setErro(null);

    try {
      const queryParams = new URLSearchParams();
      if (filtros.dataInicio) queryParams.append('dataInicio', filtros.dataInicio);
      if (filtros.dataFim) queryParams.append('dataFim', filtros.dataFim);
      queryParams.append('tipoGrafico', filtros.tipoGrafico);
      queryParams.append('metricas', filtros.metricas.join(','));
      queryParams.append('agrupadoPor', filtros.agrupadoPor);

      const response = await fetch(`/api/vendas/analise?${queryParams.toString()}`);

      if (!response.ok) {
        throw new Error(`Erro ao gerar análise: ${response.status}`);
      }

      const resultado = await response.json();
      setDados(resultado);
      setAnaliseGerada(true);
    } catch (err) {
      setErro(err instanceof Error ? err.message : 'Erro desconhecido');
      setAnaliseGerada(false);
    } finally {
      setCarregando(false);
    }
  };

  const obterTituloMetrica = (metrica: MetricaVendas): string => {
    const titulos: Record<MetricaVendas, string> = {
      valor: 'Valor de Venda',
      quantidade: 'Quantidade de Vendas',
      lucro: 'Lucro',
      margem: 'Margem de Lucro (%)'
    };
    return titulos[metrica];
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-4xl font-bold text-gray-800">📊 Análise de Vendas</h1>
        <p className="text-gray-600 mt-2">Visualize tendências e métricas com gráficos e tabelas personalizadas</p>
      </div>

      {/* Seção de Filtros */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">⚙️ Configuração da Análise</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {/* Data Início */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              📅 Data Início
            </label>
            <input
              type="date"
              name="dataInicio"
              value={filtros.dataInicio || ''}
              onChange={handleFiltroChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
            />
          </div>

          {/* Data Fim */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              📅 Data Fim
            </label>
            <input
              type="date"
              name="dataFim"
              value={filtros.dataFim || ''}
              onChange={handleFiltroChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
            />
          </div>

          {/* Tipo de Gráfico */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              📈 Tipo de Gráfico
            </label>
            <select
              name="tipoGrafico"
              value={filtros.tipoGrafico}
              onChange={handleFiltroChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
            >
              <option value="linha">📊 Linha</option>
              <option value="barra">📊 Barra</option>
              <option value="area">📊 Área</option>
              <option value="pizza">🥧 Pizza</option>
            </select>
          </div>

          {/* Agrupado Por */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              🗂️ Agrupar Por
            </label>
            <select
              name="agrupadoPor"
              value={filtros.agrupadoPor}
              onChange={handleFiltroChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
            >
              <option value="data">Por Data</option>
              <option value="lote">Por Lote</option>
              <option value="mes">Por Mês</option>
              <option value="semana">Por Semana</option>
            </select>
          </div>
        </div>

        {/* Seleção de Métricas */}
        <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-sm font-semibold text-blue-900 mb-3">📊 Selecione as Métricas para Análise:</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {(['valor', 'quantidade', 'lucro', 'margem'] as MetricaVendas[]).map(metrica => (
              <label key={metrica} className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  name={metrica}
                  checked={filtros.metricas.includes(metrica)}
                  onChange={handleFiltroChange}
                  className="w-4 h-4 rounded text-blue-600"
                />
                <span className="text-sm font-medium text-gray-700">
                  {obterTituloMetrica(metrica)}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Opção de Tabela */}
        <div className="mb-6">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={filtros.mostrarTabela}
              onChange={handleCheckboxTabela}
              className="w-4 h-4 rounded text-blue-600"
            />
            <span className="text-sm font-medium text-gray-700">
              📋 Mostrar tabela com dados detalhados
            </span>
          </label>
        </div>

        {/* Botões de Ação */}
        <div className="flex gap-4">
          <button
            onClick={gerarAnalise}
            disabled={carregando}
            className={`px-6 py-3 rounded-lg font-semibold text-white transition ${
              carregando
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 active:scale-95'
            }`}
          >
            {carregando ? '⏳ Gerando...' : '🔄 Gerar Análise'}
          </button>

          <button
            onClick={() => {
              setAnaliseGerada(false);
              setDados(null);
              setErro(null);
            }}
            className="px-6 py-3 rounded-lg font-semibold text-gray-700 bg-gray-200 hover:bg-gray-300 transition"
          >
            🔄 Limpar
          </button>
        </div>
      </div>

      {/* Mensagens de Erro */}
      {erro && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
          <p className="font-semibold">❌ Erro</p>
          <p>{erro}</p>
        </div>
      )}

      {/* Análise Gerada */}
      {analiseGerada && dados && (
        <div className="space-y-6">
          {/* Gráficos */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">📊 Visualização dos Dados</h2>
            <GraficoVendas
              dados={dados.grafico}
              tipo={filtros.tipoGrafico}
              metricas={filtros.metricas}
            />
          </div>

          {/* Tabela (se selecionado) */}
          {filtros.mostrarTabela && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-6">📋 Dados Detalhados</h2>
              <TabelaVendas
                dados={dados.tabela}
                metricas={filtros.metricas}
              />
            </div>
          )}

          {/* Resumo Estatístico */}
          {dados.resumo && (
            <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg p-6">
              <h3 className="font-semibold text-gray-800 mb-4">📈 Resumo Estatístico</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {Object.entries(dados.resumo).map(([chave, valor]: [string, any]) => (
                  <div key={chave} className="bg-white rounded-lg p-4 shadow-sm border border-green-100">
                    <p className="text-sm text-gray-600 font-medium capitalize">
                      {chave.replace(/([A-Z])/g, ' $1').trim()}
                    </p>
                    <p className="text-2xl font-bold text-green-600 mt-1">
                      {typeof valor === 'number' && chave.includes('Valor')
                        ? `R$ ${valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`
                        : typeof valor === 'number' && chave.includes('margem')
                        ? `${valor.toFixed(2)}%`
                        : valor}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Estado Inicial */}
      {!analiseGerada && !carregando && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-8 text-center">
          <p className="text-blue-700 text-lg">
            👈 Configure os filtros acima e clique em "Gerar Análise" para começar
          </p>
        </div>
      )}
    </div>
  );
}
