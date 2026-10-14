/** @jsx ChronoGraphJSX.createElement */
/** @jsxFrag ChronoGraphJSX.FragmentSymbol */

import { globalGraph } from "@bryntum/chronograph/src/chrono2/graph/Graph.js"
import { field } from "@bryntum/chronograph/src/replica2/Entity.js"
import { ChronoGraphJSX } from "@bryntum/siesta/src/chronograph-jsx/ChronoGraphJSX.js"
import { Component } from "@bryntum/siesta/src/chronograph-jsx/Component.js"
import { Quote, QuoteFieldName } from "./Quote.js"
import { SimpleQuote } from "./SimpleQuote.js"

// need to use the value to keep the import from being removed
ChronoGraphJSX


//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
type QuoteFieldConfig = {
    name            : QuoteFieldName
    label           : string
    decimals        : number
    suffix?         : string
    formula?        : string
}

const quoteFields : QuoteFieldConfig[] = [
    { name : 'price', label : 'Price', decimals : 2 },
    {
        name : 'quantity', label : 'Quantity', decimals : 4,
        formula : 'amount / (price × (1 − discount / 100))'
    },
    { name : 'discount', label : 'Discount', decimals : 2, suffix : '%' },
    {
        name : 'amount', label : 'Amount', decimals : 2,
        formula : 'price × quantity × (1 − discount / 100)'
    }
]

/** Empty or invalid text is `null` */
const parseNumber = (text : string) : number | null => {
    const trimmed   = text.trim().replace(',', '.')

    if (trimmed === '') return null

    const value     = Number(trimmed)

    return isNaN(value) ? null : value
}

const formatNumber = (value : number | null, decimals : number) : string =>
    value == null || isNaN(value) ? '' : String(Number(value.toFixed(decimals)))


//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export class Application extends Component {
    quote               : Quote | SimpleQuote = null

    /** The field, user has edited last */
    @field()
    lastEdited          : QuoteFieldName = null


    isCalculated (config : QuoteFieldConfig) : boolean {
        return this.quote.isFieldCalculated(config.name)
    }


    renderField (config : QuoteFieldConfig) : Element {
        const quote     = this.quote

        const input = <input
            type="text"
            inputmode="decimal"
            autocomplete="off"
            class="quoting-field__input"
            readOnly={ !quote.isFieldEditable(config.name) }
            // the text is not overwritten if it already represents the value - user may be typing in this field
            value={ () => {
                const value     = quote[ config.name ]

                return input && parseNumber(input.value) === value ? input.value : formatNumber(value, config.decimals)
            } }
            on:input={ (e : InputEvent) => {
                this.lastEdited     = config.name
                quote[ config.name ] = parseNumber((e.target as HTMLInputElement).value)

                globalGraph.commit()
            } }
        /> as HTMLInputElement

        return <div
            class="quoting-field"
            class:quoting-field--edited={ () => this.lastEdited === config.name }
            class:quoting-field--calculated={ () => this.isCalculated(config) }
        >
            <label class="quoting-field__label">{ config.label }</label>
            <div class="quoting-field__control">
                { input }
                { config.suffix ? <span class="quoting-field__suffix">{ config.suffix }</span> : null }
            </div>
            <div class="quoting-field__note">
                {
                    () => {
                        if (this.isCalculated(config)) return `calculated: ${ config.formula }`
                        if (this.lastEdited === config.name) return 'edited'

                        return ''
                    }
                }
            </div>
        </div>
    }


    render () : Element {
        return <div class="quoting-application">
            <div class="quoting-application__fields">
                { quoteFields.map(config => this.renderField(config)) }
            </div>
            <div class="quoting-application__resolution">
                {
                    () => {
                        const calculated    = quoteFields.find(config => this.isCalculated(config))
                        const edited        = quoteFields.find(config => config.name === this.lastEdited)

                        if (!calculated) return 'Nothing to calculate - some of the inputs are missing'

                        return edited
                            ? `${ edited.label } changed → ${ calculated.label } recalculated`
                            : `${ calculated.label } is calculated`
                    }
                }
            </div>
        </div>
    }
}
