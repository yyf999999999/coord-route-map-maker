"use client";
import { usePathname } from "next/navigation";

type Props = {
  children: React.ReactNode;
};

const Main: React.FC<Props> = (props) => {
  const { children } = props;
  const pathname = usePathname();
  const fullWidthPages = ["/make/edit"];
  const isFullWidthPage = fullWidthPages.includes(pathname);

  return (
    <div
      className={`${isFullWidthPage ? "max-w-none" : "mx-4 mt-2 max-w-2xl"} md:mx-auto`}
    >
      {children}
    </div>
  );
};

export default Main;
