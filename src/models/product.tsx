import { Products } from "types/e-commerce";

export class ProductC implements Products {
    id: string | number | undefined;
    image: string;
    name: string;
    brand: string;
    offer?: string;
    description?: string;
    about?: string;
    quantity?: number;
    rating?: number;
    discount?: number;
    salePrice?: number;
    offerPrice?: number;
    gender?: string;
    categories?: string[];
    colors?: string[];
    popularity?: number;
    date?: number;
    created: Date;
    isStock?: boolean;
    new?: number;
    productName?: string;
    productDescription?: string;
    category?: string;
    price?: number;
    status?: string;

    constructor(data: Partial<Products> = {}) {
        this.id = data.id;
        this.image = data.image || '';
        this.name = data.name || '';
        this.brand = data.brand || '';
        this.offer = data.offer || '';
        this.description = data.description || '';
        this.about = data.about || '';
        this.quantity = data.quantity || 0;
        this.rating = data.rating || 0;
        this.discount = data.discount || 0;
        this.salePrice = data.salePrice || 0;
        this.offerPrice = data.offerPrice || 0;
        this.gender = data.gender || '';
        this.categories = data.categories || [];
        this.colors = data.colors || [];
        this.popularity = data.popularity || 0;
        this.date = data.date || 0;
        this.created = data.created || new Date();
        this.isStock = data.isStock || false;
        this.new = data.new || 0;
        this.productName = data.productName || '';
        this.productDescription = data.productDescription || '';
        this.category = data.category || '';
        this.price = data.price || 0;
        this.status = data.status || '';
    }
}
