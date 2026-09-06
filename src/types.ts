export interface BowlingMatchupData {
  code: string; // e.g., 'RAFM', 'RALS', 'RAOS', 'LAFM', 'LAOD'
  fullName: string; // 'Right Arm Fast Medium', etc.
  average: number; // e.g., 51, 26, 46, 7, 47
  comfortAssessment?: 'Dominant' | 'Comfortable' | 'Moderate' | 'Vulnerable';
  dismissals?: number;
  runs?: number;
  ballsFaced?: number;
  strikeRate?: number;
  description?: string;
}

export interface DismissalCountData {
  bowlerType: string; // e.g. 'RAM', 'LAM', 'LAS', 'RLB', 'ROB'
  fullName: string; // 'Right Arm Medium', etc.
  count: number;
}

export interface BatsmanComfortReport {
  id?: string;
  batsmanName: string;
  comfortTitle: string; // usually "Comfort Level"
  bowlingCategories: BowlingMatchupData[];
  dismissalsTable: DismissalCountData[];
  overallComfortScore: number; // 0 to 100
  dominantBowlingType: string;
  mostVulnerableBowlingType: string;
  comfortSummary: string;
  technicalInsights: string[];
  tacticalPlanAgainstBatsman: string[];
  batsmanCounterStrategy: string[];
  detectedFromImage?: boolean;
  createdAt?: number;
  updatedAt?: number;
}

export interface PresetProfile {
  id: string;
  name: string;
  title: string;
  badge: string;
  data: BatsmanComfortReport;
  notes: string;
}
