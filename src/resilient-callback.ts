import { AbortToken } from "@aster-js/async";
import { IPolicy } from "./ipolicy";
import { MaxRetryPolicy } from "./policies/max-retry-policy";
import { ThrottlePolicy } from "./policies/throttle-policy";
import { TimeoutPolicy } from "./policies/timeout-policy";
import { WaitAndRetryPolicy } from "./policies/wait-and-retry-policy";
import { PolicyCollection, PolicyResult } from "./policy-collection";
import { ResilienceFailError } from "./resilience-fail-error";
import { ResilientContext } from "./resilient-context";

export type ResilientDelegate<TArgs extends any[], TResult> = (...args: TArgs) => Promise<TResult>;

export interface ResilientPolicyOptions {
    readonly waitAndRetry?: number[];
    readonly maxRetry?: number;
    readonly timeout?: number;
    readonly throttle?: number;
    readonly policies?: IPolicy[];
}

export namespace ResilientCallback {

    export function create<TArgs extends any[] = any[], TResult = any>(
        callback: ResilientDelegate<TArgs, TResult>,
        options: ResilientPolicyOptions
    ) {
        const policies = new PolicyCollection(resolvePolicies(options));

        return async function (this: any, ...args: [...TArgs, AbortToken?]): Promise<TResult> {
            const last = args[args.length - 1];
            const token = AbortToken.isValidToken(last) ? last : AbortToken.none;
            const ctx = new ResilientContext(token);
            do {
                try {
                    return await callback.call(this, ...args as any);
                }
                catch (err) {
                    ctx.onAttemptFail(err);
                }

                if (await policies.run(ctx) === PolicyResult.failed) {
                    throw new ResilienceFailError("Retry fetching data failed too many times", ctx);
                }

                token.throwIfAborted();
            }
            while (true);
        }
    }
    
    function* resolvePolicies(options: ResilientPolicyOptions): Iterable<IPolicy> {
        if (typeof options.waitAndRetry !== "undefined") {
            yield new WaitAndRetryPolicy(options.waitAndRetry);
        }
        if (typeof options.maxRetry !== "undefined") {
            yield new MaxRetryPolicy(options.maxRetry);
        }
        if (typeof options.timeout !== "undefined") {
            yield new TimeoutPolicy(options.timeout);
        }
        if (typeof options.throttle !== "undefined") {
            yield new ThrottlePolicy(options.throttle);
        }
        if (typeof options.policies !== "undefined") {
            yield* options.policies;
        }
    }
}
