import server from "../server";

const port = process.env.PORT || 4200;

server.listen(port, () => console.log(`app listening on port ${port}`));
