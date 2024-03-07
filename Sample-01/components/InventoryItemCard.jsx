'use client';

import {
    Button,
    Card,
    CardHeader,
    CardBody,
    CardFooter,
    Typography,
    Rating
} from "./MaterialTailwind";
import { ShoppingCartContext } from "@/context/ShoppingCartContext";
import { InventoryItem } from "@/model/Models";
import Image from "next/image";
import { useContext } from "react";



export const InventoryItemCard = (props) => {

    const { addToCart/*, cartItems*/ } = useContext(ShoppingCartContext);

    // if current product is in cartItems, get the quantity
    // const productQuantity = React.useMemo(() => cartItems.find((i) => i.id === props.item.id)?.quantity || 0, [cartItems, props.item.id]);

    const { item } = props;

    return (
        <Card>
            <CardHeader shadow={false} floated={false} className="h-60">
                <Image
                    src={item.imageUrl}
                    alt="card-image"
                    className="h-full w-full object-cover"
                    width={140}
                    height={240}
                />
            </CardHeader>
            <CardBody>
                <Typography color="blue-gray" className="font-medium">
                    {item.name}
                </Typography>
                <Typography color="blue-gray" className="font-semibold">
                    $ {item.price}
                </Typography>
                <Typography
                    variant="small"
                    color="gray"
                    className="font-normal opacity-75"
                >
                    {item.description}
                </Typography>
                <Rating value={item.rating} readonly className='mt-2' />
            </CardBody>
            <CardFooter className="pt-0">
                <Button
                    data-autoid={`btn-addToCart-${item.id}`}
                    ripple={false}
                    fullWidth={true}
                    className="bg-blue-gray-900/10 text-blue-gray-900 shadow-none hover:scale-105 hover:shadow-none focus:scale-105 focus:shadow-none active:scale-100"
                    onClick={() => addToCart(item)}
                >
                    Add to Cart
                </Button>
            </CardFooter>
        </Card>
    );
}