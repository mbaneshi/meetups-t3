/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { api, type RouterOutputs } from "~/utils/api";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";

import { CommentEditor } from "~/components/CommentEditor";
import { CommentCard } from "~/components/CommentCard";

type Meetup = RouterOutputs["meetup"]["getAll"][0];

const MeetupDetail = (meetup: Meetup[]) => {
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

  if (meetup.meetup) {
    console.log(meetup);
  }

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
  return meetup.meetup ? (
    <div className="grid grid-cols-2 gap-4">
      <div className="card mt-5 border border-gray-200 bg-base-100 shadow-xl">
        Meetup Details
        <h2>{meetup.meetup.title}</h2>
      </div>
      <div>
        <div className="">
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
        <div>
          {comments?.map((comment) => (
            <div key={comment.id} className="mt-5">
              <CommentCard
                comment={comment}
                onDelete={() => void deleteComment.mutate({ id: comment.id })}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  ) : (
    <div>Loading</div>
  );
};

export default MeetupDetail;
