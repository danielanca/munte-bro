import React, { ReactNode, useState } from "react";

type SidebarContextObj = { isOpen: boolean; toggleSidebar: () => void };

const SidebarContext = React.createContext<SidebarContextObj>({
  isOpen: true,
  toggleSidebar: () => {},
});
interface SidebarInterface {
  children: ReactNode;
}
export const SidebarContextProvider: React.FC<SidebarInterface> = props => {
  const [isOpen, setIsOpen] = useState(true);
  function ToggleSidebar() {
    setIsOpen(prev => !prev);
  }

  const contextValue: SidebarContextObj = {
    isOpen,
    toggleSidebar: ToggleSidebar,
  };
  return <SidebarContext.Provider value={contextValue}>{props.children}</SidebarContext.Provider>;
};

export default SidebarContext;
