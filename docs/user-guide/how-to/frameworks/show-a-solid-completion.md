---
title: How to display a streamed completion in Solid
doc-type: how-to
sources:
  [
    src/frameworks/solid.ts,
    src/frameworks/lifetime.ts,
    src/frameworks/options.ts,
    package.json,
  ]
---

# How to display a streamed completion in Solid

> **TL;DR:** Copy your endpoint into `useCompletion` and select the text
> protocol. Read `completion()` as the response arrives.

Use this when a Solid component needs to show the result of one prompt. Install
the Solid peer from [Installation and compatibility](../../reference/installation.md).

1. Prepare a POST route that reads a JSON field named `prompt` and returns a
   text stream. If you adapt the
   [plain-text response example](../streaming/serve-a-plain-text-response.md),
   extract `prompt` from `request.json()` and validate it as a string first.
2. Call `complete` from the component and display the accessor's value.

   ```tsx
   import { useCompletion } from '@jambudipa/ai-effect/solid';
   import { Effect } from 'effect';

   export function Summary() {
     const summary = useCompletion({
       api: '/api/completion',
       streamProtocol: 'text',
     });

     return (
       <section>
         <button
           type="button"
           disabled={summary.isLoading()}
           onClick={() => {
             void Effect.runPromiseExit(
               summary.complete('Summarize the benefits of a short meeting.'),
             );
           }}
         >
           Generate summary
         </button>
         <p>{summary.completion()}</p>
       </section>
     );
   }
   ```

3. Click **Generate summary**. Verify that the result grows as the route sends
   text. For a request failure, display a short message while `summary.error()`
   returns an error.

If you add a cancel action, run `summary.stop()` at the event boundary. See
the [Solid API reference](../../reference/api/frameworks/solid.md) for the helpers.
