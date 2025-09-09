import React from "react";
import BudgetCategoryItem from "../components/BudgetCategoryItem";
import { useAppContext } from "../contexts/AppProvider";
import MoneyCard from "../components/MoneyCard";

function Budgets() {

  const { budgetUsage } = useAppContext();

  // Add a loading state for when budgetUsage is not yet available
  if (!budgetUsage || !budgetUsage.total || !budgetUsage.report || budgetUsage.report.length === 0) {
    return (
      <div className="text-center mt-20">
        <h2 className="text-2xl font-semibold text-gray-700">No Budgets Found</h2>
        <p className="text-gray-500 mt-2">Go to the "Set Budgets" page to create your first budget.</p>
      </div>
    );
  }

  return (
    <>
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
        <MoneyCard title={"Total Budget"} amount={budgetUsage.total.totalBudget} icon={"$"} style={"text-emerald-600"} />
        <MoneyCard title={"Total Spent"} amount={budgetUsage.total.totalSpent} icon={"-"} style={"text-red-600"} textColor="text-red-600" />
        <MoneyCard title={"Remaining"} textColor={budgetUsage.total.remaining >= 0 ? "text-emerald-500" : "text-red-500"}
          amount={budgetUsage.total.remaining} icon={"$"} style={"text-emerald-600"} />
      </div>

      <div className="my-12 grid grid-cols-1 gap-4">
        <h3 className="text-2xl font-semibold">Budget Categories</h3>
        {budgetUsage.report.map((item, index) => (
          <BudgetCategoryItem
            key={index}
            item={item}
          />
        ))}
      </div>
    </>
  );
}

export default Budgets;
