import Head from "next/head";
import { Inter } from "next/font/google";
import Styles from "@/styles/Home.module.css";
import MainBody from "../components/MainBody";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return (
    <>
      <Head>
        <title>MASK | OCAQ</title>
        <meta name="description" content="MASK Event" />
        <meta name="viewport" content="width=device-width, initial-scale=1"></meta>
        <link rel="icon" href="/favicon.ico" />
        <link rel="preconnect" href="https://fonts.gstatic.com" />
      </Head>
      <div className={Styles["container"]}>
        <MainBody />
      </div>
    </>
  );
}
