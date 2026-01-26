interface ModeToggleProps {
  mode: 'standard' | 'kids'
  onModeChange: (mode: 'standard' | 'kids') => void
}

export function ModeToggle({ mode, onModeChange }: ModeToggleProps) {
  return (
    <div className="flex items-center gap-2 bg-gray-800 rounded-full p-1">
      <button
        onClick={() => onModeChange('standard')}
        className={`px-3 py-1.5 rounded-full text-sm transition-colors ${
          mode === 'standard'
            ? 'bg-primary text-white'
            : 'text-gray-400 hover:text-light'
        }`}
      >
        Standard
      </button>
      <button
        onClick={() => onModeChange('kids')}
        className={`px-3 py-1.5 rounded-full text-sm transition-colors ${
          mode === 'kids'
            ? 'bg-accent text-dark'
            : 'text-gray-400 hover:text-light'
        }`}
      >
        Kids
      </button>
    </div>
  )
}
