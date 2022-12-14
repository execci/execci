import { setTimeoutSafe } from 'src/server/setTimeoutSafe';

export async function wait(
  { ms }: { ms: number },
  { loggingTag }: { loggingTag: string },
): Promise<void> {
  return await new Promise((resolve) =>
    setTimeoutSafe(loggingTag, resolve, ms),
  );
}
