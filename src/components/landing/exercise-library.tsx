'use client'

import { useState } from 'react'
import { ArrowUpRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { ExerciseCard, type Exercise, type Category } from './exercise-card'
import { VideoModal } from './video-modal'

// ---------------------------------------------------------------------------
// Exercise data
// Note: YouTube video IDs can be swapped at any time — replace the youtubeId
// field with the correct ID from any tutorial you prefer.
// ---------------------------------------------------------------------------
const EXERCISES: Exercise[] = [
  // ── PUSH ──────────────────────────────────────────────────────────────────
  {
    id: 'bench-press',
    name: 'Bench Press',
    muscles: ['Chest', 'Triceps', 'Front Delts'],
    difficulty: 'Intermediate',
    description:
      'The foundational horizontal press. Build chest thickness and raw pushing power by lowering a barbell to your chest and driving it back up. Grip width shifts the load between chest and triceps.',
    formTips: [
      'Retract shoulder blades and plant them firmly into the bench',
      'Lower bar to lower chest with elbows at ~45° — not flared',
      'Drive your feet into the floor and press to full lockout',
    ],
    youtubeId: 'SCVCLChPQFY',
    category: 'push',
  },
  {
    id: 'overhead-press',
    name: 'Overhead Press',
    muscles: ['Shoulders', 'Triceps', 'Upper Traps'],
    difficulty: 'Intermediate',
    description:
      'Press a barbell from collarbone to overhead lockout. One of the best raw shoulder and upper-body strength builders. Demands full-body tension and solid core bracing.',
    formTips: [
      'Grip just outside shoulder width, elbows slightly forward',
      'Squeeze glutes and brace core before pressing',
      'Push your head through the window as the bar passes your face',
    ],
    youtubeId: 'qEwKCR5JCog',
    category: 'push',
  },
  {
    id: 'push-up',
    name: 'Push-Up',
    muscles: ['Chest', 'Triceps', 'Core'],
    difficulty: 'Beginner',
    description:
      'The classic bodyweight press. No equipment needed. Builds chest, tricep, and core strength simultaneously. Elevate your feet or add a weighted vest to make it harder.',
    formTips: [
      'Hands under shoulders, body in a straight plank line',
      'Lower until chest lightly grazes the floor',
      'Keep elbows at ~45° — not tucked fully in or flared out',
    ],
    youtubeId: 'IODxDxX7oi4',
    category: 'push',
  },
  {
    id: 'dip',
    name: 'Dip',
    muscles: ['Chest', 'Triceps', 'Front Delts'],
    difficulty: 'Intermediate',
    description:
      'A compound dip between two parallel bars. Leaning forward emphasises the chest; staying upright hits triceps harder. Scale with a band or add weight as you progress.',
    formTips: [
      'Lower until upper arms are parallel to the floor',
      'Lean forward slightly for chest focus; stay upright for triceps',
      'Avoid shrugging — keep shoulders depressed throughout',
    ],
    youtubeId: 'yN6Q1UI_xb0',
    category: 'push',
  },

  // ── PULL ──────────────────────────────────────────────────────────────────
  {
    id: 'pull-up',
    name: 'Pull-Up',
    muscles: ['Lats', 'Biceps', 'Rear Delts'],
    difficulty: 'Intermediate',
    description:
      'Hang from a bar and pull your chin above it. One of the most effective upper-body pulling exercises. Wide grip targets lats; close grip recruits more biceps.',
    formTips: [
      'Start from a dead hang with arms fully extended',
      'Initiate by pulling shoulder blades down and together',
      'Pull until chin clears the bar — no half reps',
    ],
    youtubeId: 'eGo4IYlbE5g',
    category: 'pull',
  },
  {
    id: 'bent-over-row',
    name: 'Bent-Over Row',
    muscles: ['Upper Back', 'Lats', 'Biceps'],
    difficulty: 'Intermediate',
    description:
      'Hinge at the hips and row a barbell into your lower chest. Builds back thickness and strength that carries over to every other compound lift. Grip width changes muscle emphasis.',
    formTips: [
      'Torso roughly 45° to the floor, back flat — no rounding',
      'Drive elbows back rather than pulling with your hands',
      'Pause at the top and squeeze the shoulder blades together',
    ],
    youtubeId: 'vT2GjY_Umpw',
    category: 'pull',
  },
  {
    id: 'lat-pulldown',
    name: 'Lat Pulldown',
    muscles: ['Lats', 'Biceps', 'Rear Delts'],
    difficulty: 'Beginner',
    description:
      'Pull a cable bar from overhead to your collarbone. A beginner-friendly pull-up substitute that lets you set the exact load. Great for building the width of your back.',
    formTips: [
      'Lean back slightly and pull the bar to your upper chest',
      'Lead with the elbows — imagine them pointing to the floor',
      'Control the weight on the way back up — no yanking',
    ],
    youtubeId: 'CAwf7n6Tugg',
    category: 'pull',
  },
  {
    id: 'face-pull',
    name: 'Face Pull',
    muscles: ['Rear Delts', 'Rotator Cuff', 'Traps'],
    difficulty: 'Beginner',
    description:
      'Pull a cable rope to your face with elbows high. Often overlooked, it directly targets the posterior shoulder and rotator cuff — crucial for shoulder health and posture.',
    formTips: [
      'Set the cable at head height and use a rope attachment',
      'Keep elbows above wrists and pull to forehead level',
      'Externally rotate at the top — thumbs pointing behind you',
    ],
    youtubeId: 'eIq5CB9JfKE',
    category: 'pull',
  },

  // ── LEGS ──────────────────────────────────────────────────────────────────
  {
    id: 'back-squat',
    name: 'Back Squat',
    muscles: ['Quads', 'Glutes', 'Hamstrings'],
    difficulty: 'Intermediate',
    description:
      'The king of lower-body training. A barbell on your upper back while you squat to depth. Builds overall leg mass, core strength, and athletic power unlike any other movement.',
    formTips: [
      'Feet shoulder-width, toes slightly out — find your stance',
      'Brace core hard, chest up, and sit between your heels',
      'Drive knees out over toes on the way up — no caving',
    ],
    youtubeId: 'bEv6CCg2BC8',
    category: 'legs',
  },
  {
    id: 'romanian-deadlift',
    name: 'Romanian Deadlift',
    muscles: ['Hamstrings', 'Glutes', 'Lower Back'],
    difficulty: 'Intermediate',
    description:
      'Hinge at the hips with a barbell, feeling a deep hamstring stretch at the bottom. Excellent for hamstring hypertrophy and glute development without heavy spinal loading.',
    formTips: [
      'Push hips back — not knees down — to initiate the hinge',
      'Keep bar close to legs; feel the hamstring stretch at bottom',
      'Drive hips forward to stand; squeeze glutes at lockout',
    ],
    youtubeId: 'JCXUYuzwNrM',
    category: 'legs',
  },
  {
    id: 'walking-lunge',
    name: 'Walking Lunge',
    muscles: ['Quads', 'Glutes', 'Hamstrings'],
    difficulty: 'Beginner',
    description:
      'Step forward into a lunge, alternating legs as you walk. Builds single-leg strength, balance, and hip stability. Add dumbbells or a barbell to increase the challenge.',
    formTips: [
      'Step forward so front knee stays over the ankle',
      'Lower back knee toward the floor without touching it',
      'Keep torso upright — resist leaning forward',
    ],
    youtubeId: 'QOVaHwm-Q6U',
    category: 'legs',
  },
  {
    id: 'leg-press',
    name: 'Leg Press',
    muscles: ['Quads', 'Glutes', 'Hamstrings'],
    difficulty: 'Beginner',
    description:
      'Push a weighted sled away from you on a 45° machine. Allows heavy quad and glute loading with minimal lower-back stress. Foot placement changes which muscles are emphasized.',
    formTips: [
      'Place feet shoulder-width at mid-height on the platform',
      'Lower until knees are at 90° — never let lower back round',
      'Press through the whole foot; avoid locking knees at the top',
    ],
    youtubeId: 'IZxyjW7MPJQ',
    category: 'legs',
  },
]

// ---------------------------------------------------------------------------
// Section tab config
// ---------------------------------------------------------------------------
type Tab = { id: Category; label: string; emoji: string; color: string }

const TABS: Tab[] = [
  { id: 'push', label: 'Push', emoji: '💪', color: 'data-[active=true]:border-blue-500 data-[active=true]:text-blue-600 dark:data-[active=true]:text-blue-400' },
  { id: 'pull', label: 'Pull', emoji: '🏋️', color: 'data-[active=true]:border-orange-500 data-[active=true]:text-orange-600 dark:data-[active=true]:text-orange-400' },
  { id: 'legs', label: 'Legs', emoji: '🦵', color: 'data-[active=true]:border-emerald-500 data-[active=true]:text-emerald-600 dark:data-[active=true]:text-emerald-400' },
]

const SECTION_DESCRIPTIONS: Record<Category, string> = {
  push: 'Movements where you push weight away from your body — chest, shoulders, and triceps.',
  pull: 'Movements where you pull weight toward you — back width, thickness, and biceps.',
  legs: 'Lower-body power: quads, hamstrings, glutes, and everything connecting them.',
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------
export function ExerciseLibrary() {
  const [activeTab, setActiveTab] = useState<Category>('push')
  const [watchingExercise, setWatchingExercise] = useState<Exercise | null>(null)

  const filtered = EXERCISES.filter(e => e.category === activeTab)

  return (
    <>
      {/* Section tabs */}
      <div className="sticky top-[57px] z-10 border-b border-border bg-background/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-4xl px-4">
          {TABS.map(tab => (
            <button
              key={tab.id}
              data-active={activeTab === tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                'flex flex-1 items-center justify-center gap-1.5 border-b-2 border-transparent py-3 text-sm font-semibold text-muted-foreground transition-colors duration-150 hover:text-foreground',
                tab.color,
              )}
            >
              <span>{tab.emoji}</span>
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Section header */}
      <div className="mx-auto w-full max-w-4xl px-4 pt-6">
        <p className="text-sm text-muted-foreground">{SECTION_DESCRIPTIONS[activeTab]}</p>
      </div>

      {/* Cards grid */}
      <div className="mx-auto w-full max-w-4xl px-4 pb-10 pt-4">
        <div className="grid gap-4 sm:grid-cols-2">
          {filtered.map(ex => (
            <ExerciseCard key={ex.id} exercise={ex} onWatch={setWatchingExercise} />
          ))}
        </div>
      </div>

      {/* Video modal */}
      {watchingExercise && (
        <VideoModal
          youtubeId={watchingExercise.youtubeId}
          title={`${watchingExercise.name} — Tutorial`}
          onClose={() => setWatchingExercise(null)}
        />
      )}
    </>
  )
}

export { EXERCISES }
