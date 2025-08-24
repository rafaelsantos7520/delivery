
import { Product as PrismaProduct, ProductVariation, ProductComplement, Complement, ComplementType } from '@prisma/client';

export type Product = PrismaProduct & {
  variations: ProductVariation[];
  complements: (ProductComplement & {
    complement: Complement;
  })[];
};

export type SelectedComplement = {
  complementId: string;
  name: string;
  price: number;
  type: ComplementType;
};
