import React, {useCallback, useMemo, useState} from 'react'
import { Cell, generateInitialTableData, generateRandomCellValue } from './helpers/hepler'
import './index.css'
import {TableContent} from "./components/tableContent";

const Table = () => {
  const [mnx, setMNX] = useState<{ M: any; N: any; X: any }>({ M: null, N: null, X: null })
  const [tableData, setTableData] = useState<Cell[][]>([])

  const createTable = useCallback((event: any) => {
      event.preventDefault()

      setTableData(generateInitialTableData(parseInt(mnx.M, 10), parseInt(mnx.N, 10)))
  }, [mnx])

  const increaseCellValue = (rowIndex: number, colIndex: number) => {
      const updatedTableData = [...tableData]
      updatedTableData[rowIndex][colIndex].amount += 1
      setTableData(updatedTableData)
  }

  const handleMouseOverCell = useCallback((rowIndex: number, colIndex: number) => {
      const hoveredCell = tableData[rowIndex][colIndex]
      const targetSum = hoveredCell.amount

      const cellsToCompare = [...tableData.flat()].filter((cell) => cell.id !== hoveredCell.id)

      cellsToCompare.sort((a, b) => Math.abs(a.amount - targetSum) - Math.abs(b.amount - targetSum))
      const nearestCells = cellsToCompare.slice(0, mnx.X)

      const updatedTableData = tableData.map((row) =>
          row.map((cell) => ({
              ...cell,
              isNearest: nearestCells.some((nearestCell) => nearestCell.id === cell.id),
          }))
      )
      setTableData(updatedTableData)
  },[tableData, mnx.X])

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

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = event.target
      const parsedValue = name === 'X' ? parseInt(value, 10) : value

        setMNX({
            ...mnx,
            [name]: parsedValue,
        })
    }


    return (
      <div className={'box'}>
        <div className={'container'}>
          <h1 className={'container-title'}>Frontend React Test Task</h1>
          <div>
            <form onSubmit={createTable} className={'table-settings'}>
                <label>
                    Print M:
                    <input
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
              <button type={'submit'} className={'createTableBtn'}> Create Table </button>
            </form>
          </div>
          <div className={'table-container'}>
            <TableContent
                tableData={tableData}
                mnx={mnx}
                handleMouseOverCell={handleMouseOverCell}
                increaseCellValue={increaseCellValue}
                removeRow={removeRow}
            />
          </div>
            <button className={'addRowBtn'} onClick={addRow} disabled={!tableData.length}>Add Row</button>
        </div>
      </div>
  )
}

export default Table
