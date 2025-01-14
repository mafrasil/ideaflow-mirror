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

export const SUGGESTIONS: Suggestion[] = [
  // People mentions
  {
    id: "1",
    label: "sarah",
    type: "person",
    description: "Sarah Chen - Product Manager",
  },
  {
    id: "2",
    label: "alex",
    type: "person",
    description: "Alex Rodriguez - Engineering Lead",
  },
  {
    id: "3",
    label: "mike",
    type: "person",
    description: "Mike O'Brien - Designer",
  },

  // Tags for document organization
  {
    id: "4",
    label: "meeting",
    type: "tag",
    description: "Tag as meeting notes",
    icon: "📝",
  },
  {
    id: "5",
    label: "decision",
    type: "tag",
    description: "Document a key decision",
    icon: "✅",
  },
  {
    id: "6",
    label: "todo",
    type: "tag",
    description: "Create a new task",
    icon: "📋",
  },

  // AI-powered actions
  {
    id: "7",
    label: "joke",
    type: "ai",
    description: "AI: Tell me a joke",
  },
  {
    id: "8",
    label: "summarize",
    type: "ai",
    description: "AI: Summarize the selected text",
    icon: "✨",
  },
  {
    id: "9",
    label: "translate",
    type: "ai",
    description: "AI: Translate the selected text",
    icon: "🌐",
  },
  {
    id: "10",
    label: "improve",
    type: "ai",
    description: "AI: Improve writing style",
    icon: "✍️",
  },
];
