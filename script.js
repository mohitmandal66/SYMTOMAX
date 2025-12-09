// script.js

// --- Global Variables ---
let globalBmiRisk = 'normal'; 
let recommendedSpecialty = ''; 
let port; // Holds the reference to the serial port
let reader; // Holds the reader stream

// --- DATABASE DUMMY DATA ---
const diseasesDB = [
    // --- Original 19 Entries (kept for context) ---
    {
        name: "Heart Attack (Myocardial Infarction)",
        keywords: "chest pain, arm pain, tightness in chest, jaw pain, nausea, sudden severe chest pain, heavy chest, sweating, pressure, short breath",
        min_age: 30, max_age: 100, sex_constraint: "all",
        bmi_risk_keywords: "overweight,obese",
        doctor_type: "Cardiologist (CALL EMERGENCY SERVICES IMMEDIATELY.)",
        recommended_action: "**CALL EMERGENCY SERVICES IMMEDIATELY.** If mild, consult a Cardiologist."
    },
    {
        name: "Hypertension (High Blood Pressure)",
        keywords: "high blood pressure, headache back of head, dizziness, pounding head, blurred vision",
        min_age: 18, max_age: 100, sex_constraint: "all",
        bmi_risk_keywords: "overweight,obese",
        doctor_type: "Cardiologist or Primary Care Physician (PCP)",
        recommended_action: "Monitor blood pressure for 3 days. Consult a Cardiologist if readings are consistently high."
    },
    {
        name: "Type 2 Diabetes",
        keywords: "polydipsia, polyuria, excessive thirst, frequent urination, unexplained weight loss, fatigue, blurry vision, slow healing wounds",
        min_age: 25, max_age: 100, sex_constraint: "all",
        bmi_risk_keywords: "overweight,obese",
        doctor_type: "Endocrinologist",
        recommended_action: "Get blood sugar (HbA1c) checked. Consult an Endocrinologist for management."
    },
    {
        name: "Osteoarthritis",
        keywords: "joint pain, stiffness, knees ache, hip pain, pain improves with rest, grinding sound joints",
        min_age: 40, max_age: 100, sex_constraint: "all",
        bmi_risk_keywords: "overweight,obese",
        doctor_type: "Orthopedic Surgeon",
        recommended_action: "Manage weight and use over-the-counter pain relief (Paracetamol). Consult Orthopedic for long-term plan."
    },
    {
        name: "GERD (Gastroesophageal Reflux Disease)",
        keywords: "pyrosis, regurgitation, heartburn, throat burning, acid taste, burning chest, vomiting",
        min_age: 15, max_age: 100, sex_constraint: "all",
        bmi_risk_keywords: "overweight,obese",
        doctor_type: "Gastroenterologist",
        recommended_action: "Avoid spicy/fatty foods. Take Antacids. If persistent, consult a Gastroenterologist."
    },
    {
        name: "Gallstones (Cholelithiasis)",
        keywords: "upper right abdominal pain, fever, pain after fatty meal, jaundice, yellow skin, severe tummy pain, vomiting",
        min_age: 18, max_age: 90, sex_constraint: "female",
        bmi_risk_keywords: "overweight,obese",
        doctor_type: "General Surgeon",
        recommended_action: "Seek immediate medical consultation/ER if pain is severe, as surgery may be required."
    },
    {
        name: "PCOS (Polycystic Ovary Syndrome)",
        keywords: "irregular periods, excess body hair, acne, weight gain, difficulty getting pregnant",
        min_age: 15, max_age: 45, sex_constraint: "female",
        bmi_risk_keywords: "overweight,obese",
        doctor_type: "Gynecologist",
        recommended_action: "Consult a Gynecologist for hormonal blood tests and management plan."
    },
    {
        name: "Chronic Kidney Disease (CKD)",
        keywords: "swelling feet, ankle swelling, fatigue, nausea, blood in urine, decreased urine output",
        min_age: 30, max_age: 100, sex_constraint: "all",
        bmi_risk_keywords: "overweight,obese",
        doctor_type: "Nephrologist",
        recommended_action: "Get a kidney function test (RFT). Consult a Nephrologist urgently."
    },
    {
        name: "Meningitis (Acute Bacterial/Viral)",
        keywords: "severe headache, nuchal rigidity, stiff neck, fever, vomiting, photophobia, rash",
        min_age: 0, max_age: 100, sex_constraint: "all",
        bmi_risk_keywords: "all",
        doctor_type: "Neurosurgeon or Neurologist",
        recommended_action: "**SEEK EMERGENCY MEDICAL HELP IMMEDIATELY.** This is a medical emergency."
    },
    {
        name: "Acute Sinusitis",
        keywords: "facial pain, nasal congestion, runny nose, headache, pressure behind eyes, loss of smell",
        min_age: 5, max_age: 80, sex_constraint: "all",
         bmi_risk_keywords: "all",
        doctor_type: "ENT (Ear, Nose, Throat Specialist)",
        recommended_action: "Use steam inhalation. If symptoms persist for more than 10 days, see an ENT specialist."
    },
    {
        name: "Asthma/COPD Exacerbation",
        keywords: "wheezing, shortness of breath, tight chest, coughing, difficulty breathing, allergy, dyspnea",
        min_age: 5, max_age: 100, sex_constraint: "all",
        bmi_risk_keywords: "all",
        doctor_type: "Pulmonologist",
        recommended_action: "Use prescribed inhaler. If breathing is severely restricted, seek emergency care."
    },
    {
        name: "Eczema (Atopic Dermatitis)",
        keywords: "itchy rash, dry skin, red patches, skin inflammation, flaky skin",
        min_age: 0, max_age: 90, sex_constraint: "all",
        bmi_risk_keywords: "normal,underweight,overweight,obese",
        doctor_type: "Dermatologist",
        recommended_action: "Apply moisturizing cream. Consult a Dermatologist if the rash is spreading or infected."
    },
    {
        name: "Post-Traumatic Scar Revision",
        keywords: "scar, keloid, burn scar, facial scar, revision required",
        min_age: 5, max_age: 90, sex_constraint: "all",
        bmi_risk_keywords: "normal,underweight,overweight,obese",
        doctor_type: "Plastic Surgeon",
        recommended_action: "Schedule an assessment with a Plastic Surgeon to discuss revision options."
    },
    {
        name: "Urinary Tract Infection (UTI)",
        keywords: "pelvic pain, dysuria, painful urination, burning when peeing, frequent urge, cloudy urine, lower back pain",
        min_age: 5, max_age: 90, sex_constraint: "female,male",
        bmi_risk_keywords: "all",
        doctor_type: "Urologist or Primary Care Physician (PCP)",
        recommended_action: "Increase water intake. Submit a urine sample for culture and consult a Urologist/PCP."
    },
    {
        name: "Influenza (Flu)",
        keywords: "fever, cough, high temperature, hacking, temp, chills, body ache, muscle pain, tired, malaise",
        min_age: 1, max_age: 100, sex_constraint: "all",
        bmi_risk_keywords: "all",
        doctor_type: "Primary Care Physician (PCP)",
        recommended_action: "Rest, hydrate, and take Paracetamol for fever/pain. Consult PCP if symptoms worsen."
    },
    {
        name: "Malnutrition / Anemia",
        keywords: "severe fatigue, pale skin, dizziness, weakness, brittle hair",
        min_age: 0, max_age: 100, sex_constraint: "all",
        bmi_risk_keywords: "underweight",
        doctor_type: "Primary Care Physician (PCP)",
        recommended_action: "Get a full blood count (CBC). Consult PCP for nutritional advice or iron supplements."
    },
    {
        name: "Common Cold",
        keywords: "sneezing, runny nose, dripping nose, sore throat, throat pain, nasal congestion, clear mucus, vomiting",
        min_age: 0, max_age: 100, sex_constraint: "all",
        bmi_risk_keywords: "all",
        doctor_type: "Primary Care Physician (PCP)",
        recommended_action: "Rest, hydrate, and use warm gargles for sore throat. Should resolve in 5-7 days."
    },
    {
        name: "Pediatric Asthma",
        keywords: "wheezing, shortness of breath, chest tightness, coughing at night, breathing difficulties (child)",
        min_age: 0, max_age: 16, sex_constraint: "all",
        bmi_risk_keywords: "all",
        doctor_type: "Pediatrician",
        recommended_action: "Consult a Pediatrician for a definitive diagnosis and inhaler prescription."
    },
    {
        name: "Abdominal aortic aneurysm",
        keywords: "sudden severe back pain, pulsating abdomen, lightheadedness, fast heart rate, tearing pain in back or side",
        min_age: 50, max_age: 120, sex_constraint: "male",
        bmi_risk_keywords: "overweight,obese",
        doctor_type: "Vascular Surgeon (CALL EMERGENCY SERVICES IMMEDIATELY.)",
        recommended_action: "**CALL EMERGENCY SERVICES IMMEDIATELY.** If known, seek immediate medical attention if symptoms of rupture occur."
    },
    {
        name: "Achilles tendinopathy",
        keywords: "pain heel, stiffness ankle, swelling back of leg, pain worsens with activity, morning stiffness",
        min_age: 18, max_age: 60, sex_constraint: "all",
        bmi_risk_keywords: "overweight,obese",
        doctor_type: "Orthopedic Surgeon or Physiotherapist",
        recommended_action: "Rest, ice, compression, and elevation (RICE). Consult an orthopedic specialist if pain persists."
    },
    {
        name: "Acne",
        keywords: "pimples, blackheads, whiteheads, oily skin, facial rash, spots",
        min_age: 10, max_age: 40, sex_constraint: "all",
        bmi_risk_keywords: "all",
        doctor_type: "Dermatologist",
        recommended_action: "Use non-comedogenic cleansers. Consult a Dermatologist for moderate to severe cases."
    },
    
    
    {
        name: "Acute lymphoblastic leukaemia: Children",
        keywords: "persistent fever, bone joint pain (child), pale, tired (child), easy bleeding (child)",
        min_age: 0, max_age: 15, sex_constraint: "all",
        bmi_risk_keywords: "all",
        doctor_type: "Pediatric Oncologist",
        recommended_action: "Seek urgent consultation with a Pediatrician/Oncologist."
    },
    {
        name: "Acute myeloid leukaemia",
        keywords: "fatigue, shortness of breath, easy bruising, bleeding gums, recurrent infections, fever",
        min_age: 15, max_age: 100, sex_constraint: "all",
        bmi_risk_keywords: "over weight",
        doctor_type: "Hematologist",
        recommended_action: "Consult a Hematologist urgently for blood tests."
    },
    {
        name: "Acute myeloid leukaemia: Children",
        keywords: "fever, nosebleeds (child), pale, tired (child), infections (child)",
        min_age: 0, max_age: 15, sex_constraint: "all",
        bmi_risk_keywords: "all",
        doctor_type: "Pediatric Oncologist",
        recommended_action: "Seek urgent consultation with a Pediatrician/Oncologist."
    },
    {
        name: "Acute pancreatitis",
        keywords: "sudden severe upper abdominal pain, pain radiating to back, nausea, vomiting, tender abdomen, rapid pulse",
        min_age: 18, max_age: 100, sex_constraint: "all",
        bmi_risk_keywords: "overweight,obese",
        doctor_type: "Gastroenterologist (SEEK EMERGENCY CARE)",
        recommended_action: "**SEEK EMERGENCY MEDICAL HELP IMMEDIATELY.** Requires hospital admission."
    },
    {
        name: "Acute respiratory infection (ARI)",
        keywords: "fever, cough, sore throat, runny nose, difficulty breathing, shortness of breath",
        min_age: 0, max_age: 100, sex_constraint: "all",
        bmi_risk_keywords: "all",
        doctor_type: "Primary Care Physician (PCP) or Pulmonologist",
        recommended_action: "Rest, fluids. If shortness of breath is severe, seek emergency care."
    },
    {
        name: "Addison’s disease",
        keywords: "extreme fatigue, weight loss, darkening skin (hyperpigmentation), low blood pressure, muscle weakness, salt craving",
        min_age: 10, max_age: 90, sex_constraint: "all",
        bmi_risk_keywords: "all",
        doctor_type: "Endocrinologist",
        recommended_action: "Consult an Endocrinologist for blood tests (cortisol, ACTH)."
    },
    {
        name: "Adenomyosis",
        keywords: "heavy menstrual bleeding, severe period pain, prolonged periods, pelvic pain (female)",
        min_age: 30, max_age: 50, sex_constraint: "female",
        bmi_risk_keywords: "all",
        doctor_type: "Gynecologist",
        recommended_action: "Consult a Gynecologist for ultrasound or MRI."
    },
    {
        name: "Alcohol-related liver disease",
        keywords: "jaundice, yellow eyes, abdominal swelling, easy bruising, nausea, fatigue, chronic alcohol use",
        min_age: 20, max_age: 100, sex_constraint: "all",
        bmi_risk_keywords: "all",
        doctor_type: "Hepatologist or Gastroenterologist",
        recommended_action: "Stop alcohol consumption immediately. Consult a Hepatologist urgently for liver function tests."
    },
    {
        name: "Allergic rhinitis",
        keywords: "sneezing, itchy nose, watery eyes, blocked nose, seasonal allergy",
        min_age: 3, max_age: 90, sex_constraint: "all",
        bmi_risk_keywords: "all",
        doctor_type: "Allergist or ENT",
        recommended_action: "Try antihistamines. Consult an Allergist for skin prick testing."
    },
    {
        name: "Allergies",
        keywords: "hives, rash, itching, swelling, sneezing, wheezing after exposure",
        min_age: 0, max_age: 100, sex_constraint: "all",
        bmi_risk_keywords: "all",
        doctor_type: "Allergist",
        recommended_action: "Identify trigger. If severe swelling (anaphylaxis), **SEEK EMERGENCY CARE.**"
    },
    {
        name: "Alzheimer’s disease",
        keywords: "memory loss, difficulty problem-solving, poor judgment, disorientation, personality changes (elderly)",
        min_age: 60, max_age: 100, sex_constraint: "all",
        bmi_risk_keywords: "all",
        doctor_type: "Neurologist or Geriatrician",
        recommended_action: "Consult a Neurologist for cognitive assessment and brain imaging."
    },
    {
        name: "Anal cancer",
        keywords: "bleeding from anus, pain around anus, anal lump, persistent itching, change in bowel habits",
        min_age: 40, max_age: 90, sex_constraint: "all",
        bmi_risk_keywords: "overweight,obese",
        doctor_type: "Gastroenterologist or Oncologist",
        recommended_action: "Consult a specialist for digital rectal examination and biopsy."
    },
    {
        name: "Anaphylaxis",
        keywords: "sudden swelling face lips tongue, difficulty breathing, rash hives, wheezing, rapid weak pulse, severe allergic reaction",
        min_age: 0, max_age: 100, sex_constraint: "all",
        bmi_risk_keywords: "all",
        doctor_type: "Emergency Physician (CALL EMERGENCY SERVICES IMMEDIATELY.)",
        recommended_action: "**CALL EMERGENCY SERVICES IMMEDIATELY.** Use EpiPen if available."
    },
    {
        name: "Angina",
        keywords: "chest pain, chest tightness, pressure in chest, pain radiating to arm neck jaw, pain relieved by rest",
        min_age: 40, max_age: 100, sex_constraint: "all",
        bmi_risk_keywords: "overweight,obese",
        doctor_type: "Cardiologist",
        recommended_action: "Rest immediately. Take prescribed nitrates. Consult a Cardiologist for testing (ECG, stress test)."
    },
    {
        name: "Angioedema",
        keywords: "sudden swelling beneath skin, swollen lips eyelids throat, face swelling, difficulty breathing",
        min_age: 0, max_age: 100, sex_constraint: "all",
        bmi_risk_keywords: "all",
        doctor_type: "Allergist or Emergency Physician",
        recommended_action: "If throat swelling or breathing difficulty, **SEEK EMERGENCY CARE.**"
    },
    {
        name: "Ankle sprain",
        keywords: "ankle pain, swelling ankle, bruising ankle, difficulty walking, instability after injury",
        min_age: 5, max_age: 90, sex_constraint: "all",
        bmi_risk_keywords: "overweight",
        doctor_type: "Orthopedic Surgeon or Primary Care Physician (PCP)",
        recommended_action: "RICE (Rest, Ice, Compression, Elevation). See a doctor if unable to bear weight."
    },
    {
        name: "Ankle avulsion fracture",
        keywords: "severe ankle pain after injury, inability to walk, sudden sharp pain, swelling",
        min_age: 5, max_age: 90, sex_constraint: "all",
        bmi_risk_keywords: "all",
        doctor_type: "Orthopedic Surgeon",
        recommended_action: "Immobilize the ankle and **SEEK URGENT MEDICAL CARE** (X-ray needed)."
    },
    {
        name: "Ankylosing spondylitis",
        keywords: "chronic back pain, stiffness in lower back, pain worse in morning, pain improves with exercise, buttock pain",
        min_age: 15, max_age: 50, sex_constraint: "male",
        bmi_risk_keywords: "overweight",
        doctor_type: "Rheumatologist",
        recommended_action: "Consult a Rheumatologist for evaluation and inflammatory marker testing."
    },
    {
        name: "Anorexia nervosa",
        keywords: "extreme restriction food, severe weight loss, distorted body image, fear of gaining weight, excessive exercise",
        min_age: 10, max_age: 40, sex_constraint: "female",
        bmi_risk_keywords: "underweight",
        doctor_type: "Psychiatrist or Clinical Psychologist",
        recommended_action: "Seek comprehensive psychological and nutritional assessment."
    },
    {
        name: "Anxiety disorders in children and young people",
        keywords: "excessive worry (child), panic attacks (child), reluctance to go to school, restlessness (child), physical symptoms of worry",
        min_age: 5, max_age: 25, sex_constraint: "all",
        bmi_risk_keywords: "underweight",
        doctor_type: "Pediatric Psychiatrist or Psychologist",
        recommended_action: "Consult a specialist for cognitive behavioral therapy (CBT) assessment."
    },
    {
        name: "Aplastic anaemia",
        keywords: "fatigue, pale skin, frequent infections, easy bruising, shortness of breath",
        min_age: 0, max_age: 100, sex_constraint: "all",
        bmi_risk_keywords: "overweight",
        doctor_type: "Hematologist",
        recommended_action: "Consult a Hematologist urgently for complete blood count (CBC)."
    },
    {
        name: "Appendicitis",
        keywords: "pain starting near belly button, pain moving to lower right abdomen, severe tummy pain, fever, nausea, vomiting, loss of appetite",
        min_age: 5, max_age: 70, sex_constraint: "all",
        bmi_risk_keywords: "overweight",
        doctor_type: "General Surgeon (SEEK EMERGENCY CARE)",
        recommended_action: "**SEEK EMERGENCY MEDICAL HELP IMMEDIATELY.** Requires urgent surgical review."
    },
    {
        name: "Arterial thrombosis",
        keywords: "sudden severe limb pain, cold white limb, pulseless limb, weakness, paralysis, numbness",
        min_age: 18, max_age: 100, sex_constraint: "all",
        bmi_risk_keywords: "overweight,obese",
        doctor_type: "Vascular Surgeon (CALL EMERGENCY SERVICES IMMEDIATELY.)",
        recommended_action: "**CALL EMERGENCY SERVICES IMMEDIATELY.** This is a time-critical emergency."
    },
    {
        name: "Arthritis",
        keywords: "joint swelling, chronic joint pain, stiffness, limited range of motion",
        min_age: 18, max_age: 100, sex_constraint: "all",
        bmi_risk_keywords: "overweight,obese",
        doctor_type: "Rheumatologist or Orthopedic Surgeon",
        recommended_action: "Consult a Rheumatologist for diagnostic blood tests and joint assessment."
    },
    {
        name: "Asbestosis",
        keywords: "shortness of breath, persistent dry cough, chest pain, clubbed fingers, history of asbestos exposure",
        min_age: 40, max_age: 100, sex_constraint: "all",
        bmi_risk_keywords: "overweight",
        doctor_type: "Pulmonologist",
        recommended_action: "Consult a Pulmonologist for chest X-ray and lung function testing."
    },
    {
        name: "Ataxia",
        keywords: "loss of coordination, unsteady walking, difficulty balancing, slurred speech, clumsy movements",
        min_age: 0, max_age: 100, sex_constraint: "all",
        bmi_risk_keywords: "all",
        doctor_type: "Neurologist",
        recommended_action: "Consult a Neurologist for brain imaging (MRI) and genetic testing."
    },
    {
        name: "Atopic eczema",
        keywords: "itchy rash, dry flaky skin, red patches, inflamed skin behind knees elbows, childhood rash",
        min_age: 0, max_age: 90, sex_constraint: "all",
        bmi_risk_keywords: "all",
        doctor_type: "Dermatologist or Allergist",
        recommended_action: "Use emollients liberally. Consult a Dermatologist if severe or infected."
    },
    {
        name: "Atrial fibrillation",
        keywords: "irregular heartbeat, fast heart rate, heart palpitations, dizzy, short of breath, fatigue",
        min_age: 50, max_age: 100, sex_constraint: "all",
        bmi_risk_keywords: "overweight,obese",
        doctor_type: "Cardiologist",
        recommended_action: "Consult a Cardiologist for ECG and rhythm management."
    },
    {
        name: "Attention deficit hyperactivity disorder (ADHD)",
        keywords: "inattention, hyperactivity, impulsivity, difficulty focusing, restlessness, organization problems (child or adult)",
        min_age: 5, max_age: 50, sex_constraint: "all",
        bmi_risk_keywords: "all",
        doctor_type: "Psychiatrist or Clinical Psychologist",
        recommended_action: "Seek assessment from a specialist in neurodevelopmental disorders."
    },
    {
        name: "Autism",
        keywords: "social difficulty, repetitive behaviors, limited interests, communication challenges, sensory sensitivity (child)",
        min_age: 1, max_age: 18, sex_constraint: "all",
        bmi_risk_keywords: "all",
        doctor_type: "Pediatrician or Developmental Psychologist",
        recommended_action: "Consult a pediatrician for formal diagnostic evaluation."
    },
    {
        name: "Back problems",
        keywords: "lower back pain, chronic ache in back, pain shooting down leg, stiffness in spine, difficulty standing straight",
        min_age: 18, max_age: 100, sex_constraint: "all",
        bmi_risk_keywords: "overweight,obese",
        doctor_type: "Orthopedic Surgeon or Physiotherapist",
        recommended_action: "Maintain activity, use heat/ice. Consult Orthopedic if pain is severe or causes leg weakness."
    },
    {
        name: "Bacterial vaginosis",
        keywords: "thin gray vaginal discharge, fishy odor vagina, itching burning vulva",
        min_age: 15, max_age: 50, sex_constraint: "female",
        bmi_risk_keywords: "all",
        doctor_type: "Gynecologist or Primary Care Physician (PCP)",
        recommended_action: "Consult a Gynecologist for diagnosis and antibiotic treatment."
    },
    {
        name: "Becker muscular dystrophy",
        keywords: "muscle weakness in legs and arms (slowly progressing), muscle cramps, difficulty standing up, walking on tiptoes",
        min_age: 5, max_age: 60, sex_constraint: "male",
        bmi_risk_keywords: "overweight",
        doctor_type: "Neurologist",
        recommended_action: "Consult a Neurologist for genetic testing and muscle biopsy."
    },
    {
        name: "Benign prostate enlargement",
        keywords: "frequent urination (male), difficulty starting urination, weak urine flow, night urination (male), incomplete emptying",
        min_age: 50, max_age: 100, sex_constraint: "male",
        bmi_risk_keywords: "underweight",
        doctor_type: "Urologist",
        recommended_action: "Consult a Urologist for prostate exam and PSA blood test."
    },
    {
        name: "Bile duct cancer (cholangiocarcinoma)",
        keywords: "jaundice, yellow skin, dark urine, pale stools, unexplained weight loss, upper abdominal pain",
        min_age: 50, max_age: 100, sex_constraint: "all",
        bmi_risk_keywords: "overweight",
        doctor_type: "Gastroenterologist or Oncologist",
        recommended_action: "Consult a Gastroenterologist urgently for imaging (ultrasound, CT)."
    },
    {
        name: "Binge eating disorder (BED)",
        keywords: "eating large amounts of food rapidly, feeling lack of control over eating, eating alone due to shame",
        min_age: 15, max_age: 50, sex_constraint: "all",
        bmi_risk_keywords: "overweight,obese",
        doctor_type: "Psychiatrist or Clinical Psychologist",
        recommended_action: "Seek psychological support and nutritional counseling."
    },
    {
        name: "Bipolar disorder",
        keywords: "periods of extreme high mood (mania) and low mood (depression), racing thoughts, impulsive behavior, persistent sadness",
        min_age: 15, max_age: 60, sex_constraint: "all",
        bmi_risk_keywords: "all",
        doctor_type: "Psychiatrist",
        recommended_action: "Consult a Psychiatrist for diagnosis and medication management."
    },
    {
        name: "Bladder cancer",
        keywords: "blood in urine (haematuria), painful urination, frequent urination, pelvic pain",
        min_age: 10, max_age: 100, sex_constraint: "male",
        bmi_risk_keywords: "all",
        doctor_type: "Urologist",
        recommended_action: "Consult a Urologist urgently for cystoscopy."
    },
    {
        name: "Blood poisoning (sepsis)",
        keywords: "fever, chills, rapid heart rate, confusion, very low blood pressure, severe infection",
        min_age: 0, max_age: 100, sex_constraint: "all",
        bmi_risk_keywords: "all",
        doctor_type: "Emergency Physician (CALL EMERGENCY SERVICES IMMEDIATELY.)",
        recommended_action: "**CALL EMERGENCY SERVICES IMMEDIATELY.** This is a life-threatening emergency."
    },
    {
        name: "Bone cancer",
        keywords: "persistent bone pain, localized swelling, pain worse at night, unexplained lump, bone fracture with minor injury",
        min_age: 10, max_age: 80, sex_constraint: "all",
        bmi_risk_keywords: "all",
        doctor_type: "Orthopedic Oncologist",
        recommended_action: "Consult a specialist for X-ray and biopsy."
    },
    {
        name: "Bowel cancer",
        keywords: "change in bowel habits, blood in stool, persistent abdominal pain, unexplained weight loss, fatigue, anemia",
        min_age: 40, max_age: 100, sex_constraint: "all",
        bmi_risk_keywords: "overweight,obese",
        doctor_type: "Gastroenterologist or Colorectal Surgeon",
        recommended_action: "Consult a specialist urgently for colonoscopy."
    },
    {
        name: "Bowel incontinence",
        keywords: "loss of bowel control, involuntary stool leakage, inability to hold back gas",
        min_age: 18, max_age: 100, sex_constraint: "female",
        bmi_risk_keywords: "all",
        doctor_type: "Gastroenterologist or Colorectal Surgeon",
        recommended_action: "Consult a specialist for physical assessment and potential pelvic floor therapy."
    },
    {
        name: "Bowel polyps",
        keywords: "rectal bleeding, blood in stool, change in bowel habits, iron deficiency anemia",
        min_age: 40, max_age: 100, sex_constraint: "all",
        bmi_risk_keywords: "all",
        doctor_type: "Gastroenterologist",
        recommended_action: "Consult a Gastroenterologist for screening colonoscopy."
    },
    {
        name: "Bow legs and knock knees in children and young people",
        keywords: "legs bowed outwards (child), knees touching while ankles apart (child), uneven gait",
        min_age: 0, max_age: 10, sex_constraint: "all",
        bmi_risk_keywords: "all",
        doctor_type: "Pediatric Orthopedic Surgeon",
        recommended_action: "Monitor child's growth. Consult a specialist if severe or asymmetrical."
    },
    {
        name: "Brain stem death",
        keywords: "no response to pain, no coughing or gag reflex, no breathing effort",
        min_age: 0, max_age: 120, sex_constraint: "all",
        bmi_risk_keywords: "all",
        doctor_type: "Neurologist (Medical Emergency)",
        recommended_action: "**MEDICAL CONFIRMATION REQUIRED.** Patient is critically ill, requires life support."
    },
    {
        name: "Brain tumours",
        keywords: "new onset severe headache, headache worse in morning, unexplained nausea vomiting, seizure, vision changes, personality change",
        min_age: 18, max_age: 100, sex_constraint: "all",
        bmi_risk_keywords: "all",
        doctor_type: "Neurosurgeon or Neurologist",
        recommended_action: "Consult a Neurologist urgently for MRI scan."
    },
    {
        name: "Brain tumours: Children",
        keywords: "persistent headache (child), balance problems (child), repeated vomiting, visual difficulty (child)",
        min_age: 0, max_age: 15, sex_constraint: "all",
        bmi_risk_keywords: "all",
        doctor_type: "Pediatric Oncologist or Neurosurgeon",
        recommended_action: "Consult a Pediatrician/Specialist urgently."
    },
    {
        name: "Brain tumours: Teenagers and young adults",
        keywords: "new severe headache, seizure, cognitive changes, vomiting, vision problems (young adult)",
        min_age: 13, max_age: 30, sex_constraint: "all",
        bmi_risk_keywords: "all",
        doctor_type: "Neurosurgeon or Oncologist",
        recommended_action: "Consult a Neurologist urgently for MRI scan."
    },
    {
        name: "Breast cancer (female)",
        keywords: "breast lump, change in breast size shape, nipple discharge, inverted nipple, skin dimpling, pain in breast",
        min_age: 20, max_age: 100, sex_constraint: "female",
        bmi_risk_keywords: "overweight,obese",
        doctor_type: "Oncologist or Breast Surgeon",
        recommended_action: "Consult a specialist for mammogram and ultrasound."
    },
    {
        name: "Breast cancer (male)",
        keywords: "lump under nipple (male), nipple discharge (male), retracted nipple (male), pain in breast (male)",
        min_age: 50, max_age: 100, sex_constraint: "male",
        bmi_risk_keywords: "overweight,obese",
        doctor_type: "Oncologist or Breast Surgeon",
        recommended_action: "Consult a specialist for mammogram and ultrasound."
    },
    {
        name: "Breathing problems in children",
        keywords: "fast breathing (child), noisy breathing (child), retractions, wheezing (child), difficulty breathing (child)",
        min_age: 0, max_age: 15, sex_constraint: "all",
        bmi_risk_keywords: "overweight",
        doctor_type: "Pediatrician or Pulmonologist",
        recommended_action: "If breathing is severely difficult, **SEEK EMERGENCY CARE.** Consult a Pediatrician."
    },
    {
        name: "Breathlessness",
        keywords: "shortness of breath at rest, difficulty catching breath, gasping for air, dyspnea on exertion",
        min_age: 18, max_age: 100, sex_constraint: "all",
        bmi_risk_keywords: "overweight,obese",
        doctor_type: "Pulmonologist or Cardiologist",
        recommended_action: "If sudden or severe, **SEEK EMERGENCY CARE.** Consult a specialist for lung/heart function tests."
    },
    {
        name: "Bronchiectasis",
        keywords: "persistent cough, cough with thick phlegm, recurrent chest infections, shortness of breath, fatigue",
        min_age: 18, max_age: 100, sex_constraint: "all",
        bmi_risk_keywords: "all",
        doctor_type: "Pulmonologist",
        recommended_action: "Consult a Pulmonologist for a chest CT scan."
    },
    {
        name: "Bronchitis",
        keywords: "persistent cough with mucus, chest discomfort, fatigue, low fever, shortness of breath",
        min_age: 5, max_age: 100, sex_constraint: "all",
        bmi_risk_keywords: "all",
        doctor_type: "Primary Care Physician (PCP)",
        recommended_action: "Rest, fluids. If symptoms last >3 weeks or fever is high, consult PCP."
    },
    {
        name: "Bulimia nervosa",
        keywords: "binge eating, forced vomiting, misuse of laxatives, intense fear of weight gain, dental erosion",
        min_age: 15, max_age: 40, sex_constraint: "female",
        bmi_risk_keywords: "normal,overweight,obese",
        doctor_type: "Psychiatrist or Clinical Psychologist",
        recommended_action: "Seek comprehensive psychological and nutritional assessment."
    },
    {
        name: "Bunion (hallux valgus)",
        keywords: "painful lump base of big toe, big toe points inwards, swelling at joint, difficulty wearing shoes",
        min_age: 20, max_age: 100, sex_constraint: "female",
        bmi_risk_keywords: "all",
        doctor_type: "Orthopedic Surgeon or Podiatrist",
        recommended_action: "Wear comfortable shoes. Consult a specialist if pain is disabling."
    },
    {
        name: "Carcinoid syndrome and carcinoid tumours",
        keywords: "flushing skin, persistent diarrhea, wheezing, rapid heart rate, abdominal pain",
        min_age: 30, max_age: 90, sex_constraint: "all",
        bmi_risk_keywords: "overweight",
        doctor_type: "Endocrinologist or Oncologist",
        recommended_action: "Consult a specialist for hormonal blood tests (5-HIAA)."
    },
    {
        name: "Cardiac arrest",
        keywords: "sudden collapse, no breathing, no pulse, unconscious, emergency",
        min_age: 0, max_age: 120, sex_constraint: "all",
        bmi_risk_keywords: "",
        doctor_type: "Emergency Physician (CALL EMERGENCY SERVICES IMMEDIATELY.)",
        recommended_action: "**CALL EMERGENCY SERVICES IMMEDIATELY.** Start CPR immediately."
    },
    {
        name: "Cardiovascular disease",
        keywords: "chest pain, shortness of breath, palpitations, ankle swelling, high blood pressure, dizziness",
        min_age: 30, max_age: 100, sex_constraint: "overweight",
        bmi_risk_keywords: "overweight,obese",
        doctor_type: "Cardiologist",
        recommended_action: "Adopt a healthy lifestyle. Consult a Cardiologist for risk assessment (ECG, cholesterol check)."
    },
    {
        name: "Carpal tunnel syndrome",
        keywords: "numbness fingers, tingling hand, pain wrist, hand weakness, symptoms worse at night",
        min_age: 30, max_age: 70, sex_constraint: "female",
        bmi_risk_keywords: "all",
        doctor_type: "Neurologist or Orthopedic Surgeon",
        recommended_action: "Wear a wrist splint at night. Consult a Neurologist for nerve conduction study."
    },
    {
        name: "Catarrh",
        keywords: "mucus in throat, blocked stuffy nose, persistent cough, sensation of post-nasal drip",
        min_age: 5, max_age: 100, sex_constraint: "all",
        bmi_risk_keywords: "all",
        doctor_type: "ENT (Ear, Nose, Throat Specialist)",
        recommended_action: "Steam inhalation. If persistent, consult an ENT specialist."
    },
    

    {
        name: "Cervical cancer",
        keywords: "abnormal vaginal bleeding, bleeding after sex, pelvic pain, watery bloody vaginal discharge",
        min_age: 20, max_age: 70, sex_constraint: "female",
        bmi_risk_keywords: "over weight",
        doctor_type: "Gynecologist or Oncologist",
        recommended_action: "Get a Pap smear. Consult a Gynecologist urgently if bleeding is abnormal."
    },
    {
        name: "Cervical spondylosis",
        keywords: "neck pain stiffness,neck pain, shoulder pain, pain radiating to shoulders or arms, muscle weakness in arms, headache back of head",
        min_age: 40, max_age: 90, sex_constraint: "all",
        bmi_risk_keywords: "obese,overweight",
        doctor_type: "Orthopedic Surgeon or Neurologist",
        recommended_action: "Try neck exercises and heat. Consult a specialist for imaging (X-ray/MRI)."
    },
    {
        name: "Chest and rib injury",
        keywords: "pain when breathing, sharp pain in chest after trauma, bruising on chest, difficulty taking deep breath",
        min_age: 5, max_age: 100, sex_constraint: "all",
        bmi_risk_keywords: "overweight,obese",
        doctor_type: "Emergency Physician (SEEK EMERGENCY CARE)",
        recommended_action: "**SEEK EMERGENCY MEDICAL HELP** to rule out lung injury (pneumothorax)."
    },
    {
        name: "Chest infection",
        keywords: "productive cough, cough with yellow green mucus, shortness of breath, fever, chest tightness",
        min_age: 0, max_age: 100, sex_constraint: "all",
        bmi_risk_keywords: "all",
        doctor_type: "Primary Care Physician (PCP) or Pulmonologist",
        recommended_action: "Consult a doctor for chest X-ray and antibiotic consideration."
    },
    {
        name: "Chickenpox",
        keywords: "itchy blister rash, spots all over body, fever, malaise, crusting rash",
        min_age: 0, max_age: 90, sex_constraint: "all",
        bmi_risk_keywords: "all",
        doctor_type: "Primary Care Physician (PCP)",
        recommended_action: "Isolate. Use calamine lotion for itching. Consult PCP if adult or immunocompromised."
    },
    {
        name: "Chilblains",
        keywords: "itchy red swollen patches skin, burning sensation on toes fingers, symptoms after cold exposure",
        min_age: 5, max_age: 90, sex_constraint: "all",
        bmi_risk_keywords: "all",
        doctor_type: "Dermatologist or Primary Care Physician (PCP)",
        recommended_action: "Warm hands/feet gradually. Keep skin dry and warm."
    },
    {
        name: "Chlamydia",
        keywords: "abnormal vaginal discharge, pain when urinating, testicular pain swelling (male), bleeding between periods",
        min_age: 15, max_age: 50, sex_constraint: "all",
        bmi_risk_keywords: "all",
        doctor_type: "Urologist, Gynecologist, or Genitourinary Medicine (GUM) Specialist",
        recommended_action: "Get tested immediately. Requires antibiotic treatment."
    },
    {
        name: "Chronic fatigue syndrome",
        keywords: "severe persistent fatigue, fatigue not relieved by rest, post-exertional malaise, difficulty concentrating, muscle joint pain",
        min_age: 18, max_age: 60, sex_constraint: "female",
        bmi_risk_keywords: "all",
        doctor_type: "Neurologist or Chronic Pain Specialist",
        recommended_action: "Consult a specialist for a long-term management plan."
    },
    {
        name: "Chronic lymphocytic leukaemia",
        keywords: "swollen painless lymph nodes, chronic fatigue, night sweats, recurrent infections, unintended weight loss",
        min_age: 50, max_age: 100, sex_constraint: "all",
        bmi_risk_keywords: "overweight",
        doctor_type: "Hematologist",
        recommended_action: "Consult a Hematologist for blood tests."
    },
    {
        name: "Chronic myeloid leukaemia",
        keywords: "fatigue, weight loss, night sweats, enlarged spleen, pain below ribs",
        min_age: 40, max_age: 100, sex_constraint: "all",
        bmi_risk_keywords: "overweight",
        doctor_type: "Hematologist",
        recommended_action: "Consult a Hematologist for blood tests."
    },
    {
        name: "Chronic obstructive pulmonary disease (COPD)",
        keywords: "persistent cough, cough with mucus, shortness of breath, wheezing, smoking history",
        min_age: 40, max_age: 100, sex_constraint: "all",
        bmi_risk_keywords: "underweight",
        doctor_type: "Pulmonologist",
        recommended_action: "Stop smoking. Consult a Pulmonologist for spirometry (lung function test)."
    },
    {
        name: "Chronic pain",
        keywords: "pain lasting more than 3 months,pain lasting more than 2 months, persistent ache, pain unresponsive to standard treatment",
        min_age: 18, max_age: 100, sex_constraint: "all",
        bmi_risk_keywords: "obese,overweight    ",
        doctor_type: "Chronic Pain Specialist",
        recommended_action: "Consult a Pain Specialist for a multidisciplinary treatment approach."
    },
    {
        name: "Chronic pancreatitis",
        keywords: "chronic upper abdominal pain, pain radiating to back, oily stools (steatorrhea), diabetes, unexplained weight loss",
        min_age: 30, max_age: 90, sex_constraint: "all",
        bmi_risk_keywords: "overweight,obese",
        doctor_type: "Gastroenterologist",
        recommended_action: "Avoid alcohol. Consult a Gastroenterologist for imaging and enzyme supplements."
    },
    {
        name: "Cirrhosis",
        keywords: "jaundice, yellow skin, fatigue, fluid buildup abdomen (ascites), easy bruising, portal hypertension",
        min_age: 30, max_age: 100, sex_constraint: "all",
        bmi_risk_keywords: "all",
        doctor_type: "Hepatologist or Gastroenterologist",
        recommended_action: "Avoid alcohol. Consult a Hepatologist urgently for liver function assessment."
    },
    {
        name: "Clavicle (collar bone) fracture",
        keywords: "pain shoulder area after fall, swelling bruising shoulder, inability to lift arm, shoulder deformity",
        min_age: 5, max_age: 100, sex_constraint: "all",
        bmi_risk_keywords: "overweight,obese",
        doctor_type: "Orthopedic Surgeon",
        recommended_action: "Immobilize the arm (sling). **SEEK URGENT MEDICAL CARE** (X-ray needed)."
    },
    {
        name: "Clostridium difficile",
        keywords: "watery diarrhea (often after antibiotics), abdominal cramps, fever, loss of appetite, severe diarrhea",
        min_age: 1, max_age: 100, sex_constraint: "all",
        bmi_risk_keywords: "underweight",
        doctor_type: "Infectious Disease Specialist or Gastroenterologist",
        recommended_action: "Consult a doctor immediately for stool sample test and specific antibiotic treatment."
    },
    {
        name: "Coeliac disease",
        keywords: "chronic diarrhea, abdominal bloating, fatigue, unexplained weight loss, iron deficiency anemia, symptoms after eating gluten",
        min_age: 0, max_age: 100, sex_constraint: "all",
        bmi_risk_keywords: "underweight",
        doctor_type: "Gastroenterologist",
        recommended_action: "Consult a Gastroenterologist for blood tests (antibodies) and endoscopy."
    },
    {
        name: "Cold sore",
        keywords: "tingling around mouth, small fluid-filled blister lip, crusting sore, herpes simplex",
        min_age: 1, max_age: 100, sex_constraint: "all",
        bmi_risk_keywords: "all",
        doctor_type: "Primary Care Physician (PCP)",
        recommended_action: "Use topical antiviral cream. Usually resolves in 7-10 days."
    },
    {
        name: "Coma",
        keywords: "deep unconsciousness, unresponsive to stimuli, eyes closed, abnormal breathing",
        min_age: 0, max_age: 120, sex_constraint: "all",
        bmi_risk_keywords: "all",
        doctor_type: "Neurologist (CALL EMERGENCY SERVICES IMMEDIATELY.)",
        recommended_action: "**CALL EMERGENCY SERVICES IMMEDIATELY.** Requires intensive medical support."
    },
    {
        name: "Complications of type 1 diabetes",
        keywords: "ketoacidosis, low blood sugar, numbness feet, frequent infection, blurred vision, kidney damage",
        min_age: 0, max_age: 100, sex_constraint: "all",
        bmi_risk_keywords: "all",
        doctor_type: "Endocrinologist",
        recommended_action: "Consult an Endocrinologist for blood sugar management and specialized checks (eyes, feet, kidney)."
    },
    {
        name: "Concussion",
        keywords: "head trauma, brief loss consciousness, headache, dizziness, confusion, nausea vomiting after injury",
        min_age: 0, max_age: 100, sex_constraint: "all",
        bmi_risk_keywords: "all",
        doctor_type: "Neurologist or Emergency Physician (SEEK URGENT CARE)",
        recommended_action: "Rest, monitor closely. **SEEK EMERGENCY CARE** if vomiting persists or consciousness deteriorates."
    },
    {
        name: "Congenital heart disease",
        keywords: "blue tinge to skin lips (cyanosis), shortness of breath (infant), rapid breathing, feeding difficulty (infant)",
        min_age: 0, max_age: 100, sex_constraint: "all",
        bmi_risk_keywords: "underweight",
        doctor_type: "Pediatric Cardiologist",
        recommended_action: "Requires ongoing care and monitoring by a specialist."
    },
    {
        name: "Congenital muscular dystrophy (CMD)",
        keywords: "muscle weakness at birth, floppiness (infant), poor head control, scoliosis, joint contractures",
        min_age: 0, max_age: 10, sex_constraint: "all",
        bmi_risk_keywords: "underweight",
        doctor_type: "Pediatric Neurologist",
        recommended_action: "Consult a specialist for genetic testing and physiotherapy plan."
    },
    {
        name: "Conjunctivitis",
        keywords: "red eye, itchy eye, watery eye, sticky discharge, pink eye",
        min_age: 0, max_age: 100, sex_constraint: "all",
        bmi_risk_keywords: "all",
        doctor_type: "Optometrist or Primary Care Physician (PCP)",
        recommended_action: "Wash hands frequently. Use artificial tears. Consult if vision is affected."
    },
    {
        name: "Constipation",
        keywords: "infrequent bowel movements, hard lumpy stools, straining during defecation, feeling of incomplete evacuation",
        min_age: 0, max_age: 100, sex_constraint: "all",
        bmi_risk_keywords: "all",
        doctor_type: "Primary Care Physician (PCP) or Gastroenterologist",
        recommended_action: "Increase fiber and fluids. Consult PCP if persistent."
    },
    {
        name: "Coronary heart disease",
        keywords: "angina, chest pain with exertion, shortness of breath, heart attack history",
        min_age: 40, max_age: 100, sex_constraint: "all",
        bmi_risk_keywords: "overweight,obese",
        doctor_type: "Cardiologist",
        recommended_action: "Adopt healthy lifestyle. Consult a Cardiologist for risk assessment and management."
    },

    {
        name: "Coronavirus (COVID-19): Longer-term effects (long COVID)",
        keywords: "persistent fatigue after COVID, brain fog, shortness of breath (long-term), palpitations, joint pain after infection",
        min_age: 18, max_age: 80, sex_constraint: "all",
        bmi_risk_keywords: "all",
        doctor_type: "Pulmonologist or Multi-disciplinary Post-COVID Clinic",
        recommended_action: "Consult a specialist clinic for comprehensive assessment."
    },
    {
        name: "Costochondritis",
        keywords: "sharp pain side of breastbone, tenderness when pressing on ribs, chest pain worse with deep breath or cough",
        min_age: 15, max_age: 60, sex_constraint: "all",
        bmi_risk_keywords: "all",
        doctor_type: "Primary Care Physician (PCP)",
        recommended_action: "Use NSAIDs (Ibuprofen). Consult a doctor to rule out heart problems."
    },
    {
        name: "Cough",
        keywords: "persistent cough, dry cough, hacking, wet cough, cough with phlegm",
        min_age: 0, max_age: 100, sex_constraint: "all",
        bmi_risk_keywords: "all",
        doctor_type: "Primary Care Physician (PCP)",
        recommended_action: "If cough lasts >3 weeks, is bloody, or accompanied by fever/weight loss, consult a PCP."
    },
    {
        name: "Crohn’s disease",
        keywords: "chronic abdominal pain, persistent diarrhea, unexplained weight loss, blood in stool, mouth ulcers, inflammation of intestines",
        min_age: 10, max_age: 50, sex_constraint: "all",
        bmi_risk_keywords: "underweight",
        doctor_type: "Gastroenterologist",
        recommended_action: "Consult a Gastroenterologist for inflammatory marker blood tests and colonoscopy."
    },
    {
        name: "Croup",
        keywords: "barking cough (child), harsh noisy breathing (child), stridor, fever, symptoms worse at night",
        min_age: 0, max_age: 5, sex_constraint: "all",
        bmi_risk_keywords: "all",
        doctor_type: "Pediatrician (SEEK URGENT CARE)",
        recommended_action: "Stay calm, cool air exposure. If breathing is very difficult, **SEEK EMERGENCY CARE.**"
    },
    {
        name: "Cystic fibrosis",
        keywords: "persistent cough with thick mucus, recurrent chest infections, poor weight gain (child), oily fatty stools, salty sweat",
        min_age: 0, max_age: 100, sex_constraint: "all",
        bmi_risk_keywords: "underweight",
        doctor_type: "Pulmonologist or Pediatrician",
        recommended_action: "Requires lifelong specialist management."
    },
    {
        name: "Cystitis",
        keywords: "painful urination, burning when peeing, frequent urge to urinate, pelvic pressure, lower abdominal discomfort (female)",
        min_age: 5, max_age: 90, sex_constraint: "female",
        bmi_risk_keywords: "all",
        doctor_type: "Urologist or Primary Care Physician (PCP)",
        recommended_action: "Increase fluids. Submit a urine sample and consult a doctor for treatment."
    },
    {
        name: "Deep vein thrombosis (DVT)",
        keywords: "swelling in one leg, pain in calf or thigh, warmth over painful area, redness or discoloration",
        min_age: 18, max_age: 100, sex_constraint: "all",
        bmi_risk_keywords: "overweight,obese",
        doctor_type: "Vascular Surgeon or Emergency Physician (SEEK URGENT CARE)",
        recommended_action: "**SEEK URGENT MEDICAL CARE.** Do not massage the leg. Requires ultrasound and blood thinners."
    },
    {
        name: "Dehydration",
        keywords: "extreme thirst, dark urine, dry mouth, less frequent urination, dizziness, fatigue",
        min_age: 0, max_age: 100, sex_constraint: "all",
        bmi_risk_keywords: "all",
        doctor_type: "Primary Care Physician (PCP)",
        recommended_action: "Increase fluid intake (water, ORS). If severe, seek medical attention for IV fluids."
    },
    {
        name: "Dementia",
        keywords: "memory loss, difficulty thinking, poor judgment, confusion, behavioral changes, disorientation (elderly)",
        min_age: 60, max_age: 100, sex_constraint: "all",
        bmi_risk_keywords: "all",
        doctor_type: "Neurologist or Geriatrician",
        recommended_action: "Consult a Neurologist for cognitive assessment and support planning."
    },
    {
        name: "Depression",
        keywords: "persistent sadness, loss of interest, feeling hopeless, fatigue, sleep problems, thoughts of self-harm",
        min_age: 10, max_age: 90, sex_constraint: "all",
        bmi_risk_keywords: "all",
        doctor_type: "Psychiatrist or Clinical Psychologist",
        recommended_action: "Consult a mental health specialist immediately. If suicidal, **SEEK EMERGENCY HELP.**"
    },
    {
        name: "Diabetic ketoacidosis (DKA)",
        keywords: "excessive thirst, frequent urination, nausea vomiting, fruity breath, confusion, rapid deep breathing, high blood sugar",
        min_age: 0, max_age: 100, sex_constraint: "all",
        bmi_risk_keywords: "overweight",
        doctor_type: "Endocrinologist (SEEK EMERGENCY CARE)",
        recommended_action: "**SEEK EMERGENCY MEDICAL HELP IMMEDIATELY.** This is a life-threatening complication of diabetes."
    },
    {
        name: "Diarrhoea in adults",
        keywords: "frequent loose watery stools, abdominal cramps, nausea, urgency, fever",
        min_age: 18, max_age: 100, sex_constraint: "all",
        bmi_risk_keywords: "all",
        doctor_type: "Primary Care Physician (PCP) or Gastroenterologist",
        recommended_action: "Stay hydrated. If bloody, severe, or lasts >3 days, consult a Gastroenterologist."
    },
    {
        name: "Diverticular disease and diverticulitis",
        keywords: "lower left abdominal pain, fever, nausea, severe tummy pain, change in bowel habits",
        min_age: 40, max_age: 100, sex_constraint: "all",
        bmi_risk_keywords: "overweight,obese",
        doctor_type: "Gastroenterologist",
        recommended_action: "Follow a clear fluid diet if symptoms are acute. Consult a Gastroenterologist for imaging and management."
    },
    {
        name: "Dizziness (Lightheadedness)",
        keywords: "feeling faint, unsteadiness, lightheaded, loss of balance, vertigo",
        min_age: 5, max_age: 100, sex_constraint: "all",
        bmi_risk_keywords: "all",
        doctor_type: "Neurologist or ENT (Balance Specialist)",
        recommended_action: "Sit down immediately. Consult a Neurologist if recurrent or severe."
    },
    {
        name: "Duchenne muscular dystrophy (DMD)",
        keywords: "muscle weakness (child), difficulty running/jumping (child), walking on toes (child), Gower's sign, frequent falls",
        min_age: 0, max_age: 30, sex_constraint: "male",
        bmi_risk_keywords: "all",
        doctor_type: "Pediatric Neurologist",
        recommended_action: "Requires specialist genetic testing and multidisciplinary care."
    },

    {
        name: "Earache",
        keywords: "pain in ear, muffled hearing, fluid draining from ear, fever, tugging at ear (child)",
        min_age: 0, max_age: 100, sex_constraint: "all",
        bmi_risk_keywords: "all",
        doctor_type: "ENT (Ear, Nose, Throat Specialist) or Primary Care Physician (PCP)",
        recommended_action: "Try over-the-counter pain relief. Consult ENT if pain is severe or discharge is present."
    },
    {
        name: "Ectopic pregnancy",
        keywords: "severe lower abdominal pain (female), sharp one-sided pelvic pain, missed period, shoulder tip pain, vaginal bleeding",
        min_age: 15, max_age: 45, sex_constraint: "female",
        bmi_risk_keywords: "overweight,obese",
        doctor_type: "Gynecologist (SEEK EMERGENCY CARE)",
        recommended_action: "**SEEK EMERGENCY MEDICAL HELP IMMEDIATELY.** If pregnant or sexually active with pain."
    },
    {
        name: "Endometriosis",
        keywords: "severe period pain, chronic pelvic pain (female), pain during sex, heavy periods, pain during bowel movements or urination",
        min_age: 15, max_age: 50, sex_constraint: "female",
        bmi_risk_keywords: "all",
        doctor_type: "Gynecologist",
        recommended_action: "Consult a Gynecologist for specialized pain management and diagnostic laparoscopy."
    },
    {
        name: "Epilepsy",
        keywords: "seizures, convulsions, staring spells, sudden loss of consciousness, uncontrolled jerking movements",
        min_age: 0, max_age: 100, sex_constraint: "all",
        bmi_risk_keywords: "all",
        doctor_type: "Neurologist",
        recommended_action: "If a first seizure, **SEEK URGENT MEDICAL CARE.** Consult a Neurologist for diagnosis (EEG, MRI)."
    },

    {
        name: "Fever in adults",
        keywords: "high temperature, sweating, chills, body ache, persistent fever",
        min_age: 18, max_age: 100, sex_constraint: "all",
        bmi_risk_keywords: "all",
        doctor_type: "Primary Care Physician (PCP)",
        recommended_action: "Take Paracetamol/Ibuprofen, hydrate. Consult PCP if fever >3 days or >103°F (39.4°C)."
    },
    {
        name: "Fever in children",
        keywords: "high temperature (child), hot forehead (child), shivering (child), lethargic (child)",
        min_age: 0, max_age: 18, sex_constraint: "all",
        bmi_risk_keywords: "all",
        doctor_type: "Pediatrician (SEEK URGENT CARE if infant or very high)",
        recommended_action: "Monitor child closely, use age-appropriate fever reducers. Consult Pediatrician if baby <3 months or fever is very high."
    },
    {
        name: "Fibromyalgia",
        keywords: "widespread body pain, chronic muscle joint pain, fatigue, sleep disturbances, tender points on body, brain fog",
        min_age: 18, max_age: 60, sex_constraint: "female",
        bmi_risk_keywords: "all",
        doctor_type: "Rheumatologist or Pain Specialist",
        recommended_action: "Consult a specialist for a comprehensive pain and fatigue management plan."
    },
    {
        name: "Food poisoning",
        keywords: "nausea, vomiting, diarrhea, abdominal cramps, symptoms shortly after eating suspect food, fever",
        min_age: 0, max_age: 100, sex_constraint: "all",
        bmi_risk_keywords: " overweight,obese",
        doctor_type: "Primary Care Physician (PCP)",
        recommended_action: "Hydrate with ORS. If severe dehydration or bloody stool, seek medical attention."
    },
    {
        name: "Gout",
        keywords: "sudden severe joint pain, intense pain in big toe, swollen red hot joint, joint inflammation",
        min_age: 30, max_age: 100, sex_constraint: "male",
        bmi_risk_keywords: "overweight,obese",
        doctor_type: "Rheumatologist or Primary Care Physician (PCP)",
        recommended_action: "Rest the joint, apply ice. Consult a Rheumatologist for blood test (uric acid) and medication."
    },
    {
        name: "Gum disease (Periodontitis)",
        keywords: "bleeding gums, swollen gums, bad breath, loose teeth, receding gums, pain when chewing",
        min_age: 18, max_age: 100, sex_constraint: "all",
        bmi_risk_keywords: "all",
        doctor_type: "Dentist or Periodontist",
        recommended_action: "Maintain good oral hygiene. Schedule a dental cleaning and check-up."
    },
    {
        name: "Haemorrhoids (piles)",
        keywords: "rectal bleeding, itchy anus, pain during bowel movement, painful lump near anus",
        min_age: 18, max_age: 100, sex_constraint: "all",
        bmi_risk_keywords: "all",
        doctor_type: "General Surgeon or Gastroenterologist",
        recommended_action: "Increase fiber/fluids. Use topical creams. Consult a surgeon if bleeding is heavy or prolapsed."
    },
    {
        name: "Hay fever (Seasonal Allergic Rhinitis)",
        keywords: "sneezing, itchy watery eyes, blocked runny nose, symptoms only in specific seasons",
        min_age: 3, max_age: 90, sex_constraint: "all",
        bmi_risk_keywords: "all",
        doctor_type: "Allergist or ENT",
        recommended_action: "Try over-the-counter antihistamines. Consult an Allergist for stronger treatment."
    },
    {
        name: "Heart failure",
        keywords: "severe shortness of breath, ankle swelling, swelling feet, persistent cough (worse at night), fatigue, inability to lie flat",
        min_age: 40, max_age: 100, sex_constraint: "all",
        bmi_risk_keywords: "overweight,obese",
        doctor_type: "Cardiologist",
        recommended_action: "Limit salt and fluids. Consult a Cardiologist urgently for heart function tests (Echocardiogram)."
    },
    {
        name: "HIV",
        keywords: "fever, sore throat, rash, swollen lymph glands, flu-like symptoms, night sweats, weight loss",
        min_age: 15, max_age: 60, sex_constraint: "all",
        bmi_risk_keywords: "underweight",
        doctor_type: "Infectious Disease Specialist (IDS) or GUM Specialist",
        recommended_action: "Get tested immediately. Consultation with an IDS is essential for management."
    },
    {
        name: "Hypoglycaemia (low blood sugar)",
        keywords: "shaking, sweating, rapid heartbeat, dizziness, confusion, hunger, sudden anxiety, diabetic patient",
        min_age: 0, max_age: 100, sex_constraint: "all",
        bmi_risk_keywords: "underweight",
        doctor_type: "Endocrinologist (SEEK URGENT CARE if unconscious)",
        recommended_action: "Immediately consume 15-20g fast-acting carbohydrate (juice, glucose tablets). Seek emergency help if consciousness is lost."
     },
    {
        name: "Irritable bowel syndrome (IBS)",
        keywords: "chronic abdominal pain, cramping, bloating, gas, alternating constipation and diarrhea, symptoms relieved by passing stool",
        min_age: 18, max_age: 60, sex_constraint: "female",
        bmi_risk_keywords: "obese,overweight",
        doctor_type: "Gastroenterologist",
        recommended_action: "Keep a food diary, manage stress. Consult a Gastroenterologist for diagnosis."
    },
    {
        name: "Kidney stones (Renal Calculi)",
        keywords: "sudden severe pain in back or side, pain radiating to groin, nausea, vomiting, blood in urine, frequent painful urination",
        min_age: 20, max_age: 70, sex_constraint: "male",
        bmi_risk_keywords: "all",
        doctor_type: "Urologist (SEEK URGENT CARE for severe pain)",
        recommended_action: "Increase fluid intake. Seek urgent medical care for pain relief and imaging (CT scan)."
    },
    {
        name: "Lung cancer",
        keywords: "persistent cough, cough with blood, shortness of breath, unexplained weight loss, chest pain, hoarseness, smoking history",
        min_age: 40, max_age: 100, sex_constraint: "all",
        bmi_risk_keywords: "all",
        doctor_type: "Pulmonologist or Oncologist",
        recommended_action: "Consult a Pulmonologist urgently for chest X-ray and CT scan."
    },
    {
        name: "Lupus (Systemic Lupus Erythematosus - SLE)",
        keywords: "butterfly-shaped rash on face, joint pain, fatigue, fever, kidney problems, photosensitivity",
        min_age: 15, max_age: 45, sex_constraint: "female",
        bmi_risk_keywords: "all",
        doctor_type: "Rheumatologist",
        recommended_action: "Consult a Rheumatologist for specialized blood tests (ANA)."
    },
    {
        name: "Migraine",
        keywords: "severe pounding head pain, throbbing head, nausea vomiting, sensitivity to light and sound, aura, visual disturbance",
        min_age: 10, max_age: 60, sex_constraint: "female",
        bmi_risk_keywords: "all",
        doctor_type: "Neurologist",
        recommended_action: "Rest in a dark, quiet room. Consult a Neurologist for diagnosis and management plan."
    },
    {
        name: "Multiple sclerosis (MS)",
        keywords: "fatigue, numbness tingling limbs, vision problems (double vision), muscle weakness, balance problems, coordination difficulty",
        min_age: 20, max_age: 50, sex_constraint: "female",
        bmi_risk_keywords: "all",
        doctor_type: "Neurologist",
        recommended_action: "Consult a Neurologist urgently for MRI of brain and spine."
    },


    {
        name: "Non-alcoholic fatty liver disease (NAFLD)",
        keywords: "fatigue, pain upper right abdomen, enlarged liver, obese, type 2 diabetes, high cholesterol",
        min_age: 20, max_age: 100, sex_constraint: "all",
        bmi_risk_keywords: "overweight,obese",
        doctor_type: "Hepatologist or Gastroenterologist",
        recommended_action: "Weight loss, healthy diet. Consult a Hepatologist for liver function tests and ultrasound."
    },
    {
        name: "Obsessive compulsive disorder (OCD)",
        keywords: "unwanted persistent thoughts (obsessions), repetitive behaviors (compulsions), excessive cleaning checking, intrusive thoughts",
        min_age: 10, max_age: 50, sex_constraint: "all",
        bmi_risk_keywords: "underweight",
        doctor_type: "Psychiatrist or Clinical Psychologist",
        recommended_action: "Seek cognitive behavioral therapy (CBT) and psychiatric assessment."
    },
    {
        name: "Parkinson’s disease",
        keywords: "tremor (shaking), muscle stiffness, slow movement (bradykinesia), balance problems, speech changes (elderly)",
        min_age: 50, max_age: 100, sex_constraint: "male",
        bmi_risk_keywords: "overweight",
        doctor_type: "Neurologist",
        recommended_action: "Consult a Neurologist for clinical diagnosis and medication management."
    },
    {
        name: "Pneumonia",
        keywords: "cough with phlegm, fever, shortness of breath, chest pain when breathing, chills, elderly or young child",
        min_age: 0, max_age: 100, sex_constraint: "all",
        bmi_risk_keywords: "all",
        doctor_type: "Pulmonologist or Primary Care Physician (PCP)",
        recommended_action: "Consult a doctor urgently for chest X-ray and antibiotic treatment."
    },
    {
        name: "Prostate cancer",
        keywords: "difficulty urinating (male), weak urine flow, blood in urine or semen, pelvic discomfort, erectile dysfunction",
        min_age: 50, max_age: 100, sex_constraint: "male",
        bmi_risk_keywords: "underweight",
        doctor_type: "Urologist or Oncologist",
        recommended_action: "Consult a Urologist for PSA blood test and prostate exam."
    },
    {
        name: "Rheumatoid arthritis (RA)",
        keywords: "swollen tender joints, joint stiffness (worse in morning), symmetric joint involvement (hands feet), chronic joint pain, fatigue",
        min_age: 20, max_age: 60, sex_constraint: "female",
        bmi_risk_keywords: "overweightl",
        doctor_type: "Rheumatologist",
        recommended_action: "Consult a Rheumatologist urgently for inflammatory markers and joint X-rays."
    },
    {
        name: "Sciatica",
        keywords: "pain shooting down leg, lower back pain, numbness tingling in foot or leg, buttock pain, pain worse when sitting",
        min_age: 30, max_age: 90, sex_constraint: "all",
        bmi_risk_keywords: "overweight,obese",
        doctor_type: "Orthopedic Surgeon or Physiotherapist",
        recommended_action: "Maintain light activity, avoid heavy lifting. Consult a specialist for imaging (MRI)."
    },
    {
        name: "Shingles (Herpes Zoster)",
        keywords: "painful rash on one side of body, rash follows a nerve pathway, blisters, burning tingling pain, fever",
        min_age: 50, max_age: 100, sex_constraint: "all",
        bmi_risk_keywords: "all",
        doctor_type: "Primary Care Physician (PCP) or Dermatologist",
        recommended_action: "Consult a doctor immediately (within 72 hours of rash onset) for antiviral medication."
    },
    {
        name: "Stroke (Cerebrovascular Accident - CVA)",
        keywords: "sudden weakness in face arm or leg (one side), facial droop, slurred speech, sudden severe headache, confusion, vision loss",
        min_age: 40, max_age: 100, sex_constraint: "all",
        bmi_risk_keywords: "overweight,obese",
        doctor_type: "Neurologist (CALL EMERGENCY SERVICES IMMEDIATELY.)",
        recommended_action: "**CALL EMERGENCY SERVICES IMMEDIATELY.** Remember FAST (Face, Arms, Speech, Time)."
    },
    {
        name: "Transient ischaemic attack (TIA)",
        keywords: "brief weakness in face arm or leg (one side), temporary slurred speech, symptoms resolve quickly (minutes-hours), 'mini-stroke'",
        min_age: 40, max_age: 100, sex_constraint: "all",
        bmi_risk_keywords: "overweight,obese",
        doctor_type: "Neurologist (SEEK EMERGENCY CARE)",
        recommended_action: "**SEEK EMERGENCY MEDICAL HELP IMMEDIATELY** to prevent a full stroke."
    },
    {
        name: "Ulcerative colitis (UC)",
        keywords: "bloody diarrhea, frequent urgent bowel movements, abdominal pain, fatigue, weight loss, inflammation of large intestine",
        min_age: 15, max_age: 50, sex_constraint: "all",
        bmi_risk_keywords: "all",
        doctor_type: "Gastroenterologist",
        recommended_action: "Consult a Gastroenterologist urgently for inflammatory marker blood tests and colonoscopy."
    },
  
    
    // --- END NEW GENERATED DISEASE DATA (D-Z SELECTION) ---
];

const doctorsDB = [
    // --- Original ---
    { name: "Dr. Alok Sarma", specialty: "Cardiologist", district: "Guwahati", contact: "9876543210" },
    
    { name: "Dr. Rupali Das", specialty: "Endocrinologist", district: "Guwahati", contact: "8877665544" },
    
    { name: "Dr. Pranab Kalita", specialty: "Gastroenterologist", district: "Guwahati", contact: "7000112233" },

    { name: "Dr. Rituraj Barman", specialty: "Orthopedic Surgeon", district: "Guwahati", contact: "9123456789" },
    { name: "Dr. Maya Devi", specialty: "Dermatologist", district: "Bongaigaon", contact: "9555111222" },
    { name: "Dr. Debojit Sen", specialty: "Pulmonologist", district: "Mangaldoi", contact: "8777666555" },
    { name: "Dr. Farzana Begum", specialty: "Neurologist", district: "Guwahati", contact: "7890123456" },
 
    { name: "Dr. Parul Hazarika", specialty: "Pediatrician", district: "Guwahati", contact: "9998887770" },
    { name: "Dr. Rahul Medhi", specialty: "Rheumatologist", district: "Guwahati", contact: "9012345678" },

    // --- Bongaigaon /z Lower Assam Doctors ---
    { name: "Dr. T Das", specialty: "Internal Medicine", district: "Bongaigaon", contact: "not found" },
    { name: "Dr. Vivek Dasgupta", specialty: "General Physician", district: "Bongaigaon", contact: "not found" },
    { name: "Dr. Nirdesh Tiwari", specialty: "General Medicine / Diabetology", district: "Bongaigaon", contact: "not found" },
    { name: "Dr. Atunu Basumatry", specialty: "Internal Medicine", district: "Bongaigaon", contact: "not found" },
    { name: "Dr. H. Adhikary", specialty: "General Medicine", district: "Bongaigaon", contact: "not found" },
    { name: "Dr. Krishna Ch. Narzary", specialty: "Cardiologist", district: "Bongaigaon", contact: "not found" },
    { name: "Dr. I. Bordoloi", specialty: "Neurosurgeon", district: "Bongaigaon", contact: "not found" },

{ name: " Dr. J. Hussain", specialty: "Emergency Physician", district: "Bongaigaon", contact: "not found" },
{ name: " Dr. J. Hussain", specialty: "Emergency Physician", district: "Bongaigaon", contact: "not found" },
{ name: "Dr. Vivek Dasgupta", specialty: "Emergency Physician", district: "Bongaigaon", contact: "not found" },
    { name: "Dr. S. Rabha", specialty: "Neurosurgeon", district: "Bongaigaon", contact: "not found" },
    { name: "Dr. Vivek Dasgupta", specialty: "primary care physician", district: "Bongaigaon", contact: "not found" },{ name: "Dr. Amimul Ahsan Hussain", specialty: "primary care physician", district: "Bongaigaon", contact: "not found" }, { name: "Dr. Vikash Agarwal", specialty: "Neurologist", district: "Bongaigaon", contact: "not found" },
    { name: "Dr. Sodagor Singha", specialty: "Orthopedic Surgeon", district: "Bongaigaon", contact: "not found" },
    { name: "Dr. Chandrika Devi", specialty: "Physiotherapist", district: "Bongaigaon", contact: "not found" },
    { name: "Dr. Kumud Pathak", specialty: "General Surgeon / Laparoscopic Surgeon", district: "Bongaigaon", contact: "not found" },
    { name: "Dr. Ziaul Haque Ahmed", specialty: "Dermatologist", district: "Bongaigaon", contact: "not found" },
    { name: "Dr. A.D. Sharma", specialty: "Dermatologist", district: "Bongaigaon", contact: "not found" },
    { name: "Dr. Chinmoy Dutta", specialty: "Psychiatrist", district: "Bongaigaon", contact: "not found" },
    { name: "Dr. Hoque", specialty: "ENT Specialist", district: "Bongaigaon", contact: "not found" },
    { name: "Dr. Diganta Choudhury", specialty: "ENT Specialist", district: "Bongaigaon", contact: "not found" },
    { name: "Dr. Rezaul Haque", specialty: "ENT Surgeon", district: "Bongaigaon", contact: "not found" },
    { name: "Dr. Gautam Kumar Das", specialty: "Gynecologist", district: "Bongaigaon", contact: "not found" },
    { name: "Dr. Saikia Sahidul", specialty: "General Physician", district: "New Bongaigaon", contact: "not found" },
    { name: "Dr. Saikia Aruna", specialty: "General Physician", district: "Bongaigaon", contact: "not found" },
    { name: "Dr. Anjan Saikia", specialty: "Gastroenterologist", district: "Bongaigaon", contact: "not found" },
    { name: "Dr. Mahendra Nath Saikia", specialty: "General Surgeon", district: "Bongaigaon", contact: "not found" },

    // --- Mangaldoi Doctors ---
    { name: "Dr. Kaustav Saharia", specialty: "Orthopedic Surgeon", district: "Mangaldoi", contact: "not found" },
    { name: "Dr. Iftikar Hussain", specialty: "Psychiatry / Neuro-Psychiatry", district: "Mangaldoi", contact: "not found" },
    { name: "Dr. Hemanta Deka", specialty: "ENT Specialist", district: "Mangaldoi", contact: "not found" },
    { name: "Dr. D K Nath", specialty: "Consultant Physician", district: "Mangaldoi", contact: "not found" },
    { name: "Dr. Rafiqul Ansari", specialty: "Consultant Physician", district: "Mangaldoi", contact: "not found" },
    { name: "Dr. S C Das", specialty: "Consultant Physician", district: "Mangaldoi", contact: "not found" },
    { name: "Dr. Nirmal Chandra Sarma", specialty: "Consultant Physician", district: "Mangaldoi", contact: "not found" },
    { name: "Dr. Dharmendra Sahariah", specialty: "Consultant Physician", district: "Mangaldoi", contact: "not found" },
    { name: "Dr. Dipjyoti Rabha", specialty: "Consultant Physician", district: "Mangaldoi", contact: "not found" },
    { name: "Dr. Prasanta Goswami", specialty: "General Physician", district: "Mangaldoi", contact: "not found" },
    { name: "Dr. Madhusmita Khakholary", specialty: "MD Medicine (Physician)", district: "Mangaldoi", contact: "not found" },
    { name: "Dr. Ijajul Haque", specialty: "Pediatrician", district: "Mangaldoi", contact: "not found" },
    { name: "Dr. Khanin Das", specialty: "Pediatrician", district: "Mangaldoi", contact: "not found" },
    { name: "Dr. Sachindra Das", specialty: "Diabetologist", district: "Mangaldoi", contact: "not found" },
    { name: "Dr. Preeti Phukan", specialty: "Dermatologist", district: "Mangaldoi", contact: "not found" },
    { name: "Dr. Dip Jyoti Baruah", specialty: "Dentist", district: "Mangaldoi", contact: "not found" },
    { name: "Dr. Apurba C Saharia", specialty: "Dentist", district: "Mangaldoi", contact: "not found" },

    // --- Added Guwahati Doctors ---
    { name: "Dr. Neil Bardoloi", specialty: "Cardiologist", district: "Guwahati", contact: "not found" },
    { name: "Dr. Amitava Misra", specialty: "Cardiologist", district: "Guwahati", contact: "not found" },
    { name: "Dr. Chandan Modak", specialty: "Cardiologist", district: "Guwahati", contact: "not found" },
    { name: "Dr. Pranab Jyoti Bhattacharyya", specialty: "Cardiologist", district: "Guwahati", contact: "not found" },
    { name: "Dr. Mrinal Bhuyan", specialty: "Neurosurgeon", district: "Guwahati", contact: "not found" },
    { name: "Dr. Joy Narayan Chakraborty", specialty: "Urologist", district: "Guwahati", contact: "not found" },
    { name: "Dr. Brojen Barman", specialty: "Urologist", district: "Guwahati", contact: "not found" },
    { name: "Dr. Debanga Sarma", specialty: "Urologist", district: "Guwahati", contact: "not found" },
    { name: "Dr. Bandi K Sangma", specialty: "Pulmonologist", district: "Guwahati", contact: "not found" },
    { name: "Dr. Kuntilraj Borgohain", specialty: "Pulmonologist", district: "Guwahati", contact: "not found" },
    { name: "Dr. Smitakshi Medhi", specialty: "Pulmonologist", district: "Guwahati", contact: "not found" },
    { name: "Dr. Dipankar Das", specialty: "Gastroenterologist", district: "Guwahati", contact: "not found" },
    { name: "Apollo Excelcare Endocrinology", specialty: "Endocrinology", district: "Guwahati", contact: "not found" },
    { name: "Dr. Saptarshi Mahanta", specialty: "Diabetologist / Internal Medicine", district: "Guwahati", contact: "not found" },
    { name: "Dr. Indrajit Das", specialty: "Rheumatologist", district: "Guwahati", contact: "not found" },
    { name: "Dr. Vidhi Bhatia", specialty: "Dermatologist", district: "Guwahati", contact: "not found" },
    { name: "Dr. Arun Agarwal", specialty: "Dermatologist", district: "Guwahati", contact: "not found" },
    { name: "Dr. Sanjay Singh", specialty: "Psychiatrist", district: "Guwahati", contact: "not found" },
    { name: "Dr. Abhay Agarwal", specialty: "Orthopedic Surgeon", district: "Guwahati", contact: "not found" },
    { name: "Dr. Prabal Sharma", specialty: "Orthopedic Surgeon", district: "Guwahati", contact: "not found" },
    { name: "Netram Eye Care & Eyewear", specialty: "Ophthalmology", district: "Guwahati", contact: "not found" }
];


// --- BMI Calculation Function ---
function calculateBMI() {
    const weight = parseFloat(document.getElementById('weightInput').value);
    const heightCm = parseFloat(document.getElementById('heightInput').value);
    const bmiResultDiv = document.getElementById('bmiResult');

    if (isNaN(weight) || isNaN(heightCm) || weight <= 0 || heightCm <= 0) {
        bmiResultDiv.innerHTML = `<p class='danger-text'><i class="fas fa-exclamation-triangle"></i> Please enter valid weight and height.</p>`;
        globalBmiRisk = '';
        return;
    }

    const heightM = heightCm / 100;
    const bmi = weight / (heightM * heightM);

    let riskCategory = '';
    let message = '';
    let colorClass = 'success-text';

    if (bmi < 18.5) {
        riskCategory = 'underweight';
        message = `BMI: ${bmi.toFixed(1)}. Risk: **UNDERWEIGHT**.`;
        colorClass = 'warning-text';
    } else if (bmi >= 18.5 && bmi < 25) {
        riskCategory = 'normal';
        message = `BMI: ${bmi.toFixed(1)}. Risk: **NORMAL**.`;
        colorClass = 'success-text';
    } else if (bmi >= 25 && bmi < 30) {
        riskCategory = 'overweight';
        message = `BMI: ${bmi.toFixed(1)}. Risk: **OVERWEIGHT**.`;
        colorClass = 'warning-text';
    } else {
        riskCategory = 'obese';
        message = `BMI: ${bmi.toFixed(1)}. Risk: **OBESE**.`;
        colorClass = 'danger-text';
    }

    globalBmiRisk = riskCategory;
    bmiResultDiv.innerHTML = `<p class='${colorClass}'><i class="fas fa-check-circle"></i> ${message} BMI risk factor (${riskCategory.toUpperCase()}) added to symptom check!</p>`;
}

// --- Disease Matching Logic ---
function checkDisease() {
    const symptomsInput = document.getElementById('symptomsInput').value.toLowerCase().trim();
    const age = parseInt(document.getElementById('ageInput').value);
    const sex = document.getElementById('sexSelect').value.toLowerCase();
    const resultDiv = document.getElementById('result');
    const specialtyInput = document.getElementById('specialtyInput');

    if (!symptomsInput) {
        addMessageToChat(resultDiv, "Please enter your symptoms to run the checker.", "system");
        specialtyInput.value = "Please enter symptoms.";
        recommendedSpecialty = '';
        return;
    }

    const userSymptoms = symptomsInput.split(/,\s*| /).filter(s => s.length > 2); // Split by comma or space, filter short words

    let bestMatch = null;
    let maxMatchCount = 0;

    for (const disease of diseasesDB) {
        let matchCount = 0;
        const diseaseKeywords = disease.keywords.split(/,\s*/);
        
        // 1. Symptom Keyword Matching
        for (const userSymptom of userSymptoms) {
            if (diseaseKeywords.includes(userSymptom)) {
                matchCount++;
            }
        }

        // Apply penalty for BMI mismatch, but not fatal
        let bmiPenalty = 0;
        if (disease.bmi_risk_keywords && globalBmiRisk !== 'normal') {
            const diseaseBmiRisks = disease.bmi_risk_keywords.split(/,\s*/);
            if (diseaseBmiRisks.length > 0 && !diseaseBmiRisks.includes(globalBmiRisk)) {
                bmiPenalty = 0.5; // Slight penalty if BMI is a factor for the disease but doesn't match the user's risk
            }
        }
        
        // Apply bonus for strong BMI match
        let bmiBonus = 0;
        if (disease.bmi_risk_keywords && globalBmiRisk !== 'normal') {
            const diseaseBmiRisks = disease.bmi_risk_keywords.split(/,\s*/);
            if (diseaseBmiRisks.includes(globalBmiRisk)) {
                bmiBonus = 1.0; // Strong bonus if BMI is a factor and matches
            }
        }


        // 2. Age Range Check (Must Pass)
        if (age < disease.min_age || age > disease.max_age) {
            continue; // Skip if age doesn't match the disease range
        }

        // 3. Sex Constraint Check (Must Pass)
        if (disease.sex_constraint !== 'all' && disease.sex_constraint !== sex) {
            continue; // Skip if sex doesn't match
        }
        
        // Apply final match count after bonuses/penalties
        const finalMatchCount = matchCount + bmiBonus - bmiPenalty;
        
        if (finalMatchCount > maxMatchCount) {
            maxMatchCount = finalMatchCount;
            bestMatch = disease;
        }
    }

    // Displaying Results
    addMessageToChat(resultDiv, symptomsInput, "user");

    if (bestMatch && maxMatchCount > 0) {
        const percentageMatch = Math.round((maxMatchCount / userSymptoms.length) * 100);

        if (percentageMatch >= 30 || maxMatchCount >= 2) {
            const matchColor = percentageMatch >= 50 ? 'danger-text' : 'warning-text';
            
            let systemMessage = `Based on your age (${age}), sex (${sex.toUpperCase()}), BMI risk (${globalBmiRisk.toUpperCase()}), and symptoms, the most probable condition is:`;
            systemMessage += `<br><br><strong><i class="fas fa-diagnoses"></i> Condition: ${bestMatch.name}</strong>`;
            systemMessage += `<br><strong><i class="fas fa-percentage"></i> Match Confidence: ${percentageMatch}%</strong>`;
            systemMessage += `<br><strong><i class="fas fa-user-md"></i> Recommended Specialist: ${bestMatch.doctor_type}</strong>`;
            systemMessage += `<br><br><span class="${matchColor}"><i class="fas fa-exclamation-circle"></i> **Recommended Action:** ${bestMatch.recommended_action}</span>`;
            
            addMessageToChat(resultDiv, systemMessage, "system");
            recommendedSpecialty = extractSpecialty(bestMatch.doctor_type);
            specialtyInput.value = recommendedSpecialty;
        } else {
            // General or low match
            recommendedSpecialty = "Primary Care Physician (PCP)";
            specialtyInput.value = recommendedSpecialty;
            addMessageToChat(resultDiv, `The symptoms match ${maxMatchCount} keywords. The matching confidence is too low or the symptoms are general. Please consult a **Primary Care Physician (PCP)** for a full checkup.`, "system");
        }
    } else {
        // No match found
        recommendedSpecialty = "Primary Care Physician (PCP)";
        specialtyInput.value = recommendedSpecialty;
        addMessageToChat(resultDiv, `No specific condition found matching the age, sex, BMI, and symptom profile. Please consult a **Primary Care Physician (PCP)** for a basic checkup. If symptoms are severe, seek emergency care.`, "system");
    }
}

// Helper function to extract the specialty name from the doctor_type string
function extractSpecialty(doctorType) {
    if (doctorType.includes('CALL EMERGENCY SERVICES IMMEDIATELY')) {
        return "Emergency Physician";
    }
    // Grabs the first specialty listed, ignoring extra text in parentheses
    return doctorType.split(' (')[0].split(' or ')[0].trim();
}


// --- Doctor Finding Logic ---
function findDoctors() {
    const district = document.getElementById('districtSelect').value;
    const doctorResultDiv = document.getElementById('doctorResult');

    if (!recommendedSpecialty || recommendedSpecialty.includes("Please enter symptoms")) {
        doctorResultDiv.innerHTML = `<p class='warning-text'><i class="fas fa-exclamation-triangle"></i> Please run the Symptom Checker (Step 2) first to get a recommended specialty.</p>`;
        return;
    }

    if (!district) {
        doctorResultDiv.innerHTML = `<p class='warning-text'><i class="fas fa-exclamation-triangle"></i> Please select a district to find doctors near you.</p>`;
        return;
    }

    // Handle Emergency Specialty explicitly, as it's not a searchable doctor type
    let searchSpecialty = recommendedSpecialty;
    if (searchSpecialty.includes("CALL EMERGENCY SERVICES IMMEDIATELY") || searchSpecialty === "Emergency Physician") {
        doctorResultDiv.innerHTML = `
            <h4><i class="fas fa-exclamation-triangle"></i> EMERGENCY WARNING</h4>
            <div class="doctor-card danger-text">
                <p><strong>The recommended action is to call EMERGENCY SERVICES IMMEDIATELY.</strong></p>
                <p>We cannot provide a simple list of doctors for this level of emergency.</p>
                <p><strong>Action:</strong> Rush to the nearest hospital Emergency Room (ER).</p>
            </div>`;
        return;
    }
    
    // Normalize specialty for searching (e.g., "Cardiologist (CALL...)" becomes "Cardiologist")
    searchSpecialty = searchSpecialty.split(' (')[0]; 
    
    // Normalize specialties with "or" in them for broader search (e.g., "Urologist or PCP" searches for Urologist)
    if (searchSpecialty.includes(" or ")) {
        searchSpecialty = searchSpecialty.split(' or ')[0].trim();
    }


    const matchedDoctors = doctorsDB.filter(doctor => 
        doctor.specialty.toLowerCase().includes(searchSpecialty.toLowerCase()) && 
        doctor.district === district
    );

    let html = `<h4><i class="fas fa-users"></i> Recommended ${searchSpecialty} in ${district}</h4>`;

    if (matchedDoctors.length > 0) {
        matchedDoctors.forEach(doctor => {
            html += `
                <div class="doctor-card">
                    <p><strong><i class="fas fa-user-md"></i> Name:</strong> ${doctor.name}</p>
                    <p><strong><i class="fas fa-briefcase-medical"></i> Specialty:</strong> ${doctor.specialty}</p>
                    <p><strong><i class="fas fa-phone"></i> Contact:</strong> ${doctor.contact}</p>
                </div>
            `;
        });
    } else {
        html += `
            <div class="doctor-card warning-text">
                <p>No specific **${searchSpecialty}** doctors found in **${district}** in our database.</p>
                <p>Please search online or contact the nearest **General Hospital** in your district.</p>
            </div>
        `;
    }

    doctorResultDiv.innerHTML = html;
    
    // Scroll to the doctor results for better UX
    doctorResultDiv.scrollIntoView({ behavior: 'smooth' });
}

// --- Chat Box UI Helper ---
function addMessageToChat(chatBoxElement, message, type) {
    const messageDiv = document.createElement('div');
    const timestamp = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    
    let timeStampSpan = type === 'user' 
        ? `<span class="user-time-stamp">${timestamp}</span>`
        : `<span class="system-time-stamp">${timestamp}</span>`;
    
    messageDiv.classList.add('chat-message');
    messageDiv.classList.add(type + '-message');
    messageDiv.innerHTML = `<p>${message}</p>${timeStampSpan}`;
    
    // Append the new message, ensuring the initial message stays at the top if necessary
    chatBoxElement.appendChild(messageDiv);
    
    // Auto-scroll to the bottom of the chat box
    chatBoxElement.scrollTop = chatBoxElement.scrollHeight;
}


// --- UI/Theming Functions ---
function toggleTheme() {
    const body = document.body;
    const toggleButton = document.getElementById('themeToggle');
    if (body.classList.contains('dark-theme')) {
        body.classList.remove('dark-theme');
        body.classList.add('light-theme');
        toggleButton.innerHTML = '<i class="fas fa-moon"></i> Dark Mode';
    } else {
        body.classList.remove('light-theme');
        body.classList.add('dark-theme');
        toggleButton.innerHTML = '<i class="fas fa-sun"></i> Light Mode';
    }
}

function navigateTo(pageId) {
    document.querySelectorAll('.page-section').forEach(section => {
        section.classList.remove('active');
    });
    document.getElementById(pageId).classList.add('active');

    document.querySelectorAll('nav a').forEach(link => {
        link.classList.remove('active-nav');
    });
    document.querySelector(`nav a[href="#${pageId.replace('-page', '')}"]`).classList.add('active-nav');
}

function sendFeedback() {
    alert("Thank you for your feedback! ");
}


// --- Initialization ---
function initApp() {
    // Set initial active navigation link
    document.querySelector('nav a[href="#home"]').classList.add('active-nav');
    // Ensure initial BMI is calculated and risk is set
    calculateBMI(); 
}

// Wait for the DOM to be fully loaded
document.addEventListener("DOMContentLoaded", () => {
    if (!sessionStorage.getItem("welcomeShown")) {
        sessionStorage.setItem("welcomeShown", "yes");
    } else {
        document.getElementById("welcome-screen").style.display = "none";
    }
});











let selectedRating = 0;

// Star hover and select effect
const stars = document.querySelectorAll('.rating-card .star');
stars.forEach(star => {
    star.addEventListener('mouseover', () => {
        stars.forEach(s => s.classList.remove('hover'));
        star.classList.add('hover');
    });
    star.addEventListener('mouseout', () => {
        stars.forEach(s => s.classList.remove('hover'));
    });
    star.addEventListener('click', () => {
        selectedRating = parseInt(star.dataset.value);
        stars.forEach(s => s.classList.remove('selected'));
        for(let i=0; i<selectedRating; i++) {
            stars[i].classList.add('selected');
        }
    });
});

// Submit rating and unlock premium
document.getElementById('submitRating').addEventListener('click', () => {
    if(selectedRating === 0) {
        alert("Please select a rating to unlock Premium!");
        return;
    }
    localStorage.setItem('premiumUnlocked', 'true');
    document.getElementById('premiumAccess').classList.remove('hidden');
    alert(`Thanks for rating ${selectedRating}★! Premium features are now unlocked.`);
});

// Function to go to Premium Features page
function goToPremium() {
    // You can either navigate to premium.html
    window.location.href = 'premium.html';
    // OR show premium features inline on the same page
    // showPremiumFeatures();
}

// Optional: auto-show if already unlocked
window.addEventListener('load', () => {
    if(localStorage.getItem('premiumUnlocked') === 'true') {
        document.getElementById('premiumAccess').classList.remove('hidden');
    }
});































// PROFILE DASHBOARD TOGGLE
const profileBtn = document.getElementById("profile-nav-btn");
const profileSection = document.getElementById("profile-section");

profileBtn.addEventListener("click", () => {
    profileSection.classList.toggle("hidden");
});

// PROFILE FIELDS
const nameInput = document.getElementById("profile-name");
const ageInput = document.getElementById("profile-age");
const dobInput = document.getElementById("profile-dob");
const heightInput = document.getElementById("profile-height");
const weightInput = document.getElementById("profile-weight");
const profileImg = document.getElementById("profile-photo-preview");
const uploadInput = document.getElementById("profile-photo-upload");
const saveBtn = document.getElementById("save-profile-btn");

// LOAD PROFILE
window.addEventListener("DOMContentLoaded", () => {
    const saved = localStorage.getItem("profileData");
    if (saved) {
        const p = JSON.parse(saved);
        nameInput.value = p.name || "";
        ageInput.value = p.age || "";
        dobInput.value = p.dob || "";
        heightInput.value = p.height || "";
        weightInput.value = p.weight || "";
        if (p.photo) profileImg.src = p.photo;
        calculateBMI();
        checkBirthday();
    }
});

// UPLOAD PHOTO
uploadInput.addEventListener("change", function() {
    const file = this.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function(e) {
        profileImg.src = e.target.result;
        localStorage.setItem("profilePhoto", e.target.result);
    };
    reader.readAsDataURL(file);
});

// SAVE PROFILE
saveBtn.addEventListener("click", () => {
    const profileData = {
        name: nameInput.value,
        age: ageInput.value,
        dob: dobInput.value,
        height: heightInput.value,
        weight: weightInput.value,
        photo: localStorage.getItem("profilePhoto") || ""
    };
    localStorage.setItem("profileData", JSON.stringify(profileData));
    calculateBMI();
    checkBirthday();
    alert("Profile saved!");
});

// BMI CALCULATION
function calculateBMI() {
    const h = parseFloat(heightInput.value);
    const w = parseFloat(weightInput.value);
    if (!h || !w) return;
    const bmi = w / ((h/100) ** 2);
    document.getElementById("bmi-value").innerText = bmi.toFixed(1);
    let status = "";
    if (bmi < 18.5) status = "Underweight";
    else if (bmi < 24.9) status = "Healthy";
    else if (bmi < 29.9) status = "Overweight";
    else status = "Obese";
    document.getElementById("bmi-status").innerText = status;
}

// BIRTHDAY ALERT
function checkBirthday() {
    const saved = localStorage.getItem("profileData");
    if (!saved) return;
    const p = JSON.parse(saved);
    if (!p.dob) return;
    const today = new Date();
    const dob = new Date(p.dob);
    if (today.getDate() === dob.getDate() && today.getMonth() === dob.getMonth()) {
        alert(`🎉 Happy Birthday, ${p.name}! 🎂`);
    }
}








function calculateBMI() {
    const weight = parseFloat(document.getElementById('weightInput').value);
    const height = parseFloat(document.getElementById('heightInput').value) / 100; // cm to meters
    if (!weight || !height) return alert("Please enter valid weight and height.");

    const bmi = weight / (height * height);
    let risk = '';
    if (bmi < 18.5) risk = "Underweight";
    else if (bmi < 25) risk = "Normal weight";
    else if (bmi < 30) risk = "Overweight";
    else risk = "Obese";

    document.getElementById('bmiResult').innerHTML = `
        <p class="bmi-link-message">
            <i class="fas fa-check-circle"></i> BMI: ${bmi.toFixed(1)} (${risk})
        </p>
    `;
}



// --- Initialize localStorage values ---
let totalTime = parseInt(localStorage.getItem('totalTime')) || 0; // in seconds
let symptoCoins = parseInt(localStorage.getItem('symptoCoins')) || 0;
let dailyStreak = parseInt(localStorage.getItem('dailyStreak')) || 0;
let lastVisit = localStorage.getItem('lastVisit'); // YYYY-MM-DD

// --- Update panel display ---
function updatePanelDisplay(){
    document.getElementById('panelCoins').innerText = symptoCoins;
    document.getElementById('panelStreak').innerText = dailyStreak;
}
updatePanelDisplay();

// --- Track time for coins (1 coin per minute) ---
let sessionStart = Date.now();

function trackTime(){
    let now = Date.now();
    let elapsedSeconds = Math.floor((now - sessionStart)/1000);
    totalTime += elapsedSeconds;
    sessionStart = now;

    // 1 coin per 60 seconds
    let newCoins = Math.floor(totalTime / 60);
    if(newCoins > symptoCoins){
        symptoCoins = newCoins;
    }

    // Save
    localStorage.setItem('totalTime', totalTime);
    localStorage.setItem('symptoCoins', symptoCoins);

    updatePanelDisplay();
}

setInterval(trackTime, 5000);
window.addEventListener('beforeunload', trackTime);

// --- Daily streak logic ---
function checkDailyStreak(){
    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

    if(lastVisit === today){
        return; // already visited today
    } else if(lastVisit === yesterday){
        dailyStreak += 1;
    } else {
        dailyStreak = 1; // reset if a day missed
    }

    localStorage.setItem('lastVisit', today);
    localStorage.setItem('dailyStreak', dailyStreak);

    updatePanelDisplay();
}
checkDailyStreak();

// --- Show/hide panel ---
const panel = document.getElementById('symptoPanel');
document.getElementById('symptoNavBtn').addEventListener('click', ()=>{
    updatePanelDisplay();
    panel.style.display = 'block';
});
document.getElementById('closeSymptoPanel').addEventListener('click', ()=>{
    panel.style.display = 'none';
});











