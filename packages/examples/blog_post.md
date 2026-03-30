# Turing Completeness in Reactivity

In the previous post, I summarized the key requirements and features of a special kind of reactive system: reactive data. One of those requirements I called "Turing completeness", because it resembles one of the properties of a Turing machine: writing data into memory and thereby enabling "loops" in computations. Perhaps there is a better name; suggest your version in the comments. It turns out this feature opens up a new and exciting perspective on reactivity. It is probably not practical, but it is fun. Let's dive in.

# Quick reminder

By "Turing completeness" in reactivity, I mean the ability to write to a signal during the calculation of another signal and observe the result in the same transaction.

```
const calculation1 = Calculation(() => { ... })

const calculation2 = Calculation(() => {
    if (...) calculation1.write()
})
```

This might seem controversial and error-prone, and it really is. Such writes make calculation functions impure. They break the flow and cause re-propagation of changes, which can lead to de-optimizations. Significant parts of the graph may be recalculated unnecessarily. They can also lead to endless loops if different calculation functions perform conflicting writes.

Yet this feature is very useful in edge cases where the alternative of making all calculations pure is prohibitively time-consuming. In such cases, a simple "write" trick can save a lot of development effort.

Also, this feature enables a whole new class of use cases - see below.

# Reactivity as STM

With this feature, one can treat a reactive system as [Software Transactional Memory](https://en.wikipedia.org/wiki/Software_transactional_memory) (sort of). A better scientific term probably exists; suggest yours. Here is what it means in practice.

One can specify a set of dynamic rules that the state of the system should conform to, and reactivity will take care of making sure those rules are satisfied. These rules can be truly dynamic, i.e. they can depend on the state itself. Calculation functions will be executed repeatedly, pushing the system toward a stable state.

## Sorting an array

Consider the example of a sorted array. Let's say we have an array of signals and would like to sort their values.

The "sorted" contract can be defined by the following calculation rule, which should be used for all signals:

- Compare the signal's own value with the value of the following signal.
- If the latter is smaller, swap the values.

This simple rule will sort the array. The values will be continuously swapped until the order is established.

<iframe
    src="https://canonic-epicure.github.io/reactivity_examples/dist_sorting/sorting.html"
    title="Reactive sorting example"
    loading="lazy"
    style="display:block; width:100%; height:20rem; border:0; background:transparent;"
></iframe>



## Game of Life

Another example is the "Game of Life", a cellular automaton invented by John Horton Conway in 1970. It defines a set of simple rules that are the same for every cell on a rectangular field. Every cell on the field can be modeled as a reactive calculation.

<iframe
    src="https://canonic-epicure.github.io/reactivity_examples/dist_game_of_life/game_of_life.html"
    title="Reactive game of life example"
    loading="lazy"
    style="display:block; width:100%; height:32rem; border:0; background:transparent;"
></iframe>



# Observations

## The system needs to converge

If the result needs to be observed in the same transaction, the data must converge to a "stable" or "fixed-point" state, where re-applying the calculations one more time does not change anything. Otherwise, it will either fall into a chaotic mode or an endless loop, and the transaction will not complete.

This requirement is important for regular business logic, where we are not interested in intermediate states.

## Transactionality and context boundaries

The requirement above is actually the opposite of what we want for the "Game of Life" example, where the final state of the system is not the main goal; instead, the evolution of individual steps is.

In that example, one would need a different notion of a transaction, or perhaps a different kind of write - "write at the next transaction". Such writes should not affect the current state. Interestingly, they do not require a context boundary (a collection of nodes), only a point in time at which all writes should happen. This approach is not supported by Chronograph.

## Conclusion

As you can see, the common intuition of reactivity as "self-adjusting computations" can be extended toward STM or "cellular automata" notions. Moving in this direction reveals a new set of implementation challenges for reactive systems. Some of those have already been addressed in Chronograph, and some remain a topic for future research.

If you have another example of a system with a dynamic set of rules that can be modeled with reactivity, please let me know in the comments.

Thanks for reading, and happy coding!