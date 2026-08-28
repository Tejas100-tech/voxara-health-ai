/**
 * MediKiosk AyurBot — Ayurvedic Knowledge Base
 * Curated educational content for the AI chatbot.
 * NOT for clinical diagnosis — purely informational.
 */

// ─── Chatbot Knowledge Base ──────────────────────────────────────────────

export interface AyushKnowledgeEntry {
  id: string;
  category: "education" | "term" | "assessment" | "safety";
  keywords: string[];
  shortAnswer: Record<string, string>;
  detailedAnswer: Record<string, string>;
}

const KNOWLEDGE_BASE: AyushKnowledgeEntry[] = [
  {
    id: "ayurveda_intro",
    category: "education",
    keywords: ["what is ayurveda", "tell me about ayurveda", "ayurveda meaning", "what is ayurvedic medicine"],
    shortAnswer: {
      en: "Ayurveda is a traditional system of medicine from India, focused on balancing body, mind, and spirit through diet, lifestyle, herbal remedies, and therapies. A qualified practitioner tailors recommendations to your individual constitution.",
      hi: "आयुर्वेद भारत की एक पारंपरिक चिकित्सा प्रणाली है, जो आहार, जीवनशैली, जड़ी-बूटियों और चिकित्सा के माध्यम से शरीर, मन और आत्मा के संतुलन पर केंद्रित है।",
      mr: "आयुर्वेद ही भारतातील पारंपरिक औषधपद्धती आहे, जी आहार, जीवनशैली, औषधी वनस्पती आणि उपचारांद्वारे शरीर, मन आणि आत्म्याचे संतुलन राखण्यावर केंद्रित आहे.",
    },
    detailedAnswer: {
      en: "Ayurveda, meaning 'knowledge of life,' is one of the world's oldest healing systems, originating in India over 5,000 years ago. It views health as a state of balance between three fundamental energies (doshas): Vata, Pitta, and Kapha. Treatment typically includes dietary modifications, herbal medicines, lifestyle adjustments, Panchakarma therapies, yoga, and meditation. A qualified Ayurvedic practitioner (Vaidya) assesses your unique constitution (Prakriti) and current imbalances (Vikriti) to create personalized recommendations.\n\n⚠ Important: Ayurvedic treatments should always be prescribed by a qualified practitioner based on individual assessment.",
      hi: "आयुर्वेद, जिसका अर्थ 'जीवन का ज्ञान' है, दुनिया की सबसे पुरानी चिकित्सा प्रणालियों में से एक है। यह स्वास्थ्य को तीन मूल ऊर्जाओं (दोषों) - वात, पित्त और कफ के बीच संतुलन की स्थिति के रूप में देखता है। एक योग्य आयुर्वेदिक चिकित्सक (वैद्य) आपके अनूठे संविधान (प्रकृति) का आकलन करता है।",
      mr: "आयुर्वेद म्हणजे 'जीवनाचे ज्ञान', हे जगातील सर्वात जुन्या उपचार पद्धतींपैकी एक आहे. या तीन मूल ऊर्जांमध्ये (दोष) - वात, पित्त आणि कफ यांच्या संतुलनाला आरोग्य म्हणून पाहते.",
    },
  },
  {
    id: "prakriti",
    category: "term",
    keywords: ["prakriti", "constitution", "body type", "what is prakriti", "prakriti assessment"],
    shortAnswer: {
      en: "Prakriti is your unique body constitution determined at birth — a blend of Vata, Pitta, and Kapha doshas. It defines your natural tendencies for body structure, digestion, sleep patterns, and temperament. Your Prakriti doesn't change throughout life.",
      hi: "प्रकृति आपका अनूठा शरीर संविधान है जो जन्म के समय निर्धारित होता है — वात, पित्त और कफ दोषों का एक मिश्रण। यह शरीर संरचना, पाचन, नींद के पैटर्न और स्वभाव की प्राकृतिक प्रवृत्तियों को परिभाषित करता है।",
      mr: "प्रकृती म्हणजे तुमचे जन्मतः ठरलेले अनन्य शरीर संविधान आहे — वात, पित्त आणि कफ दोषांचे एक मिश्रण. या शरीर रचना, पचन, झोपेचे नमुने आणि स्वभावाच्या नैसर्गिक प्रवृत्ती ठरवते.",
    },
    detailedAnswer: {
      en: "Prakriti assessment considers:\n• Body frame and build\n• Appetite and digestion patterns\n• Sleep quality and duration\n• Temperature preferences\n• Activity levels and energy patterns\n• Mental and emotional tendencies\n\nA qualified Ayurvedic practitioner uses specific observational methods to determine your Prakriti. This is typically a one-time assessment that remains constant throughout your life.\n\n💡 The AyurBot can help collect this information, but only a practitioner can confirm your Prakriti classification.",
      hi: "प्रकृति मूल्यांकन में शामिल हैं:\n• शरीर का ढांचा और बनावट\n• भूख और पाचन पैटर्न\n• नींद की गुणवत्ता और अवधि\n• तापमान प्राथमिकताएं\n• गतिविधि स्तर और ऊर्जा पैटर्न\n• मानसिक और भावनात्मक प्रवृत्तियां\n\n💡 आयुरबॉट इस जानकारी एकत्र करने में मदद कर सकता है, लेकिन केवल एक चिकित्सक आपकी प्रकृति वर्गीकरण की पुष्टि कर सकता है।",
      mr: "प्रकृती मूल्यांकनात समावेश आहेत:\n• शरीराची रचना आणि घटना\n• भूक आणि पचन नमुने\n• झोपेचे गुणवत्ता आणि कालावधी\n• तापमान प्राधान्ये\n• सक्रियता पातळी आणि ऊर्जा नमुने\n• मानसिक आणि भावनिक प्रवृत्ती\n\n💡 आयुरबॉट या माहिती गोळा करण्यात मदत करू शकतो, परंतु केवळ वैद्य तुमची प्रकृती वर्गीकरण पुष्टी करू शकतो.",
    },
  },
  {
    id: "vikriti",
    category: "term",
    keywords: ["vikriti", "imbalance", "what is vikriti", "current imbalance", "dosha imbalance"],
    shortAnswer: {
      en: "Vikriti represents your current state of dosha imbalance — how far your present condition has deviated from your natural Prakriti. It reflects the impact of diet, lifestyle, stress, season, and illness on your constitution.",
      hi: "विकृति आपके दोष असंतुलन की वर्तमान स्थिति का प्रतिनिधित्व करती है — आपकी वर्तमान स्थिति आपकी प्राकृतिक प्रकृति से कितनी दूर हो गई है।",
      mr: "विकृती म्हणजे तुमच्या दोष असंतुलनाची वर्तमान स्थिती — तुमची सध्याची स्थिती तुमच्या नैसर्गिक प्रकृतीपासून किती दूर आहे.",
    },
    detailedAnswer: {
      en: "Unlike Prakriti (which is fixed), Vikriti changes based on:\n• Dietary habits (recent and habitual)\n• Lifestyle and daily routines\n• Stress and emotional state\n• Seasonal changes\n• Illness or injury\n\nA practitioner compares your Vikriti against your Prakriti to understand what needs rebalancing.\n\n⚠ Your Vikriti should only be assessed by a qualified Ayurvedic practitioner through proper examination.",
      hi: "प्रकृति (जो स्थिर है) के विपरीत, विकृति इन कारकों के आधार पर बदलती है:\n• आहार की आदतें\n• जीवनशैली और दैनिक दिनचर्या\n• तनाव और भावनात्मक अवस्था\n• मौसमी परिवर्तन\n• बीमारी या चोट\n\n⚠ आपकी विकृति का आकलन केवल एक योग्य आयुर्वेदिक चिकित्सक द्वारा किया जाना चाहिए।",
      mr: "प्रकृती (जी स्थिर आहे) च्या उलट, विकृती या घटकांवर बदलते:\n• आहार सवयी\n• जीवनशैली आणि दैनंदिन दिनचर्या\n• तणाव आणि भावनिक स्थिती\n• हंगामी बदल\n• आजार किंवा जखम\n\n⚠ तुमची विकृती केवळ पात्र आयुर्वेदिक वैद्याने योग्य परीक्षणाद्वारेच मोजावी.",
    },
  },
  {
    id: "agni",
    category: "term",
    keywords: ["agni", "digestive fire", "digestion", "what is agni", "agni assessment"],
    shortAnswer: {
      en: "Agni refers to the digestive and metabolic fire in Ayurveda. Good Agni means efficient digestion, proper nutrient absorption, and overall vitality. When Agni is weak, undigested food can lead to toxin accumulation (Ama).",
      hi: "अग्नि आयुर्वेद में पाचन और चयापचय अग्नि को संदर्भित करती है। अच्छी अग्नि का मतलब है कुशल पाचन, उचित पोषक अवशोषण और समग्र जीवन शक्ति।",
      mr: "अग्नी म्हणजे आयुर्वेदातील पचन आणि चयापचय अग्नी. चांगली अग्नी म्हणजे कार्यक्षम पचन, योग्य पोषक शोषण आणि एकूण जीवनशक्ती.",
    },
    detailedAnswer: {
      en: "There are 13 types of Agni in Ayurveda, with Jatharagni (main digestive fire) being the most important. Practitioners assess Agni by asking about:\n• Appetite regularity and strength\n• Hunger timing\n• Post-meal comfort or discomfort\n• Bloating, gas, or heaviness after eating\n• Stool quality\n\nWeak Agni can lead to Ama (toxins), while excessive Agni can cause inflammation.\n\n💡 AyurBot can collect your observations, but a practitioner must assess your Agni type.",
      hi: "आयुर्वेद में 13 प्रकार की अग्नि हैं, जिनमें जठराग्नि (मुख्य पाचन अग्नि) सबसे महत्वपूर्ण है। चिकित्सक इन बातों से अग्नि का आकलन करते हैं:\n• भूख की नियमितता और शक्ति\n• भूख का समय\n• भोजन के बाद आराम या परेशानी\n• भोजन के बाद सूजन, गैस या भारीपन",
      mr: "आयुर्वेदात 13 प्रकारच्या अग्नी आहेत, ज्यात जठराग्नी (मुख्य पचन अग्नी) सर्वात महत्त्वाची आहे. वैद्य या गोष्टींवरून अग्नीचे मूल्यांकन करतात:\n• भूक नियमितता आणि शक्ती\n• भूक लागण्याचा वेळ\n• जेवणानंतर आराम किंवा अस्वस्थता\n• जेवणानंतर जडपणा, वायू किंवा भारीपणा",
    },
  },
  {
    id: "koshtha",
    category: "term",
    keywords: ["koshtha", "bowel", "bowel habits", "what is koshtha", "stool", "constipation"],
    shortAnswer: {
      en: "Koshtha refers to bowel habits and nature in Ayurveda. It describes patterns like regular, hard, loose, or irregular bowel movements. Koshtha is an important indicator of digestive health and dosha balance.",
      hi: "कोष्ठ आयुर्वेद में आंत्र आदतों और प्रकृति को संदर्भित करता है। यह नियमित, कठोर, ढीले या अनियमित मल त्याग के पैटर्न का वर्णन करता है।",
      mr: "कोष्ठ म्हणजे आयुर्वेदातील आंत्र सवयी आणि स्वभाव. हा नियमित, कठीण, ढीले किंवा अनियमित शौच होण्याच्या नमुन्यांचे वर्णन करतो.",
    },
    detailedAnswer: {
      en: "In Ayurveda, Koshtha is classified into types based on dosha dominance:\n• Vata Koshtha: tendency toward hard, dry stools\n• Pitta Koshtha: tendency toward loose, frequent stools\n• Kapha Koshtha: tendency toward heavy, slow digestion\n\nUnderstanding Koshtha helps practitioners recommend appropriate dietary and lifestyle modifications.\n\n💡 Share your bowel habits with AyurBot, and the information will be included in your pre-consultation summary for the practitioner.",
      hi: "आयुर्वेद में, कोष्ठ को दोष प्रभुत्व के आधार पर वर्गीकृत किया जाता है:\n• वात कोष्ठ: सूखे, कठोर मल की प्रवृत्ति\n• पित्त कोष्ठ: ढीले, बार-बार मल की प्रवृत्ति\n• कफ कोष्ठ: भारी, धीमे पाचन की प्रवृत्ति\n\n💡 अपनी आंत्र आदतें आयुरबॉट के साथ साझा करें, और जानकारी आपकी पूर्व-परामर्श सारांश में शामिल की जाएगी।",
      mr: "आयुर्वेदात, कोष्ठ दोष प्रभुत्वानुसार वर्गीकृत केला जातो:\n• वात कोष्ठ: कोरडे, कठीण मलाची प्रवृत्ती\n• पित्त कोष्ठ: ढीले, वारंवार मलाची प्रवृत्ती\n• कफ कोष्ठ: जड, हळूहळू पचनाची प्रवृत्ती\n\n💡 तुमच्या आंत्र सवयी आयुरबॉटसळ शेअर करा, आणि माहिती तुमच्या पूर्व-सल्ला सारांशात समाविष्ट केली जाईल.",
    },
  },
  {
    id: "sattva",
    category: "term",
    keywords: ["sattva", "mental state", "well-being", "what is sattva", "mental health", "stress"],
    shortAnswer: {
      en: "Sattva refers to mental and emotional well-being in Ayurveda. It encompasses clarity of mind, emotional balance, and inner peace. A sattvic state is associated with calmness, wisdom, and contentment.",
      hi: "सत्व आयुर्वेद में मानसिक और भावनात्मक कल्याण को संदर्भित करता है। यह मन की स्पष्टता, भावनात्मक संतुलन और आंतरिक शांति को शामिल करता है।",
      mr: "सत्त्व म्हणजे आयुर्वेदातील मानसिक आणि भावनिक कल्याण. या मध्ये मनाची स्पष्टता, भावनिक संतुलन आणि आंतरिक शांती यांचा समावेश होतो.",
    },
    detailedAnswer: {
      en: "In Ayurveda, mental constitution is described by three Gunas:\n• Sattva: clarity, peace, wisdom\n• Rajas: activity, passion, restlessness\n• Tamas: inertia, dullness, confusion\n\nMost people have a blend of all three. Lifestyle, diet, meditation, and social connections can influence your mental state.\n\n💡 AyurBot can help you reflect on your current mental state, but psychiatric concerns should always be discussed with an appropriate healthcare professional.",
      hi: "आयुर्वेद में, मानसिक संविधान को तीन गुणों से वर्णित किया जाता है:\n• सत्व: स्पष्टता, शांति, ज्ञान\n• रजस: गतिविधि, जुनून, बेचैनी\n• तमस: निष्क्रियता, सुस्तता, भ्रम\n\n💡 मनोवैज्ञानिक चिंताओं को हमेशा एक उपयुक्त स्वास्थ्य सेवा पेशेवर के साथ चर्चा करनी चाहिए।",
      mr: "आयुर्वेदात, मानसिक संविधान तीन गुणांनी वर्णले जाते:\n• सत्त्व: स्पष्टता, शांती, ज्ञान\n• रज: सक्रियता, उत्साह, अस्वस्थता\n• तम: निष्क्रियता, मंदता, गोंधळ\n\n💡 मानसिक आजारांबद्दल नेहमी योग्य आरोग्यसेवा व्यावसायिकाशी चर्चा करावी.",
    },
  },
  {
    id: "doshavata",
    category: "term",
    keywords: ["vata", "what is vata", "vata dosha"],
    shortAnswer: {
      en: "Vata dosha governs movement, breathing, circulation, and nervous system functions. It's associated with air and space elements. People with dominant Vata tend to be thin, creative, and quick-thinking, but may experience anxiety, dry skin, and digestive irregularity when imbalanced.",
      hi: "वात दोष गति, श्वसन, परिसंचरण और तंत्रिका तंत्र के कार्यों को नियंत्रित करता है। यह वायु और अंतरिक्ष तत्वों से जुड़ा है।",
      mr: "वात दोष हालचाल, श्वास, रक्तप्रवाह आणि स्नायू प्रणालीच्या कार्यांवर प्रभुत्व करतो. हा वायू आणि अंतराळ घटकांशी संबंधित आहे.",
    },
    detailedAnswer: {
      en: "Vata dosha is associated with:\n• Body: thin build, dry skin, cold hands/feet\n• Mind: creative, quick, anxious when imbalanced\n• Digestion: variable appetite, gas, bloating\n• Sleep: light, interrupted\n• Activity: enjoys movement, gets restless\n\nWhen Vata is imbalanced, common issues include: constipation, joint pain, anxiety, insomnia, and dry skin.\n\n⚠ Only a qualified practitioner can diagnose Vata imbalance. This is educational information only.",
      hi: "वात दोष इनसे जुड़ा है:\n• शरीर: पतला ढांचा, सूखी त्वचा, ठंडे हाथ/पैर\n• मन: रचनात्मक, तेज़, असंतुलित होने पर चिंतित\n• पाचन: अस्थिर भूख, गैस, सूजन\n• नींद: हल्की, बाधित\n\n⚠ केवल एक योग्य चिकित्सक वात असंतुलन का निदान कर सकता है।",
      mr: "वात दोष यांशी संबंधित आहे:\n• शरीर: पातळ घटना, कोरडी त्वचा, थंड हात/पाय\n• मन: सर्जनशील, जलद, असंतुलित झाल्यास चिंतित\n• पचन: अनियमित भूक, वायू, जडपणा\n• झोप: हलकी, खंडित\n\n⚠ केवळ पात्र वैद्य वात असंतुलन निदान करू शकतो.",
    },
  },
  {
    id: "doshapitta",
    category: "term",
    keywords: ["pitta", "what is pitta", "pitta dosha"],
    shortAnswer: {
      en: "Pitta dosha governs digestion, metabolism, body temperature, and intellect. It's associated with fire and water elements. Pitta-dominant individuals tend to have strong digestion, medium build, and sharp intellect, but may experience anger, acidity, and skin inflammation when imbalanced.",
      hi: "पित्त दोष पाचन, चयापचय, शरीर के तापमान और बुद्धि को नियंत्रित करता है। यह अग्नि और जल तत्वों से जुड़ा है।",
      mr: "पित्त दोष पचन, चयापचय, शरीराचे तापमान आणि बुद्धीवर प्रभुत्व करतो. हा अग्नी आणि जल घटकांशी संबंधित आहे.",
    },
    detailedAnswer: {
      en: "Pitta dosha is associated with:\n• Body: medium build, warm skin, strong appetite\n• Mind: intelligent, focused, competitive, impatient\n• Digestion: strong hunger, regular bowels\n• Sleep: moderate, warm\n• Activity: enjoys challenges\n\nImbalanced Pitta can cause: acidity, skin rashes, irritability, loose stools, and excessive body heat.\n\n⚠ This is educational information. Only a qualified practitioner can assess your dosha balance.",
      hi: "पित्त दोष इनसे जुड़ा है:\n• शरीर: मध्यम ढांचा, गर्म त्वचा, मजबूत भूख\n• मन: बुद्धिमान, केंद्रित, प्रतिस्पर्धी\n• पाचन: मजबूत भूख, नियमित मल\n\n⚠ यह शैक्षिक जानकारी है। केवल एक योग्य चिकित्सक आपके दोष संतुलन का आकलन कर सकता है।",
      mr: "पित्त दोष यांशी संबंधित आहे:\n• शरीर: मध्यम घटना, उबदार त्वचा, मजबूत भूक\n• मन: हुशार, केंद्रित, स्पर्धात्मक\n• पचन: मजबूत भूक, नियमित शौच\n\n⚠ ही शैक्षणिक माहिती आहे. केवळ पात्र वैद्य तुमच्या दोष संतुलनाचे मूल्यांकन करू शकतो.",
    },
  },
  {
    id: "doshakapha",
    category: "term",
    keywords: ["kapha", "what is kapha", "kapha dosha"],
    shortAnswer: {
      en: "Kapha dosha governs structure, stability, lubrication, and immunity. It's associated with earth and water elements. Kapha-dominant individuals tend to have larger build, calm demeanor, and strong immunity, but may experience weight gain, congestion, and lethargy when imbalanced.",
      hi: "कफ दोष ढांचा, स्थिरता, स्नेहन और प्रतिरक्षा को नियंत्रित करता है। यह पृथ्वी और जल तत्वों से जुड़ा है।",
      mr: "कफ दोष घटना, स्थिरता, स्नेहन आणि प्रतिकारशक्तीवर प्रभुत्व करतो. हा पृथ्वी आणि जल घटकांशी संबंधित आहे.",
    },
    detailedAnswer: {
      en: "Kapha dosha is associated with:\n• Body: larger build, smooth skin, healthy hair\n• Mind: calm, loyal, nurturing, can be possessive\n• Digestion: slow but steady, heavy after meals\n• Sleep: deep, long\n• Activity: prefers comfort, less active\n\nImbalanced Kapha can cause: weight gain, congestion, sluggish digestion, oversleeping, and depression.\n\n⚠ Educational information only. Consult a qualified Ayurvedic practitioner for assessment.",
      hi: "कफ दोष इनसे जुड़ा है:\n• शरीर: बड़ा ढांचा, चिकनी त्वचा, स्वस्थ बाल\n• मन: शांत, वफादार, पोषक\n• पाचन: धीमा लेकिन स्थिर\n\n⚠ केवल शैक्षिक जानकारी। आकलन के लिए एक योग्य आयुर्वेदिक चिकित्सक से परामर्श करें।",
      mr: "कफ दोष यांशी संबंधित आहे:\n• शरीर: मोठी घटना, गुलाबी त्वचा, निरोगी केस\n• मन: शांत, विश्वासू, पोषक\n• पचन: हळूहळू पण स्थिर\n\n⚠ शैक्षणिक माहिती आहे. मूल्यांकनासाठी पात्र आयुर्वेदिक वैद्याचा सल्ला घ्या.",
    },
  },
  {
    id: "ahara",
    category: "term",
    keywords: ["ahara", "diet", "food", "dietary", "eating", "what is ahara"],
    shortAnswer: {
      en: "Ahara means diet and food habits in Ayurveda. It includes what you eat, how much you eat, when you eat, how you eat, and the quality of food. Ayurveda considers diet as the foundation of health.",
      hi: "आहार आयुर्वेद में आहार और भोजन की आदतों को कहते हैं। इसमें शामिल है कि आप क्या खाते हैं, कितना खाते हैं, कब खाते हैं, कैसे खाते हैं।",
      mr: "आहार म्हणजे आयुर्वेदातील आहार आणि जेवण सवयी. यामध्ये तुम्ही काय खाता, किती खाता, कधी खाता, कसे खाता यांचा समावेश होतो.",
    },
    detailedAnswer: {
      en: "Ayurveda considers six tastes (Shad Rasa): sweet, sour, salty, pungent, bitter, and astringent. A balanced diet should include all six tastes in appropriate proportions.\n\nKey dietary principles:\n• Eat at regular times\n• Eat only when hungry\n• Don't overeat\n• Freshly prepared food is preferred\n• Food should be appropriate for your Prakriti and current Vikriti\n\n💡 The AyurBot will ask about your dietary habits as part of the pre-consultation.",
      hi: "आयुर्वेद छह स्वादों (षड्रस) को मान्यता देता है: मीठा, खट्टा, नमकीन, तीखा, कड़वा और कसैला।\n\nमुख्य आहार सिद्धांत:\n• नियमित समय पर खाएं\n• केवल भूख लगने पर खाएं\n• अधिक न खाएं\n• ताज़ा भोजन पसंद किया जाता है\n\n💡 आयुरबॉट पूर्व-परामर्श के हिस्से के रूप में आपकी आहार आदतों के बारे में पूछेगा।",
      mr: "आयुर्वेद सहा रसांना (षड्रस) मान्यता देतो: गोड, आंबट, मीठ, तिखट, कडू आणि वांड.\n\nप्रमुख आहार तत्त्वे:\n• नियमित वेळी जेवा\n• भूक लागल्यावरच जेवा\n• जास्त खाऊ नका\n• ताजे जेवणाला प्राधान्य\n\n💡 आयुरबॉट पूर्व-सल्ला भाग म्हणून तुमच्या आहार सवयींबद्दल विचारेल.",
    },
  },
  {
    id: "vihara",
    category: "term",
    keywords: ["vihara", "lifestyle", "daily routine", "dinacharya", "what is vihara"],
    shortAnswer: {
      en: "Vihara refers to lifestyle and daily routine in Ayurveda. It includes sleep patterns, exercise, work habits, and daily activities. Ayurveda emphasizes maintaining a consistent daily routine (Dinacharya) for optimal health.",
      hi: "विहार आयुर्वेद में जीवनशैली और दैनिक दिनचर्या को संदर्भित करता है। इसमें नींद के पैटर्न, व्यायाम, कार्य की आदतें और दैनिक गतिविधियां शामिल हैं।",
      mr: "विहार म्हणजे आयुर्वेदातील जीवनशैली आणि दैनंदिन दिनचर्या. यामध्ये झोपेचे नमुने, व्यायाम, कामाच्या सवयी आणि दैनंदिन क्रियाकलाप यांचा समावेश होतो.",
    },
    detailedAnswer: {
      en: "Ayurveda recommends Dinacharya (daily routine) and Ritucharya (seasonal routine) for maintaining health. Key aspects include:\n\n• Waking early (before sunrise)\n• Morning hygiene practices\n• Regular meal times\n• Adequate sleep\n• Regular physical activity\n• Stress management\n\nA balanced lifestyle according to your constitution helps prevent disease and maintain vitality.\n\n💡 The AyurBot will capture your lifestyle information during pre-consultation.",
      hi: "आयुर्वेद स्वास्थ्य बनाए रखने के लिए दिनचर्या और ऋतुचर्या की सिफारिश करता है। मुख्य पहलू:\n\n• सूर्योदय से पहले जागना\n• सुबह की स्वच्छता प्रथाएं\n• नियमित भोजन का समय\n• पर्याप्त नींद\n• नियमित शारीरिक गतिविधि\n\n💡 आयुरबॉट पूर्व-परामर्श के दौरान आपकी जीवनशैली जानकारी एकत्र करेगा।",
      mr: "आयुर्वेद आरोग्य टिकवून ठेवण्यासाठी दिनचर्या आणि ऋतुचर्या शिफारस करतो. प्रमुख मुद्दे:\n\n• सूर्योदयापूर्वी जागे व्हा\n• सकाळच्या स्वच्छता पद्धती\n• नियमित जेवणाचा वेळ\n• पुरेसी झोप\n• नियमित शारीरिक क्रियाकलाप\n\n💡 आयुरबॉट पूर्व-सल्ल्यात तुमची जीवनशैली माहिती कॅप्चर करेल.",
    },
  },
  {
    id: "nidra",
    category: "term",
    keywords: ["nidra", "sleep", "insomnia", "what is nidra", "sleep quality"],
    shortAnswer: {
      en: "Nidra means sleep in Ayurveda. Quality sleep is considered essential for health. Ayurveda emphasizes consistent sleep schedules, proper sleep environment, and addressing the root causes of sleep disturbances.",
      hi: "निद्रा आयुर्वेद में नींद को कहते हैं। गुणवत्ता वाली नींद स्वास्थ्य के लिए आवश्यक मानी जाती है।",
      mr: "निद्रा म्हणजे आयुर्वेदातील झोप. गुणवत्ताशीर झोप आरोग्यासाठी अत्यंत महत्त्वाची मानली जाते.",
    },
    detailedAnswer: {
      en: "Ayurveda links sleep quality to dosha balance:\n• Vata types: may experience light, interrupted sleep\n• Pitta types: may experience restless, warm sleep\n• Kapha types: may oversleep or feel heavy on waking\n\nGood sleep hygiene includes:\n• Consistent bedtime and wake time\n• Avoiding screens before bed\n• Cool, dark sleeping environment\n• Light dinner before sleep\n\n💡 Share your sleep patterns with AyurBot as part of your AYUSH assessment.",
      hi: "आयुर्वेद नींद की गुणवत्ता को दोष संतुलन से जोड़ता है:\n• वात प्रकार: हल्की, बाधित नींद\n• पित्त प्रकार: बेचैन, गर्म नींद\n• कफ प्रकार: अधिक नींद या जागने पर भारीपन\n\n💡 अपनी नींद के पैटर्न आयुरबॉट के साथ साझा करें।",
      mr: "आयुर्वेद झोपेचे गुणवत्ता दोष संतुलनाशी जोडतो:\n• वात प्रकार: हलकी, खंडित झोप\n• पित्त प्रकार: अस्वस्थ, उबदार झोप\n• कफ प्रकार: जास्त झोप किंवा जागल्यावर जडपणा\n\n💡 तुमचे झोपेचे नमुने आयुरबॉटसळ शेअर करा.",
    },
  },
  {
    id: "panchakarma",
    category: "education",
    keywords: ["panchakarma", "detox", "cleansing", "what is panchakarma", "therapy"],
    shortAnswer: {
      en: "Panchakarma is a set of five Ayurvedic cleansing and detoxification therapies. It includes therapeutic vomiting, purgation, medicated enemas, nasal administration, and bloodletting. These therapies are performed under qualified practitioner supervision for specific conditions.",
      hi: "पंचकर्म पांच आयुर्वेदिक शुद्धि और विषाक्तता निवारण चिकित्साओं का एक समूह है। इनमें उपचारात्मक उल्टी, पेचिश, औषधीमय एनीमा, नाक प्रशासन और रक्तस्राव शामिल हैं।",
      mr: "पंचकर्म ही पांच आयुर्वेदिक शुद्धीकरण आणि विषारी उपचारांची एक संच आहे. यामध्ये उपचारात्मक उलटी, परिस्राव, औषधीमय एनिमा, नाक प्रशासन आणि रक्तस्राव यांचा समावेश होतो.",
    },
    detailedAnswer: {
      en: "Panchakarma (five actions) is a comprehensive Ayurvedic detoxification system:\n\n1. Vamana (therapeutic emesis) — for Kapha disorders\n2. Virechana (purgation) — for Pitta disorders\n3. Basti (medicated enema) — for Vata disorders\n4. Nasya (nasal administration) — for head/neck conditions\n5. Raktamokshana (blood purification) — for blood-borne conditions\n\n⚠ Panchakarma should ONLY be performed by qualified Ayurvedic practitioners after thorough assessment. It is not a self-care practice.",
      hi: "पंचकर्म (पांच क्रियाएं) एक व्यापक आयुर्वेदिक विषाक्तता निवारण प्रणाली है:\n\n⚠ पंचकर्म केवल योग्य आयुर्वेदिक चिकित्सकों द्वारा किया जाना चाहिए। यह स्व-देखभाल अभ्यास नहीं है।",
      mr: "पंचकर्म (पांच क्रिया) ही समग्र आयुर्वेदिक विषारी उपचार प्रणाली आहे:\n\n⚠ पंचकर्म केवळ पात्र आयुर्वेदिक वैद्यांनीच केला पाहिजे. हा स्व-देखभाल सराव नाही.",
    },
  },
  {
    id: "dinacharya",
    category: "education",
    keywords: ["dinacharya", "daily routine", "daily habits", "what is dinacharya"],
    shortAnswer: {
      en: "Dinacharya means 'daily routine' in Ayurveda. It's a set of recommended daily practices for maintaining health, including waking early, oral hygiene, exercise, regular meals, and a consistent sleep schedule.",
      hi: "दिनचर्या का अर्थ आयुर्वेद में 'दैनिक दिनचर्या' है। यह स्वास्थ्य बनाए रखने के लिए अनुशंसित दैनिक प्रथाओं का एक समूह है।",
      mr: "दिनचर्या म्हणजे आयुर्वेदातील 'दैनंदिन दिनचर्या'. हे आरोग्य टिकवून ठेवण्यासाठी शिफारस केलेल्या दैनंदिन सवयींचा एक संच आहे.",
    },
    detailedAnswer: {
      en: "A typical Dinacharya includes:\n\n🌅 Early morning: Wake before sunrise\n🦷 Hygiene: Oil pulling, tongue scraping, brushing\n🚿 Bath: Regular bathing\n🧘 Practice: Yoga, meditation, or pranayama\n🍽️ Meals: Regular, freshly prepared meals\n🏃 Activity: Appropriate physical activity\n😴 Sleep: Consistent bedtime\n\nFollowing Dinacharya helps align your body's natural rhythms and supports overall well-being.\n\n💡 AyurBot can help you assess your current daily routine.",
      hi: "एक सामान्य दिनचर्या में शामिल है:\n\n🌅 सुबह जल्दी: सूर्योदय से पहले जागें\n🦷 स्वच्छता: तेल कुल्ला, जीभ साफ करना, ब्रश करना\n🚿 स्नान: नियमित स्नान\n🧘 अभ्यास: योग, ध्यान, या प्राणायाम\n🍽️ भोजन: नियमित, ताजा भोजन\n🏃 गतिविधि: उपयुक्त शारीरिक गतिविधि\n😴 नींद: नियमित सोने का समय\n\n💡 आयुरबॉट आपकी वर्तमान दैनिक दिनचर्या का आकलन करने में मदद कर सकता है।",
      mr: "एक विशिष्ट दिनचर्या मध्ये समावेश आहे:\n\n🌅 लवकर सकाळी: सूर्योदयापूर्वी जागे व्हा\n🦷 स्वच्छता: तेल गुडघे, जिभ साफ करणे, ब्रश करणे\n🚿 स्नान: नियमित स्नान\n🧘 सराव: योग, ध्यान, किंवा प्राणायाम\n🍽️ जेवण: नियमित, ताजे जेवण\n🏃 क्रियाकलाप: योग्य शारीरिक क्रियाकलाप\n😴 झोप: नियमित झोपेचा वेळ\n\n💡 आयुरबॉट तुमच्या सध्याच्या दैनंदिन दिनचर्येचे मूल्यांकन करण्यात मदत करू शकतो.",
    },
  },
  {
    id: "safety_general",
    category: "safety",
    keywords: ["medicine", "prescribe", "treatment", "what should i take", "recommend medicine", "dosage"],
    shortAnswer: {
      en: "I can provide general educational information about Ayurveda, but I cannot prescribe treatment or recommend specific medicines. A qualified Ayurvedic practitioner (Vaidya) should assess your condition and recommend appropriate treatment based on your individual constitution and current state.",
      hi: "मैं आयुर्वेद के बारे में सामान्य शैक्षिक जानकारी प्रदान कर सकता हूं, लेकिन मैं उपचार निर्धारित नहीं कर सकता। एक योग्य आयुर्वेदिक चिकित्सक को आपकी स्थिति का आकलन करना चाहिए।",
      mi: "मी आयुर्वेदाबद्दल सामान्य शैक्षणिक माहिती देऊ शकतो, परंतु मी उपचार निर्देश करू शकत नाही. एक पात्र आयुर्वेदिक वैद्याने तुमच्या स्थितीचे मूल्यांकन करावे.",
    },
    detailedAnswer: {
      en: "For your safety, here's what I can and cannot do:\n\n✅ I CAN:\n• Explain Ayurvedic concepts and terms\n• Help collect your health information\n• Guide you through pre-consultation questions\n• Provide general educational information\n\n❌ I CANNOT:\n• Diagnose diseases\n• Prescribe medicines or dosages\n• Recommend stopping any medication\n• Replace a qualified practitioner\n\n⚠ If you describe potentially urgent symptoms, I will direct you to seek immediate help from hospital staff or a healthcare professional.",
      hi: "आपकी सुरक्षा के लिए:\n\n✅ मैं कर सकता हूं:\n• आयुर्वेदिक अवधारणाओं की व्याख्या\n• स्वास्थ्य जानकारी एकत्र करने में मदद\n• पूर्व-परामर्श प्रश्नों में मार्गदर्शन\n\n❌ मैं नहीं कर सकता:\n• बीमारियों का निदान\n• दवाओं या खुराक निर्धारित करना\n• किसी भी दवा को बंद करने की सिफारिश\n\n⚠ यदि आप संभावित गंभीर लक्षणों का वर्णन करते हैं, तो मैं आपको तत्काल सहायता लेने का निर्देश दूंगा।",
      mi: "तुमच्या सुरक्षिततेसाठी:\n\n✅ मी करू शकतो:\n• आयुर्वेदिक संकल्पना स्पष्ट करणे\n• आरोग्य माहिती गोळा करण्यात मदत\n• पूर्व-सल्ला प्रश्नांत मार्गदर्शन\n\n❌ मी करू शकत नाही:\n• आजार निदान\n• औषधे निर्देश करणे\n• कोणतीही औषध बंद करण्याची शिफारस\n\n⚠ संभाव्य तात्काळ लक्षणे सांगितल्यास, मी तुम्हाला तात्काळ मदत घेण्यास सूचित करीन.",
    },
  },
  {
    id: "emergency",
    category: "safety",
    keywords: ["emergency", "urgent", "severe pain", "chest pain", "difficulty breathing", "unconscious", "bleeding heavily", "stroke"],
    shortAnswer: {
      en: "⚠️ Your symptoms may require prompt medical evaluation. Please contact hospital staff or a qualified healthcare professional immediately. Do not wait for an online consultation for potentially serious symptoms.",
      hi: "⚠️ आपके लक्षणों को तत्काल चिकित्सा मूल्यांकन की आवश्यकता हो सकती है। कृपया तुरंत अस्पताल के कर्मचारियों या एक योग्य स्वास्थ्य सेवा पेशेवर से संपर्क करें।",
      mr: "⚠️ तुमच्या लक्षणांना तात्काळ वैद्यकीय मूल्यांकन आवश्यक असू शकते. कृपया तात्काळच रुग्णालयाच्या कर्मचाऱ्यांशी किंवा पात्र आरोग्यसेवा व्यावसायिकाशी संपर्क साधा.",
    },
    detailedAnswer: {
      en: "If you are experiencing:\n• Severe chest pain\n• Difficulty breathing\n• Sudden severe headache\n• Heavy bleeding\n• Loss of consciousness\n• Signs of stroke (facial drooping, arm weakness, speech difficulty)\n• Severe allergic reaction\n\n🚨 SEEK IMMEDIATE HELP:\n• Call hospital emergency staff\n• Use the SOS button on MediKiosk\n• Go to the nearest emergency room\n\nDo not attempt to manage emergency symptoms through the chatbot.",
      hi: "यदि आप अनुभव कर रहे हैं:\n• गंभीर छाती में दर्द\n• सांस लेने में कठिनाई\n• अचानक गंभीर सिरदर्द\n• भारी रक्तस्राव\n• बेहोशी\n\n🚨 तत्काल सहायता प्राप्त करें:\n• अस्पताल आपातकालीन स्टाफ को कॉल करें\n• MediKiosk पर SOS बटन का उपयोग करें\n\nचैटबॉट के माध्यम से आपातकालीन लक्षणों का प्रबंधन करने का प्रयास न करें।",
      mr: "तुम्हाला खालील असल्यास:\n• तीव्र छातीत दुखणे\n• श्वास घेण्यास अडचण\n• अचानक तीव्र डोकेदुखी\n• जड रक्तस्राव\n• बेशुद्ध होणे\n\n🚨 तात्काळ मदत मिळवा:\n• रुग्णालयाच्या आपत्कालीन कर्मचाऱ्यांना कॉल करा\n• MediKiosk वरील SOS बटन वापरा\n\nचॅटबॉटमार्फत आपत्कालीन लक्षणे व्यवस्थापित करण्याचा प्रयत्न करू नका.",
    },
  },
  {
    id: "sara",
    category: "term",
    keywords: ["sara", "what is sara", "sara pariksha"],
    shortAnswer: {
      en: "Sara refers to the inherent quality and vitality of body tissues in Ayurveda. It assesses the overall excellence of Rasa (plasma), Rakta (blood), Mamsa (muscle), Meda (fat), Asthi (bone), Majja (marrow), and Shukra (reproductive tissue).",
      hi: "सारा आयुर्वेद में शरीर के ऊतकों के अंतर्निहित गुण और जीवन शक्ति को संदर्भित करता है।",
      mr: "सारा म्हणजे आयुर्वेदातील शरीराच्या संस्थांचा अंतर्निहित गुण आणि जीवनशक्ती.",
    },
    detailedAnswer: {
      en: "Sara Pariksha evaluates tissue vitality through simple questions about:\n• Skin quality and luster\n• Hair quality and density\n• Nail strength\n• Eye clarity\n• Voice quality\n• Overall vitality and energy\n\n💡 The practitioner interprets Sara assessment to understand your tissue quality and overall constitutional strength.",
      hi: "सारा परीक्षा सरल प्रश्नों के माध्यम से ऊतक जीवन शक्ति का मूल्यांकन करता है:\n• त्वचा की गुणवत्ता और चमक\n• बालों की गुणवत्ता और घनत्व\n• नाखूनों की मजबूती\n• आंखों की स्पष्टता\n• आवाज़ की गुणवत्ता\n\n💡 चिकित्सक सारा मूल्यांकन की व्याख्या करता है।",
      mr: "सारा परीक्षा सोप्या प्रश्नांद्वारे संस्था जीवनशक्तीचे मूल्यांकन करते:\n• त्वचेचे गुणवत्ता आणि चमक\n• केसांचे गुणवत्ता आणि घनता\n• नखांची मजबूती\n• डोळ्यांची स्पष्टता\n• आवाजाचे गुणवत्ता\n\n💡 वैद्य सारा मूल्यांकनाची व्याख्या करतो.",
    },
  },
  {
    id: "samhanana",
    category: "term",
    keywords: ["samhanana", "body built", "compactness"],
    shortAnswer: {
      en: "Samhanana refers to the compactness and structural integrity of the body in Ayurveda. It assesses how well-built and firm the body tissues are, indicating overall physical constitution.",
      hi: "संहनन आयुर्वेद में शरीर की सघनता और संरचनात्मक अखंडता को संदर्भित करता है।",
      mr: "संहनन म्हणजे आयुर्वेदातील शरीराची सघनता आणि रचनात्मक अखंडता.",
    },
    detailedAnswer: {
      en: "Samhanana assessment considers:\n• Body build and proportion\n• Muscle development\n• Joint stability\n• Overall structural integrity\n\nPractitioners use this to understand your physical constitution and recommend appropriate lifestyle modifications.",
      hi: "संहनन मूल्यांकन में शामिल हैं:\n• शरीर का ढांचा और अनुपात\n• मांसपेशी विकास\n• जोड़ स्थिरता\n\n💡 चिकित्सक इसका उपयोग आपके शारीरिक संविधान को समझने के लिए करते हैं।",
      mr: "संहनन मूल्यांकनात समावेश आहेत:\n• शरीर घटना आणि प्रमाण\n• स्नायू विकास\n• सांधे स्थिरता\n\n💡 वैद्य याचा वापर तुमच्या शारीरिक संविधान समजून घेण्यासाठी करतात.",
    },
  },
  {
    id: "pramana",
    category: "term",
    keywords: ["pramana", "body measurement", "body size"],
    shortAnswer: {
      en: "Pramana refers to body measurements and proportions in Ayurveda. It assesses whether a person is of small (Laghu), medium (Madhyama), or large (Adhimatra) build.",
      hi: "प्रमाण आयुर्वेद में शरीर के माप और अनुपात को संदर्भित करता है।",
      mr: "प्रमाण म्हणजे आयुर्वेदातील शरीर मोजमान आणि प्रमाण.",
    },
    detailedAnswer: {
      en: "Pramana is assessed through:\n• Height\n• Weight\n• Body proportions\n• Limb measurements\n\nBased on Pramana, individuals are classified as:\n• Laghu (small/light frame)\n• Madhyama (medium frame)\n• Adhimatra (large/heavy frame)\n\n💡 Simple questions during assessment help determine your Pramana category.",
      hi: "प्रमाण का आकलन इनके माध्यम से किया जाता है:\n• ऊंचाई\n• वजन\n• शरीर अनुपात\n\n💡 मूल्यांकन के दौरान सरल प्रश्न आपकी प्रमाण श्रेणी निर्धारित करने में मदद करते हैं।",
      mr: "प्रमाण या माध्यमातून मोजला जातो:\n• उंची\n• वजन\n• शरीर प्रमाण\n\n💡 मूल्यांकनादरम्यान सोपे प्रश्न तुमची प्रमाण श्रेणी ठरवण्यात मदत करतात.",
    },
  },
  {
    id: "satmya",
    category: "term",
    keywords: ["satmya", "adaptation", "what is satmya"],
    shortAnswer: {
      en: "Satmya refers to adaptation and adjustment to one's environment, diet, and lifestyle in Ayurveda. It assesses how well a person has adapted to their living conditions and routines.",
      hi: "सात्म्य आयुर्वेद में अपने वातावरण, आहार और जीवनशैली के अनुकूलन और समायोजन को संदर्भित करता है।",
      mr: "सात्म्य म्हणजे आयुर्वेदातील वातावरण, आहार आणि जीवनशैलीशी जुळवून घेणे.",
    },
    detailedAnswer: {
      en: "Satmya considers:\n• Ability to adapt to different foods\n• Tolerance to climate changes\n• Adaptation to physical activities\n• Response to stress\n\nA person with strong Satmya can adapt well to various conditions, while weak Satmya may indicate sensitivity to changes.\n\n💡 Your responses during pre-consultation help assess your Satmya.",
      hi: "सात्म्य में शामिल हैं:\n• विभिन्न खाद्य पदार्थों के अनुकूलन की क्षमता\n• जलवायु परिवर्तनों के प्रति सहनशीलता\n\n💡 पूर्व-परामर्श के दौरान आपकी प्रतिक्रियाएं आपके सात्म्य का आकलन करने में मदद करती हैं।",
      mr: "सात्म्यमध्ये समावेश आहेत:\n• वेगवेगळ्या अन्नांशी जुळवून घेण्याची क्षमता\n• हवामान बदलांना सहन करणे\n\n💡 पूर्व-सल्ल्यादरम्यान तुमच्या प्रतिसाद तुमच्या सात्म्याचे मूल्यांकन करण्यात मदत करतात.",
    },
  },
  {
    id: "vyayama_shakti",
    category: "term",
    keywords: ["vyayama", "exercise", "exercise capacity", "vyayama shakti"],
    shortAnswer: {
      en: "Vyayama Shakti refers to exercise capacity and tolerance in Ayurveda. It assesses how much physical activity a person can comfortably perform, indicating their physical endurance and constitutional strength.",
      hi: "व्यायाम शक्ति आयुर्वेद में व्यायाम क्षमता और सहनशीलता को संदर्भित करती है।",
      mr: "व्यायाम शक्ती म्हणजे आयुर्वेदातील व्यायाम क्षमता आणि सहनशीलता.",
    },
    detailedAnswer: {
      en: "Vyayama Shakti is assessed by asking about:\n• Current exercise habits\n• Exercise tolerance\n• Recovery after physical activity\n• Energy levels during exercise\n\nThis helps practitioners understand your physical capacity and recommend appropriate exercise levels.",
      hi: "व्यायाम शक्ति का आकलन इन प्रश्नों से किया जाता है:\n• वर्तमान व्यायाम की आदतें\n• व्यायाम सहनशीलता\n• शारीरिक गतिविधि के बाद रिकवरी\n\n💡 यह चिकित्सक को आपकी शारीरिक क्षमता समझने में मदद करता है।",
      mr: "व्यायाम शक्ती या प्रश्नांद्वारे मोजली जाते:\n• सध्याच्या व्यायाम सवयी\n• व्यायाम सहनशीलता\n• शारीरिक क्रियाकलापानंतर पुनर्प्राप्ती\n\n💡 या वैद्याला तुमची शारीरिक क्षमता समजून घेण्यात मदत करते.",
    },
  },
  {
    id: "ahara_shakti",
    category: "term",
    keywords: ["ahara shakti", "appetite", "eating capacity", "digestive strength"],
    shortAnswer: {
      en: "Ahara Shakti refers to digestive and eating capacity in Ayurveda. It assesses how much food a person can comfortably digest, their appetite strength, and overall digestive power.",
      hi: "आहार शक्ति आयुर्वेद में पाचन और खाने की क्षमता को संदर्भित करती है।",
      mr: "आहार शक्ती म्हणजे आयुर्वेदातील पचन आणि खाद्य क्षमता.",
    },
    detailedAnswer: {
      en: "Ahara Shakti is assessed by asking about:\n• Portion sizes at meals\n• Hunger patterns\n• Digestion speed\n• Post-meal comfort\n\nThis helps practitioners understand your digestive capacity and provide appropriate dietary recommendations.\n\n💡 Your responses during dietary assessment help determine your Ahara Shakti.",
      hi: "आहार शक्ति का आकलन इन प्रश्नों से किया जाता है:\n• भोजन में भाग का आकार\n• भूख पैटर्न\n• पाचन गति\n\n💡 आपकी प्रतिक्रियाएं आपकी आहार शक्ति निर्धारित करने में मदद करती हैं।",
      mr: "आहार शक्ती या प्रश्नांद्वारे मोजली जाते:\n• जेवणातील भागाचे आकार\n• भूक नमुने\n• पचन गती\n\n💡 तुमचे प्रतिसाद तुमची आहार शक्ती ठरवण्यात मदत करतात.",
    },
  },
  {
    id: "vaya",
    category: "term",
    keywords: ["vaya", "age", "age assessment", "what is vaya"],
    shortAnswer: {
      en: "Vaya refers to age assessment in Ayurveda. It considers chronological age alongside biological age indicators — how youthful or aged the body appears based on physical signs, energy levels, and functional capacity.",
      hi: "वया आयुर्वेद में आयु मूल्यांकन को संदर्भित करता है। यह कालानुक्रमिक आयु के साथ-साथ जैविक आयु संकेतकों पर विचार करता है।",
      mr: "वया म्हणजे आयुर्वेदातील वय मूल्यांकन. हे कालानुक्रमिक वयाबरोबरच जैविक वय निर्देशकांचा विचार करते.",
    },
    detailedAnswer: {
      en: "Vaya assessment considers:\n• Chronological age\n• Physical appearance vs. actual age\n• Energy and vitality levels\n• Functional capacity\n• Skin, hair, and dental condition\n\nThis helps practitioners understand if the body is aging normally or if there are signs of premature or delayed aging.\n\n💡 Simple questions help assess your Vaya category.",
      hi: "वय मूल्यांकन में शामिल हैं:\n• कालानुक्रमिक आयु\n• शारीरिक उपस्थिति बनाम वास्तविक आयु\n• ऊर्जा और जीवन शक्ति स्तर\n\n💡 सरल प्रश्न आपकी वय श्रेणी का आकलन करने में मदद करते हैं।",
      mr: "वय मूल्यांकनात समावेश आहेत:\n• कालानुक्रमिक वय\n• शारीरिक स्वरूप बनाम वास्तविक वय\n• ऊर्जा आणि जीवनशक्ती पातळी\n\n💡 सोपे प्रश्न तुमच्या वय श्रेणीचे मूल्यांकन करण्यात मदत करतात.",
    },
  },
];

// ─── Chatbot Response Generator ──────────────────────────────────────────

export interface ChatResponse {
  message: string;
  suggestedActions?: string[];
  extractedData?: Record<string, unknown>;
  mode: "education" | "pre_consultation" | "practitioner";
  category: "education" | "term" | "assessment" | "safety" | "general" | "pre_consultation";
}

// Pre-consultation conversation flow
const PRE_CONSULTATION_QUESTIONS = [
  {
    id: "chief_concern",
    question: {
      en: "What brings you to the clinic today? What is your main health concern?",
      hi: "आज आप क्लिनिक में किसके लिए आए हैं? आपकी मुख्य स्वास्थ्य चिंता क्या है?",
      mr: "आज तुम्ही क्लिनिकमध्ये कशासाठी आला आहात? तुमची मुख्य आरोग्य चिंता काय आहे?",
    },
    type: "free_text" as const,
    category: "chief_complaint",
  },
  {
    id: "duration",
    question: {
      en: "How long have you been experiencing these symptoms?",
      hi: "आप इन लक्षणों को कितने समय से अनुभव कर रहे हैं?",
      mr: "तुम्ही हे लक्षणे काळापासून अनुभवत आहात?",
    },
    type: "single_choice" as const,
    options: {
      en: ["Less than a week", "1-2 weeks", "2-4 weeks", "1-3 months", "3-6 months", "More than 6 months"],
      hi: ["एक सप्ताह से कम", "1-2 सप्ताह", "2-4 सप्ताह", "1-3 महीने", "3-6 महीने", "6 महीने से अधिक"],
      mr: ["एका आठवड्यापेक्षा कमी", "1-2 आठवडे", "2-4 आठवडे", "1-3 महिने", "3-6 महिने", "6 महिन्यांपेक्षा जास्त"],
    },
    category: "duration",
  },
  {
    id: "digestive_appetite",
    question: {
      en: "How would you describe your appetite recently?",
      hi: "हाल ही में आप अपनी भूख का वर्णन कैसे करेंगे?",
      mr: "अलीकडे तुम्ही तुमची भूक कशी वर्णवाल?",
    },
    type: "single_choice" as const,
    options: {
      en: ["Normal and regular", "Increased/good appetite", "Reduced/poor appetite", "Irregular/variable", "Excessive hunger"],
      hi: ["सामान्य और नियमित", "बढ़ी हुई/अच्छी भूख", "कम/खराब भूख", "अनियमित", "अत्यधिक भूख"],
      mr: ["सामान्य आणि नियमित", "वाढलेली/चांगली भूक", "कमी/खराब भूक", "अनियमित", "अत्यधिक भूक"],
    },
    category: "digestive",
  },
  {
    id: "digestive_symptoms",
    question: {
      en: "Do you experience any digestive discomfort?",
      hi: "क्या आपको कोई पाचन संबंधी परेशानी होती है?",
      mr: "तुम्हाला कोणतीही पचन अस्वस्थता होते का?",
    },
    type: "multiple_choice" as const,
    options: {
      en: ["Bloating", "Gas", "Acidity/burning", "Heavy feeling after meals", "Constipation", "Loose stools", "Nausea", "None of these"],
      hi: ["सूजन", "गैर गैस", "अम्लता/जलन", "भोजन के बाद भारीपन", "कब्ज", "ढीले मल", "जी मिचलाना", "इनमें से कोई नहीं"],
      mr: ["जडपणा", "वायू", "आम्लपित्त/जळण", "जेवणानंतर जडपणा", "कब्ज", "ढीले शौच", "जी चळ", "यापैकी काही नाही"],
    },
    category: "digestive",
  },
  {
    id: "sleep_pattern",
    question: {
      en: "How would you describe your sleep?",
      hi: "आप अपनी नींद का वर्णन कैसे करेंगे?",
      mr: "तुम्ही तुमच्या झोपेचे वर्णन कशी कराल?",
    },
    type: "single_choice" as const,
    options: {
      en: ["Deep and refreshing", "Light/interrupted", "Difficult to fall asleep", "Excessive sleep", "Wakes early", "Regular but insufficient"],
      hi: ["गहरी और ताज़गी देने वाली", "हल्की/बाधित", "सोने में कठिनाई", "अत्यधिक नींद", "जल्दी जाग जाना", "नियमित लेकिन अपर्याप्त"],
      mr: ["खोल आणि ताजगी देणारी", "हलकी/खंडित", "झोप लागण्यास अडचण", "अत्यधिक झोप", "लवकर जागे होणे", "नियमित पण अपुरी"],
    },
    category: "sleep",
  },
  {
    id: "sleep_time",
    question: {
      en: "What time do you usually go to bed and wake up?",
      hi: "आप सामान्य रूप से कितने बजे सोते हैं और कितने बजे जागते हैं?",
      mr: "तुम्ही सामान्यतः किती वाजता झोपता आणि किती वाजता जागे होता?",
    },
    type: "single_choice" as const,
    options: {
      en: ["Before 10 PM / Before 6 AM", "10 PM - 12 AM / 6-8 AM", "After 12 AM / After 8 AM", "Irregular/variable schedule"],
      hi: ["रात 10 बजे से पहले / सुबह 6 बजे से पहले", "रात 10-12 बजे / सुबह 6-8 बजे", "रात 12 बजे के बाद / सुबह 8 बजे के बाद", "अनियमित/बदलता कार्यक्रम"],
      mr: ["रात्री 10 वाजेपूर्वी / सकाळी 6 वाजेपूर्वी", "रात्री 10-12 वाजता / सकाळी 6-8 वाजता", "रात्री 12 वाजेनंतर / सकाळी 8 वाजेनंतर", "अनियमित/बदलता वेळापत्रक"],
    },
    category: "sleep",
  },
  {
    id: "physical_activity",
    question: {
      en: "How would you describe your physical activity level?",
      hi: "आप अपनी शारीरिक गतिविधि के स्तर का वर्णन कैसे करेंगे?",
      mr: "तुम्ही तुमच्या शारीरिक क्रियाकलाप पातळीचे वर्णन कशी कराल?",
    },
    type: "single_choice" as const,
    options: {
      en: ["Active (daily exercise/sports)", "Moderate (walk regularly)", "Light (occasional walks)", "Sedentary (mostly sitting)", "Varies day to day"],
      hi: ["सक्रिय (दैनिक व्यायाम/खेल)", "मध्यम (नियमित चलना)", "हल्का (कभी-कभी चलना)", "सुस्त (मुख्यतः बैठे रहना)", "दिन के अनुसार बदलता है"],
      mr: ["सक्रिय (दैनिक व्यायाम/खेळ)", "मध्यम (नियमित चालता)", "हलका (कधी कधी चालता)", "सुस्त (बहुतेक बसलेला)", "दिवसानुसार बदलतो"],
    },
    category: "lifestyle",
  },
  {
    id: "activity_duration",
    question: {
      en: "How many hours per day do you spend sitting (at work, commuting, etc.)?",
      hi: "आप प्रतिदिन कितने घंटे बैठे रहते हैं (काम, यात्रा आदि में)?",
      mr: "तुम्ही दररोज किती तास बसलेले राहता (काम, प्रवास इ.)?",
    },
    type: "single_choice" as const,
    options: {
      en: ["Less than 4 hours", "4-6 hours", "6-8 hours", "More than 8 hours"],
      hi: ["4 घंटे से कम", "4-6 घंटे", "6-8 घंटे", "8 घंटे से अधिक"],
      mr: ["4 तासापेक्षा कमी", "4-6 तास", "6-8 तास", "8 तासापेक्षा जास्त"],
    },
    category: "lifestyle",
  },
  {
    id: "stress_level",
    question: {
      en: "How would you describe your current stress level?",
      hi: "आप अपने वर्तमान तनाव के स्तर का वर्णन कैसे करेंगे?",
      mr: "तुम्ही तुमच्या सध्याच्या तणाव पातळीचे वर्णन कशी कराल?",
    },
    type: "single_choice" as const,
    options: {
      en: ["Low — mostly calm", "Moderate — some daily stress", "High — frequently stressed", "Very high — constant tension"],
      hi: ["कम — मुख्यतः शांत", "मध्यम — कुछ दैनिक तनाव", "अधिक — बार-बार तनाव", "बहुत अधिक — लगातार तनाव"],
      mr: ["कमी — बहुतेक शांत", "मध्यम — काही दैनिक तणाव", "जास्त — वारंवार तणाव", "खूप जास्त — सतत तणाव"],
    },
    category: "wellbeing",
  },
  {
    id: "food_preferences",
    question: {
      en: "What are your primary food preferences?",
      hi: "आपकी प्राथमिक खाद्य प्राथमिकताएं क्या हैं?",
      mr: "तुमची प्राथमिक अन्न प्राधान्ये काय आहेत?",
    },
    type: "single_choice" as const,
    options: {
      en: ["Vegetarian", "Non-vegetarian", "Vegan", "Mixed diet"],
      hi: ["शाकाहारी", "मांसाहारी", "शाकाहारी (वीगन)", "मिश्रित आहार"],
      mr: ["शाकाहारी", "मांसाहारी", "शाकाहारी (व्हेगन)", "मिश्रित आहार"],
    },
    category: "diet",
  },
  {
    id: "food_tastes",
    question: {
      en: "Which tastes do you prefer or crave most often?",
      hi: "आप सबसे अधिक कौन से स्वाद पसंद करते हैं या चाहते हैं?",
      mr: "तुम्ही सर्वाधिक कोणते रस आवडत किंवा आकांक्षित करता?",
    },
    type: "multiple_choice" as const,
    options: {
      en: ["Sweet", "Sour", "Salty", "Pungent/spicy", "Bitter", "Astringent"],
      hi: ["मीठा", "खट्टा", "नमकीन", "तीखा", "कड़वा", "कसैला"],
      mr: ["गोड", "आंबट", "मीठ", "तिखट", "कडू", "वांड"],
    },
    category: "diet",
  },
  {
    id: "meal_timing",
    question: {
      en: "How regular are your meal times?",
      hi: "आपके भोजन का समय कितना नियमित है?",
      mr: "तुमच्या जेवणाचा वेळ किती नियमित आहे?",
    },
    type: "single_choice" as const,
    options: {
      en: ["Very regular (same times daily)", "Mostly regular", "Somewhat irregular", "Very irregular", "Skip meals often"],
      hi: ["बहुत नियमित (रोज़ एक ही समय)", "मुख्यतः नियमित", "कुछ अनियमित", "बहुत अनियमित", "अक्सर भोजन छोड़ना"],
      mr: ["खूप नियमित (दररोज एकच वेळ)", "बहुतेक नियमित", "काही अनियमित", "खूप अनियमित", "प्रायः जेवण वगळणे"],
    },
    category: "diet",
  },
  {
    id: "water_intake",
    question: {
      en: "How much water do you drink daily?",
      hi: "आप प्रतिदिन कितना पानी पीते हैं?",
      mr: "तुम्ही दररोज किती पाणी पिता?",
    },
    type: "single_choice" as const,
    options: {
      en: ["Less than 4 glasses", "4-6 glasses", "6-8 glasses", "More than 8 glasses", "Mostly tea/coffee instead"],
      hi: ["4 गिलास से कम", "4-6 गिलास", "6-8 गिलास", "8 गिलास से अधिक", "मुख्यतः चाय/कॉफी"],
      mr: ["4 गिळ्यापेक्षा कमी", "4-6 गिळे", "6-8 गिळे", "8 गिळ्यापेक्षा जास्त", "बहुतेक चहा/कॉफी"],
    },
    category: "diet",
  },
  {
    id: "previous_ayush",
    question: {
      en: "Have you previously consulted an Ayurvedic practitioner or taken Ayurvedic medicines?",
      hi: "क्या आपने पहले कभी आयुर्वेदिक चिकित्सक से परामर्श किया है या आयुर्वेदिक दवाएं ली हैं?",
      mr: "तुम्ही आधीपासून आयुर्वेदिक वैद्याचा सल्ला घेतला आहे किंवा आयुर्वेदिक औषधे घेतली आहेत का?",
    },
    type: "single_choice" as const,
    options: {
      en: ["Yes, currently taking", "Yes, previously but not now", "No, first-time consultation", "Not sure"],
      hi: ["हां, वर्तमान में ले रहा हूं", "हां, पहले लिया लेकिन अब नहीं", "नहीं, पहली बार परामर्श", "पता नहीं"],
      mr: ["हो, सध्या घेत आहे", "हो, आधी घेतली पण आता नाही", "नाही, पहिल्यांदाचा सल्ला", "माहीत नाही"],
    },
    category: "treatment_history",
  },
];

// ─── Main Chat Response Function ─────────────────────────────────────────

export function generateChatResponse(
  userMessage: string,
  mode: "education" | "pre_consultation" | "practitioner",
  language: string,
  conversationHistory: Array<{ role: string; content: string }> = [],
  assessmentProgress?: number,
): ChatResponse {
  const msg = userMessage.toLowerCase().trim();

  // Safety check — emergency symptoms
  const emergencyKeywords = ["chest pain", "severe pain", "difficulty breathing", "unconscious", "heavy bleeding", "stroke", "can't breathe", "heart attack", "severe allergic", "anaphylaxis",
    "छाती में दर्द", "सांस नहीं आ रही", "बेहोश", "दिल का दौरा",
    "छातीत तीव्र दुखणे", "श्वास येत नाही", "बेशुद्ध", "हृदयाचा झटका"];
  if (emergencyKeywords.some((k) => msg.includes(k))) {
    return {
      message: language === "hi"
        ? "⚠️ आपके लक्षणों को तत्काल चिकित्सा मूल्यांकन की आवश्यकता हो सकती है। कृपया तुरंत अस्पताल के कर्मचारियों या एक योग्य स्वास्थ्य सेवा पेशेवर से संपर्क करें।"
        : language === "mr"
          ? "⚠️ तुमच्या लक्षणांना तात्काळ वैद्यकीय मूल्यांकन आवश्यक असू शकते. कृपया तात्काळच रुग्णालयाच्या कर्मचाऱ्यांशी किंवा पात्र आरोग्यसेवा व्यावसायिकाशी संपर्क साधा."
          : "⚠️ Your symptoms may require prompt medical evaluation. Please contact hospital staff or a qualified healthcare professional immediately. Do not wait for an online consultation.",
      suggestedActions: ["Talk to Practitioner", "Use SOS Button"],
      mode,
      category: "safety",
    };
  }

  // Safety check — medicine/prescription requests
  if (mode === "education" || mode === "pre_consultation") {
    const prescribeKeywords = ["which medicine", "what medicine", "prescribe", "recommend medicine", "what should i take", "dosage", "how much should i take", "stop medicine",
      "कौन सी दवा", "क्या दवा लूं", "कितनी दवा", "दवा बंद"];
    if (prescribeKeywords.some((k) => msg.includes(k))) {
      return {
        message: KNOWLEDGE_BASE.find((e) => e.id === "safety_general")!.shortAnswer[language as keyof typeof KNOWLEDGE_BASE[0]["shortAnswer"]] || KNOWLEDGE_BASE.find((e) => e.id === "safety_general")!.shortAnswer.en,
        suggestedActions: ["Start Assessment", "Talk to Practitioner"],
        mode,
        category: "safety",
      };
    }
  }

  // Education mode — search knowledge base
  if (mode === "education") {
    for (const entry of KNOWLEDGE_BASE) {
      if (entry.category === "safety") continue;
      if (entry.keywords.some((kw) => msg.includes(kw))) {
        return {
          message: entry.shortAnswer[language as keyof typeof entry.shortAnswer] || entry.shortAnswer.en,
          suggestedActions: ["Learn More", "Start Assessment", "Talk to Practitioner"],
          mode,
          category: entry.category,
        };
      }
    }

    // If "learn more" requested
    if (msg.includes("learn more") || msg.includes("detailed") || msg.includes("detail")) {
      // Find the last discussed topic from history
      const lastBotMsg = conversationHistory.filter((m) => m.role === "bot").pop()?.content || "";
      for (const entry of KNOWLEDGE_BASE) {
        const short = entry.shortAnswer[language as keyof typeof entry.shortAnswer] || entry.shortAnswer.en;
        if (lastBotMsg.includes(short.substring(0, 30))) {
          return {
            message: entry.detailedAnswer[language as keyof typeof entry.detailedAnswer] || entry.detailedAnswer.en,
            suggestedActions: ["Start Assessment", "Ask Another Question"],
            mode,
            category: entry.category,
          };
        }
      }
    }

    // Default education response
    return {
      message: language === "hi"
        ? "मैं आयुर्वेद के बारे में जानकारी दे सकता हूं। आप पूछ सकते हैं:\n• प्रकृति (शरीर संविधान)\n• विकृति (असंतुलन)\n• अग्नि (पाचन अग्नि)\n• दिनचर्या (दैनिक दिनचर्या)\n• पंचकर्म\n• कोष्ठ, सत्व, और अन्य अवधारणाएं"
        : language === "mr"
          ? "मी आयुर्वेदाबद्दल माहिती देऊ शकतो. तुम्ही विचारू शकता:\n• प्रकृती (शरीर संविधान)\n• विकृती (असंतुलन)\n• अग्नी (पचन अग्नी)\n• दिनचर्या\n• पंचकर्म\n• कोष्ठ, सत्व, आणि इतर संकल्पना"
          : "I can provide information about Ayurveda. You can ask about:\n• Prakriti (body constitution)\n• Vikriti (imbalance)\n• Agni (digestive fire)\n• Dinacharya (daily routine)\n• Panchakarma\n• Koshtha, Sattva, and other concepts",
      suggestedActions: ["Start Assessment", "Explain Prakriti", "Explain Agni", "Talk to Practitioner"],
      mode,
      category: "education",
    };
  }

  // Pre-consultation mode — guided assessment
  if (mode === "pre_consultation") {
    // "start assessment" trigger
    if (msg.includes("start assessment") || msg.includes("start my assessment") || msg.includes("begin assessment") || msg.includes("begin") || msg.includes("start consultation")) {
      const q = PRE_CONSULTATION_QUESTIONS[0];
      return {
        message: q.question[language as keyof typeof q.question] || q.question.en,
        suggestedActions: q.options ? (q.options[language as keyof typeof q.options] || q.options.en) : undefined,
        extractedData: { assessmentStarted: true, currentQuestion: q.id },
        mode,
        category: "pre_consultation",
      };
    }

    // Determine current question from progress
    const qIdx = assessmentProgress ?? 0;
    if (qIdx < PRE_CONSULTATION_QUESTIONS.length) {
      const q = PRE_CONSULTATION_QUESTIONS[qIdx];
      return {
        message: q.question[language as keyof typeof q.question] || q.question.en,
        suggestedActions: q.options ? (q.options[language as keyof typeof q.options] || q.options.en) : undefined,
        extractedData: { [q.id]: userMessage, currentQuestion: q.id, questionIndex: qIdx },
        mode,
        category: "pre_consultation",
      };
    }

    // Assessment complete
    return {
      message: language === "hi"
        ? "✅ आपकी पूर्व-परामर्श जानकारी एकत्र कर ली गई है। आपकी AYUSH मरीज़ ब्रीफ तैयार हो रही है। आपका वैद्य इसकी समीक्षा करेगा।"
        : language === "mr"
          ? "✅ तुमची पूर्व-सल्ला माहिती गोळा करण्यात आली आहे. तुमची AYUSH रुग्ण ब्रीफ तयार होत आहे. तुमचा वैद्य याचा पुनरावलोकन करेल."
          : "✅ Your pre-consultation information has been collected. Your AYUSH Patient Brief is being prepared. Your practitioner will review it.",
      suggestedActions: ["Upload Documents", "View Timeline", "Talk to Practitioner"],
      extractedData: { assessmentComplete: true },
      mode,
      category: "pre_consultation",
    };
  }

  // Practitioner mode
  if (mode === "practitioner") {
    return {
      message: language === "hi"
        ? "मैं चिकित्सक सहायता प्रदान कर सकता हूं। आप पूछ सकते हैं:\n• मरीज़ की पिछली आयुर्वेदिक चिकित्सा\n• अंतिम यात्रा के बाद से बदलाव\n• दस्तावेज़ों में दर्ज शिकायतें\n• अभी भी गायब जानकारी"
        : language === "mr"
          ? "मी वैद्य सहाय्य प्रदान करू शकतो. तुम्ही विचारू शकता:\n• रुग्णाच्या मागील आयुर्वेदिक उपचार\n• शेवटच्या भेटीनंतर काय बदलले\n• कागदपत्रांत नोंदवलेल्या तक्रारी\n• अजूनही गायब माहिती"
          : "I can provide practitioner assistance. You can ask about:\n• Patient's previous Ayurvedic treatment\n• What changed since the last visit\n• Complaints mentioned in documents\n• Information still missing",
      suggestedActions: ["Show Previous Records", "Show Timeline", "What Changed?"],
      mode,
      category: "assessment",
    };
  }

  return {
    message: "I'm here to help. What would you like to know about Ayurveda?",
    suggestedActions: ["Start Assessment", "Explain Prakriti", "Talk to Practitioner"],
    mode,
    category: "general",
  };
}

export { PRE_CONSULTATION_QUESTIONS, KNOWLEDGE_BASE };
