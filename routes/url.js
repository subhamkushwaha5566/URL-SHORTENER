const express = require("express");
const {
  handleGenerateNewShortURL,
  handleGetAnalytics,
  handleGetUserURLs,
} = require("../controllers/url");

const router = express.Router();

router.post("/", handleGenerateNewShortURL);

router.get("/myurls", handleGetUserURLs);

router.get("/analytics/:shortId", handleGetAnalytics);

module.exports = router;
