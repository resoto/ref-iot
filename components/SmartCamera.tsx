import React, { useState, useRef } from 'react';
import { Camera, Upload, Check, Loader2, ScanLine } from 'lucide-react';
import { InventoryItem } from '../types';
import { analyzeFridgeImage } from '../services/geminiService';

interface SmartCameraProps {
  onItemsDetected: (items: Partial<InventoryItem>[]) => void;
}

const SmartCamera: React.FC<SmartCameraProps> = ({ onItemsDetected }) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Preview
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result as string;
      setPreview(base64);
      processImage(base64);
    };
    reader.readAsDataURL(file);
  };

  const processImage = async (base64Data: string) => {
    setIsAnalyzing(true);
    try {
      // Strip header for API if needed, but generateContent usually handles data url or raw base64
      // The service expects base64 string without the data:image/xxx;base64, prefix for inlineData
      const base64Clean = base64Data.split(',')[1];
      const items = await analyzeFridgeImage(base64Clean);
      onItemsDetected(items);
    } catch (error) {
      console.error(error);
      alert("Failed to analyze image. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const triggerInput = () => fileInputRef.current?.click();

  return (
    <div className="h-full flex flex-col items-center justify-center animate-fade-in relative">
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1584269631423-6a383898e537?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-5 blur-sm pointer-events-none"></div>
      
      <div className="z-10 max-w-md w-full bg-iot-panel/80 backdrop-blur-xl p-8 rounded-3xl border border-gray-700 shadow-2xl text-center">
        <div className="mb-6 relative inline-block">
          <div className="w-24 h-24 bg-gray-800 rounded-full flex items-center justify-center border-2 border-iot-accent relative overflow-hidden">
            {preview ? (
              <img src={preview} alt="Preview" className="w-full h-full object-cover" />
            ) : (
              <Camera size={40} className="text-iot-accent" />
            )}
          </div>
          {isAnalyzing && (
             <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full">
                <Loader2 className="animate-spin text-white" size={32} />
             </div>
          )}
        </div>

        <h2 className="text-2xl font-bold text-white mb-2">Smart Vision Scan</h2>
        <p className="text-gray-400 mb-8">
          Point your camera at your groceries or upload a photo. AI will identify items and expiry dates automatically.
        </p>

        <input 
          type="file" 
          ref={fileInputRef}
          accept="image/*" 
          capture="environment"
          className="hidden"
          onChange={handleFileSelect}
        />

        <div className="space-y-3">
          <button 
            onClick={triggerInput}
            disabled={isAnalyzing}
            className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-bold py-4 px-6 rounded-xl flex items-center justify-center gap-3 transition-all disabled:opacity-50 shadow-lg shadow-blue-900/20"
          >
            {isAnalyzing ? (
              <>Thinking...</>
            ) : (
              <>
                <ScanLine size={20} />
                Start Scan
              </>
            )}
          </button>
          
          <p className="text-xs text-gray-500 mt-4">
            Powered by Gemini Vision 2.5
          </p>
        </div>
      </div>
    </div>
  );
};

export default SmartCamera;