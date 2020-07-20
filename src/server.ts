import express from "express";

const app = express();

app.use(express.json());

app.get("/", (request, response) => {
  return response.json({ message: "ok" });
});

app.post("/clients", (request, response) => {
  let {name, email} = request.body

  let user = {
    name,
    email
  }

  return response.json(user)
})

app.listen(3333, () => {
  console.log("✌🏻Server started");
});
