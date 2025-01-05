import { z } from 'zod';

export const CreateUserSchema = z
  .object({
    firstName: z.string(),
    lastName: z.string(),
    email: z.string(),
    password: z.string(),
    playlists: z.array(z.string()),
  })
  .required();

export const UpdateUserSchema = z
  .object({
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    email: z.string().optional(),
    password: z.string().optional(),
    playlists: z.array(z.string()).optional(),
  })
  .partial();

export type CreateUserDto = z.infer<typeof CreateUserSchema>;
export type UpdateUserDto = z.infer<typeof UpdateUserSchema>;
