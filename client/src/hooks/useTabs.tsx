import { useState } from "react";

// ----------------------------------------------------------------------

export default function useTabs(defaultValues: string) {
  const [currentTab, setCurrentTab] = useState(defaultValues || "");

  return {
    currentTab,
    onChangeTab: (event: unknown, newValue: string) => {
      setCurrentTab(newValue);
    },
    setCurrentTab,
  };
}
