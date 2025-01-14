import { useEffect, useRef, useState } from "react";
import { EditorState, TextSelection } from "prosemirror-state";
import { EditorView } from "prosemirror-view";
import AutocompleteList from "../editor/autocomplete/autocomplete-list";
import {
  autocompleteKey,
  autocompletePlugin,
} from "../editor/autocomplete/autocomplete-plugin";
import { schema } from "./schema";
import {
  AutocompleteState,
  SUGGESTIONS,
  Suggestion,
  SuggestionType,
} from "./types";
import { keymapPlugin } from "./plugins/keymap-plugin";

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

export default function Editor() {
  const editorRef = useRef<HTMLDivElement>(null);
  const viewRef = useRef<EditorView | null>(null);
  const [autocompleteState, setAutocompleteState] = useState<AutocompleteState>(
    {
      active: false,
      position: null,
      query: "",
      selectedIndex: 0,
    }
  );

  useEffect(() => {
    if (!editorRef.current) return;

    const state = EditorState.create({
      schema,
      plugins: [autocompletePlugin, keymapPlugin],
    });

    const view = new EditorView(editorRef.current, {
      state,
      dispatchTransaction(transaction) {
        const newState = view.state.apply(transaction);
        view.updateState(newState);

        const pluginState = autocompleteKey.getState(newState);
        setAutocompleteState(pluginState);
      },
    });

    view.dom.classList.add("ProseMirror");
    viewRef.current = view;

    return () => {
      view.destroy();
    };
  }, []);

  const getPopupPosition = () => {
    if (!viewRef.current || autocompleteState.position === null) return null;

    const view = viewRef.current;
    const pos = autocompleteState.position;
    const coords = view.coordsAtPos(pos);
    const domRect = view.dom.getBoundingClientRect();

    return {
      left: coords.left - domRect.left,
      top: coords.bottom - domRect.top + 10,
    };
  };

  const filteredSuggestions = SUGGESTIONS.filter((suggestion) =>
    suggestion.label
      .toLowerCase()
      .startsWith(autocompleteState.query.toLowerCase())
  );

  const popupPosition = getPopupPosition();

  const handleSuggestionSelect = (suggestion: Suggestion) => {
    if (!viewRef.current) return;

    const view = viewRef.current;
    const state = autocompleteKey.getState(view.state);

    if (state.position !== null) {
      const { tr } = view.state;
      const insertPos = state.position - 2;

      // Delete the trigger and query
      tr.delete(insertPos, state.position + state.query.length);

      // Insert the mention text
      const mentionText = `@${suggestion.label}`;

      // Add text with a custom mark for styling
      const mark = schema.marks.mention.create({
        class: `${getTypeColor(
          suggestion.type
        )} px-1.5 py-0.5 rounded font-medium transition-colors`,
        type: suggestion.type,
        description: suggestion.description,
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
    }
  };

  return (
    <div className="relative prose max-w-none">
      <div
        ref={editorRef}
        className="min-h-[200px] border rounded-md outline-none focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 shadow-sm"
      />
      {autocompleteState.active &&
        popupPosition &&
        filteredSuggestions.length > 0 && (
          <div
            className="absolute z-50"
            style={{
              left: popupPosition.left,
              top: popupPosition.top,
            }}
          >
            <AutocompleteList
              suggestions={filteredSuggestions}
              selectedIndex={autocompleteState.selectedIndex}
              onSelect={handleSuggestionSelect}
            />
          </div>
        )}
    </div>
  );
}
