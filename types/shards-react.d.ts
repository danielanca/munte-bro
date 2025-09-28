// src/types/shards-react.d.ts
import * as React from "react";

declare module "shards-react" {
  // tighten these to only what you use to get better TS help
  export type Theme =
    | "primary" | "secondary" | "success" | "danger"
    | "warning" | "info" | "light" | "dark" | "link";

  // Common
  export const Container: React.FC<React.HTMLAttributes<HTMLDivElement>>;
  export const Row: React.FC<React.HTMLAttributes<HTMLDivElement>>;
  export const Col: React.FC<React.HTMLAttributes<HTMLDivElement>>;

  // Buttons
  export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    theme?: Theme;
    outline?: boolean;
    pill?: boolean;
    squared?: boolean;
    size?: "sm" | "lg";
  }
  export const Button: React.FC<ButtonProps>;

  // Cards
  export const Card: React.FC<React.HTMLAttributes<HTMLDivElement>>;
  export const CardHeader: React.FC<React.HTMLAttributes<HTMLDivElement>>;
  export const CardBody: React.FC<React.HTMLAttributes<HTMLDivElement>>;
  export const CardFooter: React.FC<React.HTMLAttributes<HTMLDivElement>>;

  // Forms
  export const Form: React.FC<React.FormHTMLAttributes<HTMLFormElement>>;
  export const FormGroup: React.FC<React.HTMLAttributes<HTMLDivElement>>;
  export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}
  export const Input: React.FC<InputProps>;
  export const FormInput: React.FC<InputProps>;
  export const FormSelect: React.FC<React.SelectHTMLAttributes<HTMLSelectElement>>;
  export const FormTextarea: React.FC<React.TextareaHTMLAttributes<HTMLTextAreaElement>>;
  export const FormCheckbox: React.FC<React.InputHTMLAttributes<HTMLInputElement>>;
  export const FormRadio: React.FC<React.InputHTMLAttributes<HTMLInputElement>>;

  // Nav / Navbar
  export const Nav: React.FC<React.HTMLAttributes<HTMLUListElement>>;
  export const NavItem: React.FC<React.LiHTMLAttributes<HTMLLIElement>>;
  export const NavLink: React.FC<React.AnchorHTMLAttributes<HTMLAnchorElement>>;
  export const Navbar: React.FC<React.HTMLAttributes<HTMLDivElement>>;
  export const NavbarBrand: React.FC<React.AnchorHTMLAttributes<HTMLAnchorElement>>;

  // Modals
  export const Modal: React.FC<React.HTMLAttributes<HTMLDivElement> & { open?: boolean; toggle?: () => void }>;
  export const ModalBody: React.FC<React.HTMLAttributes<HTMLDivElement>>;
  export const ModalHeader: React.FC<React.HTMLAttributes<HTMLDivElement>>;
  export const ModalFooter: React.FC<React.HTMLAttributes<HTMLDivElement>>;

  // Misc (add more as you use them)
  export const Badge: React.FC<React.HTMLAttributes<HTMLSpanElement> & { theme?: Theme; pill?: boolean }>;
  export const Tooltip: React.FC<{ open?: boolean; target?: string; toggle?: () => void; } & React.HTMLAttributes<HTMLDivElement>>;
  export const Dropdown: React.FC<React.HTMLAttributes<HTMLDivElement> & { open?: boolean; toggle?: () => void }>;
  export const DropdownToggle: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement>>;
  export const DropdownMenu: React.FC<React.HTMLAttributes<HTMLDivElement>>;
  export const DropdownItem: React.FC<React.LiHTMLAttributes<HTMLLIElement>>;
}
