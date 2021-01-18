# @aster-js/resilient

This library provides objects to manage resiliency.

### Quick sample

```typescript
const loadDataCallback = ResilientCallback.create(
    async () => {
        // Unsafe code that load some data
    },
    { waitAndRetry: [100, 500, 1000] }
);

async function load(): Promise<any> {
    const data = await loadDataCallback();
    console.warn(result);
}
```

- [Resilient Callback](./doc/resilient-callback.md)
- [IPolicy](./doc/ipolicy.md)
