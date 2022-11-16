import { ColorModeScript } from "@chakra-ui/react";
import { Title } from "@mui/icons-material";
import NextDocument, { Html, Head, Main, NextScript } from "next/document";
import theme from "../assets/theme/theme";

export default class Document extends NextDocument {
  render() {
    return (
      <Html lang="en">
        <Head>
          <title>Mighty Jaxx Admin Portal</title>
          <meta name="Adriel" content="Mighty Jaxx Test" />
          <link rel="shortcut icon" href="./favicon.ico" />
        </Head>
        <body>
          <ColorModeScript initialColorMode={theme.config.initialColorMode} />
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
