'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

interface Lote {
  id: number;
  codigo: string;
  chegada: string;
  custo: number;
  vacinado: boolean;
  data_vacinacao: string | null;
  quantidadeBois: number;
  pesoMedio: number;
  pesoTotal: number;
}

const LotePage = () => {
  const [lotes, setLotes] = useState<Lote[]>([]);
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
          <div className="text-lg text-gray-600">Carregando lotes...</div>
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

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gerenciar Lotes</h1>
          <p className="text-gray-600">Visualize e gerencie os lotes de gado</p>
        </div>
        <Link href="/adm/novo-lote">
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Adicionar Novo Lote
          </button>
        </Link>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-6">
        <div className="bg-white p-6 rounded-lg shadow border">
          <div className="flex items-center">
            <svg className="h-4 w-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 515.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <div className="ml-2">
              <p className="text-sm font-medium text-gray-600">Total de Lotes</p>
              <p className="text-2xl font-bold text-gray-900">{lotes.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow border">
          <div className="flex items-center">
            <svg className="h-4 w-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 515.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 919.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <div className="ml-2">
              <p className="text-sm font-medium text-gray-600">Total de Bois</p>
              <p className="text-2xl font-bold text-gray-900">
                {lotes.reduce((acc, lote) => acc + lote.quantidadeBois, 0)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow border">
          <div className="flex items-center">
            <svg className="h-4 w-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <div className="ml-2">
              <p className="text-sm font-medium text-gray-600">Lotes Vacinados</p>
              <p className="text-2xl font-bold text-gray-900">
                {lotes.filter(lote => lote.vacinado).length}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {lotes.map((lote) => (
          <div key={lote.id} className="bg-white rounded-lg shadow border overflow-hidden">
            {/* Header do Card */}
            <div className="bg-green-600 text-white p-4 cursor-pointer hover:bg-green-700 transition-colors">
              <Link href={`/adm/lote/${lote.id}`}>
                <div>
                  <h3 className="text-xl font-bold">{lote.codigo}</h3>
                  <p className="text-green-100 text-sm">Clique para ver estatísticas</p>
                </div>
              </Link>
            </div>

            {/* Conteúdo do Card */}
            <div className="p-4 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Quantidade de Bois:</span>
                <span className="font-bold text-lg text-gray-900">{lote.quantidadeBois}</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-gray-600">Peso Médio:</span>
                <span className="font-bold text-lg text-blue-600">
                  {lote.pesoMedio.toFixed(1)} kg
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-gray-600">Vacinação:</span>
                <span className={`font-bold text-lg ${lote.vacinado ? 'text-green-600' : 'text-red-600'}`}>
                  {lote.vacinado ? 'Vacinado' : 'Não vacinado'}
                </span>
              </div>

              {lote.vacinado && lote.data_vacinacao && (
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Data da Vacinação:</span>
                  <span className="font-bold text-gray-900">
                    {new Date(lote.data_vacinacao).toLocaleDateString('pt-BR')}
                  </span>
                </div>
              )}

              <div className="flex justify-between items-center">
                <span className="text-gray-600">Data de Chegada:</span>
                <span className="font-bold text-gray-900">
                  {new Date(lote.chegada).toLocaleDateString('pt-BR')}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-gray-600">Custo Total:</span>
                <span className="font-bold text-lg text-green-600">
                  R$ {lote.custo.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </span>
              </div>

              {/* Botão de Adicionar Bois */}
              <div className="pt-2 border-t">
                <Link href={`/adm/lote/${lote.id}/adicionar-bois`}>
                  <button className="w-full px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors flex items-center justify-center">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Adicionar Bois
                  </button>
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LotePage;

