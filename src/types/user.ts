export interface FileData {
  filename: string
  additions: number
  changes: number
  deletions: number
}

export interface User {
  name: string
  commits: string[]
  commitCount: number
  changeScore: number
  overallScore: number
  [key: string]: any
}
