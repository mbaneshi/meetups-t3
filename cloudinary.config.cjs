// Configuration
cloudinary.config({
  cloud_name: "dg0it3ba2",
  api_key: "877463271641243",
  api_secret: "GTCKvK48Ehi_zNmoWNPmKj1nl18",
});

// Upload

const res = cloudinary.uploader.upload(
  "https://upload.wikimedia.org/wikipedia/commons/a/ae/Olympic_flag.jpg",
  { public_id: "olympic_flag" }
);

res
  .then((data) => {
    // console.log(data);
    // console.log(data.secure_url);
  })
  .catch((err) => {
    // console.log(err);
  });

// Generate
const url = cloudinary.url("olympic_flag", {
  width: 100,
  height: 150,
  Crop: "fill",
});

// The output url
// console.log(url);
// https://res.cloudinary.com/<cloud_name>/image/upload/h_150,w_100/olympic_flag
