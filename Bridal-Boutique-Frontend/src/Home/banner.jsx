import bannerImage from "../assets/banner.png";

function Banner() {
  return (
    <section className="pt-[100px] pb-8">

<div className="max-w-[1220px] mx-auto px-0">
        <img
          src={bannerImage}
          alt="Banner"
          className="w-full h-[540px] object-cover object-[80%_center]"
        />

      </div>

    </section>
  );
}

export default Banner;