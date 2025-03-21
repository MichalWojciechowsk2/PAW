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

  static getLoggedInUser() {
    if (typeof window === "undefined") return null;

    const loggedInUser = this.mockUsers.find((user) => user.role === "Admin");

    if (loggedInUser) {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(loggedInUser));
    }

    return loggedInUser || null;
  }

  static setLoggedInUser(user: {
    id: string;
    name: string;
    surname: string;
    role: string;
  }) {
    if (typeof window !== "undefined") {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(user));
    }
  }

  static getAllUsers() {
    return this.mockUsers;
  }
}

const adminUser = {
  id: "11052001",
  name: "Michał",
  surname: "Wojciechowski",
  role: "Admin",
};

const developerUser = {
  id: "11052002",
  name: "Jan",
  surname: "Kowalski",
  role: "Developer",
};

const devopsUser = {
  id: "11052003",
  name: "Anna",
  surname: "Nowak",
  role: "DevOps",
};

UserMenager.setLoggedInUser(adminUser);

const users = UserMenager.getAllUsers();
console.log(users);
