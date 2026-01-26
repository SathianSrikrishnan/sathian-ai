interface QuickPromptsProps {
  prompts: string[]
  onSelect: (prompt: string) => void
  mode: 'standard' | 'kids'
  compact?: boolean
}

export function QuickPrompts({ prompts, onSelect, mode, compact }: QuickPromptsProps) {
  return (
    <div className={`flex flex-wrap gap-2 ${compact ? '' : 'justify-center'}`}>
      {prompts.map((prompt, i) => (
        <button
          key={i}
          onClick={() => onSelect(prompt)}
          className={`rounded-full transition-colors ${
            mode === 'kids'
              ? 'px-5 py-2.5 text-base border-2 border-orange-300 bg-white hover:bg-orange-100 hover:border-orange-400 text-orange-600 font-medium shadow-sm'
              : compact
              ? 'px-3 py-1.5 text-sm border border-gray-700 hover:border-primary hover:bg-gray-800 text-gray-300 hover:text-light'
              : 'px-4 py-2 text-sm border border-gray-700 hover:border-primary hover:bg-gray-800 text-gray-300 hover:text-light'
          }`}
        >
          {prompt}
        </button>
      ))}
    </div>
  )
}
