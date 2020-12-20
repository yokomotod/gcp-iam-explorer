import CssBaseline from "@material-ui/core/CssBaseline";
import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";
import { AppProps } from "next/app";
import { useRouter } from "next/router";
import React from "react";
import "../styles/globals.css";
import * as sentry from "../utils/sentry";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare const gtag: (...arg: any) => any;

sentry.init();

const theme = createMuiTheme();

const MyApp: React.FC<AppProps> = ({ Component, pageProps }) => {
  React.useEffect(() => {
    // Remove the server-side injected CSS.
    const jssStyles = document.querySelector("#jss-server-side");
    if (jssStyles && jssStyles.parentElement) {
      jssStyles.parentElement.removeChild(jssStyles);
    }
  }, []);

  // GoogleAnalytics
  const router = useRouter();
  React.useEffect(() => {
    const handleRouteChange = (url: string) => {
      if (process.env.NODE_ENV === "production") {
        gtag(url);
      }
    };
    router.events.on("routeChangeComplete", handleRouteChange);
    return () => {
      router.events.off("routeChangeComplete", handleRouteChange);
    };
  }, [router.events]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Component {...pageProps} />
    </ThemeProvider>
  );
};
export default MyApp;
