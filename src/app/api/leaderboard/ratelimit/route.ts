import { GitHubAPI } from "@/utils/github-api"

export async function GET() {
  const { GITHUB_OWNER, GITHUB_TOKEN } = process.env
  if (!GITHUB_OWNER || !GITHUB_TOKEN) throw new Error("Something went wrong")
  const client = new GitHubAPI(GITHUB_TOKEN, GITHUB_OWNER)

  const ratelimit = await client.getRateLimit()
  return Response.json(ratelimit)
}
