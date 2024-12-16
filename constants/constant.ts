import { ComponentInterfaces } from "./component";

//@ts-ignore
import VieFlag from "@/assets/images/flags/vie.png";
//@ts-ignore
import EngFlag from "@/assets/images/flags/eng.png";
//@ts-ignore
import KorFlag from "@/assets/images/flags/kor.png";
//@ts-ignore
import JapFlag from "@/assets/images/flags/jap.png";

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
