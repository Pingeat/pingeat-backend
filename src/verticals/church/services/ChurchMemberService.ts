import { ChurchInteractionType, ChurchMember } from "@prisma/client";
import { prisma } from "../../../infrastructure/db/prismaClient";
import { IChurchMemberRepository } from "../domain/IChurchMemberRepository";
import { IInteractionRepository } from "../domain/IInteractionRepository";

class PrismaChurchMemberRepository implements IChurchMemberRepository {
  async findByPhone(
    tenantId: string,
    phone: string
  ): Promise<ChurchMember | null> {
    return prisma.churchMember.findFirst({
      where: { tenantId, phone },
    });
  }

  async upsertMember(
    tenantId: string,
    phone: string,
    name?: string,
    email?: string
  ): Promise<ChurchMember> {
    const existing = await this.findByPhone(tenantId, phone);
    if (existing) {
      return prisma.churchMember.update({
        where: { id: existing.id },
        data: {
          name: name ?? existing.name,
          email: email ?? existing.email,
          status: "Member",
          consent: true,
        },
      });
    }
    return prisma.churchMember.create({
      data: {
        tenantId,
        phone,
        name,
        email,
        status: "Member",
        consent: true,
      },
    });
  }

  async createVisitorIfNotExists(
    tenantId: string,
    phone: string
  ): Promise<ChurchMember> {
    const existing = await this.findByPhone(tenantId, phone);
    if (existing) return existing;

    return prisma.churchMember.create({
      data: {
        tenantId,
        phone,
        status: "Visitor",
      },
    });
  }
}

class PrismaInteractionRepository implements IInteractionRepository {
  async createInteraction(
    tenantId: string,
    type: ChurchInteractionType,
    content: string,
    memberId?: string
  ) {
    return prisma.churchInteraction.create({
      data: {
        tenantId,
        memberId,
        type,
        content,
      },
    });
  }
}

export class ChurchMemberService {
  private readonly memberRepo: IChurchMemberRepository;
  private readonly interactionRepo: IInteractionRepository;

  constructor(
    memberRepo?: IChurchMemberRepository,
    interactionRepo?: IInteractionRepository
  ) {
    this.memberRepo = memberRepo ?? new PrismaChurchMemberRepository();
    this.interactionRepo = interactionRepo ?? new PrismaInteractionRepository();
  }

  async registerMember(
    tenantId: string,
    phone: string,
    name?: string,
    email?: string
  ): Promise<ChurchMember> {
    const member = await this.memberRepo.upsertMember(
      tenantId,
      phone,
      name,
      email
    );
    await this.interactionRepo.createInteraction(
      tenantId,
      ChurchInteractionType.GENERAL_MESSAGE,
      "New member registered via WhatsApp",
      member.id
    );
    return member;
  }

  async ensureVisitor(tenantId: string, phone: string): Promise<ChurchMember> {
    return this.memberRepo.createVisitorIfNotExists(tenantId, phone);
  }

  async logPrayerRequest(
    tenantId: string,
    phone: string,
    content: string
  ): Promise<void> {
    const member = await this.memberRepo.createVisitorIfNotExists(
      tenantId,
      phone
    );
    await this.interactionRepo.createInteraction(
      tenantId,
      ChurchInteractionType.PRAYER_REQUEST,
      content,
      member.id
    );
  }
}
