"use client";

import { useState } from "react";

type FoodFeeling = {
  food: string;   
  rating: number; 
  notes?: string; 
};

type MealData = {
  foods: string;    
  mealType: string; 
  time: string;     
  notes?: string;   
  symptomTime?: string;  
  symptomEnd?: string; 
  painRating: number,  
  items: FoodFeeling[]; 
};

export default function MealForm() {
  const [mealData, setMealData] = useState<MealData>({
    foods: "",
    mealType: "breakfast", // String libre maintenant
    time: "",
    notes: "",
    symptomTime: "",    
    symptomEnd: "", 
    painRating: 0,    
    items: [{ food: "", rating: 3, notes: "" }],
  });
  
    const handlePainRatingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = parseInt(e.target.value, 10);
      setMealData((prev) => ({
        ...prev,
        painRating: value, // ✅ Toujours un number
      }));
    };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    const invalid = mealData.items.some(
      (i) => !i.food.trim() || i.rating < 1 || i.rating > 5
    );
    if (invalid) {
      alert("Vérifie les aliments: nom requis et note entre 1 et 5.");
      return;
    }

    try {
      const response = await fetch('/api/meals', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(mealData),
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Repas sauvegardé:', result.meal);
        alert('✅ Repas ajouté avec succès !');
        
        // Reset
        setMealData({
          foods: "",
          mealType: "breakfast",
          time: "",
          notes: "",
          symptomTime: "",
          symptomEnd: "",
          painRating: 0,
          items: [{ food: "", rating: 3, notes: "" }],
        });
      } else {
        alert('❌ Erreur lors de l\'ajout');
      }
    } catch (error) {
      console.error('Erreur:', error);
      alert('❌ Erreur de connexion');
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    setMealData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const addItem = () =>
    setMealData((prev) => ({
      ...prev,
      items: [...prev.items, { food: "", rating: 3, notes: "" }],
    }));

  const updateItem = (index: number, patch: Partial<FoodFeeling>) =>
    setMealData((prev) => {
      const next = prev.items.slice();
      next[index] = { ...next[index], ...patch };
      return { ...prev, items: next };
    });

  const removeItem = (index: number) =>
    setMealData((prev) => {
      const next = prev.items.slice();
      next.splice(index, 1);
      return { ...prev, items: next.length ? next : [{ food: "", rating: 3, notes: "" }] };
    });

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg">
      <h2 className="text-2xl font-semibold mb-4">📝 Ajouter un repas</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Type de repas */}
       
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Type de repas
          </label>
          <select
            name="mealType"
            value={mealData.mealType}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 text-slate-600"
          >
            <option value="breakfast">Petit-déjeuner</option>
            <option value="lunch">Déjeuner</option>
            <option value="dinner">Dîner</option>
            <option value="snack">Collation</option>
            <option value="other">Autre</option>
          </select>
        </div>


        {/* Heure */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Heure du repas
          </label>
          <input
            type="time"
            name="time"
            value={mealData.time}
            onChange={handleChange}
            required
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 text-slate-600"
          />
        </div>

        {/* Foods (résumé) */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Résumé des aliments
          </label>
          <input
            type="text"
            name="foods"
            value={mealData.foods}
            onChange={handleChange}
            placeholder="ex: Salade composée, pain complet"
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 text-slate-600"
          />
        </div>

        {/* Douleur global du repas */}
       <div className="mb-6 p-4 bg-red-50 rounded-lg border">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            💥 Note de douleur/inconfort après le repas (0-10)
          </label>
          <div className="flex items-center space-x-2 mb-2">
            <span className="text-sm text-gray-500">Aucune</span>
            <input
              type="range"
              name="painRating" // ✅ Ajoute le name
              min="0"
              max="10"
              value={mealData.painRating} // ✅ Utilise mealData
              onChange={handlePainRatingChange}     // ✅ Utilise handleChange
              className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              style={{
                background: `linear-gradient(to right, #10b981 0%, #f59e0b ${mealData.painRating * 5}%, #ef4444 50%, #dc2626 100%)`
              }}
            />
            <span className="text-sm text-gray-500">Extrême</span>
          </div>
          <div className="text-center">
            <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
              mealData.painRating <= 2 ? 'bg-green-100 text-green-800' :
              mealData.painRating <= 5 ? 'bg-yellow-100 text-yellow-800' :
              mealData.painRating <= 7 ? 'bg-orange-100 text-orange-800' :
              'bg-red-100 text-red-800'
            }`}>
              {mealData.painRating}/10 - {
                mealData.painRating === 0 ? '😊 Aucune douleur' :
                mealData.painRating <= 2 ? '😐 Léger inconfort' :
                mealData.painRating <= 5 ? '😕 Modéré' :
                mealData.painRating <= 7 ? '😣 Douloureux' :
                '😢 Très douloureux'
              }
            </span>
          </div>
        </div>




        {/* ✅ NOUVEAUX CHAMPS SYMPTÔMES */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Début des symptômes (optionnel)
            </label>
            <input
              type="time"
              name="symptomTime"
              value={mealData.symptomTime || ""}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 text-slate-600"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Fin des symptômes (optionnel)
            </label>
            <input
              type="time"
              name="symptomEnd"
              value={mealData.symptomEnd || ""}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 text-slate-600"
            />
          </div>
        </div>

        {/* Détail des aliments */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Détail par aliment
          </label>
          
          <div className="space-y-2">
            {mealData.items.map((row, i) => (
              <div key={i} className="grid grid-cols-12 gap-2 items-center">
                <input
                  className="col-span-5 rounded border text-slate-700 px-3 py-2"
                  placeholder="Nom de l'aliment"
                  value={row.food}
                  onChange={(e) => updateItem(i, { food: e.target.value })}
                />
                <select
                  className="col-span-2 rounded border text-slate-700 px-3 py-2"
                  value={row.rating}
                  onChange={(e) => updateItem(i, { rating: Number(e.target.value) })}
                >
                  {[1, 2, 3, 4, 5].map((n) => (
                    <option key={n} value={n}>{n}</option>
                  ))}
                </select>
                <input
                  className="col-span-4 rounded border text-slate-700 px-3 py-2"
                  placeholder="Commentaire (optionnel)"
                  value={row.notes ?? ""}
                  onChange={(e) => updateItem(i, { notes: e.target.value })}
                />
                <button
                  type="button"
                  onClick={() => removeItem(i)}
                  className="col-span-1 text-red-600 hover:underline"
                >
                  ❌
                </button>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={addItem}
            className="text-purple-700 hover:underline mt-2"
          >
            ➕ Ajouter un aliment
          </button>
        </div>

        {/* Notes générales */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Notes générales (optionnel)
          </label>
          <textarea
            name="notes"
            value={mealData.notes || ""}
            onChange={handleChange}
            placeholder="Portion, préparation, ressentis..."
            rows={3}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 text-slate-600"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 transition-colors font-medium"
        >
          ✅ Ajouter le repas
        </button>
      </form>
    </div>
  );
}
