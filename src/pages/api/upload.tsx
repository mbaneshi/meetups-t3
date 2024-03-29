/* eslint-disable @typescript-eslint/no-misused-promises */
import React, { useState } from "react";
import Router from "next/router";
import Layout from "~/pages/api/upload";

const Upload = () => {
  const [imageUploaded, setImageUploaded] = useState();

  const handleChange = (event: {
    target: { files: React.SetStateAction<undefined>[] };
  }) => {
    setImageUploaded(event.target.files[0]);
  };

  const submitData = async (e: { preventDefault: () => void }) => {
    e.preventDefault();

    if (!imageUploaded) {
      return;
    }

    try {
      const formData = new FormData();
      formData.append("image", imageUploaded);

      await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      void Router.push("/");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Layout>
      <div className="page">
        <form onSubmit={submitData}>
          <h1>Upload Image</h1>

          <input
            onChange={handleChange}
            accept=".jpg, .png, .gif, .jpeg"
            type="file"
          ></input>

          <input type="submit" value="Upload" disabled />
        </form>
      </div>
      <style jsx>{`
        .page {
          background: white;
          padding: 3rem;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        input[type="submit"] {
          background: #ececec;
          border: 0;
          padding: 1rem 2rem;
        }
      `}</style>
    </Layout>
  );
};

export default Upload;
