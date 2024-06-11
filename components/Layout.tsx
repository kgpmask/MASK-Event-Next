import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Styles from "@/styles/Home.module.css";

type LayoutProps = {
  children: React.ReactNode;
};


export default function Home({ children }: LayoutProps) {
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