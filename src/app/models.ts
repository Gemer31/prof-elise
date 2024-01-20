export interface Product {
    id: string;
    name: string;
    price: string;
    image: string;
    navigationPage: string;
    category: Category;
}

export interface CommonProps {
    children: React.ReactNode,
    styleClass?: string;
}

export interface Category {
    id: string;
    name: string;
    image: string;
    navigationPage: string;
    categories?: Category[];
}