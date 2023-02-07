import { object, string } from "zod";

const loginSchema = object({
  email: string({
    required_error: "Email is required.",
  })
    .trim()
    .email({
      message: "Enter a valid email.",
    }),
  password: string({
    required_error: "Password is required.",
  })
    .trim()
    .min(5),
});

const passwordUpdateSchema = object({
  password: string({ required_error: "Password is required." }).trim(),
  confirm: string({ required_error: "Enter password to confirm." }).trim(),
}).refine((data) => data.confirm === data.password, {
  message: "Passwords don't match",
  path: ["confirm"],
});

const authSchemas = { loginSchema, passwordUpdateSchema };

export default authSchemas;
