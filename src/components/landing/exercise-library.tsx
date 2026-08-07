'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'
import { ExerciseCard, type Exercise, type Category } from './exercise-card'
import { VideoModal } from './video-modal'

// ---------------------------------------------------------------------------
// Exercise data
// ---------------------------------------------------------------------------
export const EXERCISES: Exercise[] = [
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
    dos: [
      'Retract and depress shoulder blades before unracking the bar',
      'Keep a natural arch in your lower back for stability',
      'Plant feet firmly and use leg drive throughout the press',
      'Touch the bar to your lower chest on every rep',
    ],
    donts: [
      'Bounce the bar off your chest to use momentum',
      'Flare elbows straight out to 90° from your torso',
      'Let your hips rise off the bench',
      'Use a thumbless grip — always wrap your thumbs around the bar',
    ],
    commonMistakes: [
      {
        mistake: 'Bar path drifting toward the face',
        correction: 'Keep the bar in a slight arc — lower to the lower chest and press back toward the rack, not straight up',
      },
      {
        mistake: 'Elbows flared out to 90°',
        correction: 'Tuck elbows to 45–60° from the torso to protect the shoulder joint under load',
      },
      {
        mistake: 'Feet raised or tip-toeing on the floor',
        correction: 'Plant feet flat and drive them into the ground to create full-body tension through the press',
      },
    ],
    progressionTips: [
      'Add 2.5 kg every session until you stall — then switch to weekly increments',
      'Use close-grip bench to address lagging triceps that limit your press',
      'Pause reps (2 s at the chest) eliminate bounce and reveal true bottom-position strength',
      'When stuck, add a back-off set at 80% for higher reps to build total volume',
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
    dos: [
      'Grip just outside shoulder width with elbows slightly forward',
      'Brace core and squeeze glutes hard before every press',
      'Push your head through the "window" as the bar clears your face',
      'Lock out fully overhead with ears between your upper arms',
    ],
    donts: [
      'Press with excessive forward lean that turns it into an incline press',
      'Let the lower back hyperextend — keep the pelvis neutral',
      'Allow the bar to drift forward away from the midline',
      'Use a grip wider than shoulder width',
    ],
    commonMistakes: [
      {
        mistake: 'Wrist pain from cocked-back wrists',
        correction: 'Keep wrists stacked directly over elbows — a slight forward lean of the wrist is fine but avoid bending them back',
      },
      {
        mistake: 'Excessive lower-back arching under load',
        correction: 'Brace your core hard throughout; tuck the pelvis slightly to reduce lumbar stress and prevent the bar drifting forward',
      },
      {
        mistake: 'Bar drifting forward throughout the lift',
        correction: 'Start at the collarbone and press in a vertical line — clearing the face requires only a brief head-back cue, not a permanent lean',
      },
    ],
    progressionTips: [
      'Use 2.5 kg jumps each session; switch to 1.25 kg microplates when progress stalls',
      'Add seated dumbbell shoulder presses on off days to build total pressing volume',
      'Include face pulls after every OHP session to balance anterior and posterior deltoid strength',
      'When stuck, use a push press (leg drive) to overload the top and build confidence overhead',
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
    dos: [
      'Form a straight line from head to heels before starting',
      'Keep elbows at ~45° from your torso throughout every rep',
      'Lower until your chest lightly grazes the floor',
      'Press through the full palm — do not rest all load on the wrists',
    ],
    donts: [
      'Let hips sag toward the floor or pike upward',
      'Flare elbows straight out to 90° from the body',
      'Stop short of touching the floor — full ROM matters',
      'Hold your breath — exhale on the push, inhale on the way down',
    ],
    commonMistakes: [
      {
        mistake: 'Hips sagging toward the floor mid-rep',
        correction: 'Squeeze glutes and brace core throughout — the hips should stay in line with shoulders and heels the entire time',
      },
      {
        mistake: 'Head dropping forward',
        correction: 'Maintain a neutral neck by looking slightly ahead of your hands, not straight down at the floor',
      },
      {
        mistake: 'Short range of motion to bang out more reps',
        correction: 'Lower all the way until the chest touches, then press to full arm extension — half reps deliver half the stimulus',
      },
    ],
    progressionTips: [
      'Build volume first: reach 3 × 15 with perfect form before making the exercise harder',
      'Progression ladder: incline → standard → decline → weighted vest → archer push-ups',
      'Add one rep per set each session to progressively overload without any equipment',
      'Ring push-ups add instability and significantly increase difficulty without loading the wrists',
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
    dos: [
      'Start in a locked-out position with shoulders actively depressed',
      'Lower until upper arms reach parallel to the floor',
      'Lean forward slightly to shift emphasis toward the chest',
      'Keep elbows pointing backward — not flared outward',
    ],
    donts: [
      'Rush the descent or use body swing for momentum',
      'Let shoulders shrug up toward your ears during the set',
      'Descend so deep the shoulder rotates painfully at the bottom',
      'Use excessive forward lean when your goal is tricep focus',
    ],
    commonMistakes: [
      {
        mistake: 'Shoulders rising toward the ears throughout the rep',
        correction: 'Actively depress and retract the scapulae before descending and maintain that position through every rep',
      },
      {
        mistake: 'Excessive forward lean when targeting triceps',
        correction: 'Stay upright to bias the triceps — save the forward lean specifically for chest-focused dip sessions',
      },
      {
        mistake: 'Partial range of motion to use more weight',
        correction: 'Descend until upper arms reach parallel; cutting reps short sacrifices both chest and tricep stimulus',
      },
    ],
    progressionTips: [
      'Begin with band-assisted dips and gradually use thinner bands as strength builds',
      'Progression: band-assisted → bodyweight × 10 reps → add 2.5 kg on a belt',
      'Ring dips add significant instability — use them when bodyweight dips feel easy',
      'Combine with close-grip bench press for a powerful tricep-focused training session',
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
    dos: [
      'Start from a full dead hang with arms completely extended',
      'Initiate by depressing shoulder blades before bending the arms',
      'Pull until your chin clearly clears the bar — chest to bar is ideal',
      'Control the descent over 2–3 seconds for full eccentric benefit',
    ],
    donts: [
      'Kip or swing unless specifically training kipping for sport',
      'Let the shoulders shrug up at the top of the rep',
      'Use half-reps that avoid the full hang at the bottom',
      'Use a thumbless grip that reduces back engagement',
    ],
    commonMistakes: [
      {
        mistake: 'Not reaching a full dead hang at the bottom',
        correction: 'Arms must fully extend at the bottom of every rep — cutting short hides weakness and limits the range of motion that builds pulling strength',
      },
      {
        mistake: 'Initiating with the biceps instead of the back',
        correction: 'Begin each rep by pulling shoulder blades down and together before bending the elbows — this engages the lats first',
      },
      {
        mistake: 'Chin not clearing the bar',
        correction: 'A rep counts only when the chin clears the bar; if you cannot complete it, use an assisted variation until strength builds',
      },
    ],
    progressionTips: [
      'Progression ladder: band-assisted → negatives-only → full pull-ups → weighted',
      'Grease the groove: perform submaximal sets (40–60% of max) multiple times per day to rapidly build volume',
      'Once you can do 10+ bodyweight pull-ups, add 2.5 kg and work back up to 8–10 reps',
      'Include chin-ups and neutral-grip variations to develop the lats from multiple angles',
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
    dos: [
      'Keep your back flat at roughly 45° to the floor throughout',
      'Row the bar to your lower chest or upper abdomen',
      'Drive elbows back — think of your hands as hooks, not pullers',
      'Pause at the top and squeeze shoulder blades together for one second',
    ],
    donts: [
      'Round your lower back under load — reduce weight before form breaks',
      'Use excessive body swing and momentum to move the bar',
      'Row to the neck or collarbone — this shifts load to rear delts, not the back',
      'Let the bar drift away from your body during the pull',
    ],
    commonMistakes: [
      {
        mistake: 'Rounding the lower back under load',
        correction: 'Hinge at the hip with a neutral spine; reduce the weight before your back rounds — no amount of extra load justifies lumbar flexion',
      },
      {
        mistake: 'Using body momentum to swing the bar',
        correction: 'The torso should remain stationary — if it moves, the weight is too heavy; reduce load and focus on strict back muscle activation',
      },
      {
        mistake: 'Pulling with the hands instead of the elbows',
        correction: 'Think of your hands as hooks and focus entirely on driving your elbows backward to engage the rhomboids and lats',
      },
    ],
    progressionTips: [
      'Add weight incrementally and prioritize the pause-squeeze at the top over heavier loads',
      'Alternate between overhand grip (upper back emphasis) and underhand grip (lower lat and bicep emphasis)',
      'Superset with face pulls to balance anterior and posterior shoulder development every session',
      'When lower back fatigue limits sessions, substitute with dumbbell rows to remove spinal loading',
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
    dos: [
      'Lean back slightly with chest proud before each pull',
      'Lead with your elbows — imagine them pointing toward the floor',
      'Pull the bar to your upper chest, not behind the neck',
      'Control the return over 2 seconds — resist the weight on the way up',
    ],
    donts: [
      'Pull the bar behind your neck — this puts dangerous stress on the cervical spine',
      'Use excessive backward lean or body swing to move the weight',
      'Let elbows flare too far wide beyond the hands',
      'Shorten the range of motion to use a heavier weight',
    ],
    commonMistakes: [
      {
        mistake: 'Pulling the bar behind the neck',
        correction: 'Always pull to the upper chest — behind-neck pulldowns compress the cervical spine and offer zero advantage over front pulldowns',
      },
      {
        mistake: 'Biceps fatiguing before the back',
        correction: 'Use a false grip (thumbs same side as fingers) and focus on the "elbows to pockets" cue to remove bicep dominance from the pull',
      },
      {
        mistake: 'No control on the upward return',
        correction: 'Resist the weight on the way up — the eccentric phase stretches the lats under load and is where significant growth stimulus occurs',
      },
    ],
    progressionTips: [
      'Increase weight in small steps (2.5–5 kg) to maintain full range of motion throughout',
      'When you can complete 12+ reps, begin transitioning to assisted or full pull-ups with the same pattern',
      'Add a 2-second pause with elbows fully drawn down to maximise the lat contraction at the bottom',
      'Include single-arm pulldowns to correct any dominant-side compensation between left and right',
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
    dos: [
      'Set the cable at upper-chest or face height with a rope attachment',
      'Keep elbows above your wrists and hands throughout the pull',
      'Pull to forehead level and rotate thumbs to point behind you at the top',
      'Use a light weight with high reps — this is shoulder health work',
    ],
    donts: [
      'Pull with elbows below wrist level — this turns it into a row, not a face pull',
      'Use weight so heavy it pulls your torso forward during the pull',
      'Rush through the external rotation at the peak of each rep',
      'Skip this exercise because it feels easy — that ease is the point',
    ],
    commonMistakes: [
      {
        mistake: 'Low elbow path that turns it into a row',
        correction: 'Keep elbows high and wide — the rope should be pulled toward your forehead, not your chest, with elbows well above the wrists',
      },
      {
        mistake: 'Skipping the external rotation at peak contraction',
        correction: 'At the end of each pull, rotate your wrists so thumbs point straight back — this is what trains the rotator cuff and rear delts',
      },
      {
        mistake: 'Loading too heavy and sacrificing form',
        correction: 'This exercise is about shoulder health — 15–25 reps with light weight does more good than 5 heavy reps with poor external rotation',
      },
    ],
    progressionTips: [
      'Target 3 × 20+ reps before adding any load — prioritize quality of movement over weight',
      'Face pulls can be performed daily as a warm-up or cool-down — the load is light enough for very high frequency',
      'Pair with band pull-aparts for a complete shoulder-health superset that takes under five minutes',
      'Gradually increase resistance as the external rotation feels automatic and effortless',
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
    dos: [
      'Set the bar on your upper traps or rear delts and find your natural foot stance',
      'Keep chest up and brace core hard before and during every descent',
      'Drive knees out over toes throughout the descent and ascent',
      'Break parallel to fully activate glutes and hamstrings',
    ],
    donts: [
      'Let knees cave inward (valgus collapse) at any point in the rep',
      'Allow heels to rise off the floor — address ankle mobility first',
      'Use excessive forward lean that resembles a good morning',
      'Relax at the bottom — stay braced through the entire rep',
    ],
    commonMistakes: [
      {
        mistake: 'Knee valgus (knees caving inward) under load',
        correction: 'Actively push knees out over the little toe throughout; reduce weight and drill the pattern until it becomes automatic',
      },
      {
        mistake: 'Butt wink (lumbar flexion at the bottom)',
        correction: 'Work on hip and ankle mobility; only squat to the depth where your spine stays neutral — go deeper gradually as mobility improves',
      },
      {
        mistake: 'Excessive forward torso lean',
        correction: 'Strengthen the upper back; use the cue "chest up — show your logo to the wall" to maintain a more upright position throughout',
      },
    ],
    progressionTips: [
      'Linear progression: add 2.5 kg every session until stalls appear consistently',
      'Add box squats to train depth consistency and improve posterior chain activation',
      'When stuck: deload 10–15%, rebuild with perfect form, then add volume before intensity',
      'Include goblet squats as a warm-up drill — they reinforce upright torso mechanics before loading the bar',
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
    dos: [
      'Push hips backward to initiate the hinge — not knees down',
      'Keep the bar in contact with your legs the entire way down',
      'Lower until you feel a deep hamstring stretch with a flat back',
      'Drive hips forward and squeeze glutes forcefully at lockout',
    ],
    donts: [
      'Round the lower back at the bottom of the movement',
      'Squat the weight down rather than hinging at the hips',
      'Let the bar drift forward and away from your legs',
      'Skip the hip extension at the top — the glute squeeze is critical',
    ],
    commonMistakes: [
      {
        mistake: 'Squatting the movement instead of hinging',
        correction: 'Push your hips backward to initiate — knees should only soften slightly; keep shins close to vertical throughout the descent',
      },
      {
        mistake: 'Lower back rounding at the bottom',
        correction: 'Stop the descent when you feel the spine starting to flex; keep chest proud and work on hamstring flexibility over time',
      },
      {
        mistake: 'Short range of motion to manage heavier weight',
        correction: 'Use elevated RDLs (standing on a platform) to safely increase the stretch, or reduce load to allow full range with a flat back',
      },
    ],
    progressionTips: [
      'Add 5 kg per week until you plateau, then switch to 2.5 kg increments',
      'Use the single-leg RDL as an accessory to expose and correct side-to-side strength imbalances',
      'Pair with lying leg curls in a superset to train hamstrings at both hip and knee flexion for complete development',
      'Slow eccentrics (3–4 s on the way down) increase time under tension without needing to add load',
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
    dos: [
      'Step far enough forward so the front shin stays vertical',
      'Lower the back knee toward the floor in a controlled descent',
      'Keep your torso upright — do not lean forward',
      'Maintain core engagement to support balance through each step',
    ],
    donts: [
      'Step too short, causing the front knee to travel well past the toes',
      'Let the back knee crash to the ground',
      'Rush through each rep — control both the descent and the drive up',
      'Lock out the knee at the top between steps',
    ],
    commonMistakes: [
      {
        mistake: 'Front knee caving inward on the step',
        correction: 'Drive the front knee out over the little toe — this is a stability issue; reduce weight if it persists',
      },
      {
        mistake: 'Forward torso lean under load',
        correction: 'Keep the chest up and load at your sides; if you cannot stay upright with weight, reduce load and build the pattern first',
      },
      {
        mistake: 'Steps too short',
        correction: 'Take a larger step — the front shin should stay vertical when the back knee lowers; short steps create excessive forward knee travel',
      },
    ],
    progressionTips: [
      'Start with bodyweight, then progress to holding dumbbells, then to a barbell across the back',
      'Increase step distance and control before adding weight — form dictates load, not the other way around',
      'Add lateral lunges and reverse lunges for comprehensive hip stability and single-leg strength',
      'Use walking lunges as a metabolic finisher: 3 × 20 steps at the end of a leg session for extra volume',
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
    dos: [
      'Place feet shoulder-width at the middle of the platform',
      'Lower until knees reach 90° or just below for a full rep',
      'Keep lower back pressed firmly into the seat pad throughout',
      'Breathe out on the push phase, breathe in on the lowering phase',
    ],
    donts: [
      'Allow your lower back to peel off the seat pad at the bottom',
      'Lock your knees out at the top of each press',
      'Place feet too low on the platform — this greatly increases knee shear force',
      'Use partial range of motion just to move heavier weight',
    ],
    commonMistakes: [
      {
        mistake: 'Lower back peeling off the seat pad at the bottom',
        correction: 'Reduce weight and only lower as far as you can while keeping your back flat; pelvic tilt at the bottom is a significant injury risk',
      },
      {
        mistake: 'Locking knees out at the top',
        correction: 'Stop just short of full extension to keep tension on the quads and protect the knee joint from hyperextension stress',
      },
      {
        mistake: 'Feet placed too low on the platform',
        correction: 'Keep feet at mid to upper platform height — very low placement creates excessive shear force at the knee joint',
      },
    ],
    progressionTips: [
      'Increase load every 1–2 sessions — the leg press typically supports heavier loads than most other leg exercises',
      'Vary foot position: high and wide for glutes, mid shoulder-width for balance, narrow for inner quad emphasis',
      'Include the single-leg leg press to reveal bilateral imbalances hidden in two-legged pressing',
      'Do not neglect free squats and lunges — the leg press lacks the core and stabiliser demand of compound movements',
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
