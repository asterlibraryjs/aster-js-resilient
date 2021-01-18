import { PolicyBase, PolicyOutcome } from "../ipolicy";
import { ResilientContext } from "../resilient-context";

export class TimeoutPolicy extends PolicyBase {
    private readonly _timeout: number;

    constructor(timeout: number) {
        super();
        this._timeout = timeout;
    }

    protected async runCore(ctx: ResilientContext): Promise<PolicyOutcome> {
        const timeout = ctx.startTime + this._timeout;
        return Date.now() < timeout ? PolicyOutcome.continue : PolicyOutcome.stop;
    }
}
