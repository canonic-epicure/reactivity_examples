import { CalculationModeSync } from "@bryntum/chronograph/src/chrono2/CalculationMode.js"
import { CycleResolutionInputChrono2 } from "@bryntum/chronograph/src/chrono2/CycleResolver.js"
import { EffectHandler, HasProposedValue, ProposedOrPrevious } from "@bryntum/chronograph/src/chrono2/Effect.js"
import { globalGraph } from "@bryntum/chronograph/src/chrono2/graph/Graph.js"
import { Base } from "@bryntum/chronograph/src/class/Base.js"
import {
    CalculateProposed,
    CycleDescription,
    CycleResolution,
    Formula,
    FormulaId
} from "@bryntum/chronograph/src/cycle_resolver/CycleResolver.js"
import { calculate, calculate_etalon, Entity, field } from "@bryntum/chronograph/src/replica2/Entity.js"
import { Replica } from "@bryntum/chronograph/src/replica2/Replica.js"


//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// The cycle: amount = price * quantity * (1 - discount / 100)
// All 4 fields are writable. Writing `amount` recalculates `quantity`, writing any other field recalculates `amount`.
// The cycle resolver figures out which formula to use, based on what fields have user input.

export type QuoteFieldName = 'price' | 'quantity' | 'discount' | 'amount'

export const PriceVar       = Symbol('Price')
export const QuantityVar    = Symbol('Quantity')
export const DiscountVar    = Symbol('Discount')
export const AmountVar      = Symbol('Amount')

export const amountFormula      = Formula.new({
    output      : AmountVar,
    inputs      : new Set([ PriceVar, QuantityVar, DiscountVar ])
})

export const quantityFormula    = Formula.new({
    output      : QuantityVar,
    inputs      : new Set([ PriceVar, AmountVar, DiscountVar ])
})

const cycleDescription = CycleDescription.new({
    variables           : new Set([ PriceVar, QuantityVar, DiscountVar, AmountVar ]),
    formulas            : new Set([ amountFormula, quantityFormula ])
})

// when there's no "preference" from the user input (for example, only the `price` has been changed),
// the `amount` is calculated
const cycleResolution = CycleResolution.new({
    description                 : cycleDescription,
    defaultResolutionFormulas   : new Set([ amountFormula ])
})


//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const allVariables = [ PriceVar, QuantityVar, DiscountVar, AmountVar ]

const variableByFieldName : Record<QuoteFieldName, symbol> = {
    price       : PriceVar,
    quantity    : QuantityVar,
    discount    : DiscountVar,
    amount      : AmountVar
}

const dispatcherEq = (v1 : CycleResolutionInputChrono2, v2 : CycleResolutionInputChrono2) : boolean => {
    const resolution1       = v1.resolution
    const resolution2       = v2.resolution

    return allVariables.every(variable => resolution1.get(variable) === resolution2.get(variable))
}

// "etalon" dispatcher - corresponds to the state, when all fields has previous values and no user input
const defaultDispatcher = CycleResolutionInputChrono2.new({ context : cycleResolution })

allVariables.forEach(variable => defaultDispatcher.addPreviousValueFlag(variable))

const isNotNumber = (value : any) : boolean => value !== Number(value)


//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export class Quote extends Entity.mix(Base) {
    @field({ lazy : false })
    price       : number

    @field({ lazy : false })
    quantity    : number

    /** In percents, 0-100 */
    @field({ lazy : false })
    discount    : number

    @field({ lazy : false })
    amount      : number

    @field({ lazy : false, equality : dispatcherEq })
    dispatcher  : CycleResolutionInputChrono2


    initialize (props? : Partial<Quote>) {
        super.initialize(props)

        // same as `Component` - use the global graph, so that the UI effects can depend on the quote fields
        this.enterGraph(globalGraph as Replica)
    }


    /** Whether the field has been calculated with a formula (and not kept the user input or previous value) */
    isFieldCalculated (name : QuoteFieldName) : boolean {
        return this.dispatcher.resolution.get(variableByFieldName[ name ]) !== CalculateProposed
    }


    isFieldEditable (name : QuoteFieldName) : boolean {
        return true
    }


    @calculate('price')
    calculatePrice (Y : EffectHandler<CalculationModeSync>) : number {
        // there's no formula for price, so it is always "proposed"
        return Y(ProposedOrPrevious)
    }


    @calculate('discount')
    calculateDiscount (Y : EffectHandler<CalculationModeSync>) : number {
        // there's no formula for discount, so it is always "proposed"
        return Y(ProposedOrPrevious)
    }


    @calculate('amount')
    calculateAmount (Y : EffectHandler<CalculationModeSync>) : number {
        const instruction : FormulaId = this.dispatcher.resolution.get(AmountVar)

        if (instruction === amountFormula.formulaId) {
            const price         = this.price
            const quantity      = this.quantity
            const discount      = this.discount

            if (isNotNumber(price) || isNotNumber(quantity) || isNotNumber(discount)) return null

            return price * quantity * (1 - discount / 100)
        }
        else if (instruction === CalculateProposed) {
            return Y(ProposedOrPrevious)
        }
    }


    @calculate('quantity')
    calculateQuantity (Y : EffectHandler<CalculationModeSync>) : number {
        const instruction : FormulaId = this.dispatcher.resolution.get(QuantityVar)

        if (instruction === quantityFormula.formulaId) {
            const price         = this.price
            const amount        = this.amount
            const discount      = this.discount

            if (isNotNumber(price) || isNotNumber(amount) || isNotNumber(discount)) return null

            const discountedPrice = price * (1 - discount / 100)

            // can not buy anything for the given amount
            if (discountedPrice === 0) return null

            return amount / discountedPrice
        }
        else if (instruction === CalculateProposed) {
            return Y(ProposedOrPrevious)
        }
    }


    @calculate_etalon('dispatcher')
    buildProposedDispatcher () : CycleResolutionInputChrono2 {
        return defaultDispatcher
    }


    @calculate('dispatcher')
    calculateDispatcher (Y : EffectHandler<CalculationModeSync>) : CycleResolutionInputChrono2 {
        const dispatcher        = CycleResolutionInputChrono2.new({ context : cycleResolution })

        // `price` and `discount` are pure inputs of the cycle (do not depend on the dispatcher), so we can
        // read their current values directly. `PreviousValueOf` can not be used for them - for the atom, that
        // has not been changed in the current transaction, it returns the value from the previous revision
        if (this.price != null) dispatcher.addPreviousValueFlag(PriceVar)
        if (Y(HasProposedValue(this.$.price))) dispatcher.addProposedValueFlag(PriceVar)

        if (this.discount != null) dispatcher.addPreviousValueFlag(DiscountVar)
        if (Y(HasProposedValue(this.$.discount))) dispatcher.addProposedValueFlag(DiscountVar)

        // `quantity` and `amount` depend on the dispatcher, reading them directly would create a cycle,
        // but since they are always stale when dispatcher is calculated, `PreviousValueOf` gives their current value
        dispatcher.collectInfo(Y, this.$.quantity, QuantityVar)
        dispatcher.collectInfo(Y, this.$.amount, AmountVar)

        return dispatcher
    }
}
