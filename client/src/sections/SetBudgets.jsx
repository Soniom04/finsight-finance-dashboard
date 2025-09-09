import React, { useState } from 'react';
import BudgetCardDisplay from '../components/BudgetCardDisplay';
import { useAppContext } from '../contexts/AppProvider';
import toast from 'react-hot-toast';

function SetBudgets() {
  const { addBudget, budgets, getBudgets, expenseCategory, getBudgetUsage } = useAppContext();
  const [category, setCategory] = useState('');
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false); // <-- Loading state

  const handleSubmit = async () => {
    if (!category || !amount) {
      toast.error('Please select a category and enter a budget.');
      return;
    }
    setLoading(true); // start loading
    try {
      await addBudget({
        category,
        amount
      });
      await getBudgets();
      await getBudgetUsage();
      setCategory('');
      setAmount('');
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false); // stop loading no matter what
    }
  };

  return (
    <div className='w-full'>
      <div className='rounded-xl bg-white py-6 px-6 border border-gray-200'>
        <h1 className='text-xl font-semibold mb-6'>
          <span className='text-indigo-500'>+</span> Set Monthly Budget
        </h1>

        <div className='grid grid-cols-1 lg:grid-cols-3 gap-5'>
          <div>
            <label htmlFor='category' className='block text-sm font-medium text-gray-700 mb-2.5'>
              Category
            </label>
            <select
              id='category'
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className='pl-3 py-2.5 border border-gray-300 w-full rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500'
              disabled={loading} // disable while loading
            >
              <option value=''>Select category...</option>
              {expenseCategory.map((item, index) => (
                <option key={index} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor='budget' className='block text-sm font-medium text-gray-700 mb-2.5'>
              Monthly Budget
            </label>
            <div className='relative'>
              <span className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-500'>Rs</span>
              <input
                id='budget'
                type='number'
                placeholder='0.00'
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className='pl-10 pr-3 py-2.5 border border-gray-300 w-full rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500'
                disabled={loading} // disable while loading
              />
            </div>
          </div>

          <div className='flex items-end'>
            <button
              onClick={handleSubmit}
              className='w-full bg-indigo-600 text-white font-semibold py-2.5 rounded-xl hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed'
              disabled={loading} // disable button while loading
            >
              {loading ? 'Loading...' : '+ Set Budget'}
            </button>
          </div>
        </div>
      </div>

      <div className='rounded-xl bg-white py-6 px-6 border border-gray-200 mt-12'>
        <h3 className='text-2xl font-semibold'>Monthly Budgets</h3>

        <div className='flex flex-col gap-4 mt-6'>
          {(Array.isArray(budgets) && budgets.length > 0) ? (
            budgets.map((item, index) => (
              <BudgetCardDisplay key={index} item={item} />
            ))
          ) : (
            <p className="text-center text-gray-500 py-4">You haven't set any budgets yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default SetBudgets;
