import { Box, useStyleConfig } from "@chakra-ui/react";
import { ReactNode } from "react";

// declaring props types for MDBox
interface Props {
  variant?: "contained" | "gradient";
  children: ReactNode;
  [key: string]: any;
}

function CardHeader({ variant, children, ...rest }: Props) {
  const styles = useStyleConfig("CardHeader", { variant });
  return (
    <Box __css={styles} {...rest}>
      {children}
    </Box>
  );
}

export default CardHeader;
