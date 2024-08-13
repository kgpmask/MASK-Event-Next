import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import styles from "@/styles/Admin.module.css";

export default function EditUserPage() {
  const router = useRouter();
  const { userId } = router.query;
  const [user, setUser] = useState(null);
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [profilePic, setProfilePic] = useState("");
  const [password, setPassword] = useState("");

  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      if (!userId) return;
      try {
        const response = await fetch(`/api/users/${userId}`);
        const userData = await response.json();
        setUser(userData);
        setName(userData.name);
        setUsername(userData.username);
        setProfilePic(userData.profilePic);
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };

    fetchUser();
  }, [userId]);

  const handleSave = async () => {
    try {
      const response = await fetch(`/api/update-profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          name,
          username,
          profilePic,
          password,
        }),
      });

      if (response.ok) {
        alert("User updated successfully.");
        router.push("/admin/list-users");
      } else {
        const errorMessage = await response.json();
        alert(`Failed to update user: ${errorMessage.message}`);
      }
    } catch (error) {
      console.error("Error updating user:", error);
      alert("An error occurred while updating the user.");
    }
  };

  //if (!isAdmin) return <ForbiddenCard />;

  if (!user) return <div>Loading...</div>;

  return (
    <div className={styles["edit-user"]}>
      <h1>Update User</h1>
      <p>
        You can update the user details here. This includes modifying personal
        details and the password if necessary.
      </p>
      <div className={styles["form-group"]}>
        <label htmlFor="name">Update name:</label>
        <div className={styles["input-container"]}>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
      </div>
      <div className={styles["form-group"]}>
        <label htmlFor="name">Update username:</label>
        <div className={styles["input-container"]}>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
      </div>

      <div className={styles["form-group"]}>
        <label htmlFor="password">
          Password (leave blank to keep current):
        </label>
        <div className={styles["input-container"]}>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
      </div>
      <button onClick={handleSave} className={styles["save-btn"]}>
        Update User
      </button>
    </div>
  );
}
