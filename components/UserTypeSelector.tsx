import React from "react";
// import { Select } from './ui/select'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const UserTypeSelector = ({
  userType,
  setUserType,
  onClickHandler,
}: UserTypeSelectorParams) => {
  const accessChangeHandler = (type: UserType) => {
    setUserType(type);
    onClickHandler && onClickHandler(type);
  };
  return (
    <div>
      <Select
        value={userType}
        onValueChange={(type: UserType) => accessChangeHandler(type)}
      >
        <SelectTrigger className="shad-select">
          <SelectValue />
        </SelectTrigger>
        <SelectContent className="border-none bg-dark-200">
          <SelectItem value="viewer" className="shad-select-item">
            can view
          </SelectItem>
          <SelectItem value="editor" className="shad-select-item">
            can edit
          </SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default UserTypeSelector;
