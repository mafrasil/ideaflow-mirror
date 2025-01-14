import { keymap } from "prosemirror-keymap";
import { baseKeymap, splitBlock, newlineInCode } from "prosemirror-commands";

export const keymapPlugin = keymap({
  ...baseKeymap,
  Enter: splitBlock,
  "Shift-Enter": newlineInCode,
});
