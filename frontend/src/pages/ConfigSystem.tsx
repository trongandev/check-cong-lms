import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import configService from "@/services/configService"
import { ConfigRequest, LinkSheetRequest } from "@/types/type"
import { useFormik } from "formik"
import { Send } from "lucide-react"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import * as Yup from "yup"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import { Link } from "react-router-dom"
import SortableList from "@/components/etc/SortableList"
import { closestCenter, DndContext, DragEndEvent, PointerSensor, useSensor, useSensors } from "@dnd-kit/core"
import { arrayMove, rectSortingStrategy, SortableContext } from "@dnd-kit/sortable"
export default function ConfigSystem() {
    const [loading, setLoading] = useState(false)
    const [showModel, setShowModel] = useState<{ type: string; status: boolean }>({ type: "add", status: false }) // null or sheet object
    const [configData, setConfigData] = useState<ConfigRequest>()
    const [selectedSheet, setSelectedSheet] = useState<LinkSheetRequest | null>(null)
    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            },
        }),
    )
    useEffect(() => {
        const fetchConfig = async () => {
            try {
                setLoading(true)
                const data = await configService.getConfigDefault()
                setConfigData(data)
            } catch (error: any) {
                toast.error(error.response?.data?.message || "Lỗi khi tải cấu hình")
                console.error("Error fetching config:", error)
            } finally {
                setLoading(false)
            }
        }
        fetchConfig()
    }, [])
    const formik = useFormik<LinkSheetRequest>({
        initialValues: {
            _id: "",
            month: "",
            link: "",
            index: 0,
        },
        validationSchema: Yup.object({
            month: Yup.string().required("Vui lòng nhập tháng, định dạng: MM-YYYY (VD: 12-2025)"),
            link: Yup.string().required("Vui lòng nhập liên kết, định dạng: https://docs.google.com/spreadsheets/...."),
        }),
        onSubmit: (values) => {
            handleSubmit(values)
        },
    })

    const handleSubmit = async (values: any) => {
        try {
            // Handle form submission
            setLoading(true)
            if (showModel.type === "add") {
                delete values._id
            }
            await configService.updateLinkSheet(values)
            setLoading(false)
            toast.success("Cập nhật cấu hình thành công")
            setShowModel({ type: "add", status: false })
            // Refresh config data
            const data = await configService.getConfigDefault()
            setConfigData(data)
        } catch (error: any) {
            toast.error(error.response?.data?.message)
            console.error("Error submitting form:", error)
        } finally {
            setLoading(false)
        }
    }

    const handleDelete = async (sheet: LinkSheetRequest) => {
        try {
            setLoading(true)
            await configService.deleteLinkSheet(sheet)
            toast.success("Xóa cấu hình thành công")
            // Refresh config data
            const data = await configService.getConfigDefault()
            setConfigData(data)
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Lỗi khi xóa cấu hình")
            console.error("Error deleting config:", error)
        } finally {
            setLoading(false)
        }
    }
    const handleEdit = (sheet: any) => {
        setShowModel({ type: "edit", status: true })
        formik.setValues({
            _id: sheet._id,
            month: sheet.month,
            link: sheet.link,
            index: sheet.index,
        })
    }

    const handleDragEnd = async (event: DragEndEvent) => {
        if (!configData) return
        const { active, over } = event
        if (!over) return
        if (active.id !== over?.id) {
            // 1. Tìm vị trí cũ và mới của folder
            const oldIndex = configData.linkSheet.findIndex((sheet) => sheet._id === active.id)
            const newIndex = configData.linkSheet.findIndex((sheet) => sheet._id === over.id)

            if (oldIndex === -1 || newIndex === -1) return

            // 2. Cập nhật UI ngay lập tức (Optimistic UI)
            const newFolders = arrayMove(configData.linkSheet, oldIndex, newIndex)
            setConfigData({ ...configData, linkSheet: newFolders })

            // 3. Chuẩn bị data gửi lên Backend
            const configOrder = newFolders.map((folder, index) => ({
                id: folder._id,
                index: index,
            }))
            await configService.reorderConfig(configOrder)
        }
    }

    return (
        <div className="max-w-7xl mx-auto py-5 px-2 md:px-0 min-h-screen ">
            <div className="flex justify-between items-center mb-5">
                <h1 className="text-2xl font-medium">Cấu hình hệ thống</h1>
                <div className="flex gap-3">
                    <Link to={"https://drive.google.com/drive/u/5/folders/1rb9sBT6z7OdIr984HFaVuzIXQQlLkfl3"} target="_blank">
                        <Button variant={"outline"}>Mở Google Drive</Button>
                    </Link>
                    <Button
                        onClick={() => {
                            setShowModel({ type: "add", status: true })
                            formik.resetForm()
                        }}
                    >
                        Thêm cấu hình mới
                    </Button>
                </div>
            </div>

            <div className="mt-10">
                <h2 className="text-xl font-medium mb-5">Cấu hình sheet hiện tại:</h2>
                <div className="space-y-3">
                    {configData && (
                        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                            <SortableContext items={configData.linkSheet.map((sheet) => sheet._id)} strategy={rectSortingStrategy}>
                                {configData &&
                                    configData?.linkSheet.length > 0 &&
                                    configData?.linkSheet.map((sheet, index) => (
                                        <SortableList key={sheet._id} index={index} sheet={sheet} handleEdit={handleEdit} setSelectedSheet={setSelectedSheet} />
                                    ))}
                            </SortableContext>
                        </DndContext>
                    )}
                    {!configData && <p className="text-gray-700">Chưa có cấu hình sheet nào. Vui lòng thêm mới.</p>}
                </div>
            </div>
            <div className="mt-10">
                <p>Cách thực hiện:</p>
                <ul className="list-disc list-inside">
                    <li>
                        Tải lên công lương mới vào thư mục{" "}
                        <Link className="underline text-red-500" to={"https://drive.google.com/drive/u/5/folders/1rb9sBT6z7OdIr984HFaVuzIXQQlLkfl3"} target="_blank">
                            trên Google Drive
                        </Link>
                        .
                    </li>
                    <li>
                        Click chuột phải vào file công lương bất kì, chọn <span className="font-bold ">"Chia sẻ"</span>, chọn <span className="font-bold ">"Sao chép đường liên kết"</span>.
                        <img src="/guide.png" alt="" className="mt-2" />
                    </li>
                    <li>
                        Nhấn vào nút <span className="font-bold ">"Thêm cấu hình mới"</span>
                    </li>
                    <li>
                        Điền thông tin vào 2 trường: <span className="font-bold ">"Tháng"</span> và <span className="font-bold ">"Liên kết"</span>
                    </li>
                    <li>
                        Lưu ý trường <span className="font-bold ">"Tháng"</span> định dạng là MM/YYYY (VD: 12/2025, 01/2026)
                    </li>
                </ul>
            </div>
            <Dialog open={showModel.status} onOpenChange={() => setShowModel({ type: "add", status: false })}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Thêm/cập nhật cấu hình</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={formik.handleSubmit} className="space-y-5 bg-gray-50/20 border  p-5 rounded-lg mt-5">
                        <div className="space-y-2">
                            <Label htmlFor="month" className="block text-sm font-medium text-gray-700">
                                Nhập tháng (MM/YYYY)
                            </Label>
                            <Input
                                type="text"
                                id="month"
                                placeholder="Nhập tháng: (VD: 12/2025, 01/2026)"
                                className="h-10 md:h-12"
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.month}
                            />
                            {formik.touched.month && formik.errors.month ? <div className="text-red-500 mt-1 mb-3 ml-5 text-sm">{formik.errors.month}</div> : null}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="link" className="block text-sm font-medium text-gray-700">
                                Nhập liên kết tới Sheet công lương
                            </Label>
                            <Input
                                type="text"
                                id="link"
                                placeholder="Nhập link: (VD: https://docs.google.com/spreadsheets/...)"
                                className="h-10 md:h-12"
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.link}
                            />
                            {formik.touched.link && formik.errors.link ? <div className="text-red-500 mt-1 mb-3 ml-5 text-sm">{formik.errors.link}</div> : null}
                        </div>
                        <div className="flex items-center gap-3">
                            <Button type="submit" className="">
                                <Send /> {loading ? "Đang gửi..." : "Gửi lên server"}
                            </Button>
                            <Button className="" onClick={() => setShowModel({ type: "add", status: false })} variant={"outline"}>
                                Hủy
                            </Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>
            <AlertDialog open={selectedSheet !== null} onOpenChange={() => setSelectedSheet(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Bạn có chắc chắn muốn xóa không</AlertDialogTitle>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Hủy</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleDelete(selectedSheet!)}>Xóa</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}
