import bannerImage from "../assets/banner.png";

function Banner() {
  return (
    <section className="w-full mt-6">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-10">
        <img
          src={bannerImage}
          alt="Banner"
          className="w-full h-[520px] object-cover object-[78%_center]"
        />
      </div>
    </section>
  );
}

export default Banner;