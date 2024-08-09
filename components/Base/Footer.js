import Styles from '@/styles/Footer.module.css'
import { SocialIcon } from 'react-social-icons'

function Footer() {
    const footerLinks = [
        {
            name: 'YouTube',
            href: 'https://www.youtube.com/@maskiitkgp',
            network: 'youtube'
        },
        {
            name: 'Instagram',
            href: 'https://www.instagram.com/maskiitkgp',
            network: 'instagram'
        },
        {
            name: 'Facebook',
            href: 'https://www.facebook.com/maskiitkgp',
            network: 'facebook'
        },
        {
            name: 'Gmail',
            href: 'mailto:kgpmask@gmail.com',
            network: 'email'
        },
        {
            name: 'GitHub',
            href: 'https://github.com/kgpmask/MASK',
            network: 'github'
        }
    ];
    return (
        <div className={Styles["container"]}>
            <div className={Styles["content"]}>
                <div className={Styles["about"]}>
                    <p>Manga and Anime Society Kharagpur | All rights reserved.</p>
                </div>
                <div className={Styles["socials"]}>
                    {footerLinks.map((item, index) =>
                        <SocialIcon key={index} network={item.network} style={{ height: 40, width: 40, padding: 2 }} href={item.href} />
                    )}
                </div>
            </div>
        </div>
    )
}

export default Footer