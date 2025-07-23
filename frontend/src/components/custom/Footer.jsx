import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="w-full border-t bg-background">
      <div className="container mx-auto px-4 md:px-6 2xl:max-w-[1400px] flex flex-col items-center justify-between gap-4 py-8 md:h-24 md:flex-row">
        <div className="flex flex-col items-center gap-2 px-4 md:flex-row md:gap-2 md:px-0">
          <footer className="text-center md:text-left py-4">
            <p className="text-sm text-muted-foreground">
              Designed, built, and maintained with ❤️ by{" "}
              <span className="font-semibold text-primary">Harshit Rishav</span>{" "}
              — empowering your career growth.
            </p>
          </footer>
        </div>
        <div className="flex flex-col items-center gap-4 md:flex-row md:gap-6">
          <nav className="flex gap-4 md:gap-6">
            <Link
              to="/about-us"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
            >
              About Us
            </Link>
            <Link
              to="/contact"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
            >
              Contact
            </Link>
          </nav>
          <p className="text-center text-sm text-muted-foreground md:text-left">
            &copy; {new Date().getFullYear()} Design Your Career Path. All
            rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
