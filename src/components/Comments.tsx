import { useSession } from "next-auth/react";

import { api } from "../utils/api";

import { CommentEditor } from "~/components/CommentEditor";
import { CommentCard } from "~/components/CommentCard";

const Comments = (selectedMeetup, sessionData) => {
  const { data: comments, refetch: refetchComments } =
    api.comment.getAll.useQuery(
      {
        meetupId: selectedMeetup?.id ?? "",
      },
      {
        enabled: sessionData?.user !== undefined && selectedMeetup !== null,
      }
    );

  const createComment = api.comment.create.useMutation({
    onSuccess: () => {
      void refetchComments();
    },
  });

  const deleteComment = api.comment.delete.useMutation({
    onSuccess: () => {
      void refetchComments();
    },
  });
  return (
    <div className="">
      {comments?.map((comment) => (
        <div key={comment.id} className="mt-5">
          <CommentCard
            comment={comment}
            onDelete={() => void deleteComment.mutate({ id: comment.id })}
          />
        </div>
      ))}
      <CommentEditor
        onSave={({ title, content }) => {
          void createComment.mutate({
            title,
            content,
            meetupId: selectedMeetup?.id ?? "",
          });
        }}
      />
    </div>
  );
};

export default Comments;
