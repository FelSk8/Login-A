export interface ProductI {
    id: number;
    codBarra: string;
    name: string;
    marca: string;
    stock: number;
    venta: number;
    price: number;
    createAt: Date;
    updateAt: Date;
    categories: CategoryI[];
}

export interface CategoryI  {
    id: number;
    codBarra: string;
    name: string;
    marca: string;
    stock: number;
    venta: number;
    price: number;
    createAt: Date;
    updateAt: Date;

}
