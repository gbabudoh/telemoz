import { AccessToken } from "livekit-server-sdk";

export async function generateLiveKitToken(
  roomName: string,
  participantName: string,
  identity: string
) {
  const apiKey = process.env.LIVEKIT_API_KEY;
  const apiSecret = process.env.LIVEKIT_API_SECRET;

  if (!apiKey || !apiSecret) {
    throw new Error("LiveKit API Key or Secret not configured");
  }

  const at = new AccessToken(apiKey, apiSecret, {
    identity: identity,
    name: participantName,
  });

  at.addGrant({
    roomJoin: true,
    room: roomName,
    canPublish: true,
    canSubscribe: true,
    canPublishData: true,
  });

  return await at.toJwt();
}
