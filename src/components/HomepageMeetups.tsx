import { api, type RouterOutputs } from "../utils/api";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";

type Meetup = RouterOutputs["meetup"]["getAll"][0];

export const HomepageMeetups: React.FC = () => {
  const router = useRouter();

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

  // console.log(meetups);

  const deleteMeetup = api.meetup.delete.useMutation({
    onSuccess: () => {
      void refetchMeetups();
    },
  });

  function showDetailsHandler(meetup: Meetup) {
    void router.push("/" + meetup.id);
  }
  return (
    <>
      <ul className="menu rounded-box flex justify-center bg-base-100 p-2">
        {meetups?.map((meetup) => (
          <li
            className=""
            key={meetup.id}
            title={meetup.title}
            onClick={(evt) => {
              evt.preventDefault();
              showDetailsHandler(meetup);
            }}
          >
            <div className="card mb-5  cursor-auto flex-row justify-center border border-gray-300 bg-base-100 p-0 pr-2 shadow-xl">
              <div className="my-5 mx-10 w-full cursor-pointer items-center justify-center">
                <div className="mb-3 flex flex-row justify-between">
                  <p className="text-right font-bold text-amber-600 underline">
                    {meetup.title}
                  </p>
                </div>
                <div className="my-3 flex w-full flex-row justify-between">
                  <p className="mr-10 font-bold text-amber-500">Description:</p>
                  <p className="text-right">{meetup.description}</p>
                </div>
                <div className="my-3  flex w-full flex-row justify-between">
                  <p className="font-bold text-amber-500">Location:</p>
                  <p className="text-right">{meetup.location}</p>
                </div>
                <div className="my-3 flex w-full flex-row justify-between">
                  <p className="font-bold text-amber-500">Time:</p>
                  <p className="text-right">{meetup.time}</p>
                </div>
              </div>
              <button
                className="btn-warning btn-xs btn font-semibold capitalize text-slate-50 "
                data-id={meetup.id}
                onClick={(event: React.MouseEvent<HTMLButtonElement>) => {
                  const button = event.target as HTMLButtonElement;
                  const params = { id: button.dataset.id || "" };
                  deleteMeetup.mutate(params);
                }}
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </>
  );
};
