import { getPublicCategories } from '@/lib/category-taxonomy';
import { getPublicLibraryPage } from '@/lib/public-content-list';

function parsePositiveInt(value: string | undefined, fallback: number) {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? Math.trunc(parsed) : fallback;
}

export async function loadLibraryInitialData(searchParams?: {
  page?: string;
  limit?: string;
  search?: string;
  category?: string;
  type?: string;
}) {
  const page = parsePositiveInt(searchParams?.page, 1);
  const limit = parsePositiveInt(searchParams?.limit, 10);
  const search = searchParams?.search?.trim() || '';
  const category = searchParams?.category?.trim() || '';
  const type = searchParams?.type?.trim() || '';

  const [library, categories] = await Promise.all([
    getPublicLibraryPage(page, limit, search, category, type),
    getPublicCategories(),
  ]);

  return {
    library,
    categories: categories.categories,
    initialSearchTerm: search,
    initialCategory: category,
    initialType: type,
  };
}
