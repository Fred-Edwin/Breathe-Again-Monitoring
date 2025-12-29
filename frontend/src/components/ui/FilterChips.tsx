interface FilterChipsProps {
    options: { label: string; value: string; count?: number }[]
    selected: string
    onChange: (value: string) => void
}

export default function FilterChips({ options, selected, onChange }: FilterChipsProps) {
    return (
        <div className="flex flex-wrap gap-2">
            {options.map((option) => {
                const isSelected = selected === option.value

                return (
                    <button
                        key={option.value}
                        onClick={() => onChange(option.value)}
                        className={`
                            px-4 py-2 rounded-full text-sm font-medium transition-all duration-200
                            ${isSelected
                                ? 'bg-primary-600 text-white shadow-md'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }
                        `}
                    >
                        {option.label}
                        {option.count !== undefined && (
                            <span className={`ml-2 ${isSelected ? 'text-white' : 'text-gray-500'}`}>
                                ({option.count})
                            </span>
                        )}
                    </button>
                )
            })}
        </div>
    )
}
