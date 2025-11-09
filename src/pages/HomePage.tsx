import MainContentFull from "@/components/MainContentFull";
import { useOfficeHours } from "@/hook/useOfficeHours";

export default function HomePage() {
    const { data, isLoading, error } = useOfficeHours("t10-2025", true);

    return MainContentFull({ data, isLoading, error });
}
