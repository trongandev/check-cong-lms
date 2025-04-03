import "./App.css";
import Header from "./components/Header";
import Footer from "./components/Footer";
import MainContent from "./components/MainContent";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { CloudDownload } from "lucide-react";
function App() {
    const [open, setOpen] = useState(true);
    const [isShowNoti, setIsShowNoti] = useState(() => {
        const isShow = localStorage.getItem("isShowNoti");
        return isShow ? JSON.parse(isShow) : true;
    });

    console.log(isShowNoti);

    const handleShowNoti = (value: boolean) => {
        setIsShowNoti(!value);
        localStorage.setItem("isShowNoti", JSON.stringify(!value));
    };
    const handleClearCache = () => {
        localStorage.removeItem("officeHoursData");
        window.location.reload();
    };
    return (
        <div>
            <Header />
            <Dialog defaultOpen={open} open={open} onOpenChange={setOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Thông báo</DialogTitle>
                        <DialogDescription>Nếu sheet chưa cập nhật, hãy bấm cập nhật dữ liệu ở thanh header hoặc ở đây</DialogDescription>
                    </DialogHeader>
                    <div className="">
                        <Button onClick={handleClearCache}>
                            <CloudDownload />
                            Cập nhật dữ liệu mới
                        </Button>
                    </div>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4"></div>
                        <div className="grid grid-cols-4 items-center gap-4"></div>
                    </div>
                    <DialogFooter className="flex-1 w-full flex justify-between items-center">
                        {/* <div className="flex items-center gap-2 w-full">
                            <input type="checkbox" id="not-show" className="cursor-pointer" checked={!isShowNoti} onChange={(e) => handleShowNoti(e.target.checked)} />
                            <label htmlFor="not-show" className="cursor-pointer">
                                Không hiện lại
                            </label>
                        </div> */}
                        <Button type="submit" onClick={() => setOpen(false)}>
                            Đã rõ
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
            <div className="min-h-[90vh]  px-5 py-3 dark:bg-gray-800/90">
                <MainContent />
            </div>
            <Footer />
        </div>
    );
}

export default App;
