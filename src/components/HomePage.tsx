/* eslint-disable @typescript-eslint/restrict-plus-operands */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";

import { MeetupCard } from "~/components/MeetupCard";

const HomePage: React.FC = () => {
  const router = useRouter();

  const { data: sessionData } = useSession();

  function newMeetupHandler() {
    void router.push("/NewMeetUp");
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
        <MeetupCard />
        <div className="w-5xl divider" />
        <div className="my-2 flex ">
          <button
            className="my-xl btn-warning btn-xs btn mx-auto h-8 px-10"
            onClick={newMeetupHandler}
            disabled={!sessionData}
          >
            Submit New Note
          </button>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
