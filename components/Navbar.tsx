import Image from "next/image"
import Styles from '@/styles/Navbar.module.css'
import Link from "next/link"
import { useState, MouseEvent } from "react"

interface NavItem {
    name: string;
    index: number;
}

function Navbar() {
    const [active, setActive] = useState<string | null>(null)
    const handleHover = (item: NavItem) => {
        // handle hover event
    }
    const handleClick = (item: NavItem) => {
        // handle click event
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
                    {['Information', 'Quiz Portal'].map((item, index) =>
                        <li key={index} onMouseOver={() => handleHover({ name: item, index })} onClick={() => handleClick({ name: item, index })} >
                            <Link href='/' className={Styles['navlink']}>{item}</Link>
                        </li>
                    )}
                    <button className={Styles["list-item"]} >Profile</button>
                </ul>
            </div>
        </div>
    )
}

export default Navbar