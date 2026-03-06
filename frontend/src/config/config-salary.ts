export const SALARY_CONFIG = {
    version: "default",
    linkSheet: [
        {
            month: "t12-2025",
            label: "Tháng 12/2025",
            link: "https://docs.google.com/spreadsheets/d/1v3unJzqUhm0YglOBQl4vjic9Zx70sW8C/edit?usp=sharing&ouid=117030049434948761957&rtpof=true&sd=true",
        },
    ],
    posLinkSheetToSplit: 6, // VỊ TRÍ CHỈNH SỬA LINK TẠI MẢNG linkSheet loại bỏ /edit?usp=sharing thành /gviz/tq?tqx=out:csv&gid=0
    // ví dụ "https://docs.google.com/spreadsheets/d/1eurYcSqX5jt_nfhtY85cQh1mz3SDYdBDnEcRLfbUFx0/edit?gid=511673698#gid=511673698".split("/")[6]
    // output: 'edit?gid=511673698#gid=511673698'

    paramEndLinkSheet: "gviz/tq?tqx=out:csv&gid=0",
}
