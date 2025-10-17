'use client';

import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import Link from 'next/link';
import { useParams } from 'next/navigation';

const LoteDetailsPage = () => {
  const params = useParams();
  const loteId = parseInt(params.id as string);

  // Dados mockados baseados no ID
  const loteData = {
    1: {
      nome: 'Lote A',
      quantidadeBois: 3,
      pesoMedio: 450.00,
      vacinados: 2,
      dataChegada: '30/09/2024',
      custoTotal: 'R$ 50.000',
      bois: [
        { id: 1, nome: 'Boi 1', peso: 445 },
        { id: 2, nome: 'Boi 2', peso: 460 },
        { id: 3, nome: 'Boi 3', peso: 445 }
      ]
    },
    2: {
      nome: 'Lote B',
      quantidadeBois: 2,
      pesoMedio: 495.00,
      vacinados: 2,
      dataChegada: '14/09/2024',
      custoTotal: 'R$ 75.000',
      bois: [
        { id: 4, nome: 'Boi 4', peso: 490 },
        { id: 5, nome: 'Boi 5', peso: 500 }
      ]
    },
    3: {
      nome: 'Lote C',
      quantidadeBois: 4,
      pesoMedio: 425.00,
      vacinados: 4,
      dataChegada: '22/08/2024',
      custoTotal: 'R$ 62.000',
      bois: [
        { id: 6, nome: 'Boi 6', peso: 420 },
        { id: 7, nome: 'Boi 7', peso: 430 },
        { id: 8, nome: 'Boi 8', peso: 425 },
        { id: 9, nome: 'Boi 9', peso: 425 }
      ]
    }
  };

  const lote = loteData[loteId as keyof typeof loteData];

  if (!lote) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold text-red-600">Lote não encontrado</h1>
        <Link href="/adm/lote">
          <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
            Voltar para Lotes
          </button>
        </Link>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Estatísticas - {lote.nome}</h1>
          <p className="text-gray-600">Detalhes e estatísticas do lote</p>
        </div>
        <Link href="/adm/lote">
          <button className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50">
            Voltar para Lotes
          </button>
        </Link>
      </div>

      {/* Cards de Estatísticas */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-5 mb-6">
        <div className="bg-white p-6 rounded-lg shadow border">
          <div className="text-center">
            <p className="text-sm font-medium text-gray-600">Quantidade de Bois</p>
            <p className="text-3xl font-bold text-gray-900">{lote.quantidadeBois}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow border">
          <div className="text-center">
            <p className="text-sm font-medium text-gray-600">Peso Médio</p>
            <p className="text-3xl font-bold text-blue-600">{lote.pesoMedio} kg</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow border">
          <div className="text-center">
            <p className="text-sm font-medium text-gray-600">Vacinados</p>
            <p className="text-3xl font-bold text-purple-600">{lote.vacinados}/{lote.quantidadeBois}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow border">
          <div className="text-center">
            <p className="text-sm font-medium text-gray-600">Data de Chegada</p>
            <p className="text-lg font-bold text-gray-900">{lote.dataChegada}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow border">
          <div className="text-center">
            <p className="text-sm font-medium text-gray-600">Custo Total</p>
            <p className="text-2xl font-bold text-green-600">{lote.custoTotal}</p>
          </div>
        </div>
      </div>

      {/* Gráfico de Peso Individual */}
      <div className="bg-white p-6 rounded-lg shadow border mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Peso Individual dos Bois</h3>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={lote.bois}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="nome" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="peso" fill="#3b82f6" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Tabela de Bois */}
      <div className="bg-white rounded-lg shadow border">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Lista Detalhada dos Bois</h3>
        </div>
        <div className="p-6">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                <tr>
                  <th className="px-6 py-3">ID</th>
                  <th className="px-6 py-3">Nome</th>
                  <th className="px-6 py-3">Peso (kg)</th>
                  <th className="px-6 py-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {lote.bois.map((boi, index) => (
                  <tr key={boi.id} className="bg-white border-b hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium text-gray-900">{boi.id}</td>
                    <td className="px-6 py-4">{boi.nome}</td>
                    <td className="px-6 py-4 font-semibold">{boi.peso} kg</td>
                    <td className="px-6 py-4">
                      <span className={index < lote.vacinados ? 
                        'bg-green-100 text-green-800 border border-green-300 px-2 py-1 rounded text-xs' : 
                        'bg-yellow-100 text-yellow-800 border border-yellow-300 px-2 py-1 rounded text-xs'
                      }>
                        {index < lote.vacinados ? 'Vacinado' : 'Pendente'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Botão para Adicionar Bois */}
      <div className="mt-6 flex justify-center">
        <Link href={`/adm/lote/${loteId}/adicionar-bois`}>
          <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center">
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

export default LoteDetailsPage;
