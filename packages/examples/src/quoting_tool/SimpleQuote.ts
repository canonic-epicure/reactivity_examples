import { globalGraph } from "@bryntum/chronograph/src/chrono2/graph/Graph.js"
import { Base } from "@bryntum/chronograph/src/class/Base.js"
import { calculate, Entity, field } from "@bryntum/chronograph/src/replica2/Entity.js"
import { Replica } from "@bryntum/chronograph/src/replica2/Replica.js"
import { QuoteFieldName } from "./Quote.js"


const isNotNumber = (value : any) : boolean => value !== Number(value)


//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// The simple version, without a cycle: `amount` is always calculated from the other 3 fields and is not writable
export class SimpleQuote extends Entity.mix(Base) {
    @field()
    price       : number

    @field()
    quantity    : number

    /** In percents, 0-100 */
    @field()
    discount    : number

    @field({ lazy : false })
    amount      : number


    initialize (props? : Partial<SimpleQuote>) {
        super.initialize(props)

        // same as `Component` - use the global graph, so that the UI effects can depend on the quote fields
        this.enterGraph(globalGraph as Replica)
    }


    @calculate('amount')
    calculateAmount () : number {
        const price         = this.price
        const quantity      = this.quantity
        const discount      = this.discount

        if (isNotNumber(price) || isNotNumber(quantity) || isNotNumber(discount)) return null

        return price * quantity * (1 - discount / 100)
    }


    isFieldCalculated (name : QuoteFieldName) : boolean {
        return name === 'amount'
    }


    isFieldEditable (name : QuoteFieldName) : boolean {
        return name !== 'amount'
    }
}
