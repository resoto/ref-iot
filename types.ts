export enum Category {
  DAIRY = 'Dairy',
  PRODUCE = 'Produce',
  MEAT = 'Meat',
  BEVERAGE = 'Beverage',
  SNACK = 'Snack',
  CONDIMENT = 'Condiment',
  OTHER = 'Other'
}

export interface InventoryItem {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  category: Category;
  expiryDate: string; // YYYY-MM-DD
  daysRemaining?: number;
}

export enum ViewState {
  DASHBOARD = 'DASHBOARD',
  INVENTORY = 'INVENTORY',
  CAMERA = 'CAMERA',
  RECIPES = 'RECIPES',
  SETTINGS = 'SETTINGS'
}

export interface SensorData {
  time: string;
  fridgeTemp: number;
  freezerTemp: number;
  humidity: number;
  powerUsage: number;
}