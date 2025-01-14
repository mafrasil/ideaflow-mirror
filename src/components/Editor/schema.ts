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
        return ["p", 0];
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
        type: { default: "person" },
        description: { default: null },
      },
      inclusive: false,
      spanning: false,
      excludes: "_",
      parseDOM: [
        {
          tag: "span.mention",
          getAttrs: (dom) => ({
            class: (dom as HTMLElement).getAttribute("class"),
            type: (dom as HTMLElement).getAttribute("data-type"),
            description: (dom as HTMLElement).getAttribute("data-description"),
          }),
        },
      ],
      toDOM: (mark) =>
        [
          "span",
          {
            class: `${mark.attrs.class} group relative cursor-help`,
            "data-type": mark.attrs.type,
            "data-description": mark.attrs.description,
            contenteditable: "false",
          },
          [
            "span",
            {
              class:
                "pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 -translate-y-0.5 rounded bg-gray-900 px-2 py-1 text-xs whitespace-nowrap text-white opacity-0 transition-opacity group-hover:opacity-100",
            },
            mark.attrs.description,
          ],
          ["span", {}, 0],
        ] as const,
    },
  },
});
