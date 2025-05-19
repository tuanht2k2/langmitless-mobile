import { ComponentInterfaces } from "./component";

//@ts-ignore
import VieFlag from "@/assets/images/flags/vie.png";
//@ts-ignore
import EngFlag from "@/assets/images/flags/eng.png";
//@ts-ignore
import KorFlag from "@/assets/images/flags/kor.png";
//@ts-ignore
import JapFlag from "@/assets/images/flags/jap.png";

// credit card
//@ts-ignore
import mbBankIcon from "@/assets/images/bankIcons/mb.png";
//@ts-ignore
import tcbIcon from "@/assets/images/bankIcons/techcombank.png";
//@ts-ignore
import tpbankIcon from "@/assets/images/bankIcons/tpbank.jpg";
import color from "@/assets/styles/color";
import { ConstantInterfaces } from "@/data/interfaces/constant";

export const BANKS: ComponentInterfaces.IDropdownOption<string>[] = [
  {
    name: "MB Bank",
    code: "mb",
    img: mbBankIcon,
  },
  {
    name: "Techcombank",
    code: "tcb",
    img: tcbIcon,
  },
  {
    name: "TP Bank",
    code: "tp",
    img: tpbankIcon,
  },
];

export const LANGUAGES: ComponentInterfaces.IDropdownOption<string>[] = [
  {
    name: "Tiếng Việt",
    code: "vie",
    img: VieFlag,
  },
  {
    name: "Tiếng Anh",
    code: "eng",
    img: EngFlag,
  },
  {
    name: "Tiếng Hàn",
    code: "kor",
    img: KorFlag,
  },
  {
    name: "Tiếng Nhật",
    code: "jap",
    img: JapFlag,
  },
];

export const COURSE_LEVELS: ComponentInterfaces.IDropdownOption<number>[] = [
  {
    name: "Cơ bản",
    code: 0,
  },
  {
    name: "Trung cấp",
    code: 1,
  },
  {
    name: "Nâng cao",
    code: 2,
  },
  {
    name: "Chuyên sâu",
    code: 3,
  },
  // {
  //   name: "Chuyên gia",
  //   code: 4,
  // },
];

export const COURSE_PRICE: ComponentInterfaces.IDropdownOption<string>[] = [
  {
    name: "Miễn phí",
    code: "FREE",
  },
  {
    name: "0 - 200.000VND",
    code: "CHEAP",
  },
  {
    name: "200.000VND - 500.000VND",
    code: "MEDIUM",
  },
  {
    name: "Trên 500.000VND",
    code: "EXPENSIVE",
  },
];

export const SCORE_COLOR: ConstantInterfaces.IScoreColor = {
  dark: [color.red3, color.red3, color.grey3, color.warning3, color.success3],
  light: [color.red1, color.red1, color.grey1, color.warning1, color.success1],
};
