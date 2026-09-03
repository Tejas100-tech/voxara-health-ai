// ── MCQ Options for Clinical Questions ─────────────────────────────────────
// Each question maps to 3-4 quick-tap options + "Other" free-text fallback

export type MCQSet = { question: string; options: string[] };

// ── English Allopathic MCQs ───────────────────────────────────────────────
const allopathicMCQs: MCQSet[] = [
  {
    question: "What is the main problem that brought you here today?",
    options: ["Chest pain", "Fever", "Headache", "Stomach pain", "Breathing difficulty", "Body pain"],
  },
  {
    question: "When did this problem start?",
    options: ["Today", "2-3 days ago", "About a week ago", "More than a week ago", "Several weeks/months ago", "It comes and goes"],
  },
  {
    question: "Have you had this problem before?",
    options: ["No, first time", "Yes, same problem before", "Similar problem before", "Not sure"],
  },
  {
    question: "Do you have any known allergies?",
    options: ["No known allergies", "Drug allergy", "Food allergy", "Dust/pollen allergy", "Skin allergy", "Not sure"],
  },
  {
    question: "Are you currently taking any medications?",
    options: ["No medications", "Blood pressure medicines", "Diabetes medicines", "Painkillers", "Antibiotics", "Multiple medications"],
  },
  {
    question: "Do you have diabetes, hypertension, or heart disease?",
    options: ["No chronic illness", "Diabetes only", "Hypertension only", "Heart disease", "Diabetes + Hypertension", "Multiple conditions"],
  },
  {
    question: "Is there any illness in your family?",
    options: ["No family illness", "Diabetes in family", "Heart disease in family", "Cancer in family", "Hypertension in family", "Not sure"],
  },
  {
    question: "Do you smoke or drink alcohol?",
    options: ["Neither", "Smoke only", "Drink only", "Both", "Former user (quit)"],
  },
  {
    question: "Have you had any surgeries in the past?",
    options: ["No surgeries", "Appendectomy", "Gallbladder removal", "Cesarean section", "Other surgery"],
  },
  {
    question: "What is your occupation?",
    options: ["Desk/office work", "Physical/manual labor", "Healthcare worker", "Student", "Homemaker", "Retired"],
  },
];

// ── English AYUSH MCQs ────────────────────────────────────────────────────
const ayushMCQs: MCQSet[] = [
  {
    question: "What is your body build?",
    options: ["Thin/light (Vata type)", "Medium/balanced (Pitta type)", "Heavy/broad (Kapha type)", "Mixed — hard to say"],
  },
  {
    question: "How is your appetite and digestion?",
    options: ["Good appetite, fast digestion", "Variable — sometimes good, sometimes poor", "Slow digestion, feel heavy after meals", "Very strong appetite, always hungry"],
  },
  {
    question: "What is the main problem today?",
    options: ["Pain (joint/body)", "Digestive issue", "Skin problem", "Respiratory issue", "Mental stress/anxiety", "Other"],
  },
  {
    question: "When did this problem start and what caused it?",
    options: ["After dietary change", "After stress/emotional event", "Seasonal change", "After illness/infection", "No clear cause", "Not sure"],
  },
  {
    question: "How is your skin, hair, and nails?",
    options: ["Dry skin, thin hair", "Oily skin, normal hair", "Good/healthy overall", "Dull skin, hair fall", "Acne or skin eruptions"],
  },
  {
    question: "How is your physical endurance?",
    options: ["Good — can do heavy work", "Moderate — tire after some activity", "Low — get tired easily", "Variable — depends on the day"],
  },
  {
    question: "What is your approximate height and weight?",
    options: ["Average build", "Tall and lean", "Short and stocky", "Overweight", "Underweight"],
  },
  {
    question: "How well do you adapt to changes?",
    options: ["Adapt easily to most changes", "Struggle with weather changes", "Struggle with food changes", "Prefer routine — hate change"],
  },
  {
    question: "How is your mental state?",
    options: ["Calm and focused", "Anxious or worried", "Irritable", "Good memory, clear thinking", "Forgetful or foggy"],
  },
  {
    question: "How is your digestive fire (Agni)?",
    options: ["Strong — digest everything well", "Variable — sometimes weak", "Weak — always bloated/gassy", "Irregular appetite"],
  },
  {
    question: "How much exercise do you do?",
    options: ["Regular exercise (daily)", "Some activity (walk/yoga)", "Occasional exercise", "Sedentary — no exercise"],
  },
  {
    question: "What is your age group?",
    options: ["Young adult (18-30)", "Middle-aged (30-50)", "Senior (50-70)", "Elderly (70+)"],
  },
  {
    question: "What does your daily diet look like?",
    options: ["Vegetarian", "Non-vegetarian", "Mixed diet", "Fasting regularly", "Irregular meals"],
  },
  {
    question: "What is your daily routine?",
    options: ["Early riser, structured", "Night owl, irregular", "Shift work", "Moderate — 6-7 hours sleep"],
  },
  {
    question: "What is your occupation and activity level?",
    options: ["Active/physical job", "Moderate activity", "Desk job / sedentary", "Retired / light activity"],
  },
  {
    question: "Any specific dietary rules or patterns?",
    options: ["No restrictions", "Prefer warm foods", "Prefer cold/raw foods", "Avoid spicy food", "Seasonal eating"],
  },
];

// ── English Rapid Track MCQs ──────────────────────────────────────────────
const rapidMCQs: MCQSet[] = [
  {
    question: "What is the main problem that brought you here today?",
    options: ["Chest pain", "Fever", "Headache", "Stomach pain", "Body pain", "Breathing problem", "Cough/cold", "Injury"],
  },
  {
    question: "Are there any warning signs?",
    options: ["No warning signs", "Severe pain", "Difficulty breathing", "Bleeding", "High fever", "Chest tightness", "Dizziness"],
  },
  {
    question: "Are you taking any current medications?",
    options: ["No medications", "Blood pressure pills", "Diabetes pills", "Painkillers", "Antibiotics", "Other medicines"],
  },
];

// ── Hindi MCQs ────────────────────────────────────────────────────────────
const hindiAllopathicMCQs: MCQSet[] = [
  {
    question: "आज आपको यहाँ लाने वाली मुख्य समस्या क्या है?",
    options: ["सीने में दर्द", "बुखार", "सिरदर्द", "पेट में दर्द", "सांस लेने में तकलीफ", "शरीर में दर्द"],
  },
  {
    question: "यह समस्या कब शुरू हुई?",
    options: ["आज ही", "2-3 दिन पहले", "लगभग एक हफ्ते पहले", "एक हफ्ते से ज्यादा", "कई हफ्ते/महीने पहले", "आती-जाती रहती है"],
  },
  {
    question: "क्या आपको पहले भी यही समस्या हुई है?",
    options: ["नहीं, पहली बार", "हाँ, पहले भी हुई", "इसी तरह की समस्या", "पता नहीं"],
  },
  {
    question: "क्या आपको कोई ज्ञात एलर्जी है?",
    options: ["कोई एलर्जी नहीं", "दवा की एलर्जी", "खाने की एलर्जी", "धूल/पराग की एलर्जी", "त्वचा की एलर्जी", "पता नहीं"],
  },
  {
    question: "क्या आप कोई दवाएँ ले रहे हैं?",
    options: ["कोई दवाई नहीं", "ब्लड प्रेशर की दवाई", "शुगर की दवाई", "दर्द की दवाई", "एंटीबायोटिक", "कई दवाएँ"],
  },
  {
    question: "क्या आपको मधुमेह, उच्च रक्तचाप, या हृदय रोग है?",
    options: ["कोई बीमारी नहीं", "सिर्फ मधुमेह", "सिर्फ उच्च रक्तचाप", "हृदय रोग", "मधुमेह + उच्च रक्तचाप", "कई बीमारियाँ"],
  },
  {
    question: "क्या आपके परिवार में कोई बीमारी है?",
    options: ["परिवार में कोई बीमारी नहीं", "मधुमेह", "हृदय रोग", "कैंसर", "उच्च रक्तचाप", "पता नहीं"],
  },
  {
    question: "क्या आप धूम्रपान या शराब का सेवन करते हैं?",
    options: ["दोनों नहीं", "सिर्फ धूम्रपान", "सिर्फ शराब", "दोनों", "पहले करता था, अब छोड़ दिया"],
  },
  {
    question: "क्या आपका अतीत में कोई ऑपरेशन हुआ है?",
    options: ["कोई ऑपरेशन नहीं", "एपेंडिक्स", "पित्ताशय हटाना", "सिजेरियन", "अन्य ऑपरेशन"],
  },
  {
    question: "आपका व्यवसाय क्या है?",
    options: ["ऑफिस/डेस्क काम", "शारीरिक/मैनुअल काम", "स्वास्थ्यकर्मी", "विद्यार्थी", "गृहिणी", "सेवानिवृत्त"],
  },
];

// ── Hindi AYUSH MCQs ──────────────────────────────────────────────────────
const hindiAyushMCQs: MCQSet[] = [
  {
    question: "आपका शरीर कैसा है — पतला, मध्यम, या भारी?",
    options: ["पतला/हल्का (वात प्रकृति)", "मध्यम/संतुलित (पित्त प्रकृति)", "भारी/चौड़ा (कफ प्रकृति)", "मिश्रित — कह नहीं सकते"],
  },
  {
    question: "आपकी भूख और पाचन कैसा है?",
    options: ["अच्छी भूख, तेज़ पाचन", "अनियमित — कभी अच्छा कभी खराब", "धीमा पाचन, खाने के बाद भारीपन", "बहुत तेज़ भूख, हमेशा भूखा"],
  },
  {
    question: "आज आपकी मुख्य समस्या क्या है?",
    options: ["दर्द (जोड़/शरीर)", "पाचन संबंधी समस्या", "त्वचा की समस्या", "श्वसन संबंधी समस्या", "मानसिक तनाव/चिंता", "अन्य"],
  },
  {
    question: "यह समस्या कब शुरू हुई?",
    options: ["आहार में बदलाव के बाद", "तनाव/भावनात्मक घटना के बाद", "मौसम बदलाव से", "बीमारी/संक्रमण के बाद", "कोई स्पष्ट कारण नहीं", "पता नहीं"],
  },
  {
    question: "आपकी त्वचा, बाल और नाखून कैसे हैं?",
    options: ["शुष्क त्वचा, पतले बाल", "तैलीय त्वचा, सामान्य बाल", "अच्छे/स्वस्थ", "बेजान त्वचा, बाल झड़ना", "मुंहासे या त्वचा फोड़े"],
  },
  {
    question: "आपकी शारीरिक सहनशक्ति कैसी है?",
    options: ["अच्छी — भारी काम कर सकता हूँ", "मध्यम — कुछ गतिविधि के बाद थक जाता हूँ", "कम — जल्दी थक जाता हूँ", "अनियमित"],
  },
  {
    question: "आपकी ऊँचाई और वजन कितना है?",
    options: ["औसत कद का", "लंबा और दुबला", "छोटा और मोटा", "अधिक वजन", "कम वजन"],
  },
  {
    question: "मौसम, खाना या दिनचर्या में बदलाव के प्रति आप कितने अनुकूल हैं?",
    options: ["ज्यादातर बदलावों में ढल जाता हूँ", "मौसम बदलाव में परेशानी", "खाने में बदलाव में परेशानी", "नियम पसंद — बदलाव नहीं"],
  },
  {
    question: "आपकी मानसिक स्थिति कैसी है?",
    options: ["शांत और एकाग्र", "चिंतित या परेशान", "चिड़चिड़ा", "अच्छी याददाश्त", "भूलने वाला या धुंधला"],
  },
  {
    question: "आपकी अग्नि (पाचन शक्ति) कैसी है?",
    options: ["मजबूत — सब कुछ पचा लेता हूँ", "अनियमित — कभी कमज़ोर", "कमज़ोर — हमेशा पेट फूलता/गैस", "अनियमित भूख"],
  },
  {
    question: "आप रोज़ कितना व्यायाम करते हैं?",
    options: ["नियमित व्यायाम (रोज़)", "कुछ गतिविधि (चहलकदमी/योग)", "कभी-कभी व्यायाम", "बिल्कुल नहीं — बैठने वाला काम"],
  },
  {
    question: "आपकी उम्र क्या है?",
    options: ["युवा (18-30)", "मध्यम आयु (30-50)", "वरिष्ठ (50-70)", "बुज़ुर्ग (70+)"],
  },
  {
    question: "आपकी दैनिक आहार कैसा है?",
    options: ["शाकाहारी", "मांसाहारी", "मिश्रित आहार", "नियमित उपवास", "अनियमित भोजन"],
  },
  {
    question: "आपकी दैनिक दिनचर्या कैसी है?",
    options: ["जल्दी उठने वाला, व्यवस्थित", "रात का जागरूक, अनियमित", "शिफ्ट काम", "मध्यम — 6-7 घंटे नींद"],
  },
  {
    question: "आपका व्यवसाय और गतिविधि स्तर क्या है?",
    options: ["सक्रिय/शारीरिक काम", "मध्यम गतिविधि", "डेस्क काम / बैठने वाला", "सेवानिवृत्त / हल्की गतिविधि"],
  },
  {
    question: "क्या आप किसी विशेष आहार नियम का पालन करते हैं?",
    options: ["कोई प्रतिबंध नहीं", "गर्म खाना पसंद", "ठंडा/कच्चा खाना पसंद", "मसालेदार खाना नहीं", "मौसमी खाना"],
  },
];

const hindiRapidMCQs: MCQSet[] = [
  {
    question: "आज आपको यहाँ लाने वाली मुख्य समस्या क्या है?",
    options: ["सीने में दर्द", "बुखार", "सिरदर्द", "पेट में दर्द", "शरीर में दर्द", "सांस लेने में तकलीफ", "खांसी/जुकाम", "चोट"],
  },
  {
    question: "क्या कोई चेतावनी संकेत हैं?",
    options: ["कोई चेतावनी नहीं", "तीव्र दर्द", "सांस लेने में कठिनाई", "खून बहना", "तेज बुखार", "सीने में जकड़न", "चक्कर आना"],
  },
  {
    question: "क्या आप कोई मौजूदा दवाएँ ले रहे हैं?",
    options: ["कोई दवाई नहीं", "ब्लड प्रेशर की गोली", "शुगर की गोली", "दर्द की दवाई", "एंटीबायोटिक", "अन्य दवाएँ"],
  },
];

// ── Get MCQs for a language and mode ──────────────────────────────────────
export function getMCQOptions(
  language: string,
  mode: string,
  track: string,
  questionIndex: number
): string[] | null {
  // Hindi
  if (language === "hi") {
    if (track === "rapid") {
      return hindiRapidMCQs[questionIndex]?.options || null;
    }
    if (mode === "ayush") {
      return hindiAyushMCQs[questionIndex]?.options || null;
    }
    return hindiAllopathicMCQs[questionIndex]?.options || null;
  }

  // English (default)
  if (track === "rapid") {
    return rapidMCQs[questionIndex]?.options || null;
  }
  if (mode === "ayush") {
    return ayushMCQs[questionIndex]?.options || null;
  }
  return allopathicMCQs[questionIndex]?.options || null;
}

// Get MCQs for all questions at once (for frontend pre-loading)
export function getAllMCQOptions(
  language: string,
  mode: string,
  track: string
): (string[] | null)[] {
  const maxQ = track === "rapid" ? 3 : mode === "ayush" ? 16 : 10;
  const result: (string[] | null)[] = [];
  for (let i = 0; i < maxQ; i++) {
    result.push(getMCQOptions(language, mode, track, i));
  }
  return result;
}
