import React from 'react'
import Styles from '@/styles/Profile.module.css'
// import Image from @next/image
import next from 'next'
import { IoClose } from "react-icons/io5";
import { FaCamera } from 'react-icons/fa';
import LogOutModal from '../components/profile/LogOutModal';
import ProfilePicModal from '../components/profile/EditProfilePicModal';


function Profile() {
    const [showLogOutModal, setShowLogOutModal] = React.useState(false)
    const [showProfilePicModal, setShowProfilePicModal] = React.useState(false)
    const [profilePic, setProfilePic] = React.useState('/logo.webp')
    const handleClose = () => {
        console.log('close')
    }
    const handleLogout = () => {
        // console.log('logout')
        setShowLogOutModal(true)
    }
    const handleProfilePicModal = () => {
        // console.log('profile pic change')
        setShowProfilePicModal(true)
    }
    return (
        <div className={Styles['container']}>
            <div className={Styles["wrapper"]}>
                <div style={{ borderRadius: '10px' }}>
                    <div className={Styles["block"]}>
                        <IoClose className={Styles["cross"]} color='white' onClick={handleClose} />
                        <img src={profilePic} alt='MASK' />
                    </div>
                    <div className={Styles['profile-img-wrapper']} onClick={handleProfilePicModal} >
                        <img src={profilePic} alt='MASK' className={Styles['profile-img']} />
                        <FaCamera className={Styles['camera-icon']} />
                    </div>
                </div>
                <div className={Styles["bottom-content"]}>
                    <div className={Styles["profile-info"]}>
                        <h1>{'Goose'}</h1>
                        <span>{'Goose-of-war'}</span>
                    </div>
                    <button onClick={handleLogout} className={Styles['logout-btn']} >LogOut</button>
                </div>
            </div>
            {showLogOutModal && <LogOutModal showModal={setShowLogOutModal} />}
            {showProfilePicModal && <ProfilePicModal showModal={setShowProfilePicModal} profilePicChange={setProfilePic}/>}
        </div >
    )
}

export default Profile
