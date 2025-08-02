'use client'

import { useState } from 'react'

export default function MealForm() {
  const [mealData, setMealData] = useState({
    foods: '',
    mealType: 'breakfast',
    time: '',
    notes: ''
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Repas ajouté:', mealData)
    // Plus tard on sauvera en base de données
    alert('Repas ajouté ! (pour l\'instant juste en console)')
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setMealData({
      ...mealData,
      [e.target.name]: e.target.value
    })
  }

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

        {/* Aliments */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Tu croutes quoi ?
          </label>
          <input
            type="text"
            name="foods"
            value={mealData.foods}
            onChange={handleChange}
            placeholder="Ex: Pain complet, avocat, tomates..."
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent text-slate-600"
            required
          />
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
  )
}
