import { z } from 'zod';

export const votoSchema = z.object({
    tipo: z.enum(['up', 'down'], 'Tiene que ser "up" o "down"')
}, 'El body tiene que ser un objeto JSON');

export type VotoInput = z.infer<typeof votoSchema>;
