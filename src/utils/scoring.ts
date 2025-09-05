// separate file to have a better transparency with viewers

export const ADDITION_MULTIPLIER = 1
export const DELETION_MULTIPLIER = 0.25
export const COMMIT_MULTIPLIER = 5
export const CHANGESCORE_MULTIPLIER = 20

export const calculateChangeScore = (additions: number, deletions: number) =>
  additions * ADDITION_MULTIPLIER + deletions * DELETION_MULTIPLIER

export const calculateOverallScore = (commits: number, changeScore: number) =>
  commits * COMMIT_MULTIPLIER + Math.log10(changeScore + 1) * CHANGESCORE_MULTIPLIER
