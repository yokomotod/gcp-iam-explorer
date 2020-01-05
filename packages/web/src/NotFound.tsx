import { Typography } from "@material-ui/core";
import React from "react";
import { Helmet } from "react-helmet";

const NotFound: React.FC = () => (
  <>
    <Helmet>
      <title>404 : GCP IAM Explorer</title>
      <meta property="og:title" content="404 : GCP IAM Explorer" />
    </Helmet>

    <Typography variant="h2" color="primary" align="center" component="div">
      404
    </Typography>

    <Typography variant="h4" align="center" component="div">
      Page Not Found
    </Typography>
  </>
);

export default NotFound;
