import { useState, useEffect } from "react";
import Papa from "papaparse";
import { OfficeHour } from "@/types/type";
export const useOfficeHours = () => {
    const [data, setData] = useState<OfficeHour[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Kiểm tra cache trong localStorage
                const cachedData = localStorage.getItem("officeHoursData");
                if (cachedData) {
                    setData(JSON.parse(cachedData));
                    setIsLoading(false);
                    return;
                }

                const response = await fetch("src/data/checkcong.csv");
                const csvText = await response.text();

                Papa.parse(csvText, {
                    header: true,
                    complete: (results) => {
                        const parsedData = results.data as OfficeHour[];
                        // Lưu vào localStorage
                        localStorage.setItem("officeHoursData", JSON.stringify(parsedData));
                        setData(parsedData);
                        setIsLoading(false);
                    },
                    error: (error) => {
                        setError(error.message);
                        setIsLoading(false);
                    },
                });
            } catch (err) {
                setError(err instanceof Error ? err.message : "An error occurred");
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    return { data, isLoading, error };
};
