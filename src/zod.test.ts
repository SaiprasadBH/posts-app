import { z } from "zod";

test("zod tests", () => {
  const userSchema = z.object({
    //suppose say userId cannot be 50 and 75
    userId: z
      .number()
      .min(1)
      .max(10000)
      .refine(
        (val) => {
          val !== 50 && val !== 75;
        },
        { message: "userId cannot be 50 or 75" }
      ),
    id: z.number(),
    gender: z.union([z.literal("f"), z.literal("m")]),
    body: z.string(),
    name: z.string().min(5).max(50).trim().toLowerCase(), //toLowerCase is a transformation it should always be done after validation,also the trim.
  });
  type User = z.infer<typeof userSchema>;

  const user: User = {
    userId: 0,
    id: 19,
    gender: "m",
    body: "some stuff",
    name: "Ghatotgaja",
  };

  const user1: User = {
    userId: 10,
    id: 20,
    gender: "m",
    body: "some stuff",
    name: "Bheemasena  ",
  };

  expect(() => userSchema.parse(user)).toThrowError(); //since userId is 0
  const parsedUser = userSchema.safeParse(user);
  console.log(parsedUser.error?.flatten());

  //const parsedUser1 = userSchema.parse(user1);
  //console.log(parsedUser1);
});
