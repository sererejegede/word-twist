export interface WordPair {
  id: number;
  original: string;
  scrambled: string;
}

export const wordBank: WordPair[] = [
  { id: 1, original: "react", scrambled: "tcare" },
  { id: 2, original: "nextjs", scrambled: "sxjten" },
  { id: 3, original: "tailwind", scrambled: "dliwatni" },
  { id: 4, original: "typescript", scrambled: "pytpescrit" },
  { id: 5, original: "javascript", scrambled: "scvajpirat" },
  { id: 6, original: "developer", scrambled: "olevprede" },
  { id: 7, original: "coding", scrambled: "gondic" },
  { id: 8, original: "puzzle", scrambled: "zelpuz" },
  { id: 9, original: "challenge", scrambled: "gellanche" },
  { id: 10, original: "victory", scrambled: "tycivro" },
  { id: 11, original: "planet", scrambled: "tenalp" },
  { id: 12, original: "galaxy", scrambled: "yaglex" },
  { id: 13, original: "stellar", scrambled: "rallets" },
  { id: 14, original: "nebula", scrambled: "labuen" },
  { id: 15, original: "cosmos", scrambled: "socsom" },
];

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export const getShuffledWordBank = (count: number = 5): WordPair[] => {
  return shuffleArray(wordBank).slice(0, count);
};
