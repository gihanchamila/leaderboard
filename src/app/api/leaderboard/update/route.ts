"use server"

import { redis } from "@/lib/upstash"
import { analyseCommits } from "@/utils/analyse-commits"
import { GitHubAPI } from "@/utils/github-api"

export async function updateLeaderboard() {
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
  const leaders = analyseCommits(commits).sort((a, b) => b.overallScore - a.overallScore)

  await redis.set("lastUpdate", Date.now())
  await redis.set("ratelimit", ratelimit)
  await redis.set("leaders", leaders)
}

export async function POST(request: Request) {
  await updateLeaderboard()
  return Response.json({ success: true })
}
