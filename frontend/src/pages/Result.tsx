import { useEffect, useState } from "react";
import { CiHeart, CiLocationOn } from "react-icons/ci";
import { Label } from "semantic-ui-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ITravelInfo } from "../interface/Interface";

const Result = () => {
  const [result, setResult] = useState<ITravelInfo>();
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();
  const queryParameters = new URLSearchParams(window.location.search);
  const origin_init = queryParameters.get("origin"); // origin city
  const destination_init = queryParameters.get("destination"); // destination city
  const date_init = queryParameters.get("date"); // travel date
  const passengers_init = queryParameters.get("passengers"); // passengers count
  const intermediateCities_init = queryParameters.get("intermediateCities"); // intermidate cities
  useEffect(() => {
    axios
      .post("/get_result", {
        origin: origin_init,
        destination: destination_init,
        intermediateCities: intermediateCities_init?.split(":"),
        passengers: passengers_init,
        date: date_init,
      })
      .then((res) => {
        setResult(res.data);
        setLoading(false);
      })
      .catch((err) => console.log(err));
  }, [
    origin_init,
    destination_init,
    date_init,
    passengers_init,
    intermediateCities_init,
  ]);

  return (
    <div className="w-screen h-screen flex flex-row justify-center items-center max-md:px-[10px]">
      {!loading ? (
        <div className="w-[600px] h-fit max-h-[400px] bg-white rounded-2xl p-[30px] overflow-x-auto">
          <div className="w-full mb-[20px]">
            <div className="flex justify-center items-center mr-[25px] text-[20px] relative mb-[37px]">
              <div className="relative">
                <CiHeart />
                <div
                  className={
                    !result?.errors[0]
                      ? "font-['Inter'] text-[18px] leading-4 absolute left-[35px] top-[0px] w-max"
                      : "font-['Inter'] text-[18px] leading-4 absolute left-[35px] top-[0px] text-red-600 w-max font-bold"
                  }
                >
                  {!result?.errors[0]
                    ? result?.origin
                    : result?.origin + " - Not found"}
                </div>
                <div
                  className={
                    !result?.errors[0] && !result?.errors[1]
                      ? "absolute left-[-95px]"
                      : "absolute left-[-66px]"
                  }
                >
                  <Label
                    basic
                    color={
                      !result?.errors[0] && !result?.errors[1]
                        ? "purple"
                        : "red"
                    }
                    size="medium"
                    pointing="right"
                  >
                    {!result?.errors[0] && !result?.errors[1]
                      ? result?.distance[0] + "km"
                      : "error"}
                  </Label>
                </div>
              </div>
              <img
                src="assets/short-dotline.png"
                className="absolute top-[25px]"
                alt="linedot"
              />
            </div>
            {result?.intermediateCities &&
              result?.intermediateCities.map((item, index) => (
                <div
                  className="flex justify-center items-center mr-[25px] text-[20px] relative mb-[37px]"
                  key={index}
                >
                  <div className="relative">
                    <CiHeart />
                    <div
                      className={
                        !result?.errors[index + 1]
                          ? "font-['Inter'] text-[18px] leading-4 absolute left-[35px] top-[0px] w-max"
                          : "font-['Inter'] text-[18px] leading-4 absolute left-[35px] top-[0px] text-red-600 w-max font-bold"
                      }
                    >
                      {!result?.errors[index + 1]
                        ? item
                        : item + " - Not found"}
                    </div>
                    <div
                      className={
                        !result?.errors[index + 1] && !result?.errors[index + 2]
                          ? "absolute left-[-95px]"
                          : "absolute left-[-66px]"
                      }
                    >
                      <Label
                        basic
                        color={
                          !result?.errors[index + 1] &&
                          !result?.errors[index + 2]
                            ? "purple"
                            : "red"
                        }
                        size="medium"
                        pointing="right"
                      >
                        {!result.errors[index + 1] && !result.errors[index + 2]
                          ? result?.distance[index + 1] + "km"
                          : "error"}
                      </Label>
                    </div>
                  </div>
                  <img
                    src="assets/short-dotline.png"
                    className="absolute top-[25px]"
                    alt="linedot"
                  />
                </div>
              ))}
            <div className="flex justify-center items-center mr-[25px] text-[20px] relative">
              <div className="relative">
                <CiLocationOn className="text-red-600" />
                <div
                  className={
                    !result?.errors[result?.errors.length - 1]
                      ? "font-['Inter'] text-[18px] leading-4 absolute left-[35px] top-[0px] w-max"
                      : "font-['Inter'] text-[18px] leading-4 absolute left-[35px] top-[0px] text-red-600 w-max font-bold"
                  }
                >
                  {!result?.errors[result?.errors.length - 1]
                    ? result?.destination
                    : result?.destination + " - Not found"}
                </div>
                <div className="font-['Inter'] text-[18px] leading-4 absolute left-[35px] top-[0px]"></div>
              </div>
            </div>
          </div>
          <div className="w-full flex flex-col justify-center">
            <div className="font-['Inter'] text-[18px] leading-4 text-center font-medium mb-[15px]">
              <strong className="text-[#7786D2] mr-[5px]">
                {result?.distance[result?.distance.length - 1]}
              </strong>{" "}
              km is total distance
            </div>
            <div className="font-['Inter'] text-[18px] leading-4 text-center font-medium mb-[15px]">
              <strong className="text-[#7786D2] mr-[5px]">
                {result?.passengers.toString()}
              </strong>
              passengers
            </div>
            <div className="font-['Inter'] text-[18px] leading-4 text-center font-medium mb-[25px]">
              <strong className="text-[#7786D2] mr-[5px]">
                {result?.date}
              </strong>
            </div>
          </div>
          <div className="w-full flex flex-col justify-center items-center">
            <div
              className="p-[8px] bg-[#374151] font-['Inter'] text-md leading-4 w-fit text-white cursor-pointer hover:bg-green-500 max-sm:w-[95%] text-center rounded-md"
              onClick={() => {
                if (window.location.href.indexOf("?") < 0)
                  navigate({ pathname: "/" });
                else
                  navigate({
                    pathname: "/",
                    search: window.location.href.slice(
                      window.location.href.indexOf("?")
                    ),
                  });
              }}
            >
              Back
            </div>
          </div>
        </div>
      ) : (
        <img
          src="/assets/loading.gif"
          className="w-[50px] h-[50px]"
          alt="gif"
        />
      )}
    </div>
  );
};
export default Result;
