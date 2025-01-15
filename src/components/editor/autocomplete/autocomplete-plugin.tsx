import { Plugin, PluginKey } from "prosemirror-state";
import { schema } from "../schema";
import {
  AutocompleteState,
  Suggestion,
  SUGGESTIONS,
  SuggestionType,
} from "../types";
import { EditorView } from "prosemirror-view";

export const autocompleteKey = new PluginKey("autocomplete");

const getTypeColor = (type: SuggestionType) => {
  switch (type) {
    case "person":
      return "bg-blue-100 text-blue-700";
    case "ai":
      return "bg-purple-100 text-purple-700";
    case "tag":
      return "bg-green-100 text-green-700";
    default:
      return "bg-gray-200 text-gray-700";
  }
};

const insertMention = (
  view: EditorView,
  state: AutocompleteState,
  suggestion: Suggestion
) => {
  const { tr } = view.state;
  if (state.position === null) return;
  const insertPos = state.position - 2;

  // Delete the trigger and query
  tr.delete(insertPos, state.position + state.query.length);

  // For AI commands, handle separately
  if (suggestion.type === "ai") {
    tr.setMeta("aiCommand", { suggestion, position: insertPos });
    view.dispatch(tr);
    return;
  }

  // Create mention node
  const mentionNode = schema.nodes.mention.create({
    class: `${getTypeColor(
      suggestion.type
    )} px-1.5 py-0.5 rounded font-medium transition-colors`,
    type: suggestion.type,
    description: suggestion.description,
    label: suggestion.label,
  });

  // Insert the node
  tr.insert(insertPos, mentionNode);
  tr.insertText(" ", insertPos + 1);

  tr.setMeta(autocompleteKey, {
    active: false,
    position: null,
    query: "",
    selectedIndex: 0,
  });

  view.dispatch(tr);
  view.focus();
};

export const autocompletePlugin = new Plugin({
  key: autocompleteKey,
  state: {
    init(): AutocompleteState {
      return {
        active: false,
        position: null,
        query: "",
        selectedIndex: 0,
      };
    },
    apply(tr, state) {
      const newState = { ...state };

      const meta = tr.getMeta(autocompleteKey);
      if (meta) {
        return meta;
      }

      if (tr.docChanged) {
        const pos = tr.selection.$from.pos;
        const textBefore = tr.doc.textBetween(
          Math.max(0, pos - 100),
          pos,
          "\n"
        );

        // Updated regex to explicitly disallow newlines
        const match = textBefore.match(/<>([^\n]*)$/);

        if (match) {
          newState.active = true;
          newState.position = pos - (match[1]?.length || 0);
          newState.query = match[1] || "";
        } else {
          newState.active = false;
          newState.position = null;
          newState.query = "";
          newState.selectedIndex = 0;
        }
      }

      return newState;
    },
  },
  props: {
    handleKeyDown(view, event) {
      const state = autocompleteKey.getState(view.state);

      // Only handle Enter/Tab if autocomplete is active
      if (!state.active) {
        return false; // Let other plugins handle the event
      }

      // Get filtered suggestions
      const filteredSuggestions = SUGGESTIONS.filter((suggestion) =>
        suggestion.label.toLowerCase().startsWith(state.query.toLowerCase())
      );

      switch (event.key) {
        case "ArrowUp": {
          event.preventDefault();
          const prevIndex =
            (state.selectedIndex - 1 + filteredSuggestions.length) %
            filteredSuggestions.length;
          view.dispatch(
            view.state.tr.setMeta(autocompleteKey, {
              ...state,
              selectedIndex: prevIndex,
            })
          );
          return true;
        }

        case "ArrowDown": {
          event.preventDefault();
          const nextIndex =
            (state.selectedIndex + 1) % filteredSuggestions.length;
          view.dispatch(
            view.state.tr.setMeta(autocompleteKey, {
              ...state,
              selectedIndex: nextIndex,
            })
          );
          return true;
        }

        case "Enter":
        case "Tab":
          // Only handle Enter/Tab if we have suggestions
          if (
            state.active &&
            state.position !== null &&
            filteredSuggestions.length > 0
          ) {
            event.preventDefault();
            const suggestion = filteredSuggestions[state.selectedIndex];
            if (suggestion) {
              insertMention(view, state, suggestion);
            }
            return true;
          }
          return false;

        case "Escape":
          view.dispatch(
            view.state.tr.setMeta(autocompleteKey, {
              active: false,
              position: null,
              query: "",
              selectedIndex: 0,
            })
          );
          return true;
      }

      return false;
    },
  },
});
