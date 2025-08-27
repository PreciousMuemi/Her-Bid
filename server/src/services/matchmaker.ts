type Profile = {
  id: string;
  skills: string[];
  location?: string;
  reputation?: number; // 0..1
  history?: { partnerId: string; successRate: number }[];
};

const mockProfiles: Profile[] = [
  { id: 'bizA', skills: ['Digital Marketing'], location: 'Nairobi', reputation: 0.8, history: [{ partnerId: 'bizB', successRate: 0.9 }] },
  { id: 'bizB', skills: ['Web Development'], location: 'Nairobi', reputation: 0.7, history: [{ partnerId: 'bizA', successRate: 0.85 }] },
  { id: 'bizC', skills: ['Graphic Design'], location: 'Mombasa', reputation: 0.6, history: [] },
];

function partnershipScore(a: Profile, b: Profile, requiredSkills: string[], location?: string) {
  // Skill coverage bonus
  const combined = new Set([...a.skills, ...b.skills]);
  const skillCoverage = requiredSkills.every(s => combined.has(s)) ? 1 : 0;

  // Local collaboration bonus
  const localBonus = location && a.location === location && b.location === location ? 0.15 : 0;

  // Reputation and history bonus
  const rep = ((a.reputation ?? 0.5) + (b.reputation ?? 0.5)) / 2;
  const prior = (a.history||[]).find(h => h.partnerId === b.id)?.successRate ?? 0.5;
  const reputationScore = 0.5 * rep + 0.5 * prior; // 0..1

  return skillCoverage * (0.6 + localBonus) + 0.4 * reputationScore; // weighted
}

export const matchmaker = {
  async findViableTeam({ requiredSkills, location }:{ projectId: string; requiredSkills: string[]; location?: string }){
    let best: { team: [Profile, Profile]; score: number } | null = null;
    for (let i = 0; i < mockProfiles.length; i++) {
      for (let j = i + 1; j < mockProfiles.length; j++) {
        const a = mockProfiles[i];
        const b = mockProfiles[j];
        const score = partnershipScore(a, b, requiredSkills, location);
        if (!best || score > best.score) best = { team: [a, b], score };
      }
    }
    return { bestTeam: best?.team.map(p => p.id) ?? [], score: best?.score ?? 0 };
  }
};
