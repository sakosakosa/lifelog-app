import { RefObject } from "react";

type Props = {
    x: number;
    y: number;
    onDelete: () => void;
    menuRef: RefObject<HTMLDivElement | null>;
};


export default function ContextMenu({
    x,
    y,
    onDelete,
    menuRef,
}: Props) {

    return (
        <div
            ref={menuRef}
            className="fixed z-50 w-40 rounded-md border bg-white shadow-lg"
            style={{
                left: x,
                top: y,
            }}
        >
            <button
                onClick={onDelete}
                className="w-full px-4 py-2 text-left hover:bg-gray-100"
            >
                🗑 削除

            </button>
        </div>
    );
}