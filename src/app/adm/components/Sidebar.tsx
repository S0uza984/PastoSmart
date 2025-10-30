'use client';

import React from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Home, ShoppingCart, BarChart3, LogOut } from 'lucide-react';

// Tipagem das Props
interface SidebarProps {
  userType: 'adm' | 'peao';
  isSidebarOpen: boolean;
  setIsSidebarOpen: (isOpen: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  userType,
  isSidebarOpen,
  setIsSidebarOpen,
}) => {
  const router = useRouter();
  const pathname = usePathname();
  
  const menuItems = userType === 'adm'
    ? [
        { icon: Home, label: 'Início', route: '/adm' },
        { icon: ShoppingCart, label: 'Vendas', route: '/adm/vendas' },
        { icon: BarChart3, label: 'Lotes', route: '/adm/lote' }
      ]
    : [
        { icon: Home, label: 'Início', route: '/adm' },
        { icon: BarChart3, label: 'Lotes', route: '/adm/lote' }
      ];

  const handleLogout = () => {
    // Aqui Siscaro pode adicionar lógica de logout (limpar tokens, etc.)
    router.push('/');
  };

  return (
    <div className={`${isSidebarOpen ? 'w-64' : 'w-0'} bg-green-800 text-white transition-all duration-300 overflow-hidden flex-shrink-0`}>
      <div className="p-6">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-xl font-bold">🐄 Sistema Gado</h1>
        </div>
        
        <div className="mb-6 p-3 bg-green-700 rounded-lg">
          <p className="text-sm font-semibold">Tipo de Usuário</p>
          <p className="text-lg">{userType === 'adm' ? '👨‍💼 Administrador' : '👷 Peão'}</p>
        </div>

        <nav className="space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.route}
              onClick={() => {
                router.push(item.route);
                // Opcional: Fechar sidebar em telas pequenas após clique
                if (window.innerWidth < 768) {
                  setIsSidebarOpen(false);
                }
              }}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                pathname === item.route ? 'bg-green-600' : 'hover:bg-green-700'
              }`}
            >
              <item.icon size={20} />
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        <button
          onClick={handleLogout}
          className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-green-700 mt-8 transition-colors"
        >
          <LogOut size={20} />
          <span>Sair</span>
        </button>
      </div>
    </div>
  );
};