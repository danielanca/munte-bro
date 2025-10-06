// components/AdminArea/ShardsDesign/.../UserActions.tsx
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Nav, Dropdown } from "react-bootstrap";

// ✅ your auth hook (adjust path if needed)
import useAuth from "../../../../../../hooks/useAuth";

// ✅ Firebase
import { auth as fbAuth } from "../../../../../../../firebase";
import { signOut } from "firebase/auth";
import { getDownloadURL, ref } from "firebase/storage";
import { storage } from "../../../../../../../firebase"; // make sure your firebase file exports `storage`

export type UserActionsProps = {
  /** Fallback label if Firebase has neither displayName nor email */
  displayName?: string;
};

const UserActions: React.FC<UserActionsProps> = ({ displayName = "User" }) => {
  const [show, setShow] = React.useState(false);
  const [photoUrl, setPhotoUrl] = React.useState<string | null>(null);
  const navigate = useNavigate();

  const { auth } = useAuth() as any;
  const fbUser = auth?.user ?? null;

  const name =
    fbUser?.displayName ||
    fbUser?.email ||
    auth?.email || // legacy shape fallback
    displayName;

  // Resolve avatar strictly from Firebase:
  // 1) Auth user.photoURL
  // 2) Storage: users/{uid}/avatar.jpg (or .png)
  // 3) Storage fallback: avatars/default.jpg (or .png)
  React.useEffect(() => {
    let cancelled = false;

    async function resolveAvatar() {
      try {
        if (fbUser?.photoURL) {
          if (!cancelled) setPhotoUrl(fbUser.photoURL);
          return;
        }
        if (!fbUser?.uid) return;

        // Try per-user avatar
        const primaryRef = ref(storage, `users/${fbUser.uid}/avatar.jpg`);
        const primaryURL = await getDownloadURL(primaryRef);
        if (!cancelled) {
          setPhotoUrl(primaryURL);
          return;
        }
      } catch {
        // ignore and try default
      }

      try {
        const fallbackRef = ref(storage, "avatars/default.jpg");
        const fallbackURL = await getDownloadURL(fallbackRef);
        if (!cancelled) setPhotoUrl(fallbackURL);
      } catch {
        // If even default is missing, keep null (you can show initials or nothing)
        if (!cancelled) setPhotoUrl(null);
      }
    }

    resolveAvatar();
    return () => {
      cancelled = true;
    };
  }, [fbUser]);

  const handleLogout = async (e?: React.MouseEvent) => {
    e?.preventDefault();
    try {
      await signOut(fbAuth);
      navigate("/login", { replace: true });
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  return (
    <Dropdown
      as={Nav.Item}
      align="end"
      show={show}
      onToggle={(next) => setShow(!!next)}
      className="user-actions"
    >
      <Dropdown.Toggle
        as={Nav.Link}
        className="text-nowrap px-3 d-flex align-items-center"
        onClick={(e: React.MouseEvent) => {
          e.preventDefault();
          setShow((s) => !s);
        }}
      >
        {photoUrl ? (
          <img
            className="user-avatar rounded-circle mx-2"
            src={photoUrl}
            alt="User Avatar"
            width={32}
            height={32}
            style={{ objectFit: "cover" }}
          />
        ) : (
          // optional: tiny initials fallback (remove if you want ONLY Firebase-sourced images)
          <div
            className="rounded-circle bg-secondary text-white d-inline-flex align-items-center justify-content-center mx-2"
            style={{ width: 32, height: 32, fontSize: 12 }}
          >
            {name?.charAt(0)?.toUpperCase() ?? "U"}
          </div>
        )}
        <span role="button" className="d-none d-md-inline-block fw-bold">
          {name}
        </span>
      </Dropdown.Toggle>

      <Dropdown.Menu className="dropdown-menu-small">
        <Dropdown.Item as={Link} to="/login" className="text-danger" onClick={handleLogout}>
          <i className="material-icons me-2 text-danger">&#xE879;</i> Logout
        </Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default UserActions;
