import { CoverImage } from "./CoverImage";

export type RouteMap = {
  id: string;
  title: string;
  station: string[];
  route: string[];
  createdAt: string;
  coverImage: CoverImage;
};
