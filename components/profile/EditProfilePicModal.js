import React from 'react'
import Styles from '@/styles/Profile.module.css'
// import Image from @next/image
import next from 'next'
import { IoClose } from "react-icons/io5";

const profilePictures = [
    null,
    'bankai',
    'eggy-sensei',
    'poke-ball',
    'straw-hat',
    'dragon-ball',
    'itachi-mangekyou',
    'rimuru-slime'
]

function LogOutModal({ showModal }) {
    const handleClose = () => {
        console.log('close')
        showModal(false)
    }
    return (
        <div className={Styles['modal-container']}>
            <div className={Styles['modal-wrapper']}>
                <div className={Styles['modal-block']}>
                    <div style={{ display: 'flex', justifyContent: 'end', alignItems: 'center' }}>
                        <IoClose className={Styles['modal-cross']} color='white' onClick={handleClose} />
                    </div>
                    <div className={Styles["profile-pics-array"]}>
                        {
                            profilePictures.map(pic => (
                                <img
                                    key={pic}
                                    src={pic ? `/profile-pics/${pic}.webp` : `/logo.webp`}
                                    onClick={() => toggleSelect(pic)}
                                />
                            ))
                        }
                    </div>
                </div>
                <div style={{textAlign:'center'}}><button className={Styles['edit-profilepic-btn']} > Update </button></div>
            </div>
        </div>
    )
}

export default LogOutModal
