import { useEffect } from "react";
import { CalendarIcon, Clock, MapPin } from "lucide-react";
import { ItineraryTemplate } from "@/components/ItineraryTemplate";
import { vietnamData } from "@/data/countries/vietnam";

const VietnamDesktopHero = () => {
  const bookingUrl = vietnamData.slug ? `/booking/${vietnamData.slug}` : "#";

  return (
    <section className="hidden w-full px-5 py-5 md:block">
      <div className="mx-auto w-full max-w-[1420px] md:w-[94%] md:px-6 lg:w-[92%] lg:px-12 xl:w-[90%]">
        <div className="mb-3 flex items-start justify-between gap-4">
          <div>
            <h1 className="whitespace-nowrap font-playfair text-2xl font-semibold leading-none lg:text-3xl xl:text-4xl">
              <span className="text-[#0fc2bf]">{vietnamData.desktopTitleKicker}</span>{" "}
              <span className="text-[#0fc2bf]">{vietnamData.title}</span>
            </h1>

            {vietnamData.tags.length > 0 && (
              <div className="mt-3 flex flex-wrap items-center gap-2">
                {vietnamData.tags.map(({ icon: Icon, emoji, label }) => (
                  <span
                    key={label}
                    className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3.5 py-1.5 text-xs font-semibold text-primary lg:text-sm"
                  >
                    {Icon ? (
                      <Icon className="h-4 w-4 text-primary" />
                    ) : (
                      emoji && <span className="text-base">{emoji}</span>
                    )}
                    {label}
                  </span>
                ))}
              </div>
            )}

            <div className="mt-2 flex flex-wrap items-center gap-4 text-lg font-semibold text-slate-800 lg:text-xl">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-[#0fc2bf] lg:h-5 lg:w-5" />
                <span className="font-playfair">{vietnamData.route.join(" - ")}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-[#0fc2bf] lg:h-5 lg:w-5" />
                <span className="font-playfair">{vietnamData.duration}</span>
              </div>
              <div className="flex items-center gap-2">
                <CalendarIcon className="h-4 w-4 text-[#0fc2bf] lg:h-5 lg:w-5" />
                <span className="font-playfair">{vietnamData.startDate}</span>
              </div>
            </div>
          </div>

          <div className="min-w-[220px] pt-1 text-right">
            <p className="text-lg text-slate-700">
              From{" "}
              {vietnamData.priceOriginal && (
                <span className="mr-2 text-lg font-semibold text-slate-500 line-through">
                  {vietnamData.priceOriginal}
                </span>
              )}
              <span className="text-3xl font-extrabold text-slate-900 lg:text-4xl">{vietnamData.price}</span>
            </p>
            {vietnamData.priceNote && (
              <p className="text-xs font-semibold text-slate-600">{vietnamData.priceNote}</p>
            )}
            <a href={bookingUrl} className="inline-flex">
              <button
                type="button"
                className="mt-2 rounded-full bg-[#0fc2bf] px-5 py-2 text-base font-bold text-white transition hover:brightness-95"
              >
                {vietnamData.ctaLabel}
              </button>
            </a>
            <p className="mt-1 text-xs font-medium text-slate-500">Deposit is non-refundable</p>
          </div>
        </div>
      </div>

      <div className="mx-auto w-full overflow-hidden rounded-[24px] md:w-[94%] lg:w-[92%] xl:w-[90%]">
        <div className="grid h-[460px] grid-cols-12 grid-rows-2 gap-1 bg-white lg:h-[500px] xl:h-[530px]">
          <video
            className="col-span-3 row-span-2 h-full w-full object-cover"
            src={vietnamData.desktopHeroVideo}
            poster={vietnamData.desktopHeroPosterImage}
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
          />
          <img
            src={vietnamData.desktopTopMiddleImage}
            alt="Amigas y Más Social group holding their flag"
            className="col-span-5 h-full w-full object-cover"
          />
          <img
            src={vietnamData.desktopTopRightImage}
            alt="Lanterns in Hoi An"
            className="col-span-4 h-full w-full object-cover"
          />
          <img
            src={vietnamData.desktopBottomLeftImage}
            alt="Traditional basket boat experience in Hoi An"
            className="col-span-3 h-full w-full object-cover"
          />
          <img
            src={vietnamData.desktopBottomMiddleImage}
            alt="Sally surrounded by lanterns in Hoi An"
            className="col-span-3 h-full w-full object-cover"
            style={{ objectPosition: vietnamData.desktopBottomMiddleObjectPosition }}
          />
          <img
            src={vietnamData.desktopBottomRightImage}
            alt="Colorful Hoi An street corner during the day"
            className="col-span-3 h-full w-full object-cover"
            style={{ objectPosition: vietnamData.desktopBottomRightObjectPosition }}
          />
        </div>
      </div>
    </section>
  );
};

const VietnamItinerary = () => {
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, []);

  return (
    <ItineraryTemplate
      data={vietnamData}
      hideDesktopHero
      desktopHero={<VietnamDesktopHero />}
    />
  );
};

export default VietnamItinerary;


