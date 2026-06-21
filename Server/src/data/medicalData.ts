export interface MedicalEntry {
  assessment: string;
  key_features: string[];
  recommendations: string[];
}

export type DiagnosisKey = 'Monkeypox' | 'Chickenpox' | 'Measles' | 'Normal';

export const MEDICAL_REPORT_DATA: Record<DiagnosisKey, MedicalEntry> = {
  Monkeypox: {
    assessment:
      'The analysis indicates signs consistent with Monkeypox. Lesions typically progress from macules to papules, vesicles, pustules, and then scabs.',
    key_features: [
      'Deep-seated, firm/hard lesions',
      'Well-defined borders with central umbilication',
      'Lesions often start on the face/mouth and spread',
      'Swollen lymph nodes (lymphadenopathy)',
    ],
    recommendations: [
      'Isolate immediately to prevent spread.',
      'Wear a mask and cover lesions.',
      'Consult a healthcare provider for PCR testing.',
      'Monitor for fever and other systemic symptoms.',
    ],
  },

  Chickenpox: {
    assessment:
      'The skin shows signs characteristic of Chickenpox (Varicella). This usually presents as an itchy, blister-like rash.',
    key_features: [
      'Rash appears in crops (different stages visible)',
      'Superficial dew-drop on a rose petal appearance',
      'Intense itching',
      'Usually starts on the trunk and spreads',
    ],
    recommendations: [
      'Stay at home until all blisters have crusted over.',
      'Use calamine lotion to soothe itching.',
      'Avoid scratching to prevent secondary infection.',
      'Avoid contact with pregnant women or immunocompromised individuals.',
    ],
  },

  Measles: {
    assessment:
      'The analysis suggests Measles. This is a highly contagious viral infection appearing as a flat, red rash.',
    key_features: [
      'Flat red rash starting at hairline/face',
      'Spreads downwards to neck, trunk, and limbs',
      'Associated with high fever, cough, and runny nose',
      'Tiny white spots inside the mouth (Koplik spots)',
    ],
    recommendations: [
      'Seek medical attention immediately (highly contagious).',
      'Isolate from others, especially unvaccinated individuals.',
      'Rest and maintain hydration.',
      'Vitamin A supplements may be prescribed by a doctor.',
    ],
  },

  Normal: {
    assessment:
      'The skin appears healthy with no signs of pathological rashes related to Monkeypox, Chickenpox, or Measles.',
    key_features: [
      'Clear skin texture',
      'No suspicious lesions or blisters',
      'Normal pigmentation',
    ],
    recommendations: [
      'Continue regular skin hygiene routine.',
      'Use sunscreen when exposed to the sun.',
      'Perform regular self-checks for any changes.',
      'Stay hydrated to maintain skin health.',
    ],
  },
};

export const getReportData = (diagnosis: string): MedicalEntry =>
  MEDICAL_REPORT_DATA[diagnosis as DiagnosisKey] ?? {
    assessment: 'Analysis completed. Diagnosis not specifically listed.',
    key_features: [],
    recommendations: ['Consult a doctor for further checkup.'],
  };
