---
title: How to test an AI feature
doc-type: how-to
sources:
  [
    src/AiSdk.ts,
    src/testing.ts,
    src/internal/mock-model.ts,
    test/AiSdk.test.ts,
    test/ModelFixtures.test.ts,
  ]
---

# How to test an AI feature

> **TL;DR:** Use an `ai/test` fixture to exercise the core request with a fixed
> response. Use a replacement `AiSdk` layer when the test focuses on application
> behavior around the service.

### Exercise the request adapter

1. Choose a model fixture for the capability and protocol version you use.
   For text generation on the v4 protocol, use `MockLanguageModelV4`.
2. Create the fixture inside the test scope. Supply fixed results or callbacks
   that return Effects. Use the model handle in the application request.
3. Check the result and the recorded mock calls before the scope closes. For
   example, check `model.doGenerateCalls` for the number of calls or forwarded
   request options.

See the [first text result tutorial](../tutorials/first-text-result.md) for a
complete fixture. Use a fresh stream factory for each streamed request.

### Replace the application service

1. Define an implementation that satisfies `AiSdkService`.
2. Build the replacement layer with `Layer.succeed(AiSdk, AiSdk.of(stub))`.
3. Provide the replacement layer at the test boundary. Assert the application
   output or tagged failure.

See the [Core API reference](../reference/core.md) for the service contract.
