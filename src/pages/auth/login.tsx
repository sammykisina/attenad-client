import { Logo, Title, Error, Button, SpinnerLoader } from "@/components";
import { type SubmitHandler, useForm } from "react-hook-form";
import { Toaster } from "react-hot-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { authSchemas } from "@/schemas";
import { type z } from "zod";
import { useRouter } from "next/router";
import { useAuth } from "@/hooks";

const Login = () => {
  /**
   * page states
   */
  const { loginSchema } = authSchemas;
  const router = useRouter();
  type LoginSchema = z.infer<typeof loginSchema>;
  const { loginMutateAsync, isLogging, user } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
  });

  // page functions
  const onSubmit: SubmitHandler<LoginSchema> = async ({ email, password }) => {
    await loginMutateAsync({ email, password });
  };

  // if there is a user then redirect to home
  if (user) router.push("/");

  return (
    <section className="mx-auto flex h-screen w-full max-w-[1100px] flex-col items-center justify-center  sm:px-[24px]">
      {/* pos name */}
      <div className="mb-5 flex flex-col items-center">
        <Logo />

        <div className="text-c_yellow text-lg">Attenad. All in one.</div>
      </div>

      {/* the Into section */}
      <div className="mt-5 w-full px-6  sm:w-3/4 lg:w-1/2">
        <Title title="Login" title_styles="text-lg" />

        {/* the login details */}
        <div className="mt-3">
          <form className="space-y-1 py-2" onSubmit={handleSubmit(onSubmit)}>
            <section className="flex w-full flex-col gap-4 py-3">
              <div className="relative">
                <input
                  type="email"
                  {...register("email")}
                  className="input peer"
                  placeholder="Email"
                />
                <label className="input_label">Email</label>

                {errors["email"] && (
                  <Error error_message={errors["email"].message} />
                )}
              </div>

              <div className="relative">
                <input
                  type="password"
                  {...register("password")}
                  className="input peer"
                  placeholder="Password"
                />
                <label className="input_label">Password</label>

                {errors["password"] && (
                  <Error error_message={errors["password"].message} />
                )}
              </div>
            </section>

            <div className="flex justify-end">
              <Button
                title={
                  isLogging ? <SpinnerLoader color="fill-white" /> : "Login"
                }
                intent="primary"
              />
            </div>
          </form>
        </div>
      </div>

      {/* the Toaster */}
      <Toaster />
    </section>
  );
};

export default Login;
