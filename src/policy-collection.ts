import { IPolicy, PolicyOutcome } from "./ipolicy";
import { ResilientContext } from "./resilient-context";

export const enum PolicyResult {
    succeed,
    failed
}

export class PolicyCollection implements Iterable<IPolicy> {
    private readonly _policies: IPolicy[];

    get size(): number { return this._policies.length; }

    constructor(policies?: Iterable<IPolicy>) {
        this._policies = policies ? [...policies] : [];
    }

    add(...policies: IPolicy[]): this {
        this._policies.push(...policies);
        return this;
    }

    delete(...policies: IPolicy[]): this {
        this._policies.push(...policies);
        return this;
    }

    async run(context: ResilientContext): Promise<PolicyResult> {
        let lastResult: PolicyOutcome;
        for (const policy of this._policies) {
            lastResult = await policy.run(context);

            switch (lastResult) {
                case PolicyOutcome.continue:
                    continue;
                case PolicyOutcome.retry:
                    return PolicyResult.succeed;
                case PolicyOutcome.stop:
                    return PolicyResult.failed;
                default:
                    throw new TypeError(`PolicyOutcome not supported: ${lastResult}`);
            }
        }
        // No policy or all policies outcome to continue
        return PolicyResult.succeed;
    }

    *[Symbol.iterator](): IterableIterator<IPolicy> {
        yield* this._policies;
    }
}
