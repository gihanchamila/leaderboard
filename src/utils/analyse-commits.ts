import { FileData, User } from "@/types/user.js"
import { commitCategories } from "./commit-categories"

function createUser(name: string): User {
  const user: User = { name, commits: [], commitCount: 0, changeScore: 0, overallScore: 0 }
  for (const cat of commitCategories) {
    user[cat.countField] = 0
    user[cat.listField] = []
  }
  return user as User
}

const ignoreFiles = ["package.lock.json"]

export const analyseCommits = (commits: any[]): User[] => {
  const results: User[] = []

  for (const commit of commits) {
    if (!commit.commit) continue
    const authorName = commit.author?.login || commit.commit.author?.name || commit.commiter?.login
    let user = results.find((u) => u.name === authorName)

    if (!user) {
      user = createUser(authorName)
      results.push(user)
    }

    const commitMsg = commit.commit.message.split("\n")[0]
    const commitFiles = commit.files as FileData[]

    let changeScore = 0

    for (let file of commitFiles) {
      if (ignoreFiles.includes(file.filename)) continue
      changeScore += file.additions + file.deletions * 0.25
    }

    user.commits.push(commitMsg)
    user.commitCount += 1
    user.changeScore += changeScore
    // applying log10 will help the leaderboard to not break when there are 1000+ additions
    // we apply little bit more weight to the change score so people can't get to top with just spam commits
    user.overallScore = user.commitCount * 5 + Math.log10(user.changeScore + 1) * 20

    for (const category of commitCategories) {
      if (category.pattern.test(commitMsg)) {
        user[category.countField] += 1
        user[category.listField].push(commitMsg)
        break
      }
    }
  }

  return results
}
