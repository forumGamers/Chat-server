import server from "../server";

import MongooseService from "../config/mongoose";

MongooseService.connect()
  .then((connection) =>
    connection.once("open", () => console.log("connection success"))
  )
  .then(() => {
    const port = process.env.PORT || 4200;
    server.listen(port, () => console.log(`app listening on port ${port}`));
  })
  .catch((connection) =>
    connection.on("error", (err: any) => {
      console.log(`connection error with error : ${err}`);
      process.exit(-1);
    })
  );
