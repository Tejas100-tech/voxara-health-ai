// ── Comprehensive Medical Knowledge Base ──────────────────────────────────
// Used by the chatbot when AI APIs (Claude/Groq) are unavailable

export interface KnowledgeEntry {
  keywords: string[];
  response: Record<string, string>;
}

// ── Disease & Condition Knowledge ─────────────────────────────────────────
export const DISEASE_KNOWLEDGE: KnowledgeEntry[] = [
  {
    keywords: ["cold", "sarsdī", "जुकाम", "සර්දි", "சளி", "జలుబు", "सर्दी", "સર્દી", "ಸರ್ದಿ"],
    response: {
      en: "**Common Cold:**\n\n🔹 **Cause**: Viral infection of the nose and throat (Rhinovirus most common)\n🔹 **Symptoms**: Runny nose, sneezing, sore throat, cough, mild fever\n🔹 **Duration**: Usually 7-10 days\n\n**Treatment:**\n💊 Paracetamol for fever/headache\n💧 Stay hydrated — warm water, soups, herbal tea\n🍯 Honey + warm water for cough relief\n💤 Rest adequately\n🧂 Salt water gargle for sore throat\n\n**See a doctor if:**\n⚠️ Fever > 103°F lasting more than 3 days\n⚠️ Difficulty breathing\n⚠️ Symptoms worsen after initial improvement\n\n⚠️ *General guidance only. Consult your doctor.*",
      hi: "**सर्दी-जुकाम:**\n\n🔹 **कारण**: नाक और गले का वायरल संक्रमण\n🔹 **लक्षण**: नाक बहना, छींक आना, गले में खराश, खांसी\n🔹 **अवधि**: सामान्यतः 7-10 दिन\n\n**उपचार:**\n💊 पैरासिटामोल (बुखार/सिरदर्द के लिए)\n💧 गर्म पानी, सूप, हर्बल चाय पिएं\n🍯 शहद + गर्म पानी (खांसी के लिए)\n💤 पर्याप्त आराम करें\n🧂 गले में खराश हो तो नमक के पानी से गरारा करें\n\n⚠️ *यह सामान्य मार्गदर्शन है। अपने डॉक्टर से परामर्श करें।*",
      mr: "**सर्दी-जुकाम:**\n\n🔹 **कारण**: नाक आणि गळ्याचा व्हायरल संसर्ग\n🔹 **लक्षणे**: नाक वाहणे, छिंक येणे, गळ्यात खवखव, खोकला\n🔹 **कालावधी**: सामान्यतः 7-10 दिवस\n\n**उपचार:**\n💊 पॅरासिटामोल (ताप/डोकेदुखणासाठी)\n💧 उबदार पाणी, सूप, हर्बल चहा प्या\n🍯 मध + उबदार पाणी (खोकल्यासाठी)\n💤 पुरेसा आराम करा\n🧂 गळ्यात खवखव असल्यास मीठाच्या पाण्याने गरारा करा",
      ta: "**சளி:**\n\n🔹 **காரணம்**: மூக்கு மற்றும் தொண்டையின் வைரஸ் தொற்று\n🔹 **அறிகுறிகள்**: மூக்கு ஒழுகுதல், தும்மல், தொண்டை வலி, இருமல்\n🔹 **காலம்**: பொதுவாக 7-10 நாட்கள்\n\n**சிகிச்சை:**\n💊 பாராசிட்டமால் (காய்ச்சல்/தலைவலி)\n💧 சூடான நீர், சூப் குடிக்கவும்\n🍯 தேன் + சூடான நீர்\n💤 ஓய்வெடுக்கவும்",
      te: "**జలుబు:**\n\n🔹 **కారణం**: ముక్కు మరియు గొంతు వైరల్ ఇన్ఫెక్షన్\n🔹 **లక్షణాలు**: ముక్కు కారడం, జలుబు, గొంతు నొప్పి\n🔹 **కాలం**: సాధారణంగా 7-10 రోజులు\n\n**చికిత్స:**\n💊 పారాసిటమాల్ (జ్వరం/తలనొప్పి)\n💧 వేడి నీరు, సూప్ తాగండి\n🍯 తేనె + వేడి నీరు",
    },
  },
  {
    keywords: ["cough", "खांसी", "کھانسی", "காய்ச்சல்", "జ్వరం", " cough"],
    response: {
      en: "**Cough Management:**\n\n🔹 **Dry Cough**: Honey + warm water, warm fluids, avoid cold drinks\n🔹 **Productive Cough**: Steam inhalation, stay hydrated, chest physiotherapy\n🔹 **Allergic Cough**: Avoid dust/allergens, antihistamines may help\n\n**Home Remedies:**\n🍯 Honey (1 tsp) + warm water — 3 times daily\n🫚 Ginger tea — anti-inflammatory, soothes throat\n🥛 Warm milk + turmeric (haldi doodh) at bedtime\n🧂 Salt water gargle — reduces throat irritation\n🌿 Tulsi (Holy Basil) leaves + honey\n\n**When to see a doctor:**\n⚠️ Cough lasting more than 3 weeks\n⚠️ Blood in sputum\n⚠️ High fever with cough\n⚠️ Difficulty breathing or chest pain\n⚠️ Wheezing sound\n\n⚠️ *General guidance only. Consult your doctor.*",
      hi: "**खांसी का इलाज:**\n\n🔹 **सूखी खांसी**: शहद + गर्म पानी, गर्म तरल पदार्थ\n🔹 **कफ वाली खांसी**: भाप लें, पानी पिएं\n🔹 **एलर्जिक खांसी**: धूल से बचें, एंटीहिस्टामिन\n\n**घरेलू उपचार:**\n🍯 शहद (1 चम्मच) + गर्म पानी — दिन में 3 बार\n🫚 अदरक की चाय\n🥛 गर्म दूध + हल्दी रात को सोने से पहले\n🧂 नमक के पानी से गरारा\n🌿 तुलसी के पत्ते + शहद\n\n⚠️ *यह सामान्य मार्गदर्शन है। डॉक्टर से परामर्श करें।*",
    },
  },
  {
    keywords: ["asthma", "दमा", "asthama", "श्वास"],
    response: {
      en: "**Asthma Management:**\n\n🔹 **What is it?**: Chronic lung condition causing airway inflammation and narrowing\n🔹 **Triggers**: Dust, smoke, cold air, exercise, allergens, stress\n🔹 **Symptoms**: Wheezing, shortness of breath, chest tightness, cough\n\n**Management:**\n💊 Use prescribed inhalers regularly (preventer + reliever)\n🏠 Keep home dust-free, use air purifier if possible\n🏃 Regular light exercise (swimming is excellent)\n🧘 Breathing exercises — Pranayama helps significantly\n🚫 Avoid smoking and secondhand smoke\n📋 Keep an asthma action plan\n🩺 Regular follow-ups with pulmonologist\n\n**Emergency signs:**\n⚠️ Inhaler not providing relief\n⚠️ Can't complete sentences due to breathlessness\n⚠️ Lips/fingernails turning blue\n⚠️ Peak flow < 50% of personal best\n\n⚠️ *This is general guidance. Always follow your doctor's treatment plan.*",
      hi: "**दमा (अस्थमा) प्रबंधन:**\n\n🔹 **क्या है?**: फेफड़ों की दीर्घकालिक स्थिति जिसमें वायुमार्ग संकुचित होते हैं\n🔹 **ट्रिगर**: धूल, धुआं, ठंडी हवा, व्यायाम, एलर्जन\n🔹 **लक्षण**: सांस फूलना, सीने में जकड़न, खांसी\n\n**प्रबंधन:**\n💊 निर्धारित इन्हेलर नियमित रूप से लें\n🏠 घर को धूल मुक्त रखें\n🏃 नियमित हल्का व्यायाम करें\n🧘 प्राणायाम करें\n🚫 धूम्रपान से बचें\n\n⚠️ *यह सामान्य मार्गदर्शन है। अपने डॉक्टर का इलाज योजना का पालन करें।*",
    },
  },
  {
    keywords: ["allergy", "एलर्जी", "रिएक्शन", "खुजली"],
    response: {
      en: "**Allergy Management:**\n\n🔹 **Common Allergies**: Pollen, dust mites, pet dander, food, medications\n🔹 **Symptoms**: Sneezing, runny nose, itchy eyes, skin rash, hives\n🔹 **Types**: Seasonal (hay fever), perennial, food, drug, skin\n\n**Treatment:**\n💊 Antihistamines — Cetirizine, Loratadine (10mg once daily)\n💊 Decongestants — for nasal congestion\n💊 Nasal steroid sprays — for chronic allergies\n🌿 Local honey — may help with seasonal allergies\n🚿 Nasal saline irrigation — clears allergens\n\n**Prevention:**\n🏠 Use air purifier with HEPA filter\n🛏️ Wash bedding in hot water weekly\n🐾 Keep pets out of bedroom if allergic\n🚫 Avoid known allergens\n📝 Keep an allergy diary\n\n⚠️ *For severe allergic reactions (anaphylaxis), call emergency services immediately.*",
      hi: "**एलर्जी प्रबंधन:**\n\n🔹 **सामान्य एलर्जी**: परागकण, धूल के कण, पालतू जानवर, भोजन\n🔹 **लक्षण**: छींक, नाक बहना, आंखों में खुजली, त्वचा पर चकत्ते\n\n**उपचार:**\n💊 एंटीहिस्टामिन — सेटिरिज़िन, लोरैटाडिन (10mg दिन में एक बार)\n💊 डिकॉन्जेस्टेंट — नाक बंद होने पर\n🌿 स्थानीय शहद — मौसमी एलर्जी में मददगार\n🚿 नाक का सलाइन इरिगेशन\n\n⚠️ *गंभीर एलर्जी प्रतिक्रिया में तुरंत आपातकालीन सेवाएं कॉल करें।*",
    },
  },
  {
    keywords: ["gastric", "acidity", "acid reflux", "heartburn", "पेट में जलन", "गैस", "पेट फूलना", "bloating"],
    response: {
      en: "**Gastric/Acidity Management:**\n\n🔹 **Causes**: Spicy food, stress, irregular meals, smoking, certain medications\n🔹 **Symptoms**: Burning sensation in chest/stomach, bloating, nausea, sour taste\n\n**Diet Tips:**\n🍽️ Eat smaller, more frequent meals\n🚫 Avoid spicy, oily, fried foods\n🚫 Limit caffeine, alcohol, carbonated drinks\n🍌 Eat bananas, yogurt, oatmeal — natural antacids\n⏰ Don't lie down within 2-3 hours of eating\n🛏️ Elevate head while sleeping\n\n**Quick Relief:**\n🥛 Cold milk — neutralizes acid\n🫚 Ginger tea — anti-inflammatory\n🧂 Baking soda (1/2 tsp in water) — temporary relief\n🌿 Jeera (cumin) water\n💊 Antacids — Gelusil, Digene (as needed)\n💊 PPI — Omeprazole 20mg (if frequent)\n\n**See a doctor if:**\n⚠️ Symptoms persist more than 2 weeks\n⚠️ Difficulty swallowing\n⚠️ Unexplained weight loss\n⚠️ Black/tarry stools\n\n⚠️ *General guidance only. Consult your doctor.*",
      hi: "**गैस/एसिडिटी प्रबंधन:**\n\n🔹 **कारण**: मसालेदार भोजन, तनाव, अनियमित भोजन\n🔹 **लक्षण**: सीने/पेट में जलन, पेट फूलना, जी मिचलाना\n\n**आहार सुझाव:**\n🍽️ छोटे-छोटे भोजन बार-बार खाएं\n🚫 मसालेदार, तैलीय भोजन से बचें\n🚫 कैफीन, शराब, कार्बोनेटेड ड्रिंक सीमित करें\n🍌 केला, दही, ओटमील खाएं\n⏰ खाने के बाद 2-3 घंटे तक न लेटें\n\n**तुरंत राहत:**\n🥛 ठंडा दूध — एसिड को निष्क्रिय करता है\n🫚 अदरक की चाय\n💊 एंटासिड — जेलुसिल, डाइजीन\n\n⚠️ *यह सामान्य मार्गदर्शन है। डॉक्टर से परामर्श करें।*",
    },
  },
  {
    keywords: ["thyroid", "थायरॉयड", "hypothyroid", "hyperthyroid", "tsh"],
    response: {
      en: "**Thyroid Disorders:**\n\n🔹 **Hypothyroid** (Underactive): Weight gain, fatigue, constipation, dry skin, hair loss\n🔹 **Hyperthyroid** (Overactive): Weight loss, anxiety, rapid heartbeat, tremors\n🔹 **Diagnosis**: TSH, T3, T4 blood tests\n\n**Management:**\n💊 Hypothyroid: Levothyroxine (thyroxine) — take on empty stomach\n💊 Hyperthyroid: Anti-thyroid medications as prescribed\n🥗 Iodized salt (for hypothyroid) / limit iodine (hyperthyroid)\n🏃 Regular exercise — helps metabolism\n📋 Regular TSH monitoring (every 3-6 months)\n⏰ Take medication at same time daily\n\n**Diet Tips:**\n✅硒-rich foods (Brazil nuts, eggs) — supports thyroid\n✅ Zinc (pumpkin seeds, chickpeas)\n❌ Avoid excess soy, raw cruciferous vegetables (hypothyroid)\n❌ Limit caffeine if hyperthyroid\n\n⚠️ *Thyroid disorders require lifelong management. Always follow your endocrinologist's advice.*",
      hi: "**थायरॉयड विकार:**\n\n🔹 **हाइपोथायरॉयड** (कम सक्रिय): वजन बढ़ना, थकान, कब्ज, सूखी त्वचा\n🔹 **हाइपरथायरॉयड** (अधिक सक्रिय): वजन घटना, चिंता, तेज़ धड़कन\n🔹 **निदान**: TSH, T3, T4 रक्त परीक्षण\n\n**प्रबंधन:**\n💊 हाइपोथायरॉयड: लेवोथायरॉक्सिन — खाली पेट लें\n🥗 आयोडीन युक्त नमक (हाइपोथायरॉयड के लिए)\n📋 नियमित TSH निगरानी\n⏰ दवा हर दिन एक ही समय पर लें\n\n⚠️ *थायरॉयड विकारों में जीवनभर प्रबंधन आवश्यक है।*",
    },
  },
  {
    keywords: ["arthritis", "गठिया", "joint pain", "जोड़ों का दर्द", "घुटने का दर्द"],
    response: {
      en: "**Arthritis / Joint Pain:**\n\n🔹 **Osteoarthritis**: Wear and tear of cartilage (most common)\n🔹 **Rheumatoid**: Autoimmune — body attacks joint lining\n🔹 **Gout**: Uric acid crystal buildup in joints\n🔹 **Symptoms**: Joint pain, swelling, stiffness, reduced movement\n\n**Management:**\n💊 Pain relief: Paracetamol, NSAIDs (Ibuprofen)\n💊 Disease-modifying drugs for RA (DMARDs)\n🧊 Ice for acute pain, warm compress for stiffness\n🏊 Swimming, water aerobics — gentle on joints\n🧘 Yoga, gentle stretching\n⚖️ Weight management — reduces joint stress\n🩺 Regular rheumatology follow-ups\n\n**AYUSH Perspective (Ayurveda):**\n🌿 Ashwagandha — anti-inflammatory\n🌿 Guggulu — supports joint health\n🌿 Boswellia (Shallaki) — reduces inflammation\n🧘 Gentle yoga, warm oil massage (Abhyanga)\n\n⚠️ *Joint pain has many causes. Get proper diagnosis before treatment.*",
    },
  },
  {
    keywords: ["skin", "rash", "acne", "eczema", "त्वचा", "दाद", "खुजली", "pimple"],
    response: {
      en: "**Skin Conditions:**\n\n🔹 **Acne**: Clogged pores, bacteria, oil — keep face clean, avoid popping\n🔹 **Eczema**: Dry, itchy patches — moisturize regularly, avoid irritants\n🔹 **Fungal infection**: Red, itchy ring-shaped rash — keep area dry\n🔹 **Contact dermatitis**: Skin reaction to irritants\n\n**General Skin Care:**\n🧼 Gentle cleanser (Cetaphil, Cetaphil)\n💧 Moisturize daily (especially after bathing)\n☀️ Use sunscreen SPF 30+ daily\n🥤 Stay hydrated\n🥗 Eat fruits, vegetables, omega-3 rich foods\n🚫 Avoid harsh soaps, excessive washing\n\n**When to see dermatologist:**\n⚠️ Persistent acne not responding to OTC treatment\n⚠️ Skin changes, new moles, or growths\n⚠️ Severe eczema or psoriasis\n⚠️ Suspected fungal infection (may need antifungal)\n\n⚠️ *Skin conditions vary greatly. Proper diagnosis by dermatologist recommended.*",
    },
  },
  {
    keywords: ["mental health", "depression", "anxiety", "stress", "नींद न आना", "insomnia", "तनाव", "घबराहट"],
    response: {
      en: "**Mental Health & Wellbeing:**\n\n🔹 **Stress**: Work, relationships, health concerns\n🔹 **Anxiety**: Excessive worry, restlessness, physical symptoms\n🔹 **Depression**: Persistent sadness, loss of interest, fatigue\n🔹 **Insomnia**: Difficulty falling/staying asleep\n\n**Self-Care Strategies:**\n🧘 Meditation & mindfulness — 10 min daily\n🏃 Exercise — 30 min moderate activity releases endorphins\n😴 Sleep hygiene — regular schedule, no screens 1hr before bed\n🥗 Balanced diet — omega-3, B vitamins, magnesium\n👥 Social connection — talk to friends/family\n📝 Journaling — express thoughts and feelings\n🌿 Breathing exercises — 4-7-8 technique\n🚫 Limit alcohol, caffeine, screen time\n\n**AYUSH Approach:**\n🌿 Ashwagandha — adaptogen, reduces cortisol\n🌿 Brahmi — brain tonic, improves focus\n🌿 Brahmi + Shankhpushpi — calms the mind\n🧘 Pranayama (especially Nadi Shodhana)\n🧘 Yoga — particularly restorative poses\n\n**Seek help if:**\n⚠️ Symptoms persist more than 2 weeks\n⚠️ Daily functioning is affected\n⚠️ Thoughts of self-harm (crisis helpline: 1800-599-0019)\n\n⚠️ *Mental health is as important as physical health. Please reach out to a professional.*",
      hi: "**मानसिक स्वास्थ्य:**\n\n🔹 **तनाव**: काम, रिश्ते, स्वास्थ्य चिंताएं\n🔹 **चिंता**: अत्यधिक चिंता, बेचैनी\n🔹 **अवसाद**: लगातार उदासी, रुचि की कमी\n🔹 **अनिद्रा**: नींद न आना\n\n**स्व-देखभाल:**\n🧘 ध्यान और माइंडफुलनेस — रोज़ 10 मिनट\n🏃 व्यायाम — रोज़ 30 मिनट\n😴 नींद की दिनचर्या — नियमित समय\n🧘 प्राणायाम — विशेषकर नाड़ी शोधन\n🌿 अश्वगंधा — तनाव कम करता है\n🌿 ब्राह्मी — मस्तिष्क टॉनिक\n\n⚠️ *मानसिक स्वास्थ्य उतना ही महत्वपूर्ण है जितना शारीरिक स्वास्थ्य।*",
    },
  },
  {
    keywords: ["periods", "menstruation", "menstrual", "period pain", "dysmenorrhea", "मासिक धर्म", "पीरियड", "irregular periods"],
    response: {
      en: "**Menstrual Health:**\n\n🔹 **Normal cycle**: 21-35 days, lasts 3-7 days\n🔹 **Period pain (Dysmenorrhea)**: Cramps, lower back pain\n🔹 **Irregular periods**: May indicate PCOS, thyroid issues, stress\n\n**Period Pain Relief:**\n💊 Ibuprofen (400mg) — take at onset of pain\n🫚 Ginger tea — natural anti-inflammatory\n🧘 Gentle yoga — cat-cow, child's pose, reclining butterfly\n🌡️ Hot water bottle on lower abdomen\n🏃 Light exercise — walking helps\n\n**For Irregular Periods:**\n💊 Consult gynecologist for evaluation\n🧪 Check: Thyroid, PCOS panel, prolactin\n🥗 Maintain healthy weight\n🧘 Manage stress\n🌿 Shatavari — supports female reproductive health (AYUSH)\n\n**When to see a doctor:**\n⚠️ Periods lasting more than 7 days\n⚠️ Very heavy bleeding (soaking pad every hour)\n⚠️ Severe pain not relieved by medication\n⚠️ Periods absent for 3+ months\n⚠️ Bleeding between periods\n\n⚠️ *Menstrual issues require proper evaluation. Please consult a gynecologist.*",
    },
  },
  {
    keywords: ["vitamin", "deficiency", "विटामिन", "nutrient", "anemia", "low hemoglobin", "iron deficiency", "ब्लड टेस्ट"],
    response: {
      en: "**Vitamin & Nutrient Deficiency:**\n\n🔹 **Vitamin D**: Bone pain, fatigue, muscle weakness → Sunlight 15-20 min/day, supplements\n🔹 **Vitamin B12**: Nerve tingling, fatigue → Eggs, meat, fortified foods\n🔹 **Iron (Anemia)**: Fatigue, pale skin, breathlessness → Iron tablets, green leafy vegetables\n🔹 **Calcium**: Muscle cramps, weak bones → Dairy, sesame seeds, ragi\n🔹 **Zinc**: Hair loss, slow healing → Pumpkin seeds, chickpeas\n\n**Recommended Daily:**\n💊 Vitamin D3: 1000-2000 IU\n💊 Iron: 18mg (women), 8mg (men)\n💊 Calcium: 1000mg\n💊 Vitamin B12: 2.4mcg\n💊 Zinc: 8-11mg\n\n**Food Sources:**\n🥚 Eggs, milk → B12, protein\n🥬 Spinach, beetroot → Iron\n🐟 Fatty fish, fortified milk → Vitamin D\n🥜 Nuts, seeds → Zinc, magnesium\n\n⚠️ *Get blood tests done for proper diagnosis. Self-supplementation without testing can be harmful.*",
    },
  },
  {
    keywords: ["cancer", "tumor", "oncology", "कैंसर", "malignant"],
    response: {
      en: "**Cancer — General Information:**\n\n🔹 **What is it?**: Uncontrolled cell growth that can spread to other parts\n🔹 **Types**: Breast, lung, colorectal, prostate, skin, blood cancers, etc.\n🔹 **Risk factors**: Smoking, obesity, UV exposure, family history, certain infections\n\n**Prevention:**\n🚫 Don't smoke / quit smoking\n☀️ Use sunscreen, avoid excessive sun\n🥗 Eat healthy — fruits, vegetables, whole grains\n🏃 Exercise regularly (150 min/week)\n⚖️ Maintain healthy weight\n💉 HPV vaccine (cervical cancer prevention)\n🩺 Regular screenings as recommended\n\n**Important:**\n⚠️ Early detection = better outcomes\n⚠️ Don't delay seeing a doctor for unusual symptoms\n⚠️ Self-examination (breast, skin, testicular)\n⚠️ Cancer is NOT contagious\n⚠️ Modern treatments are very effective\n\n⚠️ *Cancer requires specialized oncology care. Please consult an oncologist.*",
    },
  },
  {
    keywords: ["kidney", "stone", "गुर्दा", "पथरी", "renal", "UTI", "urinary", "पेशाब"],
    response: {
      en: "**Kidney Stones & Urinary Health:**\n\n🔹 **Kidney Stones**: Hard mineral deposits in kidneys\n🔹 **Symptoms**: Severe flank pain, blood in urine, nausea, frequent urination\n🔹 **UTI**: Burning urination, frequency, urgency, cloudy urine\n\n**Kidney Stone Prevention:**\n💧 Drink 2.5-3 liters water daily\n🚫 Limit salt, processed foods\n🚫 Avoid excess oxalate (spinach, nuts, chocolate)\n🍋 Lemon water — citrate helps prevent stones\n🥗 Eat calcium-rich foods (paradoxically reduces stones)\n💊 If recurrent: medications to prevent formation\n\n**UTI Prevention & Treatment:**\n💧 Stay hydrated — flush bacteria\n🧃 Cranberry juice — may prevent recurrent UTIs\n🧂 Don't hold urine — empty bladder regularly\n🧼 Maintain hygiene\n💊 Antibiotics for active UTI (consult doctor)\n🫚 Garlic, ginger — natural antibacterial\n\n**See a doctor if:**\n⚠️ Severe pain, fever with UTI\n⚠️ Blood in urine\n⚠️ Stones > 5mm (may need intervention)\n\n⚠️ *UTIs require antibiotic treatment. Kidney stones may need surgical intervention.*",
    },
  },
  {
    keywords: ["eye", "vision", "eyesight", "गंधक", "आंख", "glasses", "specs", "dry eyes", "computer vision"],
    response: {
      en: "**Eye Health:**\n\n🔹 **Dry Eyes**: Common with screen use — lubricating drops help\n🔹 **Digital Eye Strain**: 20-20-20 rule — every 20 min, look 20 feet away for 20 sec\n🔹 **Vision changes**: Get eyes checked annually\n\n**Eye Care Tips:**\n📱 Follow 20-20-20 rule for screen time\n☀️ Wear sunglasses outdoors (UV protection)\n🥕 Eat carrots, leafy greens (Vitamin A)\n💤 Get adequate sleep (7-8 hours)\n💧 Blink regularly when using screens\n🧴 Use lubricating eye drops for dryness\n🩺 Annual eye exam recommended\n\n**When to see ophthalmologist:**\n⚠️ Sudden vision loss\n⚠️ Eye pain or redness\n⚠️ Seeing floaters/flashes\n⚠️ Persistent dry eyes despite drops\n⚠️ Need for glasses prescription update\n\n⚠️ *Eye conditions require specialized care. Consult an ophthalmologist.*",
    },
  },
];

// ── Medication Knowledge ──────────────────────────────────────────────────
export const MEDICATION_KNOWLEDGE: KnowledgeEntry[] = [
  {
    keywords: ["paracetamol", "acetaminophen", "crocin", "dolo", "pandol", "fever medicine"],
    response: {
      en: "**Paracetamol (Acetaminophen):**\n\n💊 **Brand names**: Crocin, Dolo 650, Pandol, Calpol, Tylenol\n💊 **Use**: Fever, mild-moderate pain (headache, body ache, toothache)\n💊 **Dose**: 500-650mg every 4-6 hours (max 4g/day for adults)\n💊 **How to take**: With or without food\n\n**Important:**\n⚠️ Don't exceed 4g (8 tablets of 500mg) in 24 hours\n⚠️ Avoid with liver disease — consult doctor\n⚠️ Avoid alcohol while taking\n⚠️ Not anti-inflammatory (won't reduce swelling)\n⚠️ Safe in pregnancy (usual doses)\n⚠️ Available as syrup for children (weight-based dosing)\n\n⚠️ *This is general information. Follow your doctor's specific advice.*",
    },
  },
  {
    keywords: ["ibuprofen", "brufen", "combiflam", "diclofenac", "NSAID", "painkiller"],
    response: {
      en: "**Ibuprofen (NSAID):**\n\n💊 **Brand names**: Brufen, Combiflam, Ibugesic, Moov\n💊 **Use**: Pain, fever, inflammation (joint pain, period pain, injury)\n💊 **Dose**: 400mg every 6-8 hours (with food)\n💊 **Max**: 1200mg/day (OTC), higher with prescription\n\n**Important:**\n⚠️ Always take with food — can cause stomach issues\n⚠️ Avoid if you have stomach ulcers\n⚠️ Avoid if kidney disease\n⚠️ Avoid in pregnancy (especially 3rd trimester)\n⚠️ Don't combine with blood thinners without doctor's advice\n⚠️ Can increase blood pressure\n\n**Combiflam** = Ibuprofen + Paracetamol combo\n\n⚠️ *NSAIDs have more side effects than paracetamol. Use lowest effective dose for shortest time.*",
      hi: "**आईबुप्रोफेन (NSAID):**\n\n💊 **ब्रांड नाम**: ब्रूफेन, कंबिफ्लैम, आईब्यूजेसिक\n💊 **उपयोग**: दर्द, बुखार, सूजन\n💊 **खुराक**: 400mg हर 6-8 घंटे (खाने के साथ)\n\n⚠️ **महत्वपूर्ण:**\n⚠️ हमेशा खाने के साथ लें\n⚠️ पेट के अल्सर हो तो न लें\n⚠️ गर्भावस्था में न लें\n⚠️ पेट में जलन, मतली हो सकती है\n\n⚠️ *यह सामान्य जानकारी है। डॉक्टर से परामर्श करें।*",
    },
  },
  {
    keywords: ["antibiotic", "amoxicillin", "azithromycin", "ciprofloxacin", "antibiotics"],
    response: {
      en: "**Antibiotics — Important Information:**\n\n💊 **Never take antibiotics without prescription**\n💊 Complete the full course even if you feel better\n💊 Take at regular intervals as prescribed\n💊 Common antibiotics:\n   - Amoxicillin — bacterial infections (throat, ear, UTI)\n   - Azithromycin (Azee) — respiratory infections\n   - Ciprofloxacin — UTI, diarrhea\n   - Metronidazole (Metrogyl) — dental, GI infections\n\n**Warning:**\n🚫 Antibiotics DON'T work on viral infections (cold, flu, COVID)\n🚫 Don't save leftover antibiotics\n🚫 Don't share antibiotics\n⚠️ Resistance develops from misuse — antibiotics stop working\n⚠️ Take probiotics (curd, yogurt) to maintain gut health\n\n**Side effects may include:**\n🔸 Stomach upset, diarrhea\n🔸 Allergic reactions (rash, swelling)\n🔸 Yeast infections\n\n⚠️ *Always consult a doctor before taking antibiotics. Prescription required.*",
    },
  },
  {
    keywords: ["omeprazole", "pantoprazole", "esomeprazole", "PPI", "proton pump", "antacid", "gastric medicine"],
    response: {
      en: "**PPI / Proton Pump Inhibitors:**\n\n💊 **Common PPIs**: Omeprazole (Omez), Pantoprazole (Pantocid), Esomeprazole (Razo)\n💊 **Use**: Acidity, acid reflux (GERD), gastric ulcers\n💊 **Dose**: Usually 20-40mg once daily, 30 min before breakfast\n💊 **Duration**: 2-8 weeks for acute; longer for chronic conditions\n\n**Key points:**\n⏰ Take 30 minutes before first meal of the day\n💊 Not for instant relief — takes 2-3 days to show full effect\n⚠️ Long-term use may affect calcium, magnesium absorption\n⚠️ Don't stop suddenly after prolonged use\n\n**For quick relief:**\n💊 Antacids (Gelusil, Digene) — immediate neutralization\n🥛 Cold milk, baking soda water — temporary\n\n⚠️ *PPIs are prescription medicines. Long-term use requires doctor supervision.*",
      hi: "**PPI / प्रोटॉन पंप इन्हिबिटर:**\n\n💊 **सामान्य PPI**: ओमेप्राज़ोल (ओमेज़), पैंटोप्राज़ोल (पैंटोसिड)\n💊 **उपयोग**: एसिडिटी, एसिड रिफ्लक्स\n💊 **खुराक**: आमतौर पर 20-40mg दिन में एक बार, नाश्ते से 30 मिनट पहले\n\n⚠️ *यह प्रिस्क्रिप्शन दवा है। लंबे समय तक उपयोग के लिए डॉक्टर की निगरानी ज़रूरी है।*",
    },
  },
  {
    keywords: ["metformin", "diabetes tablet", "sugar tablet", "glycomet", "glucose"],
    response: {
      en: "**Metformin (Diabetes Medication):**\n\n💊 **Brand names**: Glycomet, Gluconorm, Diamet, Met\n💊 **Use**: Type 2 Diabetes — lowers blood sugar\n💊 **Dose**: 500-2000mg/day (starting 500mg, gradually increased)\n💊 **How to take**: With meals (reduces stomach upset)\n\n**Important:**\n⏰ Take with food — reduces GI side effects\n💊 Never skip meals while on Metformin\n⚠️ Monitor blood sugar regularly\n⚠️ Can cause B12 deficiency — get levels checked\n⚠️ Stop 48 hours before surgery/contrast dye\n⚠️ Avoid excessive alcohol\n\n**Side effects (usually temporary):**\n🔸 Stomach upset, nausea, diarrhea\n🔸 Metallic taste\n🔸 Vitamin B12 deficiency (long-term)\n\n**When to stop & seek help:**\n🚨 Feeling very unwell with vomiting\n🚨 Difficulty breathing\n🚨 Unusual muscle pain\n\n⚠️ *Diabetes management requires regular monitoring and doctor visits.*",
    },
  },
];

// ── Emergency & First Aid ────────────────────────────────────────────────
export const EMERGENCY_KNOWLEDGE: KnowledgeEntry[] = [
  {
    keywords: ["emergency", "first aid", "accident", "bleeding", "burn", "choking", "CPR", "poison", "snake bite", " fracture", "आपातकाल", "प्राथमिक उपचार"],
    response: {
      en: "**Emergency First Aid Guide:**\n\n🚨 **Call emergency number immediately for life-threatening situations**\n\n**Severe Bleeding:**\n🩸 Apply firm pressure with clean cloth\n🩸 Don't remove embedded objects\n🩸 Elevate the injured area\n🩸 Keep victim warm and calm\n\n**Burns:**\n🔥 Cool under running water for 20 minutes\n🔥 Don't apply ice, toothpaste, or butter\n🔥 Don't pop blisters\n🔥 Cover loosely with sterile dressing\n\n**Choking (Adult):**\n🫁 Stand behind, give firm upward thrusts below ribs\n🫁 Call emergency if person can't breathe/cough\n\n**CPR (Cardiac Arrest):**\n❤️ 30 chest compressions + 2 breaths\n❤️ Compress center of chest, 5-6 cm deep\n❤️ Push hard and fast (100-120/min)\n❤️ Continue until help arrives\n\n**Snake Bite:**\n🐍 Keep victim calm and still\n🐍 Don't suck venom or apply tourniquet\n🐍 Remove rings/watches near bite\n🐍 Get to hospital ASAP — anti-venom needed\n\n**Fracture Suspected:**\n🦴 Don't move the injured area\n🦴 Immobilize with splint if possible\n🦴 Apply ice wrapped in cloth\n🦴 Seek immediate medical care\n\n⚠️ *First aid is temporary. Always seek professional medical help.*",
      hi: "**आपातकाल प्राथमिक उपचार:**\n\n🚨 **जानलेवा स्थितियों में तुरंत आपातकालीन नंबर कॉल करें**\n\n**गंभीर रक्तस्राव:**\n🩸 साफ कपड़े से दबाव डालें\n🩸 घाव में फंसी वस्तु न निकालें\n🩸 प्रभावित क्षेत्र ऊपर उठाएं\n\n**जलने पर:**\n🔥 बहते पानी के नीचे 20 मिनट ठंडा करें\n🔥 बर्फ, टूथपेस्ट, या मक्खन न लगाएं\n🔥 फफोले न फोड़ें\n\n**गला अटकने पर:**\n🫁 पीछे खड़े होकर पसलियों के नीचे ऊपर की ओर जोर से दबाएं\n\n⚠️ *प्राथमिक उपचार अस्थायी है। हमेशा पेशेवर चिकित्सा सहायता लें।*",
    },
  },
];

// ── Diet & Nutrition ──────────────────────────────────────────────────────
export const DIET_KNOWLEDGE: KnowledgeEntry[] = [
  {
    keywords: ["diet", "nutrition", "healthy eating", "weight loss", "weight gain", "obesity", "calories", "पोषण", "आहार", "weight loss diet"],
    response: {
      en: "**Healthy Diet & Nutrition:**\n\n🥗 **Balanced Plate Method:**\n🍽️ 1/4 plate — Protein (dal, paneer, eggs, fish, chicken)\n🍽️ 1/4 plate — Complex carbs (roti, rice, sweet potato)\n🍽️ 1/2 plate — Vegetables & fruits\n\n**Key Principles:**\n🕐 Eat at regular times — don't skip meals\n🥤 Drink 2-3 liters water daily\n🧂 Limit salt (< 5g/day — WHO guideline)\n🍬 Limit sugar (< 25g/day)\n🧈 Limit saturated fats, trans fats\n🥗 Eat 5+ servings of fruits/vegetables daily\n🥜 Include nuts, seeds, whole grains\n\n**For Weight Loss:**\n⚖️ Calorie deficit (burn more than you consume)\n🍽️ Smaller portions, more frequent meals\n🚫 Avoid processed foods, sugary drinks\n🏃 Exercise + diet = effective combination\n📈 Aim for 0.5-1 kg loss per week\n\n**For Weight Gain:**\n🍽️ Eat calorie-dense nutritious foods\n🥜 Nuts, dried fruits, ghee, cheese\n🥛 Banana milkshakes, peanut butter\n💪 Strength training + surplus calories\n\n⚠️ *Dietary needs vary by individual. Consult a dietitian for personalized plans.*",
      hi: "**स्वस्थ आहार और पोषण:**\n\n🥗 **संतुलित प्लेट विधि:**\n🍽️ 1/4 प्लेट — प्रोटीन (दाल, पनीर, अंडे, मांस)\n🍽️ 1/4 प्लेट — जटिल कार्बोहाइड्रेट (रोटी, चावल)\n🍽️ 1/2 प्लेट — सब्जियां और फल\n\n**मुख्य सिद्धांत:**\n🕐 नियमित समय पर भोजन करें\n🥤 रोज़ 2-3 लीटर पानी पिएं\n🧂 नमक सीमित करें (< 5g/दिन)\n🍬 चीनी सीमित करें\n🥗 रोज़ 5+ सर्विंग फल और सब्जियां\n\n⚠️ *आहार की ज़रूरतें व्यक्ति के अनुसार अलग होती हैं। डाइटिशियन से परामर्श करें।*",
    },
  },
];

// ── AYUSH Specific Knowledge ──────────────────────────────────────────────
export const AYUSH_KNOWLEDGE: KnowledgeEntry[] = [
  {
    keywords: ["dosha", "दोष", "vata", "pitta", "kapha", "three doshas", "वात", "पित्त", "कफ"],
    response: {
      en: "**The Three Doshas (Ayurvedic Body Energies):**\n\n🔹 **Vata** (Air + Space)\n   - Controls: Movement, breathing, nerve impulses\n   - When balanced: Creative, energetic, quick learner\n   - When imbalanced: Anxiety, insomnia, constipation, dry skin\n   - Favor: Warm foods, routine, warm oils\n\n🔹 **Pitta** (Fire + Water)\n   - Controls: Digestion, metabolism, body temperature\n   - When balanced: Sharp intellect, confident, good appetite\n   - When imbalanced: Anger, acidity, skin rashes, loose stools\n   - Favor: Cooling foods, moderate exercise\n\n🔹 **Kapha** (Earth + Water)\n   - Controls: Structure, lubrication, immunity\n   - When balanced: Calm, loving, strong memory\n   - When imbalanced: Weight gain, lethargy, congestion, depression\n   - Favor: Light foods, vigorous exercise, stimulation\n\n**To determine your dosha:**\n🌿 Consult an Ayurvedic practitioner for Prakriti assessment\n🌿 Consider body frame, skin, appetite, sleep, temperament\n🌿 Most people have a dominant + secondary dosha\n\n⚠️ *Consult a qualified Vaidya for personalized dosha assessment.*",
      hi: "**तीन दोष (आयुर्वेदिक शरीर ऊर्जाएं):**\n\n🔹 **वात** (वायु + आकाश)\n   - नियंत्रित: गति, श्वास, तंत्रिका आवेग\n   - संतुलित: रचनात्मक, ऊर्जावान, तेज सीखने वाला\n   - असंतुलित: चिंता, अनिद्रा, कब्ज, सूखी त्वचा\n\n🔹 **पित्त** (अग्नि + जल)\n   - नियंत्रित: पाचन, चयापचय, शरीर का तापमान\n   - संतुलित: तीक्ष्ण बुद्धि, आत्मविश्वास, अच्छी भूख\n   - असंतुलित: गुस्सा, एसिडिटी, त्वचा पर चकत्ते\n\n🔹 **कफ** (पृथ्वी + जल)\n   - नियंत्रित: संरचना, स्नेहन, प्रतिरक्षा\n   - संतुलित: शांत, प्रेमपूर्ण, अच्छी स्मृति\n   - असंतुलित: वजन बढ़ना, आलस्य, जमाव, अवसाद\n\n⚠️ *व्यक्तिगत दोष मूल्यांकन के लिए योग्य वैद्य से परामर्श करें।*",
    },
  },
  {
    keywords: ["panchkarma", "panchakarma", "detox", "पंचकर्म", "detoxification", "vamana", "virechana", "basti", "nasya", "raktamokshana"],
    response: {
      en: "**Panchakarma (Ayurvedic Detoxification):**\n\nPanchakarma is a 5-fold Ayurvedic purification therapy:\n\n🔹 **Vamana** (Therapeutic Emesis)\n   - Controlled vomiting to eliminate excess Kapha\n   - For: Asthma, allergies, skin disorders, obesity\n\n🔹 **Virechana** (Purgation Therapy)\n   - Controlled purgation to eliminate excess Pitta\n   - For: Liver disorders, skin diseases, digestive issues\n\n🔹 **Basti** (Medicated Enema)\n   - Herbal decoctions/oils administered rectally\n   - For: Vata disorders, joint pain, constipation, neurological issues\n\n🔹 **Nasya** (Nasal Administration)\n   - Medicated oils/powders through nose\n   - For: Sinusitis, headache, hair problems, neurological conditions\n\n🔹 **Raktamokshana** (Blood Purification)\n   - Controlled bloodletting (leech therapy)\n   - For: Skin diseases, blood disorders, localized inflammation\n\n**Important:**\n⚠️ Panchakarma must be done under qualified Ayurvedic practitioner\n⚠️ Pre/post procedure diet and lifestyle are crucial\n⚠️ Not suitable for everyone — proper assessment needed\n⚠️ Duration: Typically 7-21 days per procedure\n\n⚠️ *Always consult a qualified Vaidya before undergoing Panchakarma.*",
    },
  },
  {
    keywords: ["yoga", "pranayama", "meditation", "योग", "प्राणायाम", "exercise for health", "शीर्षासन", "सूर्य नमस्कार"],
    response: {
      en: "**Yoga & Pranayama for Health:**\n\n**Basic Yoga Asanas:**\n🧘 **Surya Namaskar** — Full body warm-up (12 rounds)\n🧘 **Tadasana** — Improves posture and balance\n🧘 **Bhujangasana** (Cobra) — Strengthens back, opens chest\n🧘 **Matsyasana** (Fish) — Improves breathing, relieves stress\n🧘 **Shavasana** (Corpse) — Deep relaxation\n🧘 **Balasana** (Child's Pose) — Calms mind, relieves back pain\n🧘 **Adho Mukha Svanasana** (Downward Dog) — Full body stretch\n\n**Pranayama (Breathing):**\n🫁 **Anulom-Vilom** (Alternate Nostril) — Balances nervous system\n🫁 **Kapalbhati** — Detoxifies, energizes\n🫁 **Bhramari** — Reduces anxiety, improves focus\n🫁 **Deep Belly Breathing** — Activates parasympathetic system\n\n**Benefits:**\n✅ Reduces stress and anxiety\n✅ Improves flexibility and strength\n✅ Better sleep quality\n✅ Lower blood pressure\n✅ Improved digestion\n✅ Enhanced mental clarity\n\n**Tips:**\n🌅 Best practiced early morning on empty stomach\n🕐 Start with 15-20 min, gradually increase\n🩺 Consult instructor for modifications if injuries\n\n⚠️ *Some asanas are contraindicated in certain conditions. Learn from a qualified yoga teacher.*",
    },
  },
  {
    keywords: ["ashwagandha", "brahmi", "triphala", "giloy", "tulsi", "neem", "aloe vera", "turm", "haldi", "herbs", "herbal"],
    response: {
      en: "**Common Ayurvedic Herbs & Benefits:**\n\n🌿 **Ashwagandha** (Withania somnifera)\n   - Adaptogen — reduces cortisol, manages stress\n   - Improves sleep, energy, and immunity\n   - Dose: 300-600mg daily (capsule/powder)\n\n🌿 **Brahmi** (Bacopa monnieri)\n   - Brain tonic — improves memory, focus, learning\n   - Calms anxiety, promotes sleep\n   - Dose: 300-600mg daily\n\n🌿 **Triphala** (Amalaki + Bibhitaki + Haritaki)\n   - Digestive cleanser — gentle detox\n   - Rich in Vitamin C, antioxidants\n   - Dose: 3-6g powder in warm water before bed\n\n🌿 **Giloy / Guduchi** (Tinospora cordifolia)\n   - Immunity booster — anti-pyretic, anti-inflammatory\n   - Useful in chronic fever, diabetes\n   - Dose: 500mg twice daily\n\n🌿 **Tulsi** (Holy Basil)\n   - Respiratory health, immune support\n   - Anti-bacterial, anti-viral\n   - Dose: Fresh leaves or 500mg daily\n\n🌿 **Turmeric / Haldi** (Curcuma longa)\n   - Powerful anti-inflammatory (curcumin)\n   - Supports joints, liver, digestion\n   - Dose: 500mg with black pepper (for absorption)\n\n🌿 **Neem** (Azadirachta indica)\n   - Blood purifier — skin health\n   - Anti-bacterial, anti-fungal\n   - Dose: 2-4 leaves daily or 500mg\n\n⚠️ *Herbs can interact with medications. Always consult a Vaidya before starting.*",
    },
  },
  {
    keywords: ["seasonal", "ritucharya", "season", "rutu", "monsoon", "summer diet", "winter diet", "weather"],
    response: {
      en: "**Ritucharya (Ayurvedic Seasonal Routine):**\n\n**Summer (Grishma - June to August):**\n☀️ Favor: Sweet, bitter, astringent tastes\n💧 Hydrate — coconut water, buttermilk, mint water\n🧘 Exercise early morning or evening\n🛁 Cool oil massage with sandalwood, jasmine\n🌿 Herbs: Amla, Shatavari, Gulkand\n\n**Monsoon (Varsha - July to September):**\n🌧️ Favor: Pungent, sour, salty tastes\n🫚 Use ginger, black pepper, cumin generously\n🛡️ Boost immunity — Giloy, Tulsi, Chyawanprash\n🚫 Avoid raw/uncooked foods during monsoon\n🩺 Be cautious of waterborne diseases\n\n**Autumn (Sharad - September to November):**\n🍂 Favor: Bitter, astringent, sweet tastes\n🌿 Blood purification — Neem, Guduchi\n🧘 Virechana (purgation) recommended\n🥗 Light, easily digestible foods\n\n**Winter (Hemanta - November to February):**\n❄️ Favor: Sweet, sour, salty tastes\n🥛 Warm foods, ghee, sesame oil\n💪 Vigorous exercise — body can handle more\n🫚 Ginger, cinnamon, cardamom — warming spices\n🌿 Ashwagandha, Gokshura — strengthen body\n\n**Early Spring (Vasant - February to March):**\n🌸 Favor: Bitter, astringent, light foods\n🧘 Detox — Kapha accumulation period\n🥗 Light grains, honey, barley\n\n⚠️ *Seasonal routine varies by individual constitution. Consult a Vaidya.*",
    },
  },
];

// ── Smart Intent Matching ─────────────────────────────────────────────────
const ALL_KNOWLEDGE = [
  ...DISEASE_KNOWLEDGE,
  ...MEDICATION_KNOWLEDGE,
  ...EMERGENCY_KNOWLEDGE,
  ...DIET_KNOWLEDGE,
  ...AYUSH_KNOWLEDGE,
];

export function findBestMatch(
  query: string,
  chatType: "general" | "ayush"
): string | null {
  const lower = query.toLowerCase();

  // Score each knowledge entry
  let bestScore = 0;
  let bestResponse: Record<string, string> | null = null;

  for (const entry of ALL_KNOWLEDGE) {
    // Skip AYUSH entries for general chat and vice versa if needed
    // (but allow all — users may ask about anything)

    let score = 0;
    for (const keyword of entry.keywords) {
      if (lower.includes(keyword.toLowerCase())) {
        score += keyword.length; // Longer keywords = more specific match
      }
    }

    if (score > bestScore) {
      bestScore = score;
      bestResponse = entry.response;
    }
  }

  return null; // Caller handles this
}

export function getResponseForLanguage(
  response: Record<string, string>,
  language: string
): string {
  return response[language] || response["en"] || Object.values(response)[0];
}
