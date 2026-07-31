import { Heart } from "lucide-react";

function Footer() {
    const year = new Date().getFullYear();

    return (
        <footer className="mt-8 border-t border-gray-200 bg-white">
            <div className="mx-auto flex flex-col items-center justify-between gap-4 px-6 py-5 text-sm text-[#6C757D] md:flex-row">

                {/* Left */}
                <div>
                    © {year} HostelMS. All rights reserved.
                </div>

                {/* Center */}
                <div className="flex items-center gap-1">
                    Built with
                    <Heart
                        size={16}
                        className="fill-red-500 text-red-500"
                    />
                    using React & Django
                </div>

                {/* Right */}
                <div>
                    Version 1.0.0
                </div>

            </div>
        </footer>
    );
}

export default Footer;