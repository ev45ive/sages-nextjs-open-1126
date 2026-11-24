import { redirect } from "next/navigation";

export const instant = false;

/**
 * Strona kategorii
 */
export default async function CatalogPage(
  props: PageProps<"/catalog">,
) {
 
  // if(dzis_sa_swieta...)
  redirect('/catalog/nowosci','replace')
}

 
