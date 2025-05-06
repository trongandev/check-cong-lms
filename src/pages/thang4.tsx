import MainContentFull from "@/components/MainContentFull";
import { useOfficeHours } from "@/hook/useOfficeHours";

export default function Thang4() {
    const { data, isLoading, error } = useOfficeHours("t4-2025", true);

    return MainContentFull({ data, isLoading, error });
}
