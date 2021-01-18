import { DelegatingRequestHandler, IRequestHandler } from "@aster-js/http";
import { ResilientCallback, ResilientPolicyOptions } from "../resilient-callback";

export class ResilientRequestHandler extends DelegatingRequestHandler {

    constructor(innerHandler: IRequestHandler, options: ResilientPolicyOptions) {
        super(innerHandler);
        this.fetch = ResilientCallback.create(super.fetch, options);
    }
}
