import { SvelteComponentTyped } from "svelte";
declare const __propDef: {
    props: {
        description: string;
    };
    events: {
        [evt: string]: CustomEvent<any>;
    };
    slots: {
        default: {};
    };
};
export type SlotInfoProps = typeof __propDef.props;
export type SlotInfoEvents = typeof __propDef.events;
export type SlotInfoSlots = typeof __propDef.slots;
export default class SlotInfo extends SvelteComponentTyped<SlotInfoProps, SlotInfoEvents, SlotInfoSlots> {
}
export {};
