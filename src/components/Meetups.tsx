/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";

import { api, type RouterOutputs } from "../utils/api";

import { CommentEditor } from "~/components/CommentEditor";
import { CommentCard } from "~/components/CommentCard";
// import Comments from "./Comments";

const Meetups: React.FC = () => {
  const router = useRouter();

  type Meetup = RouterOutputs["meetup"]["getAll"][0];

  const [selectedMeetup, setSelectedMeetup] = useState<Meetup | null>(null);

  const { data: sessionData } = useSession();
  const { data: meetups, refetch: refetchMeetups } = api.meetup.getAll.useQuery(
    undefined, // no input
    {
      enabled: sessionData?.user !== undefined,
      onSuccess: (data) => {
        setSelectedMeetup(selectedMeetup ?? data[0] ?? null);
      },
    }
  );

  const createMeetup = api.meetup.create.useMutation({
    onSuccess: () => {
      void refetchMeetups();
    },
  });

  const deleteMeetup = api.meetup.delete.useMutation({
    onSuccess: () => {
      void refetchMeetups();
    },
  });

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

  function showDetailsHandler(meetup) {
    console.log(meetup.id);
    router.push("/" + meetup.id);
  }

  return (
    <div className="items-center justify-center px-2">
      <ul className="menu rounded-box w-72 bg-base-100 p-2">
        {meetups?.map((meetup) => (
          <li key={meetup.id}>
            <div className="flex justify-between">
              <a
                href="#"
                onClick={(evt) => {
                  evt.preventDefault();
                  // setSelectedMeetup(meetup);
                  showDetailsHandler(meetup);
                }}
              >
                {meetup.title}
              </a>
              <button
                className="font-semibold text-red-600"
                data-id={meetup.id}
                onClick={(event: React.MouseEvent<HTMLButtonElement>) => {
                  const button = event.target as HTMLButtonElement;
                  const params = { id: button.dataset.id || "" };
                  deleteMeetup.mutate(params);
                }}
              >
                x
              </button>
            </div>
          </li>
        ))}
      </ul>
      <div className="divider" />
      <input
        type="text"
        placeholder="New Meetup"
        className="input-bordered input input-sm w-full"
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            createMeetup.mutate({
              title: e.currentTarget.value,
            });
            e.currentTarget.value = "";
          }
        }}
      ></input>{" "}
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
      {/* <Comments sessionData={sessionData} selectedMeetup={selectedMeetup}/> */}
    </div>
  );
};

export default Meetups;
