import { DelegatingTaskHandler, ITaskHandler } from "@aster-js/async";
import { ResilientCallback, ResilientPolicyOptions } from "../resilient-callback";

export class ResilientTaskHandler extends DelegatingTaskHandler {

    constructor(innerHandler: ITaskHandler, options: ResilientPolicyOptions) {
        super(innerHandler);
        this.run = ResilientCallback.create(super.run, options);
    }
}
