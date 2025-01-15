import { keymap } from "prosemirror-keymap";
import {
  baseKeymap,
  chainCommands,
  exitCode,
  splitBlock,
} from "prosemirror-commands";
import { EditorState, Transaction } from "prosemirror-state";

const deleteMention = (
  state: EditorState,
  dispatch?: (tr: Transaction) => void
) => {
  const { from, to } = state.selection;

  // Check if we're inside or just before a mention
  let mentionStart = from;
  let mentionEnd = to;
  let hasMention = false;

  // Look for mention marks around the cursor
  state.doc.nodesBetween(Math.max(0, from - 1), to + 1, (node, pos) => {
    if (node.marks && node.marks.length) {
      const mentionMark = node.marks.find((m) => m.type.name === "mention");
      if (mentionMark) {
        hasMention = true;
        // Expand selection to cover the entire mention
        mentionStart = pos;
        mentionEnd = pos + node.nodeSize;
        return false;
      }
    }
  });

  if (!hasMention) return false;

  if (dispatch) {
    dispatch(state.tr.delete(mentionStart, mentionEnd));
  }
  return true;
};

export const keymapPlugin = keymap({
  ...baseKeymap,
  Enter: chainCommands(exitCode, splitBlock),
  "Shift-Enter": splitBlock,
  Backspace: chainCommands(deleteMention, baseKeymap.Backspace),
  Delete: chainCommands(deleteMention, baseKeymap.Delete),
});
