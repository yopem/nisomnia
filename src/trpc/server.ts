import { createCaller } from "@/server/api/root"
import { createTRPCContext } from "@/server/api/trpc"

export function createContext() {
  return createTRPCContext({ headers: new Headers() })
}

export const api = createCaller(createContext)
