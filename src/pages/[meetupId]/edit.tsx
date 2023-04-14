import { api, type RouterOutputs } from "~/utils/api";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useState } from "react";
import { Header } from "~/components/Header";

function Edit() {
  const router = useRouter();
  const { data: sessionData } = useSession();
  const meetupId = router.query.meetupId;

  const [inputTitle, setInputTitle] = useState<string>("");
  const [inputLocation, setInputLocation] = useState<string>("");
  const [inputDescription, setInputDescription] = useState<string>("");
  const [inputTime, setInputTime] = useState<string>("");
  const [inputImage, setInputImage] = useState<string>("");

  const { data: meetup } = api.meetup.getOne.useQuery(
    { meetupId: meetupId ?? "" }, // no input
    {
      enabled: sessionData?.user !== undefined,
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

  const updateMeetup = api.meetup.update.useMutation({
    onSuccess: () => {
      void refetchMeetups();
    },
  });

  const submitHandler = () => {
    updateMeetup.mutate({
      id: meetupId,
      title: inputTitle,
      location: inputLocation,
      description: inputDescription,
      time: inputTime,
      image: inputImage,
    });

    void router.replace("/");
  };

  return (
    <form onSubmit={submitHandler}>
      <Header />
      <div className="my-16 mx-auto max-w-md rounded-md border border-gray-300 bg-base-200 p-10 shadow-xl">
        <h2 className=" font-bold">Edit Meetup Details</h2>
        <input
          required
          defaultValue={meetup?.title}
          placeholder={meetup?.title}
          id="title"
          name="title"
          type="text"
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
          defaultValue={meetup?.description}
          placeholder={meetup?.description}
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
          defaultValue={meetup?.location}
          placeholder={meetup?.location}
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
          defaultValue={meetup?.time}
          placeholder={meetup?.time}
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
        <button
          className="my-xl btn-warning btn-xs btn mx-auto mt-5 h-8 px-14"
          data-id={meetup?.id || "null"}
          onClick={() => {
            submitHandler();
          }}
        >
          Submit
        </button>{" "}
      </div>
    </form>
  );
}

export default Edit;
