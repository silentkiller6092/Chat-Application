import React from "react";

const Input = React.forwardRef(({ label, ...props }, ref) => {
  return (
    <div>
      <div className="w-72 my-3">
        <input
          type="text"
          class="py-3 px-4 block w-full  rounded-lg text-sm focus:border-blue-500  disabled:opacity-50 disabled:pointer-events-none bg-slate-900 border-gray-700 text-gray-400 focus:ring-gray-600"
          placeholder={label}
          ref={ref}
          {...props}
        />
      </div>
    </div>
  );
});

export default Input;
