/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { useRouter } from "next/router";
import MeetupDetail from "~/components/MeetupDetail";
import { Header } from "~/components/Header";

import { api, type RouterOutputs } from "~/utils/api";
import { useSession } from "next-auth/react";
import { useState } from "react";

type Meetup = RouterOutputs["meetup"]["getAll"][0];

function MeetupDetails() {
  const router = useRouter();
  const meetupId = router.query.meetupId;

  const [selectedMeetup, setSelectedMeetup] = useState<Meetup>(null);

  const { data: sessionData } = useSession();

  const { data: meetups } = api.meetup.getAll.useQuery(
    undefined, // no input
    {
      enabled: sessionData?.user !== undefined,
      onSuccess: (data) => {
        setSelectedMeetup(selectedMeetup ?? data[0] ?? null);
      },
    }
  );

  const { data: meetup } = api.meetup.getOne.useQuery(
    { meetupId: meetupId ?? "" }, // no input
    {
      enabled: sessionData?.user !== undefined,
    }
  );

  return (
    <div>
      <Header />
      <div className="m-auto my-10 max-w-4xl">
        <button
          className="btn-warning btn-xs btn px-5"
          onClick={() => void router.push("/")}
        >
          Return home
        </button>
        {meetup && (
          <MeetupDetail
            id={meetup.id}
            title={meetup.title}
            createdAt={meetup.createdAt}
            updatedAt={meetup.updatedAt}
            description={meetup.description}
            location={meetup.location}
          />
        )}
      </div>
    </div>
  );
}

export default MeetupDetails;
