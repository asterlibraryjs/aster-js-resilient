import { ResilientContext } from "./resilient-context";

export const enum PolicyOutcome {
    retry,
    continue,
    stop
}

export interface IPolicy {
    run(ctx: ResilientContext): Promise<PolicyOutcome>;
}

export abstract class PolicyBase implements IPolicy {

    async run(ctx: ResilientContext): Promise<PolicyOutcome> {
        if (ctx.token.aborted) return PolicyOutcome.stop;
        return this.runCore(ctx);
    }

    protected abstract runCore(ctx: ResilientContext): Promise<PolicyOutcome>;
}
