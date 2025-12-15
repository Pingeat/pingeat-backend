// import { Prisma, RestaurantOrder, RestaurantMenuItem } from "@prisma/client";
// import { prisma } from "../../../infrastructure/db/prismaClient";
// import { ItemCodeQuantity } from "../domain/RestaurantTypes";
// import {
//   IOrderRepository,
//   OrderItemInput,
// } from "../domain/IOrderRepository";

// class PrismaOrderRepository implements IOrderRepository {
//   async createOrder(
//     tenantId: string,
//     customerPhone: string,
//     total: Prisma.Decimal,
//     items: OrderItemInput[]
//   ): Promise<RestaurantOrder> {
//     return prisma.restaurantOrder.create({
//       data: {
//         tenantId,
//         customerPhone,
//         total,
//         items: {
//           create: items,
//         },
//       },
//     });
//   }
// }

// export class RestaurantOrderService {
//   private readonly orderRepo: IOrderRepository;

//   constructor(orderRepo?: IOrderRepository) {
//     this.orderRepo = orderRepo ?? new PrismaOrderRepository();
//   }

//   async createOrderFromMenuItems(
//     tenantId: string,
//     customerPhone: string,
//     requested: ItemCodeQuantity[],
//     menuItems: RestaurantMenuItem[]
//   ): Promise<RestaurantOrder> {
//     if (requested.length === 0) {
//       throw new Error("No items provided");
//     }

//     const menuByCode = new Map(
//       menuItems.map((m) => [m.code.toUpperCase(), m])
//     );

//     const orderItems: OrderItemInput[] = [];
//     let total = new Prisma.Decimal(0);

//     for (const req of requested) {
//       const menu = menuByCode.get(req.code.toUpperCase());
//       if (!menu) continue;

//       const qty = req.qty > 0 ? req.qty : 1;
//       const unitPrice = menu.price;
//       const lineTotal = unitPrice.mul(qty);
//       total = total.add(lineTotal);

//       orderItems.push({
//         menuItemId: menu.id,
//         quantity: qty,
//         unitPrice,
//       });
//     }

//     if (orderItems.length === 0) {
//       throw new Error("All requested items are unavailable");
//     }

//     return this.orderRepo.createOrder(tenantId, customerPhone, total, orderItems);
//   }
// }




import { RestaurantOrder, RestaurantMenuItem } from "@prisma/client";
import { prisma } from "../../../infrastructure/db/prismaClient";
import { ItemCodeQuantity } from "../domain/RestaurantTypes";
import {
  IOrderRepository,
  OrderItemInput,
} from "../domain/IOrderRepository";

class PrismaOrderRepository implements IOrderRepository {
  async createOrder(
    tenantId: number,
    customerPhone: string,
    total: number,
    items: OrderItemInput[]
  ): Promise<RestaurantOrder> {
    return prisma.restaurantOrder.create({
      data: {
        tenantId,
        customerPhone,
        total,
        items: {
          create: items,
        },
      },
    });
  }
}

export class RestaurantOrderService {
  private readonly orderRepo: IOrderRepository;

  constructor(orderRepo?: IOrderRepository) {
    this.orderRepo = orderRepo ?? new PrismaOrderRepository();
  }

  async createOrderFromMenuItems(
    tenantId: number,
    customerPhone: string,
    requested: ItemCodeQuantity[],
    menuItems: RestaurantMenuItem[]
  ): Promise<RestaurantOrder> {
    if (requested.length === 0) {
      throw new Error("No items provided");
    }

    const menuByCode = new Map(
      menuItems.map((m) => [m.code.toUpperCase(), m])
    );

    const orderItems: OrderItemInput[] = [];
    let total = 0;

    for (const req of requested) {
      const menu = menuByCode.get(req.code.toUpperCase());
      if (!menu) continue;

      const qty = req.qty > 0 ? req.qty : 1;
      const unitPrice = menu.price; // number (Float in Prisma schema)
      const lineTotal = unitPrice * qty;
      total += lineTotal;

      orderItems.push({
        menuItemId: menu.id,
        quantity: qty,
        unitPrice,
      });
    }

    if (orderItems.length === 0) {
      throw new Error("All requested items are unavailable");
    }

    return this.orderRepo.createOrder(
      tenantId,
      customerPhone,
      total,
      orderItems
    );
  }
}
