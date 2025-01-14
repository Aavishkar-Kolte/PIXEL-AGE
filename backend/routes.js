export const configureRoutes = (app) => {
  app.get("/", (req, res) => {
    res.sendFile("index.html");
  });

  app.get("/test", (req, res) => {
    res.send("Hello World!");
  });

  app.get("/*", (req, res) => {
    res.redirect("/");
  });
};
