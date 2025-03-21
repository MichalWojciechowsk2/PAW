import { UserMenager } from "@/services/UserMenager";

export default function UserProfile() {
  const user = UserMenager.getLoggedInUser();

  if (!user) {
    return <div>No user logged in</div>;
  }
  return (
    <div className="user-profile">
      <p>
        {user.name} {user.surname}
      </p>
    </div>
  );
}
