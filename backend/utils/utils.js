const getTotalSalary = (data, salary) => {
    let acc = 0
    const status = data['Status']
    const role = data['Class role/Office hour type']
    const studentCount = data['Student count'] ? parseInt(data['Student count']) : 0
    const slotDuration = data['Slot duration'] ? parseInt(data['Slot duration']) : 0

    if (status === 'CHECKED') {
        switch (role) {
            case 'LEC':
            case 'Judge':
            case 'Supply':
                acc += salary * 1000 * 2
                break
            case 'TA':
                acc += (salary * 1000 * 2 * 75) / 100
                break
            case 'Makeup':
                acc += studentCount > 3 ? salary * 1000 * 2 : (salary * 1000 * slotDuration * 75) / 100
                break
            case 'Fixed':
                acc += studentCount < 1 ? 100000 : 80000 + 30000 * studentCount
                break
            case 'Trial':
                acc += studentCount <= 1 ? 40000 : 20000 + 20000 * studentCount
                break
            default:
                break
        }
    }
    return acc
}

module.exports = { getTotalSalary }
