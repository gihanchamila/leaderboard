// separate file to have a better transparency with viewers

export const ADDITION_MULTIPLIER = 1
export const DELETION_MULTIPLIER = 0.25
export const COMMIT_MULTIPLIER = 1.25
export const CHANGESCORE_MULTIPLIER = 20
export const LOW_EFFORT_CHANGE_THRESHOLD = 5
export const LOW_EFFORT_CHANGE_PENALTY = 0.1

export const ignoreFiles = [
  // Dependency locks
  /package-lock\.json$/i,
  /yarn\.lock$/i,
  /pnpm-lock\.yaml$/i,
  /bun\.lockb$/i,

  // Dependency directories
  /\bnode_modules[\/\\]/i,
  /\bvendor[\/\\]/i,

  // Build outputs
  /\bdist[\/\\]/i,
  /\bbuild[\/\\]/i,
  /\bout[\/\\]/i,
  /\.next[\/\\]/i,
  /\.nuxt[\/\\]/i,
  /\bcoverage[\/\\]/i,

  // Environment / configs
  /\.env(\..*)?$/i,
  /\.DS_Store$/i,
  /\bThumbs\.db$/i,

  // Logs / debug
  /\.log$/i,
  /\bnpm-debug\.log$/i,
  /\byarn-error\.log$/i,

  // Compiled/binary
  /\.pyc$/i,
  /\.pyo$/i,
  /\.class$/i,
  /\.o$/i,
  /\.obj$/i,
  /\.so$/i,
  /\.dll$/i,
  /\.exe$/i,
  /\.out$/i,
]

export const ignoreFilesPattern = new RegExp(
  "(" + ignoreFiles.map((r) => r.source).join("|") + ")",
  "i",
)
console.log(ignoreFilesPattern)

export const calculateChangeScore = (additions: number, deletions: number) =>
  (additions < LOW_EFFORT_CHANGE_THRESHOLD ? LOW_EFFORT_CHANGE_PENALTY : additions) *
    ADDITION_MULTIPLIER +
  deletions * DELETION_MULTIPLIER

export const calculateOverallScore = (commits: number, changeScore: number) =>
  commits * COMMIT_MULTIPLIER + Math.log10(changeScore + 1) * CHANGESCORE_MULTIPLIER
