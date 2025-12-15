export type ConversationContext = {
  step: string;
  data: Record<string, unknown>;
};

const stateStore = new Map<string, ConversationContext>();

function key(tenantId: string, phone: string): string {
  return `${tenantId}:${phone}`;
}

export const ConversationState = {
  get(tenantId: string, phone: string): ConversationContext | undefined {
    return stateStore.get(key(tenantId, phone));
  },
  set(tenantId: string, phone: string, ctx: ConversationContext): void {
    stateStore.set(key(tenantId, phone), ctx);
  },
  clear(tenantId: string, phone: string): void {
    stateStore.delete(key(tenantId, phone));
  },
};
