import MainContent from "@/components/MainContent";
import { useOfficeHours } from "@/hook/useOfficeHours";

export default function Thang4() {
    const { data, isLoading, error } = useOfficeHours("t4-2025", true);

    return MainContent({ data, isLoading, error });
}
