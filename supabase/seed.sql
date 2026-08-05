-- Exercise seed data — 60 core exercises with muscles, equipment, and YouTube IDs
-- Run after migrations: psql ... -f supabase/seed.sql

-- Helper: insert exercise and return id
DO $$
DECLARE
  -- Barbell exercises
  e_bench_press UUID;
  e_incline_bench UUID;
  e_decline_bench UUID;
  e_squat UUID;
  e_deadlift UUID;
  e_rdl UUID;
  e_ohp UUID;
  e_barbell_row UUID;
  e_barbell_curl UUID;
  e_close_grip_bench UUID;
  -- Dumbbell exercises
  e_db_bench UUID;
  e_db_incline UUID;
  e_db_fly UUID;
  e_db_shoulder_press UUID;
  e_db_lateral_raise UUID;
  e_db_front_raise UUID;
  e_db_rear_delt_fly UUID;
  e_db_row UUID;
  e_db_curl UUID;
  e_hammer_curl UUID;
  e_db_tricep_ext UUID;
  e_db_goblet_squat UUID;
  e_db_lunge UUID;
  e_db_rdl UUID;
  e_db_calf_raise UUID;
  -- Cable exercises
  e_cable_fly UUID;
  e_cable_row UUID;
  e_cable_pulldown UUID;
  e_cable_lateral_raise UUID;
  e_cable_curl UUID;
  e_cable_tricep_pushdown UUID;
  e_cable_face_pull UUID;
  e_cable_woodchop UUID;
  -- Machine exercises
  e_leg_press UUID;
  e_leg_extension UUID;
  e_leg_curl UUID;
  e_chest_press_machine UUID;
  e_pec_deck UUID;
  e_seated_row_machine UUID;
  e_shoulder_press_machine UUID;
  e_preacher_curl UUID;
  -- Bodyweight exercises
  e_pullup UUID;
  e_chinup UUID;
  e_pushup UUID;
  e_dip UUID;
  e_plank UUID;
  e_crunch UUID;
  e_leg_raise UUID;
  e_russian_twist UUID;
  e_mountain_climber UUID;
  e_burpee UUID;
  e_pike_pushup UUID;
  e_diamond_pushup UUID;
  -- Compound / misc
  e_hip_thrust UUID;
  e_good_morning UUID;
  e_face_pull UUID;
  e_shrug UUID;
  e_wrist_curl UUID;
  e_reverse_curl UUID;
  e_seated_calf_raise UUID;
  e_standing_calf_raise UUID;
BEGIN

-- === BARBELL ===

INSERT INTO exercises (name, description) VALUES ('Barbell Bench Press', 'Compound chest press with a barbell on a flat bench.') RETURNING id INTO e_bench_press;
INSERT INTO exercise_muscles VALUES (e_bench_press, 'chest', true), (e_bench_press, 'triceps', false), (e_bench_press, 'shoulders', false);
INSERT INTO exercise_equipment VALUES (e_bench_press, 'barbell');
INSERT INTO exercise_videos (exercise_id, youtube_id, title, is_primary) VALUES (e_bench_press, 'SCVCLChPQEs', 'Bench Press — Alan Thrall', true);

INSERT INTO exercises (name, description) VALUES ('Incline Barbell Bench Press', 'Barbell press on a 30-45° incline targeting upper chest.') RETURNING id INTO e_incline_bench;
INSERT INTO exercise_muscles VALUES (e_incline_bench, 'chest', true), (e_incline_bench, 'triceps', false), (e_incline_bench, 'shoulders', false);
INSERT INTO exercise_equipment VALUES (e_incline_bench, 'barbell');

INSERT INTO exercises (name, description) VALUES ('Decline Barbell Bench Press', 'Barbell press on a decline targeting lower chest.') RETURNING id INTO e_decline_bench;
INSERT INTO exercise_muscles VALUES (e_decline_bench, 'chest', true), (e_decline_bench, 'triceps', false);
INSERT INTO exercise_equipment VALUES (e_decline_bench, 'barbell');

INSERT INTO exercises (name, description) VALUES ('Barbell Back Squat', 'King of lower body exercises. Bar on upper back, squat to depth.') RETURNING id INTO e_squat;
INSERT INTO exercise_muscles VALUES (e_squat, 'quads', true), (e_squat, 'glutes', true), (e_squat, 'hamstrings', false), (e_squat, 'core', false);
INSERT INTO exercise_equipment VALUES (e_squat, 'barbell');
INSERT INTO exercise_videos (exercise_id, youtube_id, title, is_primary) VALUES (e_squat, 'bEv6CCg2BC8', 'Squat — Alan Thrall', true);

INSERT INTO exercises (name, description) VALUES ('Conventional Deadlift', 'Hip-hinge pull from the floor with a barbell.') RETURNING id INTO e_deadlift;
INSERT INTO exercise_muscles VALUES (e_deadlift, 'back', true), (e_deadlift, 'hamstrings', true), (e_deadlift, 'glutes', true), (e_deadlift, 'core', false), (e_deadlift, 'forearms', false);
INSERT INTO exercise_equipment VALUES (e_deadlift, 'barbell');
INSERT INTO exercise_videos (exercise_id, youtube_id, title, is_primary) VALUES (e_deadlift, 'op9kVnSso6Q', 'Deadlift — Alan Thrall', true);

INSERT INTO exercises (name, description) VALUES ('Romanian Deadlift', 'Hip-hinge deadlift keeping legs nearly straight; great hamstring stretch.') RETURNING id INTO e_rdl;
INSERT INTO exercise_muscles VALUES (e_rdl, 'hamstrings', true), (e_rdl, 'glutes', true), (e_rdl, 'back', false);
INSERT INTO exercise_equipment VALUES (e_rdl, 'barbell');

INSERT INTO exercises (name, description) VALUES ('Overhead Press', 'Standing barbell press from shoulders to lockout overhead.') RETURNING id INTO e_ohp;
INSERT INTO exercise_muscles VALUES (e_ohp, 'shoulders', true), (e_ohp, 'triceps', false), (e_ohp, 'core', false);
INSERT INTO exercise_equipment VALUES (e_ohp, 'barbell');
INSERT INTO exercise_videos (exercise_id, youtube_id, title, is_primary) VALUES (e_ohp, 'F3QY5vMz_6I', 'OHP — Alan Thrall', true);

INSERT INTO exercises (name, description) VALUES ('Barbell Bent-Over Row', 'Pronated grip row with barbell; heavy compound back builder.') RETURNING id INTO e_barbell_row;
INSERT INTO exercise_muscles VALUES (e_barbell_row, 'back', true), (e_barbell_row, 'biceps', false), (e_barbell_row, 'shoulders', false);
INSERT INTO exercise_equipment VALUES (e_barbell_row, 'barbell');

INSERT INTO exercises (name, description) VALUES ('Barbell Curl', 'Standing curl with a straight or EZ barbell.') RETURNING id INTO e_barbell_curl;
INSERT INTO exercise_muscles VALUES (e_barbell_curl, 'biceps', true), (e_barbell_curl, 'forearms', false);
INSERT INTO exercise_equipment VALUES (e_barbell_curl, 'barbell');

INSERT INTO exercises (name, description) VALUES ('Close-Grip Bench Press', 'Narrow grip bench press for tricep emphasis.') RETURNING id INTO e_close_grip_bench;
INSERT INTO exercise_muscles VALUES (e_close_grip_bench, 'triceps', true), (e_close_grip_bench, 'chest', false);
INSERT INTO exercise_equipment VALUES (e_close_grip_bench, 'barbell');

-- === DUMBBELL ===

INSERT INTO exercises (name, description) VALUES ('Dumbbell Bench Press', 'Flat bench press with dumbbells for greater range of motion.') RETURNING id INTO e_db_bench;
INSERT INTO exercise_muscles VALUES (e_db_bench, 'chest', true), (e_db_bench, 'triceps', false), (e_db_bench, 'shoulders', false);
INSERT INTO exercise_equipment VALUES (e_db_bench, 'dumbbell');

INSERT INTO exercises (name, description) VALUES ('Incline Dumbbell Press', 'Dumbbell press on a 30-45° incline.') RETURNING id INTO e_db_incline;
INSERT INTO exercise_muscles VALUES (e_db_incline, 'chest', true), (e_db_incline, 'triceps', false), (e_db_incline, 'shoulders', false);
INSERT INTO exercise_equipment VALUES (e_db_incline, 'dumbbell');

INSERT INTO exercises (name, description) VALUES ('Dumbbell Fly', 'Flat bench chest fly with dumbbells.') RETURNING id INTO e_db_fly;
INSERT INTO exercise_muscles VALUES (e_db_fly, 'chest', true);
INSERT INTO exercise_equipment VALUES (e_db_fly, 'dumbbell');

INSERT INTO exercises (name, description) VALUES ('Dumbbell Shoulder Press', 'Seated or standing overhead press with dumbbells.') RETURNING id INTO e_db_shoulder_press;
INSERT INTO exercise_muscles VALUES (e_db_shoulder_press, 'shoulders', true), (e_db_shoulder_press, 'triceps', false);
INSERT INTO exercise_equipment VALUES (e_db_shoulder_press, 'dumbbell');

INSERT INTO exercises (name, description) VALUES ('Dumbbell Lateral Raise', 'Side raises to isolate lateral deltoid.') RETURNING id INTO e_db_lateral_raise;
INSERT INTO exercise_muscles VALUES (e_db_lateral_raise, 'shoulders', true);
INSERT INTO exercise_equipment VALUES (e_db_lateral_raise, 'dumbbell');

INSERT INTO exercises (name, description) VALUES ('Dumbbell Front Raise', 'Front raise to target anterior deltoid.') RETURNING id INTO e_db_front_raise;
INSERT INTO exercise_muscles VALUES (e_db_front_raise, 'shoulders', true);
INSERT INTO exercise_equipment VALUES (e_db_front_raise, 'dumbbell');

INSERT INTO exercises (name, description) VALUES ('Dumbbell Rear Delt Fly', 'Bent-over or prone fly to target rear deltoid.') RETURNING id INTO e_db_rear_delt_fly;
INSERT INTO exercise_muscles VALUES (e_db_rear_delt_fly, 'shoulders', true), (e_db_rear_delt_fly, 'back', false);
INSERT INTO exercise_equipment VALUES (e_db_rear_delt_fly, 'dumbbell');

INSERT INTO exercises (name, description) VALUES ('Dumbbell Row', 'Single-arm row with dumbbell; unilateral back builder.') RETURNING id INTO e_db_row;
INSERT INTO exercise_muscles VALUES (e_db_row, 'back', true), (e_db_row, 'biceps', false);
INSERT INTO exercise_equipment VALUES (e_db_row, 'dumbbell');

INSERT INTO exercises (name, description) VALUES ('Dumbbell Curl', 'Alternating or simultaneous bicep curl with dumbbells.') RETURNING id INTO e_db_curl;
INSERT INTO exercise_muscles VALUES (e_db_curl, 'biceps', true), (e_db_curl, 'forearms', false);
INSERT INTO exercise_equipment VALUES (e_db_curl, 'dumbbell');

INSERT INTO exercises (name, description) VALUES ('Hammer Curl', 'Neutral-grip curl; works brachialis and brachioradialis.') RETURNING id INTO e_hammer_curl;
INSERT INTO exercise_muscles VALUES (e_hammer_curl, 'biceps', true), (e_hammer_curl, 'forearms', true);
INSERT INTO exercise_equipment VALUES (e_hammer_curl, 'dumbbell');

INSERT INTO exercises (name, description) VALUES ('Dumbbell Tricep Extension', 'Overhead tricep extension with one or two dumbbells.') RETURNING id INTO e_db_tricep_ext;
INSERT INTO exercise_muscles VALUES (e_db_tricep_ext, 'triceps', true);
INSERT INTO exercise_equipment VALUES (e_db_tricep_ext, 'dumbbell');

INSERT INTO exercises (name, description) VALUES ('Goblet Squat', 'Front-loaded squat holding a dumbbell; great for form practice.') RETURNING id INTO e_db_goblet_squat;
INSERT INTO exercise_muscles VALUES (e_db_goblet_squat, 'quads', true), (e_db_goblet_squat, 'glutes', false), (e_db_goblet_squat, 'core', false);
INSERT INTO exercise_equipment VALUES (e_db_goblet_squat, 'dumbbell');

INSERT INTO exercises (name, description) VALUES ('Dumbbell Lunge', 'Walking or stationary lunge with dumbbells.') RETURNING id INTO e_db_lunge;
INSERT INTO exercise_muscles VALUES (e_db_lunge, 'quads', true), (e_db_lunge, 'glutes', true), (e_db_lunge, 'hamstrings', false);
INSERT INTO exercise_equipment VALUES (e_db_lunge, 'dumbbell');

INSERT INTO exercises (name, description) VALUES ('Dumbbell Romanian Deadlift', 'Single-leg or bilateral RDL with dumbbells.') RETURNING id INTO e_db_rdl;
INSERT INTO exercise_muscles VALUES (e_db_rdl, 'hamstrings', true), (e_db_rdl, 'glutes', true);
INSERT INTO exercise_equipment VALUES (e_db_rdl, 'dumbbell');

INSERT INTO exercises (name, description) VALUES ('Dumbbell Calf Raise', 'Standing calf raise holding dumbbells.') RETURNING id INTO e_db_calf_raise;
INSERT INTO exercise_muscles VALUES (e_db_calf_raise, 'calves', true);
INSERT INTO exercise_equipment VALUES (e_db_calf_raise, 'dumbbell');

-- === CABLE ===

INSERT INTO exercises (name, description) VALUES ('Cable Fly', 'Cable crossover or single-cable fly for chest isolation.') RETURNING id INTO e_cable_fly;
INSERT INTO exercise_muscles VALUES (e_cable_fly, 'chest', true);
INSERT INTO exercise_equipment VALUES (e_cable_fly, 'cable');

INSERT INTO exercises (name, description) VALUES ('Cable Seated Row', 'Seated cable row with V-bar or wide bar; back thickness.') RETURNING id INTO e_cable_row;
INSERT INTO exercise_muscles VALUES (e_cable_row, 'back', true), (e_cable_row, 'biceps', false);
INSERT INTO exercise_equipment VALUES (e_cable_row, 'cable');

INSERT INTO exercises (name, description) VALUES ('Lat Pulldown', 'Wide or narrow grip pulldown to target lat width.') RETURNING id INTO e_cable_pulldown;
INSERT INTO exercise_muscles VALUES (e_cable_pulldown, 'back', true), (e_cable_pulldown, 'biceps', false);
INSERT INTO exercise_equipment VALUES (e_cable_pulldown, 'cable');

INSERT INTO exercises (name, description) VALUES ('Cable Lateral Raise', 'Single-arm lateral raise on cable for constant tension.') RETURNING id INTO e_cable_lateral_raise;
INSERT INTO exercise_muscles VALUES (e_cable_lateral_raise, 'shoulders', true);
INSERT INTO exercise_equipment VALUES (e_cable_lateral_raise, 'cable');

INSERT INTO exercises (name, description) VALUES ('Cable Curl', 'Standing or preacher cable curl for bicep peak.') RETURNING id INTO e_cable_curl;
INSERT INTO exercise_muscles VALUES (e_cable_curl, 'biceps', true);
INSERT INTO exercise_equipment VALUES (e_cable_curl, 'cable');

INSERT INTO exercises (name, description) VALUES ('Cable Tricep Pushdown', 'Pushdown with rope or bar to isolate triceps.') RETURNING id INTO e_cable_tricep_pushdown;
INSERT INTO exercise_muscles VALUES (e_cable_tricep_pushdown, 'triceps', true);
INSERT INTO exercise_equipment VALUES (e_cable_tricep_pushdown, 'cable');

INSERT INTO exercises (name, description) VALUES ('Face Pull', 'Cable pull to face targeting rear delts and rotator cuff.') RETURNING id INTO e_cable_face_pull;
INSERT INTO exercise_muscles VALUES (e_cable_face_pull, 'shoulders', true), (e_cable_face_pull, 'back', false);
INSERT INTO exercise_equipment VALUES (e_cable_face_pull, 'cable');

INSERT INTO exercises (name, description) VALUES ('Cable Woodchop', 'Rotational core exercise on cable machine.') RETURNING id INTO e_cable_woodchop;
INSERT INTO exercise_muscles VALUES (e_cable_woodchop, 'core', true);
INSERT INTO exercise_equipment VALUES (e_cable_woodchop, 'cable');

-- === MACHINE ===

INSERT INTO exercises (name, description) VALUES ('Leg Press', 'Machine leg press; great for quad volume with less spinal load.') RETURNING id INTO e_leg_press;
INSERT INTO exercise_muscles VALUES (e_leg_press, 'quads', true), (e_leg_press, 'glutes', false), (e_leg_press, 'hamstrings', false);
INSERT INTO exercise_equipment VALUES (e_leg_press, 'machine');

INSERT INTO exercises (name, description) VALUES ('Leg Extension', 'Isolated quad exercise on the extension machine.') RETURNING id INTO e_leg_extension;
INSERT INTO exercise_muscles VALUES (e_leg_extension, 'quads', true);
INSERT INTO exercise_equipment VALUES (e_leg_extension, 'machine');

INSERT INTO exercises (name, description) VALUES ('Leg Curl', 'Lying or seated hamstring curl machine.') RETURNING id INTO e_leg_curl;
INSERT INTO exercise_muscles VALUES (e_leg_curl, 'hamstrings', true);
INSERT INTO exercise_equipment VALUES (e_leg_curl, 'machine');

INSERT INTO exercises (name, description) VALUES ('Chest Press Machine', 'Machine version of the bench press; safer for solo training.') RETURNING id INTO e_chest_press_machine;
INSERT INTO exercise_muscles VALUES (e_chest_press_machine, 'chest', true), (e_chest_press_machine, 'triceps', false);
INSERT INTO exercise_equipment VALUES (e_chest_press_machine, 'machine');

INSERT INTO exercises (name, description) VALUES ('Pec Deck', 'Machine fly for chest isolation; maintains constant tension.') RETURNING id INTO e_pec_deck;
INSERT INTO exercise_muscles VALUES (e_pec_deck, 'chest', true);
INSERT INTO exercise_equipment VALUES (e_pec_deck, 'machine');

INSERT INTO exercises (name, description) VALUES ('Seated Cable Row Machine', 'Machine row targeting mid-back.') RETURNING id INTO e_seated_row_machine;
INSERT INTO exercise_muscles VALUES (e_seated_row_machine, 'back', true), (e_seated_row_machine, 'biceps', false);
INSERT INTO exercise_equipment VALUES (e_seated_row_machine, 'machine');

INSERT INTO exercises (name, description) VALUES ('Shoulder Press Machine', 'Machine OHP; stabilizer-free shoulder press.') RETURNING id INTO e_shoulder_press_machine;
INSERT INTO exercise_muscles VALUES (e_shoulder_press_machine, 'shoulders', true), (e_shoulder_press_machine, 'triceps', false);
INSERT INTO exercise_equipment VALUES (e_shoulder_press_machine, 'machine');

INSERT INTO exercises (name, description) VALUES ('Preacher Curl Machine', 'Machine or EZ-bar preacher curl for bicep peak.') RETURNING id INTO e_preacher_curl;
INSERT INTO exercise_muscles VALUES (e_preacher_curl, 'biceps', true);
INSERT INTO exercise_equipment VALUES (e_preacher_curl, 'machine');

-- === BODYWEIGHT ===

INSERT INTO exercises (name, description) VALUES ('Pull-Up', 'Pronated-grip pull-up; compound back and bicep builder.') RETURNING id INTO e_pullup;
INSERT INTO exercise_muscles VALUES (e_pullup, 'back', true), (e_pullup, 'biceps', false);
INSERT INTO exercise_equipment VALUES (e_pullup, 'bodyweight');

INSERT INTO exercises (name, description) VALUES ('Chin-Up', 'Supinated-grip pull-up; more bicep involvement than pull-up.') RETURNING id INTO e_chinup;
INSERT INTO exercise_muscles VALUES (e_chinup, 'back', true), (e_chinup, 'biceps', true);
INSERT INTO exercise_equipment VALUES (e_chinup, 'bodyweight');

INSERT INTO exercises (name, description) VALUES ('Push-Up', 'Classic bodyweight chest and tricep exercise.') RETURNING id INTO e_pushup;
INSERT INTO exercise_muscles VALUES (e_pushup, 'chest', true), (e_pushup, 'triceps', false), (e_pushup, 'shoulders', false);
INSERT INTO exercise_equipment VALUES (e_pushup, 'bodyweight');

INSERT INTO exercises (name, description) VALUES ('Dip', 'Parallel bar dip for chest and triceps.') RETURNING id INTO e_dip;
INSERT INTO exercise_muscles VALUES (e_dip, 'triceps', true), (e_dip, 'chest', true), (e_dip, 'shoulders', false);
INSERT INTO exercise_equipment VALUES (e_dip, 'bodyweight');

INSERT INTO exercises (name, description) VALUES ('Plank', 'Static core stability hold in push-up position.') RETURNING id INTO e_plank;
INSERT INTO exercise_muscles VALUES (e_plank, 'core', true);
INSERT INTO exercise_equipment VALUES (e_plank, 'bodyweight');

INSERT INTO exercises (name, description) VALUES ('Crunch', 'Flexion-based abdominal exercise.') RETURNING id INTO e_crunch;
INSERT INTO exercise_muscles VALUES (e_crunch, 'core', true);
INSERT INTO exercise_equipment VALUES (e_crunch, 'bodyweight');

INSERT INTO exercises (name, description) VALUES ('Hanging Leg Raise', 'Hanging from a bar, raise legs to target lower abs.') RETURNING id INTO e_leg_raise;
INSERT INTO exercise_muscles VALUES (e_leg_raise, 'core', true);
INSERT INTO exercise_equipment VALUES (e_leg_raise, 'bodyweight');

INSERT INTO exercises (name, description) VALUES ('Russian Twist', 'Rotational core exercise for obliques.') RETURNING id INTO e_russian_twist;
INSERT INTO exercise_muscles VALUES (e_russian_twist, 'core', true);
INSERT INTO exercise_equipment VALUES (e_russian_twist, 'bodyweight');

INSERT INTO exercises (name, description) VALUES ('Mountain Climber', 'Dynamic plank variation targeting core and cardio.') RETURNING id INTO e_mountain_climber;
INSERT INTO exercise_muscles VALUES (e_mountain_climber, 'core', true), (e_mountain_climber, 'full_body', false);
INSERT INTO exercise_equipment VALUES (e_mountain_climber, 'bodyweight');

INSERT INTO exercises (name, description) VALUES ('Burpee', 'Full-body conditioning exercise: squat, push-up, jump.') RETURNING id INTO e_burpee;
INSERT INTO exercise_muscles VALUES (e_burpee, 'full_body', true);
INSERT INTO exercise_equipment VALUES (e_burpee, 'bodyweight');

INSERT INTO exercises (name, description) VALUES ('Pike Push-Up', 'Shoulder-focused push-up with hips raised.') RETURNING id INTO e_pike_pushup;
INSERT INTO exercise_muscles VALUES (e_pike_pushup, 'shoulders', true), (e_pike_pushup, 'triceps', false);
INSERT INTO exercise_equipment VALUES (e_pike_pushup, 'bodyweight');

INSERT INTO exercises (name, description) VALUES ('Diamond Push-Up', 'Narrow push-up with diamond hand placement for triceps.') RETURNING id INTO e_diamond_pushup;
INSERT INTO exercise_muscles VALUES (e_diamond_pushup, 'triceps', true), (e_diamond_pushup, 'chest', false);
INSERT INTO exercise_equipment VALUES (e_diamond_pushup, 'bodyweight');

-- === MISC COMPOUND ===

INSERT INTO exercises (name, description) VALUES ('Hip Thrust', 'Barbell or bodyweight glute bridge/hip thrust.') RETURNING id INTO e_hip_thrust;
INSERT INTO exercise_muscles VALUES (e_hip_thrust, 'glutes', true), (e_hip_thrust, 'hamstrings', false);
INSERT INTO exercise_equipment VALUES (e_hip_thrust, 'barbell');

INSERT INTO exercises (name, description) VALUES ('Good Morning', 'Barbell on back, hip hinge to target posterior chain.') RETURNING id INTO e_good_morning;
INSERT INTO exercise_muscles VALUES (e_good_morning, 'hamstrings', true), (e_good_morning, 'back', false), (e_good_morning, 'glutes', false);
INSERT INTO exercise_equipment VALUES (e_good_morning, 'barbell');

INSERT INTO exercises (name, description) VALUES ('Barbell Shrug', 'Barbell trap exercise for upper back thickness.') RETURNING id INTO e_shrug;
INSERT INTO exercise_muscles VALUES (e_shrug, 'back', true), (e_shrug, 'forearms', false);
INSERT INTO exercise_equipment VALUES (e_shrug, 'barbell');

INSERT INTO exercises (name, description) VALUES ('Wrist Curl', 'Forearm flexor isolation with barbell or dumbbell.') RETURNING id INTO e_wrist_curl;
INSERT INTO exercise_muscles VALUES (e_wrist_curl, 'forearms', true);
INSERT INTO exercise_equipment VALUES (e_wrist_curl, 'barbell');

INSERT INTO exercises (name, description) VALUES ('Reverse Curl', 'Pronated grip curl; targets brachioradialis and forearm extensors.') RETURNING id INTO e_reverse_curl;
INSERT INTO exercise_muscles VALUES (e_reverse_curl, 'forearms', true), (e_reverse_curl, 'biceps', false);
INSERT INTO exercise_equipment VALUES (e_reverse_curl, 'barbell');

INSERT INTO exercises (name, description) VALUES ('Seated Calf Raise', 'Machine or plate-loaded calf raise while seated; targets soleus.') RETURNING id INTO e_seated_calf_raise;
INSERT INTO exercise_muscles VALUES (e_seated_calf_raise, 'calves', true);
INSERT INTO exercise_equipment VALUES (e_seated_calf_raise, 'machine');

INSERT INTO exercises (name, description) VALUES ('Standing Calf Raise', 'Machine or step calf raise while standing; targets gastrocnemius.') RETURNING id INTO e_standing_calf_raise;
INSERT INTO exercise_muscles VALUES (e_standing_calf_raise, 'calves', true);
INSERT INTO exercise_equipment VALUES (e_standing_calf_raise, 'machine');

-- === ALTERNATIVES ===
-- Bench press alternatives
INSERT INTO exercise_alternatives VALUES (e_bench_press, e_db_bench), (e_bench_press, e_chest_press_machine), (e_bench_press, e_pushup);
INSERT INTO exercise_alternatives VALUES (e_db_bench, e_bench_press), (e_db_bench, e_chest_press_machine);
-- Squat alternatives
INSERT INTO exercise_alternatives VALUES (e_squat, e_db_goblet_squat), (e_squat, e_leg_press);
INSERT INTO exercise_alternatives VALUES (e_leg_press, e_squat), (e_leg_press, e_db_goblet_squat);
-- Pull-up alternatives
INSERT INTO exercise_alternatives VALUES (e_pullup, e_cable_pulldown), (e_pullup, e_chinup);
INSERT INTO exercise_alternatives VALUES (e_chinup, e_pullup), (e_chinup, e_cable_pulldown);
-- Row alternatives
INSERT INTO exercise_alternatives VALUES (e_barbell_row, e_db_row), (e_barbell_row, e_cable_row);
INSERT INTO exercise_alternatives VALUES (e_db_row, e_barbell_row), (e_db_row, e_cable_row);
-- OHP alternatives
INSERT INTO exercise_alternatives VALUES (e_ohp, e_db_shoulder_press), (e_ohp, e_shoulder_press_machine);
INSERT INTO exercise_alternatives VALUES (e_db_shoulder_press, e_ohp), (e_db_shoulder_press, e_shoulder_press_machine);
-- Deadlift alternatives
INSERT INTO exercise_alternatives VALUES (e_deadlift, e_rdl), (e_deadlift, e_db_rdl);
INSERT INTO exercise_alternatives VALUES (e_rdl, e_deadlift), (e_rdl, e_db_rdl);
-- Curl alternatives
INSERT INTO exercise_alternatives VALUES (e_barbell_curl, e_db_curl), (e_barbell_curl, e_cable_curl);
INSERT INTO exercise_alternatives VALUES (e_db_curl, e_barbell_curl), (e_db_curl, e_cable_curl);
-- Lateral raise alternatives
INSERT INTO exercise_alternatives VALUES (e_db_lateral_raise, e_cable_lateral_raise);
INSERT INTO exercise_alternatives VALUES (e_cable_lateral_raise, e_db_lateral_raise);

END $$;
