/**
 * SWACHHAI AI — Segregation Compliance Agent
 * Classifies waste images (demo/mock layer, replaceable with vision model).
 */

import { WasteCategory } from '../../lib/types';

export interface SegregationResult {
  classification: WasteCategory;
  classification_label: string;
  confidence: number;
  color: string;
  recommendation: string;
  segregation_tips: string[];
  disposal_method: string;
  is_demo: boolean;
}

const WASTE_INFO: Record<
  WasteCategory,
  { label: string; color: string; recommendation: string; tips: string[]; disposal: string }
> = {
  wet: {
    label: 'Wet Waste (Organic)',
    color: 'green',
    recommendation: 'Place in GREEN bin. Ideal for composting.',
    tips: [
      'Includes food scraps, fruit peels, vegetable waste',
      'Avoid mixing with plastic or paper',
      'Can be composted at home or in community bins',
    ],
    disposal: 'GREEN organic waste bin — collected daily',
  },
  dry: {
    label: 'Dry Waste',
    color: 'blue',
    recommendation: 'Place in BLUE bin. Keep away from wet waste.',
    tips: [
      'Includes paper, cardboard, clean packaging',
      'Flatten cardboard boxes before disposal',
      'Remove food residue from containers before placing in dry bin',
    ],
    disposal: 'BLUE dry waste bin — collected every alternate day',
  },
  recyclable: {
    label: 'Recyclable Waste',
    color: 'cyan',
    recommendation: 'Place in BLUE recyclable bin. Rinse containers before disposal.',
    tips: [
      'Includes plastic bottles, glass, metals, clean paper',
      'Rinse containers to avoid contamination',
      'Separate different recyclable types if possible',
    ],
    disposal: 'BLUE recyclable bin — collected weekly for sorting center',
  },
  hazardous: {
    label: 'Hazardous Waste',
    color: 'red',
    recommendation: 'Place in RED hazardous bin. Do NOT mix with regular waste.',
    tips: [
      'Includes batteries, medicines, chemicals, e-waste',
      'Never dispose in regular bins or drains',
      'Take to designated hazardous waste collection point',
    ],
    disposal: 'RED hazardous bin or designated collection point — special handling required',
  },
  mixed: {
    label: 'Mixed Waste (Non-compliant)',
    color: 'orange',
    recommendation: 'SEGREGATE before disposal. Separate wet, dry, and recyclables.',
    tips: [
      'Mixed waste cannot be processed efficiently',
      'Separate food waste (green bin) from dry waste (blue bin)',
      'Remove hazardous items and dispose separately',
      'Ask your sanitation worker for a segregation guide',
    ],
    disposal: 'Must be segregated — mixed waste results in non-compliance notice',
  },
  unknown: {
    label: 'Unidentified Waste',
    color: 'gray',
    recommendation: 'Unsure of category. Consult municipal guidelines or ask AI assistant.',
    tips: [
      'When in doubt, keep separate until identified',
      'Contact municipal helpline for guidance',
    ],
    disposal: 'Consult municipal waste management guidelines',
  },
};

// Demo classifier: uses filename hints or random weighted selection
export function classifyWasteDemo(
  hint?: string
): SegregationResult {
  const h = (hint || '').toLowerCase();

  let classification: WasteCategory = 'mixed';

  if (h.includes('food') || h.includes('veg') || h.includes('organic') || h.includes('wet')) {
    classification = 'wet';
  } else if (h.includes('plastic') || h.includes('bottle') || h.includes('recycle')) {
    classification = 'recyclable';
  } else if (h.includes('paper') || h.includes('card') || h.includes('dry')) {
    classification = 'dry';
  } else if (h.includes('battery') || h.includes('chemical') || h.includes('hazard')) {
    classification = 'hazardous';
  } else if (h.includes('mixed') || h.includes('garbage') || h.includes('trash')) {
    classification = 'mixed';
  } else {
    // Weighted random for demo
    const weights: [WasteCategory, number][] = [
      ['mixed', 35],
      ['wet', 25],
      ['dry', 20],
      ['recyclable', 15],
      ['hazardous', 5],
    ];
    const total = weights.reduce((s, [, w]) => s + w, 0);
    let rand = Math.random() * total;
    for (const [cat, w] of weights) {
      rand -= w;
      if (rand <= 0) {
        classification = cat;
        break;
      }
    }
  }

  const info = WASTE_INFO[classification];
  const confidence = 0.72 + Math.random() * 0.22;

  return {
    classification,
    classification_label: info.label,
    confidence: Math.round(confidence * 100) / 100,
    color: info.color,
    recommendation: info.recommendation,
    segregation_tips: info.tips,
    disposal_method: info.disposal,
    is_demo: true,
  };
}
