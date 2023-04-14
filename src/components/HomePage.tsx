/* eslint-disable @typescript-eslint/restrict-plus-operands */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";

import { HomepageMeetups } from "~/components/HomepageMeetups";

const HomePage: React.FC = () => {
  const router = useRouter();

  const { data: sessionData } = useSession();

  function newMeetupHandler() {
    void router.push("/NewMeetUp");
  }

  return (
    <section className="mx-5 flex max-w-xl flex-col justify-center md:max-w-3xl">
      {sessionData == undefined && (
        <div className="text-center">
          <h2 className="font-semibold">
            Please Sign In to Submit Appointments
          </h2>
        </div>
      )}
      <div className=" p-0 md:px-4 ">
        <div className="my-2 flex justify-center">
          <button
            className="my-xl btn-warning btn-sm btn mx-auto h-8 px-10 text-slate-50"
            onClick={newMeetupHandler}
            disabled={!sessionData}
          >
            Submit New Appointment
          </button>
        </div>
        <HomepageMeetups />
      </div>
    </section>
  );
};

export default HomePage;
