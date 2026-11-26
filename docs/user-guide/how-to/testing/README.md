---
title: Test application requests
doc-type: index
---

# Test application requests

Use these guides to check model selection and application behavior with fixed
responses. Use the HTTP fixtures when your assertion targets the request at the
network boundary.

- [Queue model responses for successive calls](queue-model-responses.md). Return distinct results in a fixed order.
- [Replace the AI service in an application test](replace-the-ai-service.md). Supply a test layer around application logic.
- [Select a model by ID in a test](select-a-model-by-id-in-a-test.md). Exercise the model lookup with a mock provider.
- [HTTP fixtures](http-fixtures/README.md). Inspect requests, simulate outages, and reset test state.
- [Test an AI feature](test-an-ai-feature.md). Use a model fixture or replace the service layer.
