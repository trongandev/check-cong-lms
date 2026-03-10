import { useSortable } from "@dnd-kit/sortable"
import { Button } from "../ui/button"
import { Edit, GripVertical, Trash } from "lucide-react"
import { CSS } from "@dnd-kit/utilities"
interface Props {
    sheet: any
    index: number
    handleEdit: (sheet: any) => void
    setSelectedSheetId: (id: string) => void
}
export default function SortableList({ sheet, index, handleEdit, setSelectedSheetId }: Props) {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging, isOver } = useSortable({
        id: sheet._id,
        data: sheet.index,
    })

    const style = {
        transform: CSS.Transform.toString(transform),
        transition: transition || "transform 200ms ease", // ✅ Thêm transition mặc định
        opacity: isDragging ? 0.5 : 1,
        zIndex: isDragging ? 100 : 1,
        scale: isDragging ? "1.02" : "1",
    }

    return (
        <div
            className={`border p-5 rounded-lg bg-gray-50/20 relative group flex gap-5 justify-between items-center select-none ${
                isDragging ? "border-primary shadow-2xl " : isOver ? "cursor-grabbing border-primary/50 border-dashed" : "cursor-grab border-gray-300/50 dark:border-white/10"
            }`}
            style={style}
        >
            <div className="w-12 h-12 flex items-center justify-center bg-gray-100 rounded-lg font-bold text-md border border-gray-200">{index + 1}</div>
            <div className="flex-1">
                <p>
                    Tháng: <span className="font-bold">{sheet.month}</span>
                </p>

                <p className="flex items-center gap-1">
                    Liên kết:
                    <a href={sheet.link} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline line-clamp-1 ">
                        Nhấn vào đây
                    </a>
                </p>
                <div className="mt-3">
                    <Button variant={"outline"} onClick={() => handleEdit(sheet)} className=" ">
                        <Edit size={20} />
                    </Button>
                    <Button variant={"destructive"} className="ml-2 text-white" onClick={() => setSelectedSheetId(sheet._id)}>
                        <Trash size={20} />
                    </Button>
                </div>
            </div>
            <div className="" ref={setNodeRef} {...attributes} {...listeners}>
                <GripVertical className={` hover:text-primary`} />
            </div>
        </div>
    )
}
