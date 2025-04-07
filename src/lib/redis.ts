const UPSTASH_REDIS_REST_URL = process.env.UPSTASH_REDIS_REST_URL;
const UPSTASH_REDIS_REST_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;

if (!UPSTASH_REDIS_REST_URL || !UPSTASH_REDIS_REST_TOKEN) {
  throw new Error("Missing Upstash Redis environment variables");
}

export async function redisSet(key: string, value: any) {
  const response = await fetch(`${UPSTASH_REDIS_REST_URL}/set/${key}/${encodeURIComponent(JSON.stringify(value))}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${UPSTASH_REDIS_REST_TOKEN}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to set key: ${key}`);
  }

  return await response.json();
}

export async function redisGet(key: string) {
  const response = await fetch(`${UPSTASH_REDIS_REST_URL}/get/${key}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${UPSTASH_REDIS_REST_TOKEN}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to get key: ${key}`);
  }

  const data = await response.json();
  return data.result ? JSON.parse(data.result) : null;
}
