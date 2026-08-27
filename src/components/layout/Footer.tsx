import Link from "next/link";

export function Footer() {
  return (
    <footer className="footer mt-auto" role="contentinfo">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="md:col-span-1">
            <h3 className="text-xl mb-4">The Meridian</h3>
            <p className="text-sm leading-relaxed opacity-70">
              Quiet luxury in the heart of the city. A place where refined
              elegance meets warm, intuitive service.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-sm mb-4">Explore</h4>
            <div className="flex flex-col gap-2">
              <Link href="/rooms" className="text-sm opacity-60 hover:opacity-100 transition-opacity">
                Rooms & Suites
              </Link>
              <Link href="/dining" className="text-sm opacity-60 hover:opacity-100 transition-opacity">
                Dining
              </Link>
              <Link href="/experiences" className="text-sm opacity-60 hover:opacity-100 transition-opacity">
                Experiences
              </Link>
              <Link href="/wellness" className="text-sm opacity-60 hover:opacity-100 transition-opacity">
                Wellness
              </Link>
            </div>
          </div>

          {/* Information */}
          <div>
            <h4 className="text-sm mb-4">Information</h4>
            <div className="flex flex-col gap-2">
              <Link href="/about" className="text-sm opacity-60 hover:opacity-100 transition-opacity">
                About Us
              </Link>
              <Link href="/contact" className="text-sm opacity-60 hover:opacity-100 transition-opacity">
                Contact
              </Link>
              <Link href="/careers" className="text-sm opacity-60 hover:opacity-100 transition-opacity">
                Careers
              </Link>
              <Link href="/privacy" className="text-sm opacity-60 hover:opacity-100 transition-opacity">
                Privacy Policy
              </Link>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-sm mb-4">Contact</h4>
            <div className="flex flex-col gap-2 text-sm opacity-60">
              <p>123 Meridian Avenue</p>
              <p>New York, NY 10001</p>
              <p className="mt-2">+1 (212) 555-0100</p>
              <p>reservations@themeridian.com</p>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} The Meridian. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
