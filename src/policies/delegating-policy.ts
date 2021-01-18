import { PolicyBase, PolicyOutcome } from "../ipolicy";
import { ResilientContext } from "../resilient-context";

export class DelegatingPolicy extends PolicyBase {
    private readonly _callback: (ctx: ResilientContext) => Promise<PolicyOutcome>;

    constructor(callback: (ctx: ResilientContext) => Promise<PolicyOutcome>) {
        super();
        this._callback = callback;
    }

    protected async runCore(ctx: ResilientContext): Promise<PolicyOutcome> {
        return await this._callback(ctx);
    }
}
