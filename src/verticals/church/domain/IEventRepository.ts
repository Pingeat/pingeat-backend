import { ChurchEvent } from "@prisma/client";

export interface IEventRepository {
  findByQrCode(
    tenantId: string,
    qrCodeId: string
  ): Promise<ChurchEvent | null>;
}
