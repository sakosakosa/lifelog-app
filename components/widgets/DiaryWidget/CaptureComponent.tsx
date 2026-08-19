"use client";

import { NodeViewWrapper } from "@tiptap/react";

type Props = {
  node: {
    attrs: {
      id: string | null;
      type: string | null;
    };
  };
};

export default function CaptureComponent({
  node,
}: Props) {
  const { id, type } = node.attrs;

  return (
    <NodeViewWrapper>
      <div className="my-2 rounded-md border border-gray-300 bg-gray-100 px-3 py-2 text-xs">
        Capture: {type} / {id}
      </div>
    </NodeViewWrapper>
  );
}