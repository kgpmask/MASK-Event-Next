import React from 'react'
import Styles from '@/styles/Profile.module.css'
// import Image from @next/image
import next from 'next'
import { IoClose } from "react-icons/io5";


function Profile() {
    return (
        <div className={Styles['container']}>
            <div className={Styles["wrapper"]}>
                <div style={{ borderRadius: '10px' }}>
                    <div className={Styles["block"]}>
                        <IoClose className={Styles["cross"]} color='white' />
                        <img src='/deku.webp' alt='MASK' />
                    </div>
                    <img src="/deku.webp" alt="MASK" className={Styles['profile-img']} />
                </div>
                <div className={Styles["bottom-content"]}></div>
            </div>
        </div >
    )
}

export default Profile
