interface StatsCardsProps {
  stats: {
    total: number
    published: number
    draft: number
    totalViews: number
  }
}

export function StatsCards({ stats }: StatsCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <div className="text-2xl font-bold text-blue-600 mb-2">{stats.total}</div>
        <div className="text-gray-600">Tổng nội dung</div>
      </div>
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <div className="text-2xl font-bold text-green-600 mb-2">{stats.published}</div>
        <div className="text-gray-600">Đã xuất bản</div>
      </div>
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <div className="text-2xl font-bold text-yellow-600 mb-2">{stats.draft}</div>
        <div className="text-gray-600">Bản nháp</div>
      </div>
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <div className="text-2xl font-bold text-purple-600 mb-2">{stats.totalViews}</div>
        <div className="text-gray-600">Tổng lượt xem</div>
      </div>
    </div>
  )
}