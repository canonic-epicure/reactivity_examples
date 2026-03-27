# Turing completeness in reactivity

In the previous post I made a digest of the key requirements and features of the special kind of reactive system - reactive data. One of those requirements I called “turing completeness”, because it resembles one of the properties of Turing's machine of writing data into the memory and it enables “loops” in computations. Perhaps there’s a better name, suggest your version in the comments. Turns out this feature opens a new and exciting view on reactivity, which is probably not practical, but fun. Let's dive in.

# Quick reminder

Under “turing completeness” in reactivity I mean the ability to write into a signal, during the calculation of another signal, and observe the result in the same transaction.

```
const calculation1 = Calculation(() => { ... })

const calculation2 = Calculation(() => {
    if (...) calculation1.write()
})
```

This might seem controversial and error-prone and it really is. Such writes make the calculation functions impure. Such writes break the flow and cause re-propagation of changes which can lead to de-optimizations. Significant parts of the graph can be re-calculated unnecessary. Such writes can lead to endless loops, if different calculation functions perform contradicting writes.

Yet, this feature is very useful in the edge cases, where the alternative of making all calculations pure is prohibitely time-consuming. In such cases a simple “write” trick can save a lot of development effort.

Also, with this feature, a whole new class of use cases is enabled - see below.

# Reactivity as STM

Having this feature, one can treat a reactive system as Software Transactional Memory (sort of). A better scientific jargonism can probably be used, suggest yours. Here’s what it practically means.

One can specify a set of dynamic rules to which the state of the system should conform and reactivity will take care of making sure those rules are satisfied. Rules can be truly dynamic - ie, they can depend on the state itself. Calculation functions will be executed repeatedly, pointing the system towards a stable state.

## Sorting an array

Consider the example of a sorted array. Let's say we have an array of signals and we’d like to sort their values.

The “sorted” contract can be defined as a following calculation rule, which should be used for all signals:

- Compare the signal's own value with the value of the following signal
- If the latter is less - swap the values

This simple rule will sort the array. The values will be continuously swapped, until the order is established.

## Game of Life

Another example is a “Game of Life” - cellular automata, invented by John Horton Conway in 1970\. It defines a set of simple rules, which are the same for every cell on the rectangular field. Every cell on the field can be modeled as a reactive calculation.

# Observations

## System need to converge

If the result needs to be observed in the same transaction, then the data needs to converge to a “stable”, “fixed-point” state, where re-applying calculations one more time does not change anything. Otherwise, it will either fall into chaotic mode or an endless loop and the transaction won’t complete.

This requirement is important for regular business logic, where we are not interested in the intermediate states.

## Transactionality and context boundaries

The requirement from above is actually the opposite for the “Game of life” example, where the final state of the system might not be a main goal, but instead the evolution of individual steps.

In that example, one would need a different notion of transaction, or perhaps a different notion of write type - “write at next transaction”. Such writes should not affect the current state. Interesting enough, they don’t require a context boundary (a collection of nodes) but only a point at time, at which all writes should happen. This approach is not supported by Chronograph.

## Conclusion

As you can see, the common intuition about the reactivity as a “self-adjusting computations” can be extended towards the STM or “cellular automata” notions. Moving in this direction, one can find a new set of implementation challenges for reactive systems. Some of those have been addressed in Chronograph already, and some are a topic of future research.

If you have some other example of a system with a dynamic set of rules, that can be modelled with reactivity - please let me know in the comments.

Thanks for reading, happy coding!