// import { RestaurantMenuItem } from "@prisma/client";

// export interface IMenuRepository {
//   findAvailableByCodes(tenantId: string, codes: string[]): Promise<RestaurantMenuItem[]>;
// }


// import { RestaurantMenuItem } from "@prisma/client";

// export interface IMenuRepository {
//   findAvailableByCodes(
//     tenantId: number,
//     codes: string[]
//   ): Promise<RestaurantMenuItem[]>;
// }



import { RestaurantMenuItem } from "@prisma/client";

export interface IMenuRepository {
  findAvailableByCodes(
    tenantId: string,
    codes: string[]
  ): Promise<RestaurantMenuItem[]>;

  findMenuByTenant(
    tenantId: string,
    category?: string | null
  ): Promise<RestaurantMenuItem[]>;

  findCategoriesByTenant(tenantId: string): Promise<string[]>;
}

