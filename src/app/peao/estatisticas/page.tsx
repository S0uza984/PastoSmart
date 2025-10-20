'use client';

import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

interface EstatisticasLote {
  codigo: string;
  quantidadeBois: number;
  pesoMedio: number;
  vacinado: boolean;
}

const PeaoEstatisticasPage = () => {
  const [lotes, setLotes] = useState<EstatisticasLote[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchLotes();
  }, []);

  const fetchLotes = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/lotes');
      if (!response.ok) {
        throw new Error('Erro ao carregar lotes');
      }
      const data = await response.json();
      setLotes(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex justify-center items-center h-64">
          <div className="text-lg text-gray-600">Carregando estatísticas...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="flex justify-center items-center h-64">
          <div className="text-lg text-red-600">Erro: {error}</div>
        </div>
      </div>
    );
  }

  const totalBois = lotes.reduce((acc, lote) => acc + lote.quantidadeBois, 0);
  const lotesVacinados = lotes.filter(lote => lote.vacinado).length;
  const pesoMedioGeral = totalBois > 0 
    ? lotes.reduce((acc, lote) => acc + (lote.pesoMedio * lote.quantidadeBois), 0) / totalBois
    : 0;

  const dadosGraficoLotes = lotes.map(lote => ({
    nome: lote.codigo,
    bois: lote.quantidadeBois,
    pesoMedio: lote.pesoMedio
  }));

  const dadosGraficoVacinacao = [
    { name: 'Vacinados', value: lotesVacinados, color: '#10B981' },
    { name: 'Não Vacinados', value: lotes.length - lotesVacinados, color: '#EF4444' }
  ];

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Estatísticas Gerais</h1>
        <p className="text-gray-600">Análise completa dos lotes e bois</p>
      </div>

      {/* Cards de Resumo */}
      <div className="grid gap-6 md:grid-cols-4 mb-8">
        <div className="bg-white p-6 rounded-lg shadow border">
          <div className="text-center">
            <p className="text-sm font-medium text-gray-600">Total de Lotes</p>
            <p className="text-3xl font-bold text-gray-900">{lotes.length}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow border">
          <div className="text-center">
            <p className="text-sm font-medium text-gray-600">Total de Bois</p>
            <p className="text-3xl font-bold text-blue-600">{totalBois}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow border">
          <div className="text-center">
            <p className="text-sm font-medium text-gray-600">Peso Médio Geral</p>
            <p className="text-3xl font-bold text-green-600">{pesoMedioGeral.toFixed(1)} kg</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow border">
          <div className="text-center">
            <p className="text-sm font-medium text-gray-600">Lotes Vacinados</p>
            <p className="text-3xl font-bold text-purple-600">{lotesVacinados}</p>
          </div>
        </div>
      </div>

      {/* Gráficos */}
      <div className="grid gap-6 lg:grid-cols-2 mb-8">
        {/* Gráfico de Quantidade de Bois por Lote */}
        <div className="bg-white p-6 rounded-lg shadow border">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quantidade de Bois por Lote</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={dadosGraficoLotes}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="nome" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="bois" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Gráfico de Peso Médio por Lote */}
        <div className="bg-white p-6 rounded-lg shadow border">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Peso Médio por Lote</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={dadosGraficoLotes}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="nome" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="pesoMedio" fill="#10B981" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Gráfico de Pizza - Status de Vacinação */}
      <div className="grid gap-6 lg:grid-cols-2 mb-8">
        <div className="bg-white p-6 rounded-lg shadow border">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Status de Vacinação dos Lotes</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={dadosGraficoVacinacao}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {dadosGraficoVacinacao.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Tabela de Resumo por Lote */}
        <div className="bg-white p-6 rounded-lg shadow border">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Resumo por Lote</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                <tr>
                  <th className="px-4 py-3">Lote</th>
                  <th className="px-4 py-3">Bois</th>
                  <th className="px-4 py-3">Peso Médio</th>
                  <th className="px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {lotes.map((lote, index) => (
                  <tr key={index} className="bg-white border-b hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-900">{lote.codigo}</td>
                    <td className="px-4 py-3">{lote.quantidadeBois}</td>
                    <td className="px-4 py-3">{lote.pesoMedio.toFixed(1)} kg</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        lote.vacinado 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {lote.vacinado ? 'Vacinado' : 'Não Vacinado'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Análise de Performance */}
      <div className="bg-white p-6 rounded-lg shadow border">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Análise de Performance</h3>
        <div className="grid gap-4 md:grid-cols-3">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <p className="text-sm font-medium text-blue-600">Melhor Lote (Peso)</p>
            <p className="text-2xl font-bold text-blue-800">
              {lotes.length > 0 ? lotes.reduce((max, lote) => lote.pesoMedio > max.pesoMedio ? lote : max).codigo : 'N/A'}
            </p>
            <p className="text-sm text-blue-600">
              {lotes.length > 0 ? lotes.reduce((max, lote) => lote.pesoMedio > max.pesoMedio ? lote : max).pesoMedio.toFixed(1) + ' kg' : ''}
            </p>
          </div>
          
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <p className="text-sm font-medium text-green-600">Maior Lote (Bois)</p>
            <p className="text-2xl font-bold text-green-800">
              {lotes.length > 0 ? lotes.reduce((max, lote) => lote.quantidadeBois > max.quantidadeBois ? lote : max).codigo : 'N/A'}
            </p>
            <p className="text-sm text-green-600">
              {lotes.length > 0 ? lotes.reduce((max, lote) => lote.quantidadeBois > max.quantidadeBois ? lote : max).quantidadeBois + ' bois' : ''}
            </p>
          </div>
          
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <p className="text-sm font-medium text-purple-600">Taxa de Vacinação</p>
            <p className="text-2xl font-bold text-purple-800">
              {lotes.length > 0 ? ((lotesVacinados / lotes.length) * 100).toFixed(1) : '0'}%
            </p>
            <p className="text-sm text-purple-600">
              {lotesVacinados} de {lotes.length} lotes
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PeaoEstatisticasPage;
