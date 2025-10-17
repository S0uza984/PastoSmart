'use client';

import React, { useState } from 'react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

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

// Componente para o Detalhe do Lote
const LoteDetalhe: React.FC<{ lote: Lote, setSelectedLote: (id: number | null) => void }> = ({ lote, setSelectedLote }) => {
    const pesoMedioLote = lote.bois.reduce((acc: number, boi: Boi) => acc + boi.peso, 0) / lote.bois.length;
    const boisVacinados = lote.bois.filter((boi: Boi) => boi.vacinado).length;
    const percentualVacinados = ((boisVacinados / lote.bois.length) * 100).toFixed(1);

    // Dados para gráficos
    const dadosPeso = lote.bois.map((boi: Boi) => ({
        nome: `Boi #${boi.id}`,
        peso: boi.peso
    }));

    const dadosVacinacao = [
        { name: 'Vacinados', value: boisVacinados, color: '#10b981' },
        { name: 'Não Vacinados', value: lote.bois.length - boisVacinados, color: '#ef4444' }
    ];

    const estatisticasGerais = [
        { nome: 'Peso Médio', valor: pesoMedioLote.toFixed(1), unidade: 'kg' },
        { nome: 'Peso Total', valor: lote.bois.reduce((acc: number, boi: Boi) => acc + boi.peso, 0).toFixed(1), unidade: 'kg' },
        { nome: 'Custo/Kg', valor: (lote.custo / lote.bois.reduce((acc: number, boi: Boi) => acc + boi.peso, 0)).toFixed(2), unidade: 'R$' }
    ];


    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold text-gray-800">Estatísticas - {lote.nome}</h2>
          <button
            onClick={() => setSelectedLote(null)}
            className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
          >
            ← Voltar aos Lotes
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-green-600">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Peso Médio do Lote</h3>
            <p className="text-4xl font-bold text-green-600">{pesoMedioLote.toFixed(2)} kg</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-600">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Total de Bois</h3>
            <p className="text-4xl font-bold text-blue-600">{lote.bois.length}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-purple-600">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Bois Vacinados</h3>
            <p className="text-4xl font-bold text-purple-600">
              {lote.bois.filter(b => b.vacinado).length}/{lote.bois.length}
            </p>
          </div>
        </div>

        {/* Gráficos do Lote */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Gráfico de Peso Individual */}
            <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold text-gray-700 mb-4">Peso Individual dos Bois</h3>
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={dadosPeso}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis 
                            dataKey="nome" 
                            angle={-45}
                            textAnchor="end"
                            height={80}
                            fontSize={12}
                        />
                        <YAxis label={{ value: 'Peso (kg)', angle: -90, position: 'insideLeft' }} />
                        <Tooltip formatter={(value) => [`${value} kg`, 'Peso']} />
                        <Bar dataKey="peso" fill="#3b82f6" />
                    </BarChart>
                </ResponsiveContainer>
            </div>

            {/* Gráfico de Vacinação */}
            <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold text-gray-700 mb-4">Status de Vacinação</h3>
                <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                        <Pie
                            data={dadosVacinacao}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={100}
                            paddingAngle={5}
                            dataKey="value"
                        >
                            {dadosVacinacao.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                        </Pie>
                        <Tooltip formatter={(value, name) => [`${value} bois`, name]} />
                        <Legend />
                    </PieChart>
                </ResponsiveContainer>
                <div className="mt-4 text-center">
                    <p className="text-lg font-semibold text-gray-700">
                        {percentualVacinados}% dos bois estão vacinados
                    </p>
                </div>
            </div>
        </div>

        {/* Estatísticas Gerais */}
        <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold text-gray-700 mb-4">Estatísticas Detalhadas</h3>
            <ResponsiveContainer width="100%" height={250}>
                <BarChart data={estatisticasGerais} layout="horizontal">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="nome" type="category" width={100} />
                    <Tooltip formatter={(value, name, props) => [`${value} ${props.payload.unidade}`, name]} />
                    <Bar dataKey="valor" fill="#10b981" />
                </BarChart>
            </ResponsiveContainer>
        </div>

        {/* Tabela de Detalhes dos Bois */}
        <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold text-gray-700 mb-4">Detalhes dos Bois</h3>
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-green-600 text-white">
                    <tr>
                        <th className="px-6 py-3 text-left">Boi</th>
                        <th className="px-6 py-3 text-right">Peso (kg)</th>
                        <th className="px-6 py-3 text-center">Vacinado</th>
                        <th className="px-6 py-3 text-left">Data Vacinação</th>
                    </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                    {lote.bois.map((boi, idx) => (
                        <tr key={boi.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">Boi {idx + 1}</td>
                        <td className="px-6 py-4 text-right font-semibold">{boi.peso}</td>
                        <td className="px-6 py-4 text-center">
                            <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                            boi.vacinado ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                            }`}>
                            {boi.vacinado ? '✓ Sim' : '✗ Não'}
                            </span>
                        </td>
                        <td className="px-6 py-4">
                            {boi.vacinado && boi.dataVacinacao 
                            ? new Date(boi.dataVacinacao).toLocaleDateString('pt-BR')
                            : '-'}
                        </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>

        {/* Informações Financeiras do Lote */}
        <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold text-gray-700 mb-4">Informações do Lote</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <p className="text-sm text-gray-600">Data de Chegada</p>
                    <p className="text-lg font-semibold">{new Date(lote.dataChegada).toLocaleDateString('pt-BR')}</p>
                </div>
                <div>
                    <p className="text-sm text-gray-600">Custo do Lote</p>
                    <p className="text-lg font-semibold">R$ {lote.custo.toLocaleString('pt-BR')}</p>
                </div>
                <div>
                    <p className="text-sm text-gray-600">Custo por Boi (Médio)</p>
                    <p className="text-lg font-semibold">R$ {(lote.custo / lote.bois.length).toLocaleString('pt-BR', { maximumFractionDigits: 2 })}</p>
                </div>
                <div>
                    <p className="text-sm text-gray-600">Custo por Kg (Médio)</p>
                    <p className="text-lg font-semibold">
                        R$ {(lote.custo / (pesoMedioLote * lote.bois.length)).toLocaleString('pt-BR', { maximumFractionDigits: 2 })}
                    </p>
                </div>
            </div>
        </div>
      </div>
    );
};

// Componente da Lista de Lotes
const LoteLista: React.FC<{ lotes: Lote[]; setSelectedLote: (id: number | null) => void; setCurrentPage: (page: string) => void }> = ({ lotes, setSelectedLote, setCurrentPage }) => {
    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold text-gray-800">Gerenciar Lotes</h2>
            
            {/* Gráficos Comparativos */}
            {lotes.length > 0 && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Gráfico Comparativo de Bois por Lote */}
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h3 className="text-xl font-semibold text-gray-700 mb-4">Quantidade de Bois por Lote</h3>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={lotes.map((lote: Lote) => ({
                                nome: lote.nome,
                                bois: lote.bois.length,
                                vacinados: lote.bois.filter((boi: Boi) => boi.vacinado).length
                            }))}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="nome" angle={-45} textAnchor="end" height={80} />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="bois" fill="#3b82f6" name="Total de Bois" />
                                <Bar dataKey="vacinados" fill="#10b981" name="Bois Vacinados" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Gráfico de Peso Médio por Lote */}
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h3 className="text-xl font-semibold text-gray-700 mb-4">Peso Médio por Lote</h3>
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={lotes.map((lote: Lote) => ({
                                nome: lote.nome,
                                pesoMedio: lote.bois.reduce((acc: number, boi: Boi) => acc + boi.peso, 0) / lote.bois.length
                            }))}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="nome" />
                                <YAxis label={{ value: 'Peso Médio (kg)', angle: -90, position: 'insideLeft' }} />
                                <Tooltip formatter={(value) => [`${Number(value).toFixed(1)} kg`, 'Peso Médio']} />
                                <Line type="monotone" dataKey="pesoMedio" stroke="#f59e0b" strokeWidth={3} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {lotes.map(lote => {
                    const pesoMedio = lote.bois.reduce((acc, b) => acc + b.peso, 0) / lote.bois.length;
                    const vacinados = lote.bois.filter(b => b.vacinado).length;
                    
                    return (
                        <div 
                            key={lote.id} 
                            className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer overflow-hidden"
                            onClick={() => setSelectedLote(lote.id)}
                        >
                            <div className="bg-gradient-to-r from-green-600 to-green-700 p-4">
                                <h3 className="text-2xl font-bold text-white">{lote.nome}</h3>
                                <p className="text-green-100 text-sm">Clique para ver estatísticas</p>
                            </div>
                            
                            <div className="p-6 space-y-3">
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600">Quantidade de Bois:</span>
                                    <span className="font-bold text-lg text-gray-800">{lote.bois.length}</span>
                                </div>
                                
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600">Peso Médio:</span>
                                    <span className="font-bold text-lg text-blue-600">{pesoMedio.toFixed(2)} kg</span>
                                </div>
                                
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600">Vacinados:</span>
                                    <span className="font-bold text-lg text-purple-600">{vacinados}/{lote.bois.length}</span>
                                </div>
                                
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600">Data de Chegada:</span>
                                    <span className="font-semibold text-gray-700">
                                        {new Date(lote.dataChegada).toLocaleDateString('pt-BR')}
                                    </span>
                                </div>
                                
                                <div className="flex justify-between items-center pt-2 border-t border-gray-200">
                                    <span className="text-gray-600">Custo Total:</span>
                                    <span className="font-bold text-lg text-green-600">
                                        R$ {lote.custo.toLocaleString('pt-BR')}
                                    </span>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {lotes.length === 0 && (
                <div className="bg-white p-12 rounded-lg shadow-md text-center">
                    <p className="text-gray-500 text-lg">Nenhum lote cadastrado ainda.</p>
                    <button
                        onClick={() => setCurrentPage('adicionar')}
                        className="mt-4 bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
                    >
                        Adicionar Primeiro Lote
                    </button>
                </div>
            )}
        </div>
    );
};


export default function LotesPage() {
    const [selectedLote, setSelectedLote] = useState<number | null>(null);

    // Dados mockados - depois você pode buscar do banco de dados
    const lotes: Lote[] = [
        {
            id: 1,
            nome: "Lote A - Nelore",
            dataChegada: "2024-01-15",
            custo: 50000,
            bois: [
                { id: 1, peso: 450, vacinado: true, dataVacinacao: "2024-01-20" },
                { id: 2, peso: 480, vacinado: true, dataVacinacao: "2024-01-20" },
                { id: 3, peso: 425, vacinado: false, dataVacinacao: null },
                { id: 4, peso: 465, vacinado: true, dataVacinacao: "2024-01-22" }
            ]
        },
        {
            id: 2,
            nome: "Lote B - Angus",
            dataChegada: "2024-02-10",
            custo: 75000,
            bois: [
                { id: 5, peso: 520, vacinado: true, dataVacinacao: "2024-02-15" },
                { id: 6, peso: 495, vacinado: true, dataVacinacao: "2024-02-15" },
                { id: 7, peso: 485, vacinado: false, dataVacinacao: null },
                { id: 8, peso: 510, vacinado: true, dataVacinacao: "2024-02-17" },
                { id: 9, peso: 475, vacinado: false, dataVacinacao: null }
            ]
        },
        {
            id: 3,
            nome: "Lote C - Brahman",
            dataChegada: "2024-03-05",
            custo: 60000,
            bois: [
                { id: 10, peso: 440, vacinado: true, dataVacinacao: "2024-03-10" },
                { id: 11, peso: 455, vacinado: true, dataVacinacao: "2024-03-10" },
                { id: 12, peso: 470, vacinado: true, dataVacinacao: "2024-03-12" }
            ]
        }
    ];

    const lote = lotes.find((l: Lote) => l.id === selectedLote);

    if (selectedLote && lote) {
        return <LoteDetalhe lote={lote} setSelectedLote={setSelectedLote} />;
    }

    return <LoteLista lotes={lotes} setSelectedLote={setSelectedLote} setCurrentPage={() => { /* Lógica de redirecionamento */ }} />;
}