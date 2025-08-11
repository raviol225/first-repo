import MealForm from "./components/MealForm";
import RecentMeals from "./components/RecentMeals"

export default function Home() {
  return (
    <main className="min-h-screen w-full p-8 bg-gradient-to-br from-purple-50 to-pink-50">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">
           💩 LICACA 💩
        </h1>
        <p className="text-center text-gray-600 mb-8">
          Quels aliments font faire caca... ou pas 
        </p>
        
        <div className="grid md:grid-cols-2 gap-6">
          <MealForm />
          <RecentMeals />

        </div>
      </div>
    </main>
  )
}
