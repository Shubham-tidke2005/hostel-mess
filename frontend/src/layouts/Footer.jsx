
function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="border-t border-slate-200 bg-white">
            <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 py-5 text-center sm:flex-row sm:px-6 lg:px-8 sm:text-left">
                <p className="text-sm text-[#6C757D]">
                    © {currentYear} HostelMS. All rights reserved.
                </p>

                <p className="text-sm text-[#6C757D]">
                    Hostel & Mess Management System
                </p>
            </div>
        </footer>
    );
}

export default Footer;

