/**
 * MediKiosk Internationalization (i18n)
 * Translations for the clinical intake UI across Indian languages
 */

export type SupportedLanguage = "en" | "hi" | "ta" | "te" | "bn" | "mr" | "gu" | "kn" | "ml" | "pa";

export interface TranslationSet {
  // Hub page
  heroTitle1: string;
  heroTitle2: string;
  heroSubtitle: string;
  statIntake: string;
  statVoice: string;
  statPhysician: string;
  journeyTitle: string;
  selectLanguage: string;
  selectLanguageHint: string;
  intakeMode: string;
  intakeModeHint: string;
  allopathicMode: string;
  allopathicDesc: string;
  ayushMode: string;
  ayushDesc: string;
  abhaId: string;
  abhaHint: string;
  abhaPlaceholder: string;
  validate: string;
  abhaValid: string;
  abhaInvalid: string;
  registerNew: string;
  privacyConsent: string;
  consentHint: string;
  consentText: string;
  consentVoice: string;
  consentOCR: string;
  consentSummary: string;
  consentPrivacy: string;
  consentCheckbox: string;
  beginHistory: string;
  adaptiveInterview: string;
  adaptiveDesc: string;
  voiceTouch: string;
  voiceTouchDesc: string;
  physicianReady: string;
  physicianReadyDesc: string;

  // Intake page
  backToHub: string;
  progress: string;
  redFlagAlert: string;
  redFlagDesc: string;
  whatBringsYou: string;
  selectSymptom: string;
  symptomDetails: string;
  ayushAssessment: string;
  generalHistory: string;
  questionOf: string;
  typeOrVoice: string;
  voiceInput: string;
  recording: string;
  tapToStop: string;
  transcribing: string;
  tapMic: string;
  submitAnswer: string;
  nextSection: string;
  previous: string;
  mild: string;
  severe: string;
  severity: string;
  typeAnswer: string;
  reviewAnswers: string;
  reviewSubtitle: string;
  chiefComplaint: string;
  completenessScore: string;
  generateSummary: string;
  generatingSummary: string;
  considerMoreDetails: string;

  // Chief complaint options
  chestPain: string;
  breathlessness: string;
  headache: string;
  abdominalPain: string;
  jointPain: string;
  fever: string;
  fatigue: string;
  cough: string;
  dizziness: string;
  skinIssues: string;
  moodChanges: string;
  digestiveIssues: string;
  other: string;

  // SOCRATES
  onset: string;
  character: string;
  radiation: string;
  associated: string;
  timing: string;
  exacerbating: string;
  relieving: string;
  severityScale: string;

  // General history
  pastMedical: string;
  pastSurgical: string;
  currentMeds: string;
  allergies: string;
  familyHistory: string;
  smoking: string;
  alcohol: string;
  occupation: string;

  // Scan page
  scanTitle: string;
  scanSubtitle: string;
  dropzone: string;
  dropzoneHint: string;
  chooseFiles: string;
  ocrExtract: string;
  processed: string;
  processing: string;
  uploadedDocuments: string;
  skipToSummary: string;
  generateClinicalSummary: string;

  // Summary page
  physicianReadySummary: string;
  generatedFor: string;
  completeness: string;
  chiefComplaintLabel: string;
  redFlagsDetected: string;
  hpi: string;
  pastMedicalLabel: string;
  currentMedications: string;
  allergyLabel: string;
  familyHistoryLabel: string;
  personalHistory: string;
  priorInvestigations: string;
  aiSummary: string;
  aiDisclaimer: string;
  printSummary: string;
  sendToPhysician: string;
  physicianNotified: string;
  intakeComplete: string;
  intakeCompleteDesc: string;
  returnToDashboard: string;

  // Phase labels
  phaseChiefComplaint: string;
  phaseSymptomDetails: string;
  phaseAyushAssessment: string;
  phaseGeneralHistory: string;
  phaseReview: string;

  // Consent list items
  consentByProceeding: string;
  consentListVoice: string;
  consentListOCR: string;
  consentListSummary: string;
  consentListPrivacy: string;

  // Consents
  consentDPDP: string;

  // App Shell — Sidebar
  navDashboard: string;
  navMediKiosk: string;
  navAyurVoxara: string;
  navRecordLive: string;
  navHistory: string;
  navTrends: string;
  navAIAnalysis: string;
  navMLInsights: string;
  navAppointments: string;
  navSOS: string;
  navIntakeReview: string;
  navAYUSHDashboard: string;
  navLiveAlerts: string;
  navMedication: string;
  switchToAYUSH: string;
  switchToAllopathic: string;
  newLiveSample: string;
  signOut: string;
  realtimeActive: string;

  // App Shell — Dashboard
  dashWelcome: string;
  dashSubtitle: string;
  dashRecentSessions: string;
  dashHealthScore: string;
  dashVoiceClarity: string;
  dashLastSession: string;
  dashNoSessions: string;
  dashRecordFirst: string;
  dashViewAll: string;
  dashTodaysMedications: string;
  dashUpcomingAppts: string;
  dashNoAppts: string;

  // App Shell — Chatbot
  chatHealthBot: string;
  chatAyurBot: string;
  chatGeneralHealth: string;
  chatSymptomChecker: string;
  chatHealthInfo: string;
  chatLearnAyurveda: string;
  chatAssessment: string;
  chatPractitioner: string;
  chatThinking: string;
  chatPlaceholderHealth: string;
  chatPlaceholderAyush: string;
  chatMute: string;
  chatReadAloud: string;

  // App Shell — Common
  langEnglish: string;
  langHindi: string;
  langTamil: string;
  langTelugu: string;
  langBengali: string;
  langMarathi: string;
  langGujarati: string;
  langKannada: string;
  langMalayalam: string;
  langPunjabi: string;
}

const translations: Record<SupportedLanguage, TranslationSet> = {
  en: {
    heroTitle1: "AI-Powered Clinical",
    heroTitle2: "History Taking",
    heroSubtitle: "Complete your medical history in under 5 minutes through voice conversation and guided touchscreen — before you enter the consultation room.",
    statIntake: "Complete intake",
    statVoice: "Dual-mode input",
    statPhysician: "Structured summary",
    journeyTitle: "Patient Journey",
    selectLanguage: "Select Language",
    selectLanguageHint: "Choose your preferred language for the interview",
    intakeMode: "Intake Mode",
    intakeModeHint: "Select clinical history framework",
    allopathicMode: "Allopathic History",
    allopathicDesc: "Standard clinical history using SOCRATES framework — Chief Complaint, HPI, Past Medical/Surgical, Drug & Allergy, Family, Personal, Review of Systems.",
    ayushMode: "AYUSH History (Ayurvedic)",
    ayushDesc: "Extended Ayurvedic intake capturing Dashavidha Pariksha — Prakriti, Vikriti, Agni, Koshtha, Ahara-Vihara, Sattva, and Samprapti assessment.",
    abhaId: "ABHA ID (Optional)",
    abhaHint: "Link to your Ayushman Bharat Health Account",
    abhaPlaceholder: "Enter 14-digit ABHA ID",
    validate: "Validate",
    abhaValid: "ABHA ID verified successfully",
    abhaInvalid: "Could not validate. You can continue without ABHA.",
    registerNew: "Register as New Patient",
    privacyConsent: "Privacy & Consent",
    consentHint: "Required under DPDP Act 2023",
    consentText: "By proceeding, you consent to the following:",
    consentVoice: "Voice recording and AI transcription for clinical history taking",
    consentOCR: "OCR processing of uploaded medical documents",
    consentSummary: "Structured clinical history generation and sharing with your physician",
    consentPrivacy: "Secure storage in compliance with DPDP Act 2023 and ABDM consent framework",
    consentCheckbox: "I understand and provide my consent",
    beginHistory: "Begin Clinical History",
    adaptiveInterview: "Adaptive Interview",
    adaptiveDesc: "AI asks intelligent follow-up questions based on SOCRATES clinical framework — adapting to your specific symptoms.",
    voiceTouch: "Voice + Touch",
    voiceTouchDesc: "Answer by speaking in your preferred language or tapping multiple-choice options. Usable by first-time patients.",
    physicianReady: "Physician-Ready",
    physicianReadyDesc: "Get a structured clinical summary pushed to your physician before consultation — saving precious OPD time.",

    backToHub: "Back to MediKiosk",
    progress: "Progress",
    redFlagAlert: "Red Flag Alert",
    redFlagDesc: "Priority alert sent to triage staff. Your symptoms require urgent attention.",
    whatBringsYou: "What brings you in today?",
    selectSymptom: "Select your main symptom or complaint",
    symptomDetails: "Symptom Details",
    ayushAssessment: "AYUSH Assessment",
    generalHistory: "General History",
    questionOf: "Question",
    typeOrVoice: "Type your answer or use voice input",
    voiceInput: "Voice Input",
    recording: "Recording... tap to stop",
    tapToStop: "tap to stop",
    transcribing: "Transcribing...",
    tapMic: "Tap the mic to record your answer in your own words",
    submitAnswer: "Submit Answer",
    nextSection: "Next Section",
    previous: "Previous",
    mild: "Mild",
    severe: "Severe",
    severity: "Severity",
    typeAnswer: "Type your answer here...",
    reviewAnswers: "Review Your Answers",
    reviewSubtitle: "Review the history before generating your clinical summary",
    chiefComplaintLabel: "Chief Complaint",
    completenessScore: "Completeness Score",
    generateSummary: "Generate Clinical Summary",
    generatingSummary: "Generating Summary...",
    considerMoreDetails: "Consider going back and providing more details for a more complete history.",

    chestPain: "Chest Pain",
    breathlessness: "Breathlessness",
    headache: "Headache",
    abdominalPain: "Abdominal Pain",
    jointPain: "Joint Pain",
    fever: "Fever",
    fatigue: "Fatigue",
    cough: "Cough",
    dizziness: "Dizziness",
    skinIssues: "Skin Issues",
    moodChanges: "Mood Changes",
    digestiveIssues: "Digestive Issues",
    other: "Other",

    onset: "Onset",
    character: "Character",
    radiation: "Radiation",
    associated: "Associated symptoms",
    timing: "Timing",
    exacerbating: "Exacerbating factors",
    relieving: "Relieving factors",
    severityScale: "Severity",

    pastMedical: "Past Medical History",
    pastSurgical: "Past Surgical History",
    currentMeds: "Current Medications",
    allergies: "Allergies",
    familyHistory: "Family History",
    smoking: "Smoking",
    alcohol: "Alcohol",
    occupation: "Occupation",

    scanTitle: "Scan Medical Documents",
    scanSubtitle: "Upload prescriptions, lab reports, discharge summaries, or other medical records",
    dropzone: "Drop documents here or tap to browse",
    dropzoneHint: "Supports images (JPG, PNG) and PDFs — prescriptions, lab reports, discharge summaries",
    chooseFiles: "Choose Files",
    ocrExtract: "OCR Extract",
    processed: "Processed",
    processing: "Processing",
    uploadedDocuments: "Uploaded Documents",
    skipToSummary: "Skip — Generate Summary",
    generateClinicalSummary: "Generate Clinical Summary",

    physicianReadySummary: "Physician-Ready Summary",
    generatedFor: "Generated for",
    completeness: "Completeness",
    redFlagsDetected: "Red Flags Detected",
    hpi: "History of Present Illness",
    pastMedicalLabel: "Past Medical History",
    currentMedications: "Current Medications",
    allergyLabel: "Allergy History",
    familyHistoryLabel: "Family History",
    personalHistory: "Personal History",
    priorInvestigations: "Prior Investigations",
    aiSummary: "AI-Generated Clinical Summary",
    aiDisclaimer: "This summary is AI-generated and intended as a clinical aid. The physician retains full control to accept, amend, or reject.",
    printSummary: "Print Summary",
    sendToPhysician: "Send to Physician",
    physicianNotified: "Physician Notified ✓",
    intakeComplete: "Clinical Intake Complete!",
    intakeCompleteDesc: "Your structured clinical history has been generated and sent to your physician. You can now proceed to your consultation.",
    returnToDashboard: "Return to Dashboard",

    consentDPDP: "consent under DPDP Act 2023",

    phaseChiefComplaint: "Chief Complaint",
    phaseSymptomDetails: "Symptom Details",
    phaseAyushAssessment: "AYUSH Assessment",
    phaseGeneralHistory: "General History",
    phaseReview: "Review",

    consentByProceeding: "By proceeding, you consent to the following:",
    consentListVoice: "Voice recording and AI transcription for clinical history taking",
    consentListOCR: "OCR processing of uploaded medical documents",
    consentListSummary: "Structured clinical history generation and sharing with your physician",
    consentListPrivacy: "Secure storage in compliance with DPDP Act 2023 and ABDM consent framework",

    // App Shell — Sidebar
    navDashboard: "Dashboard",
    navMediKiosk: "MediKiosk Intake",
    navAyurVoxara: "AyurVoxara",
    navRecordLive: "Record Live",
    navHistory: "History",
    navTrends: "Trends",
    navAIAnalysis: "AI Analysis",
    navMLInsights: "ML Insights",
    navAppointments: "Appointments",
    navSOS: "🚨 SOS Emergency",
    navIntakeReview: "Intake Reviews",
    navAYUSHDashboard: "🌿 AYUSH Dashboard",
    navLiveAlerts: "Live Alerts",
    navMedication: "Medication Flow",
    switchToAYUSH: "Switch to AYUSH",
    switchToAllopathic: "Switch to Allopathic",
    newLiveSample: "New Live Sample",
    signOut: "Sign Out",
    realtimeActive: "Realtime Active",

    // App Shell — Dashboard
    dashWelcome: "Welcome back",
    dashSubtitle: "Your health overview at a glance",
    dashRecentSessions: "Recent Sessions",
    dashHealthScore: "Health Score",
    dashVoiceClarity: "Voice Clarity",
    dashLastSession: "Last Session",
    dashNoSessions: "No sessions recorded yet",
    dashRecordFirst: "Record your first voice sample to get started",
    dashViewAll: "View All",
    dashTodaysMedications: "Today's Medications",
    dashUpcomingAppts: "Upcoming Appointments",
    dashNoAppts: "No upcoming appointments",

    // App Shell — Chatbot
    chatHealthBot: "HealthBot",
    chatAyurBot: "AyurBot",
    chatGeneralHealth: "General Health",
    chatSymptomChecker: "Symptom Checker",
    chatHealthInfo: "Health Info",
    chatLearnAyurveda: "Learn Ayurveda",
    chatAssessment: "Assessment",
    chatPractitioner: "Practitioner",
    chatThinking: "Thinking...",
    chatPlaceholderHealth: "Ask about your health...",
    chatPlaceholderAyush: "Ask about Ayurveda...",
    chatMute: "Mute",
    chatReadAloud: "Read aloud",

    // App Shell — Common
    langEnglish: "English",
    langHindi: "हिन्दी",
    langTamil: "தமிழ்",
    langTelugu: "తెలుగు",
    langBengali: "বাংলা",
    langMarathi: "मराठी",
    langGujarati: "ગુજરાતી",
    langKannada: "ಕನ್ನಡ",
    langMalayalam: "മലയാളം",
    langPunjabi: "ਪੰਜਾਬੀ",
  },

  hi: {
    heroTitle1: "AI-संचालित नैदानिक",
    heroTitle2: "इतिहास लेना",
    heroSubtitle: "परामर्श कक्ष में प्रवेश करने से पहले, आवाज़ की बातचीत और गाइडेड टचस्क्रीन के माध्यम से 5 मिनट से कम समय में अपना चिकित्सा इतिहास पूरा करें।",
    statIntake: "पूर्ण इनटेक",
    statVoice: "डुअल-मोड इनपुट",
    statPhysician: "संरचित सारांश",
    journeyTitle: "रोगी यात्रा",
    selectLanguage: "भाषा चुनें",
    selectLanguageHint: "साक्षात्कार के लिए अपनी पसंदीदा भाषा चुनें",
    intakeMode: "इनटेक मोड",
    intakeModeHint: "नैदानिक इतिहास ढांचा चुनें",
    allopathicMode: "एलोपैथिक इतिहास",
    allopathicDesc: "SOCRATES ढांचे का उपयोग करके मानक नैदानिक इतिहास — मुख्य शिकायत, HPI, अतीत चिकित्सा/सर्जिकल, दवा और एलर्जी, पारिवारिक, व्यक्तिगत, सिस्टम की समीक्षा।",
    ayushMode: "आयुष इतिहास (आयुर्वेदिक)",
    ayushDesc: "दशविधा परीक्षा को कैप्चर करने वाला विस्तृत आयुर्वेदिक इनटेक — प्रकृति, विकृति, अग्नि, कोष्ठ, आहार-विहार, सत्व, और सम्प्राप्ति मूल्यांकन।",
    abhaId: "ABHA ID (वैकल्पिक)",
    abhaHint: "अपने आयुष्मान भारत स्वास्थ्य खाते से लिंक करें",
    abhaPlaceholder: "14 अंकों की ABHA ID दर्ज करें",
    validate: "सत्यापित करें",
    abhaValid: "ABHA ID सफलतापूर्वक सत्यापित",
    abhaInvalid: "सत्यापित नहीं हो सका। आप ABHA के बिना जारी रख सकते हैं।",
    registerNew: "नए रोगी के रूप में पंजीकरण करें",
    privacyConsent: "गोपनीयता और सहमति",
    consentHint: "DPDP अधिनियम 2023 के तहत आवश्यक",
    consentText: "आगे बढ़कर, आप निम्नलिखित के लिए सहमति देते हैं:",
    consentVoice: "नैदानिक इतिहास लेने के लिए आवाज़ रिकॉर्डिंग और AI ट्रांसक्रिप्शन",
    consentOCR: "अपलोड किए गए चिकित्सा दस्तावेज़ों की OCR प्रसंस्करण",
    consentSummary: "संरचित नैदानिक इतिहास जनरेशन और आपके चिकित्सक के साथ साझाकरण",
    consentPrivacy: "DPDP अधिनियम 2023 और ABDM सहमति ढांचे के अनुरूप सुरक्षित भंडारण",
    consentCheckbox: "मैं समझता हूं और अपनी सहमति देता हूं",
    beginHistory: "नैदानिक इतिहास शुरू करें",
    adaptiveInterview: "अनुकूली साक्षात्कार",
    adaptiveDesc: "AI SOCRATES नैदानिक ढांचे के आधार पर बुद्धिमान अनुवर्ती प्रश्न पूछता है — आपके विशिष्ट लक्षणों के अनुसार अनुकूलन।",
    voiceTouch: "आवाज़ + टच",
    voiceTouchDesc: "अपनी पसंदीदा भाषा में बोलकर या मल्टी-चॉइस विकल्पों पर टैप करके उत्तर दें। पहली बार के रोगियों के लिए उपयोगी।",
    physicianReady: "चिकित्सक-तैयार",
    physicianReadyDesc: "परामर्श से पहले अपने चिकित्सक को संरचित नैदानिक सारांश प्राप्त करें — बहुमूल्य OPD समय बचाएं।",

    backToHub: "MediKiosk पर वापस",
    progress: "प्रगति",
    redFlagAlert: "रेड फ्लैग अलर्ट",
    redFlagDesc: "ट्राइएज स्टाफ को प्राथमिकता अलर्ट भेजा गया। आपके लक्षणों को तत्काल ध्यान देने की आवश्यकता है।",
    whatBringsYou: "आज आप किस लिए आए हैं?",
    selectSymptom: "अपना मुख्य लक्षण या शिकायत चुनें",
    symptomDetails: "लक्षण विवरण",
    ayushAssessment: "आयुष मूल्यांकन",
    generalHistory: "सामान्य इतिहास",
    questionOf: "प्रश्न",
    typeOrVoice: "अपना उत्तर टाइप करें या आवाज़ इनपुट का उपयोग करें",
    voiceInput: "आवाज़ इनपुट",
    recording: "रिकॉर्डिंग... रोकने के लिए टैप करें",
    tapToStop: "रोकने के लिए टैप करें",
    transcribing: "ट्रांसक्राइबिंग...",
    tapMic: "अपने शब्दों में उत्तर रिकॉर्ड करने के लिए माइक पर टैप करें",
    submitAnswer: "उत्तर सबमिट करें",
    nextSection: "अगला अनुभाग",
    previous: "पिछला",
    mild: "हल्का",
    severe: "गंभीर",
    severity: "गंभीरता",
    typeAnswer: "यहाँ अपना उत्तर टाइप करें...",
    reviewAnswers: "अपने उत्तरों की समीक्षा करें",
    reviewSubtitle: "अपना नैदानिक सारांश बनाने से पहले इतिहास की समीक्षा करें",
    chiefComplaintLabel: "मुख्य शिकायत",
    completenessScore: "पूर्णता स्कोर",
    generateSummary: "नैदानिक सारांश बनाएं",
    generatingSummary: "सारांश बना रहे हैं...",
    considerMoreDetails: "अधिक पूर्ण इतिहास के लिए वापस जाकर अधिक विवरण देने पर विचार करें।",

    chestPain: "छाती में दर्द",
    breathlessness: "सांस फूलना",
    headache: "सिरदर्द",
    abdominalPain: "पेट में दर्द",
    jointPain: "जोड़ों में दर्द",
    fever: "बुखार",
    fatigue: "थकान",
    cough: "खांसी",
    dizziness: "चक्कर आना",
    skinIssues: "त्वचा संबंधी समस्याएं",
    moodChanges: "मूड में बदलाव",
    digestiveIssues: "पाचन संबंधी समस्याएं",
    other: "अन्य",

    onset: "शुरुआत",
    character: "प्रकृति",
    radiation: "फैलाव",
    associated: "संबंधित लक्षण",
    timing: "समय",
    exacerbating: "बिगाड़ने वाले कारक",
    relieving: "राहत देने वाले कारक",
    severityScale: "गंभीरता",

    pastMedical: "अतीत चिकित्सा इतिहास",
    pastSurgical: "अतीत सर्जिकल इतिहास",
    currentMeds: "वर्तमान दवाएं",
    allergies: "एलर्जी",
    familyHistory: "पारिवारिक इतिहास",
    smoking: "धूम्रपान",
    alcohol: "शराब",
    occupation: "व्यवसाय",

    scanTitle: "चिकित्सा दस्तावेज़ स्कैन करें",
    scanSubtitle: "प्रिस्क्रिप्शन, लैब रिपोर्ट, डिस्चार्ज सारांश, या अन्य चिकित्सा रिकॉर्ड अपलोड करें",
    dropzone: "दस्तावेज़ यहाँ छोड़ें या ब्राउज़ करने के लिए टैप करें",
    dropzoneHint: "इमेज (JPG, PNG) और PDF समर्थित — प्रिस्क्रिप्शन, लैब रिपोर्ट, डिस्चार्ज सारांश",
    chooseFiles: "फ़ाइलें चुनें",
    ocrExtract: "OCR एक्सट्रैक्ट",
    processed: "प्रोसेस्ड",
    processing: "प्रोसेसिंग",
    uploadedDocuments: "अपलोड किए गए दस्तावेज़",
    skipToSummary: "छोड़ें — सारांश बनाएं",
    generateClinicalSummary: "नैदानिक सारांश बनाएं",

    physicianReadySummary: "चिकित्सक-तैयार सारांश",
    generatedFor: "के लिए बनाया गया",
    completeness: "पूर्णता",    redFlagsDetected: "रेड फ्लैग का पता चला",
    hpi: "वर्तमान बीमारी का इतिहास",
    pastMedicalLabel: "अतीत चिकित्सा इतिहास",
    currentMedications: "वर्तमान दवाएं",
    allergyLabel: "एलर्जी इतिहास",
    familyHistoryLabel: "पारिवारिक इतिहास",
    personalHistory: "व्यक्तिगत इतिहास",
    priorInvestigations: "पिछली जांचें",
    aiSummary: "AI-जनित नैदानिक सारांश",


    aiDisclaimer: "यह सारांश AI-जनित है और एक नैदानिक सहायक के रूप में अभिप्रेत है। चिकित्सक को स्वीकार, संशोधित या अस्वीकार करने का पूर्ण नियंत्रण है।",
    printSummary: "सारांश प्रिंट करें",
    sendToPhysician: "चिकित्सक को भेजें",
    physicianNotified: "चिकित्सक को सूचित किया गया ✓",
    intakeComplete: "नैदानिक इनटेक पूर्ण!",
    intakeCompleteDesc: "आपका संरचित नैदानिक इतिहास बनाया गया है और आपके चिकित्सक को भेजा गया है। अब आप अपने परामर्श के लिए आगे बढ़ सकते हैं।",
    returnToDashboard: "डैशबोर्ड पर वापस जाएं",

    consentDPDP: "DPDP अधिनियम 2023 के तहत सहमति",

    phaseChiefComplaint: "मुख्य शिकायत",
    phaseSymptomDetails: "लक्षण विवरण",
    phaseAyushAssessment: "आयुष मूल्यांकन",
    phaseGeneralHistory: "सामान्य इतिहास",
    phaseReview: "समीक्षा",

    consentByProceeding: "आगे बढ़कर, आप निम्नलिखित के लिए सहमति देते हैं:",
    consentListVoice: "नैदानिक इतिहास लेने के लिए आवाज़ रिकॉर्डिंग और AI ट्रांसक्रिप्शन",
    consentListOCR: "अपलोड किए गए चिकित्सा दस्तावेज़ों की OCR प्रसंस्करण",
    consentListSummary: "संरचित नैदानिक इतिहास जनरेशन और आपके चिकित्सक के साथ साझाकरण",
    consentListPrivacy: "DPDP अधिनियम 2023 और ABDM सहमति ढांचे के अनुरूप सुरक्षित भंडारण",

    // App Shell — Sidebar
    navDashboard: "डैशबोर्ड",
    navMediKiosk: "MediKiosk इनटेक",
    navAyurVoxara: "आयुर्वोक्सारा",
    navRecordLive: "लाइव रिकॉर्ड करें",
    navHistory: "इतिहास",
    navTrends: "ट्रेंड्स",
    navAIAnalysis: "AI विश्लेषण",
    navMLInsights: "ML अंतर्दृष्टि",
    navAppointments: "अपॉइंटमेंट",
    navSOS: "🚨 SOS आपातकाल",
    navIntakeReview: "इनटेक समीक्षा",
    navAYUSHDashboard: "🌿 AYUSH डैशबोर्ड",
    navLiveAlerts: "लाइव अलर्ट",
    navMedication: "दवा प्रवाह",
    switchToAYUSH: "AYUSH पर स्विच करें",
    switchToAllopathic: "एलोपैथिक पर स्विच करें",
    newLiveSample: "नया लाइव सैंपल",
    signOut: "साइन आउट",
    realtimeActive: "रियलटाइम सक्रिय",

    // App Shell — Dashboard
    dashWelcome: "वापसी पर स्वागत है",
    dashSubtitle: "आपका स्वास्थ्य अवलोकन एक नज़र में",
    dashRecentSessions: "हाल के सत्र",
    dashHealthScore: "स्वास्थ्य स्कोर",
    dashVoiceClarity: "आवाज़ स्पष्टता",
    dashLastSession: "अंतिम सत्र",
    dashNoSessions: "अभी तक कोई सत्र दर्ज नहीं",
    dashRecordFirst: "शुरू करने के लिए अपना पहला वॉइस सैंपल रिकॉर्ड करें",
    dashViewAll: "सभी देखें",
    dashTodaysMedications: "आज की दवाएं",
    dashUpcomingAppts: "आगामी अपॉइंटमेंट",
    dashNoAppts: "कोई आगामी अपॉइंटमेंट नहीं",

    // App Shell — Chatbot
    chatHealthBot: "हेल्थबॉट",
    chatAyurBot: "आयुरबॉट",
    chatGeneralHealth: "सामान्य स्वास्थ्य",
    chatSymptomChecker: "लक्षण जांचकर्ता",
    chatHealthInfo: "स्वास्थ्य जानकारी",
    chatLearnAyurveda: "आयुर्वेद सीखें",
    chatAssessment: "मूल्यांकन",
    chatPractitioner: "चिकित्सक",
    chatThinking: "सोच रहा हूं...",
    chatPlaceholderHealth: "अपने स्वास्थ्य के बारे में पूछें...",
    chatPlaceholderAyush: "आयुर्वेद के बारे में पूछें...",
    chatMute: "म्यूट",
    chatReadAloud: "ज़ोर से पढ़ें",

    // App Shell — Common
    langEnglish: "English",
    langHindi: "हिन्दी",
    langTamil: "தமிழ்",
    langTelugu: "తెలుగు",
    langBengali: "বাংলা",
    langMarathi: "मराठी",
    langGujarati: "ગુજરાતી",
    langKannada: "ಕನ್ನಡ",
    langMalayalam: "മലയാളം",
    langPunjabi: "ਪੰਜਾਬੀ",
  },

  ta: {
    heroTitle1: "AI-இயங்கும் மருத்துவ",
    heroTitle2: "வரலாறு எடுத்தல்",
    heroSubtitle: "ஆலோசனை அறையில் நுழைவதற்கு முன், குரல் உரையாடல் மற்றும் வழிகாட்டப்பட்ட தொடுதிரை மூலம் 5 நிமிடங்களுக்கும் குறைவாக உங்கள் மருத்துவ வரலாற்றை நிறைவு செய்யுங்கள்.",
    statIntake: "முழுமையான உட்கொள்ளல்",
    statVoice: "இரட்டை முறை உள்ளீடு",
    statPhysician: "கட்டமைக்கப்பட்ட சுருக்கம்",
    journeyTitle: "நோயாளி பயணம்",
    selectLanguage: "மொழியைத் தேர்ந்தெடுக்கவும்",
    selectLanguageHint: "நேர்காணலுக்கு உங்கள் விருப்பமான மொழியைத் தேர்ந்தெடுக்கவும்",
    intakeMode: "உட்கொள்ளல் முறை",
    intakeModeHint: "மருத்துவ வரலாற்று கட்டமைப்பைத் தேர்ந்தெடுக்கவும்",
    allopathicMode: "நவீன மருத்துவ வரலாறு",
    allopathicDesc: "SOCRATES கட்டமைப்பைப் பயன்படுத்தி நிலையான மருத்துவ வரலாறு.",
    ayushMode: "ஆயுஷ் வரலாறு (ஆயுர்வேதம்)",
    ayushDesc: "தசவித பரீட்சையை உள்ளடக்கிய விரிவான ஆயுர்வேத உட்கொள்ளல்.",
    abhaId: "ABHA ID (விருப்பத்திற்கு)",
    abhaHint: "உங்கள் ஆயுஷ்மான் பாரத் சுகாதார கணக்குடன் இணைக்கவும்",
    abhaPlaceholder: "14 இலக்க ABHA ID உள்ளிடவும்",
    validate: "சரிபார்க்கவும்",
    abhaValid: "ABHA ID வெற்றிகரமாக சரிபார்க்கப்பட்டது",
    abhaInvalid: "சரிபார்க்க இயலவில்லை. ABHA இல்லாமல் தொடரலாம்.",
    registerNew: "புதிய நோயாளியாக பதிவு செய்யுங்கள்",
    privacyConsent: "தனியுரிமை மற்றும் சம்மதம்",
    consentHint: "DPDP சட்டம் 2023 கீழ் தேவை",
    consentText: "தொடர்வதன் மூலம், நீங்கள் பின்வருவனவற்றுக்கு சம்மதிக்கிறீர்கள்:",
    consentVoice: "மருத்துவ வரலாறு எடுப்பதற்கான குரல் பதிவு மற்றும் AI எழுத்துப்பெயர்ப்பு",
    consentOCR: "பதிவேற்றப்பட்ட மருத்துவ ஆவணங்களின் OCR செயலாக்கம்",
    consentSummary: "கட்டமைக்கப்பட்ட மருத்துவ வரலாறு உருவாக்கம் மற்றும் உங்கள் மருத்துவருடன் பகிர்வு",
    consentPrivacy: "DPDP சட்டம் 2023 மற்றும் ABDM சம்மத கட்டமைப்புடன் இணங்க பாதுகாப்பான சேமிப்பு",
    consentCheckbox: "நான் புரிந்துகொள்கிறேன், என் சம்மதத்தை வழங்குகிறேன்",
    beginHistory: "மருத்துவ வரலாற்றைத் தொடங்குங்கள்",
    adaptiveInterview: "தகவமைந்த நேர்காணல்",
    adaptiveDesc: "AI SOCRATES மருத்துவ கட்டமைப்பின் அடிப்படையில் புத்திசாலி தொடர்ச்சியான கேள்விகளைக் கேட்கிறது.",
    voiceTouch: "குரல் + தொடுதிரை",
    voiceTouchDesc: "உங்கள் விருப்பமான மொழியில் பேசுவதன் மூலம் அல்லது பல தேர்வு விருப்பங்களைத் தட்டுவதன் மூலம் பதிலளிக்கவும்.",
    physicianReady: "மருத்துவர்-தயார்",
    physicianReadyDesc: "ஆலோசனைக்கு முன் கட்டமைக்கப்பட்ட மருத்துவ சுருக்கத்தைப் பெறுங்கள்.",

    backToHub: "MediKiosk க்குத் திரும்பு",
    progress: "முன்னேற்றம்",
    redFlagAlert: "சிவப்பு கொடி எச்சரிக்கை",
    redFlagDesc: "முன்னுரிமை எச்சரிக்கை முகாமைத்துவ ஊழியர்களுக்கு அனுப்பப்பட்டது.",
    whatBringsYou: "இன்று நீங்கள் ஏன் வந்துள்ளீர்கள்?",
    selectSymptom: "உங்கள் முதன்மை அறிகுறி அல்லது புகாரைத் தேர்ந்தெடுக்கவும்",
    symptomDetails: "அறிகுறி விவரங்கள்",
    ayushAssessment: "ஆயுஷ் மதிப்பீடு",
    generalHistory: "பொது வரலாறு",
    questionOf: "கேள்வி",
    typeOrVoice: "உங்கள் பதிலை தட்டச்சு செய்யுங்கள் அல்லது குரல் உள்ளீட்டைப் பயன்படுத்துங்கள்",
    voiceInput: "குரல் உள்ளீடு",
    recording: "பதிவு செய்கிறது... நிறுத்த தட்டவும்",
    tapToStop: "நிறுத்த தட்டவும்",
    transcribing: "எழுத்துப்பெயர்ப்பு...",
    tapMic: "உங்கள் சொற்களில் பதிலைப் பதிவு செய்ய மைக்கைத் தட்டவும்",
    submitAnswer: "பதிலைச் சமர்ப்பிக்கவும்",
    nextSection: "அடுத்த பிரிவு",
    previous: "முந்தைய",
    mild: "லேசான",
    severe: "கடுமை",
    severity: "தீவிரம்",
    typeAnswer: "இங்கே உங்கள் பதிலைத் தட்டச்சு செய்யுங்கள்...",
    reviewAnswers: "உங்கள் பதில்களை மதிப்பாய்வு செய்யுங்கள்",
    reviewSubtitle: "மருத்துவ சுருக்கத்தை உருவாக்குவதற்கு முன் வரலாற்றை மதிப்பாய்வு செய்யுங்கள்",
    chiefComplaintLabel: "முதன்மை புகார்",
    completenessScore: "முழுமை மதிப்பெண்",
    generateSummary: "மருத்துவ சுருக்கத்தை உருவாக்கு",
    generatingSummary: "சுருக்கம் உருவாக்கப்படுகிறது...",
    considerMoreDetails: "மிகவும் முழுமையான வரலாற்றுக்கு கூடுதல் விவரங்களை வழங்க பின்திரும்புவதைக் கருத்தில் கொள்ளுங்கள்.",

    chestPain: "நெஞ்சு வலி",
    breathlessness: "மூச்சுத்திணறல்",
    headache: "தலைவலி",
    abdominalPain: "வயிற்று வலி",
    jointPain: "மூட்டு வலி",
    fever: "காய்ச்சல்",
    fatigue: "சோர்வு",
    cough: "இருமல்",
    dizziness: "தலைச்சுற்றல்",
    skinIssues: "தோல் பிரச்சனைகள்",
    moodChanges: "மனநிலை மாற்றங்கள்",
    digestiveIssues: "செரிமான பிரச்சனைகள்",
    other: "மற்றவை",

    onset: "தொடக்கம்",
    character: "குணம்",
    radiation: "பரவல்",
    associated: "தொடர்புடைய அறிகுறிகள்",
    timing: "நேரம்",
    exacerbating: "மோசமாக்கும் காரணிகள்",
    relieving: "நிவாரணம் அளிக்கும் காரணிகள்",
    severityScale: "தீவிரம்",

    pastMedical: "கடந்த மருத்துவ வரலாறு",
    pastSurgical: "கடந்த அறுவை சிகிச்சை வரலாறு",
    currentMeds: "தற்போதைய மருந்துகள்",
    allergies: "ஒவ்வாமைகள்",
    familyHistory: "குடும்ப வரலாறு",
    smoking: "புகைபிடித்தல்",
    alcohol: "மது",
    occupation: "தொழில்",

    scanTitle: "மருத்துவ ஆவணங்களை ஸ்கேன் செய்யுங்கள்",
    scanSubtitle: "மருந்துச்சீட்டுகள், ஆய்வக அறிக்கைகள், விடுவிப்பு சுருக்கங்கள் அல்லது பிற மருத்துவ ஆவணங்களைப் பதிவேற்றுங்கள்",
    dropzone: "ஆவணங்களை இங்கே விடுங்கள் அல்லது உலாவ தட்டவும்",
    dropzoneHint: "படங்கள் (JPG, PNG) மற்றும் PDF களை ஆதரிக்கிறது",
    chooseFiles: "கோப்புகளைத் தேர்ந்தெடுக்கவும்",
    ocrExtract: "OCR எடுத்தல்",
    processed: "செயலாக்கப்பட்டது",
    processing: "செயலாக்கம்",
    uploadedDocuments: "பதிவேற்றப்பட்ட ஆவணங்கள்",
    skipToSummary: "தவிர் — சுருக்கத்தை உருவாக்கு",
    generateClinicalSummary: "மருத்துவ சுருக்கத்தை உருவாக்கு",

    physicianReadySummary: "மருத்துவர்-தயார் சுருக்கம்",
    generatedFor: "உருவாக்கப்பட்டது",
    completeness: "முழுமை",
    redFlagsDetected: "சிவப்பு கொடிகள் கண்டறியப்பட்டன",
    hpi: "தற்போதைய நோயின் வரலாறு",
    pastMedicalLabel: "கடந்த மருத்துவ வரலாறு",
    currentMedications: "தற்போதைய மருந்துகள்",
    allergyLabel: "ஒவ்வாமை வரலாறு",
    familyHistoryLabel: "குடும்ப வரலாறு",
    personalHistory: "தனிப்பட்ட வரலாறு",
    priorInvestigations: "முந்தைய ஆய்வுகள்",
    aiSummary: "AI-உருவாக்கிய மருத்துவ சுருக்கம்",
    aiDisclaimer: "இந்த சுருக்கம் AI-உருவாக்கியது மற்றும் மருத்துவ உதவியாக நோக்கம் கொண்டது.",
    printSummary: "சுருக்கத்தை அச்சிடு",
    sendToPhysician: "மருத்துவருக்கு அனுப்பு",
    physicianNotified: "மருத்துவருக்கு அறிவிக்கப்பட்டது ✓",
    intakeComplete: "மருத்துவ உட்கொள்ளல் நிறைவு!",
    intakeCompleteDesc: "உங்கள் கட்டமைக்கப்பட்ட மருத்துவ வரலாறு உருவாக்கப்பட்டு மருத்துவருக்கு அனுப்பப்பட்டது.",
    returnToDashboard: "டாஷ்போர்டுக்குத் திரும்பு",

    consentDPDP: "DPDP சட்டம் 2023 கீழ் சம்மதம்",

    phaseChiefComplaint: "முதன்மை புகார்",
    phaseSymptomDetails: "அறிகுறி விவரங்கள்",
    phaseAyushAssessment: "ஆயுஷ் மதிப்பீடு",
    phaseGeneralHistory: "பொது வரலாறு",
    phaseReview: "மதிப்பாய்வு",

    consentByProceeding: "தொடர்வதன் மூலம், நீங்கள் பின்வருவனவற்றுக்கு சம்மதிக்கிறீர்கள்:",
    consentListVoice: "மருத்துவ வரலாறு எடுப்பதற்கான குரல் பதிவு மற்றும் AI எழுத்துப்பெயர்ப்பு",
    consentListOCR: "பதிவேற்றப்பட்ட மருத்துவ ஆவணங்களின் OCR செயலாக்கம்",
    consentListSummary: "கட்டமைக்கப்பட்ட மருத்துவ வரலாறு உருவாக்கம் மற்றும் உங்கள் மருத்துவருடன் பகிர்வு",
    consentListPrivacy: "DPDP சட்டம் 2023 மற்றும் ABDM சம்மத கட்டமைப்புடன் இணங்க பாதுகாப்பான சேமிப்பு",

    // App Shell — Sidebar
    navDashboard: "டாஷ்போர்டு",
    navMediKiosk: "MediKiosk உட்கொள்ளல்",
    navAyurVoxara: "ஆயுர்வோக்ஸாரா",
    navRecordLive: "நேரலை பதிவு",
    navHistory: "வரலாறு",
    navTrends: "போக்குகள்",
    navAIAnalysis: "AI பகுப்பாய்வு",
    navMLInsights: "ML நுண்ணறிவுகள்",
    navAppointments: "சந்திப்புகள்",
    navSOS: "🚨 SOS அவசரநிலை",
    navIntakeReview: "உட்கொள்ளல் மதிப்பாய்வு",
    navAYUSHDashboard: "🌿 AYUSH டாஷ்போர்டு",
    navLiveAlerts: "நேரல௎ எச்சரிக்கைகள்",
    navMedication: "மருந்து பாய்வு",
    switchToAYUSH: "AYUSH க்கு மாறு",
    switchToAllopathic: "அலோபதிக் க்கு மாறு",
    newLiveSample: "புதிய நேரலை மாதிரி",
    signOut: "வெளியேறு",
    realtimeActive: "நிஜநேரம் செயலில்",

    // App Shell — Dashboard
    dashWelcome: "மீண்டும் வரவேற்கிறோம்",
    dashSubtitle: "உங்கள் ஆரோக்கிய மேலோட்டம் ஒரு பார்வையில்",
    dashRecentSessions: "சமீபத்திய அமர்வுகள்",
    dashHealthScore: "ஆரோக்கிய மதிப்பெண்",
    dashVoiceClarity: "குரல் தெளிவு",
    dashLastSession: "கடைசி அமர்வு",
    dashNoSessions: "இதுவரை அமர்வுகள் பதிவு செய்யப்படவில்லை",
    dashRecordFirst: "தொடங்க உங்கள் முதல் குரல் மாதிரியை பதிவு செய்யுங்கள்",
    dashViewAll: "அனைத்தையும் காண்க",
    dashTodaysMedications: "இன்றைய மருந்துகள்",
    dashUpcomingAppts: "வரவிருக்கும் சந்திப்புகள்",
    dashNoAppts: "வரவிருக்கும் சந்திப்புகள் இல்லை",

    // App Shell — Chatbot
    chatHealthBot: "ஹெல்த்பாட்",
    chatAyurBot: "ஆயுர்பாட்",
    chatGeneralHealth: "பொது ஆரோக்கியம்",
    chatSymptomChecker: "அறிகுறி சரிபார்ப்பாளர்",
    chatHealthInfo: "ஆரோக்கிய தகவல்",
    chatLearnAyurveda: "ஆயுர்வேதம் கற்றுக்கொள்ளுங்கள்",
    chatAssessment: "மதிப்பீடு",
    chatPractitioner: "மருத்துவர்",
    chatThinking: "யோசிக்கிறேன்...",
    chatPlaceholderHealth: "உங்கள் ஆரோக்கியம் பற்றி கேளுங்கள்...",
    chatPlaceholderAyush: "ஆயுர்வேதம் பற்றி கேளுங்கள்...",
    chatMute: "சத்தமில்லாமல்",
    chatReadAloud: "சத்தமாக படியுங்கள்",

    // App Shell — Common
    langEnglish: "English",
    langHindi: "हिन्दी",
    langTamil: "தமிழ்",
    langTelugu: "తెలుగు",
    langBengali: "বাংলা",
    langMarathi: "मराठी",
    langGujarati: "ગુજરાતી",
    langKannada: "ಕನ್ನಡ",
    langMalayalam: "മലയാളം",
    langPunjabi: "ਪੰਜਾਬੀ",
  },

  te: {
    heroTitle1: "AI-ఆధారిత క్లినికల్", heroTitle2: "చరిత్ర తీసుకోవడం", heroSubtitle: "సంప్రదింపు గదిలోకి ప్రవేశించే ముందు, వాయిస్ సంభాషణ మరియు గైడెడ్ టచ్‌స్క్రీన్ ద్వారా 5 నిమిషాల్లోపు మీ వైద్య చరిత్రను పూర్తి చేయండి.", statIntake: "పూర్తి ఇన్‌టేక్", statVoice: "డ్యుయల్ మోడ్ ఇన్‌పుట్", statPhysician: "నిర్మాణాత్మక సారాంశం", journeyTitle: "రోగి ప్రయాణం", selectLanguage: "భాష ఎంచుకోండి", selectLanguageHint: "ఇంటర్వ్యూ కోసం మీ ప్రాధాన్య భాషను ఎంచుకోండి", intakeMode: "ఇన్‌టేక్ మోడ్", intakeModeHint: "క్లినికల్ చరిత్ర ఫ్రేమ్‌వర్క్ ఎంచుకోండి", allopathicMode: "అల్లోపతిక్ చరిత్ర", allopathicDesc: "SOCRATES ఫ్రేమ్‌వర్క్ ఉపయోగించి ప్రామాణిక క్లినికల్ చరిత్ర.", ayushMode: "ఆయుష్ చరిత్ర (ఆయుర్వేదం)", ayushDesc: "దశవిధ పరీక్షను క్యాప్చర్ చేసే విస్తృత ఆయుర్వేద ఇన్‌టేక్.", abhaId: "ABHA ID (ఐచ్ఛికం)", abhaHint: "మీ ఆయుష్మాన్ భారత్ ఆరోగ్య ఖాతాతో లింక్ చేయండి", abhaPlaceholder: "14 అంకెల ABHA ID నమోదు చేయండి", validate: "ధృవీకరించండి", abhaValid: "ABHA ID విజయవంతంగా ధృవీకరించబడింది", abhaInvalid: "ధృవీకరించడం సాధ్యం కాలేదు. ABHA లేకుండా కొనసాగించవచ్చు.", registerNew: "కొత్త రోగిగా నమోదు చేయండి", privacyConsent: "గోప్యత & సమ్మతి", consentHint: "DPDP చట్టం 2023 కింద అవసరం", consentText: "కొనసాగించడం ద్వారా, మీరు దిగువ వాటికి సమ్మతిస్తున్నారు:", consentVoice: "క్లినికల్ చరిత్ర తీసుకోవడానికి వాయిస్ రికార్డింగ్ మరియు AI ట్రాన్స్‌క్రిప్షన్", consentOCR: "అప్‌లోడ్ చేసిన వైద్య పత్రాల OCR ప్రాసెసింగ్", consentSummary: "నిర్మాణాత్మక క్లినికల్ చరిత్ర జనరేషన్ మరియు మీ వైద్యుడితో షేరింగ్", consentPrivacy: "DPDP చట్టం 2023 మరియు ABDM సమ్మతి ఫ్రేమ్‌వర్క్‌తో అనుగుణంగా సురక్షిత నిల్వ", consentCheckbox: "నేను అర్థం చేసుకున్నాను, నా సమ్మతిని అందిస్తున్నాను", beginHistory: "క్లినికల్ చరిత్ర ప్రారంభించండి", adaptiveInterview: "అనుకూల ఇంటర్వ్యూ", adaptiveDesc: "AI SOCRATES క్లినికల్ ఫ్రేమ్‌వర్క్ ఆధారంగా తెలివైన ఫాలో-అప్ ప్రశ్నలు అడుగుతుంది.", voiceTouch: "వాయిస్ + టచ్", voiceTouchDesc: "మీ ప్రాధాన్య భాషలో మాట్లాడటం ద్వారా లేదా మల్టీ-ఛాయిస్ ఎంపికలను ట్యాప్ చేయడం ద్వారా సమాధానం ఇవ్వండి.", physicianReady: "వైద్యుడు-సిద్ధం", physicianReadyDesc: "సంప్రదింపుకు ముందు నిర్మాణాత్మక క్లినికల్ సారాంశం పొందండి.", backToHub: "MediKiosk కు తిరిగి", progress: "పురోగతి", redFlagAlert: "రెడ్ ఫ్లాగ్ అలర్ట్", redFlagDesc: "ప్రాధాన్య అలర్ట్ ట్రయేజ్ సిబ్బందికి పంపబడింది.", whatBringsYou: "ఈ రోజు మీరు ఎందుకు వచ్చారు?", selectSymptom: "మీ ప్రధాన లక్షణం లేదా ఫిర్యాదును ఎంచుకోండి", symptomDetails: "లక్షణ వివరాలు", ayushAssessment: "ఆయుష్ మూల్యాంకనం", generalHistory: "సాధారణ చరిత్ర", questionOf: "ప్రశ్న", typeOrVoice: "మీ సమాధానాన్ని టైప్ చేయండి లేదా వాయిస్ ఇన్‌పుట్ ఉపయోగించండి", voiceInput: "వాయిస్ ఇన్‌పుట్", recording: "రికార్డింగ్... ఆపడానికి ట్యాప్ చేయండి", tapToStop: "ఆపడానికి ట్యాప్ చేయండి", transcribing: "ట్రాన్స్‌క్రైబ్ చేస్తోంది...", tapMic: "మీ మాటల్లో సమాధానం రికార్డ్ చేయడానికి మైక్‌ను ట్యాప్ చేయండి", submitAnswer: "సమాధానం సమర్పించండి", nextSection: "తదుపరి విభాగం", previous: "మునుపటి", mild: "తేలికపాటి", severe: "తీవ్రం", severity: "తీవ్రత", typeAnswer: "మీ సమాధానం ఇక్కడ టైప్ చేయండి...", reviewAnswers: "మీ సమాధానాలను సమీక్షించండి", reviewSubtitle: "క్లినికల్ సారాంశాన్ని రూపొందించే ముందు చరిత్రను సమీక్షించండి", chiefComplaintLabel: "ప్రధాన ఫిర్యాదు", completenessScore: "సంపూర్ణత స్కోర్", generateSummary: "క్లినికల్ సారాంశం రూపొందించండి", generatingSummary: "సారాంశం రూపొందిస్తోంది...", considerMoreDetails: "మరింత సంపూర్ణ చరిత్ర కోసం మరిన్ని వివరాలు అందించడానికి వెనుకకు వెళ్ళండి.", chestPain: "ఛాతీ నొప్పి", breathlessness: "శ్వాసకోశ సమస్య", headache: "తలనొప్పి", abdominalPain: "ఉదర నొప్పి", jointPain: "కీళ్ల నొప్పి", fever: "జ్వరం", fatigue: "అలసట", cough: "దగ్గు", dizziness: "తల తిరగడం", skinIssues: "చర్మ సమస్యలు", moodChanges: "మూడ్ మార్పులు", digestiveIssues: "జీర్ణ సమస్యలు", other: "ఇతర", onset: "ఆరంభం", character: "స్వభావం", radiation: "వ్యాప్తి", associated: "సంబంధిత లక్షణాలు", timing: "సమయం", exacerbating: "మోసమైన కారకాలు", relieving: "ఉపశమనం కలిగించే కారకాలు", severityScale: "తీవ్రత", pastMedical: "గత వైద్య చరిత్ర", pastSurgical: "గత శస్త్ర చికిత్స చరిత్ర", currentMeds: "ప్రస్తుత మందులు", allergies: "అలెర్జీలు", familyHistory: "కుటుంబ చరిత్ర", smoking: "ధూమపానం", alcohol: "మద్యం", occupation: "వృత్తి", scanTitle: "వైద్య పత్రాలను స్కాన్ చేయండి", scanSubtitle: "ప్రిస్క్రిప్షన్లు, ల్యాబ్ రిపోర్టులు అప్‌లోడ్ చేయండి", dropzone: "పత్రాలను ఇక్కడ వదిలివేయండి", dropzoneHint: "చిత్రాలు మరియు PDFలకు మద్దతు", chooseFiles: "ఫైల్‌లను ఎంచుకోండి", ocrExtract: "OCR ఎక్స్‌ట్రాక్ట్", processed: "ప్రాసెస్ చేయబడింది", processing: "ప్రాసెసింగ్", uploadedDocuments: "అప్‌లోడ్ చేసిన పత్రాలు", skipToSummary: "దాటవేయి — సారాంశం రూపొందించండి", generateClinicalSummary: "క్లినికల్ సారాంశం రూపొందించండి", physicianReadySummary: "వైద్యుడు-సిద్ధం సారాంశం", generatedFor: "కోసం రూపొందించబడింది", completeness: "సంపూర్ణత", redFlagsDetected: "రెడ్ ఫ్లాగ్‌లు గుర్తించబడ్డాయి", hpi: "వర్తమాన అనారోగ్య చరిత్ర", pastMedicalLabel: "గత వైద్య చరిత్ర", currentMedications: "ప్రస్తుత మందులు", allergyLabel: "అలెర్జీ చరిత్ర", familyHistoryLabel: "కుటుంబ చరిత్ర", personalHistory: "వ్యక్తిగత చరిత్ర", priorInvestigations: "పూర్వ పరిశోధనలు", aiSummary: "AI-రూపొందించిన క్లినికల్ సారాంశం", aiDisclaimer: "ఈ సారాంశం AI-రూపొందించినది మరియు క్లినికల్ సహాయంగా ఉద్దేశించబడింది.", printSummary: "సారాంశం ప్రింట్ చేయండి", sendToPhysician: "వైద్యుడికి పంపండి", physicianNotified: "వైద్యుడికి తెలియజేయబడింది ✓", intakeComplete: "క్లినికల్ ఇన్‌టేక్ పూర్తయింది!", intakeCompleteDesc: "మీ నిర్మాణాత్మక క్లినికల్ చరిత్ర రూపొందించబడింది.", returnToDashboard: "డాష్‌బోర్డ్‌కు తిరిగి", consentDPDP: "DPDP చట్టం 2023 కింద సమ్మతి", phaseChiefComplaint: "ప్రధాన ఫిర్యాదు", phaseSymptomDetails: "లక్షణ వివరాలు", phaseAyushAssessment: "ఆయుష్ మూల్యాంకనం", phaseGeneralHistory: "సాధారణ చరిత్ర", phaseReview: "సమీక్ష", consentByProceeding: "కొనసాగించడం ద్వారా, మీరు దిగువ వాటికి సమ్మతిస్తున్నారు:", consentListVoice: "క్లినికల్ చరిత్ర తీసుకోవడానికి వాయిస్ రికార్డింగ్", consentListOCR: "అప్‌లోడ్ చేసిన వైద్య పత్రాల OCR ప్రాసెసింగ్", consentListSummary: "నిర్మాణాత్మక క్లినికల్ చరిత్ర జనరేషన్", consentListPrivacy: "DPDP చట్టం 2023 తో అనుగుణంగా సురక్షిత నిల్వ", navDashboard: "డాష్‌బోర్డ్", navMediKiosk: "MediKiosk ఇన్‌టేక్", navAyurVoxara: "ఆయుర్వోక్సారా", navRecordLive: "లైవ్ రికార్డ్", navHistory: "చరిత్ర", navTrends: "ట్రెండ్స్", navAIAnalysis: "AI విశ్లేషణ", navMLInsights: "ML అంతర్దృష్టి", navAppointments: "అపాయింట్‌మెంట్లు", navSOS: "🚨 SOS అత్యవసర", navIntakeReview: "ఇన్‌టేక్ సమీక్షలు", navAYUSHDashboard: "🌿 AYUSH డాష్‌బోర్డ్", navLiveAlerts: "లైవ్ అలర్ట్‌లు", navMedication: "మందుల ప్రవాహం", switchToAYUSH: "AYUSH కు మారండి", switchToAllopathic: "అల్లోపతిక్ కు మారండి", newLiveSample: "కొత్త లైవ్ నమూనా", signOut: "సైన్ అవుట్", realtimeActive: "రియల్‌టైం యాక్టివ్", dashWelcome: "తిరిగి స్వాగతం", dashSubtitle: "మీ ఆరోగ్య అవలోకనం ఒక చూపులో", dashRecentSessions: "ఇటీవలి సెషన్లు", dashHealthScore: "ఆరోగ్య స్కోర్", dashVoiceClarity: "వాయిస్ స్పష్టత", dashLastSession: "చివరి సెషన్", dashNoSessions: "ఇప్పటివరకు సెషన్లు రికార్డ్ కాలేదు", dashRecordFirst: "ప్రారంభించడానికి మీ మొదటి వాయిస్ నమూనాను రికార్డ్ చేయండి", dashViewAll: "అన్నీ చూడండి", dashTodaysMedications: "ఈ రోజు మందులు", dashUpcomingAppts: "రాబోయే అపాయింట్‌మెంట్లు", dashNoAppts: "రాబోయే అపాయింట్‌మెంట్లు లేవు", chatHealthBot: "హెల్త్‌బాట్", chatAyurBot: "ఆయుర్‌బాట్", chatGeneralHealth: "సాధారణ ఆరోగ్యం", chatSymptomChecker: "లక్షణ చెక్కర్", chatHealthInfo: "ఆరోగ్య సమాచారం", chatLearnAyurveda: "ఆయుర్వేదం నేర్చుకోండి", chatAssessment: "మూల్యాంకనం", chatPractitioner: "ప్రాక్టీషనర్", chatThinking: "ఆలోచిస్తోంది...", chatPlaceholderHealth: "మీ ఆరోగ్యం గురించి అడగండి...", chatPlaceholderAyush: "ఆయుర్వేదం గురించి అడగండి...", chatMute: "మ్యూట్", chatReadAloud: "బిగ్గరగా చదవండి", langEnglish: "English", langHindi: "हिन्दी", langTamil: "தமிழ்", langTelugu: "తెలుగు", langBengali: "বাংলা", langMarathi: "मराठी", langGujarati: "ગુજરાતી", langKannada: "ಕನ್ನಡ", langMalayalam: "മലയാളം", langPunjabi: "ਪੰਜਾਬੀ",
  } as TranslationSet,
  bn: {
    heroTitle1: "AI-চালিত ক্লিনিকাল", heroTitle2: "ইতিহাস সংগ্রহ", heroSubtitle: "কথোপকথন এবং গাইডেড টাচস্ক্রিনের মাধ্যমে ৫ মিনিটের মধ্যে আপনার চিকিৎসা ইতিহাস সম্পূর্ণ করুন।", statIntake: "সম্পূর্ণ ইনটেক", statVoice: "ডুয়াল মোড ইনপুট", statPhysician: "কাঠামোগত সারসংক্ষেপ", journeyTitle: "রোগীর যাত্রা", selectLanguage: "ভাষা নির্বাচন করুন", selectLanguageHint: "সাক্ষাৎকারের জন্য আপনার পছন্দের ভাষা বেছে নিন", intakeMode: "ইনটেক মোড", intakeModeHint: "ক্লিনিকাল ইতিহাস ফ্রেমওয়ার্ক বেছে নিন", allopathicMode: "অ্যালোপ্যাথিক ইতিহাস", allopathicDesc: "SOCRATES ফ্রেমওয়ার্ক ব্যবহার করে মানক ক্লিনিকাল ইতিহাস।", ayushMode: "আয়ুষ ইতিহাস (আয়ুর্বেদ)", ayushDesc: "দশবিধ পরীক্ষা ধারণকারী বিস্তৃত আয়ুর্বেদিক ইনটেক।", abhaId: "ABHA ID (ঐচ্ছিক)", abhaHint: "আপনার আয়ুষ্মান ভারত স্বাস্থ্য অ্যাকাউন্টের সাথে সংযুক্ত করুন", abhaPlaceholder: "১৪ অঙ্কের ABHA ID লিখুন", validate: "যাচাই করুন", abhaValid: "ABHA ID সফলভাবে যাচাই হয়েছে", abhaInvalid: "যাচাই করা যায়নি। ABHA ছাড়াও চালিয়ে যেতে পারেন।", registerNew: "নতুন রোগী হিসাবে নিবন্ধন করুন", privacyConsent: "গোপনীয়তা ও সম্মতি", consentHint: "DPDP আইন ২০২৩ অনুযায়ী প্রয়োজনীয়", consentText: "এগিয়ে গেলে, আপনি নিম্নলিখিত বিষয়ে সম্মতি দিচ্ছেন:", consentVoice: "ক্লিনিকাল ইতিহাস সংগ্রহের জন্য কণ্ঠ রেকর্ডিং এবং AI ট্রান্সক্রিপশন", consentOCR: "আপলোড করা চিকিৎসা নথির OCR প্রক্রিয়াকরণ", consentSummary: "কাঠামোগত ক্লিনিকাল ইতিহাস তৈরি এবং আপনার চিকিৎসকের সাথে শেয়ারিং", consentPrivacy: "DPDP আইন ২০২৩ এবং ABDM সম্মতি ফ্রেমওয়ার্ক অনুযায়ী নিরাপদ সংরক্ষণ", consentCheckbox: "আমি বুঝেছি এবং আমার সম্মতি দিচ্ছি", beginHistory: "ক্লিনিকাল ইতিহাস শুরু করুন", adaptiveInterview: "অভিযোজিত সাক্ষাৎকার", adaptiveDesc: "AI SOCRATES ক্লিনিকাল ফ্রেমওয়ার্কের ভিত্তিতে বুদ্ধিমান ফলো-আপ প্রশ্ন করে।", voiceTouch: "কণ্ঠ + স্পর্শ", voiceTouchDesc: "আপনার পছন্দের ভাষায় কথা বলে বা মাল্টি-চয়েস বিকল্পে ট্যাপ করে উত্তর দিন।", physicianReady: "চিকিৎসক-প্রস্তুত", physicianReadyDesc: "সাক্ষাৎকারের আগে কাঠামোগত ক্লিনিকাল সারসংক্ষেপ পান।", backToHub: "MediKiosk-এ ফিরে যান", progress: "অগ্রগতি", redFlagAlert: "রেড ফ্ল্যাগ সতর্কতা", redFlagDesc: "অগ্রাধিকার সতর্কতা ট্রায়েজ কর্মীদের পাঠানো হয়েছে।", whatBringsYou: "আজ আপনি কেন এসেছেন?", selectSymptom: "আপনার প্রধান উপসর্গ বা অভিযোগ নির্বাচন করুন", symptomDetails: "উপসর্গের বিবরণ", ayushAssessment: "আয়ুষ মূল্যায়ন", generalHistory: "সাধারণ ইতিহাস", questionOf: "প্রশ্ন", typeOrVoice: "আপনার উত্তর টাইপ করুন বা কণ্ঠ ইনপুট ব্যবহার করুন", voiceInput: "কণ্ঠ ইনপুট", recording: "রেকর্ডিং... থামতে ট্যাপ করুন", tapToStop: "থামতে ট্যাপ করুন", transcribing: "ট্রান্সক্রাইব হচ্ছে...", tapMic: "আপনার নিজের কথায় উত্তর রেকর্ড করতে মাইকে ট্যাপ করুন", submitAnswer: "উত্তর জমা দিন", nextSection: "পরবর্তী বিভাগ", previous: "আগের", mild: "হালকা", severe: "তীব্র", severity: "তীব্রতা", typeAnswer: "এখানে আপনার উত্তর টাইপ করুন...", reviewAnswers: "আপনার উত্তর পর্যালোচনা করুন", reviewSubtitle: "ক্লিনিকাল সারসংক্ষেপ তৈরির আগে ইতিহাস পর্যালোচনা করুন", chiefComplaintLabel: "প্রধান অভিযোগ", completenessScore: "সম্পূর্ণতা স্কোর", generateSummary: "ক্লিনিকাল সারসংক্ষেপ তৈরি করুন", generatingSummary: "সারসংক্ষেপ তৈরি হচ্ছে...", considerMoreDetails: "আরও সম্পূর্ণ ইতিহাসের জন্য আরও বিবরণ দিতে পিছিয়ে যান।", chestPain: "বুকে ব্যথা", breathlessness: "শ্বাসকষ্ট", headache: "মাথাব্যথা", abdominalPain: "পেটে ব্যথা", jointPain: "জয়েন্টে ব্যথা", fever: "জ্বর", fatigue: "ক্লান্তি", cough: "কাশি", dizziness: "মাথা ঘোরা", skinIssues: "ত্বকের সমস্যা", moodChanges: "মেজাজ পরিবর্তন", digestiveIssues: "হজম সমস্যা", other: "অন্যান্য", onset: "শুরু", character: "চরিত্র", radiation: "বিস্তার", associated: "সম্পর্কিত উপসর্গ", timing: "সময়", exacerbating: "বাড়িয়ে দেওয়ার কারক", relieving: "উপশমকারী কারক", severityScale: "তীব্রতা", pastMedical: "পূর্ববর্তী চিকিৎসা ইতিহাস", pastSurgical: "পূর্ববর্তী সার্জারি ইতিহাস", currentMeds: "বর্তমান ওষুধ", allergies: "অ্যালার্জি", familyHistory: "পারিবারিক ইতিহাস", smoking: "ধূমপায়", alcohol: "মদ্যপান", occupation: "পেশা", scanTitle: "চিকিৎসা নথি স্ক্যান করুন", scanSubtitle: "প্রেসক্রিপশন, ল্যাব রিপোর্ট, ডিসচার্জ সারাংশ আপলোড করুন", dropzone: "নথি এখানে ছেড়ে দিন", dropzoneHint: "ছবি এবং PDF সমর্থিত", chooseFiles: "ফাইল বেছে নিন", ocrExtract: "OCR এক্সট্রাক্ট", processed: "প্রক্রিয়াকৃত", processing: "প্রক্রিয়াকরণ", uploadedDocuments: "আপলোড করা নথি", skipToSummary: "এড়িয়ে যান — সারসংক্ষেপ তৈরি করুন", generateClinicalSummary: "ক্লিনিকাল সারসংক্ষেপ তৈরি করুন", physicianReadySummary: "চিকিৎসক-প্রস্তুত সারসংক্ষেপ", generatedFor: "জন্য তৈরি", completeness: "সম্পূর্ণতা", redFlagsDetected: "রেড ফ্ল্যাগ সনাক্ত", hpi: "বর্তমান অসুস্থতার ইতিহাস", pastMedicalLabel: "পূর্ববর্তী চিকিৎসা ইতিহাস", currentMedications: "বর্তমান ওষুধ", allergyLabel: "অ্যালার্জি ইতিহাস", familyHistoryLabel: "পারিবারিক ইতিহাস", personalHistory: "ব্যক্তিগত ইতিহাস", priorInvestigations: "পূর্ববর্তী পরীক্ষা", aiSummary: "AI-তৈরি ক্লিনিকাল সারসংক্ষেপ", aiDisclaimer: "এই সারসংক্ষেপ AI-দ্বারা তৈরি এবং ক্লিনিকাল সহায়ক হিসাবে উদ্দেশ্য।", printSummary: "সারসংক্ষেপ প্রিন্ট করুন", sendToPhysician: "চিকিৎসককে পাঠান", physicianNotified: "চিকিৎসককে জানানো হয়েছে ✓", intakeComplete: "ক্লিনিকাল ইনটেক সম্পূর্ণ!", intakeCompleteDesc: "আপনার কাঠামোগত ক্লিনিকাল ইতিহাস তৈরি হয়েছে।", returnToDashboard: "ড্যাশবোর্ডে ফিরে যান", consentDPDP: "DPDP আইন ২০২৩ অনুযায়ী সম্মতি", phaseChiefComplaint: "প্রধান অভিযোগ", phaseSymptomDetails: "উপসর্গের বিবরণ", phaseAyushAssessment: "আয়ুষ মূল্যায়ন", phaseGeneralHistory: "সাধারণ ইতিহাস", phaseReview: "পর্যালোচনা", consentByProceeding: "এগিয়ে গেলে, আপনি নিম্নলিখিত বিষয়ে সম্মতি দিচ্ছেন:", consentListVoice: "ক্লিনিকাল ইতিহাসের জন্য কণ্ঠ রেকর্ডিং", consentListOCR: "আপলোড করা নথির OCR প্রক্রিয়াকরণ", consentListSummary: "কাঠামোগত ক্লিনিকাল ইতিহাস তৈরি", consentListPrivacy: "DPDP আইন ২০২৩ অনুযায়ী নিরাপদ সংরক্ষণ", navDashboard: "ড্যাশবোর্ড", navMediKiosk: "MediKiosk ইনটেক", navAyurVoxara: "আয়ুরভোক্সারা", navRecordLive: "লাইভ রেকর্ড", navHistory: "ইতিহাস", navTrends: "ট্রেন্ড", navAIAnalysis: "AI বিশ্লেষণ", navMLInsights: "ML অন্তর্দৃষ্টি", navAppointments: "অ্যাপয়েন্টমেন্ট", navSOS: "🚨 SOS জরুরি", navIntakeReview: "ইনটেক পর্যালোচনা", navAYUSHDashboard: "🌿 AYUSH ড্যাশবোর্ড", navLiveAlerts: "লাইভ সতর্কতা", navMedication: "ওষুধ প্রবাহ", switchToAYUSH: "AYUSH-এ পরিবর্তন করুন", switchToAllopathic: "অ্যালোপ্যাথিক-এ পরিবর্তন করুন", newLiveSample: "নতুন লাইভ নমুনা", signOut: "সাইন আউট", realtimeActive: "রিয়েলটাইম সক্রিয়", dashWelcome: "স্বাগতম", dashSubtitle: "আপনার স্বাস্থ্য সংক্ষিপ্ত বিবরণ", dashRecentSessions: "সাম্প্রতিক সেশন", dashHealthScore: "স্বাস্থ্য স্কোর", dashVoiceClarity: "কণ্ঠ স্পষ্টতা", dashLastSession: "শেষ সেশন", dashNoSessions: "এখনো কোনো সেশন রেকর্ড হয়নি", dashRecordFirst: "শুরু করতে আপনার প্রথম কণ্ঠ নমুনা রেকর্ড করুন", dashViewAll: "সব দেখুন", dashTodaysMedications: "আজকের ওষুধ", dashUpcomingAppts: "আসন্ন অ্যাপয়েন্টমেন্ট", dashNoAppts: "কোনো আসন্ন অ্যাপয়েন্টমেন্ট নেই", chatHealthBot: "হেলথবট", chatAyurBot: "আয়ুরবট", chatGeneralHealth: "সাধারণ স্বাস্থ্য", chatSymptomChecker: "উপসর্গ পরীক্ষক", chatHealthInfo: "স্বাস্থ্য তথ্য", chatLearnAyurveda: "আয়ুর্বেদ শিখুন", chatAssessment: "মূল্যায়ন", chatPractitioner: "চিকিৎসক", chatThinking: "ভাবছেন...", chatPlaceholderHealth: "আপনার স্বাস্থ্য সম্পর্কে জিজ্ঞাসা করুন...", chatPlaceholderAyush: "আয়ুর্বেদ সম্পর্কে জিজ্ঞাসা করুন...", chatMute: "নীরব", chatReadAloud: "জোরে পড়ুন", langEnglish: "English", langHindi: "हिन्दी", langTamil: "தமிழ்", langTelugu: "తెలుగు", langBengali: "বাংলা", langMarathi: "मराठी", langGujarati: "ગુજરાતી", langKannada: "ಕನ್ನಡ", langMalayalam: "മലയാളം", langPunjabi: "ਪੰਜਾਬੀ",
  } as TranslationSet,

  mr: {
    heroTitle1: "AI-आधारित क्लिनिकल", heroTitle2: "इतिहास घेणे", heroSubtitle: "सल्लागार खोळ्यात प्रवेश करण्यापूर्वी, संवाद आणि मार्गदर्शित टचस्क्रीनद्वारे ५ मिनिटांत तुमचा वैद्यकीय इतिहास पूर्ण करा.", statIntake: "संपूर्ण इनटेक", statVoice: "ड्युअल मोड इनपुट", statPhysician: "संरचित सारांश", journeyTitle: "रुग्ण प्रवास", selectLanguage: "भाषा निवडा", selectLanguageHint: "संवादासाठी तुमची पसंतीची भाषा निवडा", intakeMode: "इनटेक मोड", intakeModeHint: "क्लिनिकल इतिहास फ्रेमवर्क निवडा", allopathicMode: "अलोपॅथिक इतिहास", allopathicDesc: "SOCRATES फ्रेमवर्क वापरून मानक क्लिनिकल इतिहास.", ayushMode: "आयुष इतिहास (आयुर्वेद)", ayushDesc: "दशविध परीक्षा कॅप्चर करणारा विस्तृत आयुर्वेदिक इनटेक.", abhaId: "ABHA ID (पर्यायी)", abhaHint: "तुमच्या आयुष्मान भारत आरोग्य खात्याशी लिंक करा", abhaPlaceholder: "१४ अंकी ABHA ID प्रविष्ट करा", validate: "तपासा", abhaValid: "ABHA ID यशस्वीरित्या तपासले", abhaInvalid: "तपासणी अशक्य. ABHA शिवाय सुरू ठेवू शकता.", registerNew: "नवीन रुग्ण म्हणून नोंदणी करा", privacyConsent: "गोपनीयता व संमती", consentHint: "DPDP कायदा २०२३ अंतर्गत आवश्यक", consentText: "पुढे जाऊन, तुम्ही खालील गोष्टींसाठी संमती देत आहात:", consentVoice: "क्लिनिकल इतिहास घेण्यासाठी आवाज रेकॉर्डिंग आणि AI ट्रान्सक्रिप्शन", consentOCR: "अपलोड केलेल्या वैद्यकीय कागदपत्रांची OCR प्रक्रिया", consentSummary: "संरचित क्लिनिकल इतिहास निर्माण आणि तुमच्या डॉक्टरशी शेअरिंग", consentPrivacy: "DPDP कायदा २०२३ आणि ABDM संमती फ्रेमवर्कनुसार सुरक्षित संग्रह", consentCheckbox: "मला समजले आणि मी माझी संमती देत आहे", beginHistory: "क्लिनिकल इतिहास सुरू करा", adaptiveInterview: "अनुकूलित संवाद", adaptiveDesc: "AI SOCRATES क्लिनिकल फ्रेमवर्कवर आधारित बुद्धिमान प्रश्न विचारतो.", voiceTouch: "आवाज + स्पर्श", voiceTouchDesc: "तुमच्या आवडत्या भाषेत बोलून किंवा मल्टी-चॉइस पर्याय टॅप करून उत्तर द्या.", physicianReady: "डॉक्टर-तयार", physicianReadyDesc: "सल्लागारापूर्वी संरचित क्लिनिकल सारांश मिळवा.", backToHub: "MediKiosk वर परत जा", progress: "प्रगती", redFlagAlert: "रेड फ्लॅग अलर्ट", redFlagDesc: "प्राधान्य अलर्ट ट्रायेज कर्मचाऱ्यांना पाठवला.", whatBringsYou: "आज तुम्ही का आलात?", selectSymptom: "तुमचा मुख्य लक्षण किंवा तक्रार निवडा", symptomDetails: "लक्षणांचे तपशील", ayushAssessment: "आयुष मूल्यांकन", generalHistory: "सामान्य इतिहास", questionOf: "प्रश्न", typeOrVoice: "तुमचे उत्तर टाइप करा किंवा आवाज इनपुट वापरा", voiceInput: "आवाज इनपुट", recording: "रेकॉर्डिंग... थांबवण्यासाठी टॅप करा", tapToStop: "थांबवण्यासाठी टॅप करा", transcribing: "ट्रान्सक्राइब होत आहे...", tapMic: "तुमच्या स्वतःच्या शब्दांत उत्तर रेकॉर्ड करण्यासाठी माइक टॅप करा", submitAnswer: "उत्तर सादर करा", nextSection: "पुढचा विभाग", previous: "मागील", mild: "हलके", severe: "तीव्र", severity: "तीव्रता", typeAnswer: "येथे तुमचे उत्तर टाइप करा...", reviewAnswers: "तुमची उत्तरे पर्यालोचना करा", reviewSubtitle: "क्लिनिकल सारांश तयार करण्यापूर्वी इतिहास पर्यालोचना करा", chiefComplaintLabel: "मुख्य तक्रार", completenessScore: "पूर्णता स्कोअर", generateSummary: "क्लिनिकल सारांश तयार करा", generatingSummary: "सारांश तयार होत आहे...", considerMoreDetails: "अधिक पूर्ण इतिहासासाठी मागे जाऊन अधिक माहिती द्या.", chestPain: "छातीत दुखणे", breathlessness: "श्वासोच्छ्वासात अडचण", headache: "डोके दुखणे", abdominalPain: "पोटात दुखणे", jointPain: "सांध्यांमध्ये दुखणे", fever: "ताप", fatigue: "थकवा", cough: "खोकला", dizziness: "डोके फिरणे", skinIssues: "त्वचेच्या समस्या", moodChanges: "मूड बदल", digestiveIssues: "पचन समस्या", other: "इतर", onset: "सुरू", character: "स्वभाव", radiation: "पसरणे", associated: "संबंधित लक्षणे", timing: "वेळ", exacerbating: "वाढवणारे कारक", relieving: "शमन करणारे कारक", severityScale: "तीव्रता", pastMedical: "मागील वैद्यकीय इतिहास", pastSurgical: "मागील शस्त्रक्रिया इतिहास", currentMeds: "सध्याची औषधे", allergies: "अॅलर्जी", familyHistory: "कुटुंब इतिहास", smoking: "धूम्रपान", alcohol: "मद्यपान", occupation: "व्यवसाय", scanTitle: "वैद्यकीय कागदपत्रे स्कॅन करा", scanSubtitle: "प्रेस्क्रिप्शन, लॅब अहवाल, डिस्चार्ज सारांश अपलोड करा", dropzone: "कागदपत्रे येथे सोडा", dropzoneHint: "प्रतिमा आणि PDF समर्थित", chooseFiles: "फाइल्स निवडा", ocrExtract: "OCR एक्स्ट्रॅक्ट", processed: "प्रक्रिया केली", processing: "प्रक्रिया होत आहे", uploadedDocuments: "अपलोड केलेली कागदपत्रे", skipToSummary: "वगळा — सारांश तयार करा", generateClinicalSummary: "क्लिनिकल सारांश तयार करा", physicianReadySummary: "डॉक्टर-तयार सारांश", generatedFor: "साठी तयार", completeness: "पूर्णता", redFlagsDetected: "रेड फ्लॅग आढळले", hpi: "सध्याच्या अस्वस्थतेचा इतिहास", pastMedicalLabel: "मागील वैद्यकीय इतिहास", currentMedications: "सध्याची औषधे", allergyLabel: "अॅलर्जी इतिहास", familyHistoryLabel: "कुटुंब इतिहास", personalHistory: "वैयक्तिक इतिहास", priorInvestigations: "मागील तपासण्या", aiSummary: "AI-निर्मित क्लिनिकल सारांश", aiDisclaimer: "हा सारांश AI-निर्मित आहे आणि क्लिनिकल सहाय्य म्हणून अभिप्रेत आहे.", printSummary: "सारांश प्रिंट करा", sendToPhysician: "डॉक्टरला पाठवा", physicianNotified: "डॉक्टरला कळवले ✓", intakeComplete: "क्लिनिकल इनटेक पूर्ण!", intakeCompleteDesc: "तुमचा संरचित क्लिनिकल इतिहास तयार झाला आहे.", returnToDashboard: "डॅशबोर्डवर परत जा", consentDPDP: "DPDP कायदा २०२३ अंतर्गत संमती", phaseChiefComplaint: "मुख्य तक्रार", phaseSymptomDetails: "लक्षणांचे तपशील", phaseAyushAssessment: "आयुष मूल्यांकन", phaseGeneralHistory: "सामान्य इतिहास", phaseReview: "पर्यालोचना", consentByProceeding: "पुढे जाऊन, तुम्ही खालील गोष्टींसाठी संमती देत आहात:", consentListVoice: "क्लिनिकल इतिहासासाठी आवाज रेकॉर्डिंग", consentListOCR: "अपलोड केलेल्या कागदपत्रांची OCR प्रक्रिया", consentListSummary: "संरचित क्लिनिकल इतिहास निर्माण", consentListPrivacy: "DPDP कायदा २०२३ नुसार सुरक्षित संग्रह", navDashboard: "डॅशबोर्ड", navMediKiosk: "MediKiosk इनटेक", navAyurVoxara: "आयुर्वोक्सारा", navRecordLive: "लाइव्ह रेकॉर्ड", navHistory: "इतिहास", navTrends: "ट्रेंड", navAIAnalysis: "AI विश्लेषण", navMLInsights: "ML अंतर्दृष्टी", navAppointments: "भेटी", navSOS: "🚨 SOS आणीबाणी", navIntakeReview: "इनटेक पर्यालोचना", navAYUSHDashboard: "🌿 AYUSH डॅशबोर्ड", navLiveAlerts: "लाइव्ह अलर्ट", navMedication: "औषध प्रवाह", switchToAYUSH: "AYUSH वर स्विच करा", switchToAllopathic: "अलोपॅथिक वर स्विच करा", newLiveSample: "नवीन लाइव्ह नमुना", signOut: "साइन आउट", realtimeActive: "रिअलटाइम सक्रिय", dashWelcome: "स्वागत आहे", dashSubtitle: "तुमचा आरोग्य आढावा एका दृष्टीत", dashRecentSessions: "अलीकडील सत्रे", dashHealthScore: "आरोग्य स्कोअर", dashVoiceClarity: "आवाज स्पष्टता", dashLastSession: "शेवटचे सत्र", dashNoSessions: "अजून कोणतीही सत्रे नोंदवली नाहीत", dashRecordFirst: "सुरू करण्यासाठी तुमचा पहिला आवाज नमुना रेकॉर्ड करा", dashViewAll: "सर्व पहा", dashTodaysMedications: "आजच्या औषधे", dashUpcomingAppts: "आगामी भेटी", dashNoAppts: "कोणत्याही आगामी भेटी नाहीत", chatHealthBot: "हेल्थबॉट", chatAyurBot: "आयुर्बॉट", chatGeneralHealth: "सामान्य आरोग्य", chatSymptomChecker: "लक्षण तपासणी", chatHealthInfo: "आरोग्य माहिती", chatLearnAyurveda: "आयुर्वेद शिका", chatAssessment: "मूल्यांकन", chatPractitioner: "वैद्यकीय तज्ञ", chatThinking: "विचार करत आहे...", chatPlaceholderHealth: "तुमच्या आरोग्याबद्दल विचारा...", chatPlaceholderAyush: "आयुर्वेदाबद्दल विचारा...", chatMute: "म्यूट", chatReadAloud: "मोठ्या आवाजात वाचा", langEnglish: "English", langHindi: "हिन्दी", langTamil: "தமிழ்", langTelugu: "తెలుగు", langBengali: "বাংলা", langMarathi: "मराठी", langGujarati: "ગુજરાતી", langKannada: "ಕನ್ನಡ", langMalayalam: "മലയാളം", langPunjabi: "ਪੰਜਾਬੀ",
  } as TranslationSet,

  gu: {
    heroTitle1: "AI-આધારિત ક્લિનિકલ", heroTitle2: "ઇતિહાસ લેવો", heroSubtitle: "સલ્હાકાર ખોળામાં પ્રવેશ કરતા પહેલાં, સંવાદ અને માર્ગદર્શિત ટચસ્ક્રીન દ્વારા ૫ મિનિટમાં તમારો તબીબી ઇતિહાસ પૂર્ણ કરો.", statIntake: "સંપૂર્ણ ઇન્ટેક", statVoice: "ડ્યુઅલ મોડ ઇનપુટ", statPhysician: "સંરચિત સારાંશ", journeyTitle: "દર્દી યાત્રા", selectLanguage: "ભાષા પસંદ કરો", selectLanguageHint: "મુલાકાત માટે તમારી પસંદગીની ભાષા પસંદ કરો", intakeMode: "ઇન્ટેક મોડ", intakeModeHint: "ક્લિનિકલ ઇતિહાસ ફ્રેમવર્ક પસંદ કરો", allopathicMode: "એલોપેથિક ઇતિહાસ", allopathicDesc: "SOCRATES ફ્રેમવર્કનો ઉપયોગ કરીને માનક ક્લિનિકલ ઇતિહાસ.", ayushMode: "આયુષ ઇતિહાસ (આયુર્વેદ)", ayushDesc: "દશવિધ પરીક્ષા કેપ્ચર કરતો વિસ્તૃત આયુર્વેદિક ઇન્ટેક.", abhaId: "ABHA ID (વૈકલ્પિક)", abhaHint: "તમારા આયુષ્માન ભારત આરોગ્ય ખાતા સાથે લિંક કરો", abhaPlaceholder: "૧૪ અંકોનો ABHA ID દાખલ કરો", validate: "ચકાસો", abhaValid: "ABHA ID સફળતાપૂર્વક ચકાસાયું", abhaInvalid: "ચકાસણી શક્ય નથી. ABHA વગાર ચાલુ રાખી શકો છો.", registerNew: "નવા દર્દી તરીકે નોંધણી કરો", privacyConsent: "ગોપનીયતા અને સંમતિ", consentHint: "DPDP કાયદો ૨૦૨૩ હેઠળ જરૂરી", consentText: "આગળ વધવાથી, તમે નીચેની બાબતો માટે સંમતિ આપો છો:", consentVoice: "ક્લિનિકલ ઇતિહાસ લેવા માટે અવાજ રેકોર્ડિંગ અને AI ટ્રાન્સ્ક્રિપ્શન", consentOCR: "અપલોડ કરેલા તબીબી દસ્તાવેજોની OCR પ્રક્રિયા", consentSummary: "સંરચિત ક્લિનિકલ ઇતિહાસ જનરેશન અને તમારા ડૉક્ટર સાથે શેરિંગ", consentPrivacy: "DPDP કાયદો ૨૦૨૩ અને ABDM સંમતિ ફ્રેમવર્ક સાથે સુસંગત સુરક્ષિત સંગ્રહ", consentCheckbox: "મે સમજી લીધું છે, મારી સંમતિ આપું છું", beginHistory: "ક્લિનિકલ ઇતિહાસ શરૂ કરો", adaptiveInterview: "અનુકૂળ મુલાકાત", adaptiveDesc: "AI SOCRATES ક્લિનિકલ ફ્રેમવર્ક પર આધારિત બુદ્ધિશાળી ફોલો-અપ પ્રશ્નો પૂછે છે.", voiceTouch: "અવાજ + ટચ", voiceTouchDesc: "તમારી પસંદગીની ભાષામાં બોલીને અથવા મલ્ટી-ચોઇસ વિકલ્પોને ટૅપ કરીને જવાબ આપો.", physicianReady: "ડૉક્ટર-તૈયાર", physicianReadyDesc: "મુલાકાત પહેલાં સંરચિત ક્લિનિકલ સારાંશ મેળવો.", backToHub: "MediKiosk પર પાછા જાઓ", progress: "પ્રગતિ", redFlagAlert: "રેડ ફ્લેગ એલર્ટ", redFlagDesc: "પ્રાથમિક એલર્ટ ટ્રાયેજ સ્ટાફને મોકલવામાં આવ્યું.", whatBringsYou: "આજે તમે શા માટે આવ્યા છો?", selectSymptom: "તમારો મુખ્ય લક્ષણ અથવા ફરિયાદ પસંદ કરો", symptomDetails: "લક્ષણોની વિગતો", ayushAssessment: "આયુષ મૂલ્યાંકન", generalHistory: "સામાન્ય ઇતિહાસ", questionOf: "પ્રશ્ન", typeOrVoice: "તમારો જવાબ ટાઇપ કરો અથવા અવાજ ઇનપુટનો ઉપયોગ કરો", voiceInput: "અવાજ ઇનપુટ", recording: "રેકોર્ડિંગ... રોકવા માટે ટૅપ કરો", tapToStop: "રોકવા માટે ટૅપ કરો", transcribing: "ટ્રાન્સ્ક્રાઇબ થઈ રહ્યું છે...", tapMic: "તમારા પોતાના શબ્દોમાં જવાબ રેકોર્ડ કરવા માઇક ટૅપ કરો", submitAnswer: "જવાબ સબમિટ કરો", nextSection: "આગળનો વિભાગ", previous: "પાછલો", mild: "હળવું", severe: "ગંભીર", severity: "ગંભીરતા", typeAnswer: "અહીં તમારો જવાબ ટાઇપ કરો...", reviewAnswers: "તમારા જવાબોની સમીક્ષા કરો", reviewSubtitle: "ક્લિનિકલ સારાંશ બનાવતા પહેલાં ઇતિહાસની સમીક્ષા કરો", chiefComplaintLabel: "મુખ્ય ફરિયાદ", completenessScore: "સંપૂર્ણતા સ્કોર", generateSummary: "ક્લિનિકલ સારાંશ બનાવો", generatingSummary: "સારાંશ બની રહ્યો છે...", considerMoreDetails: "વધુ સંપૂર્ણ ઇતિહાસ માટે પાછળ જઈને વધુ વિગતો આપો.", chestPain: "છાતીમાં દુખાવો", breathlessness: "શ્વાસ લેવામાં તકલીફ", headache: "માથાનો દુખાવો", abdominalPain: "પેટમાં દુખાવો", jointPain: "સાંધાનો દુખાવો", fever: "તાવ", fatigue: "થાક", cough: "ખાંસી", dizziness: "માથું ફરવું", skinIssues: "ત્વચાની સમસ્યાઓ", moodChanges: "મૂડ બદલાવ", digestiveIssues: "પાચન સમસ્યાઓ", other: "અન્ય", onset: "શરૂઆત", character: "સ્વભાવ", radiation: "ફેલાવો", associated: "સંકળાયેલ લક્ષણો", timing: "સમય", exacerbating: "વધારતા પરિબળો", relieving: "રાહત આપતા પરિબળો", severityScale: "ગંભીરતા", pastMedical: "પાછલો તબીબી ઇતિહાસ", pastSurgical: "પાછલો શસ્ત્રક્રિયા ઇતિહાસ", currentMeds: "વર્તમાન દવાઓ", allergies: "એલર્જી", familyHistory: "કુટુંબ ઇતિહાસ", smoking: "ધૂમ્રપાન", alcohol: "મદ્યપાન", occupation: "વ્યવસાય", scanTitle: "તબીબી દસ્તાવેજો સ્કેન કરો", scanSubtitle: "પ્રિસ્ક્રિપ્શન, લેબ રિપોર્ટ, ડિસ્ચાર્જ સારાંશ અપલોડ કરો", dropzone: "દસ્તાવેજો અહીં છોડો", dropzoneHint: "છબીઓ અને PDF સપોર્ટેડ", chooseFiles: "ફાઇલો પસંદ કરો", ocrExtract: "OCR એક્સ્ટ્રેક્ટ", processed: "પ્રક્રિયા થયેલ", processing: "પ્રક્રિયા થઈ રહી છે", uploadedDocuments: "અપલોડ કરેલા દસ્તાવેજો", skipToSummary: "છોડો — સારાંશ બનાવો", generateClinicalSummary: "ક્લિનિકલ સારાંશ બનાવો", physicianReadySummary: "ડૉક્ટર-તૈયાર સારાંશ", generatedFor: "માટે બનાવેલ", completeness: "સંપૂર્ણતા", redFlagsDetected: "રેડ ફ્લેગ શોધાયા", hpi: "વર્તમાન બીમારીનો ઇતિહાસ", pastMedicalLabel: "પાછલો તબીબી ઇતિહાસ", currentMedications: "વર્તમાન દવાઓ", allergyLabel: "એલર્જી ઇતિહાસ", familyHistoryLabel: "કુટુંબ ઇતિહાસ", personalHistory: "વ્યક્તિગત ઇતિહાસ", priorInvestigations: "પાછલી તપાસણીઓ", aiSummary: "AI-જનરેટેડ ક્લિનિકલ સારાંશ", aiDisclaimer: "આ સારાંશ AI-જનરેટેડ છે અને ક્લિનિકલ સહાયક તરીકે ગણાય છે.", printSummary: "સારાંશ પ્રિન્ટ કરો", sendToPhysician: "ડૉક્ટરને મોકલો", physicianNotified: "ડૉક્ટરને જાણ કરાઈ ✓", intakeComplete: "ક્લિનિકલ ઇન્ટેક પૂર્ણ!", intakeCompleteDesc: "તમારો સંરચિત ક્લિનિકલ ઇતિહાસ બનાવવામાં આવ્યો છે.", returnToDashboard: "ડેશબોર્ડ પર પાછા જાઓ", consentDPDP: "DPDP કાયદો ૨૦૨૩ હેઠળ સંમતિ", phaseChiefComplaint: "મુખ્ય ફરિયાદ", phaseSymptomDetails: "લક્ષણોની વિગતો", phaseAyushAssessment: "આયુષ મૂલ્યાંકન", phaseGeneralHistory: "સામાન્ય ઇતિહાસ", phaseReview: "સમીક્ષા", consentByProceeding: "આગળ વધવાથી, તમે નીચેની બાબતો માટે સંમતિ આપો છો:", consentListVoice: "ક્લિનિકલ ઇતિહાસ માટે અવાજ રેકોર્ડિંગ", consentListOCR: "અપલોડ કરેલા દસ્તાવેજોની OCR પ્રક્રિયા", consentListSummary: "સંરચિત ક્લિનિકલ ઇતિહાસ જનરેશન", consentListPrivacy: "DPDP કાયદો ૨૦૨૩ સાથે સુસંગત સુરક્ષિત સંગ્રહ", navDashboard: "ડેશબોર્ડ", navMediKiosk: "MediKiosk ઇન્ટેક", navAyurVoxara: "આયુર્વોક્સારા", navRecordLive: "લાઇવ્ રેકોર્ડ", navHistory: "ઇતિહાસ", navTrends: "ટ્રેન્ડ્સ", navAIAnalysis: "AI વિશ્લેષણ", navMLInsights: "ML અંતર્દૃષ્ટિ", navAppointments: "એપોઇન્ટમેન્ટ્સ", navSOS: "🚨 SOS ઇમર્જન્સી", navIntakeReview: "ઇન્ટેક સમીક્ષાઓ", navAYUSHDashboard: "🌿 AYUSH ડેશબોર્ડ", navLiveAlerts: "લાઇવ્ એલર્ટ્સ", navMedication: "દવા પ્રવાહ", switchToAYUSH: "AYUSH પર સ્વિચ કરો", switchToAllopathic: "એલોપેથિક પર સ્વિચ કરો", newLiveSample: "નવી લાઇવ્ સેમ્પલ", signOut: "સાઇન આઉટ", realtimeActive: "રિયલટાઇમ સક્રિય", dashWelcome: "સ્વાગત છે", dashSubtitle: "તમારું આરોગ્ય ઓવરવ્યૂ એક નજરમાં", dashRecentSessions: "તાજેતરના સત્રો", dashHealthScore: "આરોગ્ય સ્કોર", dashVoiceClarity: "અવાજ સ્પષ્ટતા", dashLastSession: "છેલ્લું સત્ર", dashNoSessions: "હજુ સુધી કોઈ સત્રો નોંધાયા નથી", dashRecordFirst: "શરૂ કરવા માટે તમારી પ્રથમ અવાજ સેમ્પલ રેકોર્ડ કરો", dashViewAll: "બધું જુઓ", dashTodaysMedications: "આજની દવાઓ", dashUpcomingAppts: "આવનારી એપોઇન્ટમેન્ટ્સ", dashNoAppts: "કોઈ આવનારી એપોઇન્ટમેન્ટ્સ નથી", chatHealthBot: "હેલ્થબોટ", chatAyurBot: "આયુરબોટ", chatGeneralHealth: "સામાન્ય આરોગ્ય", chatSymptomChecker: "લક્ષણ ચેકર", chatHealthInfo: "આરોગ્ય માહિતી", chatLearnAyurveda: "આયુર્વેદ શીખો", chatAssessment: "મૂલ્યાંકન", chatPractitioner: "ચિકિત્સક", chatThinking: "વિચારી રહ્યા છીએ...", chatPlaceholderHealth: "તમારા આરોગ્ય વિશે પૂછો...", chatPlaceholderAyush: "આયુર્વેદ વિશે પૂછો...", chatMute: "મ્યૂટ", chatReadAloud: "જોરથી વાંચો", langEnglish: "English", langHindi: "हिन्दी", langTamil: "தமிழ்", langTelugu: "తెలుగు", langBengali: "বাংলা", langMarathi: "मराठी", langGujarati: "ગુજરાતી", langKannada: "ಕನ್ನಡ", langMalayalam: "മലയാളം", langPunjabi: "ਪੰਜਾਬੀ",
  } as TranslationSet,

  kn: {
    heroTitle1: "AI-ಆಧಾರಿತ ಕ್ಲಿನಿಕಲ್", heroTitle2: "ಇತಿಹಾಸ ಪಡೆಯುವಿಕೆ", heroSubtitle: "ಸಮಾಲೋಚನಾ ಕೊಠಡಿಯಲ್ಲಿ ಪ್ರವೇಶಿಸುವ ಮೊದಲು, ಸಂಭಾಷಣೆ ಮತ್ತು ಮಾರ್ಗದರ್ಶಿತ ಟಚ್‌ಸ್ಕ್ರೀನ್ ಮೂಲಕ ೫ ನಿಮಿಷಗಳಲ್ಲಿ ನಿಮ್ಮ ವೈದ್ಯಕೀಯ ಇತಿಹಾಸವನ್ನು ಪೂರ್ಣಗೊಳಿಸಿ.", statIntake: "ಸಂಪೂರ್ಣ ಇನ್‌ಟೇಕ್", statVoice: "ಡ್ಯುಯಲ್ ಮೋಡ್ ಇನ್‌ಪುಟ್", statPhysician: "ಸಂಘಟಿತ ಸಾರಾಂಶ", journeyTitle: "ರೋಗಿ ಪ್ರಯಾಣ", selectLanguage: "ಭಾಷೆ ಆಯ್ಕೆಮಾಡಿ", selectLanguageHint: "ಸಂದರ್ಶನಕ್ಕಾಗಿ ನಿಮ್ಮ ಆದ್ಯತೆಯ ಭಾಷೆಯನ್ನು ಆಯ್ಕೆಮಾಡಿ", intakeMode: "ಇನ್‌ಟೇಕ್ ಮೋಡ್", intakeModeHint: "ಕ್ಲಿನಿಕಲ್ ಇತಿಹಾಸ ಫ್ರೇಮ್‌ವರ್ಕ್ ಆಯ್ಕೆಮಾಡಿ", allopathicMode: "ಎಲ್ಲೋಪ್ಯಾಥಿಕ್ ಇತಿಹಾಸ", allopathicDesc: "SOCRATES ಫ್ರೇಮ್‌ವರ್ಕ್ ಬಳಸಿ ಮಾನಕ ಕ್ಲಿನಿಕಲ್ ಇತಿಹಾಸ.", ayushMode: "ಆಯುಷ್ ಇತಿಹಾಸ (ಆಯುರ್ವೇದ)", ayushDesc: "ದಶವಿಧ ಪರೀಕ್ಷೆಯನ್ನು ಸೆರೆಹಿಡಿಯುವ ವಿಸ್ತೃತ ಆಯುರ್ವೇದಿಕ್ ಇನ್‌ಟೇಕ್.", abhaId: "ABHA ID (ಐಚ್ಛಿಕ)", abhaHint: "ನಿಮ್ಮ ಆಯುಷ್ಮಾನ್ ಭಾರತ್ ಆರೋಗ್ಯ ಖಾತೆಯೊಂದಿಗೆ ಲಿಂಕ್ ಮಾಡಿ", abhaPlaceholder: "೧೪ ಅಂಕೆಗಳ ABHA ID ನಮೂದಿಸಿ", validate: "ಪರಿಶೀಲಿಸಿ", abhaValid: "ABHA ID ಯಶಸ್ವಿಯಾಗಿ ಪರಿಶೀಲಿಸಲಾಗಿದೆ", abhaInvalid: "ಪರಿಶೀಲಿಸಲು ಸಾಧ್ಯವಾಗಲಿಲ್ಲ. ABHA ಇಲ್ಲದೆ ಮುಂದುವರಿಯಬಹುದು.", registerNew: "ಹೊಸ ರೋಗಿಯಾಗಿ ನೋಂದಾಯಿಸಿ", privacyConsent: "ಗೌಪ್ಯತೆ ಮತ್ತು ಒಪ್ಪಿಗೆ", consentHint: "DPDP ಕಾಯ್ದೆ 2023 ರ ಅಡಿಯಲ್ಲಿ ಅಗತ್ಯ", consentText: "ಮುಂದುವರಿಯುವ ಮೂಲಕ, ನೀವು ಕೆಳಗಿನವುಗಳಿಗೆ ಒಪ್ಪಿಗೆ ನೀಡುತ್ತೀರಿ:", consentVoice: "ಕ್ಲಿನಿಕಲ್ ಇತಿಹಾಸ ಪಡೆಯಲು ಧ್ವನಿ ರೆಕಾರ್ಡಿಂಗ್ ಮತ್ತು AI ಟ್ರಾನ್ಸ್‌ಕ್ರಿಪ್ಷನ್", consentOCR: "ಅಪ್‌ಲೋಡ್ ಮಾಡಿದ ವೈದ್ಯಕೀಯ ದಾಖಲೆಗಳ OCR ಪ್ರಕ್ರಿಯೆ", consentSummary: "ಸಂಘಟಿತ ಕ್ಲಿನಿಕಲ್ ಇತಿಹಾಸ ರಚನೆ ಮತ್ತು ನಿಮ್ಮ ವೈದ್ಯರೊಂದಿಗೆ ಹಂಚಿಕೊಳ್ಳುವಿಕೆ", consentPrivacy: "DPDP ಕಾಯ್ದೆ 2023 ಮತ್ತು ABDM ಒಪ್ಪಿಗೆ ಫ್ರೇಮ್‌ವರ್ಕ್‌ನೊಂದಿಗೆ ಹೊಂದಿಕೆಯಾಗುವ ಸುರಕ್ಷಿತ ಸಂಗ್ರಹಣೆ", consentCheckbox: "ನಾನು ಅರ್ಥಮಾಡಿಕೊಂಡಿದ್ದೇನೆ, ನನ್ನ ಒಪ್ಪಿಗೆಯನ್ನು ನೀಡುತ್ತೇನೆ", beginHistory: "ಕ್ಲಿನಿಕಲ್ ಇತಿಹಾಸ ಪ್ರಾರಂಭಿಸಿ", adaptiveInterview: "ಹೊಂದಿಕೊಳ್ಳುವ ಸಂದರ್ಶನ", adaptiveDesc: "AI SOCRATES ಕ್ಲಿನಿಕಲ್ ಫ್ರೇಮ್‌ವರ್ಕ್ ಆಧಾರದ ಮೇಲೆ ಬುದ್ಧಿವಂತ ಫಾಲೋ-ಅಪ್ ಪ್ರಶ್ನೆಗಳನ್ನು ಕೇಳುತ್ತದೆ.", voiceTouch: "ಧ್ವನಿ + ಟಚ್", voiceTouchDesc: "ನಿಮ್ಮ ಆದ್ಯತೆಯ ಭಾಷೆಯಲ್ಲಿ ಮಾತನಾಡುವ ಮೂಲಕ ಅಥವಾ ಮಲ್ಟಿ-ಚಾಯ್ಸ್ ಆಯ್ಕೆಗಳನ್ನು ಟ್ಯಾಪ್ ಮಾಡುವ ಮೂಲಕ ಉತ್ತರಿಸಿ.", physicianReady: "ವೈದ್ಯರು-ಸಿದ್ಧ", physicianReadyDesc: "ಸಮಾಲೋಚನೆಗೆ ಮೊದಲು ಸಂಘಟಿತ ಕ್ಲಿನಿಕಲ್ ಸಾರಾಂಶ ಪಡೆಯಿರಿ.", backToHub: "MediKiosk ಗೆ ಹಿಂತಿರುಗಿ", progress: "ಪ್ರಗತಿ", redFlagAlert: "ರೆಡ್ ಫ್ಲ್ಯಾಗ್ ಎಚ್ಚರಿಕೆ", redFlagDesc: "ಆದ್ಯತೆಯ ಎಚ್ಚರಿಕೆಯನ್ನು ಟ್ರೈಜ್ ಸಿಬ್ಬಂದಿಗೆ ಕಳುಹಿಸಲಾಗಿದೆ.", whatBringsYou: "ಇಂದು ನೀವು ಯಾಕೆ ಬಂದಿರುವಿರಿ?", selectSymptom: "ನಿಮ್ಮ ಮುಖ್ಯ ಲಕ್ಷಣ ಅಥವಾ ದೂರು ಆಯ್ಕೆಮಾಡಿ", symptomDetails: "ಲಕ್ಷಣಗಳ ವಿವರಗಳು", ayushAssessment: "ಆಯುಷ್ ಮೌಲ್ಯಮಾಪನ", generalHistory: "ಸಾಮಾನ್ಯ ಇತಿಹಾಸ", questionOf: "ಪ್ರಶ್ನೆ", typeOrVoice: "ನಿಮ್ಮ ಉತ್ತರವನ್ನು ಟೈಪ್ ಮಾಡಿ ಅಥವಾ ಧ್ವನಿ ಇನ್‌ಪುಟ್ ಬಳಸಿ", voiceInput: "ಧ್ವನಿ ಇನ್‌ಪುಟ್", recording: "ರೆಕಾರ್ಡಿಂಗ್... ನಿಲ್ಲಿಸಲು ಟ್ಯಾಪ್ ಮಾಡಿ", tapToStop: "ನಿಲ್ಲಿಸಲು ಟ್ಯಾಪ್ ಮಾಡಿ", transcribing: "ಟ್ರಾನ್ಸ್‌ಕ್ರೈಬ್ ಆಗುತ್ತಿದೆ...", tapMic: "ನಿಮ್ಮ ಸ್ವಂತ ಪದಗಳಲ್ಲಿ ಉತ್ತರವನ್ನು ರೆಕಾರ್ಡ್ ಮಾಡಲು ಮೈಕ್ ಟ್ಯಾಪ್ ಮಾಡಿ", submitAnswer: "ಉತ್ತರ ಸಲ್ಲಿಸಿ", nextSection: "ಮುಂದಿನ ವಿಭಾಗ", previous: "ಹಿಂದಿನ", mild: "ಹಗುರ", severe: "ತೀವ್ರ", severity: "ತೀವ್ರತೆ", typeAnswer: "ನಿಮ್ಮ ಉತ್ತರವನ್ನು ಇಲ್ಲಿ ಟೈಪ್ ಮಾಡಿ...", reviewAnswers: "ನಿಮ್ಮ ಉತ್ತರಗಳನ್ನು ಪರಿಶೀಲಿಸಿ", reviewSubtitle: "ಕ್ಲಿನಿಕಲ್ ಸಾರಾಂಶ ರಚಿಸುವ ಮೊದಲು ಇತಿಹಾಸವನ್ನು ಪರಿಶೀಲಿಸಿ", chiefComplaintLabel: "ಮುಖ್ಯ ದೂರು", completenessScore: "ಸಂಪೂರ್ಣತಾ ಸ್ಕೋರ್", generateSummary: "ಕ್ಲಿನಿಕಲ್ ಸಾರಾಂಶ ರಚಿಸಿ", generatingSummary: "ಸಾರಾಂಶ ರಚಿಸಲಾಗುತ್ತಿದೆ...", considerMoreDetails: "ಹೆಚ್ಚು ಸಂಪೂರ್ಣ ಇತಿಹಾಸಕ್ಕಾಗಿ ಹಿಂದಿರುಗಿ ಹೆಚ್ಚಿನ ವಿವರಗಳನ್ನು ನೀಡಿ.", chestPain: "ಎದೆ ನೋವು", breathlessness: "ಉಸಿರಾಟ ತೊಂದರೆ", headache: "ತಲೆನೋವು", abdominalPain: "ಹೊಟ್ಟೆ ನೋವು", jointPain: "ಕೀಲು ನೋವು", fever: "ಜ್ವರ", fatigue: "ಆಯಾಸ", cough: "ಕೆಮ್ಮು", dizziness: "ತಲೆ ಸುತ್ತು", skinIssues: "ಚರ್ಮ ಸಮಸ್ಯೆಗಳು", moodChanges: "ಮನಸ್ಥಿತಿ ಬದಲಾವಣೆಗಳು", digestiveIssues: "ಜೀರ್ಣಕಾರಿ ಸಮಸ್ಯೆಗಳು", other: "ಇತರೆ", onset: "ಆರಂಭ", character: "ಸ್ವಭಾವ", radiation: "ವ್ಯಾಪ್ತಿ", associated: "ಸಂಬಂಧಿತ ಲಕ್ಷಣಗಳು", timing: "ಸಮಯ", exacerbating: "ಹದಗೆಡಿಸುವ ಅಂಶಗಳು", relieving: "ಪರಿಹಾರ ನೀಡುವ ಅಂಶಗಳು", severityScale: "ತೀವ್ರತೆ", pastMedical: "ಹಿಂದಿನ ವೈದ್ಯಕೀಯ ಇತಿಹಾಸ", pastSurgical: "ಹಿಂದಿನ ಶಸ್ತ್ರಚಿಕಿತ್ಸೆ ಇತಿಹಾಸ", currentMeds: "ಪ್ರಸ್ತುತ ಔಷಧಿಗಳು", allergies: "ಅಲರ್ಜಿಗಳು", familyHistory: "ಕುಟುಂಬ ಇತಿಹಾಸ", smoking: "ಧೂಮಪಾನ", alcohol: "ಮದ್ಯಪಾನ", occupation: "ವೃತ್ತಿ", scanTitle: "ವೈದ್ಯಕೀಯ ದಾಖಲೆಗಳನ್ನು ಸ್ಕ್ಯಾನ್ ಮಾಡಿ", scanSubtitle: "ಪ್ರಿಸ್ಕ್ರಿಪ್ಷನ್‌ಗಳು, ಲ್ಯಾಬ್ ವರದಿಗಳು, ಡಿಸ್ಚಾರ್ಜ್ ಸಾರಾಂಶಗಳನ್ನು ಅಪ್‌ಲೋಡ್ ಮಾಡಿ", dropzone: "ದಾಖಲೆಗಳನ್ನು ಇಲ್ಲಿ ಬಿಡಿ", dropzoneHint: "ಚಿತ್ರಗಳು ಮತ್ತು PDF ಗಳಿಗೆ ಬೆಂಬಲ", chooseFiles: "ಫೈಲ್‌ಗಳನ್ನು ಆಯ್ಕೆಮಾಡಿ", ocrExtract: "OCR ಎಕ್ಸ್‌ಟ್ರಾಕ್ಟ್", processed: "ಪ್ರಕ್ರಿಯೆಗೊಳಿಸಲಾಗಿದೆ", processing: "ಪ್ರಕ್ರಿಯೆ ನಡೆಯುತ್ತಿದೆ", uploadedDocuments: "ಅಪ್‌ಲೋಡ್ ಮಾಡಿದ ದಾಖಲೆಗಳು", skipToSummary: "ಬಿಟ್ಟುಬಿಡಿ — ಸಾರಾಂಶ ರಚಿಸಿ", generateClinicalSummary: "ಕ್ಲಿನಿಕಲ್ ಸಾರಾಂಶ ರಚಿಸಿ", physicianReadySummary: "ವೈದ್ಯರು-ಸಿದ್ಧ ಸಾರಾಂಶ", generatedFor: "ಗಾಗಿ ರಚಿಸಲಾಗಿದೆ", completeness: "ಸಂಪೂರ್ಣತೆ", redFlagsDetected: "ರೆಡ್ ಫ್ಲ್ಯಾಗ್‌ಗಳು ಪತ್ತೆ", hpi: "ಪ್ರಸ್ತುತ ಅನಾರೋಗ್ಯ ಇತಿಹಾಸ", pastMedicalLabel: "ಹಿಂದಿನ ವೈದ್ಯಕೀಯ ಇತಿಹಾಸ", currentMedications: "ಪ್ರಸ್ತುತ ಔಷಧಿಗಳು", allergyLabel: "ಅಲರ್ಜಿ ಇತಿಹಾಸ", familyHistoryLabel: "ಕುಟುಂಬ ಇತಿಹಾಸ", personalHistory: "ವೈಯಕ್ತಿಕ ಇತಿಹಾಸ", priorInvestigations: "ಹಿಂದಿನ ಪರಿಶೀಲನೆಗಳು", aiSummary: "AI-ರಚಿತ ಕ್ಲಿನಿಕಲ್ ಸಾರಾಂಶ", aiDisclaimer: "ಈ ಸಾರಾಂಶ AI-ರಚಿತವಾಗಿದೆ ಮತ್ತು ಕ್ಲಿನಿಕಲ್ ಸಹಾಯಕವಾಗಿ ಉದ್ದೇಶಿಸಲಾಗಿದೆ.", printSummary: "ಸಾರಾಂಶ ಪ್ರಿಂಟ್ ಮಾಡಿ", sendToPhysician: "ವೈದ್ಯರಿಗೆ ಕಳುಹಿಸಿ", physicianNotified: "ವೈದ್ಯರಿಗೆ ತಿಳಿಸಲಾಗಿದೆ ✓", intakeComplete: "ಕ್ಲಿನಿಕಲ್ ಇನ್‌ಟೇಕ್ ಪೂರ್ಣಗೊಂಡಿದೆ!", intakeCompleteDesc: "ನಿಮ್ಮ ಸಂಘಟಿತ ಕ್ಲಿನಿಕಲ್ ಇತಿಹಾಸವನ್ನು ರಚಿಸಲಾಗಿದೆ.", returnToDashboard: "ಡ್ಯಾಶ್‌ಬೋರ್ಡ್‌ಗೆ ಹಿಂತಿರುಗಿ", consentDPDP: "DPDP ಕಾಯ್ದೆ 2023 ರ ಅಡಿಯಲ್ಲಿ ಒಪ್ಪಿಗೆ", phaseChiefComplaint: "ಮುಖ್ಯ ದೂರು", phaseSymptomDetails: "ಲಕ್ಷಣಗಳ ವಿವರಗಳು", phaseAyushAssessment: "ಆಯುಷ್ ಮೌಲ್ಯಮಾಪನ", phaseGeneralHistory: "ಸಾಮಾನ್ಯ ಇತಿಹಾಸ", phaseReview: "ಪರಿಶೀಲನೆ", consentByProceeding: "ಮುಂದುವರಿಯುವ ಮೂಲಕ, ನೀವು ಕೆಳಗಿನವುಗಳಿಗೆ ಒಪ್ಪಿಗೆ ನೀಡುತ್ತೀರಿ:", consentListVoice: "ಕ್ಲಿನಿಕಲ್ ಇತಿಹಾಸಕ್ಕಾಗಿ ಧ್ವನಿ ರೆಕಾರ್ಡಿಂಗ್", consentListOCR: "ಅಪ್‌ಲೋಡ್ ಮಾಡಿದ ದಾಖಲೆಗಳ OCR ಪ್ರಕ್ರಿಯೆ", consentListSummary: "ಸಂಘಟಿತ ಕ್ಲಿನಿಕಲ್ ಇತಿಹಾಸ ರಚನೆ", consentListPrivacy: "DPDP ಕಾಯ್ದೆ 2023 ರೊಂದಿಗೆ ಹೊಂದಿಕೆಯಾಗುವ ಸುರಕ್ಷಿತ ಸಂಗ್ರಹಣೆ", navDashboard: "ಡ್ಯಾಶ್‌ಬೋರ್ಡ್", navMediKiosk: "MediKiosk ಇನ್‌ಟೇಕ್", navAyurVoxara: "ಆಯುರ್ವೋಕ್ಸಾರಾ", navRecordLive: "ಲೈವ್ ರೆಕಾರ್ಡ್", navHistory: "ಇತಿಹಾಸ", navTrends: "ಟ್ರೆಂಡ್‌ಗಳು", navAIAnalysis: "AI ವಿಶ್ಲೇಷಣೆ", navMLInsights: "ML ಅಂತರ್ದೃಷ್ಟಿ", navAppointments: "ಅಪಾಯಿಂಟ್‌ಮೆಂಟ್‌ಗಳು", navSOS: "🚨 SOS ತುರ್ತು", navIntakeReview: "ಇನ್‌ಟೇಕ್ ಪರಿಶೀಲನೆಗಳು", navAYUSHDashboard: "🌿 AYUSH ಡ್ಯಾಶ್‌ಬೋರ್ಡ್", navLiveAlerts: "ಲೈವ್ ಎಚ್ಚರಿಕೆಗಳು", navMedication: "ಔಷಧಿ ಪ್ರವಾಹ", switchToAYUSH: "AYUSH ಗೆ ಬದಲಾಯಿಸಿ", switchToAllopathic: "ಎಲ್ಲೋಪ್ಯಾಥಿಕ್ ಗೆ ಬದಲಾಯಿಸಿ", newLiveSample: "ಹೊಸ ಲೈವ್ ನಮೂನೆ", signOut: "ಸೈನ್ ಔಟ್", realtimeActive: "ರಿಯಲ್‌ಟೈಮ್ ಸಕ್ರಿಯ", dashWelcome: "ಮರಳಿ ಸ್ವಾಗತ", dashSubtitle: "ನಿಮ್ಮ ಆರೋಗ್ಯ ಅವಲೋಕನ ಒಂದೇ ನೋಟದಲ್ಲಿ", dashRecentSessions: "ಇತ್ತೀಚಿನ ಸೆಶನ್‌ಗಳು", dashHealthScore: "ಆರೋಗ್ಯ ಸ್ಕೋರ್", dashVoiceClarity: "ಧ್ವನಿ ಸ್ಪಷ್ಟತೆ", dashLastSession: "ಕೊನೆಯ ಸೆಶನ್", dashNoSessions: "ಇನ್ನೂ ಯಾವುದೇ ಸೆಶನ್‌ಗಳು ದಾಖಲಾಗಿಲ್ಲ", dashRecordFirst: "ಪ್ರಾರಂಭಿಸಲು ನಿಮ್ಮ ಮೊದಲ ಧ್ವನಿ ನಮೂನೆಯನ್ನು ರೆಕಾರ್ಡ್ ಮಾಡಿ", dashViewAll: "ಎಲ್ಲಾ ನೋಡಿ", dashTodaysMedications: "ಇಂದಿನ ಔಷಧಿಗಳು", dashUpcomingAppts: "ಮುಂಬರುವ ಅಪಾಯಿಂಟ್‌ಮೆಂಟ್‌ಗಳು", dashNoAppts: "ಮುಂಬರುವ ಅಪಾಯಿಂಟ್‌ಮೆಂಟ್‌ಗಳು ಇಲ್ಲ", chatHealthBot: "ಹೆಲ್ತ್‌ಬಾಟ್", chatAyurBot: "ಆಯುರ್‌ಬಾಟ್", chatGeneralHealth: "ಸಾಮಾನ್ಯ ಆರೋಗ್ಯ", chatSymptomChecker: "ಲಕ್ಷಣ ಪರಿಶೀಲಕ", chatHealthInfo: "ಆರೋಗ್ಯ ಮಾಹಿತಿ", chatLearnAyurveda: "ಆಯುರ್ವೇದ ಕಲಿಯಿರಿ", chatAssessment: "ಮೌಲ್ಯಮಾಪನ", chatPractitioner: "ವೈದ್ಯರು", chatThinking: "ಯೋಚಿಸುತ್ತಿದ್ದಾರೆ...", chatPlaceholderHealth: "ನಿಮ್ಮ ಆರೋಗ್ಯದ ಬಗ್ಗೆ ಕೇಳಿ...", chatPlaceholderAyush: "ಆಯುರ್ವೇದದ ಬಗ್ಗೆ ಕೇಳಿ...", chatMute: "ಮ್ಯೂಟ್", chatReadAloud: "ಜೋರಾಗಿ ಓದಿ", langEnglish: "English", langHindi: "हिन्दी", langTamil: "தமிழ்", langTelugu: "తెలుగు", langBengali: "বাংলা", langMarathi: "मराठी", langGujarati: "ગુજરાતી", langKannada: "ಕನ್ನಡ", langMalayalam: "മലയാളം", langPunjabi: "ਪੰਜਾਬੀ",
  } as TranslationSet,

  ml: {
    heroTitle1: "AI-അധിഷ്ഠിത ക്ലിനിക്കൽ", heroTitle2: "ചരിത്രം എടുക്കൽ", heroSubtitle: "കൺസൾട്ടേഷൻ മുറിയിൽ പ്രവേശിക്കുന്നതിന് മുമ്പ്, സംഭാഷണവും ഗൈഡഡ് ടച്ച്‌സ്‌ക്രീനും വഴി 5 മിനിറ്റിനുള്ളിൽ നിങ്ങളുടെ മെഡിക്കൽ ചരിത്രം പൂർത്തിയാക്കുക.", statIntake: "പൂർണ്ണ ഇൻ‌ടേക്ക്", statVoice: "ഡ്യുവൽ മോഡ് ഇൻപുട്ട്", statPhysician: "സംഘടിത സംഗ്രഹം", journeyTitle: "രോഗി യാത്ര", selectLanguage: "ഭാഷ തിരഞ്ഞെടുക്കുക", selectLanguageHint: "അഭിമുഖത്തിനായി നിങ്ങളുടെ ഇഷ്ടപ്പെട്ട ഭാഷ തിരഞ്ഞെടുക്കുക", intakeMode: "ഇൻ‌ടേക്ക് മോഡ്", intakeModeHint: "ക്ലിനിക്കൽ ചരിത്ര ഫ്രെയിംവർക്ക് തിരഞ്ഞെടുക്കുക", allopathicMode: "അലോപ്പതിക് ചരിത്രം", allopathicDesc: "SOCRATES ഫ്രെയിംവർക്ക് ഉപയോഗിച്ചുള്ള മാനദണ്ഡ ക്ലിനിക്കൽ ചരിത്രം.", ayushMode: "ആയുഷ് ചരിത്രം (ആയുർവേദം)", ayushDesc: "ദശവിധ പരീക്ഷ ഉൾക്കൊള്ളുന്ന വിപുലമായ ആയുർവേദിക് ഇൻ‌ടേക്ക്.", abhaId: "ABHA ID (ഓപ്ഷണൽ)", abhaHint: "നിങ്ങളുടെ ആയുഷ്മാൻ ഭാരത് ഹെൽത്ത് അക്കൗണ്ടുമായി ലിങ്ക് ചെയ്യുക", abhaPlaceholder: "14 അക്കങ്ങളുള്ള ABHA ID നൽകുക", validate: "പരിശോധിക്കുക", abhaValid: "ABHA ID വിജയകരമായി പരിശോധിച്ചു", abhaInvalid: "പരിശോധിക്കാൻ കഴിഞ്ഞില്ല. ABHA ഇല്ലാതെയും തുടരാം.", registerNew: "പുതിയ രോഗിയായി രജിസ്റ്റർ ചെയ്യുക", privacyConsent: "സ്വകാര്യതയും സമ്മതിയും", consentHint: "DPDP ആക്ട് 2023 പ്രകാരം ആവശ്യമാണ്", consentText: "തുടരുന്നതിലൂടെ, നിങ്ങൾ താഴെപ്പറയുന്നവയ്ക്ക് സമ്മതിക്കുന്നു:", consentVoice: "ക്ലിനിക്കൽ ചരിത്രം എടുക്കുന്നതിനുള്ള വോയ്സ് റെക്കോർഡിംഗും AI ട്രാൻസ്ക്രിപ്ഷനും", consentOCR: "അപ്‌ലോഡ് ചെയ്ത മെഡിക്കൽ രേഖകളുടെ OCR പ്രോസസ്സിംഗ്", consentSummary: "സംഘടിത ക്ലിനിക്കൽ ചരിത്ര സൃഷ്ടിയും നിങ്ങളുടെ ഡോക്ടറുമായി ഷെയറിംഗും", consentPrivacy: "DPDP ആക്ട് 2023 ഉം ABDM സമ്മതി ഫ്രെയിംവർക്കും അനുസൃതമായ സുരക്ഷിത സംഭരണം", consentCheckbox: "ഞാൻ മനസ്സിലാക്കി, എന്റെ സമ്മതി നൽകുന്നു", beginHistory: "ക്ലിനിക്കൽ ചരിത്രം ആരംഭിക്കുക", adaptiveInterview: "അഡാപ്റ്റീവ് അഭിമുഖം", adaptiveDesc: "AI SOCRATES ക്ലിനിക്കൽ ഫ്രെയിംവർക്കിന്റെ അടിസ്ഥാനത്തിൽ ബുദ്ധിപരമായ ഫോളോ-അപ്പ് ചോദ്യങ്ങൾ ചോദിക്കുന്നു.", voiceTouch: "വോയ്സ് + ടച്ച്", voiceTouchDesc: "നിങ്ങളുടെ ഇഷ്ടപ്പെട്ട ഭാഷയിൽ സംസാരിക്കുകയോ മൾട്ടി-ചോയിസ് ഓപ്ഷനുകൾ ടാപ്പ് ചെയ്യുകയോ ചെയ്ത് ഉത്തരം നൽകുക.", physicianReady: "ഡോക്ടർ-റെഡി", physicianReadyDesc: "കൺസൾട്ടേഷന് മുമ്പ് സംഘടിത ക്ലിനിക്കൽ സംഗ്രഹം നേടുക.", backToHub: "MediKiosk-ലേക്ക് തിരികെ", progress: "പുരോഗതി", redFlagAlert: "റെഡ് ഫ്ലാഗ് അലർട്ട്", redFlagDesc: "മുൻ‌ഗണന അലർട്ട് ട്രയേജ് ജീവനക്കാർക്ക് അയച്ചു.", whatBringsYou: "ഇന്ന് നിങ്ങൾ എന്തിനാണ് വന്നത്?", selectSymptom: "നിങ്ങളുടെ പ്രധാന ലക്ഷണമോ പരാതിയോ തിരഞ്ഞെടുക്കുക", symptomDetails: "ലക്ഷണങ്ങളുടെ വിശദാംശങ്ങൾ", ayushAssessment: "ആയുഷ് വിലയിരുത്തൽ", generalHistory: "പൊതു ചരിത്രം", questionOf: "ചോദ്യം", typeOrVoice: "നിങ്ങളുടെ ഉത്തരം ടൈപ്പ് ചെയ്യുക അല്ലെങ്കിൽ വോയ്സ് ഇൻപുട്ട് ഉപയോഗിക്കുക", voiceInput: "വോയ്സ് ഇൻപുട്ട്", recording: "റെക്കോർഡിംഗ്... നിർത്താൻ ടാപ്പ് ചെയ്യുക", tapToStop: "നിർത്താൻ ടാപ്പ് ചെയ്യുക", transcribing: "ട്രാൻസ്ക്രൈബ് ചെയ്യുന്നു...", tapMic: "നിങ്ങളുടെ സ്വന്തം വാക്കുകളിൽ ഉത്തരം റെക്കോർഡ് ചെയ്യാൻ മൈക്ക് ടാപ്പ് ചെയ്യുക", submitAnswer: "ഉത്തരം സമർപ്പിക്കുക", nextSection: "അടുത്ത വിഭാഗം", previous: "മുമ്പത്തേത്", mild: "നേരിയത്", severe: "തീവ്രം", severity: "തീവ്രത", typeAnswer: "നിങ്ങളുടെ ഉത്തരം ഇവിടെ ടൈപ്പ് ചെയ്യുക...", reviewAnswers: "നിങ്ങളുടെ ഉത്തരങ്ങൾ അവലോകനം ചെയ്യുക", reviewSubtitle: "ക്ലിനിക്കൽ സംഗ്രഹം സൃഷ്ടിക്കുന്നതിന് മുമ്പ് ചരിത്രം അവലോകനം ചെയ്യുക", chiefComplaintLabel: "പ്രധാന പരാതി", completenessScore: "സമ്പൂർണ്ണത സ്കോർ", generateSummary: "ക്ലിനിക്കൽ സംഗ്രഹം സൃഷ്ടിക്കുക", generatingSummary: "സംഗ്രഹം സൃഷ്ടിക്കുന്നു...", considerMoreDetails: "കൂടുതൽ സമ്പൂർണ്ണ ചരിത്രത്തിനായി പിന്നിലേക്ക് പോയി കൂടുതൽ വിശദാംശങ്ങൾ നൽകുക.", chestPain: "നെഞ്ച് വേദന", breathlessness: "ശ്വാസതടസ്സം", headache: "തലവേദന", abdominalPain: "വയറ് വേദന", jointPain: "സന്ധി വേദന", fever: "പനി", fatigue: "ക്ഷീണം", cough: "ചുമ", dizziness: "തല കറക്കം", skinIssues: "ത്വക്ക് പ്രശ്നങ്ങൾ", moodChanges: "മൂഡ് മാറ്റങ്ങൾ", digestiveIssues: "ജീർണ പ്രശ്നങ്ങൾ", other: "മറ്റുള്ളവ", onset: "ആരംഭം", character: "സ്വഭാവം", radiation: "വ്യാപനം", associated: "ബന്ധമുള്ള ലക്ഷണങ്ങൾ", timing: "സമയം", exacerbating: "മോശമാക്കുന്ന ഘടകങ്ങൾ", relieving: "ശമനം നൽകുന്ന ഘടകങ്ങൾ", severityScale: "തീവ്രത", pastMedical: "മുമ്പത്തെ മെഡിക്കൽ ചരിത്രം", pastSurgical: "മുമ്പത്തെ ശസ്ത്രക്രിയ ചരിത്രം", currentMeds: "നിലവിലെ മരുന്നുകൾ", allergies: "അലർജികൾ", familyHistory: "കുടുംബ ചരിത്രം", smoking: "പുകവലി", alcohol: "മദ്യപാനം", occupation: "തൊഴിൽ", scanTitle: "മെഡിക്കൽ രേഖകൾ സ്കാൻ ചെയ്യുക", scanSubtitle: "കുറിപ്പുകൾ, ലാബ് റിപ്പോർട്ടുകൾ, ഡിസ്ചാർജ് സംഗ്രഹങ്ങൾ അപ്‌ലോഡ് ചെയ്യുക", dropzone: "രേഖകൾ ഇവിടെ വിടുക", dropzoneHint: "ചിത്രങ്ങളും PDF-കളും പിന്തുണയ്ക്കുന്നു", chooseFiles: "ഫയലുകൾ തിരഞ്ഞെടുക്കുക", ocrExtract: "OCR എക്സ്ട്രാക്റ്റ്", processed: "പ്രോസസ്സ് ചെയ്തു", processing: "പ്രോസസ്സിംഗ്", uploadedDocuments: "അപ്‌ലോഡ് ചെയ്ത രേഖകൾ", skipToSummary: "ഒഴിവാക്കുക — സംഗ്രഹം സൃഷ്ടിക്കുക", generateClinicalSummary: "ക്ലിനിക്കൽ സംഗ്രഹം സൃഷ്ടിക്കുക", physicianReadySummary: "ഡോക്ടർ-റെഡി സംഗ്രഹം", generatedFor: "വേണ്ടി സൃഷ്ടിച്ചത്", completeness: "സമ്പൂർണ്ണത", redFlagsDetected: "റെഡ് ഫ്ലാഗുകൾ കണ്ടെത്തി", hpi: "നിലവിലെ അസുഖ ചരിത്രം", pastMedicalLabel: "മുമ്പത്തെ മെഡിക്കൽ ചരിത്രം", currentMedications: "നിലവിലെ മരുന്നുകൾ", allergyLabel: "അലർജി ചരിത്രം", familyHistoryLabel: "കുടുംബ ചരിത്രം", personalHistory: "വ്യക്തിഗത ചരിത്രം", priorInvestigations: "മുമ്പത്തെ പരിശോധനകൾ", aiSummary: "AI-സൃഷ്ടിച്ച ക്ലിനിക്കൽ സംഗ്രഹം", aiDisclaimer: "ഈ സംഗ്രഹം AI-സൃഷ്ടിച്ചതും ക്ലിനിക്കൽ സഹായമായി ഉദ്ദേശിച്ചതുമാണ്.", printSummary: "സംഗ്രഹം പ്രിൻറ് ചെയ്യുക", sendToPhysician: "ഡോക്ടറിലേക്ക് അയയ്ക്കുക", physicianNotified: "ഡോക്ടറെ അറിയിച്ചു ✓", intakeComplete: "ക്ലിനിക്കൽ ഇൻ‌ടേക്ക് പൂർത്തിയായി!", intakeCompleteDesc: "നിങ്ങളുടെ സംഘടിത ക്ലിനിക്കൽ ചരിത്രം സൃഷ്ടിച്ചു.", returnToDashboard: "ഡാഷ്‌ബോർഡിലേക്ക് തിരികെ", consentDPDP: "DPDP ആക്ട് 2023 പ്രകാരം സമ്മതി", phaseChiefComplaint: "പ്രധാന പരാതി", phaseSymptomDetails: "ലക്ഷണങ്ങളുടെ വിശദാംശങ്ങൾ", phaseAyushAssessment: "ആയുഷ് വിലയിരുത്തൽ", phaseGeneralHistory: "പൊതു ചരിത്രം", phaseReview: "അവലോകനം", consentByProceeding: "തുടരുന്നതിലൂടെ, നിങ്ങൾ താഴെപ്പറയുന്നവയ്ക്ക് സമ്മതിക്കുന്നു:", consentListVoice: "ക്ലിനിക്കൽ ചരിത്രത്തിനുള്ള വോയ്സ് റെക്കോർഡിംഗ്", consentListOCR: "അപ്‌ലോഡ് ചെയ്ത രേഖകളുടെ OCR പ്രോസസ്സിംഗ്", consentListSummary: "സംഘടിത ക്ലിനിക്കൽ ചരിത്ര സൃഷ്ടി", consentListPrivacy: "DPDP ആക്ട് 2023 അനുസൃതമായ സുരക്ഷിത സംഭരണം", navDashboard: "ഡാഷ്‌ബോർഡ്", navMediKiosk: "MediKiosk ഇൻ‌ടേക്ക്", navAyurVoxara: "ആയുർവോക്സാര", navRecordLive: "ലൈവ് റെക്കോർഡ്", navHistory: "ചരിത്രം", navTrends: "ട്രെൻഡുകൾ", navAIAnalysis: "AI വിശകലനം", navMLInsights: "ML ഉൾക്കാഴ്ച", navAppointments: "അപ്പോയിന്റ്‌മെന്റുകൾ", navSOS: "🚨 SOS അടിയന്തരം", navIntakeReview: "ഇൻ‌ടേക്ക് അവലോകനങ്ങൾ", navAYUSHDashboard: "🌿 AYUSH ഡാഷ്‌ബോർഡ്", navLiveAlerts: "ലൈവ് അലർട്ടുകൾ", navMedication: "മരുന്ന് ഫ്ലോ", switchToAYUSH: "AYUSH-ലേക്ക് മാറ്റുക", switchToAllopathic: "അലോപ്പതിക്കിലേക്ക് മാറ്റുക", newLiveSample: "പുതിയ ലൈവ് സാംപിൾ", signOut: "സൈൻ ഔട്ട്", realtimeActive: "റിയൽ‌ടൈം സജീവം", dashWelcome: "തിരികെ സ്വാഗതം", dashSubtitle: "നിങ്ങളുടെ ആരോഗ്യ അവലോകനം ഒരു നോട്ടത്തിൽ", dashRecentSessions: "സമീപകാല സെഷനുകൾ", dashHealthScore: "ആരോഗ്യ സ്കോർ", dashVoiceClarity: "വോയ്സ് വ്യക്തത", dashLastSession: "അവസാന സെഷൻ", dashNoSessions: "ഇതുവരെ സെഷനുകൾ രേഖപ്പെടുത്തിയിട്ടില്ല", dashRecordFirst: "ആരംഭിക്കാൻ നിങ്ങളുടെ ആദ്യ വോയ്സ് സാംപിൾ റെക്കോർഡ് ചെയ്യുക", dashViewAll: "എല്ലാം കാണുക", dashTodaysMedications: "ഇന്നത്തെ മരുന്നുകൾ", dashUpcomingAppts: "വരാനിരിക്കുന്ന അപ്പോയിന്റ്‌മെന്റുകൾ", dashNoAppts: "വരാനിരിക്കുന്ന അപ്പോയിന്റ്‌മെന്റുകൾ ഇല്ല", chatHealthBot: "ഹെൽത്ത്‌ബോട്ട്", chatAyurBot: "ആയുർബോട്ട്", chatGeneralHealth: "പൊതു ആരോഗ്യം", chatSymptomChecker: "ലക്ഷണ പരിശോധകൻ", chatHealthInfo: "ആരോഗ്യ വിവരം", chatLearnAyurveda: "ആയുർവേദം പഠിക്കുക", chatAssessment: "വിലയിരുത്തൽ", chatPractitioner: "പ്രാക്ടീഷണർ", chatThinking: "ചിന്തിക്കുന്നു...", chatPlaceholderHealth: "നിങ്ങളുടെ ആരോഗ്യത്തെക്കുറിച്ച് ചോദിക്കുക...", chatPlaceholderAyush: "ആയുർവേദത്തെക്കുറിച്ച് ചോദിക്കുക...", chatMute: "മ്യൂട്ട്", chatReadAloud: "ഉറക്കെ വായിക്കുക", langEnglish: "English", langHindi: "हिन्दी", langTamil: "தமிழ்", langTelugu: "తెలుగు", langBengali: "বাংলা", langMarathi: "मराठी", langGujarati: "ગુજરાતી", langKannada: "ಕನ್ನಡ", langMalayalam: "മലയാളം", langPunjabi: "ਪੰਜਾਬੀ",
  } as TranslationSet,

  pa: {
    heroTitle1: "AI-ਅਧਾਰਿਤ ਕਲੀਨਿਕਲ", heroTitle2: "ਇਤਿਹਾਸ ਲੈਣਾ", heroSubtitle: "ਸਲਾਹਕਾਰ ਕੋਠੇ ਵਿੱਚ ਦਾਖਲ ਹੋਣ ਤੋਂ ਪਹਿਲਾਂ, ਗੱਲਬਾਤ ਅਤੇ ਗਾਈਡਡ ਟਚਸਕ੍ਰੀਨ ਰਾਹੀਂ 5 ਮਿੰਟਾਂ ਵਿੱਚ ਆਪਣਾ ਮੈਡੀਕਲ ਇਤਿਹਾਸ ਪੂਰਾ ਕਰੋ।", statIntake: "ਪੂਰੀ ਇਨਟੇਕ", statVoice: "ਡੁਅਲ ਮੋਡ ਇਨਪੁੱਟ", statPhysician: "ਸੰਰਚਿਤ ਸਾਰ", journeyTitle: "ਮਰੀਜ਼ ਯਾਤਰਾ", selectLanguage: "ਭਾਸ਼ਾ ਚੁਣੋ", selectLanguageHint: "ਇੰਟਰਵਿਊ ਲਈ ਆਪਣੀ ਪਸੰਦੀਦਾ ਭਾਸ਼ਾ ਚੁਣੋ", intakeMode: "ਇਨਟੇਕ ਮੋਡ", intakeModeHint: "ਕਲੀਨਿਕਲ ਇਤਿਹਾਸ ਫ੍ਰੇਮਵਰਕ ਚੁਣੋ", allopathicMode: "ਐਲੋਪੈਥਿਕ ਇਤਿਹਾਸ", allopathicDesc: "SOCRATES ਫ੍ਰੇਮਵਰਕ ਦੀ ਵਰਤੋਂ ਨਾਲ ਮਿਆਰੀ ਕਲੀਨਿਕਲ ਇਤਿਹਾਸ।", ayushMode: "ਆਯੁਸ਼ ਇਤਿਹਾਸ (ਆਯੁਰਵੇਦ)", ayushDesc: "ਦਸ਼ਵਿਧ ਪਰੀਖਿਆ ਸਮੇਟਣ ਵਾਲਾ ਵਿਸਤ੍ਰਿਤ ਆਯੁਰਵੇਦਿਕ ਇਨਟੇਕ।", abhaId: "ABHA ID (ਵਿਕਲਪਕ)", abhaHint: "ਆਪਣੇ ਆਯੁਸ਼ਮਾਨ ਭਾਰਤ ਸਿਹਤ ਖਾਤੇ ਨਾਲ ਲਿੰਕ ਕਰੋ", abhaPlaceholder: "14 ਅੰਕਾਂ ਦਾ ABHA ID ਦਰਜ ਕਰੋ", validate: "ਜਾਂਚ ਕਰੋ", abhaValid: "ABHA ID ਸਫਲਤਾਪੂਰਵਕ ਜਾਂਚਿਆ", abhaInvalid: "ਜਾਂਚ ਨਹੀਂ ਹੋ ਸਕੀ। ABHA ਤੋਂ ਬਿਨਾਂ ਵੀ ਜਾਰੀ ਰੱਖ ਸਕਦੇ ਹੋ।", registerNew: "ਨਵੇਂ ਮਰੀਜ਼ ਵਜੋਂ ਰਜਿਸਟਰ ਕਰੋ", privacyConsent: "ਗੁਪਤਤਾ ਅਤੇ ਸਹਿਮਤੀ", consentHint: "DPDP ਐਕਟ 2023 ਹੇਠ ਲੋੜੀਂਦਾ", consentText: "ਅੱਗੇ ਵਧ ਕੇ, ਤੁਸੀਂ ਹੇਠ ਲਿਖੀਆਂ ਗੱਲਾਂ ਲਈ ਸਹਿਮਤੀ ਦਿੰਦੇ ਹੋ:", consentVoice: "ਕਲੀਨਿਕਲ ਇਤਿਹਾਸ ਲੈਣ ਲਈ ਵੌਇਸ ਰਿਕਾਰਡਿੰਗ ਅਤੇ AI ਟ੍ਰਾਂਸਕ੍ਰਿਪਸ਼ਨ", consentOCR: "ਅੱਪਲੋਡ ਕੀਤੇ ਮੈਡੀਕਲ ਦਸਤਾਵੇਜ਼ਾਂ ਦੀ OCR ਪ੍ਰੋਸੈਸਿੰਗ", consentSummary: "ਸੰਰਚਿਤ ਕਲੀਨਿਕਲ ਇਤਿਹਾਸ ਤਿਆਰੀ ਅਤੇ ਤੁਹਾਡੇ ਡਾਕਟਰ ਨਾਲ ਸਾਂਝਾ ਕਰਨਾ", consentPrivacy: "DPDP ਐਕਟ 2023 ਅਤੇ ABDM ਸਹਿਮਤੀ ਫ੍ਰੇਮਵਰਕ ਨਾਲ ਅਨੁਸਾਰ ਸੁਰੱਖਿਅਤ ਸਟੋਰੇਜ", consentCheckbox: "ਮੈਂ ਸਮਝ ਗਿਆ ਹਾਂ, ਮੈਂ ਆਪਣੀ ਸਹਿਮਤੀ ਦਿੰਦਾ ਹਾਂ", beginHistory: "ਕਲੀਨਿਕਲ ਇਤਿਹਾਸ ਸ਼ੁਰੂ ਕਰੋ", adaptiveInterview: "ਅਨੁਕੂਲ ਇੰਟਰਵਿਊ", adaptiveDesc: "AI SOCRATES ਕਲੀਨਿਕਲ ਫ੍ਰੇਮਵਰਕ ਦੇ ਅਧਾਰ 'ਤੇ ਸਮਝਦਾਰ ਫਾਲੋ-ਅੱਪ ਸਵਾਲ ਪੁੱਛਦਾ ਹੈ।", voiceTouch: "ਵੌਇਸ + ਟੱਚ", voiceTouchDesc: "ਆਪਣੀ ਪਸੰਦੀਦਾ ਭਾਸ਼ਾ ਵਿੱਚ ਬੋਲ ਕੇ ਜਾਂ ਮਲਟੀ-ਚੌਇਸ ਵਿਕਲਪਾਂ ਨੂੰ ਟੈਪ ਕਰ ਕੇ ਜਵਾਬ ਦਿਓ।", physicianReady: "ਡਾਕਟਰ-ਤਿਆਰ", physicianReadyDesc: "ਸਲਾਹ ਤੋਂ ਪਹਿਲਾਂ ਸੰਰਚਿਤ ਕਲੀਨਿਕਲ ਸਾਰ ਪ੍ਰਾਪਤ ਕਰੋ।", backToHub: "MediKiosk ਤੇ ਵਾਪਸ ਜਾਓ", progress: "ਪ੍ਰਗਤੀ", redFlagAlert: "ਰੈੱਡ ਫਲੈਗ ਅਲਰਟ", redFlagDesc: "ਪਹਿਲ ਅਲਰਟ ਟ੍ਰਾਈਜ ਸਟਾਫ ਨੂੰ ਭੇਜਿਆ।", whatBringsYou: "ਅੱਜ ਤੁਸੀਂ ਕਿਉਂ ਆਏ ਹੋ?", selectSymptom: "ਆਪਣਾ ਮੁੱਖ ਲੱਛਣ ਜਾਂ ਸ਼ਿਕਾਇਤ ਚੁਣੋ", symptomDetails: "ਲੱਛਣਾਂ ਦੇ ਵੇਰਵੇ", ayushAssessment: "ਆਯੁਸ਼ ਮੁਲਾਂਕਨ", generalHistory: "ਆਮ ਇਤਿਹਾਸ", questionOf: "ਸਵਾਲ", typeOrVoice: "ਆਪਣਾ ਜਵਾਬ ਟਾਈਪ ਕਰੋ ਜਾਂ ਵੌਇਸ ਇਨਪੁੱਟ ਦੀ ਵਰਤੋਂ ਕਰੋ", voiceInput: "ਵੌਇਸ ਇਨਪੁੱਟ", recording: "ਰਿਕਾਰਡਿੰਗ... ਰੋਕਣ ਲਈ ਟੈਪ ਕਰੋ", tapToStop: "ਰੋਕਣ ਲਈ ਟੈਪ ਕਰੋ", transcribing: "ਟ੍ਰਾਂਸਕ੍ਰਾਈਬ ਹੋ ਰਿਹਾ ਹੈ...", tapMic: "ਆਪਣੇ ਸ਼ਬਦਾਂ ਵਿੱਚ ਜਵਾਬ ਰਿਕਾਰਡ ਕਰਨ ਲਈ ਮਾਈਕ ਟੈਪ ਕਰੋ", submitAnswer: "ਜਵਾਬ ਸਬਮਿਟ ਕਰੋ", nextSection: "ਅਗਲਾ ਖੇਤਰ", previous: "ਪਿਛਲਾ", mild: "ਹਲਕਾ", severe: "ਗੰਭੀਰ", severity: "ਗੰਭੀਰਤਾ", typeAnswer: "ਇੱਥੇ ਆਪਣਾ ਜਵਾਬ ਟਾਈਪ ਕਰੋ...", reviewAnswers: "ਆਪਣੇ ਜਵਾਬਾਂ ਦੀ ਸਮੀਖਿਆ ਕਰੋ", reviewSubtitle: "ਕਲੀਨਿਕਲ ਸਾਰ ਤਿਆਰ ਕਰਨ ਤੋਂ ਪਹਿਲਾਂ ਇਤਿਹਾਸ ਦੀ ਸਮੀਖਿਆ ਕਰੋ", chiefComplaintLabel: "ਮੁੱਖ ਸ਼ਿਕਾਇਤ", completenessScore: "ਪੂਰਨਤਾ ਸਕੋਰ", generateSummary: "ਕਲੀਨਿਕਲ ਸਾਰ ਤਿਆਰ ਕਰੋ", generatingSummary: "ਸਾਰ ਤਿਆਰ ਹੋ ਰਿਹਾ ਹੈ...", considerMoreDetails: "ਵੱਧ ਪੂਰੇ ਇਤਿਹਾਸ ਲਈ ਪਿੱਛੇ ਜਾ ਕੇ ਹੋਰ ਵੇਰਵੇ ਦਿਓ।", chestPain: "ਛਾਤੀ ਵਿੱਚ ਦਰਦ", breathlessness: "ਸਾਹ ਲੈਣ ਵਿੱਚ ਤਕਲੀਫ", headache: "ਸਿਰਦਰਦ", abdominalPain: "ਪੇਟ ਵਿੱਚ ਦਰਦ", jointPain: "ਜੋੜਾਂ ਵਿੱਚ ਦਰਦ", fever: "ਬੁਖ਼ਾਰ", fatigue: "ਥਕਾਵਟ", cough: "ਖੰਘ", dizziness: "ਚੱਕਰ ਆਉਣਾ", skinIssues: "ਚਮੜੀ ਦੀਆਂ ਸਮੱਸਿਆਵਾਂ", moodChanges: "ਮੂਡ ਬਦਲਣਾ", digestiveIssues: "ਪਾਚਨ ਸਮੱਸਿਆਵਾਂ", other: "ਹੋਰ", onset: "ਸ਼ੁਰੂਆਤ", character: "ਸੁਭਾਅ", radiation: "ਫੈਲਣਾ", associated: "ਸਬੰਧਿਤ ਲੱਛਣ", timing: "ਸਮਾਂ", exacerbating: "ਵਧਾਉਣ ਵਾਲੇ ਕਾਰਕ", relieving: "ਰਾਹਤ ਦੇਣ ਵਾਲੇ ਕਾਰਕ", severityScale: "ਗੰਭੀਰਤਾ", pastMedical: "ਪਿਛਲਾ ਮੈਡੀਕਲ ਇਤਿਹਾਸ", pastSurgical: "ਪਿਛਲਾ ਸਰਜਰੀ ਇਤਿਹਾਸ", currentMeds: "ਮੌਜੂਦਾ ਦਵਾਈਆਂ", allergies: "ਅਲਰਜੀਆਂ", familyHistory: "ਪਰਿਵਾਰਕ ਇਤਿਹਾਸ", smoking: "ਸਿਗਰੇਟ ਪੀਣਾ", alcohol: "ਸ਼ਰਾਬ", occupation: "ਕਿੱਤਾ", scanTitle: "ਮੈਡੀਕਲ ਦਸਤਾਵੇਜ਼ ਸਕੈਨ ਕਰੋ", scanSubtitle: "ਪ੍ਰੈਸਕ੍ਰਿਪਸ਼ਨ, ਲੈਬ ਰਿਪੋਰਟਾਂ, ਡਿਸਚਾਰਜ ਸਾਰ ਅੱਪਲੋਡ ਕਰੋ", dropzone: "ਦਸਤਾਵੇਜ਼ ਇੱਥੇ ਛੱਡੋ", dropzoneHint: "ਤਸਵੀਰਾਂ ਅਤੇ PDF ਸਮਰਥਿਤ", chooseFiles: "ਫਾਈਲਾਂ ਚੁਣੋ", ocrExtract: "OCR ਐਕਸਟ੍ਰੈਕਟ", processed: "ਪ੍ਰੋਸੈਸ ਹੋਇਆ", processing: "ਪ੍ਰੋਸੈਸਿੰਗ", uploadedDocuments: "ਅੱਪਲੋਡ ਕੀਤੇ ਦਸਤਾਵੇਜ਼", skipToSummary: "ਛੱਡੋ — ਸਾਰ ਤਿਆਰ ਕਰੋ", generateClinicalSummary: "ਕਲੀਨਿਕਲ ਸਾਰ ਤਿਆਰ ਕਰੋ", physicianReadySummary: "ਡਾਕਟਰ-ਤਿਆਰ ਸਾਰ", generatedFor: "ਲਈ ਤਿਆਰ ਕੀਤਾ", completeness: "ਪੂਰਨਤਾ", redFlagsDetected: "ਰੈੱਡ ਫਲੈਗ ਮਿਲੇ", hpi: "ਮੌਜੂਦਾ ਬਿਮਾਰੀ ਦਾ ਇਤਿਹਾਸ", pastMedicalLabel: "ਪਿਛਲਾ ਮੈਡੀਕਲ ਇਤਿਹਾਸ", currentMedications: "ਮੌਜੂਦਾ ਦਵਾਈਆਂ", allergyLabel: "ਅਲਰਜੀ ਇਤਿਹਾਸ", familyHistoryLabel: "ਪਰਿਵਾਰਕ ਇਤਿਹਾਸ", personalHistory: "ਨਿੱਜੀ ਇਤਿਹਾਸ", priorInvestigations: "ਪਿਛਲੀਆਂ ਜਾਂਚਾਂ", aiSummary: "AI-ਤਿਆਰ ਕਲੀਨਿਕਲ ਸਾਰ", aiDisclaimer: "ਇਹ ਸਾਰ AI-ਤਿਆਰ ਹੈ ਅਤੇ ਕਲੀਨਿਕਲ ਸਹਾਇਕ ਵਜੋਂ ਸੋਚਿਆ ਗਿਆ ਹੈ।", printSummary: "ਸਾਰ ਪ੍ਰਿੰਟ ਕਰੋ", sendToPhysician: "ਡਾਕਟਰ ਨੂੰ ਭੇਜੋ", physicianNotified: "ਡਾਕਟਰ ਨੂੰ ਜਾਣਕਾਰੀ ਦਿੱਤੀ ✓", intakeComplete: "ਕਲੀਨਿਕਲ ਇਨਟੇਕ ਪੂਰਾ!", intakeCompleteDesc: "ਤੁਹਾਡਾ ਸੰਰਚਿਤ ਕਲੀਨਿਕਲ ਇਤਿਹਾਸ ਤਿਆਰ ਹੋ ਗਿਆ ਹੈ।", returnToDashboard: "ਡੈਸ਼ਬੋਰਡ ਤੇ ਵਾਪਸ ਜਾਓ", consentDPDP: "DPDP ਐਕਟ 2023 ਹੇਠ ਸਹਿਮਤੀ", phaseChiefComplaint: "ਮੁੱਖ ਸ਼ਿਕਾਇਤ", phaseSymptomDetails: "ਲੱਛਣਾਂ ਦੇ ਵੇਰਵੇ", phaseAyushAssessment: "ਆਯੁਸ਼ ਮੁਲਾਂਕਨ", phaseGeneralHistory: "ਆਮ ਇਤਿਹਾਸ", phaseReview: "ਸਮੀਖਿਆ", consentByProceeding: "ਅੱਗੇ ਵਧ ਕੇ, ਤੁਸੀਂ ਹੇਠ ਲਿਖੀਆਂ ਗੱਲਾਂ ਲਈ ਸਹਿਮਤੀ ਦਿੰਦੇ ਹੋ:", consentListVoice: "ਕਲੀਨਿਕਲ ਇਤਿਹਾਸ ਲਈ ਵੌਇਸ ਰਿਕਾਰਡਿੰਗ", consentListOCR: "ਅੱਪਲੋਡ ਕੀਤੇ ਦਸਤਾਵੇਜ਼ਾਂ ਦੀ OCR ਪ੍ਰੋਸੈਸਿੰਗ", consentListSummary: "ਸੰਰਚਿਤ ਕਲੀਨਿਕਲ ਇਤਿਹਾਸ ਤਿਆਰੀ", consentListPrivacy: "DPDP ਐਕਟ 2023 ਨਾਲ ਅਨੁਸਾਰ ਸੁਰੱਖਿਅਤ ਸਟੋਰੇਜ", navDashboard: "ਡੈਸ਼ਬੋਰਡ", navMediKiosk: "MediKiosk ਇਨਟੇਕ", navAyurVoxara: "ਆਯੁਰਵੋਕਸਾਰਾ", navRecordLive: "ਲਾਈਵ ਰਿਕਾਰਡ", navHistory: "ਇਤਿਹਾਸ", navTrends: "ਟ੍ਰੈਂਡ", navAIAnalysis: "AI ਵਿਸ਼ਲੇਸ਼ਣ", navMLInsights: "ML ਅੰਦਰੂਨੀ ਦ੍ਰਿਸ਼ਟੀ", navAppointments: "ਮੁਲਾਖ਼ਾਤੇ", navSOS: "🚨 SOS ਐਮਰਜੈਂਸੀ", navIntakeReview: "ਇਨਟੇਕ ਸਮੀਖਿਆਵਾਂ", navAYUSHDashboard: "🌿 AYUSH ਡੈਸ਼ਬੋਰਡ", navLiveAlerts: "ਲਾਈਵ ਅਲਰਟ", navMedication: "ਦਵਾਈ ਪ੍ਰਵਾਹ", switchToAYUSH: "AYUSH ਤੇ ਸਵਿੱਚ ਕਰੋ", switchToAllopathic: "ਐਲੋਪੈਥਿਕ ਤੇ ਸਵਿੱਚ ਕਰੋ", newLiveSample: "ਨਵੀਂ ਲਾਈਵ ਨਮੂਨਾ", signOut: "ਸਾਈਨ ਆਊਟ", realtimeActive: "ਰੀਅਲਟਾਈਮ ਸਰਗਰਮ", dashWelcome: "ਵਾਪਸੀ ਤੇ ਜੀ ਆਇਆਂ ਨੂੰ", dashSubtitle: "ਤੁਹਾਡਾ ਸਿਹਤ ਅਵਲੋਕਨ ਇੱਕ ਨਜ਼ਰ ਵਿੱਚ", dashRecentSessions: "ਤਾਜ਼ੇ ਸੈਸ਼ਨ", dashHealthScore: "ਸਿਹਤ ਸਕੋਰ", dashVoiceClarity: "ਵੌਇਸ ਸਪੱਸ਼ਟਤਾ", dashLastSession: "ਆਖ਼ਰੀ ਸੈਸ਼ਨ", dashNoSessions: "ਅਜੇ ਕੋਈ ਸੈਸ਼ਨ ਰਿਕਾਰਡ ਨਹੀਂ ਹੋਏ", dashRecordFirst: "ਸ਼ੁਰੂ ਕਰਨ ਲਈ ਆਪਣੀ ਪਹਿਲੀ ਵੌਇਸ ਨਮੂਨਾ ਰਿਕਾਰਡ ਕਰੋ", dashViewAll: "ਸਭ ਵੇਖੋ", dashTodaysMedications: "ਅੱਜ ਦੀਆਂ ਦਵਾਈਆਂ", dashUpcomingAppts: "ਆਉਣ ਵਾਲੇ ਮੁਲਾਖ਼ਾਤੇ", dashNoAppts: "ਕੋਈ ਆਉਣ ਵਾਲੇ ਮੁਲਾਖ਼ਾਤੇ ਨਹੀਂ", chatHealthBot: "ਹੈਲਥਬੌਟ", chatAyurBot: "ਆਯੁਰਬੌਟ", chatGeneralHealth: "ਆਮ ਸਿਹਤ", chatSymptomChecker: "ਲੱਛਣ ਜਾਂਚਕ", chatHealthInfo: "ਸਿਹਤ ਜਾਣਕਾਰੀ", chatLearnAyurveda: "ਆਯੁਰਵੇਦ ਸਿੱਖੋ", chatAssessment: "ਮੁਲਾਂਕਨ", chatPractitioner: "ਚਿਕਿਤਸਕ", chatThinking: "ਸੋਚ ਰਹੇ ਹਾਂ...", chatPlaceholderHealth: "ਆਪਣੀ ਸਿਹਤ ਬਾਰੇ ਪੁੱਛੋ...", chatPlaceholderAyush: "ਆਯੁਰਵੇਦ ਬਾਰੇ ਪੁੱਛੋ...", chatMute: "ਮਿਊਟ", chatReadAloud: "ਜ਼ੋਰ ਨਾਲ ਪੜ੍ਹੋ", langEnglish: "English", langHindi: "हिन्दी", langTamil: "தமிழ்", langTelugu: "తెలుగు", langBengali: "বাংলা", langMarathi: "मराठी", langGujarati: "ગુજરાતી", langKannada: "ಕನ್ನಡ", langMalayalam: "മലയാളം", langPunjabi: "ਪੰਜਾਬੀ",
  } as TranslationSet,

} as Record<SupportedLanguage, TranslationSet>;

// Fill only truly missing languages with English fallback
const allLangs: SupportedLanguage[] = ["bn", "mr", "gu", "kn", "ml", "pa"];
for (const lang of allLangs) {
  if (!translations[lang]) {
    translations[lang] = { ...translations.en };
  }
}

let currentLanguage: SupportedLanguage = "en";

export function setLanguage(lang: SupportedLanguage) {
  currentLanguage = lang;
  if (typeof window !== "undefined") {
    localStorage.setItem("medikiosk.language", lang);
  }
}

export function getLanguage(): SupportedLanguage {
  if (typeof window !== "undefined") {
    const stored = localStorage.getItem("medikiosk.language") as SupportedLanguage | null;
    if (stored && translations[stored]) {
      currentLanguage = stored;
    }
  }
  return currentLanguage;
}

export function t(key: keyof TranslationSet): string {
  const lang = getLanguage();
  return translations[lang]?.[key] ?? translations.en[key] ?? key;
}

export function getTranslations(): TranslationSet {
  return translations[getLanguage()] ?? translations.en;
}

export { translations };
