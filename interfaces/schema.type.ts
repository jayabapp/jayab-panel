export type PrimitiveObject = {
  [key: string]: string;
};

export type DashboardElement = {
  id: number;
  title: string;
  sub_title?: string;
  value: number | string;
  route?: string;
  type?: "element" | "divider";
};

export type Notification = {
  id: number;
  user_id: number | null;
  role: string | null;
  title: string;
  body: string;
  topic: string | null;
  data: any | null;
  seen_at: Date | null;
  created_at: Date;
};

export type Setting = {
  id: number;
  title: string;
  key: string;
  value: string;
  max: number | null;
  min: number | null;
  data_type: string;
};
export enum SettingDataType {
  NUMBER = "NUMBER",
  TEXT = "TEXT",
  TEXT_AREA = "TEXT_AREA",
}

export type DateType = {
  year: number;
  month: number;
  day: number;
};

export type Admin = {
  id: number;
  username: string;
  password: string;
  full_name: string;
  mobile_number: string;
  role_id: number;
  role: AdminRole;
  business_id: number | null;
  created_at: Date;
  updated_at: Date;
};

export type AdminRole = {
  id: number;
  name: string;
  key: string | null;
};

export type ContentCategory = {
  id: number;
  title: string;
  key: string;
  image_id: number | null;
  dynamic_fields: Array<{ key: string; title: string }> | null;
};

export type Content = {
  id: number;
  title: string;
  slug: string | null;
  key: string | null;
  small_text: string | null;
  full_text: string | null;
  feature_image_id: number | null;
  feature_image: Attachment;
  is_active: boolean;
  category_id: number | null;
  order: number | null;
  html: string | null;
  view_count: number;
  link: string | null;
  video_id: number | null;
  fields: any;
  seo: any;
  created_at: Date;
};

export type Attachment = {
  id: number;
  user_id: number;
  admin_id: number;
  name: string;
  meta: string;
  thumbnail: string;
  type: number;
  path: string;
  bucket: string;
  region: string;
  end_point: string;
  alt: string;
  created_at: Date;
  updated_at: Date;
};

export type AccessControlList = {
  id?: number;
  module_id: number;
  module?: AccessControlModule;
  role_id?: number;
  c: boolean;
  r: boolean;
  u: boolean;
  d: boolean;
  v: boolean;
  all?: boolean;
};

export type AccessControlModule = {
  id: number;
  key: string;
  name: string;
};

export type BusinessProduct = {
  id: number;
  business_id: number;
  product_id: number;
  title: string;
  description: string | null;
  price: number;
  price_with_discount: number | null;
  discount_percent: number | null;
  image_id: number;
  image: Attachment;
  unit_id: number | null;
  business: Business;
  created_at: Date;
  updated_at: Date;
  deleted_at: Date | null;
};

export type Status = {
  id: string;
  title: string;
  hex: string;
};

export type OfferCodeCustomer = {
  id: number;
  full_name: string;
  mobile_number: string;
  is_used: boolean;
};

export type OrderItem = {
  id: number;
  order_id: number;
  business_product_id: number;
  business_product: BusinessProduct;
  price: number;
  total_price: number;
  discounted_price: number;
  tax: number;
  quantity: number;
  product?: Product;
  business_product_price: {
    attributes: Attribute[];
    business_product?: BusinessProduct;
  };
  created_at: Date;
  updated_at: Date;
};

export type Product = {
  id: number;
  product_code: string;
  title: string;
  title_en: string;
  description: string | null;
  category_id: number;
  unit_id: number | null;
  cheapest_business_product_id: number | null;
  feature_image_id: number;
  created_at: Date;
  updated_at: Date;
  deleted_at: Date | null;
};

export type AttributeGroup = {
  id: number;
  title: string;
  created_at: Date;
};

export type Category = {
  id: number;
  parent_id: number | null;
  title: string;
  key: string | null;
  image_id: number | null;
  image: Attachment;
  sort_order: number | null;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
  deleted_at: Date | null;
  parent: Category;
  children: Category[];
};

export type ProductTag = {
  id: number;
  title: string;
  image_id: number | null;
  created_at: Date;
  updated_at: Date;
};

export type SpecificationGroup = {
  id: number;
  title: string;
  is_filterable: boolean;
  filter_title: string | null;
};

export type Business = {
  id: number;
  title: string;
  description: string | null;
  address: string;
  contact_number: string | null;
  lat: number;
  lng: number;
  logo_id: number | null;
  logo: Attachment;
  rate: number | null;
  sort_order: number | null;
  commission: number;
  is_active: boolean;
  national_id: string | null;
  registration_number: string | null;
  economic_code: string | null;
  postal_code: string | null;
  created_at: Date;
  updated_at: Date;
};

export type Attribute = {
  id: number;
  title: string;
  sub_title: string | null;
  hex: string | null;
  product_id: number;
  attribute_group_id: number;
  attribute_group: AttributeGroup;
  sort_order: number | null;
};

export type PaymentGatewayParams = {
  title: string;
  key: string;
  value?: string;
};
export type PaymentGateway = {
  id: number;
  title: string;
  logo: string;
  key: string;
  is_active: boolean;
  params: PaymentGatewayParams[];
  created_at: Date;
  updated_at: Date;
};
