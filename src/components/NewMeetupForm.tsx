/* eslint-disable @typescript-eslint/restrict-plus-operands */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { api, type RouterOutputs } from "../utils/api";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useState } from "react";
import { Header } from "./Header";

type Meetup = RouterOutputs["meetup"]["getAll"][0];

const NewMeetupForm = () => {
  const router = useRouter();
  const { data: sessionData } = useSession();

  const [inputTitle, setInputTitle] = useState<string>("");
  const [inputLocation, setInputLocation] = useState<string>("");
  const [inputDescription, setInputDescription] = useState<string>("");
  const [selectedMeetup, setSelectedMeetup] = useState<Meetup | null>(null);

  const { refetch: refetchMeetups } = api.meetup.getAll.useQuery(
    undefined, // no input
    {
      enabled: sessionData?.user !== undefined,
      onSuccess: (data) => {
        setSelectedMeetup(selectedMeetup ?? data[0] ?? null);
      },
    }
  );

  const titleHandler = (event: React.KeyboardEvent<HTMLInputElement>) => {
    setInputTitle(event.currentTarget.value);
  };

  const locationHandler = (event: React.KeyboardEvent<HTMLInputElement>) => {
    setInputLocation(event.currentTarget.value);
  };

  const descriptionHandler = (event: React.KeyboardEvent<HTMLInputElement>) => {
    setInputDescription(event.currentTarget.value);
  };

  const createMeetup = api.meetup.create.useMutation({
    onSuccess: () => {
      void refetchMeetups();
    },
  });

  const submitHandler = (): void => {
    createMeetup.mutate({
      title: inputTitle,
      location: inputLocation,
      description: inputDescription,
    });

    void router.push("/");
  };
  return (
    <form onSubmit={submitHandler}>
      <Header />
      <div className="my-40 mx-auto max-w-md border border-gray-300 bg-base-200 p-10 shadow-xl">
        <h2 className=" font-bold">New Meetup Details</h2>
        <input
          type="text"
          placeholder="Title"
          className="input-bordered input input-sm my-4 h-10 w-full "
          onKeyUp={(event: React.KeyboardEvent<HTMLInputElement>): void =>
            titleHandler(event)
          }
        ></input>
        <div className="font-light">
          <p>TODO: Better way of doing location?</p>
        </div>
        <input
          type="text"
          placeholder="Location"
          className=" input-bordered input input-sm my-4 h-10 w-full "
          onKeyUp={(event: React.KeyboardEvent<HTMLInputElement>): void =>
            locationHandler(event)
          }
        ></input>
        <div className="font-light">
          <p>TODO: Mapbox</p>
        </div>
        <input
          type="text"
          placeholder="Desciption"
          className=" input-bordered input input-sm my-4 h-10 w-full "
          onKeyUp={(event: React.KeyboardEvent<HTMLInputElement>): void =>
            descriptionHandler(event)
          }
        ></input>
        <div className="font-light">
          <p>TODO: Image</p>
        </div>
        {/* <input
          type="text"
          placeholder="Image"
          className=" input-bordered input input-sm my-4 h-10 w-full"
        ></input> */}
        <button className="my-xl btn-warning btn-xs btn mx-auto mt-5 h-8 px-14">
          Submit
        </button>{" "}
      </div>
    </form>
  );
};

export default NewMeetupForm;
