---
title: Request reliability guides
doc-type: index
---

# Request reliability guides

Use these guides when model traffic needs to observe a deadline, stop on
disconnect, or return an application fallback.

- [Stop generation when a client disconnects](cancel-a-disconnected-request.md).
  Forward the request signal to the active model stream.
- [Set a deadline for a model request](set-a-request-deadline.md). Apply a
  time budget to the work the caller is waiting for.
- [Handle a provider rate limit](handle-a-provider-rate-limit.md). Return a
  cached result if the provider reports HTTP 429.
