import React from 'react'
import Styles from '@/styles/Profile.module.css'
import { IoClose } from "react-icons/io5";
import { useRouter } from 'next/router';
import axios from 'axios';

function LogOutModal({ showModal }) {
    const router = useRouter();
    const handleClose = () => {
        // console.log('close')
        showModal(false)
    }
    const handleBackHome = () => {
        // console.log('close')
        showModal(false)
        router.push('/')
    }

	const handleLogout = async () => {
		try{
			const response = await axios.post('/api/logout');
			showModal(false);
			router.push('/');
		} catch (e) {
			console.log(e);
			alert('Server Error');
		}
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
                        <button className={Styles['modal-cancel-btn']} onClick={handleBackHome} >No. Return to Home</button>
                        <button className={Styles['modal-logout-btn']} onClick={handleLogout} >Log Out</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default LogOutModal
