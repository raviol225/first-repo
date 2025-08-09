import MealForm from "./components/MealForm";

export default function Home() {
  return (
    <main className="min-h-screen w-full p-8 bg-gradient-to-br from-purple-50 to-pink-50">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">
           💩 LICACA 💩
        </h1>
        <p className="text-center text-gray-600 mb-8">
          Quels aliments font faire caca... ou pas ?
        </p>
        
        <div className="grid md:grid-cols-2 gap-6">
          <MealForm />
          
          <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
            <h2 className="text-2xl font-semibold mb-4">🤢 Mes dernier repas</h2>
            <p className="text-gray-600">Je modifie mon ressenti</p>
          </div>
        </div>
      </div>
    </main>
  )
}
