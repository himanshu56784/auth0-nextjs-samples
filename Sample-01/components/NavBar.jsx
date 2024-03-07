"use client";

import Link from "next/link";
import Image from "next/image";
import {
  Navbar,
  Typography,
  Badge,
  Avatar,
  Popover,
  PopoverHandler,
  PopoverContent,
  List,
  ListItem,
  ListItemPrefix,
  Button
} from "../components/MaterialTailwind";
import Logo from "../assets/Logo.png";
import { useUser } from '@auth0/nextjs-auth0/client';
import { useContext } from "react";
import { ShoppingCartContext } from "../context/ShoppingCartContext";


export const NavBar = () => {

  const { getTotalItems } = useContext(ShoppingCartContext);

  const { user, isLoading } = useUser();

  const cartIcon = (
    <Link data-autoid='lnkCart' href="cart">
      <span className="text-2xl">🛒</span>
    </Link>
  );

  const LoggedInButton = () => {

    return (
      <Popover placement="bottom-end">
        <PopoverHandler>
          <Button variant="text" data-autoid='btnUserPopover'>
            <div className='flex items-center'>
              <Avatar src={user?.picture || ''} alt={user?.name || ''} />
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
              </svg>
            </div>
          </Button>
        </PopoverHandler>
        <PopoverContent className="min-w-72">
          <List className="p-0">
            <ListItem ripple={false} disabled>
              <ListItemPrefix>
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M2.00299 5.884L9.99999 9.882L17.997 5.884C17.9674 5.37444 17.7441 4.89549 17.3728 4.54523C17.0015 4.19497 16.5104 3.99991 16 4H3.99999C3.48958 3.99991 2.99844 4.19497 2.62717 4.54523C2.2559 4.89549 2.03259 5.37444 2.00299 5.884Z"
                    fill="#90A4AE"
                  />
                  <path
                    d="M18 8.11798L10 12.118L2 8.11798V14C2 14.5304 2.21071 15.0391 2.58579 15.4142C2.96086 15.7893 3.46957 16 4 16H16C16.5304 16 17.0391 15.7893 17.4142 15.4142C17.7893 15.0391 18 14.5304 18 14V8.11798Z"
                    fill="#90A4AE"
                  />
                </svg>
              </ListItemPrefix>
              <Typography variant="h3" className="text-initial font-medium text-blue-gray-500 truncate" data-autoid='txtUserEmail'>
                {user?.email}
              </Typography>
            </ListItem>
            <Link data-autoid='lnkProfile' href='profile' className="text-initial font-medium text-blue-gray-500">
              <ListItem>
                <ListItemPrefix>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </ListItemPrefix>
                Profile
              </ListItem>
            </Link>
            <ListItem>
              <ListItemPrefix>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
                </svg>
              </ListItemPrefix>

              <a
                className="text-initial font-medium text-base text-blue-gray-500 p-0 m-0 hover:no-underline hover:text-blue-gray-900"
                data-autoid='btnLogout'
                href="/api/auth/logout">
                Logout
              </a>
            </ListItem>
          </List>
        </PopoverContent>
      </Popover>
    )
  }



  return (
    <Navbar className="mx-auto max-w-7xl px-4 py-2 lg:px-8 lg:py-4 rounded-none mb-4">
      <div className="container mx-auto flex items-center justify-between text-blue-gray-900">
        <div className="flex">
          <Link
            data-autoid='lnkHome'
            href='/'>
            <Typography className="mr-4 cursor-pointer">
              <Image src={Logo} alt='BRS Automotive' width={60} height={40} />
            </Typography>
          </Link>
          {/* <Link
              data-autoid='lnkViaAPI'
              href='/via-api/cart'
              className="relative">
                <Badge color="primary" content="Via API" withBorder className="absolute top-0 right-0">
                  <img src={Logo} alt='BRS Automotive' className="max-h-10" />
                </Badge>
            </Link> */}
        </div>
        <Typography className="text-2xl">
          {`BRS Automotive`}
        </Typography>
        <div className="flex items-center gap-x-1">
          <Typography
            as="li"
            variant="small"
            color="blue-gray"
            className="flex items-center gap-x-2 p-1 font-medium"
          >
            {getTotalItems() > 0 ?
              <Badge color="primary" content={getTotalItems()} withBorder>
                {cartIcon}
              </Badge> :
              cartIcon
            }
          </Typography>

          {!isLoading && !user && (
            <div>
              <a
                href="/api/auth/login"
                className="text-primary text-sm cursor-pointer hover:underline ml-4"
                tabIndex={0}
                data-autoid="lnkLogIn">
                Log in
              </a>
            </div>
          )}
          {!isLoading && user && (
            <LoggedInButton />
          )}
        </div>
      </div>
    </Navbar>
  );
}
