<script>
  import { Completion, createAIContext } from '@jambudipa/ai-effect/svelte';
  import { Effect } from 'effect';

  let { fetcher, state } = $props();
  createAIContext();
  const completion = new Completion({
    streamProtocol: 'text',
    fetch: (...args) => fetcher(...args),
    onFinish: () => {
      state.finished++;
    },
  });

  $effect(() => {
    state.updates.push(completion.completion);
  });

  export function start() {
    return Effect.runPromiseExit(completion.complete('hello'));
  }
</script>

<output>{completion.completion}</output>
