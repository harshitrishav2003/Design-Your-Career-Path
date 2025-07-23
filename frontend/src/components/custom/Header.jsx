import React, { useContext } from 'react';
import { Button } from '../ui/button';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

function Header() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const isSignedIn = !!user;

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/auth/sign-in');
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  return (
    <div className="p-3 px-5 flex justify-between items-center shadow-md">
      <Link to="/" className="text-xl font-bold text-primary cursor-pointer">
        Design Your Career Path
      </Link>

      {isSignedIn ? (
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Avatar className="w-8 h-8 cursor-pointer">
                <AvatarImage src={user?.avatarUrl || "https://github.com/shadcn.png"} alt="Profile" />
                <AvatarFallback>{user?.fullName?.[0] || 'U'}</AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>

            <DropdownMenuContent className="w-40 mr-3 mt-2" align="middle">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuGroup>
                <DropdownMenuItem onClick={() => navigate('/dashboard')}>
                  Dashboard
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ) : (
        <div className="flex items-center gap-5">
          <Link
            to="/about-us"
            className="text-sm text-primary hover:text-primary/80 font-medium transition-colors"
          >
            About Us
          </Link>
          <Link to="/auth/sign-in">
            <Button
              className="text-xs bg-primary text-white inline-flex items-center gap-2 rounded-full px-8 py-3 text-sm font-medium shadow hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
              size="sm"
            >
              Login
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}

export default Header;
