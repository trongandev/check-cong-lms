import React from "react";
import {
    ColumnDef,
    ColumnFiltersState,
    SortingState,
    VisibilityState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table";
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ArrowUpDown, ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { OfficeHour } from "@/types/type";
import { format, parse } from "date-fns";

// import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";

const columns: ColumnDef<OfficeHour>[] = [
    {
        accessorKey: "Type",
        header: "Loại",
        cell: ({ row }) => (
            <div
                className={`capitalize text-sm text-center w-30 h-5 flex items-center justify-center rounded-md ${
                    row.getValue("Type") === "OFFICE_HOURS" ? "text-yellow-900 bg-yellow-100 dark:text-white/80 dark:bg-yellow-900" : "bg-cyan-100 text-cyan-900 dark:text-white/80 dark:bg-cyan-900"
                }`}>
                {row.getValue("Type")}
            </div>
        ),
    },
    {
        accessorKey: "Class name",
        header: ({ column }) => {
            return (
                <Button variant="ghost" className="cursor-pointer" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                    Mã lớp
                    <ArrowUpDown />
                </Button>
            );
        },
        cell: ({ row }) => <div className="text-wrap ">{row.getValue("Class name")}</div>,
    },
    {
        accessorKey: "Centre shortname",
        header: "Mã cơ sở",
        cell: ({ row }) => <div className="text-wrap text-pink-900 dark:text-pink-500 ">{row.getValue("Centre shortname")}</div>,
    },
    {
        accessorKey: "Teacher name",
        header: ({ column }) => {
            return (
                <Button variant="ghost" className="cursor-pointer" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                    Tên giáo viên
                    <ArrowUpDown />
                </Button>
            );
        },
        cell: ({ row }) => <div className="text-wrap text-teal-900 dark:text-teal-500 ">{row.getValue("Teacher name")}</div>,
    },
    {
        accessorKey: "Username",
        header: ({ column }) => {
            return (
                <Button variant="ghost" className="cursor-pointer" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                    Mã giáo viên
                    <ArrowUpDown />
                </Button>
            );
        },
        cell: ({ row }) => <div className="text-wrap text-amber-900 dark:text-amber-500 ">{row.getValue("Username")}</div>,
    },

    {
        accessorKey: "Slot time",
        header: ({ column }) => {
            return (
                <Button variant="ghost" className="cursor-pointer" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                    Ngày
                    <ArrowUpDown />
                </Button>
            );
        },
        cell: ({ row }) => {
            const slotTime = row.getValue("Slot time");
            if (!slotTime) return <div>N\A</div>;

            try {
                const date = parse(slotTime as string, "M/d/yyyy", new Date());
                if (isNaN(date.getTime())) {
                    return <div>Invalid date</div>;
                }
                return <div>{format(date, "dd/MM/yyyy")}</div>;
            } catch (error) {
                console.error("Error parsing date:", error);
                return <div>Invalid date</div>;
            }
        },
    },
    {
        accessorKey: "Class role/Office hour type",
        header: ({ column }) => {
            return (
                <Button variant="ghost" className="cursor-pointer" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                    Loại công việc
                    <ArrowUpDown />
                </Button>
            );
        },
        cell: ({ row }) => <div className="text-center">{row.getValue("Class role/Office hour type")}</div>,
    },
    {
        accessorKey: "Slot duration",
        header: ({ column }) => {
            return (
                <Button variant="ghost" className="cursor-pointer" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                    Số giờ dạy
                    <ArrowUpDown />
                </Button>
            );
        },
        cell: ({ row }) => <div className="text-center">{row.getValue("Slot duration")}</div>,
    },
    {
        accessorKey: "Student count",
        header: ({ column }) => {
            return (
                <Button variant="ghost" className="cursor-pointer" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                    Số học sinh dạy
                    <ArrowUpDown />
                </Button>
            );
        },
        cell: ({ row }) => <div className="text-center">{row.getValue("Student count")}</div>,
    },
    {
        accessorKey: "Status",
        header: ({ column }) => {
            return (
                <Button variant="ghost" className="cursor-pointer" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                    Trạng thái
                    <ArrowUpDown />
                </Button>
            );
        },
        cell: ({ row }) => (
            <div
                className={`capitalize text-sm text-center w-25 h-5 flex items-center justify-center rounded-sm ${
                    row.getValue("Status") === "CHECKED" ? "text-green-700 dark:text-white/90 dark:bg-green-900 bg-green-100" : "bg-red-100 text-red-700 dark:text-white/30 dark:bg-red-900"
                }`}>
                {row.getValue("Status")}
            </div>
        ),
    },
];

export default function MainContentFull({ data, isLoading, error }: { data: OfficeHour[]; isLoading: boolean; error: string | null }) {
    const [sorting, setSorting] = React.useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
    const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
    const [rowSelection, setRowSelection] = React.useState({});
    // const [salary, setSalary] = React.useState(() => {
    //     const savedSalary = localStorage.getItem("rank-salary");
    //     return savedSalary ? Number(savedSalary) : 120;
    // });

    const table = useReactTable({
        data,
        columns,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        state: {
            sorting,
            columnFilters,
            columnVisibility,
            rowSelection,
        },
    });

    const getStatusCounts = () => {
        const rows = table.getFilteredRowModel().rows;
        return rows.reduce(
            (acc, row) => {
                const status = row.getValue("Status") as string;
                if (status === "CHECKED") {
                    acc.checked++;
                } else {
                    acc.unchecked++;
                }
                return acc;
            },
            { checked: 0, unchecked: 0 }
        );
    };

    // const getTotalSalary = () => {
    //     const rows = table.getFilteredRowModel().rows;
    //     return rows.reduce((acc, row) => {
    //         const status = row.getValue("Status") as string;
    //         const role = row.getValue("Class role/Office hour type") as string;
    //         const studentCount = row.getValue("Student count") as number;

    //         if (status === "CHECKED") {
    //             switch (role) {
    //                 case "LEC":
    //                 case "Judge":
    //                 case "Supply":
    //                     acc += salary * 1000 * 2;
    //                     break;
    //                 case "TA":
    //                 case "Makeup":
    //                     acc += salary * 1000 * 1.5;
    //                     break;
    //                 case "Fixed":
    //                     acc += studentCount < 1 ? 100000 : 100000 * studentCount;
    //                     break;
    //                 case "Trial":
    //                     acc += studentCount <= 1 ? 40000 : 20000 + 20000 * studentCount;
    //                     break;
    //                 default:
    //                     break;
    //             }
    //         }
    //         return acc;
    //     }, 0);
    // };

    const NOTE = {
        OFFICE_HOURS: "Công trực",
        TRIAL: "Trực 1 tiếng hoặc online",
        FIXED: "3 tiếng trực offline",
        MAKEUP: "Dạy bù",
        SUPPLY: "Dạy thay",
        CLASS: "Lớp dạy",
    };

    // Lấy số lượng checked và unchecked
    const { checked, unchecked } = getStatusCounts();

    if (isLoading)
        return (
            <div className="h-screen flex items-center justify-center">
                <div className="w-8 h-8 border-x-2 border-x-gray-500 rounded-full animate-spin"></div>
            </div>
        );
    if (error)
        return (
            <div>
                <h1 className="text-red-500 text-md">Lỗi do sử dụng safari, hãy dùng trình duyệt khác</h1>
                <p>Thông tin lỗi: {error}</p>
            </div>
        );
    // const handleChangeSalary = (value: string) => {
    //     localStorage.setItem("rank-salary", value);
    //     setSalary(Number(value));
    // };

    return (
        <div className="h-full flex-1">
            <div className="grid grid-cols-1 md:grid-cols-3 py-4 gap-2 md:gap-5 flex-wrap ">
                <div className="bg-white border-purple-200 shadow-sm dark:bg-gray-700  rounded-md flex-1 p-5 border dark:border-white/10 text-purple-800 dark:text-purple-300">
                    <p className="text-sm">Tổng số</p>
                    <h1 className="text-3xl text-right font-bold ">{table.getFilteredRowModel().rows.length}</h1>
                </div>
                <div className="bg-white border-green-200 shadow-sm dark:bg-gray-700 rounded-md flex-1 p-5 border dark:border-white/10 text-green-800 dark:text-green-300">
                    <p className="text-sm">Đã check</p>
                    <h1 className="text-3xl text-right font-bold">{checked}</h1>
                </div>
                <div className=" border-red-200 shadow-sm dark:bg-gray-700 rounded-md flex-1 p-5 border dark:border-white/10 text-red-800 dark:text-red-300">
                    <p className="text-sm">Chưa check</p>
                    <h1 className="text-3xl text-right font-bold">{unchecked}</h1>
                </div>
                {/* <div className=" border-slate-200 shadow-sm dark:bg-gray-700 rounded-md flex-1 p-5 border dark:border-white/10 text-slate-800 dark:text-slate-300">
                    <div className="flex items-center justify-between gap-2">
                        <p className="text-sm">Tổng tiền lương</p>
                        <Select value={String(salary)} onValueChange={(value) => handleChangeSalary(value)}>
                            <SelectTrigger className="">
                                <SelectValue placeholder="Select Rank" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectLabel>Rank</SelectLabel>
                                    {Array.from({ length: 21 }).map((_, idx) => {
                                        let salary = 0;
                                        if (idx === 2) {
                                            salary = 100;
                                        } else if (idx < 2) {
                                            salary = idx * 10 * 2 + 70;
                                        } else if (idx === 3) {
                                            salary = 120;
                                        } else if (idx === 4) {
                                            salary = 140;
                                        } else if (idx > 4) {
                                            salary = idx * 10 + 100;
                                        }
                                        return (
                                            <SelectItem key={idx} value={String(salary)} onSelect={() => setSalary(salary)}>
                                                T{idx} {`- ${salary}k/hr`}
                                            </SelectItem>
                                        );
                                    })}
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>
                    <h1 className="text-xl text-right font-bold mt-2">{getTotalSalary().toLocaleString()}đ</h1>
                </div> */}
            </div>
            <div className="w-full ">
                <div className="flex items-center py-4 gap-3 flex-wrap">
                    <div className="flex items-center gap-2 md:flex-row flex-col">
                        <Input
                            placeholder="Lọc theo mã cơ sở"
                            value={(table.getColumn("Centre shortname")?.getFilterValue() as string) ?? ""}
                            onChange={(event) => table.getColumn("Centre shortname")?.setFilterValue(event.target.value)}
                            className="max-w-sm border-pink-500 dark:border-pink-300"
                        />
                        <Input
                            placeholder="Lọc theo tên giáo viên"
                            value={(table.getColumn("Teacher name")?.getFilterValue() as string) ?? ""}
                            onChange={(event) => table.getColumn("Teacher name")?.setFilterValue(event.target.value)}
                            className="max-w-sm border-teal-500 dark:border-teal-300"
                        />
                        <Input
                            placeholder="Lọc theo mã giáo viên"
                            value={(table.getColumn("Username")?.getFilterValue() as string) ?? ""}
                            onChange={(event) => table.getColumn("Username")?.setFilterValue(event.target.value)}
                            className="max-w-sm border-amber-500 dark:border-amber-300"
                        />
                    </div>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" className="ml-auto">
                                Cột hiển thị <ChevronDown />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            {table
                                .getAllColumns()
                                .filter((column) => column.getCanHide())
                                .map((column) => {
                                    return (
                                        <DropdownMenuCheckboxItem key={column.id} className="capitalize" checked={column.getIsVisible()} onCheckedChange={(value) => column.toggleVisibility(!!value)}>
                                            {column.id}
                                        </DropdownMenuCheckboxItem>
                                    );
                                })}
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
                <div className="rounded-md border dark:border-white/10 h-[70vh] overflow-y-scroll data-table">
                    <Table className="data-table-x">
                        <TableHeader>
                            {table.getHeaderGroups().map((headerGroup) => (
                                <TableRow key={headerGroup.id}>
                                    {headerGroup.headers.map((header) => {
                                        return <TableHead key={header.id}>{header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}</TableHead>;
                                    })}
                                </TableRow>
                            ))}
                        </TableHeader>
                        <TableBody className=" overflow-x-scroll data-table-body">
                            {isLoading ? (
                                <TableRow>
                                    <TableCell colSpan={columns.length} className="h-24 text-center">
                                        Loading...
                                    </TableCell>
                                </TableRow>
                            ) : error ? (
                                <TableRow>
                                    <TableCell colSpan={columns.length} className="h-24 text-center text-red-500">
                                        Error: {error}
                                    </TableCell>
                                </TableRow>
                            ) : table.getRowModel().rows?.length ? (
                                table.getRowModel().rows.map((row) => (
                                    <TableRow key={row.id} data-state={row.getIsSelected() && "selected"} className="hover:bg-gray-100 dark:hover:bg-slate-800 cursor-pointer">
                                        {row.getVisibleCells().map((cell) => (
                                            <TableCell key={cell.id} className="py-5">
                                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={columns.length} className="h-24 text-center">
                                        Không có kết quả nào phù hợp...
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
                <div className="flex items-center justify-end space-x-2 py-4">
                    <div className="flex-1 text-sm text-muted-foreground">{table.getFilteredRowModel().rows.length} dòng đã được hiển thị</div>
                    <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
                            <ChevronLeft />
                            Lùi lại
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
                            Tiến tới
                            <ChevronRight />
                        </Button>
                    </div>
                </div>
            </div>
            <div className="space-y-2 ">
                <h2 className="font-medium text-gray-500 dark:text-white/70">Ghi chú</h2>
                <div className="bg-gray-100 dark:bg-slate-800/50 border border-white/10 p-4 rounded-lg space-y-3 text-gray-500 dark:text-white">
                    {Object.entries(NOTE).map(([key, value]) => (
                        <div key={key} className="flex items-center gap-2">
                            <kbd className="px-2 py-1 bg-white dark:bg-gray-500/50 rounded shadow text-sm">{key}</kbd>
                            <span className="">{value}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
