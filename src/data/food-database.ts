export interface FoodItem {
  id: string
  name: string
  calories: number
  protein_g: number
  carbs_g: number
  fat_g: number
  serving_g: number
  serving_label: string
  category: 'protein' | 'carbs' | 'fat' | 'vegetable' | 'dairy' | 'meal' | 'snack'
}

export const FOOD_DATABASE: FoodItem[] = [
  // ── Proteins ─────────────────────────────────────────────
  { id: 'p01', name: 'Chicken breast', calories: 165, protein_g: 31, carbs_g: 0, fat_g: 3.6, serving_g: 100, serving_label: '100g', category: 'protein' },
  { id: 'p02', name: 'Turkey breast', calories: 135, protein_g: 30, carbs_g: 0, fat_g: 1, serving_g: 100, serving_label: '100g', category: 'protein' },
  { id: 'p03', name: 'Salmon fillet', calories: 208, protein_g: 20, carbs_g: 0, fat_g: 13, serving_g: 100, serving_label: '100g', category: 'protein' },
  { id: 'p04', name: 'Tuna (canned in water)', calories: 116, protein_g: 26, carbs_g: 0, fat_g: 1, serving_g: 100, serving_label: '100g', category: 'protein' },
  { id: 'p05', name: 'Shrimp (cooked)', calories: 84, protein_g: 18, carbs_g: 0.2, fat_g: 0.9, serving_g: 100, serving_label: '100g', category: 'protein' },
  { id: 'p06', name: 'Ground beef (lean 90%)', calories: 215, protein_g: 26, carbs_g: 0, fat_g: 12, serving_g: 100, serving_label: '100g', category: 'protein' },
  { id: 'p07', name: 'Egg (large, whole)', calories: 72, protein_g: 6, carbs_g: 0.4, fat_g: 5, serving_g: 50, serving_label: '1 egg', category: 'protein' },
  { id: 'p08', name: 'Egg whites', calories: 52, protein_g: 11, carbs_g: 0.7, fat_g: 0.2, serving_g: 100, serving_label: '100g', category: 'protein' },
  { id: 'p09', name: 'Greek yogurt (plain 0%)', calories: 59, protein_g: 10, carbs_g: 3.6, fat_g: 0.4, serving_g: 100, serving_label: '100g', category: 'protein' },
  { id: 'p10', name: 'Cottage cheese (low fat)', calories: 81, protein_g: 11, carbs_g: 3.1, fat_g: 2.3, serving_g: 100, serving_label: '100g', category: 'protein' },
  { id: 'p11', name: 'Tofu (firm)', calories: 76, protein_g: 8, carbs_g: 1.9, fat_g: 4.2, serving_g: 100, serving_label: '100g', category: 'protein' },
  { id: 'p12', name: 'Whey protein shake', calories: 120, protein_g: 25, carbs_g: 3, fat_g: 1.5, serving_g: 30, serving_label: '1 scoop (30g)', category: 'protein' },
  { id: 'p13', name: 'Edamame (shelled)', calories: 121, protein_g: 11, carbs_g: 9, fat_g: 5, serving_g: 100, serving_label: '100g', category: 'protein' },
  { id: 'p14', name: 'Tempeh', calories: 192, protein_g: 20, carbs_g: 7, fat_g: 11, serving_g: 100, serving_label: '100g', category: 'protein' },

  // ── Carbs ─────────────────────────────────────────────────
  { id: 'c01', name: 'White rice (cooked)', calories: 130, protein_g: 2.7, carbs_g: 28, fat_g: 0.3, serving_g: 100, serving_label: '100g cooked', category: 'carbs' },
  { id: 'c02', name: 'Brown rice (cooked)', calories: 112, protein_g: 2.6, carbs_g: 24, fat_g: 0.9, serving_g: 100, serving_label: '100g cooked', category: 'carbs' },
  { id: 'c03', name: 'Oats (dry)', calories: 389, protein_g: 17, carbs_g: 66, fat_g: 7, serving_g: 40, serving_label: '40g', category: 'carbs' },
  { id: 'c04', name: 'Pasta (cooked)', calories: 131, protein_g: 5, carbs_g: 25, fat_g: 1.1, serving_g: 100, serving_label: '100g cooked', category: 'carbs' },
  { id: 'c05', name: 'Sweet potato (baked)', calories: 86, protein_g: 1.6, carbs_g: 20, fat_g: 0.1, serving_g: 100, serving_label: '100g', category: 'carbs' },
  { id: 'c06', name: 'Quinoa (cooked)', calories: 120, protein_g: 4.4, carbs_g: 21, fat_g: 1.9, serving_g: 100, serving_label: '100g cooked', category: 'carbs' },
  { id: 'c07', name: 'Whole wheat bread', calories: 69, protein_g: 3.6, carbs_g: 12, fat_g: 1, serving_g: 28, serving_label: '1 slice', category: 'carbs' },
  { id: 'c08', name: 'Banana', calories: 105, protein_g: 1.3, carbs_g: 27, fat_g: 0.4, serving_g: 118, serving_label: '1 medium', category: 'carbs' },
  { id: 'c09', name: 'Apple', calories: 95, protein_g: 0.5, carbs_g: 25, fat_g: 0.3, serving_g: 182, serving_label: '1 medium', category: 'carbs' },
  { id: 'c10', name: 'Blueberries', calories: 84, protein_g: 1.1, carbs_g: 21, fat_g: 0.5, serving_g: 148, serving_label: '1 cup', category: 'carbs' },
  { id: 'c11', name: 'Strawberries', calories: 49, protein_g: 1, carbs_g: 12, fat_g: 0.5, serving_g: 152, serving_label: '1 cup', category: 'carbs' },
  { id: 'c12', name: 'Orange', calories: 62, protein_g: 1.2, carbs_g: 15, fat_g: 0.2, serving_g: 131, serving_label: '1 medium', category: 'carbs' },
  { id: 'c13', name: 'Tortilla (flour)', calories: 146, protein_g: 4, carbs_g: 25, fat_g: 3.5, serving_g: 45, serving_label: '1 medium', category: 'carbs' },

  // ── Fats ──────────────────────────────────────────────────
  { id: 'f01', name: 'Avocado', calories: 234, protein_g: 2.9, carbs_g: 12, fat_g: 21, serving_g: 150, serving_label: '1 medium', category: 'fat' },
  { id: 'f02', name: 'Almonds', calories: 164, protein_g: 6, carbs_g: 6, fat_g: 14, serving_g: 28, serving_label: '28g / 23 nuts', category: 'fat' },
  { id: 'f03', name: 'Peanut butter', calories: 188, protein_g: 8, carbs_g: 6, fat_g: 16, serving_g: 32, serving_label: '2 tbsp', category: 'fat' },
  { id: 'f04', name: 'Walnuts', calories: 185, protein_g: 4.3, carbs_g: 3.9, fat_g: 18.5, serving_g: 28, serving_label: '28g', category: 'fat' },
  { id: 'f05', name: 'Olive oil', calories: 119, protein_g: 0, carbs_g: 0, fat_g: 13.5, serving_g: 13.5, serving_label: '1 tbsp', category: 'fat' },

  // ── Vegetables ────────────────────────────────────────────
  { id: 'v01', name: 'Broccoli (cooked)', calories: 55, protein_g: 3.7, carbs_g: 11, fat_g: 0.6, serving_g: 156, serving_label: '1 cup', category: 'vegetable' },
  { id: 'v02', name: 'Spinach (raw)', calories: 7, protein_g: 0.9, carbs_g: 1.1, fat_g: 0.1, serving_g: 30, serving_label: '1 handful', category: 'vegetable' },
  { id: 'v03', name: 'Mixed salad greens', calories: 10, protein_g: 0.9, carbs_g: 1.7, fat_g: 0.2, serving_g: 60, serving_label: '2 cups', category: 'vegetable' },
  { id: 'v04', name: 'Bell pepper (red)', calories: 37, protein_g: 1.2, carbs_g: 9, fat_g: 0.4, serving_g: 119, serving_label: '1 medium', category: 'vegetable' },
  { id: 'v05', name: 'Cucumber', calories: 45, protein_g: 2, carbs_g: 11, fat_g: 0.3, serving_g: 301, serving_label: '1 large', category: 'vegetable' },
  { id: 'v06', name: 'Cherry tomatoes', calories: 27, protein_g: 1.3, carbs_g: 5.8, fat_g: 0.3, serving_g: 100, serving_label: '100g', category: 'vegetable' },

  // ── Dairy ─────────────────────────────────────────────────
  { id: 'd01', name: 'Whole milk', calories: 149, protein_g: 8, carbs_g: 12, fat_g: 8, serving_g: 244, serving_label: '1 cup', category: 'dairy' },
  { id: 'd02', name: 'Skimmed milk', calories: 83, protein_g: 8.2, carbs_g: 12, fat_g: 0.2, serving_g: 244, serving_label: '1 cup', category: 'dairy' },
  { id: 'd03', name: 'Cheddar cheese', calories: 114, protein_g: 7, carbs_g: 0.4, fat_g: 9.4, serving_g: 28, serving_label: '1 slice (28g)', category: 'dairy' },
  { id: 'd04', name: 'Mozzarella', calories: 78, protein_g: 7.8, carbs_g: 0.6, fat_g: 4.9, serving_g: 28, serving_label: '1 slice (28g)', category: 'dairy' },

  // ── Snacks ────────────────────────────────────────────────
  { id: 's01', name: 'Protein bar', calories: 200, protein_g: 20, carbs_g: 22, fat_g: 6, serving_g: 60, serving_label: '1 bar', category: 'snack' },
  { id: 's02', name: 'Rice cake', calories: 35, protein_g: 0.7, carbs_g: 7.3, fat_g: 0.3, serving_g: 9, serving_label: '1 cake', category: 'snack' },
  { id: 's03', name: 'Dark chocolate (85%)', calories: 167, protein_g: 2.9, carbs_g: 10, fat_g: 12, serving_g: 28, serving_label: '28g / 3-4 pieces', category: 'snack' },

  // ── Complete meals ────────────────────────────────────────
  { id: 'm01', name: 'Rice + chicken breast (200g + 150g)', calories: 488, protein_g: 52, carbs_g: 42, fat_g: 6, serving_g: 350, serving_label: '1 serving', category: 'meal' },
  { id: 'm02', name: 'Oatmeal with banana + milk', calories: 350, protein_g: 10, carbs_g: 65, fat_g: 4, serving_g: 400, serving_label: '1 bowl', category: 'meal' },
  { id: 'm03', name: 'Scrambled eggs (3 eggs)', calories: 216, protein_g: 18, carbs_g: 1.2, fat_g: 15, serving_g: 150, serving_label: '3 eggs', category: 'meal' },
  { id: 'm04', name: 'Chicken salad (no dressing)', calories: 300, protein_g: 35, carbs_g: 10, fat_g: 12, serving_g: 300, serving_label: '1 bowl', category: 'meal' },
  { id: 'm05', name: 'Protein smoothie (whey + banana + milk)', calories: 330, protein_g: 32, carbs_g: 40, fat_g: 4, serving_g: 450, serving_label: '1 shake', category: 'meal' },
  { id: 'm06', name: 'Pasta with chicken and sauce', calories: 520, protein_g: 38, carbs_g: 56, fat_g: 13, serving_g: 400, serving_label: '1 serving', category: 'meal' },
  { id: 'm07', name: 'Greek yogurt parfait (yogurt + berries + oats)', calories: 280, protein_g: 18, carbs_g: 42, fat_g: 3, serving_g: 280, serving_label: '1 bowl', category: 'meal' },
  { id: 'm08', name: 'Tuna rice bowl', calories: 380, protein_g: 35, carbs_g: 45, fat_g: 5, serving_g: 320, serving_label: '1 bowl', category: 'meal' },
]

export function searchFoods(query: string, limit = 8): FoodItem[] {
  const q = query.toLowerCase().trim()
  if (!q) return FOOD_DATABASE.slice(0, limit)
  return FOOD_DATABASE
    .filter(f => f.name.toLowerCase().includes(q) || f.category.includes(q))
    .slice(0, limit)
}

export function suggestMeals(remainingCal: number, remainingProtein: number, limit = 3): FoodItem[] {
  if (remainingCal < 100) return []

  const candidates = FOOD_DATABASE.filter(f =>
    f.calories >= remainingCal * 0.25 &&
    f.calories <= remainingCal * 1.15,
  )

  // Score each candidate: higher score = better fit
  const scored = candidates.map(f => {
    const calFit = 1 - Math.abs(f.calories - remainingCal) / remainingCal
    const proteinBonus = remainingProtein > 20 ? (f.protein_g / Math.max(f.calories, 1)) * 150 : 0
    return { food: f, score: calFit + proteinBonus }
  })

  scored.sort((a, b) => b.score - a.score)
  return scored.slice(0, limit).map(s => s.food)
}
