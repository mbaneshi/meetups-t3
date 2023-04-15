/* eslint-disable @next/next/no-img-element */
import { signIn, signOut, useSession } from "next-auth/react";
import { useRouter } from "next/router";

export const Header = () => {
  const router = useRouter();
  const { data: sessionData } = useSession();

  return (
    <div className="navbar justify-center bg-yellow-500 text-primary-content 2xl:px-72 px-4 md:px-7">
      <div 
        className="w-6/12 flex-1 cursor-pointer font-bold text-slate-50 hover:text-yellow-200  text-sm md:text-lg"
        onClick={() => void router.push("/")}
      >
        {sessionData?.user?.name
          ? `Appointments for ${sessionData.user.name}`
          : ""}
      </div>
      <div>
      </div>
      <div className="w-6/12 justify-end">
        {sessionData && (
        <span
          className=" text-right hover:text-yellow cursor-pointer pl-5 text-sm font-bold text-white hover:text-yellow-200 md:text-lg"
          onClick={() => void signOut()}
        >
          Sign out
        </span>
      )}
      <div className="flex-none gap-2 ">
        <div className="dropdown-end dropdown">
          {sessionData?.user ? (
            <label
              tabIndex={0}
              className="btn-ghost btn-circle avatar btn"
              onClick={() => void signOut()}
            >
              <div className="w-10 rounded-full">
                <img
                  src={sessionData?.user?.image ?? ""}
                  alt={sessionData?.user?.name ?? ""}
                />
              </div>
            </label>
          ) : (
            <button
              className="btn-ghost rounded-btn btn"
              onClick={() => void signIn()}
            >
              Sign In
            </button>
          )}
        </div>
      </div>
    </div>
    </div>
  );
};
