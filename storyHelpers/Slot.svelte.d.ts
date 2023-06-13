import { SvelteComponentTyped } from 'svelte'
declare const __propDef: {
  props: {
    name: string
    explanation: string
  }
  events: {
    [evt: string]: CustomEvent<any>
  }
  slots: {
    default: {}
  }
}
export type SlotProps = typeof __propDef.props
export type SlotEvents = typeof __propDef.events
export type SlotSlots = typeof __propDef.slots
export default class Slot extends SvelteComponentTyped<
  SlotProps,
  SlotEvents,
  SlotSlots
> {}
export {}
