const Footer = () => {
  return (
    <div className="bg-blue-800 py-10">
      <div className="container mx-auto flex flex-row justify-between items-center">
        <span className="text-white text-3xl font-bold tracking-tight">
          Booking.com
        </span>
        <span className="text-white font-bold tracking-tight flex gap-4">
          <p className="curson-pointer">Privacy Policy</p>
          <p className="curson-pointer">Terms of Service</p>
        </span>
      </div>
    </div>
  );
};
export default Footer;
