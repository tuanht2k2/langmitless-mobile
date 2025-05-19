import { ImageSourcePropType } from "react-native";
import { ViewStyle } from "react-native";

export namespace ComponentInterfaces {
  export interface IActionDialog {
    isVisible?: boolean;
    title?: string;
    content?: string;
    onConfirm?: () => void;
    onCancel?: () => void;
  }

  export interface IDropdownOption<T> {
    name: string;
    code: T;
    icon?: string;
    img?: ImageSourcePropType;
  }

  export interface IButtonGroupItem {
    name: string;
    code: any;
    icon?: string;
    img?: ImageSourcePropType;
    description?: string;
  }

  export interface IMenuItem {
    name?: string;
    icon?: string;
    to?: string;
    onClick?: () => void;
    style?: ViewStyle;
    labelColor?: string;
    iconColor?: string;
    img?: ImageSourcePropType;
  }

  export interface ITab {
    title?: string;
    value?: string;
    image?: ImageSourcePropType;
  }

  export interface IToast {
    titleColor?: string;
    contentColor?: string;
    title: string;
    content?: string;
    onPress?: () => void;
    autoHide?: boolean;
  }
}
