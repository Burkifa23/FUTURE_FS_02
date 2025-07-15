// Simple UUID generator (crypto.randomUUID if available, fallback)
function generateUUID() {
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
        return crypto.randomUUID();
    }
    return 'xxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

// Simple hash (for demo only, use bcrypt or similar in production)
function hashPassword(password: string): string {
    let hash = 0, i, chr;
    if (password.length === 0) return hash.toString();
    for (i = 0; i < password.length; i++) {
        chr   = password.charCodeAt(i);
        hash  = ((hash << 5) - hash) + chr;
        hash |= 0;
    }
    return hash.toString();
}
import { Product, Order } from './types';

const API_BASE = 'https://fakestoreapi.com';

export const api = {
    // Products
    async getProducts(): Promise<Product[]> {
        try {
            const response = await fetch(`${API_BASE}/products`);
            if (!response.ok) throw new Error('Failed to fetch products');
            return await response.json();
        } catch (error) {
            console.error('Error fetching products:', error);
            throw error;
        }
    },

    async getProduct(id: number): Promise<Product> {
        try {
            const response = await fetch(`${API_BASE}/products/${id}`);
            if (!response.ok) throw new Error('Failed to fetch product');
            return await response.json();
        } catch (error) {
            console.error('Error fetching product:', error);
            throw error;
        }
    },

    async getCategories(): Promise<string[]> {
        try {
            const response = await fetch(`${API_BASE}/products/categories`);
            if (!response.ok) throw new Error('Failed to fetch categories');
            return await response.json();
        } catch (error) {
            console.error('Error fetching categories:', error);
            throw error;
        }
    },

    async getProductsByCategory(category: string): Promise<Product[]> {
        try {
            const response = await fetch(`${API_BASE}/products/category/${category}`);
            if (!response.ok) throw new Error('Failed to fetch products by category');
            return await response.json();
        } catch (error) {
            console.error('Error fetching products by category:', error);
            throw error;
        }
    }
};

// Mock functions for features not available in FakeStore API
export const mockApi = {
    // Simulate user authentication
    async login(email: string, password: string): Promise<boolean> {
        await new Promise(resolve => setTimeout(resolve, 500));
        const users: User[] = JSON.parse(localStorage.getItem('users') || '[]');
        const hashed = hashPassword(password);
        const user = users.find((u: User) => u.email === email && u.password === hashed);
        if (user) {
            localStorage.setItem('currentUser', JSON.stringify({
                id: user.id,
                email: user.email,
                name: user.name
            }));
            return true;
        }
        return false;
    },

    async register(name: string, email: string, password: string): Promise<boolean> {
        await new Promise(resolve => setTimeout(resolve, 500));
        // Input validation
        if (
            typeof name !== 'string' || name.trim() === '' ||
            typeof email !== 'string' || email.trim() === '' ||
            !/^\S+@\S+\.\S+$/.test(email) ||
            typeof password !== 'string' || password.length < 6
        ) {
            return false;
        }
        const users: User[] = JSON.parse(localStorage.getItem('users') || '[]');
        if (users.find((u: User) => u.email === email)) {
            return false;
        }
        const newUser: User = {
            id: generateUUID(),
            name,
            email,
            password: hashPassword(password)
        };
        users.push(newUser);
        localStorage.setItem('users', JSON.stringify(users));
        // Auto-login after registration
        localStorage.setItem('currentUser', JSON.stringify({
            id: newUser.id,
            email: newUser.email,
            name: newUser.name
        }));
        return true;
    },

    getCurrentUser() {
        try {
            const user = localStorage.getItem('currentUser');
            return user ? JSON.parse(user) : null;
        } catch (error) {
            console.error('Error accessing currentUser from localStorage:', error);
            return null;
        }
    },

    logout() {
        localStorage.removeItem('currentUser');
    },

    // Orders
    async createOrder(orderData: Omit<Order, 'id' | 'createdAt'>): Promise<Order> {
        await new Promise(resolve => setTimeout(resolve, 500));
        try {
            const order: Order = {
                ...orderData,
                id: generateUUID(),
                createdAt: new Date().toISOString()
            };
            const orders = JSON.parse(localStorage.getItem('orders') || '[]');
            orders.push(order);
            localStorage.setItem('orders', JSON.stringify(orders));
            return order;
        } catch (error) {
            console.error('Error creating order:', error);
            throw error;
        }
    },

    async getUserOrders(userId: string): Promise<Order[]> {
        await new Promise(resolve => setTimeout(resolve, 300));

        const orders = JSON.parse(localStorage.getItem('orders') || '[]');
        return orders.filter((order: Order) => order.userId === userId);
    }
};