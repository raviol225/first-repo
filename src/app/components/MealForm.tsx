"use client";

import { useState } from "react";

type FoodFeeling = {
  food: string;   // nom de l'aliment
  rating: number; // 1..5
  note?: string;  // commentaire optionnel
};

type MealData = {
  foods: string;
  mealType: "breakfast" | "lunch" | "dinner" | "snack";
  time: string;
  notes: string;
  items: FoodFeeling[]; // <- tableau d’objets
};

export default function MealForm() {
  const [mealData, setMealData] = useState<MealData>({
    foods: "",
    mealType: "breakfast",
    time: "",
    notes: "",
    items: [{ food: "", rating: 3, note: "" }], // une ligne par défaut
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validation simple des items
    const invalid = mealData.items.some(
      (i) => !i.food.trim() || i.rating < 1 || i.rating > 5
    );
    if (invalid) {
      alert("Vérifie les aliments: nom requis et note entre 1 et 5.");
      return;
    }

    console.log("Repas ajouté:", mealData);
    alert("Repas ajouté ! (pour l'instant juste en console)");
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

  // Helpers pour le tableau d'objets
  const addItem = () =>
    setMealData((prev) => ({
      ...prev,
      items: [...prev.items, { food: "", rating: 3, note: "" }],
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
      return { ...prev, items: next.length ? next : [{ food: "", rating: 3 }] };
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
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent text-slate-600"
          >
            <option value="breakfast">🌅 Petit-déjeuner</option>
            <option value="lunch">🌞 Déjeuner</option>
            <option value="dinner">🌙 Dîner</option>
            <option value="snack">🍿 Collation</option>
          </select>
        </div>

        {/* Heure */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Heure
          </label>
          <input
            type="time"
            name="time"
            value={mealData.time}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent text-slate-600"
            required
          />
        </div>

        {/* Nom du plat (libre) */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Nom du plat
          </label>
          <input
            type="text"
            name="foods"
            value={mealData.foods}
            onChange={handleChange}
            placeholder="Ex: Bâton de viande, tartine avocat, tomates mozza..."
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent text-slate-600"
            required
          />
        </div>

        {/* Aliments pour le repas: tableau d'objets inline */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Aliments associés au repas
          </label>

          <div className="space-y-3">
            {mealData.items.map((row, i) => (
              <div key={i} className="grid grid-cols-12 gap-2 text-slate-700 items-start">
                <input
                  className="col-span-5 rounded border px-3  text-slate-700 py-2"
                  placeholder="Ex: Riz basmati"
                  value={row.food}
                  onChange={(e) => updateItem(i, { food: e.target.value })}
                />
                <select
                  className="col-span-2 rounded border text-slate-700 px-3 py-2"
                  value={row.rating}
                  onChange={(e) => updateItem(i, { rating: Number(e.target.value) })}
                  aria-label="Note de ressenti"
                >
                  {[1, 2, 3, 4, 5].map((n) => (
                    <option key={n} value={n}>
                      {n}
                    </option>
                  ))}
                </select>
                <input
                  className="col-span-4 rounded border text-slate-700 px-3 py-2"
                  placeholder="Commentaire (optionnel)"
                  value={row.note ?? ""}
                  onChange={(e) => updateItem(i, { note: e.target.value })}
                />
                <button
                  type="button"
                  onClick={() => removeItem(i)}
                  className="col-span-1 text-red-600 hover:underline"
                  aria-label={`Supprimer l'aliment ${i + 1}`}
                >
                  ❌
                </button>
              </div>
            ))}
          </div>

          <div className="mt-3">
            <button
              type="button"
              onClick={addItem}
              className="text-purple-700 hover:underline"
            >
              ➕ Ajouter un aliment
            </button>
            <p className="text-xs text-slate-500 mt-1">
              Total: {mealData.items.length} aliment(s)
            </p>
          </div>
        </div>

        {/* Notes */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Notes (optionnel)
          </label>
          <textarea
            name="notes"
            value={mealData.notes}
            onChange={handleChange}
            placeholder="Portion, préparation, ressentis..."
            rows={3}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent text-slate-600"
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
