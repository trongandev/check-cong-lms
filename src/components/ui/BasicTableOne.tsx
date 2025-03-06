import { Table, TableBody, TableCell, TableHeader, TableRow } from "../ui/table";

export default function BasicTableOne() {
    const TABLE_HEAD = [
        { id: "info", label: "Thông tin" },
        { id: "email", label: "Email" },
        { id: "role", label: "Vai trò" },
        { id: "zone", label: "Khu vực QL" },
        { id: "status", label: "Trạng thái" },
        { id: "updatedAt", label: "Ngày cập nhật" },
        { id: "feature", label: "Tính năng" },
    ];

    const TABLE_BODY = accounts.map((account) => ({
        info: { profilePicture: account.profilePicture, displayName: account.displayName, createdAt: account.createdAt },
        email: account.email,
        role: { id: account._id, roles: account.roles },
        zone: { id: account._id, zone: account.zone },
        status: account.status,
        updatedAt: account.updatedAt,
        feature: { id: account._id, status: account.status },
    }));

    return (
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
            <div className="max-w-full overflow-x-auto">
                <div className="min-w-[1102px]">
                    <Table>
                        {/* Table Header */}
                        <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                            <TableRow>
                                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                                    hello
                                </TableCell>
                            </TableRow>
                        </TableHeader>

                        {/* Table Body */}
                        <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                            <TableRow>
                                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                    <div className="">Hello</div>
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </div>
            </div>
        </div>
    );
}
