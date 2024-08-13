import React, { useEffect, useState, useMemo } from "react";
import Styles from "@/styles/Profile.module.css";
import { IoClose } from "react-icons/io5";
import { FaCamera } from "react-icons/fa";
import LogOutModal from "@/components/profile/LogOutModal";
import ProfilePicModal from "@/components/profile/EditProfilePicModal";
import { useRouter } from "next/router";
// import MessageCard from "@/components/live/utils/MessageCard";

function Profile() {
  const [showLogOutModal, setShowLogOutModal] = useState(false);
  const [showProfilePicModal, setShowProfilePicModal] = useState(false);
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [bufferName, setBufferName] = useState("");
  const [editName, setEditName] = useState(false);
  const [profilePic, setProfilePic] = useState("/default");
  const router = useRouter();

  // getting user data on page load
  useEffect(() => {
    async function fetchData() {
      const storedUser = localStorage.getItem("username");
      if (storedUser) {
        setUsername(localStorage.getItem("username"));
        setName(localStorage.getItem("name"));
        setProfilePic(localStorage.getItem("profilePic") || "/default");
      } else {
        return router.push("/login");
      }
    }
    fetchData();
  }, []);

  // name change when asked to edit
  useEffect(() => {
    if (editName) {
      setBufferName(name);
    }
  }, [editName]);

  // sending updated data to server
  async function submitFunction(ctx) {
    try {
      const response = await fetch("/api/update-profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          profilePic,
        }),
      });
      if (response.status >= 400) throw await response.text();
      console.log(await response.text());
      if (ctx.profilePic !== undefined) {
        setProfilePic(ctx.profilePic);
        localStorage.setItem("profilePic", ctx.profilePic);
      }
      // if (ctx.name !== undefined) setName(ctx.name);
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    }
  }

  const handleClose = () => {
    console.log("close");
  };

  const handleLogout = () => {
    setShowLogOutModal(true);
  };

  const handleProfilePicModal = () => {
    setShowProfilePicModal(true);
  };

  // if (!username) return <MessageCard message={'Fetching user information'} />;

  return (
    <div className={Styles["container"]}>
      <div className={Styles["wrapper"]}>
        <div style={{ borderRadius: "10px" }}>
          <div className={Styles["block"]}>
            {/* <IoClose className={Styles["cross"]} color='white' onClick={handleClose} /> */}
            <img src={`/profile-pics/${profilePic}.webp`} alt="MASK" />
          </div>
          <div
            className={Styles["profile-img-wrapper"]}
            onClick={handleProfilePicModal}
          >
            <img
              src={`/profile-pics/${profilePic}.webp`}
              alt="MASK"
              className={Styles["profile-img"]}
            />
            <FaCamera className={Styles["camera-icon"]} />
          </div>
        </div>
        <div className={Styles["bottom-content"]}>
          <div className={Styles["profile-info"]}>
            <div
              style={{
                display: "flex",
                gap: "10px",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <h1>{name}</h1>
              {/* {editName ?
                                <input
                                    value={bufferName}
                                    onChange={e => setBufferName(e.target.value.trim())}
                                    style={{ color: 'var(--black-100)', fontSize: '16px' }}
                                    className={Styles["name-input-box"]}
                                /> :
                                <h1>{name}</h1>
                            }
                            {editName ?
                                <><button className={Styles["save-name-btn"]} onClick={async () => {
                                    await submitFunction({ name: bufferName });
                                    setEditName(false);
                                }}> Save </button>
                                    <button className={Styles["back-name-btn"]} onClick={() => setEditName(false)}> Back </button></> :
                                <button className={Styles['edit-name-btn']} onClick={() => setEditName(true)}>Edit</button>
                            } */}
            </div>
            <span>{username}</span>
          </div>
          <button onClick={handleLogout} className={Styles["logout-btn"]}>
            LogOut
          </button>
        </div>
      </div>
      {showLogOutModal && <LogOutModal showModal={setShowLogOutModal} />}
      {showProfilePicModal && (
        <ProfilePicModal
          showModal={setShowProfilePicModal}
          profilePic={profilePic}
          submitFunction={submitFunction}
        />
      )}
    </div>
  );
}

export default Profile;
