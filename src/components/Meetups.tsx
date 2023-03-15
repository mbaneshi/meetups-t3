/* eslint-disable @typescript-eslint/restrict-plus-operands */
/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";

import { api, type RouterOutputs } from "../utils/api";

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

  const deleteMeetup = api.meetup.delete.useMutation({
    onSuccess: () => {
      void refetchMeetups();
    },
  });

  function showDetailsHandler(meetup) {
    router.push("/" + meetup.id);
  }

  function newMeetupHandler() {
    router.push("/NewMeetUp");
  }

  return (
    <div>
      {sessionData == undefined && (
        <div className="text-center">
          <h2 className="font-semibold">
            Please Sign In to Submit Appointments
          </h2>
        </div>
      )}
      <div className="items-center justify-center px-2">
        <ul className="menu rounded-box w-80 bg-base-100 p-2">
          {meetups?.map((meetup) => (
            <li key={meetup.id}>
              <div className="flex justify-between">
                <a
                  href="#"
                  onClick={(evt) => {
                    evt.preventDefault();
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
        <div className="w-5xl divider" />
        <div className="my-2 flex ">
          <button
            className="my-xl btn-warning btn-xs btn mx-auto h-8 px-10"
            onClick={newMeetupHandler}
          >
            Submit New Note
          </button>
        </div>
      </div>
    </div>
  );
};

export default Meetups;
