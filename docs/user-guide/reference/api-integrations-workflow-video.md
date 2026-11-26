---
title: "Integration API — workflow/video"
doc-type: reference
sources: [src/integrations/workflow/video.ts, package.json]
---

# workflow/video

> **TL;DR:** The `@jambudipa/ai-effect/workflow/video` entry provides the public declarations listed below.

## Import

`@jambudipa/ai-effect/workflow/video`

## `experimental_generateVideo`

Generate a durable video inside a Workflow host.

```text
export declare const experimental_generateVideo: (options: WorkflowGenerateVideoOptions) => Effect.Effect<{
    status: "completed";
    videos: Array<import("@ai-sdk/provider").Experimental_VideoModelV4VideoData>;
    warnings: Array<import("@ai-sdk/provider").SharedV4Warning>;
    providerMetadata?: import("@ai-sdk/provider").SharedV4ProviderMetadata;
    response: {
        timestamp: Date;
        modelId: string;
        headers: Record<string, string> | undefined;
    };
}, import("../../internal/operation.js").AiSdkError, never>;
```

## `WorkflowGenerateVideoOptions`

Select a workflow model ID or a video model created by an ai-effect provider.

```text
export type WorkflowGenerateVideoOptions = Omit<NativeOptions, 'model'> & {
    readonly model: Extract<NativeOptions['model'], string> | VideoModelV4;
};
```

## `WorkflowGenerateVideoResult`

A completed video generation result containing provider video data.
Hosted videos remain URLs and are not downloaded automatically.

```text
type WorkflowGenerateVideoResult = Extract<GetVideoStatusResult, {
  status: 'completed';
}>;
```

