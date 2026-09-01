import { Clock, MapPin, Heart, CheckCircle, AlertTriangle } from 'lucide-react'
import { useEmergency } from '../../context/EmergencyContext'

export default function EmergencyHistory() {
  const { emergencyHistory } = useEmergency()

  if (emergencyHistory.length === 0) return null

  return (
    <div className="rounded-2xl bg-white border border-gray-100 shadow-sm overflow-hidden">
      <div className="px-5 py-4 border-b border-gray-100">
        <h3 className="font-bold text-gray-900 flex items-center gap-2">
          <Clock size={18} className="text-red-500" />
          Emergency History
        </h3>
        <p className="text-sm text-gray-400 mt-0.5">{emergencyHistory.length} event{emergencyHistory.length !== 1 ? 's' : ''}</p>
      </div>

      <div className="divide-y divide-gray-50">
        {emergencyHistory.map((emergency) => (
          <div key={emergency.id} className="px-5 py-3 hover:bg-gray-50 transition-colors">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                {emergency.acknowledged ? (
                  <CheckCircle size={14} className="text-green-500" />
                ) : (
                  <AlertTriangle size={14} className="text-red-500" />
                )}
                <span className="font-semibold text-sm text-gray-900">{emergency.patientName}</span>
              </div>
              <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                emergency.acknowledged
                  ? 'bg-green-100 text-green-700'
                  : emergency.status === 'pending'
                    ? 'bg-amber-100 text-amber-700'
                    : 'bg-red-100 text-red-700'
              }`}>
                {emergency.acknowledged ? 'Acknowledged' : emergency.status === 'pending' ? 'Pending' : 'Active'}
              </span>
            </div>

            <div className="flex items-center gap-4 text-xs text-gray-500">
              <span>⏰ {emergency.timestamp}</span>
              {emergency.smartwatch?.connected && (
                <span className="flex items-center gap-1">
                  <Heart size={10} className="text-red-400" />
                  {emergency.smartwatch.heartRate} BPM
                </span>
              )}
              {emergency.location?.available && (
                <span className="flex items-center gap-1">
                  <MapPin size={10} className="text-blue-400" />
                  Location captured
                </span>
              )}
            </div>

            <div className="flex items-center gap-3 mt-1.5 text-[11px] text-gray-400">
              <span>📱 WhatsApp: {emergency.whatsappStatus}</span>
              <span>💬 SMS: {emergency.smsStatus}</span>
              <span className="font-mono">{emergency.id}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
