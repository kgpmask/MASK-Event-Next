import React from 'react'
import { useState } from 'react'
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

function LogOutModal({ showModal, profilePic, submitFunction }) {
    const handleClose = () => {
        console.log('close')
        showModal(false)
    }
    const [selected, setSelected] = useState(profilePic);

	function toggleSelect (value) {
        if (selected === value) setSelected(null);
		else setSelected(value);
	}

	async function submit () {
		await submitFunction({ profilePic: selected });
		showModal(false);
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
                                    src={pic != null ? `/profile-pics/${pic}.webp` : `/logo.webp`}
                                    className={ selected == pic ? Styles['selected'] : '' }
                                    onClick={() => toggleSelect(pic)}
                                />
                            ))
                        }
                    </div>
                </div>
                <div style={{ textAlign: 'center' }}><button className={Styles['edit-profilepic-btn']} onClick={submit}> Update </button></div>
            </div>
        </div>
    )
}

export default LogOutModal
