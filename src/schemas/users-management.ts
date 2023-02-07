import { object, string } from "zod";

const studentSchema = object({
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
    .optional(),
});

const lecturerSchema = object({
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
    .optional(),
});

const usersManagement = {
  studentSchema,
  lecturerSchema,
};

export default usersManagement;
