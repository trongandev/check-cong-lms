import MainContentFull from "@/components/MainContentFull";
import { useOfficeHours } from "@/hook/useOfficeHours";

export default function Thang6() {
    const { data, isLoading, error } = useOfficeHours("t6-2025", true);

    return MainContentFull({ data, isLoading, error });
}
