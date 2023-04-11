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
              <div className="my-5 ml-5 w-full cursor-pointer items-center justify-center">
                <div className="flex flex-row ">
                  <div className="relative mr-5 h-[200px] w-4/12 w-[200px] ">
                    <Image
                      loader={myLoader}
                      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                      src={meetup.image}
                      alt="Picture of the author"
                      fill
                    />
                  </div>
                  <div className="align-center w-8/12 content-center">
                    <div className="mb-5 flex flex-row justify-between">
                      <p className="font-bold text-amber-600 underline">
                        {meetup.title}
                      </p>
                    </div>
                    <div className="flex w-full flex-row ">
                      <p className="w-3/12 text-sm font-bold text-amber-500">
                        Description:
                      </p>
                      <p className="w-9/12 text-left text-sm">
                        {meetup.description}
                      </p>
                    </div>
                    <div className="flex w-full flex-row ">
                      <p className="w-3/12 text-sm font-bold text-amber-500">
                        Location:
                      </p>
                      <p className="w-9/12 text-left text-sm">
                        {meetup.location}
                      </p>
                    </div>
                    <div className="flex w-full flex-row ">
                      <p className="w-3/12 text-sm font-bold text-amber-500">
                        Time:
                      </p>
                      <p className="w-9/12 text-left text-sm">{meetup.time}</p>
                    </div>
                  </div>
                </div>
              </div>
              <button
                className="font-semibold capitalize text-slate-50"
                data-id={meetup.id}
                onClick={(event: React.MouseEvent<HTMLButtonElement>) => {
                  const button = event.target as HTMLButtonElement;
                  const params = { id: button.dataset.id || "" };
                  deleteMeetup.mutate(params);
                }}
              >
                ❌
              </button>
            </div>
          </li>
        ))}
      </ul>
    </>
  );
};
