import { FaGithub, FaLinkedin, FaEnvelope } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-black border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-6 py-12">

        {/* Grid Wrapper */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 items-start text-center md:text-left">

          {/* Left Section */}
          <div className="flex flex-col items-center md:items-start">
            <h2 className="text-2xl font-bold tracking-tight text-white">
              Dev<span className="text-emerald-400">Connect</span>
            </h2>

            <p className="mt-3 text-sm text-slate-400 max-w-sm leading-relaxed">
              DevConnect is a platform built for developers to connect,
              collaborate, and build side projects together. Whether you're
              looking for a co-founder, mentor, or teammate — this is your space.
            </p>
          </div>

          {/* Middle Section - Contact */}
          <div className="flex flex-col items-center md:items-start">
            <h3 className="font-semibold text-lg mb-6 text-white">
              Contact
            </h3>

            <ul className="space-y-3 text-sm text-slate-400">
              <li className="flex items-center gap-3">
                <FaEnvelope className="text-emerald-400" />
                <a
                  href="mailto:maheshgite2811@gmail.com"
                  className="hover:underline hover:text-white"
                >
                  maheshgite2811@gmail.com
                </a>
              </li>
            </ul>
          </div>

          {/* Right Section - Social */}
          <div className="flex flex-col items-center md:items-start">
            <h3 className="font-semibold text-lg mb-3 text-white">
              Connect
            </h3>

            <div className="flex gap-4">
              <a
                href="https://github.com/Mahesh-Gite-28"
                target="_blank"
                rel="noreferrer"
                className="btn btn-ghost btn-circle hover:bg-emerald-500 hover:text-black transition"
              >
                <FaGithub size={20} />
              </a>

              <a
                href="https://www.linkedin.com/in/mahesh-gite"
                target="_blank"
                rel="noreferrer"
                className="btn btn-ghost btn-circle hover:bg-emerald-500 hover:text-black transition"
              >
                <FaLinkedin size={20} />
              </a>
            </div>
          </div>
        </div>

        <div className="divider my-8 border-slate-800"></div>

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-slate-500 text-center md:text-left">
          <p>© {new Date().getFullYear()} DevConnect. All rights reserved.</p>

          <p>
            Built by{" "}
            <span className="font-medium text-white">
              Mahesh Gite
            </span>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
