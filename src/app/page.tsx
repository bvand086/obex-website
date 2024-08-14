import Image from "next/image";

export default function Home() {
  return (
    <main>
      <header className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-4">
          <div className="w-8 h-8 rounded-full overflow-hidden">
            <Image src="/OSlashLogo.png" alt="OBEX Logo" width={32} height={32} />
          </div>
          <nav className="flex gap-4">
            <a href="#" className="hover:underline">
              Discover
            </a>
            <a href="#" className="hover:underline">
              Shop
            </a>
            <a href="#" className="hover:underline">
              About
            </a>
            <a href="#" className="hover:underline">
              More
            </a>
          </nav>
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2 border rounded hover:bg-gray-100">
            Sign Up
          </button>
          <button className="px-4 py-2 text-white bg-black rounded hover:bg-gray-800">
            Learn More
          </button>
        </div>
      </header>

      {/* This is our main section at the top */}
      <section className="flex items-center justify-center h-[700px] bg-fixed" style={{ backgroundImage: "url('/backgroundNATURE.png')", backgroundSize: '150%', backgroundPosition: 'center' }}>
        <div className="max-w-2xl text-center text-white mx-auto">
          <h1 className="mb-4 text-4xl font-bold">
            Experience the Power of OBEX Today
          </h1>
          <p className="mb-4">
            Discover the ultimate solution for all your organizational needs.
          </p>
          <div className="flex items-center justify-center gap-4">
            <button className="px-6 py-2 bg-black text-white rounded hover:bg-gray-800">
              Order
            </button>
            <button className="px-6 py-2 border rounded hover:bg-gray-100">
              Learn More
            </button>
          </div>
        </div>
      </section>

      {/* this is the HERO section */}
      <section className="flex items-center justify-center h-[500px]">
        <div className="container mx-auto flex items-center justify-between gap-4">
          <div className="max-w-2xl text-left text-white">
            <span className="block mb-2 text-sm text-white">Convenient</span>
            <h1 className="mb-4 text-4xl font-bold text-white">
              Experience the Power of OBEX Packets
            </h1>
            <p className="mb-4 text-white">
              OBEX packets are the perfect solution for busy individuals looking
              for a convenient and effective way to stay healthy. With our
              specially formulated packets, you can easily incorporate essential
              nutrients into your daily routine.
            </p>
            <div className="flex items-center gap-4">
              <div>
                <h3 className="font-semibold text-white">Conveniently Packed</h3>
                <p className="text-white">
                  Each OBEX packet contains a powerful blend of vitamins,
                  minerals, and antioxidants.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-white">Effective Results</h3>
                <p className="text-white">
                  Experience the benefits of OBEX packets and boost your overall
                  well-being.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4 mt-4">
              <button className="px-6 py-2 border rounded hover:bg-gray-100 text-white">
                Learn More
              </button>
              <button className="px-6 py-2 bg-black text-white rounded hover:bg-gray-800">
                Order Now
              </button>
            </div>
          </div>
          <div className="w-1/2 h-[300px]">
            <Image src="/seaweed.png" alt="Seaweed" width={300} height={300} className="w-full h-full object-cover" />
          </div>
        </div>
      </section>

{/* customer reactions to product */}
      <section className="flex items-center justify-center h-[500px] text-white">
        <div className="container mx-auto flex items-center justify-between gap-4">
          <div className="w-1/2 bg-gray-300 h-[300px] flex justify-center items-center">
            <button className="bg-gray-400 p-4 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                <path fillRule="evenodd" d="M4.5 3.75a3.75 3.75 0 00-3.75 3.75v9a3.75 3.75 0 003.75 3.75h15a3.75 3.75 0 003.75-3.75v-9a3.75 3.75 0 00-3.75-3.75h-15zm7.86 5.22a.75.75 0 01.14 1.06l-2.12 2.12 2.12 2.12a.75.75 0 01-1.06 1.06L8.43 12.94l-2.12 2.12a.75.75 0 11-1.06-1.06l2.12-2.12L7.37 9.97a.75.75 0 011.06-1.06l2.12 2.12 2.12-2.12a.75.75 0 011.06-.14zM9.97 6.75h6.28a1.5 1.5 0 100-3H9.97a1.5 1.5 0 100 3z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
          <div className="max-w-2xl text-left">
            <span className="block mb-2 text-sm">Effective</span>
            <h1 className="mb-4 text-4xl font-bold">
              Proven Results That Customers Love
            </h1>
            <p className="mb-4">
              Our product has been shown to deliver outstanding results, leaving our
              customers satisfied and happy. Try it today and experience the difference
              for yourself.
            </p>
            <div className="flex items-center gap-4">
              <div className="w-1/2">
                <h3 className="font-semibold">50% Off</h3>
                <p>
                  Limited time offer: Get 50% off your first purchase.
                </p>
              </div>
              <div className="w-1/2">
                <h3 className="font-semibold">50% More</h3>
                <p>
                  Get 50% more product for the same price.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4 mt-4">
              <button className="px-6 py-2 border rounded hover:bg-gray-100">
                Learn More
              </button>
              <button className="px-6 py-2 border rounded hover:bg-gray-100">
                Sign Up
              </button>
            </div>
          </div>
        </div>
      </section>

{/* features list */}
      <section className="w-full max-w-5xl p-4 mx-auto">
        <div className="flex flex-col items-center text-center">
          <h2 className="text-3xl font-bold">Features List Section</h2>
          <p>Detail the four ordering options: Small Pack, Large Pack, 6 Month Subscription, 12 Month Subscription.</p>
        </div>
      </section>

{/* About the product */}
      <section className="w-full max-w-5xl p-4 mx-auto">
        <div className="flex flex-col items-center text-center">
          <h2 className="text-3xl font-bold">Stats Section</h2>
          <p>Display statistics to validate OBEX's efficacy and customer satisfaction.</p>
        </div>
      </section>

{/* CTA Section */}
      <section className="w-full max-w-5xl p-4 mx-auto">
        <div className="flex flex-col items-center text-center">
          <h2 className="text-3xl font-bold">CTA Section</h2>
          <p>Final call-to-action encouraging visitors to make a purchase decision and choose their preferred ordering option.</p>
        </div>
      </section>

{/* footer */}
      <footer className="w-full p-4 border-t border-gray-300 bg-gray-100 dark:bg-gray-800">
        <p className="text-center">Footer</p>
      </footer>
      </main>
  );
}

