export default function EmergencyTimeline({ timeline }) {
  if (!timeline || timeline.length === 0) return null

  return (
    <div className="rounded-xl bg-white border border-gray-100 p-4">
      <div className="text-xs font-semibold text-gray-400 uppercase mb-3">⏱ Emergency Timeline</div>
      <div className="relative">
        {/* Vertical line */}
        <div className="absolute left-[5px] top-2 bottom-2 w-0.5 bg-gray-100" />

        <div className="space-y-3">
          {timeline.map((event, i) => (
            <div key={i} className="flex items-start gap-3 relative">
              <div className={`w-3 h-3 rounded-full mt-1 flex-shrink-0 z-10 ${
                event.type === 'emergency' ? 'bg-red-500' :
                event.type === 'success' ? 'bg-green-500' :
                event.type === 'warning' ? 'bg-amber-400' :
                'bg-blue-400'
              }`} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-gray-400 whitespace-nowrap">{event.time}</span>
                </div>
                <div className="text-sm text-gray-700 mt-0.5">{event.event}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
