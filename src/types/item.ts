export type Item = {
  id?: number;
  code: string;
  name: string;
  price: number;

  categoryId?: number;
  categories?: Category;
};

export type Category = {
  id: number;
  name: string;
  code: string;
};
