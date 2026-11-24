// Pamięć modułu: komentarze znikają po restarcie dev servera (świadome ograniczenie demo).
export type Comment = { user: string; comment: string };

const extraComments = new Map<string, Comment[]>();

export function getExtraComments(postId: string): Comment[] {
  return extraComments.get(postId) ?? [];
}

export function addExtraComment(postId: string, comment: Comment) {
  extraComments.set(postId, [...getExtraComments(postId), comment]);
}
