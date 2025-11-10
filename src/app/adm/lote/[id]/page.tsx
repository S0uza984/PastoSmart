'use client';

import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
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
  gasto_alimentacao?: number | null; // <-- novo campo
  vacinado: boolean;
  data_vacinacao: string | null;
  quantidadeBois: number;
  pesoMedio: number;
  pesoTotal: number;
  bois: Boi[];
}

const LoteDetailsPage = () => {
  const params = useParams();
  const loteId = parseInt(params.id as string);
  const [lote, setLote] = useState<Lote | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditingLote, setIsEditingLote] = useState(false);
  const [editLoteForm, setEditLoteForm] = useState({
    codigo: '',
    chegada: '',
    custo: '',
    gasto_alimentacao: '', // <-- novo campo no form (string para input)
    vacinado: false,
    data_vacinacao: ''
  });
  const [editingBoiId, setEditingBoiId] = useState<number | null>(null);
  const [editBoiForm, setEditBoiForm] = useState({ peso: '', status: '', alerta: '' });
  const [filteredBois, setFilteredBois] = useState<Boi[]>([]);

  useEffect(() => {
    fetchLote();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loteId]);

  const fetchLote = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/lotes/${loteId}`);
      if (!response.ok) {
        throw new Error('Erro ao carregar lote');
      }
      const data = await response.json();
      setLote(data);
      setEditLoteForm({
        codigo: data.codigo || '',
        chegada: data.chegada ? new Date(data.chegada).toISOString().slice(0, 10) : '',
        custo: String(data.custo ?? ''),
        gasto_alimentacao: data.gasto_alimentacao != null ? String(data.gasto_alimentacao) : '',
        vacinado: Boolean(data.vacinado),
        data_vacinacao: data.data_vacinacao ? new Date(data.data_vacinacao).toISOString().slice(0, 10) : ''
      });
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
    { key: 'status', label: 'Status', type: 'select', options: [
      { value: 'ativo', label: 'Ativo' },
      { value: 'inativo', label: 'Inativo' },
      { value: 'vendido', label: 'Vendido' }
    ]}
  ];

  // --- Funções para calcular e formatar próximo reforço (+1 ano) ---
  const calcNextReforco = (isoDate: string | null | undefined): Date | null => {
    if (!isoDate) return null;
    const d = new Date(isoDate);
    if (Number.isNaN(d.getTime())) return null;
    d.setFullYear(d.getFullYear() + 1);
    return d;
  };

  const formatPtBr = (d: Date | null | undefined) => {
    if (!d) return '—';
    return d.toLocaleDateString('pt-BR');
  };
  // --- fim funções ---

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex justify-center items-center h-64">
          <div className="text-lg text-gray-600">Carregando lote...</div>
        </div>
      </div>
    );
  }

  if (error || !lote) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold text-red-600">
          {error || 'Lote não encontrado'}
        </h1>
        <Link href="/adm/lote">
          <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
            Voltar para Lotes
          </button>
        </Link>
      </div>
    );
  }

  // calcula next reforço para exibição
  const nextReforco = calcNextReforco(lote.data_vacinacao);
  const reforcoAtrasado = nextReforco ? new Date() >= nextReforco : false;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Estatísticas - {lote.codigo}</h1>
          <p className="text-gray-600">Detalhes e estatísticas do lote</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => setIsEditingLote(true)} className="px-4 py-2 bg-amber-500 text-white rounded hover:bg-amber-600">Editar Lote</button>
          <Link href="/adm/lote">
            <button className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50">
              Voltar para Lotes
            </button>
          </Link>
        </div>
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
            <p className="text-sm font-medium text-gray-600">Vacinação</p>
            <p className={`text-lg font-bold ${lote.vacinado ? 'text-green-600' : 'text-red-600'}`}>
              {lote.vacinado ? 'Vacinado' : 'Não vacinado'}
            </p>

            {lote.vacinado && (
              <>
                {/* data da vacinação, se existir */}
                <p className="text-sm text-gray-500 mt-1">
                  {lote.data_vacinacao ? new Date(lote.data_vacinacao).toLocaleDateString('pt-BR') : '—'}
                </p>

                {/* exibe próximo reforço (+1 ano) */}
                <p className="text-sm text-gray-700 mt-1">
                  <strong>Próximo reforço:</strong>{' '}
                  <span className="font-semibold">{formatPtBr(nextReforco)}</span>
                  {nextReforco && (
                    reforcoAtrasado ? (
                      <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full ml-2">Reforço Atrasado</span>
                    ) : (
                      <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full ml-2">OK</span>
                    )
                  )}
                </p>
              </>
            )}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow border">
          <div className="text-center">
            <p className="text-sm font-medium text-gray-600">Data de Chegada</p>
            <p className="text-lg font-bold text-gray-900">
              {new Date(lote.chegada).toLocaleDateString('pt-BR')}
            </p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow border">
          <div className="text-center">
            <p className="text-sm font-medium text-gray-600">Custo Compra do Lote</p>
            <p className="text-2xl font-bold text-green-600">
              R$ {lote.custo.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </p>
            {/* novo: gasto com alimentação exibido abaixo do custo */}
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
      </div>

      {/* Gráfico de Peso Individual */}
      <div className="bg-white p-6 rounded-lg shadow border mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Peso Individual dos Bois</h3>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={lote.bois.map((boi, index) => ({ 
            nome: `Boi ${index + 1}`, 
            peso: boi.peso 
          }))}>
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
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-900">Lista Detalhada dos Bois</h3>
          <TableFilter
            data={lote.bois}
            columns={filterColumns}
            onFilterChange={setFilteredBois}
          />
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
                      <span className={boi.status === 'Ativo' ? 
                        'bg-green-100 text-green-800 border border-green-300 px-2 py-1 rounded text-xs' : 
                        'bg-yellow-100 text-yellow-800 border border-yellow-300 px-2 py-1 rounded text-xs'
                      }>
                        {boi.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <Link href={`/adm/lote/${loteId}/boi/${boi.id}/pesagem`}>
                          <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                            Ver Evolução
                          </button>
                        </Link>
                        <button
                          onClick={() => {
                            setEditingBoiId(boi.id);
                            setEditBoiForm({ peso: String(boi.peso), status: boi.status, alerta: boi.alerta || '' });
                          }}
                          className="text-amber-600 hover:text-amber-800 text-sm font-medium"
                        >
                          Editar
                        </button>
                      </div>
                    </td>
                  </tr>
                );
                })}
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
      {isEditingLote && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow w-full max-w-lg">
            <div className="p-4 border-b font-semibold">Editar Lote</div>
            <div className="p-4 grid grid-cols-1 gap-4">
              <label className="text-sm">Código
                <input value={editLoteForm.codigo} onChange={(e) => setEditLoteForm(v => ({ ...v, codigo: e.target.value }))} className="mt-1 w-full border rounded px-3 py-2" />
              </label>
              <label className="text-sm">Chegada
                <input type="date" value={editLoteForm.chegada} onChange={(e) => setEditLoteForm(v => ({ ...v, chegada: e.target.value }))} className="mt-1 w-full border rounded px-3 py-2" />
              </label>
              <label className="text-sm">Custo
                <input type="number" step="0.01" value={editLoteForm.custo} onChange={(e) => setEditLoteForm(v => ({ ...v, custo: e.target.value }))} className="mt-1 w-full border rounded px-3 py-2" />
              </label>

              {/* campo novo: gasto com alimentação */}
              <label className="text-sm">Gasto com Alimentação (R$)
                <input
                  type="number"
                  step="0.01"
                  value={editLoteForm.gasto_alimentacao}
                  onChange={(e) => setEditLoteForm(v => ({ ...v, gasto_alimentacao: e.target.value }))
                  }
                  className="mt-1 w-full border rounded px-3 py-2"
                  placeholder="Ex: 1200.50"
                />
              </label>

              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={editLoteForm.vacinado} onChange={(e) => setEditLoteForm(v => ({ ...v, vacinado: e.target.checked }))} />
                Vacinado
              </label>
              {editLoteForm.vacinado && (
                <label className="text-sm">Data de Vacinação
                  <input type="date" value={editLoteForm.data_vacinacao} onChange={(e) => setEditLoteForm(v => ({ ...v, data_vacinacao: e.target.value }))} className="mt-1 w-full border rounded px-3 py-2" />
                </label>
              )}
            </div>
            <div className="p-4 border-t flex justify-end gap-3">
              <button onClick={() => setIsEditingLote(false)} className="px-4 py-2 border rounded">Cancelar</button>
              <button
                onClick={async () => {
                  // prepara payload convertendo strings numéricos
                  const payload = {
                    codigo: editLoteForm.codigo,
                    chegada: editLoteForm.chegada,
                    custo: editLoteForm.custo === '' ? null : Number(editLoteForm.custo),
                    gasto_alimentacao: editLoteForm.gasto_alimentacao === '' ? null : Number(editLoteForm.gasto_alimentacao),
                    vacinado: editLoteForm.vacinado,
                    data_vacinacao: editLoteForm.data_vacinacao || null
                  };
                  const res = await fetch(`/api/lotes/${loteId}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                  });
                  if (res.ok) {
                    setIsEditingLote(false);
                    await fetchLote();
                  } else {
                    alert('Falha ao atualizar lote');
                  }
                }}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              >Salvar</button>
            </div>
          </div>
        </div>
      )}

      {editingBoiId && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow w-full max-w-lg">
            <div className="p-4 border-b font-semibold">Editar Boi #{editingBoiId}</div>
            <div className="p-4 grid grid-cols-1 gap-4">
              <label className="text-sm">Peso (kg)
                <input type="number" step="0.01" value={editBoiForm.peso} onChange={(e) => setEditBoiForm(v => ({ ...v, peso: e.target.value }))} className="mt-1 w-full border rounded px-3 py-2" />
              </label>
              <label className="text-sm">Status
                <input value={editBoiForm.status} onChange={(e) => setEditBoiForm(v => ({ ...v, status: e.target.value }))} className="mt-1 w-full border rounded px-3 py-2" />
              </label>
              <label className="text-sm">Alerta
                <input value={editBoiForm.alerta} onChange={(e) => setEditBoiForm(v => ({ ...v, alerta: e.target.value }))} className="mt-1 w-full border rounded px-3 py-2" />
              </label>
            </div>
            <div className="p-4 border-t flex justify-end gap-3">
              <button onClick={() => setEditingBoiId(null)} className="px-4 py-2 border rounded">Cancelar</button>
              <button
                onClick={async () => {
                  const res = await fetch(`/api/bois/${editingBoiId}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(editBoiForm)
                  });
                  if (res.ok) {
                    setEditingBoiId(null);
                    await fetchLote();
                  } else {
                    alert('Falha ao atualizar boi');
                  }
                }}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              >Salvar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoteDetailsPage;
