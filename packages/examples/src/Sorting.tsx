/** @jsx ChronoGraphJSX.createElement */
/** @jsxFrag ChronoGraphJSX.FragmentSymbol */

import { CalculableBox } from "@bryntum/chronograph/src/chrono2/data/CalculableBox.js"
import { Box } from "@bryntum/chronograph/src/chrono2/data/Box.js"
import { globalGraph } from "@bryntum/chronograph/src/chrono2/graph/Graph.js"
import { rnd } from "./sortingRnd.js"
import { calculate, field } from "@bryntum/chronograph/src/replica2/Entity.js"
import { ChronoGraphJSX } from "@bryntum/siesta/src/chronograph-jsx/ChronoGraphJSX.js"
import { Component } from "@bryntum/siesta/src/chronograph-jsx/Component.js"
import { compareDeepDiff } from "@bryntum/siesta/src/compare_deep/DeepDiff.js"
import { JsonDeepDiffComponent } from "@bryntum/siesta/src/compare_deep/JsonDeepDiffComponent.js"
import { buffer }  from "@bryntum/siesta/src/util/TimeHelpers.js"
import JSON5 from "json5"

// need to use the value to keep the import from being removed
ChronoGraphJSX


//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export class Application extends Component {
    @field()
    signals             : Box<number>[] = null

    @field()
    flush               : number = 0

    render () : Element {
        return <div class="sorting-application">
            <div class="sorting-application__signals">
                {
                    () => {
                        this.flush

                        return this.signals.map(
                            signal => <div class="signal_box">{ () => signal.readProposedOrPrevious() }</div>
                        )
                    }
                }
            </div>
            <div class="sorting-application__toolbar">
                <button
                    type="button"
                    class="sorting-sort-btn"
                    on:click={ () => globalGraph.commit() }
                >
                    Sort
                </button>
                <button
                    type="button"
                    class="sorting-sort-btn"
                    on:click={ () => {
                        for (const signal of this.signals) signal.write(rnd())

                        this.flush++

                        // @ts-ignore
                        this.el.childNodes[0].reactivity.effect.read()
                    } }
                >
                    Randomize
                </button>
            </div>
        </div>
    }
}
