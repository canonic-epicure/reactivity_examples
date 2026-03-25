import { CalculableBox } from "@bryntum/chronograph/src/chrono2/data/CalculableBox.js"

import { globalGraph } from "@bryntum/chronograph/src/chrono2/graph/Graph.js"
import { Application } from "./src/game_of_life.js"

globalGraph.autoCommit      = false
globalGraph.historyLimit    = 0

/** Field size */
export const GOL_ROWS = 24
export const GOL_COLS = 40

const initialDensity = 0.32

// @ts-ignore
const cells : CalculableBox<number>[][] = window.golCells = Array.from({ length: GOL_ROWS }, () => [])

/**
 * Next-generation buffer — each `cells[r][c]` `calculation` reads neighbors, writes `nextGrid[r][c]`,
 * returns the current value (until `applyNextGeneration` writes the buffer back into the same cells).
 */
const nextGrid = Array.from({ length: GOL_ROWS }, () => Array.from({ length: GOL_COLS }, () => 0))

for (let r = 0; r < GOL_ROWS; r++) {
    for (let c = 0; c < GOL_COLS; c++) {
        const cell = CalculableBox.new({
            lazy: false,

            calculation () : number {
                let liveNeighbors = 0

                for (let dr = -1; dr <= 1; dr++) {
                    for (let dc = -1; dc <= 1; dc++) {
                        if (dr === 0 && dc === 0) continue

                        const rr = r + dr
                        const cc = c + dc

                        if (rr >= 0 && rr < GOL_ROWS && cc >= 0 && cc < GOL_COLS)
                            liveNeighbors += cells[ rr ][ cc ].readProposedOrPrevious()
                    }
                }

                const cur = this.readProposedOrPrevious()

                const next =
                    cur === 1
                        ? (liveNeighbors === 2 || liveNeighbors === 3 ? 1 : 0)
                        : (liveNeighbors === 3 ? 1 : 0)

                nextGrid[ r ][ c ] = next

                return cur
            }
        })

        cell.write(Math.random() < initialDensity ? 1 : 0)

        cells[ r ][ c ] = cell
    }
}

const app = Application.new({
    cells,
    nextGrid,
    rows    : GOL_ROWS,
    cols    : GOL_COLS,
})

document.body.appendChild(app.el)
