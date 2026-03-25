/** Shared with sorting.ts — change `MAX_VALUE` in one place. */
export const MAX_VALUE = 10

export function rnd () : number {
    return Math.floor(Math.random() * MAX_VALUE)
}
