import { Request, Response } from "express";
import { RestaurantMenuService } from "../../verticals/restaurant/services/RestaurantMenuService";
import { logger } from "../../infrastructure/logging/logger";

export class FlowMenuController {
  private readonly menuService: RestaurantMenuService;

  constructor() {
    this.menuService = new RestaurantMenuService();
  }

  /**
   * POST /flows/menu
   *
   * Expected body (you can shape this from Flow):
   * {
   *   "data": {
   *     "tenantId": "TENANT_UUID",
   *     "category": "Starters" // optional
   *   }
   * }
   */
  public getMenu = async (req: Request, res: Response): Promise<void> => {
    try {
      const { tenantId, category } = this.extractInput(req.body);

      if (!tenantId) {
        res.status(400).json({ error: "tenantId is required" });
        return;
      }

      const [items, categories] = await Promise.all([
        this.menuService.getMenuForTenant(tenantId, category || null),
        this.menuService.getCategoriesForTenant(tenantId),
      ]);

      // WhatsApp Flow "Data API" typically expects { data: { ... } }
      res.json({
        data: {
          categories: categories.map((cat) => ({
            id: cat,
            name: cat,
          })),
          items: items.map((item) => ({
            id: item.code, // using item code as id
            name: item.name,
            description: item.description ?? "",
            price:
              typeof item.price === "number"
                ? item.price
                : (item.price as any).toNumber
                ? (item.price as any).toNumber()
                : Number(item.price),
            category: item.category ?? null,
          })),
        },
      });
    } catch (err: any) {
      logger.error("Error in FlowMenuController.getMenu", err);
      res.status(500).json({ error: "Internal server error" });
    }
  };

  private extractInput(raw: any): { tenantId: string; category?: string } {
    const source = raw?.data ?? raw ?? {};
    return {
      tenantId: source.tenantId,
      category: source.category,
    };
  }
}
