import LibraryPageClient from '@/components/library/LibraryPageClient';
import { loadLibraryInitialData } from '@/lib/library-page';

export const revalidate = 60;

function getSearchParamValue(value: string | string[] | undefined) {
  if (Array.isArray(value)) return value[0] || '';
  return value || '';
}

export default async function LibraryPage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const resolvedSearchParams = await searchParams;
  const initialData = await loadLibraryInitialData({
    page: getSearchParamValue(resolvedSearchParams?.page),
    limit: getSearchParamValue(resolvedSearchParams?.limit),
    search: getSearchParamValue(resolvedSearchParams?.search),
    category: getSearchParamValue(resolvedSearchParams?.category),
    type: getSearchParamValue(resolvedSearchParams?.type),
  });

  return (
    <LibraryPageClient
      locale="vi"
      initialContents={initialData.library.contents}
      initialPagination={initialData.library.pagination}
      initialCategories={initialData.categories}
      initialSearchTerm={initialData.initialSearchTerm}
      initialCategory={initialData.initialCategory}
      initialType={initialData.initialType}
      initialLoadComplete
    />
  );
}
