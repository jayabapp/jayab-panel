"use client";

import { apiRoutes, IMAGE_URL } from "@/utils/urls";
import { useEffect, useState } from "react";
import { TrashIcon } from "@heroicons/react/24/outline";
import { ApiCall } from "@/helpers/ApiCall";
import { Spinner } from "@nextui-org/react";

import ImageUploader from "@/components/Form/ImageUploader";
import ConfirmModal from "@/components/Modal/ConfirmModal";
import PageHeader from "@/components/Table/PageHeader";
import FormSwitch from "@/components/Form/FormSwitch";
import Loading from "@/components/shared/Loading";

const HERO_BANNER_POSITION = "main_1";

type Attachment = {
  id: number;
  bucket: string;
  end_point: string;
  path: string;
  name: string;
  alt?: string;
};

type HeroBanner = {
  id: number;
  title: string;
  is_active: boolean;
  description?: string | null;
  link?: string | null;
  position: string;
  sort_order?: number | null;
  property_id?: number | null;
  image_id?: number | null;
  image_sm_id?: number | null;
  image?: Attachment | null;
  image_sm?: Attachment | null;
};

const endpoint = apiRoutes.BANNER1;

const sortSlides = (list: HeroBanner[]) =>
  [...list].sort((a, b) => {
    const ao = a.sort_order ?? Number.MAX_SAFE_INTEGER;
    const bo = b.sort_order ?? Number.MAX_SAFE_INTEGER;
    return ao !== bo ? ao - bo : a.id - b.id;
  });

const toPayload = (b: HeroBanner) => ({
  title: b.title,
  position: b.position,
  is_active: b.is_active,
  description: b.description || undefined,
  link: b.link || undefined,
  property_id: b.property_id || undefined,
  image_id: b.image_id || undefined,
  image_sm_id: b.image_sm_id || undefined,
  sort_order: b.sort_order ?? undefined,
});

const HeroBannersManager = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [slides, setSlides] = useState<HeroBanner[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [draggedId, setDraggedId] = useState<number | null>(null);

  useEffect(() => {
    fetchList();
  }, []);

  /* -------------------------------- GET LIST -------------------------------- */
  const fetchList = () => {
    setIsLoading(true);
    ApiCall(
      "GET",
      endpoint,
      { position: HERO_BANNER_POSITION, per_page: 50 },
      "GET HERO SLIDES",
      ({ data }) => {
        setSlides(sortSlides(data?.data || []));
        setIsLoading(false);
      },
      () => setIsLoading(false),
    );
  };

  /* -------------------------------- PERSIST -------------------------------- */
  const persist = (banner: HeroBanner) => {
    ApiCall(
      "PUT",
      `${endpoint}/${banner.id}`,
      toPayload(banner),
      "UPDATE HERO SLIDE",
      () => {},
      () => fetchList(), // اگر ذخیره خطا داد، لیست رو از سرور برگردون تا حالت واقعی نمایش داده بشه
    );
  };

  const updateSlide = (id: number, patch: Partial<HeroBanner>) => {
    setSlides((prev) => {
      const next = prev.map((s) => (s.id === id ? { ...s, ...patch } : s));
      const updated = next.find((s) => s.id === id);
      if (updated) persist(updated);
      return next;
    });
  };

  /* -------------------------------- CREATE -------------------------------- */
  const createSlide = (attachment: Attachment) => {
    setIsCreating(true);
    const nextOrder =
      slides.reduce((max, s) => Math.max(max, s.sort_order ?? 0), 0) + 1;

    ApiCall(
      "POST",
      endpoint,
      {
        title: attachment?.alt || `اسلاید هیرو ${slides.length + 1}`,
        position: HERO_BANNER_POSITION,
        is_active: true,
        image_id: attachment.id,
        sort_order: nextOrder,
      },
      "CREATE HERO SLIDE",
      () => {
        setIsCreating(false);
        fetchList();
      },
      () => setIsCreating(false),
    );
  };

  /* -------------------------------- DELETE -------------------------------- */
  const confirmDelete = () => {
    if (!deleteTargetId) return;
    setIsDeleting(true);
    ApiCall(
      "DELETE",
      `${endpoint}/${deleteTargetId}`,
      null,
      "DELETE HERO SLIDE",
      () => {
        setIsDeleting(false);
        setDeleteTargetId(null);
        fetchList();
      },
      () => setIsDeleting(false),
    );
  };

  /* -------------------------------- REORDER -------------------------------- */
  const handleDrop = (targetId: number) => {
    if (draggedId == null || draggedId === targetId) {
      setDraggedId(null);
      return;
    }
    setSlides((prev) => {
      const fromIndex = prev.findIndex((s) => s.id === draggedId);
      const toIndex = prev.findIndex((s) => s.id === targetId);
      if (fromIndex === -1 || toIndex === -1) return prev;

      const next = [...prev];
      const [moved] = next.splice(fromIndex, 1);
      next.splice(toIndex, 0, moved);

      const reordered = next.map((s, index) => ({ ...s, sort_order: index }));
      reordered.forEach((s) => persist(s));
      return reordered;
    });
    setDraggedId(null);
  };

  if (isLoading) return <Loading />;

  return (
    <div className="app-container-profile">
      <PageHeader
        title="مدیریت اسلایدر هیرو"
        hasCreateButton={false}
        hasBackButton={true}
      />

      <div className="bg-primary/10 text-primary-500 px-3 py-2 rounded-lg w-fit mt-3">
        همه‌ی تصاویری که اینجا اضافه می‌کنی، خودکار و پشت‌سرهم در بالای صفحه‌ی
        اصلی سایت نمایش داده می‌شوند. برای تغییر ترتیب، کارت‌ها رو جابه‌جا (Drag
        & Drop) کن. برای جایگزین کردن یک تصویر، روی «جایگزینی تصویر» همان کارت
        کلیک کن.
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-6">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            draggable
            onDragStart={() => setDraggedId(slide.id)}
            onDragOver={(e) => e.preventDefault()}
            onDrop={() => handleDrop(slide.id)}
            className={`rounded-xl border border-gray-100 dark:border-slate-700 bg-white dark:bg-slate-800 p-4 cursor-grab active:cursor-grabbing transition-opacity ${
              draggedId === slide.id ? "opacity-40" : "opacity-100"
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold opacity-60">
                اسلاید #{index + 1}
              </span>
              <button
                onClick={() => setDeleteTargetId(slide.id)}
                className="text-danger flex items-center gap-1 text-xs"
              >
                <TrashIcon className="w-4" />
                حذف اسلاید
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-xs mb-1 opacity-70">تصویر دسکتاپ</p>
                {slide.image ? (
                  <img
                    alt={slide.image.alt || slide.title}
                    src={IMAGE_URL(slide.image)}
                    className="w-full aspect-video object-cover rounded-lg mb-2"
                  />
                ) : (
                  <div className="w-full aspect-video rounded-lg mb-2 flex items-center justify-center bg-neutral-100 dark:bg-slate-700 text-xs opacity-60">
                    بدون تصویر
                  </div>
                )}
                <ImageUploader
                  title=""
                  options={{ imageType: "BANNER" }}
                  list={[]}
                  addImageLabel="جایگزینی تصویر"
                  onSelect={(img: Attachment) =>
                    updateSlide(slide.id, { image_id: img.id, image: img })
                  }
                  onDelete={() => {}}
                  disabled={false}
                />
              </div>

              <div>
                <p className="text-xs mb-1 opacity-70">
                  تصویر موبایل (اختیاری)
                </p>
                {slide.image_sm ? (
                  <img
                    alt={slide.image_sm.alt || slide.title}
                    src={IMAGE_URL(slide.image_sm)}
                    className="w-full aspect-video object-cover rounded-lg mb-2"
                  />
                ) : (
                  <div className="w-full aspect-video rounded-lg mb-2 flex items-center justify-center bg-neutral-100 dark:bg-slate-700 text-xs opacity-60">
                    بدون تصویر
                  </div>
                )}
                <ImageUploader
                  title=""
                  options={{ imageType: "BANNER_SM" }}
                  list={[]}
                  addImageLabel="جایگزینی تصویر"
                  onSelect={(img: Attachment) =>
                    updateSlide(slide.id, {
                      image_sm_id: img.id,
                      image_sm: img,
                    })
                  }
                  onDelete={() => {}}
                  disabled={false}
                />
              </div>
            </div>

            <div className="mt-3">
              <FormSwitch
                title="فعال"
                checked={slide.is_active}
                onCheck={(checked) =>
                  updateSlide(slide.id, { is_active: checked })
                }
              />
            </div>
          </div>
        ))}

        {/* --------------------------- ADD NEW SLIDE CARD --------------------------- */}
        <div className="rounded-xl border border-dashed border-gray-300 dark:border-slate-600 p-4 flex flex-col items-center justify-center min-h-[16rem]">
          {isCreating ? (
            <Spinner />
          ) : (
            <ImageUploader
              title="افزودن اسلاید جدید"
              options={{ imageType: "BANNER" }}
              list={[]}
              addImageLabel="افزودن تصویر"
              onSelect={(img: Attachment) => createSlide(img)}
              onDelete={() => {}}
              disabled={false}
            />
          )}
        </div>
      </div>

      {/*********************** DELETE MODAL ************************/}
      <ConfirmModal
        text="آیا میخواهید این اسلاید را حذف کنید؟"
        isLoading={isDeleting}
        onConfirm={confirmDelete}
        isVisible={!!deleteTargetId}
        onHide={() => setDeleteTargetId(null)}
      />
    </div>
  );
};

export default HeroBannersManager;
