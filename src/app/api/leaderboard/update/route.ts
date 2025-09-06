"use server"

import { redis } from "@/lib/upstash"
import { analyseCommits } from "@/utils/analyse-commits"
import { GitHubAPI } from "@/utils/github-api"
import type { Endpoints } from "@octokit/types"

export async function updateLeaderboard() {
  const { GITHUB_OWNER, GITHUB_TOKEN } = process.env
  if (!GITHUB_OWNER || !GITHUB_TOKEN) throw new Error("Something went wrong")
  const client = new GitHubAPI(GITHUB_TOKEN, GITHUB_OWNER)

  const repos = await client.getOrgRepos()
  let commits: Endpoints["GET /repos/{owner}/{repo}/commits"]["response"]["data"][number][] = []
  for (const repo of repos) {
    try {
      const repoCommits = await client.getCommits(repo)
      commits = [...commits, ...repoCommits]
    } catch (err) {
      console.warn(err)
    }
  }

  const leaders = analyseCommits(commits).sort((a, b) => b.overallScore - a.overallScore)

  await redis.set("lastUpdate", Date.now())
  await redis.set("leaders", leaders)
}

export async function POST() {
  await updateLeaderboard()
  return Response.json({ success: true })
}
