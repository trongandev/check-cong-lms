import MainContentFull from "@/components/MainContentFull";
import { useOfficeHours } from "@/hook/useOfficeHours";

export default function TableOffficeHourPage({ file }: { file: string }) {
    const { data, isLoading, error } = useOfficeHours(file, true);

    return MainContentFull({ data, isLoading, error });
}
