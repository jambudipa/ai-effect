---
Name: Effect v4 (TypeScript)
Source: https://github.com/Effect-TS/effect/tree/effect%404.1.5
Last Updated: 2026-11-23
---

# Effect v4 Review Rules

> Target: `effect` 4.1.5. Use the Effect ESLint bundle and `@effect/language-service`
> for findings they enforce. Use these rules for behaviour that requires review.

## PR Review Comment Format

When you report a violation from this guide, use this format:

```
**[{Rule-ID}: {Rule Name}]** {SEVERITY}
**Issue:** Brief description of what's wrong
**Why this matters:** Explanation from the style guide
**Suggested fix:**
  {corrected code}
**Reference:** {link to official guide section}
```

Severity: CRITICAL blocks the merge. IMPORTANT needs a fix or a written reason. RECOMMENDED is advisory.

---

## Naming Conventions

### EFX-01: Operation lacks a span at a trace boundary

**Reference:** https://github.com/Effect-TS/effect/blob/effect%404.1.5/LLMS.md#using-effectfn
**Do:** Use `Effect.fn("Owner.method")` at the trace boundary. Use `Effect.fnUntraced` for reusable generators on hot paths.
**Avoid:** An unnamed operation where a span is necessary, or a copied span name from a different operation.
**Why?** The name becomes the tracing span and the stack frame. Without it, a failure in production shows an anonymous generator, and traces cannot attribute latency to the operation. A copied name that does not match is worse, because it points investigators at the wrong code.

**(AVOID) Example:**
```ts
export const loadProfile = (id: ProfileId) =>
  Effect.gen(function* () {
    const profiles = yield* Profiles
    return yield* profiles.find(id)
  })
```

**Correct Example:**
```ts
export const loadProfile = Effect.fn("Profiles.load")(function* (id: ProfileId) {
  const profiles = yield* Profiles
  return yield* profiles.find(id)
})
```

### EFX-02: Service identifier that can collide

**Reference:** https://github.com/Effect-TS/effect/blob/effect%404.1.5/LLMS.md#contextservice
**Do:** Use an identifier that names the package and the module path.
**Avoid:** A short generic identifier such as `"Config"`, `"Client"`, or `"Store"`.
**Why?** The identifier is the runtime key of the service map. Two packages that both register `"Config"` replace each other silently, and the failure appears far from the cause.

**(AVOID) Example:**
```ts
export class Store extends Context.Service<Store, StoreShape>()("Store") {}
```

**Correct Example:**
```ts
export class Store extends Context.Service<Store, StoreShape>()("app/session/Store") {}
```

### EFX-05: Dependency range permits an API change

**Reference:** https://github.com/Effect-TS/effect/blob/effect%404.1.5/MIGRATION.md
**Do:** Check both module and export stability in the installed release. Use the policy for the least stable API in use.
**Avoid:** Inferring stability from the import path or using a caret range for an unstable API.
**Why?** An unstable API can change in a minor release. An experimental API can change in a patch.

**(AVOID) Example:** Use `"effect": "^4.1.5"` while the code uses experimental `Glob`.

**Correct Example:** Use `"effect": "4.1.5"` while the code uses experimental `Glob`.

## Effects and Functions

### EFX-06: `.pipe` applied to an `Effect.fn` result

**Reference:** https://github.com/Effect-TS/effect/blob/effect%404.1.5/LLMS.md#using-effectfn
**Do:** Pass spans, annotations, and recovery as extra arguments to `Effect.fn`.
**Avoid:** `Effect.fn(...)(function* ...).pipe(...)`.
**Why?** The extra arguments of `Effect.fn` apply to each call inside the named span. A trailing `.pipe` operates on the function value, which does not compile as intended or silently drops the behaviour from the span.

**(AVOID) Example:**
```ts
const syncProfile = Effect.fn("Profiles.sync")(function* (id: ProfileId) {
  const client = yield* ProfileClient
  return yield* client.push(id)
}).pipe(Effect.annotateLogs({ operation: "sync" }))
```

**Correct Example:**
```ts
const syncProfile = Effect.fn("Profiles.sync")(
  function* (id: ProfileId) {
    const client = yield* ProfileClient
    return yield* client.push(id)
  },
  Effect.annotateLogs({ operation: "sync" }),
)
```

### EFX-07: Pure logic wrapped in an Effect

**Reference:** https://github.com/Effect-TS/effect/blob/effect%404.1.5/LLMS.md#writing-effect-code
**Do:** Keep parsing, option building, and pure computation as plain synchronous functions.
**Avoid:** `Effect.succeed`/`Effect.sync`/`Effect.gen` around code that has no effect.
**Why?** A needless Effect hides a pure contract, adds allocation on hot paths, and forces every caller into a generator. Pure functions are also simpler to test.

**(AVOID) Example:**
```ts
const toQuery = (filter: ProfileFilter) =>
  Effect.sync(() => ({ status: filter.status, limit: filter.limit ?? 50 }))
```

**Correct Example:**
```ts
const toQuery = (filter: ProfileFilter) => ({ status: filter.status, limit: filter.limit ?? 50 })
```

## Services and Layers

### EFX-11: Service read with `.use()` instead of `yield*`

**Reference:** https://github.com/Effect-TS/effect/blob/effect%404.1.5/migration/services.md
**Do:** Bind the service with `yield*` to a named variable, then call its methods.
**Avoid:** `Service.use((s) => ...)` inside feature code, and repeated `.use` calls in one workflow.
**Why?** `use` hides the dependency from the call site, which makes it easy to leak service requirements into a return type. The official v4 guidance prefers `yield*` in most cases. ESLint cannot flag this because it needs the receiver type.

**(AVOID) Example:**
```ts
const notifyTwice = Effect.andThen(
  Notifications.use((n) => n.send("start")),
  Notifications.use((n) => n.send("end")),
)
```

**Correct Example:**
```ts
const notifyTwice = Effect.fn("Alerts.notifyTwice")(function* () {
  const notifications = yield* Notifications
  yield* notifications.send("start")
  yield* notifications.send("end")
})
```

### EFX-12: Layer built without its dependencies wired

**Reference:** https://github.com/Effect-TS/effect/blob/effect%404.1.5/migration/services.md#effectservice--contextservice-with-make
**Do:** Build the layer with `Layer.effect` and wire each dependency with `Layer.provide`.
**Avoid:** Expecting `make` to generate `.Default`, or relying on a caller to provide a dependency that the layer owns.
**Why?** v4 `Context.Service` with `make` generates no layer and has no `dependencies` option. A layer that leaves an owned dependency open pushes the wiring to every consumer and hides the graph.

**(AVOID) Example:**
```ts
class Logger extends Context.Service<Logger>()("app/log/Logger", { make: makeLogger }) {}
const main = program.pipe(Effect.provide(Logger.make))
```

**Correct Example:**
```ts
class Logger extends Context.Service<Logger>()("app/log/Logger", { make: makeLogger }) {
  static readonly layer = Layer.effect(this, this.make).pipe(Layer.provide(LogConfig.layer))
}
const main = program.pipe(Effect.provide(Logger.layer))
```

### EFX-13: Layers provided piecemeal through the program

**Reference:** https://github.com/Effect-TS/effect/blob/effect%404.1.5/migration/layer-memoization.md#prefer-layer-composition-over-multiple-provides
**Do:** Compose the layer graph and provide it once at the entry point.
**Avoid:** Several `Effect.provide` calls scattered across feature code, or a provide inside a function that callers run many times.
**Why?** Nested provides share memoization by default. A single composition point makes service ownership and dependencies visible.

**(AVOID) Example:**
```ts
const handle = (request: Request) =>
  process(request).pipe(Effect.provide(Profiles.layer), Effect.provide(Database.layer))
```

**Correct Example:**
```ts
const AppLayer = Profiles.layer.pipe(Layer.provide(Database.layer))
const main = server.pipe(Effect.provide(AppLayer))
```

### EFX-14: Stateful layer shared by v4 memoization

**Reference:** https://github.com/Effect-TS/effect/blob/effect%404.1.5/migration/layer-memoization.md
**Do:** Check whether each nested provision needs its own resource. Use `Layer.fresh` or `{ local: true }` where it does.
**Avoid:** Expecting a nested provision to rebuild a stateful layer it already inherits.
**Why?** Nested provisions reuse the outer memo map. This can let mutable state leak across two uses that require isolation.

**(AVOID) Example:**
```ts
const checkIsolation = Effect.gen(function* () {
  yield* exercisePool
  return yield* readInitialPoolState.pipe(Effect.provide(ConnectionPool.layer))
}).pipe(Effect.provide(ConnectionPool.layer))
```

**Correct Example:**
```ts
const checkIsolation = Effect.gen(function* () {
  yield* exercisePool
  return yield* readInitialPoolState.pipe(Effect.provide(ConnectionPool.layer, { local: true }))
}).pipe(Effect.provide(ConnectionPool.layer))
```

### EFX-15: Cyclic or overlapping layer graph

**Reference:** https://github.com/Effect-TS/effect/blob/effect%404.1.5/LLMS.md#writing-effect-services
**Do:** Keep the layer graph acyclic, and keep each service small with methods named for its domain.
**Avoid:** A service that depends, through other layers, on itself; a large service with unrelated responsibilities; two services with the same method shape.
**Why?** A cycle fails at construction with a message far from the cause. Large services are hard to replace in tests. Services with an identical structure can satisfy each other's type, so a reviewer must confirm that the correct one is provided.

**(AVOID) Example:**
```ts
class App extends Context.Service<App, {
  readonly getUser: (id: UserId) => Effect.Effect<User>
  readonly sendEmail: (mail: Mail) => Effect.Effect<void>
  readonly track: (event: AnalyticsEvent) => Effect.Effect<void>
}>()("app/App") {}
```

**Correct Example:**
```ts
class Users extends Context.Service<Users, { readonly get: (id: UserId) => Effect.Effect<User> }>()("app/user/Users") {}
class Mailer extends Context.Service<Mailer, { readonly send: (mail: Mail) => Effect.Effect<void> }>()("app/mail/Mailer") {}
```

## Errors

### EFX-16: Domain error without a schema

**Reference:** https://github.com/Effect-TS/effect/blob/effect%404.1.5/LLMS.md#error-handling
**Do:** Define errors that cross HTTP, RPC, or persistence with `Schema.TaggedError`, with the fields a handler needs.
**Avoid:** An error with no context fields, or an error that carries only a message string.
**Why?** A schema error serialises across boundaries and gives handlers typed fields. An error with only a message forces handlers to parse text, and it drops the identifiers that support needs.

**(AVOID) Example:**
```ts
export class Failed extends Schema.TaggedError<Failed>()("Failed", { message: Schema.String }) {}
```

**Correct Example:**
```ts
export class UpstreamFailed extends Schema.TaggedError<UpstreamFailed>()("UpstreamFailed", {
  service: Schema.String,
  cause: Schema.Defect(),
}) {}
```

### EFX-17: Error channel wider or narrower than reality

**Reference:** https://github.com/Effect-TS/effect/blob/effect%404.1.5/migration/error-handling.md
**Do:** Declare the exact union of tagged errors, and confirm that each branch of the body matches it.
**Avoid:** `unknown` or a broad base error in the channel; `Effect.orDie` that erases an error a caller should see.
**Why?** Callers can only handle what the type shows. A widened channel hides the cases that need handling. An `orDie` that converts a recoverable failure into a defect removes the caller's choice and turns a retryable failure into a crash.

**(AVOID) Example:**
```ts
const load = (id: ProfileId) => fetchProfile(id).pipe(Effect.orDie)
```

**Correct Example:**
```ts
const load = Effect.fn("Profiles.load")(function* (id: ProfileId): Effect.fn.Return<Profile, ProfileNotFound | UpstreamFailed> {
  return yield* fetchProfile(id)
})
```

### EFX-18: `die` and `fail` used for the wrong kind of failure

**Reference:** https://github.com/Effect-TS/effect/blob/effect%404.1.5/migration/cause.md
**Do:** Fail with a tagged error when a caller can recover; die only for a broken invariant.
**Avoid:** `Effect.die` for bad input, missing records, or upstream outages; `Effect.fail` for states that correct code cannot reach.
**Why?** Ask two questions. Can the caller recover? Then fail. Is this a bug? Then die. A misclassified defect crashes on a recoverable error; a misclassified failure lets a bug look like handled business logic.

**(AVOID) Example:**
```ts
const decodeRow = (row: unknown) =>
  Schema.decodeUnknownEffect(ProfileRow)(row).pipe(Effect.catch(() => Effect.die("bad row")))
```

**Correct Example:**
```ts
const decodeRow = (row: unknown) =>
  Schema.decodeUnknownEffect(ProfileRow)(row).pipe(Effect.mapError((cause) => new CorruptRow({ cause })))
```

### EFX-19: Foreign failure passed through untyped

**Reference:** https://github.com/Effect-TS/effect/blob/effect%404.1.5/ai-docs/src/01_effect/01_basics/10_creating-effects.ts
**Do:** Map the rejection of `Effect.tryPromise`/`Effect.try` to a tagged error in the `catch` option, and keep the cause.
**Avoid:** The single-argument form, which yields an untyped `UnknownError`; a `catch` that drops the cause.
**Why?** Code after the boundary must see one typed failure. The cause keeps the stack and the upstream detail for diagnosis. Pass the `signal` so that interruption cancels the request.

**(AVOID) Example:**
```ts
const fetchRemote = (id: ProfileId) => Effect.tryPromise(() => sdk.profiles.get(id))
```

**Correct Example:**
```ts
const fetchRemote = (id: ProfileId) =>
  Effect.tryPromise({
    try: (signal) => sdk.profiles.get(id, { signal }),
    catch: (cause) => new UpstreamFailed({ service: "profiles", cause }),
  })
```

### EFX-20: Blanket recovery that swallows unrelated failures

**Reference:** https://github.com/Effect-TS/effect/blob/effect%404.1.5/migration/error-handling.md
**Do:** Recover with `Effect.catchTag`, `catchTags`, or `catchReason` for the failures you intend to handle.
**Avoid:** `Effect.catch` or `Effect.ignore` that recovers from every failure when only one is expected.
**Why?** A blanket handler converts every future failure, including new ones, into the fallback value. The type then claims the effect cannot fail, and outages look like empty results.

**(AVOID) Example:**
```ts
const profile = load(id).pipe(Effect.catch(() => Effect.succeed(guestProfile)))
```

**Correct Example:**
```ts
const profile = load(id).pipe(Effect.catchTag("ProfileNotFound", () => Effect.succeed(guestProfile)))
```

## Data and Schema

### EFX-21: Untrusted data trusted by assertion

**Reference:** https://github.com/Effect-TS/effect/blob/effect%404.1.5/migration/schema.md
**Do:** Decode data from requests, storage, files, and processes with `Schema.decodeUnknownEffect`, and derive the type from the schema.
**Avoid:** `as SomeType` on data from outside the process; a hand-written interface that duplicates a schema.
**Why?** An assertion checks nothing at run time, so a malformed payload travels deep into the program before it fails. The ESLint rule catches `JSON.parse`, but not an assertion on a value that another API has already parsed.

**(AVOID) Example:**
```ts
const body = (yield* request.json) as CreateProfile
```

**Correct Example:**
```ts
const body = yield* Schema.decodeUnknownEffect(CreateProfile)(yield* request.json)
```

## Resources and Concurrency

### EFX-24: Resource release that does not match the acquire

**Reference:** https://github.com/Effect-TS/effect/blob/effect%404.1.5/ai-docs/src/01_effect/05_resources/10_acquire-release.ts
**Do:** Make the release undo exactly what the acquire did, make it safe to run once on every exit, and log a release failure.
**Avoid:** A resource opened with a plain effect and closed manually; a release that ignores its own failure.
**Why?** `acquireRelease` runs the release on success, failure, and interruption. A manual close skips the release on an early failure. A release that fails silently leaks connections and file handles.

**(AVOID) Example:**
```ts
const conn = yield* openConnection(config)
const rows = yield* conn.query(sql)
yield* closeConnection(conn)
```

**Correct Example:**
```ts
const conn = yield* Effect.acquireRelease(openConnection(config), (c) =>
  closeConnection(c).pipe(Effect.catch((error) => Effect.logWarning("Connection close failed", error))),
)
const rows = yield* conn.query(sql)
```

### EFX-25: Fiber that outlives its purpose

**Reference:** https://github.com/Effect-TS/effect/blob/effect%404.1.5/migration/forking.md
**Do:** Use `forkChild` for caller-owned work, `forkScoped` for the current scope, or `forkIn` for an explicit owner. Reserve `forkDetach` for an application with a shutdown policy.
**Avoid:** A fiber stored in a mutable variable outside Effect; a `forkDetach` for work that belongs to a request or a service.
**Why?** A detached or leaked fiber continues after its owner stops, so it can write stale state and hold resources. A scoped fiber stops when its scope closes.

**(AVOID) Example:**
```ts
let poller: Fiber.Fiber<void> | undefined
const start = Effect.gen(function* () {
  poller = yield* Effect.forkDetach(pollInbox)
})
```

**Correct Example:**
```ts
// The poller stops when the layer's scope closes.
export const InboxPollerLayer = Layer.effectDiscard(Effect.forkScoped(pollInbox))
```

### EFX-26: Scope managed by hand

**Reference:** https://github.com/Effect-TS/effect/blob/effect%404.1.5/migration/scope.md
**Do:** Use `Effect.scoped` or a scoped layer. Use `Scope.make` with `Scope.provide` and `Scope.close` only when the scope must outlive one effect.
**Avoid:** `Scope.make` followed by a `Scope.close` that an early return or failure can skip.
**Why?** `Effect.scoped` closes the scope on every exit path. A manual close runs only on the path that reaches it.

**(AVOID) Example:**
```ts
const scope = yield* Scope.make()
const file = yield* openReportFile(path).pipe(Scope.provide(scope))
if (rows.length === 0) return emptyReport
yield* Scope.close(scope, Exit.void)
```

**Correct Example:**
```ts
const report = Effect.scoped(
  Effect.gen(function* () {
    const file = yield* openReportFile(path)
    if (rows.length === 0) return emptyReport
    return yield* writeReport(file, rows)
  }),
)
```

### EFX-27: Shared state updated with a race

**Reference:** https://effect.website/docs/v4/state-management/ref
**Do:** Use `Ref.modify`/`Ref.update` for read-then-write, `SynchronizedRef` for effectful updates, and `TxRef` for coordinated changes to several references.
**Avoid:** `Ref.get` followed by `Ref.set` that depends on the value read; a module-level mutable variable shared by fibers.
**Why?** Another fiber can run between the read and the write, so updates are lost. The defect is non-deterministic and rarely shows in tests.

**(AVOID) Example:**
```ts
const used = yield* Ref.get(slots)
if (used < max) yield* Ref.set(slots, used + 1)
```

**Correct Example:**
```ts
const reserved = yield* Ref.modify(slots, (used) => (used < max ? [true, used + 1] : [false, used]))
```

### EFX-28: Interruption leaves partial state or strands a waiter

**Reference:** https://effect.website/docs/v4/api/effect/Effect
**Do:** Use a transaction for writes that must commit together. Provide compensation when the writes cannot share a transaction. Atomically claim startup and install the worker in its owning scope. Restore interruption for caller waits. Complete readiness and termination signals on every exit.
**Avoid:** External writes that can stop between steps without recovery. Marking a worker ready before installation. Publishing a terminal signal only after successful cleanup.
**Why?** Interruption can leave external state inconsistent or leave a worker without a consumer. A defective finalizer can strand an observer or pending sender.

**(AVOID) Example:**
```ts
yield* Scope.close(workerScope, workerExit)
yield* Deferred.succeed(stopped, undefined)
```

**Correct Example:**
```ts
yield* Scope.close(workerScope, workerExit).pipe(
  Effect.onExit(() => Deferred.succeed(stopped, undefined).pipe(Effect.asVoid)),
)
```

### EFX-29: Unbounded fan-out, retry, or wait

**Reference:** https://github.com/Effect-TS/effect/blob/effect%404.1.5/ai-docs/src/06_schedule/10_schedules.ts
**Do:** Set `concurrency` on `forEach`/`all`, limit retries, retry only errors that are safe to retry, and set a timeout on external calls.
**Avoid:** `{ concurrency: "unbounded" }` over input of unknown size; `Effect.retry` with no limit; a retry of a non-idempotent write.
**Why?** Unbounded work overloads dependencies. An unlimited retry turns an outage into a retry storm. A retried write that is not idempotent duplicates side effects.

**(AVOID) Example:**
```ts
yield* Effect.forEach(ids, fetchProfile, { concurrency: "unbounded" }).pipe(Effect.retry(Schedule.forever))
```

**Correct Example:**
```ts
yield* Effect.forEach(ids, fetchProfile, { concurrency: 8 }).pipe(
  Effect.retry({ times: 3, schedule: Schedule.exponential("100 millis"), while: (error) => error._tag === "UpstreamFailed" }),
  Effect.timeout("30 seconds"),
)
```

### EFX-37: Graceful completion interrupts pending readers

**Reference:** https://effect.website/docs/v4/api/effect/PubSub
**Do:** End the bus with a terminal message. Have each reader stop when it sees the message. Test buffered events and a late subscription.
**Avoid:** Shutting down a bus as soon as the producer finishes when readers must drain events.
**Why?** Shutdown interrupts readers. End delivers buffered items first. A late subscriber gets replayed items, if configured, and then the terminal message.

**(AVOID) Example:**
```ts
yield* PubSub.shutdown(events)
```

**Correct Example:**
```ts
yield* PubSub.end(events, Option.none())
// A reader ends on Option.none() instead of taking again.
```

### EFX-31: Resolver that cannot batch

**Reference:** https://github.com/Effect-TS/effect/blob/effect%404.1.5/ai-docs/src/05_batching/10_request-resolver.ts
**Do:** Give each resolver one data source and one set of services, so every request in a batch uses the same logic.
**Avoid:** A resolver that selects a service or API per request.
**Why?** Requests that need different context cannot batch, so the resolver makes one call per request and loses the benefit it exists for.

**(AVOID) Example:**
```ts
const resolveUser = (request: GetUser) =>
  request.region === "EU" ? euApi.getUser(request.id) : usApi.getUser(request.id)
```

**Correct Example:**
```ts
// One resolver per region; each batches its own requests through one API.
const EuUsers = makeUserResolver(euApi)
const UsUsers = makeUserResolver(usApi)
```

## Runtime Boundaries and Observability

### EFX-30: Effect run inside feature code

**Reference:** https://github.com/Effect-TS/effect/blob/effect%404.1.5/ai-docs/src/04_integration/10_managed-runtime.ts
**Do:** Run the program once at the process entry, or through one `ManagedRuntime` for framework callbacks.
**Avoid:** `Effect.runPromise` in a service, a helper, or a loop; a new runtime per request.
**Why?** Each run point splits interruption, typed errors, and resource ownership. A runtime per request rebuilds every layer. The linter guards `runSync` only; the other run functions need review.

**(AVOID) Example:**
```ts
export const handler = async (request: Request) =>
  Effect.runPromise(handleRequest(request).pipe(Effect.provide(AppLayer)))
```

**Correct Example:**
```ts
const runtime = ManagedRuntime.make(AppLayer)
export const handler = (request: Request) => runtime.runPromise(handleRequest(request))
```

### EFX-43: A native callback can outlive its owner

**Reference:** https://effect.website/docs/v4/api/effect/Effect
**Do:** Register the callback in the owning scope. Use a scoped queue or stream when the producer needs to preserve order. Test a synchronous burst during registration.
**Avoid:** Forking independent work for each event when delivery order is part of the contract. Leaving subscriptions registered after the scope closes.
**Why?** Independent fibers can process events in a different order. An unremoved callback can publish to a resource that already closed.

**(AVOID) Example:**
```ts
events.subscribe((event) => Effect.runFork(onEvent(event)))
```

**Correct Example:**
```ts
const changes = Effect.acquireRelease(
  Effect.sync(() => events.subscribe(enqueueInOrder)),
  (unsubscribe) => Effect.sync(unsubscribe),
)
```

### EFX-32: Log without context, or a secret in a log

**Reference:** https://github.com/Effect-TS/effect/blob/effect%404.1.5/ai-docs/src/08_observability/10_logging.ts
**Do:** Log with `Effect.logInfo`/`logWarning`/`logError`, add identifiers with `Effect.annotateLogs`, and keep secrets in `Redacted`.
**Avoid:** Values interpolated into the message string; `Redacted.value` passed to a log or an error.
**Why?** Structured fields are searchable in the log sink; interpolated text is not. An unwrapped secret in a log or an error payload leaks to every sink that receives it.

**(AVOID) Example:**
```ts
yield* Effect.logInfo(`Synced ${id} with token ${Redacted.value(token)}`)
```

**Correct Example:**
```ts
yield* Effect.logInfo("Profile synced").pipe(Effect.annotateLogs({ profileId: id }))
```

## Testing

### EFX-33: Test that replaces the implementation it claims to test

**Reference:** https://github.com/Effect-TS/effect/blob/effect%404.1.5/ai-docs/src/09_testing/20_layer-tests.ts
**Do:** Test the public service API with real scoped resources. Use `TestClock` or a `Deferred` to control time and fiber order.
**Avoid:** Replacing the implementation under test. Sleeping to assume a fiber reached a particular point.
**Why?** A test needs to distinguish a lost signal from a slow fiber. A readiness signal identifies when the test can interrupt.

**(AVOID) Example:**
```ts
yield* Effect.sleep("100 millis")
yield* Fiber.interrupt(caller)
```

**Correct Example:**
```ts
yield* Deferred.await(started)
yield* Fiber.interrupt(caller)
yield* Deferred.await(stopped)
```

### EFX-34: Failure asserted without its tag

**Reference:** https://github.com/Effect-TS/effect/blob/effect%404.1.5/ai-docs/src/09_testing/10_effect-tests.ts
**Do:** Reach the failure with `Effect.flip` or `Exit`, and assert its `_tag` and fields.
**Avoid:** An assertion that only checks that the effect failed.
**Why?** A test that accepts any failure passes when the code fails for an unrelated reason, such as a missing layer.

**(AVOID) Example:**
```ts
const exit = yield* Effect.exit(loadProfile(missingId))
expect(Exit.isFailure(exit)).toBe(true)
```

**Correct Example:**
```ts
const error = yield* Effect.flip(loadProfile(missingId))
expect(error._tag).toBe("ProfileNotFound")
```

## Lint Exceptions

### EFX-36: Lint exception without scope or reason

**Reference:** https://github.com/Effect-TS/effect/blob/effect%404.1.5/LLMS.md
**Do:** Fix lint findings at their source. Document a necessary integration boundary in scoped lint configuration.
**Avoid:** A broad override or an inline disable. Avoid casts or error suppressions that hide the finding.
**Why?** Each exception needs a stated reason and a scope that matches the integration boundary.

**(AVOID) Example:**
```ts
/* eslint-disable effect/no-null-use-option */
const encoded = { parentId: parent ?? null } as any
```

**Correct Example:**
```ts
const WirePayload = Schema.Struct({ parentId: Schema.NullOr(Schema.String) })
const encoded = yield* Schema.encodeEffect(WirePayload)(payload)
```

---

## Runtime contract checks

### EFX-39: Fiber owner or replacement key changes behavior
**Do:** Tie each fiber to its owner. Use a scope for work that must survive the starting call. Confirm the key describes a physical task when two tasks may share a logical key.
**Why:** Reusing a `FiberMap` key interrupts its previous fiber. Removing `startImmediately` can change the order of delivery.
**Review evidence:** Close the owner while work is active. Verify that it interrupts the fiber and runs the finalizer once. Force the startup and stop interleaving with a latch.

### EFX-40: A stream or queue change alters delivery
**Do:** Preserve FIFO for events that cannot be lost. Put backpressure at the external producer. Permit dropping or sliding only when the contract allows loss.
**Why:** A component that sends to itself can deadlock on a full blocking queue. Replacing a `Ref` and `PubSub` with `SubscriptionRef` also changes order if the old code publishes after side effects.
**Review evidence:** Exercise a burst during registration. Assert terminal order, exact errors, and release after interruption. Check early readers, late readers, and publication after `PubSub.end`.

### EFX-41: A refactor changes cancellation or advances time outside Effect
**Do:** Use `Clock`, `Duration`, `Effect.sleep`, and `Schedule` in Effect code. Bound retry to repeatable operations. Keep abortable foreign work interruptible and pass in its `AbortSignal`.
**Why:** A manually started timer can outlive its owner. A broad uninterruptible region can delay shutdown behind user code.
**Review evidence:** Use `TestClock` for Effect time and real-platform tests where appropriate. Race a stop against the callback. Assert synchronous throws and Promise rejections separately.

### EFX-42: A boundary change widens data or resource access
**Do:** Read structured configuration with `Config.schema`. Keep credentials redacted until the client boundary. Preserve existing wire payloads and scope each shared resource to its owner.
**Why:** Changes to the serialized shape, credential lifetime, or layer sharing can change behavior without breaking typecheck.
**Review evidence:** Request old-format fixtures and a test that checks independent owners. Keep transaction side effects and listener calls outside serialized claims.

## Review Checklist

- [ ] EFX-17: Does each error channel list exactly the failures that can occur?
- [ ] EFX-14: Does any stateful layer depend on a fresh build that v4 memoization now shares?
- [ ] EFX-24, EFX-26: Is each resource released and each scope closed on every exit path?
- [ ] EFX-25: Is each forked fiber joined, awaited, interrupted, or scoped?
- [ ] EFX-27, EFX-28: Are claims atomic? Can interruption leave partial writes? Does every exit release waiters?
- [ ] EFX-30: Are Effect/Promise boundaries only at true entry points?
- [ ] EFX-31: Does each resolver batch requests that share a data source?
- [ ] EFX-37, EFX-43: Do callbacks and readers preserve delivery order through shutdown?
- [ ] EFX-18: Are defects and expected failures classified correctly?
- [ ] EFX-39–42: Do ownership, delivery, time, and boundary checks prove the original behavior?
- [ ] EFX-36: Is each lint exception scoped, categorised, and justified?
