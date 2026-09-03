// ── Additional Medication Knowledge ───────────────────────────────────────
import type { KnowledgeEntry } from "./medical-knowledge";

export const EXTRA_MEDICATION_KNOWLEDGE: KnowledgeEntry[] = [
  {
    keywords: ["cetirizine", "zyrtec", "zyntac", "allergy medicine", "antihistamine", "levocetirizine", "xyzal"],
    response: {
      en: "**Cetirizine / Levocetirizine (Antihistamine):**\n\n💊 **Brand names**: Cetiriz (Zyrtec), Zynocet, Levocet, Alerid, Xyzal\n💊 **Use**: Allergic rhinitis, urticaria (hives), itching, sneezing, runny nose\n💊 **Dose**: Cetirizine 10mg once daily | Levocetirizine 5mg once daily\n💊 **How to take**: Can take with or without food\n\n**Key points:**\n⏰ Take at same time daily (preferably bedtime if drowsy)\n💊 Non-drowsy formula available (Levocetirizine less sedating)\n⚠️ May cause mild drowsiness — avoid driving if affected\n⚠️ Safe for long-term use under medical guidance\n⚠️ Safe in pregnancy (consult doctor first)\n⚠️ Available as syrup for children\n\n**Other antihistamines:**\n💊 Loratadine (Claritin) — truly non-drowsy\n💊 Fexofenadine (Allegra) — non-drowsy, less effective for itching\n💊 Diphenhydramine (Benadryl) — very sedating, short-term use\n\n⚠️ *Consult doctor if symptoms persist more than 2 weeks.*",
    },
  },
  {
    keywords: ["azithromycin", "azee", "azithral", "z-pack", "zithromax"],
    response: {
      en: "**Azithromycin (Antibiotic):**\n\n💊 **Brand names**: Azee, Azithral, Zithromax, Z-Pak\n💊 **Use**: Respiratory infections, throat infections, ear infections, skin infections\n💊 **Dose**: 500mg day 1, then 250mg daily for 4 more days (Z-Pak)\n💊 **How to take**: Can take with or without food\n\n**Important:**\n💊 Complete the full course even if you feel better\n💊 Available as 250mg, 500mg tablets and dry suspension\n💊 Longer half-life — stays in body for days after last dose\n⚠️ Don't take with antacids (reduce absorption)\n⚠️ Can cause diarrhea, nausea\n⚠️ Avoid in severe liver disease\n⚠️ Inform doctor if you're on blood thinners (warfarin)\n⚠️ Can prolong QT interval — caution with heart conditions\n\n**Common infections treated:**\n🫁 Pneumonia, bronchitis\n🗣️ Pharyngitis, tonsillitis\n👂 Otitis media (ear infection)\n🦠 Chlamydia, gonorrhea (single dose)\n\n⚠️ *Antibiotic — prescription required. Never self-medicate.*",
    },
  },
  {
    keywords: ["atorvastatin", "lipitor", "statin", "cholesterol", "lipid", "rosuvastatin", "crestor"],
    response: {
      en: "**Statins (Cholesterol Medication):**\n\n💊 **Common statins**:\n   - Atorvastatin (Lipitor, Atorva) — most commonly prescribed\n   - Rosuvastatin (Crestor, Rosuvast) — more potent\n   - Simvastatin (Zocor, Simvast)\n💊 **Use**: High cholesterol, cardiovascular risk reduction\n💊 **Dose**: Varies (Atorvastatin 10-80mg, Rosuvastatin 5-40mg)\n💊 **How to take**: Evening (cholesterol synthesis peaks at night)\n\n**Important:**\n⏰ Take at same time daily, preferably evening\n💊 Monitor liver function (LFT) before starting and periodically\n⚠️ Common side effects: Muscle pain, weakness (rare)\n⚠️ Avoid grapefruit juice (interacts with atorvastatin)\n⚠️ Avoid in pregnancy/breastfeeding\n⚠️ Report unusual muscle pain immediately\n\n**Lifestyle alongside medication:**\n🥗 Low saturated fat, high fiber diet\n🏃 Regular exercise (30 min/day)\n🚫 Avoid trans fats, processed foods\n🥜 Nuts, oats, fatty fish help lower cholesterol\n\n⚠️ *Cholesterol management requires regular monitoring. Follow your cardiologist's advice.*",
    },
  },
  {
    keywords: ["amlodipine", "norvasc", "blood pressure medicine", "antihypertensive", "losartan", "telmisartan", "valsartan"],
    response: {
      en: "**Blood Pressure Medications:**\n\n**Calcium Channel Blockers:**\n💊 Amlodipine (Amlodac, Norvasc) — 5-10mg once daily\n💊 **Use**: Hypertension, angina\n💊 **Side effects**: Ankle swelling, headache, flushing\n\n**ARBs (Angiotensin Receptor Blockers):**\n💊 Losartan (Losar, Cozaar) — 50-100mg daily\n💊 Telmisartan (Telsartan, Micardis) — 40-80mg daily\n💊 Valsartan (Valsacor, Diovan) — 80-320mg daily\n💊 **Use**: Hypertension, kidney protection in diabetes\n\n**ACE Inhibitors:**\n💊 Enalapril (Envas) — 5-40mg daily\n💊 Ramipril (Cardace) — 2.5-10mg daily\n💊 **Side effects**: Dry cough (common), hyperkalemia\n⚠️ Avoid in pregnancy (teratogenic)\n\n**Beta Blockers:**\n💊 Metoprolol (Betaloc) — 25-200mg daily\n💊 Atenolol (Aten) — 25-100mg daily\n💊 **Use**: Hypertension, angina, heart failure\n⚠️ Don't stop suddenly — taper gradually\n\n**General BP Management:**\n⏰ Take medication at same time daily\n🩺 Monitor BP at home (morning & evening)\n🥗 Low salt diet (<5g/day)\n🏃 Regular exercise\n⚖️ Maintain healthy weight\n🚫 Limit alcohol, quit smoking\n\n⚠️ *Never stop BP medication without doctor's advice. Regular monitoring essential.*",
    },
  },
  {
    keywords: ["insulin", "blood sugar injection", "diabetes injection", "gliclazide", "glimepiride", "sulfonylurea", "sitagliptin", "januvia"],
    response: {
      en: "**Other Diabetes Medications:**\n\n**Sulfonylureas (insulin secretagogues):**\n💊 Gliclazide (Glyclad, Diamicron) — 40-80mg daily\n💊 Glimepiride (Amaryl, Glime) — 1-4mg daily\n💊 Glipizide (Glycizin) — 5-10mg before meals\n⚠️ Risk: Hypoglycemia (low blood sugar) — carry sugar/glucose\n\n**DPP-4 Inhibitors:**\n💊 Sitagliptin (Januvia) — 100mg daily\n💊 Linagliptin (Tradjenta) — 5mg daily\n💊 Low hypoglycemia risk, weight-neutral\n\n**SGLT2 Inhibitors:**\n💊 Empagliflozin (Jardiance) — 10-25mg daily\n💊 Dapagliflozin (Forxiga) — 5-10mg daily\n💊 Also protect heart and kidneys\n⚠️ Risk: UTI, genital yeast infections\n\n**Insulin:**\n💉 Types: Rapid-acting, Short-acting, Intermediate, Long-acting\n💉 Dose varies greatly — endocrinologist prescribes\n💉 Rotate injection sites (abdomen, thigh, arm)\n💉 Store unopened insulin in fridge; opened at room temp (28 days)\n⚠️ Never skip meals on insulin — hypoglycemia risk\n\n**Hypoglycemia Signs & Treatment:**\n🚨 Sweating, shivering, confusion, dizziness\n🍬 Quick fix: 3-4 glucose tablets OR 150ml juice\n🍬 Wait 15 min, recheck. Repeat if needed.\n\n⚠️ *Diabetes management is individualized. Always follow your doctor's plan.*",
    },
  },
  {
    keywords: ["dolo", "paracetamol 650", "crocin 500", "fever tablet", "body pain tablet"],
    response: {
      en: "**Common OTC Fever & Pain Medicines:**\n\n**Dolo 650:**\n💊 Paracetamol 650mg — most prescribed fever tablet in India\n💊 Use: Fever, headache, body ache, toothache\n💊 Dose: 1 tablet every 6-8 hours (max 4/day)\n\n**Crocin 500:**\n💊 Paracetamol 500mg — milder dose\n💊 Good for children and mild fever\n\n**Crocin Advance:**\n💊 Paracetamol 500mg (faster absorption)\n\n**Combiflam:**\n💊 Ibuprofen 400mg + Paracetamol 325mg\n💊 Better for pain with inflammation (toothache, period pain)\n⚠️ Don't take with other NSAIDs\n\n**Brufen:**\n💊 Ibuprofen 400/600mg\n💊 Anti-inflammatory — better for joint/muscle pain\n⚠️ Always take with food\n\n**Decaf (Paracetamol + Caffeine):**\n💊 Faster headache relief\n\n**Key rules:**\n⚠️ Never mix multiple paracetamol-containing medicines\n⚠️ Max paracetamol: 4g/day (about 6 tablets of 650mg)\n⚠️ Avoid alcohol with paracetamol (liver damage risk)\n⚠️ Take painkillers only when needed, not regularly\n\n⚠️ *OTC medicines are safe when used correctly. Seek medical advice for persistent symptoms.*",
    },
  },
  {
    keywords: ["montair", "montelukast", "asthma medicine", "asthma tablet", "leukotriene"],
    response: {
      en: "**Montelukast (Asthma/Allergy Medicine):**\n\n💊 **Brand names**: Montair, Montair LC, Singulair, Montecore\n💊 **Use**: Asthma prevention, allergic rhinitis, exercise-induced bronchospasm\n💊 **Dose**: 10mg once daily (adults), 4-5mg (children)\n💊 **How to take**: Evening (preferably before bed)\n\n**Key points:**\n💊 NOT a rescue inhaler — takes days to weeks for full effect\n💊 Use alongside inhalers, not instead of them\n💊 Available as 4mg, 5mg, 10mg tablets and granules\n💊 Montair LC = Montelukast + Levocetirizine (combo for allergies)\n\n**Important:**\n⚠️ Don't stop suddenly if on regular treatment\n⚠️ Rare: mood changes, depression, suicidal thoughts (report immediately)\n⚠️ Take regularly for best results — not as-needed\n⚠️ Good for patients who can't tolerate inhaled steroids\n\n**Asthma Treatment Steps:**\n1️⃣ Reliever (Salbutamol inhaler) — as needed\n2️⃣ Low-dose inhaled steroid — daily\n3️⃣ Add Montelukast or LABA — if not controlled\n4️⃣ Medium/high-dose steroid — specialist management\n\n⚠️ *Asthma requires long-term management. Don't stop medications without doctor's advice.*",
    },
  },
  {
    keywords: ["pantoprazole", "pantocid", "raberazole", "rabeprazole", "esomeprazole", "razo"],
    response: {
      en: "**PPI Medications (Detailed):**\n\n**Pantoprazole (Pantocid, Pantodac):**\n💊 40mg once daily, 30 min before breakfast\n💊 Most commonly prescribed PPI in India\n💊 Fewer drug interactions than Omeprazole\n\n**Rabeprazole (Razo, Rabicip):**\n💊 20mg once daily before breakfast\n💊 Faster onset than Omeprazole\n💊 Available as Dexrabeprazole (Razor D) — more potent\n\n**Esomeprazole (Razo, Nexium):**\n💊 40mg once daily\n💊 S-isomer of Omeprazole — better bioavailability\n💊 Available as Nexium RD (20mg) for mild symptoms\n\n**Omeprazole (Omez, Omecap):**\n💊 20-40mg once daily before breakfast\n💊 Most studied PPI — extensive safety data\n💊 Available as Omez DSR (with Domperidone) for reflux with nausea\n\n**When to take PPIs:**\n⏰ 30 minutes before first meal — most effective\n💊 Best taken on empty stomach\n💊 Duration: 2-8 weeks (acute), may be longer for Barrett's/esophagitis\n\n**Combination medicines:**\n💊 Omez DSR = Omeprazole + Domperidone\n💊 Pan DSR = Pantoprazole + Domperidone\n💊 Rabicip D = Rabeprazole + Domperidone\n(Domperidone helps with nausea and accelerates gastric emptying)\n\n⚠️ *Long-term PPI use should be supervised by doctor. Don't self-medicate beyond 2 weeks.*",
    },
  },
  {
    keywords: ["seroflo", "salbutamol", "inhaler", "nebulizer", "ventolin", "respules", "asthma inhaler", "budecort"],
    response: {
      en: "**Inhalers & Respiratory Medicines:**\n\n**Reliever (Rescue) Inhalers:**\n💊 Salbutamol (Ventolin, Asthalin) — opens airways in minutes\n💊 Use: Acute breathlessness, wheezing, before exercise\n💊 2 puffs as needed, wait 4 min between doses\n\n**Preventer (Controller) Inhalers:**\n💊 Budesonide (Budecort, Pulmicort) — reduces airway inflammation\n💊 Fluticasone (Flixotide) — another inhaled steroid\n💊 Use: Daily prevention of asthma attacks\n\n**Combination Inhalers:**\n💊 Seroflo (Fluticasone + Salbutamol) — most common combo\n💊 Seroflo 125/250 = maintenance therapy\n💊 Duolin (Ipratropium + Salbutamol) — for COPD/severe asthma\n\n**How to use a metered-dose inhaler (MDI):**\n1️⃣ Shake inhaler well\n2️⃣ Breathe out fully\n3️⃣ Place mouthpiece in mouth, start breathing in slowly\n4️⃣ Press canister once while breathing in\n5️⃣ Hold breath for 10 seconds\n6️⃣ Breathe out slowly\n7️⃣ Wait 1 minute between puffs if taking 2\n\n**Spacer device:**\n🔹 Highly recommended — makes inhaler more effective\n🔹 Reduces side effects (oral thrush)\n🔹 Essential for children and elderly\n\n**After using steroid inhaler:**\n🫧 Rinse mouth with water and spit — prevents oral thrush\n\n⚠️ *Inhalers are the safest and most effective way to treat asthma. Don't stop without doctor's advice.*",
    },
  },
  {
    keywords: ["thyroxine", "levothyroxine", "eltroxin", "thyronorm", "thyroid tablet", "hypothyroid medicine"],
    response: {
      en: "**Thyroid Medications:**\n\n💊 **Levothyroxine** (Eltroxin, Thyronorm, Thyrox) — standard treatment for hypothyroidism\n💊 **Dose**: 25-200mcg daily (depends on TSH level)\n💊 **How to take**: On EMPTY stomach, 30-60 minutes before breakfast\n💊 **With water only** — no tea, coffee, milk, or calcium supplements for 4 hours\n\n**Key rules:**\n⏰ Same time every day — consistency matters\n💊 Take on empty stomach — food reduces absorption by 40%\n💊 Avoid calcium, iron, antacids within 4 hours\n💊 Avoid soy products, high-fiber meals near dose\n💊 4-6 weeks after starting/dose change — recheck TSH\n\n**Monitoring:**\n🧪 TSH test every 3-6 months (once stable, annually)\n🧪 Target TSH: 0.5-4.0 mIU/L (varies by age/trimester)\n⚠️ Overdose symptoms: palpitations, anxiety, weight loss, tremor\n⚠️ Underdose symptoms: fatigue, weight gain, constipation, hair loss\n\n**Special situations:**\n🤰 Pregnancy: Dose usually increases by 30-50%\n👵 Elderly: Start low, increase slowly\n👶 Children: Weight-based dosing, crucial for development\n\n⚠️ *Thyroid medication is lifelong for most patients. Never skip doses or self-adjust.*",
    },
  },
  {
    keywords: ["clonazepam", "alprazolam", "xanax", "benzodiazepine", "sleeping tablet", "zolpidem", "stilnoct", "sleeping pill"],
    response: {
      en: "**Sleep & Anxiety Medications:**\n\n**Benzodiazepines (Short-term use only):**\n💊 Alprazolam (Xanax, Alprax) — 0.25-0.5mg for anxiety\n💊 Clonazepam (Rivotril, Klonopin) — 0.25-1mg for anxiety/epilepsy\n💊 Diazepam (Valium) — muscle relaxant, anxiety\n⚠️ Highly addictive — NEVER use long-term without supervision\n⚠️ Don't stop suddenly — taper gradually (withdrawal risk)\n⚠️ Avoid alcohol — dangerous combination\n⚠️ Don't drive or operate machinery\n\n**Non-addictive alternatives:**\n💊 Zolpidem (Stilnoct, Zolfresh) — 5-10mg at bedtime\n💊 Zopiclone — 3.75-7.5mg at bedtime\n💊 Melatonin (natural) — 1-5mg, 30 min before bed\n\n**Better approach for insomnia:**\n🧘 Sleep hygiene (regular schedule, dark room, no screens)\n🌿 Brahmi, Ashwagandha — natural calming\n🧘 Progressive muscle relaxation, deep breathing\n☕ Avoid caffeine after 2 PM\n📱 Blue-light filter on devices at night\n⏰ Wake up at same time daily (even weekends)\n\n⚠️ *Sleep medications should be last resort. Consult psychiatrist for proper evaluation.*",
    },
  },
  {
    keywords: ["disprin", "aspirin", "ecosprin", "blood thinner", "clopidogrel", "plavix", "warfarin", "anticoagulant"],
    response: {
      en: "**Blood Thinners (Anticoagulants/Antiplatelets):**\n\n**Aspirin (Disprin, Ecosprin):**\n💊 Low-dose (75-150mg) — prevents heart attack & stroke\n💊 As needed (325mg) — suspected heart attack (chew 1 tablet)\n⚠️ Stomach bleeding risk — take with food\n⚠️ Avoid before surgery (stop 7 days prior)\n\n**Clopidogrel (Plavix, Clopilet):**\n💊 75mg daily — prevents blood clots after stent/heart attack\n💊 Often combined with Aspirin (dual antiplatelet therapy)\n⚠️ Don't stop abruptly — increases clot risk\n\n**Warfarin (Waran, Coumadin):**\n💊 Dose varies — guided by INR blood test\n💊 Target INR: 2.0-3.0 (varies by condition)\n⚠️ MANY food/drug interactions\n⚠️ Avoid: Excess green leafy vegetables, cranberry juice\n⚠️ Regular blood monitoring essential\n\n**Newer Anticoagulants (DOACs):**\n💊 Rivaroxaban (Xarelto) — once daily with food\n💊 Apixaban (Eliquis) — twice daily\n💊 Dabigatran (Pradaxa) — twice daily\n\n**Important for ALL blood thinners:**\n🚨 Report unusual bleeding (gums, nose, urine, stool)\n⚠️ Avoid contact sports\n⚠️ Use soft toothbrush, electric razor\n⚠️ Inform ALL doctors/dentists you're on blood thinners\n\n⚠️ *Blood thinners are life-saving but require careful management. Never self-adjust.*",
    },
  },
  {
    keywords: ["zinc", "zincovit", "multivitamin", "supplement", "vitamin tablet", "becosules", "neurobion"],
    response: {
      en: "**Common Supplements & Multivitamins:**\n\n**Zincovit:**\n💊 Zinc + Multivitamin + Mineral supplement\n💊 Use: Zinc deficiency, general wellness, immunity\n💊 Dose: 1 tablet daily after food\n\n**Becosules:**\n💊 B-complex + Vitamin C\n💊 Use: B vitamin deficiency, mouth ulcers, fatigue\n💊 Dose: 1 capsule daily\n\n**Neurobion Forte:**\n💊 B1 + B6 + B12 — nerve health\n💊 Use: Nerve pain, tingling, numbness\n💊 Dose: 1 tablet daily\n\n**D-Ribose / CoQ10:**\n💊 For heart health and energy\n💊 Often recommended with statins\n\n**Omega-3 (Fish Oil):**\n💊 Heart health, brain function, joint health\n💊 Dose: 1000-2000mg EPA+DHA daily\n💊 Best taken with fatty meal\n\n**Calcium + Vitamin D3:**\n💊 Bone health, osteoporosis prevention\n💊 Calcium: 500mg twice daily\n💊 Vitamin D3: 1000-2000 IU daily\n💊 Take calcium separately from iron/thyroid medicines\n\n**When supplements help:**\n✅ Documented deficiency on blood test\n✅ Poor dietary intake\n✅ Increased needs (pregnancy, lactation, elderly)\n✅ Chronic illness affecting absorption\n\n⚠️ *Supplements are NOT substitutes for balanced diet. Get tested before supplementing.*",
    },
  },
];
