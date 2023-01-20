export interface ChatSchema {
  SenderId: number;
  message: string | null | undefined;
  image: string | null | undefined;
  RoomId: number;
}
