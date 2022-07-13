//Packages
const cheerio = require("cheerio");
const axios = require("axios");
const express = require("express");
const formidable = require("express-formidable");
const cors = require("cors");
require("dotenv").config();

//Server setup + package mounting
const app = express();
app.use(formidable());
app.use(cors());

//Routes
app.post("/which-gen", async (req, res) => {
  try {
    //Parse the search name
    const searchTerms = req.fields.search
      .split(" ")
      .map((item) => {
        return item[0].toUpperCase() + item.substring(1);
      })
      .join("_");
    //Load the text scrapped from the page
    const response = await axios.get(
      `https://wikipedia.org/wiki/${searchTerms}`
    );
    const $ = cheerio.load(response.data);

    //Set the response object
    const searchPerson = {};

    //Get the picture
    const searchPersonPicRoute = $(".infobox-image").find("img").attr("src");
    searchPerson.src = `https:${searchPersonPicRoute}`;

    //Get the wikipedia name
    searchPerson.name = $(".infobox-above").text();

    //Get the birth date
    const searchedPersonBday = new Date($(".bday").text());
    const searchedPersonBirthYear = searchedPersonBday.getFullYear();
    searchPerson.birthYear = searchedPersonBirthYear;

    //Get the gen (based on DoB)
    searchPerson.gen =
      searchedPersonBirthYear < 1965
        ? "Boomer"
        : searchedPersonBirthYear < 1984
        ? "Gen X"
        : searchedPersonBirthYear < 1997
        ? "Gen Y"
        : "Gen Z";

    //Return response
    if (searchPerson.birthYear) {
      res.status(200).json(searchPerson);
    } else {
      res.status(400).json({ message: "search has no DoB" });
    }
  } catch (error) {
    res.status(400).json({ message: "search failed" });
  }
});

app.listen(process.env.PORT || 3000, () => {
  console.log("server has started...");
});
