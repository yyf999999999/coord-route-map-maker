import { CoverImage } from "./CoverImage";
import { Line } from "./Line";
import { Station } from "./Station";

export type RouteMap = {
  id: string;
  title: string;
  station: Station[];
  line: Line[];
  createdAt: Date;
};
