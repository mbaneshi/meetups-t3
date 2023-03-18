/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { api } from "../utils/api";

// type Meetup = RouterOutputs["meetup"]["getAll"][0];

const NewMeetupForm = () => {
  // const { data: sessionData } = useSession();
  // const [selectedMeetup, setSelectedMeetup] = useState<Meetup | null>(null);

  // const { refetch: refetchMeetups } = api.meetup.getAll.useQuery(
  //   undefined, // no input
  //   {
  //     enabled: sessionData?.user !== undefined,
  //     onSuccess: (data) => {
  //       setSelectedMeetup(selectedMeetup ?? data[0] ?? null);
  //     },
  //   }
  // );
  const createMeetup = api.meetup.create.useMutation();
  //   {
  //   onSuccess: () => {
  //     void refetchMeetups();
  //   },
  // }

  return (
    <div className="my-40 mx-auto max-w-md border border-gray-300 bg-base-200 p-10 shadow-xl">
      <h2 className=" font-bold">New Meetup Details</h2>
      <input
        type="text"
        placeholder="Title"
        className="input-bordered input input-sm my-4 h-10 w-full "
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            createMeetup.mutate({
              title: e.currentTarget.value,
            });
            e.currentTarget.value = "";
          }
        }}
      ></input>
      {/* <input
        type="text"
        placeholder="Address"
        className=" input-bordered input input-sm my-4 h-10 w-full "
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            createMeetup.mutate({
              title: e.currentTarget.value,
            });
            e.currentTarget.value = "";
          }
        }}
      ></input>
      <div className="font-light">
        <p>To do: Mapbox?</p>
      </div>
      <input
        type="text"
        placeholder="Desciption"
        className=" input-bordered input input-sm my-4 h-10 w-full "
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            createMeetup.mutate({
              title: e.currentTarget.value,
            });
            e.currentTarget.value = "";
          }
        }}
      ></input>
      <input
        type="text"
        placeholder="Image"
        className=" input-bordered input input-sm my-4 h-10 w-full"
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            createMeetup.mutate({
              title: e.currentTarget.value,
            });
            e.currentTarget.value = "";
          }
        }}
      ></input>
      <button className="my-xl btn-warning btn-xs btn mx-auto mt-5 h-8 px-14">
        Submit
      </button> */}
    </div>
  );
};

export default NewMeetupForm;
