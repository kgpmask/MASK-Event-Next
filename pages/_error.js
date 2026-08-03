import React from "react";
import Head from "next/head";

import styles from "@/styles/Error.module.css";

const statusCodes = {
  400: "Bad Request",
  404: "This page could not be found",
  405: "Method Not Allowed",
  500: "Internal Server Error",
};

class ErrorPage extends React.Component {
  static getInitialProps({ res, err }) {
    const statusCode = res && res.statusCode ? res.statusCode : err ? err.statusCode : 404;
    return { statusCode };
  }

  render() {
    const { statusCode } = this.props;
    const title =
      this.props.title || statusCodes[statusCode] || "An unexpected error has occurred";

    return (
      <div className={styles.error}>
        <Head>
          <title>
            {statusCode
              ? `${statusCode}: ${title}`
              : "Application error: a client-side exception has occurred"}
          </title>
        </Head>
        <div className={styles.desc}>
          {statusCode ? (
            <h1 className={styles.h1}>
              {statusCode}
            </h1>
          ) : null}
          <div className={styles.wrap}>
            <h2 className={styles.h2}>{title}.</h2>
          </div>
        </div>
      </div>
    );
  }
}

export default ErrorPage;
