import { Breadcrumbs, Crumb } from "../../components/Breadcrumbs";

export const instant = false;


/**
 * Strona kategorii
 */
export default async function CatalogPage(
  props: PageProps<"/products/[...category]">,
) {
  const { category = [] } = await props.params;
  const { query } = await props.searchParams;

  const crumbs: Crumb[] = [
    { label: "Home", href: "/" },
    ...category.map((c) => ({ label: c, href: "/" })),
  ];
  // nextNotFoundCheck

  return (
    <div>
      <Breadcrumbs items={crumbs} />
    </div>
  );
}

