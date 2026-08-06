# Exerciso — Product Requirements

## Vision

A production-quality personal Gym & Fitness Assistant for daily gym use.  
The core loop is: **Plan → Workout → Log → Compare → Improve → Repeat**

---

## Users

Single user (personal). Authentication required.  
Primary device: **mobile phone, in the gym**.

---

## Main Sections

### Dashboard
- Current, starting, and goal weight
- Total weight lost / gained and weight trend
- Calories consumed vs. target
- Protein / carbs / fat breakdown
- Workout frequency, streak, duration, volume
- Personal records and strength progression
- Body measurement changes
- Goal progress
- Weekly insights (data-driven, not generic)

### Workout
- Workout plans (Push/Pull/Legs, Upper/Lower, Full Body, Custom)
- Today's workout with exercises, target sets/reps/weight
- Log actual weight and reps per set
- Complete sets, add notes, replace or skip exercises
- Finish workout → workout summary

### Progressive Overload
- Compare today vs. previous session per exercise
- Detect improvements
- Suggest next weight/reps progression
- Do NOT blindly increase weight every session

### Rest Timer
- Presets: 60 / 90 / 120 / 180 seconds
- Custom duration
- Auto-start after a set completes
- Pause and reset
- Mobile-friendly, always accessible during workout

### Exercise Library
Each exercise must include:
- Exercise name
- Embedded video (near top of detail page)
- Primary and secondary target muscles
- Equipment required
- Difficulty level
- Compound / isolation classification
- Recommended sets, reps, rest time
- Step-by-step instructions
- Proper form and breathing cues
- Common mistakes
- Safety considerations
- Alternative exercises
- Related exercises
- User's personal history and PR for that exercise

### Nutrition
- Daily calorie target and remaining
- Food entries with meal type
- Quantity, calories, protein, carbs, fat per entry
- Daily / weekly / monthly history

### Body Tracking
- Weight entries and target weight
- Measurements: chest, waist, arms, thighs, hips, custom
- Progress charts
- Optional progress photos

### History
- Workout calendar view
- Previous workout details (duration, sets, volume, PRs, notes)
- Ability to repeat a previous workout

### Analytics
- Weight progression over time
- Strength progression per exercise
- Personal records timeline
- Workout consistency and frequency
- Training volume trends
- Nutrition and macro trends
- Goal progress

### AI Coach (Future Phase)
Example queries the AI must answer using **actual stored user data**:
- "What should I train today?"
- "I only have 30 minutes — modify my workout."
- "My bench hasn't improved in 4 weeks. What should I change?"
- "Give me an alternative exercise."
- "I have 700 calories remaining. Suggest a high-protein meal."
- "Am I eating enough protein?"

The AI must reference real data, not behave as a generic chatbot.

---

## Mobile-First Requirements

The workout experience must have:
- Large touch targets
- Minimal typing (tap to increment, not keyboard entry)
- Fast set logging
- Quick weight/reps input with +/- controls
- Easily accessible rest timer
- Easy exercise replacement inline
- Minimal scrolling during active workout
- Excellent performance on a mid-range phone

---

## Tech Stack (Proposed)

- Next.js (App Router)
- React
- TypeScript
- Tailwind CSS
- Supabase / PostgreSQL
- Authentication (Supabase Auth)
- AI API (future phase)
- Vercel (deployment)

---

## Key Data Integrity Requirement

Changing a workout plan or exercise **must not corrupt historical workout records.**  
Historical sessions must reflect the state of plans and exercises at the time they were performed.

---

## Dashboard Philosophy

The dashboard is a **consumer** of data, not a producer.  
It must not be built first.

The data-generating features must be in place first:
1. Workout logging
2. Nutrition tracking
3. Weight tracking
4. Strength / PR tracking
5. Goals

Then the dashboard aggregates and surfaces insights.

The central question it must answer: **"Am I actually progressing?"**
