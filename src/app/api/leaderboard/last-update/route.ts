import { redis } from "@/lib/upstash"

export async function GET() {
  const lastUpdate = await redis.get("lastUpdate")
  return Response.json({ lastUpdate })
}
