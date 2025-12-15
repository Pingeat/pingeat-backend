import { Tenant, TenantVertical } from "@prisma/client";
import { ITenantRepository } from "./ITenantRepository";
import { prisma } from "../../infrastructure/db/prismaClient";
import { logger } from "../../infrastructure/logging/logger";

class PrismaTenantRepository implements ITenantRepository {
  async findActiveByPhoneNumberId(phoneNumberId: string): Promise<Tenant | null> {
    const tenant = await prisma.tenant.findFirst({
      where: {
        phoneNumberId,
        isActive: true,
      },
    });
    if (!tenant) {
      logger.warn("No active tenant found for phone_number_id", { phoneNumberId });
    }
    return tenant;
  }
}

export class TenantService {
  private readonly repo: ITenantRepository;

  constructor(repo?: ITenantRepository) {
    this.repo = repo ?? new PrismaTenantRepository();
  }

  async findActiveByPhoneNumberId(phoneNumberId: string): Promise<Tenant | null> {
    return this.repo.findActiveByPhoneNumberId(phoneNumberId);
  }

  isRestaurant(tenant: Tenant): boolean {
    return tenant.vertical === TenantVertical.RESTAURANT;
  }

  isChurch(tenant: Tenant): boolean {
    return tenant.vertical === TenantVertical.CHURCH;
  }
}
