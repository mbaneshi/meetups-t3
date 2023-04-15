/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { api, type RouterOutputs } from "~/utils/api";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";

import { CommentEditor } from "~/components/CommentEditor";
import { CommentCard } from "~/components/CommentCard";

type Meetup = RouterOutputs["meetup"]["getAll"][0];

const MeetupDetail: React.FC<ImageLoaderProps> = (props: Meetup) => {
  const router = useRouter();
  const meetupId = router.query.meetupId;
  const { data: sessionData } = useSession();

  const { data: meetup } = api.meetup.getOne.useQuery(
    { meetupId: meetupId ?? "" }, // no input
    {
      enabled: sessionData?.user !== undefined,
    }
  );

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

  function editHandler(meetup: Meetup) {
    void router.push("/" + meetupId + "/edit");
  }

  return meetup ? (
    <div className="mt-7 grid gap-7 md:grid-cols-2 mx-4 sm:mx-7">
      <section className="items-left card flex justify-between border-gray-200 shadow-xl ">
        <div>
          <img className="h-[200px] w-full rounded-t-md" src={props.image} alt="" />
        </div>
        <div className="py-2 px-2 text-center">
          <div className="my-2 flex w-full flex-col md:flex-row">
            <p className="font-abc mr-3 w-full md:text-right font-bold text-amber-600 md:w-3/12">
              Title:
            </p>
            <p className="w-full md:text-left md:w-9/12">{meetup.title}</p>
          </div>
          <div className="my-2 flex flex-col justify-between md:flex-row">
            <p className="mr-3 w-full overflow-hidden truncate md:text-right font-bold text-amber-600 md:w-3/12">
              Description:
            </p>
            <p className="w-full md:text-left md:w-9/12">{meetup.description}</p>
          </div>
          <div className="my-2 flex flex-col justify-between md:flex-row">
            <p className="mr-3 w-full md:text-right font-bold text-amber-600 md:w-3/12">
              Location:
            </p>
            <p className="w-full md:text-left md:w-9/12">{meetup.location}</p>
          </div>
          <div className="my-3 flex flex-col justify-between md:flex-row">
            <p className="mr-3 w-full md:text-right font-bold text-amber-600 md:w-3/12">
              Time:
            </p>
            <p className="w-full md:text-left md:w-9/12">{meetup.time}</p>
          </div>
          <div className="mt-5">
            <h3 className="text-amber-600">TODO:</h3>
            <p>Mapbox</p>
          </div>
        </div>

        <div className="flex justify-center">
          <button
            className="btn-warning btn-xs btn mr-2 mt-1 mb-2  w-20 px-8 text-white"
            onClick={(evt) => {
              evt.preventDefault();
              editHandler(meetup);
            }}
          >
            Edit
          </button>
        </div>
      </section>
      <section className="">
        <div>
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
            <div key={comment.id}>
              <CommentCard
                comment={comment}
                onDelete={() => void deleteComment.mutate({ id: comment.id })}
              />
            </div>
          ))}
        </div>
      </section>
    </div>
  ) : (
    <div>Loading</div>
  );
};

export default MeetupDetail;
