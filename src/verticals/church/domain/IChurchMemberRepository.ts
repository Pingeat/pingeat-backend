import { ChurchMember } from "@prisma/client";

export interface IChurchMemberRepository {
  findByPhone(tenantId: string, phone: string): Promise<ChurchMember | null>;
  upsertMember(
    tenantId: string,
    phone: string,
    name?: string,
    email?: string
  ): Promise<ChurchMember>;
  createVisitorIfNotExists(
    tenantId: string,
    phone: string
  ): Promise<ChurchMember>;
}
