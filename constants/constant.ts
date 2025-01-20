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

export const REGION_MAP: Record<string, string> = {
  VN: "http://3.38.92.64:8080/api/v1", // Việt Nam
  US: "http://3.101.24.105:8080/api/v1", // Mỹ
  DE: "http://3.101.24.105:8080/api/v1", // Đức
  IN: "http://3.38.92.64:8080/api/v1", // Ấn Độ
  JP: "http://3.38.92.64:8080/api/v1", // Nhật Bản
  KR: "http://3.38.92.64:8080/api/v1", // Hàn Quốc
  FR: "http://3.101.24.105:8080/api/v1", // Pháp
  GB: "http://3.101.24.105:8080/api/v1", // Vương quốc Anh
  CA: "http://3.101.24.105:8080/api/v1", // Canada
  AU: "http://3.38.92.64:8080/api/v1", // Australia
  BR: "http://3.101.24.105:8080/api/v1", // Brazil
  ZA: "http://3.38.92.64:8080/api/v1", // Nam Phi
  MX: "http://3.101.24.105:8080/api/v1", // Mexico
  IT: "http://3.38.92.64:8080/api/v1", // Ý
  ES: "http://3.101.24.105:8080/api/v1", // Tây Ban Nha
  RU: "http://3.38.92.64:8080/api/v1", // Nga
  CN: "http://3.38.92.64:8080/api/v1", // Trung Quốc
  SE: "http://3.38.92.64:8080/api/v1", // Thụy Điển
  NL: "http://3.101.24.105:8080/api/v1", // Hà Lan
};
