export interface Fighter {
  category: string;
  draws: string;
  imgUrl: string;
  losses: string;
  name: string;
  nickname: string;
  wins: string;
  status: string;
  placeOfBirth: string;
  trainsAt: string;
  fightingStyle?: string;
  age: string;
  height: string;
  weight: string;
  octagonDebut: string;
  reach: string;
  legReach: string;

   // Tambahan untuk keperluan simulasi AI
  weightClass?: string;
  style?: string;
  record?: string;
  skills?: string;
  power?: number;
  speed?: number;
  wrestling?: number;
}

export interface FighterStats {
  strikes: number;
  significant: number;
  takedowns: number;
  takedownAttempts: number;
  control: string;
  health: number;
  energy: number;
}
export interface RoundData {
  fighter1Stats: FighterStats;
  fighter2Stats: FighterStats;
  commentary: string[];
}


export type FightersResponse = Record<string, Fighter>;

export async function getFighters(): Promise<FightersResponse> {
  try {
    const response = await fetch('https://api.octagon-api.com/fighters');
    if (!response.ok) {
      throw new Error('Failed to fetch fighters');
    }
    return response.json();
  } catch (error) {
    console.error('Error fetching fighters:', error);
    return {};
  }
}