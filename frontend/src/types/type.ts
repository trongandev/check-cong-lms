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
    salary?: number
    customRank?: number
}

export interface APIResponse<T> {
    ok: boolean
    status: string
    statusCode: number
    message: string
    data: T
    timestamp: string
}
