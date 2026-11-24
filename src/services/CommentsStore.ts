import { revalidatePath, revalidateTag, updateTag } from "next/cache";

// Pamięć modułu: komentarze znikają po restarcie dev servera (świadome ograniczenie demo).
export type Comment = { user: string; comment: string };

const extraComments = new Map<string, Comment[]>();

export function getExtraComments(postId: string): Comment[] {
  return extraComments.get(postId) ?? [];
}

export function addExtraComment(postId: string, comment: Comment) {
  // revalidateTag(`blog/posts/${postId}/comments`)
  updateTag(`blog/posts/${postId}/comments`);
  

  extraComments.set(postId, [...getExtraComments(postId), comment]);
}
