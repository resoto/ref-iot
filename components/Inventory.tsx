import React from 'react';
import { Trash2, Plus, AlertCircle, Clock } from 'lucide-react';
import { InventoryItem, Category } from '../types';

interface InventoryProps {
  items: InventoryItem[];
  onRemove: (id: string) => void;
  onAddItem: () => void; // Simplified for demo
}

const Inventory: React.FC<InventoryProps> = ({ items, onRemove, onAddItem }) => {
  
  const getExpiryColor = (days: number) => {
    if (days <= 2) return 'text-red-400 border-red-900 bg-red-900/20';
    if (days <= 5) return 'text-yellow-400 border-yellow-900 bg-yellow-900/20';
    return 'text-green-400 border-green-900 bg-green-900/20';
  };

  return (
    <div className="h-full flex flex-col animate-fade-in">
      <header className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white">Digital Inventory</h2>
          <p className="text-gray-400 text-sm">Manage your supplies</p>
        </div>
        <button 
          onClick={onAddItem}
          className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-all"
        >
          <Plus size={18} />
          Add Item
        </button>
      </header>

      <div className="bg-iot-panel rounded-2xl border border-gray-800 flex-1 overflow-hidden flex flex-col">
        {/* Table Header */}
        <div className="grid grid-cols-12 gap-4 p-4 bg-gray-900/50 border-b border-gray-700 text-xs font-semibold text-gray-400 uppercase tracking-wider">
          <div className="col-span-4">Item Name</div>
          <div className="col-span-2">Category</div>
          <div className="col-span-2 text-center">Quantity</div>
          <div className="col-span-3">Status</div>
          <div className="col-span-1 text-center">Action</div>
        </div>

        {/* Table Body */}
        <div className="overflow-y-auto flex-1 p-2 space-y-1">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-gray-500">
              <Clock size={48} className="mb-4 opacity-20" />
              <p>Your fridge is empty.</p>
              <p className="text-sm">Use Smart Scan to add items.</p>
            </div>
          ) : (
            items.map((item) => {
              const daysLeft = item.daysRemaining ?? 7;
              const statusColor = getExpiryColor(daysLeft);
              
              return (
                <div 
                  key={item.id} 
                  className="grid grid-cols-12 gap-4 p-4 rounded-lg hover:bg-gray-800/50 items-center transition-colors group border border-transparent hover:border-gray-700"
                >
                  <div className="col-span-4">
                    <div className="font-medium text-white">{item.name}</div>
                    <div className="text-xs text-gray-500">ID: {item.id.slice(0,6)}</div>
                  </div>
                  
                  <div className="col-span-2">
                    <span className="px-2 py-1 rounded text-xs bg-gray-800 text-gray-300 border border-gray-700">
                      {item.category}
                    </span>
                  </div>
                  
                  <div className="col-span-2 text-center text-gray-300 font-mono">
                    {item.quantity} <span className="text-xs text-gray-500">{item.unit}</span>
                  </div>
                  
                  <div className="col-span-3">
                    <div className={`flex items-center gap-2 px-3 py-1 rounded-full border w-fit text-xs font-medium ${statusColor}`}>
                      <Clock size={12} />
                      {daysLeft <= 0 ? 'Expired' : `${daysLeft} Days left`}
                    </div>
                  </div>
                  
                  <div className="col-span-1 text-center">
                    <button 
                      onClick={() => onRemove(item.id)}
                      className="text-gray-500 hover:text-red-400 hover:bg-red-900/20 p-2 rounded-full transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default Inventory;