import App from "..";

const app = new App().app;

const port: any = process.env.PORT || 3002;

app.listen(port, () => console.log(`app listening on port ${port}`));
