import React, { useState } from "react";

import { Input } from "./input";

interface EditableTitleProps {
  title: string;
  onChange: (newTitle: string) => void;
  className?: string;
  inputClassName?: string;
}

export function EditableTitle({ title, onChange, className, inputClassName }: EditableTitleProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(title);

  const handleBlur = () => {
    setIsEditing(false);
    if (value.trim() !== title) {
      onChange(value.trim());
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleBlur();
    }
    if (e.key === "Escape") {
      setIsEditing(false);
      setValue(title);
    }
  };

  return isEditing ? (
    <Input
      autoFocus
      className={inputClassName}
      value={value}
      onBlur={handleBlur}
      onChange={(e) => setValue(e.target.value)}
      onKeyDown={handleKeyDown}
    />
  ) : (
    <h2
      className={`text-lg font-medium text-gray-800 cursor-pointer hover:underline ${className ?? ""}`}
      onClick={() => setIsEditing(true)}
    >
      {title}
    </h2>
  );
}
