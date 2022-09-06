import { SvelteComponentTyped } from "svelte";
import type * as Props from './props';
declare const __propDef: {
    props: {
        kind?: Props.ButtonKind;
        size?: Props.ButtonSize;
        isLoading?: boolean;
        isDisabled?: boolean;
    };
    events: {
        click: CustomEvent<any>;
    } & {
        [evt: string]: CustomEvent<any>;
    };
    slots: {
        default: {};
    };
};
export declare type ButtonProps = typeof __propDef.props;
export declare type ButtonEvents = typeof __propDef.events;
export declare type ButtonSlots = typeof __propDef.slots;
export default class Button extends SvelteComponentTyped<ButtonProps, ButtonEvents, ButtonSlots> {
}
export {};
