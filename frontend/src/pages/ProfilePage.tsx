import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/contexts/AuthContext"
import { Edit, Info, Lock, Mail, Save, Trash } from "lucide-react"
import { useState } from "react"
import * as Yup from "yup"
import { useFormik } from "formik"
import authService, { type ChangePasswordRequest } from "@/services/authService"
import LoadingIcon from "@/components/ui/loading-icon"
import { toast } from "sonner"
import AvatarCircle from "@/components/etc/AvatarCircle"
import profileService from "@/services/profileService"
import ToastLogErrror from "@/components/etc/ToastLogErrror"
export default function ProfilePage() {
    const { user, setUser } = useAuth()
    const [isEditDisplayName, setIsEditDisplayName] = useState(false)
    const [isEditPassword, setIsEditPassword] = useState(false)
    const [loading, setLoading] = useState(false)
    const [errorMessage, setErrorMessage] = useState("")
    const formik = useFormik<ChangePasswordRequest>({
        initialValues: {
            password: "",
            confirmPassword: "",
        },
        validationSchema: Yup.object({
            password: Yup.string().required("Vui lòng nhập password").min(8, "Mật khẩu phải có ít nhất 8 ký tự").max(150, "Mật khẩu không được vượt quá 150 ký tự"),
            confirmPassword: Yup.string()
                .oneOf([Yup.ref("password"), undefined], "Mật khẩu xác nhận không khớp")
                .required("Vui lòng xác nhận mật khẩu"),
        }),
        onSubmit: (values) => {
            handleChangePassword(values)
        },
    })
    const formikDisplayName = useFormik({
        initialValues: {
            displayName: user?.displayName || "",
        },
        validationSchema: Yup.object({
            displayName: Yup.string().required("Vui lòng nhập tên hiển thị").min(2, "Tên hiển thị phải có ít nhất 2 ký tự").max(100, "Tên hiển thị không được vượt quá 100 ký tự"),
        }),
        onSubmit: (values) => {
            handleChangeDisplayName(values)
        },
    })

    const handleChangeDisplayName = async (values: { displayName: string }) => {
        try {
            setLoading(true)

            // Call login API
            const res = await profileService.updateProfile(user?._id as string, values)
            setErrorMessage("")
            setIsEditDisplayName(false)
            toast.success("Đổi tên hiển thị thành công")
            setUser(res)
        } catch (error: any) {
            ToastLogErrror(error)
        } finally {
            setLoading(false)
        }
    }

    const handleChangePassword = async (values: ChangePasswordRequest) => {
        try {
            setLoading(true)

            // Call login API
            await authService.changePassword(values)
            setErrorMessage("")
            setIsEditPassword(false)
            toast.success("Đổi mật khẩu thành công")
        } catch (error: any) {
            ToastLogErrror(error)
        } finally {
            setLoading(false)
        }
    }
    return (
        <div className="px-4 xl:px-0 max-w-7xl mx-auto space-y-7 h-[80vh] flex  flex-col justify-center">
            <div className="border border-gray-300  p-5 rounded-xl  flex gap-10 items-center">
                {user && <AvatarCircle user={user} className="h-32 w-32 text-3xl" />}
                <div className="flex flex-1 items-center justify-between">
                    <div className="">
                        {isEditDisplayName ? (
                            <>
                                <Label htmlFor="displayName" className="block text-sm font-medium text-gray-700 mb-2">
                                    Display Name
                                </Label>
                                <Input
                                    type="text"
                                    id="displayName"
                                    placeholder="Enter display name"
                                    className="h-10 md:h-12"
                                    onChange={formikDisplayName.handleChange}
                                    onBlur={formikDisplayName.handleBlur}
                                    value={formikDisplayName.values.displayName}
                                />
                                {formikDisplayName.touched.displayName && formikDisplayName.errors.displayName ? (
                                    <div className="text-red-500 mt-1 ml-5 text-sm font-medium">{formikDisplayName.errors.displayName}</div>
                                ) : null}
                                <div className="flex gap-3 items-center mt-3">
                                    <Button variant={"outline"} onClick={() => setIsEditDisplayName(false)}>
                                        Close
                                    </Button>
                                    <Button type="submit" disabled={loading} onClick={formikDisplayName.submitForm}>
                                        {loading ? <LoadingIcon /> : <Save />}
                                        Save changes
                                    </Button>
                                </div>
                            </>
                        ) : (
                            <>
                                <h1 className="text-2xl font-bold text-gray-900 mb-2">Hello, {user?.displayName}</h1>
                                <p className="text-gray-600 flex items-center gap-1">
                                    <Mail size={20} /> {user?.email}
                                </p>
                            </>
                        )}
                    </div>
                    {!isEditDisplayName && (
                        <Button variant={"outline"} onClick={() => setIsEditDisplayName(true)}>
                            <Edit />
                            Edit
                        </Button>
                    )}
                </div>
            </div>
            <div className="border border-gray-300  p-5 rounded-xl ">
                <div className=" flex gap-10 items-center justify-between">
                    <div className="flex gap-3 items-center font-bold">
                        <Lock size={20} />
                        <p className="text-gray-600">Password</p>
                    </div>
                    {!isEditPassword && (
                        <Button variant={"outline"} onClick={() => setIsEditPassword(true)}>
                            <Edit />
                            Edit
                        </Button>
                    )}
                </div>
                {isEditPassword && (
                    <div className="space-y-5 mt-5">
                        <div className="space-y-1">
                            <Label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                Password
                            </Label>
                            <Input
                                type="password"
                                id="password"
                                placeholder="Enter password"
                                className="h-10 md:h-12"
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.password}
                            />
                            {formik.touched.password && formik.errors.password ? <div className="text-red-500 mt-1 ml-5 text-sm font-medium">{formik.errors.password}</div> : null}
                        </div>
                        <div className="space-y-1">
                            <Label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                                Confirm Password
                            </Label>
                            <Input
                                type="password"
                                id="confirmPassword"
                                placeholder="Confirm Password"
                                className="h-10 md:h-12"
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.confirmPassword}
                            />
                            {formik.touched.confirmPassword && formik.errors.confirmPassword ? <div className="text-red-500 mt-1 ml-5 text-sm font-medium">{formik.errors.confirmPassword}</div> : null}
                        </div>
                        {errorMessage && (
                            <div className="text-sm flex  items-center">
                                <Info className="text-red-700" size={16} />
                                <span className="text-red-500 ml-2">{errorMessage}</span>
                            </div>
                        )}
                        <div className="flex gap-3 items-center justify-end">
                            <Button variant={"outline"} onClick={() => setIsEditPassword(false)}>
                                Close
                            </Button>
                            <Button type="submit" disabled={loading} onClick={formik.submitForm}>
                                {loading ? <LoadingIcon /> : <Save />}
                                Save changes
                            </Button>
                        </div>
                    </div>
                )}
            </div>
            <div className="border border-gray-300  p-5 rounded-xl ">
                <div className="flex gap-3 items-center font-bold">
                    <Trash size={20} />
                    <p className="text-gray-600">Delete Account</p>
                </div>
                <div className=" flex gap-10 items-center justify-between">
                    <p className="text-gray-600">Are you sure you want to delete this account?</p>
                    <Button variant={"destructive"}>Delete Account</Button>
                </div>
            </div>
        </div>
    )
}
