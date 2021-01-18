import { PolicyBase } from "../ipolicy";
import { ResilientContext } from "../resilient-context";
import { PolicyOutcome } from "../ipolicy";

export class WaitAndRetryPolicy extends PolicyBase {
    private readonly _retryTimes: number[];

    constructor(retryTimes: number[]) {
        super();
        this._retryTimes = retryTimes;
    }

    protected async runCore(ctx: ResilientContext): Promise<PolicyOutcome> {
        if (ctx.retryCount < this._retryTimes.length) {
            return new Promise(
                f => setTimeout(() => f(PolicyOutcome.continue),
                    this._retryTimes[ctx.retryCount])
            );
        }
        return PolicyOutcome.stop;
    }
}
