import { BatsmanComfortReport, PresetProfile } from '../types';

export const BOWLING_GLOSSARY: Record<string, { fullName: string; category: string; description: string }> = {
  RAFM: {
    fullName: 'Right Arm Fast Medium',
    category: 'Pace',
    description: 'Right-arm seam bowler bowling around 125-140 km/h with swing and seam movement.',
  },
  RALS: {
    fullName: 'Right Arm Leg Spin',
    category: 'Spin (Wrist)',
    description: 'Right-arm wrist spin turning away from right-handers, with googlies and sliders.',
  },
  RAOS: {
    fullName: 'Right Arm Off Spin',
    category: 'Spin (Finger)',
    description: 'Right-arm finger spin turning into right-handers and away from left-handers.',
  },
  LAFM: {
    fullName: 'Left Arm Fast Medium',
    category: 'Pace',
    description: 'Left-arm seam bowler creating acute inward or outward angles across batsmen.',
  },
  LAOD: {
    fullName: 'Left Arm Orthodox Delivery',
    category: 'Spin (Finger)',
    description: 'Left-arm orthodox finger spin turning away from right-handers with tight trajectory.',
  },
  RAM: {
    fullName: 'Right Arm Medium / Fast',
    category: 'Pace',
    description: 'Right-arm medium-fast dismissals breakdown.',
  },
  LAM: {
    fullName: 'Left Arm Medium / Fast',
    category: 'Pace',
    description: 'Left-arm medium-fast dismissals breakdown.',
  },
  LAS: {
    fullName: 'Left Arm Spin',
    category: 'Spin',
    description: 'Left-arm spin dismissals (Orthodox or Unorthodox Chinaman).',
  },
  RLB: {
    fullName: 'Right Leg Break / Spin',
    category: 'Spin',
    description: 'Right-arm wrist-spin dismissals.',
  },
  ROB: {
    fullName: 'Right Off Break',
    category: 'Spin',
    description: 'Right-arm off-spin dismissals.',
  },
};

export const REFERENCE_SHAHBAZ: BatsmanComfortReport = {
  id: 'shahbaz-ref',
  batsmanName: 'SHAHBAZ',
  comfortTitle: 'Comfort Level',
  overallComfortScore: 68,
  dominantBowlingType: 'RAFM (Right Arm Fast Medium)',
  mostVulnerableBowlingType: 'LAFM (Left Arm Fast Medium)',
  comfortSummary:
    'Shahbaz demonstrates elite comfort against standard Right-Arm Fast Medium bowling (51.0 average) and Left-Arm Orthodox spin (47.2 average). However, there is a pronounced vulnerability against Left-Arm Fast Medium seamers angling across (7.0 average with 2 dismissals in limited balls), as well as caution against Right-Arm Leg Spin (26.0 average).',
  bowlingCategories: [
    {
      code: 'RAFM',
      fullName: 'Right Arm Fast Medium',
      average: 51,
      comfortAssessment: 'Dominant',
      runs: 255,
      dismissals: 5,
      ballsFaced: 385,
      strikeRate: 132.5,
      description: 'Reads seam position early; executes strong drives through the covers and pull shots off length.',
    },
    {
      code: 'RALS',
      fullName: 'Right Arm Leg Spin',
      average: 26,
      comfortAssessment: 'Moderate',
      runs: 26,
      dismissals: 1,
      ballsFaced: 112,
      strikeRate: 98.2,
      description: 'Hesitant in picking the googly out of hand; relies on defensive back-foot punching.',
    },
    {
      code: 'RAOS',
      fullName: 'Right Arm Off Spin',
      average: 46,
      comfortAssessment: 'Comfortable',
      runs: 46,
      dismissals: 1,
      ballsFaced: 245,
      strikeRate: 124.0,
      description: 'Comfortable sweeping and using feet to hit down the ground against turning balls.',
    },
    {
      code: 'LAFM',
      fullName: 'Left Arm Fast Medium',
      average: 7,
      comfortAssessment: 'Vulnerable',
      runs: 14,
      dismissals: 2,
      ballsFaced: 42,
      strikeRate: 66.7,
      description: 'Severely challenged by sharp inward angle to pads followed by late movement off the seam.',
    },
    {
      code: 'LAOD',
      fullName: 'Left Arm Orthodox Delivery',
      average: 47,
      comfortAssessment: 'Comfortable',
      runs: 94,
      dismissals: 2,
      ballsFaced: 260,
      strikeRate: 128.4,
      description: 'Consistently negotiates turn away with soft hands; excellent boundary percentage behind square.',
    },
  ],
  dismissalsTable: [
    { bowlerType: 'RAM', fullName: 'Right Arm Medium', count: 5 },
    { bowlerType: 'LAM', fullName: 'Left Arm Medium', count: 2 },
    { bowlerType: 'LAS', fullName: 'Left Arm Spin', count: 2 },
    { bowlerType: 'RLB', fullName: 'Right Leg Break', count: 1 },
    { bowlerType: 'ROB', fullName: 'Right Off Break', count: 1 },
  ],
  technicalInsights: [
    'Optimal bat swing trajectory when facing Right-Arm seamers on middle-and-off channel.',
    'Front pad lunges across off-stump against left-arm angle, leaving vulnerable to LBW and nick behind.',
    'Plays spin with a high elbow and soft wrists, minimizing edges against off-breaks and orthodox spin.',
    'Difficulty adjusting weight shift when wrist spinners drop pace below 82 km/h.',
  ],
  tacticalPlanAgainstBatsman: [
    'Deploy Left-Arm pacer with the new ball targeting full length on off-stump angling into pads.',
    'Keep a fine leg and slip in place for the leading edge or inside drag.',
    'Bring on a leg-spinner with a packed off-side ring to induce high-risk aerial drives against the turn.',
    'Avoid bowling standard right-arm seam slot balls or short balls without pace variation.',
  ],
  batsmanCounterStrategy: [
    'Open up stance slightly when facing left-arm pacers to keep head balanced outside off-stump.',
    'Use depth of crease to counter quick arm balls from leg-spinners instead of lunging forward blindly.',
    'Capitalize aggressively during RAFM overs to shift field pressure back to bowling captain.',
  ],
  detectedFromImage: false,
};

export const PRESET_PROFILES: PresetProfile[] = [
  {
    id: 'shahbaz-ref',
    name: 'Shahbaz (Uploaded Reference)',
    title: 'Comfort Level Against Bowling Variations',
    badge: 'Matchup Card',
    data: REFERENCE_SHAHBAZ,
    notes: 'Exact data extracted from the reference image uploaded by the user with the authentic 5-category matchup graph & dismissals table.',
  },
  {
    id: 'top-order-anchor',
    name: 'Top-Order Anchor vs Pace & Spin',
    title: 'Comfort Level Index',
    badge: 'Anchor Batsman',
    data: {
      batsmanName: 'V. SHARMA',
      comfortTitle: 'Comfort Level',
      overallComfortScore: 74,
      dominantBowlingType: 'RAOS (Right Arm Off Spin)',
      mostVulnerableBowlingType: 'LAFM (Left Arm Fast Medium)',
      comfortSummary:
        'Supreme mastery against orthodox spin and right-arm medium pace. Vulnerable early in the innings against swinging left-arm pace over 138 km/h.',
      bowlingCategories: [
        { code: 'RAFM', fullName: 'Right Arm Fast Medium', average: 44, comfortAssessment: 'Comfortable', dismissals: 4 },
        { code: 'RALS', fullName: 'Right Arm Leg Spin', average: 34, comfortAssessment: 'Moderate', dismissals: 3 },
        { code: 'RAOS', fullName: 'Right Arm Off Spin', average: 58, comfortAssessment: 'Dominant', dismissals: 1 },
        { code: 'LAFM', fullName: 'Left Arm Fast Medium', average: 18, comfortAssessment: 'Vulnerable', dismissals: 4 },
        { code: 'LAOD', fullName: 'Left Arm Orthodox Delivery', average: 52, comfortAssessment: 'Dominant', dismissals: 2 },
      ],
      dismissalsTable: [
        { bowlerType: 'RAM', fullName: 'Right Arm Medium', count: 4 },
        { bowlerType: 'LAM', fullName: 'Left Arm Medium', count: 4 },
        { bowlerType: 'LAS', fullName: 'Left Arm Spin', count: 2 },
        { bowlerType: 'RLB', fullName: 'Right Leg Break', count: 3 },
        { bowlerType: 'ROB', fullName: 'Right Off Break', count: 1 },
      ],
      technicalInsights: [
        'Impeccable back-foot punch through extra cover against right-arm lines.',
        'Slight head tilt when playing left-arm angle creates gap between bat and pad.',
        'Dominant against finger spin with crisp lofted drives over long-off.',
      ],
      tacticalPlanAgainstBatsman: [
        'Bring left-arm seamer around the wicket early with incoming seam movement.',
        'Keep deep mid-wicket back to cut off rotation against spin.',
      ],
      batsmanCounterStrategy: [
        'Hold back-foot balance longer before committing forward against left-arm angle.',
      ],
    },
    notes: 'Classic top-order archetype with high spin proficiency and left-arm pace examination.',
  },
  {
    id: 'middle-order-finisher',
    name: 'Middle-Order Power Hitter',
    title: 'Comfort Level vs Matchups',
    badge: 'Finisher Profile',
    data: {
      batsmanName: 'R. KLAASEN',
      comfortTitle: 'Comfort Level',
      overallComfortScore: 82,
      dominantBowlingType: 'RALS (Right Arm Leg Spin)',
      mostVulnerableBowlingType: 'RAFM (Right Arm Fast Medium)',
      comfortSummary:
        'Destructive comfort against all spin varieties (average over 60 against wrist and finger spin). Tested by high-pace back-of-a-length bouncers above 142 km/h.',
      bowlingCategories: [
        { code: 'RAFM', fullName: 'Right Arm Fast Medium', average: 32, comfortAssessment: 'Moderate', dismissals: 6 },
        { code: 'RALS', fullName: 'Right Arm Leg Spin', average: 65, comfortAssessment: 'Dominant', dismissals: 2 },
        { code: 'RAOS', fullName: 'Right Arm Off Spin', average: 54, comfortAssessment: 'Dominant', dismissals: 1 },
        { code: 'LAFM', fullName: 'Left Arm Fast Medium', average: 38, comfortAssessment: 'Moderate', dismissals: 3 },
        { code: 'LAOD', fullName: 'Left Arm Orthodox Delivery', average: 62, comfortAssessment: 'Dominant', dismissals: 1 },
      ],
      dismissalsTable: [
        { bowlerType: 'RAM', fullName: 'Right Arm Medium', count: 6 },
        { bowlerType: 'LAM', fullName: 'Left Arm Medium', count: 3 },
        { bowlerType: 'LAS', fullName: 'Left Arm Spin', count: 1 },
        { bowlerType: 'RLB', fullName: 'Right Leg Break', count: 2 },
        { bowlerType: 'ROB', fullName: 'Right Off Break', count: 1 },
      ],
      technicalInsights: [
        'Deep crease position provides extra millisecond to read revolutions on spin.',
        'Exceptional hand speed clearing front leg against spinners.',
        'Prone to mistimed pulls against steep bounce into the chest from rapid pacers.',
      ],
      tacticalPlanAgainstBatsman: [
        'Enforce hard lengths with heavy hit-the-deck right-arm seam bowling.',
        'Hold back spinners until overs 16+ or when fielders are on the boundary.',
      ],
      batsmanCounterStrategy: [
        'Use upper-cut and ramp shots to punish short fast deliveries.',
      ],
    },
    notes: 'Elite spin basher comfort profile with distinct pace differential.',
  },
];

export const EMPTY_BATSMAN_TEMPLATE: BatsmanComfortReport = {
  id: 'empty-template',
  batsmanName: '',
  comfortTitle: 'Comfort Level',
  overallComfortScore: 0,
  dominantBowlingType: 'Awaiting Data',
  mostVulnerableBowlingType: 'Awaiting Data',
  comfortSummary:
    'Preloaded data has been deleted. Enter batsman runs, dismissals, or inning scores in the calculator to plot graphs and calculate stats.',
  bowlingCategories: [
    { code: 'RAFM', fullName: 'Right Arm Fast Medium', average: 0, comfortAssessment: 'Moderate', runs: 0, dismissals: 0, ballsFaced: 0, strikeRate: 0, description: 'No data entered yet.' },
    { code: 'RALS', fullName: 'Right Arm Leg Spin', average: 0, comfortAssessment: 'Moderate', runs: 0, dismissals: 0, ballsFaced: 0, strikeRate: 0, description: 'No data entered yet.' },
    { code: 'RAOS', fullName: 'Right Arm Off Spin', average: 0, comfortAssessment: 'Moderate', runs: 0, dismissals: 0, ballsFaced: 0, strikeRate: 0, description: 'No data entered yet.' },
    { code: 'LAFM', fullName: 'Left Arm Fast Medium', average: 0, comfortAssessment: 'Moderate', runs: 0, dismissals: 0, ballsFaced: 0, strikeRate: 0, description: 'No data entered yet.' },
    { code: 'LAOD', fullName: 'Left Arm Orthodox Delivery', average: 0, comfortAssessment: 'Moderate', runs: 0, dismissals: 0, ballsFaced: 0, strikeRate: 0, description: 'No data entered yet.' },
  ],
  dismissalsTable: [
    { bowlerType: 'RAM', fullName: 'Right Arm Medium', count: 0 },
    { bowlerType: 'LAM', fullName: 'Left Arm Medium', count: 0 },
    { bowlerType: 'LAS', fullName: 'Left Arm Spin', count: 0 },
    { bowlerType: 'RLB', fullName: 'Right Leg Break', count: 0 },
    { bowlerType: 'ROB', fullName: 'Right Off Break', count: 0 },
  ],
  technicalInsights: [
    'Awaiting custom batsman data entry.',
    'Use the Batting Average & Stats Calculator on the right to input match runs and outs.',
  ],
  tacticalPlanAgainstBatsman: [
    'Tactical opposition plan will formulate automatically when matchup averages are calculated.',
  ],
  batsmanCounterStrategy: [
    'Counter-strategy advice will populate once scoring and dismissal patterns are established.',
  ],
  detectedFromImage: false,
};

export function createNewBatsman(
  name: string,
  template: 'blank' | 'balanced' | 'pace_heavy' | 'spin_heavy' = 'blank'
): BatsmanComfortReport {
  const cleanName = name.trim() || 'New Batsman';
  const id = `batsman-${Date.now()}`;
  const now = Date.now();

  if (template === 'blank') {
    return {
      ...EMPTY_BATSMAN_TEMPLATE,
      id,
      batsmanName: cleanName,
      comfortSummary: `Fresh profile created for ${cleanName}. Enter match innings or bowling averages in the calculator to visualize matchup graphs.`,
      createdAt: now,
      updatedAt: now,
    };
  }

  if (template === 'pace_heavy') {
    return {
      id,
      batsmanName: cleanName,
      comfortTitle: 'Comfort Level',
      overallComfortScore: 78,
      dominantBowlingType: 'RAFM (Right Arm Fast Medium)',
      mostVulnerableBowlingType: 'RALS (Right Arm Leg Spin)',
      comfortSummary: `${cleanName} dominates pace variations with heavy boundary scoring, but shows caution and lower strike-rate against wrist spin.`,
      bowlingCategories: [
        { code: 'RAFM', fullName: 'Right Arm Fast Medium', average: 58, comfortAssessment: 'Dominant', runs: 290, dismissals: 5, ballsFaced: 200, strikeRate: 145 },
        { code: 'RALS', fullName: 'Right Arm Leg Spin', average: 22, comfortAssessment: 'Moderate', runs: 66, dismissals: 3, ballsFaced: 70, strikeRate: 94.3 },
        { code: 'RAOS', fullName: 'Right Arm Off Spin', average: 36, comfortAssessment: 'Comfortable', runs: 108, dismissals: 3, ballsFaced: 90, strikeRate: 120 },
        { code: 'LAFM', fullName: 'Left Arm Fast Medium', average: 48, comfortAssessment: 'Dominant', runs: 192, dismissals: 4, ballsFaced: 140, strikeRate: 137.1 },
        { code: 'LAOD', fullName: 'Left Arm Orthodox Delivery', average: 40, comfortAssessment: 'Comfortable', runs: 120, dismissals: 3, ballsFaced: 100, strikeRate: 120 },
      ],
      dismissalsTable: [
        { bowlerType: 'RAM', fullName: 'Right Arm Medium', count: 5 },
        { bowlerType: 'LAM', fullName: 'Left Arm Medium', count: 4 },
        { bowlerType: 'LAS', fullName: 'Left Arm Spin', count: 3 },
        { bowlerType: 'RLB', fullName: 'Right Leg Break', count: 3 },
        { bowlerType: 'ROB', fullName: 'Right Off Break', count: 3 },
      ],
      technicalInsights: [
        `Tremendous back-foot punch and pull against express pace.`,
        `Occasionally stretches early against dipping leg-spin deliveries.`,
      ],
      tacticalPlanAgainstBatsman: [
        `Target with googlies and variations in flight from leg-spinners outside off-stump.`,
      ],
      batsmanCounterStrategy: [
        `Hold back-foot depth against spinners and avoid early commitment down the pitch.`,
      ],
      createdAt: now,
      updatedAt: now,
    };
  }

  if (template === 'spin_heavy') {
    return {
      id,
      batsmanName: cleanName,
      comfortTitle: 'Comfort Level',
      overallComfortScore: 81,
      dominantBowlingType: 'RALS (Right Arm Leg Spin)',
      mostVulnerableBowlingType: 'LAFM (Left Arm Fast Medium)',
      comfortSummary: `${cleanName} is an elite player of spin across all angles, using quick footwork and sweep shots effectively.`,
      bowlingCategories: [
        { code: 'RAFM', fullName: 'Right Arm Fast Medium', average: 32, comfortAssessment: 'Moderate', runs: 160, dismissals: 5, ballsFaced: 130, strikeRate: 123 },
        { code: 'RALS', fullName: 'Right Arm Leg Spin', average: 62, comfortAssessment: 'Dominant', runs: 248, dismissals: 4, ballsFaced: 170, strikeRate: 145.9 },
        { code: 'RAOS', fullName: 'Right Arm Off Spin', average: 55, comfortAssessment: 'Dominant', runs: 220, dismissals: 4, ballsFaced: 160, strikeRate: 137.5 },
        { code: 'LAFM', fullName: 'Left Arm Fast Medium', average: 21, comfortAssessment: 'Moderate', runs: 84, dismissals: 4, ballsFaced: 80, strikeRate: 105 },
        { code: 'LAOD', fullName: 'Left Arm Orthodox Delivery', average: 50, comfortAssessment: 'Dominant', runs: 200, dismissals: 4, ballsFaced: 150, strikeRate: 133.3 },
      ],
      dismissalsTable: [
        { bowlerType: 'RAM', fullName: 'Right Arm Medium', count: 5 },
        { bowlerType: 'LAM', fullName: 'Left Arm Medium', count: 4 },
        { bowlerType: 'LAS', fullName: 'Left Arm Spin', count: 4 },
        { bowlerType: 'RLB', fullName: 'Right Leg Break', count: 4 },
        { bowlerType: 'ROB', fullName: 'Right Off Break', count: 4 },
      ],
      technicalInsights: [
        `Reads spin revolution quickly from the hand.`,
        `Vulnerable to rapid left-arm pace angling back into right-hander pads.`,
      ],
      tacticalPlanAgainstBatsman: [
        `Bring high-pace left-arm seamers around the wicket early in the spell.`,
      ],
      batsmanCounterStrategy: [
        `Slightly close stance when facing left-arm pacers to minimize lbw risk.`,
      ],
      createdAt: now,
      updatedAt: now,
    };
  }

  // Balanced default
  return {
    id,
    batsmanName: cleanName,
    comfortTitle: 'Comfort Level',
    overallComfortScore: 70,
    dominantBowlingType: 'RAOS (Right Arm Off Spin)',
    mostVulnerableBowlingType: 'LAFM (Left Arm Fast Medium)',
    comfortSummary: `Balanced comfort profile for ${cleanName} with steady averages across pace and spin disciplines.`,
    bowlingCategories: [
      { code: 'RAFM', fullName: 'Right Arm Fast Medium', average: 38, comfortAssessment: 'Comfortable', runs: 190, dismissals: 5, ballsFaced: 150, strikeRate: 126.7 },
      { code: 'RALS', fullName: 'Right Arm Leg Spin', average: 35, comfortAssessment: 'Comfortable', runs: 140, dismissals: 4, ballsFaced: 120, strikeRate: 116.7 },
      { code: 'RAOS', fullName: 'Right Arm Off Spin', average: 44, comfortAssessment: 'Comfortable', runs: 176, dismissals: 4, ballsFaced: 130, strikeRate: 135.4 },
      { code: 'LAFM', fullName: 'Left Arm Fast Medium', average: 28, comfortAssessment: 'Moderate', runs: 112, dismissals: 4, ballsFaced: 100, strikeRate: 112 },
      { code: 'LAOD', fullName: 'Left Arm Orthodox Delivery', average: 42, comfortAssessment: 'Comfortable', runs: 168, dismissals: 4, ballsFaced: 130, strikeRate: 129.2 },
    ],
    dismissalsTable: [
      { bowlerType: 'RAM', fullName: 'Right Arm Medium', count: 5 },
      { bowlerType: 'LAM', fullName: 'Left Arm Medium', count: 4 },
      { bowlerType: 'LAS', fullName: 'Left Arm Spin', count: 4 },
      { bowlerType: 'RLB', fullName: 'Right Leg Break', count: 4 },
      { bowlerType: 'ROB', fullName: 'Right Off Break', count: 4 },
    ],
    technicalInsights: [
      `Solid orthodox technique with balanced weight distribution.`,
    ],
    tacticalPlanAgainstBatsman: [
      `Enforce disciplined fifth-stump line to test patience.`,
    ],
    batsmanCounterStrategy: [
      `Capitalize on loose deliveries while maintaining solid defensive discipline.`,
    ],
    createdAt: now,
    updatedAt: now,
  };
}
