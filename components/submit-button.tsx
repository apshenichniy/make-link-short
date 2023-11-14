"use client";

import { Loader2 } from "lucide-react";
import { useFormStatus } from "react-dom";

import React from "react";
import { Button, ButtonProps } from "./ui/button";

const SubmitButton: React.FC<ButtonProps> = ({ children, ...props }) => {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" aria-disabled={pending} disabled={pending} {...props}>
      {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {children}
    </Button>
  );
};

export { SubmitButton };
