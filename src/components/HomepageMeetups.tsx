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
      <ul className="menu rounded-box flex max-w-4xl bg-base-100  px-1 sm:px-2">
        {meetups?.map((meetup) => (
          <li key={meetup.id} title={meetup.title}>
            <section className="max-w-800px flex-colborder card mb-7 max-w-2xl border-slate-200 bg-base-100 p-0 shadow-2xl sm:h-[200px] sm:flex-row">
              <div className="w-full  ">
                <article className="w-fill flex flex-col justify-center sm:flex-row ">
                  <section className="relative h-[150px] overflow-hidden rounded-tl-lg rounded-tr-lg  sm:h-[200px] sm:w-4/12 sm:rounded-bl-lg sm:rounded-tr-none">
                    <Image
                      loader={myLoader}
                      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                      src={meetup.image}
                      alt="Picture of the author"
                      fill
                    />
                  </section>
                  <div className="flex flex-col justify-between sm:w-8/12">
                    <div className="flex flex-col">
                      <div className="flex justify-center">
                        <p className="text-md w-full sm:rounded-tr-md  bg-yellow-400 py-1 text-center font-sans font-bold capitalize text-white">
                          {meetup.title}
                        </p>
                      </div>
                      <div className="mt-1 flex max-w-full flex-col justify-between mx-2">
                        <div className="flex w-full  flex-col text-center sm:flex-row">
                          <p className="text-md mt-1 w-full font-bold text-yellow-500 sm:mr-1 sm:mt-0 sm:w-2/12 sm:text-right">
                            What?
                          </p>
                          <p className="text-md text-bottom  w-full sm:w-10/12 sm:text-left line-clamp-6 sm:line-clamp-3">
                            {meetup.description}
                          </p>
                        </div>
                        <div className="mt-1 flex w-full flex-col text-center sm:flex-row ">
                          <p className="text-md mt-1 w-full font-bold text-yellow-500 sm:mr-1 sm:mt-0 sm:w-2/12 sm:text-right">
                            Where?
                          </p>
                          <p className="text-md  max-h-5 w-full overflow-hidden sm:w-10/12 sm:text-left">
                            {meetup.location}
                          </p>
                        </div>
                        <div className="mt-1 flex w-full flex-col text-center  sm:flex-row ">
                          <p className="text-md mt-1 w-full font-bold text-yellow-500 sm:mr-1 sm:mt-0 sm:w-2/12 sm:text-right">
                            When?
                          </p>
                          <p className="text-md mt-1 w-full sm:mt-0 sm:w-10/12 sm:text-left">
                            {meetup.time}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="my-2 flex flex-row items-end justify-center sm:mt-0">
                      <button
                        className="btn-warning btn-xs btn mr-2 mt-1 flex justify-center capitalize text-white sm:justify-end "
                        onClick={(evt) => {
                          evt.preventDefault();
                          showDetailsHandler(meetup);
                        }}
                      >
                        More Details
                      </button>
                      <button
                        className="btn-delete btn-xs btn mt-1 flex capitalize text-white sm:mr-2 bg-red-500 border-0"
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
                </article>
              </div>
            </section>
          </li>
        ))}
      </ul>
    </>
  );
};
