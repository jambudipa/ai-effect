# Development references

The [Effect standards](effect-v4.md) and [review rules](../.github/review-rules/effect_v4.md)
come from `jambudipa.io` at `ab73576779221386b923d48c431fc926ed5e2754`.
The copied standards retain their source text. The local [development instructions](../README.md#repository-development)
record the test API correction for the installed version.

The local CI applies the reference workflows' read-only checkout, credential
isolation, and bounded jobs. The package uses its own lint and test checks.
The reference site's AI review, Jira integration, and deployment checks
require its private infrastructure.
