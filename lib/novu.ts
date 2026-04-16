/**
 * Novu notification client — uses the self-hosted Novu REST API.
 * Docs: https://docs.novu.co/api-reference/overview
 */

const NOVU_API_KEY = process.env.NOVU_API_KEY!;
const NOVU_BASE_URL = (process.env.NOVU_BACKEND_URL ?? "https://api.novu.co").replace(/\/$/, "");

async function novuFetch(path: string, body: object): Promise<Response> {
  return fetch(`${NOVU_BASE_URL}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `ApiKey ${NOVU_API_KEY}`,
    },
    body: JSON.stringify(body),
  });
}

// ── Subscriber management ────────────────────────────────────────────────────

export interface NovuSubscriber {
  subscriberId: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  avatar?: string;
  data?: Record<string, unknown>;
}

/** Create or update a Novu subscriber (upsert). Call this after user registration. */
export async function upsertSubscriber(sub: NovuSubscriber): Promise<void> {
  const res = await fetch(`${NOVU_BASE_URL}/subscribers`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `ApiKey ${NOVU_API_KEY}`,
    },
    body: JSON.stringify(sub),
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Novu upsertSubscriber failed: ${res.status} ${err}`);
  }
}

// ── Trigger notifications ────────────────────────────────────────────────────

export interface TriggerPayload {
  /** The workflow trigger ID defined in your Novu dashboard. */
  workflowId: string;
  /** Subscriber ID — matches the user's ID in your system. */
  to: string | { subscriberId: string; email?: string; firstName?: string };
  /** Variables available inside the notification template. */
  payload?: Record<string, unknown>;
  /** Optional actor (who caused the notification). */
  actor?: { subscriberId: string };
}

export async function triggerNotification(opts: TriggerPayload): Promise<void> {
  const res = await novuFetch("/events/trigger", {
    name: opts.workflowId,
    to: typeof opts.to === "string" ? { subscriberId: opts.to } : opts.to,
    payload: opts.payload ?? {},
    ...(opts.actor ? { actor: opts.actor } : {}),
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Novu trigger failed (${opts.workflowId}): ${res.status} ${err}`);
  }
}

// ── Pre-built trigger helpers ────────────────────────────────────────────────

/** Notify a user that they have a new message. */
export async function notifyNewMessage(
  recipientId: string,
  senderName: string,
  preview: string,
  conversationUrl: string
): Promise<void> {
  await triggerNotification({
    workflowId: "new-message",
    to: recipientId,
    payload: { senderName, preview, conversationUrl },
  });
}

/** Notify a client that a new report has been published. */
export async function notifyReportReady(
  clientId: string,
  projectName: string,
  reportUrl: string
): Promise<void> {
  await triggerNotification({
    workflowId: "report-ready",
    to: clientId,
    payload: { projectName, reportUrl },
  });
}

/** Notify a pro that a new project inquiry came in. */
export async function notifyNewInquiry(
  proId: string,
  clientName: string,
  projectName: string,
  inquiryUrl: string
): Promise<void> {
  await triggerNotification({
    workflowId: "new-inquiry",
    to: proId,
    payload: { clientName, projectName, inquiryUrl },
  });
}

/** Notify a user of a project status change. */
export async function notifyProjectUpdate(
  userId: string,
  projectName: string,
  newStatus: string,
  projectUrl: string
): Promise<void> {
  await triggerNotification({
    workflowId: "project-status-update",
    to: userId,
    payload: { projectName, newStatus, projectUrl },
  });
}

/** Notify a pro that a proposal was accepted. */
export async function notifyProposalAccepted(
  proId: string,
  clientName: string,
  projectName: string,
  proposalUrl: string
): Promise<void> {
  await triggerNotification({
    workflowId: "proposal-accepted",
    to: proId,
    payload: { clientName, projectName, proposalUrl },
  });
}

/** Notify a user that a payment was received. */
export async function notifyPaymentReceived(
  userId: string,
  amount: number,
  currency: string,
  projectName: string
): Promise<void> {
  await triggerNotification({
    workflowId: "payment-received",
    to: userId,
    payload: { amount, currency, projectName },
  });
}
