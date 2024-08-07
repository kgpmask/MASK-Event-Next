import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Styles from "@/styles/Layout.module.css";

export default function Home({ children }) {
  return (
    <>
      <Navbar />
      <div className={Styles["container"]}>
        {children}
      </div>
      <Footer />
    </>
  );
}