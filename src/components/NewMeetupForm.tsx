/* eslint-disable @typescript-eslint/no-unsafe-member-access */
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
  const [inputTime, setInputTime] = useState<string>("");
  const [selectedMeetup, setSelectedMeetup] = useState<Meetup | null>(null);
  const [inputImage, setInputImage] = useState<string>("");

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

  const timeHandler = (event: React.ChangeEventHandler<HTMLInputElement>) => {
    setInputTime(event.target.value);
  };

  const imageHandler = (event: React.KeyboardEvent<HTMLInputElement>) => {
    setInputImage(event.currentTarget.value);
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
      time: inputTime,
      image: inputImage,
    });

    void router.push("/");
  };

  return (
    <form onSubmit={submitHandler}>
      <Header />
      <div className="my-16 mx-auto max-w-md rounded-md border border-gray-300 bg-base-200 p-10 shadow-xl">
        <h2 className=" font-bold">New Meetup Details</h2>
        <input
          required
          id="title"
          name="title"
          type="text"
          placeholder="Title"
          className="input-bordered input input-sm my-1 h-10 w-full "
          onKeyUp={(event: React.KeyboardEvent<HTMLInputElement>): void =>
            titleHandler(event)
          }
        ></input>
        <input
          required
          id="description"
          name="description"
          type="text"
          placeholder="Desciption"
          className=" input-bordered input input-sm my-1 h-10 w-full "
          onKeyUp={(event: React.KeyboardEvent<HTMLInputElement>): void =>
            descriptionHandler(event)
          }
        ></input>
        <div className="font-light"></div>
        <input
          required
          id="location"
          name="location"
          type="text"
          placeholder="Location"
          className=" input-bordered input input-sm my-1 h-10 w-full "
          onKeyUp={(event: React.KeyboardEvent<HTMLInputElement>): void =>
            locationHandler(event)
          }
        ></input>
        <input
          required
          id="time"
          name="time"
          type="datetime-local"
          placeholder="Time"
          className=" input-bordered input input-sm my-1 h-10 w-full "
          onChange={(event: React.ChangeEvent<HTMLInputElement>): void => {
            timeHandler(event);
          }}
        ></input>
        <div>
          <input
            className="input-bordered input input-sm  h-10 w-full"
            id="image"
            name="image"
            type="url"
            required
            placeholder="image URL"
            onKeyUp={(event: React.KeyboardEvent<HTMLInputElement>): void =>
              imageHandler(event)
            }
          />
        </div>
        <button className="my-xl btn-warning btn-xs btn mx-auto mt-5 h-8 px-14">
          Submit
        </button>{" "}
      </div>
      <div className=" w-full text-center font-light">
        <p>TODO: Mapbox</p>
        <p>TODO: Better way of doing location?</p>
      </div>
    </form>
  );
};

export default NewMeetupForm;
