import React from 'react';

// Tipagem dos Dados
export interface LoteComEstatisticas {
    id: number;
    codigo: string;
    chegada: string;
    custo: number;
    data_venda: string | null;
    vacinado: boolean;
    data_vacinacao: string | null;
    quantidadeBois: number;
    pesoMedio: number;
    pesoTotal: number;
}

export interface Venda {
    id: number;
    loteId: number;
    loteName?: string;
    dataVenda: string;
    valor: number;
}

async function fetchLotes(): Promise<LoteComEstatisticas[]> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
    const response = await fetch(`${baseUrl}/api/lotes`, {
      cache: 'no-store'
    });

    if (!response.ok) {
      console.error('Erro ao buscar lotes:', response.status);
      return [];
    }

    return await response.json();
  } catch (error) {
    console.error('Erro ao buscar lotes:', error);
    return [];
  }
}

async function fetchVendas(): Promise<Venda[]> {
  try {
    // Importa o Prisma Client dinamicamente para buscar vendas
    const mod = await import("../../generated/prisma");
    const { PrismaClient } = mod as { PrismaClient: any };

    const g = globalThis as unknown as { prisma?: InstanceType<typeof PrismaClient> };
    g.prisma = g.prisma || new PrismaClient();
    const prisma = g.prisma;

    const vendas = await prisma.venda.findMany({
      include: {
        Lote: {
          select: {
            codigo: true
          }
        }
      },
      orderBy: {
        dataVenda: 'desc'
      },
      take: 10 // Últimas 10 vendas
    });

    return vendas.map((venda: any) => ({
      id: venda.id,
      loteId: venda.loteId,
      loteName: venda.Lote.codigo,
      dataVenda: venda.dataVenda.toISOString(),
      valor: venda.valor
    }));
  } catch (error) {
    console.error('Erro ao buscar vendas:', error);
    return [];
  }
}

export default async function AdminHomePage() {
  // Busca dados reais do banco
  const lotes = await fetchLotes();
  const vendas = await fetchVendas();

  const totalBois = lotes.reduce((acc, lote) => {
    const quantidade = typeof lote.quantidadeBois === 'number' ? lote.quantidadeBois : 0;
    return acc + quantidade;
  }, 0);
  
  const totalVendasValor = vendas.reduce((acc, v) => {
    const valor = typeof v.valor === 'number' ? v.valor : 0;
    return acc + valor;
  }, 0);
  
  const totalLotesVacinados = lotes.filter(lote => lote.vacinado).length;

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-gray-800">Dashboard - Controle de Gado</h2>
      
      {/* Cards de Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-green-600">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Total de Lotes</h3>
          <p className="text-3xl font-bold text-green-600">{lotes.length}</p>
          <p className="text-sm text-gray-500 mt-1">Lotes ativos</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-600">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Total de Bois</h3>
          <p className="text-3xl font-bold text-blue-600">{String(totalBois)}</p>
          <p className="text-sm text-gray-500 mt-1">Cabeças de gado</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-yellow-600">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Total Vendas</h3>
          <p className="text-3xl font-bold text-yellow-600">
            R$ {totalVendasValor.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
          <p className="text-sm text-gray-500 mt-1">{String(vendas.length)} vendas realizadas</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-purple-600">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Lotes Vacinados</h3>
          <p className="text-3xl font-bold text-purple-600">{totalLotesVacinados}</p>
          <p className="text-sm text-gray-500 mt-1">
            {((totalLotesVacinados / Math.max(lotes.length, 1)) * 100).toFixed(1)}% do total
          </p>
        </div>
      </div>

      {/* Seção de Lotes Recentes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Lotes Recentes</h3>
          <div className="space-y-3">
            {lotes.map((lote) => (
              <div key={lote.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-800">{lote.codigo}</p>
                  <p className="text-sm text-gray-600">
                    {lote.quantidadeBois} bois • Chegada: {new Date(lote.chegada).toLocaleDateString('pt-BR')}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-green-600">
                    R$ {lote.custo.toLocaleString('pt-BR')}
                  </p>
                  <p className="text-sm text-gray-500">Custo</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Vendas Recentes</h3>
          <div className="space-y-3">
            {vendas.map((venda) => (
              <div key={venda.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-800">{venda.loteName || `Lote #${venda.loteId}`}</p>
                  <p className="text-sm text-gray-600">
                    Data: {new Date(venda.dataVenda).toLocaleDateString('pt-BR')}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-blue-600">
                    R$ {venda.valor.toLocaleString('pt-BR')}
                  </p>
                  <p className="text-sm text-gray-500">Valor</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}