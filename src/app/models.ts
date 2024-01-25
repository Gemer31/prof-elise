export interface Product {
    id: string;
    name: string;
    price: number;
    image: string;
    categoryId: string;
}

export interface CommonProps {
    children: React.ReactNode,
    styleClass?: string;
}

export interface Category {
    id: string;
    name: string;
    image: string;
    categories?: Category[];
}