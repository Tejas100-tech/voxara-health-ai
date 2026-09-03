// ── Disease-Specific Question Database ─────────────────────────────────────
// Logical and conceptual questions for each disease category, translated into all Indian languages

export interface DiseaseQuestion {
  category: string;
  question: string;
  mcqOptions?: string[];
}

export interface DiseaseQuestionBank {
  [disease: string]: {
    [lang: string]: DiseaseQuestion[];
  };
}

// Disease categories and their questions
export const DISEASE_QUESTIONS: DiseaseQuestionBank = {
  // ── CHEST PAIN / CARDIAC ──────────────────────────────────────────────
  "chest pain": {
    en: [
      { category: "Character", question: "Can you describe the pain? Is it sharp, dull, burning, or crushing?", mcqOptions: ["Sharp/stabbing", "Dull/aching", "Burning", "Crushing/squeezing", "Tightness"] },
      { category: "Location", question: "Where exactly is the pain located? Does it stay in one place or move?", mcqOptions: ["Center of chest", "Left side", "Right side", "Spreads to arm", "Spreads to jaw"] },
      { category: "Radiation", question: "Does the pain spread anywhere else — like your arm, jaw, or back?", mcqOptions: ["Left arm", "Right arm", "Jaw/neck", "Back", "No radiation"] },
      { category: "Timing", question: "When did the pain start? Is it constant or does it come and go?", mcqOptions: ["Started suddenly", "Started gradually", "Comes and goes", "Constant pain", "Started today"] },
      { category: "Aggravating", question: "What makes the pain worse? Walking, breathing, eating, or lying down?", mcqOptions: ["Walking/exertion", "Deep breathing", "Eating food", "Lying down", "Nothing specific"] },
      { category: "Relieving", question: "What makes the pain better? Rest, medicine, or changing position?", mcqOptions: ["Rest", "Sitting up", "Medicine", "Change of position", "Nothing helps"] },
      { category: "Severity", question: "On a scale of 1 to 10, how severe is the pain right now?", mcqOptions: ["1-3 (mild)", "4-6 (moderate)", "7-8 (severe)", "9-10 (unbearable)"] },
      { category: "Associated", question: "Along with the chest pain, are you experiencing any other symptoms?", mcqOptions: ["Shortness of breath", "Sweating", "Nausea/vomiting", "Dizziness", "Palpitations", "None"] },
      { category: "Red Flags", question: "Have you had chest pain like this before? Any history of heart disease?", mcqOptions: ["First time", "Had before", "Family history of heart disease", "Known heart condition", "Diabetes/hypertension"] },
      { category: "Risk Factors", question: "Do you smoke, consume alcohol, or have high blood pressure or diabetes?", mcqOptions: ["Smoker", "Alcohol use", "High BP", "Diabetes", "None of these"] },
    ],
    hi: [
      { category: "प्रकृति", question: "दर्द कैसा है? क्या यह तेज़, सुन्न, जलने वाला, या कुचलने वाला है?", mcqOptions: ["तेज़/चुभने वाला", "सुन्न/दर्द", "जलने वाला", "कुचलने वाला", "बेचैनी"] },
      { category: "स्थान", question: "दर्द ठीक कहाँ है? क्या यह एक जगह रहता है या घूमता है?", mcqOptions: ["छाती के बीच", "बाईं तरफ", "दाईं तरफ", "बांह में फैलता है", "जबड़े में फैलता है"] },
      { category: "फैलाव", question: "क्या दर्द कहीं और फैलता है — जैसे बांह, जबड़ा, या पीठ?", mcqOptions: ["बाईं बांह", "दाईं बांह", "जबड़ा/गर्दन", "पीठ", "कोई फैलाव नहीं"] },
      { category: "समय", question: "दर्द कब शुरू हुआ? क्या यह लगातार है या आता-जाता है?", mcqOptions: ["अचानक शुरू", "धीरे-धीरे शुरू", "आता-जाता है", "लगातार दर्द", "आज शुरू हुआ"] },
      { category: "बढ़ने वाले", question: "क्या चलने, सांस लेने, खाने, या लेटने से दर्द बढ़ता है?", mcqOptions: ["चलने/व्यायाम", "गहरी सांस", "खाना", "लेटना", "कुछ खास नहीं"] },
      { category: "कम होने वाले", question: "क्या आराम, दवा, या स्थिति बदलने से दर्द कम होता है?", mcqOptions: ["आराम", "बैठ जाना", "दवा", "स्थिति बदलना", "कुछ मदद नहीं करता"] },
      { category: "तीव्रता", question: "1 से 10 के पैमाने पर, अभी दर्द कितना गंभीर है?", mcqOptions: ["1-3 (हल्का)", "4-6 (मध्यम)", "7-8 (गंभीर)", "9-10 (असहनीय)"] },
      { category: "सहयोगी", question: "छाती में दर्द के साथ, क्या आपको कोई अन्य लक्षण हैं?", mcqOptions: ["सांस की तकलीफ", "पसीना", "मतली/उल्टी", "चक्कर", "धड़कन", "कोई नहीं"] },
      { category: "खतरे के संकेत", question: "क्या इससे पहले भी ऐसा दर्द हुआ है? हृदय रोग का कोई इतिहास है?", mcqOptions: ["पहली बार", "पहले हुआ है", "परिवार में हृदय रोग", "ज्ञात हृदय स्थिति", "मधुमेह/उच्च रक्तचाप"] },
      { category: "जोखिम कारक", question: "क्या आप धूम्रपान करते हैं, शराब पीते हैं, या उच्च रक्तचाप या मधुमेह है?", mcqOptions: ["धूम्रपान", "शराब", "उच्च रक्तचाप", "मधुमेह", "इनमें से कोई नहीं"] },
    ],
    ta: [
      { category: "தன்மை", question: "வலி எப்படி இருக்கிறது? அது கூர்மையானதா, சுமையானதா, எரியும் தன்மை உடையதா, அல்லது நெரிக்கும் தன்மை உடையதா?", mcqOptions: ["கூர்மை/குத்தும்", "சுமை/வலி", "எரியும்", "நெரிக்கும்", "அழுத்தம்"] },
      { category: "இடம்", question: "வலி எங்கே இருக்கிறது? அது ஒரே இடத்தில் இருக்கிறதா அல்லது நகர்கிறதா?", mcqOptions: ["மார்பின் நடுப்பு", "இடது பக்கம்", "வலது பக்கம்", "கைக்கு பரவுகிறது", "தாடைக்கு பரவுகிறது"] },
      { category: "பரவல்", question: "வலி வேறு எங்கும் பரவுகிறதா — கை, தாடை அல்லது முதுகு?", mcqOptions: ["இடது கை", "வலது கை", "தாடை/கழுத்து", "முதுகு", "பரவல் இல்லை"] },
      { category: "நேரம்", question: "வலி எப்போது தொடங்கியது? அது நிலையானதா அல்லது வந்து போகிறதா?", mcqOptions: ["திடீரென தொடங்கியது", "படிப்படியாக தொடங்கியது", "வந்து போகிறது", "நிலையான வலி", "இன்று தொடங்கியது"] },
      { category: "மோசமாக்குவது", question: "நடப்பது, சுவாசிப்பது, சாப்பிடுவது அல்லது படுப்பது வலியை மோசமாக்குமா?", mcqOptions: ["நடப்பது/உடற்பயிற்சி", "ஆழமான சுவாசம்", "உணவு", "படுப்பது", "குறிப்பிட்ட ஒன்று இல்லை"] },
      { category: "குறைக்கும்", question: "ஓய்வு, மருந்து அல்லது நிலை மாற்றம் வலியைக் குறைக்குமா?", mcqOptions: ["ஓய்வு", "அமர்ந்துவிடு", "மருந்து", "நிலை மாற்றம்", "ஒன்றும் உதவவில்லை"] },
      { category: "தீவிரம்", question: "1 முதல் 10 வரையிலான அளவில், வலி எவ்வளவு தீவிரமாக இருக்கிறது?", mcqOptions: ["1-3 (லேசான)", "4-6 (நடுத்தம்)", "7-8 (தீவிரம்)", "9-10 (தாங்க முடியாது)"] },
      { category: "உடன் அறிகுறிகள்", question: "மார்பு வலியுடன், வேறு ஏதேனும் அறிகுறிகள் உள்ளதா?", mcqOptions: ["மூச்சுத்திணறல்", "வியர்வை", "குமட்டல்/வாந்தி", "தலைச்சுற்றல்", "இதயத் துடிப்பு", "இல்லை"] },
      { category: "சிவப்பு கொடி", question: "இதற்கு முன்பும் இப்படி வலி இருந்ததா? இதய நோய் வரலாறு உள்ளதா?", mcqOptions: ["முதல் முறை", "முன்பு இருந்தது", "குடும்பத்தில் இதய நோய்", "அறியப்பட்ட இதய நிலை", "நீரிழிவு/உயர் இரத்த அழுத்தம்"] },
      { category: "ஆபத்து காரணிகள்", question: "புகைப்பிடிக்கிறீர்களா, மது அருந்துகிறீர்களா, அல்லது உயர் இரத்த அழுத்தம் அல்லது நீரிழிவு உள்ளதா?", mcqOptions: ["புகைப்பிடித்தல்", "மது", "உயர் இரத்த அழுத்தம்", "நீரிழிவு", "இவை இல்லை"] },
    ],
    bn: [
      { category: "প্রকৃতি", question: "ব্যথা কেমন? তীব্র, ম্লান, পোড়া, নাকি চেপে ধরা বোধ হচ্ছে?", mcqOptions: ["তীব্র/কাটা", "ম্লান/ব্যথা", "পোড়া", "চেপে ধরা", "বেচৈনি"] },
      { category: "অবস্থান", question: "ব্যথা ঠিক কোথায়? এক জায়গায় থাকে নাকি ঘুরে ঘুরে আসে?", mcqOptions: ["বুকের মাঝে", "বাঁ পাশে", "ডান পাশে", "বাহুতে ছড়ায়", "চোয়ালে ছড়ায়"] },
      { category: "বিস্তার", question: "ব্যথা অন্য কোথাও ছড়ায় কি — বাহু, চোয়াল, নাকি পিঠে?", mcqOptions: ["বাঁ বাহু", "ডান বাহু", "চোয়াল/ঘাড়", "পিঠ", "ছড়ায় না"] },
      { category: "সময়", question: "ব্যথা কখন শুরু হয়েছে? অবিরাম নাকি এসে যায়?", mcqOptions: ["হঠাৎ শুরু", "ধীরে ধীরে শুরু", "এসে যায়", "অবিরাম ব্যথা", "আজ শুরু"] },
      { category: "বাড়ানো", question: "হাঁটা, শ্বাস নেওয়া, খাওয়া, নাকি শুয়ে থাকায় ব্যথা বাড়ে?", mcqOptions: ["হাঁটা/ব্যায়াম", "গভীর শ্বাস", "খাবার", "শুয়ে থাকা", "নির্দিষ্ট কিছু নয়"] },
      { category: "কমানো", question: "বিশ্রাম, ওষুধ, নাকি অবস্থা পরিবর্তনে ব্যথা কমে?", mcqOptions: ["বিশ্রাম", "বসে পড়া", "ওষুধ", "অবস্থা পরিবর্তন", "কিছুই সাহায্য করে না"] },
      { category: "তীব্রতা", question: "১ থেকে ১০ স্কেলে, বর্তমানে ব্যথা কতটা তীব্র?", mcqOptions: ["১-৩ (হালকা)", "৪-৬ (মাঝারি)", "৭-৮ (তীব্র)", "৯-১০ (সহ্যের বাইরে)"] },
      { category: "সহযোগী", question: "বুকে ব্যথার সাথে অন্য কোনো উপসর্গ আছে?", mcqOptions: ["শ্বাসকষ্ট", "ঘাম", "বমি/বমি ভাব", "মাথাঘোরা", "হৃদস্পন্দন", "নেই"] },
      { category: "বিপদ সংকেত", question: "আগেও এরকম ব্যথা হয়েছে? হৃদরোগের ইতিহাস আছে?", mcqOptions: ["প্রথমবার", "আগে হয়েছে", "পরিবারে হৃদরোগ", "জানা হৃদরোগ", "ডায়াবেটিস/উচ্চ রক্তচাপ"] },
      { category: "ঝুঁকি", question: "ধূমপায়ী, মদ্যপায়ী, নাকি উচ্চ রক্তচাপ বা ডায়াবেটিস আছে?", mcqOptions: ["ধূমপায়ী", "মদ্যপান", "উচ্চ রক্তচাপ", "ডায়াবেটিস", "এগুলো কোনোটি নয়"] },
    ],
    mr: [
      { category: "प्रकृती", question: "दुखणे कसे आहे? तेज, जाड, जळणारे, किंवा चेरणारे आहे?", mcqOptions: ["तेज/कोरडे", "जाड/दुखणे", "जळणारे", "चेरणारे", "बेचैनी"] },
      { category: "स्थान", question: "दुखणे ठीक कुठे आहे? एका जागेवर राहते किंवा फिरते?", mcqOptions: ["छातीच्या मध्ये", "डाव्या बाजूला", "उजव्या बाजूला", "हातात पसरते", "जबड्यात पसरते"] },
      { category: "पसरणे", question: "दुखणे दुस्रीकडे पसरते का — हात, जबडा किंवा पाठ?", mcqOptions: ["डावा हात", "उजवा हात", "जबडा/घाऊ", "पाठ", "पसरत नाही"] },
      { category: "वेळ", question: "दुखणे कधी सुरू झाले? सतत आहे किंवा येत जाते?", mcqOptions: ["अचानक सुरू", "हळूहळू सुरू", "येत जाते", "सतत दुखणे", "आज सुरू"] },
      { category: "वाढवणारे", question: "चालणे, श्वास घेणे, खाणे किंवा झोपण्याने दुखणे वाढते का?", mcqOptions: ["चालणे/व्यायाम", "खोल श्वास", "जेवण", "झोपणे", "काही खास नाही"] },
      { category: "कमी करणारे", question: "विश्रांती, औषध किंवा स्थिती बदलण्याने दुखणे कमी होते का?", mcqOptions: ["विश्रांती", "बसून बसणे", "औषध", "स्थिती बदलणे", "काहीच मदत करत नाही"] },
      { category: "तीव्रता", question: "१ ते १० स्केलवर, आत्ता दुखणे किती गंभीर आहे?", mcqOptions: ["१-३ (हलके)", "४-६ (मध्यम)", "७-८ (गंभीर)", "९-१० (असह्य)"] },
      { category: "सहयोगी", question: "छातीतील दुखण्याबरोबर, अन्य कोणतेही लक्षण आहेत?", mcqOptions: ["श्वासाची त्रास", "घाम", "मळमळ/उलट्या", "चक्कर", "हृदयाचा डोळा", "नाहीत"] },
      { category: "धोका संकेत", question: "यापूर्वीही असे दुखणे झाले आहे का? हृदयरोगाचा इतिहास आहे का?", mcqOptions: ["पहिल्यांदा", "आधी झाले", "कुटुंबात हृदयरोग", "माहित असलेली हृदय स्थिती", "मधुमेह/उच्च रक्तदाब"] },
      { category: "धोका घटक", question: "तुम्ही धूम्रपान करता, मद्यपान करता, किंवा उच्च रक्तदाब किंवा मधुमेह आहे का?", mcqOptions: ["धूम्रपान", "मद्यपान", "उच्च रक्तदाब", "मधुमेह", "यापैकी काही नाही"] },
    ],
    gu: [
      { category: "પ્રકૃતિ", question: "દુખાવો કેવો છે? તીખો, સુસ્ત, બળતરાવાળો, કે દબાણ વાળો?", mcqOptions: ["તીખો/ચુભતો", "સુસ્ત/દુખાવો", "બળતરાવાળો", "દબાણ વાળો", "બેચેની"] },
      { category: "સ્થાન", question: "દુખાવો ઠીક ક્યાં છે? એક જગ્યાએ રહે છે કે ફરે છે?", mcqOptions: ["છાતીના મધ્યમાં", "ડાબી બાજુ", "જમણી બાજુ", "હાથમાં ફેલાય છે", "ચાણામાં ફેલાય છે"] },
      { category: "ફેલાવો", question: "દુખાવો બીજે ક્યાંય ફેલાય છે — હાથ, ચાણા કે પીઠમાં?", mcqOptions: ["ડાબો હાથ", "જમણો હાથ", "ચાણો/ગળું", "પીઠ", "ફેલાતો નથી"] },
      { category: "સમય", question: "દુખાવો ક્યારે શરૂ થયો? સતત છે કે આવે છે જાય છે?", mcqOptions: ["અચાનક શરૂ", "ધીમે ધીમે શરૂ", "આવે છે જાય છે", "સતત દુખાવો", "આજે શરૂ"] },
      { category: "વધારતા", question: "ચાલવાથી, શ્વાસ લેવાથી, ખાવાથી કે સૂતાથી દુખાવો વધે છે?", mcqOptions: ["ચાલવું/વ્યાયામ", "ઊંડો શ્વાસ", "ખાવાનું", "સૂવું", "ખાસ કંઈ નહીં"] },
      { category: "ઘટાડતા", question: "આરામ, દવા કે સ્થિતિ બદલવાથી દુખાવો ઘટે છે?", mcqOptions: ["આરામ", "બેસી જવું", "દવા", "સ્થિતિ બદલવી", "કંઈ મદદ નથી કરતું"] },
      { category: "તીવ્રતા", question: "૧ થી ૧૦ સ્કેલ પર, હાલમાં દુખાવો કેટલો ગંભીર છે?", mcqOptions: ["૧-૩ (હલકો)", "૪-૬ (મધ્યમ)", "૭-૮ (ગંભીર)", "૯-૧૦ (અસહ્ય)"] },
      { category: "સહયોગી", question: "છાતીના દુખાવા સાથે, બીજા કોઈ લક્ષણો છે?", mcqOptions: ["શ્વાસ લેવામાં તકલીફ", "પરસેવો", "ઉબકી/ઉલ્ટી", "ચક્કર", "હૃદયના ધબકારા", "નથી"] },
      { category: "ખતરાના સંકેત", question: "અગાઉ પણ આવો દુખાવો થયો? હૃદયરોગનો ઇતિહાસ છે?", mcqOptions: ["પહેલીવાર", "અગાઉ થયો", "પરિવારમાં હૃદયરોગ", "જાણીતી હૃદય સ્થિતિ", "મધુપ્રમેહ/ઉચ્ચ રક્તચાપ"] },
      { category: "જોખમ પરિબળો", question: "તમે ધૂમ્રપાન કરો છો, દારૂ પીઓ છો, કે ઉચ્ચ રક્તચાપ કે મધુપ્રમેહ છે?", mcqOptions: ["ધૂમ્રપાન", "દારૂ", "ઉચ્ચ રક્તચાપ", "મધુપ્રમેહ", "આમાંથી કંઈ નહીં"] },
    ],
    kn: [
      { category: "ಸ್ವರೂಪ", question: "ನೋವು ಹೇಗಿದೆ? ಚುಚ್ಚುವಂತಹ, ಅಂಗಡಿ, ಉರಿಯುವಂತಹ, ಅಥವಾ ಒತ್ತುವಂತಹ?", mcqOptions: ["ಚುಚ್ಚುವ/ಕೊಯ್ಯುವ", "ಅಂಗಡಿ/ನೋವು", "ಉರಿಯುವ", "ಒತ್ತುವ", "ಆತಂಕ"] },
      { category: "ಸ್ಥಳ", question: "ನೋವು ಖಚಿತವಾಗಿ ಎಲ್ಲಿದೆ? ಒಂದೇ ಸ್ಥಳದಲ್ಲಿ ಇರುತ್ತದೆಯೇ ಅಥವಾ ಚಲಿಸುತ್ತದೆಯೇ?", mcqOptions: ["ಎದೆಯ ಮಧ್ಯದಲ್ಲಿ", "ಎಡ ಬದಿಯಲ್ಲಿ", "ಬಲ ಬದಿಯಲ್ಲಿ", "ಕೈಗೆ ಹರಡುತ್ತದೆ", "ಹಲ್ಲಿಗೆ ಹರಡುತ್ತದೆ"] },
      { category: "ಹರಡುವಿಕೆ", question: "ನೋವು ಬೇರೆ ಎಲ್ಲಿಯಾದರೂ ಹರಡುತ್ತದೆಯೇ — ಕೈ, ಹಲ್ಲು, ಅಥವಾ ಬೆನ್ನು?", mcqOptions: ["ಎಡ ಕೈ", "ಬಲ ಕೈ", "ಹಲ್ಲು/ಕುತ್ತಿಗೆ", "ಬೆನ್ನು", "ಹರಡುವುದಿಲ್ಲ"] },
      { category: "ಸಮಯ", question: "ನೋವು ಯಾವಾಗ ಪ್ರಾರಂಭವಾಯಿತು? ನಿರಂತರವಾಗಿದೆಯೇ ಅಥವಾ ಬಂದು ಹೋಗುತ್ತದೆಯೇ?", mcqOptions: ["ಇದ್ದಕ್ಕಿದ್ದಂತೆ ಪ್ರಾರಂಭ", "ನಿಧಾನವಾಗಿ ಪ್ರಾರಂಭ", "ಬಂದು ಹೋಗುತ್ತದೆ", "ನಿರಂತರ ನೋವು", "ಇಂದು ಪ್ರಾರಂಭ"] },
      { category: "ಹೆಚ್ಚಿಸುವ", question: "ನಡೆಯುವುದು, ಉಸಿರಾಡುವುದು, ತಿನ್ನುವುದು ಅಥವಾ ಮಲಗುವುದರಿಂದ ನೋವು ಹೆಚ್ಚಾಗುತ್ತದೆಯೇ?", mcqOptions: ["ನಡೆಯುವುದು/ವ್ಯಾಯಾಮ", "ಆಳವಾದ ಉಸಿರಾಟ", "ಆಹಾರ", "ಮಲಗುವುದು", "ನಿರ್ದಿಷ್ಟ ಯಾವುದೂ ಇಲ್ಲ"] },
      { category: "ಕಡಿಮೆ ಮಾಡುವ", question: "ವಿಶ್ರಾಂತಿ, ಔಷಧ ಅಥವಾ ಸ್ಥಿತಿ ಬದಲಾಯಿಸುವುದರಿಂದ ನೋವು ಕಡಿಮೆಯಾಗುತ್ತದೆಯೇ?", mcqOptions: ["ವಿಶ್ರಾಂತಿ", "ಕುಳಿತುಕೊಳ್ಳುವುದು", "ಔಷಧ", "ಸ್ಥಿತಿ ಬದಲಾಯಿಸುವುದು", "ಏನೂ ಸಹಾಯ ಮಾಡುವುದಿಲ್ಲ"] },
      { category: "ತೀವ್ರತೆ", question: "೧ ರಿಂದ ೧೦ ಸ್ಕೇಲ್‌ನಲ್ಲಿ, ಪ್ರಸ್ತುತ ನೋವು ಎಷ್ಟು ತೀವ್ರವಾಗಿದೆ?", mcqOptions: ["೧-೩ (ಹಗುರ)", "೪-೬ (ಮಧ್ಯಮ)", "೭-೮ (ತೀವ್ರ)", "೯-೧೦ (ಸಹಿಸಲಾಗದು)"] },
      { category: "ಸಹಾಯಕ", question: "ಎದೆ ನೋವಿನ ಜೊತೆಗೆ, ಬೇರೆ ಯಾವುದೇ ಲಕ್ಷಣಗಳಿವೆಯೇ?", mcqOptions: ["ಉಸಿರಾಟದ ತೊಂದರೆ", "ಬೆವರು", "ಉಬ್ಬರ/ವಾಂತಿ", "ತಲೆಸುತ್ತು", "ಹೃದಯ ಬಡಿತ", "ಇಲ್ಲ"] },
      { category: "ಅಪಾಯ ಸಂಕೇತ", question: "ಹಿಂದೆಯೂ ಇಂತಹ ನೋವು ಇತ್ತೇ? ಹೃದ್ರೋಗದ ಇತಿಹಾಸ ಇದೆಯೇ?", mcqOptions: ["ಮೊದಲ ಬಾರಿ", "ಹಿಂದೆ ಇತ್ತು", "ಕುಟುಂಬದಲ್ಲಿ ಹೃದ್ರೋಗ", "ತಿಳಿದಿರುವ ಹೃದಯ ಸ್ಥಿತಿ", "ಮಧುಮೇಹ/ಅಧಿಕ ರಕ್ತದೊತ್ತಡ"] },
      { category: "ಅಪಾಯ ಅಂಶಗಳು", question: "ನೀವು ಧೂಮಪಾನ ಮಾಡುತ್ತೀರಾ, ಮದ್ಯಪಾನ ಮಾಡುತ್ತೀರಾ, ಅಥವಾ ಅಧಿಕ ರಕ್ತದೊತ್ತಡ ಅಥವಾ ಮಧುಮೇಹ ಇದೆಯೇ?", mcqOptions: ["ಧೂಮಪಾನ", "ಮದ್ಯಪಾನ", "ಅಧಿಕ ರಕ್ತದೊತ್ತಡ", "ಮಧುಮೇಹ", "ಯಾವುದೂ ಇಲ್ಲ"] },
    ],
    ml: [
      { category: "സ്വഭാവം", question: "വേദന എങ്ങനെയുണ്ട്? മൂർച്ചയുള്ളതോ, മന്ദതയുള്ളതോ, കത്തുന്നതോ, അല്ലെങ്കിൽ ഞെരിക്കുന്നതോ?", mcqOptions: ["മൂർച്ചയുള്ള/കുത്തുന്ന", "മന്ദ/വേദന", "കത്തുന്ന", "�െരിക്കുന്ന", "അസ്വസ്ഥത"] },
      { category: "സ്ഥാനം", question: "വേദന കൃത്യമായി എവിടെയാണ്? ഒരു സ്ഥലത്ത് നിൽക്കുന്നുണ്ടോ അതോ ചലിക്കുന്നുണ്ടോ?", mcqOptions: ["നെഞ്ചിന്റെ നടുക്ക്", "ഇടത് ഭാഗം", "വലത് ഭാഗം", "കൈയിലേക്ക് വ്യാപിക്കുന്നു", "താടിയിലേക്ക് വ്യാപിക്കുന്നു"] },
      { category: "വ്യാപനം", question: "വേദന മറ്റെവിടെയെങ്കിലും വ്യാപിക്കുന്നുണ്ടോ — കൈ, താടി, അല്ലെങ്കിൽ പുറം?", mcqOptions: ["ഇടത് കൈ", "വലത് കൈ", "താടി/കഴുത്ത്", "പുറം", "വ്യാപനമില്ല"] },
      { category: "സമയം", question: "വേദന എപ്പോൾ തുടങ്ങി? നിരന്തരമാണോ അതോ വന്നുപോകുന്നതോ?", mcqOptions: ["പെട്ടെന്ന് തുടങ്ങി", "പതിയെ തുടങ്ങി", "വന്നുപോകുന്നു", "നിരന്തര വേദന", "ഇന്ന് തുടങ്ങി"] },
      { category: "മോശമാക്കുന്നത്", question: "നടക്കുന്നത്, ശ്വാസം എടുക്കുന്നത്, കഴിക്കുന്നത് അല്ലെങ്കിൽ കിടക്കുന്നത് വേദന വഷളാക്കുന്നുണ്ടോ?", mcqOptions: ["നടക്കുക/വ്യായാമം", "ആഴത്തിലുള്ള ശ്വാസം", "ഭക്ഷണം", "കിടക്കുക", "പ്രത്യേക ഒന്നുമില്ല"] },
      { category: "കുറയ്ക്കുന്നത്", question: "വിശ്രമം, മരുന്ന് അല്ലെങ്കിൽ സ്ഥാനം മാറ്റുന്നത് വേദന കുറയ്ക്കുമോ?", mcqOptions: ["വിശ്രമം", "ഇരുന്നുകൊള്ളുക", "മരുന്ന്", "സ്ഥാനം മാറ്റുക", "ഒന്നും സഹായിക്കുന്നില്ല"] },
      { category: "തീവ്രത", question: "1 മുതൽ 10 വരെയുള്ള സ്കേയിൽ, നിലവിൽ വേദന എത്ര തീവ്രമാണ്?", mcqOptions: ["1-3 (നേരിയ)", "4-6 (ഇടത്തരം)", "7-8 (തീവ്രം)", "9-10 (സഹിക്കാനാവാത്തത്)"] },
      { category: "സഹായക ലക്ഷണങ്ങൾ", question: "നെഞ്ചുവേദനയ്ക്ക് പുറമേ, മറ്റെന്തെങ്കിലും ലക്ഷണങ്ങൾ ഉണ്ടോ?", mcqOptions: ["ശ്വാസം മുട്ടൽ", "വിയർപ്പ്", "ഓക്കാനം/ഛർദ്ദി", "തലചുറ്റൽ", "ഹൃദയമിടിപ്പ്", "ഇല്ല"] },
      { category: "ശ്രദ്ധാ സൂചനകൾ", question: "മുമ്പും ഇതുപോലുള്ള വേദന ഉണ്ടായിട്ടുണ്ടോ? ഹൃദ്രോഗ ചരിത്രം ഉണ്ടോ?", mcqOptions: ["ആദ്യ തവണ", "മുമ്പ് ഉണ്ടായിട്ടുണ്ട്", "കുടുംബത്തിൽ ഹൃദ്രോഗം", "അറിയപ്പെടുന്ന ഹൃദയ അവസ്ഥ", "പ്രമേഹം/ഉയർന്ന രക്തസമ്മർദ്ദം"] },
      { category: "അപകട ഘടകങ്ങൾ", question: "പുകവലിക്കുകയോ, മദ്യപിക്കുകയോ, അല്ലെങ്കിൽ ഉയർന്ന രക്തസമ്മർദ്ദം അല്ലെങ്കിൽ പ്രമേഹം ഉണ്ടോ?", mcqOptions: ["പുകവലി", "മദ്യപാനം", "ഉയർന്ന രക്തസമ്മർദ്ദം", "പ്രമേഹം", "ഇവ ഒന്നുമില്ല"] },
    ],
    pa: [
      { category: "ਪ੍ਰਕਾਰ", question: "ਦਰਦ ਕਿਹੋ ਜਿਹਾ ਹੈ? ਤੀਬਰ, ਸੁੰਨ, ਸੜਨ ਵਾਲਾ, ਜਾਂ ਕੁਚਲਣ ਵਾਲਾ?", mcqOptions: ["ਤੀਬਰ/ਚੁਭਣ ਵਾਲਾ", "ਸੁੰਨ/ਦਰਦ", "ਸੜਨ ਵਾਲਾ", "ਕੁਚਲਣ ਵਾਲਾ", "ਬੇਚੈਨੀ"] },
      { category: "ਥਾਂ", question: "ਦਰਦ ਠੀਕ ਕਿੱਥੇ ਹੈ? ਇੱਕ ਥਾਂ ਰਹਿੰਦਾ ਹੈ ਜਾਂ ਘੁੰਮਦਾ ਹੈ?", mcqOptions: ["ਛਾਤੀ ਦੇ ਵਿਚਕਾਰ", "ਖੱਬੇ ਪਾਸੇ", "ਸੱਜੇ ਪਾਸੇ", "ਬਾਹਿਂ ਵਿੱਚ ਫੈਲਦਾ ਹੈ", "ਜਬੜੇ ਵਿੱਚ ਫੈਲਦਾ ਹੈ"] },
      { category: "ਫੈਲਾਅ", question: "ਦਰਦ ਹੋਰ ਕਿਤੇ ਫੈਲਦਾ ਹੈ — ਬਾਹਂ, ਜਬੜਾ, ਜਾਂ ਪਿੱਠ?", mcqOptions: ["ਖੱਬੀ ਬਾਹਂ", "ਸੱਜੀ ਬਾਹਂ", "ਜਬੜਾ/ਗੜ੍ਹਾ", "ਪਿੱਠ", "ਕੋਈ ਫੈਲਾਅ ਨਹੀਂ"] },
      { category: "ਸਮਾਂ", question: "ਦਰਦ ਕਦੋਂ ਸ਼ੁਰੂ ਹੋਇਆ? ਲਗਾਤਾਰ ਹੈ ਜਾਂ ਆਉਂਦਾ ਜਾਂਦਾ ਹੈ?", mcqOptions: ["ਅਚਾਨਕ ਸ਼ੁਰੂ", "ਹੌਲੀ ਹੌਲੀ ਸ਼ੁਰੂ", "ਆਉਂਦਾ ਜਾਂਦਾ ਹੈ", "ਲਗਾਤਾਰ ਦਰਦ", "ਅੱਜ ਸ਼ੁਰੂ"] },
      { category: "ਵਧਾਉਣ ਵਾਲੇ", question: "ਚੱਲਣ, ਸਾਹ ਲੈਣ, ਖਾਣ ਜਾਂ ਲੇਟਣ ਨਾਲ ਦਰਦ ਵਧਦਾ ਹੈ?", mcqOptions: ["ਚੱਲਣ/ਕਸਰਤ", "ਡੂੰਘੀ ਸਾਹ", "ਖਾਣਾ", "ਲੇਟਣਾ", "ਕੁਝ ਖਾਸ ਨਹੀਂ"] },
      { category: "ਘਟਾਉਣ ਵਾਲੇ", question: "ਆਰਾਮ, ਦਵਾ ਜਾਂ ਸਥਿਤੀ ਬਦਲਣ ਨਾਲ ਦਰਦ ਘਟਦਾ ਹੈ?", mcqOptions: ["ਆਰਾਮ", "ਬੈਠ ਜਾਣਾ", "ਦਵਾ", "ਸਥਿਤੀ ਬਦਲਣੀ", "ਕੁਝ ਵੀ ਮਦਦ ਨਹੀਂ ਕਰਦਾ"] },
      { category: "ਤੀਬਰਤਾ", question: "1 ਤੋਂ 10 ਸਕੇਲ 'ਤੇ, ਹੁਣ ਦਰਦ ਕਿੰਨਾ ਗੰਭੀਰ ਹੈ?", mcqOptions: ["1-3 (ਹਲਕਾ)", "4-6 (ਦਰਮਿਆਨਾ)", "7-8 (ਗੰਭੀਰ)", "9-10 (ਸਹਿਣ ਤੋਂ ਬਾਹਰ)"] },
      { category: "ਸਹਾਇਕ", question: "ਛਾਤੀ ਦੇ ਦਰਦ ਨਾਲ, ਕੋਈ ਹੋਰ ਲੱਛਣ ਹਨ?", mcqOptions: ["ਸਾਹ ਲੈਣ ਵਿੱਚ ਤਕਲੀਫ", "ਪਸੀਨਾ", "ਜੀ ਮਿਲਾਉਣਾ/ਉਲਟੀ", "ਚੱਕਰ", "ਦਿਲ ਦੀ ਧੜਕਣ", "ਨਹੀਂ"] },
      { category: "ਖ਼ਤਰੇ ਦੇ ਸੰਕੇਤ", question: "ਪਹਿਲਾਂ ਵੀ ਇਸ ਤਰ੍ਹਾਂ ਦਾ ਦਰਦ ਹੋਇਆ ਸੀ? ਦਿਲ ਦੀ ਬਿਮਾਰੀ ਦਾ ਇਤਿਹਾਸ ਹੈ?", mcqOptions: ["ਪਹਿਲੀ ਵਾਰ", "ਪਹਿਲਾਂ ਹੋਇਆ ਸੀ", "ਪਰਿਵਾਰ ਵਿੱਚ ਦਿਲ ਦੀ ਬਿਮਾਰੀ", "ਜਾਣੀ-ਪਛਾਣੀ ਦਿਲ ਦੀ ਸਥਿਤੀ", "ਸ਼ੂਗਰ/ਹਾਈ ਬੀਪੀ"] },
      { category: "ਜੋਖਮ ਕਾਰਕ", question: "ਤੁਸੀਂ ਸਿਗਰਟ ਪੀਂਦੇ ਹੋ, ਸ਼ਰਾਬ ਪੀਂਦੇ ਹੋ, ਜਾਂ ਹਾਈ ਬੀਪੀ ਜਾਂ ਸ਼ੂਗਰ ਹੈ?", mcqOptions: ["ਸਿਗਰਟ", "ਸ਼ਰਾਬ", "ਹਾਈ ਬੀਪੀ", "ਸ਼ੂਗਰ", "ਇਨ੍ਹਾਂ ਵਿੱਚੋਂ ਕੋਈ ਨਹੀਂ"] },
    ],
    or: [
      { category: "ପ୍ରକୃତି", question: "ଯନ୍ତ୍ରଣା କିପରି? ତୀବ୍ର, ମୃଦୁ, ଜଳୁଥିବା, ନା ଚାପୁଥିବା?", mcqOptions: ["ତୀବ୍ର/କାଟୁଥିବା", "ମୃଦୁ/ଯନ୍ତ୍ରଣା", "ଜଳୁଥିବା", "ଚାପୁଥିବା", "ବ୍ୟାକୁଳତା"] },
      { category: "ସ୍ଥାନ", question: "ଯନ୍ତ୍ରଣା ଠିକ କୁଆଡେ ଅଛି? ଗୋଟିଏ ସ୍ଥାନରେ ରହେ ନା ଘୁରେ?", mcqOptions: ["ବୁକୁ ମଧ୍ୟରେ", "ବାମ ପାର୍ଶ୍ଵରେ", "ଡାହାଣ ପାର୍ଶ୍ଵରେ", "ହାତକୁ ବ୍ୟାପେ", "ଚୋଷ୍ଟିକୁ ବ୍ୟାପେ"] },
      { category: "ବିସ୍ତାର", question: "ଯନ୍ତ୍ରଣା ଅନ୍ୟ କୁଆଡେ ବ୍ୟାପେ — ହାତ, ଚୋଷ୍ଟି, ନା ପିଠି?", mcqOptions: ["ବାମ ହାତ", "ଡାହାଣ ହାତ", "ଚୋଷ୍ଟି/ବେକ", "ପିଠି", "ବ୍ୟାପେ ନାହିଁ"] },
      { category: "ସମୟ", question: "ଯନ୍ତ୍ରଣା କେବେ ଆରମ୍ଭ ହେଲା? ନିରନ୍ତର ନା ଆସେ ଯାଏ?", mcqOptions: ["ହଠାତ୍ ଆରମ୍ଭ", "ଧୀରେ ଧୀରେ ଆରମ୍ଭ", "ଆସେ ଯାଏ", "ନିରନ୍ତର ଯନ୍ତ୍ରଣା", "ଆଜି ଆରମ୍ଭ"] },
      { category: "ବଢ଼ାଉଥିବା", question: "ଚାଲିବା, ନିଶ୍ଵାସ ନେବା, ଖାଇବା ନା ଶୋଇବା ଯନ୍ତ୍ରଣା ବଢ଼ାଏ?", mcqOptions: ["ଚାଲିବା/ବ୍ୟାୟାମ", "ଗଭୀର ନିଶ୍ଵାସ", "ଖାଦ୍ୟ", "ଶୋଇବା", "ନିର୍ଦ୍ଦିଷ୍ଟ କିଛି ନୁହେଁ"] },
      { category: "କମ୍ କରୁଥିବା", question: "ବିଶ୍ରାମ, ଔଷଧ ନା ସ୍ଥିତି ପରିବର୍ତ୍ତନ ଯନ୍ତ୍ରଣା କମ୍ କରେ?", mcqOptions: ["ବିଶ୍ରାମ", "ବସି ଯିବା", "ଔଷଧ", "ସ୍ଥିତି ପରିବର୍ତ୍ତନ", "କିଛି ସାହାଯ୍ୟ କରେ ନାହିଁ"] },
      { category: "ତୀବ୍ରତା", question: "୧ ରୁ ୧୦ ସ୍କେଲରେ, ବର୍ତ୍ତମାନ ଯନ୍ତ୍ରଣା କେତେ ଗୁରୁତର?", mcqOptions: ["୧-୩ (ହାଲୁକା)", "୪-୬ (ମଧ୍ୟମ)", "୭-୮ (ଗୁରୁତର)", "୯-୧୦ (ସହ୍ୟ ବାହାରେ)"] },
      { category: "ସହଯୋଗୀ", question: "ବୁକୁ ଯନ୍ତ୍ରଣା ସହିତ, ଅନ୍ୟ କୌଣସି ଲକ୍ଷଣ ଅଛି?", mcqOptions: ["ନିଶ୍ଵାସ କଷ୍ଟ", "ଝାଳ", "ବାନ୍ତି/ବମି", "ମୁଣ୍ଡ ଘୂରିବା", "ହୃଦୟ ସ୍ପନ୍ଦନ", "ନାହିଁ"] },
      { category: "ବିପଦ ସଙ୍କେତ", question: "ପୂର୍ବରୁ ମଧ୍ୟ ଏପରି ଯନ୍ତ୍ରଣା ହୋଇଛି? ହୃଦୟ ରୋଗ ଇତିହାସ ଅଛି?", mcqOptions: ["ପ୍ରଥମ ଥର", "ପୂର୍ବରୁ ହୋଇଛି", "ପରିବାରରେ ହୃଦୟ ରୋଗ", "ଜଣା ହୃଦୟ ସ୍ଥିତି", "ଡାଇବେଟିସ୍/ହାଇ ବିପି"] },
      { category: "ଜୋଖିମ କାରକ", question: "ଆପଣ ଧୂମପାନ କରନ୍ତି, ମଦ୍ୟପାନ କରନ୍ତି, ନା ହାଇ ବିପି କିମ୍ବା ଡାଇବେଟିସ୍ ଅଛି?", mcqOptions: ["ଧୂମପାନ", "ମଦ୍ୟପାନ", "ହାଇ ବିପି", "ଡାଇବେଟିସ୍", "ଏଗୁଡିକ ମଧ୍ୟରୁ କିଛି ନୁହେଁ"] },
    ],
    as: [
      { category: "প্ৰকৃতি", question: "বিষ কেনেকৈ? তীব্ৰ, মৃদু, জলা-জলা, নে চেপে ধৰা বোধ হয়?", mcqOptions: ["তীব্ৰ/কটা", "মৃদু/বিষ", "জলা-জলা", "চেপে ধৰা", "বেচৈনি"] },
      { category: "স্থান", question: "বিষ ঠিক ক'ত আছে? এটা স্থানত থাকে নে ঘূৰি ঘূৰি আহে?", mcqOptions: ["বকুলৰ মাজত", "বাওঁ পাৰ্শ্বত", "সোঁ পাৰ্শ্বত", "হাতলৈ ছড়ায়", "চোয়াললৈ ছড়ায়"] },
      { category: "বিস্তাৰ", question: "বিষ আন ক'তাও ছড়ায় নেকি — হাত, চোয়াল, নে পিঠ?", mcqOptions: ["বাওঁ হাত", "সোঁ হাত", "চোয়াল/ঘাঁটি", "পিঠ", "ছড়ায় নাই"] },
      { category: "সময়", question: "বিষ কেতিয়া আৰম্ভ হৈছিল? নিৰন্তৰ নে আহি যায়?", mcqOptions: ["হঠাৎ আৰম্ভ", "ধীমাই ধীমাই আৰম্ভ", "আহি যায়", "নিৰন্তৰ বিষ", "আজি আৰম্ভ"] },
      { category: "বঢ়োৱা", question: "লমনি, শ্বাস-প্ৰশ্বাস লওঁতে, খাদ্য খাবলৈ নে শোৱালৈ বিষ বঢ়ে?", mcqOptions: ["লমনি/ব্যায়াম", "গভীৰ শ্বাস", "খাদ্য", "শোৱা", "নিৰ্দিষ্ট কিবা নাই"] },
      { category: "কমোৱা", question: "বিশ্ৰাম, ওষুধ নে অৱস্থা সলনি কৰিলে বিষ কমে?", mcqOptions: ["বিশ্ৰাম", "বহিয়া বহিয়া", "ওষুধ", "অৱস্থা সলনি", "কিবাই সহায় নকৰে"] },
      { category: "তীব্ৰতা", question: "১ ৰ পৰা ১০ স্কেলত, এতিয়া বিষ কিমান গুৰুতৰ?", mcqOptions: ["১-৩ (হালকা)", "৪-৬ (মধ্যম)", "৭-৮ (গুৰুতৰ)", "৯-১০ (সহ্যেৰ বাইৰে)"] },
      { category: "সহযোগী", question: "বকুলৰ বিষৰ লগত, আন কোনো লক্ষণ আছে?", mcqOptions: ["শ্বাস-প্ৰশ্বাসৰ সমস্যা", "ঘাম", "বমি/বমি ভাব", "মাথা ঘূৰা", "হৃদয় স্পন্দন", "নাই"] },
      { category: "বিপদ সংকেত", question: "আগেও এনে বিষ হৈছিল? হৃদৰোগৰ ইতিহাস আছে?", mcqOptions: ["প্ৰথমবাৰ", "আগে হৈছিল", "পৰিয়ালত হৃদৰোগ", "জানা হৃদয়ৰ অৱস্থা", "ডায়াবেটিস/উচ্চ ৰক্তচাপ"] },
      { category: "ঝুঁকি", question: "আপুনি ধূমপান কৰে, মদ্যপান কৰে, নে উচ্চ ৰক্তচাপ বা ডায়াবেটিস আছে?", mcqOptions: ["ধূমপান", "মদ্যপান", "উচ্চ ৰক্তচাপ", "ডায়াবেটিস", "এইবোৰৰ কোনোটো নাই"] },
    ],
    ur: [
      { category: "قسم", question: "درد کیسا ہے؟ تیز، سوکھا، جلنے والا، یا دبانے والا؟", mcqOptions: ["تیز/چبھنے والا", "سوکھا/درد", "جلنے والا", "دبانے والا", "بیچینی"] },
      { category: "جگہ", question: "درد بالکل کہاں ہے؟ ایک جگہ رہتا ہے یا گھومتا ہے؟", mcqOptions: ["سینے کے وسط میں", "بائیں طرف", "دائیں طرف", "بازو میں پھیلتا ہے", "جبڑے میں پھیلتا ہے"] },
      { category: "پھیلاؤ", question: "درد اور کہیں پھیلتا ہے — بازو، جبڑا، یا کمر؟", mcqOptions: ["بائیں بازو", "دائیں بازو", "جبڑا/گردن", "کمر", "کوئی پھیلاؤ نہیں"] },
      { category: "وقت", question: "درد کب شروع ہوا؟ مسلسل ہے یا آتا جاتا ہے؟", mcqOptions: ["اچانک شروع", "ہلتے ہلے شروع", "آتا جاتا ہے", "مسلسل درد", "آج شروع"] },
      { category: "بڑھانے والے", question: "چلنے، سانس لینے، کھانے یا لیٹنے سے درد بڑھتا ہے؟", mcqOptions: ["چلنے/ورزش", "گہری سانس", "کھانا", "لیٹنا", "کوئی خاص نہیں"] },
      { category: "کم کرنے والے", question: "آرام، دوا یا حالت بدلنے سے درد کم ہوتا ہے؟", mcqOptions: ["آرام", "بیٹھ جانا", "دوا", "حالت بدلنا", "کچھ بھی مدد نہیں کرتا"] },
      { category: "شدت", question: "1 سے 10 اسکیل پر، فی الحال درد کتنا سنگین ہے؟", mcqOptions: ["1-3 (ہلکا)", "4-6 (درمیانی)", "7-8 (سنگین)", "9-10 (برداشت کے قابل نہیں)"] },
      { category: "همراه", question: "سینے کے درد کے ساتھ، کوئی اور علامات ہیں؟", mcqOptions: ["سانس میں تکلیف", "پسینہ", "متلی/الٹی", "چکر", "دل کی دھڑکن", "نہیں"] },
      { category: "خطرے کی علامت", question: "اس سے پہلے بھی ایسا درد ہوا ہے؟ دل کی بیماری کی تاریخ ہے؟", mcqOptions: ["پہلی بار", "پہلے ہوا", "خاندان میں دل کی بیماری", "معلوم دل کی حالت", "شوگر/ہائی بلڈ پریشر"] },
      { category: "خطرے کے عوامل", question: "آپ سگریٹ پیتے ہیں، شراب پیتے ہیں، یا ہائی بلڈ پریشر یا شوگر ہے؟", mcqOptions: ["سگریٹ", "شراب", "ہائی بلڈ پریشر", "شوگر", "ان میں سے کوئی نہیں"] },
    ],
  },

  // ── HEADACHE ──────────────────────────────────────────────────────────
  "headache": {
    en: [
      { category: "Character", question: "What type of headache is it — throbbing, pressure, stabbing, or dull?", mcqOptions: ["Throbbing/pulsating", "Pressure/tightness", "Stabbing/sharp", "Dull/aching", "Band-like tightness"] },
      { category: "Location", question: "Where is the headache located? Front, back, one side, or all over?", mcqOptions: ["Front (forehead)", "Back of head", "One side only", "All over", "Around the eyes"] },
      { category: "Onset", question: "Did the headache start suddenly or gradually? Any trigger like stress, food, or sleep change?", mcqOptions: ["Sudden onset", "Gradual onset", "After stress/tension", "After food triggers", "After sleep change"] },
      { category: "Severity", question: "How severe is the headache on a scale of 1 to 10?", mcqOptions: ["1-3 (mild)", "4-6 (moderate)", "7-8 (severe)", "9-10 (worst ever)"] },
      { category: "Associated", question: "Are you experiencing nausea, vomiting, sensitivity to light, or visual changes?", mcqOptions: ["Nausea/vomiting", "Light sensitivity", "Sound sensitivity", "Blurred vision", "None"] },
      { category: "Duration", question: "How long does each headache episode last?", mcqOptions: ["Less than 30 minutes", "30 min to 2 hours", "2 to 4 hours", "4 to 72 hours", "More than 72 hours"] },
      { category: "Red Flags", question: "Is this the worst headache of your life? Any fever, stiff neck, confusion, or weakness?", mcqOptions: ["Worst headache ever", "Fever with headache", "Stiff neck", "Confusion/weakness", "None of these"] },
    ],
    hi: [
      { category: "प्रकृति", question: "सिरदर्द किस प्रकार का है — धड़कने वाला, दबाव वाला, चुभने वाला, या सुन्न?", mcqOptions: ["धड़कने वाला", "दबाव/तनाव", "चुभने वाला/तेज़", "सुन्न/दर्द", "पट्टी जैसा तनाव"] },
      { category: "स्थान", question: "सिरदर्द कहाँ है? आगे, पीछे, एक तरफ, या पूरे सिर में?", mcqOptions: ["आगे (माथे)", "सिर के पीछे", "सिर्फ एक तरफ", "पूरे सिर में", "आँखों के चारों ओर"] },
      { category: "शुरुआत", question: "सिरदर्द अचानक शुरू हुआ या धीरे-धीरे? तनाव, खाना, या नींद में बदलाव से?", mcqOptions: ["अचानक शुरू", "धीरे-धीरे शुरू", "तनाव के बाद", "खाने की वजह से", "नींद में बदलाव"] },
      { category: "तीव्रता", question: "1 से 10 के पैमाने पर सिरदर्द कितना गंभीर है?", mcqOptions: ["1-3 (हल्का)", "4-6 (मध्यम)", "7-8 (गंभीर)", "9-10 (सबसे खराब)"] },
      { category: "सहयोगी", question: "क्या आपको मतली, उल्टी, रोशनी संवेदनशीलता, या दृष्टि में बदलाव है?", mcqOptions: ["मतली/उल्टी", "रोशनी संवेदनशीलता", "आवाज़ संवेदनशीलता", "धुंधली दृष्टि", "कोई नहीं"] },
      { category: "अवधि", question: "प्रत्येक सिरदर्द कितने समय तक रहता है?", mcqOptions: ["30 मिनट से कम", "30 मिनट से 2 घंटे", "2 से 4 घंटे", "4 से 72 घंटे", "72 घंटे से अधिक"] },
      { category: "खतरे के संकेत", question: "क्या यह आपके जीवन का सबसे खराब सिरदर्द है? बुखार, अकड़न, या कमज़ोरी?", mcqOptions: ["सबसे खराब सिरदर्द", "बुखार के साथ", "गर्दन में अकड़न", "भ्रम/कमज़ोरी", "कोई नहीं"] },
    ],
  },

  // ── FEVER ─────────────────────────────────────────────────────────────
  "fever": {
    en: [
      { category: "Onset", question: "When did the fever start? Did it come on suddenly or gradually?", mcqOptions: ["Sudden onset", "Gradual onset", "Started today", "Started yesterday", "Been a few days"] },
      { category: "Pattern", question: "Is the fever continuous or does it come and go? Any pattern like evening rise?", mcqOptions: ["Continuous", "Comes and goes", "Evening rise", "Morning rise", "Intermittent"] },
      { category: "Temperature", question: "What temperature was recorded? Do you have a thermometer reading?", mcqOptions: ["Below 100°F", "100-102°F", "102-104°F", "Above 104°F", "Not measured"] },
      { category: "Associated", question: "Do you have chills, sweating, body ache, headache, or rash along with the fever?", mcqOptions: ["Chills/rigors", "Sweating", "Body ache", "Headache", "Skin rash", "None"] },
      { category: "Localizing", question: "Any specific symptoms pointing to a source — cough, burning urine, loose motions, or throat pain?", mcqOptions: ["Cough/sore throat", "Burning urine", "Loose motions", "Ear pain", "Skin infection", "None"] },
      { category: "Risk", question: "Recent travel, contact with sick persons, mosquito bites, or any chronic illness?", mcqOptions: ["Recent travel", "Contact with sick", "Mosquito bites", "Chronic illness", "None"] },
    ],
    hi: [
      { category: "शुरुआत", question: "बुखार कब शुरू हुआ? अचानक आया या धीरे-धीरे?", mcqOptions: ["अचानक शुरू", "धीरे-धीरे शुरू", "आज शुरू", "कल शुरू", "कुछ दिन हो गए"] },
      { category: "पैटर्न", question: "बुखार लगातार है या आता-जाता है? शाम को बढ़ने जैसा पैटर्न है?", mcqOptions: ["लगातार", "आता-जाता है", "शाम को बढ़ता है", "सुबह बढ़ता है", "बीच-बीच में"] },
      { category: "तापमान", question: "कितना तापमान दर्ज किया गया? थर्मामीटर की रीडिंग है?", mcqOptions: ["100°F से कम", "100-102°F", "102-104°F", "104°F से अधिक", "मापा नहीं"] },
      { category: "सहयोगी", question: "क्या ठंड लगना, पसीना, शरीर दर्द, सिरदर्द, या चकत्ते हैं?", mcqOptions: ["ठंड/कंपकंपी", "पसीना", "शरीर दर्द", "सिरदर्द", "त्वचा पर चकत्ते", "कोई नहीं"] },
      { category: "स्थानीय", question: "कोई विशिष्ट लक्षण — खांसी, पेशाब में जलन, दस्त, या गले में दर्द?", mcqOptions: ["खांसी/गले में दर्द", "पेशाब में जलन", "दस्त", "कान में दर्द", "त्वचा का संक्रमण", "कोई नहीं"] },
      { category: "जोखिम", question: "हाल ही में यात्रा, बीमार व्यक्ति के संपर्क, मच्छर के काटने, या कोई बीमारी?", mcqOptions: ["हाल की यात्रा", "बीमार व्यक्ति के संपर्क", "मच्छर के काटने", "पुरानी बीमारी", "कोई नहीं"] },
    ],
  },

  // ── COUGH ─────────────────────────────────────────────────────────────
  "cough": {
    en: [
      { category: "Duration", question: "How long have you had the cough? Is it acute (less than 3 weeks) or chronic?", mcqOptions: ["Few days", "1-3 weeks", "3-8 weeks", "More than 8 weeks"] },
      { category: "Type", question: "Is the cough dry or productive (with phlegm)?", mcqOptions: ["Dry cough", "Productive with white phlegm", "Productive with yellow/green phlegm", "Productive with blood"] },
      { category: "Timing", question: "When does the cough worsen — at night, morning, after eating, or with exercise?", mcqOptions: ["At night", "In the morning", "After eating", "With exercise", "Constant"] },
      { category: "Associated", question: "Any fever, breathlessness, chest pain, or weight loss with the cough?", mcqOptions: ["Fever", "Breathlessness", "Chest pain", "Weight loss", "None"] },
      { category: "History", question: "Do you smoke? Any history of TB, asthma, or allergies?", mcqOptions: ["Smoker", "Former smoker", "History of TB", "Asthma/allergies", "None"] },
    ],
  },

  // ── DIABETES ──────────────────────────────────────────────────────────
  "diabetes": {
    en: [
      { category: "Control", question: "How is your diabetes controlled? Diet, tablets, or insulin?", mcqOptions: ["Diet only", "Tablets (oral hypoglycemics)", "Insulin", "Tablets + Insulin", "Not diagnosed yet"] },
      { category: "Sugar Levels", question: "What are your recent fasting and post-meal sugar readings?", mcqOptions: ["Fasting < 130, PP < 180", "Fasting 130-180, PP 180-250", "Fasting > 180, PP > 250", "Not checked recently", "Don't know"] },
      { category: "Complications", question: "Any vision problems, foot numbness, kidney issues, or slow wound healing?", mcqOptions: ["Vision changes", "Numbness in feet", "Kidney problems", "Slow wound healing", "None"] },
      { category: "Medications", question: "What medications are you currently taking for diabetes?", mcqOptions: ["Metformin", "Glimepiride", "Insulin", "Multiple medications", "Not taking any"] },
      { category: "Diet", question: "Do you follow a diabetic diet? How is your sugar control with current diet?", mcqOptions: ["Follow strict diet", "Moderate control", "Poor control", "No diet plan", "Not applicable"] },
    ],
  },

  // ── HYPERTENSION ──────────────────────────────────────────────────────
  "hypertension": {
    en: [
      { category: "Readings", question: "What are your recent blood pressure readings?", mcqOptions: ["Normal (< 120/80)", "Prehypertensive (120-139/80-89)", "Stage 1 HTN (140-159/90-99)", "Stage 2 HTN (≥160/≥100)", "Not checked recently"] },
      { category: "Medications", question: "What blood pressure medications are you taking?", mcqOptions: ["Amlodipine", "Losartan/ARB", "Atenolol/beta-blocker", "Multiple medications", "Not taking any"] },
      { category: "Compliance", question: "Do you take your BP medications regularly? Any missed doses?", mcqOptions: ["Regularly", "Sometimes miss", "Often forget", "Stopped taking", "Not on medication"] },
      { category: "Lifestyle", question: "Do you exercise regularly? What about salt intake and smoking?", mcqOptions: ["Regular exercise", "Low salt diet", "Non-smoker", "High salt diet", "Smoker"] },
      { category: "Complications", question: "Any headaches, chest pain, breathlessness, or vision changes?", mcqOptions: ["Headaches", "Chest pain", "Breathlessness", "Vision changes", "None"] },
    ],
  },

  // ── JOINT PAIN / ARTHRITIS ───────────────────────────────────────────
  "joint pain": {
    en: [
      { category: "Location", question: "Which joints are affected? Is it symmetric (both sides) or asymmetric?", mcqOptions: ["Knees", "Hands/fingers", "Hips", "Spine", "Symmetric (both sides)", "Asymmetric"] },
      { category: "Morning Stiffness", question: "Do you have morning stiffness? How long does it last?", mcqOptions: ["Less than 30 minutes", "30 min to 1 hour", "More than 1 hour", "No stiffness", "All day"] },
      { category: "Pattern", question: "Is the pain worse with rest or with activity?", mcqOptions: ["Worse with rest", "Worse with activity", "Both", "Neither", "Worse in morning"] },
      { category: "Swelling", question: "Is there swelling, redness, or warmth in the affected joints?", mcqOptions: ["Swelling present", "Redness", "Warmth to touch", "All three", "None"] },
      { category: "History", question: "Any family history of arthritis? Have you had joint symptoms before?", mcqOptions: ["Family history of RA", "Family history of OA", "Gout in family", "Previous injury", "None"] },
    ],
  },

  // ── ABDOMINAL PAIN ───────────────────────────────────────────────────
  "abdominal pain": {
    en: [
      { category: "Location", question: "Where exactly in the abdomen is the pain? Upper, lower, right, or left?", mcqOptions: ["Upper abdomen", "Lower abdomen", "Right side", "Left side", "Around the navel", "All over"] },
      { category: "Character", question: "What type of pain is it — cramping, burning, sharp, or dull?", mcqOptions: ["Cramping/colicky", "Burning", "Sharp/stabbing", "Dull/aching", "Bloated feeling"] },
      { category: "Relation to Food", question: "Does the pain relate to eating? Better or worse after meals?", mcqOptions: ["Worse after meals", "Better after meals", "Worse on empty stomach", "No relation to food", "Worse with spicy food"] },
      { category: "Associated", question: "Any nausea, vomiting, diarrhea, constipation, or blood in stool?", mcqOptions: ["Nausea/vomiting", "Diarrhea", "Constipation", "Blood in stool", "None"] },
      { category: "Urological", question: "Any burning during urination, frequent urination, or blood in urine?", mcqOptions: ["Burning urination", "Frequent urination", "Blood in urine", "Difficulty urinating", "None"] },
    ],
  },
};

// Map common chief complaints to disease categories
export function getDiseaseCategory(chiefComplaint: string): string | null {
  if (!chiefComplaint) return null;
  const lower = chiefComplaint.toLowerCase();

  // Direct match
  for (const key of Object.keys(DISEASE_QUESTIONS)) {
    if (lower.includes(key)) return key;
  }

  // Keyword mapping
  const keywordMap: Record<string, string> = {
    "chest": "chest pain",
    "heart": "chest pain",
    "cardiac": "chest pain",
    "angina": "chest pain",
    "breast": "chest pain",
    "head": "headache",
    "migraine": "headache",
    "temple": "headache",
    "forehead": "headache",
    "fever": "fever",
    "temperature": "fever",
    "hot": "fever",
    "chills": "fever",
    "cough": "cough",
    "cold": "cough",
    "sputum": "cough",
    "phlegm": "cough",
    "sugar": "diabetes",
    "diabetes": "diabetes",
    "glucose": "diabetes",
    "pressure": "hypertension",
    "bp": "hypertension",
    "blood pressure": "hypertension",
    "joint": "joint pain",
    "knee": "joint pain",
    "arthritis": "joint pain",
    "bone": "joint pain",
    "stomach": "abdominal pain",
    "abdomen": "abdominal pain",
    "belly": "abdominal pain",
    "gastric": "abdominal pain",
    "abdominal": "abdominal pain",
    "belly pain": "abdominal pain",
    "stomach pain": "abdominal pain",
  };

  for (const [keyword, category] of Object.entries(keywordMap)) {
    if (lower.includes(keyword)) return category;
  }

  return null;
}

// Get questions for a specific disease and language
export function getDiseaseQuestions(disease: string, lang: string): DiseaseQuestion[] {
  const lower = disease.toLowerCase();
  const questions = DISEASE_QUESTIONS[lower];
  if (!questions) return [];
  return questions[lang] || questions["en"] || [];
}
