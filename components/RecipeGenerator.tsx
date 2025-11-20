import React, { useState } from 'react';
import { Send, ChefHat, Sparkles, Loader2 } from 'lucide-react';
import { InventoryItem } from '../types';
import { generateRecipeSuggestion } from '../services/geminiService';

interface RecipeGeneratorProps {
  inventory: InventoryItem[];
}

const RecipeGenerator: React.FC<RecipeGeneratorProps> = ({ inventory }) => {
  const [prompt, setPrompt] = useState('');
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (inventory.length === 0) {
      alert("Your fridge is empty! Add items first.");
      return;
    }
    setLoading(true);
    const recipe = await generateRecipeSuggestion(inventory, prompt);
    setResult(recipe);
    setLoading(false);
  };

  // Simple markdown formatter for the display
  const formatMarkdown = (text: string) => {
    return text.split('\n').map((line, i) => {
      if (line.startsWith('###')) return <h3 key={i} className="text-xl font-bold text-iot-accent mt-4 mb-2">{line.replace('###', '')}</h3>;
      if (line.startsWith('##')) return <h2 key={i} className="text-2xl font-bold text-white mt-6 mb-3">{line.replace('##', '')}</h2>;
      if (line.startsWith('#')) return <h1 key={i} className="text-3xl font-bold text-white mb-4">{line.replace('#', '')}</h1>;
      if (line.startsWith('-')) return <li key={i} className="ml-4 text-gray-300 mb-1">{line.replace('-', '')}</li>;
      if (line.match(/^\d\./)) return <div key={i} className="flex gap-2 mb-2 text-gray-300"><span className="font-bold text-iot-accent">{line.split('.')[0]}.</span> <span>{line.substring(line.indexOf('.') + 1)}</span></div>;
      return <p key={i} className="text-gray-400 mb-2 leading-relaxed">{line}</p>;
    });
  };

  return (
    <div className="h-full flex flex-col lg:flex-row gap-6 animate-fade-in">
      
      {/* Left: Controls */}
      <div className="lg:w-1/3 flex flex-col gap-6">
        <div className="bg-iot-panel p-6 rounded-2xl border border-gray-800">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-purple-900/30 rounded-lg">
              <ChefHat className="text-purple-400" size={24} />
            </div>
            <h2 className="text-xl font-bold text-white">Chef AI</h2>
          </div>
          
          <p className="text-gray-400 text-sm mb-6">
            I'll check your inventory ({inventory.length} items) and create a custom recipe for you.
          </p>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">Dietary / Mood</label>
              <input
                type="text"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="e.g. something spicy, under 20 mins..."
                className="w-full bg-gray-900 border border-gray-700 text-white rounded-xl p-3 focus:outline-none focus:border-iot-accent transition-colors"
                onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
              />
            </div>

            <button
              onClick={handleGenerate}
              disabled={loading}
              className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-purple-900/20 disabled:opacity-50"
            >
              {loading ? <Loader2 className="animate-spin" /> : <Sparkles size={18} />}
              Generate Recipe
            </button>
          </div>
        </div>

        <div className="bg-blue-900/10 border border-blue-800/30 p-4 rounded-xl">
          <h4 className="text-blue-400 text-sm font-semibold mb-2">Inventory Snapshot</h4>
          <div className="flex flex-wrap gap-2">
            {inventory.slice(0, 8).map(item => (
              <span key={item.id} className="text-xs px-2 py-1 bg-blue-900/20 text-blue-300 rounded border border-blue-800/50">
                {item.name}
              </span>
            ))}
            {inventory.length > 8 && <span className="text-xs text-gray-500">+{inventory.length - 8} more</span>}
          </div>
        </div>
      </div>

      {/* Right: Output */}
      <div className="flex-1 bg-iot-panel rounded-2xl border border-gray-800 overflow-hidden flex flex-col relative">
        {!result && !loading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-600 p-8 text-center">
            <ChefHat size={64} className="mb-4 opacity-20" />
            <p className="text-lg">Ready to cook?</p>
            <p className="text-sm">Enter your preferences and let AI do the magic.</p>
          </div>
        )}
        
        {loading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-iot-panel z-10">
             <Loader2 size={48} className="text-iot-accent animate-spin mb-4" />
             <p className="text-iot-accent animate-pulse">Consulting culinary database...</p>
          </div>
        )}

        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
           {result && <div className="prose prose-invert max-w-none">
             {formatMarkdown(result)}
           </div>}
        </div>
      </div>
    </div>
  );
};

export default RecipeGenerator;