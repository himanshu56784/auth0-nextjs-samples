"use client";
import React, { useContext, useState } from "react";
import { Alert, Button, Card, Typography } from "@/components/MaterialTailwind";
import { ShoppingCartContext } from "@/context/ShoppingCartContext";
import Image from "next/image";
import QuantityControl from "@/components/QuantityControl";
import { useUser } from "@auth0/nextjs-auth0/client";
import { InventoryItem, SalesOrder, User } from "@/model/Models";
import { v4 as uuidv4 } from 'uuid';

const CartPage = () => {

    // Context
    const { cartItems, cartTotalEx, cartTotalTax, cartTotalInc, truncate, clearCart } = useContext(ShoppingCartContext);

    // State
    const { user, isLoading } = useUser();
    const [error, setError] = useState < string | undefined > ();
    const [isPayingViaWidget, setIsPayingViaWidget] = useState < boolean > (false);

    const TABLE_HEAD = ["Image", "Code", "Product", "Price", "Quantity", "Subtotal"];

    // User
    const isNonSSO = user && !user['preferred_username'];

    const buildSOPayload = () => {

        if (!user) throw new Error('User not found. Log in to continue.');

        const TAX_RATE: number = 10;

        const so: SalesOrder = {
            guid: '',
            bsid: '',
            customerBSID: '',
            refNumber: '',
            transDate: '',
            totalInc: 0,
            totalTax: 0,
            lines: []
        }

        const segments = user.sub?.split("|") || [];
        const subKey = segments.pop();

        let username = user ? user['preferred_username'] as string : '';
        username = username?.replace('-s', '');

        let CUSTOMER_BSID = user ? username || user.email || subKey : '';

        // if (viaAPI) {
        //     const nonSsoEmail = localStorage.getItem('nonSsoEmail');

        //     if (nonSsoEmail) {
        //     CUSTOMER_BSID = nonSsoEmail;
        //     }
        // }

        const date = new Date();
        const refNumber = date.getDate() + '' + date.getHours() + '' + date.getMinutes() + '' + date.getSeconds();
        const transDate = date.toISOString();

        so.guid = uuidv4();
        so.bsid = refNumber;
        so.customerBSID = CUSTOMER_BSID || '';
        so.refNumber = refNumber;
        so.transDate = transDate;
        so.lines = cartItems.map((item: InventoryItem, index: number) => {

            const lineSubTotal = truncate(item.price * (item.quantity || 0));
            const lineTax = truncate(lineSubTotal / TAX_RATE);

            return {
                code: `item-${index}-${refNumber}`,
                lineTotalEx: lineSubTotal,
                lineTotalInc: truncate(lineSubTotal + lineTax),
                lineTotalTax: lineTax,
                priceEx: item.price,
                priceInc: truncate(item.price * (1 + (TAX_RATE / 100))),
                quantity: (item.quantity || 0),
                shortDescription: item.name,
                taxRate: TAX_RATE,
            }
        });

        // Calculate so.totalInc by reducing the lineTotalInc of each line
        so.totalEx = truncate(so.lines.reduce((acc, line) => acc + line.lineTotalEx, 0));
        so.totalTax = truncate(so.lines.reduce((acc, line) => acc + line.lineTotalTax, 0));
        so.totalInc = truncate(so.lines.reduce((acc, line) => acc + line.lineTotalInc, 0));

        return so;
    }

    const handleErrorResponse = (response: Response) => {
        switch (response.status) {
            case 401:
                setError('Unauthorized. Invalid or expired M2M Token.');
                break;
            case 403:
                setError('Forbidden');
                break;
            case 404:
                setError('Not Found');
                break;
            case 500:
                setError('Internal Server Error');
                break;
            default:
                setError('Failed to create sales order. Please try again.');
        }
    };

    const onPayViaWidget = async () => {
        try {
            setIsPayingViaWidget(true);
            const so = buildSOPayload();

            const response = await fetch('/api/so', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(so)
            });

            if (!response.ok) {
                handleErrorResponse(response);
                return;
            }

            const soData = await response.json();

            if (!soData) {
                setError('Failed to create sales order. Please try again.');
                return;
            }

            const piblResponse = isNonSSO ?
                await fetch(`/api/so/${soData.bsid}/paybylink`) :
                await fetch(`/api/so/${soData.bsid}/paymentlink?returnUrl=${window.location.origin}/payment-callback/${soData.guid}`);

            if (!response.ok) {
                handleErrorResponse(piblResponse);
                return;
            }

            const piblData = await piblResponse.json();

            if (!piblData) {
                setError('Failed to fetch payment link. Please try again.');
                return;
            }

            // Redirect to the PIBL url in a separate tab
            window.location.replace(piblData.url);

            await new Promise((resolve) => setTimeout(resolve, 2000));
            clearCart();

        } catch (error) {
            console.log(error);
        } finally {
            setIsPayingViaWidget(false);
        }
    }

    return (
        <>
            <Alert open={error != undefined} className="mb-4 text-white bg-primary" onClose={() => setError(undefined)} >{error || ''}</Alert>
            {cartItems.length > 0 ?
                <div className="flex flex-col">
                    <Card className="max-full w-full">
                        <table className="w-full min-w-max table-auto text-left">
                            <thead >
                                <tr>
                                    {TABLE_HEAD.map((head) => (
                                        <th
                                            key={head}
                                            className="border-b border-blue-gray-100 bg-blue-gray-50 p-4"
                                        >
                                            <Typography
                                                variant="small"
                                                color="blue-gray"
                                                className="font-semibold leading-none opacity-70"
                                            >
                                                {head}
                                            </Typography>
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {cartItems.map((item, index) => {
                                    const { name, imageUrl, quantity, id, price } = item;
                                    const isLast = index === cartItems.length - 1;
                                    const classes = isLast ? "p-4" : "p-4 border-b border-blue-gray-50";

                                    return (
                                        <tr key={name}>
                                            <td className={classes}>
                                                <Image className="object-cover object-center" width={75} height={75} alt="product_img" src={imageUrl} />
                                            </td>
                                            <td className={classes}>
                                                <Typography
                                                    variant="small"
                                                    color="blue-gray"
                                                    className="font-normal"
                                                >
                                                    {id}
                                                </Typography>
                                            </td>
                                            <td className={classes}>
                                                <Typography
                                                    variant="small"
                                                    color="blue-gray"
                                                    className="font-normal"
                                                >
                                                    {name}
                                                </Typography>
                                            </td>
                                            <td className={classes}>
                                                <Typography
                                                    as="a"
                                                    href="#"
                                                    variant="small"
                                                    color="blue-gray"
                                                    className="font-medium"
                                                >
                                                    $ {price}
                                                </Typography>
                                            </td>
                                            <td className={classes}>
                                                {/* <QuantityControl item={item} readOnly={pibl != undefined} />                                                                                     */}
                                                <QuantityControl item={item} />
                                            </td>
                                            <td className={classes}>
                                                <Typography
                                                    as="a"
                                                    href="#"
                                                    variant="small"
                                                    color="blue-gray"
                                                    className="font-semibold"
                                                >
                                                    $ {truncate(price * (quantity || 1))}
                                                </Typography>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </Card>

                    <div className="mt-16">
                        <div className="bg-gray-100 px-4 py-6 sm:rounded-lg sm:px-6 lg:grid lg:grid-cols-12 lg:gap-x-8 lg:px-8 lg:py-8">
                            <dl className="grid grid-cols-3 gap-2 text-sm sm:grid-cols-3 md:gap-x-4 lg:col-span-7">
                                <div>
                                    {/* {isViaAPI ? (
                                        <Button
                                            onClick={onPayViaAPI}
                                            disabled={pibl != undefined || isPayingViaAPI || isPayingViaWidget || isPayingViaWidgetNonSSO}
                                            loading={isPayingViaAPI} 
                                            className="w-full bg-[#87189d]" 
                                            data-autoid="btnPayViaAPI">Pay With Capricorn</Button>
                                        ) : ( */}
                                    <Button
                                        onClick={onPayViaWidget}
                                        // disabled={pibl != undefined || isPayingViaWidget || isPayingViaWidgetNonSSO}
                                        disabled={isPayingViaWidget}
                                        loading={isPayingViaWidget}
                                        className="w-full bg-[#87189d]"
                                        data-autoid="btnPayViaWidget">Pay With Capricorn</Button>
                                    {/* )} */}
                                </div>
                                {/* {isNonSSO && <div>
                                    <Button
                                        className="w-full" 
                                        disabled={pibl != undefined || isPayingViaWidgetNonSSO || isPayingViaWidget} 
                                        onClick={() => onPayViaWidget(true)}
                                        loading={isPayingViaWidget}
                                        data-autoid="btnPayViaNonCAP">Pay via Non CAP</Button>
                                </div>} */}
                            </dl>

                            <dl className="mt-8 divide-y divide-gray-200 text-base lg:col-span-5 lg:mt-0 mx-4">
                                <div className="flex items-center justify-between pb-4">
                                    <dt className="text-gray-600">Subtotal</dt>
                                    <dd className="font-medium text-gray-900" data-autoid="lblTotalEx">$ {truncate(cartTotalEx)}</dd>
                                </div>
                                <div className="flex items-center justify-between py-4">
                                    <dt className="text-gray-600">Tax</dt>
                                    <dd className="font-medium text-gray-900" data-autoid="lblTotalTax">$ {truncate(cartTotalTax)}</dd>
                                </div>
                                <div className="flex items-center justify-between pt-4">
                                    <dt className="font-medium text-gray-900">Order total</dt>
                                    <dd className="font-medium text-primary" data-autoid="lblTotalInc">$ {truncate(cartTotalInc)}</dd>
                                </div>
                            </dl>
                        </div>
                    </div>
                </div>
                : (
                    <div className="flex flex-col justify-center items-center gap-y-2 pb-2">
                        <span className="text-4xl">🛒</span>
                        <Typography className="text-lg" color="black">Your cart is empty.</Typography>
                    </div>
                )
            }
        </>

    )
}

export default CartPage