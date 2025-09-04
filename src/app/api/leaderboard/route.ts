"use server"

import { analyseCommits } from "@/utils/analyse-commits"
import { GitHubAPI } from "@/utils/github-api"

export async function GET(request: Request) {
  const { GITHUB_OWNER, GITHUB_TOKEN } = process.env
  if (!GITHUB_OWNER || !GITHUB_TOKEN) throw new Error("Something went wrong")
  const client = new GitHubAPI(GITHUB_TOKEN, GITHUB_OWNER)

  const repos = await client.getOrgRepos()
  let commits: any[] = []
  for (let repo of repos) {
    try {
      const repoCommits = await client.getCommits(repo)
      commits = [...commits, ...repoCommits]
    } catch (err) {
      // ignore
    }
  }

  const ratelimit = await client.getRateLimit()
  const analysedCommits = analyseCommits(commits).sort((a, b) => b.overallScore - a.overallScore)
  return Response.json({ ratelimit, commits: analysedCommits })
}
