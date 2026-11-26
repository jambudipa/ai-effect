const transportEvents = {
  onclose: 'onClose',
  onerror: 'onError',
  onmessage: 'onMessage',
};
const transports = new Set([
  '@ai-sdk/mcp Experimental_WebMCPTransport',
  '@ai-sdk/mcp/mcp-stdio Experimental_StdioMCPTransport',
  '@ai-sdk/mcp/mcp-stdio StdioMCPTransport',
]);
const middleware = new Map([
  ['@ai-sdk/devtools devToolsMiddleware', ['wrapGenerate', 'wrapStream']],
  ['@ai-sdk/policy-opa opaCapabilityMiddleware', ['transformParams']],
]);
const middlewareSlots = [
  'overrideProvider',
  'overrideModelId',
  'overrideSupportedUrls',
  'transformParams',
  'wrapGenerate',
  'wrapStream',
];
const providerExecutedTools = new Set([
  '@ai-sdk/groq browserSearch',
  ...[
    'codeExecution',
    'imageGeneration',
    'mcpServer',
    'viewImage',
    'viewXVideo',
    'webSearch',
    'xSearch',
  ].map((name) => `@ai-sdk/xai ${name}`),
]);
const realtimeFactories = new Set([
  'ai createGateway',
  'ai gateway',
  '@ai-sdk/gateway createGateway',
  '@ai-sdk/gateway createGatewayProvider',
  '@ai-sdk/gateway gateway',
  '@ai-sdk/openai createOpenAI',
  '@ai-sdk/openai openai',
]);
const builtinDefaults = new Map([
  [
    '@ai-sdk/harness-claude-code claudeCode',
    ['ListAgents', 'askUserQuestions'],
  ],
  ['@ai-sdk/harness-cline cline', ['askUserQuestions', 'ls', 'skills']],
  ['@ai-sdk/harness-codex codex', []],
  ['@ai-sdk/harness-cursor cursor', []],
  ['@ai-sdk/harness-deepagents deepAgents', []],
  ['@ai-sdk/harness-fx fx', ['ls', 'askUserQuestions']],
  ['@ai-sdk/harness-github-copilot githubCopilot', []],
  ['@ai-sdk/harness-grok-build grokBuild', ['askUserQuestions']],
  ['@ai-sdk/harness-opencode openCode', ['askUserQuestions']],
  ['@ai-sdk/harness-pi pi', ['ls']],
]);
// These slots are inherited by the descriptor type. The pinned defaults
// configure schemas and string descriptions only.
const absentBuiltinOperations = new Set([
  'contextSchema',
  'description',
  'needsApproval',
  'execute',
  'onInputStart',
  'onInputDelta',
  'onInputAvailable',
  'toModelOutput',
  'inputExamples',
]);
const absentSlots = new Map([
  ...[...middleware].map(([operation, implemented]) => [
    operation,
    middlewareSlots.filter((slot) => !implemented.includes(slot)),
  ]),
  ...[...providerExecutedTools].map((operation) => [
    operation,
    ['contextSchema', 'needsApproval', 'execute', 'toModelOutput'],
  ]),
  ['@ai-sdk/harness-cline cline', ['getBootstrap']],
  ['@ai-sdk/harness-fx fx', ['getBootstrap']],
  ['@ai-sdk/harness-pi pi', ['getBootstrap']],
  [
    '@ai-sdk/typesafe-ai typeSafeAi',
    ['transcriptionModel', 'speechModel', 'rerankingModel', 'files', 'skills'],
  ],
  [
    'ai toolSearch',
    [
      'contextSchema',
      'description',
      'needsApproval',
      'onInputStart',
      'onInputDelta',
      'onInputAvailable',
      'toModelOutput',
    ],
  ],
  ...[
    '@ai-sdk/code-mode experimental_codeModeTool',
    '@ai-sdk/code-mode experimental_createCodeModeTool',
    '@ai-sdk/tool-bash experimental_createBashTool',
    '@ai-sdk/tool-web-fetch experimental_createWebFetchTool',
  ].map((tool) => [tool, ['description', 'needsApproval']]),
]);

export function memberProjection(upstream, exported, member) {
  const operation = `${upstream} ${exported}`;
  if (member.path.length !== 1) return;
  const [name] = member.path;
  if (
    (upstream === 'ai' || upstream === '@ai-sdk/provider-utils') &&
    exported === 'experimental_toolCaller' &&
    member.optional &&
    !member.constructors
  ) {
    return {
      path: [name],
      retainedInput: true,
      relation: 'retained-tool-input',
    };
  }
  if (transports.has(operation) && Object.hasOwn(transportEvents, name)) {
    return {
      path: ['events', 'subscribe'],
      registration: transportEvents[name],
      relation: 'scoped-event-registration',
    };
  }
  if (middleware.get(operation)?.includes(name)) {
    return { path: ['apply'], relation: 'middleware-application' };
  }
  if (
    realtimeFactories.has(operation) &&
    name === 'experimental_realtime' &&
    member.calls === 5
  ) {
    // The broad model-ID overload already accepts the inherited one-argument
    // factory call with the same result.
    return { path: [name], calls: 4, relation: 'equivalent-overload' };
  }
}

export function resultProjection(upstream, exported, result) {
  if (
    upstream === '@ai-sdk/policy-opa' &&
    exported === 'optionalOpaPolicy' &&
    result.calls
  ) {
    return {
      path: ['value'],
      receiverBrand: '~effect/Option',
      relation: 'optional-approval',
    };
  }
  if (upstream === 'ai' && exported === 'smoothStream' && result.calls) {
    return {
      path: ['apply'],
      resultBrand: '~effect/Stream',
      relation: 'stream-application',
    };
  }
  if (
    upstream === '@ai-sdk/provider-utils' &&
    exported === 'getWebSocketConstructor' &&
    result.constructors
  ) {
    return {
      path: [],
      calls: result.constructors,
      constructors: 0,
      resultBrand: '~effect/Effect',
      relation: 'scoped-socket-factory',
    };
  }
}

export function nativeMemberUnavailable(upstream, exported, member) {
  const operation = `${upstream} ${exported}`;
  const [group, tool, slot] = member.path;
  const outputSchemas = builtinDefaults.get(operation);
  if (outputSchemas && group === 'builtinTools') {
    return (
      absentBuiltinOperations.has(slot) ||
      (slot === 'outputSchema' && !outputSchemas.includes(tool))
    );
  }
  if (operation === '@ai-sdk/harness HARNESS_V1_BUILTIN_TOOLS') {
    return absentBuiltinOperations.has(tool);
  }
  return (
    member.optional &&
    member.path.length === 1 &&
    absentSlots.get(operation)?.includes(member.path[0])
  );
}
