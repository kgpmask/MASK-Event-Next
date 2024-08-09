import React from 'react'
import Styles from '@/styles/Profile.module.css'
// import Image from @next/image
import next from 'next'
import { IoClose } from "react-icons/io5";

function LogOutModal({ showModal }) {
    const handleClose = () => {
        // console.log('close')
        showModal(false)
    }
    return (
        <div className={Styles['modal-container']}>
            <div className={Styles['modal-wrapper']}>
                <div className={Styles['modal-block']}>
                    <div style={{ display: 'flex', justifyContent: 'end', alignItems: 'center' }}>
                        <IoClose className={Styles['modal-cross']} color='white' onClick={handleClose} />
                    </div>

                    <div className={Styles['modal-text']}>
                        <h1>Log Out</h1>
                        <p>Are you sure you want to logout?</p>
                    </div>
                    <div className={Styles["modal-btn"]}>
                        <button className={Styles['modal-cancel-btn']} >No. Return to Home</button>
                        <button className={Styles['modal-logout-btn']} >Log Out</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default LogOutModal
