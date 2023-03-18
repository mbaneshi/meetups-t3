import { api, type RouterOutputs } from "../utils/api";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";

type Meetup = RouterOutputs["meetup"]["getAll"][0];

export const MeetupCard: React.FC = () => {
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

  const deleteMeetup = api.meetup.delete.useMutation({
    onSuccess: () => {
      void refetchMeetups();
    },
  });

  function showDetailsHandler(meetup: Meetup) {
    void router.push("/" + meetup.id);
  }

  return (
    <div>
      <ul className="menu rounded-box w-80 bg-base-100 p-2">
        {meetups?.map((meetup) => (
          <li key={meetup.id}>
            <div className="card mt-5 flex justify-between border border-gray-200 bg-base-100 shadow-xl">
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
    </div>
  );
};
