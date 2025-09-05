import { ReactNode } from "react"

type TableProps = {
  headers: string[]
  rows: (string | number | ReactNode)[][]
  isLoading?: boolean
}

export default function Table({ headers, rows, isLoading }: TableProps) {
  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white shadow-sm">
      <table className="min-w-full text-sm text-left text-gray-700">
        <thead className="bg-gray-100 text-gray-600 uppercase tracking-wider">
          <tr>
            {headers.map((header, index) => (
              <th key={index} className="px-4 py-3">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {isLoading ? (
            Array.from({ length: 5 }).map((_, rowIndex) => (
              <tr key={rowIndex} className="animate-pulse">
                {Array.from({ length: headers.length }).map((_, cellIndex) => (
                  <td key={cellIndex} className="px-4 py-3">
                    <div className="h-6 bg-gray-300 rounded w-full"></div>
                  </td>
                ))}
              </tr>
            ))
          ) : rows.length === 0 ? (
            <tr className="hover:bg-gray-200">
              <td key="table-no-data" className="px-4 py-3" colSpan={headers.length}>
                No data
              </td>
            </tr>
          ) : (
            rows.map((row, rowIndex) => (
              <tr key={rowIndex} className="nth-[even]:bg-gray-100 hover:bg-gray-200">
                {row.map((cell, cellIndex) => (
                  <td key={cellIndex} className="px-4 py-3">
                    {cell}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}
