import { Tenant } from "@prisma/client";

export interface ITenantRepository {
  findActiveByPhoneNumberId(phoneNumberId: string): Promise<Tenant | null>;
}
