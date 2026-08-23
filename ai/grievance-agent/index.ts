/**
 * SWACHHAI AI — Grievance Intake Agent
 * Uses IBM Granite via watsonx.ai when configured,
 * falls back to a deterministic demo provider.
 */

import { AIClassificationResult, Language, Priority } from '../../lib/types';

const WATSONX_URL = process.env.WATSONX_URL;
const WATSONX_API_KEY = process.env.WATSONX_API_KEY;
const WATSONX_PROJECT_ID = process.env.WATSONX_PROJECT_ID;
const GRANITE_MODEL = process.env.GRANITE_MODEL || 'ibm/granite-13b-instruct-v2';

// ─── Language detection heuristic ────────────────────────────────────────────
function detectLanguage(text: string): { lang: Language; name: string } {
  const guChars = /[\u0A80-\u0AFF]/;
  const hiChars = /[\u0900-\u097F]/;
  if (guChars.test(text)) return { lang: 'gu', name: 'Gujarati' };
  if (hiChars.test(text)) return { lang: 'hi', name: 'Hindi' };
  return { lang: 'en', name: 'English' };
}

// ─── Demo/Mock classification (deterministic, clearly labeled) ────────────────
function demoClassify(text: string): AIClassificationResult {
  const lower = text.toLowerCase();
  const { lang, name } = detectLanguage(text);

  let category = 'Waste Collection';
  let subcategory = 'General Complaint';
  let priority: Priority = 'medium';
  let priority_reason = 'Standard waste issue reported by citizen.';
  let recommended_action = 'Dispatch sanitation team for inspection.';

  // Missed collection
  if (
    lower.includes('collect') ||
    lower.includes('pickup') ||
    lower.includes('kachro') ||
    lower.includes('कचरा') ||
    lower.includes('ઉપાડ') ||
    lower.includes('नहीं आया') ||
    lower.includes('aavyu nathi')
  ) {
    subcategory = 'Missed Collection';
    priority = 'high';
    priority_reason =
      'Missed household collection directly affects public health and sanitation. Multiple days without collection increases risk.';
    recommended_action = 'Dispatch collection vehicle to ward immediately.';
  }

  // Overflow / overflowing bin
  if (
    lower.includes('overflow') ||
    lower.includes('overflowing') ||
    lower.includes('bhar') ||
    lower.includes('भर') ||
    lower.includes('ઉભ') ||
    lower.includes('dump')
  ) {
    subcategory = 'Overflowing Bin';
    priority = 'high';
    priority_reason =
      'Overflowing bins pose immediate health and hygiene risks.';
    recommended_action = 'Clear overflow bin and schedule increased collection frequency.';
  }

  // Illegal dumping
  if (
    lower.includes('illegal') ||
    lower.includes('dump') ||
    lower.includes('road') ||
    lower.includes('road side') ||
    lower.includes('raste')
  ) {
    category = 'Illegal Dumping';
    subcategory = 'Roadside Dumping';
    priority = 'high';
    priority_reason = 'Illegal roadside dumping causes environmental hazard.';
    recommended_action = 'Dispatch Waste Enforcement Team for site clearance.';
  }

  // Segregation
  if (
    lower.includes('segregat') ||
    lower.includes('separate') ||
    lower.includes('wet') ||
    lower.includes('dry') ||
    lower.includes('recycle')
  ) {
    category = 'Segregation';
    subcategory = 'Improper Segregation';
    priority = 'medium';
    priority_reason = 'Segregation non-compliance affects recycling efficiency.';
    recommended_action = 'Send awareness team and segregation training notice.';
  }

  // Critical — three or more days
  if (
    lower.includes('three day') ||
    lower.includes('3 day') ||
    lower.includes('ત્રણ દિવ') ||
    lower.includes('तीन दिन') ||
    lower.includes('4 day') ||
    lower.includes('week')
  ) {
    priority = 'critical';
    priority_reason =
      'Waste not collected for 3+ days. Immediate health risk. Multiple nearby residents likely affected.';
  }

  // Extract ward hint
  let ward: string | undefined;
  const wardMatch = text.match(/ward\s*(\d+)/i);
  if (wardMatch) ward = `Ward ${wardMatch[1]}`;

  const descriptions: Record<string, string> = {
    gu: text,
    hi: text,
    en: text,
  };

  return {
    language: lang,
    language_name: name,
    category,
    subcategory,
    priority,
    priority_reason,
    ward,
    description_en:
      lang === 'en'
        ? text
        : `[Auto-translated from ${name}] ${text}`,
    recommended_action,
    confidence: 0.87,
    is_demo: true,
  };
}

// ─── IBM Granite via watsonx.ai ───────────────────────────────────────────────
async function graniteClassify(text: string): Promise<AIClassificationResult> {
  const { lang, name } = detectLanguage(text);

  const prompt = `You are SWACHHAI AI, a municipal waste management assistant for Gujarat, India.
Analyze the following citizen complaint and extract structured information.

Complaint: "${text}"

Respond ONLY with valid JSON in this exact format:
{
  "category": "Waste Collection|Illegal Dumping|Segregation|Sanitation|Other",
  "subcategory": "specific subcategory",
  "priority": "low|medium|high|critical",
  "priority_reason": "explanation of why this priority was assigned",
  "ward": "ward name if mentioned or null",
  "description_en": "English translation/summary of the complaint",
  "recommended_action": "specific action for municipal team"
}`;

  const response = await fetch(`${WATSONX_URL}/ml/v1/text/generation?version=2023-05-29`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${WATSONX_API_KEY}`,
    },
    body: JSON.stringify({
      model_id: GRANITE_MODEL,
      input: prompt,
      parameters: {
        decoding_method: 'greedy',
        max_new_tokens: 400,
        temperature: 0.1,
      },
      project_id: WATSONX_PROJECT_ID,
    }),
  });

  if (!response.ok) throw new Error(`watsonx API error: ${response.status}`);
  const data = await response.json();
  const raw = data.results?.[0]?.generated_text || '{}';

  // Extract JSON from response
  const jsonMatch = raw.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error('Invalid JSON from Granite');

  const parsed = JSON.parse(jsonMatch[0]);

  return {
    language: lang,
    language_name: name,
    category: parsed.category || 'Waste Collection',
    subcategory: parsed.subcategory || 'General',
    priority: parsed.priority || 'medium',
    priority_reason: parsed.priority_reason || '',
    ward: parsed.ward || undefined,
    description_en: parsed.description_en || text,
    recommended_action: parsed.recommended_action || '',
    confidence: 0.92,
    is_demo: false,
  };
}

// ─── Public API ───────────────────────────────────────────────────────────────
export async function classifyComplaint(text: string): Promise<AIClassificationResult> {
  if (WATSONX_URL && WATSONX_API_KEY && WATSONX_PROJECT_ID) {
    try {
      return await graniteClassify(text);
    } catch (err) {
      console.warn('[GrievanceAgent] Granite unavailable, using demo mode:', err);
    }
  }
  return demoClassify(text);
}
