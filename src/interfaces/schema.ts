export interface ChatSchema {
  SenderId: number;
  type: string;
  message: string | null | undefined;
  createdAt: Date;
  image: string | null | undefined;
  RoomId: number;
}
