/**
 * n8n workflow automation client.
 * Triggers workflows via n8n webhooks or the n8n REST API.
 */

const N8N_BASE_URL = (process.env.N8N_BASE_URL ?? "https://n8n.feendesk.com").replace(/\/$/, "");
const N8N_API_KEY = process.env.N8N_API_KEY;

// ── Generic trigger via webhook URL ─────────────────────────────────────────

export async function triggerWebhook<T extends object = Record<string, unknown>>(
  webhookPath: string,
  payload: T
): Promise<Response> {
  const url = webhookPath.startsWith("http")
    ? webhookPath
    : `${N8N_BASE_URL}/webhook/${webhookPath}`;

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`n8n webhook failed (${url}): ${res.status} ${err}`);
  }
  return res;
}

// ── Generic trigger via n8n REST API ────────────────────────────────────────

export async function triggerWorkflow(workflowId: string, data: object = {}): Promise<Response> {
  if (!N8N_API_KEY) throw new Error("N8N_API_KEY is not set");

  const res = await fetch(`${N8N_BASE_URL}/api/v1/workflows/${workflowId}/run`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-N8N-API-KEY": N8N_API_KEY,
    },
    body: JSON.stringify({ data }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`n8n workflow trigger failed (${workflowId}): ${res.status} ${err}`);
  }
  return res;
}

// ── Pre-built workflow helpers ───────────────────────────────────────────────
// These map to webhook paths you configure in your n8n instance.
// Update the webhook slugs to match the actual names in your n8n workflows.

/** Trigger the "new user registered" onboarding workflow. */
export async function onUserRegistered(user: {
  id: string;
  name: string;
  email: string;
  userType: string;
}): Promise<void> {
  await triggerWebhook("telemoz/user-registered", user);
}

/** Trigger the "project created" workflow (notify admin, assign tasks, etc.). */
export async function onProjectCreated(project: {
  id: string;
  name: string;
  clientId: string;
  proId?: string;
  budget?: number;
}): Promise<void> {
  await triggerWebhook("telemoz/project-created", project);
}

/** Trigger the "report published" workflow (notify client, send email, etc.). */
export async function onReportPublished(report: {
  id: string;
  projectId: string;
  projectName: string;
  clientEmail: string;
  reportUrl: string;
}): Promise<void> {
  await triggerWebhook("telemoz/report-published", report);
}

/** Trigger the "payment completed" workflow (receipt, commission split, etc.). */
export async function onPaymentCompleted(payment: {
  transactionId: string;
  amount: number;
  currency: string;
  proId: string;
  clientId: string;
  projectId: string;
}): Promise<void> {
  await triggerWebhook("telemoz/payment-completed", payment);
}

/** Trigger the "proposal accepted" workflow. */
export async function onProposalAccepted(proposal: {
  proposalId: string;
  proId: string;
  clientId: string;
  projectName: string;
}): Promise<void> {
  await triggerWebhook("telemoz/proposal-accepted", proposal);
}

/** Trigger the "contract signed" workflow. */
export async function onContractSigned(contract: {
  contractId: string;
  proId: string;
  clientId: string;
  projectName: string;
  value: number;
}): Promise<void> {
  await triggerWebhook("telemoz/contract-signed", contract);
}
