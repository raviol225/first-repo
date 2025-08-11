"use client"


import { useState, useEffect } from 'react';

// Types pour les données
interface FoodFeeling {
  id: string;
  food: string;
  rating: number;
  notes?: string;
}

interface Meal {
  id: string;
  foods: string;
  mealType: string;
  time: string;
  notes?: string;
  symptomTime?: string;
  symptomEnd?: string;
  createdAt: string;
  painRating: number;
  items: FoodFeeling[];
}

export default function RecentMeals() {
  const [meals, setMeals] = useState<Meal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Charger les repas au montage du composant
  useEffect(() => {
    fetchMeals();
  }, []);

  const fetchMeals = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/meals');
      
      if (!response.ok) {
        throw new Error('Erreur lors du chargement');
      }
      
      const data = await response.json();
      setMeals(data.meals);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
    } finally {
      setLoading(false);
    }
  };

  // Fonction pour formater la date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Fonction pour les emojis de rating
  const getRatingEmoji = (rating: number) => {
    switch (rating) {
      case 1: return '😢';
      case 2: return '😕';
      case 3: return '😐';
      case 4: return '😊';
      case 5: return '😍';
      default: return '❓';
    }
  };

  


  if (loading) {
    return (
      <div className="bg-white p-6 rounded-xl shadow-lg">
        <h2 className="text-2xl font-semibold mb-4">🤢 Mes derniers repas</h2>
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded mb-2"></div>
          <div className="h-4 bg-gray-200 rounded mb-2"></div>
          <div className="h-4 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white p-6 rounded-xl shadow-lg">
        <h2 className="text-2xl font-semibold mb-4">🤢 Mes derniers repas</h2>
        <div className="text-red-600 bg-red-50 p-3 rounded">
          Erreur: {error}
          <button 
            onClick={fetchMeals}
            className="ml-2 text-red-800 underline"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">🤢 Mes derniers repas</h2>
        <button 
          onClick={fetchMeals}
          className="text-blue-600 hover:text-blue-800"
        >
          🔄 Actualiser
        </button>
      </div>

      {meals.length === 0 ? (
        <div className="text-center text-gray-500 py-8">
          <p>Aucun repas enregistré</p>
          <p className="text-sm mt-2">Ajoute ton premier repas ! 👈</p>
        </div>
      ) : (
        <div className="space-y-4 max-h-196 overflow-y-auto">
          {meals.map((meal) => (
            <div 
              key={meal.id} 
              className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors"
            >
              {/* Header du repas */}
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-semibold text-lg text-black">
                    {meal.mealType} - {meal.time} 
                  </h3>
                  <p className="text-sm text-gray-500">
                    {formatDate(meal.createdAt)}
                  </p>
                </div>
                <div>
                <button className="text-blue-600 hover:text-blue-800 text-sm">
                  ✏️ Modifier repas
                </button>
                <h3 className="font-semibold text-lg text-black">Douleur - {meal.painRating}/10</h3>
                </div>
              </div>

              {/* Aliments globaux */}
              <div className="mb-3">
                <p className="text-gray-700">
                  <span className="font-medium">Plats:</span> {meal.foods}
                </p>
              </div>

              {/* Détail des aliments */}
              {meal.items.length > 0 && (
                <div className="mb-3">
                  <p className="font-medium text-sm text-slate-600 mb-2">Ressentis par aliment:</p>
                  <div className="grid grid-cols-1 gap-2">
                    {meal.items.map((item) => (
                      <div key={item.id} className="flex justify-between items-center bg-gray-50 p-2 rounded">
                        <span className="text-sm text-slate-700">{item.food}</span>
                        <span className="text-lg text-slate-600">
                          {getRatingEmoji(item.rating)} {item.rating}/5
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Notes */}
              {meal.notes && (
                <div className="text-sm text-gray-600 bg-yellow-50 p-2 rounded">
                  💭 {meal.notes}
                </div>
              )}

              {/* Symptômes */}
              {(meal.symptomTime || meal.symptomEnd) && (
                <div className="text-sm text-red-600 bg-red-50 p-2 rounded mt-2">
                  🚨 Symptômes: {meal.symptomTime} - {meal.symptomEnd}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
