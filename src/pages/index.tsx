import { type NextPage } from "next";
import Head from "next/head";

import { Header } from "~/components/Header";

import HomePage from "~/components/HomePage";

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>T3 Meetups App</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <Header />
        <Content />
      </main>
    </>
  );
};

export default Home;

const Content: React.FC = () => {
  return (
    <div className="mx-auto mt-7 flex items-center justify-center gap-2">
      <HomePage />
    </div>
  );
};
