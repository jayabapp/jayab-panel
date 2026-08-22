export const Url = process.env.NEXT_PUBLIC_BASE_URL;

export const baseUrl = `${Url}/api/v1`;
export const imageUrl = `${Url}/`;

export const imageUrlBase = `${Url}/images/contents/`;
export const IMAGE_URL = (item: {
  bucket: string;
  end_point: string;
  path: string;
  name: string;
}) => `https://${item?.bucket}.${item?.end_point}/${item?.path}/${item?.name}`;

export const apiRoutes = {
  __BASE: "/",

  DASHBOARD1: "/admin/dashboard",
  DASHBOARD2: "/admin/dashboard/business",
  DASHBOARD3: "/admin/dashboard/sidebar-badge",

  NOTIFICATIONS1: "/admin/notifications",
  NOTIFICATIONS2: (id: number) => `/admin/notifications/seen-at/${id}`,

  INIT1: "/admin/auth/init-settings",

  ADMINS: "/admin/access-control/admins",
  CREATE_ADMIN: "/admin/access-control/admins/signup",

  ACL_ROLES: "/admin/access-control/roles",
  ACL_ROLE_PERMISSIONS: (roleId: number) =>
    `/admin/access-control/rbac-list/${roleId}`,
  ACL_CREATE_RBAC: "/admin/access-control/rbac-list",
  ACL_MODULES: "/admin/access-control/modules",
  ACL_ROLE_NOTIF_PERMISSION1: "/admin/access-control/noitification-permissions",

  AU1: "/admin/auth/signin",
  AU2: "/admin/auth/two-step-verification",
  ADMIN_RBAC_LIST: "/admin/profile/rbac-list",
  ADMIN_PROFILE: "/admin/profile",

  SETTING1: "/admin/settings",
  SETTING2: "/settings/robots",
  SETTING3: "/settings/sitemap",
  SETTING4: "/settings/llms",

  CITIES1: "/admin/cities",

  UPLOAD_ATTACHMENT: (type: string, alt?: string) =>
    `/admin/attachments?type=${type}&alt=${alt || ""}`,
  DELETE_ATTACHMENT: (imageId: number) => `/admin/attachments/${imageId}`,
  UPLOAD_VIDEO: () => `/admin/attachments/video`,

  CATEGORIES1: "/admin/categories",
  CATEGORIES2: (parentId: number | null) =>
    `/admin/categories/parents/${parentId}`,

  CONTENT1: "/admin/content-categories",
  CONTENT2: "/admin/contents",
  CONTENT3: `/admin/content-questions`,
  CONTENT4: (key: string) => `/contents/by-key/${key}`,

  BANNER1: "/admin/banners",
  TICKET1: "/admin/tickets",

  OFFERCODE1: "/admin/offer-codes",

  USER1: "/admin/users",

  TURNOVER1: "/admin/turnovers",

  REPORTS: "/admin/reports",

  ADMIN_REPORTS1: "/admin/admin-report",

  FORM1: "/admin/form-builder",
  FORM2: "/admin/submitted-forms",

  CONTACT_US1: "/admin/contact-us",

  PAYMENT_GATEWAY1: "/admin/payment-gateways",

  PAYMENT_METHOD1: "/admin/payment-methods",

  ADVISOR1: "/admin/advisors",

  OWNER1: "/admin/owners",

  PROPERTY_OPTIONS1: "/admin/property-options",

  SUBSCRIPTION_PLANS1: "/admin/subscription-plans",

  PROPERTY_AUTH1: "/admin/property-authorize",

  PROPERTY_BADGE1: "/admin/property-badges",

  PEAK_DAYS1: "/admin/peak-days",

  LANDING_PAGE1: "/admin/landing-pages",

  PROPERTY1: "/admin/properties",

  SUBSCRIPTION1: "/admin/subscriptions",

  CALL_LOG1: "/admin/call-logs",

  REDIRECT_URL1: "/admin/redirect-urls",

  PAGE_SEO_ANALYZE1: "/admin/page-seo-analyzes",

  MESSENGER_MESSAGES1: "/admin/messenger-messages",

  MESSENGER_CHATROOM1: "/admin/messenger-chatrooms",

  PROPERTY_REPORT1: "/admin/property-reports",

  RESERVES1: "/admin/property-reserves",

  PHOTO_UPGRADE_REQUEST1: "/admin/property-photo-upgrade-requests",
};
