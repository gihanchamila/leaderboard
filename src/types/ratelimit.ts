export default interface RateLimit {
  limit?: number
  used?: number
  remaining?: number
  reset?: number
}
