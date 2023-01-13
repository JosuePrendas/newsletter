const express = require("express");
const request = require("request");
const bodyParser = require("body-parser");
const https = require("https");

const app = express();

app.use(express.static("public"));

app.use(bodyParser.urlencoded({ extended: true }));

app.listen(process.env.PORT || 3000, function () {
  console.log(`Server listening on port ${process.env.PORT || 3000}`);
});

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/signup.html");
});

app.post("/", function (req, res) {
  const data = {
    members: [
      {
        email_address: req.body.email,
        status: "subscribed",
        merge_fields: {
          FNAME: req.body.firstName,
          LNAME: req.body.lastName,
        },
      },
    ],
  };

  const jsonData = JSON.stringify(data);
  const url = `https://us18.api.mailchimp.com/3.0/lists/18015e00d4`;
  const apiKey = "83fe572d9e5666a27c1477d8f4138309-us18";
  const options = {
    method: "POST",
    auth: `jprendas:${apiKey}`,
  };
  const request = https.request(url, options, function (response) {
    if (response.statusCode === 200) {
      res.sendFile(__dirname + "/success.html");
    } else {
      res.sendFile(__dirname + "/failure.html");
    }
    response.on("data", function (data) {
      var result = JSON.parse(data);
    });
  });
  request.write(jsonData);
  request.end();
  request.responseCode = 200;
});

app.post("/failure", function (req, res) {
  res.redirect("/");
});

app.post("/success", function (req, res) {
  res.redirect("/");
});
