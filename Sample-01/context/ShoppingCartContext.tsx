"use client";

import React, { createContext, useState, useMemo, ReactNode, useEffect } from 'react';
import { InventoryItem } from '@/model/Models';
// import { v4 as uuidv4 } from 'uuid';
// import { useHttp } from './useFetch';
// import { User } from '@auth0/auth0-react';

// Define the ShoppingCartContextValue interface
interface ShoppingCartContextValue {
  cartItems: InventoryItem[];
  cartTotalEx: number;
  cartTotalTax: number;
  cartTotalInc: number;
  TAX_RATE: number;
  addToCart: (item: InventoryItem) => void;
  clearCart: () => void;
  decreaseQuantity: (item: InventoryItem) => void;
  getTotalItems: () => number;
  removeFromCart: (item: InventoryItem) => void;
  updateQuantity: (item: InventoryItem, quantity: number) => void;
  // postSalesOrder: (user: User, viaAPI?: boolean) => Promise<SalesOrder>;
  truncate: (n: number) => number
}

const defaultContext: ShoppingCartContextValue = {
  cartItems: [],
  cartTotalEx: 0,
  cartTotalTax: 0,
  cartTotalInc: 0,
  TAX_RATE: 10,
  addToCart: () => undefined,
  clearCart: () => {},
  decreaseQuantity: () => {},
  getTotalItems: () => 0,
  removeFromCart: () => {},
  updateQuantity: () => {},
  // postSalesOrder: () => new Promise<SalesOrder>(() => {}),
  truncate: () => 0
}

// Create the context
export const ShoppingCartContext = createContext<ShoppingCartContextValue>(defaultContext);

interface ShoppingCartProviderProps {
  children: ReactNode;
}

export const ShoppingCartProvider: React.FC<ShoppingCartProviderProps> = ({ children }) => {
  // State
  const [cartItems, setCartItems] = useState<InventoryItem[]>([]);

  // Hooks
  // const { post} = useHttp();

  //Effect that reads from local storage and sets the cart items the first time the app loads
  useEffect(() => {
    
    const cartItems = localStorage.getItem('cartItems');
    if (cartItems) {
      setCartItems(JSON.parse(cartItems));
    }
  }, []);

  const syncCartToStorage = (cartItems: InventoryItem[]) => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }


  const TAX_RATE: number = 10;
  // const TAX_AMOUNT: number = cartTotalEx * (TAX_RATE / 100);

  // Function to add an item to the shopping cart
  const addToCart = (item: InventoryItem) => {
    // check if cart already has the item, if so, update the quantity
    const existingItem = cartItems.find((i) => i.id === item.id);
    if (existingItem) {
      setCartItems((prevCartItems) => {

        const updatedCartItems = prevCartItems.map((i) =>
          i.id === item.id ? { ...existingItem, quantity: (existingItem.quantity || 0) + 1 } : i
        )

        syncCartToStorage(updatedCartItems);
        return updatedCartItems
      });

      return;
    }

    setCartItems((prevCartItems) => {
      const updatedCartItems = [...prevCartItems, { ...item, quantity: 1 }];
      syncCartToStorage(updatedCartItems);
      return updatedCartItems;
    });
  };

  // Function to remove an item from the shopping cart
  const removeFromCart = (item: InventoryItem) => {
    setCartItems((prevCartItems) => {
      const updatedCartItems = prevCartItems.filter((i) => i.id !== item.id)
      syncCartToStorage(updatedCartItems);
      return updatedCartItems;
    }
    );
  };

  // Function to decrease the quantity of an item in the shopping cart by 1
  const decreaseQuantity = (item: InventoryItem) => {
    // check if cart already has the item, if so, update the quantity
    const existingItem = cartItems.find((i) => i.id === item.id);
    if (existingItem) {
      setCartItems((prevCartItems) => {
        const updatedCartItems =  prevCartItems.map((i) =>
            i.id === item.id ? { ...existingItem, quantity: (existingItem.quantity || 0) - 1 } : i
          )
        syncCartToStorage(updatedCartItems);
        return updatedCartItems;
      }
      );
      return;
    }
  };

  // Function to update the quantity of an item in the shopping cart by a given number
  const updateQuantity = (item: InventoryItem, quantity: number) => {
    // check if cart already has the item, if so, update the quantity
    const existingItem = cartItems.find((i) => i.id === item.id);
    if (existingItem) {
      setCartItems((prevCartItems) => {
        const updatedCartItems = prevCartItems.map((i) =>
          i.id === item.id ? { ...existingItem, quantity: quantity } : i
        )
        syncCartToStorage(updatedCartItems);
        return updatedCartItems;
      }
      );
      return;
    }
  };

  // Function to clear the shopping cart
  const clearCart = () => {
    setCartItems([]);
    syncCartToStorage([]);
  };

  // Function to calculate the total number of items in the cart
  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + (item.quantity || 0), 0);
  };

  // Function to calculate the total price of items in the cart
  const cartTotalEx = useMemo(() => {
    const value = cartItems.reduce(
      (total, line) => total + line.price * (line.quantity || 0),
      0
    );
    return value;
  }, [cartItems]);

  const cartTotalTax = useMemo(() => {
    return cartTotalEx * (TAX_RATE / 100);
  }, [cartTotalEx]);

  const cartTotalInc = useMemo(() => {
    return cartTotalEx + cartTotalTax;
  }, [cartTotalEx, cartTotalTax]);

  const truncate = (n: number) => {
    return Math.round(n * 100) / 100;
  }

//   const postSalesOrder = async (user: User, viaAPI = false): Promise<SalesOrder> => {

//     const so: SalesOrder = {
//         guid: '',
//         bsid: '',
//         customerBSID: '',
//         refNumber: '',
//         transDate: '',
//         totalInc: 0,
//         totalTax: 0,
//         lines: []
//     }

//     const segments = user.sub?.split("|") || [];
//     const subKey = segments.pop();

//     let username = user ? user['preferred_username'] : '';
//     username = username?.replace('-s', '');

//     let CUSTOMER_BSID = user ? username || user.email || subKey : '';

//     if (viaAPI) {
//       const nonSsoEmail = localStorage.getItem('nonSsoEmail');

//       if (nonSsoEmail) {
//         CUSTOMER_BSID = nonSsoEmail;
//       }
//     }

//     const date = new Date();
//     const refNumber = date.getDate() + '' + date.getHours() + '' + date.getMinutes() + '' + date.getSeconds();
//     const transDate = date.toISOString();
    
//     so.guid = uuidv4();
//     so.bsid = refNumber;
//     so.customerBSID = CUSTOMER_BSID || '';
//     so.refNumber = refNumber;
//     so.transDate = transDate;
//     so.lines = cartItems.map((item: InventoryItem, index: number) => {

//         const lineSubTotal = truncate(item.price * (item.quantity || 0));
//         const lineTax = truncate(lineSubTotal / TAX_RATE);

//         return {
//             code: `item-${index}-${refNumber}`,
//             lineTotalEx: lineSubTotal,
//             lineTotalInc: truncate(lineSubTotal + lineTax),
//             lineTotalTax: lineTax,
//             priceEx: item.price,                    
//             priceInc: truncate(item.price * (1 + (TAX_RATE / 100))),
//             quantity: (item.quantity || 0),
//             shortDescription: item.name,                    
//             taxRate: TAX_RATE,
//         }
//     });

//     // Calculate so.totalInc by reducing the lineTotalInc of each line
//     so.totalEx = truncate(so.lines.reduce((acc, line) => acc + line.lineTotalEx, 0));
//     so.totalTax = truncate(so.lines.reduce((acc, line) => acc + line.lineTotalTax, 0));
//     so.totalInc = truncate(so.lines.reduce((acc, line) => acc + line.lineTotalInc, 0));

//     return post(`salesorder`, so);
    
// }

  // Create the context value
  const contextValue = {
    cartItems,
    cartTotalEx,
    cartTotalTax,
    cartTotalInc,
    TAX_RATE,
    addToCart,
    clearCart,
    decreaseQuantity,
    getTotalItems,
    removeFromCart,
    updateQuantity,
    // postSalesOrder,
    truncate
  };

  // Provide the context value to the children components
  return (
    <ShoppingCartContext.Provider value={contextValue}>
      {children}
    </ShoppingCartContext.Provider>
  );
};