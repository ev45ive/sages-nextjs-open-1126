"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { BlogPost } from "@/services/model";
import { useState } from "react";

type Props = {
  postId: string;
  comments?: BlogPost["comments"];
};

export function BlogPostComments({
  postId,
  comments: initialComment = [],
}: Props) {
  const [comments, setComments] = useState(initialComment);

  function addNewComment(draft: { comment: string }) {
    setComments([...comments, { ...draft, user: "123" }]);
  }

  return (
    <div className="grid gap-5">
      <section className="grid gap-4">
        <h2 className="text-2xl font-semibold">Comments ({comments.length})</h2>
        {comments.map((c, index) => (
          <Card key={index} size="sm">
            <CardHeader>
              <CardTitle>{c.user}</CardTitle>
              <CardDescription>{c.comment}</CardDescription>
            </CardHeader>
          </Card>
        ))}
      </section>

      <BlogPostCommentForm postId={postId} onSave={addNewComment} />
    </div>
  );
}

export function BlogPostCommentForm({
  postId,
  onSave,
}: {
  postId: string;
  onSave: (draft: { comment: string }) => void;
}) {
  const [commentText, setCommentText] = useState("");
  return (
    <>
      <form
        className="space-y-3"
        onSubmit={(e) => {
          e.preventDefault(); // Do not reload!

          if (commentText.trim() == "") return;

          onSave({ comment: commentText });
        }}
      >
        <Textarea
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          name="comment"
          placeholder="Twój komentarz"
          className="bg-surface text-on-surface"
        />
        <Button type="submit">Dodaj komentarz</Button>
      </form>
    </>
  );
}
