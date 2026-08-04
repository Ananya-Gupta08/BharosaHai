export function isDatabaseConnectionError(error: unknown) {
  const message = error instanceof Error ? error.message : String(error);

  return (
    message.includes("Tenant or user not found") ||
    message.includes("Can't reach database server") ||
    message.includes("ENOTFOUND") ||
    message.includes("ECONNREFUSED") ||
    message.includes("ETIMEDOUT") ||
    message.includes("P1001")
  );
}
