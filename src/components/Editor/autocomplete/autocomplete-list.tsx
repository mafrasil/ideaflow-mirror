import { Suggestion } from "../types";

interface Props {
  suggestions: Suggestion[];
  selectedIndex: number;
  onSelect: (suggestion: Suggestion) => void;
}

const getTypeStyles = (type: string, isSelected: boolean) => {
  switch (type) {
    case "person":
      return isSelected
        ? "bg-blue-50 text-blue-700"
        : "hover:bg-blue-50/50 text-blue-700";
    case "ai":
      return isSelected
        ? "bg-purple-50 text-purple-700"
        : "hover:bg-purple-50/50 text-purple-700";
    case "tag":
      return isSelected
        ? "bg-green-50 text-green-700"
        : "hover:bg-green-50/50 text-green-700";
    default:
      return isSelected
        ? "bg-gray-50 text-gray-700"
        : "hover:bg-gray-50/50 text-gray-700";
  }
};

export default function AutocompleteList({
  suggestions,
  selectedIndex,
  onSelect,
}: Props) {
  return (
    <div className="bg-white rounded-lg shadow-lg border overflow-hidden min-w-[200px]">
      {suggestions.map((suggestion, index) => {
        const isSelected = index === selectedIndex;
        const typeStyles = getTypeStyles(suggestion.type, isSelected);

        return (
          <div
            key={suggestion.id}
            className={`
              px-3 py-2 cursor-pointer flex items-center gap-2
              transition-colors duration-100 ${typeStyles}
            `}
            onMouseDown={(e) => {
              e.preventDefault();
              onSelect(suggestion);
            }}
          >
            {suggestion.icon && (
              <span className="text-lg">{suggestion.icon}</span>
            )}
            <div>
              <div className="font-medium">@{suggestion.label}</div>
              {suggestion.description && (
                <div className="text-xs text-gray-500">
                  {suggestion.description}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
