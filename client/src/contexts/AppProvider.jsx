import React, { createContext, useEffect, useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';

const AppContext = createContext();

axios.defaults.baseURL = import.meta.env.VITE_API_URL;
axios.defaults.withCredentials = true;

const defaultExpenseCategories = [
    'Food & Dining',
    'Transportation',
    'Shopping',
    'Entertainment',
    'Bills & Utilities',
    'Healthcare',
    'Travel',
    'Other',
];


function AppProvider({ children }) {
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState('');
    const [search, setSearch] = useState('');
    const [budgets, setBudgets] = useState([]);
    const [statistic, setStatistic] = useState('');
    const [yearData, setYearData] = useState([]);
    const [budgetUsage, setBudgetUsage] = useState([]);
    const [transactions, setTransactions] = useState([]);
    const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

    const [expenseCategory, setExpenseCategory] = useState(defaultExpenseCategories);

    const navigate = useNavigate();

    const toggleTheme = () => {
        setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
    };

    useEffect(() => {
        const root = window.document.documentElement;
        root.classList.remove('light', 'dark');
        root.classList.add(theme);
        localStorage.setItem('theme', theme);
    }, [theme]);


    // ---------- Auth ----------
    const register = async (formData) => {
        try {
            const { data } = await axios.post('/api/auth/register', formData);
            setUser(data);
            toast.success('Registered successfully');
            navigate('/');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Registration failed');
        }
    };

    const login = async (formData) => {
        try {
            const { data } = await axios.post('/api/auth/login', formData);
            setUser(data);
            toast.success('Logged in successfully');
            navigate('/');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Login failed');
        }
    };

    const logout = async () => {
        try {
            const { data } = await axios.post('/api/auth/logout');
            setUser(null);
            toast.success(data?.message);
            navigate('/login');
        } catch (err) {
            toast.error(err.response.data.message);
        }
    };

    const loadUser = async () => {
        try {
            const res = await axios.get('/api/auth/me');
            setUser(res.data);
            navigate('/');
        } catch {
            setUser(null);
            navigate('/login');
        }
    };

    // ---------- Transactions ----------
    const addTransaction = async (transaction) => {
        try {
            await axios.post('/api/transactions', transaction);
            await fetchMonthlySummary();
            await getTransactions();
            toast.success('Transaction added');
        } catch {
            toast.error('Add transaction failed');
        }
    };

    const getTransactions = async () => {
        try {
            const { data } = await axios.get('/api/transactions');
            setTransactions(data);
        } catch {
            return [];
        }
    };


    const deleteTransaction = async (id) => {
        if (window.confirm("Are you sure you want to delete this transaction?")) {
            try {
                await axios.delete(`/api/transactions/${id}`);
                await getTransactions(); // Re-fetch transactions after deleting
                toast.success('Transaction deleted');
            } catch {
                toast.error('Delete transaction failed');
            }
        }
    };

    const fetchMonthlySummary = async () => {
        try {
            const now = new Date();
            const year = now.getFullYear();
            const month = now.getMonth() + 1;
            const { data } = await axios.get(`/api/transactions/summary/${year}/${month}`);
            setStatistic(data);
        } catch (error) {
            return null;
        }
    };

    const fetchSummary = async () => {
        try {
            const { data } = await axios.get('/api/transactions/monthly-summary');
            setYearData(data);
        } catch {
            return null;
        }
    };

    // ---------- Budgets ----------
    const addBudget = async (budget) => {
        try {
            await axios.post('/api/budgets', budget);
            toast.success('Budget added');
        } catch {
            toast.error('Add budget failed');
        }
    };

    const getBudgets = async () => {
        try {
            const { data } = await axios.get('/api/budgets');
            setBudgets(data || []);

            if (data) {
                const used = data.map((item) => item.category);
                const available = defaultExpenseCategories.filter((cat) => !used.includes(cat));
                setExpenseCategory(available);
            }
        } catch {
            return null;
        }
    };


    const updateBudget = async (id, updates) => {
        try {
            await axios.put(`/api/budgets/${id}`, updates);
            await getBudgets();
            toast.success('Budget updated');
        } catch {
            toast.error('Update budget failed');
        }
    };

    const deleteBudget = async (id) => {
        if (window.confirm("Are you sure you want to delete this budget?")) {
            try {
                await axios.delete(`/api/budgets/${id}`);
                await getBudgets();
                toast.success('Budget deleted');
            } catch {
                toast.error('Delete budget failed');
            }
        }
    };

    const getBudgetUsage = async () => {
        try {
            const { data } = await axios.get('/api/budgets/status');
            setBudgetUsage(data);
        } catch {
            return null;
        }
    };

    useEffect(() => {
        loadUser()
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            try {
                //setLoading(true);
                await getBudgets()
                await fetchMonthlySummary()
                await fetchSummary()
                await getBudgetUsage()
                await getTransactions()
                setLoading(false)
            } catch (error) {
                //setLoading(false);
                return null;
            }
        }

        fetchData();
    }, [user])

    return (
        <AppContext.Provider
            value={{
                user,
                navigate,
                yearData,
                setUser,
                register,
                login,
                loading,
                logout,
                statistic,
                addTransaction,
                getTransactions,
                deleteTransaction,
                addBudget,
                budgets,
                expenseCategory,
                getBudgets,
                updateBudget,
                deleteBudget,
                budgetUsage,
                getBudgetUsage,
                transactions,
                search,
                setSearch,
                theme,
                toggleTheme
            }}
        >
            {children}
        </AppContext.Provider>
    );
}

export default AppProvider;
export const useAppContext = () => useContext(AppContext);
