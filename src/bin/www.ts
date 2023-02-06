import Http from "../server";

import MongooseService from "../config/mongoose";

const start = async () => {
  try {
    await MongooseService.connect();
    await Http.runApp(process.env.PORT || 4200);
  } catch (err) {
    console.log(err);
  }
};

start();
