/* eslint-disable @typescript-eslint/restrict-template-expressions */
import { api, type RouterOutputs } from "../utils/api";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import Image from "next/image";

type Meetup = RouterOutputs["meetup"]["getAll"][0];
type ImageLoaderProps = {
  src: string;
  width: number;
  quality?: number;
  root?: string;
};

export const HomepageMeetups: React.FC<ImageLoaderProps> = () => {
  const myLoader = ({ src, width, quality }) => {
    return `${src}?w=${200}&q=${quality || 75}`;
  };

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
    <>
      <ul className="menu rounded-box flex max-w-4xl bg-base-100 p-1 md:p-2">
        {meetups?.map((meetup) => (
          <li key={meetup.id} title={meetup.title}>
            <div className="card mb-5 flex-col border border-slate-200 bg-base-100 p-0 shadow-2xl md:h-[250px] md:flex-row">
              <div className="w-full items-center">
                <div className="w-fill flex flex-col md:flex-row">
                  <section className="md: md: relative h-[150px] overflow-hidden rounded-tl-lg rounded-tr-lg md:mr-3 md:h-[250px] md:w-4/12 md:rounded-bl-lg md:rounded-tr-none">
                    <Image
                      loader={myLoader}
                      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                      src={meetup.image}
                      alt="Picture of the author"
                      fill
                    />
                  </section>
                  <div className="flex flex-col justify-between md:w-8/12">
                    <div className="flex flex-col ">
                      <div className="mb-2">
                        <p className="mt-1 text-center text-xl font-bold text-amber-600 ">
                          {meetup.title}
                        </p>
                      </div>
                      <div className="flex flex-col justify-between">
                        <div className="mt-1 flex w-full flex-col text-center md:flex-row">
                          <p className="text-md mt-1 w-full font-bold text-amber-500 md:mr-1 md:mt-0 md:w-3/12 md:text-right">
                            Description:
                          </p>
                          <p className="text-md text-bottom w-full md:w-9/12 md:text-left">
                            {meetup.description}
                          </p>
                        </div>
                        <div className="mt-1 flex w-full flex-col text-center md:flex-row ">
                          <p className="text-md mt-1 w-full font-bold text-amber-500 md:mr-1 md:mt-0 md:w-3/12 md:text-right">
                            Location:
                          </p>
                          <p className="text-md w-full md:w-9/12 md:text-left">
                            {meetup.location}
                          </p>
                        </div>
                        <div className="mt-1 flex w-full flex-col text-center  md:flex-row ">
                          <p className="text-md mt-1 w-full font-bold text-amber-500 md:mr-1 md:mt-0 md:w-3/12 md:text-right">
                            Time:
                          </p>
                          <p className="text-md mt-1 w-full md:mt-0 md:w-9/12 md:text-left">
                            {meetup.time}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="my-2 flex flex-row items-end justify-center md:mt-0">
                      <button
                        className="btn-warning btn-xs btn mr-2 mt-1 flex justify-center text-white md:justify-end"
                        onClick={(evt) => {
                          evt.preventDefault();
                          showDetailsHandler(meetup);
                        }}
                      >
                        More Details
                      </button>
                      <button
                        className="btn-delete btn-xs btn mt-1 flex text-white md:mr-2 "
                        data-id={meetup.id}
                        onClick={(
                          event: React.MouseEvent<HTMLButtonElement>
                        ) => {
                          const button = event.target as HTMLButtonElement;
                          const params = { id: button.dataset.id || "" };
                          deleteMeetup.mutate(params);
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </>
  );
};
