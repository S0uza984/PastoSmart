'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

// Tipagem dos Dados
interface Boi {
    id: number;
    peso: number;
    vacinado: boolean;
    dataVacinacao: string | null;
}

interface Lote {
    id: number;
    nome: string;
    dataChegada: string;
    custo: number;
    bois: Boi[];
}

export default function AdicionarLotePage() {
    const router = useRouter();
    const [nomeLote, setNomeLote] = useState('');
    const [dataChegada, setDataChegada] = useState('');
    const [custoLote, setCustoLote] = useState('');
    const [boisLote, setBoisLote] = useState<Omit<Boi, 'id'>[]>([]);
    const [pesoAtual, setPesoAtual] = useState('');
    const [vacinadoAtual, setVacinadoAtual] = useState(false);
    const [dataVacinacao, setDataVacinacao] = useState('');

    const adicionarBoi = () => {
        if (pesoAtual && parseFloat(pesoAtual) > 0) {
            setBoisLote([...boisLote, {
                peso: parseFloat(pesoAtual),
                vacinado: vacinadoAtual,
                dataVacinacao: vacinadoAtual && dataVacinacao ? dataVacinacao : null
            }]);
            setPesoAtual('');
            setVacinadoAtual(false);
            setDataVacinacao('');
        } else {
            alert('Por favor, insira um peso válido para o boi.');
        }
    };

    const removerBoi = (index: number) => {
        setBoisLote(boisLote.filter((_, i) => i !== index));
    };

    const salvarLote = () => {
        if (nomeLote && dataChegada && custoLote && boisLote.length > 0) {
            const newLote: Omit<Lote, 'id'> = {
                nome: nomeLote,
                dataChegada,
                custo: parseFloat(custoLote),
                bois: boisLote.map((boi, index) => ({ ...boi, id: Date.now() + index })), 
            };
            
            // Por enquanto só mostra alerta - depois pode integrar com banco de dados
            console.log('Novo lote:', newLote);
            
            // Resetar estados
            setNomeLote('');
            setDataChegada('');
            setCustoLote('');
            setBoisLote([]);
            
            alert('Lote adicionado com sucesso!');
            router.push('/adm/lotes'); // Redirecionar para a lista de lotes
        } else {
            alert('Preencha todos os campos e adicione pelo menos um boi.');
        }
    };

    const pesoMedio = boisLote.length > 0 
        ? boisLote.reduce((acc, boi) => acc + boi.peso, 0) / boisLote.length 
        : 0;
    
    const boisVacinados = boisLote.filter(boi => boi.vacinado).length;
    const custoNumerico = parseFloat(custoLote) || 0;
    const custoPorBoi = boisLote.length > 0 ? custoNumerico / boisLote.length : 0;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold text-gray-800">Adicionar Novo Lote</h2>
                <button
                    onClick={() => router.push('/adm/lotes')}
                    className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
                >
                    ← Voltar aos Lotes
                </button>
            </div>

            {/* Resumo do Lote em Construção */}
            {(nomeLote || boisLote.length > 0) && (
                <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold text-blue-800 mb-2">Resumo do Lote em Construção</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                            <span className="text-blue-600 font-medium">Nome:</span>
                            <p className="text-gray-800">{nomeLote || 'Não informado'}</p>
                        </div>
                        <div>
                            <span className="text-blue-600 font-medium">Bois:</span>
                            <p className="text-gray-800">{boisLote.length}</p>
                        </div>
                        <div>
                            <span className="text-blue-600 font-medium">Peso Médio:</span>
                            <p className="text-gray-800">{pesoMedio.toFixed(1)} kg</p>
                        </div>
                        <div>
                            <span className="text-blue-600 font-medium">Custo/Boi:</span>
                            <p className="text-gray-800">R$ {custoPorBoi.toFixed(2)}</p>
                        </div>
                    </div>
                </div>
            )}
            
            <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold text-gray-700 mb-4">Informações do Lote</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Nome do Lote</label>
                        <input 
                            type="text" 
                            value={nomeLote}
                            onChange={(e) => setNomeLote(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500" 
                            placeholder="Ex: Lote D - Nelore"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Data de Chegada</label>
                        <input 
                            type="date" 
                            value={dataChegada}
                            onChange={(e) => setDataChegada(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500" 
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Custo Total do Lote (R$)</label>
                        <input 
                            type="number" 
                            value={custoLote}
                            onChange={(e) => setCustoLote(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500" 
                            placeholder="50000"
                            step="0.01"
                        />
                    </div>
                </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold text-gray-700 mb-4">Adicionar Bois ao Lote</h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Peso (kg)</label>
                        <input 
                            type="number" 
                            value={pesoAtual}
                            onChange={(e) => setPesoAtual(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                            placeholder="450"
                            step="0.1"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Vacinado?</label>
                        <select 
                            value={String(vacinadoAtual)}
                            onChange={(e) => setVacinadoAtual(e.target.value === 'true')}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value="false">Não</option>
                            <option value="true">Sim</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Data Vacinação</label>
                        <input 
                            type="date" 
                            value={dataVacinacao}
                            onChange={(e) => setDataVacinacao(e.target.value)}
                            disabled={!vacinadoAtual}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed" 
                        />
                    </div>
                    <div className="flex items-end">
                        <button 
                            onClick={adicionarBoi}
                            className="w-full bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                        >
                            + Adicionar Boi
                        </button>
                    </div>
                </div>

                {boisLote.length > 0 && (
                    <div className="mt-6">
                        <div className="flex justify-between items-center mb-3">
                            <h4 className="font-semibold text-gray-700">Bois Adicionados ({boisLote.length})</h4>
                            <div className="text-sm text-gray-600">
                                Vacinados: {boisVacinados}/{boisLote.length} ({((boisVacinados/boisLote.length)*100).toFixed(1)}%)
                            </div>
                        </div>
                        <div className="bg-gray-50 rounded-lg max-h-80 overflow-y-auto">
                            <div className="grid gap-2 p-4">
                                {boisLote.map((boi, idx) => (
                                    <div key={idx} className="flex justify-between items-center py-3 px-4 bg-white rounded-lg border border-gray-200 hover:border-gray-300 transition-colors">
                                        <div className="flex items-center space-x-4">
                                            <span className="font-medium text-gray-800">Boi #{idx + 1}</span>
                                            <span className="text-gray-600">{boi.peso} kg</span>
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                                boi.vacinado ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                            }`}>
                                                {boi.vacinado ? '✓ Vacinado' : '✗ Não Vacinado'}
                                            </span>
                                            {boi.vacinado && boi.dataVacinacao && (
                                                <span className="text-gray-500 text-sm">
                                                    {new Date(boi.dataVacinacao).toLocaleDateString('pt-BR')}
                                                </span>
                                            )}
                                        </div>
                                        <button
                                            onClick={() => removerBoi(idx)}
                                            className="text-red-600 hover:text-red-800 hover:bg-red-50 p-2 rounded-lg transition-colors"
                                            title="Remover boi"
                                        >
                                            🗑️
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                <div className="mt-6 flex gap-4">
                    <button 
                        onClick={() => {
                            setNomeLote('');
                            setDataChegada('');
                            setCustoLote('');
                            setBoisLote([]);
                            setPesoAtual('');
                            setVacinadoAtual(false);
                            setDataVacinacao('');
                        }}
                        className="flex-1 bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600 transition-colors font-semibold"
                    >
                        Limpar Formulário
                    </button>
                    <button 
                        onClick={salvarLote}
                        disabled={!nomeLote || !dataChegada || !custoLote || boisLote.length === 0}
                        className="flex-2 bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 transition-colors font-semibold disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                        Salvar Lote Completo ({boisLote.length} bois)
                    </button>
                </div>
            </div>
        </div>
    );
}