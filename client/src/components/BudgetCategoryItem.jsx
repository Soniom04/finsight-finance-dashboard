import React from "react";

const BudgetCategoryItem = ({ item }) => {
  console.log(item)

  const getPercentageColor = () => {
    if (100 - item.percentLeft > 100) return "text-red-500";
    if (100 - item.percentLeft >= 90) return "text-yellow-500";
    return "text-emerald-500";
  };

  const getProgressBarColor = () => {
    if (100 - item.percentLeft > 100) return "bg-red-500";
    if (100 - item.percentLeft >= 90) return "bg-yellow-500";
    return "bg-emerald-500";
  }


  return (
    <div className="px-4 py-5 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-900">
      <div className="flex items-center mb-1 justify-between gap-4 space-y-2">
        <div>
          <div>
            <div className="font-semibold text-lg dark:text-white">{item.category}</div>
            <div className="text-gray-600 dark:text-gray-300">
              Rs.{item.spent.toFixed(2)} of Rs.{item.allocated.toFixed(2)}
            </div>
          </div>
        </div>

        <div className="flex flex-col items-end">
          <div className={`${getPercentageColor()} font-semibold`}>
            {item.percentLeft}%
          </div>
          <div className="text-sm">
            {item.remaining >= 0 ? (
              <span className="text-emerald-600 dark:text-emerald-500">Rs.{item.remaining} left</span>
            ) : (
              <span className="text-red-500">
                Over budget by Rs.{Math.abs(item.remaining)}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded mb-1">

        <div
          className={`h-full rounded ${getProgressBarColor()}`}
          style={{ width: `${100 - parseFloat(item.percentLeft)}%` }}
        />
      </div>

    </div>
  );
};

export default BudgetCategoryItem;
