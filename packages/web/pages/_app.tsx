import CssBaseline from "@material-ui/core/CssBaseline";
import { AppProps } from 'next/app';
import "../components/Splash.css";
import "../styles/globals.css";

const MyApp: React.FC<AppProps> = ({ Component, pageProps }) => (
  <>
    <CssBaseline />
    <Component {...pageProps} />
  </>
);

export default MyApp;
