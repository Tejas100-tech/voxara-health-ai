import { Router } from "express";
import { logger } from "../lib/logger";

const router = Router();

// In-memory demo store
const consentRecords: Record<string, any> = {};

interface ConsentRecord {
  sessionId: string;
  patientId: string;
  patientName: string;
  abhaId?: string;
  consentGranted: boolean;
  consentTypes: string[];
  language: string;
  timestamp: string;
  ipAddress?: string;
}

// Record patient consent
router.post("/consent", (req, res) => {
  try {
    const {
      sessionId,
      patientId,
      patientName,
      abhaId,
      consentGranted,
      consentTypes,
      language,
    } = req.body;

    if (!sessionId || !patientId || consentGranted === undefined) {
      res.status(400).json({
        error: "sessionId, patientId, and consentGranted are required",
      });
      return;
    }

    const record: ConsentRecord = {
      sessionId,
      patientId,
      patientName: patientName || "",
      abhaId: abhaId || "",
      consentGranted: Boolean(consentGranted),
      consentTypes: consentTypes || [
        "voice_recording",
        "document_scanning",
        "clinical_history_capture",
        "abdm_integration",
      ],
      language: language || "en",
      timestamp: new Date().toISOString(),
    };

    consentRecords[sessionId] = record;

    res.json({
      consent: record,
      message: consentGranted
        ? "Consent recorded. You may proceed with the intake process."
        : "Consent not granted. The intake process cannot proceed without consent.",
      canProceed: consentGranted,
    });
  } catch (err) {
    logger.error({ err }, "Failed to record consent");
    res.status(500).json({ error: "Failed to record consent" });
  }
});

// Get consent status for a session
router.get("/consent/:sessionId", (req, res) => {
  const consent = consentRecords[String(req.params.sessionId)];
  if (!consent) {
    res.status(404).json({ error: "No consent record found" });
    return;
  }
  res.json(consent);
});

// Revoke consent
router.post("/consent/:sessionId/revoke", (req, res) => {
  const sessionId = String(req.params.sessionId);
  const consent = consentRecords[sessionId];
  if (!consent) {
    res.status(404).json({ error: "No consent record found" });
    return;
  }

  consent.consentGranted = false;
  consent.revokedAt = new Date().toISOString();
  consentRecords[sessionId] = consent;

  res.json({
    consent,
    message: "Consent has been revoked. Session data will be cleared.",
  });
});

// ── Consent text in all Indian languages ───────────────────────────────────
const consentTexts: Record<string, any> = {
  en: {
    title: "Informed Consent for Digital Clinical History Capture",
    sections: [
      {
        heading: "Data Collection",
        text: "I understand that MediKiosk will record my voice during the clinical history interview, capture my responses to medical questions, and scan any medical documents I provide. This data is used solely to create a structured clinical history summary for my physician.",
      },
      {
        heading: "AI Processing",
        text: "My voice recordings and documents will be processed by AI systems to generate a clinical summary. The AI processing is performed securely within the MediKiosk platform.",
      },
      {
        heading: "ABDM Integration",
        text: "If I provide my ABHA ID, the clinical summary may be linked to my Ayushman Bharat Health Account and shared with the hospital's information system.",
      },
      {
        heading: "Data Retention",
        text: "Temporary session data (voice recordings, intermediate processing) will be permanently deleted after the clinical summary is submitted. Only the final structured summary is retained.",
      },
      {
        heading: "My Rights",
        text: "I understand that I can revoke this consent at any time. If I revoke consent, all session data will be deleted. I can request a copy of my clinical summary at any time.",
      },
    ],
    consentStatement:
      "I have read and understood the above. I voluntarily consent to the collection and processing of my health information as described above.",
  },
  hi: {
    title: "डिजिटल क्लिनिकल हिस्ट्री कैप्चर के लिए सूचित सहमति",
    sections: [
      { heading: "डेटा संग्रह", text: "मैं समझता/समझती हूं कि MediKiosk क्लिनिकल हिस्ट्री साक्षात्कार के दौरान मेरी आवाज़ रिकॉर्ड करेगा, चिकित्सा प्रश्नों के मेरे उत्तर कैप्चर करेगा, और मेरे द्वारा प्रदान किए गए किसी भी चिकित्सा दस्तावेज़ को स्कैन करेगा।" },
      { heading: "AI प्रसंस्करण", text: "मेरी आवाज़ रिकॉर्डिंग और दस्तावेज़ों को क्लिनिकल सारांश बनाने के लिए AI सिस्टम द्वारा प्रसंस्करण किया जाएगा।" },
      { heading: "ABDM एकीकरण", text: "यदि मैं अपनी ABHA ID प्रदान करता/करती हूं, तो क्लिनिकल सारांश मेरे आयुष्मान भारत स्वास्थ्य खाते से जोड़ा जा सकता है।" },
      { heading: "डेटा प्रतिधारण", text: "अस्थायी सत्र डेटा क्लिनिकल सारांश जमा होने के बाद स्थायी रूप से हटा दिया जाएगा।" },
      { heading: "मेरे अधिकार", text: "मैं समझता/समझती हूं कि मैं किसी भी समय इस सहमति को रद्द कर सकता/सकती हूं।" },
    ],
    consentStatement: "मैंने उपरोक्त पढ़ लिया है और समझ लिया है। मैं स्वेच्छा से ऊपर वर्णित के अनुसार अपनी स्वास्थ्य जानकारी के संग्रह और प्रसंस्करण के लिए सहमति देता/देती हूं।",
  },
  ta: {
    title: "டிஜிட்டல் கிளினிக்கல் வரலாறு பதிவுக்கான தகவல் சம்மதம்",
    sections: [
      { heading: "தரவு சேகரிப்பு", text: "கிளினிக்கல் வரலாற்று நேர்காணலின் போது MediKiosk எனது குரலைப் பதிவு செய்யும், மருத்துவ கேள்விகளுக்கு எனது பதில்களைப் பிடிக்கும் என்பதை நான் புரிந்துகொள்கிறேன்." },
      { heading: "AI செயலாக்கம்", text: "கிளினிக்கல் சுருக்கத்தை உருவாக்க AI அமைப்புகளால் எனது குரல் பதிவுகள் மற்றும் ஆவணங்கள் செயலாக்கப்படும்." },
      { heading: "ABDM ஒருங்கிணைப்பு", text: "நான் எனது ABHA ID வழங்கினால், கிளினிக்கல் சுருக்கம் எனது ஆயுஷ்மான் பாரத் சுகாதார கணக்குடன் இணைக்கப்படலாம்." },
      { heading: "தரவு தக்கவைப்பு", text: "தற்காலிக அமர்வு தரவு கிளினிக்கல் சுருக்கம் சமர்ப்பிக்கப்பட்ட பிறகு நிரந்தரமாக நீக்கப்படும்." },
      { heading: "என் உரிமைகள்", text: "நான் எப்போது வேண்டுமானாலும் இந்த சம்மதத்தை ரத்து செய்யலாம் என்பதை நான் புரிந்துகொள்கிறேன்." },
    ],
    consentStatement: "மேலே உள்ளவற்றை நான் படித்து புரிந்துகொண்டேன். மேலே விவரிக்கப்பட்டுள்ளபடி எனது சுகாதார தகவல்களின் சேகரிப்பு மற்றும் செயலாக்கத்திற்கு நான் தன்னார்வத்துடன் சம்மதிக்கிறேன்.",
  },
  te: {
    title: "డిజిటల్ క్లినికల్ హిస్టరీ క్యాప్చర్ కోసం సమాచార సమ్మతి",
    sections: [
      { heading: "డేటా సేకరణ", text: "క్లినికల్ హిస్టరీ ఇంటర్వ్యూ సమయంలో MediKiosk నా గొంతును రికార్డ్ చేస్తుందని, వైద్య ప్రశ్నలకు నా సమాధానాలను క్యాప్చర్ చేస్తుందని నేను అర్థం చేసుకున్నాను." },
      { heading: "AI ప్రాసెసింగ్", text: "క్లినికల్ సారాంశాన్ని రూపొందించడానికి AI వ్యవస్థలచే నా వాయిస్ రికార్డింగ్‌లు మరియు పత్రాలు ప్రాసెస్ చేయబడతాయి." },
      { heading: "ABDM ఇంటిగ్రేషన్", text: "నా ABHA ID అందిస్తే, క్లినికల్ సారాంశం నా ఆయుష్మాన్ భారత్ హెల్త్ అకౌంట్‌తో లింక్ చేయబడవచ్చు." },
      { heading: "డేటా నిల్వ", text: "తాత్కాలిక సెషన్ డేటా క్లినికల్ సారాంశం సమర్పించిన తర్వాత శాశ్వతంగా తొలగించబడుతుంది." },
      { heading: "నా హక్కులు", text: "నేను ఎప్పుడైనా ఈ సమ్మతిని రద్దు చేయవచ్చని నేను అర్థం చేసుకున్నాను." },
    ],
    consentStatement: "పైన చదివి అర్థం చేసుకున్నాను. పైన వివరించిన విధంగా నా ఆరోగ్య సమాచారం సేకరణ మరియు ప్రాసెసింగ్‌కు నేను స్వచ్ఛందంగా సమ్మతిస్తున్నాను.",
  },
  bn: {
    title: "ডিজিটাল ক্লিনিক্যাল হিস্ট্রি ক্যাপচারের জন্য সচেতন সম্মতি",
    sections: [
      { heading: "তথ্য সংগ্রহ", text: "আমি বুঝতে পারছি যে MediKiosk ক্লিনিক্যাল হিস্ট্রি সাক্ষাৎকারের সময় আমার কণ্ঠস্বর রেকর্ড করবে, চিকিৎসা প্রশ্নের আমার উত্তর ক্যাপচার করবে।" },
      { heading: "AI প্রক্রিয়াকরণ", text: "ক্লিনিক্যাল সারাংশ তৈরি করতে AI সিস্টেম দ্বারা আমার কণ্ঠস্বর রেকর্ডিং এবং নথি প্রক্রিয়াকরণ করা হবে।" },
      { heading: "ABDM ইন্টিগ্রেশন", text: "আমি আমার ABHA ID প্রদান করলে, ক্লিনিক্যাল সারাংশ আমার আয়ুষ্মান ভারত স্বাস্থ্য অ্যাকাউন্টের সাথে যুক্ত হতে পারে।" },
      { heading: "তথ্য সংরক্ষণ", text: "অস্থায়ী সেশন তথ্য ক্লিনিক্যাল সারাংশ জমা দেওয়ার পরে স্থায়ীভাবে মুছে ফেলা হবে।" },
      { heading: "আমার অধিকার", text: "আমি যেকোনো সময় এই সম্মতি প্রত্যাহার করতে পারি বলে আমি বুঝতে পারছি।" },
    ],
    consentStatement: "উপরের কথা পড়ে বুঝেছি। আমি স্বেচ্ছায় উপরে বর্ণিত অনুযায়ী আমার স্বাস্থ্য তথ্য সংগ্রহ ও প্রক্রিয়াকরণে সম্মতি দিচ্ছি।",
  },
  mr: {
    title: "डिजिटल क्लिनिकल इतिहास कॅप्चरसाठी सूचित संमती",
    sections: [
      { heading: "डेटा संकलन", text: "मी समजतो/समजते की MediKiosk क्लिनिकल इतिहास संवादादरम्यान माझा आवाज रेकॉर्ड करील, वैद्यकीय प्रश्नांचे माझे उत्तर कॅप्चर करील." },
      { heading: "AI प्रक्रिया", text: "क्लिनिकल सारांश तयार करण्यासाठी AI प्रणालींद्वारे माझ्या आवाज रेकॉर्डिंग आणि दस्तऐवज प्रक्रिया केले जातील." },
      { heading: "ABDM एकत्रीकरण", text: "मी माझी ABHA ID प्रदान केल्यास, क्लिनिकल सारांश माझ्या आयुष्मान भारत आरोग्य खात्याशी जोडला जाऊ शकतो." },
      { heading: "डेटा धरून ठेवणे", text: "तात्पुरते सत्र डेटा क्लिनिकल सारांश सादर केल्यानंतर कायमचा हटवला जाईल." },
      { heading: "माझे अधिकार", text: "मी कोणत्याही वेळी ही संमती मागे घेऊ शकतो/शकते हे मी समजतो." },
    ],
    consentStatement: "वरील वाचून समजले. मी स्वेच्छेने वरील प्रमाणे माझ्या आरोग्य माहितीच्या संकलन आणि प्रक्रियेसाठी संमती देतो/देते.",
  },
  gu: {
    title: "ડિજિટલ ક્લિનિકલ હિસ્ટરી કેપ્ચર માટે માહિતગાર સંમતિ",
    sections: [
      { heading: "ડેટા સંગ્રહ", text: "હું સમજું છું કે MediKiosk ક્લિનિકલ હિસ્ટરી ઇન્ટરવ્યૂ દરમિયાન મારો અવાજ રેકોર્ડ કરશે, તબીબી પ્રશ્નોના મારા જવાબો કેપ્ચર કરશે." },
      { heading: "AI પ્રક્રિયા", text: "ક્લિનિકલ સારાંશ બનાવવા માટે AI સિસ્ટમ્સ દ્વારા મારા અવાજ રેકોર્ડિંગ્સ અને દસ્તાવેજો પ્રક્રિયા કરવામાં આવશે." },
      { heading: "ABDM ઇન્ટિગ્રેશન", text: "જો હું મારી ABHA ID આપું, તો ક્લિનિકલ સારાંશ મારા આયુષ્માન ભારત હેલ્થ એકાઉન્ટ સાથે જોડાઈ શકે છે." },
      { heading: "ડેટા રીટેન્શન", text: "ક્લિનિકલ સારાંશ સબમિટ થયા પછી કામચલાઉ સેશન ડેટા કાયમ માટે કાઢી નાખવામાં આવશે." },
      { heading: "મારા અધિકારો", text: "હું સમજું છું કે હું કોઈપણ સમયે આ સંમતિ પાછી ખેંचી શકું છું." },
    ],
    consentStatement: "ઉપરનું વાંચીને સમજ્યો છું. હું સ્વેચ્છાએ ઉપર વર્ણિત મારા આરોગ્ય માહિતીના સંગ્રહ અને પ્રક્રિયા માટે સંમતિ આપું છું.",
  },
  kn: {
    title: "ಡಿಜಿಟಲ್ ಕ್ಲಿನಿಕಲ್ ಹಿಸ್ಟರಿ ಕ್ಯಾಪ್ಚರ್‌ಗಾಗಿ ಮಾಹಿತಿಯುಕ್ತ ಸಮ್ಮತಿ",
    sections: [
      { heading: "ಡೇಟಾ ಸಂಗ್ರಹಣೆ", text: "ಕ್ಲಿನಿಕಲ್ ಹಿಸ್ಟರಿ ಸಂದರ್ಶನದ ಸಮಯದಲ್ಲಿ MediKiosk ನನ್ನ ಧ್ವನಿಯನ್ನು ರೆಕಾರ್ಡ್ ಮಾಡುತ್ತದೆ, ವೈದ್ಯಕೀಯ ಪ್ರಶ್ನೆಗಳಿಗೆ ನನ್ನ ಉತ್ತರಗಳನ್ನು ಹಿಡಿಯುತ್ತದೆ ಎಂದು ನಾನು ಅರ್ಥಮಾಡಿಕೊಳ್ಳುತ್ತೇನೆ." },
      { heading: "AI ಪ್ರಕ್ರಿಯೆ", text: "ಕ್ಲಿನಿಕಲ್ ಸಾರಾಂಶವನ್ನು ರಚಿಸಲು AI ವ್ಯವಸ್ಥೆಗಳಿಂದ ನನ್ನ ಧ್ವನಿ ರೆಕಾರ್ಡಿಂಗ್‌ಗಳು ಮತ್ತು ಡಾಕ್ಯುಮೆಂಟ್‌ಗಳನ್ನು ಪ್ರಕ್ರಿಯೆಗೊಳಿಸಲಾಗುತ್ತದೆ." },
      { heading: "ABDM ಇಂಟಿಗ್ರೇಷನ್", text: "ನಾನು ನನ್ನ ABHA ID ನೀಡಿದರೆ, ಕ್ಲಿನಿಕಲ್ ಸಾರಾಂಶವನ್ನು ನನ್ನ ಆಯುಷ್ಮಾನ್ ಭಾರತ್ ಆರೋಗ್ಯ ಖಾತೆಯೊಂದಿಗೆ ಲಿಂಕ್ ಮಾಡಬಹುದು." },
      { heading: "ಡೇಟಾ ಉಳಿಸುವಿಕೆ", text: "ಕ್ಲಿನಿಕಲ್ ಸಾರಾಂಶವನ್ನು ಸಲ್ಲಿಸಿದ ನಂತರ ತಾತ್ಕಾಲಿಕ ಸೆಶನ್ ಡೇಟಾವನ್ನು ಶಾಶ್ವತವಾಗಿ ಅಳಿಸಲಾಗುತ್ತದೆ." },
      { heading: "ನನ್ನ ಹಕ್ಕುಗಳು", text: "ನಾನು ಯಾವುದೇ ಸಮಯದಲ್ಲಿ ಈ ಸಮ್ಮತಿಯನ್ನು ಹಿಂಪಡೆಯಬಹುದು ಎಂದು ನಾನು ಅರ್ಥಮಾಡಿಕೊಳ್ಳುತ್ತೇನೆ." },
    ],
    consentStatement: "ಮೇಲಿನವುಗಳನ್ನು ಓದಿ ಅರ್ಥಮಾಡಿಕೊಂಡಿದ್ದೇನೆ. ಮೇಲೆ ವಿವರಿಸಿದಂತೆ ನನ್ನ ಆರೋಗ್ಯ ಮಾಹಿತಿಯ ಸಂಗ್ರಹಣೆ ಮತ್ತು ಪ್ರಕ್ರಿಯೆಗೆ ನಾನು ಸ್ವಯಂಪ್ರೇರಿತವಾಗಿ ಸಮ್ಮತಿಸುತ್ತೇನೆ.",
  },
  ml: {
    title: "ഡിജിറ്റൽ ക്ലിനിക്കൽ ഹിസ്റ്ററി ക്യാപ്ചറിനുള്ള അറിവോടുകൂടിയ സമ്മതി",
    sections: [
      { heading: "ഡേറ്റാ ശേഖരണം", text: "ക്ലിനിക്കൽ ഹിസ്റ്ററി അഭിമുഖത്തിനിടയിൽ MediKiosk എൻ്റെ ശബ്ദം റെക്കോർഡ് ചെയ്യുമെന്നും മെഡിക്കൽ ചോദ്യങ്ങൾക്കുള്ള എൻ്റെ ഉത്തരങ്ങൾ പിടിക്കുമെന്നും ഞാൻ മനസ്സിലാക്കുന്നു." },
      { heading: "AI പ്രോസസ്സിംഗ്", text: "ക്ലിനിക്കൽ സംഗ്രഹം സൃഷ്ടിക്കാൻ AI സിസ്റ്റങ്ങൾ എൻ്റെ ശബ്ദ റെക്കോർഡിംഗുകളും രേഖകളും പ്രോസസ്സ് ചെയ്യും." },
      { heading: "ABDM ഇൻ്റഗ്രേഷൻ", text: "ഞാൻ എൻ്റെ ABHA ID നൽകിയാൽ, ക്ലിനിക്കൽ സംഗ്രഹം എൻ്റെ ആയുഷ്മാൻ ഭാരത് ഹെൽത്ത് അക്കൗണ്ടുമായി ബന്ധിപ്പിക്കാം." },
      { heading: "ഡേറ്റാ നിലനിർത്തൽ", text: "ക്ലിനിക്കൽ സംഗ്രഹം സമർപ്പിച്ചതിനുശേഷം താൽക്കാലിക സെഷൻ ഡേറ്റാ ശാശ്വതമായി ഇല്ലാതാക്കും." },
      { heading: "എൻ്റെ അവകാശങ്ങൾ", text: "ഞാൻ എപ്പോൾ വേണമെങ്കിലും ഈ സമ്മതി റദ്ദാക്കാമെന്ന് ഞാൻ മനസ്സിലാക്കുന്നു." },
    ],
    consentStatement: "മുകളിലുള്ളവ വായിച്ച് മനസ്സിലാക്കി. മുകളിൽ വിവരിച്ചിരിക്കുന്നതുപോലെ എൻ്റെ ആരോഗ്യ വിവരങ്ങളുടെ ശേഖരണത്തിനും പ്രോസസ്സിംഗിനും ഞാൻ സ്വമേധയാ സമ്മതിക്കുന്നു.",
  },
  pa: {
    title: "ਡਿਜੀਟਲ ਕਲੀਨਿਕਲ ਇਤਿਹਾਸ ਕੈਪਚਰ ਲਈ ਜਾਣਕਾਰੀਪੂਰਨ ਸਹਿਮਤੀ",
    sections: [
      { heading: "ਡੇਟਾ ਇਕੱਠਾ", text: "ਮੈਂ ਸਮਝਦਾ ਹਾਂ ਕੀ MediKiosk ਕਲੀਨਿਕਲ ਇਤਿਹਾਸ ਸੰਵਾਦ ਦੌਰਾਨ ਮੇਰੀ ਅਵਾਜ਼ ਰਿਕਾਰਡ ਕਰੇਗਾ, ਡਾਕਟਰੀ ਸਵਾਲਾਂ ਦੇ ਮੇਰੇ ਜਵਾਬ ਕੈਪਚਰ ਕਰੇਗਾ।" },
      { heading: "AI ਪ੍ਰਕਿਰਿਆ", text: "ਕਲੀਨਿਕਲ ਸਾਰ ਬਣਾਉਣ ਲਈ AI ਸਿਸਟਮਾਂ ਦੁਆਰਾ ਮੇਰੀ ਅਵਾਜ਼ ਰਿਕਾਰਡਿੰਗਾਂ ਅਤੇ ਦਸਤਾਵੇਜ਼ ਪ੍ਰਕਿਰਿਆ ਕੀਤੇ ਜਾਣਗੇ।" },
      { heading: "ABDM ਇੰਟੀਗ੍ਰੇਸ਼ਨ", text: "ਜੇ ਮੈਂ ਆਪਣੀ ABHA ID ਦਿੰਦਾ ਹਾਂ, ਤਾਂ ਕਲੀਨਿਕਲ ਸਾਰ ਮੇਰੇ ਆਯੁਸ਼ਮਾਨ ਭਾਰਤ ਸਿਹਤ ਖਾਤੇ ਨਾਲ ਜੁੜ ਸਕਦਾ ਹੈ।" },
      { heading: "ਡੇਟਾ ਰੀਟੈਨਸ਼ਨ", text: "ਕਲੀਨਿਕਲ ਸਾਰ ਜਮ੍ਹਾਂ ਹੋਣ ਤੋਂ ਬਾਅਦ ਅਸਥਾਈ ਸੈਸ਼ਨ ਡੇਟਾ ਪੱਕੇ ਤੌਰ 'ਤੇ ਮਿਟਾ ਦਿੱਤਾ ਜਾਵੇਗਾ।" },
      { heading: "ਮੇਰੇ ਅਧਿਕਾਰ", text: "ਮੈਂ ਸਮਝਦਾ ਹਾਂ ਕੀ ਮੈਂ ਕਿਸੇ ਵੀ ਸਮੇਂ ਇਹ ਸਹਿਮਤੀ ਵਾਪਸ ਲੈ ਸਕਦਾ ਹਾਂ।" },
    ],
    consentStatement: "ਉੱਪਰ ਦਾ ਪੜ੍ਹ ਕੇ ਸਮਝ ਲਿਆ ਹੈ। ਮੈਂ ਖੁਦ ਖ਼ੁਸ਼ੀ ਨਾਲ ਉੱਪਰ ਦੱਸੇ ਅਨੁਸਾਰ ਆਪਣੀ ਸਿਹਤ ਜਾਣਕਾਰੀ ਦੇ ਇਕੱਠੇ ਅਤੇ ਪ੍ਰਕਿਰਿਆ ਲਈ ਸਹਿਮਤੀ ਦਿੰਦਾ ਹਾਂ।",
  },
  or: {
    title: "ଡିଜିଟାଲ୍ କ୍ଲିନିକାଲ୍ ହିଷ୍ଟ୍ରି କ୍ୟାପଚର୍ ପାଇଁ ସଚେତନ ସମ୍ମତି",
    sections: [
      { heading: "ତଥ୍ୟ ସଂଗ୍ରହ", text: "ମୁଁ ବୁଝୁଛି ଯେ MediKiosk କ୍ଲିନିକାଲ୍ ହିଷ୍ଟ୍ରି ସାକ୍ଷାତ୍କାର ସମୟରେ ମୋ ସ୍ୱର ରେକର୍ଡ କରିବ, ଚିକିତ୍ସା ପ୍ରଶ୍ନର ମୋ ଉତ୍ତର ଧରିବ।" },
      { heading: "AI ପ୍ରକ୍ରିୟା", text: "କ୍ଲିନିକାଲ୍ ସାରାଂଶ ସୃଷ୍ଟି କରିବା ପାଇଁ AI ସିଷ୍ଟମ୍ ଦ୍ୱାରା ମୋ ସ୍ୱର ରେକର୍ଡିଂ ଏବଂ ଦଲିଲ୍ ପ୍ରକ୍ରିୟା କରାଯିବ।" },
      { heading: "ABDM ଇଣ୍ଟିଗ୍ରେସନ୍", text: "ମୁଁ ମୋ ABHA ID ଦେଲେ, କ୍ଲିନିକାଲ୍ ସାରାଂଶ ମୋ ଆୟୁଷ୍ମାନ୍ ଭାରତ୍ ସ୍ୱାସ୍ଥ୍ୟ ଆକାଉଣ୍ଟ୍ ସହ ଯୋଡାଯାଇପାରେ।" },
      { heading: "ତଥ୍ୟ ସଂରକ୍ଷଣ", text: "କ୍ଲିନିକାଲ୍ ସାରାଂଶ ଦାଖଲ ହେଲା ପରେ ଅସ୍ଥାୟୀ ସେସନ୍ ତଥ୍ୟ ସ୍ଥାୟୀ ଭାବରେ ବିଲୋପ କରାଯିବ।" },
      { heading: "ମୋ ଅଧିକାର", text: "ମୁଁ ଯେକୌଣସି ସମୟରେ ଏହି ସମ୍ମତି ପ୍ରତ୍ୟାହାର କରିପାରିବି ବୋଲି ମୁଁ ବୁଝୁଛି।" },
    ],
    consentStatement: "ଉପରେ ପଢି ବୁଝିଛି। ମୁଁ ସ୍ୱେଚ୍ଛାକୃତ ଉପରେ ବର୍ଣ୍ଣିତ ଅନୁଯାୟୀ ମୋ ସ୍ୱାସ୍ଥ୍ୟ ସୂଚନାର ସଂଗ୍ରହ ଏବଂ ପ୍ରକ୍ରିୟା ପାଇଁ ସମ୍ମତି ଦେଉଛି।",
  },
  as: {
    title: "ডিজিটেল ক্লিনিকেল হিষ্ট্ৰি কেপচাৰৰ বাবে জানকাৰীসম্পন্ন সম্মতি",
    sections: [
      { heading: "তথ্য সংগ্ৰহ", text: "মই বুজিছো যে MediKiosk ক্লিনিকেল হিষ্ট্ৰি সাক্ষাৎকাৰৰ সময়ত মোৰ কণ্ঠস্বৰ ৰেকৰ্ড কৰিব, চিকিৎসা প্ৰশ্নৰ মোৰ উত্তৰ ধৰিব।" },
      { heading: "AI প্ৰক্ৰিয়া", text: "ক্লিনিকেল সাৰাংশ সৃষ্টি কৰিবলৈ AI চিষ্টেমে মোৰ কণ্ঠস্বৰ ৰেকৰ্ডিং আৰু দস্তাবেজ্ প্ৰক্ৰিয়া কৰিব।" },
      { heading: "ABDM ইণ্টিগ্ৰেচন্", text: "মই মোৰ ABHA ID দিলে, ক্লিনিকেল সাৰাংশ মোৰ আয়ুষ্মান ভাৰত স্বাস্থ্য একাউণ্টৰ সৈতে সংযুক্ত কৰিব পাৰি।" },
      { heading: "তথ্য সংৰক্ষণ", text: "ক্লিনিকেল সাৰাংশ দাখিল কৰাৰ পিছত অস্থায়ী ছেচন তথ্য স্থায়ীভাৱে মচি পেলোৱা হ'ব।" },
      { heading: "মোৰ অধিকাৰ", text: "মই যিকোনো সময়ত এই সম্মতি প্ৰত্যাহাৰ কৰিব পাৰো বুলি মই বুজিছো।" },
    ],
    consentStatement: "ওপৰৰ কথা পঢ়ি বুজিছো। মই স্বেচ্ছায় ওপৰত বৰ্ণিত অনুযায়ী মোৰ স্বাস্থ্য তথ্যৰ সংগ্ৰহ আৰু প্ৰক্ৰিয়াৰ বাবে সম্মতি দিছো।",
  },
  ur: {
    title: "ڈیجیٹل کلینیکل ہسٹری کیپچر کے لیے معلوماتی اتفاق",
    sections: [
      { heading: "ڈیٹا جمع", text: "میں سمجھتا ہوں کہ MediKiosk کلینیکل ہسٹری انٹرویو کے دوران میری آواز ریکارڈ کرے گا، طبی سوالات کے میرے جوابات حاصل کرے گا۔" },
      { heading: "AI پروسیسنگ", text: "کلینیکل خلاصہ بنانے کے لیے AI نظاموں سے میری آواز ریکارڈنگز اور دستاویزات پروسیس کی جائیں گی۔" },
      { heading: "ABDM انٹیگریشن", text: "اگر میں اپنا ABHA ID فراہم کروں تو کلینیکل خلاصہ میرے آیوشمان بھارت ہیلتھ اکاؤنٹ سے جڑا جا سکتا ہے۔" },
      { heading: "ڈیٹا ریٹینشن", text: "کلینیکل خلاصہ جمع ہونے کے بعد عارضی سیشن ڈیٹا مستقل طور پر حذف کر دیا جائے گا۔" },
      { heading: "میرے حقوق", text: "میں سمجھتا ہوں کہ میں کسی بھی وقت یہ اتفاق واپس لے سکتا ہوں۔" },
    ],
    consentStatement: "اوپر پڑھ کر سمجھ گیا ہوں۔ میں خود میل سے اوپر بیان کردہ طور پر اپنی صحت معلومات کے جمع کرنے اور پروسیسنگ کے لیے اتفاق دیتا ہوں۔",
  },
  sa: {
    title: "डिजिटल् क्लिनिकल् इतिहास-ग्रहणस्य ज्ञानपूर्वक सम्मतिः",
    sections: [
      { heading: "दत्तांश-सङ्ग्रहः", text: "अहं समजे यत् MediKiosk क्लिनिकल् इतिहास-संवादे मम ध्वनिं रेकर्ड् करिष्यति।" },
      { heading: "AI प्रक्रिया", text: "क्लिनिकल् सारांशं निर्मातुं AI प्रणालिभिः मम ध्वनि-रेकर्डिंग् च दस्तावेशाः प्रक्रिया करिष्यन्ते।" },
      { heading: "ABDM एकीकरणम्", text: "अहं मम ABHA ID प्रददामि चेत् क्लिनिकल् सारांशः मम आयुष्मान् भारत् स्वास्थ्य-खात्ना सह योज्यते।" },
      { heading: "दत्तांश-धारणम्", text: "क्लिनिकल् सारांशं प्रस्तुते अनन्तरं तात्कालिकं सत्र-दत्तांशः स्थायीं प्राच्येष्यते।" },
      { heading: "मम अधिकाराः", text: "अहं कदाचित् अपि इमां सम्मतिं प्रत्याहरितुं शक्नोमि इति अहं समजे।" },
    ],
    consentStatement: "उपरि लिखितं पठित्वा अवगच्छत्। अहं स्वैच्छिकं उपरि वर्णितानुसारं मम स्वास्थ्यसूचनायाः सङ्ग्रहे प्रक्रियायां च सम्मतिं ददामि।",
  },
  ne: {
    title: "डिजिटल क्लिनिकल इतिहास क्याप्चरको लागि सचेत सहमति",
    sections: [
      { heading: "डेटा सङ्कलन", text: "म बुझ्छु कि MediKiosk क्लिनिकल इतिहास संवादको क्रममा मेरो आवाज रेकर्ड गर्छ, चिकित्सा प्रश्नहरूको मेरो उत्तर क्याप्चर गर्छ।" },
      { heading: "AI प्रशोधन", text: "क्लिनिकल सारांश बनाउन AI प्रणालीहरूद्वारा मेरो आवाज रेकर्डिङ र कागजातहरू प्रशोधन गरिन्छ।" },
      { heading: "ABDM एकीकरण", text: "मैले मेरो ABHA ID दिए भने क्लिनिकल सारांश मेरो आयुष्मान भारत स्वास्थ्य खातासँग जोड्न सकिन्छ।" },
      { heading: "डेटा संरक्षण", text: "क्लिनिकल सारांश पेश भएपछि अस्थायी सेशन डेटा स्थायी रूपमा मेटाइन्छ।" },
      { heading: "मेरा अधिकारहरू", text: "म कुनै पनि बेला यो सहमति फिर्ता लिन सक्छु भन्ने म बुझ्छु।" },
    ],
    consentStatement: "माथिका पढेर बुझें। म आफैले माथि वर्णित अनुसार मेरो स्वास्थ्य सूचनाको सङ्कलन र प्रशोधनको लागि सहमति दिन्छु।",
  },
};

// Get consent text in different languages
router.get("/consent/text/:language", (req, res) => {
  const lang = String(req.params.language) || "en";
  res.json(consentTexts[lang] || consentTexts["en"]);
});

export default router;
