function App() {
  return (
    <>
      <div className="navbar bg-base-300 px-4">
        <div className="flex flex-row justify-between w-full items-center">
          {/* Left Side: DevTinder */}
          <a className="btn btn-ghost text-xl font-bold">DevTinder</a>

          {/* Right Side: Avatar */}
          <div className="avatar">
            <div className="w-10 rounded-full">
              <img src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
