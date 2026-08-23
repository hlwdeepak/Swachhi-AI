/**
 * SWACHHAI AI — Municipal Routing Agent
 * Determines department, team, ward, priority, and escalation.
 */

import { AIRoutingResult, Priority } from '../../lib/types';

interface RoutingInput {
  category: string;
  subcategory: string;
  priority: Priority;
  ward?: string;
  description: string;
}

const ROUTING_RULES: Array<{
  match: (input: RoutingInput) => boolean;
  department: string;
  team: string;
  explanation: (input: RoutingInput) => string;
  response_hours: number;
}> = [
  {
    match: (i) =>
      i.category === 'Waste Collection' && i.subcategory === 'Missed Collection',
    department: 'Sanitation Department',
    team: 'Collection Team',
    explanation: (i) =>
      `Assigned to Sanitation Collection Team because the complaint concerns missed household waste collection${i.ward ? ` in ${i.ward}` : ''}. This is a direct service delivery issue requiring immediate dispatch.`,
    response_hours: 4,
  },
  {
    match: (i) => i.subcategory === 'Overflowing Bin',
    department: 'Sanitation Department',
    team: 'Rapid Response Team',
    explanation: (i) =>
      `Assigned to Rapid Response Team for overflowing bin clearance${i.ward ? ` in ${i.ward}` : ''}. Overflow creates immediate hygiene hazard.`,
    response_hours: 2,
  },
  {
    match: (i) => i.category === 'Illegal Dumping',
    department: 'Waste Enforcement Division',
    team: 'Enforcement Team',
    explanation: (i) =>
      `Assigned to Waste Enforcement Team. Illegal dumping${i.ward ? ` in ${i.ward}` : ''} requires enforcement action and site clearance under municipal bylaws.`,
    response_hours: 8,
  },
  {
    match: (i) => i.category === 'Segregation',
    department: 'Waste Awareness Division',
    team: 'Compliance Team',
    explanation: (i) =>
      `Assigned to Waste Compliance Team. Segregation non-compliance${i.ward ? ` in ${i.ward}` : ''} requires awareness campaign and monitoring intervention.`,
    response_hours: 24,
  },
  {
    match: (i) => i.category === 'Sanitation',
    department: 'Public Health Department',
    team: 'Sanitation Response Team',
    explanation: (i) =>
      `Assigned to Sanitation Response Team. Public sanitation issue${i.ward ? ` in ${i.ward}` : ''} requires field inspection and hygiene assessment.`,
    response_hours: 6,
  },
];

export function routeComplaint(input: RoutingInput): AIRoutingResult {
  const rule = ROUTING_RULES.find((r) => r.match(input));

  const department = rule?.department || 'Sanitation Department';
  const team = rule?.team || 'General Team';
  const explanation =
    rule?.explanation(input) ||
    `Assigned to General Sanitation Team for${input.ward ? ` ${input.ward}` : ''} — ${input.category} complaint requiring standard follow-up.`;
  const response_hours = rule?.response_hours || 12;

  const requires_escalation =
    input.priority === 'critical' ||
    (input.priority === 'high' && response_hours > 4);

  return {
    department,
    team: `${team}${input.ward ? ` — ${input.ward}` : ''}`,
    ward: input.ward || 'General',
    priority: input.priority,
    requires_escalation,
    explanation,
    estimated_response_hours: requires_escalation
      ? Math.floor(response_hours / 2)
      : response_hours,
    is_demo: true,
  };
}
