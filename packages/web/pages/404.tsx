import { Typography } from "@material-ui/core";
import Head from "next/head";
import Layout from "../components/Layout";

const NotFound: React.FC = () => (
  <Layout>
    <Head>
      <title>404 : GCP IAM Explorer</title>
      <meta property="og:title" content="404 : GCP IAM Explorer" />
    </Head>

    <Typography variant="h2" color="primary" align="center" component="div">
      404
    </Typography>

    <Typography variant="h4" align="center" component="div">
      Page Not Found
    </Typography>
  </Layout>
);

export default NotFound;
