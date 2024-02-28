import { IconType } from "react-icons/lib";
import { TextFieldFormElement } from "./fields/Textfield";
import { TitleFieldFormElement } from "./fields/TitleField";
import { SubtitleFieldFormElement } from "./fields/Subtitle";
import { ParagraphFieldFormElement } from "./fields/Paragraph";
import { SeparatorFieldFormElement } from "./fields/Separator";
import { SpacerFieldFormElement } from "./fields/Spacer";
import { NumberFieldFormElement } from "./fields/Number";
import { TextAreaFieldFormElement } from "./fields/TextAreaField";
import { DateFieldFormElement } from "./fields/DateField";
import { SelectFieldFormElement } from "./fields/SelectField";
import { CheckboxFieldFormElement } from "./fields/CheckboxField";

export type ElementsType =
  | "Textfield"
  | "Titlefield"
  | "SubtitleField"
  | "ParagraphField"
  | "SeparatorField"
  |"SpacerField"
  |"NumberField"
  |"TextAreaField"
  |"DateField"
  |'SelectField'
  |"CheckboxField"


export type SubmitFunction = (key: string, value: string) => void;
export type FormElement = {
  type: ElementsType;
  construct: (id: string) => FormElementsInstance;
  designerBtnElement: {
    icon: IconType;
    label: string;
  };
  designerComponent: React.FC<{
    elementInstance: FormElementsInstance;
  }>;
  formComponent: React.FC<{
    elementInstance: FormElementsInstance;
    submitValue?: (key: string, value: string) => void;
    isInvalid?: boolean;
    defaultValues?: string;
  }>;
  propertiesComponent: React.FC<{
    elementInstance: FormElementsInstance;
  }>;
  validate: (
    formElement: FormElementsInstance,
    currentValue: string
  ) => boolean;
};
type FormElementsType = {
  [key in ElementsType]: FormElement;
};
export type FormElementsInstance = {
  id: string;
  type: ElementsType;
  extraAttributes?: Record<string|number, any>;
};
export const FormElements: FormElementsType = {
  Textfield: TextFieldFormElement,
  Titlefield: TitleFieldFormElement,
  SubtitleField: SubtitleFieldFormElement,
  ParagraphField: ParagraphFieldFormElement,
  SeparatorField:SeparatorFieldFormElement,
  SpacerField:SpacerFieldFormElement,
  NumberField:NumberFieldFormElement,
  TextAreaField:TextAreaFieldFormElement,
  DateField:DateFieldFormElement,
  SelectField:SelectFieldFormElement,
  CheckboxField:CheckboxFieldFormElement

};
