# PromptGuard

A privacy-first proxy layer for LLM inference, designed to protect user data and prevent prompt injections.

## Features

- **Input Sanitization**: Automatically detects and redacts PII (Personally Identifiable Information) in prompts
- **Prompt Risk Analysis**: Identifies and blocks prompt injection attempts
- **Multiple LLM Provider Support**: Proxy requests to OpenAI, Anthropic, Cohere, and custom providers
- **Output Processing**: Optionally rehydrate redacted information in responses
- **Request Logging**: Track usage and detect patterns
- **Subscription Plans**: Various tiers with different usage limits and model access
- **Model Selection**: Choose from a wide range of LLM models based on your subscription

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- API keys for any LLM providers you want to use (OpenAI, Anthropic, Cohere)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/promptguard.git
   cd promptguard
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables:
   ```bash
   cp .env.example .env
   ```
   Then edit the `.env` file to add your API keys and configuration.

4. Build the project:
   ```bash
   npm run build
   ```

5. Start the server:
   ```bash
   npm start
   ```
   For development with hot reloading:
   ```bash
   npm run dev
   ```

### API Usage

The main proxy endpoint is `/api/proxy/completion`. Send a POST request with the following body:

```json
{
  "prompt": "Your prompt text here",
  "model": "gpt-4",
  "provider": "openai",
  "options": {
    "temperature": 0.7,
    "maxTokens": 1000
  },
  "rehydrateOutput": false
}
```

The server will:
1. Sanitize the prompt by removing PII
2. Analyze it for potential prompt injection risks
3. Forward it to the requested LLM provider
4. Return the response with additional metadata

### Available Models

You can get a list of available models for your subscription by making a GET request to `/api/proxy/models`.

The response will include models grouped by provider and indicate which ones are available based on your subscription plan:

```json
{
  "status": "success",
  "data": {
    "openai": [
      {
        "id": "gpt-3.5-turbo",
        "name": "Gpt 3.5 Turbo",
        "available": true
      },
      {
        "id": "gpt-4",
        "name": "Gpt 4",
        "available": true
      }
    ],
    "anthropic": [
      {
        "id": "claude-instant",
        "name": "Claude Instant",
        "available": true
      }
    ]
  }
}
```

## Subscription Plans

PromptGuard offers several subscription tiers to meet different needs:

### Free Tier
- 100 requests per day
- Basic models only (GPT-3.5-Turbo, Claude Instant, etc.)
- Basic PII detection

### Basic Plan ($9.99/month)
- 1,000 requests per day
- Standard models
- Advanced PII detection
- Priority support

### Premium Plan ($49.99/month)
- 10,000 requests per day
- Access to most advanced models
- Custom PII detection rules
- Priority support with SLA

### Enterprise Plan
- Unlimited requests
- All models including the most powerful ones
- Custom configurations and dedicated support
- Contact sales for pricing

## Billing API

Manage your subscription with the following endpoints:

- `GET /api/billing/plans` - Get available subscription plans
- `GET /api/billing/subscription` - Get current subscription details
- `POST /api/billing/subscription` - Update subscription
- `POST /api/billing/subscription/cancel` - Cancel subscription
- `GET /api/billing/usage` - Get current usage statistics

## Documentation

For detailed documentation, see the [docs](./docs) directory.

## Contributing

Contributions are welcome! Please read our [Contributing Guidelines](CONTRIBUTING.md) for details.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.