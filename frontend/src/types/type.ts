export interface OfficeHourResponse {
    _id: string
    dateTimeKey: string
    data: OfficeHour[]
}

export interface OfficeHour {
    "Centre shortname": string
    Type: string
    "Class name": string
    Course: string
    "Course Line": string
    "Teacher name": string
    "Work email": string
    "Personal email": string
    Username: string
    "Class role/Office hour type": string
    Status: string
    "Effective duration": string
    "Slot time": string
    "Slot duration": string
    "Student count": string
    "Requested by": string
    Note: string
    "Manager Note": string
    "Confirm Status (OH only)": string
    "Confirm Note (OH only)": string
    _id: string
    salary: number
    rank: string
}
export interface MetaPagination {
    total: number
    page: number
    limit: number
    last_page: number
}
export interface OfficeHourSelected {
    "Centre shortname": string
    Type: string
    "Class name": string
    "Class role/Office hour type": string
    Status: string
    "Slot time": string
    "Slot duration": string
    "Student count": string
    salary: number
    rank: string
}

export interface APIResponse<T> {
    ok: boolean
    status: string
    statusCode: number
    message: string
    data: T
    timestamp: string
}

export interface ConfigRequest {
    version: string
    linkSheet: LinkSheetRequest[]
    posLinkSheetToSplit: number
    paramEndLinkSheet: string
}

export interface LinkSheetRequest {
    _id: string
    month: string
    link: string
}

export interface SalaryDataResponse {
    "Centre shortname": string
    Type: string
    "Class name": string
    "Class role/Office hour type": string
    Status: string
    "Slot time": string
    "Slot duration": string
    "Student count": string
    salary: number
    rank: string
    _id: string
}

export interface SalaryResponse {
    _id: string
    username: string
    dateTimeKey: string
    totalCheck: number
    totalUncheck: number
    totalTime: number
    data: SalaryDataResponse[]
    createdAt: string
    updatedAt: string
}
