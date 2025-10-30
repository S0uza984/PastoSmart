'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  Home, 
  Users, 
  BarChart3, 
  LogOut,
  User
} from 'lucide-react';

const Sidebar = () => {
  const pathname = usePathname();
  const router = useRouter();

  const menuItems = [
    {
      name: 'Dashboard',
      href: '/peao',
      icon: Home,
    },
    {
      name: 'Gerenciar Lotes',
      href: '/peao/lote',
      icon: Users,
    },
  ];

  return (
    <div className="bg-green-800 text-white w-64 min-h-screen p-4">
      <div className="flex items-center mb-8">
        <div className="bg-green-600 p-2 rounded-lg mr-3">
          <User className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-xl font-bold">PastoSmart</h1>
          <p className="text-sm text-gray-300">Peão</p>
        </div>
      </div>

      <nav className="space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center px-4 py-3 rounded-lg transition-colors ${
                isActive
                  ? 'bg-green-600 text-white'
                  : 'text-gray-300 hover:bg-green-700 hover:text-white'
              }`}
            >
              <Icon className="h-5 w-5 mr-3" />
              {item.name}
            </Link>
          );
        })}
      </nav>

      <div className="mt-8 pt-4 border-t border-green-700">
        <button onClick={() => router.push('/')} className="flex items-center w-full px-4 py-3 text-gray-300 hover:bg-green-700 hover:text-white rounded-lg transition-colors">
          <LogOut className="h-5 w-5 mr-3" />
          Sair
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
