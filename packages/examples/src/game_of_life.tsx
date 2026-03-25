/** @jsx ChronoGraphJSX.createElement */
/** @jsxFrag ChronoGraphJSX.FragmentSymbol */

import { CalculableBox } from "@bryntum/chronograph/src/chrono2/data/CalculableBox.js"
import { globalGraph } from "@bryntum/chronograph/src/chrono2/graph/Graph.js"
import { field } from "@bryntum/chronograph/src/replica2/Entity.js"
import { ChronoGraphJSX } from "@bryntum/siesta/src/chronograph-jsx/ChronoGraphJSX.js"
import { Component } from "@bryntum/siesta/src/chronograph-jsx/Component.js"
import { applyNextGeneration } from "./game_of_life_step.js"

ChronoGraphJSX


const randomFillDensity = 0.32


//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export class Application extends Component {
    rows                : number = 0
    cols                : number = 0

    cells               : CalculableBox<number>[][] = null

    nextGrid            : number[][] = null

    @field()
    flush               : number = 0

    render () : Element {
        return <div class="gol-application">
            <div class="gol-grid">
                {
                    () => {
                        this.flush

                        return this.cells.map((row, r) =>
                            <div class="gol-row">
                                {
                                    row.map((cell, c) =>
                                        <div
                                            class="gol-cell"
                                            class:gol-cell--alive={ () => cell.readProposedOrPrevious() === 1 }
                                            title={ `(${ r }, ${ c })` }
                                        />
                                    )
                                }
                            </div>
                        )
                    }
                }
            </div>
            <div class="gol-toolbar">
                <button
                    type="button"
                    class="gol-btn"
                    on:click={ () => {
                        globalGraph.commit()

                        for (let r = 0; r < this.rows; r++) {
                            for (let c = 0; c < this.cols; c++) this.cells[ r ][ c ].write(this.nextGrid[ r ][ c ])
                        }

                        this.flush++

                        // @ts-ignore
                        this.el.childNodes[ 0 ].reactivity.effect.read()
                    } }
                >
                    Step
                </button>
                <button
                    type="button"
                    class="gol-btn"
                    on:click={ () => {
                        for (const row of this.cells) {
                            for (const cell of row) {
                                cell.write(Math.random() < randomFillDensity ? 1 : 0)
                            }
                        }

                        this.flush++

                        // @ts-ignore
                        this.el.childNodes[ 0 ].reactivity.effect.read()
                    } }
                >
                    Randomize
                </button>
            </div>
        </div>
    }
}
