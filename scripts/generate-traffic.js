const baseUrl = process.env.BASE_URL || "http://localhost:3000";
const totalRequests = Number(process.env.REQUESTS || 50);

async function request(path) {
  const startedAt = Date.now();
  try {
    const response = await fetch(`${baseUrl}${path}`);
    return {
      path,
      status: response.status,
      latencyMs: Date.now() - startedAt
    };
  } catch (error) {
    return {
      path,
      status: "network_error",
      latencyMs: Date.now() - startedAt,
      error: error.message
    };
  }
}

const results = [];

for (let index = 0; index < totalRequests; index += 1) {
  const path = index % 5 === 0 ? "/health" : "/api/orders";
  results.push(await request(path));
}

const failures = results.filter((result) => result.status !== 200);
const averageLatency =
  results.reduce((total, result) => total + result.latencyMs, 0) / results.length;

console.log(
  JSON.stringify(
    {
      baseUrl,
      totalRequests: results.length,
      failures: failures.length,
      averageLatencyMs: Math.round(averageLatency),
      sample: results.slice(0, 5)
    },
    null,
    2
  )
);
