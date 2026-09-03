// ── Casual Conversation Responses ──────────────────────────────────────────
// Makes the chatbot feel conversational and natural, even without an LLM API

interface CasualResponseSet {
  patterns: RegExp[];
  responses: Record<string, string[]>;
}

export const CASUAL_CONVERSATIONS: CasualResponseSet[] = [
  // ── Greetings ──────────────────────────────────────────────────────────
  {
    patterns: [
      /^(hi|hello|hey|howdy|hola|namaste|नमस्ते|नमस्कार|नमस्कार!|salaam|salaam|namaskar|good morning|good evening|good afternoon|sup|yo|heyy?|hllo|hii|nmaskar|नमस्ते!)/i,
      /^(whats? up|what's up|wassup|kaise ho|kya haal|क्या हाल|kaise hai|kaisa hai)/i,
    ],
    responses: {
      en: [
        "Hey there! 👋 Welcome to MediKiosk! I'm your health assistant, ready to help you with anything medical — from symptoms and medications to diet and wellness tips. What's on your mind?",
        "Hello! 😊 Great to see you! I'm here to help with any health questions you might have. Whether it's about a cold, medications, diet, or just general wellness — just ask away!",
        "Hi there! 👋 I'm your MediKiosk health assistant. Think of me as a knowledgeable friend who can help you understand symptoms, medications, and health tips. What can I help you with today?",
        "Hey! Welcome! 🩺 I can help with symptoms, diseases, medications, diet advice, and more. Just tell me what you need!",
      ],
      hi: [
        "नमस्ते! 👋 MediKiosk में आपका स्वागत है! मैं आपका स्वास्थ्य सहायक हूं — लक्षण, दवाइयां, आहार, या कोई भी स्वास्थ्य सवाल, मैं सबमें मदद कर सकता हूं। बताइए, क्या पूछना है? 😊",
        "नमस्कार! 😊 आज आपका स्वास्थ्य कैसा है? मैं आपकी किसी भी स्वास्थ्य समस्या में मदद कर सकता हूं — बस पूछिए!",
        "हैलो! 👋 मैं MediKiosk का स्वास्थ्य सहायक हूं। बुखार हो, सिरदर्द हो, दवाइयों की जानकारी चाहिए — मैं सब में मदद कर सकता हूं। बताइए!",
      ],
      mr: [
        "नमस्कार! 👋 MediKiosk मध्ये आपले स्वागत आहे! मी तुमचा आरोग्य सहायक आहे — लक्षणे, औषधे, आहार, किंवा कोणताही आरोग्य प्रश्न, मी सर्वांमध्ये मदत करू शकतो. सांगा, काय विचारायचं आहे? 😊",
        "नमस्कार! 😊 आज तुमचे आरोग्य कसं आहे? मी तुम्हाला कोणत्याही आरोग्य समस्येत मदत करू शकतो — विचारा!",
      ],
      bn: [
        "নমস্কার! 👋 MediKiosk-এ আপনাকে স্বাগতম! আমি আপনার স্বাস্থ্য সহায়ক। লক্ষণ, ওষুধ, খাদ্যাভ্যাস — যেকোনো স্বাস্থ্য প্রশ্ন জিজ্ঞাসা করুন! 😊",
      ],
      ta: [
        "வணக்கம்! 👋 MediKiosk-க்கு வரவேற்கிறோம்! நான் உங்கள் சுகாதார உதவியாளர் — அறிகுறிகள், மருந்துகள், உணவு, அல்லது எந்த சுகாதார கேள்வியும் கேளுங்கள்! 😊",
      ],
      te: [
        "నమస్కారం! 👋 MediKioskకు స్వాగతం! నేను మీ ఆరోగ్య సహాయకుడిని — లక్షణాలు, మందులు, ఆహారం లేదా ఏదైనా ఆరోగ్య ప్రశ్న అడగండి! 😊",
      ],
      gu: [
        "નમસ્તે! 👋 MediKiosk માં આપનું સ્વાગત છે! હું તમારો આરોગ્ય સહાયક છું — લક્ષણો, દવાઓ, આહાર, અથવા કોઈપણ આરોગ્ય પ્રશ્ન પૂછો! 😊",
      ],
      kn: [
        "ನಮಸ್ಕಾರ! 👋 MediKioskಗೆ ಸ್ವಾಗತ! ನಾನು ನಿಮ್ಮ ಆರೋಗ್ಯ ಸಹಾಯಕ — ಲಕ್ಷಣಗಳು, ಔಷಧಿಗಳು, ಆಹಾರ ಅಥವಾ ಯಾವುದೇ ಆರೋಗ್ಯ ಪ್ರಶ್ನೆ ಕೇಳಿ! 😊",
      ],
      ml: [
        "നമസ്കാരം! 👋 MediKiosk-ലേക്ക് സ്വാഗതം! ഞാൻ നിങ്ങളുടെ ആരോഗ്യ സഹായകൻ — ലക്ഷണങ്ങൾ, മരുന്നുകൾ, ഭക്ഷണം അല്ലെങ്കിൽ ഏതെങ്കിലും ആരോഗ്യ ചോദ്യം ചോദിക്കുക! 😊",
      ],
      pa: [
        "ਸਤਿ ਸ੍ਰੀ ਅਕਾਲ! 👋 MediKiosk ਵਿੱਚ ਤੁਹਾਡਾ ਸੁਆਗਤ ਹੈ! ਮੈਂ ਤੁਹਾਡਾ ਸਿਹਤ ਸਹਾਇਕ ਹਾਂ — ਲੱਛਣ, ਦਵਾਈਆਂ, ਭੋਜਨ, ਜਾਂ ਕੋਈ ਵੀ ਸਿਹਤ ਸਵਾਲ ਪੁੱਛੋ! 😊",
      ],
      or: [
        "ନମସ୍କାର! 👋 MediKiosk-କୁ ସ୍ୱାଗତ! ମୁଁ ଆପଣଙ୍କ ସ୍ୱାସ୍ଥ୍ୟ ସହାୟକ — ଲକ୍ଷଣ, ଔଷଧ, ଖାଦ୍ୟ, କିମ୍ବା ଯେକୌଣସି ସ୍ୱାସ୍ଥ୍ୟ ପ୍ରଶ୍ନ ପଚାରନ୍ତୁ! 😊",
      ],
    },
  },

  // ── How are you ──────────────────────────────────────────────────────
  {
    patterns: [/how are you|how r u|how're you|kaise ho|kaisa hai|कैसे हो|कैसा है|kya haal|kya chal|how you|you good|you doing good/i],
    responses: {
      en: [
        "I'm doing great, thanks for asking! 😊 I'm always ready to help you with any health questions. Whether it's about a headache, a cold, medications, or just wanting to eat healthier — I'm here for you! What can I help with?",
        "All good on my end! 💪 How about you? Feeling okay or dealing with any health concerns? I'm here to help with symptoms, medicines, diet tips, and more!",
        "I'm fantastic, thank you! 🌟 My job is to help you stay healthy. Tell me — anything bothering you health-wise? Or maybe you want some wellness tips?",
      ],
      hi: [
        "मैं बिल्कुल ठीक हूं, पूछने के लिए धन्यवाद! 😊 आप बताइए, कोई स्वास्थ्य समस्या है? बुखार, सिरदर्द, दवाइयां — कुछ भी पूछ सकते हैं!",
        "सब बढ़िया है! 💪 आप कैसे हैं? कोई तबीयत तो खराब नहीं है ना? मैं मदद के लिए हूं!",
      ],
      mr: [
        "मी छान आहे, विचारल्याबद्दल धन्यवाद! 😊 तू कसं आहेस? काही आरोग्य समस्या आहे का?",
      ],
    },
  },

  // ── Thanks ──────────────────────────────────────────────────────────
  {
    patterns: [/thank|thanks|thx|shukriya|धन्यवाद|धन्यवाद!|thank you|tq|tnx|thanks a lot|thanku/i],
    responses: {
      en: [
        "You're most welcome! 😊 I'm always here if you have more health questions. Don't hesitate to ask — that's what I'm here for! Stay healthy! 🌟",
        "Happy to help! 💪 Remember, I'm available 24/7 for any health queries. Take care of yourself!",
        "My pleasure! 🩺 If anything else comes up about your health, medications, or diet — just ask. I'm always here!",
      ],
      hi: [
        "आपका स्वागत है! 😊 कोई और स्वास्थ्य सवाल हो तो बेझिझक पूछिए। मैं हमेशा यहां हूं! 🌟",
        "खुशी हुई मदद करके! 💪 अपना ख्याल रखिए और कोई भी सवाल पूछते रहिए!",
      ],
      mr: [
        "स्वागत आहे! 😊 काही अजून आरोग्य प्रश्न असतील तर निश्चिंत विचारा. मी नेहमी येथे आहे! 🌟",
      ],
    },
  },

  // ── Who are you / What's your name ──────────────────────────────────
  {
    patterns: [/who are you|what('s| is) your name|what do (you|i) call|tu kaun|तुम कौन|tumhara naam|your name|name please|introduce yourself/i],
    responses: {
      en: [
        "I'm **MediKiosk Health Assistant** 🩺 — your friendly AI health companion! I can help you with:\n\n🩺 **Symptoms** — Tell me what you're feeling, and I'll help you understand it\n💊 **Medications** — Ask about any medicine, dosage, or side effects\n🥗 **Diet & Nutrition** — Get personalized diet tips for your condition\n🏥 **When to See a Doctor** — I'll help you decide if you need to visit one\n🌿 **AYUSH & Wellness** — Ayurvedic remedies, yoga, and lifestyle tips\n\nThink of me as a knowledgeable health buddy — always here, always free! What would you like to know?",
        "I'm your **MediKiosk Assistant**! 🩺 I'm designed to be like a knowledgeable friend who knows a lot about health. I can discuss symptoms, medications (like paracetamol, ibuprofen, etc.), diseases, diet plans, and even Ayurvedic remedies.\n\nI'm available 24/7 and I speak 11 languages! What health question can I help with today?",
      ],
      hi: [
        "मैं **MediKiosk स्वास्थ्य सहायक** हूं! 🩺 एक ऐसा मित्र जो स्वास्थ्य के बारे में बहुत जानता है। मैं इनमें मदद कर सकता हूं:\n\n🩺 **लक्षण** — बताइए क्या हो रहा है, मैं समझाऊंगा\n💊 **दवाइयां** — कोई भी दवा, खुराक, या साइड इफेक्ट्स पूछें\n🥗 **आहार** — आपकी स्थिति के अनुसार आहार सुझाव\n🏥 **डॉक्टर कब जाएं** — मैं बताऊंगा कब जरूरत है\n🌿 **आयुर्वेद** — जड़ी-बूटियां, योग, और जीवनशैली टिप्स\n\nमैं 24/7 उपलब्ध हूं और 11 भाषाओं में बात कर सकता हूं!",
      ],
      mr: [
        "मी **MediKiosk आरोग्य सहायक** आहे! 🩺 एक अशा मित्राप्रमाणे जो आरोग्याबद्दल खूप जाणतो. मी यांमध्ये मदत करू शकतो:\n\n🩺 **लक्षणे** — सांगा काय होत आहे, मी समजावतो\n💊 **औषधे** — कोणत्याही औषधाबद्दल विचारा\n🥗 **आहार** — तुमच्या स्थितीनुसार आहार सुचवा\n🏥 **डॉक्टर कधी जावे** — मी सांगतो\n🌿 **आयुर्वेद** — जडीबुटी, योग, जीवनशैली टिप्स",
      ],
    },
  },

  // ── What can you do ────────────────────────────────────────────────
  {
    patterns: [/what can you do|what do you do|help me|your capabilities|tum kya kar|तुम क्या कर|how can you help|kya kar sakte|kya kar sakta/i],
    responses: {
      en: [
        "Great question! Here's everything I can help you with:\n\n🩺 **Symptom Checker** — Describe your symptoms (fever, headache, cough, etc.) and I'll provide guidance\n💊 **Medicine Info** — Ask about any medication (Paracetamol, Ibuprofen, Azithromycin, etc.) — dosage, uses, side effects\n🥗 **Diet Advice** — Get diet recommendations for diabetes, BP, weight loss, and more\n🏥 **Disease Info** — Learn about conditions like diabetes, hypertension, thyroid, asthma\n🌿 **AYUSH & Ayurveda** — Ask about Prakriti, Doshas, herbal remedies, yoga\n🚨 **Emergency Help** — First aid for burns, bleeding, choking, and more\n🩻 **Lab Results** — Help understanding blood tests and reports\n\nJust type your question naturally — I'll do my best to help! 💪",
        "I'm like a health encyclopedia that talks! 📚 Here's what I know:\n\n✅ Common diseases and their symptoms\n✅ 100+ medications and their details\n✅ Diet plans for various conditions\n✅ Emergency first aid guidance\n✅ Ayurvedic remedies and lifestyle tips\n✅ When to see a doctor\n\nTry asking me something like:\n• \"What should I take for a headache?\"\n• \"Is paracetamol safe?\"\n• \"I have a cold, what should I do?\"\n• \"What's good for diabetes diet?\"",
      ],
      hi: [
        "बहुत अच्छा सवाल! मैं इन सब में मदद कर सकता हूं:\n\n🩺 **लक्षण जांच** — अपने लक्षण बताइए (बुखार, सिरदर्द, खांसी आदि)\n💊 **दवा की जानकारी** — कोई भी दवा पूछें (पैरासिटामोल, आइबुप्रोफेन, एज़िथ्रोमाइसिन)\n🥗 **आहार सलाह** — मधुमेह, बीपी, वजन कम करने के लिए आहार\n🏥 **रोग जानकारी** — मधुमेह, उच्च रक्तचाप, थायरॉयड, दमा\n🌿 **आयुर्वेद** — प्रकृति, दोष, जड़ी-बूटियां, योग\n🚨 **आपातकाल** — जलने, खून बहने, दम घुटने में प्राथमिक उपचार\n\nबस सामान्य भाषा में पूछिए — मैं मदद करूंगा! 💪",
      ],
      mr: [
        "खूप चांगला प्रश्न! मी या सर्वांमध्ये मदत करू शकतो:\n\n🩺 **लक्षण तपासणी** — तुमची लक्षणे सांगा\n💊 **औषध माहिती** — कोणत्याही औषधाबद्दल विचारा\n🥗 **आहार सल्ला** — मधुमेह, बीपी, वजन कमी करण्यासाठी\n🏥 **रोग माहिती** — मधुमेह, उच्च रक्तदाब, थायरॉईड\n🌿 **आयुर्वेद** — प्रकृती, दोष, जडीबुटी, योग\n🚨 **आपत्काल** — भाजल्यास, रक्तवाहून वाहल्यास प्राथमिक उपचार",
      ],
    },
  },

  // ── Jokes / Fun ────────────────────────────────────────────────────
  {
    patterns: [/tell.*joke|joke|funny|mazaak|mazak|मज़ाक|मजाक|make me laugh|something funny/i],
    responses: {
      en: [
        "Sure, here's a health-themed one! 😄\n\n*Why did the doctor carry a red pen?*\n*In case they needed to draw blood!* 🩸😄\n\nBut seriously — healthy living is the best medicine! Want some tips on staying healthy? 😊",
        "Alright, here goes! 😄\n\n*What do you call a medical student who just graduated?*\n*A doctor — finally!* 🎓😂\n\nRemember, laughing is actually great for your health! It reduces stress hormones. So keep smiling! 😊",
        "Here's one for you! 😄\n\n*Why did the nurse need a red pen?*\n*Because sometimes they had to draw blood!* 🩸😂\n\nDid you know? Laughing for 10 minutes burns about 40 calories! Want to know more about how laughter helps health? 😊",
      ],
      hi: [
        "ज़रूर! 😄\n\n*डॉक्टर ने स्टेथोस्कोप क्यों खरीदा?*\n*क्योंकि उसे सुनना था कि मरीज़ क्या बोल रहा है!* 😂🩺\n\nवैसे, हंसना सेहत के लिए बहुत अच्छा होता है — तनाव कम होता है! 😊",
        "ठीक है! 😄\n\n*सबसे ज़्यादा डरावनी चीज़ क्या है?*\n*डॉक्टर का बिल!* 😂💸\n\nवैसे हंसने से एंडोर्फिन बढ़ता है — यानी खुशी! तो हँसते रहिए!",
      ],
      mr: [
        "अरे चल! 😄\n\n*डॉक्टरांना स्टेथोस्कोप का वाटला?*\n*कारण त्यांना ऐकायचं होतं की रुग्ण काय बोलतोय!* 😂🩺\n\nवैसे, हसणे आरोग्यासाठी खूप चांगलं आहे!",
      ],
    },
  },

  // ── Identity / Bot / AI ────────────────────────────────────────────
  {
    patterns: [/are you (a )?(bot|ai|robot|human|real|doctor)|tum bot|तुम bot|are you real|you (a |an )?(ai|bot)/i],
    responses: {
      en: [
        "I'm an AI health assistant — think of me as a smart health companion! 🤖💊 I'm not a doctor, but I know a lot about symptoms, medications, diseases, and wellness. I can help you understand health topics and guide you when to see a real doctor.\n\nI'm here 24/7, I speak 11 languages, and I never get tired of your questions! 😊",
        "I'm an AI — yes, artificial intelligence! 🤖 But my health knowledge is very real. I can help with symptoms, medicines, diet, and Ayurveda. Just remember: I'm not a replacement for a real doctor. For diagnosis and treatment, always consult a physician!",
      ],
      hi: [
        "मैं एक AI स्वास्थ्य सहायक हूं — एक स्मार्ट स्वास्थ्य मित्र! 🤖💊 मैं डॉक्टर नहीं हूं, लेकिन मुझे लक्षणों, दवाइयों, बीमारियों और स्वास्थ्य के बारे में बहुत कुछ पता है।\n\nमैं 24/7 उपलब्ध हूं, 11 भाषाओं में बात करता हूं! 😊",
      ],
    },
  },

  // ── Bye / Goodbye ──────────────────────────────────────────────────
  {
    patterns: [/bye|goodbye|good bye|see you|alvida|अलविदा|tata|चल|चलता हूं|take care|gtg|g2g|bye bye|good night|शुभ रात्रि/i],
    responses: {
      en: [
        "Goodbye! 👋 Take care of yourself! Remember, I'm always here whenever you need health advice. Stay healthy and stay happy! 🌟",
        "See you! 😊 Remember — stay hydrated, eat well, and don't forget to exercise! I'll be here whenever you need me. Bye! 👋",
      ],
      hi: [
        "अलविदा! 👋 अपना ख्याल रखिए! याद रखिए — पानी पीते रहिए, अच्छा खाइए, और व्यायाम मत भूलिए! मैं हमेशा यहां हूं। बाय! 🌟",
        "फिर मिलते हैं! 😊 अपनी सेहत का ध्यान रखिए और कोई भी सवाल हो तो बेझिझक पूछिए। शुभ रात्रि! 👋",
      ],
      mr: [
        "बाय! 👋 आपल्या आरोग्याचा ख्याल ठेवा! नेहमी येथे आहे — काहीही विचारायचं असेल तर. शुभ रात्री! 🌟",
      ],
    },
  },

  // ── Sorry / Complaint ──────────────────────────────────────────────
  {
    patterns: [/sorry|excuse me|maaf|माफ़ कीजिए|maafi|mujhe maaf|apologize|my bad/i],
    responses: {
      en: [
        "No need to apologize! 😊 Everyone has health questions, and that's exactly why I'm here. Ask me anything — there are no silly questions when it comes to health!",
        "No worries at all! 😊 Health is important, and asking questions is the smart thing to do. What can I help you with?",
      ],
      hi: [
        "कोई बात नहीं! 😊 स्वास्थ्य के सवाल पूछने में कोई शर्म नहीं है। बस पूछिए, मैं मदद करूंगा!",
      ],
    },
  },

  // ── Good / Fine / Nice ─────────────────────────────────────────────
  {
    patterns: [/^(ok|okay|fine|good|nice|great|awesome|cool|alright|accha|ठीक है|बढ़िया|चंगा|थांबल|sahi|theek)$/i],
    responses: {
      en: [
        "Great! 😊 Is there anything health-related I can help you with? I can assist with symptoms, medications, diet, or general wellness tips!",
        "Awesome! 💪 Feel free to ask me anything about your health. I'm here whenever you need me!",
      ],
      hi: [
        "बढ़िया! 😊 कोई स्वास्थ्य सवाल है तो पूछिए — लक्षण, दवाइयां, आहार, जो भी पूछना हो!",
        "अच्छा! 💪 कुछ भी स्वास्थ्य संबंधी जानना हो तो बेझिझक पूछिए!",
      ],
    },
  },

  // ── I'm not feeling well / sick ────────────────────────────────────
  {
    patterns: [/i('m| am) (not |n't )?(feeling |feelin )?(well|good|fine|okay)|i feel (sick|bad|terrible|awful|unwell|ill|nauseous|dizzy)|tabiyat|tabiyat kharab|तबीयत|बीमार|ill|sick|unwell|not well|feeling sick|feel ill|body pain|thakan|थकान|कमज़ोर|weak|चक्कर|giddiness|dizziness|vomit|उल्टी|diarrhea|दस्त|loose motion|constipation|कब्ज़|cold|sardi|sardi khansi|सर्दी|खांसी|cough|khansi|zukam|जुकाम/i],
    responses: {
      en: [
        "I'm sorry to hear that! 😟 Let me help. To give you the best guidance, could you tell me a bit more?\n\n🔹 **What symptoms are you experiencing?** (fever, headache, body pain, etc.)\n🔹 **When did it start?** (today, yesterday, a few days ago)\n🔹 **How severe is it?** (mild, moderate, severe)\n\nIn the meantime:\n💧 Stay hydrated — drink warm water or ORS\n🍽️ Eat light, easily digestible food\n😴 Get plenty of rest\n\nOnce you share more details, I can give you specific guidance! 💊",
        "Oh no! 😟 Don't worry, I'm here to help. Tell me:\n\n🔹 What exactly are you feeling? (cold, cough, fever, stomach issues?)\n🔹 How long have you been feeling this way?\n🔹 Any other symptoms like body ache, nausea, or dizziness?\n\n**Quick tips while you tell me more:**\n💧 Drink plenty of water\n🍚 Eat light khichdi or soup\n😴 Rest as much as you can\n\nI'll give you proper guidance once I know more! 🩺",
      ],
      hi: [
        "अच्छा नहीं लगा सुनकर! 😟 मैं मदद करता हूं। कृपया बताइए:\n\n🔹 **क्या लक्षण हैं?** (बुखार, सिरदर्द, शरीर में दर्द आदि)\n🔹 **कब से है?** (आज, कल, कुछ दिनों से)\n🔹 **कितना बुरा है?** (हल्का, मध्यम, गंभीर)\n\n**इस बीच ये करें:**\n💧 खूब पानी पिएं — गर्म पानी या ORS\n🍽️ हल्का भोजन करें — खिचड़ी, सूप\n😴 खूब आराम करें\n\nबताइए क्या हो रहा है, मैं बताऊंगा क्या करना है! 💊",
      ],
      mr: [
        "खरं सांगून दुःख झालं! 😟 मी मदत करतो. कृपया सांगा:\n\n🔹 **काय लक्षणे आहेत?** (ताप, डोकेदुखण, शरीर दुखणे)\n🔹 **कधीपासून आहे?**\n🔹 **किती त्रासदायक आहे?**\n\n**याच काळात हे करा:**\n💧 खूब पाणी प्या\n🍽️ हलका आहार घ्या — खिचडी, सूप\n😴 खूप आराम करा\n\nसांगा काय होत आहे, मी सांगतो काय करायला हवं! 💊",
      ],
      bn: [
        "এটা শোনা ভালো লাগলো না! 😟 আমি সাহায্য করব। বলুন:\n\n🔹 **কী লক্ষণ আছে?** (জ্বর, মাথাব্যথা, শরীরে ব্যথা)\n🔹 **কখন থেকে?**\n🔹 **কতটা খারাপ?**\n\n💧 প্রচুর পানি পান করুন\n🍽️ হালকা খাবার খান\n😴 বিশ্রাম নিন\n\nআরও বিস্তারিত বলুন, আমি সাহায্য করব!",
      ],
      ta: [
        "அதைக் கேட்டு வருத்தமாக இருக்கிறது! 😟 நான் உதவுகிறேன். சொல்லுங்கள்:\n\n🔹 **என்ன அறிகுறிகள் உள்ளன?** (காய்ச்சல், தலைவலி, உடல் வலி)\n🔹 **எப்போதிலிருந்து?**\n🔹 **எவ்வளவு மோசமாக?**\n\n💧 நிறைய தண்ணீர் குடிக்கவும்\n🍽️ லேசான உணவு சாப்பிடுங்கள்\n😴 நிறைய ஓய்வெடுங்கள்\n\nமேலும் விவரம் சொல்லுங்கள், நான் உதவுகிறேன்!",
      ],
      te: [
        "అది విని బాధగా ఉంది! 😟 నేను సహాయం చేస్తాను. చెప్పండి:\n\n🔹 **ఏ లక్షణాలు ఉన్నాయి?** (జ్వరం, తలనొప్పి, శరీర నొప్పి)\n🔹 **ఎప్పటి నుండి?**\n🔹 **ఎంత తీవ్రంగా?**\n\n💧 చాలా నీరు తాగండి\n🍽️ తేలికపాటి ఆహారం తినండి\n😴 ఎక్కువ విశ్రాంతి తీసుకోండి\n\nమరిన్ని వివరాలు చెప్పండి, నేను సహాయం చేస్తాను!",
      ],
    },
  },

  // ── Medicine / Drug questions ──────────────────────────────────────
  {
    patterns: [/what (medicine|tablet|drug|pill|capsule)|which (medicine|tablet|drug)|konsi dawai|कौन सी दवा|kaun si dawa|dawa batao|दवा बताओ|paracetamol|crocin|dolo|ibuprofen|combiflam|brufen|azithromycin|azee|pantoprazole|omeprazole|metformin|amlodipine|atorvastatin|losartan|cetirizine|zyrtec|montelukast|montair|salbutamol|ventolin|inhaler|cough syrup|syrup|tablet|capsule|injection|davai|dawai|दवाई|दवा/i],
    responses: {
      en: [
        "I'd love to help you with medicine information! 💊 I have detailed knowledge about 100+ common medications.\n\nTry asking me about:\n• **Paracetamol/Crocin/Dolo** — for fever & pain\n• **Ibuprofen/Combiflam** — for pain & inflammation\n• **Azithromycin/Azee** — antibiotic\n• **Pantoprazole/Pantocid** — for acidity & GERD\n• **Metformin/Glycomet** — for diabetes\n• **Amlodipine/Amlodac** — for blood pressure\n• **Cetirizine/Zyrtec** — for allergies\n\nJust ask about any specific medicine by name, and I'll tell you its uses, dosage, and side effects! 🩺",
        "Sure! 💊 I know about many common Indian medicines. You can ask me:\n\n🔹 \"Tell me about Paracetamol\"\n🔹 \"What is Azithromycin used for?\"\n🔹 \"Side effects of Ibuprofen\"\n🔹 \"Is Pantoprazole safe for long term?\"\n🔹 \"Best medicine for cold and cough\"\n\nWhat medicine would you like to know about?",
      ],
      hi: [
        "ज़रूर! 💊 मुझे 100 से ज़्यादा आम दवाइयों के बारे में जानकारी है।\n\nआप ऐसे पूछ सकते हैं:\n• \"पैरासिटामोल के बारे में बताओ\"\n• \"एज़िथ्रोमाइसिन किसके लिए है?\"\n• \"आइबुप्रोफेन के साइड इफेक्ट्स\"\n• \"डायबिटीज़ की कोई अच्छी दवा?\"\n• \"सर्दी-खांसी की दवा\"\n\nकोई भी दवा का नाम बताइए, मैं बताऊंगा!",
      ],
      mr: [
        "जरूर! 💊 मला 100 पेक्षा जास्त सामान्य औषधांबद्दल माहिती आहे.\n\nतुम्ही असे विचारू शकता:\n• \"पॅरासिटामोलबद्दल सांगा\"\n• \"एझिथ्रोमायसिन कशासाठी आहे?\"\n• \"आइब्युप्रोफेनचे साइड इफेक्ट्स\"\n• \"मधुमेहासाठी चांगली औषध कोणती?\"\n• \"सर्दी-खोकल्यासाठी औषध\"\n\nकोणत्याही औषधाचं नाव सांगा, मी सांगतो!",
      ],
    },
  },

  // ── Diet / Food / Nutrition ────────────────────────────────────────
  {
    patterns: [/what (should|can) i eat|diet|food|nutrition|khana|खाना|diet plan|what to eat|what not to eat|fasting|fast|vrat|व्रत|protein|carb|vitamin|mineral|healthy eating|eat healthy|weight loss|weight gain|obesity|motapa|मोटापा|vajan|वजन|calories|calorie/i],
    responses: {
      en: [
        "Great question about diet and nutrition! 🥗 Here's some general guidance:\n\n**Healthy Eating Basics:**\n🥦 Eat plenty of vegetables and fruits (5+ servings/day)\n🍚 Choose whole grains over refined\n🐟 Include lean proteins (fish, chicken, dal, paneer)\n🥛 Don't skip dairy — good for bones\n💧 Drink 8-10 glasses of water daily\n🚫 Limit sugar, salt, and processed foods\n\n**For Weight Loss:**\n• Eat smaller portions, more frequently\n• Walk 30 minutes daily\n• Avoid fried and sugary foods\n• Include protein in every meal\n\n**For Weight Gain:**\n• Eat calorie-dense healthy foods (nuts, banana, milk)\n• Eat 5-6 times a day\n• Strength training helps build muscle\n\nWant advice for a specific condition? Ask me about diabetes diet, BP diet, etc! 😊",
        "Let me help with your diet! 🥗 Tell me:\n\n🔹 Are you trying to lose or gain weight?\n🔹 Do you have any health conditions (diabetes, BP, thyroid)?\n🔹 Any food allergies?\n\n**General Tips:**\n✅ Home-cooked meals are best\n✅ Eat seasonal fruits and vegetables\n✅ Don't skip breakfast\n✅ Stop eating 2-3 hours before sleep\n✅ Walk after meals (10-15 min)\n\nWhat specific diet advice are you looking for?",
      ],
      hi: [
        "आहार और पोषण के बारे में बहुत अच्छा सवाल! 🥗\n\n**स्वस्थ आहार की मूल बातें:**\n🥦 खूब सब्ज़ियां और फल खाएं\n🍚 साबुत अनाज खाएं\n🐟 प्रोटीन शामिल करें (दाल, पनीर, मांस)\n💧 रोज़ 8-10 गिलास पानी पिएं\n🚫 चीनी, नमक और प्रोसेस्ड फूड कम करें\n\n**वज़न कम करने के लिए:**\n• छोटे-छोटे भोजन बार-बार करें\n• रोज़ 30 मिनट चलें\n• तला हुआ और मीठा कम करें\n\n**वज़न बढ़ाने के लिए:**\n• मेवे, केला, दूध खाएं\n• दिन में 5-6 बार खाएं\n\nकिसी खास बीमारी के लिए आहार चाहिए? पूछिए!",
      ],
    },
  },

  // ── Emergency / Urgent ────────────────────────────────────────────
  {
    patterns: [/emergency|help urgently|help me please|bachao|बचाओ|emergency|संकट|danger|जान जोखिम|dying|can't breathe|chest pain|सीने में दर्द|heart attack|stroke|poison|accident|severe bleed|unconscious|बेहोश|fainting|बेहोशी|suffocating|choking/i],
    responses: {
      en: [
        "🚨 **THIS SOUNDS LIKE A MEDICAL EMERGENCY!** 🚨\n\n**Call emergency services IMMEDIATELY:**\n📞 India: **108** (Ambulance) or **102**\n📞 General: **112**\n\n**While waiting for help:**\n🫁 If breathing difficulty → Sit upright, stay calm\n❤️ If chest pain → Chew an aspirin (if available), don't move\n🩸 If severe bleeding → Apply firm pressure with clean cloth\n😵 If unconscious → Check breathing, place in recovery position\n\n⚠️ **I am an AI assistant, NOT an emergency service.** Please call professional medical help RIGHT NOW.\n\nI can provide first aid guidance, but **your life comes first — call 108!**",
        "🚨 **PLEASE CALL FOR HELP RIGHT NOW!** 🚨\n\n📞 **108** — Ambulance (India)\n📞 **112** — General Emergency\n📞 **102** — Medical Emergency\n\n**Immediate steps:**\n1. Stay calm\n2. Call the emergency number\n3. Don't move the person (unless in danger)\n4. Keep talking to them\n\n⚠️ I'm an AI — I cannot dispatch help. **You must call emergency services!**",
      ],
      hi: [
        "🚨 **यह चिकित्सा आपातकाल जैसा लगता है!** 🚨\n\n**तुरंत आपातकालीन सेवाओं को कॉल करें:**\n📞 भारत: **108** (एम्बुलेंस) या **102**\n📞 सामान्य: **112**\n\n**मदद आने तक:**\n🫁 सांस में तकलीफ → ऊपर बैठें, शांत रहें\n❤️ सीने में दर्द → एस्पिरिन चबाएं (अगर उपलब्ध हो)\n🩸 खून बह रहा है → साफ कपड़े से दबाव डालें\n\n⚠️ **मैं AI सहायक हूं, आपातकालीन सेवा नहीं।** कृपया अभी 108 कॉल करें!",
      ],
      mr: [
        "🚨 **हे वैद्यकीय आपत्काल वाटते!** 🚨\n\n**तातडीने आपत्कालीन सेवांना कॉल करा:**\n📞 भारत: **108** (एम्बुलन्स) किंवा **102**\n📞 सामान्य: **112**\n\n**मदत येपर्यंत:**\n🫁 श्वास घेण्यास त्रास → वर बसा\n❤️ छातीत वेदना → एस्पिरिन चघळा\n🫁 रक्तवाहून वाहत असल्यास → स्वच्छ कापडाने दाबा\n\n⚠️ **मी AI आहे, आपत्कालीन सेवा नाही.** कृपया आता 108 कॉल करा!",
      ],
    },
  },
];

// ── Match casual conversation ────────────────────────────────────────────
export function matchCasualConversation(
  message: string,
  language: string
): string | null {
  const trimmed = message.trim();

  for (const set of CASUAL_CONVERSATIONS) {
    for (const pattern of set.patterns) {
      if (pattern.test(trimmed)) {
        const langResponses = set.responses[language] || set.responses["en"];
        return langResponses[Math.floor(Math.random() * langResponses.length)];
      }
    }
  }

  return null;
}

// ── Health-aware contextual fallback (when no exact match found) ────────
export function getContextualFallback(
  message: string,
  chatType: "general" | "ayush",
  language: string
): string {
  const lower = message.toLowerCase();

  // Very short messages (1-2 words) → ask for more details
  if (trimmedLength(message) <= 3) {
    if (language === "hi") {
      return "आपका संदेश बहुत छोटा है। 😊 कृपया थोड़ा और विस्तार से बताइए — आपको क्या जानना है? उदाहरण: \"बुखार है, क्या करूं?\" या \"डायबिटीज़ की दवा बताओ\"";
    }
    if (language === "mr") {
      return "तुमचा संदेश खूप छोटा आहे. 😊 कृपया थोडा अधिक स्पष्टपणे सांगा — तुम्हाला काय जाणून आहे? उदा. \"ताप आहे, काय करू?\" किंवा \"मधुमेहासाठी औषध सांगा\"";
    }
    return "Your message seems a bit short! 😊 Could you tell me a little more about what you'd like to know? For example:\n\n• \"I have a headache, what should I do?\"\n• \"Tell me about Paracetamol\"\n• \"What's good for diabetes diet?\"\n• \"I have a cold, help me\"";
  }

  // If it mentions a body part or symptom keyword loosely → guide them
  const bodyParts = /head|chest|stomach|back|throat|nose|eye|ear|skin|joint|leg|arm|hand|foot|throat|belly|abdomen|neck|knee|face/i;
  const symptomWords = /pain|hurt|ache|sore|swollen|itch|rash|bump|bleed|burn|numb|tingle|pressure|tired|fatigue|sleep|insomnia|appetite|weight|gain|lose/i;

  if (bodyParts.test(lower) || symptomWords.test(lower)) {
    if (chatType === "ayush") {
      if (language === "hi") {
        return "मैं आपकी चिंता समझता/समझती हूं। 🌿 आयुर्वेद में हम शरीर को समग्र रूप से देखते हैं।\n\nकृपया और विस्तार से बताइए:\n🔹 **कौन सा हिस्सा** दुख रहा है?\n🔹 **कब से** परेशानी है?\n🔹 **क्या-क्या** और लक्षण हैं?\n\nआप मुझसे ये भी पूछ सकते हैं:\n• प्रकृति (body constitution)\n• दोष संतुलन\n• आयुर्वेदिक उपचार\n• योग और प्राणायाम";
      }
      return "I understand your concern. 🌿 In Ayurveda, we look at the body holistically.\n\nCould you tell me more:\n🔹 **Which body part** is bothering you?\n🔹 **Since when** have you had this issue?\n🔹 **Any other symptoms** along with it?\n\nYou can also ask me about:\n• Your Prakriti (body constitution)\n• Dosha balance\n• Ayurvedic remedies\n• Yoga & pranayama";
    }

    if (language === "hi") {
      return "मैं आपकी समस्या समझना चाहूंगा। 🩺\n\nकृपया और बताइए:\n🔹 **क्या लक्षण** हैं? (दर्द, जलन, सूजन आदि)\n🔹 **कब से** हो रहा है?\n🔹 **कितना** गंभीर है? (हल्का/मध्यम/तेज़)\n🔹 **क्या कुछ** और भी लक्षण हैं?\n\nमैं आपको उचित मार्गदर्शन दूंगा! 💊";
    }
    return "I'd like to understand your concern better. 🩺\n\nCould you tell me more:\n🔹 **What symptoms** are you experiencing?\n🔹 **When did** they start?\n🔹 **How severe** are they? (mild/moderate/severe)\n🔹 **Any other symptoms** with it?\n\nI'll guide you based on your answers! 💊";
  }

  // Completely unmatched → friendly redirect
  if (chatType === "ayush") {
    if (language === "hi") {
      return "मैं आयुर्वेदिक स्वास्थ्य सहायक हूं। 🌿\n\nमैं इन विषयों पर मदद कर सकता हूं:\n• **प्रकृति** — आपका शरीर संविधान\n• **दोष** — वात, पित्त, कफ\n• **जड़ी-बूटियां** — अश्वगंधा, ब्राह्मी, त्रिफला\n• **दिनचर्या** — दैनिक दिनचर्या और योग\n• **आहार** — दोष के अनुसार भोजन\n\nआपका सवाल इनमें से किस बारे में है?";
    }
    return "I'm your AYUSH Ayurvedic health assistant. 🌿\n\nI can help with:\n• **Prakriti** — your body constitution\n• **Doshas** — Vata, Pitta, Kapha balance\n• **Herbs** — Ashwagandha, Brahmi, Triphala\n• **Dinacharya** — daily routine & yoga\n• **Diet** — dosha-based nutrition\n\nWhat would you like to know?";
  }

  // General fallback
  if (language === "hi") {
    return "मैं आपकी मदद करना चाहूंगा! 😊\n\nमुझसे आप ये पूछ सकते हैं:\n🩺 **लक्षण** — बुखार, सिरदर्द, खांसी, दस्त आदि\n💊 **दवाइयां** — पैरासिटामोल, एंटीबायोटिक्स आदि\n🥗 **आहार** — मधुमेह, बीपी, वज़न के लिए आहार\n🏥 **रोग** — मधुमेह, उच्च रक्तचाप, थायरॉयड\n🚨 **आपातकाल** — प्राथमिक उपचार\n\nबस अपना सवाल लिखिए — मैं जवाब दूंगा!";
  }
  return "I'm here to help! 😊 You can ask me about:\n\n🩺 **Symptoms** — fever, headache, cough, diarrhea, etc.\n💊 **Medications** — paracetamol, antibiotics, BP medicines, etc.\n🥗 **Diet** — what to eat for diabetes, BP, weight management\n🏥 **Diseases** — diabetes, hypertension, thyroid, asthma\n🌿 **AYUSH** — Ayurvedic remedies, yoga, herbs\n🚨 **Emergency** — first aid guidance\n\nJust type your question naturally — I'll do my best to help! 💪";
}

function trimmedLength(s: string): number {
  return s.trim().length;
}
