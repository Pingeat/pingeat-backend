// import { RestaurantMenuItem } from "@prisma/client";
// import { IMenuRepository } from "../domain/IMenuRepository";
// import { prisma } from "../../../infrastructure/db/prismaClient";

// class PrismaMenuRepository implements IMenuRepository {
//   async findAvailableByCodes(
//     tenantId: string,
//     codes: string[]
//   ): Promise<RestaurantMenuItem[]> {
//     if (codes.length === 0) {
//       return [];
//     }
//     return prisma.restaurantMenuItem.findMany({
//       where: {
//         tenantId,
//         code: { in: codes },
//         isAvailable: true,
//       },
//     });
//   }
// }

// export class RestaurantMenuService {
//   private readonly repo: IMenuRepository;

//   constructor(repo?: IMenuRepository) {
//     this.repo = repo ?? new PrismaMenuRepository();
//   }

//   async getAvailableItemsByCodes(
//     tenantId: string,
//     codes: string[]
//   ): Promise<RestaurantMenuItem[]> {
//     return this.repo.findAvailableByCodes(tenantId, codes);
//   }
// }



// import { RestaurantMenuItem } from "@prisma/client";
// import { IMenuRepository } from "../domain/IMenuRepository";
// import { prisma } from "../../../infrastructure/db/prismaClient";

// class PrismaMenuRepository implements IMenuRepository {
//   async findAvailableByCodes(
//     tenantId: number,
//     codes: string[]
//   ): Promise<RestaurantMenuItem[]> {
//     if (codes.length === 0) {
//       return [];
//     }

//     return prisma.restaurantMenuItem.findMany({
//       where: {
//         tenantId,
//         code: { in: codes },
//         isAvailable: true,
//       },
//     });
//   }
// }

// export class RestaurantMenuService {
//   private readonly repo: IMenuRepository;

//   constructor(repo?: IMenuRepository) {
//     this.repo = repo ?? new PrismaMenuRepository();
//   }

//   async getAvailableItemsByCodes(
//     tenantId: number,
//     codes: string[]
//   ): Promise<RestaurantMenuItem[]> {
//     return this.repo.findAvailableByCodes(tenantId, codes);
//   }
// }




import { RestaurantMenuItem } from "@prisma/client";
import { IMenuRepository } from "../domain/IMenuRepository";
import { prisma } from "../../../infrastructure/db/prismaClient";

class PrismaMenuRepository implements IMenuRepository {
  async findAvailableByCodes(
    tenantId: string,
    codes: string[]
  ): Promise<RestaurantMenuItem[]> {
    if (codes.length === 0) {
      return [];
    }

    return prisma.restaurantMenuItem.findMany({
      where: {
        tenantId,
        code: { in: codes },
        isAvailable: true,
      },
    });
  }

  async findMenuByTenant(
    tenantId: string,
    category?: string | null
  ): Promise<RestaurantMenuItem[]> {
    return prisma.restaurantMenuItem.findMany({
      where: {
        tenantId,
        isAvailable: true,
        ...(category ? { category } : {}),
      },
      orderBy: [
        { category: "asc" },
        { name: "asc" },
      ],
    });
  }

  async findCategoriesByTenant(tenantId: string): Promise<string[]> {
    const rows = await prisma.restaurantMenuItem.findMany({
      where: {
        tenantId,
        isAvailable: true,
        category: { not: null },
      },
      select: { category: true },
      distinct: ["category"],
      orderBy: { category: "asc" },
    });

    return rows
      .map((r) => r.category)
      .filter((c): c is string => Boolean(c));
  }
}

export class RestaurantMenuService {
  private readonly repo: IMenuRepository;

  constructor(repo?: IMenuRepository) {
    this.repo = repo ?? new PrismaMenuRepository();
  }

  /**
   * Existing method used for "order CODE1x2,CODE2x1" fallback.
   */
  async getAvailableItemsByCodes(
    tenantId: string,
    codes: string[]
  ): Promise<RestaurantMenuItem[]> {
    return this.repo.findAvailableByCodes(tenantId, codes);
  }

  /**
   * For Flow menu browsing – returns all available items,
   * optionally filtered by category.
   */
  async getMenuForTenant(
    tenantId: string,
    category?: string | null
  ): Promise<RestaurantMenuItem[]> {
    return this.repo.findMenuByTenant(tenantId, category);
  }

  /**
   * Distinct list of categories for this tenant (restaurant).
   */
  async getCategoriesForTenant(tenantId: string): Promise<string[]> {
    return this.repo.findCategoriesByTenant(tenantId);
  }
}
