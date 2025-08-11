// src/app/api/meals/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@/generated/prisma'

const prisma = new PrismaClient()


//initialisation des types pour éviter les any
interface FoodItemInput {
    food : string
    rating: number
    notes?: string
}

interface MealInput {
    foods: string
    mealType : string
    time: string
    notes?: string
    symptomeTime: string
    symptomeEnd?: string
    painRating:number
    items: FoodItemInput[]
}




export async function POST(request: NextRequest) {
  try {
    const body: MealInput = await request.json()

    // Validation des champs obligatoires
    if (!body.foods || !body.mealType || !body.time || !body.items) {
      return NextResponse.json(
        { error: 'Champs manquants: foods, mealType, time et items sont requis' },
        { status: 400 }
      )
    }

    // Validation des items
    if (!Array.isArray(body.items) || body.items.length === 0) {
      return NextResponse.json(
        { error: 'Au moins un aliment est requis' },
        { status: 400 }
      )
    }

    // Validation de chaque item
    for (const item of body.items) {
      if (!item.food || typeof item.rating !== 'number' || item.rating < 1 || item.rating > 5) {
        return NextResponse.json(
          { error: 'Chaque aliment doit avoir un nom et une note entre 1 et 5' },
          { status: 400 }
        )
      }
    }

    // Création du repas avec les FoodFeeling
    const meal = await prisma.meal.create({
      data: {
        foods: body.foods,
        mealType: body.mealType,
        time: body.time,
        notes: body.notes || null,           // ✅ Optionnel
        symptomTime: body.symptomeTime || null,  
        symptomEnd: body.symptomeEnd || null,
        painRating: body.painRating,  
        items: {
          create: body.items.map((item: FoodItemInput) => ({
            food: item.food,
            rating: item.rating,
            notes: item.notes || null        // ✅ "notes" pas "note"
          }))
        }
      },
      include: { 
        items: true  // Pour récupérer les FoodFeeling créés
      }
    })

    return NextResponse.json({
      message: 'Repas créé avec succès',
      meal: meal
    }, { status: 201 })

  } catch (error) {
    console.error('Erreur API meals:', error)
    return NextResponse.json(
      { error: 'Erreur serveur lors de la création du repas' },
      { status: 500 }
    )
  }
}

// Récupération des repas
export async function GET() {
  try {
    const meals = await prisma.meal.findMany({
      include: { 
        items: true 
      },
      orderBy: {
        createdAt: 'desc'  // classement décroissant jeune -> vieux
      }
    })

    return NextResponse.json({
      meals: meals
    }, { status: 200 })

  } catch (error) {
    console.error('Erreur GET meals:', error)
    return NextResponse.json(
      { error: 'Erreur serveur lors de la récupération des repas' },
      { status: 500 }
    )
  }
}
