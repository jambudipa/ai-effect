import { expect, it } from '@effect/vitest';
import { Context, Effect } from 'effect';
import { MockVideoModelV4 } from '../src/testing.js';

class WebhookLabel extends Context.Service<WebhookLabel, string>()(
  '@jambudipa/ai-effect/test/VideoMock/WebhookLabel',
) {}

it.effect('passes both sides of a video webhook through Effect', () =>
  Effect.gen(function* () {
    const model = yield* MockVideoModelV4({
      handleWebhookOption: ({ webhook }) =>
        Effect.map(webhook(), ({ url, received }) => ({
          webhookUrl: `${url}/registered`,
          received: Effect.gen(function* () {
            const label = yield* WebhookLabel;
            const delivery = yield* received;
            return {
              ...delivery,
              headers: { ...delivery.headers, 'x-test-label': label },
            };
          }),
        })),
    });
    expect(model.handleWebhookOption).toBeDefined();
    if (!model.handleWebhookOption) return;
    const result = yield* model.handleWebhookOption({
      webhook: () =>
        Effect.succeed({
          url: 'https://example.test/webhook',
          received: Effect.succeed({
            headers: { 'content-type': 'application/json' },
            body: { ready: true },
          }),
        }),
    });
    expect(result.webhookUrl).toBe('https://example.test/webhook/registered');
    expect(yield* result.received).toEqual({
      headers: {
        'content-type': 'application/json',
        'x-test-label': 'video fixture',
      },
      body: { ready: true },
    });
  }).pipe(Effect.provideService(WebhookLabel, 'video fixture')),
);
