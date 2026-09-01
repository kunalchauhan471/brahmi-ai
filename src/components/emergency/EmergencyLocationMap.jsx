export default function EmergencyLocationMap({ location, patientName }) {
  if (!location?.available) {
    return (
      <div className="rounded-xl bg-gray-50 border border-gray-200 p-4 text-center">
        <div className="text-2xl mb-2">📍</div>
        <div className="text-sm font-medium text-gray-500">Location Unavailable</div>
        <div className="text-xs text-gray-400 mt-1">GPS permission denied or location not captured</div>
      </div>
    )
  }

  const { latitude, longitude, accuracy } = location
  const mapsLink = `https://www.google.com/maps?q=${latitude},${longitude}`
  const embedUrl = `https://maps.google.com/maps?q=${latitude},${longitude}&z=15&output=embed`

  return (
    <div className="rounded-xl overflow-hidden border border-gray-200">
      {/* Map Embed */}
      <div className="h-56 sm:h-72 bg-gray-100 relative">
        <iframe
          src={embedUrl}
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="Patient Location"
        />
        {/* Overlay with patient name */}
        <div className="absolute top-3 left-3 bg-white rounded-lg px-3 py-1.5 shadow-md">
          <div className="text-sm font-bold text-gray-900">📍 {patientName || 'Patient'}</div>
          <div className="text-[10px] text-gray-500">Emergency Location</div>
        </div>
      </div>

      {/* Location Info */}
      <div className="bg-white p-3 flex items-center justify-between">
        <div className="text-xs text-gray-500">
          📍 {latitude.toFixed(6)}, {longitude.toFixed(6)}
          <br />
          Accuracy: ±{Math.round(accuracy)}m
        </div>
        <a
          href={mapsLink}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs font-medium px-3 py-1.5 rounded-lg bg-primary-50 text-primary-600 hover:bg-primary-100 transition-colors"
        >
          Open Directions →
        </a>
      </div>
    </div>
  )
}
