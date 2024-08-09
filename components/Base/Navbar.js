import Image from "next/image"
import Styles from '@/styles/Navbar.module.css'
import Link from "next/link"
import { useState, useRef, useEffect } from "react"
import LogOutModal from '@/components/profile/LogOutModal'

const Navbar = () => {
	// const [active, setActive] = useState(0); // Initialize active state to the first item
	const [showLogOutModal, setShowLogOutModal] = useState(false);
	const [burgerOpen, setBurgerOpen] = useState(false);

	const navItems = [
		{
			name: 'Home',
			href: '/'
		},
		{
			name: 'Information',
			href: '/information'
		},
		{
			name: 'Quiz Portal',
			href: '/live'
		},
		{
			name: 'Profile',
			href: '/profile'
		}
	];

	// const handleClick = (index) => {
	// 	setActive(index); // Set active state to the currently clicked item
	// }

	useEffect(() => {
		document.querySelector('#content-wrap')?.classList.toggle('burger-open');
	}, [burgerOpen]);

	const handleLogout = () => {
		setShowLogOutModal(true);
	};

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
						// onClick={() => handleClick(index)}
						>
							<Link href={item.href} className={Styles['navlink']} >{item.name}</Link>
						</li>
					)}
					<button className={Styles["list-item"]} onClick={handleLogout} >Logout</button>
				</ul>
				<button onClick={() => setBurgerOpen(!burgerOpen)} className={burgerOpen ? Styles["burger"] + ' ' + Styles['open'] : Styles['burger']} >
					<div className={Styles["patty"]} ></div>
				</button>
				<div className={burgerOpen ? Styles["hamburger-menu"] + ' ' + Styles['slide'] : Styles['hamburger-menu']}>
					{navItems.map((item, index) =>
						<li key={index}
						>
							<Link href={item.href} className={Styles['burger-link']} >{item.name}</Link>
						</li>
					)}
				</div>
			</div>
			{showLogOutModal && <LogOutModal showModal={setShowLogOutModal} />}
		</div>
	)
}

export default Navbar;