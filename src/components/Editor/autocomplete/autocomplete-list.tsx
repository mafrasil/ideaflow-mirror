import { useCallback } from "react";
import { Suggestion } from "../types";

interface AutocompleteListProps {
  suggestions: Suggestion[];
  selectedIndex: number;
  onSelect: (suggestion: Suggestion) => void;
}

export default function AutocompleteList({
  suggestions,
  selectedIndex,
  onSelect,
}: AutocompleteListProps) {
  const handleClick = useCallback(
    (suggestion: Suggestion) => {
      onSelect(suggestion);
    },
    [onSelect]
  );

  if (suggestions.length === 0) return null;

  return (
    <div className="absolute z-10 mt-1 max-h-60 w-48 overflow-auto rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5">
      {suggestions.map((suggestion, index) => (
        <div
          key={suggestion.id}
          className={`cursor-pointer px-4 py-2 ${
            index === selectedIndex
              ? "bg-blue-600 text-white"
              : "text-gray-900 hover:bg-gray-100"
          }`}
          onClick={() => handleClick(suggestion)}
        >
          {suggestion.label}
        </div>
      ))}
    </div>
  );
}
