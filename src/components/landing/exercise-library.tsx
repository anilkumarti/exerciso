'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'
import { ExerciseCard, type Exercise, type Category } from './exercise-card'
import { VideoModal } from './video-modal'

// ---------------------------------------------------------------------------
// Exercise data
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
    youtubeId: 'vcBig73ojpE',
    category: 'push',
    rating: 9,
    alternates: [
      {
        name: 'Dumbbell Bench Press',
        muscles: ['Chest', 'Triceps'],
        difficulty: 'Beginner',
        description: 'Each arm works independently, exposing and correcting strength imbalances with a greater range of motion than the barbell.',
        benefits: ['More chest stretch at the bottom', 'Corrects left-right asymmetry', 'Easier on wrists and shoulders'],
        whenToChoose: 'no barbell is available, or you want more chest stretch and independent arm training.',
        youtubeId: 'Y_7aHqXeCfQ',
      },
      {
        name: 'Floor Press',
        muscles: ['Chest', 'Triceps'],
        difficulty: 'Intermediate',
        description: 'Press a barbell lying on the floor. Limited range of motion removes leg drive and reduces shoulder strain.',
        benefits: ['Safer for shoulder impingement', 'Emphasises lockout strength', 'Requires no bench'],
        whenToChoose: 'shoulder pain prevents full bench ROM, or you have no bench available.',
        youtubeId: 'uUGDRwge4F8',
      },
      {
        name: 'Cable Fly',
        muscles: ['Chest', 'Front Delts'],
        difficulty: 'Beginner',
        description: 'Cable crossover maintaining constant tension through the full arc — excellent for chest isolation and the inner-chest squeeze.',
        benefits: ['Constant tension throughout', 'Deep chest stretch at the start', 'Great isolation finisher'],
        whenToChoose: 'finishing a chest session or targeting inner-chest detail work.',
        youtubeId: 'Wz56ZpaFwec',
      },
    ],
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
    youtubeId: '_RlRDWO2jfg',
    category: 'push',
    rating: 9,
    alternates: [
      {
        name: 'Dumbbell Shoulder Press',
        muscles: ['Shoulders', 'Triceps'],
        difficulty: 'Beginner',
        description: 'Press dumbbells overhead independently for balanced shoulder development and a greater natural range of motion.',
        benefits: ['Greater ROM than barbell', 'Fixes left-right imbalances', 'More shoulder-joint-friendly arc'],
        whenToChoose: 'barbell OHP causes discomfort, or you notice one shoulder lagging behind.',
        youtubeId: 'qEwKCR5JCog',
      },
      {
        name: 'Arnold Press',
        muscles: ['Shoulders', 'Triceps'],
        difficulty: 'Intermediate',
        description: 'Rotating dumbbell press that cycles through pronation to supination, hitting all three deltoid heads in one movement.',
        benefits: ['Targets all deltoid heads', 'Greater muscle activation', 'Adds variety to shoulder training'],
        whenToChoose: 'you want complete shoulder development and are comfortable with dumbbell pressing.',
        youtubeId: '6Z15_WdHn64',
      },
      {
        name: 'Landmine Press',
        muscles: ['Shoulders', 'Core'],
        difficulty: 'Beginner',
        description: 'Angled barbell press using a landmine attachment — the natural arc is friendlier to the shoulder joint than vertical pressing.',
        benefits: ['Shoulder-friendly pressing angle', 'Core stabilisation demand', 'Ideal stepping stone to overhead work'],
        whenToChoose: 'overhead pressing causes shoulder pain, or you are building a base before loading vertical presses.',
        youtubeId: 'irJhtqfJscs',
      },
    ],
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
    rating: 8,
    alternates: [
      {
        name: 'Incline Push-Up',
        muscles: ['Chest', 'Triceps'],
        difficulty: 'Beginner',
        description: 'Hands on an elevated surface reduces the effective load — a perfect entry point for building toward a standard push-up.',
        benefits: ['Reduced bodyweight load', 'Same push pattern without full difficulty', 'Easily progressed by lowering the elevation'],
        whenToChoose: 'standard push-ups are currently too difficult and you need a regression.',
        youtubeId: 'cfns5VDVVvk',
      },
      {
        name: 'Decline Push-Up',
        muscles: ['Chest', 'Triceps'],
        difficulty: 'Intermediate',
        description: 'Feet elevated on a box or bench shifts emphasis to the upper chest and increases the load beyond a flat push-up.',
        benefits: ['Greater upper-chest activation', 'Increases difficulty without equipment', 'Prepares for handstand push-up work'],
        whenToChoose: 'standard push-ups feel too easy and you want more challenge without a weighted vest.',
        youtubeId: 'SKPab2YC8BE',
      },
      {
        name: 'Diamond Push-Up',
        muscles: ['Triceps', 'Chest'],
        difficulty: 'Intermediate',
        description: 'Close-grip push-up with index fingers and thumbs touching — dramatically increases tricep recruitment.',
        benefits: ['Maximum tricep activation', 'No equipment needed', 'Targets the lateral head of the tricep'],
        whenToChoose: 'you want to bias triceps over chest, or as a tricep finisher at the end of a session.',
        youtubeId: 'J0DnG1GCE6o',
      },
    ],
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
    youtubeId: '2z8JmcrW-As',
    category: 'push',
    rating: 8,
    alternates: [
      {
        name: 'Close-Grip Bench Press',
        muscles: ['Triceps', 'Chest'],
        difficulty: 'Intermediate',
        description: 'Narrow grip barbell press that heavily isolates the triceps while still allowing heavy loading with precise weight increments.',
        benefits: ['Easy to progressively overload', 'Heavy tricep stimulus', 'No shoulder instability risk'],
        whenToChoose: 'dips cause shoulder discomfort, or you want to load the triceps heavier than bodyweight allows.',
        youtubeId: 'NKHhj7SJsQA',
      },
      {
        name: 'Tricep Pushdown',
        muscles: ['Triceps'],
        difficulty: 'Beginner',
        description: 'Cable machine isolation for the triceps through a controlled downward push — constant tension and easy weight adjustment.',
        benefits: ['Beginner-friendly and joint-safe', 'Constant cable tension', 'Quickly adjust load between sets'],
        whenToChoose: 'dips irritate the shoulder or you want an isolated tricep finisher with high reps.',
        youtubeId: 'yftl1tBWmKk',
      },
      {
        name: 'Skull Crusher',
        muscles: ['Triceps'],
        difficulty: 'Intermediate',
        description: 'Lying EZ-bar or dumbbell extension that provides a deep stretch for the long head of the tricep at the bottom position.',
        benefits: ['Long-head tricep stretch', 'Allows heavy loading', 'Pairs well with close-grip bench for a superset'],
        whenToChoose: 'maximising tricep mass is the priority, especially the long head that shows from the side.',
        youtubeId: '0VAO8f8khqM',
      },
    ],
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
    rating: 10,
    alternates: [
      {
        name: 'Chin-Up',
        muscles: ['Biceps', 'Lats'],
        difficulty: 'Intermediate',
        description: 'Supinated (underhand) grip pull-up that recruits more biceps while being slightly easier than a standard pull-up.',
        benefits: ['More bicep involvement', 'Slightly more accessible than overhand', 'Same fundamental pulling pattern'],
        whenToChoose: 'building toward overhand pull-ups, or you want to combine lat and bicep work in one movement.',
        youtubeId: 'dhn5lND_Dfs',
      },
      {
        name: 'Assisted Pull-Up',
        muscles: ['Lats', 'Biceps'],
        difficulty: 'Beginner',
        description: 'Use a resistance band looped around the bar or an assisted pull-up machine to reduce effective bodyweight load.',
        benefits: ['Learn correct form without full bodyweight', 'Adjustable assistance level', 'Direct path to unassisted pull-ups'],
        whenToChoose: 'you cannot yet complete a full unassisted pull-up and are building toward it.',
        youtubeId: '6GWT7GLXE3c',
      },
      {
        name: 'Lat Pulldown',
        muscles: ['Lats', 'Biceps'],
        difficulty: 'Beginner',
        description: 'Cable machine version of the same vertical pulling pattern — set the exact weight and focus on lat activation.',
        benefits: ['Fully adjustable load', 'Great for high-volume work', 'Builds the pattern before pull-ups'],
        whenToChoose: 'you are a beginner building up to pull-ups, or want high-rep volume that bodyweight does not allow.',
        youtubeId: 'O94yEoGXtBY',
      },
    ],
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
    youtubeId: 'axoeDmW0oAY',
    category: 'pull',
    rating: 9,
    alternates: [
      {
        name: 'Dumbbell Row',
        muscles: ['Back', 'Biceps'],
        difficulty: 'Beginner',
        description: 'Single-arm row braced on a bench — each side works independently with a greater range of motion than the barbell version.',
        benefits: ['Removes lower back from the equation', 'Full ROM unimpeded by the other arm', 'Corrects side-to-side imbalances'],
        whenToChoose: 'your lower back is fatigued, or one side of your back is noticeably weaker.',
        youtubeId: 'pYcpY20QaE8',
      },
      {
        name: 'Seated Cable Row',
        muscles: ['Back', 'Biceps'],
        difficulty: 'Beginner',
        description: 'Seated row with chest support and constant cable tension — isolates the back without any lower-back loading.',
        benefits: ['No lower back stress', 'Constant tension through full ROM', 'Easy to keep volume high safely'],
        whenToChoose: 'lower back fatigue makes barbell rows unsuitable, or for high-rep accessory volume.',
        youtubeId: 'YwoCJGDVyEY',
      },
      {
        name: 'T-Bar Row',
        muscles: ['Back', 'Biceps'],
        difficulty: 'Intermediate',
        description: 'Narrow-grip row using a barbell in a landmine — more stable than a barbell row and allows heavier loading of the mid-back.',
        benefits: ['Greater mid-back thickness stimulus', 'More stable than free barbell', 'Neutral grip is easier on wrists'],
        whenToChoose: 'you want a different pulling angle or to overload the mid-back with heavier weight.',
        youtubeId: 'j3Igk5nyZE4',
      },
    ],
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
    youtubeId: 'O94yEoGXtBY',
    category: 'pull',
    rating: 7,
    alternates: [
      {
        name: 'Pull-Up',
        muscles: ['Lats', 'Biceps'],
        difficulty: 'Intermediate',
        description: 'The bodyweight equivalent — superior for building raw strength since your entire bodyweight is engaged with every rep.',
        benefits: ['Greater strength development', 'No machine required', 'Translates to better athletic performance'],
        whenToChoose: 'you can complete 5+ pull-ups consistently and want to progress beyond machine-assisted pulling.',
        youtubeId: 'eGo4IYlbE5g',
      },
      {
        name: 'Straight-Arm Pulldown',
        muscles: ['Lats'],
        difficulty: 'Beginner',
        description: 'Cable pulldown with arms locked straight — removes the biceps entirely and forces pure lat contraction.',
        benefits: ['Pure lat isolation', 'Builds mind-muscle connection to the lats', 'Great as a pre-activation warm-up'],
        whenToChoose: 'your biceps fatigue before your lats during pulldowns, or you want to pre-exhaust the lats.',
        youtubeId: 'G9uNaXGTJ4w',
      },
      {
        name: 'Single-Arm Pulldown',
        muscles: ['Lats', 'Biceps'],
        difficulty: 'Intermediate',
        description: 'One arm at a time on a cable — eliminates compensation from the dominant side and targets each lat independently.',
        benefits: ['Eliminates dominant-side compensation', 'Greater range of motion per side', 'Identifies and corrects imbalances'],
        whenToChoose: 'one side of your back is noticeably weaker, or you want unilateral focus.',
        youtubeId: 'jhnxJEzX8rY',
      },
    ],
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
    youtubeId: 'ljgqer1ZpXg',
    category: 'pull',
    rating: 9,
    alternates: [
      {
        name: 'Rear Delt Fly',
        muscles: ['Rear Delts'],
        difficulty: 'Beginner',
        description: 'Bent-over dumbbell lateral raise targeting the posterior deltoid — the no-cable alternative to face pulls.',
        benefits: ['No cable machine needed', 'Direct rear delt isolation', 'Easy to superset with other dumbbell work'],
        whenToChoose: 'a cable machine is unavailable, or you prefer dumbbell-based rear delt work.',
        youtubeId: 'qfc70k40318',
      },
      {
        name: 'Band Pull-Apart',
        muscles: ['Rear Delts', 'Rotator Cuff'],
        difficulty: 'Beginner',
        description: 'Pull a resistance band horizontally apart at chest height — portable, lightweight, and excellent for posture correction.',
        benefits: ['Requires only a resistance band', 'Perfect daily mobility drill', 'Reinforces good posture throughout the day'],
        whenToChoose: 'you want a daily shoulder-health drill or a low-load warm-up before pressing.',
        youtubeId: 'OhOe6yA_zYk',
      },
      {
        name: 'External Rotation',
        muscles: ['Rotator Cuff'],
        difficulty: 'Beginner',
        description: 'Cable or band rotation outward at 90° elbow bend — directly strengthens the rotator cuff muscles that stabilise the shoulder.',
        benefits: ['Directly targets rotator cuff', 'Essential for injury prevention', 'Addresses the root cause of many shoulder issues'],
        whenToChoose: 'you have a history of shoulder impingement or want to add prehab/rehab work.',
        youtubeId: '7R-cZYyhtI0',
      },
    ],
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
    youtubeId: 'UFs6E3Ti1jg',
    category: 'legs',
    rating: 10,
    alternates: [
      {
        name: 'Goblet Squat',
        muscles: ['Quads', 'Glutes'],
        difficulty: 'Beginner',
        description: 'Hold a dumbbell or kettlebell at chest height while squatting — the counterbalance naturally promotes an upright torso and correct depth.',
        benefits: ['Teaches squat mechanics instantly', 'Upright torso reduces lower back strain', 'Beginner-friendly with no spotter needed'],
        whenToChoose: 'learning to squat for the first time, or warming up before heavier barbell work.',
        youtubeId: 'TN7mk5BdoGI',
      },
      {
        name: 'Front Squat',
        muscles: ['Quads', 'Core'],
        difficulty: 'Intermediate',
        description: 'Barbell held at collarbone level — demands a more upright torso, placing greater emphasis on the quads and core.',
        benefits: ['Greater quad emphasis than back squat', 'More upright torso = less lower-back stress', 'Excellent for Olympic lifting carry-over'],
        whenToChoose: 'quad development is the priority, or low-bar squatting causes lower back discomfort.',
        youtubeId: 'v-mQm_droHg',
      },
      {
        name: 'Bulgarian Split Squat',
        muscles: ['Quads', 'Glutes'],
        difficulty: 'Intermediate',
        description: 'Rear foot elevated single-leg squat — arguably the best unilateral leg exercise, combining deep stretch with high load.',
        benefits: ['Fixes leg-strength imbalances', 'Deep hip flexor stretch', 'High intensity without heavy spinal loading'],
        whenToChoose: 'addressing left-right imbalances, or adding leg intensity without loading the spine heavily.',
        youtubeId: 'hiLF_pF3EJM',
      },
    ],
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
    youtubeId: '_oyxCn2iSjU',
    category: 'legs',
    rating: 9,
    alternates: [
      {
        name: 'Good Morning',
        muscles: ['Hamstrings', 'Lower Back'],
        difficulty: 'Intermediate',
        description: 'Bar on upper back, hinge forward with a soft knee bend — reinforces the hip-hinge pattern and strengthens the lower back alongside the hamstrings.',
        benefits: ['Reinforces hip-hinge mechanics', 'Strengthens spinal erectors', 'Useful accessory for deadlift and squat'],
        whenToChoose: 'you want to reinforce the hip hinge or add extra lower-back and hamstring accessory work.',
        youtubeId: 'f23vXjoG2e8',
      },
      {
        name: 'Lying Leg Curl',
        muscles: ['Hamstrings'],
        difficulty: 'Beginner',
        description: 'Machine curl in a prone position — pure hamstring isolation with zero lower-back involvement.',
        benefits: ['Strict hamstring isolation', 'No spinal loading whatsoever', 'Great for high-rep hamstring finishers'],
        whenToChoose: 'lower back is fatigued from other work, or you want strict hamstring isolation.',
        youtubeId: 'jobEeklwrrs',
      },
      {
        name: 'Nordic Curl',
        muscles: ['Hamstrings'],
        difficulty: 'Advanced',
        description: 'Knees anchored while you lower your torso to the floor using the hamstrings eccentrically — one of the most demanding hamstring exercises.',
        benefits: ['Elite eccentric hamstring strength', 'Proven to reduce hamstring injury risk', 'No machine required'],
        whenToChoose: 'advanced athletes focused on hamstring injury prevention or maximum eccentric strength.',
        youtubeId: '6NCN6kOagfY',
      },
    ],
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
    youtubeId: 'cFaqN-BY-ZY',
    category: 'legs',
    rating: 7,
    alternates: [
      {
        name: 'Reverse Lunge',
        muscles: ['Quads', 'Glutes'],
        difficulty: 'Beginner',
        description: 'Step backward into a lunge instead of forward — reduces the shear force on the front knee and is easier to control for most beginners.',
        benefits: ['Less knee stress than forward lunge', 'Easier to control balance', 'Same muscles with a safer knee angle'],
        whenToChoose: 'forward lunges cause knee discomfort, or balance is a limiting factor.',
        youtubeId: '38xlLGfguz4',
      },
      {
        name: 'Bulgarian Split Squat',
        muscles: ['Quads', 'Glutes'],
        difficulty: 'Intermediate',
        description: 'Stationary single-leg squat with the rear foot elevated on a bench — the gold standard for unilateral leg hypertrophy.',
        benefits: ['Maximum single-leg strength and mass', 'Deep hip flexor stretch', 'High intensity with moderate load'],
        whenToChoose: 'maximum single-leg development or correcting a significant strength imbalance is the goal.',
        youtubeId: 'hiLF_pF3EJM',
      },
      {
        name: 'Step-Up',
        muscles: ['Quads', 'Glutes'],
        difficulty: 'Beginner',
        description: 'Step onto a box or bench alternating legs — functional, scalable, and easy on the knees.',
        benefits: ['Highly functional movement pattern', 'Minimal knee stress', 'Scalable by box height and added load'],
        whenToChoose: 'knee sensitivity makes lunges uncomfortable, or you need a functional, low-impact alternative.',
        youtubeId: '8q9LVgN2RD4',
      },
    ],
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
    youtubeId: 'B6rGDcfyPto',
    category: 'legs',
    rating: 6,
    alternates: [
      {
        name: 'Goblet Squat',
        muscles: ['Quads', 'Glutes'],
        difficulty: 'Beginner',
        description: 'Hold a weight at chest height and squat — a great machine-free alternative that also teaches correct squat mechanics.',
        benefits: ['No machine required', 'Reinforces squat mechanics simultaneously', 'Scalable with any dumbbell or kettlebell'],
        whenToChoose: 'the leg press machine is occupied, or you are training somewhere without machines.',
        youtubeId: 'TN7mk5BdoGI',
      },
      {
        name: 'Hack Squat Machine',
        muscles: ['Quads', 'Glutes'],
        difficulty: 'Intermediate',
        description: 'Machine squat on a 45° sled with shoulders supported — greater quad emphasis than the leg press thanks to the more upright position.',
        benefits: ['Superior quad isolation', 'Supported movement with heavy loads', 'More knee-over-toe range than leg press'],
        whenToChoose: 'quad isolation is the priority, or you want more knee flexion than the leg press allows.',
        youtubeId: '4cxt_Tldugw',
      },
      {
        name: 'Smith Machine Squat',
        muscles: ['Quads', 'Glutes'],
        difficulty: 'Beginner',
        description: 'Barbell squat on a guided vertical track — removes the balance demand and lets you focus on depth and leg drive.',
        benefits: ['Safe without a spotter', 'Guided path builds confidence', 'Foot placement can be varied like a free squat'],
        whenToChoose: 'training alone without a spotter, or building squat confidence before moving to free barbell.',
        youtubeId: 'AHnX-aimA4E',
      },
    ],
  },
]

// ---------------------------------------------------------------------------
// Section tab config
// ---------------------------------------------------------------------------
type Tab = { id: Category; label: string; emoji: string; color: string }

const TABS: Tab[] = [
  { id: 'push', label: 'Push', emoji: '💪', color: 'data-[active=true]:border-violet-500 data-[active=true]:text-violet-600 dark:data-[active=true]:text-violet-400' },
  { id: 'pull', label: 'Pull', emoji: '🏋️', color: 'data-[active=true]:border-violet-500 data-[active=true]:text-violet-600 dark:data-[active=true]:text-violet-400' },
  { id: 'legs', label: 'Legs', emoji: '🦵', color: 'data-[active=true]:border-violet-500 data-[active=true]:text-violet-600 dark:data-[active=true]:text-violet-400' },
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
