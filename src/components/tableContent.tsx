import React, {useCallback, useState} from "react";
import { Cell } from "../helpers/hepler";

export const TableContent = ({ mnx, tableData, handleMouseOverCell, increaseCellValue, removeRow }: any) => {
    const [hoveredRowIndex, setHoveredRowIndex] = useState<number | null>(null)

    const calculateRowSum = (row: Cell[]): number => {
        return row.reduce((sum, cell) => sum + cell.amount, 0)
    }
    const calculateColumnAverage = useCallback((colIndex: number) => {
        const colSum = tableData.reduce((sum: number, row: any) => sum + row[colIndex]?.amount, 0)
        return Math.trunc(colSum / tableData.length * 100) / 100
    }, [tableData])
    const handleMouseLeave = () => {
        setHoveredRowIndex(null)
    }

    if(tableData.length === 0) return null

    return (
        <table className={'table'}>
            <thead>
            <tr>
                <td>&nbsp;</td>
                {Array.from({ length: parseInt(mnx.N, 10) }).map((_, colIndex) => (
                    <th key={colIndex}>Cell values N = {colIndex + 1}</th>
                ))}
                <th>Sum Values</th>
            </tr>
            </thead>
            <tbody>
            {tableData.map((row: any, rowIndex: number) => (
                <tr key={rowIndex}>
                    <th key={rowIndex}>Cell values M = {rowIndex + 1}</th>
                    {row.map((cell: Cell, colIndex: number) => (
                        <td
                            key={cell.id}
                            onMouseOver={() => handleMouseOverCell(rowIndex, colIndex)}
                            onMouseLeave={handleMouseLeave}
                            className={cell.isNearest ? 'highlighted' : ''}
                        >
                            {hoveredRowIndex === rowIndex
                                ? `${Math.min(
                                    (cell.amount / calculateRowSum(row)) * 100,
                                    100
                                ).toFixed(1)}%`
                                : cell.amount}
                            <button className={'increaseBtn'} onClick={() => increaseCellValue(rowIndex, colIndex)}>
                                +
                            </button>
                        </td>
                    ))}
                    <td className={'rowsSum'} onMouseOver={() => setHoveredRowIndex(rowIndex)} onMouseLeave={()=> setHoveredRowIndex(null)}>
                        {calculateRowSum(row)}
                    </td>
                    <td>
                        <button onClick={() => removeRow(rowIndex)}>Remove Row</button>
                    </td>
                </tr>
            ))}




            <tr>
                <th className={'table_th-averageSum'}>Average sum</th>
                {Array.from({ length: parseInt(mnx.N, 10) }).map((_, colIndex) => (
                    <td key={colIndex} className={'table_td-averageSum'}>{calculateColumnAverage(colIndex)}</td>
                ))}
            </tr>
            </tbody>
        </table>
     )

}
