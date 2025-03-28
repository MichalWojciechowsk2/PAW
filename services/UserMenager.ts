import { User } from "../types/user";

export class UserMenager {
  private static STORAGE_KEY = "user";

  private static mockUsers = [
    {
      id: "11052001",
      name: "Michał",
      surname: "Wojciechowski",
      role: "Admin",
    },
    {
      id: "11052002",
      name: "Jan",
      surname: "Kowalski",
      role: "Developer",
    },
    {
      id: "11052003",
      name: "Anna",
      surname: "Nowak",
      role: "DevOps",
    },
  ];

  static setLoggedInUser(userId: string) {
    if (typeof window !== "undefined") {
      const user = this.mockUsers.find((u) => u.id === userId);
      if (user) localStorage.setItem(this.STORAGE_KEY, JSON.stringify(user));
      else console.warn("User not found!");
    }
  }

  static getLoggedInUser(): User | null {
    if (typeof window === "undefined") return null;
    const userData = localStorage.getItem(this.STORAGE_KEY);
    return userData ? JSON.parse(userData) : null;
  }

  static getAllUsers() {
    return JSON.stringify(this.mockUsers);
  }
}
UserMenager.setLoggedInUser("11052001");

console.log(`List of all created users: ${UserMenager.getAllUsers()}`);
console.log(`Current logged in user: ${UserMenager.getLoggedInUser()}`);
