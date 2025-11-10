'use client';

import React, { useState, useEffect } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { TableFilter, FilterColumn } from '@/app/components/TableFilter';

interface Boi {
  id: number;
  peso: number;
  status: string;
  alerta: string | null;
}

interface Lote {
  id: number;
  codigo: string;
  chegada: string;
  custo: number;
  gasto_alimentacao?: number | null;
  vacinado: boolean;
  data_vacinacao: string | null;
  quantidadeBois: number;
  pesoMedio: number;
  pesoTotal: number;
  bois: Boi[];
}

const PeaoLoteDetailsPage = () => {
  const params = useParams();
  const loteId = parseInt(params.id as string);
  const [lote, setLote] = useState<Lote | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filteredBois, setFilteredBois] = useState<Boi[]>([]);

  useEffect(() => {
    fetchLote();
  }, [loteId]);

  const fetchLote = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/lotes/${loteId}`);
      if (!response.ok) throw new Error('Erro ao carregar lote');
      const data = await response.json();
      setLote(data);
      setFilteredBois(data.bois || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
    } finally {
      setLoading(false);
    }
  };

  const filterColumns: FilterColumn[] = [
    { key: 'id', label: 'ID', type: 'number' },
    { key: 'peso', label: 'Peso (kg)', type: 'number' },
    {
      key: 'status', label: 'Status', type: 'select', options: [
        { value: 'ativo', label: 'Ativo' },
        { value: 'inativo', label: 'Inativo' },
        { value: 'vendido', label: 'Vendido' }
      ]
    }
  ];

  const calcNextReforco = (isoDate: string | null | undefined): Date | null => {
    if (!isoDate) return null;
    const d = new Date(isoDate);
    if (Number.isNaN(d.getTime())) return null;
    d.setFullYear(d.getFullYear() + 1);
    return d;
  };

  const formatPtBr = (d: Date | null | undefined) => d ? d.toLocaleDateString('pt-BR') : '—';

  if (loading) return (
    <div className="p-6">
      <div className="flex justify-center items-center h-64 text-lg text-gray-600">
        Carregando lote...
      </div>
    </div>
  );

  if (error || !lote) return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-red-600">
        {error || 'Lote não encontrado'}
      </h1>
      <Link href="/peao/lote">
        <button className="mt-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
          Voltar para Lotes
        </button>
      </Link>
    </div>
  );

  const nextReforco = calcNextReforco(lote.data_vacinacao);
  const reforcoAtrasado = nextReforco ? new Date() >= nextReforco : false;

  const quantidadeBois = lote.quantidadeBois ?? lote.bois.length ?? 0;
  const pesoTotal = lote.pesoTotal ?? lote.bois.reduce((s, b) => s + b.peso, 0);
  const pesoMedio = lote.pesoMedio ?? (quantidadeBois > 0 ? pesoTotal / quantidadeBois : 0);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Estatísticas - {lote.codigo}</h1>
          <p className="text-gray-600">Detalhes e estatísticas do lote</p>
        </div>
        <Link href="/peao/lote">
          <button className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50">
            Voltar para Lotes
          </button>
        </Link>
      </div>

      {/* --- Cards de Estatísticas --- */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-5 mb-6">
        {/* Quantidade */}
        <div className="bg-white p-6 rounded-lg shadow border text-center">
          <p className="text-sm font-medium text-gray-600">Quantidade de Bois</p>
          <p className="text-3xl font-bold text-gray-900">{quantidadeBois}</p>
        </div>

        {/* Peso médio */}
        <div className="bg-white p-6 rounded-lg shadow border text-center">
          <p className="text-sm font-medium text-gray-600">Peso Médio</p>
          <p className="text-3xl font-bold text-green-600">
            {pesoMedio ? `${pesoMedio.toFixed(1)} kg` : '—'}
          </p>
        </div>

        {/* Vacinação */}
        <div className="bg-white p-6 rounded-lg shadow border text-center">
          <p className="text-sm font-medium text-gray-600">Vacinação</p>
          <p className={`text-lg font-bold ${lote.vacinado ? 'text-green-600' : 'text-red-600'}`}>
            {lote.vacinado ? 'Vacinado' : 'Não vacinado'}
          </p>
          {lote.vacinado && (
            <>
              <p className="text-sm text-gray-500 mt-1">
                {lote.data_vacinacao ? new Date(lote.data_vacinacao).toLocaleDateString('pt-BR') : '—'}
              </p>
              <p className="text-sm text-gray-700 mt-1">
                <strong>Próximo reforço:</strong>{' '}
                <span className="font-semibold">{formatPtBr(nextReforco)}</span>
                {nextReforco && (
                  reforcoAtrasado ? (
                    <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full ml-2">Atrasado</span>
                  ) : (
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full ml-2">OK</span>
                  )
                )}
              </p>
            </>
          )}
        </div>

        {/* Chegada */}
        <div className="bg-white p-6 rounded-lg shadow border text-center">
          <p className="text-sm font-medium text-gray-600">Data de Chegada</p>
          <p className="text-lg font-bold text-gray-900">
            {new Date(lote.chegada).toLocaleDateString('pt-BR')}
          </p>
        </div>

        {/* Custo + Alimentação */}
        <div className="bg-white p-6 rounded-lg shadow border text-center">
          <p className="text-sm font-medium text-gray-600">Custo Compra do Lote</p>
          <p className="text-2xl font-bold text-green-600">
            R$ {Number(lote.custo ?? 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </p>
          <p className="text-sm text-gray-600 mt-2">
            <span className="block">Gasto com Alimentação:</span>
            <span className="font-semibold text-gray-900">
              {lote.gasto_alimentacao != null
                ? `R$ ${Number(lote.gasto_alimentacao).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`
                : '—'}
            </span>
          </p>
        </div>
      </div>

      {/* --- Gráfico --- */}
      <div className="bg-white p-6 rounded-lg shadow border mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Peso Individual dos Bois</h3>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={lote.bois.map((b, i) => ({ nome: `Boi ${i + 1}`, peso: b.peso }))}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="nome" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="peso" fill="#3b82f6" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* --- Tabela --- */}
      <div className="bg-white rounded-lg shadow border">
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-900">Lista Detalhada dos Bois</h3>
          <TableFilter data={lote.bois} columns={filterColumns} onFilterChange={setFilteredBois} />
        </div>
        <div className="p-6 overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
              <tr>
                <th className="px-6 py-3">ID</th>
                <th className="px-6 py-3">Nome</th>
                <th className="px-6 py-3">Peso (kg)</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Ações</th>
              </tr>
            </thead>
            <tbody>
              {filteredBois.map((boi, index) => {
                const originalIndex = lote.bois.findIndex(b => b.id === boi.id);
                return (
                  <tr key={boi.id} className="bg-white border-b hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium text-gray-900">{boi.id}</td>
                    <td className="px-6 py-4">Boi {originalIndex >= 0 ? originalIndex + 1 : index + 1}</td>
                    <td className="px-6 py-4 font-semibold">{boi.peso} kg</td>
                    <td className="px-6 py-4">
                      <span className={boi.status === 'Ativo'
                        ? 'bg-green-100 text-green-800 border border-green-300 px-2 py-1 rounded text-xs'
                        : 'bg-yellow-100 text-yellow-800 border border-yellow-300 px-2 py-1 rounded text-xs'}>
                        {boi.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <Link href={`/peao/lote/${loteId}/boi/${boi.id}/pesagem`}>
                        <button className="text-green-600 hover:text-green-800 text-sm font-medium">
                          Ver Evolução
                        </button>
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* --- Botão --- */}
      <div className="mt-6 flex justify-center">
        <Link href={`/peao/lote/${loteId}/adicionar-bois`}>
          <button className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Adicionar Mais Bois ao Lote
          </button>
        </Link>
      </div>
    </div>
  );
};

export default PeaoLoteDetailsPage;
