import { AttachedBehaviorDirective } from "./directive";
import { CaptureType } from "../template";
import { NodeBehaviorBehaviorOptions, NodeObservationBehavior } from "./node-observation";

export interface ChildrenBehaviorOptions<T = any>
    extends NodeBehaviorBehaviorOptions<T>,
        MutationObserverInit {}

export class ChildrenBehavior extends NodeObservationBehavior<ChildrenBehaviorOptions> {
    private observer: MutationObserver | null = null;

    constructor(target: HTMLSlotElement, options: ChildrenBehaviorOptions) {
        super(target, options);
    }

    getNodes() {
        return Array.from(this.target.childNodes);
    }

    observe() {
        if (this.observer === null) {
            this.observer = new MutationObserver(this.handleEvent.bind(this));
        }

        this.observer.observe(this.target, this.options);
    }

    unobserve() {
        this.observer!.disconnect();
    }
}

export function children<T = any>(
    propertyOrOptions: (keyof T & string) | ChildrenBehaviorOptions<keyof T & string>
): CaptureType<T> {
    if (typeof propertyOrOptions === "string") {
        propertyOrOptions = {
            property: propertyOrOptions,
            childList: true,
        };
    }

    return new AttachedBehaviorDirective(
        "fast-children",
        ChildrenBehavior,
        propertyOrOptions as any
    );
}
