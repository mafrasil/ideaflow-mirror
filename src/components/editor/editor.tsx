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
import { Node } from "prosemirror-model";
import { generateJoke } from "../../services/ai-service";

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

interface EditorProps {
  defaultContent?: string;
}

export default function Editor({ defaultContent = "" }: EditorProps) {
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

    // Split content by newlines and create paragraph nodes
    const paragraphs = defaultContent
      .split(/\n\n+/) // Split on multiple newlines for paragraph breaks
      .map((paragraph) => {
        // Handle single line breaks within paragraphs
        const lines = paragraph.split(/\n/);
        const nodes = lines.reduce((acc: Node[], line, i) => {
          if (i > 0) acc.push(schema.node("hard_break")); // Add hard break between lines
          if (line) acc.push(schema.text(line));
          return acc;
        }, []);

        return schema.node("paragraph", null, nodes);
      });

    const state = EditorState.create({
      schema,
      plugins: [autocompletePlugin, keymapPlugin],
      doc: schema.node("doc", null, paragraphs),
    });

    const view = new EditorView(editorRef.current, {
      state,
      dispatchTransaction(transaction) {
        const newState = view.state.apply(transaction);
        view.updateState(newState);

        // Handle AI commands
        const aiCommand = transaction.getMeta("aiCommand");
        if (aiCommand) {
          const { suggestion, position } = aiCommand;
          if (suggestion.label === "joke") {
            handleJoke(view, position);
          }
        }

        const pluginState = autocompleteKey.getState(newState);
        setAutocompleteState(pluginState);
      },
    });

    view.dom.classList.add("ProseMirror", "h-full", "w-full");
    viewRef.current = view;

    return () => {
      view.destroy();
    };
  }, [defaultContent]);

  const getPopupPosition = () => {
    if (!viewRef.current || autocompleteState.position === null) return null;

    const view = viewRef.current;
    const pos = autocompleteState.position;
    const coords = view.coordsAtPos(pos);
    const domRect = view.dom.getBoundingClientRect();

    return {
      left: coords.left - domRect.left,
      top: coords.bottom - domRect.top + 20,
    };
  };

  const filteredSuggestions = SUGGESTIONS.filter((suggestion) =>
    suggestion.label
      .toLowerCase()
      .startsWith(autocompleteState.query.toLowerCase())
  );

  const popupPosition = getPopupPosition();

  const handleSuggestionSelect = async (suggestion: Suggestion) => {
    if (!viewRef.current) return;

    const view = viewRef.current;
    const state = autocompleteKey.getState(view.state);

    if (state.position !== null) {
      const { tr } = view.state;
      const insertPos = state.position - 2;

      // Delete the trigger and query
      tr.delete(insertPos, state.position + state.query.length);

      // Handle AI commands
      if (suggestion.type === "ai") {
        if (suggestion.label === "joke") {
          // Insert loading placeholder
          const loadingText = "🤔 Thinking of a joke...";
          tr.insertText(loadingText, insertPos);
          view.dispatch(tr);

          try {
            // Get the joke
            const joke = await generateJoke();

            // Replace loading text with joke
            const newTr = view.state.tr;
            newTr.delete(insertPos, insertPos + loadingText.length);
            newTr.insertText(`😄 ${joke}`, insertPos);
            view.dispatch(newTr);
          } catch (error: unknown) {
            console.error("Error generating joke:", error);
            const newTr = view.state.tr;
            newTr.delete(insertPos, insertPos + loadingText.length);
            newTr.insertText("❌ Failed to generate joke", insertPos);
            view.dispatch(newTr);
          }
          return;
        }
      }

      const prefix =
        suggestion.type === "person"
          ? "@"
          : suggestion.type === "tag"
          ? "#"
          : "✨";

      const mentionText = `${prefix}${suggestion.label}`;

      const mark = schema.marks.mention.create({
        class: `${getTypeColor(
          suggestion.type
        )} px-1.5 py-0.5 rounded font-medium transition-colors`,
        type: suggestion.type,
        description: suggestion.description,
      });

      tr.insertText(mentionText, insertPos);
      tr.addMark(insertPos, insertPos + mentionText.length, mark);
      tr.insertText(" ", insertPos + mentionText.length);
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

  const handleJoke = async (view: EditorView, position: number) => {
    // Insert loading placeholder
    const loadingText = "🤔 Thinking of a joke...";
    const tr = view.state.tr;
    tr.insertText(loadingText, position);
    view.dispatch(tr);

    try {
      const joke = await generateJoke();

      const newTr = view.state.tr;
      newTr.delete(position, position + loadingText.length);
      newTr.insertText(`😄 ${joke}`, position);
      view.dispatch(newTr);
    } catch (error: unknown) {
      console.error("Error generating joke:", error);
      const newTr = view.state.tr;
      newTr.delete(position, position + loadingText.length);
      newTr.insertText("❌ Failed to generate joke", position);
      view.dispatch(newTr);
    }
  };

  return (
    <div className="relative prose max-w-none h-full">
      <div
        ref={editorRef}
        className="h-full p-4 rounded-md outline-none editor-focus shadow-sm"
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
