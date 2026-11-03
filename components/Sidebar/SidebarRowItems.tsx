import { B2CConfig } from "@/store";
import {
  ArrowsLeftRight,
  Browsers,
  CalendarDots,
  ChatCenteredText,
  ChatTeardropText,
  Chats,
  ChatsCircle,
  ClipboardText,
  CreditCard,
  Eye,
  Fingerprint,
  Gear,
  GlobeHemisphereEast,
  Headset,
  House,
  HouseLine,
  IconProps,
  IdentificationBadge,
  Image,
  ImageIcon,
  NewspaperClipping,
  Question,
  SealCheck,
  Sliders,
  UserSound,
  Users,
  UsersFour,
  UsersThree,
} from "@phosphor-icons/react";

export const phosphoreIconProps = (selected: boolean): IconProps => {
  return {
    className: selected
      ? "fill-primary-700"
      : "fill-gray-600 dark:fill-slate-400",
    weight: "duotone",
    size: 22,
  };
};

export type SidebarRowMenu = {
  id: number;
  title: string;
  route?: string;
  icon?: (selected: boolean) => JSX.Element;
  sub_categories?: Array<SidebarRowMenu>;
  key?: string;
  badgeKey?: string;
  isHidden?: boolean;
};
export type SidebarRowItem = {
  id: number;
  headerTitle: string;
  route?: string;
  items: Array<SidebarRowMenu> | null;
};

export const sidebarRowItems = (
  settings: B2CConfig | null,
): SidebarRowItem[] => {
  const items: SidebarRowItem[] = [
    {
      id: 0,
      headerTitle: "",
      items: [
        {
          id: 2,
          title: "صفحه اصلی",
          route: "/",
          sub_categories: [],
          icon: (selected) => <House {...phosphoreIconProps(selected)} />,
          key: "dashboard",
        },
        {
          id: 402,
          title: "کاربران",
          route: "/users",
          icon: (selected) => <UsersFour {...phosphoreIconProps(selected)} />,
          key: "users",
        },
        {
          id: 402,
          title: "میهمانان",
          route: "/users/guests",
          icon: (selected) => <UsersFour {...phosphoreIconProps(selected)} />,
          key: "advisors",
        },
        {
          id: 403,
          title: "مشاوران",
          route: "/advisors",
          icon: (selected) => <UsersThree {...phosphoreIconProps(selected)} />,
          sub_categories: [
            {
              id: 10,
              title: "همه",
              route: `/advisors`,
              key: "advisors",
            },
            {
              id: 1,
              title: "در انتظار بررسی",
              route: `/advisors?status=10`,
              key: "advisors",
            },
            {
              id: 2,
              title: "تایید شده",
              route: `/advisors?status=20`,
              key: "advisors",
            },
            {
              id: 3,
              title: "تایید نشده",
              route: `/advisors?status=100`,
              key: "advisors",
            },
            {
              id: 4,
              title: "مشاوران ویژه",
              route: `/advisors?is_special=true`,
              key: "advisors",
            },
          ],
          key: "advisors",
        },
        {
          id: 404,
          title: "مالکان",
          route: "/owners",
          icon: (selected) => <Users {...phosphoreIconProps(selected)} />,
          sub_categories: [
            {
              id: 10,
              title: "همه",
              route: `/owners`,
              key: "owners",
            },
            {
              id: 1,
              title: "در انتظار بررسی",
              route: `/owners?status=10`,
              badgeKey: "pendingOwnersOwners",
            },
            {
              id: 2,
              title: "تایید شده",
              route: `/owners?status=100`,
              key: "owners",
            },
            {
              id: 3,
              title: "خطا در بررسی خودکار",
              route: `/owners?status=50`,
              key: "owners",
            },
            {
              id: 4,
              title: "تایید نشده",
              route: `/owners?status=90`,
              key: "owners",
            },
          ],
          key: "owners",
        },
      ],
    },

    {
      id: 2,
      headerTitle: "املاک",
      items: [
        {
          id: 403,
          title: "ملک ها",
          route: "/properties",
          icon: (selected) => <HouseLine {...phosphoreIconProps(selected)} />,
          sub_categories: [
            {
              id: 0,
              title: "همه",
              route: `/properties`,
            },
            {
              id: 10,
              title: "ثبت اولیه",
              route: `/properties?status=10`,
            },
            {
              id: 1,
              title: "در حال ثبت",
              route: `/properties?status=15`,
            },
            {
              id: 2,
              title: "در انتظار تایید کارشناس جایاب",
              route: `/properties?status=20`,
              badgeKey: "waitingProperties",
            },
            {
              id: 21,
              title: "بررسی مجدد - ویرایش شده",
              route: `/properties?status=31`,
              badgeKey: "editedProperties",
            },
            {
              id: 3,
              title: "تایید نشده",
              route: `/properties?status=25`,
            },
            {
              id: 4,
              title: "منتشر شده",
              route: `/properties?status=30`,
            },
            {
              id: 5,
              title: "حذف شده",
              route: `/properties?status=60`,
            },
          ],
          key: "properties",
        },
        {
          id: 403,
          title: "درخواست های احراز ملک",
          route: "/property-authorize",
          icon: (selected) => <Fingerprint {...phosphoreIconProps(selected)} />,
          sub_categories: [
            {
              id: 1,
              title: "در انتظار بررسی",
              route: `/property-authorize?status=20`,
            },
            {
              id: 2,
              title: "تایید شده",
              route: `/property-authorize?status=100`,
            },
            {
              id: 4,
              title: "تایید نشده",
              route: `/property-authorize?status=90`,
            },
          ],
          key: "property-options",
        },
        {
          id: 4034,
          title: "درخواست های ممتاز شدن ملک",
          route: "/property-badges",
          icon: (selected) => <SealCheck {...phosphoreIconProps(selected)} />,
          sub_categories: [
            {
              id: 1,
              title: "در انتظار بررسی",
              route: `/property-badges?status=20`,
            },
            {
              id: 11,
              title: "در حال انجام",
              route: `/property-badges?status=30`,
            },
            {
              id: 2,
              title: "تایید شده",
              route: `/property-badges?status=100`,
            },
            {
              id: 4,
              title: "تایید نشده",
              route: `/property-badges?status=90`,
            },
          ],
          key: "property-badges",
        },
        {
          id: 403432,
          title: "درخواست های بهینه سازی تصاویر",
          route: "/property-photo-upgrade-requests",
          icon: (selected) => <ImageIcon {...phosphoreIconProps(selected)} />,
          sub_categories: [
            {
              id: 123,
              title: "همه",
              route: `/property-photo-upgrade-requests`,
            },
            {
              id: 1,
              title: "در انتظار بررسی",
              route: `/property-photo-upgrade-requests?status=20`,
              badgeKey: "pendingPhotoUpgradeRequest",
            },
            {
              id: 11,
              title: "در حال انجام",
              route: `/property-photo-upgrade-requests?status=30`,
              badgeKey: "inProgressPhotoUpgradeRequest",
            },
            {
              id: 2,
              title: "تایید شده",
              route: `/property-photo-upgrade-requests?status=100`,
            },
          ],
          key: "property-photo-upgrade-requests",
        },
        {
          id: 402,
          title: "آپشن های املاک",
          route: "/property-options",
          icon: (selected) => <Sliders {...phosphoreIconProps(selected)} />,
          sub_categories: [],
          key: "property-options",
        },
        {
          id: 40212,
          title: "آمار کلیک دکمه تماس",
          route: "/call-logs",
          icon: (selected) => <Sliders {...phosphoreIconProps(selected)} />,
          key: "call-logs",
        },
        {
          id: 40213,
          title: "درخواست های رزرو",
          route: "/property-reserves",
          icon: (selected) => (
            <ClipboardText {...phosphoreIconProps(selected)} />
          ),
          key: "property-reserves",
        },
        {
          id: 405,
          title: "چت‌های کاربران و مالک",
          route: "/messenger-messages",
          icon: (selected) => <Chats {...phosphoreIconProps(selected)} />,
          key: "messenger-messages",
        },
        {
          id: 406,
          title: "چت روم ها",
          route: "/messenger-chatrooms",
          icon: (selected) => (
            <ChatCenteredText {...phosphoreIconProps(selected)} />
          ),
          key: "messenger-chatrooms",
        },
        {
          id: 407,
          title: "گزارش‌ها",
          route: "/property-reports",
          icon: (selected) => <UserSound {...phosphoreIconProps(selected)} />,
          sub_categories: [],
          key: "property-reports",
          badgeKey: "pendingReports",
        },
      ],
    },

    {
      id: 3,
      headerTitle: "اشتراک ها",
      items: [
        {
          id: 402,
          title: "پلن ها",
          route: "/subscription-plans",
          icon: (selected) => <CreditCard {...phosphoreIconProps(selected)} />,
          sub_categories: [],
          key: "subscription-plans",
        },
        {
          id: 403,
          title: "اشتراک کاربران",
          route: "/subscriptions",
          icon: (selected) => <CreditCard {...phosphoreIconProps(selected)} />,
          sub_categories: [],
          key: "subscriptions",
        },
      ],
    },

    {
      id: 312133,
      headerTitle: "اعلان",
      items: [
        {
          id: 11,
          title: "لیست اعلان ها",
          route: "/notifications",
          icon: (selected) => <ChatsCircle {...phosphoreIconProps(selected)} />,
          sub_categories: [],
          key: "notifications",
        },
        {
          id: 12,
          title: "ارسال اعلان",
          route: "/notifications",
          icon: (selected) => (
            <ChatTeardropText {...phosphoreIconProps(selected)} />
          ),
          sub_categories: [
            {
              id: 334535,
              title: "ارسال به گروه",
              route: "/notifications/create?type=2",
              icon: (selected) => (
                <ChatsCircle {...phosphoreIconProps(selected)} />
              ),
              sub_categories: [],
              key: "notifications",
            },
            {
              id: 5002112,
              title: "ارسال به موبایل",
              icon: (selected) => (
                <ChatsCircle {...phosphoreIconProps(selected)} />
              ),
              route: "/notifications/create?type=1",
              sub_categories: [],
              key: "notifications",
            },
          ],
          key: "notifications",
        },
      ],
    },

    {
      id: 121,
      headerTitle: "تنظیمات",
      items: [
        {
          id: 3,
          title: "درگاه های پرداخت",
          route: "/payment-gateways",
          icon: (selected) => (
            <ArrowsLeftRight {...phosphoreIconProps(selected)} />
          ),
          key: "payment-gateways",
        },
        {
          id: 4,
          title: "شهر و استان",
          route: "/cities",
          icon: (selected) => (
            <GlobeHemisphereEast {...phosphoreIconProps(selected)} />
          ),
          sub_categories: [],
          key: "cities",
        },
        {
          id: 402,
          title: "روزهای پیک",
          route: "/peak-days",
          icon: (selected) => (
            <CalendarDots {...phosphoreIconProps(selected)} />
          ),
          key: "peak-days",
        },
        {
          id: 12,
          title: "تنظیمات",
          route: "/settings",
          icon: (selected) => <Gear {...phosphoreIconProps(selected)} />,
          sub_categories: [],
          key: "settings",
        },
      ],
    },

    {
      id: 312323,
      headerTitle: "ارتباط با کاربران",
      items: [
        {
          id: 11,
          title: "تیکت",
          route: "/tickets",
          icon: (selected) => <Headset {...phosphoreIconProps(selected)} />,
          sub_categories: [
            {
              id: 0,
              title: "همه",
              route: "/tickets",
              key: "tickets",
            },
            {
              id: 1,
              title: "منتظر پاسخ",
              route: "/tickets?status=1",
              badgeKey: "pendingTickets",
              key: "tickets",
            },
            {
              id: 2,
              title: "پاسخ داده شده",
              route: "/tickets?status=2",
              key: "tickets",
            },
            {
              id: 3,
              title: "بسته شده",
              route: "/tickets?status=3",
              key: "tickets",
            },
          ],
          key: "tickets",
        },
        {
          id: 334535,
          title: "پرسش و پاسخ",
          route: "/content-questions",
          icon: (selected) => <Question {...phosphoreIconProps(selected)} />,
          sub_categories: [],
          key: "content-questions",
        },
      ],
    },

    {
      id: 31,
      headerTitle: "محتوای پایه",
      items: [
        {
          id: 70287,
          title: "بنر ها",
          route: "/banners",
          icon: (selected) => <Image {...phosphoreIconProps(selected)} />,
          sub_categories: [],
          key: "banners",
        },
        {
          id: 32,
          title: "دسته بندی محتوای پایه",
          route: "/content-categories",
          icon: (selected) => (
            <ClipboardText {...phosphoreIconProps(selected)} />
          ),
          sub_categories: [],
          key: "content-categories",
        },
        {
          id: 33,
          title: "محتوای پایه",
          route: "/contents",
          icon: (selected) => (
            <NewspaperClipping {...phosphoreIconProps(selected)} />
          ),
          sub_categories:
            settings?.content_categories?.map((e, i) => ({
              id: i,
              title: e?.title || "",
              route: e.id > 0 ? `/contents?category_id=${e.id}` : "/contents",
            })) || [],
          key: "contents",
        },
        {
          id: 34,
          title: "صفحات لندینگ",
          route: "/landing-pages",
          icon: (selected) => <Browsers {...phosphoreIconProps(selected)} />,
          key: "landing-pages",
        },
        {
          id: 26313,
          title: "تنظیمات سئو",
          icon: (selected) => <Eye {...phosphoreIconProps(selected)} />,
          sub_categories: [
            {
              id: 26316,
              title: "ریدایرکت",
              route: "/redirect-urls",
            },
            {
              id: 26313,
              title: "robot.txt",
              route: "/seo-setting/edit/robot",
            },
            {
              id: 26317,
              title: "llms.txt",
              route: "/seo-setting/edit/llms",
            },
            {
              id: 26314,
              title: "sitemap.xml",
              route: "/seo-setting/edit/sitemap",
            },
            {
              id: 26315,
              title: "گزارش صفحات",
              route: "/page-seo-analyzes",
            },
          ],
          key: "seo-setting",
        },
      ],
    },

    {
      id: 25,
      headerTitle: "سطوح دسترسی",
      items: [
        {
          id: 26,
          title: "سطوح دسترسی",
          icon: (selected) => <Eye {...phosphoreIconProps(selected)} />,
          sub_categories: [
            {
              id: 2,
              title: "نقش ها",
              route: "/acl/roles",
            },
          ],
          key: "access-control",
        },
        {
          id: 27,
          title: "مدیران",
          route: "/acl/admins",
          icon: (selected) => (
            <IdentificationBadge {...phosphoreIconProps(selected)} />
          ),
          sub_categories: [],
          key: "access-control",
        },
      ],
    },
  ];
  return items;
};
export const permissionTableHeaderTitles = [
  { id: 1, title: "ردیف" },
  { id: 2, title: "عنوان فارسی" },
  { id: 3, title: "عنوان انگلیسی" },
  { id: 4, title: "اضافه کردن" },
  { id: 5, title: "مشاهده کردن" },
  { id: 6, title: "ویرایش کردن" },
  { id: 7, title: "حذف کردن" },
  { id: 8, title: "همه" },
];

export const genderItems = [
  { id: 1, key: 1, title: "مرد" },
  { id: 2, key: 0, title: "زن" },
];
