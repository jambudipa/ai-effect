<script>
  import { Chat, Completion, createAIContext } from '@jambudipa/ai-effect/svelte';
  import { Effect } from 'effect';
  import { untrack } from 'svelte';

  let { fetcher, state, transport } = $props();
  createAIContext();
  const completion = new Completion({
    streamProtocol: 'text',
    fetch: (...args) => fetcher(...args),
    onFinish: () => {
      state.finished++;
    },
  });
  const chat = new Chat({
    transport: untrack(() => transport),
    onFinish: () => {
      state.chatFinished++;
    },
  });

  const chatText = $derived(
    chat.messages
      .filter((message) => message.role === 'assistant')
      .flatMap((message) => message.parts)
      .filter((part) => part.type === 'text')
      .map((part) => part.text)
      .join(''),
  );

  $effect(() => {
    state.updates.push(completion.completion);
  });

  export function start() {
    return Effect.runPromiseExit(completion.complete('hello'));
  }

  export function sendChat() {
    return Effect.runPromiseExit(chat.sendMessage({ text: 'hello' }));
  }
</script>

<output>{completion.completion}</output>
<output data-chat>{chatText}</output>
