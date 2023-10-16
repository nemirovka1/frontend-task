export type Cell = {
    id: number
    amount: number
    isNearest?: boolean
}

export const  generateRandomCellValue = (): number => {
    return Math.floor(Math.random() * 101)
}

export const generateInitialTableData = (M: number, N: number): Cell[][] => {
    const tableData = Array.from({ length: M }, (_, i) =>
        Array.from({ length: N }, (_, j) => ({
            id: i * N + j,
            amount: generateRandomCellValue(),
        }))
    )
    return tableData
}
