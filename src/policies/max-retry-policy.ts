import { PolicyBase } from "../ipolicy";
import { ResilientContext } from "../resilient-context";
import { PolicyOutcome } from "../ipolicy";

export class MaxRetryPolicy extends PolicyBase {
    private readonly _maxRetry: number;

    constructor(maxRetry: number) {
        super();
        this._maxRetry = maxRetry;
    }

    protected async runCore(ctx: ResilientContext): Promise<PolicyOutcome> {
        return ctx.retryCount < this._maxRetry ? PolicyOutcome.continue : PolicyOutcome.stop;
    }
}
