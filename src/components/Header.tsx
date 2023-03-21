/* eslint-disable @next/next/no-img-element */
import { signIn, signOut, useSession } from "next-auth/react";
import { useRouter } from "next/router";

export const Header = () => {
  const router = useRouter();
  const { data: sessionData } = useSession();

  return (
    <div className="navbar bg-primary px-10 text-primary-content">
      <div
        className="flex-1 cursor-pointer pl-5 text-3xl font-bold text-slate-50 hover:text-yellow-200"
        onClick={() => void router.push("/")}
      >
        {sessionData?.user?.name
          ? `Appointments for ${sessionData.user.name}`
          : ""}
      </div>
      <div className=" flex-non gap-2">
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
  );
};
