import { GoogleGenAI, Type, GenerateContentResponse } from "@google/genai";
import { InventoryItem, Category } from "../types";

// Initialize Gemini Client
// Note: API_KEY is expected to be available in process.env.API_KEY
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const MODEL_NAME = "gemini-2.5-flash";

/**
 * Analyzes an image of food items and returns a structured list of detected items.
 */
export const analyzeFridgeImage = async (base64Image: string): Promise<Partial<InventoryItem>[]> => {
  try {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: "image/jpeg",
              data: base64Image,
            },
          },
          {
            text: "Analyze this image of refrigerator contents. Identify the food items visible. Return a JSON array where each object has: 'name' (string), 'quantity' (estimated number), 'unit' (e.g., 'pcs', 'bottle', 'kg'), 'category' (one of: Dairy, Produce, Meat, Beverage, Snack, Condiment, Other), and 'estimatedExpiryDays' (integer estimate of shelf life from today for a fresh item).",
          },
        ],
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING },
              quantity: { type: Type.NUMBER },
              unit: { type: Type.STRING },
              category: { type: Type.STRING },
              estimatedExpiryDays: { type: Type.INTEGER },
            },
            required: ["name", "category", "estimatedExpiryDays"],
          },
        },
      },
    });

    const rawText = response.text;
    if (!rawText) return [];

    const parsed = JSON.parse(rawText);
    
    // Transform into our app's structure
    return parsed.map((item: any) => {
      // Calculate a date string based on estimated days
      const date = new Date();
      date.setDate(date.getDate() + (item.estimatedExpiryDays || 7));
      const expiryDate = date.toISOString().split('T')[0];

      // Map category string to enum if possible, else OTHER
      let cat = Category.OTHER;
      const upperCat = item.category?.toUpperCase();
      if (Object.keys(Category).includes(upperCat)) {
         cat = Category[upperCat as keyof typeof Category];
      } else {
        // Fuzzy match attempt or default
        const values = Object.values(Category);
        const found = values.find(v => v.toUpperCase() === upperCat);
        if (found) cat = found;
      }

      return {
        name: item.name,
        quantity: item.quantity || 1,
        unit: item.unit || 'pcs',
        category: cat,
        expiryDate: expiryDate,
      };
    });

  } catch (error) {
    console.error("Error analyzing image:", error);
    throw new Error("Failed to analyze image.");
  }
};

/**
 * Generates a recipe suggestion based on current inventory.
 */
export const generateRecipeSuggestion = async (inventory: InventoryItem[], preferences: string): Promise<string> => {
  try {
    const inventoryList = inventory.map(i => `- ${i.quantity} ${i.unit} ${i.name} (expires: ${i.expiryDate})`).join("\n");
    
    const prompt = `
      You are a world-class chef specialized in reducing food waste.
      Here is the current inventory of the refrigerator:
      ${inventoryList}

      User preferences/request: "${preferences || 'Surprise me with something healthy'}"

      Please suggest one detailed recipe that maximizes the use of ingredients, especially those expiring soon.
      Format the output in Markdown. Include:
      1. Recipe Title
      2. Brief description
      3. Ingredients list (mark which ones are from the inventory)
      4. Step-by-step instructions
      5. A "Chef's Tip" for storage or flavor.
    `;

    const response: GenerateContentResponse = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
    });

    return response.text || "Could not generate a recipe at this time.";
  } catch (error) {
    console.error("Recipe generation error:", error);
    return "Sorry, I had trouble thinking of a recipe. Please try again.";
  }
};