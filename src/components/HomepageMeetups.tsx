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
    <div className="flex justify-center">
      <ul className="menu rounded-box w-9/12  bg-base-100 p-2">
        {meetups?.map((meetup) => (
          <li key={meetup.id} title={meetup.title}>
            <div className=" card mt-5 flex cursor-auto flex-row justify-between border border-gray-200 bg-base-100 shadow-xl">
              <div className="mx-20 my-10 w-full cursor-pointer">
                <div
                  onClick={(evt) => {
                    evt.preventDefault();
                    showDetailsHandler(meetup);
                  }}
                >
                  {" "}
                  <div className=" my-3  flex w-full flex-row justify-between">
                    <p className="text-amber-600">Title:</p>
                    <p>{meetup.title}</p>
                  </div>
                  <div className="my-3  flex flex-row justify-between">
                    <p className="text-amber-600">Description:</p>
                    <p className="">{meetup.description}</p>
                  </div>
                  <div className="my-3  flex flex-row justify-between">
                    <p className="text-amber-600">Location:</p>
                    <p className="">{meetup.location}</p>
                  </div>
                  <div className="my-3  flex flex-row justify-between">
                    <p className="text-amber-600">Time:</p>
                    <p className="">{meetup.time}</p>
                  </div>
                </div>

                <button
                  className=" btn-warning btn-xs btn font-semibold capitalize text-slate-50"
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
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};
