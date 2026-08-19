import { Node } from "@tiptap/core";
import { ReactNodeViewRenderer } from "@tiptap/react";
import CaptureComponent from "./CaptureComponent";

export const CaptureNode = Node.create({
  name: "capture",

  group: "block",

  atom: true,

  addAttributes() {
    return {
      id: {
        default: null,
      },

      type: {
        default: null,
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: "capture",
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "capture",
      HTMLAttributes,
    ];
  },

  addNodeView() {
    return ReactNodeViewRenderer(
      CaptureComponent
    );
  },
});