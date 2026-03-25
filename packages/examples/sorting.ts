import { CalculableBox } from "@bryntum/chronograph/src/chrono2/data/CalculableBox.js"
import { Box } from "@bryntum/chronograph/src/chrono2/data/Box.js"

import { globalGraph } from "@bryntum/chronograph/src/chrono2/graph/Graph.js"
import { Application } from "./src/Sorting.js"
import { rnd } from "./src/sortingRnd.js"

globalGraph.autoCommit      = false
globalGraph.historyLimit    = 0

// set up the sorting data
const SIGNAL_NUM = 10

// @ts-ignore
const signals : CalculableBox<number>[] = window.signals = []

for (let i = 0; i < SIGNAL_NUM; i++) {
    if (i === 0) {
        const signal = CalculableBox.new({
            lazy: false,
            calculation () : number {
                return this.readProposedOrPrevious()
            }
        })

        signal.write(rnd())
        signals.push(signal)
    }
    else {
        const signal = CalculableBox.new({
            lazy: false,
            calculation () : number {
                // @ts-ignore
                const idx = this.idx

                const me = signals[idx]
                const prev = signals[idx - 1]

                const myValue = me.readProposedOrPrevious()
                const prevValue = prev.read()

                if (myValue < prevValue) {
                    // swap the values
                    me.write(prevValue)
                    prev.write(myValue)

                    return prevValue
                } else {
                    // do nothing, return the input value
                    return myValue
                }
            }
        })

        // @ts-ignore
        signal.idx = i

        signal.write(rnd())

        signals.push(signal)
    }
}

// init the UI
const app   = Application.new({ signals })

document.body.appendChild(app.el)
