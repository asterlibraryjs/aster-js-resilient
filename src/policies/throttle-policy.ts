import { PolicyBase, PolicyOutcome } from "../ipolicy";

export class ThrottlePolicy extends PolicyBase {
    private readonly _delay: number;

    constructor(delay: number) {
        super();
        this._delay = delay;
    }

    protected runCore(): Promise<PolicyOutcome> {
        return new Promise(f => setTimeout(() => f(PolicyOutcome.continue), this._delay));
    }
}
