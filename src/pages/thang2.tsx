import MainContent from "@/components/MainContent";
import { useOfficeHours } from "@/hook/useOfficeHours";

export default function Thang2() {
    const { data, isLoading, error } = useOfficeHours("t2-2025", false);

    return MainContent({ data, isLoading, error });
}
