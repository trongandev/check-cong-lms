import MainContentFull from "@/components/MainContentFull";
import { useOfficeHours } from "@/hook/useOfficeHours";

export default function Thang7() {
    const { data, isLoading, error } = useOfficeHours("t7-2025", true);

    return MainContentFull({ data, isLoading, error });
}
