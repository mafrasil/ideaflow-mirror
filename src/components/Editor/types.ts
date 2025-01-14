import { EditorState } from "prosemirror-state";

export interface AutocompleteState {
  active: boolean;
  position: number | null;
  query: string;
  selectedIndex: number;
}

export interface EditorProps {
  onChange?: (state: EditorState) => void;
}

export type SuggestionType = "person" | "ai" | "tag";

export type Suggestion = {
  id: string;
  label: string;
  type: SuggestionType;
  description?: string;
  icon?: string;
};

// Enhanced suggestions with different types and descriptions
export const SUGGESTIONS: Suggestion[] = [
  {
    id: "1",
    label: "mention",
    type: "person",
    description: "Mention a team member",
  },
  {
    id: "2",
    label: "meeting",
    type: "tag",
    description: "Tag as meeting notes",
  },
  {
    id: "3",
    label: "summarize",
    type: "ai",
    description: "AI: Summarize the selected text",
    icon: "✨",
  },
  {
    id: "4",
    label: "task",
    type: "tag",
    description: "Create a new task",
  },
  {
    id: "5",
    label: "assistant",
    type: "ai",
    description: "AI: Ask for assistance",
    icon: "🤖",
  },
];
