import { TenantVertical } from "@prisma/client";

export type RestaurantTenantConfig = {
  menuTemplateName?: string;
  templateLanguageCode?: string;
};

export type ChurchTenantConfig = {
  churchHistory?: string;
  serviceTimings?: string;
  ministries?: string;
  socials?: string;
  pastorPhone?: string;
  donation?: {
    eTransfer?: string;
    inPerson?: string;
    bankNote?: string;
  };
  sermon?: {
    latestTitle?: string;
    latestLink?: string;
  };
};

export type TenantConfig = RestaurantTenantConfig & ChurchTenantConfig;

export type TenantVerticalString = keyof typeof TenantVertical;
