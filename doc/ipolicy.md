## IPolicy

Implementing `IPolicy` allow custom resiliency rules. Each time a call failed, the policy will be evaluated if none of its pre-registered sibling has not already stop the resiliency.

### Example:

This exemple will allow to ignore all `CustomError` that contains a specific binary flag in there error code, if not, this error shouldn't be retryed. If the handled error is not a `CustomError` the policy will not be able to decide by itself and allow other policy to run.

```typescript
export class CustomPolicy extends IPolicy {
    run(ctx: ResilientContext): Promise<PolicyOutcome> {
        if(ctx.lastError instanceof CustomError) {
            if(ctx.lastError.code & 0x08) {
                // Will allow imediate retry
                // without asking other policies
                return PolicyOutcome.retry;
            }

            // Will stop resiliency
            return PolicyOutcome.stop;
        }
        // Will continue to validate other policies
        return PolicyOutcome.continue;
    }
}
```
