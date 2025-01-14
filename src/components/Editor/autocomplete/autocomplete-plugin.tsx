import { Plugin, PluginKey, TextSelection } from "prosemirror-state";
import { schema } from "../schema";
import { AutocompleteState, SUGGESTIONS } from "../types";
import { EditorView } from "prosemirror-view";

export const autocompleteKey = new PluginKey("autocomplete");

const insertMention = (
  view: EditorView,
  state: AutocompleteState,
  suggestion: { label: string }
) => {
  const { tr } = view.state;
  if (state.position === null) return;
  const insertPos = state.position - 2;

  // Delete the trigger and query
  tr.delete(insertPos, state.position + state.query.length);

  // Insert the mention text
  const mentionText = `@${suggestion.label}`;

  // Add text with a custom mark for styling
  const mark = schema.marks.mention.create({
    class: "bg-gray-200 px-1.5 py-0.5 rounded text-gray-700 font-medium",
  });
  tr.insertText(mentionText, insertPos);
  tr.addMark(insertPos, insertPos + mentionText.length, mark);

  // Add a space after the mention
  tr.insertText(" ", insertPos + mentionText.length);

  // Set selection after the space
  tr.setSelection(
    TextSelection.create(tr.doc, insertPos + mentionText.length + 1)
  );

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
      if (!state.active) {
        // Handle backspace for mentions when autocomplete is not active
        if (event.key === "Backspace") {
          const { $from } = view.state.selection;

          // Check if there's a mention mark right before the cursor
          if ($from.pos > 0) {
            const before = view.state.doc.resolve($from.pos - 1);
            const mentionBefore = before
              .marks()
              .find((m) => m.type === schema.marks.mention);

            if (mentionBefore) {
              event.preventDefault();
              const { tr } = view.state;
              let deleteFrom = $from.pos - 1;

              // Walk backwards to find start of mention
              while (deleteFrom > 0) {
                const pos = view.state.doc.resolve(deleteFrom);
                if (!pos.marks().find((m) => m.type === schema.marks.mention)) {
                  break;
                }
                deleteFrom--;
              }

              // Delete the entire mention and the space after it
              tr.delete(deleteFrom, $from.pos);
              view.dispatch(tr);
              return true;
            }

            // Also check if we're right after a space that follows a mention
            const twoCharsBefore = view.state.doc.resolve($from.pos - 2);
            const mentionTwoCharsBefore = twoCharsBefore
              .marks()
              .find((m) => m.type === schema.marks.mention);

            if (mentionTwoCharsBefore) {
              event.preventDefault();
              const { tr } = view.state;
              let deleteFrom = $from.pos - 2;

              // Walk backwards to find start of mention
              while (deleteFrom > 0) {
                const pos = view.state.doc.resolve(deleteFrom);
                if (!pos.marks().find((m) => m.type === schema.marks.mention)) {
                  break;
                }
                deleteFrom--;
              }

              // Delete the entire mention and the space after it
              tr.delete(deleteFrom, $from.pos);
              view.dispatch(tr);
              return true;
            }
          }

          // Fallback for cursor inside mention (shouldn't happen with contenteditable=false)
          const mentionAtCursor = $from
            .marks()
            .find((m) => m.type === schema.marks.mention);
          if (mentionAtCursor) {
            event.preventDefault();
            const { tr } = view.state;
            let start = $from.pos;
            let end = start;

            while (end > 0) {
              const pos = view.state.doc.resolve(end - 1);
              if (!pos.marks().find((m) => m.type === schema.marks.mention)) {
                break;
              }
              end--;
            }

            while (start < tr.doc.nodeSize - 2) {
              const pos = view.state.doc.resolve(start + 1);
              if (!pos.marks().find((m) => m.type === schema.marks.mention)) {
                break;
              }
              start++;
            }

            // Delete the entire mention and any trailing space
            tr.delete(end, start + 1);
            view.dispatch(tr);
            return true;
          }

          return false;
        }
        return false;
      }

      switch (event.key) {
        case "ArrowUp": {
          event.preventDefault();
          const prevIndex =
            (state.selectedIndex - 1 + SUGGESTIONS.length) % SUGGESTIONS.length;
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
          const nextIndex = (state.selectedIndex + 1) % SUGGESTIONS.length;
          view.dispatch(
            view.state.tr.setMeta(autocompleteKey, {
              ...state,
              selectedIndex: nextIndex,
            })
          );
          return true;
        }

        case "Enter":
          if (state.active && state.position !== null) {
            event.preventDefault();
            const suggestion = SUGGESTIONS[state.selectedIndex];
            insertMention(view, state, suggestion);
            return true;
          }
          return false;

        case "Tab":
          if (state.position !== null) {
            event.preventDefault();
            const suggestion = SUGGESTIONS[state.selectedIndex];
            insertMention(view, state, suggestion);
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
