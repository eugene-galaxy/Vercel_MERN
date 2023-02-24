import { useState, useRef, useEffect } from "react";
import AsyncSelect from "react-select/async";
import { RiCloseCircleLine } from "react-icons/ri";
import { FaPlusSquare, FaMinusCircle } from "react-icons/fa";
import { CiHeart, CiLocationOn, CiCirclePlus } from "react-icons/ci";
import FixRequiredSelect from "../components/FixRequiredSelect";
import axios from "axios";
import moment from "moment";
import { IOption } from "../interface/Interface";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const options: IOption[] = [];
  const [origin, setOrigin] = useState<IOption>({ value: "", label: "" }); // origin city
  const [destination, setDestination] = useState<IOption>({
    value: "",
    label: "",
  }); // destination city
  const [intermediateCities, setIntermediateCities] = useState<IOption[]>([]); // intermediate cities
  const [passengers, setPassengers] = useState<number>(0); // passengers
  const [date, setDate] = useState<string>(
    moment(new Date()).format("YYYY-MM-DD")
  ); // date
  const selectRef = useRef<HTMLInputElement>(null); // passenger ref
  const navigate = useNavigate();

  const filterColors = (inputValue: string) => {
    return options.filter((i) =>
      i.label.toLowerCase().includes(inputValue.toLowerCase())
    );
  }; // filter options
  const queryParameters = new URLSearchParams(window.location.search);
  const origin_init = queryParameters.get("origin");
  const destination_init = queryParameters.get("destination");
  const date_init = queryParameters.get("date");
  const passengers_init = queryParameters.get("passengers");
  const intermediateCities_init = queryParameters.get("intermediateCities");
  useEffect(() => {
    if (origin_init)
      setOrigin({
        value: (origin_init || "").toString(),
        label: (origin_init || "").toString(),
      });

    if (destination_init)
      setDestination({
        value: (destination_init || "").toString(),
        label: (destination_init || "").toString(),
      });

    if (passengers_init) setPassengers(parseInt(passengers_init || ""));
    if (date_init) setDate((date_init || "").toString());
    if (intermediateCities_init) {
      setIntermediateCities([]);
      let tmp = (intermediateCities_init || "").toString().split(":");
      for (let i = 0; i < tmp.length; i++) {
        setIntermediateCities((prevCities) => [
          ...prevCities,
          {
            value: (tmp[i] || "").toString(),
            label: (tmp[i] || "").toString(),
          },
        ]);
      }
    }
  }, [
    origin_init,
    destination_init,
    date_init,
    passengers_init,
    intermediateCities_init,
  ]);

  const loadOptions = (inputValue: string, callback: (options) => void) => {
    if (inputValue.length === 1) {
      axios
        .get("/get_cities", {
          params: { key: inputValue },
        })
        .then((res) => {
          options.splice(0, options.length);
          for (let i = 0; i < res.data.cities.length; i++) {
            options.push({
              label: res.data.cities[i].city,
              value: res.data.cities[i].city,
            });
          }
        })
        .catch((err) => {});
    }
    setTimeout(() => {
      callback(filterColors(inputValue));
    }, 1000);
    // return filterColors(inputValue);
  };
  const Select = (props) => {
    return (
      <FixRequiredSelect
        {...props}
        SelectComponent={AsyncSelect}
        options={props.options || options}
        cacheOptions
        loadOptions={loadOptions}
      />
    );
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    let query = "?";
    query += "origin=" + origin.value;
    query += "&destination=" + destination.value;
    query += "&passengers=" + passengers;
    query += "&date=" + date;
    if (intermediateCities.length > 0) {
      query += "&intermediateCities=" + intermediateCities[0].value;
      for (let i = 1; i < intermediateCities.length; i++)
        query += ":" + intermediateCities[i].value;
    }
    navigate({ pathname: "/result", search: query });
  };
  return (
    <div className="h-screen w-screen flex flex-row justify-center items-center max-md:px-[20px]">
      <form
        className="w-[600px] h-fit max-h-[400px] bg-white rounded-2xl p-[30px] overflow-x-auto"
        onSubmit={handleSubmit}
      >
        <div className="w-full flex max-sm:flex-col">
          <div className="flex flex-col w-3/4 max-sm:w-full">
            <div className="mb-[25px]">
              <div className="font-['Inter'] text-lg leading-4 mb-[10px] ml-[45px]">
                City of origin
              </div>
              <div className="flex">
                <div className="flex justify-center items-center mr-[25px] text-[20px] relative max-sm:mr-[15px]">
                  <CiHeart />
                  <img
                    src="assets/dotline.png"
                    className="absolute top-[35px]"
                    alt="linedot"
                  />
                  {/* <span className="text-[40px]">⸽</span> */}
                </div>
                <div className="w-4/5 max-sm:max-w-[90%]">
                  <Select
                    place={origin}
                    setPlace={setOrigin}
                    options={options}
                    isSearchable
                    required
                  />
                </div>
              </div>
            </div>
            {intermediateCities.length > 0 &&
              intermediateCities.map((item, index) => (
                <div className="mb-[25px]" key={index}>
                  <div className="font-['Inter'] text-lg leading-4 mb-[10px] ml-[45px]">
                    City of destination
                  </div>
                  <div className="w-full flex">
                    <div className="flex justify-center items-center mr-[25px] text-[20px] relative max-sm:mr-[15px]">
                      <CiHeart />
                      <img
                        src="assets/dotline.png"
                        className="absolute top-[35px]"
                        alt="linedot"
                      />
                    </div>
                    <div className="w-4/5 max-sm:max-w-[90%]">
                      <Select
                        options={options}
                        isSearchable
                        required
                        place={intermediateCities}
                        setPlace={setIntermediateCities}
                        index={index}
                      />
                    </div>
                    <div className="flex items-center text-[20px] text-[#7786D2] hover:text-green-500 hover:cursor-pointer ml-[5px]">
                      <RiCloseCircleLine
                        onClick={() => {
                          let tmp = [...intermediateCities];
                          tmp.splice(index, 1);
                          setIntermediateCities(tmp);
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            <div className="mb-[20px]">
              <div className="font-['Inter'] text-lg leading-4 mb-[10px] ml-[45px]">
                City of destination
              </div>
              <div className="flex">
                <div className="flex justify-center items-center mr-[25px] text-[20px] relative text-red-600 max-sm:mr-[15px]">
                  <CiLocationOn />
                </div>
                <div className="w-4/5 max-sm:max-w-[90%]">
                  <Select
                    options={options}
                    isSearchable
                    required
                    place={destination}
                    setPlace={setDestination}
                  />
                </div>
              </div>
            </div>
            <div className="flex items-center">
              <div className="flex justify-center items-center mr-[25px] text-[20px] relative max-sm:mr-[15px]">
                <CiCirclePlus />
              </div>
              <div
                className="font-['Inter'] text-lg leading-4 mb-[10px] ml-[5px] text-[#7786D2] hover:text-green-500 hover:cursor-pointer w-fit pt-[10px]"
                onClick={() => {
                  setIntermediateCities((prevCities) => [
                    ...prevCities,
                    { label: "", value: "" },
                  ]);
                }}
              >
                Add destination
              </div>
            </div>
          </div>
          <div className="w-1/4 max-sm:flex max-sm:w-[95%] max-sm:justify-between max-sm:gap-2">
            <div className="mb-[40px] w-full max-sm:mb-[20px] max-sm:w-[50%]">
              <div className="font-['Inter'] text-lg leading-4 mb-[10px]">
                Passengers
              </div>
              <div className="relative">
                <div className="rounded-[6px] border-2 border-[#E5E7EB] border-solid w-full p-[1px] flex justify-between">
                  <div
                    className={
                      passengers
                        ? "text-blue-600 text-[20px] hover:text-green-500 hover:cursor-pointer flex items-center"
                        : "text-[20px] cursor-not-allowed pointer-events-none text-blue-200 flex items-center"
                    }
                    onClick={() => setPassengers((prevState) => prevState - 1)}
                  >
                    <FaMinusCircle />
                  </div>
                  <div>
                    <input
                      value={passengers}
                      readOnly
                      className="w-[10px] pointer-events-none"
                      ref={selectRef}
                    />
                  </div>
                  <div
                    className="text-blue-600 text-[20px] hover:text-green-500 hover:cursor-pointer flex items-center"
                    onClick={() => setPassengers((prevState) => prevState + 1)}
                  >
                    <FaPlusSquare />
                  </div>
                </div>
                <input
                  tabIndex={-1}
                  autoComplete="off"
                  style={{
                    position: "absolute",
                    opacity: 0,
                    top: "30px",
                    width: "100%",
                    height: "1px",
                  }}
                  value={passengers ? passengers : ""}
                  onChange={() => {}}
                  onFocus={() => selectRef.current?.focus()}
                  required
                />
              </div>
            </div>
            <div className="max-md:w-full max-sm:w-[50%]">
              <div className="font-['Inter'] text-lg leading-4 mb-[10px]">
                Date
              </div>
              <div className="rounded-[6px] border-2 border-[#E5E7EB] border-solid w-full ">
                <input
                  type="date"
                  className="w-full"
                  min={moment(new Date()).format("YYYY-MM-DD")}
                  onChange={(e) => setDate(e.target.value)}
                  value={date}
                  required
                />
              </div>
            </div>
          </div>
        </div>
        <div className="w-full flex justify-center max-sm:justify-start">
          <input
            className="p-[8px] bg-[#374151] font-['Inter'] text-md leading-4 w-fit text-white cursor-pointer hover:bg-green-500 max-sm:w-[95%] text-center rounded-md"
            type="submit"
          />
        </div>
      </form>
    </div>
  );
};

export default Home;
