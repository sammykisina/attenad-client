import { intakeAtoms, moduleAtoms } from "@/atoms";
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
import { useModule } from "@/hooks";

const CreateOrEditIntakeWidget = () => {
  /**
   * component states
   */
  const {
    globalModuleState,
    isEditingModuleState,
    showCreateOrEditModuleWidgetState,
  } = moduleAtoms;
  const [isEditingModule, setIsEditingModule] =
    useRecoilState(isEditingModuleState);
  const [globalModule, setGlobalModule] = useRecoilState(globalModuleState);
  const setShowCreateOrEditModuleWidget = useSetRecoilState(
    showCreateOrEditModuleWidgetState
  );

  const [moduleCode, setModuleCode] = useState("");

  const { moduleSchema } = schoolManagement;
  type ModuleSchema = z.infer<typeof moduleSchema>;
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ModuleSchema>({
    resolver: zodResolver(moduleSchema),
  });

  const { generateCode } = appUtils;
  const {
    createModuleMutateAsync,
    isCreatingModule,
    isUpdatingModule,
    updateModuleMutateAsync,
  } = useModule();

  /**
   * component functions
   */
  const onSubmit: SubmitHandler<ModuleSchema> = ({ name }) => {
    /**
     * validation
     */
    if (moduleCode.trim() === "") {
      Notifications.errorNotification("Please generate the module code.");
      return;
    }

    isEditingModule
      ? updateModuleMutateAsync({
          moduleUuid: globalModule?.attributes?.uuid,
          moduleData: {
            name,
            code: moduleCode,
          },
        })
      : createModuleMutateAsync({
          name,
          code: moduleCode,
        });

    clearForm();
  };

  const clearForm = () => {
    reset({
      name: "",
    });

    setModuleCode("");
  };

  useEffect(() => {
    if (isEditingModule && globalModule) {
      reset({
        name: globalModule?.attributes?.name,
      });

      setModuleCode(globalModule?.attributes?.code);
    }
  }, [isEditingModule, globalModule, reset]);

  return (
    <section>
      {/* header */}
      <WidgetHeader
        close={() => {
          setGlobalModule(null);
          setIsEditingModule(false);
          setShowCreateOrEditModuleWidget(false);
          clearForm();
        }}
        title={!isEditingModule ? "Creating Module." : "Editing Module."}
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
                  placeholder="Module Code"
                  value={moduleCode}
                  onChange={(event) => setModuleCode(event.target.value)}
                />

                <button
                  className="flex h-[38px] items-center justify-center gap-[6px] whitespace-nowrap  rounded-full bg-secondary px-4 py-2 text-[14px] text-white focus:outline-none"
                  type="button"
                  onClick={() => setModuleCode(generateCode("module"))}
                >
                  Generate
                </button>

                <label className="input_label">Module Code</label>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <Button
            title={
              isEditingModule ? (
                isUpdatingModule ? (
                  <SpinnerLoader color="fill-white" />
                ) : (
                  "Edit"
                )
              ) : isCreatingModule ? (
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
