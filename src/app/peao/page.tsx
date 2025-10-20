'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Users, TrendingUp, Calendar, DollarSign, BarChart3 } from 'lucide-react';

interface Estatisticas {
  totalLotes: number;
  totalBois: number;
  pesoMedioGeral: number;
  lotesVacinados: number;
}

const PeaoPage = () => {
  const [estatisticas, setEstatisticas] = useState<Estatisticas>({
    totalLotes: 0,
    totalBois: 0,
    pesoMedioGeral: 0,
    lotesVacinados: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEstatisticas();
  }, []);

  const fetchEstatisticas = async () => {
    try {
      const response = await fetch('/api/lotes');
      if (response.ok) {
        const lotes = await response.json();
        
        const totalLotes = lotes.length;
        const totalBois = lotes.reduce((acc: number, lote: any) => acc + lote.quantidadeBois, 0);
        const pesoMedioGeral = totalBois > 0 
          ? lotes.reduce((acc: number, lote: any) => acc + (lote.pesoMedio * lote.quantidadeBois), 0) / totalBois
          : 0;
        const lotesVacinados = lotes.filter((lote: any) => lote.vacinado).length;

        setEstatisticas({
          totalLotes,
          totalBois,
          pesoMedioGeral,
          lotesVacinados
        });
      }
    } catch (error) {
      console.error('Erro ao carregar estatísticas:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex justify-center items-center h-64">
          <div className="text-lg text-gray-600">Carregando dashboard...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard - Peão</h1>
        <p className="text-gray-600">Visão geral dos lotes e bois sob sua responsabilidade</p>
      </div>

      {/* Cards de Estatísticas */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <div className="bg-white p-6 rounded-lg shadow border">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total de Lotes</p>
              <p className="text-2xl font-bold text-gray-900">{estatisticas.totalLotes}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow border">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <Users className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total de Bois</p>
              <p className="text-2xl font-bold text-gray-900">{estatisticas.totalBois}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow border">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <TrendingUp className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Peso Médio Geral</p>
              <p className="text-2xl font-bold text-gray-900">{estatisticas.pesoMedioGeral.toFixed(1)} kg</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow border">
          <div className="flex items-center">
            <div className="p-2 bg-orange-100 rounded-lg">
              <Calendar className="h-6 w-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Lotes Vacinados</p>
              <p className="text-2xl font-bold text-gray-900">{estatisticas.lotesVacinados}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Ações Rápidas */}
      <div className="grid gap-6 md:grid-cols-2">
        <div className="bg-white p-6 rounded-lg shadow border">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Ações Rápidas</h3>
          <div className="space-y-3">
            <Link href="/peao/lote">
              <button className="w-full text-left px-4 py-3 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg transition-colors">
                <div className="flex items-center">
                  <Users className="h-5 w-5 mr-3" />
                  <div>
                    <p className="font-medium">Gerenciar Lotes</p>
                    <p className="text-sm text-blue-600">Visualizar e gerenciar lotes</p>
                  </div>
                </div>
              </button>
            </Link>
            
            <Link href="/peao/estatisticas">
              <button className="w-full text-left px-4 py-3 bg-green-50 hover:bg-green-100 text-green-700 rounded-lg transition-colors">
                <div className="flex items-center">
                  <BarChart3 className="h-5 w-5 mr-3" />
                  <div>
                    <p className="font-medium">Ver Estatísticas</p>
                    <p className="text-sm text-green-600">Análises e relatórios</p>
                  </div>
                </div>
              </button>
            </Link>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow border">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Informações Importantes</h3>
          <div className="space-y-3">
            <div className="flex items-center text-sm text-gray-600">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
              Sistema funcionando normalmente
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
              {estatisticas.totalBois} bois em acompanhamento
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <div className="w-2 h-2 bg-orange-500 rounded-full mr-3"></div>
              {estatisticas.lotesVacinados} lotes vacinados
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PeaoPage;
