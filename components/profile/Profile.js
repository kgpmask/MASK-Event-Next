import React from 'react'
import Styles from '@/styles/Profile.module.css'
// import Image from @next/image
import next from 'next'
import { IoClose } from "react-icons/io5";


function Profile() {
    const handleClose = () => {
        console.log('close')
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
                        <h1>Profile</h1>
                        <p><span>deku</span></p>
                    </div>
                </div>
            </div>
        </div >
    )
}

export default Profile
