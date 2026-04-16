# n8n Workflows for Telemoz

This directory contains the JSON definitions for the n8n workflows used by the Telemoz platform.

## How to use
1. Open your n8n instance (e.g. on your VPS).
2. Create a new workflow.
3. Export the JSON from these files and paste it (`Ctrl+V`) into the n8n canvas.
4. Configure your credentials (Slack, Gmail, etc.) in the respective nodes.
5. Set the Webhook paths to match the filenames (e.g., `telemoz/user-registered`).
6. Activate the workflows.

## Workflow Triggers
- **User Registration**: `telemoz/user-registered`
- **Project Created**: `telemoz/project-created`
- **Payment Completed**: `telemoz/payment-completed`

For more documentation on how these are triggered from the app, see `lib/n8n.ts`.
