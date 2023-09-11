import React, { useState } from 'react'
import './index.css'

type CellId = number
type CellValue = number

type Cell = {
  id: CellId
  amount: CellValue
}

const generateRandomCellValue = (): CellValue => {
  return Math.floor(Math.random() * 101)
}

const generateInitialTableData = (M: number, N: number): Cell[][] => {
  const tableData = Array.from({ length: M }, (_, i) =>
      Array.from({ length: N }, (_, j) => ({
        id: i * N + j,
        amount: generateRandomCellValue(),
      }))
  )
  return tableData
}

const Table: React.FC<{ M: number; N: number; X: number }> = ({ M, N, X }) => {
  const [tableData, setTableData] = useState(generateInitialTableData(M, N))
  const [hoveredRowIndex, setHoveredRowIndex] = useState<number | null>(null)

  const increaseCellValue = (rowIndex: number, colIndex: number) => {
    const updatedTableData = [...tableData]
    updatedTableData[rowIndex][colIndex].amount += 1
    setTableData(updatedTableData)
  }

  const calculateRowSum = (row: Cell[]): number => {
    return row.reduce((sum, cell) => sum + cell.amount, 0)
  }

  const calculateColumnAverage = (colIndex: number): number => {
    const colSum = tableData.reduce((sum, row) => sum + row[colIndex].amount, 0)
    const averageValue = Math.trunc(colSum / tableData.length * 100) / 100

    return averageValue
  }

  const handleMouseOverCell = (rowIndex: number, colIndex: number) => {
    const hoveredCell = tableData[rowIndex][colIndex]

    const flattenedTableData = tableData.flat()

    const sortedCells = flattenedTableData.sort(
        (a, b) => Math.abs(a.amount - hoveredCell.amount) - Math.abs(b.amount - hoveredCell.amount)
    )

    const nearestCells = sortedCells.slice(1, X + 1)

    const updatedTableData = tableData.map((row, rowIndex) =>
        row.map((cell) => ({
          ...cell,
          isNearest: nearestCells.some((nearestCell) => nearestCell.id === cell.id),
        }))
    )

    setTableData(updatedTableData)
  }

  const handleMouseLeave = () => {
    const updatedTableData = tableData.map((row) =>
        row.map((cell) => ({
          ...cell,
          isNearest: null,
        }))
    )
    setTableData(updatedTableData)
  }

  const removeRow = (rowIndex: number) => {
    const updatedTableData = [...tableData]
    updatedTableData.splice(rowIndex, 1)
    setTableData(updatedTableData)
  }

  const addRow = () => {
    const newRow: Cell[] = Array.from({ length: N }, () => ({ id: Math.floor(Math.random() * Date.now()) , amount: generateRandomCellValue() }))
    setTableData((prevTableData) => [...prevTableData, newRow])
  }

  return (
      <div className={'box'}>
        <div className={'container'}>
          <h1 className={'container-title'}>Frontend React Test Task</h1>
          <table className={'table'}>
            <thead>
            <tr>
              <td>&nbsp;</td>
              {Array.from({ length: N }).map((_, colIndex) => (
                  <th key={colIndex}>Cell values N = {colIndex + 1}</th>
              ))}
              <th>Sum Values</th>
            </tr>
            </thead>
            <tbody>
            {tableData.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  <th key={rowIndex}>Cell values M = {rowIndex + 1}</th>
                  {row.map((cell: any, colIndex) => (
                      <td
                          key={cell.id}
                          onMouseOver={() => handleMouseOverCell(rowIndex, colIndex)}
                          onMouseLeave={()=> handleMouseLeave()}
                          className={cell.isNearest ? 'highlighted' : ''}
                      >
                        {hoveredRowIndex === rowIndex
                            ? `${Math.min((cell.amount / calculateRowSum(row)) * 100, 100).toFixed(1)}%`
                            : cell.amount}
                        <button className={'increaseBtn'} onClick={() => increaseCellValue(rowIndex, colIndex)}>+</button>
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
              {Array.from({ length: N }).map((_, colIndex) => (
                  <td key={colIndex} className={'table_td-averageSum'}>{calculateColumnAverage(colIndex)}</td>
              ))}
            </tr>
            </tbody>
          </table>
        </div>
        <button className={'addRowBtn'} onClick={addRow}>Add Row</button>
      </div>
  )
}

export default Table
