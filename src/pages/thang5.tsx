import MainContentFull from "@/components/MainContentFull";
import { useOfficeHours } from "@/hook/useOfficeHours";

export default function Thang5() {
    const { data, isLoading, error } = useOfficeHours("t5-2025", true);

    return MainContentFull({ data, isLoading, error });
}
