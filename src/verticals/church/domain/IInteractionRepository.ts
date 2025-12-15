import { ChurchInteraction, ChurchInteractionType } from "@prisma/client";

export interface IInteractionRepository {
  createInteraction(
    tenantId: string,
    type: ChurchInteractionType,
    content: string,
    memberId?: string
  ): Promise<ChurchInteraction>;
}
