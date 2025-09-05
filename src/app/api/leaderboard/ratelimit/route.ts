import { redis } from "@/lib/upstash"

export async function GET() {
  const ratelimit = await redis.get("ratelimit")
  return Response.json(ratelimit)
}
