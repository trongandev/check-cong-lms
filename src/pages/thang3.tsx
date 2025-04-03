import MainContent from "@/components/MainContent";
import { useOfficeHours } from "@/hook/useOfficeHours";

export default function Thang3() {
    const { data, isLoading, error } = useOfficeHours("t3-2025", true);

    return MainContent({ data, isLoading, error });
}
