import { intakeAtoms } from "@/atoms";
import {
  Button,
  Error,
  Notifications,
  SpinnerLoader,
  WidgetHeader,
} from "@/components";
import { schoolManagement } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect, useState } from "react";
import { useRecoilState, useSetRecoilState } from "recoil";
import type { z } from "zod";
import { type SubmitHandler, useForm } from "react-hook-form";
import { appUtils } from "@/utils";
import { useIntake } from "@/hooks";

const CreateOrEditIntakeWidget = () => {
  /**
   * component states
   */
  const {
    globalIntakeState,
    isEditingIntakeState,
    showCreateOrEditIntakeWidgetState,
  } = intakeAtoms;
  const [isEditingIntake, setIsEditingIntake] =
    useRecoilState(isEditingIntakeState);
  const [globalIntake, setGlobalIntake] = useRecoilState(globalIntakeState);
  const setShowCreateOrEditIntakeWidget = useSetRecoilState(
    showCreateOrEditIntakeWidgetState
  );

  const [intakeCode, setIntakeCode] = useState("");

  const { intakeSchema } = schoolManagement;
  type IntakeSchema = z.infer<typeof intakeSchema>;
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<IntakeSchema>({
    resolver: zodResolver(intakeSchema),
  });

  const { generateCode } = appUtils;
  const {
    createIntakesMutateAsync,
    isCreatingIntake,
    isUpdatingIntake,
    updateIntakesMutateAsync,
  } = useIntake();

  /**
   * component functions
   */
  const onSubmit: SubmitHandler<IntakeSchema> = ({ name }) => {
    /**
     * validation
     */
    if (intakeCode.trim() === "") {
      Notifications.errorNotification("Please generate the intake code.");
      return;
    }

    isEditingIntake
      ? updateIntakesMutateAsync({
          intakeUuid: globalIntake?.attributes?.uuid,
          intakeData: {
            name,
            code: intakeCode,
          },
        })
      : createIntakesMutateAsync({
          name,
          code: intakeCode,
        });

    clearForm();
  };

  const clearForm = () => {
    reset({
      name: "",
    });

    setIntakeCode("");
  };

  useEffect(() => {
    if (isEditingIntake && globalIntake) {
      reset({
        name: globalIntake?.attributes?.name,
      });

      setIntakeCode(globalIntake?.attributes?.code);
    }
  }, [isEditingIntake, globalIntake, reset]);

  return (
    <section>
      {/* header */}
      <WidgetHeader
        close={() => {
          setGlobalIntake(null);
          setIsEditingIntake(false);
          setShowCreateOrEditIntakeWidget(false);
          clearForm();
        }}
        title={!isEditingIntake ? "Creating Intake." : "Editing Intake."}
      />

      {/* body */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-6 px-2"
      >
        <div className="flex  w-full flex-col gap-4 overflow-y-scroll py-3 scrollbar-hide">
          {/* roles and card info */}
          <div className="flex flex-col gap-y-5 rounded-md border border-primary/10 py-4 px-2">
            <div className="relative">
              <input
                type="text"
                className="input peer"
                placeholder="Name"
                {...register("name", { required: true })}
              />
              <label className="input_label">Name</label>

              {errors["name"] && (
                <Error error_message={errors["name"].message} />
              )}
            </div>

            <div className="relative">
              <div className="flex items-center">
                <input
                  type="text"
                  className="input peer"
                  placeholder="Intake Code"
                  value={intakeCode}
                  onChange={(event) => setIntakeCode(event.target.value)}
                />

                <button
                  className="flex h-[38px] items-center justify-center gap-[6px] whitespace-nowrap  rounded-full bg-secondary px-4 py-2 text-[14px] text-white focus:outline-none"
                  type="button"
                  onClick={() => setIntakeCode(generateCode("intake"))}
                >
                  Generate
                </button>

                <label className="input_label">Intake Code</label>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <Button
            title={
              isEditingIntake ? (
                isUpdatingIntake ? (
                  <SpinnerLoader color="fill-white" />
                ) : (
                  "Edit"
                )
              ) : isCreatingIntake ? (
                <SpinnerLoader color="fill-white" />
              ) : (
                "Create"
              )
            }
            intent="primary"
          />
        </div>
      </form>
    </section>
  );
};

export default CreateOrEditIntakeWidget;
