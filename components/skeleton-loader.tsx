export function SkeletonCard() {
  return (
    <div className="border-2 border-white/20 p-6 animate-pulse">
      <div className="h-4 bg-white/10 w-16 mb-4" />
      <div className="h-8 bg-white/10 w-3/4 mb-3" />
      <div className="h-4 bg-white/10 w-full mb-2" />
      <div className="h-4 bg-white/10 w-2/3" />
    </div>
  )
}

export function SkeletonTable() {
  return (
    <div className="border-2 border-white/20 overflow-hidden">
      <div className="bg-[#1e1e1e] border-b-2 border-white/20 p-4">
        <div className="h-4 bg-white/10 w-32" />
      </div>
      {[...Array(5)].map((_, i) => (
        <div key={i} className="border-b border-white/10 p-4 animate-pulse">
          <div className="flex items-center gap-4">
            <div className="h-4 bg-white/10 w-12" />
            <div className="h-4 bg-white/10 w-48" />
            <div className="h-4 bg-white/10 w-24" />
          </div>
        </div>
      ))}
    </div>
  )
}
