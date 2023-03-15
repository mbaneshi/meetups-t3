/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { api } from "~/utils/api";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";

import { CommentEditor } from "~/components/CommentEditor";
import { CommentCard } from "~/components/CommentCard";

const MeetupDetail = () => {
  const router = useRouter();
  const meetupId = router.query.meetupId;

  const { data: sessionData } = useSession();

  const { data: comments, refetch: refetchComments } =
    api.comment.getAll.useQuery(
      {
        meetupId,
      },
      {
        enabled: sessionData?.user !== undefined && meetupId !== null,
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
    <div className="m-auto max-w-xl">
      <div>
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
              meetupId,
            });
          }}
        />
      </div>
    </div>
  );
};

export default MeetupDetail;
