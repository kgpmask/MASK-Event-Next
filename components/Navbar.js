import Image from "next/image"
import Styles from '@/styles/Navbar.module.css'
import Link from "next/link"
import { useState } from "react"

const Navbar = () => {
    const [active, setActive] = useState(0); // Initialize active state to the first item
    const navItems = ['Information', 'Quiz Portal'];

    const handleClick = (index) => {
        setActive(index); // Set active state to the currently clicked item
    }

    return (
        <div className={Styles["container"]}>
            <div className={Styles["content"]}>
                <Link
                    href="/"
                    style={{
                        padding: '16px 16px',
                        verticalAlign: 'middle'
                    }}
                    className="nohover"
                    target="_self"
                >
                    <Image src="/logo.jpeg" alt="Logo" width={40} height={40} className={Styles['logo']} />
                </Link>
                <ul className={Styles["list"]}>
                    {navItems.map((item, index) =>
                        <li key={index}
                            onClick={() => handleClick(index)}
                        >
                            <Link href='/' className={Styles['navlink']} >{item}</Link>
                        </li>
                    )}
                    <button className={Styles["list-item"]} >Profile</button>
                </ul>
            </div>
        </div>
    )
}

export default Navbar;