/******************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */

function __decorate(decorators, target, key, desc) {
  var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
  if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
  else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
  return c > 3 && r && Object.defineProperty(target, key, r), r;
}

typeof SuppressedError === "function" ? SuppressedError : function (error, suppressed, message) {
  var e = new Error(message);
  return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
};

/// <reference types="./Iterator.d.ts" />
//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
/**
 * Given a single `Iterable`, returns an array of 2 iterables, mirroring the original one (which should not be used anymore).
 *
 * For example:
 *
 *     const gen = function* () { yield 1; yield 2; yield 3 }
 *
 *     const [ iterable1, iterable2 ] = split(gen())
 *     const [ iter1, iter2 ] = [
 *         iterable1[ Symbol.iterator ](),
 *         iterable2[ Symbol.iterator ]()
 *     ]
 *
 *     iter1.next() // 1
 *     iter2.next() // 1
 *     iter2.next() // 2
 *     iter2.next() // 3
 *     iter1.next() // 2
 *     iter1.next() // 3
 *     iter1.next() // done
 *     iter2.next() // done
 *
 * @param iterable
 */
function split(iterable) {
    const gen1Pending = [];
    const gen2Pending = [];
    let iterator;
    const gen1 = function* () {
        if (!iterator)
            iterator = iterable[Symbol.iterator]();
        while (true) {
            if (gen1Pending.length) {
                yield* gen1Pending;
                gen1Pending.length = 0;
            }
            if (!iterator)
                break;
            const { value, done } = iterator.next();
            if (done) {
                iterator = null;
                iterable = null;
                break;
            }
            gen2Pending.push(value);
            yield value;
        }
    };
    const gen2 = function* () {
        if (!iterator)
            iterator = iterable[Symbol.iterator]();
        while (true) {
            if (gen2Pending.length) {
                yield* gen2Pending;
                gen2Pending.length = 0;
            }
            if (!iterator)
                break;
            const { value, done } = iterator.next();
            if (done) {
                iterator = null;
                iterable = null;
                break;
            }
            gen1Pending.push(value);
            yield value;
        }
    };
    return [gen1(), gen2()];
}
//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function* inBatchesBySize(iterator, batchSize) {
    if (batchSize < 1)
        throw new Error("Batch size needs to a natural number");
    batchSize = batchSize | 0;
    const runningBatch = [];
    for (const el of iterator) {
        if (runningBatch.length === batchSize) {
            yield runningBatch;
            runningBatch.length = 0;
        }
        runningBatch.push(el);
    }
    if (runningBatch.length > 0)
        yield runningBatch;
}
//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function* filter(iterator, func) {
    let i = 0;
    for (const el of iterator) {
        if (func(el, i++))
            yield el;
    }
}
//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function* drop(iterator, howMany) {
    let i = 0;
    for (const el of iterator) {
        if (++i > howMany)
            yield el;
    }
}
//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function every(iterator, func) {
    let i = 0;
    for (const el of iterator) {
        if (!func(el, i++))
            return false;
    }
    return true;
}
//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function some(iterator, func) {
    let i = 0;
    for (const el of iterator) {
        if (func(el, i++))
            return true;
    }
    return false;
}
//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function* map(iterator, func) {
    let i = 0;
    for (const el of iterator)
        yield func(el, i++);
}
//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function forEach(iterator, func) {
    let i = 0;
    for (const el of iterator)
        if (func(el, i++) === false)
            return false;
}
//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function reduce(iterator, func, initialAcc) {
    let i = 0;
    let acc = initialAcc;
    for (const el of iterator) {
        acc = func(acc, el, i++);
    }
    return acc;
}
//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function size(iterator) {
    let i = 0;
    for (const el of iterator)
        i++;
    return i;
}
//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function* uniqueOnly(iterator) {
    yield* uniqueOnlyBy(iterator, i => i);
}
//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function* uniqueOnlyBy(iterator, func) {
    const seen = new Set();
    for (const el of iterator) {
        const uniqueBy = func(el);
        if (!seen.has(uniqueBy)) {
            seen.add(uniqueBy);
            yield el;
        }
    }
}
//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function* takeWhile(iterator, func) {
    let i = 0;
    for (const el of iterator) {
        if (func(el, i++))
            yield el;
        else
            return;
    }
}
//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function* concatIterable(iteratorsProducer) {
    for (const iterator of iteratorsProducer)
        yield* iterator;
}
//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// just a chained syntax sugar class
// note, that we either use a combination of `this.derive()` + this.iterable (which will clear the `this.iterable`)
// or, use just `this` as iterable, which will also clear the iterator
//
class ChainedIteratorClass {
    constructor(iterable) {
        this.$iterable = undefined;
        if (!iterable)
            throw new Error("Require an iterable instance for chaining");
        this.iterable = iterable;
    }
    get iterable() {
        return this.$iterable;
    }
    set iterable(iterable) {
        this.$iterable = iterable;
    }
    derive(iterable) {
        this.iterable = undefined;
        return new ChainedIteratorClass(iterable);
    }
    copy() {
        const [iter1, iter2] = split(this.iterable);
        this.iterable = iter2;
        return new ChainedIteratorClass(iter1);
    }
    split() {
        const [iter1, iter2] = split(this.iterable);
        return [new ChainedIteratorClass(iter1), this.derive(iter2)];
    }
    inBatchesBySize(batchSize) {
        return this.derive(inBatchesBySize(this.iterable, batchSize));
    }
    filter(func) {
        return this.derive(filter(this.iterable, func));
    }
    drop(howMany) {
        return this.derive(drop(this.iterable, howMany));
    }
    forEach(func) {
        return forEach(this.iterable, func);
    }
    map(func) {
        return this.derive(map(this.iterable, func));
    }
    reduce(func, initialAcc) {
        return reduce(this, func, initialAcc);
    }
    get size() {
        return size(this);
    }
    concat() {
        //@ts-ignore
        return this.derive(concatIterable(this.iterable));
    }
    uniqueOnly() {
        return this.derive(uniqueOnly(this.iterable));
    }
    uniqueOnlyBy(func) {
        return this.derive(uniqueOnlyBy(this.iterable, func));
    }
    every(func) {
        return every(this, func);
    }
    some(func) {
        return some(this, func);
    }
    takeWhile(func) {
        return this.derive(takeWhile(this.iterable, func));
    }
    take(howMany) {
        return Array.from(takeWhile(this, (el, index) => index < howMany));
    }
    *[Symbol.iterator]() {
        let iterable = this.iterable;
        if (!iterable)
            throw new Error("Chained iterator already exhausted or used to derive the new one");
        // practice shows, that cleaning up the iterable after yourself helps garbage collector a lot
        this.iterable = undefined;
        yield* iterable;
        // yes, we really want to avoid memory leaks
        iterable = undefined;
    }
    reverse() {
        return Array.from(this).reverse();
    }
    reversed() {
        return this.derive(this.reverse());
    }
    sort(order) {
        return Array.from(this).sort(order);
    }
    sorted(order) {
        return this.derive(this.sort(order));
    }
    toArray() {
        return Array.from(this);
    }
    toSet() {
        return new Set(this);
    }
    toMap() {
        //@ts-ignore
        return new Map(this);
    }
    flush() {
        for (const element of this) { }
    }
    memoize() {
        return new MemoizedIteratorClass(this);
    }
}
const ChainedIterator = (iterator) => new ChainedIteratorClass(iterator);
const CI = ChainedIterator;
//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
class MemoizedIteratorClass extends ChainedIteratorClass {
    constructor() {
        super(...arguments);
        this.elements = [];
        this.$iterator = undefined;
    }
    get iterable() {
        return this;
    }
    set iterable(iterable) {
        this.$iterable = iterable;
    }
    derive(iterable) {
        return new ChainedIteratorClass(iterable);
    }
    *[Symbol.iterator]() {
        const elements = this.elements;
        if (this.$iterable) {
            if (!this.$iterator)
                this.$iterator = this.$iterable[Symbol.iterator]();
            let iterator = this.$iterator;
            let alreadyConsumed = elements.length;
            // yield the 1st batch "efficiently"
            if (alreadyConsumed > 0)
                yield* elements;
            while (true) {
                if (elements.length > alreadyConsumed) {
                    // wonder if `yield* elements.slice(alreadyConsumed)` is more performant or not
                    for (let i = alreadyConsumed; i < elements.length; i++)
                        yield elements[i];
                    alreadyConsumed = elements.length;
                }
                if (!iterator)
                    break;
                const { value, done } = iterator.next();
                if (done) {
                    iterator = this.$iterator = null;
                    this.$iterable = null;
                }
                else {
                    elements.push(value);
                    alreadyConsumed++;
                    yield value;
                }
            }
        }
        else {
            yield* elements;
        }
    }
}
const MemoizedIterator = (iterator) => new MemoizedIteratorClass(iterator);
const MI = MemoizedIterator;

/// <reference types="./Mixin.d.ts" />
//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const MixinInstanceOfProperty = Symbol('MixinIdentity');
const MixinStateProperty = Symbol('MixinStateProperty');
//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
class MixinWalkDepthState {
    constructor() {
        this.baseEl = undefined;
        this.sourceEl = undefined;
        this.$elementsByTopoLevel = undefined;
        this.$topoLevels = undefined;
        this.linearizedByTopoLevelsSource = MI(this.linearizedByTopoLevels());
    }
    static new(props) {
        const me = new this();
        props && Object.assign(me, props);
        return me;
    }
    get topoLevels() {
        if (this.$topoLevels !== undefined)
            return this.$topoLevels;
        return this.$topoLevels = this.buildTopoLevels();
    }
    buildTopoLevels() {
        return Array.from(this.elementsByTopoLevel.keys()).sort((level1, level2) => level1 - level2);
    }
    get elementsByTopoLevel() {
        if (this.$elementsByTopoLevel !== undefined)
            return this.$elementsByTopoLevel;
        return this.$elementsByTopoLevel = this.buildElementsByTopoLevel();
    }
    getOrCreateLevel(map, topoLevel) {
        let elementsAtLevel = map.get(topoLevel);
        if (!elementsAtLevel) {
            elementsAtLevel = [];
            map.set(topoLevel, elementsAtLevel);
        }
        return elementsAtLevel;
    }
    buildElementsByTopoLevel() {
        let maxTopoLevel = 0;
        const baseElements = this.baseEl ? CI(this.baseEl.walkDepthState.elementsByTopoLevel.values()).concat().toSet() : new Set();
        const map = CI(this.sourceEl.requirements)
            .map(mixin => mixin.walkDepthState.elementsByTopoLevel)
            .concat()
            .reduce((elementsByTopoLevel, [topoLevel, mixins]) => {
            if (topoLevel > maxTopoLevel)
                maxTopoLevel = topoLevel;
            this.getOrCreateLevel(elementsByTopoLevel, topoLevel).push(mixins);
            return elementsByTopoLevel;
        }, new Map());
        this.getOrCreateLevel(map, maxTopoLevel + 1).push([this.sourceEl]);
        return CI(map).map(([level, elements]) => {
            return [level, CI(elements).concat().uniqueOnly().filter(mixin => !baseElements.has(mixin)).sort((mixin1, mixin2) => mixin1.id - mixin2.id)];
        }).toMap();
    }
    *linearizedByTopoLevels() {
        yield* CI(this.topoLevels).map(level => this.elementsByTopoLevel.get(level)).concat();
    }
}
// Note: 65535 mixins only, because of the hashing function implementation (String.fromCharCode)
let MIXIN_ID = 1;
//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const identity = a => class extends a {
};
// export type IdentityMixin<Base extends object>         = < T extends AnyConstructor<Base>>(base : T) => T
//
// export const IdentityMixin             = <Base extends object>() : IdentityMixin<Base> => identity
//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
class ZeroBaseClass {
}
//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
class MixinState {
    constructor() {
        this.id = MIXIN_ID++;
        this.requirements = [];
        this.baseClass = ZeroBaseClass;
        this.identitySymbol = undefined;
        this.mixinLambda = identity;
        this.walkDepthState = undefined;
        // private $hash               : MixinHash             = ''
        this.$minimalClass = undefined;
        this.name = '';
    }
    static new(props) {
        const me = new this();
        props && Object.assign(me, props);
        me.walkDepthState = MixinWalkDepthState.new({ sourceEl: me, baseEl: getMixinState(me.baseClass) });
        //------------------
        const mixinLambda = me.mixinLambda;
        const symbol = me.identitySymbol = Symbol(mixinLambda.name);
        const mixinLambdaWrapper = Object.assign(function (base) {
            const extendedClass = mixinLambda(base);
            extendedClass.prototype[symbol] = true;
            return extendedClass;
        }, {
            [MixinInstanceOfProperty]: symbol,
            [MixinStateProperty]: me
        });
        Object.defineProperty(mixinLambdaWrapper, Symbol.hasInstance, { value: isInstanceOfStatic });
        me.mixinLambda = mixinLambdaWrapper;
        return me;
    }
    get minimalClass() {
        if (this.$minimalClass !== undefined)
            return this.$minimalClass;
        return this.$minimalClass = this.buildMinimalClass();
    }
    // get hash () : MixinHash {
    //     if (this.$hash !== '') return this.$hash
    //
    //     return this.$hash = this.buildHash()
    // }
    // buildHash () : MixinHash {
    //     return String.fromCharCode(...this.walkDepthState.linearizedByTopoLevelsSource.map(mixin => mixin.id))
    // }
    getBaseClassMixinId(baseClass) {
        const constructor = this.constructor;
        const mixinId = constructor.baseClassesIds.get(baseClass);
        if (mixinId !== undefined)
            return mixinId;
        const newId = MIXIN_ID++;
        constructor.baseClassesIds.set(baseClass, newId);
        return newId;
    }
    buildMinimalClass() {
        const self = this.constructor;
        let baseCls = this.baseClass;
        const minimalClassConstructor = this.walkDepthState.linearizedByTopoLevelsSource.reduce((acc, mixin) => {
            const { cls, hash } = acc;
            const nextHash = hash + String.fromCharCode(mixin.id);
            let wrapperCls = self.minimalClassesByLinearHash.get(nextHash);
            if (!wrapperCls) {
                wrapperCls = mixin.mixinLambda(cls);
                mixin.name = wrapperCls.name;
                self.minimalClassesByLinearHash.set(nextHash, wrapperCls);
            }
            acc.cls = wrapperCls;
            acc.hash = nextHash;
            return acc;
        }, { cls: baseCls, hash: String.fromCharCode(this.getBaseClassMixinId(baseCls)) }).cls;
        const minimalClass = Object.assign(minimalClassConstructor, {
            [MixinInstanceOfProperty]: this.identitySymbol,
            [MixinStateProperty]: this,
            mix: this.mixinLambda,
            // we suppose the `derive` method to always be used as a call from constructor
            // (so `this` is set to constructor)
            // this is to provide a uniform prototype structure for `isMixinClass` function to work correctly
            // right now, a mixin class is an empty wrapper around the minimal mixin class:
            //        wrapper
            // `class SomeMixin extends Mixin() {}`
            derive: function (base) { return Mixin([this, base], base => class extends base {
            }); },
            $: this,
            toString: this.toString.bind(this)
        });
        Object.defineProperty(minimalClass, Symbol.hasInstance, { value: isInstanceOfStatic });
        return minimalClass;
    }
    toString() {
        return this.walkDepthState.linearizedByTopoLevelsSource.reduce((acc, mixin) => `${mixin.name}(${acc})`, this.baseClass.name);
    }
}
MixinState.minimalClassesByLinearHash = new Map();
MixinState.baseClassesIds = new Map();
// endregion
//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const isMixinClass = (func) => {
    const superProto = Object.getPrototypeOf(func.prototype);
    return superProto ? superProto.constructor.hasOwnProperty(MixinStateProperty) : false;
};
const getMixinState = (func) => {
    const superProto = Object.getPrototypeOf(func.prototype);
    return superProto ? superProto.constructor[MixinStateProperty] : undefined;
};
//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const mixin = (required, mixinLambda) => {
    let baseClass;
    if (required.length > 0) {
        const lastRequirement = required[required.length - 1];
        // absence of `[ MixinStateProperty ]` indicates its a regular class and not a mixin class
        // avoid assigning ZeroBaseClass - it will be applied as default at the end
        if (!isMixinClass(lastRequirement) && lastRequirement !== ZeroBaseClass)
            baseClass = lastRequirement;
    }
    const requirements = [];
    required.forEach((requirement, index) => {
        if (isMixinClass(requirement)) {
            const mixinState = requirement[MixinStateProperty];
            const currentBaseClass = mixinState.baseClass;
            // ignore ZeroBaseClass - since those are compatible with any other base class
            if (currentBaseClass !== ZeroBaseClass) {
                if (baseClass) {
                    // already found a base class from requirements earlier
                    if (baseClass !== currentBaseClass) {
                        const currentIsSub = currentBaseClass.prototype.isPrototypeOf(baseClass.prototype);
                        const currentIsSuper = baseClass.prototype.isPrototypeOf(currentBaseClass.prototype);
                        if (!currentIsSub && !currentIsSuper)
                            throw new Error("Base class mismatch");
                        baseClass = currentIsSuper ? currentBaseClass : baseClass;
                    }
                }
                else
                    // first base class from requirements
                    baseClass = currentBaseClass;
            }
            requirements.push(mixinState);
        }
        else {
            if (index !== required.length - 1)
                throw new Error("Base class should be provided as the last element of the requirements array");
        }
    });
    //------------------
    const mixinState = MixinState.new({
        requirements,
        mixinLambda: mixinLambda,
        baseClass: baseClass || ZeroBaseClass
    });
    return mixinState.minimalClass;
};
//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// this function works both with default mixin class and mixin application function
// it supplied internally as [Symbol.hasInstance] for the default mixin class and mixin application function
const isInstanceOfStatic = function (instance) {
    if (isMixinClass(this))
        return Boolean(instance && instance[this[MixinInstanceOfProperty]]);
    else
        return this.prototype.isPrototypeOf(instance);
};
//---------------------------------------------------------------------------------------
/**
 * This function allows you to create mixin classes. Mixin classes solves the well-known problem with "classical" single-class inheritance,
 * in which class hierarchy must form a tree. When using mixins, class hierarchy becomes an arbitrary acyclic graph.
 *
 * Another view on mixins is that, if "classical" class is a point (a vertice of the graph), mixin class is an arrow between the points
 * (an edge in the graph, or rather, a description of the edge).
 *
 * Some background information about the mixin pattern can be found [here](https://mariusschulz.com/blog/typescript-2-2-mixin-classes)
 * and [here](https://www.bryntum.com/blog/the-mixin-pattern-in-typescript-all-you-need-to-know/).
 *
 * The pattern, being described here, is the evolution of the previous work, and main advantage is that it solves the compilation error
 * for circular references.
 *
 * Mixin definition. Requirements
 * ------------------------------
 *
 * The pattern looks like:
 *
 *     class Mixin1 extends Mixin(
 *         [],
 *         (base : AnyConstructor) =>
 *
 *         class Mixin1 extends base {
 *             prop1        : string
 *             method1 () : string {
 *                 return this.prop1
 *             }
 *             static static1 : number
 *         }
 *     ){}
 *
 * The core of the definition above is the mixin lambda - a function which receives a base class as its argument and returns a class,
 * extending the base class with additional properties.
 *
 * The example above creates a mixin `Mixin1` which has no requirements. Requirements are the other mixins,
 * which needs to be included in the base class of this mixin.
 *
 * There's also a special type of the requirement,
 * called "base class requirement". It is optional and can only appear as the last argument of the requirements
 * array. It does not have to be a mixin, created with the `Mixin` function, but can be any JS class. This requirement
 * specifies, that the base class of this mixin should be a subclass of the given class (or that class itself).
 *
 * The requirements of the mixin needs to be listed 3 times:
 * - as an array of constructor functions, in the 1st argument of the `Mixin` function
 * - as an instance type intersection, in the 1st type argument for the [[AnyConstructor]] type
 * - as an static type intersection, in the 2nd type argument for the [[AnyConstructor]] type
 *
 * For example, `Mixin2` requires `Mixin1`:
 *
 *     class Mixin2 extends Mixin(
 *         [ Mixin1 ],
 *         (base : AnyConstructor<Mixin1, typeof Mixin1>) =>
 *
 *         class Mixin2 extends base {
 *         }
 *     ){}
 *
 * And `Mixin3` requires both `Mixin1` and `Mixin2` (even that its redundant, since `Mixin2` already requires `Mixin1`,
 * but suppose we don't know the implementation details of the `Mixin2`):
 *
 *     class Mixin3 extends Mixin(
 *         [ Mixin1, Mixin2 ],
 *         (base : AnyConstructor<Mixin1 & Mixin2, typeof Mixin1 & typeof Mixin2>) =>
 *
 *         class Mixin3 extends base {
 *         }
 *     ){}
 *
 * Now, `Mixin4` requires `Mixin3`, plus, it requires the base class to be `SomeBaseClass`:
 *
 *     class SomeBaseClass {}
 *
 *     class Mixin4 extends Mixin(
 *         [ Mixin3, SomeBaseClass ],
 *         (base : AnyConstructor<
 *             Mixin3 & SomeBaseClass, typeof Mixin3 & typeof SomeBaseClass
 *         >) =>
 *
 *         class Mixin4 extends base {
 *         }
 *     ){}
 *
 * As already briefly mentioned, the requirements are "scanned" deep and included only once. Also all minimal classes are cached -
 * for example the creation of the Mixin3 will reuse the minimal class of the Mixin2 instead of creating a new intermediate class.
 * This means that all edges of the mixin dependencies graph are created only once (up to the base class).
 *
 * Requirements can not form cycles - that will generate both compilation error and run-time stack overflow.
 *
 * The typing for the `Mixin` function will provide a compilation error, if the requirements don't match, e.g. some requirement is
 * listed in the array, but missed in the types. This protects you from trivial mistakes. However, the typing is done up to 10 requirements only.
 * If you need more than 10 requirements for the mixin, use the [[MixinAny]] function, which is an exact analog of `Mixin`, but without
 * this type-level protection for requirements mismatch.
 *
 * It is possible to simplify the type of the `base` argument a bit, by using the [[ClassUnion]] helper. However, it seems in certain edge cases
 * it may lead to compilation errors. If your scenarios are not so complex you should give it a try. Using the [[ClassUnion]] helper, the
 * `Mixin3` can be defined as:
 *
 *     class Mixin3 extends Mixin(
 *         [ Mixin1, Mixin2 ],
 *         (base : ClassUnion<typeof Mixin1, typeof Mixin2>) =>
 *
 *         class Mixin3 extends base {
 *         }
 *     ){}
 *
 * Note, that due to this [issue](https://github.com/Microsoft/TypeScript/issues/7342), if you use decorators in your mixin class,
 * the declaration needs to be slightly more verbose (can not use compact notation for the arrow functions):
 *
 *     class Mixin2 extends Mixin(
 *         [ Mixin1 ],
 *         (base : AnyConstructor<Mixin1, typeof Mixin1>) => {
 *             class Mixin2 extends base {
 *                 @decorator
 *                 prop2 : string
 *             }
 *             return Mixin2
 *         }
 *     ){}
 *
 * As you noticed, the repeating listing of the requirements is somewhat verbose. Suggestions how the pattern can be improved
 * are [very welcomed](mailto:nickolay8@gmail.com).
 *
 * Mixin instantiation. Mixin constructor. `instanceof`
 * --------------------------------
 *
 * You can instantiate any mixin class just by using its constructor:
 *
 *     const instance1 = new Mixin1()
 *     const instance2 = new Mixin2()
 *
 * As explained in details [here](https://mariusschulz.com/blog/typescript-2-2-mixin-classes), mixin constructor should accept variable number of arguments
 * with the `any` type. This is simply because the mixin is supposed to be applicable to any other base class, which may have its own type
 * of the constructor arguments.
 *
 *     class Mixin2 extends Mixin(
 *         [ Mixin1 ],
 *         (base : AnyConstructor<Mixin1, typeof Mixin1>) => {
 *             class Mixin2 extends base {
 *                 prop2 : string
 *
 *                 constructor (...args: any[]) {
 *                     super(...args)
 *                     this.prop2 = ''
 *                 }
 *             }
 *             return Mixin2
 *         }
 *     ){}
 *
 * In other words, its not possible to provide any type-safety for mixin instantiation using regular class constructor.
 *
 * However, if we change the way we create class instances a little, we can get the type-safety back. For that,
 * we need to use a "uniform" class constructor - a constructor which has the same form for all classes. The [[Base]] class
 * provides such constructor as its static [[Base.new|new]] method. The usage of `Base` class is not required - you can use
 * any other base class.
 *
 * The `instanceof` operator works as expected for instances of the mixin classes. It also takes into account all the requirements.
 * For example:
 *
 *     const instance2 = new Mixin2()
 *
 *     const isMixin2 = instance2 instanceof Mixin2 // true
 *     const isMixin1 = instance2 instanceof Mixin1 // true, since Mixin2 requires Mixin1
 *
 * See also [[isInstanceOf]].
 *
 * "Manual" class derivation
 * --------------------------------
 *
 * You have defined a mixin using the `Mixin` function. Now you want to apply it to some base class to get the "specific" class to be able
 * to instantiate it. As described above - you don't have to, you can instantiate it directly.
 *
 * Sometimes however, you still want to derive the class "manually". For that, you can use static methods `mix` and `derive`, available
 * on all mixins.
 *
 * The `mix` method provides a direct access to the mixin lambda. It does not take requirements into account - that's the implementor's responsibility.
 * The `derive` method is something like "accumulated" mixin lambda - mixin lambda with all requirements.
 *
 * Both `mix` and `derive` provide the reasonably typed outcome.
 *
 *     class Mixin1 extends Mixin(
 *         [],
 *         (base : AnyConstructor) =>
 *
 *         class Mixin1 extends base {
 *             prop1        : string
 *         }
 *     ){}
 *
 *     class Mixin2 extends Mixin(
 *         [ Mixin1 ],
 *         (base : AnyConstructor<Mixin1, typeof Mixin1>) =>
 *
 *         class Mixin2 extends base {
 *             prop2        : string
 *         }
 *     ){}
 *
 *     const ManualMixin1 = Mixin1.mix(Object)
 *     const ManualMixin2 = Mixin2.mix(Mixin1.mix(Object))
 *
 *     const AnotherManualMixin1 = Mixin1.derive(Object)
 *     const AnotherManualMixin2 = Mixin2.derive(Object)
 *
 * Generics
 * --------
 *
 * Using generics with mixins is tricky because TypeScript does not have higher-kinded types and type inference for generics. Still some form
 * of generic arguments is possible, using the interface merging trick.
 *
 * Here's the pattern:
 *
 * ```ts
 * class Duplicator<Element> extends Mixin(
 *     [],
 *     (base : AnyConstructor) =>
 *
 *     class Duplicator extends base {
 *         Element                 : any
 *
 *         duplicate (value : this[ 'Element' ]) : this[ 'Element' ][] {
 *             return [ value, value ]
 *         }
 *     }
 * ){}
 *
 * interface Duplicator<Element> {
 *     Element : Element
 * }
 *
 * const dup = new Duplicator<boolean>()
 *
 * dup.duplicate('foo') // TS2345: Argument of type '"foo"' is not assignable to parameter of type 'boolean'.
 * ```
 *
 * In the example above, we've defined a generic argument `Element` for the outer mixin class, but in fact, that argument is not used anywhere in the
 * nested class definition in the mixin lambda. Instead, in the nested class, we define a property `Element`, which plays the role of the
 * generic argument.
 *
 * Mixin class methods then can refer to the generic type as `this[ 'Element' ]`.
 *
 * The generic arguments of the outer and nested classes are tied together in the additional interface declaration, which, by TypeScript rules
 * is merged together with the class definition. In this declaration, we specify that property `Element` has type of the `Element` generic argument.
 *
 * Limitations
 * ---------
 *
 * The most important limitation we found (which affect the old pattern as well) is the compilation error, which will be issued for
 * the private/protected methods, when compiling with declarations emitting (*.d.ts files generation).
 *
 * This is a [well-known problem](https://github.com/microsoft/TypeScript/issues/35822) in the TypeScript world – the *.d.ts files do not represent
 * the internal data structures of the TypeScript compiler well. Instead they use some simplified syntax, optimized for human editing.
 * This is why the compiler may generate false positives in the incremental compilation mode – it uses *.d.ts files internally.
 *
 * This can be a show-stopper for the people that use declaration files (usually for publishing). Keep in mind though, that you can always
 * publish actual TypeScript sources along with the generated JavaScript files, instead of publishing JavaScript + declarations files.
 *
 */
const Mixin = mixin;
const MixinCustom = mixin;

/// <reference types="./Base.d.ts" />
//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
/**
 * This is a base class, providing the type-safe static constructors [[new]] and [[maybeNew]]. This is very convenient when using
 * [[Mixin|mixins]], as mixins can not have types in the constructors.
 */
class Base {
    /**
     * This method applies its 1st argument (if any) to the current instance using `Object.assign()`.
     *
     * Supposed to be overridden in the subclasses to customize the instance creation process.
     *
     * @param props
     */
    initialize(props) {
        props && Object.assign(this, props);
    }
    /**
     * This is a type-safe static constructor method, accepting a single argument, with the object, corresponding to the
     * class properties. It will generate a compilation error, if unknown property is provided.
     *
     * For example:
     *
     * ```ts
     * class MyClass extends Base {
     *     prop     : string
     * }
     *
     * const instance : MyClass = MyClass.new({ prop : 'prop', wrong : 11 })
     * ```
     *
     * will produce:
     *
     * ```
     * TS2345: Argument of type '{ prop: string; wrong: number; }' is not assignable to parameter of type 'Partial<MyClass>'.
     * Object literal may only specify known properties, and 'wrong' does not exist in type 'Partial<MyClass>'
     * ```
     *
     * The only thing this constructor does is create an instance and call the [[initialize]] method on it, forwarding
     * the first argument. The customization of instance is supposed to be performed in that method.
     *
     * @param props
     */
    static new(props) {
        const instance = new this();
        instance.initialize(props);
        return instance;
    }
    /**
     * This is a type-safe static constructor method, accepting a single argument. If that argument is already an instance
     * of this class - it is returned right away, otherwise the [[new]] constructor is used for instantiation.
     * @param props
     */
    static maybeNew(props) {
        if (props instanceof this)
            return props;
        else
            return this.new(props);
    }
}

//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const uppercaseFirst$1 = (str) => str.slice(0, 1).toUpperCase() + str.slice(1);
//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const isAtomicValue = (value) => Object(value) !== value;
//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const typeOf$1 = (value) => Object.prototype.toString.call(value).slice(8, -1);
//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const AsyncFunction = Object.getPrototypeOf(async () => { }).constructor;

//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const visitorVisitSymbol = Symbol('internalVisitSymbol');
const PreVisit = Symbol('PreVisit');
//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
class Visitor extends Mixin([], (base) => class Visitor extends base {
    constructor() {
        super(...arguments);
        this.maxDepth = Number.MAX_SAFE_INTEGER;
        this.visited = new Map();
        this.internalVisitSymbol = visitorVisitSymbol;
    }
    isVisited(value) {
        return this.visited.has(value);
    }
    markPreVisited(value) {
        this.visited.set(value, PreVisit);
    }
    markPostVisited(value, depth, visitResult) {
        this.visited.set(value, visitResult);
        return visitResult;
    }
    visit(value, depth = 0) {
        if (depth >= this.maxDepth) {
            return this.visitOutOfDepthValue(value, depth + 1);
        }
        else if (isAtomicValue(value)) {
            return this.visitAtomicValueEntry(value, depth + 1);
        }
        else if (this.isVisited(value)) {
            return this.visitAlreadyVisited(value, depth + 1);
        }
        else {
            return this.visitNotVisited(value, depth + 1);
        }
    }
    visitOutOfDepthValue(value, depth) {
        return value;
    }
    visitAtomicValue(value, depth) {
        return value;
    }
    visitAtomicValueEntry(value, depth) {
        const specificVisitorMethod = `visit${uppercaseFirst$1(typeOf$1(value))}`;
        const visitMethod = this[specificVisitorMethod] || this.visitAtomicValue;
        return visitMethod.call(this, value, depth);
    }
    visitAlreadyVisited(value, depth) {
        return value;
    }
    visitNotVisited(value, depth) {
        this.markPreVisited(value);
        if (value[this.internalVisitSymbol]) {
            const visitResult = value[this.internalVisitSymbol](this, depth);
            return this.markPostVisited(value, depth, visitResult);
        }
        else {
            const specificVisitorMethod = `visit${uppercaseFirst$1(typeOf$1(value))}`;
            const visitMethod = this[specificVisitorMethod] || this.visitObject;
            const visitResult = visitMethod.call(this, value, depth);
            return this.markPostVisited(value, depth, visitResult);
        }
    }
    visitObject(object, depth) {
        const entries = Object.entries(object);
        entries.forEach(([key, value], index) => {
            this.visitObjectEntryKey(key, value, object, index, entries, depth);
            this.visitObjectEntryValue(key, value, object, index, entries, depth);
        });
        return object;
    }
    visitObjectEntryKey(key, value, object, index, entries, depth) {
        return this.visitAtomicValueEntry(key, depth);
    }
    visitObjectEntryValue(key, value, object, index, entries, depth) {
        return this.visit(value, depth);
    }
    visitArray(array, depth) {
        array.forEach((value, index) => this.visitArrayEntry(value, array, index, depth));
        return array;
    }
    visitArrayEntry(value, array, index, depth) {
        return this.visit(value, depth);
    }
    visitSet(set, depth) {
        let index = 0;
        for (const value of set)
            this.visitSetElement(value, set, index++, depth);
        return set;
    }
    visitSetElement(value, set, index, depth) {
        return this.visit(value, depth);
    }
    visitMap(map, depth) {
        let index = 0;
        for (const [key, value] of map) {
            this.visitMapEntryKey(key, value, map, index, depth);
            this.visitMapEntryValue(key, value, map, index++, depth);
        }
        return map;
    }
    visitMapEntryKey(key, value, map, index, depth) {
        return this.visit(key, depth);
    }
    visitMapEntryValue(key, value, map, index, depth) {
        return this.visit(value, depth);
    }
    visitDate(date, depth) {
        return date;
    }
    visitFunction(func, depth) {
        return func;
    }
    visitAsyncFunction(func, depth) {
        return func;
    }
    visitError(error, depth) {
        return error;
    }
    visitTypeError(error, depth) {
        return error;
    }
    visitRangeError(error, depth) {
        return error;
    }
    visitEvalError(error, depth) {
        return error;
    }
    visitReferenceError(error, depth) {
        return error;
    }
    visitSyntaxError(error, depth) {
        return error;
    }
    visitURIError(error, depth) {
        return error;
    }
}) {
}
//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
class Mapper extends Mixin([Visitor], (base) => class Mapper extends base {
    visitObject(object, depth) {
        const entries = Object.entries(object);
        const newObject = Object.create(Object.getPrototypeOf(object));
        entries.forEach(([key, value], index) => {
            newObject[this.visitObjectEntryKey(key, value, object, index, entries, depth)] =
                this.visitObjectEntryValue(key, value, object, index, entries, depth);
        });
        return newObject;
    }
    visitArray(array, depth) {
        return array.map((value, index) => this.visitArrayEntry(value, array, index, depth));
    }
    visitSet(set, depth) {
        let index = 0;
        const newSet = new Set();
        for (const value of set) {
            newSet.add(this.visitSetElement(value, set, index++, depth));
        }
        return newSet;
    }
    visitMap(map, depth) {
        let index = 0;
        const newMap = new Map();
        for (const [key, value] of map) {
            newMap.set(this.visitMapEntryKey(key, value, map, index, depth), this.visitMapEntryValue(key, value, map, index++, depth));
        }
        return newMap;
    }
    visitDate(date, depth) {
        return new Date(date);
    }
}) {
}
//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
class Mutator extends Mixin([Visitor], (base) => class Mutator extends base {
    visitObject(object, depth) {
        const entries = Object.entries(object);
        entries.forEach(([key, value], index) => {
            const visitedKey = this.visitObjectEntryKey(key, value, object, index, entries, depth);
            const visitedValue = this.visitObjectEntryValue(key, value, object, index, entries, depth);
            if (visitedKey !== key) {
                delete object[key];
                object[visitedKey] = visitedValue;
            }
            else if (visitedValue !== value) {
                object[visitedKey] = visitedValue;
            }
        });
        return object;
    }
    visitArray(array, depth) {
        array.forEach((value, index) => array[index] = this.visitArrayEntry(value, array, index, depth));
        return array;
    }
    visitSet(set, depth) {
        let index = 0;
        // prefetch the collection before mutating it
        const elements = Array.from(set);
        elements.forEach(value => {
            const visited = this.visitSetElement(value, set, index++, depth);
            if (visited !== value) {
                set.delete(value);
                set.add(visited);
            }
        });
        return set;
    }
    visitMap(map, depth) {
        let index = 0;
        // prefetch the collection before mutating it
        const entries = Array.from(map.entries());
        entries.forEach(([key, value]) => {
            const visitedKey = this.visitMapEntryKey(key, value, map, index, depth);
            const visitedValue = this.visitMapEntryValue(visitedKey, value, map, index++, depth);
            if (visitedKey !== key) {
                map.delete(key);
                map.set(visitedKey, visitedValue);
            }
            else if (visitedValue !== value) {
                map.set(visitedKey, visitedValue);
            }
        });
        return map;
    }
}) {
}

//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// TODO internal class, exported only for test, looks like test is verifying the implementation details?
class Collapser extends Mixin([Mapper, Base], (base) => class Collapser extends base {
    constructor() {
        super(...arguments);
        this.layer = SerializationLayer.new();
    }
    isVisited(value) {
        return this.layer.hasObject(value);
    }
    markPreVisited(value) {
        this.layer.registerObject(value);
    }
    markPostVisited(value, depth, visitResult) {
        const nativeSerializationEntry = nativeSerializableClassesByStringTag.get(typeOf$1(value));
        const res = nativeSerializationEntry ? nativeSerializationEntry.toJSON(visitResult) : visitResult;
        return { $refId: this.layer.refIdOf(value), value: res };
    }
    visitAlreadyVisited(value, depth) {
        return { $ref: this.layer.refIdOf(value) };
    }
    collapse(value) {
        return this.visit(value);
    }
}) {
}
//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
class ExpanderPhase1 extends Mixin([Mapper, Base], (base) => class ExpanderPhase1 extends base {
    constructor() {
        super(...arguments);
        this.layer = SerializationLayer.new();
    }
    markPostVisited(value, depth, visitResult) {
        let resolved = visitResult;
        if (resolved)
            if (resolved.$refId !== undefined) {
                this.layer.registerObject(resolved.value, resolved.$refId);
                resolved = resolved.value;
            }
        return super.markPostVisited(value, depth, resolved);
    }
}) {
}
//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
class Expander extends Mixin([Mutator, Base], (base) => class Expander extends base {
    constructor() {
        super(...arguments);
        this.$expander1 = undefined;
        this.mappingVisitSymbol = undefined;
        this.layer = SerializationLayer.new();
    }
    get expander1() {
        if (this.$expander1 !== undefined)
            return this.$expander1;
        return this.$expander1 = ExpanderPhase1.new({ internalVisitSymbol: this.mappingVisitSymbol });
    }
    markPostVisited(value, depth, visitResult) {
        let resolved = visitResult;
        if (resolved)
            if (resolved.$ref !== undefined) {
                resolved = this.expander1.layer.objectOf(resolved.$ref);
            }
        return super.markPostVisited(value, depth, resolved);
    }
    expand(value) {
        this.expander1.layer = this.layer;
        const expanded = this.expander1.visit(value);
        return this.visit(expanded);
    }
}) {
}
//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
class SerializationLayer extends Base {
    constructor() {
        super(...arguments);
        this.refIdSource = 0;
        this.objectToRefId = new Map();
        this.refIdToObject = new Map();
    }
    hasObject(object) {
        return this.objectToRefId.has(object);
    }
    registerObject(object, id) {
        if (id === undefined)
            id = this.refIdSource++;
        this.objectToRefId.set(object, id);
        this.refIdToObject.set(id, object);
    }
    refIdOf(object) {
        return this.objectToRefId.get(object);
    }
    objectOf(refId) {
        return this.refIdToObject.get(refId);
    }
}
//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
class Serializable extends Mixin([], (base) => class Serializable extends base {
    // eof in-prototype properties
    toJSON(key) {
        if (!this.$class)
            throw new Error(`Missing serializable class id: ${this.constructor}`);
        const json = {};
        if (this.$mode === 'optOut')
            for (const [key, propValue] of Object.entries(this)) {
                if (!this.$excludedProperties || !this.$excludedProperties[key])
                    json[key] = propValue;
            }
        else if (this.$includedProperties)
            for (const key in this.$includedProperties) {
                json[key] = this[key];
            }
        json.$class = this.$class;
        return json;
    }
    // 1. does not call actual constructor for a purpose - class "revivification"
    // supposed to be pure
    // also when this method is called the cyclic references are not resolved yet
    // 2. the better type:
    //      static fromJSON<T extends typeof Serializable> (this : T, json : object) : InstanceType<T>
    // breaks the declaration files generation
    static fromJSON(json) {
        const instance = Object.create(this.prototype);
        for (const [key, value] of Object.entries(json)) {
            if (key !== '$class')
                instance[key] = value;
        }
        return instance;
    }
}) {
}
//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
class SerializableCustom extends MixinCustom([Serializable], (base) => class SerializableCustom extends base {
}) {
}
//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// TODO consider using 'moduleUrl/symbol' pair as class key
// deserialization becomes async in this case
const serializableClasses = new Map();
const registerSerializableClass = (options, cls) => {
    const id = options.id;
    cls.prototype.$class = id;
    cls.prototype.$mode = options.mode;
    if (serializableClasses.has(id) && serializableClasses.get(id) !== cls) {
        throw new Error(`Serializable class with id: [${id}] already registered`);
    }
    serializableClasses.set(id, cls);
};
const nativeSerializableClassesByStringTag = new Map();
const nativeSerializableClassesById = new Map();
const registerNativeSerializableClass = (cls, entry) => {
    nativeSerializableClassesByStringTag.set(cls.name, entry);
    nativeSerializableClassesById.set(cls.name, entry);
};
const serializable = (opts) => {
    // @ts-ignore
    return (target) => {
        var _a, _b;
        if (!(target.prototype instanceof Serializable))
            throw new Error(`The class [${target.name}] is decorated with @serializable, but does not include the Serializable mixin.`);
        registerSerializableClass({ id: (_a = opts === null || opts === void 0 ? void 0 : opts.id) !== null && _a !== void 0 ? _a : target.name, mode: (_b = opts === null || opts === void 0 ? void 0 : opts.mode) !== null && _b !== void 0 ? _b : 'optOut' }, target);
        return target;
    };
};
//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const exclude = () => {
    return function (target, propertyKey) {
        if (!target.hasOwnProperty('$excludedProperties')) {
            target.$excludedProperties = Object.create(target.$excludedProperties || null);
        }
        target.$excludedProperties[propertyKey] = true;
    };
};
//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
registerNativeSerializableClass(Function, {
    toJSON: (func) => {
        return {
            $$class: 'Function',
            source: '(' + func.toString() + ')'
        };
    },
    fromJSON: data => {
        return globalThis.eval(data.source);
    }
});
registerNativeSerializableClass(AsyncFunction, {
    toJSON: (func) => {
        return {
            $$class: 'AsyncFunction',
            source: '(' + func.toString() + ')'
        };
    },
    fromJSON: data => {
        return globalThis.eval(data.source);
    }
});
registerNativeSerializableClass(Map, {
    toJSON: (map) => {
        return {
            $$class: 'Map',
            entries: Array.from(map.entries())
        };
    },
    fromJSON: data => {
        return new Map(data.entries);
    }
});
registerNativeSerializableClass(Set, {
    toJSON: (set) => {
        return {
            $$class: 'Set',
            entries: Array.from(set)
        };
    },
    fromJSON: data => {
        return new Set(data.entries);
    }
});
// possibly can be improved by storing Date in "magical" string format
registerNativeSerializableClass(Date, {
    toJSON: (date) => {
        return {
            $$class: 'Date',
            time: date.getTime()
        };
    },
    fromJSON: data => {
        return new Date(data.time);
    }
});
const errorClasses = [Error, TypeError, RangeError, EvalError, ReferenceError, SyntaxError, URIError];
errorClasses.forEach(cls => registerNativeSerializableClass(cls, {
    toJSON: (error) => {
        return Object.assign({}, error, {
            $$class: cls.name,
            stack: error.stack,
            message: error.message,
            name: error.name
        });
    },
    fromJSON: data => {
        const error = Object.create(cls.prototype);
        Object.assign(error, data);
        delete error.$$class;
        error.stack = data.stack;
        error.message = data.message;
        error.name = data.name;
        return error;
    }
}));

//---------------------------------------------------------------------------------------------------------------------
// assume 32-bit platform (https://v8.dev/blog/react-cliff)
// Note - can not use: expression like: -Math.pow(2, 30) - v8 does not recognize it as SMI
const MIN_SMI = -1073741824;
const MAX_SMI = 1073741823;
const strictEquality = (v1, v2) => v1 === v2;
//---------------------------------------------------------------------------------------------------------------------
const uppercaseFirst = (str) => str.slice(0, 1).toUpperCase() + str.slice(1);
//---------------------------------------------------------------------------------------------------------------------
const defineProperty = (target, property, value) => {
    Object.defineProperty(target, property, { value, enumerable: true, configurable: true });
    return value;
};
//---------------------------------------------------------------------------------------------------------------------
const prototypeValue = (value) => {
    return function (target, propertyKey) {
        target[propertyKey] = value;
    };
};
//---------------------------------------------------------------------------------------------------------------------
const delay = (timeout) => new Promise(resolve => setTimeout(resolve, timeout));
let isRegeneratorRuntime = null;
const isGeneratorFunction = function (func) {
    if (isRegeneratorRuntime === null)
        isRegeneratorRuntime = typeof regeneratorRuntime !== 'undefined';
    if (isRegeneratorRuntime === true) {
        return regeneratorRuntime.isGeneratorFunction(func);
    }
    else {
        return func.constructor.name === 'GeneratorFunction';
    }
};
const setImmediateHelper = (func) => {
    const desc = { cleared: false };
    Promise.resolve().then(() => !desc.cleared && func());
    return desc;
};
const clearImmediateHelper = (desc) => {
    desc.cleared = true;
};

//---------------------------------------------------------------------------------------------------------------------
class Hook {
    constructor() {
        this.hooks = [];
    }
    on(listener) {
        this.hooks.push(listener);
        return () => this.un(listener);
    }
    un(listener) {
        const index = this.hooks.indexOf(listener);
        if (index !== -1)
            this.hooks.splice(index, 1);
    }
    trigger(...payload) {
        const listeners = this.hooks.slice();
        for (let i = 0; i < listeners.length; ++i) {
            listeners[i](...payload);
        }
    }
}

var OnCycleAction;
(function (OnCycleAction) {
    OnCycleAction["Cancel"] = "Cancel";
    OnCycleAction["Resume"] = "Resume";
})(OnCycleAction || (OnCycleAction = {}));
//---------------------------------------------------------------------------------------------------------------------
const WalkSource = Symbol('WalkSource');
const NOT_VISITED = -1;
const VISITED_TOPOLOGICALLY = -2;
//---------------------------------------------------------------------------------------------------------------------
class WalkContext extends Base {
    constructor() {
        super(...arguments);
        this.visited = new Map();
        this.toVisit = [];
        this.currentEpoch = 0;
    }
    startFrom(sourceNodes) {
        this.continueFrom(sourceNodes);
    }
    continueFrom(sourceNodes) {
        this.toVisit.push.apply(this.toVisit, sourceNodes.map(node => {
            return { node: node, from: WalkSource, label: undefined };
        }));
        this.walkDepth();
    }
    onNode(node, walkStep) {
    }
    onTopologicalNode(node) {
    }
    onCycle(node, stack) {
        return OnCycleAction.Cancel;
    }
    forEachNext(node, func) {
        throw new Error("Abstract method called");
    }
    collectNext(node, toVisit, visitInfo) {
        throw new Error("Abstract method called");
    }
    getVisitedInfo(node) {
        return this.visited.get(node);
    }
    setVisitedInfo(node, visitedAt, info) {
        if (!info) {
            info = { visitedAt, visitEpoch: this.currentEpoch };
            this.visited.set(node, info);
        }
        else {
            info.visitedAt = visitedAt;
            info.visitEpoch = this.currentEpoch;
        }
        return info;
    }
    walkDepth() {
        this.visited;
        const toVisit = this.toVisit;
        let depth;
        while (depth = toVisit.length) {
            const node = toVisit[depth - 1].node;
            const visitedInfo = this.getVisitedInfo(node);
            // this supports the "ahead-of-time" creation of the "visited" entries, which actually lead to improved benchmarks,
            // so it might be a default
            if (visitedInfo && visitedInfo.visitedAt === VISITED_TOPOLOGICALLY && visitedInfo.visitEpoch === this.currentEpoch) {
                toVisit.pop();
                continue;
            }
            if (visitedInfo && visitedInfo.visitEpoch === this.currentEpoch && visitedInfo.visitedAt !== NOT_VISITED) {
                // it is valid to find itself "visited", but only if visited at the current depth
                // (which indicates stack unwinding)
                // if the node has been visited at earlier depth - its a cycle
                if (visitedInfo.visitedAt < depth) {
                    // ONLY resume if explicitly returned `Resume`, cancel in all other cases (undefined, etc)
                    if (this.onCycle(node, toVisit) !== OnCycleAction.Resume)
                        break;
                }
                else {
                    visitedInfo.visitedAt = VISITED_TOPOLOGICALLY;
                    this.onTopologicalNode(node);
                }
                toVisit.pop();
            }
            else {
                // if we break here, we can re-enter the loop later
                if (this.onNode(node, toVisit[depth - 1]) === false)
                    break;
                // first entry to the node
                const visitedInfo2 = this.setVisitedInfo(node, depth, visitedInfo);
                const lengthBefore = toVisit.length;
                this.collectNext(node, toVisit, visitedInfo2);
                // if there's no outgoing edges, node is at topological position
                // it would be enough to just continue the `while` loop and the `onTopologicalNode`
                // would happen on next iteration, but with this "inlining" we save one call to `visited.get()`
                // at the cost of length comparison
                if (toVisit.length === lengthBefore) {
                    visitedInfo2.visitedAt = VISITED_TOPOLOGICALLY;
                    this.onTopologicalNode(node);
                    toVisit.pop();
                }
            }
        }
    }
}
const WalkDepthC = (config) => WalkContext.new(config);
//---------------------------------------------------------------------------------------------------------------------
function cycleInfo(stack) {
    const length = stack.length;
    if (length === 0)
        return [];
    const cycleSource = stack[length - 1].node;
    const cycle = [cycleSource];
    let current = length - 1;
    let cursor = current;
    while (current >= 0 && stack[current].from !== cycleSource) {
        // going backward in steps, skipping the nodes with identical `from`
        while (current >= 0 && stack[current].from === stack[cursor].from)
            current--;
        if (current >= 0) {
            // the first node with different `from` will be part of the cycle path
            cycle.push(stack[current].node);
            cursor = current;
        }
    }
    // no cycle
    if (current < 0)
        return [];
    cycle.push(cycleSource);
    return cycle.reverse();
}

/*
Why is it safe to use this approach for "uniqable"?

On my (decent) machine, this benchmark:

    const max = Number.MIN_SAFE_INTEGER + 1e10

    console.time('uniq')
    for (let i = Number.MIN_SAFE_INTEGER; i < MAX; i++) {}
    console.timeEnd('uniq');

runs in 22.8s

This gives us:
    (Number.MAX_SAFE_INTEGER - Number.MIN_SAFE_INTEGER) / 1e10 * 22.8 / 60 / 24 / 365 = 78 years

to exhaust the integers range.

Considering that this benchmarks exercise only integers exhausting and in real-world code
on every integer used, there will be at least 10x (in reality 1000x) of other instructions,
the real time for exhausting the interval is ~780 years

UPDATE: starting from 0 halves the exhausting time, but improves performance
(less bits to compare I guess)
 */
let UNIQABLE = MIN_SMI; // Number.MIN_SAFE_INTEGER
const getUniqable = () => ++UNIQABLE;
// // in-place mutation + forEach
// export const compactAndForEach = (array : Uniqable[], func : (el : Uniqable) => any) => {
//     const uniqableId : number   = ++UNIQABLE
//
//     let uniqueIndex : number    = -1
//
//     for (let i = 0; i < array.length; ++i) {
//         const element : Uniqable    = array[ i ]
//
//         if (element.uniqable !== uniqableId) {
//             element.uniqable    = uniqableId
//
//             ++uniqueIndex
//
//             func(element)
//
//             if (uniqueIndex !== i) array[ uniqueIndex ] = element
//         }
//     }
//
//     // assuming its better to not touch the array's `length` property
//     // unless we really have to
//     if (array.length !== uniqueIndex + 1) array.length = uniqueIndex + 1
// }

//---------------------------------------------------------------------------------------------------------------------
// TODO figure out a mechanism to include the source line location into cycle
// something like:
// Cyclic read detected:
// - box1 on line 97 char 11 SourceFile2.js
// - box2 on line 78 char 12 SourceFile1.js
// - box1 on line 11 char 8 SourceFile2.js
class ComputationCycle extends Base {
    toString() {
        return this.cycle.map(atom => {
            return atom.name;
        }).join('\n');
    }
}
//---------------------------------------------------------------------------------------------------------------------
class ComputationCycleError extends Error {
}

//---------------------------------------------------------------------------------------------------------------------
class Immutable {
    constructor() {
        this.owner = undefined;
        this.previous = undefined;
        this.frozen = false;
    }
    freeze() {
        this.frozen = true;
    }
    createNext(owner) {
        this.freeze();
        const self = this.constructor;
        const next = new self();
        next.previous = this;
        next.owner = owner || this.owner;
        return next;
    }
}
//---------------------------------------------------------------------------------------------------------------------
class Owner {
    constructor() {
        this.immutable = undefined;
    }
    setCurrent(immutable) {
        if (this.immutable && immutable && immutable.previous !== this.immutable)
            throw new Error("Invalid state thread");
        this.immutable = immutable;
    }
}
//---------------------------------------------------------------------------------------------------------------------
class CombinedOwnerAndImmutable extends Immutable {
    constructor() {
        super(...arguments);
        this.owner = this;
        this.immutable = this;
    }
    createNext() {
        this.freeze();
        const self = this.constructor;
        const next = new self.immutableCls();
        next.previous = this;
        next.owner = this;
        return next;
    }
    setCurrent(immutable) {
        if (this.immutable && immutable && immutable.previous !== this.immutable)
            throw new Error("Invalid state thread");
        this.immutable = immutable;
    }
}
CombinedOwnerAndImmutable.immutableCls = Immutable;

let CHRONO_REFERENCE = 0;
const chronoReference = () => CHRONO_REFERENCE++;

//---------------------------------------------------------------------------------------------------------------------
var AtomCalculationPriorityLevel;
(function (AtomCalculationPriorityLevel) {
    AtomCalculationPriorityLevel[AtomCalculationPriorityLevel["UserInput"] = 0] = "UserInput";
    AtomCalculationPriorityLevel[AtomCalculationPriorityLevel["DependsOnlyOnUserInput"] = 1] = "DependsOnlyOnUserInput";
    AtomCalculationPriorityLevel[AtomCalculationPriorityLevel["DependsOnlyOnDependsOnlyOnUserInput"] = 2] = "DependsOnlyOnDependsOnlyOnUserInput";
    AtomCalculationPriorityLevel[AtomCalculationPriorityLevel["DependsOnSelfKind"] = 3] = "DependsOnSelfKind";
})(AtomCalculationPriorityLevel || (AtomCalculationPriorityLevel = {}));
//---------------------------------------------------------------------------------------------------------------------
/**
 * The base class for [[Identifier|identifiers]]. It contains only "meta" properties that describes "abstract" identifier.
 * The [[Field]] class inherit from this class.
 *
 * To understand the difference between the "abstract" identifier and the "specific" identifier,
 * imagine a set of instances of the same entity class. Lets say that class has a field "name".
 * All of those instances each will have different "specific" identifiers for the field "name".
 *
 * In the same time, some properties are common for all "specific" identifiers, like [[Meta.equality|equality]], [[Meta.lazy|lazy]] etc.
 * Such properties, that does not change between every "specific" identifier we will call "meta" properties.
 *
 * This class has 2 generic arguments - `ValueT` and `ContextT`. The 1st one defines the type of the identifier's value.
 * The 2nd - the identifier's computation context (synchronous or generator).
 */
class Meta extends Base {
    constructor() {
        super(...arguments);
        /**
         * The name of the identifiers. Not an id, does not imply uniqueness.
         */
        this.name = undefined;
        /**
         * Whether this identifier is lazy (`true`) or strict (`false`).
         *
         * Lazy identifiers are calculated on-demand (when read from graph or used by another identifiers).
         *
         * Strict identifiers will be calculated on read or during the [[ChronoGraph.commit|commit]] call.
         */
        this.lazy = true;
        this.level = AtomCalculationPriorityLevel.DependsOnSelfKind;
        /**
         * Whether this identifier is sync (`true`) or generator-based (`false`). Default value is `true`.
         */
        this.sync = true;
        /**
         * The calculation function of the identifier. Its returning value has a generic type, that is converted to a specific type,
         * based on the generic attribute `ContextT`.
         *
         * This function will receive a single argument - current calculation context (effects handler).
         *
         * When using generators, there's no need to use this handler - one can "yield" the value directly, using the `yield` construct.
         *
         * Compare:
         *
         *     class Author extends Entity.mix(Base) {
         *         @field()
         *         firstName       : string
         *         @field()
         *         lastName        : string
         *         @field()
         *         fullName        : string
         *
         *         @calculate('fullName')
         *         * calculateFullName () : ChronoIterator<string> {
         *             return (yield this.$.firstName) + ' ' + (yield this.$.lastName)
         *         }
         *
         *         @calculate('fullName')
         *         calculateFullName (Y) : string {
         *             return Y(this.$.firstName) + ' ' + Y(this.$.lastName)
         *         }
         *     }
         *
         * @param Y
         */
        this.calculation = undefined;
        this.write = undefined;
        this.calculationEtalon = undefined;
        /**
         * The equality check of the identifier. By default is performed with `===`.
         *
         * @param v1 First value
         * @param v2 Second value
         */
        this.equality = strictEquality;
    }
    clone() {
        const cls = this.constructor;
        const clone = new cls();
        clone.name = this.name;
        clone.lazy = this.lazy;
        clone.level = this.level;
        clone.sync = this.sync;
        clone.calculation = this.calculation;
        clone.write = this.write;
        clone.calculationEtalon = this.calculationEtalon;
        clone.equality = this.equality;
        return clone;
    }
}
// export const defaultCalculationSync = (Y : EffectHandler<CalculationModeSync>) => {
//     // return Y(ProposedOrPrevious)
//
//     // return globalContext.activeQuark.owner.readProposeOrPrevious()
// }
const DefaultMetaSync = Meta.new({ name: 'DefaultMetaSync' });
const DefaultMetaBox = Meta.new({ name: 'DefaultMetaBox', level: AtomCalculationPriorityLevel.UserInput });

//---------------------------------------------------------------------------------------------------------------------
// Benchmarking has shown that there's no difference when using numbers
// v8 optimizes comparison of immutable strings to pointer comparison I guess
var AtomState;
(function (AtomState) {
    AtomState["Empty"] = "Empty";
    AtomState["UpToDate"] = "UpToDate";
    AtomState["PossiblyStale"] = "PossiblyStale";
    AtomState["Stale"] = "Stale";
    AtomState["CheckingDeps"] = "CheckingDeps";
    AtomState["Calculating"] = "Calculating";
})(AtomState || (AtomState = {}));
//---------------------------------------------------------------------------------------------------------------------
class Atom extends SerializableCustom.derive(Owner) {
    constructor() {
        super(...arguments);
        this.id = chronoReference();
        // same value for all branches
        this.identity = this;
        this.uniqable = MIN_SMI;
        this.uniqable2 = MIN_SMI;
        this.uniqable3 = MIN_SMI;
        this.uniqableBox = undefined;
        this.uniqableBox2 = undefined;
        this.userInputRevision = MIN_SMI;
        this.immutable = this.buildDefaultImmutable();
        // set to `false` to remove this atom from the graph, when it has no outgoing edges
        // (its value is not used in any other atoms)
        this.persistent = true;
        // this is a cache for a state of the new, "virtual" quark
        // such quark appears when we write new state to the frozen quark, like "possibly stale"
        // but, we don't want to create a new empty quark for "possibly stale" state -
        // because "possibly stale" might resolve to "up to date" and that would be a waste
        // of instantiation
        // instead we write a new state to this property and save some other additional information
        // (see properties below)
        // then reads/writes to `state` property tracks from where to get the state - either from cache
        // or from quark
        this.$state = undefined;
        this.stateIteration = undefined;
        this.stateQuark = undefined;
        this.graph = undefined;
        this.context = undefined;
        this.$commitValueOptimisticHook = undefined;
        //region meta
        this.name = undefined;
        this.level = AtomCalculationPriorityLevel.UserInput;
        this.lazy = true;
        this.sync = true;
        // TODO Atom should "implement Meta" and by default, should be `this.$meta = this`
        this.$meta = undefined;
        this.$equality = undefined;
    }
    get commitValueOptimisticHook() {
        if (this.$commitValueOptimisticHook !== undefined)
            return this.$commitValueOptimisticHook;
        return this.$commitValueOptimisticHook = new Hook();
    }
    initialize() {
        const boundGraph = this.boundGraph;
        if (boundGraph)
            boundGraph.addAtom(this);
    }
    get boundGraph() {
        return undefined;
    }
    get meta() {
        if (this.$meta !== undefined)
            return this.$meta;
        const cls = this.constructor;
        return this.$meta = cls.meta;
    }
    set meta(meta) {
        this.$meta = meta;
        this.lazy = meta.lazy;
        this.sync = meta.sync;
        this.level = meta.level;
    }
    get equality() {
        if (this.$equality !== undefined)
            return this.$equality;
        return this.meta.equality;
    }
    set equality(value) {
        this.$equality = value;
    }
    // get lazy () : boolean {
    //     if (this.$lazy !== undefined) return this.$lazy
    //
    //     return this.$lazy = this.meta.lazy
    // }
    // set lazy (value : boolean) {
    //     this.$lazy = value
    // }
    //endregion
    immutableForWrite() {
        if (this.immutable.frozen)
            this.setCurrent(this.immutable.createNext());
        return this.immutable;
    }
    buildDefaultImmutable() {
        return undefined;
    }
    enterGraph(graph) {
        // <debug>
        if (this.graph && this.graph !== graph)
            throw new Error("Atom can only belong to a single graph");
        // </debug>
        this.graph = graph;
    }
    leaveGraph(graph) {
        // <debug>
        if (this.graph !== graph)
            throw new Error("Atom not in graph");
        // </debug>
        this.doCleanup();
        this.graph = undefined;
    }
    setCurrent(immutable) {
        if (this.immutable && immutable && immutable.previous !== this.immutable)
            throw new Error("Invalid state thread");
        this.immutable = immutable;
        if (this.graph)
            this.graph.registerQuark(immutable);
    }
    clone() {
        const cls = this.constructor;
        const clone = new cls();
        clone.id = this.id;
        clone.identity = this.identity;
        clone.name = this.name;
        clone.$meta = this.$meta;
        clone.lazy = this.lazy;
        clone.sync = this.sync;
        // TODO the `$state` cache management for branches
        // might need additional tweaks or at least tests
        clone.$state = this.$state;
        clone.stateQuark = this.stateQuark;
        clone.stateIteration = this.stateIteration;
        return clone;
    }
    freeze() {
        this.immutable.freeze();
    }
    isCalculationStarted() {
        throw new Error("Abstract method");
    }
    isCalculationCompleted() {
        throw new Error("Abstract method");
    }
    startCalculation(onEffect) {
        throw new Error("Abstract method");
    }
    continueCalculation(value) {
        throw new Error("Abstract method");
    }
    shouldCheckDependencies() {
        throw new Error("Abstract method");
    }
    actualize() {
        throw new Error("Abstract method");
    }
    updateValue(value) {
        throw new Error("Abstract method");
    }
    resetCalculation(keepProposed) {
        throw new Error("Abstract method");
    }
    read(graph) {
        throw new Error("Abstract method");
    }
    // this breaks the `isNumber()` typeguard on Atom instance
    // [Symbol.toPrimitive] () : V {
    //     return this.read()
    // }
    async readAsync(graph) {
        return this.read();
    }
    get value() {
        return this.read();
    }
    get valueAsync() {
        return this.readAsync();
    }
    readProposedOrPrevious() {
        throw new Error("Abstract method");
    }
    readProposed() {
        throw new Error("Abstract method");
    }
    readProposedArgs() {
        throw new Error("Abstract method");
    }
    readPrevious() {
        throw new Error("Abstract method");
    }
    readConsistentOrProposedOrPrevious() {
        throw new Error("Abstract method");
    }
    materializeCachedStateIntoQuark() {
        const nextQuark = this.stateQuark.createNext();
        nextQuark.state = this.$state;
        nextQuark.freeze();
        const stateIteration = this.stateIteration.getMergedIntoRecursive() || this.stateIteration;
        stateIteration.forceAddQuark(nextQuark);
    }
    // TODO
    // it seems the trick with temporary storing of state on atom is actually making
    // the `shallow_changes` benchmark slower?? (the whole point of the trick was
    // to speed up that particular use case)
    // remove it then? removing makes some other benchmarks better
    // UPDATE: the `graphful/shallow_changes_gen` benchmark improves from 373ms to 247ms
    // with this optimization
    get state() {
        if (this.$state === undefined) {
            return this.immutable.state;
        }
        else {
            if (this.isNextOf(this.immutable)) {
                return this.$state;
            }
            // TODO do we need this line?
            if (this.stateIteration.frozen)
                this.materializeCachedStateIntoQuark();
            this.$state = undefined;
            this.stateIteration = undefined;
            this.stateQuark = undefined;
            return this.immutable.state;
        }
    }
    set state(state) {
        const immutable = this.immutable;
        // TODO (!!)
        // need a proper mechanism of ignoring the state shift from `Calculating` to `Stale`
        // if its a part of the same batch, caused by the calculation re-ordering
        // if (this.state == AtomState.Calculating && state === AtomState.Stale) return
        // TODO should be: immutable.frozen && "not a zero quark"
        // OR, remove the concept of zero quark, then: `immutable && immutable.frozen`
        if (immutable.frozen && immutable.previous && this.graph) {
            if (this.$state !== undefined) {
                if (this.isNextOf(immutable)) {
                    this.$state = state;
                    return;
                }
                else {
                    this.materializeCachedStateIntoQuark();
                }
            }
            this.$state = state;
            const transaction = this.graph.$immutable || this.graph.immutable;
            this.stateIteration = transaction.$immutable || transaction.immutable;
            this.stateQuark = immutable;
        }
        else {
            immutable.state = state;
            if (this.$state) {
                // probably should be here
                // if (this.stateIteration.frozen) this.materializeCachedStateIntoQuark()
                this.$state = undefined;
                this.stateIteration = undefined;
                this.stateQuark = undefined;
            }
        }
    }
    isNextOf(quark) {
        return !this.stateIteration.isRejected
            && (this.stateQuark === this.immutable || this.stateQuark === this.immutable.previous);
    }
    checkoutSelf() {
        // const activeAtom    = this.graph.activeAtom
        // const activeGraph   = activeAtom ? activeAtom.graph : undefined
        //
        // if (this.graph && activeGraph && activeGraph !== this.graph && activeGraph.identity === this.graph.identity && activeGraph.previous)
        //     return activeGraph.checkout(this)
        // else
        return this;
    }
    // TODO unify with `checkoutSelf`
    checkoutSelfFromActiveGraph(activeGraph) {
        if (this.graph && activeGraph !== this.graph && activeGraph.identity === this.graph.identity && activeGraph.previous)
            return activeGraph.checkout(this);
        else
            return this;
    }
    // should only be used in undo/redo context
    resetQuark(quark) {
        const newValue = quark.readRaw();
        const oldValue = this.immutable.readRaw();
        if (!this.equality(newValue, oldValue))
            this.propagateDeepStaleOutsideOfGraph(true);
        this.immutable = quark;
        this.userInputRevision = quark.revision;
        if (this.$commitValueOptimisticHook)
            this.$commitValueOptimisticHook.trigger(this, newValue, oldValue);
    }
    isValueVulnerableToChanges() {
        const state = this.state;
        return state === AtomState.UpToDate || state === AtomState.Calculating;
    }
    propagatePossiblyStale(includePast) {
        const toVisit = [this.immutable];
        while (toVisit.length) {
            const quark = toVisit.pop();
            const atom = quark.owner;
            if (atom.isValueVulnerableToChanges()) {
                atom.state = AtomState.PossiblyStale;
                atom.userInputRevision = this.userInputRevision;
                if (atom.graph && !atom.lazy) {
                    atom.graph.addPossiblyStaleStrictAtomToTransaction(atom);
                }
                quark.forEachOutgoing(includePast, (outgoing, atom) => {
                    if (atom.isValueVulnerableToChanges())
                        toVisit.push(atom.immutable);
                });
            }
        }
    }
    propagateDeepStaleOutsideOfGraph(includePast) {
        const toVisit1 = [];
        const graph = this.graph;
        this.immutable.forEachOutgoing(includePast, (outgoing, atom) => {
            if (atom.graph !== graph) {
                // only go deeper if state was UpToDate
                if (atom.isValueVulnerableToChanges())
                    toVisit1.push(atom.immutable);
                // but reset to stale anyway
                atom.state = AtomState.Stale;
                atom.userInputRevision = this.userInputRevision;
            }
        });
        // seems we should not clear outgoing in `propagateDeepStaleOutsideOfGraph`
        // it is only used in undo/redo, which means the quark will be always frozen,
        // so this condition is always false
        // if (!this.immutable.frozen) this.immutable.clearOutgoing()
        const toVisit2 = [];
        for (let i = 0; i < toVisit1.length; i++) {
            const quark = toVisit1[i];
            quark.forEachOutgoing(includePast, (outgoing, atom) => {
                if (atom.isValueVulnerableToChanges())
                    toVisit2.push(atom.immutable);
            });
        }
        while (toVisit2.length) {
            const quark = toVisit2.pop();
            const atom = quark.owner;
            if (atom.isValueVulnerableToChanges()) {
                atom.state = AtomState.PossiblyStale;
                atom.userInputRevision = this.userInputRevision;
                if (atom.graph && !atom.lazy) {
                    atom.graph.addPossiblyStaleStrictAtomToTransaction(atom);
                }
                quark.forEachOutgoing(includePast, (outgoing, atom) => {
                    if (atom.graph !== graph) {
                        if (atom.isValueVulnerableToChanges())
                            toVisit2.push(atom.immutable);
                    }
                });
            }
        }
    }
    // immediate outgoings should become stale, further outgoings - possibly stale
    propagateStaleDeep(includePast) {
        const toVisit1 = [];
        this.immutable.forEachOutgoing(includePast, (outgoing, atom) => {
            // only go deeper if state was UpToDate
            if (atom.isValueVulnerableToChanges()) {
                toVisit1.push(atom.immutable);
                if (atom.graph && !atom.lazy) {
                    atom.graph.addPossiblyStaleStrictAtomToTransaction(atom);
                }
            }
            // but reset to stale anyway
            atom.state = AtomState.Stale;
            atom.userInputRevision = this.userInputRevision;
        });
        if (!this.immutable.frozen)
            this.immutable.clearOutgoing();
        const toVisit2 = [];
        for (let i = 0; i < toVisit1.length; i++) {
            const quark = toVisit1[i];
            quark.forEachOutgoing(includePast, (outgoing, atom) => {
                if (atom.isValueVulnerableToChanges())
                    toVisit2.push(atom.immutable);
            });
        }
        while (toVisit2.length) {
            const quark = toVisit2.pop();
            const atom = quark.owner;
            if (atom.isValueVulnerableToChanges()) {
                atom.state = AtomState.PossiblyStale;
                atom.userInputRevision = this.userInputRevision;
                if (atom.graph && !atom.lazy) {
                    atom.graph.addPossiblyStaleStrictAtomToTransaction(atom);
                }
                quark.forEachOutgoing(includePast, (outgoing, atom) => {
                    if (atom.isValueVulnerableToChanges())
                        toVisit2.push(atom.immutable);
                });
            }
        }
    }
    propagateStaleShallow(includePast) {
        const userInputRevision = this.userInputRevision;
        this.immutable.forEachOutgoing(includePast, (quark, atom) => {
            const state = atom.state;
            if (atom.graph && !atom.lazy && state === AtomState.UpToDate) {
                atom.graph.addPossiblyStaleStrictAtomToTransaction(atom);
            }
            if (state !== AtomState.Calculating || atom.userInputRevision < userInputRevision) {
                atom.state = AtomState.Stale;
                atom.userInputRevision = userInputRevision;
            }
        });
        if (!this.immutable.frozen && !this.graph.activeAtom)
            this.immutable.clearOutgoing();
    }
    onCyclicReadDetected() {
        const cyclicReadException = this.getCyclicReadException();
        if (this.graph) {
            switch (this.graph.onComputationCycle) {
                case 'throw':
                    throw cyclicReadException;
                case 'reject':
                    this.graph.reject(cyclicReadException);
                    break;
            }
        }
        else
            throw cyclicReadException;
    }
    // go deep and detect if there's a cyclic read situation indeed,
    // or it is just blocked on awaiting the promise
    cyclicReadIsBlockedOnPromiseOrCheckDeps() {
        const uniqable = getUniqable();
        let atom = this;
        while (atom) {
            if (atom.uniqable2 === uniqable)
                return false;
            atom.uniqable2 = uniqable;
            if (!atom.iterationResult)
                return false;
            const iterationValue = atom.iterationResult.value;
            // encountered an atom, blocked on promise - possibly not a cycle, need to await the promise resolution
            if (iterationValue instanceof Promise)
                return true;
            // encountered an atom, in `CheckingDeps` or `Stale` state - possibly not a cycle, need to start calculation
            // of that atom
            if ((iterationValue instanceof Atom) && (iterationValue.state === AtomState.CheckingDeps || iterationValue.state === AtomState.Stale)) {
                iterationValue.state = AtomState.Stale;
                return true;
            }
            atom = iterationValue;
        }
    }
    getWalkDepthContext(cycleRef) {
        return WalkDepthC({
            collectNext(node, toVisit, visitInfo) {
                const incoming = node.immutable.getIncomingDeep();
                incoming && incoming.forEach((quark) => toVisit.push({ node: quark.owner, from: node, label: null }));
            },
            onCycle(node, stack) {
                cycleRef.cycle = ComputationCycle.new({ cycle: cycleInfo(stack) });
                return OnCycleAction.Cancel;
            }
        });
    }
    getCyclicReadException() {
        let cycleRef = { cycle: null };
        this.getWalkDepthContext(cycleRef).startFrom([this]);
        if (cycleRef.cycle) {
            const exception = new ComputationCycleError("Computation cycle:\n" + cycleRef.cycle);
            exception.cycle = cycleRef.cycle;
            return exception;
        }
        else {
            return undefined;
        }
    }
    doCleanup() {
    }
    onUnused() {
        if (!this.persistent && this.graph)
            this.graph.removeAtom(this);
    }
}
Atom.meta = DefaultMetaSync;

//---------------------------------------------------------------------------------------------------------------------
let revisionId = MIN_SMI;
const getNextRevision = () => ++revisionId;
//---------------------------------------------------------------------------------------------------------------------
let compactCounter = 500;
let compactAmount = 500; // 1000
//---------------------------------------------------------------------------------------------------------------------
class Node$1 {
    constructor() {
        this.uniqable = MIN_SMI;
        // initially no revision, revision is acquired with the value
        this.revision = MIN_SMI;
        this.$incoming = undefined;
        this.$incomingPast = undefined;
        this.$outgoing = undefined;
        this.$outgoingRev = undefined;
        this.$outgoingPast = undefined;
        this.$outgoingPastRev = undefined;
        // outgoingCompacted   : boolean       = false
        this.addCounter = 0;
        // TODO we can also just check the last element in the `$outgoing`, need to benchmark
        this.lastOutgoingTo = undefined;
        this.lastOutgoingToRev = MIN_SMI;
    }
    clearOutgoing() {
        // seems to be faster to just assign `undefined` instead of setting length to 0
        this.$outgoing = undefined;
        this.$outgoingRev = undefined;
        this.$outgoingPast = undefined;
        this.$outgoingPastRev = undefined;
        // this.outgoingCompacted  = false
        this.addCounter = 0;
        this.lastOutgoingTo = undefined;
        this.lastOutgoingToRev = MIN_SMI;
    }
    compactOutgoing(startFrom) {
    }
    addOutgoing(to, isFromPast) {
        const toRevision = to.revision;
        if (isFromPast) {
            const outgoingPast = this.$outgoingPast;
            if (outgoingPast && outgoingPast[outgoingPast.length - 1] === to
                && this.$outgoingPastRev[outgoingPast.length - 1] === toRevision) {
                return;
            }
        }
        else {
            if (this.lastOutgoingTo === to && this.lastOutgoingToRev === toRevision)
                return;
            this.lastOutgoingTo = to;
            this.lastOutgoingToRev = toRevision;
        }
        // this.outgoingCompacted  = false
        if (isFromPast) {
            if (this.$outgoingPast === undefined) {
                this.$outgoingPast = [];
                this.$outgoingPastRev = [];
            }
            this.$outgoingPast.push(to);
            this.$outgoingPastRev.push(toRevision);
            if (to.$incomingPast === undefined)
                to.$incomingPast = [];
            to.$incomingPast.push(this);
        }
        else {
            if (this.$outgoing === undefined) {
                this.$outgoing = [];
                this.$outgoingRev = [];
            }
            // TODO: figure out if these magick numbers
            // can be tweaked, perhaps dynamically
            // like - measure the length before/after compact
            // adjust magick number based on results
            this.addCounter = (this.addCounter + 1) % compactCounter;
            if (this.addCounter === 0) {
                // idea is - we compact what've added (500),
                // plus some more?? (500)
                // TODO perform a full compact once every X compacts?
                // TODO need to distinct the outgoings of the different "virtual" iterations
                // (the iterations that are immediately compacted - they correspond to the `revision`
                // and perform full compact every X iterations
                // this.compactOutgoing(0)
                this.compactOutgoing(this.$outgoing.length - compactAmount);
            }
            this.$outgoing.push(to);
            this.$outgoingRev.push(toRevision);
            if (to.$incoming === undefined)
                to.$incoming = [];
            to.$incoming.push(this);
        }
    }
}

//---------------------------------------------------------------------------------------------------------------------
async function runGeneratorAsyncWithEffect(onEffect, func, args, scope) {
    const gen = func.apply(scope, args);
    let iteration = gen.next();
    while (!iteration.done) {
        const effect = onEffect(iteration.value);
        if (effect instanceof Promise)
            iteration = gen.next(await effect);
        else
            iteration = gen.next(effect);
    }
    return iteration.value;
}
//---------------------------------------------------------------------------------------------------------------------
function runGeneratorSyncWithEffect(onEffect, func, args, scope) {
    const gen = func.apply(scope, args);
    let iteration = gen.next();
    while (!iteration.done) {
        const effect = iteration.value;
        iteration = gen.next(onEffect(effect));
    }
    return iteration.value;
}
//---------------------------------------------------------------------------------------------------------------------
/**
 * The base class for effect. Effect is some value, that can be send to the "outer" calculation context, using the
 * effect handler function. Effect handler then will process an effect and return some resulting value.
 *
 * ```ts
 * const identifier  = graph.identifier((Y : SyncEffectHandler) : number => {
 *     const proposedValue : number    = Y(ProposedOrPrevious)
 *
 *     const maxValue : number         = Y(max)
 *
 *     return proposedValue <= maxValue ? proposedValue : maxValue
 * })
 * ```
 */
class Effect extends Base {
    constructor() {
        super(...arguments);
        this.handler = undefined;
    }
}
__decorate([
    prototypeValue(true)
], Effect.prototype, "sync", void 0);
__decorate([
    prototypeValue(true)
], Effect.prototype, "internal", void 0);
//---------------------------------------------------------------------------------------------------------------------
const ProposedOrPreviousSymbol = Symbol('ProposedOrPreviousSymbol');
/**
 * The constant that represents a request for either user input (proposed value) or previous value of the
 * identifier, currently being calculated.
 *
 * Important note, is that if an identifier yields a `ProposedOrPrevious` effect and its computed value does not match the value of this effect,
 * it will be re-calculated (computation function called) again on the next read. This is because the value of its `ProposedOrPrevious` input changes.
 *
 * ```ts
 * const graph4 = ChronoGraph.new()
 *
 * const max           = graph4.variable(100)
 *
 * const identifier15  = graph4.identifier((Y) : number => {
 *     const proposedValue : number    = Y(ProposedOrPrevious)
 *
 *     const maxValue : number         = Y(max)
 *
 *     return proposedValue <= maxValue ? proposedValue : maxValue
 * })
 *
 * graph4.write(identifier15, 18)
 *
 * const value15_1 = graph4.read(identifier15) // 18
 *
 * graph4.write(identifier15, 180)
 *
 * const value15_2 = graph4.read(identifier15) // 100
 *
 * graph4.write(max, 50)
 *
 * const value15_3 = graph4.read(identifier15) // 50
 * ```
 */
Effect.new({ handler: ProposedOrPreviousSymbol });
//---------------------------------------------------------------------------------------------------------------------
const RejectSymbol = Symbol('RejectSymbol');
/**
 * Class for [[Reject]] effect.
 */
class RejectEffect extends Effect {
    constructor() {
        super(...arguments);
        this.handler = RejectSymbol;
    }
}
//---------------------------------------------------------------------------------------------------------------------
const PreviousValueOfSymbol = Symbol('PreviousValueOfSymbol');
//---------------------------------------------------------------------------------------------------------------------
const ProposedValueOfSymbol = Symbol('ProposedValueOfSymbol');
//---------------------------------------------------------------------------------------------------------------------
const HasProposedValueSymbol = Symbol('HasProposedValueSymbol');
//---------------------------------------------------------------------------------------------------------------------
const ProposedOrPreviousValueOfSymbol = Symbol('ProposedOrPreviousValueOfSymbol');
//---------------------------------------------------------------------------------------------------------------------
const ProposedArgumentsOfSymbol = Symbol('ProposedArgumentsOfSymbol');

//---------------------------------------------------------------------------------------------------------------------
// The `Gen` and `Sync` files are separated intentionally, to be able to get
// their diff and synchronize changes if needed
//---------------------------------------------------------------------------------------------------------------------
const calculateLowerStackLevelsSync = function (onEffect, stack, transaction, atom) {
    const uniqable = getUniqable();
    while (stack.lowestLevelIndex < atom.level) {
        const levelIndex = stack.lowestLevelIndex;
        calculateAtomsQueueLevelSync(onEffect, uniqable, stack, transaction, stack.levels[levelIndex], levelIndex, false);
        stack.refreshLowestLevel();
    }
};
//---------------------------------------------------------------------------------------------------------------------
const calculateAtomsQueueSync = function (onEffect, stack, transaction, levelOverride, levelOverrideIndex = -1) {
    // globalContext.enterBatch()
    const uniqable = getUniqable();
    while (!transaction || !transaction.rejectedWith) {
        const levelIndex = stack.lowestLevelIndex;
        if (levelOverrideIndex !== -1) {
            if (levelIndex < levelOverrideIndex) {
                calculateAtomsQueueLevelSync(onEffect, uniqable, stack, transaction, stack.levels[levelIndex], levelIndex, false);
                stack.refreshLowestLevel();
            }
            else if (levelIndex >= levelOverrideIndex) {
                calculateAtomsQueueLevelSync(onEffect, uniqable, stack, transaction, levelOverride, levelOverrideIndex, true);
                stack.refreshLowestLevel();
                if (levelOverride.length === 0)
                    break;
            }
        }
        else {
            calculateAtomsQueueLevelSync(onEffect, uniqable, stack, transaction, stack.levels[levelIndex], levelIndex, false);
            stack.refreshLowestLevel();
            if (stack.size === 0)
                break;
        }
    }
    // globalContext.leaveBatch()
};
const calculateAtomsQueueLevelSync = function (onEffect, uniqable, stack, transaction, level, levelIndex, isOverride) {
    const graph = transaction.graph;
    graph.enterBatch();
    let prevActiveAtom = graph.activeAtom;
    const startedAtLowestLevelIndex = stack.lowestLevelIndex;
    const modifyStack = !isOverride;
    transaction ? transaction.graph.enableProgressNotifications : false;
    while (level.length && stack.lowestLevelIndex === startedAtLowestLevelIndex && (!transaction || !transaction.rejectedWith)) {
        const atom = level[level.length - 1];
        const state = atom.state;
        if (state === AtomState.CheckingDeps) {
            atom.state = AtomState.UpToDate;
            level.pop();
            modifyStack && stack.size--;
            continue;
        }
        if (state === AtomState.UpToDate || atom.immutable.isTombstone || !atom.graph) {
            level.pop();
            modifyStack && stack.size--;
            continue;
        }
        if (state !== AtomState.Calculating && atom.shouldCheckDependencies()) {
            atom.state = AtomState.CheckingDeps;
            const incoming = atom.immutable.getIncomingDeep();
            if (incoming) {
                for (let i = 0; i < incoming.length; i++) {
                    const dependencyAtom = atom.graph.resolve(incoming[i].owner);
                    if (dependencyAtom.state !== AtomState.UpToDate) {
                        if (dependencyAtom.state === AtomState.CheckingDeps) {
                            dependencyAtom.state = AtomState.Stale;
                        }
                        // TODO should take level into account
                        level.push(dependencyAtom);
                        modifyStack && stack.size++;
                    }
                }
                // this looks a bit strange but it is exactly what we want:
                // 1. If there were none non-up-to-date deps - means the atom should be considered
                // up-to-date, and next cycle iteration will do that (switching from `CheckingDeps` to `UpToDate`)
                // 2. If there were some non-up-to-date deps - we continue to next iteration to actualize them
                continue;
            }
        }
        graph.activeAtom = atom;
        let iterationResult = atom.isCalculationStarted() ? atom.iterationResult : atom.startCalculation(onEffect);
        while (iterationResult) {
            const value = iterationResult.value;
            if (iterationResult.done) {
                // there have been write to atom or its dependency
                if (atom.state !== AtomState.Calculating) {
                    // start over w/o stack modification
                    atom.resetCalculation(true);
                    break;
                }
                atom.updateValue(value);
                level.pop();
                modifyStack && stack.size--;
                break;
            }
            else if (value instanceof Atom) {
                const requestedAtom = atom.graph ? value.checkoutSelfFromActiveGraph(atom.graph) : value;
                const requestedLevel = requestedAtom.level;
                if (requestedLevel > atom.level)
                    throw new Error("Atom can not read from the higher-level atom");
                if (requestedAtom.state === AtomState.UpToDate) {
                    iterationResult = atom.continueCalculation(requestedAtom.read(graph));
                }
                else {
                    requestedAtom.immutableForWrite().addOutgoing(atom.immutable, false);
                    // the requested atom is still checking dependencies - that probably means it has been requested
                    // by its dependency itself. Might be a cycle, or, perhaps, the graph layout has changed
                    // in any case, we just force the requested atom to start the calculation in the next loop iteration
                    if (requestedAtom.state === AtomState.CheckingDeps) {
                        requestedAtom.state = AtomState.Stale;
                    }
                    if (requestedAtom.isCalculationStarted() && !requestedAtom.cyclicReadIsBlockedOnPromiseOrCheckDeps()) {
                        requestedAtom.onCyclicReadDetected();
                        if (transaction && transaction.rejectedWith)
                            break;
                    }
                    else {
                        // requestedAtom.uniqable2 = uniqable
                        if (requestedLevel === levelIndex) {
                            level.push(requestedAtom);
                            modifyStack && stack.size++;
                        }
                        else {
                            stack.in(requestedAtom);
                        }
                        break;
                    }
                }
            }
            else if ((value instanceof Effect) && value.internal) {
                const resolution = onEffect(value);
                if (transaction.rejectedWith)
                    break;
                iterationResult = atom.continueCalculation(resolution);
            }
            else {
                const startedYieldAt = atom.iterationNumber;
                graph.activeAtom = prevActiveAtom;
                graph.leaveBatch();
                // bypass the unrecognized effect to the outer context
                const res = onEffect(value);
                graph.enterBatch();
                prevActiveAtom = graph.activeAtom;
                // TODO
                // possibly `iterationNumber` should be a global revision tracking counter
                // we increment it for any action, including calculation reset
                // then, this condition would mean "yes, we've yielded an effect
                // and the state of atom did not change during handler processing"
                // currently this equality does not take into account the possibility
                // that `startedYieldAt` is a value from previous calculation
                // UPDATE: should just use `revision` I guess
                // TODO: needs a test case
                if (atom.iterationNumber === startedYieldAt) {
                    graph.activeAtom = atom;
                    iterationResult = atom.continueCalculation(res);
                }
                else {
                    // in such case we need to start over from the main loop
                    break;
                }
            }
        }
    }
    graph.activeAtom = prevActiveAtom;
    graph.leaveBatch();
};

// Leveled LIFO queue
class LeveledQueue {
    constructor() {
        this.size = 0;
        this.levels = [];
        this.lowestLevel = undefined;
        this.lowestLevelIndex = MAX_SMI;
    }
    refreshLowestLevel() {
        for (let i = this.lowestLevelIndex !== MAX_SMI ? this.lowestLevelIndex : 0; i < this.levels.length; i++) {
            const level = this.levels[i];
            if (level && level.length) {
                this.lowestLevelIndex = i;
                this.lowestLevel = level;
                return;
            }
        }
        this.lowestLevelIndex = MAX_SMI;
        this.lowestLevel = undefined;
    }
    outCandidate() {
        const lowestLevel = this.lowestLevel;
        if (lowestLevel) {
            if (lowestLevel.length) {
                return lowestLevel[lowestLevel.length - 1];
            }
            this.refreshLowestLevel();
            return this.outCandidate();
        }
        else {
            return undefined;
        }
    }
    out() {
        const lowestLevel = this.lowestLevel;
        if (lowestLevel) {
            if (lowestLevel.length) {
                this.size--;
                return lowestLevel.pop();
            }
            this.refreshLowestLevel();
            return this.out();
        }
        else {
            return undefined;
        }
    }
    in(el) {
        this.size++;
        const elLevel = el.level;
        if (elLevel === this.lowestLevelIndex) {
            this.lowestLevel.push(el);
        }
        else {
            let level = this.levels[elLevel];
            if (!level) {
                // avoid holes in the array
                for (let i = this.levels.length; i < elLevel; i++)
                    this.levels[i] = null;
                level = this.levels[elLevel] = [];
            }
            level.push(el);
            if (elLevel < this.lowestLevelIndex) {
                this.lowestLevelIndex = elLevel;
                this.lowestLevel = level;
            }
        }
    }
    *[Symbol.iterator]() {
        for (let i = 0; i < this.levels.length; i++) {
            const level = this.levels[i];
            if (level)
                yield* level;
        }
    }
    clear() {
        this.size = 0;
        this.levels = [];
        this.lowestLevel = undefined;
        this.lowestLevelIndex = MAX_SMI;
    }
}

//---------------------------------------------------------------------------------------------------------------------
const calculateAtomsQueueGen = function* (onEffect, stack, transaction, levelOverride, levelOverrideIndex = -1) {
    // globalContext.enterBatch()
    const uniqable = getUniqable();
    while (!transaction || !transaction.rejectedWith) {
        const levelIndex = stack.lowestLevelIndex;
        if (levelOverrideIndex !== -1) {
            if (levelIndex < levelOverrideIndex) {
                yield* calculateAtomsQueueLevelGen(onEffect, uniqable, stack, transaction, stack.levels[levelIndex], levelIndex, false);
                stack.refreshLowestLevel();
            }
            else if (levelIndex >= levelOverrideIndex) {
                yield* calculateAtomsQueueLevelGen(onEffect, uniqable, stack, transaction, levelOverride, levelOverrideIndex, true);
                stack.refreshLowestLevel();
                if (levelOverride.length === 0)
                    break;
            }
        }
        else {
            yield* calculateAtomsQueueLevelGen(onEffect, uniqable, stack, transaction, stack.levels[levelIndex], levelIndex, false);
            stack.refreshLowestLevel();
            if (stack.size === 0)
                break;
        }
    }
    // globalContext.leaveBatch()
};
const calculateAtomsQueueLevelGen = function* (onEffect, uniqable, stack, transaction, level, levelIndex, isOverride) {
    const graph = transaction.graph;
    graph.enterBatch();
    let prevActiveAtom = graph.activeAtom;
    const startedAtLowestLevelIndex = stack.lowestLevelIndex;
    const modifyStack = !isOverride;
    const enableProgressNotifications = transaction ? transaction.graph.enableProgressNotifications : false;
    let counter = 0;
    while (level.length && stack.lowestLevelIndex === startedAtLowestLevelIndex && (!transaction || !transaction.rejectedWith)) {
        if (enableProgressNotifications && !(counter++ % transaction.emitProgressNotificationsEveryCalculations)) {
            const now = Date.now();
            const elapsed = now - transaction.propagationStartDate;
            if (elapsed > transaction.startProgressNotificationsAfterMs) {
                const lastProgressNotificationDate = transaction.lastProgressNotificationDate;
                if (!lastProgressNotificationDate || (now - lastProgressNotificationDate) > transaction.emitProgressNotificationsEveryMs) {
                    transaction.lastProgressNotificationDate = now;
                    transaction.graph.onPropagationProgressNotification({
                        total: transaction.plannedTotalIdentifiersToCalculate,
                        remaining: stack.size,
                        phase: 'propagating'
                    });
                    yield delay(0);
                }
            }
        }
        const atom = level[level.length - 1];
        const state = atom.state;
        if (state === AtomState.CheckingDeps) {
            atom.state = AtomState.UpToDate;
            level.pop();
            modifyStack && stack.size--;
            continue;
        }
        if (state === AtomState.UpToDate || atom.immutable.isTombstone || !atom.graph) {
            level.pop();
            modifyStack && stack.size--;
            continue;
        }
        if (state !== AtomState.Calculating && atom.shouldCheckDependencies()) {
            atom.state = AtomState.CheckingDeps;
            const incoming = atom.immutable.getIncomingDeep();
            if (incoming) {
                for (let i = 0; i < incoming.length; i++) {
                    const dependencyAtom = atom.graph.resolve(incoming[i].owner);
                    if (dependencyAtom.state !== AtomState.UpToDate) {
                        if (dependencyAtom.state === AtomState.CheckingDeps) {
                            dependencyAtom.state = AtomState.Stale;
                        }
                        // TODO should take level into account
                        level.push(dependencyAtom);
                        modifyStack && stack.size++;
                    }
                }
                // this looks a bit strange but it is exactly what we want:
                // 1. If there were none non-up-to-date deps - means the atom should be considered
                // up-to-date, and next cycle iteration will do that (switching from `CheckingDeps` to `UpToDate`)
                // 2. If there were some non-up-to-date deps - we continue to next iteration to actualize them
                continue;
            }
        }
        graph.activeAtom = atom;
        let iterationResult = atom.isCalculationStarted() ? atom.iterationResult : atom.startCalculation(onEffect);
        while (iterationResult) {
            const value = iterationResult.value;
            if (iterationResult.done) {
                // there have been write to atom or its dependency
                if (atom.state !== AtomState.Calculating) {
                    // start over w/o stack modification
                    atom.resetCalculation(true);
                    break;
                }
                atom.updateValue(value);
                level.pop();
                modifyStack && stack.size--;
                break;
            }
            else if (value instanceof Atom) {
                const requestedAtom = atom.graph ? value.checkoutSelfFromActiveGraph(atom.graph) : value;
                const requestedLevel = requestedAtom.level;
                if (requestedLevel > atom.level)
                    throw new Error("Atom can not read from the higher-level atom");
                if (requestedAtom.state === AtomState.UpToDate) {
                    iterationResult = atom.continueCalculation(requestedAtom.read(graph));
                }
                else {
                    requestedAtom.immutableForWrite().addOutgoing(atom.immutable, false);
                    // the requested atom is still checking dependencies - that probably means it has been requested
                    // by its dependency itself. Might be a cycle, or, perhaps, the graph layout has changed
                    // in any case, we just force the requested atom to start the calculation in the next loop iteration
                    if (requestedAtom.state === AtomState.CheckingDeps) {
                        requestedAtom.state = AtomState.Stale;
                    }
                    if (requestedAtom.isCalculationStarted() && !requestedAtom.cyclicReadIsBlockedOnPromiseOrCheckDeps()) {
                        requestedAtom.onCyclicReadDetected();
                        if (transaction && transaction.rejectedWith)
                            break;
                    }
                    else {
                        // requestedAtom.uniqable2 = uniqable
                        if (requestedLevel === levelIndex) {
                            level.push(requestedAtom);
                            modifyStack && stack.size++;
                        }
                        else {
                            stack.in(requestedAtom);
                        }
                        break;
                    }
                }
            }
            else if ((value instanceof Effect) && value.internal) {
                const resolution = onEffect(value);
                if (transaction.rejectedWith)
                    break;
                iterationResult = atom.continueCalculation(resolution);
            }
            else {
                const startedYieldAt = atom.iterationNumber;
                graph.activeAtom = prevActiveAtom;
                graph.leaveBatch();
                // bypass the unrecognized effect to the outer context
                const res = yield value;
                graph.enterBatch();
                prevActiveAtom = graph.activeAtom;
                // TODO
                // possibly `iterationNumber` should be a global revision tracking counter
                // we increment it for any action, including calculation reset
                // then, this condition would mean "yes, we've yielded an effect
                // and the state of atom did not change during handler processing"
                // currently this equality does not take into account the possibility
                // that `startedYieldAt` is a value from previous calculation
                // UPDATE: should just use `revision` I guess
                // TODO: needs a test case
                if (atom.iterationNumber === startedYieldAt) {
                    graph.activeAtom = atom;
                    iterationResult = atom.continueCalculation(res);
                }
                else {
                    // in such case we need to start over from the main loop
                    break;
                }
            }
        }
    }
    graph.activeAtom = prevActiveAtom;
    graph.leaveBatch();
};

class Quark extends SerializableCustom.derive(Node$1) {
    constructor() {
        super(...arguments);
        this.owner = undefined;
        this.previous = undefined;
        this.frozen = false;
        this.value = undefined;
        this.usedProposedOrPrevious = false;
        this.proposedValue = undefined;
        this.proposedArgs = undefined;
        // if the newly calculated value is the same as previous - this property is
        // not updated, otherwise it is set to `revision`
        // this allows us to track the series of the same-value quarks, which does
        // not propagate staleness
        this.valueRevision = MIN_SMI;
        this.batchRevision = MIN_SMI;
        this.iteration = undefined;
        this.state = AtomState.Empty;
        this.isTombstone = false;
    }
    hasValue() {
        return this.readRaw() !== undefined;
    }
    hasOwnValue() {
        return this.value !== undefined;
    }
    hasProposedValue() {
        return this.proposedValue !== undefined;
    }
    read() {
        let box = this;
        while (box) {
            if (box.value !== undefined)
                return box.value;
            box = box.previous;
        }
        return null;
    }
    // TODO - only difference from `read` is "default" returning value
    readRaw() {
        let box = this;
        while (box) {
            if (box.value !== undefined)
                return box.value;
            box = box.previous;
        }
        return undefined;
    }
    get level() {
        return this.owner.level;
    }
    freeze() {
        this.frozen = true;
    }
    createNext(owner) {
        this.freeze();
        const self = this.constructor;
        const next = new self();
        next.previous = this;
        next.owner = owner || this.owner;
        next.revision = this.revision;
        next.valueRevision = this.valueRevision;
        next.state = this.state;
        // need to thread the `usedProposedOrPrevious` further for the `shouldCheckDependencies` method
        // to work correctly
        next.usedProposedOrPrevious = this.usedProposedOrPrevious;
        // TODO should possibly empty the cached atom's `$state` here
        return next;
    }
    isShadow() {
        return this.value === undefined;
    }
    getIncomingDeep() {
        let box = this;
        while (box) {
            // as an edge case, atom may compute its value w/o external dependencies all of the sudden
            // in such case `$incoming` will be empty
            if (box.$incoming !== undefined || box.value !== undefined)
                return box.$incoming;
            box = box.previous;
        }
        return undefined;
    }
    getIncomingPastDeep() {
        let box = this;
        while (box) {
            // as an edge case, atom may compute its value w/o external dependencies all of the sudden
            // in such case `$incoming` will be empty
            if (box.$incomingPast !== undefined || box.value !== undefined)
                return box.$incomingPast;
            box = box.previous;
        }
        return undefined;
    }
    // IMPORTANT LIMITATION : can not nest calls to `forEachOutgoing` (call `forEachOutgoing` in the `func` argument)
    // this messes up internal "uniqables" state
    forEachOutgoing(includePast, func) {
        const uniqable = getUniqable();
        const graph = this.owner.graph;
        let quark = this;
        do {
            this.forEachOutgoingInternal(graph, uniqable, quark.$outgoing, quark.$outgoingRev, func);
            if (includePast) {
                this.forEachOutgoingInternal(graph, uniqable, quark.$outgoingPast, quark.$outgoingPastRev, func);
            }
            if (quark.value !== undefined && quark.revision === quark.valueRevision)
                break;
            quark = quark.previous;
        } while (quark);
    }
    forEachOutgoingInternal(graph, uniqable, outgoing, outgoingRev, func) {
        if (outgoing) {
            for (let i = outgoing.length - 1; i >= 0; i--) {
                const outgoingQuark = outgoing[i];
                const outgoingOwner = outgoingQuark.owner;
                const identity = outgoingOwner.identity;
                if (identity.uniqable !== uniqable) {
                    identity.uniqable = uniqable;
                    const outgoingAtom = !graph || !graph.previous || !outgoingOwner.graph || outgoingOwner.graph === graph ? outgoingOwner : graph.checkout(outgoingOwner);
                    if (outgoingAtom.immutable.revision === outgoingRev[i])
                        func(outgoingQuark, outgoingAtom);
                }
            }
        }
    }
    compactOutgoing(startFrom) {
        this.compactOutgoingInternal(startFrom, this.$outgoing, this.$outgoingRev);
        this.compactOutgoingInternal(startFrom, this.$outgoingPast, this.$outgoingPastRev);
    }
    compactOutgoingInternal(startFrom, outgoing, outgoingRev) {
        if (startFrom < 0)
            startFrom = 0;
        const uniqable = getUniqable();
        const uniqable2 = getUniqable();
        if (outgoing) {
            const graph = this.owner.graph;
            for (let i = outgoing.length - 1; i >= startFrom; i--) {
                const outgoingRevision = outgoingRev[i];
                const outgoingQuark = outgoing[i];
                const outgoingHistory = outgoingQuark.owner;
                const identity = outgoingHistory.identity;
                const delta = uniqable2 - identity.uniqable;
                if (delta > 1) {
                    const outgoingOwner = !outgoingHistory.graph || outgoingHistory.graph === graph ? outgoingHistory : graph.checkout(outgoingHistory);
                    if (outgoingOwner.immutable.revision === outgoingRevision) {
                        identity.uniqable = uniqable2;
                        identity.uniqableBox = outgoingOwner;
                    }
                    else
                        identity.uniqable = uniqable;
                }
            }
            let uniquePos = startFrom;
            for (let i = uniquePos; i < outgoing.length; i++) {
                const outgoingQuark = outgoing[i];
                const outgoingHistory = outgoingQuark.owner;
                const identity = outgoingHistory.identity;
                if (identity.uniqable === uniqable2) {
                    identity.uniqable = uniqable;
                    outgoing[uniquePos] = identity.uniqableBox.immutable;
                    outgoingRev[uniquePos] = identity.uniqableBox.immutable.revision;
                    uniquePos++;
                }
            }
            if (outgoing.length !== uniquePos) {
                outgoing.length = uniquePos;
                outgoingRev.length = uniquePos;
            }
        }
    }
    // magic dependency on `this.owner.identity.uniqableBox`
    collectGarbage() {
        const zero = this.constructor.getZero();
        const uniqable = getUniqable();
        const collapsedOutgoing = [];
        const collapsedOutgoingRev = [];
        let collapsedOutgoingPast = undefined;
        let collapsedOutgoingPastRev = undefined;
        let valueConsumed = false;
        let incomingsConsumed = false;
        let outgoingsConsumed = false;
        let incomingsPastConsumed = false;
        let outgoingsPastConsumed = false;
        let quark = this;
        do {
            // capture early, since we reset the `previous` on value consumption
            const previous = quark.previous;
            if (!incomingsConsumed && quark.$incoming !== undefined) {
                incomingsConsumed = true;
                // TODO make a config option? see a comment for `this.$outgoing` below
                // this.$incoming      = quark.$incoming
                this.$incoming = quark.$incoming.slice();
                // this.$incoming      = copyArray(quark.$incoming)
            }
            if (!incomingsPastConsumed && quark.$incomingPast !== undefined) {
                incomingsPastConsumed = true;
                // TODO make a config option? see a comment for `this.$outgoing` below
                // this.$incomingPast      = quark.$incomingPast
                this.$incomingPast = quark.$incomingPast.slice();
                // this.$incoming      = copyArray(quark.$incoming)
            }
            if (!outgoingsConsumed) {
                const outgoing = quark.$outgoing;
                const outgoingRev = quark.$outgoingRev;
                if (outgoing) {
                    for (let i = outgoing.length - 1; i >= 0; i--) {
                        const outgoingRevision = outgoingRev[i];
                        const outgoingQuark = outgoing[i];
                        const identity = outgoingQuark.owner.identity;
                        // should use `uniqable2` here (or may be even `uniqable3`) because `uniqable`
                        // at this point is already being used by `forEveryFirstQuarkTill` in the `graph.sweep()`
                        if (identity.uniqable2 !== uniqable) {
                            identity.uniqable2 = uniqable;
                            // TODO requires extra attention
                            // remove this if the "shallow state" optimization for Atom will be removed
                            // `identity.uniqableBox === undefined` means that outgoing edge is actually going to the quark in the "shredding"
                            // iteration - thats why it is not set up in the `graph.sweep()`
                            // we do want to keep such edges, reproducible in `graph_garbage_collection.t.js`
                            if (!identity.uniqableBox || outgoingRevision === identity.uniqableBox.revision) {
                                identity.uniqableBox = undefined;
                                collapsedOutgoing.push(outgoingQuark);
                                collapsedOutgoingRev.push(outgoingRevision);
                            }
                        }
                    }
                }
            }
            if (!outgoingsPastConsumed) {
                const outgoingPast = quark.$outgoingPast;
                const outgoingPastRev = quark.$outgoingPastRev;
                if (outgoingPast) {
                    for (let i = outgoingPast.length - 1; i >= 0; i--) {
                        const outgoingPastRevision = outgoingPastRev[i];
                        const outgoingPastQuark = outgoingPast[i];
                        const identity = outgoingPastQuark.owner.identity;
                        // should use `uniqable2` here (or may be even `uniqable3`) because `uniqable`
                        // at this point is already being used by `forEveryFirstQuarkTill` in the `graph.sweep()`
                        if (identity.uniqable3 !== uniqable) {
                            identity.uniqable3 = uniqable;
                            // TODO requires extra attention
                            // remove this if the "shallow state" optimization for Atom will be removed
                            // `identity.uniqableBox === undefined` means that outgoingPast edge is actually going to the quark in the "shredding"
                            // iteration - thats why it is not set up in the `graph.sweep()`
                            // we do want to keep such edges, reproducible in `graph_garbage_collection.t.js`
                            if (!identity.uniqableBox || outgoingPastRevision === identity.uniqableBox.revision) {
                                identity.uniqableBox = undefined;
                                if (collapsedOutgoingPast === undefined) {
                                    collapsedOutgoingPast = [];
                                    collapsedOutgoingPastRev = [];
                                }
                                collapsedOutgoingPast.push(outgoingPastQuark);
                                collapsedOutgoingPastRev.push(outgoingPastRevision);
                            }
                        }
                    }
                }
            }
            if (quark.value !== undefined && quark.revision === quark.valueRevision) {
                outgoingsConsumed = true;
                outgoingsPastConsumed = true;
                // TODO make a config option?
                // the trick with `slice / [ ... ] / copyArray` creates a new array with the exact size for its elements
                // it seems, normally, arrays allocates a little more memory, avoiding allocation on every "push"
                // the difference might be, like: for array of 20 elements, exact size is 80 bytes,
                // extra size - 180 bytes! for many small arrays (exactly the chrono case) total difference might be
                // significant: for 100k boxes with 4 backward deps each - from 69.7MB to 54.1MB
                // there is a small performance penalty: from 435ms to 455ms (`benchmarks/chrono2/graphful/commit_gen`)
                // it seems Array.from() is slower than manual `copyArray`... because of iterators protocol?
                // this.$outgoing      = collapsedOutgoing
                // this.$outgoingRev   = collapsedOutgoingRev
                this.$outgoing = collapsedOutgoing.slice();
                this.$outgoingRev = collapsedOutgoingRev.slice();
                if (collapsedOutgoingPast) {
                    this.$outgoingPast = collapsedOutgoingPast.slice();
                    this.$outgoingPastRev = collapsedOutgoingPastRev.slice();
                }
                // this.$outgoing      = copyArray(collapsedOutgoing)
                // this.$outgoingRev   = copyArray(collapsedOutgoingRev)
            }
            // consume the top-most value, even if its the `sameValue`
            // reasoning is that even that `equality` check has passed
            // user may have some side effects that expects the value
            // to always be the result of latest `calculation` call
            if (!valueConsumed && quark.value !== undefined) {
                valueConsumed = true;
                if (quark !== this)
                    this.copyValueFrom(quark);
                this.previous = zero;
                this.valueRevision = this.revision;
            }
            if (quark !== this)
                quark.destroy();
            quark = previous;
        } while (quark);
        if (!this.$outgoing || this.$outgoing.length === 0)
            this.owner.onUnused();
    }
    // collectGarbageInternal (uniqable : number, collapsed) {
    //     const zero                  = (this.constructor as AnyConstructor<this, typeof Quark>).getZero()
    //
    //     const collapsedOutgoing     = []
    //     const collapsedOutgoingRev  = []
    //
    //     let collapsedOutgoingPast       = undefined
    //     let collapsedOutgoingPastRev    = undefined
    //
    //     let valueConsumed : boolean         = false
    //     let incomingsConsumed : boolean     = false
    //     let outgoingsConsumed : boolean     = false
    //     let incomingsPastConsumed : boolean     = false
    //     let outgoingsPastConsumed : boolean     = false
    //
    //     let quark : this            = this
    //
    //     do {
    //         // capture early, since we reset the `previous` on value consumption
    //         const previous          = quark.previous
    //
    //         if (!incomingsConsumed && quark.$incoming !== undefined) {
    //             incomingsConsumed   = true
    //
    //             // TODO make a config option? see a comment for `this.$outgoing` below
    //             this.$incoming      = quark.$incoming
    //             // this.$incoming      = quark.$incoming.slice()
    //             // this.$incoming      = copyArray(quark.$incoming)
    //         }
    //
    //         if (!incomingsPastConsumed && quark.$incomingPast !== undefined) {
    //             incomingsPastConsumed   = true
    //
    //             // TODO make a config option? see a comment for `this.$outgoing` below
    //             this.$incomingPast      = quark.$incomingPast
    //             // this.$incoming      = quark.$incoming.slice()
    //             // this.$incoming      = copyArray(quark.$incoming)
    //         }
    //
    //         if (!outgoingsConsumed) {
    //             const outgoing          = quark.$outgoing
    //             const outgoingRev       = quark.$outgoingRev
    //
    //             if (outgoing) {
    //                 for (let i = outgoing.length - 1; i >= 0; i--) {
    //                     const outgoingRevision  = outgoingRev[ i ]
    //                     const outgoingQuark     = outgoing[ i ] as Quark
    //
    //                     const identity          = outgoingQuark.owner.identity
    //
    //                     // should use `uniqable2` here (or may be even `uniqable3`) because `uniqable`
    //                     // at this point is already being used by `forEveryFirstQuarkTill` in the `graph.sweep()`
    //                     if (identity.uniqable2 !== uniqable) {
    //                         identity.uniqable2   = uniqable
    //
    //                         // TODO requires extra attention
    //                         // remove this if the "shallow state" optimization for Atom will be removed
    //                         // `identity.uniqableBox === undefined` means that outgoing edge is actually going to the quark in the "shredding"
    //                         // iteration - thats why it is not set up in the `graph.sweep()`
    //                         // we do want to keep such edges, reproducible in `graph_garbage_collection.t.js`
    //                         if (!identity.uniqableBox || outgoingRevision === (identity.uniqableBox as Quark).revision) {
    //                             identity.uniqableBox    = undefined
    //                             collapsedOutgoing.push(outgoingQuark)
    //                             collapsedOutgoingRev.push(outgoingRevision)
    //                         }
    //                     }
    //                 }
    //             }
    //         }
    //
    //         if (!outgoingsPastConsumed) {
    //             const outgoingPast          = quark.$outgoingPast
    //             const outgoingPastRev       = quark.$outgoingPastRev
    //
    //             if (outgoingPast) {
    //                 for (let i = outgoingPast.length - 1; i >= 0; i--) {
    //                     const outgoingPastRevision  = outgoingPastRev[ i ]
    //                     const outgoingPastQuark     = outgoingPast[ i ] as Quark
    //
    //                     const identity          = outgoingPastQuark.owner.identity
    //
    //                     // should use `uniqable2` here (or may be even `uniqable3`) because `uniqable`
    //                     // at this point is already being used by `forEveryFirstQuarkTill` in the `graph.sweep()`
    //                     if (identity.uniqable3 !== uniqable) {
    //                         identity.uniqable3   = uniqable
    //
    //                         // TODO requires extra attention
    //                         // remove this if the "shallow state" optimization for Atom will be removed
    //                         // `identity.uniqableBox === undefined` means that outgoingPast edge is actually going to the quark in the "shredding"
    //                         // iteration - thats why it is not set up in the `graph.sweep()`
    //                         // we do want to keep such edges, reproducible in `graph_garbage_collection.t.js`
    //                         if (!identity.uniqableBox || outgoingPastRevision === (identity.uniqableBox as Quark).revision) {
    //                             identity.uniqableBox    = undefined
    //
    //                             if (collapsedOutgoingPast === undefined) { collapsedOutgoingPast = []; collapsedOutgoingPastRev = [] }
    //
    //                             collapsedOutgoingPast.push(outgoingPastQuark)
    //                             collapsedOutgoingPastRev.push(outgoingPastRevision)
    //                         }
    //                     }
    //                 }
    //             }
    //         }
    //
    //         if (quark.value !== undefined && quark.revision === quark.valueRevision) {
    //             outgoingsConsumed   = true
    //
    //             // TODO make a config option?
    //             // the trick with `[ ... ] / copyArray` creates a new array with the exact size for its elements
    //             // it seems, normally, arrays allocates a little more memory, avoid allocation on every "push"
    //             // the difference might be, like: for array of 20 elements, exact size is 80 bytes,
    //             // extra size - 180 bytes! for many small arrays (exactly the chrono case) total difference might be
    //             // significant: for 100k boxes with 4 backward deps each - from 69.7MB to 54.1MB
    //             // there is a small performance penalty: from 435ms to 455ms (`benchmarks/chrono2/graphful/commit_gen`)
    //             // it seems Array.from() is slower than manual `copyArray`... because of iterators protocol?
    //             this.$outgoing      = collapsedOutgoing
    //             this.$outgoingRev   = collapsedOutgoingRev
    //
    //             this.$outgoingPast      = collapsedOutgoingPast
    //             this.$outgoingPastRev   = collapsedOutgoingPastRev
    //
    //             // this.$outgoing      = collapsedOutgoing.slice()
    //             // this.$outgoingRev   = collapsedOutgoingRev.slice()
    //             // this.$outgoing      = copyArray(collapsedOutgoing)
    //             // this.$outgoingRev   = copyArray(collapsedOutgoingRev)
    //         }
    //
    //
    //
    //         // consume the top-most value, even if its the `sameValue`
    //         // reasoning is that even that `equality` check has passed
    //         // user may have some side effects that expects the value
    //         // to always be the result of latest `calculation` call
    //         if (!valueConsumed && quark.value !== undefined) {
    //             valueConsumed       = true
    //
    //             if (quark !== this) this.copyValueFrom(quark)
    //
    //             this.previous       = zero
    //             this.valueRevision  = this.revision
    //         }
    //
    //         if (quark !== this) quark.destroy()
    //
    //         quark           = previous
    //
    //     } while (quark)
    //
    //     if (this.$outgoing.length === 0) this.owner.doCleanup()
    // }
    destroy() {
        this.previous = undefined;
        this.value = undefined;
        this.clearOutgoing();
        this.$incoming = undefined;
    }
    copyValueFrom(quark) {
        this.value = quark.value;
    }
    clone() {
        const cls = this.constructor;
        const clone = new cls();
        clone.$outgoing = this.$outgoing ? this.$outgoing.slice() : undefined;
        clone.$outgoingRev = this.$outgoingRev ? this.$outgoingRev.slice() : undefined;
        clone.$incoming = this.$incoming ? this.$incoming.slice() : undefined;
        clone.owner = this.owner;
        clone.previous = this.previous;
        clone.frozen = this.frozen;
        clone.usedProposedOrPrevious = this.usedProposedOrPrevious;
        clone.iteration = this.iteration;
        clone.value = this.value;
        return clone;
    }
    static getZero() {
        return this.zero;
    }
}
Quark.zero = new Quark();
Quark.zero.freeze();

//---------------------------------------------------------------------------------------------------------------------
let BoxImmutable = class BoxImmutable extends Quark {
    constructor(owner) {
        super();
        this.owner = owner;
    }
    write(value) {
        if (this.frozen)
            throw new Error("Can't write to frozen box");
        this.value = value;
    }
};
BoxImmutable = __decorate([
    serializable({ id: 'BoxImmutable' })
], BoxImmutable);
BoxImmutable.zero = new BoxImmutable(undefined);
BoxImmutable.zero.freeze();
//---------------------------------------------------------------------------------------------------------------------
// TODO Box should extend both Atom & BoxImmutable as CombinedOwnerAndImmutable
class BoxUnboundPre extends Atom {
    buildDefaultImmutable() {
        const defaultBoxImmutable = new BoxImmutable(this);
        defaultBoxImmutable.previous = BoxImmutable.zero;
        return defaultBoxImmutable;
    }
    // do nothing for boxes - boxes are always synchronously up-to-date
    actualize() {
    }
    resetCalculation(keepProposed) {
    }
    readConsistentOrProposedOrPrevious() {
        return this.immutable.read();
    }
    read(graph) {
        const effectiveGraph = graph || this.graph;
        const activeAtom = effectiveGraph ? effectiveGraph.activeAtom : undefined;
        const self = this.checkoutSelf();
        if (activeAtom)
            self.immutableForWrite().addOutgoing(activeAtom.immutable, false);
        return self.immutable.read();
    }
    write(value, ...args) {
        const prevRaw = this.immutable.readRaw();
        if (this.equality(value, prevRaw) && prevRaw !== undefined)
            return;
        if (value === undefined)
            value = null;
        this.writeConfirmedDifferentValue(value, ...args);
    }
    writeConfirmedDifferentValue(value, ...args) {
        const prevRaw = this.immutable.readRaw();
        if (this.graph) {
            this.graph.frozen = false;
            // start new iteration right away
            this.graph.currentTransaction.immutableForWrite();
        }
        this.userInputRevision = getNextRevision();
        this.propagateStaleDeep(true);
        this.immutableForWrite().write(value);
        this.immutable.revision = this.userInputRevision;
        this.immutable.valueRevision = this.userInputRevision;
        this.state = AtomState.UpToDate;
        const graph = this.graph;
        if (graph) {
            // after the `propagateStaleDeep` above, the new `userInputRevision` has been propagated
            // then we reset the `userInputRevision` of the atom that has triggered the write (activeAtom)
            // so that `propagateStaleShallow` won't cause extra recalculations
            // TODO this is a bit vague, even that all tests passes
            // we probably need some proper way of indicating that calculation of some atom is triggered by another
            // (batchId? - currently its `uniqable` inside the calculation cores)
            if (graph.activeAtom)
                graph.activeAtom.userInputRevision = this.userInputRevision;
            graph.onDataWrite(this);
        }
        if (this.$commitValueOptimisticHook)
            this.$commitValueOptimisticHook.trigger(this, value, prevRaw);
    }
}
BoxUnboundPre.meta = DefaultMetaBox;
let BoxUnbound = class BoxUnbound extends BoxUnboundPre {
    static new(value, name) {
        const instance = new this();
        instance.write(value);
        instance.name = name;
        instance.initialize();
        return instance;
    }
};
BoxUnbound = __decorate([
    serializable({ id: 'BoxUnbound' })
], BoxUnbound);
let Box = class Box extends BoxUnbound {
    static new(value, name) {
        return super.new(value, name);
    }
    get boundGraph() {
        return globalGraph;
    }
};
Box = __decorate([
    serializable({ id: 'Box' })
], Box);
const ZeroBox = new BoxUnbound();
ZeroBox.name = 'ZeroBox';
ZeroBox.immutable = BoxImmutable.zero;
BoxImmutable.zero.owner = ZeroBox;

//----------------------------------------------------------------------------------------------------------------------
let IterationStorage = class IterationStorage extends SerializableCustom {
    constructor() {
        super(...arguments);
        this.quarks = [];
    }
    get size() {
        return this.quarks.length;
    }
    clone() {
        const cls = this.constructor;
        const clone = new cls();
        clone.quarks = this.quarks.slice();
        return clone;
    }
    freeze() {
        for (let i = 0; i < this.quarks.length; i++)
            this.quarks[i].freeze();
    }
    addQuark(quark) {
        this.quarks.push(quark);
    }
    getLatestQuarkOfLocal(atomId) {
        const quarks = this.quarks;
        for (let i = 0; i < quarks.length; i++) {
            if (quarks[i].owner.id === atomId)
                return quarks[i];
        }
        return undefined;
    }
    forEveryFirstQuarkTillLocal(uniqable, onFirstAtomOccurrence) {
        const quarks = this.quarks;
        for (let i = 0; i < quarks.length; i++) {
            const quark = quarks[i];
            const atom = quark.owner;
            if (atom.identity.uniqable !== uniqable) {
                atom.identity.uniqable = uniqable;
                onFirstAtomOccurrence(quark);
            }
        }
    }
    forEveryQuarkTillLocal(uniqable, onAtomOccurrence) {
        const quarks = this.quarks;
        for (let i = 0; i < quarks.length; i++) {
            const quark = quarks[i];
            const atom = quark.owner;
            if (atom.identity.uniqable !== uniqable) {
                atom.identity.uniqable = uniqable;
                onAtomOccurrence(quark, true);
            }
            else {
                onAtomOccurrence(quark, false);
            }
        }
    }
    clear() {
        this.quarks = [];
    }
};
IterationStorage = __decorate([
    serializable({ id: 'IterationStorage' })
], IterationStorage);
let iterationIdSequence = 0;
//----------------------------------------------------------------------------------------------------------------------
let Iteration = class Iteration extends SerializableCustom.derive(Immutable) {
    constructor() {
        super(...arguments);
        this.name = `iteration#${iterationIdSequence++}`;
        this.storage = new IterationStorage();
        // incremented by any owning graph, at any depth
        this.refCount = 0;
        // incremented by any owning graph, at the depth of its `historyLimit`
        this.reachCount = 0;
        // incremented by any following iteration
        // nextCount       : number            = 0
        this.isRejected = false;
        this.mergedInto = undefined;
    }
    getMergedIntoRecursive() {
        let res = undefined;
        let iteration = this;
        while (iteration.mergedInto) {
            res = iteration.mergedInto;
            iteration = iteration.mergedInto;
        }
        return res;
    }
    get size() {
        return this.storage.size;
    }
    get dirty() {
        return this.storage.size > 0;
    }
    get transaction() {
        return this.owner;
    }
    // createNext (owner? : Owner) : this {
    //     const next      = super.createNext(owner)
    //
    //     this.nextCount++
    //
    //     return next
    // }
    mark(reachable) {
        this.refCount++;
        if (reachable)
            this.reachCount++;
    }
    unmark(reachable) {
        this.refCount--;
        if (reachable)
            this.reachCount--;
    }
    getLatestQuarkOf(atom) {
        let iteration = this;
        const atomId = atom.id;
        while (iteration) {
            const quark = iteration.storage.getLatestQuarkOfLocal(atomId);
            if (quark !== undefined)
                return quark;
            iteration = iteration.previous;
        }
        return undefined;
    }
    forEveryQuarkTill(stopAt, onAtomOccurrence) {
        const uniqable = getUniqable();
        let iteration = this;
        while (iteration) {
            if (iteration === stopAt)
                break;
            iteration.storage.forEveryQuarkTillLocal(uniqable, onAtomOccurrence);
            iteration = iteration.previous;
        }
    }
    forEveryFirstQuarkTill(stopAt, onFirstAtomOccurrence) {
        const uniqable = getUniqable();
        let iteration = this;
        while (iteration) {
            if (iteration === stopAt)
                break;
            iteration.storage.forEveryFirstQuarkTillLocal(uniqable, onFirstAtomOccurrence);
            iteration = iteration.previous;
        }
    }
    clone() {
        const cls = this.constructor;
        const clone = new cls();
        clone.storage = this.storage.clone();
        clone.previous = this.previous;
        return clone;
    }
    addAtom(atom) {
        this.addQuark(atom.immutable);
    }
    addQuark(quark) {
        // TODO setup dev/prod builds
        // <debug>
        if (this.frozen)
            throw new Error("Can't modify frozen data");
        if (quark.iteration && quark.iteration !== this)
            throw new Error("Quark already in another iteration");
        // </debug>
        if (quark.iteration === this)
            return;
        // this.quarks.set(quark.owner.id, quark)
        this.storage.addQuark(quark);
        quark.iteration = this;
    }
    // this is a bit controversial, but still need to figure out a test case that would exercise it
    forceAddQuark(quark) {
        if (quark.iteration === this)
            return;
        this.storage.addQuark(quark);
        quark.iteration = this;
    }
    freeze() {
        if (this.frozen)
            return;
        this.storage.freeze();
        super.freeze();
    }
    canBeCollapsedWithNext() {
        return this.refCount === 1 && this.reachCount === 0;
    }
    destroy() {
        this.storage.clear();
        this.storage = undefined;
        this.previous = undefined;
    }
    static new(props) {
        const instance = new this();
        Object.assign(instance, props);
        return instance;
    }
};
Iteration = __decorate([
    serializable({ id: 'Iteration' })
], Iteration);
//----------------------------------------------------------------------------------------------------------------------
let IterationStorageShredding = class IterationStorageShredding extends IterationStorage {
    constructor() {
        super(...arguments);
        this.quarksMap = new Map();
    }
    get size() {
        return this.quarksMap.size;
    }
    freeze() {
        this.quarksMap.forEach(quark => quark.freeze());
        super.freeze();
    }
    clone() {
        const clone = super.clone();
        clone.quarksMap = new Map(this.quarksMap);
        return clone;
    }
    getLatestQuarkOfLocal(atomId) {
        return this.quarksMap.get(atomId);
    }
    forEveryFirstQuarkTillLocal(uniqable, onFirstAtomOccurrence) {
        this.quarksMap.forEach(quark => {
            const atom = quark.owner;
            if (atom.identity.uniqable !== uniqable) {
                atom.identity.uniqable = uniqable;
                onFirstAtomOccurrence(quark);
            }
        });
    }
    forEveryQuarkTillLocal(uniqable, onAtomOccurrence) {
        this.quarksMap.forEach(quark => {
            const atom = quark.owner;
            if (atom.identity.uniqable !== uniqable) {
                atom.identity.uniqable = uniqable;
                onAtomOccurrence(quark, true);
            }
            else {
                onAtomOccurrence(quark, false);
            }
        });
    }
    addQuark(quark) {
        if (quark.isTombstone)
            this.quarksMap.delete(quark.owner.id);
        else
            this.quarksMap.set(quark.owner.id, quark);
    }
    clear() {
        this.quarksMap = new Map();
    }
};
IterationStorageShredding = __decorate([
    serializable({ id: 'IterationStorageShredding' })
], IterationStorageShredding);

let transactionIdSequence = 0;
//----------------------------------------------------------------------------------------------------------------------
let Transaction = class Transaction extends SerializableCustom.derive(Owner) {
    constructor() {
        super(...arguments);
        this.propagationStartDate = 0;
        this.lastProgressNotificationDate = 0;
        this.startProgressNotificationsAfterMs = 500;
        this.emitProgressNotificationsEveryMs = 200;
        // TODO auto-adjust this parameter to match the emitProgressNotificationsEveryMs (to avoid calls to time functions)
        this.emitProgressNotificationsEveryCalculations = 100;
        this.plannedTotalIdentifiersToCalculate = 0;
        this.iterationClass = Iteration;
        this.name = `transaction#${transactionIdSequence++}`;
        this.rejectedWith = undefined;
        //region Transaction as Owner
        this.$immutable = undefined;
        //endregion
        //region transaction as Immutable
        this.owner = undefined;
        this.previous = undefined;
        this.frozen = false;
    }
    // @ts-ignore
    get immutable() {
        if (this.$immutable !== undefined)
            return this.$immutable;
        return this.$immutable = this.buildImmutable();
    }
    set immutable(immutable) {
        this.$immutable = immutable;
        if (immutable)
            immutable.owner = this;
    }
    buildImmutable() {
        // return this.previous ? this.previous.immutable.createNext(this) : this.iterationClass.new({
        //     owner   : this,
        //     storage : this.owner.historyLimit >= 0 ? new IterationStorageShredding() : new IterationStorage()
        // })
        return this.iterationClass.new({
            owner: this,
            previous: this.previous ? this.previous.immutable : undefined
        });
    }
    setCurrent(immutable) {
        if (this.$immutable && immutable.previous !== this.immutable)
            throw new Error("Invalid state thread");
        if (this.frozen) {
            const next = this.createNext();
            next.immutable = immutable;
            this.owner.setCurrent(next);
        }
        else {
            this.immutable = immutable;
        }
    }
    createNext(owner) {
        this.freeze();
        const self = this.constructor;
        const next = self.new();
        next.previous = this;
        next.owner = owner || this.owner;
        next.immutable.previous = this.immutable;
        return next;
    }
    freeze() {
        if (this.frozen)
            return;
        this.immutable.freeze();
        this.frozen = true;
    }
    //endregion
    get graph() {
        return this.owner;
    }
    get iteration() {
        return this.immutable;
    }
    startCommit(stack) {
        this.propagationStartDate = Date.now();
        this.plannedTotalIdentifiersToCalculate = stack.size;
    }
    getLastIteration() {
        let iteration = this.immutable;
        const stopAt = this.previous ? this.previous.immutable : undefined;
        while (iteration) {
            const previous = iteration.previous;
            if (previous === stopAt)
                break;
            iteration = previous;
        }
        return iteration;
    }
    forEveryIteration(func) {
        let iteration = this.immutable;
        const stopAt = this.previous ? this.previous.immutable : undefined;
        while (iteration && iteration !== stopAt) {
            func(iteration);
            iteration = iteration.previous;
        }
    }
    forEveryFirstQuark(func) {
        this.immutable.forEveryFirstQuarkTill(this.previous ? this.previous.immutable : undefined, func);
    }
    reject(rejectEffect) {
        this.rejectedWith = rejectEffect;
        this.forEveryIteration(iteration => iteration.isRejected = true);
    }
    mark(reachable) {
        this.forEveryIteration(iteration => iteration.mark(reachable));
    }
    unmark(reachable) {
        this.forEveryIteration(iteration => iteration.unmark(reachable));
    }
    immutableForWrite() {
        if (this.frozen) {
            const next = this.createNext();
            this.owner.setCurrent(next);
            return next.immutable;
        }
        if (this.immutable.frozen)
            this.setCurrent(this.immutable.createNext());
        return this.immutable;
    }
    addQuark(quark) {
        this.immutableForWrite().addQuark(quark);
    }
    addAtom(atom) {
        this.immutableForWrite().addAtom(atom);
    }
    static new(props) {
        const instance = new this();
        Object.assign(instance, props);
        return instance;
    }
};
__decorate([
    exclude()
], Transaction.prototype, "iterationClass", void 0);
Transaction = __decorate([
    serializable({ id: 'Transaction', mode: 'optOut' })
], Transaction);
// export const ZeroTransaction = new Transaction()
//
// ZeroTransaction.immutable   = ZeroIteration
// ZeroIteration.owner         = ZeroTransaction
//
// ZeroTransaction.freeze()

/**
 * A constant which will be used a commit result, when graph is not available.
 */
const CommitZero = {
    rejectedWith: null
};
//----------------------------------------------------------------------------------------------------------------------
let ChronoGraph = class ChronoGraph extends SerializableCustom.derive(Base) {
    constructor() {
        // for debugging convenience
        // globalContext           : any                   = globalContext
        super(...arguments);
        // how many "extra" transactions to keep in memory (except the one currently running)
        // `-1` means no transactioning at all (reject is not supported)
        // `0` means `reject` is supported but no undo
        // `1` means supports reject + 1 `undo` call, etc
        this.historyLimit = -1;
        // same value for all branches
        this.identity = this;
        // moved to `globalContext` instead
        // // move to Transaction? by definition, transaction ends when the stack is exhausted
        // // (all strict effects observed)
        // stack                   : LeveledQueue<Atom>    = new LeveledQueue()
        this.nextTransaction = [];
        // filled in branches
        this.previous = undefined;
        // historySource           : Map<ChronoReference, Quark>   = new Map()
        // historySource           : Iteration   = undefined
        this.atomsById = new Map();
        this.isInitialCommit = true;
        this.isCommitting = false;
        this.ongoing = Promise.resolve();
        //-------------------------------------
        /**
         * If this option is enabled with `true` value, all data modification calls ([[write]], [[addIdentifier]], [[removeIdentifier]]) will trigger
         * a delayed [[commit]] call (or [[commitAsync]], depending from the [[autoCommitMode]] option).
         */
        this.autoCommit = false;
        /**
         * How long to delay a commit after the data modification call has been made.
         */
        this.autoCommitTimeout = 0;
        /**
         * Indicates the default commit mode, which is used in [[autoCommit]].
         */
        this.autoCommitMode = 'sync';
        this.autoCommitHandler = null;
        // a "cross-platform" trick to avoid specifying the type of the `autoCommitTimeoutId` explicitly
        // UPDATE: which does not work with declaration files - the type is inlined and adds a dependency on
        // `@types/node`
        this.autoCommitTimeoutId = null;
        this.effectHandlerSync = null;
        this.effectHandlerAsync = null;
        this.transactionClass = Transaction;
        this.stack = new LeveledQueue();
        //region ChronoGraph as Owner
        this.$immutable = undefined;
        this.garbageCollection = 'eager';
        // TODO do we really need this?
        // special flag only used for `historyLimit === 0` case
        // indicates the current transaction is "frozen"
        // we use it to avoid unnecessary freezing / thawing of the transaction
        // it is handling the "reject immediately after commit should do nothing" condition
        this.frozen = false;
        this.enableProgressNotifications = false;
        this.onComputationCycle = 'throw';
        this.staleInNextBatch = [];
        this.activeBatchRevision = MIN_SMI;
        this.batchDepth = 0;
        this.activeAtom = undefined;
        // the idea of this method is that we can bind an Atom's constructor to a certain graph instance
        // and all instances of that Atom class will be inserted in the graph automatically
        // does not work in practice, because of the initialization in sub-classes happens
        // _after_ the `graph.addAtom()` call in the base Atom class..
        // probably need to use static constructor everywhere
        // bindAtomClass<C extends typeof Atom> (cls : C, meta? : Meta) : C {
        //     const graph     = this
        //
        //     // @ts-ignore
        //     const klass     = class extends cls {
        //         get boundGraph () : ChronoGraph {
        //             return graph
        //         }
        //     }
        //
        //     if (meta) klass.meta = meta
        //
        //     return klass
        // }
    }
    bindAtomConstructor(cons) {
        const graph = this;
        // @ts-ignore
        return class extends cons {
            get boundGraph() {
                return graph;
            }
        };
    }
    initialize(props) {
        super.initialize(props);
        this.autoCommitHandler = this.autoCommitMode === 'sync' ? arg => this.commit(arg) : async (arg) => this.commitAsync(arg);
        this.effectHandlerSync = this.onEffectSync.bind(this);
        this.effectHandlerAsync = this.onEffectAsync.bind(this);
        this.mark();
    }
    destroy() {
        this.unmark();
        this.atomsById = undefined;
        // this.historySource  = undefined
        let iteration = this.currentIteration;
        while (iteration && iteration.refCount === 0) {
            const previous = iteration.previous;
            iteration.destroy();
            iteration = previous;
        }
    }
    get immutable() {
        if (this.$immutable !== undefined)
            return this.$immutable;
        if (this.historyLimit >= 0) {
            const shreddingTransaction = this.transactionClass.new();
            shreddingTransaction.$immutable = shreddingTransaction.iterationClass.new({
                owner: shreddingTransaction,
                storage: new IterationStorageShredding()
            });
            // pass through the setter for the mark/unmark side effect
            return this.immutable = this.transactionClass.new({ previous: shreddingTransaction });
        }
        else {
            // pass through the setter for the mark/unmark side effect
            return this.immutable = this.transactionClass.new();
        }
    }
    // this is assignment "within" the undo/redo history, keeps the redo information
    set immutable(immutable) {
        this.unmark();
        this.$immutable = immutable;
        if (immutable)
            immutable.owner = this;
        this.mark();
    }
    immutableForWrite() {
        if (this.immutable.frozen)
            this.setCurrent(this.immutable.createNext());
        return this.immutable;
    }
    // this is assignment of the new transaction, clears the redo information
    setCurrent(immutable) {
        if (this.immutable && immutable && immutable.previous !== this.immutable)
            throw new Error("Invalid state thread");
        this.unmark();
        this.$immutable = immutable;
        immutable.owner = this;
        // TODO should somehow not clear the `nextTransaction` for the resolution of lazy atoms?
        // the use case is - user "undo", then read some lazy values - that creates "new history" and clears the
        // `nextTransaction` axis making "redo" impossible,
        // however, from the user perspective s/he only reads the data, which should be pure
        this.nextTransaction = [];
        this.mark();
        // this.sweep()
    }
    //endregion
    getLastIteration() {
        let iteration = this.immutable.immutable;
        while (iteration) {
            const previous = iteration.previous;
            if (!previous)
                return iteration;
            iteration = previous;
        }
        return undefined;
    }
    // TODO review
    clear() {
        this.unScheduleAutoCommit();
        this.stack.clear();
        if (this.$immutable) {
            this.$immutable.iteration.destroy();
        }
        this.$immutable = undefined;
        this.nextTransaction = [];
        this.previous = undefined;
        this.atomsById = new Map();
    }
    sweep() {
        let lastReachableTransaction;
        this.forEveryTransactionInHistory((transaction, reachable) => {
            if (reachable)
                lastReachableTransaction = transaction;
        });
        // empty graph
        if (!lastReachableTransaction)
            return;
        let iteration = lastReachableTransaction.immutable;
        const iterations = [];
        while (iteration) {
            iterations.push(iteration);
            iteration = iteration.previous;
        }
        const lastIteration = iterations[iterations.length - 1];
        let collapseStartingFrom;
        let nextAfterCollapsible;
        for (let i = iterations.length - 1; i > 0; i--) {
            const currentIteration = iterations[i];
            if (currentIteration.canBeCollapsedWithNext()) {
                collapseStartingFrom = currentIteration;
                nextAfterCollapsible = iterations[i - 1];
            }
            else
                break;
        }
        if (!nextAfterCollapsible || nextAfterCollapsible === lastIteration)
            return;
        //
        // const uniqable                      = getUniqable()
        const lastIterationStorage = lastIteration.storage; //as IterationStorageShreddingArray
        // lastIterationStorage.startNewLayer()
        nextAfterCollapsible.forEveryFirstQuarkTill(lastIteration, quark => {
            const owner = quark.owner;
            lastIterationStorage.addQuark(quark);
            quark.iteration = undefined;
            // set the magic data
            owner.identity.uniqableBox = quark;
            // owner.identity.uniqable2        = uniqable
        });
        // lastIterationStorage.filterPreviousLayers(uniqable)
        nextAfterCollapsible.forEveryFirstQuarkTill(lastIteration, quark => {
            // magic dependency on `this.owner.identity.uniqableBox`
            quark.collectGarbage();
        });
        // move the storage
        nextAfterCollapsible.storage = lastIteration.storage;
        lastIteration.mergedInto = nextAfterCollapsible;
        // truncate the history
        nextAfterCollapsible.previous = undefined;
        nextAfterCollapsible.owner.previous = undefined;
        iteration = collapseStartingFrom;
        while (iteration) {
            const previous = iteration.previous;
            iteration.destroy();
            iteration.mergedInto = nextAfterCollapsible;
            iteration = previous;
        }
    }
    mark() {
        this.forEveryTransactionInHistory((transaction, reachable) => transaction.mark(reachable));
    }
    unmark() {
        this.forEveryTransactionInHistory((transaction, reachable) => transaction.unmark(reachable));
    }
    forEveryTransactionInHistory(func) {
        let transaction = this.nextTransaction.length > 0 ? this.nextTransaction[0] : this.$immutable;
        for (let i = 0; transaction; i++) {
            func(transaction, i <= this.historyLimit);
            transaction = transaction.previous;
        }
    }
    // TODO remove
    get activeTransaction() {
        return this.immutable;
    }
    // TODO rename to just `transaction`
    get currentTransaction() {
        return this.immutable;
    }
    // TODO rename to just `iteration`
    get currentIteration() {
        return this.immutable.immutable;
    }
    // TODO rename to `finalizeIteration`??
    finalizeCommit(iteration) {
    }
    // TODO rename to `finalizeIterationAsync`??
    async finalizeCommitAsync(iteration) {
    }
    onDataWrite(writtenTo) {
        if (this.autoCommit && this.autoCommitTimeoutId === null)
            this.scheduleAutoCommit();
        if (!writtenTo.lazy) {
            this.addPossiblyStaleStrictAtomToTransaction(writtenTo);
        }
        this.frozen = false;
    }
    scheduleAutoCommit() {
        if (this.autoCommitTimeoutId === null) {
            this.autoCommitTimeoutId = setImmediateHelper(this.autoCommitHandler);
        }
    }
    unScheduleAutoCommit() {
        if (this.autoCommitTimeoutId !== null) {
            clearImmediateHelper(this.autoCommitTimeoutId);
            this.autoCommitTimeoutId = null;
        }
    }
    /**
     * Returns boolean, indicating whether the auto-commit is pending.
     */
    hasPendingAutoCommit() {
        return this.autoCommitTimeoutId !== null;
    }
    get dirty() {
        return this.stack.size > 0;
    }
    onPropagationProgressNotification(notification) {
    }
    onEffectAsync(effect) {
        if (effect instanceof Atom) {
            const atom = this.resolve(effect);
            // @ts-ignore
            return atom.sync ? atom.read(this) : atom.readAsync(this);
        }
        if (effect instanceof Promise)
            return effect;
        return this[effect.handler](effect);
    }
    resolve(atom) {
        if (atom.graph && this !== atom.graph && this.identity === atom.graph.identity && this.previous)
            return this.checkout(atom);
        else
            return atom;
    }
    // see the comment for the `onEffectSync`
    onEffectSync(effect) {
        if (effect instanceof Atom) {
            const atom = this.resolve(effect);
            return atom.sync ? atom.read(this) : atom.readAsync(this);
        }
        if (effect instanceof Promise) {
            throw new Error("Can not yield a promise in the synchronous context");
        }
        return this[effect.handler](effect);
    }
    async commitAsync(args) {
        if (this.isCommitting)
            return this.ongoing;
        this.isCommitting = true;
        // linearize calls to `commitAsync`
        return this.ongoing = this.ongoing.then(() => {
            return this.doCommitAsync(args);
        }).finally(() => {
            this.isCommitting = false;
        });
    }
    async doCommitAsync(arg) {
        this.beforeCommit();
        // start the new transaction if needed
        const transaction = this.immutableForWrite();
        const stack = this.stack;
        this.enterBatch();
        while (stack.size && !transaction.rejectedWith) {
            await runGeneratorAsyncWithEffect(this.effectHandlerAsync, calculateAtomsQueueGen, [this.effectHandlerAsync, stack, transaction, null, -1], null);
            const iteration = transaction.immutable;
            iteration.freeze();
            this.finalizeCommit(iteration);
            // the "finalizeCommit" & "finalizeCommitAsync" may schedule a new auto-commit
            // so unscheduling again here
            this.unScheduleAutoCommit();
            await this.finalizeCommitAsync(iteration);
            this.unScheduleAutoCommit();
        }
        this.leaveBatch();
        this.afterCommit();
        return { rejectedWith: transaction.rejectedWith };
    }
    commit(arg) {
        this.beforeCommit();
        const transaction = this.immutableForWrite();
        const stack = this.stack;
        this.enterBatch();
        while (stack.size && !transaction.rejectedWith) {
            calculateAtomsQueueSync(this.effectHandlerSync, stack, transaction, null, -1);
            const iteration = transaction.immutable;
            iteration.freeze();
            this.finalizeCommit(iteration);
        }
        this.leaveBatch();
        this.afterCommit();
        return { rejectedWith: transaction.rejectedWith };
    }
    beforeCommit() {
        this.isCommitting = true;
        this.unScheduleAutoCommit();
    }
    afterCommit() {
        this.isCommitting = false;
        this.isInitialCommit = false;
        this.unScheduleAutoCommit();
        if (this.historyLimit >= 0) {
            this.immutable.freeze();
        }
        else {
            this.frozen = true;
        }
        this.sweep();
    }
    reject(reason) {
        // nothing to reject
        if (this.frozen || this.immutable.frozen)
            return;
        this.immutable.reject(RejectEffect.new({ reason }));
        this.undoTo(this.immutable, this.immutable.previous);
        this.immutable = this.immutable.previous;
        // TODO should also reset the calculations of the atoms
        // in the rejected iteration
        for (const atom of this.stack) {
            atom.resetCalculation(false);
        }
        this.stack.clear();
    }
    undo() {
        this.reject();
        if (!this.immutable.previous)
            return;
        this.undoTo(this.immutable, this.immutable.previous);
        this.nextTransaction.push(this.immutable);
        this.immutable = this.immutable.previous;
    }
    redo() {
        if (!this.nextTransaction.length)
            return;
        const nextTransaction = this.nextTransaction[this.nextTransaction.length - 1];
        // using property instead of lazy accessor to avoid creation
        // of transaction
        this.redoTo(this.$immutable, nextTransaction);
        this.immutable = nextTransaction;
        // need to mutate the `nextTransaction` at the end, after all
        // mark/unmark operations has completed
        this.nextTransaction.pop();
    }
    branch(config) {
        // <debug>
        if (this.historyLimit < 0)
            throw new Error("The `historyLimit` config needs to be at least 0 to use branching");
        // </debug>
        // we freeze current _iteration_, not the whole _transaction_
        this.currentIteration.freeze();
        const self = this.constructor;
        const branch = self.new(config);
        branch.identity = this.identity;
        branch.previous = this;
        // TODO should use copy-on-write?
        // branch.historySource    = this.historySource.clone()
        const partialTransaction = this.currentTransaction.previous
            ?
                this.currentTransaction.previous.createNext(branch)
            :
                Transaction.new({ owner: branch });
        partialTransaction.immutable = this.currentIteration.createNext(partialTransaction);
        branch.immutable = partialTransaction;
        // increase the `nextCounter`
        // this.currentTransaction.immutable = this.currentIteration.createNext()
        branch.staleInNextBatch = this.staleInNextBatch.map(atom => branch.checkout(atom));
        return branch;
    }
    checkout(atom) {
        if (atom.graph === this)
            return atom;
        // TODO
        // @ts-ignore
        if (atom === ZeroBox)
            return ZeroBox;
        if (!this.previous)
            throw new Error("Graph is not a branch - can not checkout");
        const existingAtom = this.atomsById.get(atom.id);
        if (existingAtom !== undefined)
            return existingAtom;
        const clone = atom.clone();
        clone.graph = this;
        // might be more performant to checkout everything at once, since
        // most of our revisions going to be array-based?
        // yes, probably should gather the latest quarks in the map right away
        // can keep `latestQuarks` in the branch + use storage of the last iteration
        const immutable = this.getLatestQuarkOf(atom).createNext(clone);
        clone.immutable = undefined;
        clone.setCurrent(immutable);
        // if ((immutable as BoxImmutable).readRaw() !== undefined) clone.state = AtomState.UpToDate
        this.atomsById.set(clone.id, clone);
        if (clone.state !== AtomState.UpToDate && !clone.lazy)
            this.addPossiblyStaleStrictAtomToTransaction(clone);
        return clone;
    }
    getLatestQuarkOf(atom) {
        const transaction = this.$immutable || this.immutable;
        const iteration = transaction.$immutable || transaction.immutable;
        return iteration.getLatestQuarkOf(atom);
    }
    addAtom(atom) {
        atom.enterGraph(this);
        if (this.historyLimit >= 0)
            this.immutableForWrite().addAtom(atom);
        if (!atom.lazy)
            this.addPossiblyStaleStrictAtomToTransaction(atom);
        if (this.autoCommit && this.autoCommitTimeoutId === null)
            this.scheduleAutoCommit();
        // TODO should check for frozen status?
        atom.immutable.isTombstone = false;
        return atom;
    }
    addAtoms(atoms) {
        atoms.forEach(atom => this.addAtom(atom));
    }
    removeAtom(atom) {
        atom.immutableForWrite().isTombstone = true;
        atom.propagateStaleDeep(true);
        atom.leaveGraph(this);
        if (this.autoCommit && this.autoCommitTimeoutId === null)
            this.scheduleAutoCommit();
    }
    removeAtoms(atoms) {
        atoms.forEach(atom => this.removeAtom(atom));
    }
    addPossiblyStaleStrictAtomToTransaction(atom) {
        this.stack.in(atom);
    }
    registerQuark(quark) {
        this.immutableForWrite().addQuark(quark);
    }
    forEveryAtom(func) {
        this.currentIteration.forEveryFirstQuarkTill(undefined, quark => func(quark.owner));
    }
    get atomCount() {
        let res = 0;
        this.forEveryAtom(() => res++);
        return res;
    }
    // TODO remove the `sourceTransaction` argument
    undoTo(sourceTransaction, tillTransaction) {
        const atoms = [];
        sourceTransaction.immutable.forEveryQuarkTill(tillTransaction ? tillTransaction.immutable : undefined, (quark, first) => {
            if (first)
                atoms.push(quark.owner);
            quark.owner.identity.uniqableBox = quark;
        });
        // TODO becnhmark if one more pass through the `forEveryQuarkTill` is faster
        // than memoizing atoms in array
        for (let i = 0; i < atoms.length; i++) {
            const atom = atoms[i];
            const deepestQuark = atom.identity.uniqableBox;
            this.checkout(atom).resetQuark(deepestQuark.previous);
            atom.identity.uniqableBox = undefined;
        }
    }
    // TODO remove the `sourceTransaction` argument
    redoTo(sourceTransaction, tillTransaction) {
        const atoms = [];
        tillTransaction.immutable.forEveryQuarkTill(sourceTransaction ? sourceTransaction.immutable : undefined, (quark, first) => {
            if (first) {
                atoms.push(quark.owner);
                quark.owner.identity.uniqableBox = quark;
            }
        });
        // TODO becnhmark if one more pass through the `forEveryQuarkTill` is faster
        // than memoizing atoms in array
        for (let i = 0; i < atoms.length; i++) {
            const atom = atoms[i];
            const deepestQuark = atom.identity.uniqableBox;
            this.checkout(atom).resetQuark(deepestQuark);
            atom.identity.uniqableBox = undefined;
        }
    }
    [RejectSymbol](effect) {
        var _a;
        return (_a = this.activeAtom.graph) === null || _a === void 0 ? void 0 : _a.reject(effect.reason);
    }
    [ProposedOrPreviousSymbol](effect) {
        return this.activeAtom.readProposedOrPrevious();
    }
    [PreviousValueOfSymbol](effect) {
        return effect.atom.readPrevious();
    }
    [ProposedValueOfSymbol](effect) {
        return effect.atom.readProposed();
    }
    [ProposedArgumentsOfSymbol](effect) {
        return effect.atom.readProposedArgs();
    }
    [ProposedOrPreviousValueOfSymbol](effect) {
        return effect.atom.readProposedOrPrevious();
    }
    [HasProposedValueSymbol](effect) {
        const calculableBox = effect.atom;
        const self = calculableBox.onReadingPast();
        return self.hasProposedValue();
    }
    readFieldWithAccessor(atom) {
        return atom.sync ? atom.read() : atom.readAsync();
    }
    enterBatch() {
        this.batchDepth++;
        if (this.batchDepth === 1) {
            this.startBatch();
        }
    }
    leaveBatch() {
        this.batchDepth--;
        if (this.batchDepth === 0) {
            this.endBatch();
        }
    }
    startBatch() {
        this.activeBatchRevision = getNextRevision();
        for (let i = 0; i < this.staleInNextBatch.length; i++) {
            const staleAtom = this.staleInNextBatch[i];
            staleAtom.propagatePossiblyStale(true);
            staleAtom.state = AtomState.Stale;
        }
        this.staleInNextBatch = [];
    }
    endBatch() {
        this.activeBatchRevision = MIN_SMI;
    }
    untracked(func) {
        const prevActiveAtom = this.activeAtom;
        this.activeAtom = undefined;
        const res = func();
        this.activeAtom = prevActiveAtom;
        return res;
    }
};
__decorate([
    exclude()
], ChronoGraph.prototype, "ongoing", void 0);
__decorate([
    exclude()
], ChronoGraph.prototype, "autoCommitHandler", void 0);
__decorate([
    exclude()
], ChronoGraph.prototype, "effectHandlerSync", void 0);
__decorate([
    exclude()
], ChronoGraph.prototype, "effectHandlerAsync", void 0);
__decorate([
    exclude()
], ChronoGraph.prototype, "transactionClass", void 0);
__decorate([
    exclude()
], ChronoGraph.prototype, "stack", void 0);
ChronoGraph = __decorate([
    serializable({ id: 'ChronoGraph', mode: 'optOut' })
], ChronoGraph);
const globalGraph = ChronoGraph.new();

//---------------------------------------------------------------------------------------------------------------------
const SynchronousCalculationStarted = Symbol('SynchronousCalculationStarted');
const calculationStartedConstant = { done: false, value: SynchronousCalculationStarted };
let CalculableBoxUnbound = class CalculableBoxUnbound extends BoxUnboundPre {
    constructor() {
        super(...arguments);
        this.level = AtomCalculationPriorityLevel.DependsOnSelfKind;
        this.cleanup = undefined;
        this.$calculationEtalon = undefined;
        this.context = undefined;
        this.$calculation = undefined;
        // $sync : boolean      = undefined
        //
        // get sync () : boolean {
        //     if (this.$sync !== undefined) return this.$sync
        //
        //     return this.meta.sync
        // }
        // set sync (value : boolean) {
        //     this.$sync = value
        // }
        this.iterationResult = undefined;
        this.proposedValue = undefined;
        this.proposedArgs = undefined;
        this.usedProposedOrPrevious = false;
    }
    get calculationEtalon() {
        if (this.$calculationEtalon !== undefined)
            return this.$calculationEtalon;
        return this.meta.calculationEtalon;
    }
    set calculationEtalon(value) {
        this.$calculationEtalon = value;
    }
    static new(config) {
        const instance = new this();
        if (config) {
            if (config.meta !== undefined)
                instance.meta = config.meta;
            instance.name = config.name;
            instance.context = config.context !== undefined ? config.context : instance;
            instance.$calculation = config.calculation;
            instance.$calculationEtalon = config.calculationEtalon;
            instance.$equality = config.equality;
            instance.cleanup = config.cleanup;
            if (config.lazy !== undefined)
                instance.lazy = config.lazy;
            if (config.persistent !== undefined)
                instance.persistent = config.persistent;
            // TODO not needed explicitly (can defined based on the type of the `calculation` function?
            if (config.sync !== undefined)
                instance.sync = config.sync;
        }
        instance.initialize();
        return instance;
    }
    get calculation() {
        if (this.$calculation !== undefined)
            return this.$calculation;
        return this.meta.calculation;
    }
    set calculation(value) {
        this.$calculation = value;
    }
    isCalculationStarted() {
        return Boolean(this.iterationResult);
    }
    isCalculationCompleted() {
        return Boolean(this.iterationResult && this.iterationResult.done);
    }
    beforeCalculation() {
        this.usedProposedOrPrevious = false;
        this.immutableForWrite().$incoming = undefined;
        this.immutable.revision = getNextRevision();
        this.state = AtomState.Calculating;
    }
    startCalculation(onEffect) {
        this.beforeCalculation();
        // this assignment allows other code to observe, that calculation has started
        this.iterationResult = calculationStartedConstant;
        return this.iterationResult = {
            done: true,
            value: this.calculation.call(this.context, onEffect)
        };
    }
    continueCalculation(value) {
        throw new Error("Can not continue synchronous calculation");
    }
    resetCalculation(keepProposed) {
        if (!keepProposed) {
            this.proposedValue = undefined;
            this.proposedArgs = undefined;
        }
        this.iterationResult = undefined;
    }
    hasProposedValue() {
        if (this.proposedValue !== undefined)
            return true;
        // `proposedValue` is persisted during the batch
        if (this.immutable.batchRevision === this.graph.activeBatchRevision)
            return this.immutable.hasProposedValue();
        return false;
    }
    // TODO should accept `graph` argument, or, probably, `transaction`
    onReadingPast() {
        const activeAtom = this.graph.activeAtom;
        const self = this.checkoutSelf();
        if (activeAtom) {
            if (activeAtom === self) {
                self.usedProposedOrPrevious = true;
            }
            else
                self.immutableForWrite().addOutgoing(activeAtom.immutable, true);
        }
        return self;
    }
    // synchronously read the latest available value, either proposed by user or possibly stale from previous iteration
    // (you should know what you are doing)
    readConsistentOrProposedOrPrevious() {
        // for sync atoms can always return consistent using `read()`
        if (this.sync)
            return this.read();
        // for async atoms return proposed or previous
        const self = this.onReadingPast();
        if (self.state === AtomState.UpToDate)
            return self.immutable.read();
        const proposedValue = self.readProposedInternal();
        return proposedValue !== undefined ? proposedValue : self.immutable.read();
    }
    readProposedOrPrevious() {
        const self = this.onReadingPast();
        return self.readProposedOrPreviousInternal();
    }
    readProposedOrPreviousInternal() {
        const proposedValue = this.readProposedInternal();
        return proposedValue !== undefined ? proposedValue : this.readPreviousInternal();
    }
    readProposed() {
        const self = this.onReadingPast();
        return self.readProposedInternal();
    }
    readProposedArgs() {
        const self = this.onReadingPast();
        return self.readProposedArgsInternal();
    }
    readPrevious() {
        const self = this.onReadingPast();
        return self.readPreviousInternal();
    }
    readProposedInternal() {
        if (this.proposedValue !== undefined)
            return this.proposedValue;
        // `proposedValue` is persisted during the batch
        if (this.immutable.batchRevision === this.graph.activeBatchRevision)
            return this.immutable.proposedValue;
        return undefined;
    }
    readProposedArgsInternal() {
        if (this.proposedArgs !== undefined)
            return this.proposedArgs;
        if (this.immutable.batchRevision === this.graph.activeBatchRevision)
            return this.immutable.proposedArgs;
        return undefined;
    }
    readPreviousInternal() {
        if (this.state === AtomState.UpToDate)
            return this.immutable.previous ? this.immutable.previous.readRaw() : undefined;
        else
            return this.immutable.readRaw();
    }
    read(graph) {
        const effectiveGraph = graph || this.graph;
        const activeAtom = effectiveGraph ? effectiveGraph.activeAtom : undefined;
        const self = this.checkoutSelf();
        if (self.immutable.isTombstone)
            return self.immutable.read();
        if (activeAtom)
            self.immutableForWrite().addOutgoing(activeAtom.immutable, false);
        if (self.isCalculationStarted())
            self.onCyclicReadDetected();
        // inlined `actualize` to save 1 stack level
        if (self.state !== AtomState.UpToDate) {
            self.graph && self.graph.enterBatch();
            if (self.shouldCalculate())
                self.doCalculate();
            else
                self.state = AtomState.UpToDate;
            self.graph && self.graph.leaveBatch();
        }
        // eof inlined `actualize`
        return self.immutable.read();
    }
    actualize() {
        if (this.state !== AtomState.UpToDate) {
            // TODO seems actualize is only used inside the batch already, not needed
            // globalContext.enterBatch()
            if (this.shouldCalculate())
                this.doCalculate();
            else
                this.state = AtomState.UpToDate;
            // globalContext.leaveBatch()
        }
    }
    updateValue(newValue) {
        if (newValue === undefined)
            newValue = null;
        const immutable = this.immutableForWrite();
        const previous = immutable.readRaw();
        const isSameValue = previous === undefined ? false : this.equality(previous, newValue);
        const graph = this.graph;
        // TODO convince myself this is not a monkey-patching (about `globalContext.activeAtom ? false : true`)
        // idea is that we should not reset to stale atoms, that has already used this atom in "past" context
        // (like dispatchers)
        if (previous !== undefined && !isSameValue)
            this.propagateStaleShallow(graph.activeAtom ? false : true);
        immutable.batchRevision = graph.activeBatchRevision;
        if (!isSameValue || previous === undefined) {
            immutable.valueRevision = immutable.revision;
        }
        // only write the value, revision has been already updated in the `beforeCalculation`
        immutable.write(newValue);
        if (this.$commitValueOptimisticHook)
            this.$commitValueOptimisticHook.trigger(this, newValue, previous);
        immutable.proposedValue = this.proposedValue;
        immutable.proposedArgs = this.proposedArgs;
        immutable.usedProposedOrPrevious = this.usedProposedOrPrevious;
        this.state = AtomState.UpToDate;
        if (this.calculationEtalon !== undefined) {
            const onEffectSync = this.graph ? this.graph.effectHandlerSync : graph.onEffectSync;
            const prevActiveAtom = graph.activeAtom;
            graph.activeAtom = this;
            const etalon = this.calculationEtalon.call(this.context, onEffectSync);
            graph.activeAtom = prevActiveAtom;
            if (etalon !== undefined && !this.equality(newValue, etalon)) {
                graph.staleInNextBatch.push(this);
            }
        }
        else if (this.usedProposedOrPrevious) {
            if (this.proposedValue !== undefined && !this.equality(newValue, this.proposedValue)) {
                graph.staleInNextBatch.push(this);
            }
        }
        this.resetCalculation(false);
    }
    shouldCheckDependencies() {
        const state = this.state;
        if (state === AtomState.Calculating)
            return false;
        if (state === AtomState.Stale || state === AtomState.Empty)
            return false;
        if (this.immutable.usedProposedOrPrevious && this.proposedValue !== undefined)
            return false;
        const incomingPast = this.immutable.getIncomingPastDeep();
        if (incomingPast) {
            for (let i = 0; i < incomingPast.length; i++) {
                const dependencyAtom = incomingPast[i].owner;
                // TODO
                // @ts-ignore
                if (dependencyAtom.proposedValue !== undefined)
                    return false;
            }
        }
        return true;
    }
    shouldCalculate() {
        if (!this.shouldCheckDependencies())
            return true;
        const incoming = this.immutable.getIncomingDeep();
        if (incoming) {
            for (let i = 0; i < incoming.length; i++) {
                const dependencyAtom = incoming[i].owner;
                dependencyAtom.actualize();
                if (this.state === AtomState.Stale)
                    return true;
            }
        }
        return false;
    }
    doCalculate() {
        const graph = this.graph;
        const prevActiveAtom = graph.activeAtom;
        graph.activeAtom = this;
        let newValue = undefined;
        const onEffectSync = graph.effectHandlerSync;
        do {
            calculateLowerStackLevelsSync(onEffectSync, graph.stack, graph.currentTransaction, this);
            this.beforeCalculation();
            this.iterationResult = calculationStartedConstant;
            newValue = this.calculation.call(this.context, onEffectSync);
            // the calculation starts in the `Calculating` state and should end up in the same, otherwise
            // if for example it is "PossiblyStale" or "Stale" - that means
            // there have been a write into the atom (or its dependency) during calculation
            // in such case we repeat the calculation
        } while (this.state !== AtomState.Calculating);
        // START
        // TODO the order of the following 2 lines is important
        // `updateValue` uses `propagateStaleShallow`, which clears
        // the outgoings unless there's an `activeAtom`
        // The clearing affects performance significantly
        // however, I recall I had to place the `updateValue` call
        // before this assignment (IIRC some benchmark was throwing exception)
        // need to find this benchmark again, create a test case from it
        // and figure out a proper fix
        graph.activeAtom = prevActiveAtom;
        this.updateValue(newValue);
        // END
    }
    write(value, ...args) {
        if (value === undefined)
            value = null;
        if (this.proposedValue === undefined) {
            // TODO should take `proposedArgs` into account somehow?
            //  in general `proposedArgs` just messes things up,
            // need to get rid of this concept
            // ignore the write of the same value? what about `keepIfPossible` => `pin`
            if (this.equality(this.immutable.read(), value))
                return;
            // still update the `proposedValue` to indicate the user input?
            this.proposedValue = value;
            if (args.length)
                this.proposedArgs = args;
        }
        else {
            if (this.equality(this.proposedValue, value))
                return;
        }
        this.writeConfirmedDifferentValue(value);
    }
    writeConfirmedDifferentValue(value) {
        this.proposedValue = value;
        this.userInputRevision = getNextRevision();
        this.propagatePossiblyStale(true);
        const graph = this.graph;
        if (graph) {
            // see the comment in `write` method of the `Box`
            if (graph.activeAtom)
                graph.activeAtom.userInputRevision = this.userInputRevision;
            graph.onDataWrite(this);
        }
    }
    clone() {
        const clone = super.clone();
        clone.context = this.context;
        clone.name = this.name;
        clone.$calculation = this.$calculation;
        clone.$equality = this.$equality;
        return clone;
    }
    doCleanup() {
        const cleanup = this.cleanup;
        if (cleanup) {
            this.cleanup = undefined;
            cleanup.call(this, this);
        }
    }
    onUnused() {
        this.doCleanup();
        super.onUnused();
    }
};
CalculableBoxUnbound = __decorate([
    serializable({ id: 'CalculableBoxUnbound' })
], CalculableBoxUnbound);
let CalculableBox = class CalculableBox extends CalculableBoxUnbound {
    get boundGraph() {
        return globalGraph;
    }
};
CalculableBox = __decorate([
    serializable({ id: 'CalculableBox' })
], CalculableBox);

/** Shared with sorting.ts — change `MAX_VALUE` in one place. */
const MAX_VALUE = 10;
function rnd() {
    return Math.floor(Math.random() * MAX_VALUE);
}

//---------------------------------------------------------------------------------------------------------------------
/**
 * This class describes an entity. Entity is simply a collection of [[Field]]s. Entity also may have a parent entity,
 * from which it inherit the fields.
 */
class EntityMeta extends Base {
    constructor() {
        super(...arguments);
        /**
         * The name of the entity
         */
        this.name = undefined;
        this.ownFields = new Map();
        this.ownCalculationMappings = new Map();
        this.ownWriteMappings = new Map();
        this.ownCalculationEtalonMappings = new Map();
        this.schema = undefined;
        /**
         * The parent entity
         */
        this.parentEntity = undefined;
        this.proto = undefined;
        this.$fields = undefined;
        this.$calculationMappings = undefined;
        this.$writeMappings = undefined;
        this.$calculationEtalonMappings = undefined;
    }
    /**
     * Checks whether the entity has a field with given name (possibly inherited from parent entity).
     *
     * @param name
     */
    hasField(name) {
        return this.fields.has(name);
    }
    /**
     * Returns a field with given name (possibly inherited) or `undefined` if there's none.
     *
     * @param name
     */
    getField(name) {
        return this.fields.get(name);
    }
    /**
     * Adds a field to this entity.
     *
     * @param field
     */
    addField(field) {
        const name = field.name;
        if (!name)
            throw new Error(`Field must have a name`);
        if (this.ownFields.has(name))
            throw new Error(`Field with name [${name}] already exists`);
        field.entity = this;
        this.ownFields.set(name, field);
        return field;
    }
    addCalculationMapping(fieldName, calculationMethodName) {
        this.ownCalculationMappings.set(fieldName, calculationMethodName);
    }
    addWriteMapping(fieldName, writeMethodName) {
        this.ownWriteMappings.set(fieldName, writeMethodName);
    }
    addCalculationEtalonMapping(fieldName, calculationMethodName) {
        this.ownCalculationEtalonMappings.set(fieldName, calculationMethodName);
    }
    forEachParent(func) {
        let entity = this;
        while (entity) {
            func(entity);
            entity = entity.parentEntity;
        }
    }
    get fields() {
        if (this.$fields !== undefined)
            return this.$fields;
        const fields = new Map(this.parentEntity ? this.parentEntity.fields : undefined);
        if (this.parentEntity) {
            fields.forEach((field, name) => {
                const calculation = this.proto[this.calculationMappings.get(name)];
                const write = this.proto[this.writeMappings.get(name)];
                const calculationEtalon = this.proto[this.calculationEtalonMappings.get(name)];
                if ((field.calculation !== calculation || field.write !== write || field.calculationEtalon !== calculationEtalon)
                    &&
                        !this.ownFields.has(name)) {
                    const clone = field.clone();
                    clone.calculation = calculation;
                    clone.write = write;
                    clone.calculationEtalon = calculationEtalon;
                    fields.set(name, clone);
                }
            });
        }
        this.ownFields.forEach((field, name) => {
            field.calculation = this.proto[this.calculationMappings.get(name)];
            field.write = this.proto[this.writeMappings.get(name)];
            field.calculationEtalon = this.proto[this.calculationEtalonMappings.get(name)];
            fields.set(name, field);
        });
        return this.$fields = fields;
    }
    get calculationMappings() {
        if (this.$calculationMappings !== undefined)
            return this.$calculationMappings;
        const calculationMappings = new Map();
        const visited = new Set();
        this.forEachParent(entity => {
            entity.ownCalculationMappings.forEach((calculationMethodName, fieldName) => {
                if (!visited.has(fieldName)) {
                    visited.add(fieldName);
                    calculationMappings.set(fieldName, calculationMethodName);
                }
            });
        });
        return this.$calculationMappings = calculationMappings;
    }
    get writeMappings() {
        if (this.$writeMappings !== undefined)
            return this.$writeMappings;
        const writeMappings = new Map();
        const visited = new Set();
        this.forEachParent(entity => {
            entity.ownWriteMappings.forEach((calculationMethodName, fieldName) => {
                if (!visited.has(fieldName)) {
                    visited.add(fieldName);
                    writeMappings.set(fieldName, calculationMethodName);
                }
            });
        });
        return this.$writeMappings = writeMappings;
    }
    get calculationEtalonMappings() {
        if (this.$calculationEtalonMappings !== undefined)
            return this.$calculationEtalonMappings;
        const calculationEtalonMappings = new Map();
        const visited = new Set();
        this.forEachParent(entity => {
            entity.ownCalculationEtalonMappings.forEach((calculationMethodName, fieldName) => {
                if (!visited.has(fieldName)) {
                    visited.add(fieldName);
                    calculationEtalonMappings.set(fieldName, calculationMethodName);
                }
            });
        });
        return this.$calculationEtalonMappings = calculationEtalonMappings;
    }
    /**
     * Iterator for all fields of this entity (including inherited).
     *
     * @param func
     */
    forEachField(func) {
        this.fields.forEach(func);
    }
}

//---------------------------------------------------------------------------------------------------------------------
let CalculableBoxGenUnbound = class CalculableBoxGenUnbound extends CalculableBoxUnbound {
    constructor() {
        super(...arguments);
        this.iterator = undefined;
        this.iterationResult = undefined;
        // possibly this needs to be a global (per atom) revision number
        this.iterationNumber = -1;
        this.calculationPromise = undefined;
    }
    static new(config) {
        return super.new(config);
    }
    isCalculationStarted() {
        return Boolean(this.iterator || this.iterationResult);
    }
    isCalculationCompleted() {
        return Boolean(this.iterationResult && this.iterationResult.done);
    }
    startCalculation(onEffect) {
        this.beforeCalculation();
        this.iterationNumber = 0;
        const iterator = this.iterator = this.calculation.call(this.context, onEffect);
        return this.iterationResult = iterator.next();
    }
    continueCalculation(value) {
        this.iterationNumber++;
        return this.iterationResult = this.iterator.next(value);
    }
    resetCalculation(keepProposed) {
        if (!keepProposed) {
            this.proposedValue = undefined;
            this.proposedArgs = undefined;
        }
        this.iterationResult = undefined;
        this.iterator = undefined;
        this.iterationNumber = -1;
        this.calculationPromise = undefined;
    }
    shouldCalculate() {
        return true;
    }
    doCalculate() {
        const effectHandler = this.graph.effectHandlerSync;
        calculateAtomsQueueSync(effectHandler, this.graph.stack, this.graph ? this.graph.currentTransaction : undefined, [this], this.level);
    }
    // this method is intentionally not `async` to avoid creation
    // of multiple promises if many reads are issued during the same
    // calculation - we re-use the `calculationPromise` in this case
    // otherwise every call to `readAsync` would create a new promise
    readAsync(graph) {
        const effectiveGraph = graph || this.graph;
        const activeAtom = effectiveGraph ? effectiveGraph.activeAtom : undefined;
        const self = this.checkoutSelf();
        if (activeAtom)
            self.immutableForWrite().addOutgoing(activeAtom.immutable, false);
        if (self.state === AtomState.UpToDate || self.immutable.isTombstone)
            return Promise.resolve(self.immutable.read());
        if (self.calculationPromise)
            return self.calculationPromise;
        return self.calculationPromise = self.doCalculateAsync();
    }
    async doCalculateAsync() {
        const effectHandler = this.graph.effectHandlerAsync;
        await runGeneratorAsyncWithEffect(effectHandler, calculateAtomsQueueGen, [effectHandler, this.graph.stack, this.graph ? this.graph.currentTransaction : undefined, [this], this.level], null);
        return this.immutable.read();
    }
};
CalculableBoxGenUnbound = __decorate([
    serializable({ id: 'CalculableBoxGenUnbound' })
], CalculableBoxGenUnbound);
let CalculableBoxGen = class CalculableBoxGen extends CalculableBoxGenUnbound {
    get boundGraph() {
        return globalGraph;
    }
};
CalculableBoxGen = __decorate([
    serializable({ id: 'CalculableBoxGen' })
], CalculableBoxGen);

//---------------------------------------------------------------------------------------------------------------------
/**
 * Mixin, for the identifier that represent a field of the entity. Requires the [[Identifier]] (or its subclass)
 * as a base class. See more about mixins: [[Mixin]]
 */
class FieldAtom extends MixinCustom([Atom], (base) => class FieldAtom extends base {
    constructor() {
        super(...arguments);
        /**
         * Reference to the [[Field]] this identifier represents
         */
        this.field = undefined;
        /**
         * Reference to the [[Entity]] this identifier represents
         */
        this.self = undefined;
    }
    clone() {
        const clone = super.clone();
        clone.field = this.field;
        clone.self = this.self;
        return clone;
    }
    toString() {
        return `Field atom [${this.name}]`;
    }
}) {
}
class FieldBox extends FieldAtom.mix(BoxUnbound) {
}
class FieldCalculableBox extends FieldAtom.mix(CalculableBoxUnbound) {
}
class FieldCalculableBoxGen extends FieldAtom.mix(CalculableBoxGenUnbound) {
}
//---------------------------------------------------------------------------------------------------------------------
const constFalse = () => false;
/**
 * Mixin, for the identifier that represent an entity as a whole. Requires the [[Atom]] (or its subclass)
 * as a base class. See more about mixins: [[Mixin]]
 */
class EntityAtom extends MixinCustom([Atom], (base) => class EntityAtom extends base {
    constructor() {
        super(...arguments);
        /**
         * [[EntityMeta]] instance of the entity this identifier represents
         */
        this.entity = undefined;
        /**
         * Reference to the [[Entity]] this identifier represents
         */
        this.self = undefined;
        // entity atom is considered changed if the field atoms has changed
        // this just means if it's calculation method has been called, it should always
        // assign a new value
        this.$equality = constFalse;
    }
    clone() {
        const clone = super.clone();
        clone.self = this.self;
        return clone;
    }
    toString() {
        return `Entity atom [${this.self}]`;
    }
}) {
}
// @ts-ignore
class EntityBox extends EntityAtom.mix(BoxUnbound) {
    static new(value, name) {
        return super.new(value, name);
    }
}

//---------------------------------------------------------------------------------------------------------------------
/**
 * This class describes a field of some [[EntityMeta]].
 */
class Field extends Meta {
    constructor() {
        super(...arguments);
        this.type = undefined;
        /**
         * Reference to the [[EntityMeta]] this field belongs to.
         */
        this.entity = undefined;
        /**
         * Boolean flag, indicating whether this field should be persisted
         */
        this.persistent = true;
        /**
         * The class of the identifier, that will be used to instantiate a specific identifier from this field.
         */
        this.atomCls = undefined;
    }
    getAtomClass() {
        if (this.atomCls)
            return this.atomCls;
        if (!this.calculation)
            return FieldBox;
        return isGeneratorFunction(this.calculation) ? FieldCalculableBoxGen : FieldCalculableBox;
    }
    clone() {
        const clone = super.clone();
        clone.type = this.type;
        clone.entity = this.entity;
        clone.persistent = this.persistent;
        clone.atomCls = this.atomCls;
        return clone;
    }
}

//---------------------------------------------------------------------------------------------------------------------
/**
 * Entity [[Mixin|mixin]]. When applied to some base class (recommended one is [[Base]]), turns it into entity.
 * Entity may have several fields, which are properties decorated with [[field]] decorator.
 *
 * To apply this mixin use the `Entity.mix` property, which represents the mixin lambda.
 *
 * Another decorator, [[calculate]], marks the method, that will be used to calculate the value of field.
 *
 * Example:
 *
 * ```ts
 * class Author extends Entity.mix(Base) {
 *     @field()
 *     firstName       : string
 *     @field()
 *     lastName        : string
 *     @field()
 *     fullName        : string
 *
 *     @calculate('fullName')
 *     calculateFullName () : string {
 *         return this.firstName + ' ' + this.lastName
 *     }
 * }
 * ```
 *
 */
class Entity extends MixinCustom([], (base) => class Entity extends base {
    // marker in the prototype to identify whether the parent class is Entity mixin itself
    // it is not used for `instanceof` purposes and not be confused with the [MixinInstanceOfProperty]
    // (though it is possible to use MixinInstanceOfProperty for this purpose, that would require to
    // make it public
    // this used to be a Symbol, but changed to plain string due to dts files generation
    __isEntityMarker() { }
    /**
     * An [[EntityMeta]] instance, representing the "meta" information about the entity class. It is shared among all instances
     * of the class.
     */
    get $entity() {
        // this will lazily create an EntityMeta instance in the prototype and overwrites the `$entity` property with it
        return ensureEntityOnPrototype(this.constructor.prototype);
    }
    /**
     * An object, which properties corresponds to the ChronoGraph [[Identifier]]s, created for every field.
     *
     * For example:
     *
     * ```ts
     * class Author extends Entity.mix(Base) {
     *     @field()
     *     firstName       : string
     *     @field()
     *     lastName        : string
     * }
     *
     * const author = Author.new()
     *
     * // identifier for the field `firstName`
     * author.$.firstName
     *
     * const firstName = replica.read(author.$.firstName)
     * ```
     */
    get $() {
        const $ = {};
        this.$entity.forEachField((field, name) => {
            $[name] = this.createFieldAtom(field);
        });
        {
            return defineProperty(this, '$', $);
        }
    }
    /**
     * A graph identifier, that represents the whole entity.
     */
    get $$() {
        const entityBox = EntityBox.new(this, this.$entityName);
        entityBox.entity = this.$entity;
        return defineProperty(this, '$$', entityBox);
    }
    get $entityName() {
        return this.constructor.name || this.$entity.name;
    }
    createFieldAtom(field) {
        const name = field.name;
        // const entity                = this.$entity
        // const constructor           = this.constructor as EntityConstructor
        // const skeleton              = entity.$skeleton
        // if (!skeleton[ name ]) skeleton[ name ] = constructor.getIdentifierTemplateClass(this, field)
        const atomCls = field.getAtomClass();
        // @ts-ignore
        const atom = atomCls.new();
        atom.field = field;
        atom.meta = field;
        // TODO
        // @ts-ignore
        atom.context = this;
        atom.self = this;
        atom.name = `${this.$$.name}.$.${name}`;
        return atom;
    }
    forEachFieldAtom(func) {
        this.$entity.forEachField((field, name) => func(this.$[name], name));
    }
    /**
     * This method is called when entity is added to some replica.
     *
     * @param replica
     */
    enterGraph(replica) {
        if (this.graph)
            throw new Error('Already entered replica');
        this.graph = replica;
        replica.addAtom(this.$$);
        this.$entity.forEachField((field, name) => replica.addAtom(this.$[name]));
    }
    /**
     * This method is called when entity is removed from the replica it's been added to.
     */
    leaveGraph(graph) {
        const ownGraph = this.graph;
        // TODO IIRC this `||` fallback was for branches, review again and try to get rid of it
        const removeFrom = graph || ownGraph;
        if (!removeFrom)
            return;
        this.$entity.forEachField((field, name) => removeFrom.removeAtom(this.$[name]));
        removeFrom.removeAtom(this.$$);
        if (removeFrom === ownGraph)
            this.graph = undefined;
    }
    /**
     * This is a convenience method, that just delegates to the [[ChronoGraph.commit]] method of this entity's graph.
     *
     * If there's no graph (entity has not been added to any replica) a [[CommitZero]] constant will be returned.
     */
    commit(arg) {
        const graph = this.graph;
        if (!graph)
            return CommitZero;
        return graph.commit(arg);
    }
    /**
     * This is a convenience method, that just delegates to the [[ChronoGraph.commitAsync]] method of this entity's graph.
     *
     * If there's no graph (entity has not been added to any replica) a resolved promise with [[CommitZero]] constant will be returned.
     */
    async commitAsync(arg) {
        const graph = this.graph;
        if (!graph)
            return Promise.resolve(CommitZero);
        return graph.commitAsync(arg);
    }
    /**
     * An [[EntityMeta]] instance, representing the "meta" information about the entity class. It is shared among all instances
     * of the class.
     */
    static get $entity() {
        return ensureEntityOnPrototype(this.prototype);
    }
    // static getIdentifierTemplateClass (me : Entity, field : Field) : typeof Atom {
    //     const name                  = field.name
    //
    //     const config : Partial<FieldAtom> = {
    //         name                : `${me.$$.name}.$.${name}`,
    //         field               : field
    //     }
    //
    //     //------------------
    //     if (field.hasOwnProperty('sync')) config.sync = field.sync
    //     if (field.hasOwnProperty('lazy')) config.lazy = field.lazy
    //     if (field.hasOwnProperty('equality')) config.equality = field.equality
    //
    //     //------------------
    //     const calculationFunction   = me.$calculations && me[ me.$calculations[ name ] ]
    //
    //     if (calculationFunction) config.calculation = calculationFunction
    //
    //     //------------------
    //     const writeFunction         = me.$writes && me[ me.$writes[ name ] ]
    //
    //     if (writeFunction) config.write = writeFunction
    //
    //     //------------------
    //     const buildProposedFunction = me.$buildProposed && me[ me.$buildProposed[ name ] ]
    //
    //     if (buildProposedFunction) {
    //         config.buildProposedValue       = buildProposedFunction
    //         config.proposedValueIsBuilt     = true
    //     }
    //
    //     //------------------
    //     const template              = field.getAtomClass(calculationFunction).new(config)
    //
    //     const TemplateClass         = function () {} as any as typeof Identifier
    //
    //     TemplateClass.prototype     = template
    //
    //     return TemplateClass
    // }
    // unfortunately, the better typing:
    // run <Name extends AllowedNames<this, AnyFunction>> (methodName : Name, ...args : Parameters<this[ Name ]>)
    //     : ReturnType<this[ Name ]> extends CalculationIterator<infer Res> ? Res : ReturnType<this[ Name ]>
    // yields "types are exceedingly long and possibly infinite on the application side
    // TODO file a TS bug report
    run(methodName, ...args) {
        const onEffect = (effect) => {
            if (effect instanceof Atom)
                return effect.read();
            throw new Error("Helper methods can not yield effects during computation");
        };
        return runGeneratorSyncWithEffect(onEffect, this[methodName], args, this);
    }
    static createPropertyAccessorsFor(field) {
        // idea is to indicate to the v8, that `propertyKey` is a constant and thus
        // it can optimize access by it
        const propertyKey = field.name;
        const target = this.prototype;
        Object.defineProperty(target, propertyKey, {
            get: function () {
                const fieldAtom = this.$[propertyKey];
                if (fieldAtom.graph) {
                    // delegate read with accessor to graph, to be easily overridable there
                    return fieldAtom.graph.readFieldWithAccessor(fieldAtom);
                }
                return fieldAtom.sync ? fieldAtom.read() : fieldAtom.readAsync();
            },
            set: function (value) {
                const atom = this.$[propertyKey];
                // magical effect warning:
                // `field.write` is populated only after 1st access to `this.$`
                field.write
                    ?
                        field.write.call(this, atom, value)
                    :
                        atom.write(value);
            }
        });
    }
    static createMethodAccessorsFor(field) {
        // idea is to indicate to the v8, that `propertyKey` is a constant and thus
        // it can optimize access by it
        const propertyKey = field.name;
        const target = this.prototype;
        const upperCased = uppercaseFirst(propertyKey);
        const getterFnName = `get${upperCased}`;
        const setterFnName = `set${upperCased}`;
        const putterFnName = `put${upperCased}`;
        if (!(getterFnName in target)) {
            target[getterFnName] = function () {
                return this.$[propertyKey].read();
            };
        }
        if (!(setterFnName in target)) {
            target[setterFnName] = function (value, ...args) {
                const atom = this.$[propertyKey];
                // magical effect warning:
                // `field.write` is populated only after 1st access to `this.$`
                field.write
                    ?
                        field.write.call(this, atom, value, ...args)
                    :
                        atom.write(value, ...args);
                return this.graph
                    ?
                        (this.graph.autoCommitMode === 'sync' ? this.graph.commit() : this.graph.commitAsync())
                    :
                        Promise.resolve(CommitZero);
            };
        }
        if (!(putterFnName in target)) {
            target[putterFnName] = function (value, ...args) {
                this.$[propertyKey].write(value, ...args);
            };
        }
    }
}) {
}
//---------------------------------------------------------------------------------------------------------------------
const createEntityOnPrototype = (proto) => {
    let parent = Object.getPrototypeOf(proto);
    // the `hasOwnProperty` condition will be `true` for the `Entity` mixin itself
    // if the parent is `Entity` mixin, then this is a top-level entity
    return defineProperty(proto, '$entity', EntityMeta.new({
        proto,
        parentEntity: parent.hasOwnProperty('__isEntityMarker') ? null : parent.$entity,
        name: proto.constructor.name
    }));
};
//---------------------------------------------------------------------------------------------------------------------
const ensureEntityOnPrototype = (proto) => {
    if (!proto.hasOwnProperty('$entity'))
        createEntityOnPrototype(proto);
    return proto.$entity;
};
/*
 * The "generic" field decorator, in the sense, that it allows specifying both field config and field class.
 * This means it can create any field instance.
 */
const generic_field = (fieldConfig, fieldCls = Field) => {
    return function (target, fieldName) {
        const entity = ensureEntityOnPrototype(target);
        const field = entity.addField(fieldCls.new(Object.assign(fieldConfig || {}, {
            name: fieldName
        })));
        const cons = target.constructor;
        cons.createPropertyAccessorsFor(field);
        cons.createMethodAccessorsFor(field);
    };
};
//---------------------------------------------------------------------------------------------------------------------
/**
 * Field decorator. The type signature is:
 *
 * ```ts
 * field : <T extends typeof Field = typeof Field> (fieldConfig? : Partial<InstanceType<T>>, fieldCls : T | typeof Field = Field) => PropertyDecorator
 * ```
 * Its a function, that accepts field config object and optionally a field class (default is [[Field]]) and returns a property decorator.
 *
 * Example:
 *
 * ```ts
 * const ignoreCaseCompare = (a : string, b : string) : boolean => a.toUpperCase() === b.toUpperCase()
 *
 * class MyField extends Field {}
 *
 * class Author extends Entity.mix(Base) {
 *     @field({ equality : ignoreCaseCompare })
 *     firstName       : string
 *
 *     @field({ lazy : true }, MyField)
 *     lastName       : string
 * }
 * ```
 *
 * For every field, there are generated get and set accessors, with which you can read/write the data:
 *
 * ```ts
 * const author     = Author.new({ firstName : 'Mark' })
 *
 * author.firstName // Mark
 * author.lastName  = 'Twain'
 * ```
 *
 * The getters are basically using [[Replica.get]] and setters [[Replica.write]].
 *
 * Note, that if the identifier is asynchronous, reading from it will return a promise. But, immediately after the [[Replica.commit]] call, getter will return
 * plain value. This is a compromise between the convenience and correctness and this behavior may change (or made configurable) in the future.
 *
 * Additionally to the accessors, the getter and setter methods are generated. The getter method's name is formed as `get` followed by the field name
 * with upper-cased first letter. The setter's name is formed in the same way, with `set` prefix.
 *
 * The getter method is an exact equivalent of the get accessor. The setter method, in addition to data write, immediately after that
 * performs a call to [[Replica.commit]] (or [[Replica.commitAsync]], depending from the [[Replica.autoCommitMode]] option)
 * and return its result.
 *
 * ```ts
 * const author     = Author.new({ firstName : 'Mark' })
 *
 * author.getFirstName() // Mark
 * await author.setLastName('Twain') // issues asynchronous commit
 * ```
 */
const field = generic_field;

// TODO should use `typeOfRaw` strings for comparison (like `[object Object]`) avoiding slice
// this should make the typeguard pretty much instant
//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const isFunction = (a) => /Function$/.test(typeOf(a));
const isSyncFunction = (a) => typeOf(a) === 'Function';
const isNumber = (a) => Number(a) === a;
const isString = (a) => typeOf(a) === 'String';
const isArray = (a) => typeOf(a) === 'Array';

//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const typeOf = (value) => Object.prototype.toString.call(value).slice(8, -1);
//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const saneSplit = (str, split) => str === '' ? [] : str.split(split);

// TODO extend the TreeNode ? TreeNode needs to handle the heterogeneous child list then
let XmlElement = class XmlElement extends Mixin([Serializable, Base], (base) => class XmlElement extends base {
    constructor() {
        super(...arguments);
        this.parent = undefined;
        this.childNodes = [];
        this.tagName = '';
        this.$attributes = undefined;
        this.$depth = undefined;
    }
    get attributes() {
        if (this.$attributes !== undefined)
            return this.$attributes;
        return this.$attributes = {};
    }
    set attributes(value) {
        this.$attributes = value === null
            ?
                undefined
            :
                Object.fromEntries(Object.entries(value).filter(entry => entry[1] !== undefined));
    }
    get class() {
        var _a;
        return this.$attributes ? (_a = this.attributes.class) !== null && _a !== void 0 ? _a : null : null;
    }
    set class(value) {
        this.attributes.class = isString(value) ? value : value.join(' ');
    }
    get depth() {
        if (this.$depth !== undefined)
            return this.$depth;
        let depth = 0;
        let node = this;
        while (node.parent) {
            node = node.parent;
            depth++;
        }
        return this.$depth = depth;
    }
    initialize(props) {
        super.initialize(props);
        this.childNodes && this.adoptChildren(this.childNodes);
    }
    adoptChildren(children) {
        children.forEach(child => {
            if (child instanceof XmlElement)
                child.parent = this;
        });
    }
    toString() {
        const childrenContent = this.childNodes ? this.childNodes.map(child => child.toString()) : [];
        const attributesContent = this.$attributes
            ?
                Object.entries(this.attributes)
                    .filter(entry => entry[1] !== undefined)
                    .map(([name, value]) => name + '="' + escapeXml(String(value)) + '"')
            :
                [];
        // to have predictable order of attributes in tests
        attributesContent.sort();
        return `<${this.tagName}${attributesContent.length > 0 ? ' ' + attributesContent.join(' ') : ''}>${childrenContent.join('')}</${this.tagName}>`;
    }
    appendChild(...children) {
        this.childNodes.push(...children.flat(Number.MAX_SAFE_INTEGER));
        this.adoptChildren(children);
        return children;
    }
    getAttribute(name) {
        return this.$attributes ? this.attributes[name] : undefined;
    }
    setAttribute(name, value) {
        if (value === undefined) {
            delete this.attributes[name];
        }
        else
            this.attributes[name] = value;
    }
    *parentAxis() {
        let el = this;
        while (el.parent) {
            yield el.parent;
            el = el.parent;
        }
    }
    hasClass(clsName) {
        var _a;
        return saneSplit((_a = this.attributes.class) !== null && _a !== void 0 ? _a : '', /\s+/).some(cls => cls === clsName);
    }
    getDisplayType(renderer) {
        return renderer.getDisplayType(this);
    }
    //━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // new rendering code below
    styleText(str, block) {
        return block.style.colorer.text(str);
    }
    styleIndentation(indent, block) {
        return indent;
    }
    // TODO this is a bit of mess (or may be not?)
    // used for the tree lines styling
    styleChildIndentation(indent, childBlock) {
        return undefined;
    }
    customIndentation(renderer) {
        return [this.hasClass('indented') ? ' '.repeat(renderer.indentLevel) : ''];
    }
    childCustomIndentation(renderer, child, index) {
        return undefined;
    }
    renderStreaming(context) {
        this.startStreamingRendering(context);
        this.finishStreamingRendering(context);
    }
    startStreamingRendering(context) {
        this.beforeRenderContent(context);
        this.renderContent(context);
    }
    finishStreamingRendering(context) {
        this.afterRenderContent(context);
        this.renderStreamingDone(context);
    }
    // keeping this code separate from `afterRenderContent` to let user override that method
    // this code should be executed after all `afterRenderContent` activity is completed
    renderStreamingDone(context) {
        if (context.type === 'block') {
            context.flushInlineBuffer();
            // when the rendering of the block-level element has complete,
            // need to insert pending new line into canvas
            context.canvas.newLinePending();
        }
    }
    beforeRenderContent(context) {
    }
    renderContent(context) {
        this.childNodes.forEach((child, index) => {
            this.beforeRenderChildStreaming(context, child, index);
            this.renderChildStreaming(context, child, index);
            this.afterRenderChildStreaming(context, child, index);
        });
    }
    afterRenderContent(context) {
    }
    beforeRenderChildStreaming(context, child, index) {
    }
    renderChildStreaming(context, child, index) {
        if (isString(child)) {
            context.write(child);
        }
        else {
            child.renderStreaming(context.deriveChildBlock(child, index));
        }
    }
    afterRenderChildStreaming(context, child, index) {
    }
}) {
};
XmlElement = __decorate([
    serializable({ id: 'XmlElement' })
], XmlElement);
//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const escapeTable = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&apos;'
};
const escapeXml = (xmlStr) => xmlStr.replace(/[&<>"']/g, match => escapeTable[match]);
//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// TODO should probably be the opposite - Element should extend Fragment
//  (fragment only has child nodes, element adds the "shell" - tag name and attributes)
class XmlFragment extends Mixin([XmlElement], (base) => class XmlFragment extends base {
}) {
}

//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
class ElementReactivity extends Mixin([], (base) => class ElementReactivity extends base {
    constructor() {
        super(...arguments);
        this.$el = undefined;
        this.eventListeners = undefined;
        this.eventListenersAdded = false;
        this.classAttributeSources = undefined;
        this.styleAttributeSources = undefined;
        this.classActivators = undefined;
        this.styleProperties = undefined;
        this.reactiveChildren = undefined;
        this.$classAttributeBox = undefined;
        this.$styleAttributeBox = undefined;
        this.$classActivatorBoxes = undefined;
        this.$stylePropertiesBoxes = undefined;
        this.$effect = undefined;
    }
    get el() {
        return this.$el;
    }
    set el(value) {
        this.$el = value;
    }
    addEventListener(entry) {
        if (!this.eventListeners)
            this.eventListeners = [];
        this.eventListeners.push(entry);
    }
    addClassAttributeSource(source, toBeginning = false) {
        if (!this.classAttributeSources)
            this.classAttributeSources = [];
        if (toBeginning)
            this.classAttributeSources.unshift(source);
        else
            this.classAttributeSources.push(source);
    }
    addStyleAttributeSource(source, toBeginning = false) {
        if (!this.styleAttributeSources)
            this.styleAttributeSources = [];
        if (toBeginning)
            this.styleAttributeSources.unshift(source);
        else
            this.styleAttributeSources.push(source);
    }
    addClassActivator(className, source) {
        if (!this.classActivators)
            this.classActivators = {};
        this.classActivators[className] = source;
    }
    addStyleProperty(propertyName, source) {
        if (!this.styleProperties)
            this.styleProperties = {};
        this.styleProperties[propertyName] = source;
    }
    adoptReactiveProperties(categorizedProperties) {
        categorizedProperties.events.forEach(entry => this.addEventListener(entry));
        categorizedProperties.classActivators.forEach(([key, source]) => this.addClassActivator(key, source));
        categorizedProperties.styleProperties.forEach(([key, source]) => this.addStyleProperty(key, source));
        if (categorizedProperties.classAttribute)
            this.addClassAttributeSource(categorizedProperties.classAttribute);
        if (categorizedProperties.styleAttribute)
            this.addStyleAttributeSource(categorizedProperties.styleAttribute);
    }
    get classAttributeBox() {
        if (this.$classAttributeBox !== undefined)
            return this.$classAttributeBox;
        if (!this.classAttributeSources)
            return this.$classAttributeBox = null;
        if (this.classAttributeSources.every(source => !isReactive(source))) {
            setProperty(this.el, 'class', this.classAttributeSources.join(' '));
            return this.$classAttributeBox = null;
        }
        else {
            const box = CalculableBox.new({
                calculation: () => this.classAttributeSources.map(resolvePropertySource).join(' ')
            });
            box.commitValueOptimisticHook.on((self, newValue, oldValue) => setProperty(this.el, 'class', newValue));
            return this.$classAttributeBox = box;
        }
    }
    get styleAttributeBox() {
        if (this.$styleAttributeBox !== undefined)
            return this.$styleAttributeBox;
        if (!this.styleAttributeSources)
            return this.$styleAttributeBox = null;
        if (this.styleAttributeSources.every(source => !isReactive(source))) {
            setProperty(this.el, 'style', this.styleAttributeSources.join(';'));
            return this.$styleAttributeBox = null;
        }
        else {
            const box = CalculableBox.new({
                calculation: () => this.styleAttributeSources.map(resolvePropertySource).join(';')
            });
            box.commitValueOptimisticHook.on((self, newValue, oldValue) => setProperty(this.el, 'style', newValue));
            return this.$styleAttributeBox = box;
        }
    }
    get classActivatorBoxes() {
        if (this.$classActivatorBoxes !== undefined)
            return this.$classActivatorBoxes;
        const reactive = [];
        Object.entries(this.classActivators || []).forEach(([prop, source]) => {
            if (!isReactive(source)) {
                setProperty(this.el, `class:${prop}`, source);
            }
            else {
                const box = CalculableBox.new({
                    calculation: () => {
                        if (this.classAttributeBox)
                            this.classAttributeBox.read();
                        return resolvePropertySource(source);
                    }
                });
                box.commitValueOptimisticHook.on((self, newValue, oldValue) => this.el.classList.toggle(prop, newValue));
                reactive.push(box);
            }
        });
        return this.$classActivatorBoxes = reactive;
    }
    get stylePropertiesBoxes() {
        if (this.$stylePropertiesBoxes !== undefined)
            return this.$stylePropertiesBoxes;
        const reactive = [];
        Object.entries(this.styleProperties || []).forEach(([prop, source]) => {
            if (!isReactive(source)) {
                setProperty(this.el, `style:${prop}`, source);
            }
            else {
                const box = CalculableBox.new({
                    calculation: () => {
                        if (this.styleAttributeBox)
                            this.styleAttributeBox.read();
                        return resolvePropertySource(source);
                    }
                });
                box.commitValueOptimisticHook.on((self, newValue, oldValue) => this.el.style.setProperty(prop, newValue));
                reactive.push(box);
            }
        });
        return this.$stylePropertiesBoxes = reactive;
    }
    get effect() {
        if (this.$effect !== undefined)
            return this.$effect;
        this.$effect = CalculableBox.new({
            // TODO
            // should be lazy, only the top element's reactivity should be strict, reading from the children's
            // reactivities
            lazy: false,
            // TODO
            // HACK, in theory should not trigger the `commitValueOptimisticHook` on the same value
            // this is to avoid recalculating parent effects
            equality: () => true,
            calculation: () => {
                if (!this.eventListenersAdded) {
                    this.eventListenersAdded = true;
                    this.eventListeners && this.eventListeners.forEach(entry => addEventListener(this.el, entry[0], entry[1]));
                }
                [
                    this.classAttributeBox,
                    this.styleAttributeBox,
                    ...this.classActivatorBoxes,
                    ...this.stylePropertiesBoxes
                ].forEach(box => box && box.read());
                if (this.reactiveChildren) {
                    const children = resolveElementSource(this.reactiveChildren);
                    children.forEach((childNode) => {
                        // TODO this should be done "deep"
                        if (childNode.reactivity)
                            childNode.reactivity.effect.read();
                    });
                    return children;
                }
            }
        });
        if (this.reactiveChildren)
            this.$effect.commitValueOptimisticHook.on((self, newValue, oldValue) => reconcileChildNodes(this.el, newValue));
        return this.$effect;
    }
    static fromJSX(element, categorizedProperties, normalizedChildren) {
        const reactivity = new this;
        // @ts-ignore
        element.reactivity = reactivity;
        reactivity.el = element;
        reactivity.adoptReactiveProperties(categorizedProperties);
        categorizedProperties.otherProperties.forEach(([propertyName, value]) => setProperty(element, propertyName, value));
        if (normalizedChildren.hasReactivity) {
            reactivity.reactiveChildren = normalizedChildren.normalized;
        }
        else {
            element.append(...normalizedChildren.normalized);
        }
        reactivity.effect;
        return reactivity;
    }
}) {
}
//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Slightly modified version of: https://github.com/ryansolid/dom-expressions/blob/main/packages/dom-expressions/src/reconcile.js
function reconcileChildNodes(parentNode, newNodes) {
    const prevNodes = Array.from(parentNode.childNodes);
    const bLength = newNodes.length;
    let aEnd = prevNodes.length;
    let bEnd = bLength;
    let aStart = 0;
    let bStart = 0;
    if (aEnd === 0 || bEnd === 0) {
        // @ts-ignore
        parentNode.replaceChildren(...newNodes);
        return;
    }
    const after = prevNodes[aEnd - 1].nextSibling;
    let map = null;
    while (aStart < aEnd || bStart < bEnd) {
        // common prefix
        while (prevNodes[aStart] === newNodes[bStart]) {
            aStart++;
            bStart++;
            if (aStart >= aEnd && bStart >= bEnd)
                return;
        }
        // common suffix
        while (prevNodes[aEnd - 1] === newNodes[bEnd - 1]) {
            aEnd--;
            bEnd--;
            if (aStart >= aEnd && bStart >= bEnd)
                return;
        }
        // append
        if (aEnd === aStart) {
            const node = bEnd < bLength
                ?
                    bStart
                        ? newNodes[bStart - 1].nextSibling
                        : newNodes[bEnd - bStart]
                :
                    after;
            while (bStart < bEnd)
                parentNode.insertBefore(newNodes[bStart++], node);
        }
        // remove
        else if (bEnd === bStart) {
            while (aStart < aEnd) {
                if (!map || !map.has(prevNodes[aStart]))
                    parentNode.removeChild(prevNodes[aStart]);
                aStart++;
            }
        }
        // swap backward
        else if (prevNodes[aStart] === newNodes[bEnd - 1] && newNodes[bStart] === prevNodes[aEnd - 1]) {
            const node = prevNodes[--aEnd].nextSibling;
            parentNode.insertBefore(newNodes[bStart++], prevNodes[aStart++].nextSibling);
            parentNode.insertBefore(newNodes[--bEnd], node);
            // @ts-ignore
            prevNodes[aEnd] = newNodes[bEnd];
        }
        // fallback to map
        else {
            if (!map) {
                map = new Map();
                let i = bStart;
                while (i < bEnd)
                    map.set(newNodes[i], i++);
            }
            const index = map.get(prevNodes[aStart]);
            if (index !== undefined) {
                if (bStart < index && index < bEnd) {
                    let i = aStart;
                    let sequence = 1;
                    while (++i < aEnd && i < bEnd) {
                        const t = map.get(prevNodes[i]);
                        if (t == null || t !== index + sequence)
                            break;
                        sequence++;
                    }
                    if (sequence > index - bStart) {
                        const node = prevNodes[aStart];
                        // ??? multiple `insertBefore` calls with the same node?
                        while (bStart < index)
                            parentNode.insertBefore(newNodes[bStart++], node);
                    }
                    else
                        parentNode.replaceChild(newNodes[bStart++], prevNodes[aStart++]);
                }
                else
                    aStart++;
            }
            else
                parentNode.removeChild(prevNodes[aStart++]);
        }
    }
}

//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
class ComponentCommon extends Mixin([], (base) => class ComponentCommon extends base {
    constructor() {
        super(...arguments);
        // TODO unify with `children` in Component
        this.childrenNodes = [];
        this.categorizedProperties = undefined;
    }
}) {
}
//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
class Component extends Mixin([ComponentCommon, Entity, ElementReactivity, Base], (base) => class Component extends base {
    constructor() {
        super(...arguments);
        this.children = [];
    }
    get el() {
        if (this.$el !== undefined)
            return this.$el;
        const el = this.$el = this.render();
        let plainElement = !el.reactivity;
        if (plainElement)
            el.reactivity = this;
        const reactivity = el.reactivity;
        const categorizedProperties = this.categorizedProperties;
        this.categorizedProperties = undefined;
        reactivity.adoptReactiveProperties(categorizedProperties);
        if (plainElement) {
            const existingClasses = Array.from(el.classList);
            existingClasses.reverse();
            existingClasses.forEach(cls => reactivity.addClassAttributeSource(cls, true));
            reactivity.addStyleAttributeSource(el.getAttribute('style'), true);
            reactivity.$effect = super.effect;
        }
        else
            reactivity.effect;
        // @ts-ignore
        el.comp = this;
        return el;
    }
    set el(value) {
    }
    get effect() {
        if (this.$effect !== undefined)
            return this.$effect;
        return this.$effect = this.el.reactivity.effect;
    }
    initialize(props) {
        const categorizedProperties = this.categorizedProperties = categorizeProperties(props);
        super.initialize(Object.fromEntries(categorizedProperties.otherProperties));
        categorizedProperties.otherProperties = [];
        this.enterGraph(globalGraph);
    }
    render() {
        throw new Error("Abstract method called");
    }
    destroy() {
    }
}) {
}
//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
class WebComponent extends Mixin([ComponentCommon, Entity, HTMLElement], (base) => class WebComponent extends base {
    constructor() {
        super(...arguments);
        this.reactivity = undefined;
    }
    initialize(props) {
        this.attachShadow({ mode: 'open' });
        const categorizedProperties = this.categorizedProperties = categorizeProperties(props);
        Object.assign(this, Object.fromEntries(categorizedProperties.otherProperties));
        categorizedProperties.otherProperties = [];
        this.enterGraph(globalGraph);
        const reactivity = this.reactivity = new ElementReactivity();
        reactivity.el = this;
        reactivity.adoptReactiveProperties(categorizedProperties);
    }
    static new(props) {
        const instance = new this();
        instance.initialize(props);
        return instance;
    }
    render() {
        return undefined;
    }
    connectedCallback() {
    }
    disconnectedCallback() {
    }
}) {
}

//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const resolvePropertySource = (src) => {
    let source = src;
    while (true) {
        if (source instanceof BoxUnbound) {
            source = source.read();
        }
        else if (isSyncFunction(source)) {
            source = source();
        }
        else
            break;
    }
    return source;
};
const isReactive = (source) => {
    return isSyncFunction(source) || (source instanceof BoxUnbound);
};
const isEventHandler = (propertyName) => {
    return /^(on:?|listen:|capture:).*/.test(propertyName);
};
const matchEventHandler = (propertyName) => {
    const match = /^(on:?|listen:|capture:)(.*)/.exec(propertyName);
    return match
        ? {
            type: match[1] === 'on:' || match[1] === 'on' || match[1] === 'listen:' ? 'listeningEventHandler' : 'capturingEventHandler',
            eventName: match[2]
        }
        : undefined;
};
const matchSpecialProperty = (propertyName) => {
    const match = /(.*?):(.*)/.exec(propertyName);
    if (match) {
        if (match[1] === 'class')
            return ['classActivator', match[2]];
        if (match[1] === 'style')
            return ['styleProperty', match[2]];
        return undefined;
    }
    else
        return undefined;
};
const categorizeProperties = (properties) => {
    const result = {
        events: [],
        classAttribute: undefined,
        styleAttribute: undefined,
        classActivators: [],
        styleProperties: [],
        otherProperties: [],
        reactiveCounter: 0
    };
    properties && Object.entries(properties).forEach(entry => {
        const [key, source] = entry;
        if (isEventHandler(key)) {
            if (!isFunction(source))
                throw new Error("Not a function supplied for a event listener property");
            result.events.push(entry);
        }
        else if (key === 'class') {
            result.classAttribute = source;
            if (isReactive(source))
                result.reactiveCounter++;
        }
        else if (key === 'style') {
            result.styleAttribute = source;
            if (isReactive(source))
                result.reactiveCounter++;
        }
        else {
            const specialProperty = matchSpecialProperty(key);
            if (specialProperty) {
                if (specialProperty[0] === 'styleProperty') {
                    result.styleProperties.push([specialProperty[1], source]);
                }
                else if (specialProperty[0] === 'classActivator') {
                    result.classActivators.push([specialProperty[1], source]);
                }
            }
            else {
                result.otherProperties.push(entry);
            }
            if (isReactive(source))
                result.reactiveCounter++;
        }
    });
    return result;
};
//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const addEventListener = (element, name, listener) => {
    let eventHandlerMatch = matchEventHandler(name);
    if (eventHandlerMatch)
        element.addEventListener(eventHandlerMatch.eventName, listener, eventHandlerMatch.type === 'capturingEventHandler');
};
//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const setProperty = (element, name, value, asAttribute = false) => {
    const specialProperty = matchSpecialProperty(name);
    if (specialProperty) {
        if (specialProperty[0] === 'styleProperty') {
            element.style.setProperty(specialProperty[1], value);
        }
        else if (specialProperty[0] === 'classActivator') {
            element.classList.toggle(specialProperty[1], value);
        }
    }
    else {
        if (name === 'class')
            element.className = value;
        else
            asAttribute ? element.setAttribute(name, String(value)) : element[name] = value;
    }
};
//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const applyStaticProperties = (element, categorizedProperties) => {
    if (categorizedProperties.reactiveCounter > 0)
        throw new Error("Should only be called for static-only properties");
    categorizedProperties.events.forEach(([propertyName, listener]) => addEventListener(element, propertyName, listener));
    if (categorizedProperties.classAttribute)
        setProperty(element, 'class', categorizedProperties.classAttribute);
    if (categorizedProperties.styleAttribute)
        setProperty(element, 'style', categorizedProperties.styleAttribute);
    [
        ...categorizedProperties.classActivators,
        ...categorizedProperties.styleProperties,
        ...categorizedProperties.otherProperties
    ].forEach(([propertyName, value]) => setProperty(element, propertyName, value));
};
const applyStaticChildren = (element, children) => {
    children.forEach(child => {
        if (child.reactivity)
            child.reactivity.effect.read();
    });
    element.append(...children);
};
const normalizeElementSource = (source, result = { normalized: [], hasReactivity: false }) => {
    const normalized = result.normalized;
    if (source instanceof Node) {
        normalized.push(source);
    }
    else if (source == null || source === true || source === false) ;
    else if (isNumber(source)) {
        normalized.push(document.createTextNode(String(source)));
    }
    else if (isString(source)) {
        normalized.push(document.createTextNode(source));
    }
    else if (isArray(source)) {
        source.forEach(source => normalizeElementSource(source, result));
    }
    else if (isSyncFunction(source)) {
        const box = CalculableBox.new({
            calculation: () => resolveElementSource(source)
        });
        normalized.push(box);
        result.hasReactivity = true;
    }
    else if ((source instanceof BoxUnbound)) {
        normalized.push(source);
        result.hasReactivity = true;
    }
    else if (source instanceof XmlElement) {
        normalized.push(convertXmlElement(source));
    }
    else {
        throw new Error("Unknown JSX element source");
    }
    return result;
};
const resolveElementSource = (source, result = []) => {
    if (source instanceof Node) {
        result.push(source);
    }
    else if (source == null || source === true || source === false) ;
    else if (isNumber(source)) {
        result.push(document.createTextNode(String(source)));
    }
    else if (isString(source)) {
        result.push(document.createTextNode(source));
    }
    else if (isArray(source)) {
        source.forEach(source => resolveElementSource(source, result));
    }
    else if (source instanceof XmlElement) {
        result.push(convertXmlElement(source));
    }
    else if (isSyncFunction(source)) {
        resolveElementSource(source(), result);
    }
    else {
        resolveElementSource(source.read(), result);
    }
    return result;
};
const convertXmlElement = (source, asAttributes = false) => {
    const el = document.createElement(source.tagName);
    Object.entries(source.$attributes || {}).forEach(([key, value]) => setProperty(el, key, value, asAttributes));
    el.append(...source.childNodes.map(childNode => isString(childNode) ? document.createTextNode(childNode) : convertXmlElement(childNode, asAttributes)));
    return el;
};
//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
var ChronoGraphJSX;
(function (ChronoGraphJSX) {
    ChronoGraphJSX.FragmentSymbol = Symbol('FragmentSymbol');
    function createElement(tagName, attributes, ...children) {
        if (isString(tagName)) {
            const element = document.createElement(tagName);
            const categorizedProperties = categorizeProperties(attributes);
            const normalizedChildren = normalizeElementSource(children);
            if (categorizedProperties.reactiveCounter === 0 && !normalizedChildren.hasReactivity) {
                applyStaticProperties(element, categorizedProperties);
                applyStaticChildren(element, normalizedChildren.normalized);
            }
            else {
                ElementReactivity.fromJSX(element, categorizedProperties, normalizedChildren);
            }
            return element;
        }
        else if (tagName === ChronoGraphJSX.FragmentSymbol) {
            const normalizedChildren = normalizeElementSource(children);
            if (normalizedChildren.hasReactivity) {
                return () => resolveElementSource(normalizedChildren.normalized);
            }
            else {
                return normalizedChildren.normalized;
            }
        }
        else if (isSyncFunction(tagName) && (tagName.prototype instanceof Component)) {
            const component = tagName.new(Object.assign({}, attributes, { children }));
            return component.el;
        }
        else if (isSyncFunction(tagName) && (tagName.prototype instanceof WebComponent)) {
            const component = tagName.new(Object.assign({}, attributes, { childrenNodes: children }));
            return component;
        }
        else {
            throw new Error("Unknown JSX source");
        }
    }
    ChronoGraphJSX.createElement = createElement;
})(ChronoGraphJSX || (ChronoGraphJSX = {}));

/** @jsx ChronoGraphJSX.createElement */
//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
class Application extends Component {
    constructor() {
        super(...arguments);
        this.signals = null;
        this.flush = 0;
    }
    render() {
        return ChronoGraphJSX.createElement("div", { class: "sorting-application" },
            ChronoGraphJSX.createElement("div", { class: "sorting-application__signals" }, () => {
                this.flush;
                return this.signals.map(signal => ChronoGraphJSX.createElement("div", { class: "signal_box" }, () => signal.readProposedOrPrevious()));
            }),
            ChronoGraphJSX.createElement("div", { class: "sorting-application__toolbar" },
                ChronoGraphJSX.createElement("button", { type: "button", class: "sorting-sort-btn", "on:click": () => globalGraph.commit() }, "Sort"),
                ChronoGraphJSX.createElement("button", { type: "button", class: "sorting-sort-btn", "on:click": () => {
                        for (const signal of this.signals)
                            signal.write(rnd());
                        this.flush++;
                        // @ts-ignore
                        this.el.childNodes[0].reactivity.effect.read();
                    } }, "Randomize")));
    }
}
__decorate([
    field()
], Application.prototype, "signals", void 0);
__decorate([
    field()
], Application.prototype, "flush", void 0);

globalGraph.autoCommit = false;
globalGraph.historyLimit = 0;
// set up the sorting data
const SIGNAL_NUM = 10;
// @ts-ignore
const signals = window.signals = [];
for (let i = 0; i < SIGNAL_NUM; i++) {
    if (i === 0) {
        const signal = CalculableBox.new({
            lazy: false,
            calculation() {
                return this.readProposedOrPrevious();
            }
        });
        signal.write(rnd());
        signals.push(signal);
    }
    else {
        const signal = CalculableBox.new({
            lazy: false,
            calculation() {
                // @ts-ignore
                const idx = this.idx;
                const me = signals[idx];
                const prev = signals[idx - 1];
                const myValue = me.readProposedOrPrevious();
                const prevValue = prev.read();
                if (myValue < prevValue) {
                    // swap the values
                    me.write(prevValue);
                    prev.write(myValue);
                    return prevValue;
                }
                else {
                    // do nothing, return the input value
                    return myValue;
                }
            }
        });
        // @ts-ignore
        signal.idx = i;
        signal.write(rnd());
        signals.push(signal);
    }
}
// init the UI
const app = Application.new({ signals });
document.body.appendChild(app.el);
