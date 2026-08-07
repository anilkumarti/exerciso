export type DietPref = 'veg' | 'eggetarian' | 'non_veg'
export type FoodDiet = 'veg' | 'egg' | 'non_veg'

export interface FoodItem {
  id: string
  name: string
  calories: number
  protein_g: number
  carbs_g: number
  fat_g: number
  serving_g: number
  serving_label: string
  category: string
  diet: FoodDiet
}

export function canEat(food: FoodItem, pref: DietPref): boolean {
  if (pref === 'non_veg') return true
  if (pref === 'eggetarian') return food.diet === 'veg' || food.diet === 'egg'
  return food.diet === 'veg'
}

export const FOOD_DATABASE: FoodItem[] = [
  // ── Dals & Legumes (Veg) ─────────────────────────────────
  { id: 'v01', name: 'Toor Dal (cooked)', calories: 116, protein_g: 7, carbs_g: 20, fat_g: 0.4, serving_g: 100, serving_label: '100g', category: 'dal', diet: 'veg' },
  { id: 'v02', name: 'Moong Dal (cooked)', calories: 105, protein_g: 7.6, carbs_g: 18, fat_g: 0.4, serving_g: 100, serving_label: '100g', category: 'dal', diet: 'veg' },
  { id: 'v03', name: 'Masoor Dal (cooked)', calories: 116, protein_g: 9, carbs_g: 20, fat_g: 0.5, serving_g: 100, serving_label: '100g', category: 'dal', diet: 'veg' },
  { id: 'v04', name: 'Chana Dal (cooked)', calories: 164, protein_g: 8.9, carbs_g: 27, fat_g: 2.6, serving_g: 100, serving_label: '100g', category: 'dal', diet: 'veg' },
  { id: 'v05', name: 'Dal Makhani', calories: 148, protein_g: 8, carbs_g: 18, fat_g: 4, serving_g: 100, serving_label: '100g', category: 'dal', diet: 'veg' },
  { id: 'v06', name: 'Rajma (cooked)', calories: 127, protein_g: 8.7, carbs_g: 22, fat_g: 0.5, serving_g: 100, serving_label: '100g', category: 'legumes', diet: 'veg' },
  { id: 'v07', name: 'Chole / Kabuli Chana (cooked)', calories: 164, protein_g: 8.9, carbs_g: 27, fat_g: 2.6, serving_g: 100, serving_label: '100g', category: 'legumes', diet: 'veg' },
  { id: 'v08', name: 'Black Chana (kala chana, cooked)', calories: 164, protein_g: 8.9, carbs_g: 27, fat_g: 2.6, serving_g: 100, serving_label: '100g', category: 'legumes', diet: 'veg' },
  { id: 'v09', name: 'Moong Sprouts (raw)', calories: 30, protein_g: 3.5, carbs_g: 5, fat_g: 0.2, serving_g: 100, serving_label: '100g', category: 'legumes', diet: 'veg' },
  { id: 'v10', name: 'Soya Chunks (cooked)', calories: 105, protein_g: 16, carbs_g: 8, fat_g: 0.5, serving_g: 100, serving_label: '100g', category: 'protein', diet: 'veg' },
  { id: 'v11', name: 'Soya Chunks (dry)', calories: 345, protein_g: 52, carbs_g: 33, fat_g: 0.5, serving_g: 30, serving_label: '30g (dry)', category: 'protein', diet: 'veg' },

  // ── Paneer & Dairy (Veg) ─────────────────────────────────
  { id: 'v12', name: 'Paneer (raw)', calories: 265, protein_g: 18, carbs_g: 1.2, fat_g: 20, serving_g: 100, serving_label: '100g', category: 'dairy', diet: 'veg' },
  { id: 'v13', name: 'Paneer Bhurji', calories: 270, protein_g: 17, carbs_g: 6, fat_g: 20, serving_g: 100, serving_label: '100g', category: 'dairy', diet: 'veg' },
  { id: 'v14', name: 'Palak Paneer', calories: 133, protein_g: 7, carbs_g: 5, fat_g: 10, serving_g: 100, serving_label: '100g', category: 'curry', diet: 'veg' },
  { id: 'v15', name: 'Curd / Dahi (full fat)', calories: 61, protein_g: 3.5, carbs_g: 4, fat_g: 3.3, serving_g: 100, serving_label: '100g', category: 'dairy', diet: 'veg' },
  { id: 'v16', name: 'Curd / Dahi (low fat)', calories: 37, protein_g: 3.6, carbs_g: 5, fat_g: 0.5, serving_g: 100, serving_label: '100g', category: 'dairy', diet: 'veg' },
  { id: 'v17', name: 'Toned Milk', calories: 58, protein_g: 3.3, carbs_g: 4.8, fat_g: 1.5, serving_g: 100, serving_label: '100ml', category: 'dairy', diet: 'veg' },
  { id: 'v18', name: 'Full Fat Milk', calories: 62, protein_g: 3.2, carbs_g: 4.9, fat_g: 3.3, serving_g: 100, serving_label: '100ml', category: 'dairy', diet: 'veg' },
  { id: 'v19', name: 'Lassi (plain sweetened)', calories: 100, protein_g: 3.5, carbs_g: 12, fat_g: 3.5, serving_g: 200, serving_label: '1 glass (200ml)', category: 'dairy', diet: 'veg' },
  { id: 'v20', name: 'Chaas / Buttermilk', calories: 30, protein_g: 1.5, carbs_g: 3, fat_g: 0.8, serving_g: 200, serving_label: '1 glass (200ml)', category: 'dairy', diet: 'veg' },
  { id: 'v21', name: 'Whey Protein (1 scoop)', calories: 120, protein_g: 25, carbs_g: 3, fat_g: 1.5, serving_g: 30, serving_label: '1 scoop (30g)', category: 'supplement', diet: 'veg' },

  // ── Cereals & Grains (Veg) ───────────────────────────────
  { id: 'v22', name: 'Basmati Rice (cooked)', calories: 121, protein_g: 2.7, carbs_g: 27, fat_g: 0.2, serving_g: 100, serving_label: '100g cooked', category: 'rice', diet: 'veg' },
  { id: 'v23', name: 'Brown Rice (cooked)', calories: 112, protein_g: 2.6, carbs_g: 24, fat_g: 0.9, serving_g: 100, serving_label: '100g cooked', category: 'rice', diet: 'veg' },
  { id: 'v24', name: 'Roti / Chapati (plain)', calories: 78, protein_g: 2.7, carbs_g: 16, fat_g: 0.4, serving_g: 30, serving_label: '1 roti (30g)', category: 'bread', diet: 'veg' },
  { id: 'v25', name: 'Paratha (plain)', calories: 165, protein_g: 3.4, carbs_g: 25, fat_g: 6, serving_g: 60, serving_label: '1 paratha', category: 'bread', diet: 'veg' },
  { id: 'v26', name: 'Aloo Paratha', calories: 260, protein_g: 5, carbs_g: 38, fat_g: 9, serving_g: 90, serving_label: '1 paratha', category: 'bread', diet: 'veg' },
  { id: 'v27', name: 'Idli', calories: 39, protein_g: 2, carbs_g: 8, fat_g: 0.1, serving_g: 40, serving_label: '1 idli', category: 'breakfast', diet: 'veg' },
  { id: 'v28', name: 'Plain Dosa', calories: 128, protein_g: 2.7, carbs_g: 23, fat_g: 3, serving_g: 70, serving_label: '1 dosa', category: 'breakfast', diet: 'veg' },
  { id: 'v29', name: 'Masala Dosa', calories: 230, protein_g: 5, carbs_g: 35, fat_g: 8, serving_g: 150, serving_label: '1 dosa', category: 'breakfast', diet: 'veg' },
  { id: 'v30', name: 'Poha (cooked)', calories: 130, protein_g: 2.7, carbs_g: 28, fat_g: 1.3, serving_g: 100, serving_label: '1 bowl (100g)', category: 'breakfast', diet: 'veg' },
  { id: 'v31', name: 'Upma', calories: 135, protein_g: 3, carbs_g: 22, fat_g: 4, serving_g: 100, serving_label: '1 bowl (100g)', category: 'breakfast', diet: 'veg' },
  { id: 'v32', name: 'Oats / Daliya', calories: 156, protein_g: 5.4, carbs_g: 27, fat_g: 2.7, serving_g: 40, serving_label: '40g dry', category: 'breakfast', diet: 'veg' },
  { id: 'v33', name: 'Khichdi (moong dal)', calories: 133, protein_g: 5.5, carbs_g: 24, fat_g: 2, serving_g: 100, serving_label: '100g', category: 'meal', diet: 'veg' },
  { id: 'v34', name: 'Pav Bhaji', calories: 300, protein_g: 8, carbs_g: 45, fat_g: 10, serving_g: 200, serving_label: '1 serving', category: 'meal', diet: 'veg' },
  { id: 'v35', name: 'Veg Biryani', calories: 280, protein_g: 7, carbs_g: 52, fat_g: 6, serving_g: 200, serving_label: '1 bowl (200g)', category: 'meal', diet: 'veg' },
  { id: 'v36', name: 'Sattu (roasted gram flour)', calories: 406, protein_g: 22, carbs_g: 65, fat_g: 7, serving_g: 50, serving_label: '50g', category: 'protein', diet: 'veg' },

  // ── Snacks & Nuts (Veg) ──────────────────────────────────
  { id: 'v37', name: 'Roasted Chana', calories: 364, protein_g: 22, carbs_g: 57, fat_g: 6, serving_g: 30, serving_label: '30g (small handful)', category: 'snack', diet: 'veg' },
  { id: 'v38', name: 'Makhana / Fox Nuts', calories: 347, protein_g: 9.7, carbs_g: 76, fat_g: 0.1, serving_g: 30, serving_label: '30g', category: 'snack', diet: 'veg' },
  { id: 'v39', name: 'Peanuts (roasted)', calories: 166, protein_g: 7.6, carbs_g: 5, fat_g: 14, serving_g: 28, serving_label: '28g', category: 'snack', diet: 'veg' },
  { id: 'v40', name: 'Almonds / Badam', calories: 164, protein_g: 6, carbs_g: 6, fat_g: 14, serving_g: 28, serving_label: '28g / ~23 nuts', category: 'snack', diet: 'veg' },
  { id: 'v41', name: 'Dhokla', calories: 140, protein_g: 6, carbs_g: 22, fat_g: 3, serving_g: 80, serving_label: '2 pieces', category: 'snack', diet: 'veg' },
  { id: 'v42', name: 'Sprouts Chaat', calories: 80, protein_g: 5, carbs_g: 14, fat_g: 0.5, serving_g: 100, serving_label: '1 bowl', category: 'snack', diet: 'veg' },

  // ── Fruits & Vegetables (Veg) ────────────────────────────
  { id: 'v43', name: 'Banana', calories: 89, protein_g: 1.1, carbs_g: 23, fat_g: 0.3, serving_g: 118, serving_label: '1 medium', category: 'fruit', diet: 'veg' },
  { id: 'v44', name: 'Mango (Aam)', calories: 60, protein_g: 0.8, carbs_g: 15, fat_g: 0.4, serving_g: 100, serving_label: '100g', category: 'fruit', diet: 'veg' },
  { id: 'v45', name: 'Apple (Seb)', calories: 52, protein_g: 0.3, carbs_g: 14, fat_g: 0.2, serving_g: 100, serving_label: '100g', category: 'fruit', diet: 'veg' },
  { id: 'v46', name: 'Guava (Amrud)', calories: 68, protein_g: 2.6, carbs_g: 14, fat_g: 1, serving_g: 100, serving_label: '100g', category: 'fruit', diet: 'veg' },
  { id: 'v47', name: 'Papaya (Papita)', calories: 43, protein_g: 0.5, carbs_g: 11, fat_g: 0.3, serving_g: 100, serving_label: '100g', category: 'fruit', diet: 'veg' },
  { id: 'v48', name: 'Pomegranate (Anar)', calories: 83, protein_g: 1.7, carbs_g: 19, fat_g: 1.2, serving_g: 100, serving_label: '100g', category: 'fruit', diet: 'veg' },
  { id: 'v49', name: 'Spinach / Palak (raw)', calories: 23, protein_g: 2.9, carbs_g: 3.6, fat_g: 0.4, serving_g: 100, serving_label: '100g', category: 'vegetable', diet: 'veg' },
  { id: 'v50', name: 'Broccoli (cooked)', calories: 35, protein_g: 2.4, carbs_g: 7, fat_g: 0.4, serving_g: 100, serving_label: '100g', category: 'vegetable', diet: 'veg' },

  // ── Complete Veg Meals ───────────────────────────────────
  { id: 'vm01', name: 'Dal Chawal (1 serving)', calories: 430, protein_g: 17, carbs_g: 84, fat_g: 2, serving_g: 300, serving_label: '1 plate', category: 'meal', diet: 'veg' },
  { id: 'vm02', name: 'Rajma Chawal (1 serving)', calories: 470, protein_g: 22, carbs_g: 82, fat_g: 3, serving_g: 300, serving_label: '1 plate', category: 'meal', diet: 'veg' },
  { id: 'vm03', name: 'Chole + 2 Roti', calories: 440, protein_g: 18, carbs_g: 70, fat_g: 8, serving_g: 280, serving_label: '1 serving', category: 'meal', diet: 'veg' },
  { id: 'vm04', name: 'Palak Paneer + 2 Roti', calories: 423, protein_g: 18, carbs_g: 37, fat_g: 22, serving_g: 260, serving_label: '1 serving', category: 'meal', diet: 'veg' },
  { id: 'vm05', name: 'Paneer Bhurji + 2 Roti', calories: 501, protein_g: 23, carbs_g: 42, fat_g: 25, serving_g: 260, serving_label: '1 serving', category: 'meal', diet: 'veg' },
  { id: 'vm06', name: 'Idli (4) + Sambar', calories: 280, protein_g: 10, carbs_g: 52, fat_g: 4, serving_g: 300, serving_label: '4 idli + sambar', category: 'meal', diet: 'veg' },
  { id: 'vm07', name: 'Poha + Chai', calories: 210, protein_g: 4, carbs_g: 38, fat_g: 5, serving_g: 200, serving_label: '1 bowl', category: 'meal', diet: 'veg' },
  { id: 'vm08', name: 'Oats with Milk and Banana', calories: 310, protein_g: 11, carbs_g: 54, fat_g: 5, serving_g: 350, serving_label: '1 bowl', category: 'meal', diet: 'veg' },

  // ── Eggs ─────────────────────────────────────────────────
  { id: 'e01', name: 'Boiled Egg (anda)', calories: 77, protein_g: 6.3, carbs_g: 0.6, fat_g: 5, serving_g: 50, serving_label: '1 large', category: 'egg', diet: 'egg' },
  { id: 'e02', name: 'Egg Bhurji (2 eggs)', calories: 216, protein_g: 14, carbs_g: 5, fat_g: 15, serving_g: 150, serving_label: '1 serving (2 eggs)', category: 'egg', diet: 'egg' },
  { id: 'e03', name: 'Masala Omelette (2 eggs)', calories: 195, protein_g: 13, carbs_g: 3, fat_g: 14, serving_g: 120, serving_label: '1 omelette', category: 'egg', diet: 'egg' },
  { id: 'e04', name: 'Egg Curry (2 eggs)', calories: 280, protein_g: 14, carbs_g: 8, fat_g: 22, serving_g: 200, serving_label: '1 serving', category: 'egg', diet: 'egg' },
  { id: 'e05', name: 'Egg White (1 large)', calories: 17, protein_g: 3.6, carbs_g: 0.2, fat_g: 0, serving_g: 33, serving_label: '1 egg white', category: 'egg', diet: 'egg' },
  { id: 'e06', name: 'Egg Fried Rice', calories: 170, protein_g: 5, carbs_g: 28, fat_g: 4.5, serving_g: 100, serving_label: '100g', category: 'egg', diet: 'egg' },
  { id: 'e07', name: 'Egg Bhurji + 2 Roti', calories: 372, protein_g: 19, carbs_g: 37, fat_g: 16, serving_g: 270, serving_label: '1 serving', category: 'meal', diet: 'egg' },
  { id: 'e08', name: 'Boiled Eggs (3) + Roti', calories: 309, protein_g: 22, carbs_g: 18, fat_g: 16, serving_g: 180, serving_label: '3 eggs + 2 roti', category: 'meal', diet: 'egg' },

  // ── Non-Veg (Chicken) ────────────────────────────────────
  { id: 'nv01', name: 'Tandoori Chicken', calories: 175, protein_g: 28, carbs_g: 6, fat_g: 4, serving_g: 100, serving_label: '100g', category: 'chicken', diet: 'non_veg' },
  { id: 'nv02', name: 'Chicken Tikka', calories: 190, protein_g: 27, carbs_g: 4, fat_g: 7, serving_g: 100, serving_label: '100g', category: 'chicken', diet: 'non_veg' },
  { id: 'nv03', name: 'Chicken Curry', calories: 195, protein_g: 17, carbs_g: 5, fat_g: 12, serving_g: 100, serving_label: '100g', category: 'chicken', diet: 'non_veg' },
  { id: 'nv04', name: 'Butter Chicken', calories: 165, protein_g: 16, carbs_g: 6, fat_g: 9, serving_g: 100, serving_label: '100g', category: 'chicken', diet: 'non_veg' },
  { id: 'nv05', name: 'Chicken Breast (grilled)', calories: 165, protein_g: 31, carbs_g: 0, fat_g: 3.6, serving_g: 100, serving_label: '100g', category: 'chicken', diet: 'non_veg' },
  { id: 'nv06', name: 'Chicken Keema', calories: 215, protein_g: 23, carbs_g: 5, fat_g: 12, serving_g: 100, serving_label: '100g', category: 'chicken', diet: 'non_veg' },

  // ── Non-Veg (Fish & Seafood) ─────────────────────────────
  { id: 'nv07', name: 'Fish Curry (Rohu)', calories: 175, protein_g: 22, carbs_g: 3, fat_g: 8, serving_g: 100, serving_label: '100g', category: 'fish', diet: 'non_veg' },
  { id: 'nv08', name: 'Pomfret Fry', calories: 190, protein_g: 24, carbs_g: 4, fat_g: 9, serving_g: 100, serving_label: '100g', category: 'fish', diet: 'non_veg' },
  { id: 'nv09', name: 'Prawn Curry', calories: 140, protein_g: 14, carbs_g: 5, fat_g: 7, serving_g: 100, serving_label: '100g', category: 'seafood', diet: 'non_veg' },

  // ── Non-Veg (Mutton) ─────────────────────────────────────
  { id: 'nv10', name: 'Mutton Curry', calories: 240, protein_g: 18, carbs_g: 4, fat_g: 17, serving_g: 100, serving_label: '100g', category: 'mutton', diet: 'non_veg' },
  { id: 'nv11', name: 'Mutton Seekh Kebab', calories: 250, protein_g: 22, carbs_g: 5, fat_g: 16, serving_g: 100, serving_label: '100g', category: 'mutton', diet: 'non_veg' },

  // ── Complete Non-Veg Meals ───────────────────────────────
  { id: 'nvm01', name: 'Chicken Biryani', calories: 463, protein_g: 30, carbs_g: 55, fat_g: 13, serving_g: 250, serving_label: '1 plate (250g)', category: 'meal', diet: 'non_veg' },
  { id: 'nvm02', name: 'Mutton Biryani', calories: 530, protein_g: 28, carbs_g: 52, fat_g: 20, serving_g: 250, serving_label: '1 plate (250g)', category: 'meal', diet: 'non_veg' },
  { id: 'nvm03', name: 'Butter Chicken + 2 Roti', calories: 487, protein_g: 29, carbs_g: 44, fat_g: 20, serving_g: 350, serving_label: '1 serving', category: 'meal', diet: 'non_veg' },
  { id: 'nvm04', name: 'Fish Curry + Rice', calories: 441, protein_g: 29, carbs_g: 57, fat_g: 10, serving_g: 350, serving_label: '1 plate', category: 'meal', diet: 'non_veg' },
  { id: 'nvm05', name: 'Chicken Curry + 2 Roti', calories: 507, protein_g: 31, carbs_g: 37, fat_g: 18, serving_g: 360, serving_label: '1 serving', category: 'meal', diet: 'non_veg' },
  { id: 'nvm06', name: 'Tandoori Chicken + Salad', calories: 310, protein_g: 45, carbs_g: 8, fat_g: 8, serving_g: 250, serving_label: '1 serving', category: 'meal', diet: 'non_veg' },
]

export function searchFoods(query: string, pref: DietPref = 'non_veg', limit = 8): FoodItem[] {
  const allowed = FOOD_DATABASE.filter(f => canEat(f, pref))
  const q = query.toLowerCase().trim()
  if (!q) return allowed.slice(0, limit)
  return allowed
    .filter(f => f.name.toLowerCase().includes(q) || f.category.includes(q))
    .slice(0, limit)
}

export function suggestMeals(
  remainingCal: number,
  remainingProtein: number,
  pref: DietPref = 'non_veg',
  limit = 3,
): FoodItem[] {
  if (remainingCal < 100) return []

  const candidates = FOOD_DATABASE.filter(f =>
    canEat(f, pref) &&
    f.calories >= remainingCal * 0.25 &&
    f.calories <= remainingCal * 1.15,
  )

  const scored = candidates.map(f => {
    const calFit = 1 - Math.abs(f.calories - remainingCal) / remainingCal
    const proteinBonus = remainingProtein > 20
      ? (f.protein_g / Math.max(f.calories, 1)) * 150
      : 0
    return { food: f, score: calFit + proteinBonus }
  })

  scored.sort((a, b) => b.score - a.score)
  return scored.slice(0, limit).map(s => s.food)
}
