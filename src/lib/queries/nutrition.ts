import { getSupabaseServerClient } from '@/lib/supabase/server'
import type { FitnessGoal } from '@/types/database'

export interface MacroTargets {
  calories: number
  protein_g: number
  carbs_g: number
  fat_g: number
}

const TARGETS_BY_GOAL: Record<FitnessGoal, MacroTargets> = {
  lose_weight:       { calories: 1800, protein_g: 160, carbs_g: 150, fat_g: 60 },
  build_muscle:      { calories: 2500, protein_g: 180, carbs_g: 250, fat_g: 80 },
  maintain:          { calories: 2200, protein_g: 150, carbs_g: 230, fat_g: 73 },
  improve_endurance: { calories: 2400, protein_g: 140, carbs_g: 280, fat_g: 65 },
  increase_strength: { calories: 2600, protein_g: 190, carbs_g: 260, fat_g: 85 },
}

export function getTargetsForGoal(goal: FitnessGoal): MacroTargets {
  return TARGETS_BY_GOAL[goal] ?? TARGETS_BY_GOAL.maintain
}

export interface FoodEntry {
  id: string
  meal_type: string
  food_name_snapshot: string
  quantity_grams: number
  calories: number
  protein_g: number
  carbs_g: number
  fat_g: number
  created_at: string
}

export interface DailyLog {
  id: string
  logged_date: string
  entries: FoodEntry[]
}

export interface RecentFood {
  food_name_snapshot: string
  calories: number
  protein_g: number
  carbs_g: number
  fat_g: number
  quantity_grams: number
}

export interface WeeklyDay {
  date: string
  calories: number
  protein_g: number
  entries_count: number
}

export async function getTodayLog(date: string): Promise<DailyLog | null> {
  const supabase = await getSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data: log } = await supabase
    .from('nutrition_logs')
    .select('id, logged_date')
    .eq('user_id', user.id)
    .eq('logged_date', date)
    .maybeSingle()

  if (!log) return { id: '', logged_date: date, entries: [] }

  const { data: entries } = await supabase
    .from('food_entries')
    .select('id, meal_type, food_name_snapshot, quantity_grams, calories, protein_g, carbs_g, fat_g, created_at')
    .eq('nutrition_log_id', log.id)
    .order('created_at', { ascending: true })

  return { id: log.id, logged_date: log.logged_date, entries: (entries ?? []) as FoodEntry[] }
}

export async function getRecentFoods(limit = 10): Promise<RecentFood[]> {
  const supabase = await getSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []

  const { data } = await supabase
    .from('food_entries')
    .select('food_name_snapshot, calories, protein_g, carbs_g, fat_g, quantity_grams')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(60)

  if (!data) return []

  const seen = new Set<string>()
  const unique: RecentFood[] = []
  for (const e of data) {
    const key = e.food_name_snapshot.toLowerCase().trim()
    if (!seen.has(key)) {
      seen.add(key)
      unique.push(e as RecentFood)
      if (unique.length >= limit) break
    }
  }
  return unique
}

export async function getWeeklyHistory(): Promise<WeeklyDay[]> {
  const supabase = await getSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []

  const days: WeeklyDay[] = []
  for (let i = 6; i >= 0; i--) {
    const d = new Date()
    d.setDate(d.getDate() - i)
    days.push({ date: d.toISOString().split('T')[0], calories: 0, protein_g: 0, entries_count: 0 })
  }

  const { data: logs } = await supabase
    .from('nutrition_logs')
    .select('id, logged_date')
    .eq('user_id', user.id)
    .gte('logged_date', days[0].date)
    .lte('logged_date', days[6].date)

  if (!logs?.length) return days

  const { data: entries } = await supabase
    .from('food_entries')
    .select('nutrition_log_id, calories, protein_g')
    .in('nutrition_log_id', logs.map(l => l.id))

  const logDateMap = new Map(logs.map(l => [l.id, l.logged_date]))
  const agg = new Map<string, { cal: number; prot: number; count: number }>()

  for (const e of entries ?? []) {
    const date = logDateMap.get(e.nutrition_log_id)
    if (!date) continue
    const cur = agg.get(date) ?? { cal: 0, prot: 0, count: 0 }
    cur.cal += e.calories
    cur.prot += e.protein_g
    cur.count += 1
    agg.set(date, cur)
  }

  return days.map(d => ({
    date: d.date,
    calories: Math.round(agg.get(d.date)?.cal ?? 0),
    protein_g: Math.round(agg.get(d.date)?.prot ?? 0),
    entries_count: agg.get(d.date)?.count ?? 0,
  }))
}
