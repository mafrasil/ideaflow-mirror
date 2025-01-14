import { Schema } from "prosemirror-model";

export const schema = new Schema({
  nodes: {
    doc: {
      content: "block+",
    },
    paragraph: {
      group: "block",
      content: "inline*",
      parseDOM: [{ tag: "p" }],
      toDOM() {
        return ["p", { class: "my-1 px-0.5" }, 0];
      },
    },
    text: {
      group: "inline",
    },
    hard_break: {
      inline: true,
      group: "inline",
      selectable: false,
      parseDOM: [{ tag: "br" }],
      toDOM() {
        return ["br"];
      },
    },
  },
  marks: {
    link: {
      attrs: {
        href: {},
        title: { default: null },
      },
      inclusive: false,
      parseDOM: [
        {
          tag: "a[href]",
          getAttrs(dom) {
            return {
              href: (dom as HTMLElement).getAttribute("href"),
              title: (dom as HTMLElement).getAttribute("title"),
            };
          },
        },
      ],
      toDOM(node) {
        return ["a", node.attrs, 0];
      },
    },
    mention: {
      attrs: {
        class: { default: "" },
      },
      inclusive: false,
      spanning: false,
      excludes: "_",
      parseDOM: [
        {
          tag: "span.mention",
          getAttrs: (dom) => ({
            class: (dom as HTMLElement).getAttribute("class"),
          }),
        },
      ],
      toDOM: (mark) => [
        "span",
        {
          class: mark.attrs.class,
          contenteditable: "false",
          "data-mention": "true",
        },
        0,
      ],
    },
  },
});
