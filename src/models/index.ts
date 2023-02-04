import Chat from "./chat";
import Room from "./room";

const room = new Room();
const chat = new Chat();

const roomSchema = room.RoomSchema;
const chatSchema = chat.ChatSchema;

const roomModel = room.Room;
const chatModel = chat.Chat;

export { roomModel, roomSchema, chatModel, chatSchema };
