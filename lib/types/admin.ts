import type {Admin, User} from "@prisma/client";

export type AdminAccount = Admin & {
  user: User;
};
