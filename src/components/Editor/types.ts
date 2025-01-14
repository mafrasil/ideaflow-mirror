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

export type Suggestion = {
  id: string;
  label: string;
};

// We'll use these hardcoded suggestions for now
export const SUGGESTIONS: Suggestion[] = [
  { id: "1", label: "mention" },
  { id: "2", label: "meeting" },
  { id: "3", label: "memo" },
  { id: "4", label: "task" },
  { id: "5", label: "todo" },
];
