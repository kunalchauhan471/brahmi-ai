/**
 * MemoryPhoto — Shows the uploaded family photo if available,
 * otherwise falls back to the emoji avatar + gradient tile.
 * Used across games and galleries so uploaded photos always appear.
 */
export default function MemoryPhoto({ memory, className = '', imgClassName = '', emojiClassName = '' }) {
  const hasPhoto = memory?.photo && typeof memory.photo === 'string' && memory.photo.startsWith('data:')

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {hasPhoto ? (
        <img
          src={memory.photo}
          alt={memory.name || 'Memory'}
          className={`w-full h-full object-cover ${imgClassName}`}
          draggable={false}
        />
      ) : (
        <div className={`w-full h-full bg-gradient-to-br ${memory?.color || 'from-blue-400 to-blue-600'} flex items-center justify-center ${emojiClassName}`}>
          <span>{memory?.emoji || '👤'}</span>
        </div>
      )}
    </div>
  )
}
