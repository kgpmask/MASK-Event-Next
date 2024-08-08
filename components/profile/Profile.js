import React from 'react'
import Styles from '@/styles/Profile.module.css'
// import Image from @next/image
import next from 'next'
import { IoClose } from "react-icons/io5";
import LogOutModal from './LogOutModal';


function Profile() {
    const [showLogOutModal, setShowLogOutModal] = React.useState(false)
    const handleClose = () => {
        console.log('close')
    }
    const handleLogout = () => {
        console.log('logout')
        setShowLogOutModal(true)
    }
    return (
        <div className={Styles['container']}>
            <div className={Styles["wrapper"]}>
                <div style={{ borderRadius: '10px' }}>
                    <div className={Styles["block"]}>
                        <IoClose className={Styles["cross"]} color='white' onClick={handleClose} />
                        <img src='/deku.webp' alt='MASK' />
                    </div>
                    <img src="/deku.webp" alt="MASK" className={Styles['profile-img']} />
                </div>
                <div className={Styles["bottom-content"]}>
                    <div className={Styles["profile-info"]}>
                        <h1>{'Goose'}</h1>
                        <p><span>{'Goose-of-war'}</span></p>
                        <button onClick={handleLogout} className={Styles['logout-btn']} >LogOut</button>

                    </div>
                </div>
            </div>
            {showLogOutModal && <LogOutModal showModal={setShowLogOutModal}/>}
        </div >
    )
}

export default Profile
