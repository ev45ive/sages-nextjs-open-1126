import { redirect } from "next/navigation";

export const instant = false;

/**
 * Strona kategorii
 */
export default async function CatalogPage(
  props: PageProps<"/products">,
) {
 
  // if(dzis_sa_swieta...)
  redirect('/products/nowosci','replace')
}

 
