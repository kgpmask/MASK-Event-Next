import React from 'react'
import Styles from '@/styles/Profile.module.css'
// import Image from @next/image
import next from 'next'
import { IoClose } from "react-icons/io5";

function LogOutModal({ showModal }) {
    const handleClose = () => {
        console.log('close')
        showModal(false)
    }
    return (
        <div className={Styles['modal-container']}>
            <div className={Styles['modal-wrapper']}>
                <div className={Styles['modal-block']}>
                    <div > <IoClose className={Styles['modal-cross']} color='black' handleClick={handleClose} /></div>
                    <h1>Are you sure you want to logout?</h1>
                    <div className={Styles['modal-btns']}>
                        <button className={Styles['modal-logout-btn']} handleClick={handleClose} >Yes</button>
                        <button className={Styles['modal-cancel-btn']}>Cancel</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default LogOutModal
