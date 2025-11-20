import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import Inventory from './components/Inventory';
import SmartCamera from './components/SmartCamera';
import RecipeGenerator from './components/RecipeGenerator';
import { ViewState, InventoryItem, Category, SensorData } from './types';

// Mock initial Data
const MOCK_INVENTORY: InventoryItem[] = [
  { id: '1', name: 'Milk', quantity: 1, unit: 'carton', category: Category.DAIRY, expiryDate: new Date(Date.now() + 2 * 86400000).toISOString().split('T')[0], daysRemaining: 2 },
  { id: '2', name: 'Eggs', quantity: 12, unit: 'pcs', category: Category.DAIRY, expiryDate: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0], daysRemaining: 7 },
  { id: '3', name: 'Spinach', quantity: 1, unit: 'bag', category: Category.PRODUCE, expiryDate: new Date(Date.now() + 1 * 86400000).toISOString().split('T')[0], daysRemaining: 1 },
  { id: '4', name: 'Chicken Breast', quantity: 500, unit: 'g', category: Category.MEAT, expiryDate: new Date(Date.now() + 3 * 86400000).toISOString().split('T')[0], daysRemaining: 3 },
];

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>(ViewState.DASHBOARD);
  const [inventory, setInventory] = useState<InventoryItem[]>(MOCK_INVENTORY);
  const [sensorData, setSensorData] = useState<SensorData[]>([]);

  // Simulate Sensor Data Feed
  useEffect(() => {
    const generateData = () => {
      const now = new Date();
      const data: SensorData[] = [];
      for (let i = 0; i < 24; i++) {
        data.push({
          time: `${i}:00`,
          fridgeTemp: 3 + Math.random() * 1, // 3.0 - 4.0
          freezerTemp: -18 + Math.random() * 2, // -18 to -16
          humidity: 40 + Math.random() * 5,
          powerUsage: 100 + Math.random() * 40,
        });
      }
      setSensorData(data);
    };
    generateData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleRemoveItem = (id: string) => {
    setInventory(prev => prev.filter(i => i.id !== id));
  };

  const handleAddItem = () => {
    // Manual add mock
    const newItem: InventoryItem = {
      id: Math.random().toString(36).substr(2, 9),
      name: 'New Item',
      quantity: 1,
      unit: 'pcs',
      category: Category.OTHER,
      expiryDate: new Date().toISOString().split('T')[0],
      daysRemaining: 7
    };
    setInventory([...inventory, newItem]);
  };

  const handleItemsDetected = (detectedItems: Partial<InventoryItem>[]) => {
    const newItems = detectedItems.map(item => ({
      id: Math.random().toString(36).substr(2, 9),
      name: item.name || 'Unknown',
      quantity: item.quantity || 1,
      unit: item.unit || 'pcs',
      category: item.category || Category.OTHER,
      expiryDate: item.expiryDate || new Date().toISOString().split('T')[0],
      daysRemaining: item.daysRemaining || 7 // Ideally calculate from date
    } as InventoryItem));

    setInventory(prev => [...newItems, ...prev]);
    alert(`Added ${newItems.length} items from scan!`);
    setView(ViewState.INVENTORY);
  };

  const renderContent = () => {
    switch (view) {
      case ViewState.DASHBOARD:
        return <Dashboard sensorData={sensorData} inventory={inventory} />;
      case ViewState.INVENTORY:
        return <Inventory items={inventory} onRemove={handleRemoveItem} onAddItem={handleAddItem} />;
      case ViewState.CAMERA:
        return <SmartCamera onItemsDetected={handleItemsDetected} />;
      case ViewState.RECIPES:
        return <RecipeGenerator inventory={inventory} />;
      case ViewState.SETTINGS:
        return <div className="text-center text-gray-500 mt-20">Settings Module Placeholder</div>;
      default:
        return <Dashboard sensorData={sensorData} inventory={inventory} />;
    }
  };

  return (
    <div className="flex h-screen bg-iot-dark text-slate-200 font-sans overflow-hidden selection:bg-iot-accent selection:text-white">
      <Sidebar currentView={view} onChangeView={setView} />
      <main className="flex-1 overflow-y-auto p-4 md:p-8 relative">
        {/* Header Gradient Effect */}
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-blue-900/10 to-transparent pointer-events-none" />
        
        <div className="max-w-7xl mx-auto h-full">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default App;