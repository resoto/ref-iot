import React from 'react';
import { LayoutDashboard, List, Camera, ChefHat, Settings } from 'lucide-react';
import { ViewState } from '../types';

interface SidebarProps {
  currentView: ViewState;
  onChangeView: (view: ViewState) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, onChangeView }) => {
  const navItems = [
    { id: ViewState.DASHBOARD, icon: LayoutDashboard, label: 'Overview' },
    { id: ViewState.INVENTORY, icon: List, label: 'Inventory' },
    { id: ViewState.CAMERA, icon: Camera, label: 'Smart Scan' },
    { id: ViewState.RECIPES, icon: ChefHat, label: 'AI Chef' },
    { id: ViewState.SETTINGS, icon: Settings, label: 'Settings' },
  ];

  return (
    <div className="w-20 md:w-64 bg-iot-panel border-r border-gray-800 flex flex-col h-full transition-all duration-300">
      <div className="p-6 flex items-center justify-center md:justify-start gap-3">
        <div className="w-8 h-8 bg-gradient-to-br from-iot-accent to-blue-600 rounded-lg shadow-lg shadow-blue-500/30"></div>
        <h1 className="hidden md:block text-xl font-bold text-white tracking-wider">FROST<span className="text-iot-accent">AI</span></h1>
      </div>
      
      <nav className="flex-1 py-6 flex flex-col gap-2 px-3">
        {navItems.map((item) => {
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onChangeView(item.id)}
              className={`
                flex items-center gap-4 p-3 rounded-xl transition-all duration-200
                ${isActive 
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/50 translate-x-1' 
                  : 'text-gray-400 hover:bg-gray-800 hover:text-gray-200'
                }
              `}
            >
              <item.icon size={24} strokeWidth={isActive ? 2.5 : 2} />
              <span className={`hidden md:block font-medium ${isActive ? 'text-white' : ''}`}>
                {item.label}
              </span>
              {isActive && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white hidden md:block"></div>}
            </button>
          );
        })}
      </nav>

      <div className="p-4 text-xs text-gray-600 text-center md:text-left">
         <p className="hidden md:block">v2.5.0 System Online</p>
      </div>
    </div>
  );
};

export default Sidebar;