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
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));

        // Mock validation (in real app, this would be server-side)
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const user = users.find((u: any) => u.email === email && u.password === password);

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

        const users = JSON.parse(localStorage.getItem('users') || '[]');

        // Check if user already exists
        if (users.find((u: any) => u.email === email)) {
            return false;
        }

        // Add new user
        const newUser = {
            id: Date.now().toString(),
            name,
            email,
            password
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
        const user = localStorage.getItem('currentUser');
        return user ? JSON.parse(user) : null;
    },

    logout() {
        localStorage.removeItem('currentUser');
    },

    // Orders
    async createOrder(orderData: Omit<Order, 'id' | 'createdAt'>): Promise<Order> {
        await new Promise(resolve => setTimeout(resolve, 500));

        const order: Order = {
            ...orderData,
            id: Date.now().toString(),
            createdAt: new Date().toISOString()
        };

        const orders = JSON.parse(localStorage.getItem('orders') || '[]');
        orders.push(order);
        localStorage.setItem('orders', JSON.stringify(orders));

        return order;
    },

    async getUserOrders(userId: string): Promise<Order[]> {
        await new Promise(resolve => setTimeout(resolve, 300));

        const orders = JSON.parse(localStorage.getItem('orders') || '[]');
        return orders.filter((order: Order) => order.userId === userId);
    }
};