import React from 'react';

// Tipagem dos Dados
export interface Venda {
    id: number;
    loteId: number;
    loteName: string;
    data: string;
    valor: number;
}

export interface Boi {
    id: number;
    peso: number;
    vacinado: boolean;
    dataVacinacao: string | null;
}

export interface Lote {
    id: number;
    nome: string;
    dataChegada: string;
    custo: number;
    bois: Boi[];
}

export default function AdminHomePage() {
  // Dados mockados temporariamente - depois você pode buscar do banco de dados
  const lotes: Lote[] = [
    {
      id: 1,
      nome: "Lote A",
      dataChegada: "2024-01-15",
      custo: 50000,
      bois: [
        { id: 1, peso: 450, vacinado: true, dataVacinacao: "2024-01-20" },
        { id: 2, peso: 480, vacinado: false, dataVacinacao: null }
      ]
    },
    {
      id: 2,
      nome: "Lote B", 
      dataChegada: "2024-02-10",
      custo: 75000,
      bois: [
        { id: 3, peso: 520, vacinado: true, dataVacinacao: "2024-02-15" },
        { id: 4, peso: 495, vacinado: true, dataVacinacao: "2024-02-15" },
        { id: 5, peso: 465, vacinado: false, dataVacinacao: null }
      ]
    }
  ];

  const vendas: Venda[] = [
    { id: 1, loteId: 1, loteName: "Lote A", data: "2024-02-01", valor: 75000 },
    { id: 2, loteId: 2, loteName: "Lote B", data: "2024-03-15", valor: 125000 }
  ];

  const totalBois = lotes.reduce((acc, lote) => acc + lote.bois.length, 0);
  const totalVendasValor = vendas.reduce((acc, v) => acc + v.valor, 0);
  const totalBoisVacinados = lotes.reduce((acc, lote) => 
    acc + lote.bois.filter(boi => boi.vacinado).length, 0
  );

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
          <p className="text-3xl font-bold text-blue-600">{totalBois}</p>
          <p className="text-sm text-gray-500 mt-1">Cabeças de gado</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-yellow-600">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Total Vendas</h3>
          <p className="text-3xl font-bold text-yellow-600">
            R$ {totalVendasValor.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
          <p className="text-sm text-gray-500 mt-1">{vendas.length} vendas realizadas</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-purple-600">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Bois Vacinados</h3>
          <p className="text-3xl font-bold text-purple-600">{totalBoisVacinados}</p>
          <p className="text-sm text-gray-500 mt-1">
            {((totalBoisVacinados / totalBois) * 100).toFixed(1)}% do rebanho
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
                  <p className="font-medium text-gray-800">{lote.nome}</p>
                  <p className="text-sm text-gray-600">
                    {lote.bois.length} bois • Chegada: {new Date(lote.dataChegada).toLocaleDateString('pt-BR')}
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
                  <p className="font-medium text-gray-800">{venda.loteName}</p>
                  <p className="text-sm text-gray-600">
                    Data: {new Date(venda.data).toLocaleDateString('pt-BR')}
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