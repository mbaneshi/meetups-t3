/* eslint-disable @next/next/no-img-element */
import { signIn, signOut, useSession } from "next-auth/react";
import { useRouter } from "next/router";

export const Header = () => {
  const router = useRouter();
  const { data: sessionData } = useSession();

  return (
    <div className="navbar justify-center bg-primary px-0 text-primary-content 3xl:px-0">
      <div
        className="max-w-3xl flex-1 cursor-pointer px-1 text-sm font-bold text-slate-50 hover:text-yellow-200 3xl:px-5 md:text-base"
        onClick={() => void router.push("/")}
      >
        {sessionData?.user?.name
          ? `Appointments for ${sessionData.user.name}`
          : ""}
      </div>
      {sessionData && (
        <span
          className="hover:text-yellow cursor-pointer pl-5 text-sm font-bold text-white hover:text-yellow-200 md:text-base"
          onClick={() => void signOut()}
        >
          Sign out
        </span>
      )}

      <div className="flex-non gap-2">
        <div className="dropdown-end dropdown">
          {sessionData?.user ? (
            <label
              tabIndex={0}
              className="btn-ghost btn-circle avatar btn "
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
  );
};
