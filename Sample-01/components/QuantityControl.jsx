import { useContext } from 'react';
import { IconButton } from './MaterialTailwind';
import { ShoppingCartContext } from '../context/ShoppingCartContext';
import { InventoryItem } from '../model/Models';



const QuantityControl = ({ item, readOnly = false }) => {
    const { decreaseQuantity, updateQuantity, removeFromCart } = useContext(ShoppingCartContext);

    const decreaseProductQuantity = () => {
        if (item.quantity === 1) {
            removeFromCart(item)
        }
        decreaseQuantity(item)
    };

    const increaseQuantity = () => {
        updateQuantity(item, item.quantity ? item.quantity + 1 : 1);
    };

    return (
        <div className="flex items-center space-x-4">
            <IconButton
                variant='outlined'
                // className="bg-gray-300 text-gray-600 font-semibold"
                size='sm'
                onClick={decreaseProductQuantity}
                disabled={readOnly}
            >
                ➖
            </IconButton>
            <input
                className="w-16 text-center text-gray-700 border border-gray-300 rounded-md focus:outline-none"
                type="number"
                value={item.quantity}
                readOnly                
            />
            <IconButton
                variant='outlined'
                size='sm'
                onClick={increaseQuantity}
                disabled={readOnly}
            >
                ➕
            </IconButton>
        </div>
    );
};

export default QuantityControl;

