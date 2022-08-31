import React from "react";
import type { SvelteComponent, SvelteComponentTyped } from "svelte";
export declare type SvelteProps<T> = T extends SvelteComponentTyped<infer Props, any, any> ? Props : {};
export declare type SvelteEvents<T> = T extends SvelteComponentTyped<any, infer Events, any> ? Events : {};
export declare type ReactProps<Props, Events> = Props & {
    [P in keyof Events as `on${Capitalize<P & string>}`]: (e: Events[P]) => void;
};
/**
 *
 * @param tag custom element tag name for svelte component
 * @param component The imported svelte component itself. This is not used, but ensures that the component's code has been included in the bundle.
 * @returns A react component
 */
export default function SvelteWebComponentToReact<T extends Record<string, any>>(tag: string, component: typeof SvelteComponent): (props: React.PropsWithChildren<T>) => React.ReactElement<{
    ref: (ref: SvelteComponent) => void;
    children: React.ReactNode;
}, string | React.JSXElementConstructor<any>>;
