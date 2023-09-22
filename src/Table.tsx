import React, { useMemo, useState} from 'react'
import './index.css'

type CellId = number
type CellValue = number

type Cell = {
  id: CellId
  amount: CellValue
  isNearest?: boolean
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

const Table = () => {
  const [hoveredRowIndex, setHoveredRowIndex] = useState<number | null>(null)
  const [mnx, setMNX] = useState<{ M: any; N: any; X: any }>({ M: null, N: null, X: null })
  const [tableData, setTableData] = useState<Cell[][]>([])

  const increaseCellValue = (rowIndex: number, colIndex: number) => {
    const updatedTableData = [...tableData]
    updatedTableData[rowIndex][colIndex].amount += 1
    setTableData(updatedTableData)
  }
  const calculateRowSum = (row: Cell[]): number => {
    return row.reduce((sum, cell) => sum + cell.amount, 0)
  }
  const calculateColumnAverage = (colIndex: number) => {
    const colSum = tableData.reduce((sum, row) => sum + row[colIndex].amount, 0)
    const averageValue = Math.trunc(colSum / tableData.length * 100) / 100
    return averageValue
  }

  const handleMouseOverCell = (rowIndex: number, colIndex: number) => {
    const hoveredCell = tableData[rowIndex][colIndex]
    const targetSum = hoveredCell.amount

    const cellsToCompare = [...tableData.flat()].filter(
        (cell) => cell.id !== hoveredCell.id
    )
    cellsToCompare.sort(
        (a, b) => Math.abs(a.amount - targetSum) - Math.abs(b.amount - targetSum)
    )
    const nearestCells = cellsToCompare.slice(0, mnx.X)
    const updatedTableData = tableData.map((row) =>
        row.map((cell) => ({
            ...cell,
            isNearest: nearestCells.some((nearestCell) => nearestCell.id === cell.id),
        }))
    )

    setTableData(updatedTableData)
  }
  const handleMouseLeave = () => {
    setHoveredRowIndex(null)
  }
  const removeRow = (rowIndex: number) => {
    const updatedTableData = [...tableData]
    updatedTableData.splice(rowIndex, 1)
    setTableData(updatedTableData)
  }

  const addRow = () => {
      const newRow: Cell[] = Array.from({ length: parseInt(mnx.N, 10) }, (_, index) => ({
          id: index,
          amount: generateRandomCellValue(),
      }))
      setTableData((prevTableData) => [...prevTableData, newRow])
    }
  const createTable = (event: React.FormEvent) => {
    event.preventDefault()
    setTableData(generateInitialTableData(parseInt(mnx.M, 10), parseInt(mnx.N, 10)))
  }

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = event.target
      const parsedValue = name === 'X' ? parseInt(value, 10) : value

        setMNX({
            ...mnx,
            [name]: parsedValue,
        })
    }


  const renderTable = useMemo(() => {
    if(tableData.length) {
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
            {tableData.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  <th key={rowIndex}>Cell values M = {rowIndex + 1}</th>
                  {row.map((cell: Cell, colIndex) => (
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
  }, [tableData, mnx, hoveredRowIndex])

  return (
      <div className={'box'}>
        <div className={'container'}>
          <h1 className={'container-title'}>Frontend React Test Task</h1>
          <div>
            <form onSubmit={createTable} className={'table-settings'}>
                <label>
                    Print M:
                    <input
                        placeholder={'Print M : '}
                        type={'number'}
                        required
                        name="M"
                        value={mnx.M}
                        onChange={handleInputChange}
                    />
                </label>
                <label>
                    Print N:
                    <input
                        placeholder={'Print N : '}
                        type={'number'}
                        name="N"
                        required
                        value={mnx.N}
                        onChange={handleInputChange}
                    />
                </label>
                <label>
                    Print X:
                    <input
                        placeholder={'Print X : '}
                        type={'number'}
                        name="X"
                        value={mnx.X}
                        required
                        onChange={handleInputChange}
                    />
                </label>
              <button
                  type={'submit'}
                  className={'createTableBtn'}
              >
                Create Table
              </button>
            </form>
          </div>
          <div className={'table-container'}>
            {renderTable}
          </div>
            <button className={'addRowBtn'} onClick={addRow} disabled={!tableData.length}>Add Row</button>
        </div>
      </div>
  )
}

export default Table
