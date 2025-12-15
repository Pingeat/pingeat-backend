// import { Prisma, RestaurantOrder } from "@prisma/client";

// export type OrderItemInput = {
//   menuItemId: string;
//   quantity: number;
//   unitPrice: Prisma.Decimal;
// };

// export interface IOrderRepository {
//   createOrder(
//     tenantId: string,
//     customerPhone: string,
//     total: Prisma.Decimal,
//     items: OrderItemInput[]
//   ): Promise<RestaurantOrder>;
// }



import { RestaurantOrder } from "@prisma/client";

export interface OrderItemInput {
  menuItemId: number;
  quantity: number;
  unitPrice: number;
}

export interface IOrderRepository {
  createOrder(
    tenantId: number,
    customerPhone: string,
    total: number,
    items: OrderItemInput[]
  ): Promise<RestaurantOrder>;
}
