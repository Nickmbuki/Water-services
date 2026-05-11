import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { z } from "zod";
import { publicUser, repository, type PublicUser, type Role } from "../db/repository.js";
import { env } from "../utils/env.js";
import { HttpError } from "../utils/http.js";

const tokenPayloadSchema = z.object({
  sub: z.string(),
  role: z.enum(["customer", "admin"])
});

export const registerInput = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(9),
  password: z.string().min(8)
});

export const loginInput = z.object({
  email: z.string().email(),
  password: z.string().min(1)
});

export type AuthResult = {
  token: string;
  user: PublicUser;
};

const signToken = (user: { id: string; role: Role }) =>
  jwt.sign({ sub: user.id, role: user.role }, env.jwtSecret, { expiresIn: "7d" });

export const authService = {
  async register(input: z.infer<typeof registerInput>): Promise<AuthResult> {
    const existing = await repository.findUserByEmail(input.email);
    if (existing) throw new HttpError(409, "An account with this email already exists");
    const passwordHash = await bcrypt.hash(input.password, 12);
    const user = await repository.createUser({
      name: input.name,
      email: input.email,
      phone: input.phone,
      passwordHash
    });
    return { token: signToken(user), user: publicUser(user) };
  },

  async login(input: z.infer<typeof loginInput>): Promise<AuthResult> {
    const user = await repository.findUserByEmail(input.email);
    if (!user) throw new HttpError(401, "Invalid email or password");
    const validPassword = await bcrypt.compare(input.password, user.passwordHash);
    if (!validPassword) throw new HttpError(401, "Invalid email or password");
    return { token: signToken(user), user: publicUser(user) };
  },

  async verify(token: string): Promise<PublicUser> {
    const payload = tokenPayloadSchema.parse(jwt.verify(token, env.jwtSecret));
    const user = await repository.findUserById(payload.sub);
    if (!user) throw new HttpError(401, "Invalid authentication token");
    return publicUser(user);
  }
};
