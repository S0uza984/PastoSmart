'use client';

import React from 'react';

// Tipagem dos Dados
interface Venda {
    id: number;
    loteId: number;
    loteName: string;
    data: string;
    valor: number;
}

interface Lote {
    id: number;
    nome: string;
    dataChegada: string;
    custo: number;
    bois: { id: number; peso: number; vacinado: boolean; dataVacinacao: string | null; }[];
}

export default function VendasPage() {
  // Dados mockados - depois você pode buscar do banco de dados
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
        { id: 4, peso: 495, vacinado: true, dataVacinacao: "2024-02-15" }
      ]
    }
  ];

  const [vendas, setVendas] = React.useState<Venda[]>([
    { id: 1, loteId: 1, loteName: "Lote A", data: "2024-02-01", valor: 75000 },
    { id: 2, loteId: 2, loteName: "Lote B", data: "2024-03-15", valor: 125000 }
  ]);
  // Estados locais para o formulário de nova venda (idealmente gerenciado aqui)
  const [dataVenda, setDataVenda] = React.useState('');
  const [loteVendidoId, setLoteVendidoId] = React.useState('');
  const [valorVenda, setValorVenda] = React.useState('');

  const handleRegistrarVenda = () => {
    if (dataVenda && loteVendidoId && valorVenda) {
      const loteEncontrado = lotes.find(l => l.id === parseInt(loteVendidoId));
      const novaVenda: Venda = {
        id: vendas.length + 1,
        loteId: parseInt(loteVendidoId),
        loteName: loteEncontrado?.nome || 'Lote Desconhecido',
        data: dataVenda,
        valor: parseFloat(valorVenda)
      };
      
      setVendas([...vendas, novaVenda]);
      setDataVenda('');
      setLoteVendidoId('');
      setValorVenda('');
      alert('Venda registrada com sucesso!');
    } else {
      alert('Preencha todos os campos da venda.');
    }
  };

  const totalVendas = vendas.reduce((acc, venda) => acc + venda.valor, 0);
  const vendaMedia = vendas.length > 0 ? totalVendas / vendas.length : 0;

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-gray-800">Vendas Realizadas</h2>
      
      {/* Cards de Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-green-600">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Total de Vendas</h3>
          <p className="text-2xl font-bold text-green-600">{vendas.length}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-600">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Valor Total</h3>
          <p className="text-2xl font-bold text-blue-600">
            R$ {totalVendas.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-yellow-600">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Venda Média</h3>
          <p className="text-2xl font-bold text-yellow-600">
            R$ {vendaMedia.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </p>
        </div>
      </div>
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="w-full">
          <thead className="bg-green-600 text-white">
            <tr>
              <th className="px-6 py-3 text-left">Data da Venda</th>
              <th className="px-6 py-3 text-left">Lote Vendido</th>
              <th className="px-6 py-3 text-right">Valor (R$)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {vendas.map((venda) => (
              <tr key={venda.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">{new Date(venda.data).toLocaleDateString('pt-BR')}</td>
                <td className="px-6 py-4">{venda.loteName}</td>
                <td className="px-6 py-4 text-right font-semibold">
                  R$ {venda.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold text-gray-700 mb-4">Adicionar Nova Venda</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Data da Venda</label>
            <input 
              type="date" 
              value={dataVenda}
              onChange={(e) => setDataVenda(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500" 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Lote</label>
            <select 
              value={loteVendidoId}
              onChange={(e) => setLoteVendidoId(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
            >
              <option value="">Selecione o lote</option>
              {lotes.map(lote => (
                <option key={lote.id} value={lote.id}>{lote.nome}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Valor (R$)</label>
            <input 
              type="number" 
              value={valorVenda}
              onChange={(e) => setValorVenda(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500" 
              placeholder="0,00" 
            />
          </div>
        </div>
        <button 
          onClick={handleRegistrarVenda}
          className="mt-4 bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
        >
          Registrar Venda
        </button>
      </div>
    </div>
  );
};