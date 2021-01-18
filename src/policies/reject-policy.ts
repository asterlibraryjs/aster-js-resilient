import {  IPolicy, PolicyOutcome } from "../ipolicy";

export class RejectPolicy implements IPolicy {

    async run(): Promise<PolicyOutcome> {
        return PolicyOutcome.stop;
    }
}
