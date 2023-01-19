import React, { useRef, useEffect } from "react";

function useOutsideAlerter(ref, setShow) {
  useEffect(() => {
    /**
     * Alert if clicked on outside of element
     */
    function handleClickOutside(event) {
      if (ref.current && !ref.current.contains(event.target)) {
        // alert("You clicked outside of me!");
        setShow(false);
      }
    }
    // Bind the event listener
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref]);
}

export default function Modal({ isOpen, onClose, children }) {
  const wrapperRef = useRef(null);
  useOutsideAlerter(wrapperRef, onClose);

  return (
    <>
      {isOpen ? (
        <div className=" fixed top-0 left-0 bg-slate-400 bg-opacity-50 w-full h-screen">
          <div
            ref={wrapperRef}
            className=" fixed w-auto top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 shadow-xl py-3 px-5 rounded-md bg-gray-50 opacity-100"
          >
            {children}
          </div>
        </div>
      ) : (
        <></>
      )}
    </>
  );
}
