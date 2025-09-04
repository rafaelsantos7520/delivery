
import { Product as PrismaProduct, ProductVariation, ProductComplement, Complement, ComplementType, Category as PrismaCategory } from '@prisma/client';

export type Category = PrismaCategory;

export type Product = PrismaProduct & {
  variations: ProductVariation[];
  complements: (ProductComplement & {
    complement: Complement;
  })[];
  categoryRelation: Category | null;
};

export type SelectedComplement = {
  complementId: string;
  name: string;
  price: number;
  type: ComplementType;
};
