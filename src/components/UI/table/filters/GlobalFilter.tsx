import React, { type FC, useState, useEffect } from "react";
import { Icon } from "@/components";
import { RiSearch2Line } from "react-icons/ri";
import { useDebounceValue } from "@/hooks";

interface GlobalFilterProps {
  pre_global_filtered_rows: [];
  global_filter: string;
  setGlobalFilter: (value: string | undefined) => void;
}

const GlobalFilter: FC<GlobalFilterProps> = ({
  pre_global_filtered_rows,
  global_filter,
  setGlobalFilter,
}) => {
  // component states
  const count = pre_global_filtered_rows.length;
  const [value, setValue] = useState<string | undefined>(global_filter);

  // component functions
  const debounce_value = useDebounceValue(value || "", 200);

  useEffect(() => {
    if (debounce_value) {
      setGlobalFilter(debounce_value);
    } else {
      setGlobalFilter("");
    }
  }, [debounce_value, setGlobalFilter]);

  return (
    <label className="flex items-baseline gap-x-2">
      <div className="flex w-[200px] items-center  rounded-xl bg-secondary/10 px-3">
        <Icon
          icon={<RiSearch2Line className="h-5 w-5" />}
          icon_wrapper_styles=" text-dark"
        />
        <input
          type="text"
          value={value || ""}
          onChange={(event) => {
            setValue(event.target.value);
          }}
          placeholder={`${count} records`}
          className="w-full bg-transparent px-1 py-2 text-gray-900 outline-none"
        />
      </div>
    </label>
  );
};

export default GlobalFilter;
