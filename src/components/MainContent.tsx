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
import { useOfficeHours } from "@/hook/useOfficeHours";
import { OfficeHour } from "@/types/type";
import { format, parse } from "date-fns";

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

export default function MainContent() {
    const { data, isLoading, error } = useOfficeHours();
    const [sorting, setSorting] = React.useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
    const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
    const [rowSelection, setRowSelection] = React.useState({});

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

    // Lấy số lượng checked và unchecked
    const { checked, unchecked } = getStatusCounts();

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;
    return (
        <div className="h-full flex-1 ">
            <div className="flex items-center justify-between py-4 gap-5">
                <div className="bg-white border-purple-200 shadow-sm dark:bg-gray-700  rounded-md flex-1 p-5 border dark:border-white/10 text-purple-800 dark:text-purple-300">
                    <p className="text-sm">Tổng số</p>
                    <h1 className="text-3xl text-right font-bold ">{table.getFilteredRowModel().rows.length}</h1>
                </div>
                <div className="bg-white border-green-200 shadow-sm dark:bg-gray-700 rounded-md flex-1 p-5 border dark:border-white/10 text-green-800 dark:text-green-300">
                    <p className="text-sm">Đã check</p>
                    <h1 className="text-3xl text-right font-bold">{checked}</h1>
                </div>
                <div className="bg-white border-red-200 shadow-sm dark:bg-gray-700 rounded-md flex-1 p-5 border dark:border-white/10 text-red-800 dark:text-red-300">
                    <p className="text-sm">Chưa check</p>
                    <h1 className="text-3xl text-right font-bold">{unchecked}</h1>
                </div>
            </div>
            <div className="w-full">
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
        </div>
    );
}
