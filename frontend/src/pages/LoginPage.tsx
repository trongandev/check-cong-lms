import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ChevronLeft, Info } from "lucide-react"
import { useLocation, useNavigate } from "react-router-dom"
import { useFormik } from "formik"
import * as Yup from "yup"
import { useState } from "react"
import { useAuth } from "@/contexts/AuthContext"
import authService from "@/services/authService"
import type { LoginRequest } from "@/services/authService"
import LoadingIcon from "@/components/ui/loading-icon"

export default function LoginPage() {
    const navigate = useNavigate()
    const location = useLocation()

    const searchParams = new URLSearchParams(location.search)
    const redirectPath = searchParams.get("redirect") || "/"

    const { login } = useAuth()
    const [loading, setLoading] = useState(false)
    const [errorMessage, setErrorMessage] = useState("")
    const formik = useFormik<LoginRequest>({
        initialValues: {
            email: "",
            password: "",
        },
        validationSchema: Yup.object({
            email: Yup.string().email("Email không hợp lệ").required("Vui lòng nhập email"),
            password: Yup.string().required("Vui lòng nhập password"),
        }),
        onSubmit: (values) => {
            handleLogin(values)
        },
    })

    const handleLogin = async (values: LoginRequest) => {
        try {
            setLoading(true)

            // Call login API
            const response = await authService.login(values)

            // Login successful - save to context
            login(response.user, response.accessToken, response.refreshToken)

            // Navigate to dashboard or home
            navigate(redirectPath, { replace: true })
        } catch (error: any) {
            // Show error message
            let errorMessage = "Email hoặc mật khẩu không đúng"

            if (error.response?.data?.message) {
                errorMessage = error.response.data.message
            } else if (error.message) {
                errorMessage = error.message
            }

            setErrorMessage(errorMessage)
        } finally {
            setLoading(false)
        }
    }
    return (
        <div className="h-screen flex items-center justify-center  px-5 xl:px-0">
            <div className="w-full xl:max-w-4xl  mx-auto shadow-md rounded-xl border border-gray-200 flex flex-col-reverse xl:flex-row overflow-hidden items-center relative">
                <div className="absolute left-5 top-5">
                    <Button variant={"outline"} onClick={() => navigate(-1)}>
                        <ChevronLeft />
                    </Button>
                </div>

                <div className="p-5 flex-1 w-full">
                    <h1 className="text-3xl font-medium text-primary mb-10 text-center">Đăng nhập LMS</h1>
                    <form className="space-y-5" onSubmit={formik.handleSubmit}>
                        <div className="space-y-1">
                            <Label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                Email bạn dùng để đăng nhập LMS
                            </Label>
                            <Input type="email" id="email" placeholder="Nhập email" className="h-10 md:h-12" onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.email} />
                            {formik.touched.email && formik.errors.email ? <div className="text-red-500 mt-1 mb-3 ml-5 text-sm">{formik.errors.email}</div> : null}
                        </div>
                        <div className="space-y-1">
                            <Label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                Mật khẩu bạn dùng để đăng nhập LMS
                            </Label>
                            <Input
                                type="password"
                                id="password"
                                placeholder="Nhập mật khẩu"
                                className="h-10 md:h-12"
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.password}
                            />
                            {formik.touched.password && formik.errors.password ? <div className="text-red-500 mt-1 ml-5 text-sm font-medium">{formik.errors.password}</div> : null}
                        </div>
                        {errorMessage && (
                            <div className="text-sm flex  items-center">
                                <Info className="text-red-700" size={16} />
                                <span className="text-red-500 ml-2">{errorMessage}</span>
                            </div>
                        )}

                        <Button type="submit" disabled={loading}>
                            {loading && <LoadingIcon />}
                            Đăng nhập
                        </Button>
                    </form>
                </div>
                <div className="flex-1  p-5">
                    <img src="/svg/global-team.svg" alt="" className="w-full h-full " />
                </div>
            </div>
        </div>
    )
}
