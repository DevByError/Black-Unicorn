import type { ProcessStage } from '@/types/content';

export const process: ProcessStage[] = [
  { id: 'discover', title: 'Discover', summary: 'We learn the problem, the people and the limits before anything is drawn.', bullets: ['Stakeholder and user conversations', 'Constraints, risks and success measures', 'A written scope everyone can read'], deliverable: 'A one-page brief and a plan.' },
  { id: 'design', title: 'Design', summary: 'We shape the interface and the system together, and test early.', bullets: ['Flows and wireframes', 'A small, strict design system', 'Clickable prototypes with real content'], deliverable: 'A tested prototype and tokens.' },
  { id: 'build', title: 'Build', summary: 'We ship in small steps, with tests, budgets and accessibility checks on every change.', bullets: ['Typed, reviewed code', 'Performance and accessibility budgets', 'Weekly working builds'], deliverable: 'Working software you can try.' },
  { id: 'launch', title: 'Launch', summary: 'We release carefully, watch what happens, and fix quickly.', bullets: ['Staged rollout', 'Monitoring and alerts', 'Handover documentation'], deliverable: 'A live product and a runbook.' },
  { id: 'evolve', title: 'Evolve', summary: 'We improve from evidence, not guesses.', bullets: ['Review of real usage', 'Prioritised improvements', 'Dependency and security upkeep'], deliverable: 'A roadmap and regular releases.' },
];
