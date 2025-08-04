// In a real application, this would be a database connection and user model.
// For demonstration purposes, we'll use a simple in-memory array.

interface User {
  id: string;
  name: string;
  email: string;
  password: string; // In a real app, store hashed passwords
}

const users: User[] = [];
let nextId = 1;

export const addUser = (name: string, email: string, password: string): User => {
  const newUser: User = {
    id: String(nextId++),
    name,
    email,
    password, // Store hashed password in a real app
  };
  users.push(newUser);
  return newUser;
};

export const findUserByEmail = (email: string): User | undefined => {
  return users.find(user => user.email === email);
};

export const findUserById = (id: string): User | undefined => {
  return users.find(user => user.id === id);
};
