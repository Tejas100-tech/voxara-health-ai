import { Router } from "express";
import { logger } from "../lib/logger";
import { generateWithLuna } from "../lib/gpt-luna";
import { DISEASE_KNOWLEDGE, MEDICATION_KNOWLEDGE, EMERGENCY_KNOWLEDGE, DIET_KNOWLEDGE, AYUSH_KNOWLEDGE, getResponseForLanguage } from "../lib/medical-knowledge";
import { EXTRA_MEDICATION_KNOWLEDGE } from "../lib/medications-extra";
import { MEDICINE_DATABASE, DISEASE_MEDICINE_MAP, findMedicine, getMedicinesForDisease, formatMedicineResponse } from "../lib/medicine-database";
import { KAGGLE_DISEASE_KNOWLEDGE, KAGGLE_DISEASE_MAP } from "../lib/kaggle-knowledge";
import { matchCasualConversation, getContextualFallback } from "../lib/casual-conversation";
import { searchTrainingMedications, searchTrainingLabTests, getTrainingConversation } from "../lib/training-knowledge";

const router = Router();

// ── In-memory chat history store ──────────────────────────────────────────
interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
  language?: string;
}

interface ChatSession {
  sessionId: string;
  userId: string;
  chatType: "general" | "ayush";
  language: string;
  messages: ChatMessage[];
  createdAt: string;
  updatedAt: string;
}

const chatSessions: Record<string, ChatSession> = {};

// ── AYUSH-specific knowledge base ────────────────────────────────────────
const AYUSH_RESPONSES: Record<string, Record<string, string[]>> = {
  prakriti: {
    en: [
      "Based on Ayurvedic principles, Prakriti (constitution) is determined at conception and remains constant throughout life. There are three primary Prakriti types:\n\n🔹 **Vata** — Light build, dry skin, creative mind, light sleeper\n🔹 **Pitta** — Medium build, warm body, sharp intellect, strong appetite\n🔹 **Kapha** — Heavy build, smooth skin, calm mind, deep sleeper\n\nMost people have a dominant Prakriti with minor secondary doshas.",
      "To assess your Prakriti, I'll ask about your body frame, skin texture, appetite, sleep patterns, and temperament. This helps create a personalized Ayurvedic treatment plan.",
    ],
    hi: [
      "आयुर्वेदिक सिद्धांतों के अनुसार, प्रकृति (शरीर का संविधान) गर्भाधान के समय निर्धारित होती है। तीन प्राथमिक प्रकृति प्रकार हैं:\n\n🔹 **वात** — हल्का शरीर, शुष्क त्वचा, रचनात्मक मन\n🔹 **पित्त** — मध्यम शरीर, गर्म शरीर, तीक्ष्ण बुद्धि\n🔹 **कफ** — भारी शरीर, चिकनी त्वचा, शांत मन\n\nअधिकांश लोगों में एक प्रमुख प्रकृति होती है।",
    ],
    bn: [
      "আয়ুর্বেদিক নীতি অনুযায়ী, প্রকৃতি (দেহের গঠন) জন্মকালে নির্ধারিত হয়। তিনটি প্রাথমিক প্রকৃতির ধরন রয়েছে:\n\n🔹 **বাত** — হালকা গঠন, শুষ্ক ত্বক, সৃজনশীল মন\n🔹 **পিত্ত** — মাঝারি গঠন, উষ্ণ শরীর, তীক্ষ্ণ বুদ্ধি\n🔹 **কফ** — ভারী গঠন, মসৃণ ত্বক, শান্ত মন\n\nবেশিরভাগ মানুষের একটি প্রধান প্রকৃতি থাকে।",
    ],
    ta: [
      "ஆயுர்வேதக் கொள்கைகளின்படி, பிரகிருதி (உடல் அமைப்பு) கருத்தரிப்பின் போது நிர்ணயிக்கப்படுகிறது. மூன்று முதன்மை பிரகிருதி வகைகள் உள்ளன:\n\n🔹 **வாதா** — இலேசமான உடலமைப்பு, உலர் தோல், படைப்பாற்றல் மனம்\n🔹 **பித்தா** — நடுத்தர உடலமைப்பு, சூடான உடல், கூர்மையான புத்தி\n🔹 **கபா** — கனமான உடலமைப்பு, மென்மையான தோல், அமைதியான மனம்\n\nபெரும்பாலான மக்களுக்கு ஒரு ஆதிக்க பிரகிருதி இருக்கும்.",
    ],
    te: [
      "ఆయుర్వేద సూత్రాల ప్రకారం, ప్రకృతి (శరీర నిర్మాణం) గర్భధారణ సమయంలో నిర్ణయించబడుతుంది. మూడు ప్రాథమిక ప్రకృతి రకాలు ఉన్నాయి:\n\n🔹 **వాత** — తేలికపాటి నిర్మాణం, పొడి చర్మం, సృజనాత్మక మనస్సు\n🔹 **పిత్త** — మధ్యస్థ నిర్మాణం, వేడి శరీరం, పదునైన బుద్ధి\n🔹 **కఫ** — బరువైన నిర్మాణం, మృదువైన చర్మం, ప్రశాంత మనస్సు\n\nచాలా మందికి ఒక ప్రధాన ప్రకృతి ఉంటుంది.",
    ],
    mr: [
      "आयुर्वेदिक तत्त्वांनुसार, प्रकृती (शरीर रचना) गर्भधारणेच्या वेळी निश्चित केली जाते. तीन प्राथमिक प्रकृती प्रकार आहेत:\n\n🔹 **वात** — हलके शरीर, कोरडे त्वचा, सर्जनशील मन\n🔹 **पित्त** — मध्यम शरीर, उबदार शरीर, तीक्ष्ण बुद्धी\n🔹 **कफ** — जड शरीर, गुंडीसर त्वचा, शांत मन\n\nबहुतांश लोकांमध्ये एक प्रमुख प्रकृती असते.",
    ],
    gu: [
      "આયુર્વેદિક સિદ્ધાંતો મુજબ, પ્રકૃતિ (શરીર રચના) ગર્ભાધાન સમયે નક્કી થાય છે. ત્રણ પ્રાથમિક પ્રકૃતિ પ્રકારો છે:\n\n🔹 **વાત** — હલકું શરીર, સૂકી ત્વચા, સર્જનાત્મક મન\n🔹 **પિત્ત** — મધ્યમ શરીર, ગરમ શરીર, તીખી બુદ્ધિ\n🔹 **કફ** — ભારે શરીર, સ્મૂથ ત્વચા, શાંત મન\n\nમોટાભાગના લોકોમાં એક પ્રમુખ પ્રકૃતિ હોય છે.",
    ],
    kn: [
      "ಆಯುರ್ವೇದ ತತ್ವಗಳ ಪ್ರಕಾರ, ಪ್ರಕೃತಿ (ದೇಹ ರಚನೆ) ಗರ್ಭಧಾರಣೆಯ ಸಮಯದಲ್ಲಿ ನಿರ್ಧರಿಸಲಾಗುತ್ತದೆ. ಮೂರು ಪ್ರಾಥಮಿಕ ಪ್ರಕೃತಿ ಪ್ರಕಾರಗಳಿವೆ:\n\n🔹 **ವಾತ** — ಹಗುರ ದೇಹ, ಒಣ ಚರ್ಮ, ಸೃಜನಶೀಲ ಮನಸ್ಸು\n🔹 **ಪಿತ್ತ** — ಮಧ್ಯಮ ದೇಹ, ಬಿಸಿ ದೇಹ, ಚುರುಕು ಬುದ್ಧಿ\n🔹 **ಕಫ** — ಭಾರಿ ದೇಹ, ಮೃದು ಚರ್ಮ, ಶಾಂತ ಮನಸ್ಸು\n\nಹೆಚ್ಚಿನ ಜನರಿಗೆ ಒಂದು ಪ್ರಮುಖ ಪ್ರಕೃತಿ ಇರುತ್ತದೆ.",
    ],
    ml: [
      "ആയുർവേദ തത്വങ്ങൾ അനുസരിച്ച്, പ്രകൃതി (ശരീര ഘടന) ഗർഭധാരണ സമയത്ത് നിർണ്ണയിക്കപ്പെടുന്നു. മൂന്ന് പ്രാഥമിക പ്രകൃതി തരങ്ങൾ ഉണ്ട്:\n\n🔹 **വാത** — ലഘുവായ ശരീരം, ഉണങ്ങിയ ചർമ്മം, സർഗാത്മക മനസ്സ്\n🔹 **പിത്ത** — മധ്യമ ശരീരം, ചൂടുള്ള ശരീരം, മൂർഷിത ബുദ്ധി\n🔹 **കഫ** — ഭാരമുള്ള ശരീരം, മൃദുവായ ചർമ്മം, ശാന്ത മനസ്സ്\n\nമിക്ക ആളുകൾക്കും ഒരു പ്രധാന പ്രകൃതി ഉണ്ടായിരിക്കും.",
    ],
    pa: [
      "ਆਯੁਰਵੇਦਿਕ ਸਿਧਾਂਤਾਂ ਅਨੁਸਾਰ, ਪ੍ਰਕ੍ਰਿਤੀ (ਸਰੀਰ ਦੀ ਰਚਨਾ) ਗਰਭਾਧਾਨ ਦੇ ਸਮੇਂ ਨਿਰਧਾਰਤ ਹੁੰਦੀ ਹੈ। ਤਿੰਨ ਮੁੱਖ ਪ੍ਰਕ੍ਰਿਤੀ ਪ੍ਰਕਾਰ ਹਨ:\n\n🔹 **ਵਾਤ** — ਹਲਕਾ ਸਰੀਰ, ਸੁੱਕੀ ਚਮੜੀ, ਰਚਨਾਤਮਕ ਮਨ\n🔹 **ਪਿੱਤ** — ਮੱਧਮ ਸਰੀਰ, ਗਰਮ ਸਰੀਰ, ਤਿੱਖੀ ਬੁੱਧੀ\n🔹 **ਕਫ** — ਭਾਰਾ ਸਰੀਰ, ਚਿਕਨੀ ਚਮੜੀ, ਸ਼ਾਂਤ ਮਨ\n\nਬਹੁਤੇ ਲੋਕਾਂ ਵਿੱਚ ਇੱਕ ਪ੍ਰਮੁੱਖ ਪ੍ਰਕ੍ਰਿਤੀ ਹੁੰਦੀ ਹੈ।",
    ],
    or: [
      "ଆୟୁର୍ବେଦିକ ନୀତି ଅନୁସାରେ, ପ୍ରକୃତି (ଶରୀର ଗଠନ) ଗର୍ଭାଧାରଣ ସମୟରେ ନିର୍ଦ୍ଧାରିତ ହୁଏ। ତିନୋଟି ପ୍ରାଥମିକ ପ୍ରକୃତି ପ୍ରକାର ଅଛି:\n\n🔹 **ବାତ** — ହାଲୁକା ଶରୀର, ଶୁଷ୍କ ଚର୍ମ, ସୃଜନଶୀଳ ମନ\n🔹 **ପିତ୍ତ** — ମଧ୍ୟମ ଶରୀର, ଉଷ୍ମ ଶରୀର, ତୀକ୍ଷ୍ଣ ବୁଦ୍ଧି\n🔹 **କଫ** — ଭାରୀ ଶରୀର, ସ୍ମୁଥ ଚର୍ମ, ଶାନ୍ତ ମନ\n\nଅଧିକାଂଶ ଲୋକଙ୍କର ଗୋଟିଏ ପ୍ରଧାନ ପ୍ରକୃତି ଥାଏ।",
    ],
    ur: [
      "آیورویدیک اصولوں کے مطابق، پرکرتی (جسمانی ساخت) حمل کے وقت مقرر ہوتی ہے۔ تین بنیادی پرکرتی کیقسام ہیں:\n\n🔹 **واٹ** — ہلکا جسم، خشک جلد، تخلیقی ذہن\n🔹 **پت** — درمیانی جسم، گرم جسم، تیز ذہن\n🔹 **کف** — بھاری جسم، ہموار جلد، پرسکون ذہن\n\nزیادہ تر لوگوں میں ایک غالب پرکرتی ہوتی ہے۔",
    ],
  },
  agni: {
    en: [
      "**Agni** (digestive fire) is central to Ayurvedic health. Types include:\n\n🔹 **Sama Agni** — Balanced digestion (ideal)\n🔹 **Vishama Agni** — Irregular digestion (Vata type)\n🔹 **Tikshna Agni** — Hyperactive digestion (Pitta type)\n🔹 **Manda Agni** — Slow digestion (Kapha type)\n\nStrong Agni = good health. Weak Agni = toxin (Ama) accumulation.",
    ],
    hi: [
      "**अग्नि** (पाचन अग्नि) आयुर्वेदिक स्वास्थ्य का केंद्र है। प्रकार:\n\n🔹 **सम अग्नि** — संतुलित पाचन (आदर्श)\n🔹 **विषम अग्नि** — अनियमित पाचन\n🔹 **तीक्ष्ण अग्नि** — अतिसक्रिय पाचन\n🔹 **मंद अग्नि** — मंद पाचन\n\nमजबूत अग्नि = अच्छा स्वास्थ्य।",
    ],
  },
  vikriti: {
    en: [
      "**Vikriti** (current imbalance) is what we assess during consultation. While Prakriti is your birth constitution, Vikriti shows how your current lifestyle has shifted your dosha balance.\n\nWe look at:\n🔹 Current symptoms vs. baseline\n🔹 Tongue coating, pulse quality\n🔹 Sleep, energy, and appetite changes\n\nTreatment aims to restore Vikriti back toward Prakriti.",
    ],
    hi: [
      "**विकृति** (वर्तमान असंतुलन) परामर्श के दौरान मूल्यांकन किया जाता है। जबकि प्रकृति आपका जन्मजात संविधान है, विकृति दिखाता है कि आपकी वर्तमान जीवनशैली ने आपके दोष संतुलन को कैसे बदला है।",
    ],
  },
  herbs: {
    en: [
      "**Common Ayurvedic Herbs & Their Uses:**\n\n🌿 **Ashwagandha** — Adaptogen, reduces stress, improves sleep\n🌿 **Brahmi** — Brain tonic, improves memory & focus\n🌿 **Triphala** — Digestive cleanser (Amalaki + Bibhitaki + Haritaki)\n🌿 **Shatavari** — Female reproductive health\n🌿 **Guduchi (Giloy)** — Immunity booster, anti-inflammatory\n🌿 **Yashtimadhu** — Soothes acidity & gastric issues\n\nAlways consult a qualified Vaidya before starting herbs.",
    ],
    hi: [
      "**सामान्य आयुर्वेदिक जड़ी-बूटियाँ:**\n\n🌿 **अश्वगंधा** — अनुकूलक, तनाव कम करता है\n🌿 **ब्राह्मी** — मस्तिष्क टॉनिक, स्मृति में सुधार\n🌿 **त्रिफला** — पाचन शुद्धिकारक\n🌿 **शतावरी** — महिला प्रजनन स्वास्थ्य\n🌿 **गुडूची (गिलोय)** — प्रतिरक्षा बूस्टर\n🌿 **यष्टिमधु** — अम्लता और गैस्ट्रिक समस्याओं के लिए",
    ],
  },
  lifestyle: {
    en: [
      "**Ayurvedic Daily Routine (Dinacharya) Recommendations:**\n\n🌅 **Morning** — Wake before sunrise, tongue scraping, warm water\n🧘 **Exercise** — 30 min moderate activity suited to your dosha\n🍽️ **Diet** — Largest meal at noon when Agni is strongest\n🛁 **Evening** — Warm oil massage (Abhyanga), warm bath\n😴 **Sleep** — By 10 PM, 7-8 hours\n\nConsistency in routine is more important than perfection.",
    ],
    hi: [
      "**आयुर्वेदिक दिनचर्या सिफारिशें:**\n\n🌅 **सुबह** — सूर्योदय से पहले उठें, जीभ साफ करें\n🧘 **व्यायाम** — 30 मिनट मध्यम गतिविधि\n🍽️ **आहार** — दोपहर का भोजन सबसे बड़ा हो\n🛁 **शाम** — गर्म तेल मालिश\n😴 **नींद** — रात 10 बजे तक, 7-8 घंटे",
    ],
  },
};

// ── General health knowledge ─────────────────────────────────────────────
const GENERAL_RESPONSES: Record<string, Record<string, string>> = {
  greeting: {
    en: "Hello! I'm your MediKiosk General Health Assistant. I can help you with:\n\n🩺 General health questions\n💊 Medication information\n🥗 Diet & nutrition advice\n🏥 Finding the right specialist\n📋 Understanding your symptoms\n\nWhat would you like to know?",
    hi: "नमस्ते! मैं आपका MediKiosk सामान्य स्वास्थ्य सहायक हूँ। मैं आपकी मदद कर सकता हूँ:\n\n🩺 सामान्य स्वास्थ्य प्रश्न\n💊 दवा की जानकारी\n🥗 आहार और पोषण सलाह\n🏥 सही विशेषज्ञ खोजना\n📋 आपके लक्षणों को समझना\n\nआप क्या जानना चाहेंगे?",
    mr: "नमस्कार! मी तुमचा MediKiosk सामान्य आरोग्य सहायक आहे. मी तुम्हाला मदत करू शकतो:\n\n🩺 सामान्य आरोग्य प्रश्न\n💊 औषध माहिती\n🥗 आहार आणि पोषण सल्ला\n🏥 योग्य तज्ञ शोधणे\n📋 तुमचे लक्षणे समजून घेणे\n\nतुम्हाला काय जाणून आहे?",
    bn: "নমস্কার! আমি আপনার MediKiosk সাধারণ স্বাস্থ্য সহায়ক। আমি আপনাকে সাহায্য করতে পারি:\n\n🩺 সাধারণ স্বাস্থ্য প্রশ্ন\n💊 ওষুধ তথ্য\n🥗 খাদ্য ও পুষ্টি পরামর্শ\n🏥 সঠিক বিশেষজ্ঞ খুঁজে পেতে\n📋 আপনার উপসর্গ বোঝা\n\nআপনি কী জানতে চান?",
    ta: "வணக்கம்! நான் உங்கள் MediKiosk பொது சுகாதார உதவியாளர். நான் உங்களுக்கு உதவ முடியும்:\n\n🩺 பொது சுகாதார கேள்விகள்\n💊 மருந்து தகவல்\n🥗 உணவு மற்றும் ஊட்டச்சத்து ஆலோசனை\n🏥 சரியான நிபுணரைக் கண்டறிய\n📋 உங்கள் அறிகுறிகளைப் புரிந்துகொள்ள\n\nநீங்கள் என்ன அறிய விரும்புகிறீர்கள்?",
    te: "నమస్కారం! నేను మీ MediKiosk సాధారణ ఆరోగ్య సహాయకుడిని. నేను మీకు సహాయం చేయగలను:\n\n🩺 సాధారణ ఆరోగ్య ప్రశ్నలు\n💊 మందుల సమాచారం\n🥗 ఆహారం మరియు పోషకాహార సలహా\n🏥 సరైన నిపుణుడిని కనుగొనడానికి\n📋 మీ లక్షణాలను అర్థం చేసుకోవడానికి\n\nమీరు ఏమి తెలుసుకోవాలనుకుంటున్నారు?",
    gu: "નમસ્તે! હું તમારો MediKiosk સામાન્ય આરોગ્ય સહાયક છું. હું તમને મદદ કરી શકું છું:\n\n🩺 સામાન્ય આરોગ્ય પ્રશ્નો\n💊 દવા માહિતી\n🥗 આહાર અને પોષણ સલાહ\n🏥 યોગ્ય નિષ્ણાત શોધવા માટે\n📋 તમારા લક્ષણો સમજવા માટે\n\nતમે શું જાણવા માંગો છો?",
    kn: "ನಮಸ್ಕಾರ! ನಾನು ನಿಮ್ಮ MediKiosk ಸಾಮಾನ್ಯ ಆರೋಗ್ಯ ಸಹಾಯಕ. ನಾನು ನಿಮಗೆ ಸಹಾಯ ಮಾಡಬಲ್ಲೆ:\n\n🩺 ಸಾಮಾನ್ಯ ಆರೋಗ್ಯ ಪ್ರಶ್ನೆಗಳು\n💊 ಔಷಧ ಮಾಹಿತಿ\n🥗 ಆಹಾರ ಮತ್ತು ಪೋಷಕಾಂಶ ಸಲಹೆ\n🏥 ಸರಿಯಾದ ತಜ್ಞರನ್ನು ಹುಡುಗಲು\n📋 ನಿಮ್ಮ ಲಕ್ಷಣಗಳನ್ನು ಅರ್ಥಮಾಡಿಕೊಳ್ಳಲು\n\nನೀವು ಏನು ತಿಳಿಯಬೇಕು?",
    ml: "നമസ്കാരം! ഞാൻ നിങ്ങളുടെ MediKiosk സാധാരണ ആരോഗ്യ സഹായകൻ ആണ്. ഞാൻ നിങ്ങളെ സഹായിക്കാം:\n\n🩺 സാധാരണ ആരോഗ്യ ചോദ്യങ്ങൾ\n💊 മരുന്ന് വിവരം\n🥗 ഭക്ഷണം പോഷകാഹാര ഉപദേശം\n🏥 ശരിയായ സ്പെഷ്യലിസ്റ്റിനെ കണ്ടെത്താൻ\n📋 നിങ്ങളുടെ ലക്ഷണങ്ങൾ മനസ്സിലാക്കാൻ\n\nനിങ്ങൾ എന്താണ് അറിയാൻ ആഗ്രഹിക്കുന്നത്?",
    pa: "ਸਤਿ ਸ੍ਰੀ ਅਕਾਲ! ਮੈਂ ਤੁਹਾਡਾ MediKiosk ਸਧਾਰਨ ਸਿਹਤ ਸਹਾਇਕ ਹਾਂ। ਮੈਂ ਤੁਹਾਡੀ ਮਦਦ ਕਰ ਸਕਦਾ ਹਾਂ:\n\n🩺 ਸਧਾਰਨ ਸਿਹਤ ਸਵਾਲ\n💊 ਦਵਾਈ ਜਾਣਕਾਰੀ\n🥗 ਭੋਜਨ ਅਤੇ ਪੋਸ਼ਣ ਸਲਾਹ\n🏥 ਸਹੀ ਮਾਹਰ ਲੱਭਣ ਲਈ\n📋 ਤੁਹਾਡੇ ਲੱਛਣ ਸਮਝਣ ਲਈ\n\nਤੁਸੀਂ ਕੀ ਜਾਣਨਾ ਚਾਹੁੰਦੇ ਹੋ?",
    or: "ନମସ୍କାର! ମୁଁ ଆପଣଙ୍କ MediKiosk ସାଧାରଣ ସ୍ୱାସ୍ଥ୍ୟ ସହାୟକ। ମୁଁ ଆପଣଙ୍କୁ ସାହାଯ୍ୟ କରିପାରିବି:\n\n🩺 ସାଧାରଣ ସ୍ୱାସ୍ଥ୍ୟ ପ୍ରଶ୍ନ\n💊 ଔଷଧ ସୂଚନା\n🥗 ଖାଦ୍ୟ ଏବଂ ପୋଷଣ ପରାମର୍ଶ\n🏥 ସଠିକ୍ ବିଶେଷଜ୍ଞ ଖୋଜିବା ପାଇଁ\n📋 ଆପଣଙ୍କ ଲକ୍ଷଣ ବୁଝିବା ପାଇଁ\n\nଆପଣ କଣ ଜାଣିବାକୁ ଚାହୁଁଛନ୍ତି?",
  },
  fever: {
    en: "**Fever Management:**\n\n🔹 Rest and stay hydrated — drink plenty of water, ORS, or warm fluids\n🔹 Monitor temperature every 2-4 hours\n🔹 Take paracetamol (500-650mg) if temperature exceeds 100.4°F (38°C)\n🔹 Use light clothing — don't bundle up\n🔹 Apply cold compress to forehead\n\n**Seek immediate care if:**\n⚠️ Fever > 103°F (39.4°C)\n⚠️ Fever lasting > 3 days\n⚠️ Severe headache, rash, or stiff neck\n⚠️ Difficulty breathing\n\n⚠️ *This is general guidance, not a diagnosis. Please consult your doctor.*",
    hi: "**बुखार प्रबंधन:**\n\n🔹 आराम करें और पानी पिएं\n🔹 हर 2-4 घंटे में तापमान जांचें\n🔹 तापमान 100.4°F से अधिक हो तो पैरासिटामोल लें\n🔹 हल्के कपड़े पहनें\n🔹 माथे पर ठंडा सेक लगाएं\n\n**तुरंत देखभाल लें यदि:**\n⚠️ बुखार > 103°F\n⚠️ 3 दिन से अधिक बुखार\n⚠️ तेज सिरदर्द या गर्दन अकड़ना\n⚠️ सांस लेने में कठिनाई",
    mr: "**ज्वर व्यवस्थापन:**\n\n🔹 आराम करा आणि पाणी प्या\n🔹 दर 2-4 तासांनी तापमान तपासा\n🔹 तापमान 100.4°F पेक्षा जास्त असल्यास पॅरासिटामोल घ्या\n🔹 हलके कपडे घाला\n\n**तातडीने देखभाल घ्या जर:**\n⚠️ ज्वर > 103°F\n⚠️ 3 दिवसांपेक्षा जास्त ज्वर\n⚠️ तीव्र डोकेदुखण\n\n⚠️ *हे सामान्य मार्गदर्शन आहे, निदान नाही.*",
    bn: "**জ্বর ব্যবস্থাপনা:**\n\n🔹 বিশ্রাম নিন এবং পানি পান করুন\n🔹 প্রতি 2-4 ঘণ্টায় তাপমান পরীক্ষা করুন\n🔹 তাপমান 100.4°F এর বেশি হলে প্যারাসিটামল নিন\n🔹 হালকা কাপড় পরুন\n\n**তাত্ক্ষণিক যত্ন নিন যদি:**\n⚠️ জ্বর > 103°F\n⚠️ 3 দিনের বেশি জ্বর\n⚠️ তীব্র মাথাব্যথা\n\n⚠️ *এটি সাধারণ নির্দেশনা, রোগ নির্ণয় নয়.*",
    ta: "**காய்ச்சல் மேலாண்மை:**\n\n🔹 ஓய்வெடுத்து நீரேற்றம் செய்யுங்கள்\n🔹 ஒவ்வொரு 2-4 மணி நேரத்திற்கும் வெப்பநிலையை கண்காணியுங்கள்\n🔹 வெப்பநிலை 100.4°F ஐ விட அதிகமாக இருந்தால் பாராசிட்டமால் எடுத்துக்கொள்ளுங்கள்\n🔹 லேசான ஆடைகளை அணியுங்கள்\n\n**உடனடி பராமரிப்பு பெறுங்கள் என்றால்:**\n⚠️ காய்ச்சல் > 103°F\n⚠️ 3 நாட்களுக்கு மேல் காய்ச்சல்\n⚠️ கடுமையான தலைவலி\n\n⚠️ *இது பொது வழிகாட்டுதல், நோயறிதல் அல்ல.*",
    te: "**జ్వరం నిర్వహణ:**\n\n🔹 విశ్రాంతి తీసుకోండి మరియు నీరు తాగండి\n🔹 ప్రతి 2-4 గంటలకు ఉష్ణోగ్రత తనిఖీ చేయండి\n🔹 ఉష్ణోగ్రత 100.4°F కంటే ఎక్కువగా ఉంటే పారాసిటమాల్ తీసుకోండి\n🔹 తేలికపాటి బట్టలు ధరించండి\n\n**వెంటనే సంరక్షణ పొందండి:**\n⚠️ జ్వరం > 103°F\n⚠️ 3 రోజులకు పైగా జ్వరం\n⚠️ తీవ్రమైన తలనొప్పి\n\n⚠️ *ఇది సాధారణ మార్గదర్శకత్వం, రోగ నిర్ధారణ కాదు.*",
  },
  diabetes: {
    en: "**Diabetes Management Tips:**\n\n🔹 **Diet** — Control carbohydrate intake, eat whole grains, avoid sugar\n🔹 **Exercise** — 30 min walking daily improves insulin sensitivity\n🔹 **Monitoring** — Check blood sugar regularly (fasting & post-meal)\n🔹 **Medication** — Take medicines on time, never skip doses\n🔹 **Foot Care** — Check feet daily for cuts or sores\n🔹 **Hydration** — Drink water regularly, avoid sugary drinks\n\n**Warning signs to watch:**\n⚠️ Very high blood sugar (>300 mg/dL)\n⚠️ Persistent nausea or vomiting\n⚠️ Confusion or drowsiness\n\n⚠️ *This is general guidance, not a diagnosis.*",
    hi: "**मधुमेह प्रबंधन:**\n\n🔹 **आहार** — कार्बोहाइड्रेट नियंत्रित करें, अनाज खाएं\n🔹 **व्यायाम** — रोज़ 30 मिनट चलें\n🔹 **निगरानी** — नियमित रूप से शर्करा जांचें\n🔹 **दवाएं** — समय पर दवाएं लें\n🔹 **पैरों की देखभाल** — रोज़ जांचें\n\n⚠️ *यह सामान्य मार्गदर्शन है, निदान नहीं।*",
    mr: "**मधुमेह व्यवस्थापन:**\n\n🔹 **आहार** — कार्बोहाइड्रेट नियंत्रित करा\n🔹 **व्यायाम** — रोज़ 30 मिनिटे चाला\n🔹 **निगरानी** — नियमितपणे शर्करा तपासा\n🔹 **औषधे** — वेळेवर औषधे घ्या\n🔹 **पायांची देखभाल** — रोज़ तपासा\n\n⚠️ *हे सामान्य मार्गदर्शन आहे, निदान नाही.*",
    bn: "**ডায়াবেটিস ব্যবস্থাপনা:**\n\n🔹 **খাদ্য** — কার্বোহাইড্রেট নিয়ন্ত্রণ করুন\n🔹 **ব্যায়াম** — প্রতিদিন 30 মিনিট হাঁটুন\n🔹 **পরীক্ষা** — নিয়মিত রক্তে শর্করা পরীক্ষা করুন\n🔹 **ওষুধ** — সময়মতো ওষুধ সেবন করুন\n\n⚠️ *এটি সাধারণ নির্দেশনা, রোগ নির্ণয় নয়.*",
    ta: "**நீரிழிவு மேலாண்மை:**\n\n🔹 **உணவு** — கார்போஹைட்ரேட் உட்கொள்ளலை கட்டுப்படுத்துங்கள்\n🔹 **விளையாட்டு** — தினமும் 30 நிமிடம் நடக்கவும்\n🔹 **கண்காணிப்பு** — தொடர்ந்து இரத்த சர்க்கரையை சரிபார்க்கவும்\n🔹 **மருந்து** — நேரத்தில் மருந்துகளை எடுத்துக்கொள்ளுங்கள்\n\n⚠️ *இது பொது வழிகாட்டுதல், நோயறிதல் அல்ல.*",
    te: "**మధుమేహ నిర్వహణ:**\n\n🔹 **ఆహారం** — కార్బోహైడ్రేట్ సేవనను నియంత్రించండి\n🔹 **వ్యాయామం** — ప్రతిరోజూ 30 నిమిషాలు నడవండి\n🔹 **పరిశీలన** — క్రమం తప్పకుండా రక్తంలో చక్కెర తనిఖీ చేయండి\n🔹 **మందులు** — సమయానికి మందులు తీసుకోండి\n\n⚠️ *ఇది సాధారణ మార్గదర్శకత్వం, రోగ నిర్ధారణ కాదు.*",
  },
  headache: {
    en: "**Headache Relief:**\n\n🔹 **Tension headache** — Rest in dark room, apply cold/warm compress, take paracetamol\n🔹 **Dehydration headache** — Drink water immediately, add ORS\n🔹 **Migraine** — Rest in dark quiet room, apply ice pack to temples\n🔹 **Eye strain** — Take breaks from screens (20-20-20 rule)\n\n**Seek emergency care if:**\n⚠️ Sudden severe 'thunderclap' headache\n⚠️ Headache with fever, stiff neck, or vision changes\n⚠️ Headache after head injury\n⚠️ Headache with confusion or weakness\n\n⚠️ *This is general guidance, not a diagnosis.*",
    hi: "**सिरदर्द राहत:**\n\n🔹 **तनाव सिरदर्द** — अंधेरे कमरे में आराम करें, ठंडा/गर्म सेक लगाएं\n🔹 **निर्जलीकरण** — तुरंत पानी पिएं\n🔹 **माइग्रेन** — अंधेरे शांत कमरे में आराम करें\n\n**आपातकालीन देखभाल लें यदि:**\n⚠️ अचानक तेज सिरदर्द\n⚠️ बुखार, गर्दन अकड़ना, या दृष्टि परिवर्तन\n⚠️ सिर में चोट के बाद सिरदर्द",
    mr: "**डोकेदुखण उपाय:**\n\n🔹 **तणाव डोकेदुखण** — अंधारित खोलीत आराम करा, थंड/उबदार सेक लावा\n🔹 **निर्जलीकरण** — लगेच पाणी प्या\n🔹 **मायग्रेन** — अंधारित शांत खोलीत आराम करा\n\n**तातडीने देखभाल घ्या जर:**\n⚠️ अचानक तीव्र डोकेदुखण\n⚠️ ज्वर, माने आकडणे\n\n⚠️ *हे सामान्य मार्गदर्शन आहे, निदान नाही.*",
    bn: "**মাথাব্যথা উপশম:**\n\n🔹 **টেনশন মাথাব্যথা** — অন্ধকার ঘরে বিশ্রাম নিন\n🔹 **পানিশূন্যতা** — তাৎক্ষণিক পানি পান করুন\n🔹 **মাইগ্রেইন** — অন্ধকার শান্ত ঘরে বিশ্রাম নিন\n\n⚠️ *এটি সাধারণ নির্দেশনা, রোগ নির্ণয় নয়.*",
    ta: "**தலைவலி நிவாரணம்:**\n\n🔹 **பதற்ற தலைவலி** — இருண்ட அறையில் ஓய்வெடுங்கள்\n🔹 **நீர்ச்சத்து குறைபாடு** — உடனடியாக தண்ணீர் குடிக்கவும்\n🔹 **மைக்ரேன்** — இருண்ட அமைதியான அறையில் ஓய்வெடுங்கள்\n\n⚠️ *இது பொது வழிகாட்டுதல், நோயறிதல் அல்ல.*",
    te: "**తలనొప్పి ఉపశమనం:**\n\n🔹 **టెన్షన్ తలనొప్పి** — చీకటి గదిలో విశ్రాంతి తీసుకోండి\n🔹 **నిర్జలీకరణ** — వెంటనే నీరు తాగండి\n🔹 **మైగ్రేన్** — చీకటి ప్రశాంత గదిలో విశ్రాంతి తీసుకోండి\n\n⚠️ *ఇది సాధారణ మార్గదర్శకత్వం, రోగ నిర్ధారణ కాదు.*",
  },
  bp: {
    en: "**Blood Pressure Management:**\n\n🔹 **Normal**: Less than 120/80 mmHg\n🔹 **Elevated**: 120-129 / less than 80\n🔹 **High Stage 1**: 130-139 / 80-89\n🔹 **High Stage 2**: 140+ / 90+\n🔹 **Crisis**: 180+ / 120+ (EMERGENCY)\n\n**Lifestyle tips:**\n🥗 Reduce salt intake (<5g/day)\n🏃 Exercise 30 min daily\n⚖️ Maintain healthy weight\n🧘 Manage stress\n🚫 Limit alcohol, quit smoking\n\n⚠️ *This is general guidance, not a diagnosis.*",
    hi: "**रक्तचाप प्रबंधन:**\n\n🔹 **सामान्य**: 120/80 mmHg से कम\n🔹 **उच्च चरण 1**: 130-139 / 80-89\n🔹 **उच्च चरण 2**: 140+ / 90+\n🔹 **संकट**: 180+ / 120+ (आपातकाल)\n\n**जीवनशैली टिप्स:**\n🥗 नमक कम करें\n🏃 रोज़ 30 मिनट व्यायाम\n⚖️ स्वस्थ वजन बनाए रखें",
    mr: "**रक्तदाब व्यवस्थापन:**\n\n🔹 **सामान्य**: 120/80 mmHg पेक्षा कमी\n🔹 **उच्च टप्पा 1**: 130-139 / 80-89\n🔹 **उच्च टप्पा 2**: 140+ / 90+\n🔹 **संकट**: 180+ / 120+ (आपत्काल)\n\n**जीवनशैली टिप्स:**\n🥗 मीठ कमी करा\n🏃 रोज़ 30 मिनिटे व्यायाम\n⚖️ निरोगी वजन ठेवा",
    bn: "**রক্তচাপ ব্যবস্থাপনা:**\n\n🔹 **স্বাভাবিক**: 120/80 mmHg এর কম\n🔹 **উচ্চ পর্যায় 1**: 130-139 / 80-89\n🔹 **উচ্চ পর্যায় 2**: 140+ / 90+\n\n**জীবনযাপন টিপস:**\n🥗 লবণ কমান\n🏃 প্রতিদিন 30 মিনিট ব্যায়াম\n⚠️ *এটি সাধারণ নির্দেশনা, রোগ নির্ণয় নয়.*",
    ta: "**இரத்த அழுத்தம் மேலாண்மை:**\n\n🔹 **இயல்பு**: 120/80 mmHg க்கும் குறைவு\n🔹 **உயர் நிலை 1**: 130-139 / 80-89\n🔹 **உயர் நிலை 2**: 140+ / 90+\n\n⚠️ *இது பொது வழிகாட்டுதல், நோயறிதல் அல்ல.*",
    te: "**రక్తపోటు నిర్వహణ:**\n\n🔹 **సాధారణం**: 120/80 mmHg కంటే తక్కువ\n🔹 **అధిక దశ 1**: 130-139 / 80-89\n🔹 **అధిక దశ 2**: 140+ / 90+\n\n⚠️ *ఇది సాధారణ మార్గదర్శకత్వం, రోగ నిర్ధారణ కాదు.*",
  },
};

// ── Intent detection ──────────────────────────────────────────────────────
function detectIntent(message: string): { category: string; subcategory?: string } {
  const lower = message.toLowerCase();

  // AYUSH-specific intents (multi-language)
  if (lower.match(/prakriti|प्रकृति|constitution|body type|prakriti test|প্রকৃতি|பிரகிருதி|ప్రకృతి|प्रकृती|પ્રકૃતિ|ಪ್ರಕೃತಿ|പ്രകൃതി|ਪ੍ਰਕ੍ਰਿਤੀ|ପ୍ରକୃତି|پرکرتی/)) {
    return { category: "ayush", subcategory: "prakriti" };
  }
  if (lower.match(/agni|अग्नि|digestive|digestion|metabolism|pachan|पाचন|অগ্নি|செரிமான|జీర్ణక్రియ|पचन|ગરણ|ಜೀರ್ಣಕ್ರಿಯ|ദഹനം|ਪਾਚਨ|ପାଚନ|ہضم/)) {
    return { category: "ayush", subcategory: "agni" };
  }
  if (lower.match(/vikriti|विकृति|imbalance|current state|dosha imbalance|विकृती|വികൃതി|వికృతి/)) {
    return { category: "ayush", subcategory: "vikriti" };
  }
  if (lower.match(/herb|जड़ी|बूटी|ashwagandha|brahmi|triphala|shatavari|giloy|त्रिफला|अश्वगंধा|জড়িবুটি|மூலிகை|మూలిక|जडीबुटी|જડીબુટી|ಔಷಧ|ഔഷധ|ਜੜ੍ਹੀਬੂਟੀ|ଜଡ଼ିବୁଟୀ|جڑی بوٹی/)) {
    return { category: "ayush", subcategory: "herbs" };
  }
  if (lower.match(/lifestyle|dinacharya|daily routine|routine|दिनचर्या|yoga|योग|exercise|व्यायाम|দৈনিক|दिनचर्या|യോഗ|వ్యాయాਮ|दैनंदिन|દિનચર્યા|ದೈನಂದಿನ|दैनिक दिनचर्या|ਦਿਨਚਰਿਆ|ଦୈନିକ/)) {
    return { category: "ayush", subcategory: "lifestyle" };
  }

  // General health intents (multi-language)
  if (lower.match(/fever|बुखार|temperature|तापमान|jukam|flu|জ্বর|காய்ச்சల்|జ్వరం|तापमान|તાવ|ಜ್ವರ|പനി|ਬੁਖਾਰ|ଜ୍ୱର|بخار/)) {
    return { category: "general", subcategory: "fever" };
  }
  if (lower.match(/diabet|मधुमेह|sugar|शर्कर|sugar level|blood sugar|মধুমেহ|நீரிழிவு|మధుమేહ|मधुमेह|મધુમેહ|ಡಯಾಬಿಟೀಸ்|പ്രമേഹ|ਮਧੁਮੇਹ|ଡାଇବେଟିସ|شوگر/)) {
    return { category: "general", subcategory: "diabetes" };
  }
  if (lower.match(/headache|सिरदर्द|head pain|migraine|माइग्रेन|সিরদর্দ|தலைவலி|తలనొప్పि|डोके दुखाण|માથાનો દુખાવો|ತಲೆನೋವ്|തലവേദന|ਸਿਰਦਰਦ|ମାଥି ଯନ୍ତ୍ରଣା|سردرد/)) {
    return { category: "general", subcategory: "headache" };
  }
  if (lower.match(/blood pressure|bp|रक्तचाप|hypertension|उच्च रक्तचाप|রক্তচাপ|இரத்த அழுத்தம்|రక్తపోటు|रक्तदाब|બ્લડ પ્રેશર|ರಕ್ತದೊತ್ತಡ|രക്തസമ്മർദ്ദ|ਬਲੁੱਡ ਪ੍ਰੈਸ਼ਰ|ରକ��ତଚାପ|بلڈ پریشر/)) {
    return { category: "general", subcategory: "bp" };
  }

  return { category: "unknown" };
}

// ── Generate AI response using GPT-5.6 Luna ───────────────────────────────
async function generateResponse(
  chatType: "general" | "ayush",
  userMessage: string,
  language: string = "en",
  conversationHistory?: Array<{ role: "user" | "assistant"; content: string }>
): Promise<string> {
  const intent = detectIntent(userMessage);

  // Try GPT-5.6 Luna first for dynamic, conversational responses
  try {
    const response = await generateWithLuna(chatType, userMessage, language, conversationHistory);
    if (response) return response;
    throw new Error("Empty response from GPT-5.6 Luna");
  } catch (error: any) {
    logger.info({ err: error.message }, "GPT-5.6 Luna failed, using fallback responses");

    // 1. Check casual conversation FIRST (greetings, thanks, jokes, etc.)
    const casualResponse = matchCasualConversation(userMessage, language);
    if (casualResponse) return casualResponse;

    // 2. Try comprehensive knowledge base (including Kaggle dataset)
    const allKnowledge = [
      ...KAGGLE_DISEASE_KNOWLEDGE,
      ...DISEASE_KNOWLEDGE,
      ...MEDICATION_KNOWLEDGE,
      ...EXTRA_MEDICATION_KNOWLEDGE,
      ...EMERGENCY_KNOWLEDGE,
      ...DIET_KNOWLEDGE,
      ...AYUSH_KNOWLEDGE,
    ];

    let bestScore = 0;
    let bestMatch: Record<string, string> | null = null;
    const lowerMsg = userMessage.toLowerCase();

    for (const entry of allKnowledge) {
      let score = 0;
      for (const keyword of entry.keywords) {
        if (lowerMsg.includes(keyword.toLowerCase())) {
          score += keyword.length;
        }
      }
      if (score > bestScore) {
        bestScore = score;
        bestMatch = entry.response;
      }
    }

    if (bestMatch && bestScore > 2) {
      return getResponseForLanguage(bestMatch, language);
    }

    // Try medicine database lookup
    const medicine = findMedicine(userMessage);
    if (medicine) {
      return formatMedicineResponse(medicine, language);
    }

    // Try training dataset medications (MedOCR)
    const trainedMed = searchTrainingMedications(userMessage);
    if (trainedMed) {
      return trainedMed.response[language] || trainedMed.response["en"];
    }

    // Try training dataset lab tests (MedOCR)
    const trainedLab = searchTrainingLabTests(userMessage);
    if (trainedLab) {
      return trainedLab.response[language] || trainedLab.response["en"];
    }

    // Try training dataset conversations (Indic Speech)
    if (lowerMsg.includes("tired") || lowerMsg.includes("fatigue") || lowerMsg.includes("थकान") || lowerMsg.includes("सिरदर्द") || lowerMsg.includes("headache") || lowerMsg.includes("dizzy") || lowerMsg.includes("stress") || lowerMsg.includes("sleep")) {
      const convResponse = getTrainingConversation("fatigue_headache", language);
      if (convResponse) return convResponse;
    }

    // Try disease-medicine mapping (local database)
    for (const [disease, medKeys] of Object.entries(DISEASE_MEDICINE_MAP)) {
      if (lowerMsg.includes(disease)) {
        const meds = medKeys.map((k) => MEDICINE_DATABASE[k]).filter(Boolean);
        if (meds.length > 0) {
          let response = language === "hi"
            ? `**${disease}** के लिए उपयोग की जाने वाली दवाएं:\n\n`
            : `**Medications for ${disease}:**\n\n`;
          for (const med of meds.slice(0, 3)) {
            response += formatMedicineResponse(med, language) + "\n\n---\n\n";
          }
          response += language === "hi"
            ? "\n⚠️ *यह सामान्य जानकारी है। कृपया अपने डॉक्टर से परामर्श करें।*"
            : "\n⚠️ *This is general information. Always consult your doctor before taking any medication.*";
          return response;
        }
      }
    }

    // Try Kaggle dataset disease-medicine mapping
    for (const [disease, medNames] of Object.entries(KAGGLE_DISEASE_MAP)) {
      if (lowerMsg.includes(disease)) {
        let response = language === "hi"
          ? `**${disease}** के लिए उपयोग की जाने वाली दवाएं (Kaggle डेटाबेस से):\n\n`
          : `**Medications for ${disease}:** (from medicines database)\n\n`;
        medNames.slice(0, 5).forEach((med, i) => {
          response += `${i + 1}. **${med}\n`;
        });
        response += language === "hi"
          ? "\n\n⚠️ *यह दवाइ डेटाबेस से सामान्य जानकारी है। कृपया अपने डॉक्टर से परामर्श करें।*"
          : "\n\n⚠️ *This is from a medicines database. Always consult your doctor before taking any medication.*";
        return response;
      }
    }

    // Fallback to legacy static responses
    if (chatType === "ayush" && intent.category === "ayush" && intent.subcategory) {
      const responses = AYUSH_RESPONSES[intent.subcategory];
      if (responses) {
        const langResponses = responses[language] || responses["en"];
        return langResponses[Math.floor(Math.random() * langResponses.length)];
      }
    }

    if (chatType === "general" && intent.category === "general" && intent.subcategory) {
      const resp = GENERAL_RESPONSES[intent.subcategory];
      if (resp) {
        return resp[language] || resp["en"];
      }
    }

    // Fallback to contextual conversational response
    return getContextualFallback(userMessage, chatType, language);
  }
}
router.post("/chat/session", async (req, res) => {
  try {
    const { userId, chatType = "general", language = "en" } = req.body;
    if (!userId) {
      res.status(400).json({ error: "userId is required" });
      return;
    }

    const sessionId = `CHAT-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    const session: ChatSession = {
      sessionId,
      userId,
      chatType,
      language,
      messages: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    chatSessions[sessionId] = session;

    // Send greeting in the requested language, differentiated by chatType
    const greeting = await generateResponse(chatType, "hello", language, []);
    const greetingMsg: ChatMessage = {
      id: `MSG-${Date.now()}`,
      role: "assistant",
      content: greeting,
      timestamp: new Date().toISOString(),
      language,
    };
    session.messages.push(greetingMsg);

    logger.info({ sessionId, userId, chatType, language }, "Chat session created");
    res.json({ sessionId, chatType, greeting: greetingMsg });
  } catch (err) {
    logger.error({ err }, "Failed to create chat session");
    res.status(500).json({ error: "Failed to create session" });
  }
});

// ── Send message and get response ─────────────────────────────────────────
router.post("/chat/message", async (req, res) => {
  try {
    const { sessionId, message, language = "en" } = req.body;
    if (!sessionId || !message) {
      res.status(400).json({ error: "sessionId and message are required" });
      return;
    }

    const session = chatSessions[sessionId];
    if (!session) {
      res.status(404).json({ error: "Session not found" });
      return;
    }

    // Add user message
    const userMsg: ChatMessage = {
      id: `MSG-${Date.now()}`,
      role: "user",
      content: message,
      timestamp: new Date().toISOString(),
      language,
    };
    session.messages.push(userMsg);

    // Generate response using session's chatType, requested language, and conversation history
    const response = await generateResponse(session.chatType, message, language, session.messages);
    const assistantMsg: ChatMessage = {
      id: `MSG-${Date.now() + 1}`,
      role: "assistant",
      content: response,
      timestamp: new Date().toISOString(),
      language,
    };
    session.messages.push(assistantMsg);

    session.updatedAt = new Date().toISOString();

    res.json({
      userMessage: userMsg,
      assistantMessage: assistantMsg,
      messageCount: session.messages.length,
    });
  } catch (err) {
    logger.error({ err }, "Failed to process chat message");
    res.status(500).json({ error: "Failed to process message" });
  }
});

// ── Get chat history ──────────────────────────────────────────────────────
router.get("/chat/session/:sessionId", (req, res) => {
  const session = chatSessions[String(req.params.sessionId)];
  if (!session) {
    res.status(404).json({ error: "Session not found" });
    return;
  }
  res.json({
    sessionId: session.sessionId,
    chatType: session.chatType,
    messages: session.messages,
    createdAt: session.createdAt,
    updatedAt: session.updatedAt,
  });
});

// ── Get user's chat sessions ──────────────────────────────────────────────
router.get("/chat/sessions/:userId", (req, res) => {
  const userId = String(req.params.userId);
  const userSessions = Object.values(chatSessions)
    .filter((s) => s.userId === userId)
    .map((s) => ({
      sessionId: s.sessionId,
      chatType: s.chatType,
      messageCount: s.messages.length,
      createdAt: s.createdAt,
      updatedAt: s.updatedAt,
    }))
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());

  res.json(userSessions);
});

export default router;
