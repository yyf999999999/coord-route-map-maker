import type { Metadata } from "next";
import "./globals.css";

import "@fortawesome/fontawesome-svg-core/styles.css";
import { config } from "@fortawesome/fontawesome-svg-core";
config.autoAddCss = false;

import Header from "@/app/_components/Header";
import Main from "@/app/_components/Main";

export const metadata: Metadata = {
  title: "Coord-RouteMapMaker",
  description: "Built to learn Next.js and modern web development.",
};

type Props = {
  children: React.ReactNode;
};

const RootLayout: React.FC<Props> = (props) => {
  const { children } = props;
  return (
    <html lang="ja">
      <body>
        <Header />
        <Main>{children}</Main>
      </body>
    </html>
  );
};

export default RootLayout;
