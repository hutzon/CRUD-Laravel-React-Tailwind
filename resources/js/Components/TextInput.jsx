import { forwardRef, useEffect } from "react";

export default forwardRef(function TextInput(
    { type = "text", className = "", isFocused = false, ...props },
    ref
) {
    useEffect(() => {
        if (isFocused && ref?.current) {
            ref.current.focus();
        }
    }, [isFocused, ref]);

    return (
        <input
            {...props}
            type={type}
            className={
                "border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm " +
                className
            }
            ref={ref}
        />
    );
});
