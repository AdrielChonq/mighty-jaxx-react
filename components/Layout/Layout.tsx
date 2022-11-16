import { ReactNode } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../slices";
import ModalMessage from "../Modal/ModalMessage";
interface Props {
  children: ReactNode;
}

export default function Layout({ children }: Props) {
  const isOpen = useSelector((state: RootState) => state.common.isOpen);

  return (
    <>
      <main>{children}</main>
      <ModalMessage
        isOpen={isOpen}
        positiveLabel="okay"
        title="Sesson Timeout"
        content="Please login again"
      />
    </>
  );
}
