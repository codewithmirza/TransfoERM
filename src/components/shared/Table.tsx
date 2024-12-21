interface TableProps<T> {
  data: T[]
  columns: {
    key: keyof T
    header: string
    render?: (value: T[keyof T], item: T) => React.ReactNode
  }[]
  loading?: boolean
  onRowClick?: (item: T) => void
}

export function Table<T extends { id: string }>({ 
  data,
  columns,
  loading,
  onRowClick
}: TableProps<T>) {
  if (loading) {
    return <div className="animate-pulse">Loading...</div>
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {columns.map(column => (
              <th
                key={column.key as string}
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.map(item => (
            <tr
              key={item.id}
              onClick={() => onRowClick?.(item)}
              className={onRowClick ? 'cursor-pointer hover:bg-gray-50' : ''}
            >
              {columns.map(column => (
                <td
                  key={`${item.id}-${column.key as string}`}
                  className="px-6 py-4 whitespace-nowrap"
                >
                  {column.render
                    ? column.render(item[column.key], item)
                    : item[column.key] as React.ReactNode}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
} 