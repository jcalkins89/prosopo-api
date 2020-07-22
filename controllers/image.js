const Clarifai = require("clarifai");

const clarifaiApp = new Clarifai.App({
  apiKey: "813c114e7c0f4023b145ac87cb96f1e4",
});

const handleApiCall = (req, res) => {
  clarifaiApp.models
    .predict(Clarifai.FACE_DETECT_MODEL, req.body.input)
    .then((data) => {
      res.json(data);
    })
    .catch((err) => res.status(400).json("API is not responding"));
};

const handleImageRequest = (db) => (req, res) => {
  const { id } = req.body;

  db("users")
    .where("id", "=", id)
    .increment("entries", 1)
    .returning("entries")
    .then((entries) => {
      res.json(entries[0]);
    })
    .catch((err) => {
      res.status(400).json("Unable to fetch entries");
    });
};

module.exports = {
  handleImageRequest,
  handleApiCall,
};
