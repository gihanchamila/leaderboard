import { Octokit } from "@octokit/rest"

export class GitHubAPI {
  private octokit: Octokit
  private owner: string

  constructor(token: string, owner: string) {
    this.octokit = new Octokit({ auth: token })
    this.owner = owner
  }

  async getUserRepos() {
    const response = await this.octokit.repos.listForUser({
      username: this.owner,
      per_page: 100,
    })
    return response.data.map((repo) => repo.name)
  }

  async getOrgRepos() {
    const response = await this.octokit.repos.listForOrg({
      org: this.owner,
      per_page: 100,
    })
    return response.data.filter((repo) => !repo.fork).map((repo) => repo.name)
  }

  async getCommits(repo: string) {
    const response = await this.octokit.repos.listCommits({
      owner: this.owner,
      repo,
      per_page: 100,
    })

    const commits = Promise.all(response.data.map((commit) => this.getCommit(commit.sha, repo)))
    return commits
  }

  async getCommit(ref: string, repo: string) {
    const response = await this.octokit.repos.getCommit({
      owner: this.owner,
      ref,
      repo,
    })
    return response.data
  }

  async getRateLimit() {
    const response = await this.octokit.request("GET /rate_limit")
    return response.data.rate
  }
}
