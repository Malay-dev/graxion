import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import Image from "next/image";

export const FooterSection = () => {
  return (
    <footer id="footer" className="container py-16 sm:py-20">
      <div className="p-8 bg-card border border-secondary rounded-2xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-x-12 gap-y-6">
          {/* Branding */}
          <div className="flex flex-col">
            <Link href="#" className="flex font-bold items-center">
              <Image
                src="/logo.png" // Ensure the logo.png file is in the public folder
                alt="Graxion Logo"
                width={36}
                height={36}
                className="rounded-lg w-9 h-9 mr-2 bg-gradient-to-tr from-[#E2E2E2] to-[#C9D6FF]"
              />
              <h3 className="text-2xl">Graxion</h3>
            </Link>
            <p className="opacity-70 mt-2 text-sm">
              AI-powered assessment grading and instant feedback.
            </p>
          </div>

          {/* Contact & Help */}
          <div className="flex flex-col gap-2">
            <h3 className="font-bold text-lg">Contact</h3>
            <Link href="#" className="opacity-60 hover:opacity-100">
              GitHub
            </Link>
            <Link href="#" className="opacity-60 hover:opacity-100">
              Support
            </Link>
          </div>

          {/* Platforms */}
          <div className="flex flex-col gap-2">
            <h3 className="font-bold text-lg">Platforms</h3>
            <Link href="#" className="opacity-60 hover:opacity-100">
              Web
            </Link>
          </div>
        </div>

        <Separator className="my-6" />
        <section className="text-center text-sm">
          <h3>
            &copy; 2024 Designed and developed by
            <Link
              target="_blank"
              href="https://github.com/leoMirandaa"
              className="text-primary transition-all border-primary hover:border-b-2 ml-1">
              Hackventures
            </Link>
          </h3>
        </section>
      </div>
    </footer>
  );
};
