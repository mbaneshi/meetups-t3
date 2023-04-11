/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { api, type RouterOutputs } from "~/utils/api";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";

import { CommentEditor } from "~/components/CommentEditor";
import { CommentCard } from "~/components/CommentCard";

type Meetup = RouterOutputs["meetup"]["getAll"][0];

const MeetupDetail = (props: Meetup) => {
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

  function editHandler() {
    void router.push("/" + meetup.id + "/edit");
  }

  return props ? (
    <div className="grid grid-cols-2 gap-4">
      <div className="items-left bg-base-00 card mt-5 flex justify-center border border-gray-200 px-20 shadow-xl">
        <div className=" flex w-full flex-row justify-between">
          <p className="text-amber-600">Title:</p>
          <p>{props.title}</p>
        </div>
        <div className="flex flex-row justify-between">
          <p className="text-amber-600">Description:</p>
          <p className="">{props.description}</p>
        </div>
        <div className="flex flex-row justify-between">
          <p className="text-amber-600">Location:</p>
          <p className="">{props.location}</p>
        </div>
        <div className="my-3  flex flex-row justify-between">
          <p className="text-amber-600">Time:</p>
          <p className="">{props.time}</p>
        </div>
        <div className="mt-20">
          <h3 className="text-amber-600">TODO:</h3>
          <p>Add mapbox, image</p>
          <div className="my-3  flex flex-row justify-between">
            <p className="">{props.image}</p>
          </div>
        </div>
        <button
          onClick={(evt) => {
            evt.preventDefault();
            editHandler(meetup);
          }}
        >
          Edit
        </button>
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
