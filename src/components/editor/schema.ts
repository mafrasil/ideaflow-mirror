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
    mention: {
      group: "inline",
      inline: true,
      atom: true,
      attrs: {
        class: { default: "" },
        type: { default: "person" },
        description: { default: null },
        label: { default: "" },
      },
      parseDOM: [
        {
          tag: "span.mention",
          getAttrs: (dom) => ({
            class: (dom as HTMLElement).getAttribute("class"),
            type: (dom as HTMLElement).getAttribute("data-type"),
            description: (dom as HTMLElement).getAttribute("data-description"),
            label: (dom as HTMLElement).textContent,
          }),
        },
      ],
      toDOM(node) {
        const prefix =
          node.attrs.type === "person"
            ? "@"
            : node.attrs.type === "tag"
            ? "#"
            : "✨";

        return [
          "span",
          {
            class: `${node.attrs.class} group relative cursor-help mx-0.5 transition-all duration-100 ProseMirror-selectednode:shadow-[0_0_0_2px_#60A5FA]`,
            "data-type": node.attrs.type,
            "data-description": node.attrs.description,
          },
          [
            "span",
            {
              class:
                "pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 -translate-y-0.5 rounded bg-gray-900 px-2 py-1 text-xs whitespace-nowrap text-white opacity-0 transition-opacity group-hover:opacity-100",
            },
            node.attrs.description,
          ],
          prefix + node.attrs.label,
        ];
      },
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
  },
});
