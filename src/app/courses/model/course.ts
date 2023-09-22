import { Lesson } from "./lesson";

export interface Course {
         _id: string;
         name: string | null;
         category: string | null;
         lessons?: Lesson[];


}
