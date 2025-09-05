"use client"

import { useState, useEffect } from "react"

function useFetch<T>(
  url: string | URL,
  initialValue: T,
  refreshFlag: boolean,
): [T, string, boolean] {
  const [data, setData] = useState<T>(initialValue)
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)
        let response = await fetch(url)
        let result = await response.json()
        if (!response.ok) throw new Error(result.body || response.statusText)
        setData(result)
        setIsLoading(false)
      } catch (error) {
        setError((error as Error).message)
      }
    }
    fetchData()
  }, [url, refreshFlag])

  return [data, error, isLoading]
}

export default useFetch
