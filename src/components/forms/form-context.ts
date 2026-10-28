import { createContext, useContext } from "react";

/** Shared by <EnquiryForm> and its fields: error messages and selected files. */
export type FormContextValue = {
  errors: Record<string, string>;
  clearError: (name: string) => void;
  setFile: (name: string, file: File | null) => void;
  setFileError: (name: string, message: string | null) => void;
};

export const FormCtx = createContext<FormContextValue | null>(null);

export function useFormKit() {
  const ctx = useContext(FormCtx);
  if (!ctx) throw new Error("Form fields must be used inside <EnquiryForm>");
  return ctx;
}
